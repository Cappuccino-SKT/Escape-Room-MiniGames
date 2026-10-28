// ===== NÍVEL 1 — "AS NOTAS" =====
// Ativo com index.html?nivel=1 (ou escolhendo "Nível 1"). O J trocou a senha do Sistema de Notas do professor;
// a senha = nome da filha + ano da formatura + número da sorte. O grupo investiga o PC e a sala e FALA a senha
// ao mestre do jogo (cronômetro, punição e vitória no projetor.html).
// Trilha principal: LEIA-ME → Sistema de Notas ("Esqueci a senha") → E-mail + Fotos (filha) → formatura.c (ano) → aula_binario (sorte).
// Opcionais: anotacoes.docx (Ctrl+A), memoria.exe (foto da formatura), Navegador, Lixeira (armadilha).
(() => {
  const C = window.CONFIG, D = window.L1;
  if (C.level !== 1) return;

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const prof = (t) => t.replace(/\{prof\}/g, D.professor);
  const S = { photoUnlocked: false, solved: new Set() };
  function done(id, label) {
    if (S.solved.has(id)) return;
    S.solved.add(id);
    PhaseLog.mark(label);
  }

  C.password = "";
  C.userName = "Convidado";
  C.timerMinutes = 0; // o cronômetro oficial fica no projetor
  window.GATE = null;
  window.onDesktopReady = () => OS.openApp("leia");

  // ---------- LEIA-ME (recado do J) ----------
  function Leia(el) {
    el.innerHTML = Doc.html(D.intro, prof);
  }

  // ---------- Sistema de Notas (bloqueado: a senha é falada ao J) ----------
  function Notas(el) {
    const alunos = ["Ana C.", "Bruno L.", "Carla M.", "Diego S.", "Eduarda P.", "Fábio O.", "Gabriel R.", "Heloísa T."];
    el.innerHTML = `
      <div class="l1-notas">
        <div class="l1-notas-h"><b>🎓 Sistema de Notas</b><span>${esc(D.professor)} — Notas finais 2026</span></div>
        <div class="l1-notas-body">
          <table class="l2-tab"><tr><th>Aluno</th><th>Nota final</th></tr>
            ${alunos.map((a) => `<tr><td>${a}</td><td class="l1-blur">██,█</td></tr>`).join("")}</table>
          <div class="l1-lock">
            <div class="l1-lock-ico">🔒</div>
            <h3>BLOQUEADO PELO J</h3>
            <form><input placeholder="Senha" autocomplete="off"><button>Entrar</button></form>
            <p class="l2-msg"></p>
            <button class="l1-forgot">Esqueci a senha</button>
            <p class="l1-hint hidden"></p>
          </div>
        </div>
      </div>`;
    const form = el.querySelector("form"), input = form.querySelector("input"), msg = el.querySelector(".l2-msg");
    let busy = false;
    form.onsubmit = async (e) => {
      e.preventDefault();
      if (busy || !input.value.trim()) return;
      input.value = "";
      msg.textContent = "Este campo está bloqueado. A senha só vale se for dita para mim. — J";
      busy = true;
      await Interference.error("nivel1");
      busy = false;
    };
    el.querySelector(".l1-forgot").onclick = () => {
      const h = el.querySelector(".l1-hint");
      h.classList.remove("hidden");
      h.innerHTML = `Dica cadastrada pelo professor:<br><b>“${esc(D.passwordHint)}”</b>`;
      done("hint", "Dica da senha");
    };
  }

  // ---------- E-mail do professor ----------
  function Email(el) {
    el.innerHTML = `<div class="l2-mail"><div class="l2-mail-list">${D.emails.map((m, i) => `
        <div class="l2-mail-i" data-i="${i}"><b>${esc(m.from)}</b><span>${esc(m.subject)}${m.attach ? " 📎" : ""}</span><small>${esc(m.time)}</small></div>`).join("")}</div>
      <div class="l2-mail-body"><p class="muted">Selecione um e-mail.</p></div></div>`;
    el.querySelectorAll(".l2-mail-i").forEach((it) => (it.onclick = () => {
      el.querySelectorAll(".l2-mail-i").forEach((x) => x.classList.remove("sel"));
      it.classList.add("sel");
      const m = D.emails[it.dataset.i], body = el.querySelector(".l2-mail-body");
      body.innerHTML = `<h3>${esc(m.subject)}</h3><small>De: <b>${esc(m.from)}</b> · ${esc(m.time)}</small><div class="mail-text">${Doc.paras(m.body)}</div>
        ${m.attach ? `<button class="l1-attach">📎 ${esc(m.attach.name)}</button>
          <div class="l1-att hidden"><b>${esc(m.attach.lines[0])}</b><ol>${m.attach.lines.slice(1).filter((l) => l.trim()).map((l) => `<li>${esc(l)}</li>`).join("")}</ol></div>` : ""}`;
      const b = body.querySelector(".l1-attach");
      if (b) b.onclick = () => { body.querySelector(".l1-att").classList.toggle("hidden"); done("turma", "Lista da turma 3B"); };
    }));
  }

  // ---------- Fotos ----------
  const PHOTOS = {
    familia: `<svg viewBox="0 0 320 200"><rect width="320" height="200" fill="#8ec5e8"/><rect y="140" width="320" height="60" fill="#e8d39a"/>
      <circle cx="270" cy="40" r="22" fill="#ffd54a"/>
      <g><circle cx="150" cy="70" r="18" fill="#e0b48c"/><rect x="132" y="88" width="36" height="58" rx="8" fill="#2d5d8a"/></g>
      <g><circle cx="105" cy="105" r="13" fill="#e0b48c"/><path d="M90 98 q-10 14 2 22 M120 98 q10 14 -2 22" stroke="#6b3e1f" stroke-width="5" fill="none"/>
        <path d="M92 118 h26 l6 34 h-38 z" fill="#e2557a"/></g>
      <g><circle cx="200" cy="105" r="13" fill="#e0b48c"/><rect x="188" y="118" width="24" height="32" rx="5" fill="#3e9b54"/></g>
      <text x="160" y="190" text-anchor="middle" font-size="11" fill="#555">praia — férias de julho</text></svg>`,
    gato: `<svg viewBox="0 0 320 200"><rect width="320" height="200" fill="#3b3b44"/><rect x="40" y="120" width="240" height="40" rx="6" fill="#222"/>
      <ellipse cx="160" cy="118" rx="58" ry="26" fill="#d98c3a"/><circle cx="208" cy="100" r="20" fill="#d98c3a"/>
      <path d="M196 84 l4 -14 l8 12 M214 82 l8 -12 l2 15" fill="#d98c3a"/><path d="M200 100 q4 3 8 0 M212 100 q4 3 8 0" stroke="#222" stroke-width="2" fill="none"/>
      <text x="160" y="190" text-anchor="middle" font-size="11" fill="#bbb">dormindo no teclado de novo</text></svg>`,
    formatura: `<svg viewBox="0 0 320 200"><rect width="320" height="200" fill="#5a4a3a"/>
      <rect x="40" y="18" width="240" height="34" fill="#f4ecd6"/><text x="160" y="41" text-anchor="middle" font-size="16" font-weight="bold" fill="#7a0000">FORMANDOS ENG. COMPUTAÇÃO 1998</text>
      ${[60, 110, 160, 210, 260].map((x) => `<g><circle cx="${x}" cy="105" r="15" fill="#e0b48c"/><rect x="${x - 18}" y="120" width="36" height="60" rx="8" fill="#111"/>
        <path d="M${x - 20} 92 h40 l-20 -9 z" fill="#111"/></g>`).join("")}
      <text x="160" y="196" text-anchor="middle" font-size="10" fill="#ddd">colação de grau</text></svg>`
  };
  function Fotos(el) {
    const items = [["familia", "familia.jpg"], ["gato", "gato.jpg"], ["formatura", "formatura.jpg"]];
    el.innerHTML = `<div class="l1-fotos">
      <div class="l1-thumbs">${items.map(([k, n]) => `<button data-k="${k}">${k === "formatura" && !S.photoUnlocked ? "⚠️" : "🖼️"} ${n}</button>`).join("")}</div>
      <div class="l1-view"><p class="muted">Selecione uma foto.</p></div></div>`;
    el.querySelectorAll(".l1-thumbs button").forEach((b) => (b.onclick = () => {
      const v = el.querySelector(".l1-view");
      if (b.dataset.k === "formatura" && !S.photoUnlocked)
        return (v.innerHTML = `<p class="err">Arquivo corrompido.<br><small>Recupere os componentes do computador para restaurar esta foto.</small></p>`);
      v.innerHTML = PHOTOS[b.dataset.k];
    }));
  }

  // ---------- formatura.c (lacuna) ----------
  function Formatura(el) {
    el.innerHTML = `
      <div class="l2-code">
        <div class="l2-code-bar"><span>📄 formatura.c</span><button class="l2-run">▶ Compilar e executar</button></div>
        <pre><span class="ln"> 1</span>#include &lt;stdio.h&gt;
<span class="ln"> 2</span>
<span class="ln"> 3</span>/* Ano em que me formei. A duração está no meu diploma. */
<span class="ln"> 4</span>int main() {
<span class="ln"> 5</span>    int ingresso = ${D.cIngresso};
<span class="ln"> 6</span>    int duracao  = <input class="l1-gap" maxlength="3" placeholder="___" spellcheck="false">;   /* anos de curso */
<span class="ln"> 7</span>
<span class="ln"> 8</span>    printf("Me formei em %d\\n", ingresso + duracao);
<span class="ln"> 9</span>    return 0;
<span class="ln">10</span>}</pre>
        <div class="l2-console">$ <span class="l2-con"></span></div>
      </div>`;
    const gap = el.querySelector(".l1-gap"), con = el.querySelector(".l2-con");
    el.querySelector(".l2-run").onclick = async () => {
      const v = gap.value.trim();
      con.textContent = "gcc formatura.c -o formatura ...";
      await sleep(700);
      if (!/^\d+$/.test(v)) {
        con.innerHTML = `<span class="err">formatura.c:6: erro: esperado um número antes de ';'</span>`;
        return;
      }
      con.innerHTML = `./formatura<br>Me formei em ${D.cIngresso + Number(v)}`;
      if (Number(v) === D.cDuracao) done("ano", "Ano da formatura (formatura.c)");
    };
  }

  // ---------- aula_binario (slides) ----------
  function Aula(el) {
    let i = 0;
    const render = () => {
      const s = D.slides[i];
      el.innerHTML = `<div class="l1-slides"><div class="l1-slide"><h2>${esc(s.title)}</h2><pre>${s.lines.map(esc).join("\n")}</pre></div>
        <div class="l1-slide-nav"><button class="p" ${i ? "" : "disabled"}>◀</button><span>${i + 1} / ${D.slides.length}</span><button class="n" ${i < D.slides.length - 1 ? "" : "disabled"}>▶</button></div></div>`;
      el.querySelector(".p").onclick = () => { i--; render(); };
      el.querySelector(".n").onclick = () => { i++; render(); if (i === D.slides.length - 1) done("aula", "Aula de binário"); };
    };
    render();
  }

  // ---------- Opcional: anotacoes.docx (texto em branco — aparece com Ctrl+A) ----------
  function Anotacoes(el) {
    el.innerHTML = `<div class="l1-doc"><div class="l1-doc-bar">📄 anotacoes.docx</div>
      <div class="l1-page" tabindex="0"><div class="l1-white">${D.hiddenNote.map(esc).join("<br>")}</div></div></div>`;
    const page = el.querySelector(".l1-page"), txt = el.querySelector(".l1-white");
    setTimeout(() => page.focus(), 50);
    page.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        const r = document.createRange(); r.selectNodeContents(txt);
        const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r);
      }
    });
    const onSel = () => {
      if (!el.isConnected) return document.removeEventListener("selectionchange", onSel);
      const sel = getSelection();
      if (sel.rangeCount && !sel.isCollapsed && txt.contains(sel.anchorNode)) done("nota", "Anotação escondida (Ctrl+A)");
    };
    document.addEventListener("selectionchange", onSel);
  }

  // ---------- Opcional: memoria.exe (hardware) ----------
  function Memoria(el) {
    const cards = D.memory.flatMap((m, i) => [{ id: i, face: `<span class="big">${m.icon}</span>` }, { id: i, face: `<b>${esc(m.name)}</b>` }]);
    for (let i = cards.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [cards[i], cards[j]] = [cards[j], cards[i]]; }
    el.innerHTML = `<div class="l1-mem"><p>Ligue cada componente ao seu nome para recuperar os arquivos corrompidos.</p>
      <div class="l1-grid">${cards.map((c, i) => `<button class="l1-card" data-i="${i}"><span class="back">?</span><span class="front">${c.face}</span></button>`).join("")}</div>
      <p class="l2-msg ok"></p></div>`;
    const btns = [...el.querySelectorAll(".l1-card")];
    let open = [], lock = false, pairs = 0;
    btns.forEach((b) => (b.onclick = async () => {
      if (lock || b.classList.contains("up")) return;
      b.classList.add("up");
      open.push(b);
      if (open.length < 2) return;
      const [x, y] = open; open = [];
      if (cards[x.dataset.i].id === cards[y.dataset.i].id) {
        x.classList.add("ok"); y.classList.add("ok");
        if (++pairs === D.memory.length) {
          S.photoUnlocked = true;
          el.querySelector(".l2-msg").textContent = "✔ " + D.memoryReward;
          OS.notify("🖼️ " + D.memoryReward);
          done("memoria", "Jogo da memória");
        }
      } else {
        lock = true; await sleep(800);
        x.classList.remove("up"); y.classList.remove("up"); lock = false;
      }
    }));
  }

  // ---------- Opcional: Navegador (histórico) ----------
  function Navegador(el) {
    el.innerHTML = `<div class="l1-nav"><div class="l1-nav-bar">🌐 Histórico</div>
      ${D.history.map((h) => `<div class="l1-nav-i"><small>${esc(h.t)}</small><span>🔍 ${esc(h.q)}</span></div>`).join("")}</div>`;
  }

  // ---------- Lixeira (com armadilha) ----------
  function Lixeira(el) {
    el.innerHTML = `<div class="l1-trash">${D.trash.map((f, i) => `<button data-i="${i}">${f.trap ? "⚙️" : "📄"} ${esc(f.name)}</button>`).join("")}
      <div class="l1-trash-view"></div></div>`;
    el.querySelectorAll("button").forEach((b) => (b.onclick = async () => {
      const f = D.trash[b.dataset.i], v = el.querySelector(".l1-trash-view");
      if (!f.trap) return (v.innerHTML = Doc.paras(f.lines));
      v.textContent = "Executando NAO_ABRA.exe ...";
      await sleep(400);
      await Interference.scare("nivel1_armadilha");
      v.textContent = "Eu avisei.";
    }));
  }

  APPS.length = 0;
  APPS.push(
    { id: "leia", title: "LEIA-ME.txt", icon: "📄", width: 620, height: 460, render: Leia },
    { id: "notas", title: "Sistema de Notas", icon: "🎓", width: 720, height: 480, render: Notas },
    { id: "email", title: "E-mail", icon: "✉️", width: 780, height: 500, render: Email },
    { id: "fotos", title: "Fotos", icon: "🖼️", width: 620, height: 460, render: Fotos },
    { id: "formatura", title: "formatura.c", icon: "📝", width: 640, height: 440, render: Formatura },
    { id: "aula", title: "aula_binario.pptx", icon: "📊", width: 640, height: 440, render: Aula },
    { id: "anotacoes", title: "anotacoes.docx", icon: "📃", width: 560, height: 420, render: Anotacoes },
    { id: "memoria", title: "memoria.exe", icon: "🧠", width: 620, height: 520, render: Memoria },
    { id: "navegador", title: "Navegador", icon: "🌐", width: 620, height: 420, render: Navegador },
    { id: "lixeira", title: "Lixeira", icon: "🗑️", width: 480, height: 320, render: Lixeira }
  );
})();
