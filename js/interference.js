// ===== INTERFERÊNCIA DO HACKER + JUMP SCARE =====
// Uso: Interference.run().then(() => ...)  — janelas de cmd e erros se sobrepondo,
// tela falhando, silêncio e, por fim, o susto com som alto.
// Interference.scare() — só o susto (tela preta + rosto + grito).
// Interference.mock(texto) — máscara neutra com uma frase, sem susto.
window.Interference = (() => {
  const C = window.CONFIG;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  let running = false, actx = null;

  const CMD_LINES = [
    "C:\\Windows\\system32> net user convidado /delete",
    "Acessando câmera 01... OK", "Acessando câmera 02... OK",
    "del /f /s /q C:\\Usuarios\\*", "Copiando arquivos para 192.168.6.66...",
    "format C: /y", "Desativando antivírus... OK", "Injetando payload JIGSAW.EXE",
    "Sobrescrevendo BIOS... 34%", "Sobrescrevendo BIOS... 67%",
    "EU ESTOU VENDO VOCÊ", "Rastreando localização... SALA N112",
    "Sobrescrevendo BIOS... 100%", "Upload de notas: zerando prova de lógica...",
    "taskkill /f /im explorer.exe", "VOCÊ NÃO DEVERIA TER FEITO ISSO"
  ];
  const ERRORS = [
    ["Erro crítico", "Exceção 0x0000666 em JIGSAW.SYS"], ["Windows", "O sistema foi comprometido."],
    ["Falha de memória", "A instrução em 0x6F6F6F referenciou memória em 0x00000000."],
    ["Aviso", "Um invasor assumiu o controle desta máquina."], ["Erro", "Arquivo corrompido: placa_mae.bin"],
    ["Segurança", "Câmera ativada remotamente."], ["Erro fatal", "VOCÊ NÃO VAI SAIR DAQUI"],
    ["Sistema", "Seus arquivos estão sendo excluídos."]
  ];

  // ---------- Áudio ----------
  function ctx() {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    if (actx.state === "suspended") actx.resume();
    return actx;
  }
  function noiseBuffer(a, secs) {
    const b = a.createBuffer(1, a.sampleRate * secs, a.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return b;
  }
  // Estática + bipes durante a invasão
  function staticSound(secs) {
    try {
      const a = ctx(), g = a.createGain(), src = a.createBufferSource();
      src.buffer = noiseBuffer(a, secs);
      g.gain.value = 0.08 * C.scareVolume;
      src.connect(g).connect(a.destination); src.start();
      for (let t = 0; t < secs; t += rand(0.15, 0.5)) {
        const o = a.createOscillator(), og = a.createGain();
        o.type = "square"; o.frequency.value = pick([440, 880, 660, 1200, 220]);
        og.gain.setValueAtTime(0.05 * C.scareVolume, a.currentTime + t);
        og.gain.setValueAtTime(0, a.currentTime + t + 0.08);
        o.connect(og).connect(a.destination); o.start(a.currentTime + t); o.stop(a.currentTime + t + 0.1);
      }
    } catch (e) {}
  }
  // Grito sintetizado (usado se não houver sounds.scare)
  function scream() {
    if (C.sounds && C.sounds.scare) { const au = new Audio(C.sounds.scare); au.volume = C.scareVolume; au.play().catch(() => {}); return; }
    try {
      const a = ctx(), t = a.currentTime, dur = 1.8;
      const master = a.createGain();
      master.gain.setValueAtTime(C.scareVolume, t);
      master.gain.exponentialRampToValueAtTime(0.01, t + dur);
      const shaper = a.createWaveShaper(), curve = new Float32Array(1024);
      for (let i = 0; i < 1024; i++) { const x = i / 512 - 1; curve[i] = Math.tanh(x * 8); }
      shaper.curve = curve;
      shaper.connect(master).connect(a.destination);
      [0, 7, -5, 13].forEach((det, i) => {
        const o = a.createOscillator(), lfo = a.createOscillator(), lg = a.createGain();
        o.type = i % 2 ? "sawtooth" : "square";
        o.frequency.setValueAtTime(900 + det * 10, t);
        o.frequency.exponentialRampToValueAtTime(300 + det * 5, t + dur);
        lfo.frequency.value = 28 + i * 3; lg.gain.value = 120;
        lfo.connect(lg).connect(o.frequency);
        const og = a.createGain(); og.gain.value = 0.3;
        o.connect(og).connect(shaper); o.start(t); lfo.start(t); o.stop(t + dur); lfo.stop(t + dur);
      });
      const n = a.createBufferSource(), ng = a.createGain();
      n.buffer = noiseBuffer(a, dur); ng.gain.value = 0.5;
      n.connect(ng).connect(shaper); n.start(t);
    } catch (e) {}
  }

  // ---------- Elementos visuais ----------
  function layer() {
    const l = document.createElement("div");
    l.id = "hack-layer";
    document.body.appendChild(l);
    return l;
  }
  function cmdWindow(l) {
    const w = document.createElement("div");
    w.className = "hack-cmd";
    Object.assign(w.style, { left: rand(0, 70) + "vw", top: rand(0, 65) + "vh", width: rand(300, 520) + "px" });
    w.innerHTML = `<div class="hack-bar">C:\\Windows\\system32\\cmd.exe</div><pre></pre>`;
    l.appendChild(w);
    const pre = w.querySelector("pre");
    let i = 0;
    const t = setInterval(() => {
      if (!w.isConnected || i++ > 30) return clearInterval(t);
      pre.textContent += pick(CMD_LINES) + "\n";
      pre.scrollTop = pre.scrollHeight;
    }, rand(60, 160));
  }
  function errorBox(l) {
    const [title, msg] = pick(ERRORS);
    const e = document.createElement("div");
    e.className = "hack-err";
    Object.assign(e.style, { left: rand(0, 75) + "vw", top: rand(0, 75) + "vh" });
    e.innerHTML = `<div class="hack-bar red">${title}<span>✕</span></div><div class="hack-err-body"><b>✖</b><span>${msg}</span></div><div class="hack-err-btn"><button>OK</button></div>`;
    l.appendChild(e);
  }
  function scareFace() {
    if (C.scareImage) return `<img src="${C.scareImage}" alt="">`;
    // Rosto do boneco desenhado em SVG
    return `<svg viewBox="0 0 200 240" class="hack-face">
      <ellipse cx="100" cy="120" rx="85" ry="110" fill="#f1ede2"/>
      <ellipse cx="62" cy="95" rx="24" ry="28" fill="#000"/><ellipse cx="138" cy="95" rx="24" ry="28" fill="#000"/>
      <circle cx="62" cy="98" r="7" fill="#f00"/><circle cx="138" cy="98" r="7" fill="#f00"/>
      <circle cx="42" cy="155" r="20" fill="#c00"/><circle cx="158" cy="155" r="20" fill="#c00"/>
      <path d="M42 155 m-12 0 a12 12 0 1 0 24 0 a8 8 0 1 0 -16 0 a4 4 0 1 0 8 0" stroke="#600" stroke-width="2" fill="none"/>
      <path d="M158 155 m-12 0 a12 12 0 1 0 24 0 a8 8 0 1 0 -16 0 a4 4 0 1 0 8 0" stroke="#600" stroke-width="2" fill="none"/>
      <path d="M70 185 Q100 200 130 185" stroke="#900" stroke-width="7" fill="none"/>
      <path d="M72 188 L72 225 M128 188 L128 225" stroke="#111" stroke-width="3"/>
    </svg>`;
  }

  async function run() {
    if (running) return;
    running = true;
    document.activeElement && document.activeElement.blur();
    const l = layer();

    // 1. Aviso
    const warn = document.createElement("div");
    warn.className = "hack-warn";
    warn.innerHTML = "⚠ ALERTA ⚠<br><small>O HACKER ESTÁ TENTANDO INTERFERIR</small>";
    l.appendChild(warn);
    document.body.classList.add("hacked");
    staticSound(7);
    await sleep(1800);
    warn.remove();

    // 2. Janelas se sobrepondo, cada vez mais rápido
    for (let i = 0; i < 34; i++) {
      (i % 3 === 0 ? errorBox : cmdWindow)(l);
      if (i % 2) errorBox(l);
      await sleep(Math.max(40, 260 - i * 8));
    }
    l.classList.add("glitch");
    await sleep(1400);

    // 3. Silêncio e escuridão
    l.innerHTML = "";
    l.classList.remove("glitch");
    l.classList.add("dark");
    await sleep(1600);

    // 4. Susto
    l.innerHTML = `<div class="hack-scare">${scareFace()}</div>`;
    scream();
    await sleep(1700);

    // 5. Volta ao normal
    l.remove();
    document.body.classList.remove("hacked");
    running = false;
  }

  // Só o susto, sem as janelas de erro
  async function scare() {
    if (running) return;
    running = true;
    document.activeElement && document.activeElement.blur();
    const l = layer();
    l.classList.add("dark");
    await sleep(500);
    l.innerHTML = `<div class="hack-scare">${scareFace()}</div>`;
    scream();
    await sleep(1700);
    l.remove();
    running = false;
  }

  // Máscara neutra (easter egg): sem susto, só a cara e uma pergunta
  function mockFace() {
    if (C.mockImage) return `<img src="${C.mockImage}" alt="">`;
    return `<svg viewBox="0 0 200 240" class="hack-face">
      <ellipse cx="100" cy="120" rx="85" ry="110" fill="#f1ede2"/>
      <ellipse cx="62" cy="95" rx="22" ry="24" fill="#000"/><ellipse cx="138" cy="95" rx="22" ry="24" fill="#000"/>
      <circle cx="62" cy="97" r="5" fill="#f00"/><circle cx="138" cy="97" r="5" fill="#f00"/>
      <circle cx="42" cy="155" r="18" fill="#c00"/><circle cx="158" cy="155" r="18" fill="#c00"/>
      <path d="M76 188 L124 188" stroke="#900" stroke-width="6" stroke-linecap="round"/>
    </svg>`;
  }
  async function mock(text) {
    if (running) return;
    running = true;
    document.activeElement && document.activeElement.blur();
    const l = layer();
    l.classList.add("mock");
    l.innerHTML = `<div class="hack-mock">${mockFace()}<p>${text}</p></div>`;
    await sleep(3800);
    l.remove();
    running = false;
  }

  // Atalho do mestre do jogo para testar
  addEventListener("keydown", (e) => { if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "h") run(); });

  return { run, scare, mock, get running() { return running; } };
})();
