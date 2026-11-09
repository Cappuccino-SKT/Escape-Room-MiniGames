// ===== SUSTO DA RESPOSTA FINAL ERRADA (projetor, os 3 níveis) =====
// Uso: await FinalScare.play({ errs, fakeEnd })  — cena inteira em HTML/CSS + som gerado pelo navegador (WebAudio).
//   errs:    caixas de erro extras do nível, ex.: [["Erro", "SENHA INCORRETA"]]
//   fakeEnd: função que mostra a tela "normal" do projetor (a mensagem de resposta errada), usada no final "falso_fim"
//  1. "PARABÉNS," ... (alguns segundos) ... "VOCÊ ERROU." + luz vermelha na tela
//  2. corte seco para o preto
//  3. cmd rodando código com som ambiente calmo
//  4. o código trava → chuva de erros, projetor "hackeado", alarme crescente
//  5. transição: o sistema "desliga" (o som desce e escurece, a tela para de piscar, o cmd some); os erros começam a
//     voar em órbita, um depois do outro, e aos poucos se acomodam formando um círculo; o ambiente vira um zumbido
//     grave bem baixo. Daqui até o fim, erros novos não param de surgir, sempre fora do rosto.
//  6. dois olhos de neon vermelho (pontinho branco no meio) abrem e ficam olhando → aparece o sorriso (os erros aceleram)
//  7. O FINAL É SORTEADO (CONFIG.finalScareEndings; nunca o mesmo duas vezes seguidas), para o susto pegar até quem já viu:
//       "bote"      — "puxada" curta e a máscara vem para cima da tela, com os erros ainda surgindo
//       "apagao"    — tudo some de uma vez: tela preta e silêncio total por um tempo que ninguém sabe → a máscara salta do escuro
//       "falso_fim" — a cena "acaba": o projetor volta ao normal, com a mensagem de resposta errada... e a máscara salta por cima
//     Em todos: a máscara (o mesmo desenho do susto comum, Interference.mask()) + "BRAAAM" → preto
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
  const BASE_ERRS = [
    ["Erro crítico", "Exceção 0x0000666 em PROJETOR.SYS"], ["Projetor", "Sinal de vídeo interceptado."],
    ["Falha de memória", "A instrução em 0x6F6F6F referenciou memória em 0x00000000."], ["Aviso", "Um invasor assumiu o controle da imagem."],
    ["Erro fatal", "VOCÊS ERRARAM"], ["Segurança", "Câmera ativada remotamente."], ["J", "Eu avisei que errar tinha um preço."]
  ];
  let ERRS = BASE_ERRS;

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
        setTimeout(() => { oscs.forEach((o) => o.stop()); fan.stop(); }, 100); },
      // "desliga" devagar, como uma máquina perdendo força: o volume cai, o som escurece e o tom desce
      windDown(secs) {
        const n = ac.currentTime;
        [out.gain, lp.frequency, ...oscs.map((o) => o.frequency)].forEach((p) => { p.cancelScheduledValues(n); p.setValueAtTime(p.value, n); });
        out.gain.exponentialRampToValueAtTime(0.0001, n + secs);
        lp.frequency.exponentialRampToValueAtTime(140, n + secs);
        oscs.forEach((o) => o.frequency.exponentialRampToValueAtTime(o.frequency.value * 0.45, n + secs));
        setTimeout(() => { oscs.forEach((o) => o.stop()); fan.stop(); }, secs * 1000 + 200);
      }
    };
  }
  // Ambiente do "silêncio": um zumbido grave bem baixo que muda de tom devagar (quase não se ouve, mas incomoda)
  function roomTone(secs) {
    const t = ac.currentTime, out = ac.createGain(), lp = ac.createBiquadFilter();
    lp.type = "lowpass"; lp.frequency.value = 220; lp.connect(out); out.connect(master);
    out.gain.setValueAtTime(0.0001, t); out.gain.exponentialRampToValueAtTime(0.06, t + secs);
    const oscs = [41, 61.7].map((f, i) => {
      const o = ac.createOscillator(), lfo = ac.createOscillator(), lg = ac.createGain();
      o.frequency.value = f; lfo.frequency.value = 0.07 + i * 0.05; lg.gain.value = 1.6;
      lfo.connect(lg).connect(o.frequency); o.connect(lp); o.start(); lfo.start();
      return [o, lfo];
    }).flat();
    return { stop() { const n = ac.currentTime; out.gain.cancelScheduledValues(n); out.gain.setValueAtTime(out.gain.value, n);
      out.gain.exponentialRampToValueAtTime(0.0001, n + 0.08); setTimeout(() => oscs.forEach((o) => o.stop()), 150); } };
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
  // Alarme que sobe; fade(s) o apaga devagar, descendo de tom
  function siren(secs) {
    const t = ac.currentTime, o = ac.createOscillator(), g = ac.createGain(); o.type = "sawtooth";
    o.frequency.setValueAtTime(220, t); o.frequency.exponentialRampToValueAtTime(900, t + secs);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.06, t + secs * 0.8);
    o.connect(g).connect(master); o.start(); o.stop(t + secs + 6);
    return { fade(d) { const n = ac.currentTime; [g.gain, o.frequency].forEach((p) => { p.cancelScheduledValues(n); p.setValueAtTime(p.value, n); });
      g.gain.exponentialRampToValueAtTime(0.0001, n + d); o.frequency.exponentialRampToValueAtTime(o.frequency.value * 0.4, n + d); } };
  }
  // Som de erro do sistema (curto e baixo): o único som enquanto os olhos estão na tela
  function errDing() {
    const t = ac.currentTime;
    [[620, 0], [470, 0.09]].forEach(([f, d]) => {
      const o = ac.createOscillator(), g = ac.createGain(); o.type = "triangle"; o.frequency.value = f * rand(0.97, 1.03);
      g.gain.setValueAtTime(0.0001, t + d); g.gain.exponentialRampToValueAtTime(0.09, t + d + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + d + 0.25);
      o.connect(g).connect(master); o.start(t + d); o.stop(t + d + 0.3);
    });
  }
  // Som da máscara: o "BRAAAM" do susto comum (Interference.maskHit), precedido da "puxada" (Interference.riser)
  function scream() {
    if (C.sounds && C.sounds.scare) { const a = new Audio(C.sounds.scare); a.volume = VOL; a.play().catch(() => {}); return; }
    if (window.Interference && Interference.maskHit) Interference.maskHit(ac, master, 1);
  }
  function pull(secs) { if (!(C.sounds && C.sounds.scare) && window.Interference && Interference.riser) Interference.riser(ac, master, secs, 0.9); }

  // ---------- Rosto (SVG): começa só com olhos e boca no escuro; a máscara aparece no salto ----------
  // Olhos: dois pontos de neon vermelho com um pontinho branco no meio; depois o sorriso; a máscara só aparece no salto
  const face = () => `<svg viewBox="0 0 200 240" class="fs-face">
    <g class="fs-mask">${window.Interference && Interference.mask ? Interference.mask() : ""}</g>
    <g class="fs-eyes"><circle cx="62" cy="100" r="10" fill="#ff1a1a"/><circle cx="138" cy="100" r="10" fill="#ff1a1a"/>
      <circle cx="62" cy="100" r="2.8" fill="#fff"/><circle cx="138" cy="100" r="2.8" fill="#fff"/></g>
    <path class="fs-mouth" d="M36 156 Q100 230 164 156" pathLength="100" stroke="#d00" stroke-width="7" fill="none" stroke-linecap="round"/>
  </svg>`;

  // Final da cena: sorteado entre os de CONFIG.finalScareEndings, sem repetir o último (guardado no navegador)
  function pickEnding(canFake) {
    let pool = (C.finalScareEndings && C.finalScareEndings.length ? C.finalScareEndings : ["bote", "apagao", "falso_fim"]).filter((e) => canFake || e !== "falso_fim");
    if (!pool.length) pool = ["bote"];
    let last = "";
    try { last = localStorage.getItem("jigsaw-fs-ending") || ""; } catch (e) {}
    const opts = pool.length > 1 ? pool.filter((e) => e !== last) : pool;
    const e = pick(opts);
    try { localStorage.setItem("jigsaw-fs-ending", e); } catch (err) {}
    return e;
  }

  // ---------- A cena ----------
  async function play(opts = {}) {
    if (running) return;
    running = true;
    ERRS = BASE_ERRS.concat(opts.errs || []);
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

    // 4. Trava → chuva de erros (longa), ambiente mais intenso, alarme crescente.
    //    No último trecho a chuva vai perdendo força (erros mais espaçados e mais baixos), preparando a transição.
    cmd.classList.add("freeze");
    A(stutter);
    await sleep(550);
    const RAIN = 7000, SLOW = 0.75; // a partir de 75% da chuva, ela desacelera
    amb && amb.intense(RAIN * SLOW / 1000);
    let alarm = null;
    try { alarm = ac && siren(RAIN * SLOW / 1000); } catch (e) {}
    L.classList.add("hacked");
    const errs = [];
    const tE = Date.now();
    for (let i = 0; Date.now() - tE < RAIN; i++) {
      const p = (Date.now() - tE) / RAIN, slow = Math.max(0, (p - SLOW) / (1 - SLOW)); // 0 → 1 no fim
      const [title, msg] = pick(ERRS), e = document.createElement("div");
      e.className = "hack-err fs-e";
      e.style.left = rand(-5, 80) + "vw"; e.style.top = rand(-5, 80) + "vh";
      e.innerHTML = `<div class="hack-bar red">${title}<span>✕</span></div><div class="hack-err-body"><b>✖</b><span>${msg}</span></div>`;
      L.appendChild(e); errs.push(e);
      A(beep, pick([880, 1200, 660, 1500]), 0.05, 0.08 * (1 - slow * 0.8));
      await sleep(Math.max(45, 220 - i * 3) + slow * 380);
    }

    // 5. Transição: o sistema "desliga" (som desce e escurece, a tela para de piscar, o cmd some) e entra um
    //    zumbido grave bem baixo. Os erros começam a voar em órbita, um depois do outro, e aos poucos se
    //    acomodam formando um CÍRCULO. Enquanto isso, erros novos continuam aparecendo.
    const FADE = 2.8;
    amb && amb.windDown(FADE);
    alarm && alarm.fade(FADE * 0.7);
    let room = null;
    try { room = ac && roomTone(FADE + 1); } catch (e) {}
    L.classList.add("settle");
    cmd.classList.add("fade");
    const vig = document.createElement("div");
    vig.className = "fs-vig";
    L.appendChild(vig);

    // Erros novos, sempre FORA do rosto, cada vez mais rápido (não param nem quando a máscara aparece)
    const W = innerWidth, H = innerHeight, cx = W / 2, cy = H / 2;
    const faceRx = H * 0.21 + 190, faceRy = H * 0.25 + 60; // área do rosto + metade da caixa de erro
    let spawnGap = 380, spawning = true;
    const spawnOne = () => {
      let x, y;
      do { x = rand(-60, W + 60); y = rand(-30, H + 30); } while (((x - cx) / faceRx) ** 2 + ((y - cy) / faceRy) ** 2 < 1);
      const [title, msg] = pick(ERRS), e = document.createElement("div");
      e.className = "hack-err fs-e";
      e.style.left = x - 170 + "px"; e.style.top = y - 45 + "px";
      e.style.transform = `rotate(${rand(-20, 20)}deg) scale(.8)`;
      e.innerHTML = `<div class="hack-bar red">${title}<span>✕</span></div><div class="hack-err-body"><b>✖</b><span>${msg}</span></div>`;
      L.insertBefore(e, vig);
      errs.push(e);
      if (Math.random() < 0.35) A(beep, pick([660, 880, 1200]), 0.04, 0.035);
    };
    (async () => { while (spawning) { await sleep(spawnGap * rand(0.6, 1.4)); if (spawning) spawnOne(); } })();

    // o círculo (animado quadro a quadro): cada erro começa a voar em órbita em volta do centro, balançando,
    // e aos poucos se acomoda no seu lugar do círculo. Eles começam um depois do outro, numa onda que dá a volta.
    const R = Math.min(W, H) * 0.46, SX = 1.35;           // círculo um pouco esticado na horizontal (tela larga)
    const ring = errs.slice().map((e) => {
      const r = e.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
      const nx = (x - cx) / SX, ny = y - cy;               // coordenadas "redondas" (sem o esticamento)
      return { e, x, y, r0: Math.max(40, Math.hypot(nx, ny)), a0: Math.atan2(ny, nx) };
    });
    ring.sort((p, q) => p.a0 - q.a0);                     // em ordem de ângulo: a onda percorre a volta
    const N = ring.length, TAU = 2 * Math.PI;
    ring.forEach((p, i) => {
      const slot = -Math.PI + (TAU * (i + 0.5)) / N;      // lugar no círculo, perto de onde o erro já está
      let d = slot - p.a0; d -= TAU * Math.round(d / TAU);
      p.turn = TAU * rand(0.7, 1.1) + d;                  // quase uma volta inteira de órbita antes de parar
      p.rT = R * rand(0.95, 1.25);                        // o círculo não fica perfeito
      p.delay = (i / N) * 1.8 + rand(0, 0.15);            // em escala: um começa depois do outro
      p.dur = rand(2.3, 2.9);
      p.rot = rand(-25, 25);
      p.wob = rand(0, TAU);                               // fase do balanço ("voando")
      p.e.style.transition = "filter 2.5s ease";
      p.e.style.filter = "brightness(.75)";
    });
    const easeIO = (u) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
    const easeOut = (u) => 1 - Math.pow(1 - u, 3);
    const tStart = performance.now(), TOTAL = Math.max(...ring.map((p) => p.delay + p.dur), 0);
    await new Promise((done) => {
      const frame = (now) => {
        const tt = (now - tStart) / 1000;
        ring.forEach((p) => {
          const u = Math.min(1, Math.max(0, (tt - p.delay) / p.dur));
          if (u === 0) return;                            // ainda esperando a vez
          const ang = p.a0 + p.turn * easeIO(u);
          const fly = Math.sin(u * Math.PI);              // balanço máximo no meio do voo, zero no fim
          const rad = p.r0 + (p.rT - p.r0) * easeOut(u) + Math.sin(tt * 7 + p.wob) * 22 * fly;
          const x = cx + Math.cos(ang) * rad * SX, y = cy + Math.sin(ang) * rad;
          const rot = p.rot * u + Math.sin(tt * 9 + p.wob) * 14 * fly;
          p.e.style.transform = `translate(${x - p.x}px, ${y - p.y}px) rotate(${rot}deg) scale(${1 - 0.2 * u})`;
        });
        if (tt < TOTAL) next(); else done();
      };
      // setTimeout em vez de requestAnimationFrame: não trava se a janela do projetor ficar sem foco/escondida
      const next = () => setTimeout(() => frame(performance.now()), 16);
      next();
    });
    L.classList.remove("hacked");
    cmd.remove();

    // Os erros do círculo de vez em quando dão um tranco e apitam
    let dings = true;
    (async () => {
      while (dings) {
        await sleep(rand(450, 1300));
        if (!dings) break;
        const e = pick(ring).e;
        e.classList.remove("jolt"); void e.offsetWidth; e.classList.add("jolt");
        A(errDing);
      }
    })();

    // 6. Dois olhos vermelhos abrem no centro e ficam olhando → sorriso. Os erros em volta só aumentam.
    const wrap = document.createElement("div");
    wrap.className = "fs-face-wrap";
    wrap.innerHTML = face();
    L.appendChild(wrap);
    const svg = wrap.querySelector("svg");
    svg.classList.add("eyes");
    for (let k = 0; k < 10; k++) { spawnGap = 300 - k * 22; await sleep(520); } // ~5,2 s, aparecendo cada vez mais rápido
    svg.classList.add("smile");
    spawnGap = 70;
    await sleep(800);
    const ending = opts.ending || pickEnding(!!opts.fakeEnd);
    let lunger = svg;
    if (ending === "bote") {
      A(pull, 0.7); // "puxada" que termina exatamente no golpe
      A(() => Interference.hiss && Interference.hiss(ac, master, 2.4, 1, 0.7)); // chiado de fundo do susto (abaixa no golpe)
      spawnGap = 40;
      await sleep(700);
      dings = false;
      room && room.stop();
    } else {
      // "apagao" e "falso_fim": num momento qualquer, tudo some de uma vez. Nenhum som avisa o golpe.
      spawnGap = 40;
      await sleep(rand(300, 1100));
      dings = false; spawning = false;
      room && room.stop();
      L.className = "black";
      L.innerHTML = "";
      if (ending === "falso_fim" && opts.fakeEnd) {
        await sleep(800);
        L.style.display = "none";       // o projetor "volta ao normal", com a mensagem de resposta errada
        try { opts.fakeEnd(); } catch (e) {}
        await sleep(rand(1400, 3200));
        L.className = "";               // transparente: a máscara salta por cima da mensagem
        L.style.display = "";
      } else {
        await sleep(rand(1700, 4200));  // preto e silêncio
      }
      const w2 = document.createElement("div");
      w2.className = "fs-face-wrap";
      w2.innerHTML = face();
      L.appendChild(w2);
      lunger = w2.querySelector("svg");
      lunger.classList.add("now", "eyes", "smile"); // já nasce com olhos e sorriso, sem as animações de entrada
      A(() => Interference.hiss && Interference.hiss(ac, master, 1.6, 1, 0.01));
    }

    // 7. Sem aviso: a máscara vem para cima da tela → BRAAAM → preto
    lunger.classList.add("lunge");
    A(scream);
    await sleep(90);                 // a tela treme quase junto com o salto
    L.classList.add("shake");
    await sleep(rand(800, 1100));
    spawning = false;
    L.className = "black";
    L.innerHTML = "";
    await sleep(900);
    L.remove();
    running = false;
  }

  return { play, get running() { return running; } };
})();
