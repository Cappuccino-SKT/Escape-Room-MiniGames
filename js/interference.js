// ===== INTERFERÊNCIA DO HACKER + JUMP SCARE =====
// Uso: Interference.run().then(() => ...)  — janelas de cmd e erros se sobrepondo,
// tela falhando, silêncio e, por fim, o susto com som alto.
// Interference.scare(lugar) — só o susto (vídeo/imagem do lugar, ou a máscara desenhada + BRAAAM). A entrada é sorteada
//   (sem aviso, puxada, silêncio com coração, falso alívio) e, às vezes, vem uma réplica segundos depois.
// Interference.error(lugar) — para ERROS: só às vezes vira susto (CONFIG.scareRules); nas outras, um efeito leve.
// Lugares e vídeos: CONFIG.scareMedia (pasta videos/).
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
    "EU ESTOU VENDO VOCÊ", "Rastreando localização... SALA N011",
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
  // Guincho estridente: só nos sustos rápidos SEM a máscara (o "rasgo" dos erros). A máscara usa maskHit().
  // Camadas: impacto grave → guincho agudo com notas desafinadas (meio-tom) e vibrato → arranhado metálico → zumbido no ouvido.
  function shriek(a, dest, vol = 1, dur = 2.2) {
    const t = a.currentTime;
    const comp = a.createDynamicsCompressor();
    comp.threshold.value = -20; comp.ratio.value = 12; comp.attack.value = 0.002; comp.release.value = 0.25;
    const out = a.createGain();
    out.gain.setValueAtTime(0.0001, t);
    out.gain.exponentialRampToValueAtTime(vol, t + 0.02);
    out.gain.setValueAtTime(vol, t + dur * 0.65);
    out.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    // limitador no fim: alto, mas sem estourar as caixas de som
    const lim = a.createDynamicsCompressor();
    lim.threshold.value = -3; lim.knee.value = 0; lim.ratio.value = 20; lim.attack.value = 0.001; lim.release.value = 0.1;
    const trim = a.createGain(); trim.gain.value = 0.9;
    lim.connect(trim).connect(dest);
    comp.connect(out).connect(lim);
    // distorção pesada + corte dos graves: o som fica fino e áspero
    const sh = a.createWaveShaper(), curve = new Float32Array(2048);
    for (let i = 0; i < 2048; i++) { const x = i / 1024 - 1; curve[i] = Math.tanh(x * 14); }
    sh.curve = curve;
    const hp = a.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 900;
    sh.connect(hp).connect(comp);
    // guincho: 5 vozes agudas quase iguais (batem entre si), sobem no ataque e desabam no fim
    [2600, 2760, 3100, 3480, 4150].forEach((f, i) => {
      const o = a.createOscillator(), og = a.createGain(), vib = a.createOscillator(), vg = a.createGain();
      o.type = i % 2 ? "sawtooth" : "square";
      o.frequency.setValueAtTime(f * 0.7, t);
      o.frequency.exponentialRampToValueAtTime(f, t + 0.12);
      o.frequency.exponentialRampToValueAtTime(f * 1.18, t + dur * 0.7);
      o.frequency.exponentialRampToValueAtTime(f * 0.55, t + dur);
      vib.frequency.value = 9 + i * 1.7; vg.gain.value = f * 0.045; // vibrato rápido e irregular
      vib.connect(vg).connect(o.frequency);
      const am = a.createOscillator(), ag = a.createGain(); // aspereza: liga e desliga 55 vezes por segundo
      am.type = "square"; am.frequency.value = 55 + i * 4; ag.gain.value = 0.09;
      og.gain.value = 0.12; am.connect(ag).connect(og.gain);
      o.connect(og).connect(sh);
      [o, vib, am].forEach((x) => { x.start(t); x.stop(t + dur); });
    });
    // arranhado metálico: ruído filtrado entre 3 e 7 kHz, varrendo
    const n = a.createBufferSource(), bp = a.createBiquadFilter(), ng = a.createGain();
    n.buffer = noiseBuffer(a, dur);
    bp.type = "bandpass"; bp.Q.value = 2;
    bp.frequency.setValueAtTime(3000, t); bp.frequency.exponentialRampToValueAtTime(7000, t + dur * 0.8);
    ng.gain.value = 0.7;
    n.connect(bp).connect(ng).connect(sh); n.start(t);
    // impacto grave no primeiro instante (o "soco")
    const k = a.createOscillator(), kg = a.createGain();
    k.frequency.setValueAtTime(120, t); k.frequency.exponentialRampToValueAtTime(32, t + 0.45);
    kg.gain.setValueAtTime(0.0001, t); kg.gain.exponentialRampToValueAtTime(vol, t + 0.005); kg.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
    k.connect(kg).connect(lim); k.start(t); k.stop(t + 0.6);
    // zumbido no ouvido que fica depois do grito
    const r = a.createOscillator(), rg = a.createGain();
    r.frequency.value = 8200;
    rg.gain.setValueAtTime(0.0001, t + dur * 0.5);
    rg.gain.exponentialRampToValueAtTime(0.035 * vol, t + dur * 0.8);
    rg.gain.exponentialRampToValueAtTime(0.0001, t + dur + 1.8);
    r.connect(rg).connect(lim); r.start(t); r.stop(t + dur + 2);
  }
  // ---------- Som do susto da máscara: "BRAAAM" ----------
  // Feito a partir do som que mais assustou nos testes: a serra grave do "VOCÊ ERROU" (110 Hz), só que muito mais forte.
  // Serras graves com notas dissonantes (segunda menor e trítono), distorção, um "rosnado" (aspereza de 40 Hz),
  // o filtro abrindo de uma vez no ataque e fechando, estrondo de prato e uma oitava abaixo para dar peso.
  const irs = new WeakMap(); // a resposta ao impulso da reverberação é gerada uma vez por contexto de áudio
  function reverb(a) {
    if (!irs.has(a)) {
      const len = a.sampleRate * 1.6, ir = a.createBuffer(2, len, a.sampleRate);
      for (let ch = 0; ch < 2; ch++) { const d = ir.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 4); }
      irs.set(a, ir);
    }
    const cv = a.createConvolver(); cv.buffer = irs.get(a); // nó novo a cada susto (não acumula ligações)
    return cv;
  }
  function limiter(a, dest) {
    const lim = a.createDynamicsCompressor();
    lim.threshold.value = -0.5; lim.knee.value = 0; lim.ratio.value = 20; lim.attack.value = 0.001; lim.release.value = 0.15;
    lim.connect(dest);
    return lim;
  }
  function shaper(a, drive) {
    const w = a.createWaveShaper(), c = new Float32Array(1024);
    for (let i = 0; i < 1024; i++) { const x = i / 512 - 1; c[i] = Math.tanh(x * drive) / Math.tanh(drive); }
    w.curve = c;
    return w;
  }
  function maskHit(a, dest, vol = 1, dur = 0.85) {
    const t = a.currentTime, out = limiter(a, dest);
    const sat = shaper(a, 2.6); sat.connect(out);
    const main = a.createGain(); main.gain.value = 0.55 * vol; main.connect(sat);
    const wet = a.createGain(), cv = reverb(a); wet.gain.value = 0.3 * vol; wet.connect(cv); cv.connect(sat);
    const lp = a.createBiquadFilter(); lp.type = "lowpass"; lp.Q.value = 2;
    lp.frequency.setValueAtTime(5000, t); lp.frequency.exponentialRampToValueAtTime(1100, t + dur);
    const env = a.createGain();
    env.gain.setValueAtTime(0.0001, t); env.gain.exponentialRampToValueAtTime(1, t + 0.003);
    env.gain.setValueAtTime(1, t + dur * 0.55); env.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    const growl = a.createGain(), am = a.createOscillator(), amg = a.createGain();
    growl.gain.value = 0.75; am.frequency.value = 40; amg.gain.value = 0.25; am.connect(amg).connect(growl.gain);
    lp.connect(growl).connect(env); env.connect(main); env.connect(wet);
    // mesma serra do "VOCÊ ERROU", uma quinta acima (165 Hz) para ficar mais fina: segunda menor, trítono e a oitava de baixo
    [[82.5, 0.45], [165, 0.6], [174.8, 0.45], [233.3, 0.3], [330, 0.2]].forEach(([f, g]) => {
      [-7, 7].forEach((cents) => {
        const o = a.createOscillator(), og = a.createGain();
        o.type = "sawtooth"; o.frequency.value = f; o.detune.value = cents;
        o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * 0.94, t + dur); // cai um pouco
        og.gain.value = g; o.connect(og).connect(lp); o.start(t); o.stop(t + dur + 0.05);
      });
    });
    am.start(t); am.stop(t + dur + 0.05);
    // estrondo de prato no ataque
    const cr = a.createBufferSource(), chp = a.createBiquadFilter(), cg = a.createGain();
    cr.buffer = noiseBuffer(a, 0.7); chp.type = "highpass"; chp.frequency.value = 2200;
    cg.gain.setValueAtTime(0.0001, t); cg.gain.exponentialRampToValueAtTime(0.5 * vol, t + 0.003); cg.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
    cr.connect(chp).connect(cg).connect(sat); cr.start(t);
  }
  // Chiado de fundo (estática de TV) durante o susto: baixo, bem abaixo do golpe, e abaixa ainda mais no instante do
  // golpe (duckAt, em segundos a partir de agora) para não cobri-lo; depois volta e some no fim.
  function hiss(a, dest, secs = 2.8, vol = 1, duckAt = -1) {
    const t = a.currentTime, n = a.createBufferSource(), hp = a.createBiquadFilter(), lp = a.createBiquadFilter(), g = a.createGain();
    n.buffer = noiseBuffer(a, secs + 0.1);
    hp.type = "highpass"; hp.frequency.value = 1200; lp.type = "lowpass"; lp.frequency.value = 8000;
    const L = 0.05 * vol;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(L, t + 0.25);
    if (duckAt > 0) {
      g.gain.setValueAtTime(L, t + duckAt);
      g.gain.exponentialRampToValueAtTime(L * 0.35, t + duckAt + 0.02);   // abre espaço para o golpe
      g.gain.setValueAtTime(L * 0.35, t + duckAt + 0.35);
      g.gain.exponentialRampToValueAtTime(L, t + duckAt + 0.8);
    }
    g.gain.setValueAtTime(L, t + secs - 0.5); g.gain.exponentialRampToValueAtTime(0.0001, t + secs);
    n.connect(hp).connect(lp).connect(g).connect(dest); n.start(t); n.stop(t + secs + 0.1);
  }
  function hissSound(secs, duckAt) {
    try { const a = ctx(); hiss(a, a.destination, secs, C.scareVolume, duckAt); } catch (e) {}
  }

  // "Puxada" antes do golpe: prato ao contrário (ruído que cresce e sobe de tom) e corta seco no fim
  function riser(a, dest, secs = 0.6, vol = 1) {
    const t = a.currentTime;
    const n = a.createBufferSource(), bp = a.createBiquadFilter(), g = a.createGain();
    n.buffer = noiseBuffer(a, secs + 0.05);
    bp.type = "bandpass"; bp.Q.value = 1.2;
    bp.frequency.setValueAtTime(400, t); bp.frequency.exponentialRampToValueAtTime(6500, t + secs);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.35 * vol, t + secs); g.gain.setValueAtTime(0.0001, t + secs + 0.01);
    n.connect(bp).connect(g).connect(dest); n.start(t); n.stop(t + secs + 0.05);
    const o = a.createOscillator(), og = a.createGain();
    o.type = "triangle"; o.frequency.setValueAtTime(160, t); o.frequency.exponentialRampToValueAtTime(900, t + secs);
    og.gain.setValueAtTime(0.0001, t); og.gain.exponentialRampToValueAtTime(0.08 * vol, t + secs); og.gain.setValueAtTime(0.0001, t + secs + 0.01);
    o.connect(og).connect(dest); o.start(t); o.stop(t + secs + 0.05);
  }
  function riserSound(secs) {
    if (C.sounds && C.sounds.scare) return; // com arquivo próprio, sem puxada
    try { const a = ctx(); riser(a, a.destination, secs, C.scareVolume); } catch (e) {}
  }
  // Som do susto da máscara (ou o arquivo sounds.scare, se houver)
  function scream() {
    if (C.sounds && C.sounds.scare) { const au = new Audio(C.sounds.scare); au.volume = C.scareVolume; au.play().catch(() => {}); return; }
    try { const a = ctx(); maskHit(a, a.destination, C.scareVolume); } catch (e) {}
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
  // Máscara do susto (SVG 200×240): pele com sombra, cabelo, órbitas fundas escorrendo, boca escancarada com dentes
  // e mandíbula solta (cai no primeiro instante, CSS jf-jaw). Os olhos ficam nas mesmas posições da cena final
  // (62/138, 98), que usa este mesmo desenho no salto (Interference.mask()).
  function mask() {
    const drip = (x, y, len, w) => `<path d="M${x - w} ${y} Q${x - w * 1.2} ${y + len * 0.6} ${x - w * 0.5} ${y + len} Q${x} ${y + len + w * 2} ${x + w * 0.5} ${y + len} Q${x + w * 1.2} ${y + len * 0.6} ${x + w} ${y}Z" fill="#050000"/>`;
    const spiral = (x) => `<circle cx="${x}" cy="158" r="21" fill="#7d0000"/><circle cx="${x}" cy="158" r="18" fill="#b30000"/>
      <path d="M${x} 158 m-12 0 a12 12 0 1 0 24 0 a8 8 0 1 0 -16 0 a4 4 0 1 0 8 0" stroke="#4a0000" stroke-width="2.2" fill="none"/>`;
    return `<defs>
        <radialGradient id="jfSkin" cx="50%" cy="40%" r="64%"><stop offset="0" stop-color="#f7f2e6"/><stop offset=".58" stop-color="#ddd4bf"/><stop offset=".86" stop-color="#8d8370"/><stop offset="1" stop-color="#3f382d"/></radialGradient>
        <radialGradient id="jfHole" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#000"/><stop offset=".78" stop-color="#000"/><stop offset="1" stop-color="#3a0808"/></radialGradient>
        <radialGradient id="jfThroat" cx="50%" cy="30%" r="70%"><stop offset="0" stop-color="#4a0000"/><stop offset=".55" stop-color="#160000"/><stop offset="1" stop-color="#000"/></radialGradient>
      </defs>
      <path d="M26 84 Q2 30 44 6 Q38 26 58 30 Q66 4 100 2 Q134 4 142 30 Q162 26 156 6 Q198 30 174 84 Q156 34 100 30 Q44 34 26 84Z" fill="#161616"/>
      <path d="M100 8 C152 8 186 52 185 116 C184 170 158 214 100 232 C42 214 16 170 15 116 C14 52 48 8 100 8Z" fill="url(#jfSkin)"/>
      <path d="M96 10 L91 30 L99 44 L93 60 M99 44 L108 52 M120 14 L126 30 L121 42 M50 34 L60 48 L56 60 M150 60 L158 74" stroke="#2e261d" stroke-width="1.3" fill="none" stroke-linecap="round"/>
      <path d="M24 132 Q40 176 70 200 M176 132 Q160 176 130 200" stroke="#4d4437" stroke-width="12" fill="none" opacity=".28" stroke-linecap="round"/>
      ${spiral(40)}${spiral(160)}
      <ellipse cx="62" cy="99" rx="31" ry="35" fill="#2b2119" opacity=".5"/><ellipse cx="138" cy="99" rx="31" ry="35" fill="#2b2119" opacity=".5"/>
      <path d="M32 66 Q58 52 90 76 M168 66 Q142 52 110 76" stroke="#1a1410" stroke-width="7" fill="none" stroke-linecap="round" opacity=".8"/>
      <ellipse class="jf-socket" cx="62" cy="98" rx="24" ry="28" transform="rotate(-9 62 98)" fill="url(#jfHole)"/>
      <ellipse class="jf-socket" cx="138" cy="98" rx="24" ry="28" transform="rotate(9 138 98)" fill="url(#jfHole)"/>
      ${drip(50, 120, 44, 3.2)}${drip(60, 124, 70, 2.4)}${drip(70, 122, 30, 2.8)}${drip(130, 122, 36, 2.6)}${drip(141, 124, 62, 3)}${drip(151, 119, 24, 2.2)}
      <g class="sc-eye"><circle cx="62" cy="99" r="6.5" fill="#ff1010"/><circle cx="62" cy="99" r="2" fill="#fff"/></g>
      <g class="sc-eye"><circle cx="138" cy="99" r="6.5" fill="#ff1010"/><circle cx="138" cy="99" r="2" fill="#fff"/></g>
      <path d="M95 128 Q89 143 96 146 Q99 139 95 128Z M105 128 Q111 143 104 146 Q101 139 105 128Z" fill="#0f0a07"/>
      <path class="jf-cav" d="M54 174 Q100 156 146 174 Q154 214 100 246 Q46 214 54 174Z" fill="url(#jfThroat)"/>
      <path d="M57 175 L64 191 L71 173 L78 193 L86 171 L93 195 L100 170 L107 195 L114 171 L122 193 L129 173 L136 191 L143 175 Q100 158 57 175Z" fill="#ece4d0" stroke="#2e261d" stroke-width=".9" stroke-linejoin="round"/>
      <g class="jf-jaw">
        <path d="M46 196 Q100 232 154 196 Q150 240 100 254 Q50 240 46 196Z" fill="#cfc6b0"/>
        <path d="M46 196 Q100 232 154 196" stroke="#2e261d" stroke-width="1.6" fill="none"/>
        <path d="M60 203 L67 189 L74 208 L82 191 L90 213 L97 193 L104 213 L111 192 L118 211 L126 191 L133 207 L140 201 Q100 228 60 203Z" fill="#e4dcc6" stroke="#2e261d" stroke-width=".9" stroke-linejoin="round"/>
        <path d="M52 178 L47 212 M148 178 L153 212" stroke="#0d0a08" stroke-width="2.6" stroke-linecap="round"/>
      </g>`;
  }
  function scareFace() {
    if (C.scareImage) return `<img src="${C.scareImage}" alt="">`;
    return `<svg viewBox="0 0 200 240" class="hack-face">${mask()}</svg>`;
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
    await sleep(800);
    hissSound(3.2, 0.8);
    riserSound(0.8);
    await sleep(800);

    // 4. Susto
    await showScare(l, "interferencia");

    // 5. Volta ao normal
    l.remove();
    document.body.classList.remove("hacked");
    running = false;
  }

  // ---------- Mídia do susto: sorteia um vídeo/imagem do lugar, sem repetir o último ----------
  const lastMedia = {};
  function pickMedia(slot) {
    const M = C.scareMedia || {};
    const list = (M[slot] && M[slot].length ? M[slot] : M.padrao) || [];
    if (!list.length) return C.scareImage || "";
    const pool = list.length > 1 ? list.filter((m) => m !== lastMedia[slot]) : list;
    return (lastMedia[slot] = pool[Math.floor(Math.random() * pool.length)]);
  }
  // Camadas do golpe: zoom (sc-zoom) → tremor e espasmos (sc-shake) → quadros tortos (sc-frame) + duas fatias
  // deslocadas da mesma imagem (sc-slice, a imagem "rasga"). O resto é CSS.
  function scareMarkup(inner, cls = "") {
    const strobe = C.scareStrobe === false ? " nostrobe" : "";
    return `<div class="hack-scare${strobe} ${cls}"><div class="sc-zoom"><div class="sc-shake">
      <div class="sc-frame">${inner}</div><div class="sc-slice a">${inner}</div><div class="sc-slice b">${inner}</div></div></div></div>`;
  }
  async function showScare(l, slot) {
    lastScareAt = Date.now();
    const src = pickMedia(slot);
    if (/\.(mp4|webm|ogg|mov)$/i.test(src)) {
      l.innerHTML = `<div class="hack-scare video"><div class="sc-shake"><video src="${src}" playsinline></video></div></div>`;
      const v = l.querySelector("video");
      v.volume = C.scareVolume;
      if (await v.play().then(() => true, () => false)) {
        await new Promise((r) => {
          const t = setTimeout(r, (C.scareMaxSeconds || 8) * 1000);
          v.onended = v.onerror = () => { clearTimeout(t); r(); };
        });
        return;
      }
    }
    // Imagem (ou a máscara desenhada) + BRAAAM
    l.innerHTML = scareMarkup(src && !/\.(mp4|webm|ogg|mov)$/i.test(src) ? `<img src="${src}" alt="">` : scareFace());
    scream();
    await sleep(rand(1700, 2300));
    // corte seco: preto e silêncio por um instante antes de a tela voltar
    l.innerHTML = "";
    l.classList.add("dark");
    await sleep(rand(350, 800));
  }

  // Coração no escuro: "tum-tum" grave e baixo que acelera e PARA um pouco antes do golpe
  function heartbeat(secs) {
    try {
      const a = ctx(), end = a.currentTime + secs - 0.45;
      for (let t = a.currentTime + 0.2, gap = 0.95; t < end; t += gap, gap = Math.max(0.48, gap * 0.87)) {
        [0, 0.17].forEach((d, i) => {
          const o = a.createOscillator(), g = a.createGain(), at = t + d;
          o.frequency.setValueAtTime(62, at); o.frequency.exponentialRampToValueAtTime(38, at + 0.14);
          g.gain.setValueAtTime(0.0001, at); g.gain.exponentialRampToValueAtTime((i ? 0.3 : 0.45) * C.scareVolume, at + 0.012);
          g.gain.exponentialRampToValueAtTime(0.0001, at + 0.2);
          o.connect(g).connect(a.destination); o.start(at); o.stop(at + 0.25);
        });
      }
    } catch (e) {}
  }

  // Só o susto, sem as janelas de erro. A ENTRADA é sorteada, para ninguém aprender a hora de se preparar:
  //   "seco"     — sem aviso nenhum: a máscara bate direto por cima da tela
  //   "puxada"   — tela preta + puxada curta (prato ao contrário) → golpe
  //   "silencio" — tela preta, só o coração batendo, por um tempo que ninguém sabe → golpe
  //   "alivio"   — tela preta... e a tela VOLTA ao normal, como se nada tivesse acontecido → golpe
  // CONFIG.scareRules.entries escolhe quais entram no sorteio (a mesma nunca sai duas vezes seguidas).
  let lastEntry = "";
  async function scare(slot = "padrao", entry) {
    if (running) return;
    running = true;
    document.activeElement && document.activeElement.blur();
    const R = C.scareRules || {};
    const pool = (R.entries && R.entries.length ? R.entries : ["seco", "puxada", "silencio", "alivio"]);
    const opts = pool.length > 1 ? pool.filter((m) => m !== lastEntry) : pool;
    lastEntry = entry = entry || pick(opts);
    const l = layer();
    if (entry === "puxada") {
      l.classList.add("dark");
      hissSound(2.9, 0.5); // chiado de fundo durante todo o susto (abaixa no golpe)
      riserSound(0.5);
      await sleep(500);
    } else if (entry === "silencio") {
      const wait = rand(1.4, 3.4);
      l.classList.add("dark");
      heartbeat(wait);
      await sleep(wait * 1000);
      hissSound(2.4, 0.01);
    } else if (entry === "alivio") {
      l.classList.add("dark");
      await sleep(rand(600, 1000));
      l.classList.remove("dark");          // a tela volta; a camada invisível continua segurando os cliques
      await sleep(rand(700, 1900));
      hissSound(2.4, 0.01);
    } else {
      await sleep(rand(0, 700));           // "seco": só um atraso que ninguém vê
      hissSound(2.4, 0.01);
    }
    await showScare(l, slot);
    l.remove();
    running = false;
    // Réplica: às vezes, quando todos já relaxaram, a máscara pisca de novo
    if (Math.random() < (R.aftershockChance == null ? 0.3 : R.aftershockChance)) setTimeout(aftershock, rand(900, 3200));
  }
  // Réplica: a máscara aparece de novo por uma fração de segundo, com um golpe curto
  async function aftershock() {
    if (running) return;
    running = true;
    const l = layer();
    l.innerHTML = scareMarkup(scareFace(), "after");
    if (!(C.sounds && C.sounds.scare)) { try { const a = ctx(); maskHit(a, a.destination, 0.8 * C.scareVolume, 0.32); } catch (e) {} }
    await sleep(rand(150, 240));
    l.remove();
    running = false;
  }

  // ---------- Erros: o susto só acontece às vezes ----------
  // Nunca no 1º erro da partida; depois de um susto, há um tempo de descanso; passado o descanso,
  // cada erro aumenta a chance. Nos erros sem susto, um efeito leve e variado (tela falha, sussurro, clarão).
  let lastScareAt = 0, errors = 0, armed = 0;
  async function error(slot = "padrao") {
    if (running) return;
    const R = Object.assign({ firstAfterErrors: 2, cooldownSeconds: 90, chanceStep: 0.3 }, C.scareRules);
    errors++;
    const rested = Date.now() - lastScareAt >= R.cooldownSeconds * 1000;
    if (errors >= R.firstAfterErrors && rested) {
      armed++;
      if (Math.random() < Math.min(1, R.chanceStep * armed)) { armed = 0; return scare(slot); }
    }
    return minor();
  }
  const WHISPERS = ["Eu vi isso.", "Errado.", "Continuem errando...", "Tic... tac...", "Eu estou bem aqui.", "Tem certeza?"];
  // Efeitos leves: tela falha, sussurro, clarão vermelho, "rasgo" (susto rápido sem máscara, com o guincho curto)
  // ou "espiada" (a máscara aparece em silêncio num canto da tela, olha e some)
  let lastMinor = -1;
  async function minor() {
    let kind;
    do { kind = Math.floor(Math.random() * 5); } while (kind === lastMinor);
    lastMinor = kind;
    const f = document.createElement("div");
    f.className = "mini-fx " + ["glitch", "whisper", "flash", "tear", "peek " + pick(["pl", "pr", "pb"])][kind];
    if (kind === 1) f.textContent = WHISPERS[Math.floor(Math.random() * WHISPERS.length)];
    if (kind === 4) f.innerHTML = scareFace();
    document.body.appendChild(f);
    if (kind === 3) { try { const a = ctx(); shriek(a, a.destination, 0.5 * C.scareVolume, 0.6); } catch (e) {} }
    else if (kind === 0 || kind === 2) staticSound(0.35);
    await sleep(kind === 1 ? 1800 : kind === 4 ? 2100 : kind === 3 ? 650 : 450);
    f.remove();
  }

  // Atalho do mestre do jogo para testar
  addEventListener("keydown", (e) => { if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "h") run(); });

  return { run, scare, error, aftershock, minor, mask, maskHit, riser, hiss, shriek, get running() { return running; } };
})();
