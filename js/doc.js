// ===== TEXTOS FORMATADOS (usado pelos 3 níveis) =====
// Um texto é uma lista de blocos:
//   { h }  título · { h2 } subtítulo · { p } parágrafo · { ol: [...] } passos numerados · { ul: [...] } lista
//   { warn } alerta · { box } destaque · { kv: [[rótulo, texto], ...] } pares · { sign } assinatura
// Dentro dos textos: `texto` vira código e **texto** vira negrito.
//   Doc.html(blocos, troca?)  → HTML (troca: função aplicada a cada texto antes, ex.: trocar {prof} pelo nome)
//   Doc.paras(linhas)         → parágrafos a partir de linhas soltas (linha vazia = novo parágrafo), para e-mails
window.Doc = (() => {
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const fmt = (t) => esc(t).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");

  function html(blocks, swap = (t) => t) {
    const f = (t) => fmt(swap(t));
    return `<div class="doc">${blocks.map((b) =>
      b.h ? `<h3>${f(b.h)}</h3>`
      : b.h2 ? `<h4>${f(b.h2)}</h4>`
      : b.p ? `<p>${f(b.p)}</p>`
      : b.ol ? `<ol>${b.ol.map((x) => `<li>${f(x)}</li>`).join("")}</ol>`
      : b.ul ? `<ul>${b.ul.map((x) => `<li>${f(x)}</li>`).join("")}</ul>`
      : b.warn ? `<p class="warn">⚠ ${f(b.warn)}</p>`
      : b.box ? `<div class="box">${f(b.box)}</div>`
      : b.kv ? `<dl>${b.kv.map(([k, v]) => `<dt>${f(k)}</dt><dd>${f(v)}</dd>`).join("")}</dl>`
      : b.sign ? `<p class="sign">${f(b.sign)}</p>`
      : "").join("")}</div>`;
  }

  function paras(lines) {
    const out = [];
    let cur = [];
    for (const l of [...lines, ""]) {
      if (l.trim()) cur.push(fmt(l.trim()));
      else if (cur.length) { out.push(`<p>${cur.join("<br>")}</p>`); cur = []; }
    }
    return out.join("");
  }

  return { esc, fmt, html, paras };
})();
