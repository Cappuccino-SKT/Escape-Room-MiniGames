// ===== MINI INTERPRETADOR DE C (usado pelo decifra.c do Nível 3) =====
// Roda um pedaço do C de verdade no navegador, sem internet: funções, int/char/ponteiros, vetores,
// if/else, for, while, do-while, break/continue, return, operadores do C (com o % do C: -3 % 26 = -3),
// strings, printf/putchar/strlen/strcpy/toupper/tolower/isalpha/isupper/islower/isdigit/abs.
// Tudo é memória de verdade: escrever fora de um vetor dá "Segmentation fault", variável sem
// inicializar tem lixo, string sem '\0' imprime lixo.
//
//   const prog = MiniC.compile(texto, linhaInicial)  // lança MiniC.Error { line, col, msg } (erro de compilação)
//   const rt = MiniC.runtime(prog, { out: (txt) => ... })
//   const p = rt.buffer("char", 64, valores)          // cria um vetor; devolve um ponteiro para ele
//   rt.call("decifra", [p1, p2, p3])                  // lança MiniC.Crash { msg } (erro de execução)
window.MiniC = (() => {
  class CError extends Error { constructor(msg, line, col) { super(msg); this.msg = msg; this.line = line; this.col = col; } }
  class Crash extends Error { constructor(msg) { super(msg); this.msg = msg; } }

  // ---------- Léxico ----------
  const TYPES = new Set(["void", "char", "int", "long", "short", "unsigned", "signed", "const"]);
  const KEYWORDS = new Set([...TYPES, "if", "else", "for", "while", "do", "return", "break", "continue", "sizeof", "struct"]);
  const PUNCT = ["<<=", ">>=", "...", "++", "--", "+=", "-=", "*=", "/=", "%=", "&=", "|=", "^=", "==", "!=", "<=", ">=", "&&", "||", "<<", ">>", "->",
    "+", "-", "*", "/", "%", "=", "<", ">", "!", "~", "&", "|", "^", "?", ":", ";", ",", "(", ")", "[", "]", "{", "}", "."];
  const ESC = { n: 10, t: 9, r: 13, "0": 0, "\\": 92, "'": 39, '"': 34, a: 7, b: 8 };

  function lex(src, line0) {
    const toks = [];
    let i = 0, line = line0, col = 1;
    const adv = (n = 1) => { for (let k = 0; k < n; k++) { if (src[i] === "\n") { line++; col = 1; } else col++; i++; } };
    const escape = () => {
      adv(); // a barra
      const c = src[i];
      if (c === "x") { adv(); let h = ""; while (/[0-9a-fA-F]/.test(src[i] || "")) { h += src[i]; adv(); } return parseInt(h || "0", 16); }
      if (/[0-7]/.test(c)) { let o = ""; while (o.length < 3 && /[0-7]/.test(src[i] || "")) { o += src[i]; adv(); } return parseInt(o, 8); }
      if (!(c in ESC)) throw new CError(`sequência de escape desconhecida: '\\${c}'`, line, col);
      adv();
      return ESC[c];
    };
    while (i < src.length) {
      const c = src[i];
      if (/\s/.test(c)) { adv(); continue; }
      if (src.startsWith("//", i)) { while (i < src.length && src[i] !== "\n") adv(); continue; }
      if (src.startsWith("/*", i)) {
        const l = line, cl = col;
        adv(2);
        while (i < src.length && !src.startsWith("*/", i)) adv();
        if (i >= src.length) throw new CError("comentário não terminado", l, cl);
        adv(2); continue;
      }
      if (c === "#" ) { while (i < src.length && src[i] !== "\n") adv(); continue; }
      const t = { line, col };
      if (/[A-Za-z_]/.test(c)) {
        let w = "";
        while (/[A-Za-z0-9_]/.test(src[i] || "")) { w += src[i]; adv(); }
        t.type = KEYWORDS.has(w) ? "kw" : "id"; t.v = w;
      } else if (/[0-9]/.test(c)) {
        let w = "";
        while (/[0-9A-Za-z_]/.test(src[i] || "")) { w += src[i]; adv(); }
        const m = /^(0[xX][0-9a-fA-F]+|[0-9]+)[uUlL]*$/.exec(w);
        if (!m) throw new CError(`número inválido '${w}'`, t.line, t.col);
        t.type = "num"; t.v = m[1].length > 1 && m[1][0] === "0" && !/x/i.test(m[1]) ? parseInt(m[1], 8) : Number(m[1]);
      } else if (c === "'") {
        adv();
        if (src[i] === "'") throw new CError("caractere vazio ''", t.line, t.col);
        const v = src[i] === "\\" ? escape() : (adv(), src.charCodeAt(i - 1));
        if (src[i] !== "'") throw new CError("caractere não terminado (falta ')", t.line, t.col);
        adv();
        t.type = "num"; t.v = v;
      } else if (c === '"') {
        adv();
        const s = [];
        while (src[i] !== '"') {
          if (i >= src.length || src[i] === "\n") throw new CError("string não terminada (falta \")", t.line, t.col);
          s.push(src[i] === "\\" ? escape() : (adv(), src.charCodeAt(i - 1)));
        }
        adv();
        t.type = "str"; t.v = s;
      } else {
        const p = PUNCT.find((p) => src.startsWith(p, i));
        if (!p) throw new CError(`caractere inesperado '${c}'`, line, col);
        adv(p.length);
        t.type = "p"; t.v = p;
      }
      toks.push(t);
    }
    toks.push({ type: "eof", v: "fim do arquivo", line, col });
    return toks;
  }

  // ---------- Sintaxe ----------
  function parse(toks) {
    let p = 0;
    const peek = (o = 0) => toks[p + o];
    const is = (v, o = 0) => { const t = toks[p + o]; return (t.type === "p" || t.type === "kw") && t.v === v; };
    const show = (t) => (t.type === "eof" ? "fim do arquivo" : t.type === "str" ? "string" : t.type === "num" && toks[p] === t ? String(t.v) : t.v);
    function expect(v) {
      if (is(v)) return toks[p++];
      // como o gcc: o erro aparece no fim do token anterior
      const prev = toks[p - 1] || toks[p], t = toks[p];
      const where = v === ";" || v === ")" || v === "]" ? prev : t;
      throw new CError(`esperado '${v}' antes de '${show(t)}'`, where.line, where.type === "eof" ? where.col : (where === prev ? where.col + String(where.v).length : where.col));
    }
    const isType = () => peek().type === "kw" && TYPES.has(peek().v);
    function typeSpec() {
      const t = peek();
      let base = null;
      while (isType()) { const w = toks[p++].v; if (w === "void" || w === "char" || w === "int") base = w; else if (!base) base = "int"; }
      if (is("struct")) throw new CError("struct não é suportado neste programa", peek().line, peek().col);
      if (!base) throw new CError(`tipo esperado antes de '${show(t)}'`, t.line, t.col);
      return base;
    }
    function ident() {
      const t = peek();
      if (t.type !== "id") throw new CError(`esperado um nome antes de '${show(t)}'`, t.line, t.col);
      p++;
      return t;
    }

    function program() {
      const funcs = {};
      while (peek().type !== "eof") {
        const ret = typeSpec();
        let ptr = 0; while (is("*")) { p++; ptr++; }
        const name = ident();
        expect("(");
        const params = [];
        if (is("void") && is(")", 1)) p++;
        else if (!is(")")) {
          do {
            const bt = typeSpec();
            let pp = 0; while (is("*")) { p++; pp++; }
            const pn = ident();
            if (is("[")) { p++; if (!is("]")) expr(); expect("]"); pp++; }
            params.push({ name: pn.v, type: pp ? "ptr" : bt, elem: pp > 1 ? "ptr" : bt });
          } while (is(",") && ++p);
        }
        expect(")");
        if (is(";")) { p++; continue; } // protótipo
        if (!is("{")) expect("{");
        const body = block();
        if (funcs[name.v]) throw new CError(`redefinição de '${name.v}'`, name.line, name.col);
        funcs[name.v] = { name: name.v, ret: ptr ? "ptr" : ret, params, body, line: name.line };
      }
      return funcs;
    }

    function block() {
      const t = expect("{");
      const body = [];
      while (!is("}")) {
        if (peek().type === "eof") throw new CError("esperado '}' no fim da entrada", t.line, t.col);
        body.push(stmt());
      }
      p++;
      return { k: "block", body, line: t.line };
    }

    function decl() {
      const line = peek().line;
      const base = typeSpec();
      const vars = [];
      do {
        let ptr = 0; while (is("*")) { p++; ptr++; }
        const name = ident();
        let size = null, init = null;
        if (is("[")) { p++; size = is("]") ? "auto" : expr(); expect("]"); }
        if (is("=")) {
          p++;
          if (is("{")) {
            p++; init = { list: [] };
            while (!is("}")) { init.list.push(assign()); if (!is("}")) expect(","); }
            p++;
          } else init = assign();
        }
        if (base === "void" && !ptr) throw new CError(`variável '${name.v}' declarada como void`, name.line, name.col);
        vars.push({ name: name.v, line: name.line, col: name.col, type: ptr ? "ptr" : base, elem: ptr > 1 || (ptr && size) ? "ptr" : ptr ? base : base, ptrDepth: ptr, size, init });
      } while (is(",") && ++p);
      expect(";");
      return { k: "decl", vars, line };
    }

    function stmt() {
      const t = peek();
      if (is("{")) return block();
      if (isType()) return decl();
      if (is(";")) { p++; return { k: "empty" }; }
      if (is("if")) {
        p++; expect("("); const c = expr(); expect(")");
        const a = stmt(); let b = null;
        if (is("else")) { p++; b = stmt(); }
        return { k: "if", c, a, b, line: t.line };
      }
      if (is("while")) { p++; expect("("); const c = expr(); expect(")"); return { k: "while", c, body: stmt(), line: t.line }; }
      if (is("do")) {
        p++; const body = stmt();
        if (!is("while")) expect("while");
        p++; expect("("); const c = expr(); expect(")"); expect(";");
        return { k: "do", c, body, line: t.line };
      }
      if (is("for")) {
        p++; expect("(");
        let init = null;
        if (isType()) init = decl();
        else { if (!is(";")) init = { k: "expr", e: expr() }; expect(";"); }
        const c = is(";") ? null : expr(); expect(";");
        const step = is(")") ? null : expr(); expect(")");
        return { k: "for", init, c, step, body: stmt(), line: t.line };
      }
      if (is("return")) { p++; const e = is(";") ? null : expr(); expect(";"); return { k: "return", e, line: t.line }; }
      if (is("break")) { p++; expect(";"); return { k: "break", line: t.line }; }
      if (is("continue")) { p++; expect(";"); return { k: "continue", line: t.line }; }
      if (is("else")) throw new CError("'else' sem um 'if' antes", t.line, t.col);
      const e = expr();
      expect(";");
      return { k: "expr", e, line: t.line };
    }

    // Expressões (precedência do C)
    function expr() {
      let e = assign();
      while (is(",")) { const t = toks[p++]; e = { k: "comma", a: e, b: assign(), line: t.line }; }
      return e;
    }
    const ASSIGN = new Set(["=", "+=", "-=", "*=", "/=", "%=", "&=", "|=", "^=", "<<=", ">>="]);
    function assign() {
      const l = cond();
      const t = peek();
      if (t.type === "p" && ASSIGN.has(t.v)) { p++; return { k: "assign", op: t.v, l, r: assign(), line: t.line, col: t.col }; }
      return l;
    }
    function cond() {
      const c = bin(0);
      if (is("?")) { const t = toks[p++]; const a = expr(); expect(":"); return { k: "cond", c, a, b: cond(), line: t.line }; }
      return c;
    }
    const LEVELS = [["||"], ["&&"], ["|"], ["^"], ["&"], ["==", "!="], ["<", ">", "<=", ">="], ["<<", ">>"], ["+", "-"], ["*", "/", "%"]];
    function bin(lv) {
      if (lv === LEVELS.length) return unary();
      let l = bin(lv + 1);
      while (peek().type === "p" && LEVELS[lv].includes(peek().v)) {
        const t = toks[p++];
        l = { k: "bin", op: t.v, l, r: bin(lv + 1), line: t.line, col: t.col };
      }
      return l;
    }
    function unary() {
      const t = peek();
      if (t.type === "p" && ["-", "+", "!", "~", "*", "&"].includes(t.v)) { p++; return { k: "un", op: t.v, e: unary(), line: t.line, col: t.col }; }
      if (is("++") || is("--")) { p++; return { k: "pre", op: t.v, e: unary(), line: t.line, col: t.col }; }
      if (is("sizeof")) {
        p++;
        if (is("(") && peek(1).type === "kw" && TYPES.has(peek(1).v)) {
          p++; const b = typeSpec(); let ptr = 0; while (is("*")) { p++; ptr++; } expect(")");
          return { k: "num", v: ptr ? 8 : b === "char" ? 1 : 4 };
        }
        return { k: "sizeof", e: unary(), line: t.line };
      }
      // cast: (tipo) expr
      if (is("(") && peek(1).type === "kw" && TYPES.has(peek(1).v)) {
        p++; const b = typeSpec(); let ptr = 0; while (is("*")) { p++; ptr++; } expect(")");
        return { k: "cast", to: ptr ? "ptr" : b, e: unary(), line: t.line };
      }
      return postfix();
    }
    function postfix() {
      let e = primary();
      for (;;) {
        const t = peek();
        if (is("[")) { p++; const i = expr(); expect("]"); e = { k: "index", a: e, i, line: t.line, col: t.col }; }
        else if (is("(")) {
          p++; const args = [];
          if (!is(")")) { do { args.push(assign()); } while (is(",") && ++p); }
          expect(")");
          if (e.k !== "var") throw new CError("só dá para chamar funções pelo nome", t.line, t.col);
          e = { k: "call", name: e.name, args, line: e.line, col: e.col };
        } else if (is("++") || is("--")) { p++; e = { k: "post", op: t.v, e, line: t.line, col: t.col }; }
        else if (is("->") || is(".")) throw new CError("struct não é suportado neste programa", t.line, t.col);
        else return e;
      }
    }
    function primary() {
      const t = peek();
      if (t.type === "num") { p++; return { k: "num", v: t.v }; }
      if (t.type === "str") { p++; let s = t.v; while (peek().type === "str") s = s.concat(toks[p++].v); return { k: "str", v: s }; }
      if (t.type === "id") { p++; return { k: "var", name: t.v, line: t.line, col: t.col }; }
      if (is("(")) { p++; const e = expr(); expect(")"); return e; }
      throw new CError(`esperada uma expressão antes de '${show(t)}'`, t.line, t.col);
    }
    return program();
  }

  function compile(src, line0 = 1) { return parse(lex(src, line0)); }

  // ---------- Execução ----------
  const toChar = (v) => (((v | 0) + 128) & 255) - 128;
  const isPtr = (v) => v !== null && typeof v === "object";
  const BREAK = { s: "break" }, CONT = { s: "continue" };

  function runtime(funcs, opts = {}) {
    const out = opts.out || (() => {});
    let steps = 0;
    const MAX_STEPS = 3e6;
    const tick = () => { if (++steps > MAX_STEPS) throw new Crash("Tempo limite: o programa não terminou (loop infinito?)"); };
    const garbage = () => [0, 7, 32767, -1, 4199040, 21845, 65][Math.floor(Math.random() * 7)];

    // Memória: cada vetor/variável é um bloco { data, elem, readonly }
    function block(elem, n, vals, readonly = false) {
      const data = new Array(n);
      for (let i = 0; i < n; i++) data[i] = vals && i < vals.length ? vals[i] : elem === "char" ? 33 + Math.floor(Math.random() * 94) : garbage();
      return { data, elem, readonly };
    }
    const ptr = (b, off = 0) => ({ b, off });
    const SEGV = "Segmentation fault (core dumped)";
    function load(pv) {
      if (!isPtr(pv)) throw new Crash(SEGV);
      const { b, off } = pv;
      if (off < 0 || off >= b.data.length) {
        if (off >= 0 && off < b.data.length + 32) return b.elem === "char" ? 33 + Math.floor(Math.random() * 94) : garbage(); // lixo logo depois
        throw new Crash(SEGV);
      }
      return b.data[off];
    }
    function store(pv, v) {
      if (!isPtr(pv) || pv.b.readonly || pv.off < 0 || pv.off >= pv.b.data.length) throw new Crash(SEGV);
      pv.b.data[pv.off] = pv.b.elem === "char" ? toChar(isPtr(v) ? 0 : v) : pv.b.elem === "int" ? (isPtr(v) ? 0 : v | 0) : v;
      return pv.b.data[pv.off];
    }
    const num = (v) => (isPtr(v) ? 1 : v); // ponteiro em contexto booleano
    const truthy = (v) => (isPtr(v) ? true : v !== 0);
    function cstr(pv) {
      let s = [], q = { ...pv };
      for (let n = 0; n < 4096; n++) { const c = load(q); if (c === 0) break; s.push(c); q.off++; }
      return s;
    }
    const show = (codes) => codes.map((c) => ((c & 255) >= 32 && (c & 255) < 127 ? String.fromCharCode(c & 255) : "�")).join("");

    function printf(args) {
      const f = cstr(args[0]).map((c) => String.fromCharCode(c & 255)).join("");
      let k = 1;
      const res = f.replace(/%[-0 +#]*(\d*)(?:\.\d+)?(l{0,2}|h{0,2})([dicsxXu%p])/g, (m, w, _l, t) => {
        if (t === "%") return "%";
        const a = args[k++];
        let s;
        if (t === "s") s = a === undefined ? "(null)" : show(cstr(a));
        else if (t === "c") s = show([num(a ?? 0)]);
        else if (t === "x" || t === "X") { s = ((num(a ?? 0)) >>> 0).toString(16); if (t === "X") s = s.toUpperCase(); }
        else if (t === "u") s = String(num(a ?? 0) >>> 0);
        else if (t === "p") s = "0x7ffd" + (isPtr(a) ? (a.off * 4).toString(16).padStart(4, "0") : "0000");
        else s = String(num(a ?? 0) | 0);
        return w ? s.padStart(+w) : s;
      });
      out(res);
      return res.length;
    }

    const BUILTINS = {
      strlen: (a) => cstr(a[0]).length,
      printf,
      putchar: (a) => (out(show([a[0]])), a[0]),
      puts: (a) => (out(show(cstr(a[0])) + "\n"), 0),
      strcpy: (a) => { const s = cstr(a[1]); s.concat(0).forEach((c, i) => store({ b: a[0].b, off: a[0].off + i }, c)); return a[0]; },
      toupper: (a) => (a[0] >= 97 && a[0] <= 122 ? a[0] - 32 : a[0]),
      tolower: (a) => (a[0] >= 65 && a[0] <= 90 ? a[0] + 32 : a[0]),
      isalpha: (a) => +((a[0] >= 65 && a[0] <= 90) || (a[0] >= 97 && a[0] <= 122)),
      isupper: (a) => +(a[0] >= 65 && a[0] <= 90),
      islower: (a) => +(a[0] >= 97 && a[0] <= 122),
      isdigit: (a) => +(a[0] >= 48 && a[0] <= 57),
      abs: (a) => Math.abs(a[0] | 0)
    };

    function call(name, args, line) {
      const f = funcs[name];
      if (!f) {
        if (BUILTINS[name]) return BUILTINS[name](args);
        throw new CError(`a função '${name}' não foi declarada`, line);
      }
      if (args.length !== f.params.length) throw new CError(`número errado de argumentos para '${name}' (esperado ${f.params.length})`, line);
      const scope = [new Map()];
      f.params.forEach((pr, i) => {
        const b = block(pr.type === "ptr" ? "ptr" : pr.type, 1, [pr.type === "char" ? toChar(args[i]) : args[i]]);
        b.ptrElem = pr.elem;
        scope[0].set(pr.name, { b, arr: false });
      });
      const r = exec(f.body, scope, true);
      if (r && r.s === "return") return r.v;
      return f.ret === "void" ? undefined : garbage();
    }

    function lookup(scope, name, node) {
      for (let i = scope.length - 1; i >= 0; i--) if (scope[i].has(name)) return scope[i].get(name);
      throw new CError(`'${name}' não foi declarado (primeiro uso nesta função)`, node.line, node.col);
    }

    function exec(s, scope, fnBody = false) {
      tick();
      switch (s.k) {
        case "block": {
          if (!fnBody) scope.push(new Map());
          try {
            for (const st of s.body) { const r = exec(st, scope); if (r) return r; }
          } finally { if (!fnBody) scope.pop(); }
          return null;
        }
        case "decl":
          for (const v of s.vars) {
            const top = scope[scope.length - 1];
            if (top.has(v.name)) throw new CError(`redeclaração de '${v.name}'`, v.line, v.col);
            if (v.size) {
              let n;
              if (v.size === "auto") n = v.init ? (v.init.list ? v.init.list.length : v.init.k === "str" ? v.init.v.length + 1 : 1) : 0;
              else n = eval_(v.size, scope);
              if (!(n > 0)) throw new CError(`tamanho inválido do vetor '${v.name}'`, v.line, v.col);
              const b = block(v.elem, n);
              if (v.init) {
                const vals = v.init.list ? v.init.list.map((e) => eval_(e, scope)) : v.init.k === "str" ? v.init.v.concat(0) : null;
                if (!vals) throw new CError(`inicializador inválido para o vetor '${v.name}'`, v.line, v.col);
                for (let i = 0; i < n; i++) store(ptr(b, i), i < vals.length ? vals[i] : 0);
              }
              top.set(v.name, { b, arr: true });
            } else {
              const b = block(v.type, 1);
              b.ptrElem = v.elem;
              top.set(v.name, { b, arr: false });
              if (v.init) {
                if (v.init.list) throw new CError(`'{' não serve para inicializar '${v.name}'`, v.line, v.col);
                store(ptr(b, 0), eval_(v.init, scope));
              }
            }
          }
          return null;
        case "expr": eval_(s.e, scope); return null;
        case "empty": return null;
        case "if":
          if (truthy(eval_(s.c, scope))) return exec(s.a, scope);
          return s.b ? exec(s.b, scope) : null;
        case "while":
          while (truthy(eval_(s.c, scope))) {
            const r = exec(s.body, scope);
            if (r === BREAK) break;
            if (r && r !== CONT) return r;
          }
          return null;
        case "do":
          do {
            const r = exec(s.body, scope);
            if (r === BREAK) break;
            if (r && r !== CONT) return r;
          } while (truthy(eval_(s.c, scope)));
          return null;
        case "for": {
          scope.push(new Map());
          try {
            if (s.init) exec(s.init, scope);
            while (!s.c || truthy(eval_(s.c, scope))) {
              const r = exec(s.body, scope);
              if (r === BREAK) break;
              if (r && r !== CONT) return r;
              if (s.step) eval_(s.step, scope);
              tick();
            }
          } finally { scope.pop(); }
          return null;
        }
        case "return": return { s: "return", v: s.e ? eval_(s.e, scope) : undefined };
        case "break": return BREAK;
        case "continue": return CONT;
      }
      throw new Crash("comando desconhecido");
    }

    // Endereço (lvalue) de uma expressão
    function addr(e, scope) {
      if (e.k === "var") {
        const v = lookup(scope, e.name, e);
        if (v.arr) throw new CError(`não dá para atribuir a um vetor ('${e.name}')`, e.line, e.col);
        return ptr(v.b, 0);
      }
      if (e.k === "index") return offset(eval_(e.a, scope), eval_(e.i, scope), e);
      if (e.k === "un" && e.op === "*") return deref(eval_(e.e, scope));
      throw new CError("o lado esquerdo da atribuição precisa ser uma variável", e.line, e.col);
    }
    function deref(pv) { if (!isPtr(pv)) throw new Crash(SEGV); return pv; }
    function offset(a, i, e) {
      if (isPtr(i) && !isPtr(a)) [a, i] = [i, a];
      if (!isPtr(a)) { if (a === 0) throw new Crash(SEGV); throw new CError("o valor indexado não é um vetor nem um ponteiro", e.line, e.col); }
      return ptr(a.b, a.off + (i | 0));
    }
    // Ponteiro guardado numa variável: o bloco apontado sabe o tipo do elemento
    function arith(op, a, b, e) {
      if (isPtr(a) || isPtr(b)) {
        if (op === "+") return isPtr(a) ? ptr(a.b, a.off + (b | 0)) : ptr(b.b, b.off + (a | 0));
        if (op === "-" && isPtr(a) && !isPtr(b)) return ptr(a.b, a.off - (b | 0));
        if (op === "-" && isPtr(a) && isPtr(b)) return a.off - b.off;
        const x = isPtr(a) ? a.off + 1e6 : a, y = isPtr(b) ? b.off + 1e6 : b;
        if (["==", "!=", "<", ">", "<=", ">="].includes(op)) return arith(op, x, y, e);
        if (op === "&&" || op === "||") return arith(op, num(a), num(b), e);
        throw new CError(`operação '${op}' inválida com ponteiro`, e.line, e.col);
      }
      switch (op) {
        case "+": return (a + b) | 0;
        case "-": return (a - b) | 0;
        case "*": return Math.imul(a, b);
        case "/": if (b === 0) throw new Crash("Floating point exception (core dumped)"); return (a / b) | 0;
        case "%": if (b === 0) throw new Crash("Floating point exception (core dumped)"); return (a % b) | 0; // igual ao C: o sinal segue o dividendo
        case "<<": return a << b;
        case ">>": return a >> b;
        case "&": return a & b;
        case "|": return a | b;
        case "^": return a ^ b;
        case "==": return +(a === b);
        case "!=": return +(a !== b);
        case "<": return +(a < b);
        case ">": return +(a > b);
        case "<=": return +(a <= b);
        case ">=": return +(a >= b);
      }
      throw new CError(`operador desconhecido '${op}'`, e.line, e.col);
    }

    function eval_(e, scope) {
      tick();
      switch (e.k) {
        case "num": return e.v;
        case "str": return ptr(block("char", e.v.length + 1, e.v.concat(0), true));
        case "var": {
          const v = lookup(scope, e.name, e);
          return v.arr ? ptr(v.b, 0) : v.b.data[0];
        }
        case "index": return load(offset(eval_(e.a, scope), eval_(e.i, scope), e));
        case "call": return call(e.name, e.args.map((a) => eval_(a, scope)), e.line);
        case "assign": {
          const a = addr(e.l, scope);
          let v = eval_(e.r, scope);
          if (e.op !== "=") v = arith(e.op.slice(0, -1), load(a), v, e);
          return store(a, v);
        }
        case "pre": case "post": {
          const a = addr(e.e, scope), old = load(a);
          store(a, arith(e.op[0], old, 1, e));
          return e.k === "pre" ? load(a) : old;
        }
        case "un": {
          if (e.op === "&") {
            if (e.e.k === "var") { const v = lookup(scope, e.e.name, e.e); return ptr(v.b, 0); }
            return addr(e.e, scope);
          }
          const v = eval_(e.e, scope);
          if (e.op === "*") return load(deref(v));
          if (e.op === "!") return +!truthy(v);
          if (isPtr(v)) throw new CError(`operação '${e.op}' inválida com ponteiro`, e.line, e.col);
          if (e.op === "-") return (-v) | 0;
          if (e.op === "~") return ~v;
          return v;
        }
        case "bin": {
          if (e.op === "&&") return +(truthy(eval_(e.l, scope)) && truthy(eval_(e.r, scope)));
          if (e.op === "||") return +(truthy(eval_(e.l, scope)) || truthy(eval_(e.r, scope)));
          return arith(e.op, eval_(e.l, scope), eval_(e.r, scope), e);
        }
        case "cond": return truthy(eval_(e.c, scope)) ? eval_(e.a, scope) : eval_(e.b, scope);
        case "comma": eval_(e.a, scope); return eval_(e.b, scope);
        case "cast": { const v = eval_(e.e, scope); return e.to === "char" ? toChar(num(v)) : e.to === "int" ? (isPtr(v) ? v.off : v | 0) : v; }
        case "sizeof": {
          if (e.e.k === "var") { const v = lookup(scope, e.e.name, e.e); if (v.arr) return v.b.data.length * (v.b.elem === "char" ? 1 : v.b.elem === "int" ? 4 : 8); return v.b.elem === "char" ? 1 : v.b.elem === "int" ? 4 : 8; }
          return 4;
        }
      }
      throw new Crash("expressão desconhecida");
    }

    return {
      buffer: (elem, n, vals) => ptr(block(elem, n, vals)),
      read: (pv, n) => { const r = []; for (let i = 0; i < n; i++) r.push(load({ b: pv.b, off: pv.off + i })); return r; },
      cstr: (pv) => show(cstr(pv)),
      has: (name) => !!funcs[name],
      params: (name) => funcs[name] && funcs[name].params,
      call: (name, args) => call(name, args, 0)
    };
  }

  return { compile, runtime, Error: CError, Crash };
})();
