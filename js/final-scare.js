// ===== SUSTO DA SENHA FINAL ERRADA (projetor, Nível 1) =====
// Uso: await FinalScare.play()  — cena inteira em HTML/CSS + som gerado pelo navegador (WebAudio):
//  1. "PARABÉNS," ... (alguns segundos) ... "VOCÊ ERROU." + luz vermelha na tela
//  2. corte seco para o preto
//  3. cmd rodando código com som ambiente calmo
//  4. o código trava → chuva de erros, projetor "hackeado", alarme crescente
//  5. os erros correm para as bordas e formam um anel com o centro vazio
//  6. dois olhos vermelhos abrem → boca brava → a boca vira um sorriso
//  7. a máscara pula para fora do projetor (grito) → corte para o preto
window.FinalScare = (() => {
  const C = window.CONFIG || {};
  const VOL = C.scareVolume == null ? 1 : C.scareVolume;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  let running = false, ac = null, master = null;

  const CODE = [
    "C:\\> projetor.exe --conectar SALA", "Iniciando driver de vídeo ............ OK", "Carregando slides_aula.ppt ........... OK",
    "for (int i = 0; i < alunos; i++) {", "    if (senha[i] == resposta) liberar(i);", "}", "Verificando senha ...",
    "Comparando hash 0x5F3A9C ...", "Acesso ao projetor: 192.168.6.66", "Sincronizando quadros 24fps ...", "Enviando imagem ............... 64%",
    "mov eax, [0x6F6F6F]", "push ebp", "call verificar_resposta", "Lendo memória de vídeo ............. OK"
  ];
  const ERRS = [
    ["Erro crítico", "Exceção 0x0000666 em PROJETOR.SYS"], ["Projetor", "Sinal de vídeo interceptado."],
    ["Falha de memória", "A instrução em 0x6F6F6F referenciou memória em 0x00000000."], ["Aviso", "Um invasor assumiu o controle da imagem."],
    ["Erro", "SENHA INCORRETA"], ["Erro fatal", "VOCÊS ERRARAM"], ["Sistema", "As notas estão sendo apagadas."], ["Segurança", "Câmera ativada remotamente."]
  ];

  // ---------- Som (WebAudio) ----------
  function audio() {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    if (ac.state === "suspended") ac.resume();
    master = ac.createGain(); master.gain.value = VOL; master.connect(ac.destination);
  }
  function noise(secs) {
    const b = ac.createBuffer(1, ac.sampleRate * secs, ac.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const s = ac.createBufferSource(); s.buffer = b; return s;
  }
  function env(g, t, peak, a, hold, r) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + a);
    g.gain.setValueAtTime(peak, t + a + hold);
    g.gain.exponentialRampToValueAtTime(0.0001, t + a + hold + r);
  }
  // Ambiente: zumbido grave + ventoinha do projetor. Volta um controle para aumentar a intensidade.
  function ambient() {
    const t = ac.currentTime, out = ac.createGain(); out.gain.value = 0.0001; out.connect(master);
    out.gain.exponentialRampToValueAtTime(0.18, t + 1);
    const lp = ac.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 300; lp.connect(out);
    const oscs = [55, 57.5, 110].map((f) => { const o = ac.createOscillator(); o.type = "sine"; o.frequency.value = f; o.connect(lp); o.start(); return o; });
    const fan = noise(30); const bp = ac.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 900; bp.Q.value = 0.7;
    const fg = ac.createGain(); fg.gain.value = 0.25; fan.connect(bp).connect(fg).connect(out); fan.start();
    return {
      intense(secs) { const n = ac.currentTime; lp.frequency.exponentialRampToValueAtTime(2400, n + secs); out.gain.exponentialRampToValueAtTime(0.45, n + secs);
        oscs.forEach((o, i) => o.frequency.exponentialRampToValueAtTime(o.frequency.value * (1.5 + i * 0.1), n + secs)); },
      stop() { const n = ac.currentTime; out.gain.cancelScheduledValues(n); out.gain.setValueAtTime(out.gain.value, n); out.gain.exponentialRampToValueAtTime(0.0001, n + 0.05);
        setTimeout(() => { oscs.forEach((o) => o.stop()); fan.stop(); }, 100); }
    };
  }
  function click() {
    const s = noise(0.03), g = ac.createGain(), f = ac.createBiquadFilter(); f.type = "highpass"; f.frequency.value = 2000;
    env(g, ac.currentTime, 0.12, 0.002, 0.005, 0.02); s.connect(f).connect(g).connect(master); s.start();
  }
  function beep(freq, len = 0.07, vol = 0.12, type = "square") {
    const o = ac.createOscillator(), g = ac.createGain(); o.type = type; o.frequency.value = freq;
    env(g, ac.currentTime, vol, 0.004, len, 0.03); o.connect(g).connect(master); o.start(); o.stop(ac.currentTime + len + 0.1);
  }
  function stutter() { for (let i = 0; i < 6; i++) setTimeout(() => beep(rand(80, 400), 0.03, 0.15, "sawtooth"), i * 60); }
  function siren(secs) {
    const o = ac.createOscillator(), g = ac.createGain(); o.type = "sawtooth";
    o.frequency.setValueAtTime(220, ac.currentTime); o.frequency.exponentialRampToValueAtTime(900, ac.currentTime + secs);
    env(g, ac.currentTime, 0.06, secs * 0.8, 0.01, 0.15); o.connect(g).connect(master); o.start(); o.stop(ac.currentTime + secs + 0.3);
  }
  function drone(secs) {
    const t = ac.currentTime, o = ac.createOscillator(), lfo = ac.createOscillator(), lg = ac.createGain(), g = ac.createGain();
    o.type = "sine"; o.frequency.value = 38; lfo.frequency.value = 5; lg.gain.value = 0.12; lfo.connect(lg).connect(g.gain);
    env(g, t, 0.35, 0.3, secs - 0.5, 0.2); o.connect(g).connect(master); o.start(); lfo.start(); o.stop(t + secs + 0.3); lfo.stop(t + secs + 0.3);
  }
  function breath() {
    const s = noise(1.6), f = ac.createBiquadFilter(), g = ac.createGain(); f.type = "bandpass"; f.frequency.value = 500; f.Q.value = 1.5;
    env(g, ac.currentTime, 0.5, 0.7, 0.1, 0.7); s.connect(f).connect(g).connect(master); s.start();
  }
  function growl(secs) {
    const t = ac.currentTime, o = ac.createOscillator(), lfo = ac.createOscillator(), lg = ac.createGain(), f = ac.createBiquadFilter(), g = ac.createGain();
    o.type = "sawtooth"; o.frequency.value = 65; lfo.frequency.value = 18; lg.gain.value = 12; lfo.connect(lg).connect(o.frequency);
    f.type = "lowpass"; f.frequency.value = 420; env(g, t, 0.3, 0.25, secs - 0.4, 0.15);
    o.connect(f).connect(g).connect(master); o.start(); lfo.start(); o.stop(t + secs + 0.2); lfo.stop(t + secs + 0.2);
  }
  function rise(secs) {
    const t = ac.currentTime, o = ac.createOscillator(), g = ac.createGain(); o.type = "triangle";
    o.frequency.setValueAtTime(180, t); o.frequency.exponentialRampToValueAtTime(1400, t + secs);
    env(g, t, 0.2, secs * 0.9, 0.01, 0.05); o.connect(g).connect(master); o.start(); o.stop(t + secs + 0.1);
  }
  function scream() {
    if (C.sounds && C.sounds.scare) { const a = new Audio(C.sounds.scare); a.volume = VOL; a.play().catch(() => {}); return; }
    const t = ac.currentTime, dur = 1.6, out = ac.createGain();
    out.gain.setValueAtTime(1, t); out.gain.exponentialRampToValueAtTime(0.01, t + dur);
    const sh = ac.createWaveShaper(), curve = new Float32Array(1024);
    for (let i = 0; i < 1024; i++) { const x = i / 512 - 1; curve[i] = Math.tanh(x * 9); }
    sh.curve = curve; sh.connect(out).connect(master);
    [0, 7, -5, 13].forEach((det, i) => {
      const o = ac.createOscillator(), lfo = ac.createOscillator(), lg = ac.createGain(), og = ac.createGain();
      o.type = i % 2 ? "sawtooth" : "square"; o.frequency.setValueAtTime(950 + det * 10, t); o.frequency.exponentialRampToValueAtTime(320, t + dur);
      lfo.frequency.value = 30 + i * 3; lg.gain.value = 130; lfo.connect(lg).connect(o.frequency);
      og.gain.value = 0.3; o.connect(og).connect(sh); o.start(t); lfo.start(t); o.stop(t + dur); lfo.stop(t + dur);
    });
    const n = noise(dur), ng = ac.createGain(); ng.gain.value = 0.5; n.connect(ng).connect(sh); n.start(t);
    // Impacto grave
    const k = ac.createOscillator(), kg = ac.createGain(); k.frequency.setValueAtTime(90, t); k.frequency.exponentialRampToValueAtTime(30, t + 0.4);
    env(kg, t, 1, 0.005, 0.05, 0.4); k.connect(kg).connect(master); k.start(t); k.stop(t + 0.6);
  }

  // ---------- Rosto (SVG): começa só com olhos e boca no escuro; a máscara aparece no salto ----------
  const MOUTH = { angry: "M72 196 Q100 180 128 196" }; // o sorriso e as outras expressões ficam no CSS (#fs)
  const BROW = { angry: ["M40 72 L86 86", "M160 72 L114 86"] };
  const FACE = `<svg viewBox="0 0 200 240" class="fs-face">
    <g class="fs-mask"><ellipse cx="100" cy="120" rx="86" ry="112" fill="#f1ede2"/>
      <circle cx="42" cy="158" r="20" fill="#c00"/><circle cx="158" cy="158" r="20" fill="#c00"/>
      <path d="M42 158 m-12 0 a12 12 0 1 0 24 0 a8 8 0 1 0 -16 0 a4 4 0 1 0 8 0" stroke="#600" stroke-width="2" fill="none"/>
      <path d="M158 158 m-12 0 a12 12 0 1 0 24 0 a8 8 0 1 0 -16 0 a4 4 0 1 0 8 0" stroke="#600" stroke-width="2" fill="none"/>
      <ellipse cx="62" cy="98" rx="24" ry="27" fill="#000"/><ellipse cx="138" cy="98" rx="24" ry="27" fill="#000"/></g>
    <path class="fs-brow l" d="${BROW.angry[0]}" stroke="#f22" stroke-width="5" stroke-linecap="round"/>
    <path class="fs-brow r" d="${BROW.angry[1]}" stroke="#f22" stroke-width="5" stroke-linecap="round"/>
    <g class="fs-eyes"><circle cx="62" cy="100" r="8" fill="#ff1a1a"/><circle cx="138" cy="100" r="8" fill="#ff1a1a"/></g>
    <path class="fs-mouth" d="${MOUTH.angry}" stroke="#d00" stroke-width="6" fill="none" stroke-linecap="round"/>
  </svg>`;

  // ---------- A cena ----------
  async function play() {
    if (running) return;
    running = true;
    try { audio(); } catch (e) { ac = null; }
    const A = (fn, ...args) => { try { ac && fn(...args); } catch (e) {} };
    const L = document.createElement("div");
    L.id = "fs";
    document.body.appendChild(L);

    // 1. "PARABÉNS," ... "VOCÊ ERROU." + luz vermelha
    L.innerHTML = `<div class="fs-msg"><h1>PARABÉNS,</h1><h2 class="fs-err">VOCÊ ERROU.</h2></div>`;
    await sleep(2600);
    L.classList.add("red");
    L.querySelector(".fs-err").classList.add("show");
    A(beep, 110, 0.6, 0.25, "sawtooth");
    await sleep(2600);

    // 2. Corte seco para o preto
    L.className = "black";
    L.innerHTML = "";
    await sleep(900);

    // 3. cmd rodando código, som calmo
    const amb = ac ? ambient() : null;
    L.innerHTML = `<div class="fs-cmd"><div class="hack-bar">C:\\Windows\\system32\\cmd.exe<span>✕</span></div><pre></pre></div>`;
    const cmd = L.querySelector(".fs-cmd"), pre = cmd.querySelector("pre");
    const t0 = Date.now();
    while (Date.now() - t0 < 2600) {
      pre.textContent += pick(CODE) + "\n";
      pre.scrollTop = pre.scrollHeight;
      A(click);
      await sleep(rand(70, 160));
    }

    // 4. Trava → chuva de erros, ambiente mais intenso, alarme crescente
    cmd.classList.add("freeze");
    A(stutter);
    await sleep(550);
    amb && amb.intense(3.6);
    A(siren, 3.6);
    L.classList.add("hacked");
    const errs = [];
    const tE = Date.now();
    for (let i = 0; Date.now() - tE < 3600; i++) {
      const [title, msg] = pick(ERRS), e = document.createElement("div");
      e.className = "hack-err fs-e";
      e.style.left = rand(-5, 80) + "vw"; e.style.top = rand(-5, 80) + "vh";
      e.innerHTML = `<div class="hack-bar red">${title}<span>✕</span></div><div class="hack-err-body"><b>✖</b><span>${msg}</span></div>`;
      L.appendChild(e); errs.push(e);
      A(beep, pick([880, 1200, 660, 1500]), 0.05, 0.08);
      await sleep(Math.max(25, 170 - i * 4));
    }

    // 5. Os erros param e vão para as bordas, formando um anel com o centro vazio
    amb && amb.stop();
    L.classList.remove("hacked");
    cmd.remove();
    A(drone, 6.5);
    const cx = innerWidth / 2, cy = innerHeight / 2, R = Math.min(innerWidth, innerHeight) * 0.46;
    errs.forEach((e) => {
      const r = e.getBoundingClientRect(), ex = r.left + r.width / 2, ey = r.top + r.height / 2;
      const a = Math.atan2(ey - cy, ex - cx) + rand(-0.05, 0.05), d = R * rand(0.95, 1.25);
      e.style.transition = `transform ${rand(0.7, 1.1)}s cubic-bezier(.7,0,.3,1)`;
      e.style.transform = `translate(${cx + Math.cos(a) * d * 1.35 - ex}px, ${cy + Math.sin(a) * d - ey}px) rotate(${rand(-25, 25)}deg) scale(.8)`;
    });
    await sleep(1300);

    // 6. Olhos vermelhos abrem no centro → boca brava → sorriso
    const wrap = document.createElement("div");
    wrap.className = "fs-face-wrap";
    wrap.innerHTML = FACE;
    L.appendChild(wrap);
    const svg = wrap.querySelector("svg");
    svg.classList.add("eyes");
    A(breath);
    await sleep(1200);
    svg.classList.add("angry");
    A(growl, 1.7);
    await sleep(1700);
    svg.classList.add("smile"); // a boca abre num sorriso, os olhos se estreitam (transições do CSS)
    A(rise, 1.1);
    await sleep(1150);

    // 7. A máscara pula do projetor → grito → preto
    errs.forEach((e) => e.remove());
    svg.classList.add("lunge");
    A(scream);
    await sleep(380);
    L.classList.add("shake");
    await sleep(650);
    L.className = "black";
    L.innerHTML = "";
    await sleep(900);
    L.remove();
    running = false;
  }

  return { play, get running() { return running; } };
})();
