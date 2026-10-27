// ===== FASE 4: RECONFIGURAÇÃO PELO CMD =====
// "Iniciar reconfiguração? (Y/N)": Y = começa. N = pergunta de novo, com um easter egg:
// 1º N = jump scare, 2º N = máscara neutra, a partir do 3º = "Aperte Y logo."
// A tela mostra uma correção; o grupo descobre o comando com os dois papéis da sala.
// Comando válido mas errado = recomeça do zero com novo sorteio. Comando inexistente = só avisa.
window.ReconfigState = { done: false, noCount: 0 };

window.ReconfigGame = function (el, api) {
  const CFG = window.CONFIG.reconfig, RS = window.ReconfigState;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const valid = new Set([...CFG.tasks, ...CFG.decoys].map((t) => t.cmd.toLowerCase()));
  let mode = "ask", seq = [], step = 0, busy = false;

  el.innerHTML = `
    <div class="term wincmd">
      <div class="term-out"></div>
      <form class="term-line"><span class="term-prompt">C:\\JIGSAW&gt; </span><input spellcheck="false" autocomplete="off"></form>
    </div>`;
  const out = el.querySelector(".term-out"), input = el.querySelector("input"), form = el.querySelector("form");
  el.querySelector(".term").addEventListener("mouseup", () => { if (!getSelection().toString()) input.focus(); });

  function print(text = "", cls = "") {
    const d = document.createElement("div");
    d.className = cls; d.textContent = text || " ";
    out.appendChild(d); out.scrollTop = out.scrollHeight;
    return d;
  }
  async function type(text, cls = "", speed = 14) {
    const d = print("", cls);
    d.textContent = "";
    for (const c of text) { d.textContent += c; out.scrollTop = out.scrollHeight; await sleep(speed); }
  }
  async function progress(label, ms) {
    const d = print("", "dim");
    for (let p = 0; p <= 20; p++) {
      d.textContent = `${label} [${"█".repeat(p)}${"░".repeat(20 - p)}] ${p * 5}%`;
      await sleep(ms / 20);
    }
  }

  function shuffle() {
    const a = [...CFG.tasks];
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a.slice(0, CFG.steps);
  }

  function askStart() {
    mode = "ask";
    print("");
    print("Iniciar reconfiguração? (Y/N)", "hl");
  }

  async function begin() {
    mode = "busy";
    seq = shuffle(); step = 0;
    await type(`Iniciando reconfiguração do sistema: ${seq.length} correções necessárias.`, "dim");
    await type("Os comandos foram apagados da memória. Consulte o manual.", "warn");
    showStep();
  }

  function showStep() {
    mode = "step";
    print("");
    print(`[${step + 1}/${seq.length}] CORREÇÃO NECESSÁRIA:`, "dim");
    print(`  >> ${seq[step].task.toUpperCase()} <<`, "fix");
  }

  async function stepOk() {
    mode = "busy";
    await progress(seq[step].task, 1200);
    print("OK", "ok");
    if (++step < seq.length) return showStep();
    print("");
    await type("Reconfiguração concluída. Área de trabalho restaurada.", "ok", 20);
    RS.done = true;
    mode = "done";
    await sleep(800);
    if (RS.onDone) return RS.onDone();
    api.win(el.querySelector(".term"));
  }

  async function stepFail(c) {
    mode = "busy";
    print(`ERRO: "${c}" não corresponde a "${seq[step].task}".`, "err");
    await type("Configuração corrompida. A reconfiguração será reiniciada do zero.", "err", 20);
    await sleep(1200);
    print("");
    await begin();
  }

  form.onsubmit = async (e) => {
    e.preventDefault();
    if (busy || Interference.running) return;
    const raw = input.value.trim();
    input.value = "";
    print("C:\\JIGSAW> " + raw, "cmd");
    const c = raw.toLowerCase();
    busy = true; form.classList.add("busy");
    try {
      if (c === "cls" || c === "clear") out.innerHTML = "";
      else if (mode === "ask") {
        if (c === "y" || c === "s") await begin();
        else if (c === "n") {
          const n = ++RS.noCount;
          if (n === 1) await Interference.scare("cmd_n");
          else if (n === 2) await Interference.mock("Você é burro?<br>Apertou N <b>de novo</b>?");
          else print("Aperte Y logo.", "err");
          askStart();
        } else if (raw) print("Responda Y (sim) ou N (não).", "warn");
      } else if (mode === "step" && raw) {
        if (c === "help" || c === "ajuda") print("A lista de comandos foi perdida junto com a BIOS. Procure o manual.", "warn");
        else if (!valid.has(c)) print(`'${raw}' não é reconhecido como um comando interno.`, "err");
        else if (c === seq[step].cmd.toLowerCase()) await stepOk();
        else await stepFail(raw);
      }
    } finally {
      busy = false; form.classList.remove("busy");
      input.focus();
    }
  };

  // Atalho do mestre do jogo: Ctrl+Shift+S (ou N) completa a correção atual
  const onKey = (e) => {
    if (!el.isConnected) return removeEventListener("keydown", onKey);
    if (e.ctrlKey && e.shiftKey && "ns".includes(e.key.toLowerCase()) && mode === "step" && !busy) {
      e.preventDefault();
      busy = true;
      print(`C:\\JIGSAW> ${seq[step].cmd}`, "cmd");
      stepOk().finally(() => (busy = false));
    }
  };
  addEventListener("keydown", onKey);

  (async () => {
    if (RS.done) {
      return print("Sistema já reconfigurado.", "ok");
    }
    busy = true;
    print("JIGSAW OS [versão 6.6.6]");
    print("(c) Corporação John Kramer. Todos os direitos reservados.");
    print("");
    await type("AVISO: a BIOS foi reparada, mas a configuração do sistema foi perdida.", "warn", 18);
    await type("A área de trabalho precisa ser reconfigurada.", "warn", 18);
    askStart();
    busy = false;
    input.focus();
  })();
};
