(() => {
  const C = window.CONFIG, APPS = window.APPS;
  const $ = (s) => document.querySelector(s);
  const wait = (ms) => new Promise((r) => setTimeout(r, ms / (C.bootSpeed || 1)));
  const unlocked = new Set(APPS.filter((a) => !a.locked).map((a) => a.id));

  function show(id) {
    document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
    $("#screen-" + id).classList.add("active");
  }

  // ---------- Ligar ----------
  $("#power-btn").onclick = () => {
    if (C.fullscreenOnStart && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
    boot();
  };

  // ---------- Boot ----------
  async function boot() {
    show("boot");
    const log = $("#boot-log");
    log.textContent = "";
    const lines = [
      "JIGSAW BIOS v6.6.6  (C) Corporação John Kramer",
      "",
      "CPU: Processador de Escolhas @ 3.60GHz",
      "Memória: 16384MB OK",
      "Detectando unidades.......... OK",
      "Verificando integridade do sujeito.......... FALHA",
      "Carregando regras do jogo.......... OK",
      "Iniciando câmeras de vigilância.......... OK",
      "Trancando portas.......... OK",
      "",
      "Iniciando JIGSAW OS..."
    ];
    for (const l of lines) {
      log.textContent += l + "\n";
      await wait(l.includes("....") ? 450 : 160);
    }
    await wait(900);
    showLogin();
  }

  // ---------- Login ----------
  let errors = 0;
  function showLogin() {
    show("login");
    $("#login-user").textContent = C.userName;
    $("#login-pass").value = "";
    $("#login-msg").textContent = "";
    $("#hint-text").textContent = "";
    $("#hint-btn").style.visibility = errors >= C.maxHintAttempts ? "visible" : "hidden";
    setTimeout(() => $("#login-pass").focus(), 50);
  }

  const taunts = [
    "Senha incorreta.",
    "Errado. Pense melhor.",
    "Cada erro tem um preço.",
    "Você não está prestando atenção.",
    "Tic... tac..."
  ];

  $("#login-form").onsubmit = (e) => {
    e.preventDefault();
    const val = $("#login-pass").value.trim().toUpperCase();
    if (val === String(C.password).toUpperCase()) {
      $("#login-msg").textContent = "Bem-vindo.";
      $("#login-msg").className = "ok";
      setTimeout(enterDesktop, 900);
      return;
    }
    errors++;
    $("#login-msg").className = "err";
    $("#login-msg").textContent = taunts[Math.min(errors - 1, taunts.length - 1)];
    $("#login-pass").value = "";
    const box = $(".login-box");
    box.classList.remove("shake"); void box.offsetWidth; box.classList.add("shake");
    if (errors >= C.maxHintAttempts) $("#hint-btn").style.visibility = "visible";
  };
  $("#hint-btn").onclick = () => ($("#hint-text").textContent = "Dica: " + C.hint);

  // ---------- Desktop ----------
  let desktopReady = false, timerEnd = null, timerId = null;

  function enterDesktop() {
    show("desktop");
    if (!desktopReady) {
      buildDesktop();
      desktopReady = true;
    }
    if (C.timerMinutes > 0 && !timerEnd) {
      timerEnd = Date.now() + C.timerMinutes * 60000;
      timerId = setInterval(tickTimer, 250);
      tickTimer();
    }
  }

  function buildDesktop() {
    $("#start-user").textContent = "☠ " + C.userName;
    const icons = $("#icons"), menu = $("#start-apps");
    APPS.forEach((app) => {
      const ic = document.createElement("div");
      ic.className = "icon";
      ic.dataset.id = app.id;
      ic.innerHTML = `<span class="ico">${app.icon}</span><span class="lbl">${app.title}</span>`;
      ic.onclick = () => { document.querySelectorAll(".icon").forEach((i) => i.classList.remove("sel")); ic.classList.add("sel"); };
      ic.ondblclick = () => openApp(app.id);
      // toque: abre com um toque
      ic.addEventListener("touchend", (e) => { e.preventDefault(); openApp(app.id); });
      icons.appendChild(ic);

      const mi = document.createElement("button");
      mi.innerHTML = `${app.icon} ${app.title}`;
      mi.onclick = () => { toggleStart(false); openApp(app.id); };
      menu.appendChild(mi);
    });
    refreshLocks();
    $("#start-btn").onclick = (e) => { e.stopPropagation(); toggleStart(); };
    $("#desktop").addEventListener("mousedown", () => toggleStart(false));
    $("#lock-btn").onclick = () => { toggleStart(false); showLogin(); };
    setInterval(tickClock, 1000); tickClock();
  }

  function refreshLocks() {
    document.querySelectorAll(".icon").forEach((i) => i.classList.toggle("locked", !unlocked.has(i.dataset.id)));
  }

  function toggleStart(force) {
    $("#start-menu").classList.toggle("hidden", force === undefined ? undefined : !force);
  }

  function tickClock() {
    const t = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    $("#clock").textContent = t;
    $("#login-clock").textContent = t;
  }

  function tickTimer() {
    const left = Math.max(0, timerEnd - Date.now());
    const m = Math.floor(left / 60000), s = Math.floor((left % 60000) / 1000);
    const el = $("#timer");
    el.textContent = `⏳ ${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    el.classList.toggle("danger", left < 5 * 60000);
    if (left === 0) {
      clearInterval(timerId);
      gameOver();
    }
  }

  function gameOver() {
    const o = document.createElement("div");
    o.id = "gameover";
    o.textContent = C.timerEndMessage;
    document.body.appendChild(o);
  }

  // ---------- Janelas ----------
  const wins = {};
  let z = 10, offset = 0;

  const api = (id) => ({
    close: () => closeWin(id),
    unlock: (appId) => { unlocked.add(appId); refreshLocks(); },
    notify
  });

  function openApp(id) {
    const app = APPS.find((a) => a.id === id);
    if (!app) return;
    if (wins[id]) { wins[id].el.classList.remove("min"); focus(id); return; }

    const w = document.createElement("div");
    w.className = "window";
    const W = Math.min(app.width || 480, innerWidth - 20), H = Math.min(app.height || 340, innerHeight - 60);
    Object.assign(w.style, {
      width: W + "px", height: H + "px",
      left: Math.max(10, (innerWidth - W) / 2 + offset) + "px",
      top: Math.max(10, (innerHeight - 40 - H) / 2 + offset) + "px"
    });
    offset = (offset + 24) % 120;
    w.innerHTML = `
      <div class="titlebar"><span class="t">${app.icon} ${app.title}</span>
        <span class="btns"><button class="b-min">–</button><button class="b-max">□</button><button class="b-close">✕</button></span>
      </div>
      <div class="content"></div>`;
    $("#windows").appendChild(w);

    const content = w.querySelector(".content");
    if (!unlocked.has(id)) {
      w.classList.add("denied");
      content.innerHTML = `<div class="center denied-msg">⛔<br>ACESSO NEGADO<br><small>Este arquivo ainda não está disponível para você.</small></div>`;
    } else {
      app.render(content, api(id));
    }

    const tb = document.createElement("button");
    tb.className = "task";
    tb.textContent = `${app.icon} ${app.title}`;
    tb.onclick = () => {
      const win = wins[id];
      if (win.el.classList.contains("min")) { win.el.classList.remove("min"); focus(id); }
      else if (win.el.style.zIndex == z) win.el.classList.add("min");
      else focus(id);
    };
    $("#task-items").appendChild(tb);

    wins[id] = { el: w, tb };
    w.addEventListener("mousedown", () => focus(id));
    w.querySelector(".b-close").onclick = () => closeWin(id);
    w.querySelector(".b-min").onclick = (e) => { e.stopPropagation(); w.classList.add("min"); };
    w.querySelector(".b-max").onclick = () => w.classList.toggle("max");
    w.querySelector(".titlebar").ondblclick = () => w.classList.toggle("max");
    drag(w);
    focus(id);
  }

  function focus(id) {
    Object.values(wins).forEach((w) => w.tb.classList.remove("active"));
    wins[id].el.style.zIndex = ++z;
    wins[id].tb.classList.add("active");
  }

  function closeWin(id) {
    const w = wins[id];
    if (!w) return;
    w.el.remove(); w.tb.remove();
    delete wins[id];
  }

  function drag(w) {
    const bar = w.querySelector(".titlebar");
    bar.addEventListener("pointerdown", (e) => {
      if (e.target.closest("button") || w.classList.contains("max")) return;
      const sx = e.clientX - w.offsetLeft, sy = e.clientY - w.offsetTop;
      const move = (ev) => {
        w.style.left = Math.min(innerWidth - 60, Math.max(-w.offsetWidth + 80, ev.clientX - sx)) + "px";
        w.style.top = Math.min(innerHeight - 70, Math.max(0, ev.clientY - sy)) + "px";
      };
      const up = () => { removeEventListener("pointermove", move); removeEventListener("pointerup", up); };
      addEventListener("pointermove", move);
      addEventListener("pointerup", up);
    });
  }

  function notify(text) {
    const n = document.createElement("div");
    n.className = "toast";
    n.textContent = text;
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 4000);
  }

  // ---------- Atalho do mestre do jogo ----------
  addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "x") location.reload();
  });
  // Bloqueia o menu de contexto do navegador
  addEventListener("contextmenu", (e) => e.preventDefault());

  // Expõe API para minigames
  window.OS = { openApp, closeWin, notify, unlock: (id) => api().unlock(id) };
})();
