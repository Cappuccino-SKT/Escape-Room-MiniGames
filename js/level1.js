// ===== NÍVEL 1 =====
// Fase 1: todo app pede ADMINISTRADOR → aparece "cadastro_adm" → jogador cria usuário.
// Fase 2: alerta do hacker → aparece "gerenciador_usuarios" → excluir o hacker em X minutos.
// Fase 3: aparece "bios_setup" → reconectar os componentes no labirinto de paredes ocultas.
(() => {
  const C = window.CONFIG;
  const LEVELS = [
    { id: "Espectador",    icon: "👁", desc: "Apenas visualizar arquivos" },
    { id: "Editor",        icon: "✏️", desc: "Visualizar e editar arquivos" },
    { id: "Administrador", icon: "🛡️", desc: "Controle total do sistema" }
  ];
  const S = { phase: 1, user: null, deleted: new Set(), timerEnd: 0, timerId: null, playerPos: 0 };
  const isAdmin = () => S.user && S.user.level === "Administrador";

  // ---------- Senha de administrador (repete até acertar ou cancelar) ----------
  async function askAdminPassword() {
    let msg = "";
    for (;;) {
      const v = await OS.dialog({
        title: "Permissão de administrador", icon: "🛡️", input: true, msg,
        text: "Para conceder o nível <b>ADMINISTRADOR</b> é necessária a senha de permissão.",
        buttons: [{ label: "Cancelar" }, { label: "Confirmar", primary: true }]
      });
      if (v === null) return false;
      if (v.toUpperCase() === String(C.adminPassword).toUpperCase()) return true;
      OS.play("loginError");
      msg = "Senha de permissão incorreta.";
    }
  }

  // ---------- Regras de abertura dos apps ----------
  let shownCadastro = false;
  window.GATE = (app) => {
    if (app.id === "cadastro") return true;
    if (app.id === "gerenciador") { gateManager(); return false; }
    if (S.phase >= 3 && isAdmin()) return true;

    if (S.phase === 2) {
      OS.dialog({ type: "danger", icon: "☠", title: "Sistema comprometido",
        text: "Um <b>intruso</b> está ativo no sistema.<br>Remova-o pelo <b>Gerenciador de Usuários</b> antes que ele remova você." });
    } else {
      OS.dialog({ type: "danger", icon: "⛔", title: "Acesso negado",
        text: "Este aplicativo exige um usuário com nível <b>ADMINISTRADOR</b>.<br><br>Torne-se um administrador para continuar." })
        .then(() => {
          if (shownCadastro) return;
          shownCadastro = true;
          OS.showIcon("cadastro");
          OS.notify("📥 Novo aplicativo instalado: cadastro_adm");
        });
    }
    return false;
  };

  // Gerenciador: exige usuário e nível de administrador
  let opening = false;
  async function gateManager() {
    if (opening) return;
    opening = true;
    try {
      if (!S.user) {
        await OS.dialog({ type: "danger", icon: "👤", title: "Gerenciador de usuários",
          text: "Nenhum usuário ativo.<br>Crie seu usuário no <b>cadastro_adm</b>." });
        return;
      }
      if (!isAdmin()) {
        await OS.dialog({ type: "danger", icon: "⛔", title: "Gerenciador de usuários",
          text: `Seu usuário <b>${esc(S.user.name)}</b> não possui nível de <b>ADMINISTRADOR</b>.` });
        await OS.dialog({ icon: "🛡️", title: "Gerenciador de usuários", text: "Você quer se tornar administrador?",
          buttons: [{ label: "Não", dead: true }, { label: "Sim", primary: true, value: true }] });
        if (!(await askAdminPassword())) return;
        S.user.level = "Administrador";
        OS.notify(`🛡️ ${S.user.name} agora é ADMINISTRADOR`);
      }
      const g = window.GATE; window.GATE = null;
      OS.openApp("gerenciador");
      window.GATE = g;
    } finally { opening = false; }
  }

  // ---------- Cronômetro do hacker ----------
  function startHackerTimer() {
    clearInterval(S.timerId);
    S.timerEnd = Date.now() + C.hackerMinutes * 60000;
    S.timerId = setInterval(tick, 250);
    tick();
  }
  function stopHackerTimer() {
    clearInterval(S.timerId);
    const t = document.querySelector("#timer");
    t.textContent = ""; t.classList.remove("danger");
  }
  function tick() {
    const left = Math.max(0, S.timerEnd - Date.now());
    const m = Math.floor(left / 60000), s = Math.floor((left % 60000) / 1000);
    const txt = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    const t = document.querySelector("#timer");
    t.textContent = `☠ Exclusão do seu usuário em ${txt}`;
    t.classList.toggle("danger", left < 60000);
    document.querySelectorAll(".um-timer").forEach((e) => (e.textContent = txt));
    if (left === 0) { stopHackerTimer(); userDeleted("hacker"); }
  }

  async function userDeleted(by) {
    S.user = null;
    OS.closeWin("gerenciador");
    OS.closeWin("cadastro");
    OS.play("scare");
    await OS.dialog({ type: "danger", icon: "💀", title: "Usuário excluído",
      text: by === "hacker"
        ? "O tempo acabou. O intruso <b>excluiu seu usuário</b>.<br><br>Seu usuário não existe mais. Você terá que criá-lo de novo no <b>cadastro_adm</b>."
        : "Você <b>excluiu o seu próprio usuário</b>.<br><br>Ele não existe mais. Você terá que criá-lo de novo no <b>cadastro_adm</b>." });
  }

  // ---------- Usuário criado ----------
  async function userCreated() {
    if (S.phase === 1) {
      await sleep(1500);
      await OS.dialog({ type: "danger", icon: "👁", title: "ALERTA DE SEGURANÇA",
        text: "Um usuário descobriu a sua existência e está tomando medidas para <b>excluir o seu usuário</b>.<br><br>" +
              `Exclua o usuário dele antes que ele exclua o seu.<br>Você tem <b>${C.hackerMinutes} minutos</b>.`,
        buttons: [{ label: "Entendido", primary: true }] });
      S.phase = 2;
      OS.showIcon("gerenciador");
      OS.notify("📥 Novo aplicativo instalado: gerenciador_usuarios");
      startHackerTimer();
    } else if (S.phase === 2) {
      await sleep(800);
      await OS.dialog({ type: "danger", icon: "👁", title: "ALERTA DE SEGURANÇA",
        text: `O intruso ainda está no sistema e vai excluir você de novo.<br>Você tem <b>${C.hackerMinutes} minutos</b>.` });
      startHackerTimer();
    }
  }

  // ---------- App: cadastro_adm ----------
  function Cadastro(el, api) {
    if (S.user) {
      el.innerHTML = `<div class="ca"><div class="ca-done">✔<h3>Usuário ativo</h3>
        <p><b>${esc(S.user.name)}</b> — nível ${S.user.level}</p></div></div>`;
      return;
    }
    el.innerHTML = `
      <form class="ca">
        <h3>👤 Cadastro de usuário</h3>
        <div class="ca-step s1">
          <label>Nome de usuário</label>
          <input class="ca-name" maxlength="20" placeholder="ex.: jogador1" autocomplete="off">
          <button class="primary">Próximo ➜</button>
        </div>
        <div class="ca-step s2 hidden">
          <label>Nível de acesso de <b class="ca-who"></b></label>
          ${LEVELS.map((l) => `
            <label class="ca-level"><input type="radio" name="lvl" value="${l.id}">
              <span class="ca-ico">${l.icon}</span><span><b>${l.id}</b><small>${l.desc}</small></span></label>`).join("")}
          <button class="primary">Criar usuário</button>
        </div>
        <p class="ca-msg"></p>
      </form>`;
    const f = el.querySelector("form"), msg = el.querySelector(".ca-msg");
    const name = el.querySelector(".ca-name");
    setTimeout(() => name.focus(), 50);
    let step = 1;

    f.onsubmit = async (e) => {
      e.preventDefault();
      msg.textContent = "";
      if (step === 1) {
        const n = name.value.trim();
        if (n.length < 3) return (msg.textContent = "O nome precisa ter pelo menos 3 caracteres.");
        if (C.users.some((u) => u.name.toLowerCase() === n.toLowerCase())) return (msg.textContent = "Este nome de usuário já existe.");
        el.querySelector(".ca-who").textContent = n;
        el.querySelector(".s1").classList.add("hidden");
        el.querySelector(".s2").classList.remove("hidden");
        step = 2;
        return;
      }
      const lvl = el.querySelector("input[name=lvl]:checked");
      if (!lvl) return (msg.textContent = "Escolha um nível de acesso.");
      if (lvl.value === "Administrador" && !(await askAdminPassword())) return;

      f.querySelectorAll("button, input").forEach((b) => (b.disabled = true));
      msg.className = "ca-msg ok";
      for (const t of ["Criando usuário...", "Configurando permissões...", "Usuário criado com sucesso!"]) {
        msg.textContent = t; await sleep(700);
      }
      S.user = { name: name.value.trim(), level: lvl.value, self: true };
      S.playerPos = Math.floor(Math.random() * (C.users.length + 1));
      OS.notify(`✔ Usuário ${S.user.name} criado (${S.user.level})`);
      await sleep(600);
      api.close();
      userCreated();
    };
  }

  // ---------- App: gerenciador_usuarios ----------
  function Gerenciador(el, api) {
    el.innerHTML = `
      <div class="um">
        <div class="um-head"><span>👥 Usuários do sistema</span>
          <span class="um-alert">⚠ Seu usuário será excluído em <b class="um-timer">--:--</b></span></div>
        <div class="um-list"></div>
      </div>`;
    const list = el.querySelector(".um-list");
    tick();

    function render() {
      const rows = C.users.filter((u) => !S.deleted.has(u.name));
      if (S.user) rows.splice(Math.min(S.playerPos, rows.length), 0, S.user);
      list.innerHTML = `<table><tr><th>Usuário</th><th>Nível</th><th>Último acesso</th><th></th></tr>
        ${rows.map((u, i) => `<tr data-i="${i}"><td>👤 ${esc(u.name)}</td><td>${u.level}</td><td>${u.self ? "agora" : u.last}</td>
          <td><button class="um-del">🗑 Excluir</button></td></tr>`).join("")}</table>`;
      list.querySelectorAll(".um-del").forEach((b) => (b.onclick = () => del(rows[b.closest("tr").dataset.i], b.closest("tr"))));
    }

    let busy = false;
    async function del(u, tr) {
      if (busy) return;
      if (u.self) {
        const ok = await OS.dialog({ icon: "❓", title: "Excluir usuário", text: "Você quer mesmo apagar você próprio?",
          buttons: [{ label: "Não", value: false }, { label: "Sim", primary: true, value: true }] });
        if (!ok) return;
        stopHackerTimer();
        return userDeleted("self");
      }
      busy = true;
      tr.classList.add("deleting");
      tr.querySelector("button").textContent = "Excluindo...";
      await sleep(1200);
      busy = false;
      S.deleted.add(u.name);
      if (u.hacker) return hackerDeleted();
      OS.notify(`🗑 Usuário ${u.name} excluído`);
      render();
    }

    async function hackerDeleted() {
      stopHackerTimer();
      S.phase = 3;
      api.close();
      OS.play("unlock");
      await OS.dialog({ icon: "✔", title: "Ameaça eliminada",
        text: "O usuário que estava te vigiando <b>foi excluído</b>.<br><br>Podemos dar início à próxima parte." });
      OS.showIcon("bios");
      OS.notify("📥 Novo aplicativo instalado: bios_setup");
    }

    render();
  }

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  window.APPS.push(
    { id: "cadastro", title: "cadastro_adm", icon: "🪪", hidden: true, width: 440, height: 470, render: Cadastro },
    { id: "gerenciador", title: "gerenciador_usuarios", icon: "👥", hidden: true, width: 640, height: 520, render: Gerenciador },
    { id: "bios", title: "bios_setup", icon: "🧬", hidden: true, width: 860, height: 560,
      finalCode: "REBOOT", winMessage: "Componentes reconectados. A próxima fase será liberada em breve.",
      render: (el, api) => BiosGame(el, api) }
  );
})();
