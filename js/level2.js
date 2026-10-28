// ===== NÍVEL 2 — "O CÚMPLICE" =====
// Ativo com index.html?nivel=2. Investigação: descobrir quem instalou o vírus no N112.
// Trilha principal: caso.txt → suspeitos/depoimentos → fechadura.exe (portas lógicas) → limpeza.c → chat_monitores.
// Opcionais (pistas extras): terminal.exe, cameras.exe, email do Bruno, rede.exe (Wi-Fi).
// Erros nos minijogos passam por Interference.error: só às vezes viram jump scare (CONFIG.scareRules).
// A acusação é falada ao mestre do jogo; cronômetro, punição e vitória ficam no projetor.html.
(() => {
  const C = window.CONFIG, D = window.L2;
  if (C.level !== 2) return;

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const scare = () => Interference.error("nivel2");
  const solved = new Set();
  function done(id, label) {
    if (solved.has(id)) return;
    solved.add(id);
    PhaseLog.mark(label);
  }

  // Login e área de trabalho próprios do Nível 2
  C.password = D.loginPassword;
  C.hint = D.loginHint;
  C.userName = `LAB-${D.room}`;
  C.maxHintAttempts = 3;
  C.timerMinutes = 0; // o cronômetro oficial fica no projetor
  window.GATE = null;
  window.onDesktopReady = () => {
    done("login", "Entrada no PC");
    OS.openApp("caso");
  };

  // ---------- caso.txt ----------
  function Caso(el) {
    el.innerHTML = Doc.html(D.caso);
  }

  // ---------- Suspeitos ----------
  function Suspeitos(el) {
    el.innerHTML = `<div class="l2-cards">${D.suspects.map((s) => `
      <div class="l2-card"><div class="l2-ava">${s.icon}</div>
        <b>${esc(s.name)}</b><small>${esc(s.course)} · ingresso ${s.year}</small>
        <p>${esc(s.notes)}</p></div>`).join("")}</div>`;
  }

  // ---------- Depoimentos ----------
  function Depoimentos(el) {
    el.innerHTML = `<div class="l2-dep">${D.suspects.map((s) => `
      <div class="l2-quote"><div class="l2-ava sm">${s.icon}</div>
        <div><b>${esc(s.name)}</b><p>“${esc(D.statements[s.name])}”</p></div></div>`).join("")}
      <p class="l2-rule">Lembre-se: o cúmplice mente. Os inocentes dizem a verdade.</p></div>`;
  }

  // ---------- fechadura.exe: deduzir as portas lógicas pelo registro ----------
  const GATES = { AND: (a, b) => a & b, OR: (a, b) => a | b, XOR: (a, b) => a ^ b, NAND: (a, b) => 1 - (a & b) };
  function Fechadura(el) {
    const L = D.lock;
    const opts = L.options.map((o) => `<option>${o}</option>`).join("");
    const bit = (v) => `<span class="l2-bit b${v}">${v}</span>`;
    el.innerHTML = `
      <div class="l2-lock">
        <div class="l2-lock-l">
          <h3>Circuito da fechadura — ${D.room}</h3>
          <div class="l2-circ">
            <div class="l2-in">A <small>${L.inputs.A}</small></div>
            <div class="l2-in">B <small>${L.inputs.B}</small></div>
            <div class="l2-gate g1"><span>G1</span><select class="s1"><option value="">??? (queimada)</option>${opts}</select></div>
            <div class="l2-in c">C <small>${L.inputs.C}</small></div>
            <div class="l2-gate g2"><span>G2</span><select class="s2"><option value="">??? (queimada)</option>${opts}</select></div>
            <div class="l2-out">🚪 PORTA</div>
          </div>
          <p class="l2-formula">PORTA = (A <b>G1</b> B) <b>G2</b> C</p>
          <button class="primary l2-fix">🔧 Reparar circuito</button>
          <p class="l2-msg"></p>
          <div class="l2-after hidden"></div>
        </div>
        <div class="l2-lock-r">
          <h3>Registro da porta (hoje)</h3>
          <table class="l2-tab"><tr><th>Hora</th><th>A</th><th>B</th><th>C</th><th>Porta</th></tr>
            ${L.log.map((r) => `<tr><td>${r.t}</td><td>${bit(r.A)}</td><td>${bit(r.B)}</td><td>${bit(r.C)}</td><td>${r.open ? "✔ aberta" : "✖ negada"}</td></tr>`).join("")}
            <tr class="bad"><td>${L.crime.t}</td><td>?</td><td>?</td><td>?</td><td>⚠ dados corrompidos</td></tr></table>
          <p class="l2-note">1 = sim, 0 = não. Repare o circuito para reconstruir o registro das ${L.crime.t}.</p>
        </div>
      </div>`;
    const msg = el.querySelector(".l2-msg"), after = el.querySelector(".l2-after");
    let busy = false;

    el.querySelector(".l2-fix").onclick = async () => {
      if (busy) return;
      const g1 = el.querySelector(".s1").value, g2 = el.querySelector(".s2").value;
      if (!g1 || !g2) return (msg.textContent = "Escolha uma porta lógica para G1 e para G2.");
      if (g1 !== L.gates.G1 || g2 !== L.gates.G2) {
        busy = true;
        msg.textContent = "Reparo incorreto: o circuito não bate com o registro.";
        await scare();
        busy = false;
        return;
      }
      el.querySelectorAll("select, .l2-fix").forEach((x) => (x.disabled = true));
      msg.className = "l2-msg ok";
      msg.textContent = "✔ Circuito reparado. Registro das " + L.crime.t + " reconstruído (parcialmente).";
      done("lock1", "Fechadura reparada");
      after.classList.remove("hidden");
      after.innerHTML = `
        <p><b>${L.crime.t}</b> — C (chave física) = <b>${L.crime.C}</b> — PORTA <b>ABERTA</b>.<br>
          As entradas A e B continuam perdidas. Com o circuito reparado, quais valores abriram a porta?</p>
        <label>A <select class="a"><option>0</option><option>1</option></select></label>
        <label>B <select class="b"><option>0</option><option>1</option></select></label>
        <button class="primary l2-conf">Confirmar</button>`;
      after.querySelector(".l2-conf").onclick = async () => {
        if (busy) return;
        const a = +after.querySelector(".a").value, b = +after.querySelector(".b").value;
        const out = GATES[L.gates.G2](GATES[L.gates.G1](a, b), L.crime.C);
        if (!out) {
          busy = true;
          msg.className = "l2-msg";
          msg.textContent = `Com A = ${a} e B = ${b} a porta não abriria.`;
          await scare();
          busy = false;
          return;
        }
        after.innerHTML = `<p class="ok">✔ Confirmado: quem entrou às ${L.crime.t} usou um <b>CRACHÁ DE MONITOR</b> e sabia a <b>SENHA DA PORTA</b>.</p>`;
        done("lock2", "Registro das 23:03");
      };
    };
  }

  // ---------- limpeza.c: editor com o compilador "corrompido" ----------
  function LimpezaC(el) {
    el.innerHTML = `
      <div class="l2-code">
        <div class="l2-code-bar"><span>📄 limpeza.c</span><button class="l2-run">▶ Compilar e executar</button></div>
        <pre>${D.cProgram.map((l, i) => `<span class="ln">${String(i + 1).padStart(2, " ")}</span>${esc(l)}`).join("\n")}</pre>
        <div class="l2-console">$ <span class="l2-con"></span></div>
      </div>`;
    el.querySelector(".l2-run").onclick = async () => {
      const con = el.querySelector(".l2-con");
      con.textContent = "gcc limpeza.c -o limpeza ...";
      await sleep(900);
      con.innerHTML = `<span class="err">gcc: erro fatal: compilador corrompido por J.</span><br>A saída deste programa abre o chat dos monitores. Execute de cabeça. :)`;
    };
  }

  // ---------- Senha com susto (chat e e-mail) ----------
  function passwordGate(el, { title, sub, check, onOk }) {
    let busy = false;
    el.innerHTML = `
      <form class="lock-screen">
        <div class="lock-ico">🔒</div><h3>${title}</h3><p>${sub}</p>
        <input type="password" autocomplete="off" placeholder="Senha"><p class="lock-msg"></p>
      </form>`;
    const form = el.querySelector("form"), input = form.querySelector("input"), msg = form.querySelector(".lock-msg");
    setTimeout(() => input.focus(), 50);
    form.onsubmit = async (e) => {
      e.preventDefault();
      if (busy) return;
      const v = input.value.trim();
      input.value = "";
      if (!v) return;
      if (check(v)) return onOk();
      OS.play("loginError");
      msg.textContent = "Senha incorreta.";
      form.classList.remove("shake"); void form.offsetWidth; form.classList.add("shake");
      busy = true; await scare(); busy = false; input.focus();
    };
  }
  const same = (a, b) => a.toUpperCase().replace(/\s/g, "") === b.toUpperCase();

  // ---------- chat_monitores ----------
  let chatOpen = false;
  function Chat(el) {
    const show = () => {
      chatOpen = true;
      done("chat", "Chat dos monitores");
      el.innerHTML = `<div class="l2-chat"><div class="l2-chat-h">💬 Monitores ${D.room} <small>Bruno, Elisa, Lucas, Paula</small></div>
        ${D.chat.map((m) => m.sys
          ? `<div class="l2-sys">${m.t} — ${esc(m.sys)}</div>`
          : `<div class="l2-msgc"><small>${m.t} · ${esc(m.who)}</small><div>${esc(m.msg)}</div></div>`).join("")}</div>`;
    };
    if (chatOpen) return show();
    passwordGate(el, { title: "CHAT CRIPTOGRAFADO", sub: "Senha do grupo <b>Monitores " + D.room + "</b>",
      check: (v) => same(v, D.chatPassword), onOk: show });
  }

  // ---------- terminal.exe: vasculhar arquivos ----------
  function Terminal(el) {
    const ROOT = `C:\\LAB-${D.room}`;
    let cwd = []; // caminho a partir da raiz
    el.innerHTML = `
      <div class="term wincmd">
        <div class="term-out"></div>
        <form class="term-line"><span class="term-prompt"></span><input spellcheck="false" autocomplete="off"></form>
      </div>`;
    const out = el.querySelector(".term-out"), input = el.querySelector("input"), form = el.querySelector("form");
    const promptEl = el.querySelector(".term-prompt");
    el.querySelector(".term").addEventListener("mouseup", () => { if (!getSelection().toString()) input.focus(); });
    const path = () => [ROOT, ...cwd.map((k) => k.replace(/\\$/, ""))].join("\\") + ">";
    const setPrompt = () => (promptEl.textContent = path() + " ");
    const print = (t = "", cls = "") => { const d = document.createElement("div"); d.className = cls; d.textContent = t || " "; out.appendChild(d); out.scrollTop = out.scrollHeight; };

    const nodeAt = (parts) => parts.reduce((n, p) => n && n[p], D.fs);
    const dir = () => nodeAt(cwd);
    const find = (n, name) => Object.keys(n).find((k) => k !== "hidden" && k.replace(/\\$/, "").toLowerCase() === name.toLowerCase().replace(/\\$/, ""));
    const isDir = (k) => k.endsWith("\\");

    const cmds = {
      help() {
        [["dir", "lista os arquivos da pasta"], ["dir /a", "lista também os arquivos ocultos"], ["cd <pasta>", "entra numa pasta (cd .. volta)"],
         ["type <arquivo>", "mostra o conteúdo de um arquivo"], ["cls", "limpa a tela"]].forEach(([c, d]) => print(`  ${c.padEnd(16)} ${d}`));
      },
      cls() { out.innerHTML = ""; },
      dir(arg) {
        const all = (arg || "").toLowerCase() === "/a", n = dir();
        print(` Pasta de ${path().slice(0, -1)}`);
        print("");
        const keys = Object.keys(n).filter((k) => k !== "hidden" && (all || !(n[k] && n[k].hidden)));
        if (!keys.length) print("  (pasta vazia)", "dim");
        keys.forEach((k) => print(`  ${isDir(k) ? "<DIR>   " : "        "} ${k.replace(/\\$/, "")}${n[k] && n[k].hidden ? "   [oculto]" : ""}`));
        if (all) done("term-hidden", "Terminal: dir /a");
      },
      cd(arg) {
        if (!arg) return print(path().slice(0, -1));
        if (arg === "\\" || arg === "/") { cwd = []; return setPrompt(); }
        for (const p of arg.split(/[\\/]/).filter(Boolean)) {
          if (p === "..") { cwd.pop(); continue; }
          const k = find(dir(), p);
          if (!k || !isDir(k)) return print("O sistema não pode encontrar o caminho especificado.", "err");
          cwd.push(k);
        }
        setPrompt();
      },
      async type(arg) {
        if (!arg) return print("Sintaxe: type <arquivo>", "err");
        const k = find(dir(), arg);
        if (!k || isDir(k)) return print("O sistema não pode encontrar o arquivo especificado.", "err");
        const f = dir()[k];
        if (f.trap) return trap();
        f.forEach((l) => print(l));
        if (k === "rascunho.txt") done("term-draft", "Terminal: rascunho");
      },
      async del() { print("del: VOCÊ NÃO VAI APAGAR NADA AQUI.", "err"); await scare(); }
    };
    cmds.ls = cmds.dir; cmds.cat = cmds.type; cmds.clear = cmds.cls; cmds.erase = cmds.del; cmds.rm = cmds.del;
    // A armadilha não é um erro: sempre assusta
    async function trap() { print("Executando jigsaw.exe ...", "err"); await sleep(400); await Interference.scare("nivel2_armadilha"); print("Não toque no que não é seu.", "err"); }

    form.onsubmit = async (e) => {
      e.preventDefault();
      const raw = input.value.trim();
      input.value = "";
      print(path() + " " + raw, "cmd");
      if (!raw) return;
      const [c, ...rest] = raw.split(/\s+/), arg = rest.join(" ");
      form.classList.add("busy");
      try {
        // Rodar um .exe digitando o nome (com ou sem "start")
        const exe = (c.toLowerCase() === "start" ? arg : raw).toLowerCase();
        if (exe.replace(/\.exe$/, "") === "jigsaw" && find(dir(), "jigsaw.exe")) await trap();
        else if (cmds[c.toLowerCase()]) await cmds[c.toLowerCase()](arg);
        else print(`'${c}' não é reconhecido como um comando interno. Digite help.`, "err");
      } finally { form.classList.remove("busy"); input.focus(); }
    };
    setPrompt();
    print(`JIGSAW OS [versão 6.6.6] — terminal do ${D.room}`);
    print("Digite help para ver os comandos.", "dim");
    print("");
    setTimeout(() => input.focus(), 50);
  }

  // ---------- cameras.exe ----------
  function Cameras(el) {
    el.innerHTML = `
      <div class="l2-cam">
        <div class="l2-cam-screen"><div class="l2-cam-txt">SEM SINAL<br><small>Digite um horário para buscar a gravação</small></div></div>
        <form class="l2-cam-f"><label>Horário (HH:MM)</label><input maxlength="5" placeholder="00:00" autocomplete="off"><button class="primary">Buscar</button></form>
        <p class="l2-msg"></p>
        <div class="l2-cam-hist"></div>
      </div>`;
    const form = el.querySelector("form"), input = form.querySelector("input"), msg = el.querySelector(".l2-msg");
    const screen = el.querySelector(".l2-cam-txt"), hist = el.querySelector(".l2-cam-hist");
    let busy = false;
    setTimeout(() => input.focus(), 50);
    form.onsubmit = async (e) => {
      e.preventDefault();
      if (busy) return;
      const v = input.value.trim().replace(/[h.]/i, ":");
      if (!/^\d{1,2}:\d{2}$/.test(v)) return (msg.textContent = "Formato inválido. Use HH:MM, por exemplo 14:30.");
      const t = v.padStart(5, "0"), rec = D.cameras[t];
      msg.textContent = "";
      screen.parentElement.classList.add("noise");
      screen.innerHTML = "BUSCANDO...";
      busy = true;
      await sleep(900);
      screen.parentElement.classList.remove("noise");
      if (!rec) {
        screen.innerHTML = `NENHUMA GRAVAÇÃO ÀS ${t}`;
        await scare();
        screen.innerHTML = `<span class="err">VOCÊ NÃO DEVERIA ESTAR OLHANDO.</span>`;
        busy = false;
        return;
      }
      busy = false;
      screen.innerHTML = `<small>● REC ${t}</small><br>${esc(rec)}`;
      if (!hist.querySelector(`[data-t="${t}"]`)) hist.insertAdjacentHTML("beforeend", `<div data-t="${t}"><b>${t}</b> ${esc(rec)}</div>`);
      if (t === "23:03") done("cam", "Câmeras: 23:03");
    };
  }

  // ---------- E-mail do Bruno ----------
  let mailOpen = false;
  function Email(el) {
    const show = () => {
      mailOpen = true;
      done("mail", "E-mail do Bruno");
      el.innerHTML = `<div class="l2-mail"><div class="l2-mail-list">${D.emails.map((m, i) => `
          <div class="l2-mail-i" data-i="${i}"><b>${esc(m.from)}</b><span>${esc(m.subject)}</span><small>${esc(m.time)}</small></div>`).join("")}</div>
        <div class="l2-mail-body"><p class="muted">Selecione um e-mail.</p></div></div>`;
      el.querySelectorAll(".l2-mail-i").forEach((it) => (it.onclick = () => {
        el.querySelectorAll(".l2-mail-i").forEach((x) => x.classList.remove("sel"));
        it.classList.add("sel");
        const m = D.emails[it.dataset.i];
        el.querySelector(".l2-mail-body").innerHTML = `<h3>${esc(m.subject)}</h3><small>De: <b>${esc(m.from)}</b> · ${esc(m.time)}</small><div class="mail-text">${Doc.paras(m.body)}</div>`;
      }));
    };
    if (mailOpen) return show();
    passwordGate(el, { title: "JIGSAW MAIL", sub: "Conta: <b>bruno.sato</b>",
      check: (v) => same(v, D.emailPassword), onOk: show });
  }

  // ---------- rede.exe: log do Wi-Fi (decimal) x rastreador (hexadecimal) ----------
  function Rede(el) {
    const W = D.wifi;
    el.innerHTML = `
      <div class="l2-net">
        <h3>📶 Roteador LAB-${D.room} — conexões de ontem</h3>
        <table class="l2-tab"><tr><th>Conectou</th><th>Endereço MAC</th><th>Aparelho</th><th></th></tr>
          ${W.log.map((r) => `<tr><td>${r.t}</td><td><code>${W.prefix}:${r.last.join(":")}</code></td><td>(nome oculto)</td><td>${r.note}</td></tr>`).join("")}</table>
        <p class="l2-note">⚠ Falha no firmware: os dois últimos blocos do MAC estão sendo exibidos em <b>decimal</b>.</p>
        <form class="l2-net-f"><label>Rastrear dispositivo — MAC em hexadecimal:</label>
          <input placeholder="${W.prefix}:??:??" autocomplete="off" spellcheck="false"><button class="primary">Rastrear</button></form>
        <p class="l2-msg"></p>
        <div class="l2-net-res"></div>
      </div>`;
    const form = el.querySelector("form"), input = form.querySelector("input"), msg = el.querySelector(".l2-msg"), res = el.querySelector(".l2-net-res");
    let busy = false;
    form.onsubmit = async (e) => {
      e.preventDefault();
      if (busy) return;
      const parts = input.value.trim().toUpperCase().split(/[:\-\s]+/).filter(Boolean);
      if (parts.length !== 6 || !parts.every((p) => /^[0-9A-F]{1,2}$/.test(p)))
        return (msg.textContent = "Formato inválido: o rastreador só aceita o MAC completo em hexadecimal (6 blocos de 00 a FF).");
      const mac = parts.map((p) => p.padStart(2, "0"));
      const key = mac.slice(4).join(":"), dev = mac.slice(0, 4).join(":") === W.prefix && W.devices[key];
      msg.textContent = "";
      if (!dev) {
        busy = true;
        msg.textContent = "Dispositivo não encontrado.";
        await scare();
        busy = false;
        return;
      }
      res.insertAdjacentHTML("beforeend", `<div>✔ <code>${mac.join(":")}</code> → <b>${esc(dev)}</b></div>`);
      if (key === "A4:5E") done("wifi", "Wi-Fi: celular da Elisa");
    };
  }

  // ---------- Lixeira ----------
  function Lixeira(el) {
    el.innerHTML = Doc.html([
      { h: "🗑 senha_antiga_porta.txt" },
      { p: `Senha antiga da porta do ${D.room}: \`4402\`` },
      { p: "(trocada ontem à noite)" }
    ]);
  }

  APPS.length = 0;
  APPS.push(
    { id: "caso", title: "caso.txt", icon: "📄", width: 700, height: 560, render: Caso },
    { id: "suspeitos", title: "suspeitos", icon: "🗂️", width: 760, height: 520, render: Suspeitos },
    { id: "depoimentos", title: "depoimentos", icon: "🎙️", width: 680, height: 540, render: Depoimentos },
    { id: "fechadura", title: "fechadura.exe", icon: "🚪", width: 900, height: 560, render: Fechadura },
    { id: "limpeza", title: "limpeza.c", icon: "📝", width: 620, height: 470, render: LimpezaC },
    { id: "chat", title: "chat_monitores", icon: "💬", width: 560, height: 540, render: Chat },
    { id: "terminal", title: "terminal.exe", icon: "⌨️", width: 760, height: 480, render: Terminal },
    { id: "cameras", title: "cameras.exe", icon: "📹", width: 680, height: 540, render: Cameras },
    { id: "email", title: "email_bruno", icon: "✉️", width: 760, height: 480, render: Email },
    { id: "rede", title: "rede.exe", icon: "📶", width: 720, height: 480, render: Rede },
    { id: "lixeira", title: "Lixeira", icon: "🗑️", width: 420, height: 260, render: Lixeira }
  );
})();
