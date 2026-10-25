// ===== REGISTRO DE TEMPO POR FASE (para os testes) =====
// Começa a contar ao ligar o computador. PhaseLog.mark("nome") marca o fim de uma fase.
// Atalho do mestre do jogo: Ctrl+Shift+L mostra os tempos (da partida atual ou, se não houver, da última).
window.PhaseLog = (() => {
  const KEY = "jigsaw-phase-log";
  let start = 0, last = 0, marks = [];

  const fmt = (ms) => { const s = Math.round(ms / 1000); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; };
  function save() { try { localStorage.setItem(KEY, JSON.stringify(marks)); } catch (e) {} }
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } }

  function begin() { start = last = Date.now(); marks = []; }
  function mark(name) {
    if (!start) begin();
    const now = Date.now();
    marks.push({ name, dur: now - last, total: now - start });
    last = now;
    save();
  }

  function show() {
    const list = marks.length ? marks : load();
    const rows = list.map((m) => `<tr><td>${m.name}</td><td>${fmt(m.dur)}</td><td>${fmt(m.total)}</td></tr>`).join("");
    OS.dialog({ icon: "⏱", title: marks.length ? "Tempo por fase" : "Tempo por fase (última partida)",
      text: list.length
        ? `<table class="pl"><tr><th>Fase</th><th>Duração</th><th>Total</th></tr>${rows}</table>` +
          (marks.length ? `<small>Agora: ${fmt(Date.now() - start)} desde que o computador foi ligado.</small>` : "")
        : "Nenhuma fase concluída ainda." });
  }

  document.getElementById("power-btn").addEventListener("click", begin);
  addEventListener("keydown", (e) => { if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "l") { e.preventDefault(); show(); } });

  return { mark };
})();
