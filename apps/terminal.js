// ===== MINIGAME: TERMINAL HACKER =====
// Fluxo: help → scan → crack 192.168.6.66 → connect 192.168.6.66 → ls / cat → decrypt chave.enc
window.TerminalGame = function (el, api) {
  const TARGET = "192.168.6.66";
  const TRACE_SECONDS = 150; // tempo até o vilão "rastrear" o jogador e derrubar a conexão
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const st = { cracked: false, connected: false, busy: false, done: false, trace: 0, traceId: null };
  const history = []; let hIdx = 0;

  const files = {
    "LEIA_ISTO.txt": [
      "Você entrou no meu servidor. Impressionante.",
      "Mas lembre-se: enquanto você me observa, eu observo você.",
      "A chave para continuar está criptografada. Use 'decrypt'.",
      "                                               — J"
    ],
    "cameras.log": [
      "[23:02:11] CAM-01  Sujeitos inconscientes na sala.",
      "[23:14:47] CAM-01  Sujeitos acordaram.",
      "[23:15:30] CAM-02  Um dos sujeitos encontrou o computador.",
      "[AGORA]    CAM-02  Sujeito está lendo este arquivo.  :)"
    ],
    "chave.enc": ["0x4A 0x1F 0xC2 0x9B 0x77 0x00 0xE1 0x3D 0x5A 0x8F 0x21",
                  "[ARQUIVO CRIPTOGRAFADO — use: decrypt chave.enc]"]
  };

  el.innerHTML = `
    <div class="term">
      <div class="term-trace hidden"><span>RASTREAMENTO</span><div class="bar"><i></i></div><b>0%</b></div>
      <div class="term-out"></div>
      <form class="term-line"><span class="term-prompt"></span><input spellcheck="false" autocomplete="off"></form>
    </div>`;
  const out = el.querySelector(".term-out"), input = el.querySelector("input"), form = el.querySelector("form");
  const promptEl = el.querySelector(".term-prompt"), traceEl = el.querySelector(".term-trace");
  el.querySelector(".term").addEventListener("mouseup", () => { if (!getSelection().toString()) input.focus(); });

  const prompt = () => (st.connected ? "root@jigsaw-srv:~# " : "convidado@notebook:~$ ");
  const setPrompt = () => (promptEl.textContent = prompt());

  function print(text = "", cls = "") {
    const d = document.createElement("div");
    d.className = cls; d.textContent = text;
    out.appendChild(d); out.scrollTop = out.scrollHeight;
    return d;
  }
  async function type(text, cls = "", speed = 14) {
    const d = print("", cls);
    for (const c of text) { d.textContent += c; out.scrollTop = out.scrollHeight; await sleep(speed); }
  }
  async function progress(label, ms) {
    const d = print("", "dim");
    for (let p = 0; p <= 20; p++) {
      d.textContent = `${label} [${"█".repeat(p)}${"░".repeat(20 - p)}] ${p * 5}%`;
      await sleep(ms / 20);
    }
  }
  const tip = (t) => print("» " + t, "tip");

  // ---------- Rastreamento (tensão) ----------
  function startTrace() {
    traceEl.classList.remove("hidden");
    st.trace = 0;
    st.traceId = setInterval(() => {
      if (!el.isConnected) return clearInterval(st.traceId); // janela fechada
      st.trace += 100 / TRACE_SECONDS;
      const p = Math.min(100, Math.floor(st.trace));
      traceEl.querySelector("i").style.width = p + "%";
      traceEl.querySelector("b").textContent = p + "%";
      traceEl.classList.toggle("hot", p >= 70);
      if (p === 50) print("⚠ ALERTA: alguém está rastreando sua conexão.", "err");
      if (p >= 100) traced();
    }, 1000);
  }
  function stopTrace() { clearInterval(st.traceId); traceEl.classList.add("hidden"); }
  async function traced() {
    stopTrace();
    st.connected = false; setPrompt();
    print("");
    await type("CONEXÃO ENCERRADA PELO HOST REMOTO.", "err", 25);
    await type("Eu sei onde você está.", "villain", 60);
    tip(`Conecte-se de novo: connect ${TARGET}`);
  }

  // ---------- Comandos ----------
  const cmds = {
    help() {
      print("Comandos disponíveis:", "hl");
      [["scan", "procura computadores na rede"],
       ["crack <ip>", "quebra a senha de um computador"],
       ["connect <ip>", "conecta em um computador"],
       ["ls", "lista os arquivos"],
       ["cat <arquivo>", "mostra o conteúdo de um arquivo"],
       ["decrypt <arquivo>", "descriptografa um arquivo"],
       ["disconnect", "encerra a conexão"],
       ["clear", "limpa a tela"]].forEach(([c, d]) => print(`  ${c.padEnd(20)} ${d}`));
      if (!st.cracked) tip("Comece procurando alvos: scan");
    },
    clear() { out.innerHTML = ""; },
    whoami() { print(st.connected ? "root" : "convidado"); },
    async scan() {
      await type("Varrendo rede 192.168.6.0/24 ...", "dim");
      await progress("Escaneando", 2200);
      print("IP               HOST                PORTAS", "hl");
      print("192.168.6.1      roteador            80");
      print("192.168.6.23     impressora-n112     9100");
      print("192.168.6.66     JIGSAW-SRV          22  ← protegido por senha", "warn");
      tip(`Alvo suspeito encontrado. Quebre a senha: crack ${TARGET}`);
    },
    async crack(ip) {
      if (!ip) return print("uso: crack <ip>", "err");
      if (ip !== TARGET) return print(`crack: ${ip} não possui serviço vulnerável.`, "err");
      if (st.cracked) return print("Senha já descoberta. Use connect.", "dim");
      await type(`Iniciando ataque de força bruta em ${ip}:22 ...`, "dim");
      const words = ["admin", "123456", "senha", "root", "qwerty", "jogo", "compilador", "vida", "morte", "tamara", "billy", "escolha", "porao", "corrente", "serra"];
      const line = print("", "dim");
      for (let i = 0; i < 45; i++) {
        const w = words[Math.floor(Math.random() * words.length)] + Math.floor(Math.random() * 999);
        line.textContent = `tentativa ${String(i * 137 + 1).padStart(5, "0")}: ${w.padEnd(16)} ✗`;
        await sleep(55);
      }
      line.textContent = "tentativa 06166: viverOUmorrer     ✓";
      line.className = "ok";
      print("SENHA ENCONTRADA!", "ok");
      st.cracked = true;
      tip(`Agora conecte-se: connect ${TARGET}`);
    },
    async connect(ip) {
      if (!ip) return print("uso: connect <ip>", "err");
      if (st.connected) return print("Você já está conectado.", "dim");
      if (ip !== TARGET) return print(`connect: conexão recusada por ${ip}`, "err");
      if (!st.cracked) return print("Acesso negado: senha desconhecida. Tente quebrá-la com crack.", "err");
      await type(`Conectando a ${ip} ...`, "dim");
      await sleep(600);
      print("Autenticando... OK", "ok");
      st.connected = true; setPrompt();
      print("");
      await type("Bem-vindo ao JIGSAW-SRV.", "villain", 40);
      startTrace();
      tip("Rápido! Veja os arquivos: ls");
    },
    ls() {
      if (!st.connected) return print("documentos/  fotos/  (nada interessante aqui...)", "dim");
      print(Object.keys(files).join("    "));
      tip("Leia os arquivos com cat <arquivo>. Ou vá direto ao ponto: decrypt chave.enc");
    },
    cat(f) {
      if (!st.connected) return print("cat: arquivo não encontrado", "err");
      if (!files[f]) return print(`cat: ${f || "?"}: arquivo não encontrado`, "err");
      files[f].forEach((l) => print(l, f === "chave.enc" ? "warn" : ""));
    },
    async decrypt(f) {
      if (!st.connected) return print("decrypt: arquivo não encontrado", "err");
      if (f !== "chave.enc") return print(`decrypt: ${f || "?"}: não é um arquivo criptografado`, "err");
      if (st.done) return print("Arquivo já descriptografado.", "dim");
      stopTrace();
      await type("Quebrando criptografia AES-256 ...", "dim");
      await progress("Descriptografando", 3000);
      print("");
      await type("Muito bem. Você conseguiu desta vez.", "villain", 50);
      st.done = true;
      await sleep(800);
      api.win(el.querySelector(".term"));
    },
    disconnect() {
      if (!st.connected) return print("Você não está conectado.", "dim");
      stopTrace(); st.connected = false; setPrompt(); print("Conexão encerrada.", "dim");
    },
    sudo() { print("Boa tentativa. :)", "villain"); }
  };
  cmds.exit = cmds.disconnect; cmds.ajuda = cmds.help; cmds.dir = cmds.ls; cmds.cls = cmds.clear;

  form.onsubmit = async (e) => {
    e.preventDefault();
    if (st.busy) return;
    const raw = input.value.trim();
    input.value = "";
    print(prompt() + raw, "cmd");
    if (!raw) return;
    history.push(raw); hIdx = history.length;
    const [c, ...args] = raw.split(/\s+/);
    const fn = cmds[c.toLowerCase()];
    if (!fn) { print(`${c}: comando não encontrado. Digite help`, "err"); return; }
    st.busy = true; form.classList.add("busy");
    await fn(...args);
    st.busy = false; form.classList.remove("busy");
    input.focus();
  };

  // Histórico (↑ ↓) e autocompletar (Tab)
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && hIdx > 0) { input.value = history[--hIdx]; e.preventDefault(); }
    if (e.key === "ArrowDown") { hIdx = Math.min(history.length, hIdx + 1); input.value = history[hIdx] || ""; }
    if (e.key === "Tab") {
      e.preventDefault();
      const parts = input.value.split(" "), last = parts.pop();
      const pool = parts.length ? [TARGET, ...Object.keys(files)] : Object.keys(cmds);
      const m = pool.find((x) => x.startsWith(last));
      if (m) input.value = [...parts, m].join(" ");
    }
  });

  (async () => {
    setPrompt();
    st.busy = true;
    await type("JIGSAW-NET Terminal v1.0", "hl", 20);
    await type("Conexão remota detectada na rede local.", "dim", 20);
    print("");
    tip("Digite help e pressione Enter para ver os comandos.");
    st.busy = false;
    input.focus();
  })();
};
