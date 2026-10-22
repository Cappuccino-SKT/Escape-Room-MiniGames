// ===== MINIGAME: PAINEL DE FIOS (fonte ATX) =====
// Ligue cada fio colorido ao pino certo, consultando o manual do técnico.
window.WiresGame = function (el, api) {
  // Cores reais do padrão de fontes ATX de computador
  const WIRES = [
    { color: "#f2d21b", name: "Amarelo",  pin: "+12V" },
    { color: "#e02424", name: "Vermelho", pin: "+5V" },
    { color: "#f28c1b", name: "Laranja",  pin: "+3.3V" },
    { color: "#222222", name: "Preto",    pin: "GND" },
    { color: "#21b24a", name: "Verde",    pin: "PS_ON" },
    { color: "#8e3fd6", name: "Roxo",     pin: "+5VSB" }
  ];
  const pins = [...WIRES].sort(() => Math.random() - 0.5);
  const links = {}; // índice do fio -> pino
  let shorts = 0;

  el.innerHTML = `
    <div class="wires">
      <div class="w-head">
        <span>⚡ PAINEL DE ENERGIA — SALA DE CONTENÇÃO</span>
        <span class="w-status">STATUS: <b>SEM ENERGIA</b></span>
      </div>
      <div class="w-body">
        <div class="w-board">
          <svg class="w-svg"></svg>
          <div class="w-col left">${WIRES.map((w, i) => `
            <div class="w-port" data-i="${i}"><span class="w-label">${w.name}</span><span class="w-plug" style="background:${w.color}"></span></div>`).join("")}
          </div>
          <div class="w-col right">${pins.map((p) => `
            <div class="w-pin" data-pin="${p.pin}"><span class="w-plug"></span><span class="w-label">${p.pin}</span></div>`).join("")}
          </div>
        </div>
        <div class="w-manual">
          <h4>📘 MANUAL DO TÉCNICO</h4>
          <p>Fonte padrão ATX. Ligue cada fio ao seu pino:</p>
          <table>${WIRES.map((w) => `<tr><td><i style="background:${w.color}"></i>${w.name}</td><td>${w.pin}</td></tr>`).join("")}</table>
          <p class="w-warn">⚠ Ligação errada causa curto-circuito.</p>
        </div>
      </div>
      <div class="w-foot">
        <div class="w-meter"><i></i></div>
        <span class="w-count">0 / ${WIRES.length} conexões</span>
        <span class="w-shorts"></span>
      </div>
    </div>`;

  const board = el.querySelector(".w-board"), svg = el.querySelector(".w-svg");
  const NS = "http://www.w3.org/2000/svg";

  const center = (node) => {
    const r = node.querySelector(".w-plug").getBoundingClientRect(), b = board.getBoundingClientRect();
    return { x: r.left + r.width / 2 - b.left, y: r.top + r.height / 2 - b.top };
  };
  const curve = (a, b) => {
    const dx = Math.max(40, Math.abs(b.x - a.x) / 2);
    return `M${a.x},${a.y} C${a.x + dx},${a.y} ${b.x - dx},${b.y} ${b.x},${b.y}`;
  };
  function makePath(color) {
    const p = document.createElementNS(NS, "path");
    p.setAttribute("stroke", color);
    p.setAttribute("class", "w-wire");
    svg.appendChild(p);
    return p;
  }

  // Redesenha os fios fixos (ao redimensionar/maximizar a janela)
  function redraw() {
    svg.querySelectorAll(".w-wire.fixed").forEach((p) => {
      const port = el.querySelector(`.w-port[data-i="${p.dataset.i}"]`);
      const pin = el.querySelector(`.w-pin[data-pin="${CSS.escape(links[p.dataset.i])}"]`);
      p.setAttribute("d", curve(center(port), center(pin)));
    });
  }
  new ResizeObserver(redraw).observe(board);

  el.querySelectorAll(".w-port").forEach((port) => {
    port.addEventListener("pointerdown", (e) => {
      const i = port.dataset.i;
      if (links[i] !== undefined) return;
      e.preventDefault();
      const wire = WIRES[i], start = center(port), path = makePath(wire.color);
      port.classList.add("active");

      const move = (ev) => {
        const b = board.getBoundingClientRect();
        path.setAttribute("d", curve(start, { x: ev.clientX - b.left, y: ev.clientY - b.top }));
      };
      const up = (ev) => {
        removeEventListener("pointermove", move);
        removeEventListener("pointerup", up);
        port.classList.remove("active");
        const pin = document.elementFromPoint(ev.clientX, ev.clientY)?.closest(".w-pin");
        if (!pin || !el.contains(pin) || pin.classList.contains("done")) return path.remove();
        path.setAttribute("d", curve(start, center(pin)));
        if (pin.dataset.pin === wire.pin) connect(i, port, pin, path);
        else short(pin, path);
      };
      move(e);
      addEventListener("pointermove", move);
      addEventListener("pointerup", up);
    });
  });

  function connect(i, port, pin, path) {
    links[i] = pin.dataset.pin;
    path.classList.add("fixed"); path.dataset.i = i;
    port.classList.add("done"); pin.classList.add("done");
    pin.querySelector(".w-plug").style.background = WIRES[i].color;
    const n = Object.keys(links).length;
    el.querySelector(".w-count").textContent = `${n} / ${WIRES.length} conexões`;
    el.querySelector(".w-meter i").style.width = (n / WIRES.length) * 100 + "%";
    if (n === WIRES.length) powerOn();
  }

  function short(pin, path) {
    shorts++;
    path.classList.add("bad");
    pin.classList.add("spark");
    el.querySelector(".wires").classList.add("shock");
    el.querySelector(".w-shorts").textContent = `⚡ Curtos-circuitos: ${shorts}`;
    api.play && api.play("loginError");
    setTimeout(() => { path.remove(); pin.classList.remove("spark"); el.querySelector(".wires").classList.remove("shock"); }, 600);
  }

  function powerOn() {
    const status = el.querySelector(".w-status b");
    const steps = ["VERIFICANDO TENSÕES...", "+12V OK  +5V OK  +3.3V OK", "LIGANDO SISTEMA...", "CONEXÃO ESTABELECIDA"];
    el.querySelector(".wires").classList.add("powered");
    steps.forEach((s, k) => setTimeout(() => (status.textContent = s), k * 900));
    setTimeout(() => api.win(el.querySelector(".wires")), steps.length * 900 + 300);
  }
};
