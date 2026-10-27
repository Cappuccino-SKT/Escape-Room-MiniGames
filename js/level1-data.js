// ===== NÍVEL 1 — "AS NOTAS": DADOS DO CASO =====
// Usado pelo jogo (js/level1.js), pelo projetor (projetor.html) e pelos papéis da sala (imprimir-nivel1.html).
// ATENÇÃO: só o NOME do professor é real; todo o resto (filha, formatura, número da sorte, fotos, e-mails) é inventado.
// O nome ainda depende da autorização do professor: se ele não autorizar, troque "professor" abaixo e reimprima os papéis.
//
// Resposta final (falada ao mestre do jogo): ALICE19987
//   = nome da filha (ALICE) + ano da formatura (1994 + 4 = 1998) + número da sorte (111 em binário = 7)
window.L1 = {
  professor: "Prof. Muriel Godoi",
  password: "ALICE19987",
  passwordHint: "O nome da minha filha + o ano em que me formei + o meu número da sorte.",

  intro: [
    "Olá.",
    "",
    "Este é o computador do {prof}.",
    "As notas finais de vocês estão aqui dentro.",
    "",
    "Eu troquei a senha do Sistema de Notas.",
    "Quando o tempo acabar, TODAS as notas serão ZERADAS.",
    "",
    "A não ser que vocês descubram a senha nova.",
    "Ela tem a cara do professor. Investiguem a vida dele.",
    "",
    "Quando souberem a senha, digam para mim, em voz alta.",
    "Errar tem um preço.",
    "",
    "                                                          — J"
  ],

  // ---------- Peça 1: o nome da filha ----------
  // Na sala: 3 desenhos (Alice, Pedro, Sofia). O e-mail da escola diz "sua filha, da turma 3B";
  // a lista da turma 3B só tem a Alice. O desenho da Sofia é "para o tio" (é sobrinha).
  emails: [
    { from: "Escola Pequeno Saber", subject: "Reunião de pais — turma 3B", time: "ontem, 17:20",
      body: ["Prezado responsável,", "", "Convidamos para a reunião de pais da sua filha, aluna da turma 3B,", "nesta sexta-feira, às 19h.", "", "Segue a lista da turma em anexo.", "", "Coordenação — Escola Pequeno Saber"],
      attach: { name: "lista_turma_3B.txt", lines: ["TURMA 3B — 2026", "", "Alice", "Bruna", "Caio", "Davi", "Helena", "Isadora", "João", "Laura", "Miguel", "Rafaela"] } },
    { from: "Coordenação do Curso", subject: "Prazo das notas finais", time: "ontem, 09:02",
      body: ["Professor, lembrete: as notas finais precisam ser lançadas no", "Sistema de Notas até amanhã. Depois disso, o sistema fecha."] },
    { from: "suporte-ti@jigsaw.net", subject: "Sua senha foi alterada", time: "hoje, 00:13",
      body: ["Olá, professor.", "", "A senha do seu Sistema de Notas foi alterada com sucesso.", "Não foi você? Que pena.", "", "— J"] },
    { from: "Escola Pequeno Saber", subject: "Feira de ciências — turma 5A", time: "semana passada",
      body: ["Prezado responsável,", "", "O seu filho, da turma 5A, apresentará o projeto do foguete", "na feira de ciências. Contamos com a sua presença!"] }
  ],

  // ---------- Peça 2: o ano da formatura ----------
  // Na sala: diploma com o ano rasgado, mas com "curso de 4 (quatro) anos". No PC: formatura.c com a lacuna.
  cIngresso: 1994,
  cDuracao: 4,

  // ---------- Peça 3: o número da sorte ----------
  // Na sala: post-it "111" + cartaz com a tabela binária. No PC: aula_binario (slides).
  luckyBinary: "111",
  slides: [
    { title: "Aula 1 — Números binários", lines: ["O computador só entende 0 e 1.", "Cada posição vale o dobro da anterior:", "", "  4   2   1", "  ↑   ↑   ↑", "  1   0   1   =  4 + 1  =  5"] },
    { title: "Exemplos", lines: ["001 = 1", "010 = 2", "011 = 3", "100 = 4", "110 = 6"] },
    { title: "Desafio da aula", lines: ["Meu número da sorte está colado no meu monitor.", "Em binário, claro. :)", "", "Quem descobrir quanto ele vale em decimal ganha 1 ponto extra."] }
  ],

  // ---------- Opcionais ----------
  // anotacoes.docx: texto em branco sobre branco, aparece com Ctrl+A (selecionar tudo).
  hiddenNote: ["Lembrete — senha nova do Sistema de Notas:", "começa pelo NOME DELA,", "depois o ANO em que me formei,", "e termina com o meu NÚMERO DA SORTE.", "Tudo junto, sem espaço."],

  // Jogo da memória de hardware: ao completar, recupera a foto da formatura (com o ano).
  memory: [
    { icon: "🧠", name: "CPU" }, { icon: "🧩", name: "RAM" }, { icon: "💾", name: "SSD" },
    { icon: "🖱️", name: "Mouse" }, { icon: "⌨️", name: "Teclado" }, { icon: "🎮", name: "GPU" }
  ],
  memoryReward: "Foto recuperada: formatura.jpg (veja no app Fotos).",

  // Navegador: histórico de buscas
  history: [
    { t: "hoje, 00:12", q: "como alterar senha do sistema de notas remotamente" },
    { t: "ontem, 22:40", q: "presente de aniversário para menina de 8 anos" },
    { t: "ontem, 22:31", q: "escola pequeno saber reunião de pais turma 3B" },
    { t: "ontem, 21:05", q: "como explicar números binários para criança" },
    { t: "ontem, 20:50", q: "foguete de garrafa pet passo a passo (feira de ciências do Pedro)" },
    { t: "ontem, 18:12", q: "senha forte: misturar nome + ano + número é seguro?" },
    { t: "anteontem", q: "reencontro da turma de engenharia — 30 anos de formados?" }
  ],

  // Lixeira
  trash: [
    { name: "senha_antiga.txt", lines: ["senha antiga do Sistema de Notas: pedro2020", "(trocada — não serve mais)"] },
    { name: "NAO_ABRA.exe", trap: true }
  ],

  // Papéis da sala
  drawings: [
    { name: "Alice", text: "Eu, o papai e o Pedro", kind: "family" },
    { name: "Pedro", text: "Meu foguete!", kind: "rocket" },
    { name: "Sofia", text: "Para o tio, com amor", kind: "heart" }
  ]
};
