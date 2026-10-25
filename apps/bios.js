// ===== MINIGAME: BIOS — RECONEXÃO DE COMPONENTES =====
// Ligue os pontos de mesma cor. As paredes do labirinto estão ocultas:
// ao bater em uma, ela aparece por um instante.
window.BiosGame = function (el, api) {
  const CFG = window.CONFIG.bios;
  const G = CFG.grid.map((row) => [...row]);
  const R = G.length, Cn = G[0].length;
  const key = (r, c) => r + "," + c;
  const colorOf = (r, c) => G[r][c].toUpperCase();

  // ---------- Paredes (entre células de cores diferentes) ----------
  const walls = new Set();
  const wallId = (a, b) => [key(...a), key(...b)].sort().join("|");
  const between = [];
  for (let r = 0; r < R; r++) for (let c = 0; c < Cn; c++) {
    [[r, c + 1], [r + 1, c]].forEach(([r2, c2]) => {
      if (r2 < R && c2 < Cn && colorOf(r, c) !== colorOf(r2, c2)) between.push(wallId([r, c], [r2, c2]));
    });
  }
  // passagens falsas com sorteio fixo (sempre as mesmas)
  let seed = 1337;
  const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  const decoys = new Set();
  while (decoys.size < Math.min(CFG.decoyOpenings || 0, between.length)) decoys.add(between[Math.floor(rnd() * between.length)]);
  between.forEach((w) => !decoys.has(w) && walls.add(w));

  // ---------- Pontos ----------
  const ends = {}; // cor -> [[r,c],[r,c]]
  for (let r = 0; r < R; r++) for (let c = 0; c < Cn; c++) {
    const ch = G[r][c];
    if (ch === ch.toUpperCase()) (ends[ch] = ends[ch] || []).push([r, c]);
  }
  const endAt = (r, c) => Object.keys(ends).find((k) => ends[k].some(([a, b]) => a === r && b === c));
  const paths = {}; // cor -> [[r,c], ...]
  Object.keys(ends).forEach((k) => (paths[k] = []));

  el.innerHTML = `
    <div class="bios">
      <div class="bios-top">JIGSAW BIOS SETUP UTILITY</div>
      <div class="bios-tabs"><span>Main</span><span class="on">Advanced</span><span>Boot</span><span>Security</span><span>Exit</span></div>
      <div class="bios-body">
        <div class="bios-main">
          <div class="bios-title">▶ Reconexão de barramentos da placa-mãe</div>
          <div class="bios-gridwrap"><div class="bios-grid" style="--c:${Cn};--r:${R}"><svg class="bios-svg" viewBox="0 0 ${Cn} ${R}" preserveAspectRatio="none"></svg></div></div>
        </div>
        <div class="bios-side">
          <b>Ajuda do item</b>
          <p>Ligue cada componente ao seu par de mesma cor arrastando a conexão.</p>
          <p class="bios-red">ERRO 0x666: o mapa de trilhas da placa foi APAGADO pelo invasor. As paredes estão invisíveis.</p>
          <p>Bater em uma trilha bloqueada causa curto.</p>
          <div class="bios-status"></div>
        </div>
      </div>
      <div class="bios-foot"><span>Arrastar: Conectar</span><span>Clique no ponto: Limpar</span><span class="bios-shorts">Curtos: 0</span></div>
    </div>`;

  const grid = el.querySelector(".bios-grid"), svg = el.querySelector(".bios-svg");
  const status = el.querySelector(".bios-status");
  const cells = {};
  for (let r = 0; r < R; r++) for (let c = 0; c < Cn; c++) {
    const d = document.createElement("div");
    d.className = "bios-cell";
    d.dataset.r = r; d.dataset.c = c;
    const k = endAt(r, c);
    if (k) {
      const col = CFG.colors[k] || { color: "#fff", label: k };
      d.innerHTML = `<span class="bios-dot" style="background:${col.color}">${col.label}</span>`;
    }
    grid.appendChild(d);
    cells[key(r, c)] = d;
  }

  const owner = (r, c) => Object.keys(paths).find((k) => paths[k].some(([a, b]) => a === r && b === c));
  const done = (k) => {
    const p = paths[k];
    if (p.length < 2) return false;
    const [a, b] = [p[0], p[p.length - 1]];
    return endAt(...a) === k && endAt(...b) === k && key(...a) !== key(...b);
  };

  function draw() {
    svg.innerHTML = "";
    Object.keys(paths).forEach((k) => {
      const p = paths[k];
      if (p.length < 2) return;
      const line = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
      line.setAttribute("points", p.map(([r, c]) => `${c + 0.5},${r + 0.5}`).join(" "));
      line.setAttribute("stroke", (CFG.colors[k] || {}).color || "#fff");
      line.setAttribute("class", "bios-line" + (done(k) ? " ok" : ""));
      svg.appendChild(line);
    });
    Object.entries(cells).forEach(([kk, d]) => {
      const [r, c] = kk.split(",").map(Number);
      const o = owner(r, c);
      d.style.setProperty("--fill", o ? (CFG.colors[o] || {}).color : "transparent");
      d.classList.toggle("filled", !!o);
    });
    const n = Object.keys(paths).filter(done).length, total = Object.keys(paths).length;
    status.innerHTML = Object.keys(paths).map((k) =>
      `<div><i style="background:${CFG.colors[k].color}"></i>${CFG.colors[k].label.padEnd(4, " ")} ${done(k) ? "<span class='ok'>[CONECTADO]</span>" : "<span class='bad'>[FALHA]</span>"}</div>`).join("");
    if (n === total) win();
  }

  // ---------- Desenho com o mouse/dedo ----------
  let cur = null; // cor sendo desenhada
  const cellFromPoint = (x, y) => {
    const b = grid.getBoundingClientRect();
    const c = Math.floor(((x - b.left) / b.width) * Cn), r = Math.floor(((y - b.top) / b.height) * R);
    return r >= 0 && r < R && c >= 0 && c < Cn ? [r, c] : null;
  };

  grid.addEventListener("pointerdown", (e) => {
    if (finished) return;
    const pos = cellFromPoint(e.clientX, e.clientY);
    if (!pos) return;
    e.preventDefault();
    const k = endAt(...pos);
    if (k) { paths[k] = [pos]; cur = k; }
    else {
      const o = owner(...pos);
      if (!o) return;
      const i = paths[o].findIndex(([a, b]) => a === pos[0] && b === pos[1]);
      paths[o] = paths[o].slice(0, i + 1);
      cur = o;
    }
    draw();
    const move = (ev) => {
      const t = cellFromPoint(ev.clientX, ev.clientY);
      if (!t || !cur) return;
      // anda célula por célula até o alvo (movimentos rápidos)
      let guard = 20;
      while (cur && guard--) {
        const last = paths[cur][paths[cur].length - 1];
        if (last[0] === t[0] && last[1] === t[1]) break;
        const dr = t[0] - last[0], dc = t[1] - last[1];
        const next = Math.abs(dr) >= Math.abs(dc) ? [last[0] + Math.sign(dr), last[1]] : [last[0], last[1] + Math.sign(dc)];
        if (!step(next)) break;
      }
      draw();
    };
    const up = () => { cur = null; removeEventListener("pointermove", move); removeEventListener("pointerup", up); draw(); };
    addEventListener("pointermove", move);
    addEventListener("pointerup", up);
  });

  // Tenta avançar a conexão atual para a célula "next". Retorna false se bloqueou.
  function step(next) {
    const p = paths[cur], last = p[p.length - 1];
    // voltar sobre o próprio caminho = apagar
    const back = p.findIndex(([a, b]) => a === next[0] && b === next[1]);
    if (back >= 0) { paths[cur] = p.slice(0, back + 1); return true; }
    if (done(cur)) return false;
    if (walls.has(wallId(last, next))) { shortCircuit(last, next); return false; }
    const e = endAt(...next);
    if (e && e !== cur) return false;
    const o = owner(...next);
    if (o && o !== cur) {
      // corta a conexão da outra cor
      const i = paths[o].findIndex(([a, b]) => a === next[0] && b === next[1]);
      paths[o] = paths[o].slice(0, i);
    }
    p.push(next);
    if (e === cur) { cur = null; api.play && api.play("unlock"); }
    return true;
  }

  // Parede invisível: aparece por um instante + curto
  let shorts = 0;
  function shortCircuit(a, b) {
    shorts++;
    el.querySelector(".bios-shorts").textContent = `Curtos: ${shorts}`;
    const w = document.createElement("div");
    w.className = "bios-wall";
    const vertical = a[0] === b[0];
    const r = Math.max(a[0], b[0]), c = Math.max(a[1], b[1]);
    Object.assign(w.style, vertical
      ? { left: `calc(${c} * 100% / ${Cn})`, top: `calc(${a[0]} * 100% / ${R})`, height: `calc(100% / ${R})` }
      : { top: `calc(${r} * 100% / ${R})`, left: `calc(${a[1]} * 100% / ${Cn})`, width: `calc(100% / ${Cn})` });
    w.classList.add(vertical ? "v" : "h");
    grid.appendChild(w);
    setTimeout(() => w.remove(), 1200);
    grid.classList.remove("zap"); void grid.offsetWidth; grid.classList.add("zap");
    api.play && api.play("loginError");
    cur = null;
  }

  let finished = false;
  function win() {
    if (finished) return;
    finished = true;
    el.querySelector(".bios-main").classList.add("powered");
    status.insertAdjacentHTML("beforeend", "<p class='ok'>Todos os barramentos reconectados.<br>Salvando configuração...</p>");
    setTimeout(() => api.win(el.querySelector(".bios")), 2000);
  }

  draw();
};

// O diagrama para imprimir (pista física da sala) está em diagrama.html
