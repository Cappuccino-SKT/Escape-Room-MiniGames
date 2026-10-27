// ===== FASE 5: RANSOMWARE =====
// Uso: Ransom.start(onWin). O hacker sequestra o sistema; a chave de recuperação está rasgada
// em pedaços pela sala. Tempo esgotado = jump scare e o cronômetro recomeça.
// Chave certa = tela final com o código do cadeado da caixa.
window.Ransom = (() => {
  const C = window.CONFIG;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const norm = (t) => t.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const TAUNTS = ["Chave inválida. Vocês estão perdendo tempo.", "Errado. Eu continuo aqui.",
    "Não é essa. Talvez a ordem esteja errada?", "Chave inválida. Eu estou assistindo."];

  async function start(onWin) {
    const R = C.ransom, parts = R.key.split("-");
    const l = document.createElement("div");
    l.id = "ransom";
    document.body.appendChild(l);

    // Reinício falso: parece que acabou...
    l.innerHTML = `<div class="rs-boot">Reiniciando o sistema...</div>`;
    await sleep(2500);
    l.innerHTML = `<div class="rs-boot ok">✔ Sistema restaurado.<br><small>Bem-vindo de volta.</small></div>`;
    await sleep(2200);
    l.innerHTML = "";
    l.classList.add("dark");
    await sleep(1200);

    // ...mas o hacker nunca saiu
    l.classList.remove("dark");
    l.classList.add("on");
    l.innerHTML = `
      <div class="rs-box">
        <div class="rs-skull">☠</div>
        <h1>SEUS ARQUIVOS FORAM SEQUESTRADOS</h1>
        <p class="rs-txt">Vocês acharam mesmo que tinham me tirado do sistema?<br>
          Enquanto vocês consertavam o computador, eu <b>criptografei tudo</b>.<br><br>
          A <b>chave de recuperação</b> foi rasgada em ${parts.length} pedaços e espalhada por esta sala.<br>
          Encontrem os pedaços, montem a chave e digitem abaixo.</p>
        <div class="rs-time-l">Seus arquivos serão apagados em</div>
        <div class="rs-time">--:--</div>
        <form class="rs-form">
          <div class="rs-keys">${parts.map((p) => `<input maxlength="${p.length}" size="${p.length}" spellcheck="false" autocomplete="off">`).join("<span>-</span>")}</div>
          <button>DESCRIPTOGRAFAR</button>
          <p class="rs-msg"></p>
        </form>
      </div>`;
    OS.play("denied");

    const form = l.querySelector("form"), inputs = [...l.querySelectorAll(".rs-keys input")];
    const msg = l.querySelector(".rs-msg"), timeEl = l.querySelector(".rs-time");
    let end = 0, timer = null, busy = false;

    inputs.forEach((inp, i) => {
      inp.oninput = () => {
        inp.value = norm(inp.value);
        if (inp.value.length >= inp.maxLength && inputs[i + 1]) inputs[i + 1].focus();
      };
      inp.onkeydown = (e) => { if (e.key === "Backspace" && !inp.value && inputs[i - 1]) inputs[i - 1].focus(); };
    });
    setTimeout(() => inputs[0].focus(), 50);

    function startTimer() {
      clearInterval(timer);
      end = Date.now() + R.minutes * 60000;
      timer = setInterval(tick, 250);
      tick();
    }
    async function tick() {
      const left = Math.max(0, end - Date.now());
      const m = Math.floor(left / 60000), s = Math.floor((left % 60000) / 1000);
      timeEl.textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
      timeEl.classList.toggle("danger", left < 60000);
      if (left > 0 || busy) return;
      clearInterval(timer);
      busy = true;
      await Interference.scare("ransomware");
      msg.textContent = "O tempo acabou... mas eu ainda não terminei de brincar com vocês. Mais uma chance.";
      busy = false;
      startTimer();
      inputs[0].focus();
    }
    startTimer();

    form.onsubmit = async (e) => {
      e.preventDefault();
      if (busy) return;
      if (norm(inputs.map((i) => i.value).join("")) !== norm(R.key)) {
        OS.play("loginError");
        msg.textContent = TAUNTS[Math.floor(Math.random() * TAUNTS.length)];
        form.classList.remove("shake"); void form.offsetWidth; form.classList.add("shake");
        return;
      }
      busy = true;
      clearInterval(timer);
      removeEventListener("keydown", onKey);
      inputs.forEach((i) => (i.disabled = true));
      form.querySelector("button").disabled = true;
      msg.className = "rs-msg ok";
      for (const t of ["Chave aceita.", "Descriptografando arquivos...", "Removendo JIGSAW.EXE..."]) {
        msg.textContent = t; await sleep(1100);
      }
      if (onWin) onWin();
      final(l);
    };

    // Atalho do mestre do jogo: Ctrl+Shift+S (ou N) preenche a chave
    const onKey = (e) => {
      if (e.ctrlKey && e.shiftKey && "ns".includes(e.key.toLowerCase()) && !busy) {
        e.preventDefault();
        inputs.forEach((inp, i) => (inp.value = norm(parts[i])));
        form.requestSubmit();
      }
    };
    addEventListener("keydown", onKey);
  }

  // Tela final: código do cadeado + recado do hacker (o mestre do jogo)
  async function final(l) {
    l.classList.remove("on");
    l.classList.add("dark");
    l.innerHTML = "";
    await sleep(1500);
    l.innerHTML = `
      <div class="rs-final">
        <p class="rs-txt">Muito bem. Vocês recuperaram o sistema.<br>Mas o jogo <b>ainda não acabou</b>.</p>
        <p class="rs-txt">A última dica está trancada na caixa.</p>
        <small>CÓDIGO DO CADEADO</small>
        <div class="code"></div>
        <div class="rs-hints">${C.hints.map((h, i) => `<div>DICA ${i + 1}: <b>${h}</b></div>`).join("")}
          <div>DICA ${C.hints.length + 1}: <b>está dentro da caixa</b></div></div>
        <p class="rs-txt">Juntem todas as dicas. Quando souberem a <b>resposta final</b>,<br>digam-na em voz alta. Eu estou ouvindo.</p>
        <p class="rs-sign">— J</p>
      </div>`;
    OS.scramble(l.querySelector(".code"), String(C.ransom.lockCode));
    OS.play("unlock");
  }

  return { start };
})();
