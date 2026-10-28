// ===== NÍVEL 3 — "A PROVA FINAL" =====
// Ativo com index.html?nivel=3. O J (ex-aluno que trancou o curso) prende o grupo numa "prova":
// o vírus só para com o kill switch, escondido numa mensagem cifrada. Resposta falada: SEGFAULT.
// Questões principais (exigem conhecimento do curso): dump hex (login) → lista.c + cartões na sala (MALLOC),
// display.exe (mapa de Karnaugh → DEAD), registrador na sala (→ msg_6) e decifra.c (consertar a função em C).
// Opcionais (difíceis, mas sem conhecimento prévio), cada um dá a AJUDA de uma questão: radio.exe (frase em Morse) → lista,
// placa.exe (girar trilhas da placa) → Karnaugh, energia.exe (fios + manual na sala) → registrador, invasao.exe (terminal sem dicas) → C. Erros passam por Interference.error (susto só às vezes).
(() => {
  const C = window.CONFIG, D = window.L3;
  if (C.level !== 3) return;

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const scare = () => Interference.error("nivel3");
  const solved = new Set(), helps = new Set();
  function done(id, label) {
    if (solved.has(id)) return;
    solved.add(id);
    PhaseLog.mark(label);
  }

  // Login: o dump de memória aparece na tela de login
  C.password = D.loginPassword;
  C.hint = D.loginHint;
  C.userName = "J-SRV";
  C.maxHintAttempts = 3;
  C.timerMinutes = 0; // o cronômetro oficial fica no projetor
  window.GATE = null;
  const dump = document.createElement("div");
  dump.className = "l3-dump";
  dump.innerHTML = `<small>⚠ FALHA NA AUTENTICAÇÃO — DUMP DE MEMÓRIA (0x7FFD0040)</small><code>${D.loginDump}</code>`;
  document.querySelector("#login-form").before(dump);
  window.onDesktopReady = () => {
    done("login", "Entrada (dump hex)");
    OS.openApp("prova");
  };

  // ---------- Ajudas (prêmio dos opcionais) ----------
  const fmt = Doc.fmt, docHTML = Doc.html; // textos formatados (js/doc.js)
  // Notação lógica usada no display (a ajuda do Karnaugh usa a mesma, em L3.help.kmap.notation)
  const NOTATION = `<span class="l3-h-not">${D.help.kmap.notation.map(([a, b]) => `<span><code>${esc(a)}</code> = ${esc(b)}</span>`).join("")}</span>`;
  // Mapa de g: linhas AB e colunas CD na ordem 00, 01, 11, 10 (só muda 1 bit de uma para a outra)
  function kmapHTML(hiRow) {
    const ord = [0, 1, 3, 2], lab = ["00", "01", "11", "10"];
    return `<div class="l3-km">
      <div class="l3-km-top">C D →</div>
      <div class="l3-km-side">A B ↓</div>
      <table class="l3-kmap"><tr><th></th>${lab.map((l) => `<th>${l}</th>`).join("")}</tr>
        ${ord.map((r, ri) => `<tr class="${ri === hiRow ? "hi" : ""}"><th>${lab[ri]}</th>${ord.map((c) => `<td class="v${D.gTable[r * 4 + c]}">${D.gTable[r * 4 + c]}</td>`).join("")}</tr>`).join("")}</table>
      <small>Ordem 00, 01, 11, 10: de uma linha (ou coluna) para a vizinha só muda 1 bit.</small></div>`;
  }
  function helpHTML(key) {
    const h = D.help[key];
    const side = key === "kmap" ? kmapHTML(h.exampleRow)
      : h.table ? `<table class="l2-tab l3-h-tab"><tr>${h.table.head.map((c) => `<th>${c}</th>`).join("")}</tr>
          ${h.table.rows.map((r) => `<tr>${r.map((c) => `<td class="${c === "?" ? "q" : ""}">${c}</td>`).join("")}</tr>`).join("")}</table>` : "";
    return `<div class="l3-help"><h4>💡 ${esc(h.title)}</h4>
      <p class="l3-h-intro">${fmt(h.intro)}</p>
      <div class="l3-h-body">
        ${side ? `<div class="l3-h-side">${side}</div>` : ""}
        <div class="l3-h-main">
          <ol>${h.steps.map((s) => `<li>${fmt(s)}</li>`).join("")}</ol>
          ${h.notation ? `<div class="l3-h-not">${h.notation.map(([a, b]) => `<span><code>${esc(a)}</code> = ${esc(b)}</span>`).join("")}</div>` : ""}
          ${h.example ? `<div class="l3-h-ex"><b>Exemplo:</b> ${fmt(h.example)}</div>` : ""}
          ${h.note ? `<p class="l3-h-note">⚠ ${fmt(h.note)}</p>` : ""}
        </div>
      </div></div>`;
  }
  function giveHelp(key, container, label) {
    container.insertAdjacentHTML("beforeend", helpHTML(key));
    container.lastElementChild.scrollIntoView({ behavior: "smooth", block: "nearest" });
    if (!helps.has(key)) {
      helps.add(key);
      done("help-" + key, label);
      OS.showIcon("ajudas");
      OS.notify("💡 Ajuda guardada em ajudas.txt");
      OS.play("unlock");
    }
  }
  function Ajudas(el) {
    el.innerHTML = helps.size ? `<div class="l3-pad">${[...helps].map(helpHTML).join("")}</div>`
      : `<div class="notepad">Nenhuma ajuda ainda.</div>`;
  }

  // ---------- Textos ----------
  const text = (blocks) => (el) => (el.innerHTML = docHTML(blocks));
  const code = (name, lines) => (el) => (el.innerHTML = `
    <div class="l2-code"><div class="l2-code-bar"><span>📄 ${name}</span></div>
      <pre>${lines.map((l, i) => `<span class="ln">${String(i + 1).padStart(2, " ")}</span>${esc(l)}`).join("\n")}</pre></div>`);

  function Registrador(el) {
    el.innerHTML = docHTML([
      { h: "registrador.log" },
      { p: "Circuito: 3 flip-flops D com realimentação. **O diagrama está na sala.**" },
      { kv: [
        ["Estado inicial", "`Q2 Q1 Q0 = " + D.regStart.join(" ") + "`"],
        ["Pulsos de clock", `**${D.regPulses}** desde a infecção`],
        ["Estado atual", "`? ? ?` (registro apagado pelo vírus)"]
      ] },
      { box: "O número do arquivo (`msg_N`) é o estado atual, em decimal." }
    ]);
  }

  function Mensagens(el) {
    el.innerHTML = `<div class="l3-files"><h3 class="l3-files-h">🗂️ Mensagens cifradas do J</h3>${D.messages.map((m, i) => `
      <div class="l3-file"><b>📄 msg_${i}.txt</b><code>${m}</code></div>`).join("")}
      <p class="l3-files-note">⚠ Só um destes arquivos tem o kill switch verdadeiro. Usem o <b>decifra.c</b> para ler.</p></div>`;
  }

  // ---------- display.exe: segmento g queimado (mapa de Karnaugh) ----------
  const SEGS = ["abcdef", "bc", "abdeg", "abcdg", "bcfg", "acdfg", "acdefg", "abc", "abcdefg", "abcdfg", "abcefg", "cdefg", "adef", "bcdeg", "adefg", "aefg"];
  const SEG_PTS = {
    a: "14,8 56,8 48,16 22,16", b: "58,10 58,52 50,46 50,18", c: "58,58 58,100 50,92 50,64",
    d: "14,102 56,102 48,94 22,94", e: "12,58 12,100 20,92 20,64", f: "12,10 12,52 20,46 20,18",
    g: "14,55 22,50 48,50 56,55 48,60 22,60"
  };
  function digitSVG(v, gOk, cls = "") {
    const on = SEGS[v] || "";
    return `<svg class="l3-seg ${cls}" viewBox="0 0 70 110">${Object.entries(SEG_PTS).map(([s, pts]) =>
      `<polygon data-s="${s}" points="${pts}" class="${on.includes(s) && (s !== "g" || gOk) ? "on" : ""} ${s === "g" && !gOk ? "dead" : ""}"/>`).join("")}</svg>`;
  }

  // Expressão booleana: + ou | = OU, ^ = XOU, letras juntas, * · & = E, ' (depois) ou ! ~ (antes) = NÃO
  function parseBool(src) {
    const toks = [...src.toUpperCase().replace(/\s+/g, "")].map((c) => (c === "’" || c === "´" ? "'" : c === "·" || c === "&" || c === "." ? "*" : c === "|" || c === "∨" ? "+" : c === "∧" ? "*" : c === "⊕" ? "^" : c === "~" || c === "¬" ? "!" : c));
    let p = 0, lits = 0;
    const bad = (m) => { throw new Error(m); };
    const startsFactor = () => /[ABCD01(!]/.test(toks[p] || "");
    function or() { let f = xor(); while (toks[p] === "+") { p++; const a = f, b = xor(); f = (v) => a(v) | b(v); } return f; }
    function xor() { let f = and(); while (toks[p] === "^") { p++; const a = f, b = and(); f = (v) => a(v) ^ b(v); } return f; }
    function and() {
      let f = unary();
      while (toks[p] === "*" || startsFactor()) { if (toks[p] === "*") p++; const a = f, b = unary(); f = (v) => a(v) & b(v); }
      return f;
    }
    function unary() {
      if (toks[p] === "!") { p++; const a = unary(); return (v) => 1 - a(v); }
      let f = atom();
      while (toks[p] === "'") { p++; const a = f; f = (v) => 1 - a(v); }
      return f;
    }
    function atom() {
      const t = toks[p];
      if (!t) bad("A expressão terminou no meio.");
      if (/[ABCD]/.test(t)) { p++; lits++; const k = "ABCD".indexOf(t); return (v) => (v >> (3 - k)) & 1; }
      if (t === "0" || t === "1") { p++; return () => +t; }
      if (t === "(") { p++; const f = or(); if (toks[p] !== ")") bad("Falta fechar um parêntese."); p++; return f; }
      bad(`Símbolo inesperado: ${t}`);
    }
    const f = or();
    if (p < toks.length) bad(`Símbolo inesperado: ${toks[p]}`);
    return { f, lits };
  }

  let gFixed = false;
  function Display(el) {
    // Sem a lógica do g o decodificador não funciona: o display fica apagado (senão bastaria imaginar o g aceso)
    const word = (ok) => (ok ? D.displayWord.map((v) => digitSVG(v, true)).join("")
      : D.displayWord.map(() => digitSVG(-1, false)).join("") + `<div class="l3-nosig">SEM SINAL</div>`);
    const hex = "0123456789ABCDEF";
    el.innerHTML = `
      <div class="l3-disp">
        <div class="l3-disp-l">
          <h3>Decodificador hexadecimal → 7 segmentos</h3>
          <div class="l3-panel">${word(gFixed)}</div>
          <p class="l3-warn">⚠ O vírus apagou a lógica do segmento <b>g</b> (o do meio) e o decodificador parou.
            Gravem a expressão de g para o display voltar a funcionar: o vírus deixou uma palavra nele.</p>
          <form class="l3-gf">
            <label>g =</label><input placeholder="ex.: A'B + CD" autocomplete="off" spellcheck="false" ${gFixed ? "disabled" : ""}>
            <button class="primary" ${gFixed ? "disabled" : ""}>Gravar</button>
          </form>
          <div class="l3-rules"><b>Como escrever</b>
            <ul><li>Entradas <code>A</code> <code>B</code> <code>C</code> <code>D</code>, com <code>A</code> = bit mais significativo.</li>
              <li>Operadores: ${NOTATION}</li>
              <li>A memória do decodificador só cabe <b>${D.gMaxLiterals} literais</b> (cada letra conta 1).</li></ul></div>
          <p class="l2-msg">${gFixed ? "" : ""}</p>
        </div>
        <div class="l3-disp-r">
          <h3>Folha de dados — segmento g</h3>
          <table class="l2-tab l3-tt"><tr><th>Dígito</th><th>A</th><th>B</th><th>C</th><th>D</th><th>g</th></tr>
            ${D.gTable.map((g, i) => `<tr><td>${hex[i]}</td>${[3, 2, 1, 0].map((b) => `<td>${(i >> b) & 1}</td>`).join("")}<td><b>${g}</b></td></tr>`).join("")}</table>
          <div class="l3-mini">${digitSVG(8, true, "ref")}<small>Segmentos: <b>a</b> no topo, depois <b>b c d e f</b> no sentido horário e <b>g</b> no meio.</small></div>
        </div>
      </div>`;
    const form = el.querySelector("form"), input = form.querySelector("input"), msg = el.querySelector(".l2-msg");
    let busy = false;
    form.onsubmit = async (e) => {
      e.preventDefault();
      if (busy || gFixed || !input.value.trim()) return;
      let r;
      try { r = parseBool(input.value); } catch (err) { msg.className = "l2-msg"; msg.textContent = "Erro na expressão: " + err.message; return; }
      if (r.lits > D.gMaxLiterals) {
        msg.className = "l2-msg";
        msg.textContent = `A expressão tem ${r.lits} literais e só cabem ${D.gMaxLiterals}. Simplifique.`;
        return;
      }
      const wrong = D.gTable.filter((g, i) => (r.f(i) & 1) !== g).length;
      if (wrong) {
        msg.className = "l2-msg";
        msg.textContent = `Gravado... e o display não bate com a folha de dados em ${wrong} das 16 entradas.`;
        busy = true; await scare(); busy = false;
        return;
      }
      gFixed = true;
      done("display", "Display: segmento g");
      el.querySelector(".l3-panel").innerHTML = word(true);
      el.querySelector(".l3-panel").classList.add("fixed");
      form.querySelectorAll("input, button").forEach((x) => (x.disabled = true));
      msg.className = "l2-msg ok";
      msg.textContent = `✔ Segmento g consertado (${r.lits} literais).`;
    };
  }

  // ---------- decifra.c: editar só a função e executar de verdade ----------
  let userCode = D.cFunction.join("\n");
  function Decifra(el) {
    const h0 = D.cHeader.length, fnLines = () => userCode.split("\n").length;
    const lines = (arr, start) => arr.map((l, i) => `<span class="ln">${String(start + i).padStart(2, " ")}</span>${esc(l)}`).join("\n");
    el.innerHTML = `
      <div class="l2-code l3-code">
        <div class="l2-code-bar"><span>📄 decifra.c — só a função <b>decifra()</b> pode ser editada</span>
          <span><button class="l3-reset">↺ Restaurar original</button> <button class="l2-run">▶ Compilar e executar</button></span></div>
        <div class="l3-src">
          <pre class="locked">${lines(D.cHeader, 1)}</pre>
          <div class="l3-edit"><pre class="l3-gut"></pre><textarea spellcheck="false" autocomplete="off"></textarea></div>
          <pre class="locked l3-main"></pre>
        </div>
        <form class="l3-args">$ ./decifra
          <select>${D.messages.map((_, i) => `<option value="${i}">msg_${i}.txt</option>`).join("")}</select>
          <input placeholder="CHAVE" autocomplete="off" spellcheck="false"></form>
        <div class="l2-console l3-con"></div>
      </div>`;
    const ta = el.querySelector("textarea"), gut = el.querySelector(".l3-gut"), con = el.querySelector(".l3-con");
    const mainPre = el.querySelector(".l3-main"), sel = el.querySelector("select"), keyIn = el.querySelector(".l3-args input");
    ta.value = userCode;
    function sync() {
      userCode = ta.value;
      const n = fnLines();
      gut.textContent = Array.from({ length: n }, (_, i) => String(h0 + 1 + i).padStart(2, " ")).join("\n");
      ta.rows = n + 1;
      mainPre.innerHTML = lines(D.cMain, h0 + n + 1);
    }
    ta.oninput = sync;
    ta.onkeydown = (e) => {
      if (e.key !== "Tab") return;
      e.preventDefault();
      const s = ta.selectionStart;
      ta.setRangeText("    ", s, ta.selectionEnd, "end");
      sync();
    };
    sync();
    el.querySelector(".l3-reset").onclick = () => { ta.value = D.cFunction.join("\n"); sync(); con.innerHTML = ""; };

    const say = (t, cls = "") => { const d = document.createElement("div"); d.className = cls; d.textContent = t; con.appendChild(d); con.scrollTop = con.scrollHeight; };
    let busy = false;
    const run = async () => {
      if (busy) return;
      busy = true;
      con.innerHTML = "";
      try {
        const file = +sel.value, key = keyIn.value.trim().toUpperCase().replace(/\s+/g, "");
        say("$ gcc decifra.c -o decifra", "dim");
        await sleep(500);
        let prog;
        try { prog = MiniC.compile(userCode, h0 + 1); }
        catch (err) {
          if (!(err instanceof MiniC.Error)) throw err;
          say(`decifra.c:${err.line}${err.col ? ":" + err.col : ""}: erro: ${err.msg}`, "err");
          say("compilação terminada.", "err");
          return;
        }
        const ps = prog.decifra && prog.decifra.params;
        if (!ps) return say("decifra.c: erro: a função 'decifra' sumiu. Use ↺ Restaurar original.", "err");
        if (ps.length !== 3 || ps.some((p) => p.type !== "ptr")) return say("decifra.c: erro: conflito de tipos para 'decifra' (o main chama decifra(char *, char *, char *)).", "err");
        if (!key) return say("uso: ./decifra <arquivo> <CHAVE>   (digite a chave ao lado do arquivo)", "err");
        say(`$ ./decifra msg_${file}.txt ${key}`, "dim");
        await sleep(350);
        let out = "";
        const rt = MiniC.runtime(prog, { out: (t) => (out += t) });
        const enc = (s) => [...s].map((c) => c.charCodeAt(0));
        const junk = () => Array.from({ length: 64 }, () => 33 + Math.floor(Math.random() * 94));
        const msg = rt.buffer("char", 64, enc(D.messages[file]).concat(0, ...junk()));
        const k = rt.buffer("char", key.length + 1, enc(key).concat(0));
        const saida = rt.buffer("char", 64, junk().slice(0, 63).concat(0)); // lixo: não inicializada
        try { rt.call("decifra", [msg, k, saida]); }
        catch (err) {
          if (out) out.split("\n").forEach((l) => l && say(l));
          if (err instanceof MiniC.Crash) return say(err.msg, "err");
          if (err instanceof MiniC.Error) return say(`decifra.c:${err.line}${err.col ? ":" + err.col : ""}: erro: ${err.msg}`, "err");
          throw err;
        }
        out += rt.cstr(saida);
        out.split("\n").forEach((l) => say(l));
        const res = rt.cstr(saida);
        if (key === D.key && /^OKILLSWITCHE[A-Z]+$/.test(res)) done("decifra", "decifra.c consertado");
        if (key === D.key && file === D.fileIndex && res === D.finalPlain) {
          done("final", "Kill switch decifrado");
          await sleep(600);
          say("");
          say("Muito bem. Agora digam para mim. — J", "villain");
        }
      } finally { busy = false; }
    };
    el.querySelector(".l2-run").onclick = run;
    el.querySelector(".l3-args").onsubmit = (e) => { e.preventDefault(); run(); };
  }

  // ---------- Opcional: radio.exe (Morse) → ajuda da lista encadeada ----------
  const MORSE = { A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.", H: "....", I: "..", J: ".---", K: "-.-", L: ".-..", M: "--",
    N: "-.", O: "---", P: ".--.", Q: "--.-", R: ".-.", S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-", Y: "-.--", Z: "--.." };
  let actx = null;
  function Radio(el) {
    el.innerHTML = `
      <div class="l3-radio">
        <div class="l3-lamp"></div>
        <p>Um sinal se repete na frequência do J. Sem o código, ele não faz sentido.</p>
        <ol class="l3-steps"><li>Ouçam o sinal (som e lâmpada).</li><li>Decodifiquem com a tabela Morse da sala.</li><li>Digitem a frase inteira.</li></ol>
        <button class="primary l3-play">▶ Ouvir o sinal</button>
        <form class="l3-rf"><input placeholder="Mensagem decodificada" autocomplete="off" spellcheck="false"><button class="primary">Enviar</button></form>
        <p class="l2-msg"></p>
        <p class="l2-note"><b>·</b> ponto = sinal curto &nbsp;|&nbsp; <b>—</b> traço = sinal longo &nbsp;|&nbsp; pausa maior = outra letra ou palavra</p>
      </div>`;
    const lamp = el.querySelector(".l3-lamp"), msg = el.querySelector(".l2-msg"), input = el.querySelector("input");
    let playing = false, busy = false, won = helps.has("lista");
    el.querySelector(".l3-play").onclick = async () => {
      if (playing) return;
      playing = true;
      try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
      const U = 170; // rápido de propósito
      const beep = async (ms) => {
        lamp.classList.add("on");
        let o = null;
        if (actx) {
          o = actx.createOscillator(); const g = actx.createGain();
          o.frequency.value = 640; g.gain.value = 0.15; o.connect(g); g.connect(actx.destination); o.start();
        }
        await sleep(ms);
        lamp.classList.remove("on");
        if (o) o.stop();
      };
      for (const ch of D.morseWord) {
        if (!el.isConnected) break;
        if (ch === " ") { await sleep(U * 4); continue; } // pausa entre palavras (7 unidades no total)
        for (const s of MORSE[ch]) { await beep(s === "." ? U : U * 3); await sleep(U); }
        await sleep(U * 2);
      }
      playing = false;
    };
    el.querySelector("form").onsubmit = async (e) => {
      e.preventDefault();
      if (busy || !input.value.trim()) return;
      const norm = (t) => t.toUpperCase().replace(/[^A-Z]/g, "");
      if (norm(input.value) === norm(D.morseWord)) {
        msg.className = "l2-msg ok";
        msg.textContent = "✔ Sinal decodificado.";
        if (!won) { won = true; giveHelp("lista", el.querySelector(".l3-radio"), "Opcional: rádio (Morse)"); }
        return;
      }
      input.value = "";
      msg.className = "l2-msg";
      msg.textContent = "Não é isso. Escute de novo (é uma frase inteira).";
      busy = true; await scare(); busy = false;
    };
    if (won) giveHelp("lista", el.querySelector(".l3-radio"));
  }

  // ---------- Opcional: placa.exe (girar as trilhas da placa) → ajuda do Karnaugh ----------
  // Quebra-cabeça "Net": cada peça é um pedaço de trilha; girando as peças, todas precisam ficar ligadas ao chip
  // e nenhuma ponta pode ficar solta. As trilhas formam uma árvore, então só existe uma solução de verdade.
  // De tempos em tempos o J gira algumas peças sozinho.
  const NET = { size: 6, jEverySeconds: 50, jTiles: 2 };
  const U = 1, R = 2, Dn = 4, L = 8, DIRS = [[U, 0, -1, Dn], [R, 1, 0, L], [Dn, 0, 1, U], [L, -1, 0, R]];
  const rot = (m) => ((m << 1) | (m >> 3)) & 15; // gira 90° no sentido horário
  function makeBoard(n) {
    const g = Array(n * n).fill(0), seen = new Set(), src = Math.floor(n / 2) * n + Math.floor(n / 2);
    const stack = [src];
    seen.add(src);
    while (stack.length) { // árvore aleatória (busca em profundidade)
      const c = stack[stack.length - 1], x = c % n, y = Math.floor(c / n);
      const opts = DIRS.filter(([, dx, dy]) => { const nx = x + dx, ny = y + dy; return nx >= 0 && ny >= 0 && nx < n && ny < n && !seen.has(ny * n + nx); });
      if (!opts.length) { stack.pop(); continue; }
      const [b, dx, dy, back] = opts[Math.floor(Math.random() * opts.length)], nc = (y + dy) * n + x + dx;
      g[c] |= b; g[nc] |= back; seen.add(nc); stack.push(nc);
    }
    return { g, src };
  }
  let board = null; // a placa sorteada fica guardada: fechar a janela não perde o progresso
  function Placa(el) {
    const n = NET.size;
    if (helps.has("kmap")) return (el.innerHTML = `<div class="l3-pad">${helpHTML("kmap")}</div>`);
    if (!board) {
      board = makeBoard(n);
      const solved = board.g.slice();
      do { board.g = solved.map((m) => { for (let k = Math.floor(Math.random() * 4); k > 0; k--) m = rot(m); return m; }); }
      while (board.g.every((m, i) => m === solved[i]));
    }
    const { g, src } = board;
    el.innerHTML = `
      <div class="l3-net">
        <p>O J embaralhou as trilhas da placa do decodificador.</p>
        <ol class="l3-steps"><li><b>Cliquem</b> numa peça para girá-la (botão direito gira para o outro lado).</li>
          <li>Liguem <b>todas</b> as peças ao chip do centro.</li><li>Não pode sobrar <b>nenhuma ponta solta</b>.</li></ol>
        <div class="l3-grid" style="grid-template-columns: repeat(${n}, 1fr)"></div>
        <p class="l2-note">Peças ligadas: <b class="l3-cnt"></b> · Pontas soltas: <b class="l3-loose"></b></p>
        <p class="l2-msg"></p>
      </div>`;
    const grid = el.querySelector(".l3-grid"), msg = el.querySelector(".l2-msg");
    const cells = g.map((_, i) => {
      const c = document.createElement("div");
      c.className = "l3-tile" + (i === src ? " src" : "");
      c.onclick = () => turn(i, 1);
      c.oncontextmenu = (e) => { e.preventDefault(); turn(i, 3); };
      grid.appendChild(c);
      return c;
    });
    let won = false, timer = null;
    const nb = (i, [, dx, dy]) => { const x = i % n + dx, y = Math.floor(i / n) + dy; return x >= 0 && y >= 0 && x < n && y < n ? y * n + x : -1; };
    function draw() {
      // liga a partir do chip: só passa onde as duas peças se encostam
      const lit = new Set([src]), q = [src];
      while (q.length) {
        const c = q.shift();
        for (const d of DIRS) {
          const o = nb(c, d);
          if (o >= 0 && g[c] & d[0] && g[o] & d[3] && !lit.has(o)) { lit.add(o); q.push(o); }
        }
      }
      let loose = 0;
      g.forEach((m, i) => DIRS.forEach((d) => { if (m & d[0]) { const o = nb(i, d); if (o < 0 || !(g[o] & d[3])) loose++; } }));
      cells.forEach((c, i) => {
        const m = g[i], leaf = [1, 2, 4, 8].includes(m);
        c.classList.toggle("lit", lit.has(i));
        c.innerHTML = `<svg viewBox="0 0 40 40">${m & U ? '<line x1="20" y1="20" x2="20" y2="0"/>' : ""}${m & R ? '<line x1="20" y1="20" x2="40" y2="20"/>' : ""}
          ${m & Dn ? '<line x1="20" y1="20" x2="20" y2="40"/>' : ""}${m & L ? '<line x1="20" y1="20" x2="0" y2="20"/>' : ""}
          ${i === src ? '<rect x="11" y="11" width="18" height="18" rx="2"/>' : leaf ? '<circle cx="20" cy="20" r="6"/>' : '<circle cx="20" cy="20" r="3"/>'}</svg>`;
      });
      el.querySelector(".l3-cnt").textContent = `${lit.size} / ${n * n}`;
      el.querySelector(".l3-loose").textContent = loose;
      if (!won && lit.size === n * n && loose === 0) win();
    }
    function turn(i, times) {
      if (won) return;
      for (let k = 0; k < times; k++) g[i] = rot(g[i]);
      draw();
    }
    function win() {
      won = true;
      clearInterval(timer);
      msg.className = "l2-msg ok";
      msg.textContent = "✔ Placa religada. O decodificador está de pé.";
      el.querySelector(".l3-net").classList.add("done");
      giveHelp("kmap", el.querySelector(".l3-net"), "Opcional: placa (trilhas)");
    }
    // O J mexe na placa
    timer = setInterval(() => {
      if (!el.isConnected) return clearInterval(timer);
      if (won) return;
      for (let k = 0; k < NET.jTiles; k++) {
        const i = Math.floor(Math.random() * n * n);
        g[i] = rot(g[i]);
        cells[i].classList.remove("jflash"); void cells[i].offsetWidth; cells[i].classList.add("jflash");
      }
      msg.className = "l2-msg";
      msg.textContent = "J: eu mexi na sua placa. :)";
      draw();
    }, NET.jEverySeconds * 1000);
    draw();
  }

  // Minijogo antigo vencido: a janela passa a mostrar a ajuda
  async function afterWin(el, key, label) {
    await sleep(1200);
    el.innerHTML = `<div class="l3-pad"><p class="l2-msg ok">✔ Vocês venceram. O J deixou isto para trás:</p></div>`;
    giveHelp(key, el.firstChild, label);
  }

  // ---------- Opcional: energia.exe (painel de fios) → ajuda do registrador ----------
  function Energia(el, api) {
    if (helps.has("reg")) return (el.innerHTML = `<div class="l3-pad">${helpHTML("reg")}</div>`);
    WiresGame(el, { ...api, options: { pinout: D.pinout, manualInRoom: true, resetOnShort: true, onShort: scare },
      win: () => afterWin(el, "reg", "Opcional: energia (fios)") });
  }

  // ---------- Opcional: invasao.exe (terminal hacker) → ajuda do decifra.c ----------
  function Invasao(el, api) {
    if (helps.has("c")) return (el.innerHTML = `<div class="l3-pad">${helpHTML("c")}</div>`);
    TerminalGame(el, { ...api, options: { noTips: true, traceSeconds: 75 }, win: () => afterWin(el, "c", "Opcional: invasão (terminal)") });
  }

  // ---------- Lixeira (armadilha) ----------
  function Lixeira(el) {
    el.innerHTML = `<div class="l3-files">
      <div class="l3-file l3-trap"><b>💀 kill_switch.exe</b><small>clique duas vezes para executar</small></div>
      <div class="l3-file"><b>📄 prova_1sem.txt</b><small>Fundamentos de Programação: 9,5</small></div>
      <div class="l3-file"><b>📄 prova_3sem.txt</b><small>Estruturas de Dados: 0,0 — Segmentation fault</small></div></div>`;
    el.querySelector(".l3-trap").ondblclick = async () => {
      OS.notify("Executando kill_switch.exe ...");
      await sleep(500);
      await Interference.scare("nivel3_armadilha");
      OS.notify("Achou que seria tão fácil?");
    };
  }

  APPS.length = 0;
  APPS.push(
    { id: "prova", title: "prova_final.txt", icon: "📄", width: 720, height: 560, render: text(D.intro) },
    { id: "lista", title: "lista.c", icon: "🔗", width: 600, height: 400, render: code("lista.c", D.listC) },
    { id: "display", title: "display.exe", icon: "🔢", width: 920, height: 600, render: Display },
    { id: "registrador", title: "registrador.log", icon: "⏱️", width: 580, height: 400, render: Registrador },
    { id: "mensagens", title: "mensagens", icon: "🗂️", width: 560, height: 480, render: Mensagens },
    { id: "decifra", title: "decifra.c", icon: "📝", width: 860, height: 640, render: Decifra },
    { id: "radio", title: "radio.exe", icon: "📻", width: 520, height: 520, render: Radio },
    { id: "placa", title: "placa.exe", icon: "🧩", width: 560, height: 680, render: Placa },
    { id: "energia", title: "energia.exe", icon: "⚡", width: 860, height: 560, render: Energia },
    { id: "invasao", title: "invasao.exe", icon: "💻", width: 760, height: 480, render: Invasao },
    { id: "diario", title: "diario.txt", icon: "📓", width: 620, height: 400, render: text(D.diary) },
    { id: "ajudas", title: "ajudas.txt", icon: "💡", width: 720, height: 560, hidden: true, render: Ajudas },
    { id: "lixeira", title: "Lixeira", icon: "🗑️", width: 460, height: 300, render: Lixeira }
  );
})();
