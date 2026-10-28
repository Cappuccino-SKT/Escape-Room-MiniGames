// ===== NÍVEL 2 — "O CÚMPLICE": DADOS DO CASO =====
// Usado pelo jogo (js/level2.js) e pelos papéis da sala (imprimir-nivel2.html).
// ATENÇÃO: as pistas dependem umas das outras. Se mudar algo aqui, confira o guia TESTES-NIVEL2.md.
//
// Resposta final (falada ao mestre do jogo): ELISA.
// Caminho: fechadura (portas lógicas) → quem entrou tinha crachá de monitor E a senha →
// lista de monitores (sala): Bruno, Elisa, Rafael → chat (senha = saída do limpeza.c): Rafael saiu antes da senha nova →
// Bruno tem álibi (ônibus 22:58 com o Rafael) → sobra a Elisa, que mente no depoimento.
window.L2 = {
  culprit: "Elisa",
  room: "N112",

  // Login do notebook. Na sala: uma carta por letra, com o número da posição (imprimir-nivel2.html).
  loginPassword: "TRAICAO",
  loginHint: "As letras estão espalhadas pela sala. Os números dizem a ordem.",

  // Recado do J (formato de js/doc.js)
  caso: [
    { h: "Olá. Vocês já me conhecem." },
    { p: "Ontem à noite, entre **23:00 e 23:10**, alguém entrou no **Laboratório N112** e instalou o meu vírus neste computador. Eu não estava aqui." },
    { warn: "Eu tenho um **CÚMPLICE**." },
    { p: "São **5 suspeitos**. As fichas e os depoimentos estão neste computador." },
    { h2: "As regras do jogo" },
    { ol: [
      "Meu cúmplice **MENTE**. Os inocentes dizem a **VERDADE**.",
      "Quando souberem quem é, **digam o nome para mim**, em voz alta.",
      "Errar a acusação tem um preço."
    ] },
    { box: "Tudo o que vocês precisam está neste computador ou nesta sala. Investiguem." },
    { sign: "— J" }
  ],

  suspects: [
    { name: "Bruno Sato",    icon: "🧑‍💻", course: "Eng. da Computação", year: 2024,
      notes: "Usa o N112 quase todo dia. Tem um gato chamado Bit." },
    { name: "Elisa Prado",   icon: "👩‍🎨", course: "Arquitetura",        year: 2022,
      notes: "Usa o N112 para renderizar maquetes. Sempre anda com um tubo de projeto." },
    { name: "Carla Menezes", icon: "👩‍💼", course: "Direito",            year: 2023,
      notes: "Estagiária da secretaria. Responsável pela chave física do N112." },
    { name: "Diego Fontes",  icon: "🧑‍⚕️", course: "Medicina",           year: 2023,
      notes: "Estuda no corredor do bloco N até tarde. Sempre de jaleco." },
    { name: "Rafael Kuhn",   icon: "👨‍🔧", course: "Eng. Elétrica",      year: 2022,
      notes: "Mora no mesmo bairro que o Bruno. Volta de ônibus." }
  ],

  // Depoimentos. A Elisa (cúmplice) mente; os outros falam a verdade.
  statements: {
    "Bruno Sato":    "Saí do laboratório às 22:50. Peguei o ônibus das 22:58 com o Rafael e fui direto para casa.",
    "Elisa Prado":   "Eu já tinha ido embora bem antes das 23h. E eu vi: o Bruno voltou ao laboratório depois das 23h.",
    "Carla Menezes": "Devolvi a chave do N112 na portaria às 22h, como sempre. Depois fui embora.",
    "Diego Fontes":  "Eu estava estudando no corredor. Por volta das 23h, vi alguém com crachá de monitor entrando no N112. Não vi o rosto.",
    "Rafael Kuhn":   "Às 23h o Bruno estava no ônibus comigo. E eu nem sei a senha nova da porta: saí do grupo dos monitores antes de ela mudar."
  },

  // Fechadura: PORTA = (A G1 B) G2 C, com G1 = AND e G2 = OR. As portas aparecem "queimadas";
  // o grupo deduz quais são pelo registro abaixo. Com o reparo certo, o registro das 23:03 é reconstruído.
  lock: {
    inputs: { A: "crachá de monitor", B: "senha da porta", C: "chave física" },
    gates: { G1: "AND", G2: "OR" },
    options: ["AND", "OR", "XOR", "NAND"],
    log: [
      { t: "08:12", A: 1, B: 1, C: 0, open: true },
      { t: "10:40", A: 1, B: 0, C: 0, open: false },
      { t: "13:05", A: 0, B: 1, C: 0, open: false },
      { t: "15:30", A: 0, B: 0, C: 1, open: true },
      { t: "18:47", A: 1, B: 0, C: 1, open: true },
      { t: "19:20", A: 1, B: 1, C: 1, open: true }
    ],
    // Registro corrompido, revelado depois do reparo (só a chave C e a saída; A e B o grupo deduz)
    crime: { t: "23:03", C: 0, open: true }
  },

  // limpeza.c: o compilador está "corrompido"; o grupo roda de cabeça. A saída é a senha do chat.
  // MONITORIA → letras nas posições pares (0,2,4,6,8) = M N T R A, depois i = 9 → "MNTRA9"
  cProgram: [
    "#include <stdio.h>",
    "",
    "/* limpeza.c — apaga os rastros do grupo dos monitores */",
    "int main() {",
    "    char s[] = \"MONITORIA\";",
    "    int i;",
    "",
    "    for (i = 0; s[i] != '\\0'; i++) {",
    "        if (i % 2 == 0)",
    "            printf(\"%c\", s[i]);",
    "    }",
    "    printf(\"%d\\n\", i);",
    "    return 0;",
    "}"
  ],
  chatPassword: "MNTRA9",

  chat: [
    { t: "19:30", who: "Paula (coordenação)", msg: "Pessoal, a senha da porta do N112 vai mudar hoje à noite." },
    { t: "19:41", who: "Rafael Kuhn",         msg: "Galera, vou sair do grupo, esse semestre não vou mais monitorar. Valeu!" },
    { t: "20:15", sys: "Rafael Kuhn saiu do grupo." },
    { t: "21:00", who: "Paula (coordenação)", msg: "Nova senha da porta: 7391. Não passem para ninguém." },
    { t: "21:02", who: "Bruno Sato",          msg: "ok 👍" },
    { t: "21:05", who: "Elisa Prado",         msg: "Recebido." },
    { t: "21:06", who: "Lucas (monitor)",     msg: "anotado" },
    { t: "22:47", who: "Bruno Sato",          msg: "Tô saindo, alguém ainda no lab? Vou apagar a luz." },
    { t: "22:48", who: "Elisa Prado",         msg: "Eu já fui embora faz tempo, pode apagar." }
  ],

  // ---------- Opcionais ----------
  // Terminal: arquivos do PC. Pastas terminam com "\". hidden = só aparece com "dir /a". trap = jump scare.
  fs: {
    "Documentos\\": {
      "aulas.txt": ["Seg 19h  Algoritmos (monitor: Bruno)", "Ter 19h  Desenho Digital (monitora: Elisa)", "Qua 19h  Circuitos (monitor: Rafael — saiu)"],
      "avisos.txt": ["O N112 fecha às 23h. Depois desse horário, só com crachá de monitor + senha, ou com a chave da secretaria."]
    },
    "Downloads\\": {
      "jigsaw.exe": { trap: true },
      "render_maquete.zip": ["(arquivo compactado corrompido)"]
    },
    "Usuarios\\": {
      "bruno\\": {
        "lembrete.txt": ["senha do e-mail: nome do meu gato + ano em que entrei na faculdade (tudo minúsculo)"],
        "fotos\\": { "bit_dormindo.jpg": ["[imagem] um gato preto dormindo em cima do teclado"] }
      },
      "elisa\\": {},
      "rafael\\": { "LEIA.txt": ["Saí da monitoria. Deixo meu crachá com a Paula semana que vem."] }
    },
    ".backup\\": { hidden: true,
      "rascunho.txt": ["Já instalei o programa que ele pediu.", "Ninguém desconfia de uma monitora.", "Apaguei o histórico. Amanhã apago este arquivo também."]
    }
  },

  // Câmeras: o grupo digita um horário exato (HH:MM) que encontrou em outras pistas. Horário sem gravação = susto.
  cameras: {
    "22:00": "CAM-01 (portaria) — Carla Menezes devolve uma chave no balcão e vai embora.",
    "22:50": "CAM-02 (corredor N) — Bruno Sato sai do N112 com a mochila e apaga a luz.",
    "22:58": "CAM-04 (ponto de ônibus) — Bruno Sato e Rafael Kuhn entram no ônibus da linha 12.",
    "23:03": "CAM-02 (corredor N) — 1 pessoa com CRACHÁ DE MONITOR abre a porta do N112. Carrega um TUBO DE PROJETO nas costas. Rosto coberto pelo capuz. Ao fundo, um aluno de jaleco estuda no corredor.",
    "23:09": "CAM-02 (corredor N) — A mesma pessoa sai do N112 apressada, ainda de capuz, com o tubo de projeto."
  },

  // E-mail do Bruno: senha = gato (Bit) + ano de ingresso (ficha) → "bit2024". Erros passam por Interference.error.
  emailPassword: "bit2024",
  emails: [
    { from: "Passe Urbano", subject: "Recibo da sua viagem", time: "ontem, 22:58",
      body: ["Olá, Bruno Sato!", "", "Viagem registrada: Linha 12 — Ponto Bloco N → Centro", "Horário: 22:58", "Passagens: 2 (você + 1 acompanhante: Rafael Kuhn)", "", "Obrigado por usar o Passe Urbano."] },
    { from: "Elisa Prado", subject: "hoje", time: "ontem, 21:10",
      body: ["Bruno, você vai embora cedo hoje, né?", "Preciso do lab sozinha pra renderizar a maquete.", "", "E."] },
    { from: "Coordenação da Monitoria", subject: "Escala de outubro", time: "anteontem",
      body: ["Monitores: lembrem de assinar o livro de chaves sempre que pegarem a chave com a Carla."] }
  ],

  // Wi-Fi: o log mostra os 2 últimos blocos do MAC em DECIMAL; o rastreador só aceita o MAC em HEXADECIMAL.
  wifi: {
    prefix: "3C:7A:1F:09",
    log: [
      { t: "22:31", last: [17, 2],    note: "desconectado às 22:49" },
      { t: "23:02", last: [164, 94],  note: "desconectado às 23:09" },
      { t: "23:04", last: [27, 200],  note: "desconectado às 23:40" }
    ],
    // chave = 2 últimos blocos em hex
    devices: {
      "11:02": "Notebook — Bruno Sato",
      "A4:5E": "Celular Galaxy — Elisa Prado",
      "1B:C8": "Notebook — Diego Fontes"
    }
  },

  // Papéis da sala
  monitors: ["Bruno Sato", "Elisa Prado", "Lucas Andrade", "Paula Ribeiro (coordenação)", "Rafael Kuhn"],
  keyBook: [
    { date: "ontem", who: "Carla Menezes", out: "18:00", back: "22:00", sign: "C. Menezes" },
    { date: "anteontem", who: "Carla Menezes", out: "18:00", back: "22:05", sign: "C. Menezes" },
    { date: "3 dias atrás", who: "Lucas Andrade", out: "14:10", back: "16:00", sign: "L. Andrade" }
  ]
};
