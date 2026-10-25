// ===== MINIGAME: BIOS — JOGO DO LABIRINTO =====
// Um labirinto por componente. O ponto anda sozinho; WASD/setas mudam a direção.
// Bater na parede = erro (volta ao início do labirinto atual).
// Interferência do hacker: uma única vez, no que vier primeiro — tempo, erros ou fim do jogo.

// Estado da fase 3 (sobrevive a fechar/abrir a janela)
window.MazeState = { started: false, level: 0, errors: 0, interfered: false, done: false, timer: null, paused: false };

window.BiosGame = function (el, api) {
  const CFG = window.CONFIG.maze, MS = window.MazeState, LV = CFG.levels;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const lvl = () => LV[Math.min(MS.level, LV.length - 1)]; // componente atual
  const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
  const KEYS = { ArrowUp: "up", w: "up", W: "up", ArrowDown: "down", s: "down", S: "down",
                 ArrowLeft: "left", a: "left", A: "left", ArrowRight: "right", d: "right", D: "right" };

  el.innerHTML = `
    <div class="bios">
      <div class="bios-top">JIGSAW BIOS SETUP UTILITY</div>
      <div class="bios-tabs"><span>Main</span><span class="on">Advanced</span><span>Boot</span><span>Security</span><span>Exit</span></div>
      <div class="bios-body">
        <div class="bios-main">
          <div class="bios-title">▶ Reconexão de componentes: <b class="mz-name"></b></div>
          <div class="mz-wrap"><canvas></canvas><div class="mz-overlay hidden"></div></div>
        </div>
        <div class="bios-side">
          <b>Ajuda do item</b>
          <p>Leve o sinal até o ponto colorido do componente.</p>
          <p>Use <b>W A S D</b> ou as <b>setas</b> para mudar a direção.</p>
          <p class="bios-red">Não encoste nas paredes.</p>
          <div class="bios-status"></div>
        </div>
      </div>
      <div class="bios-foot"><span>↑↓←→ / WASD: Direção</span><span class="mz-errors"></span></div>
    </div>`;

  const canvas = el.querySelector("canvas"), g = canvas.getContext("2d");
  const wrap = el.querySelector(".mz-wrap"), overlay = el.querySelector(".mz-overlay");
  const statusEl = el.querySelector(".bios-status");

  // ---------- Geração do labirinto (sorteio fixo) ----------
  function makeMaze(i) {
    const { w, cols, rows } = LV[i];
    let seed = CFG.seed * 31 + i * 7919;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const TW = cols * (w + 1) + 1, TH = rows * (w + 1) + 1;
    const wall = Array.from({ length: TH }, () => Array(TW).fill(true));
    const x0 = (cx) => 1 + cx * (w + 1), y0 = (cy) => 1 + cy * (w + 1);
    const open = (cx, cy) => { for (let y = 0; y < w; y++) for (let x = 0; x < w; x++) wall[y0(cy) + y][x0(cx) + x] = false; };
    const seen = new Set(["0,0"]), stack = [[0, 0]];
    open(0, 0);
    while (stack.length) {
      const [cx, cy] = stack[stack.length - 1];
      const nb = [[1, 0], [-1, 0], [0, 1], [0, -1]].map(([dx, dy]) => [cx + dx, cy + dy, dx, dy])
        .filter(([x, y]) => x >= 0 && y >= 0 && x < cols && y < rows && !seen.has(x + "," + y));
      if (!nb.length) { stack.pop(); continue; }
      const [nx, ny, dx, dy] = nb[Math.floor(rnd() * nb.length)];
      open(nx, ny);
      // derruba a parede entre as duas salas
      for (let k = 0; k < w; k++) {
        if (dx) wall[y0(cy) + k][dx > 0 ? x0(cx) + w : x0(cx) - 1] = false;
        else wall[dy > 0 ? y0(cy) + w : y0(cy) - 1][x0(cx) + k] = false;
      }
      seen.add(nx + "," + ny); stack.push([nx, ny]);
    }
    const center = (cx, cy) => [x0(cx) + w / 2, y0(cy) + w / 2];
    const start = center(0, 0);
    const dir = !wall[y0(0) + Math.floor(w / 2)][x0(0) + w] ? "right" : "down";
    return { wall, TW, TH, w, start, dir, end: [x0(cols - 1), y0(rows - 1)], r: 0.3 + 0.1 * (w - 1) };
  }

  let M = null, pos = null, dir = null, want = null, trail = [];
  let mode = "idle"; // idle | run | crash | between | win
  let tile = 10, offX = 0, offY = 0;

  function loadLevel() {
    M = makeMaze(Math.min(MS.level, LV.length - 1));
    pos = [...M.start]; dir = M.dir; want = null; trail = [];
    el.querySelector(".mz-name").textContent = lvl().label;
    resize(); updateSide();
  }

  // ---------- Colisão ----------
  function hits(x, y) {
    const r = M.r;
    for (let ty = Math.floor(y - r); ty <= Math.floor(y + r); ty++)
      for (let tx = Math.floor(x - r); tx <= Math.floor(x + r); tx++) {
        const isWall = ty < 0 || tx < 0 || ty >= M.TH || tx >= M.TW || M.wall[ty][tx];
        if (!isWall) continue;
        const nx = Math.max(tx, Math.min(x, tx + 1)), ny = Math.max(ty, Math.min(y, ty + 1));
        if ((x - nx) ** 2 + (y - ny) ** 2 < r * r) return true;
      }
    return false;
  }
  const inEnd = ([x, y]) => x >= M.end[0] && x <= M.end[0] + M.w && y >= M.end[1] && y <= M.end[1] + M.w;

  // ---------- Loop ----------
  let last = 0;
  function frame(t) {
    if (!el.isConnected) return;
    const dt = Math.min(0.05, (t - last) / 1000 || 0);
    last = t;
    if (mode === "run" && !MS.paused) {
      let move = lvl().speed * dt;
      while (move > 0 && mode === "run") {
        const s = Math.min(0.04, move); move -= s;
        // curva "guardada": vira assim que houver espaço
        if (want && want !== dir) {
          const [wx, wy] = DIRS[want];
          if (!hits(pos[0] + wx * 0.06, pos[1] + wy * 0.06)) { dir = want; want = null; }
        }
        const [dx, dy] = DIRS[dir];
        pos = [pos[0] + dx * s, pos[1] + dy * s];
        if (hits(...pos)) crash();
        else if (inEnd(pos)) levelDone();
      }
      trail.push([...pos]); if (trail.length > 25) trail.shift();
    }
    draw(t);
    requestAnimationFrame(frame);
  }

  function draw(t) {
    const W = canvas.width / devicePixelRatio, H = canvas.height / devicePixelRatio;
    g.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    g.fillStyle = "#000040"; g.fillRect(0, 0, W, H);
    if (!M) return;
    const col = lvl().color;
    g.save(); g.translate(offX, offY);
    // paredes
    for (let y = 0; y < M.TH; y++) for (let x = 0; x < M.TW; x++) if (M.wall[y][x]) {
      g.fillStyle = "#3d3dc4"; g.fillRect(x * tile, y * tile, tile + 0.5, tile + 0.5);
    }
    g.strokeStyle = "#8f8fff"; g.lineWidth = 1;
    for (let y = 0; y < M.TH; y++) for (let x = 0; x < M.TW; x++) if (M.wall[y][x]) {
      const free = (xx, yy) => yy >= 0 && xx >= 0 && yy < M.TH && xx < M.TW && !M.wall[yy][xx];
      g.beginPath();
      if (free(x, y - 1)) { g.moveTo(x * tile, y * tile); g.lineTo((x + 1) * tile, y * tile); }
      if (free(x, y + 1)) { g.moveTo(x * tile, (y + 1) * tile); g.lineTo((x + 1) * tile, (y + 1) * tile); }
      if (free(x - 1, y)) { g.moveTo(x * tile, y * tile); g.lineTo(x * tile, (y + 1) * tile); }
      if (free(x + 1, y)) { g.moveTo((x + 1) * tile, y * tile); g.lineTo((x + 1) * tile, (y + 1) * tile); }
      g.stroke();
    }
    // largada
    g.strokeStyle = "#ffffff55"; g.lineWidth = 2;
    g.beginPath(); g.arc(M.start[0] * tile, M.start[1] * tile, M.r * tile * 1.8, 0, 7); g.stroke();
    // chegada (pulsando)
    const pulse = 0.6 + 0.4 * Math.sin(t / 200);
    g.globalAlpha = pulse; g.fillStyle = col;
    g.fillRect(M.end[0] * tile, M.end[1] * tile, M.w * tile, M.w * tile);
    g.globalAlpha = 1; g.fillStyle = "#000"; g.font = `bold ${Math.max(9, tile * M.w * 0.32)}px Courier New`;
    g.textAlign = "center"; g.textBaseline = "middle";
    g.fillText(lvl().label, (M.end[0] + M.w / 2) * tile, (M.end[1] + M.w / 2) * tile);
    // rastro + ponto
    trail.forEach(([x, y], i) => {
      g.globalAlpha = (i / trail.length) * 0.4; g.fillStyle = col;
      g.beginPath(); g.arc(x * tile, y * tile, M.r * tile * 0.8, 0, 7); g.fill();
    });
    g.globalAlpha = 1;
    g.shadowColor = mode === "crash" ? "#fff" : col; g.shadowBlur = 16;
    g.fillStyle = mode === "crash" ? "#fff" : col;
    g.beginPath(); g.arc(pos[0] * tile, pos[1] * tile, M.r * tile, 0, 7); g.fill();
    g.shadowBlur = 0;
    g.restore();
  }

  function resize() {
    const b = wrap.getBoundingClientRect();
    canvas.width = b.width * devicePixelRatio; canvas.height = b.height * devicePixelRatio;
    canvas.style.width = b.width + "px"; canvas.style.height = b.height + "px";
    if (!M) return;
    tile = Math.min(b.width / M.TW, b.height / M.TH);
    offX = (b.width - tile * M.TW) / 2; offY = (b.height - tile * M.TH) / 2;
  }
  new ResizeObserver(resize).observe(wrap);

  // ---------- Eventos do jogo ----------
  function crash() {
    mode = "crash";
    MS.errors++;
    updateSide();
    api.play && api.play("loginError");
    wrap.classList.add("zap");
    setTimeout(() => wrap.classList.remove("zap"), 800);
    if (MS.errors >= CFG.interferenceErrors) interfere();
    setTimeout(() => {
      if (mode !== "crash") return;
      pos = [...M.start]; dir = M.dir; want = null; trail = [];
      countdown();
    }, 900);
  }

  async function levelDone() {
    mode = "between";
    api.play && api.play("unlock");
    MS.level++;
    updateSide();
    if (MS.level >= LV.length) return finish();
    await message(`✔ ${LV[MS.level - 1].label} RECONECTADO<br><small>Próximo: ${LV[MS.level].label}</small>`, 1500);
    loadLevel();
    countdown();
  }

  async function countdown() {
    mode = "between";
    for (const n of ["3", "2", "1"]) await message(n, 350);
    if (MS.paused) return;
    mode = "run";
  }

  function message(html, ms) {
    overlay.innerHTML = `<div class="mz-msg">${html}</div>`;
    overlay.classList.remove("hidden");
    return sleep(ms).then(() => { if (!MS.paused) overlay.classList.add("hidden"); });
  }

  function ask(text) {
    return new Promise((resolve) => {
      overlay.innerHTML = `<div class="mz-ask"><p>${text}</p><div><button class="no">Não</button><button class="yes">Sim</button></div></div>`;
      overlay.classList.remove("hidden");
      overlay.querySelector(".no").onclick = () => { const a = overlay.querySelector(".mz-ask"); a.classList.remove("shake"); void a.offsetWidth; a.classList.add("shake"); };
      overlay.querySelector(".yes").onclick = () => { overlay.classList.add("hidden"); resolve(); };
      overlay.querySelector(".yes").focus();
    });
  }

  // ---------- Interferência (uma única vez) ----------
  async function interfere() {
    if (MS.interfered) return;
    MS.interfered = true;
    clearTimeout(MS.timer);
    MS.paused = true;
    await Interference.run();
    MS.paused = false;
    if (!MS.done && window.MazeState.resume) window.MazeState.resume();
  }
  window.MazeState.interfere = interfere;

  // Retomar depois da interferência
  MS.resume = async () => {
    if (!el.isConnected) return;
    mode = "idle";
    pos = [...M.start]; dir = M.dir; trail = [];
    await ask("O sistema se recuperou.<br>Podemos continuar?");
    countdown();
  };

  async function finish() {
    MS.done = true;
    clearTimeout(MS.timer);
    mode = "win";
    el.querySelector(".bios-main").classList.add("powered");
    overlay.innerHTML = `<div class="mz-msg">✔ TODOS OS COMPONENTES<br>RECONECTADOS</div>`;
    overlay.classList.remove("hidden");
    await sleep(1500);
    if (!MS.interfered) {
      MS.interfered = true;
      await Interference.run();
    }
    overlay.classList.add("hidden");
    api.win(el.querySelector(".bios"));
  }

  function updateSide() {
    statusEl.innerHTML = LV.map((l, i) => {
      const st = i < MS.level ? "<span class='ok'>[OK]</span>" : i === MS.level ? "<span class='cur'>[>>]</span>" : "<span class='bad'>[--]</span>";
      return `<div><i style="background:${l.color}"></i>${l.label.padEnd(4, " ")} ${st}</div>`;
    }).join("");
    el.querySelector(".mz-errors").textContent = `Erros: ${MS.errors}`;
  }

  // ---------- Teclado ----------
  const onKey = (e) => {
    if (!el.isConnected) return removeEventListener("keydown", onKey);
    // Atalho do mestre do jogo: Ctrl+Shift+N pula o componente atual
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "n" && mode !== "win" && mode !== "idle") return levelDone();
    const d = KEYS[e.key];
    if (!d || mode === "idle" || mode === "win") return;
    e.preventDefault();
    if (mode !== "run") { want = d; return; }
    const [dx, dy] = DIRS[d];
    if (DIRS[dir][0] === -dx && DIRS[dir][1] === -dy) dir = d; // meia-volta sempre pode
    else want = d;
  };
  addEventListener("keydown", onKey);

  // ---------- Início ----------
  (async () => {
    if (MS.done) {
      loadLevel(); mode = "win";
      requestAnimationFrame(frame);
      return api.win(el.querySelector(".bios"));
    }
    loadLevel();
    requestAnimationFrame(frame);
    await ask(MS.started ? "Podemos continuar?" : "Podemos iniciar?");
    if (!MS.started) {
      MS.started = true;
      MS.timer = setTimeout(interfere, CFG.interferenceMinutes * 60000);
    }
    countdown();
  })();
};
