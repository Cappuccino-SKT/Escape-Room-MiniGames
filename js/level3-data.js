// ===== NÍVEL 3 — "A PROVA FINAL": DADOS DO CASO =====
// Usado pelo jogo (js/level3.js) e pelos papéis da sala (imprimir-nivel3.html).
// ATENÇÃO: as pistas dependem umas das outras. Se mudar algo aqui, confira o guia TESTES-NIVEL3.md.
//
// Resposta final (falada ao mestre do jogo): SEGFAULT.
// Questões principais (exigem conhecimento do curso; podem ser feitas ao mesmo tempo):
//   Entrada: dump de memória em hex → ASCII = PONTEIRO
//   Q1 lista encadeada (cartões na sala, head no lista.c) = MALLOC
//   Q2 decodificador de 7 segmentos: expressão do segmento g (mapa de Karnaugh) → display mostra dEAd
//   Q3 registrador com flip-flops D (diagrama na sala): estado depois de 5 pulsos = 110 = 6 → msg_6
//   Final: corrigir a função decifra() do decifra.c e rodar com msg_6 e a chave MALLOCDEAD
// Cada questão tem um minijogo opcional (sem conhecimento prévio) que dá uma AJUDA para ela.
window.L3 = {
  answer: "SEGFAULT",

  // Entrada: o notebook mostra o dump; a tabela ASCII fica na sala
  loginPassword: "PONTEIRO",
  loginDump: "53 45 4E 48 41 3A 50 4F 4E 54 45 49 52 4F", // "SENHA:PONTEIRO"
  loginHint: "Cada par de símbolos é 1 byte em hexadecimal. A tabela ASCII da parede diz qual caractere é cada byte.",

  // Textos em blocos (desenhados por doc() no level3.js): h = título, h2 = subtítulo, p = parágrafo, ol = passos,
  // warn = alerta, box = destaque, kv = pares (rótulo, texto), sign = assinatura. `texto` vira código, **texto** vira negrito.
  intro: [
    { h: "Bem-vindos à prova final." },
    { p: "Eu já fui um de vocês: Engenharia de Computação. Tranquei o curso no 3º semestre. Um **segfault** me reprovou. Hoje quem faz a prova são vocês." },
    { warn: "O meu vírus está rodando neste computador. Quando o tempo acabar, ele apaga **TUDO**." },
    { p: "Ele tem um **kill switch**: uma palavra escondida numa das mensagens cifradas, de `msg_0` a `msg_7`." },
    { h2: "Como ler a mensagem certa" },
    { ol: [
      "**A CHAVE** é o que a lista encadeada guarda + o que o display mostra. Tudo junto, em MAIÚSCULAS.",
      "**O ARQUIVO** é `msg_N`. N é o estado do registrador (`Q2 Q1 Q0`, em decimal) depois de **5 pulsos** de clock. O estado inicial é `0 0 1`, e o circuito está nesta sala.",
      "**O decifra.c** faz o resto. Se vocês souberem programar."
    ] },
    { box: "Quem não souber pode pedir ajuda aos programas menores deste computador. Eu nunca tive essa sorte." },
    { p: "Quando souberem o kill switch, **digam para mim**. Errar tem um preço." },
    { sign: "— J" }
  ],

  diary: [
    { h: "diario.txt" },
    { p: "Não era para ninguém ler isto." },
    { kv: [
      ["1º semestre", "Eu era o melhor da turma em Fundamentos de Programação."],
      ["2º semestre", "Circuitos Digitais. Passei de raspão. Ninguém me ajudou."],
      ["3º semestre", "Estruturas de Dados. O trabalho final deu `Segmentation fault` na frente do professor. Zero. Reprovado."]
    ] },
    { p: "Tranquei no mesmo dia. Ninguém perguntou por quê." },
    { p: "Agora eu escrevo as provas. E desta vez quem tem medo do segfault são vocês." },
    { sign: "— J" }
  ],

  // Q1: lista encadeada. Os cartões ficam espalhados pela sala (imprimir-nivel3.html).
  head: "0x2C",
  nodes: [
    { addr: "0x2C", data: "M", next: "0x7A" },
    { addr: "0x7A", data: "A", next: "0x13" },
    { addr: "0x13", data: "L", next: "0x5E" },
    { addr: "0x5E", data: "L", next: "0x91" },
    { addr: "0x91", data: "O", next: "0x3B" },
    { addr: "0x3B", data: "C", next: "NULL" },
    // iscas: nenhum nó aponta para elas
    { addr: "0x68", data: "R", next: "0x91" },
    { addr: "0xA0", data: "E", next: "0x13" },
    { addr: "0x4F", data: "X", next: "NULL" },
    { addr: "0xC7", data: "F", next: "0x2C" }
  ],
  listWord: "MALLOC",
  listC: [
    "#include <stdlib.h>",
    "",
    "struct no {",
    "    char dado;",
    "    struct no *next;",
    "};",
    "",
    "/* O vírus guardou uma palavra numa lista encadeada.",
    "   Os nós estão espalhados pela memória... e pela sala. */",
    "struct no *head = (struct no *) 0x2C;",
    "",
    "/* Para ler a lista, comece pelo head e siga os next até o NULL. */"
  ],

  // Q2: decodificador hexadecimal de 7 segmentos (entradas A B C D, A = bit mais significativo).
  // O segmento g está queimado. Tabela-verdade de g para 0..F:
  gTable: [0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1],
  gMaxLiterals: 12,             // a resposta mínima tem 11 literais: A'BC' + AB' + B'C + CD' + AD
  displayWord: [0xD, 0xE, 0xA, 0xD], // "dEAd"
  displayKey: "DEAD",

  // Q3: registrador com realimentação (3 flip-flops D). D2 = Q1, D1 = Q0, D0 = Q2 XOR Q1.
  regStart: [0, 0, 1],          // Q2 Q1 Q0
  regPulses: 5,                 // → 1 1 0 = 6
  fileIndex: 6,

  // Final: chave e mensagens cifradas (Vigenère, só letras A–Z). Com a chave certa,
  // cada arquivo diz "O KILL SWITCH E ..." com uma palavra diferente; só o msg_6 é o verdadeiro.
  key: "MALLOCDEAD",
  messages: [
    "AKTWZUZMTFTEYFZNSSIQFEC",     // msg_0 → ...NULLPOINTER
    "AKTWZUZMTFTEDEOENSVHDFWZK",   // msg_1 → ...STACKOVERFLOW
    "AKTWZUZMTFTEOPOFOSCN",        // msg_2 → ...DEADLOCK
    "AKTWZUZMTFTEXPAQUCLHMK",      // msg_3 → ...MEMORYLEAK
    "AKTWZUZMTFTEMFTHHVOYQRQWCY",  // msg_4 → ...BUFFEROVERFLOW
    "AKTWZUZMTFTECPQWUWAR",        // msg_5 → ...RECURSAO
    "AKTWZUZMTFTEDPUHDYLW",        // msg_6 → ...SEGFAULT  (o verdadeiro)
    "AKTWZUZMTFTEVPFPHPPDZIN"      // msg_7 → ...KERNELPANIC
  ],
  finalPlain: "OKILLSWITCHESEGFAULT",

  // decifra.c: só a função decifra() pode ser editada. Ela tem 5 bugs:
  //   1) falta ';' (erro de compilação)   2) i <= n (passa do fim)
  //   3) chave[i % n] em vez de chave[i % k] (embaralha tudo: sem consertar, não dá para adivinhar a palavra)
  //   4) (c - d) % 26 fica negativo em C  5) falta saida[n] = '\0' (a saída termina com lixo)
  cHeader: [
    "#include <stdio.h>",
    "#include <string.h>",
    "",
    "/* decifra: tira a chave de cada letra da mensagem (A–Z).",
    "   letra_original = (letra_cifrada - letra_da_chave) mod 26 */"
  ],
  cFunction: [
    "void decifra(char *msg, char *chave, char *saida) {",
    "    int n = strlen(msg);",
    "    int k = strlen(chave)",
    "    for (int i = 0; i <= n; i++) {",
    "        int c = msg[i] - 'A';",
    "        int d = chave[i % n] - 'A';",
    "        saida[i] = (c - d) % 26 + 'A';",
    "    }",
    "}"
  ],
  cMain: [
    "",
    "/* ---- daqui para baixo o J trancou ---- */",
    "int main(int argc, char *argv[]) {",
    "    char msg[64], saida[64];   /* saida NÃO é inicializada */",
    "    ler_arquivo(argv[1], msg);",
    "    decifra(msg, argv[2], saida);",
    "    printf(\"%s\\n\", saida);",
    "    return 0;",
    "}"
  ],

  // Opcionais: cada um dá a AJUDA de uma questão principal (são difíceis, mas não exigem conhecimento do curso)
  // radio.exe: frase em Morse (tabela na sala). Os espaços não importam na resposta.
  morseWord: "SIGA O NEXT ATE O NULL",
  // energia.exe: na tela os pinos só têm número. Na sala: tabela cor → sinal + pinagem (número → sinal).
  wires: [
    { name: "Amarelo", color: "#f2d21b", signal: "+12V" },
    { name: "Vermelho", color: "#e02424", signal: "+5V" },
    { name: "Laranja", color: "#f28c1b", signal: "+3.3V" },
    { name: "Preto", color: "#222222", signal: "GND" },
    { name: "Verde", color: "#21b24a", signal: "PS_ON" },
    { name: "Roxo", color: "#8e3fd6", signal: "+5VSB" }
  ],
  pinout: ["+5VSB", "GND", "+12V", "PS_ON", "+3.3V", "+5V"], // pino 1 ... pino 6
  // Ajudas: intro (frase), steps (passos numerados), e extras por tipo. `texto` vira código.
  help: {
    lista: {
      title: "Ajuda: como ler uma lista encadeada",
      intro: "Uma lista encadeada é uma corrente de nós. Cada nó guarda um `dado` e o endereço do próximo nó, o `next`.",
      steps: [
        "Comecem pelo endereço do `head` (está no lista.c).",
        "Procurem na sala o cartão com esse endereço e anotem o `dado`.",
        "Vão para o endereço que está no `next` desse cartão e repitam.",
        "Parem quando o `next` for `NULL`: a palavra está completa."
      ],
      note: "Cartões que nenhum nó aponta não fazem parte da lista."
    },
    kmap: {
      title: "Ajuda: mapa de Karnaugh do segmento g",
      intro: "Cada célula do mapa é uma combinação de A B C D. O número dentro dela é o valor de g.",
      steps: [
        "Agrupem os 1 em retângulos de 1, 2, 4 ou 8 células. Quanto maior o grupo, menor a expressão.",
        "As bordas se encostam: a 1ª coluna é vizinha da última, e a 1ª linha é vizinha da última.",
        "Um 1 pode estar em mais de um grupo, mas todo 1 precisa estar em pelo menos um. Nenhum 0 pode entrar.",
        "Em cada grupo, vejam quais variáveis NÃO mudam. Só elas entram no produto.",
        "Juntem os produtos com +."
      ],
      notation: [["+", "∨"], ["AB", "A ∧ B"], ["A'", "¬A"]],
      example: "A linha AB = 10 (destacada) é um grupo de 4. Nela A = 1 e B = 0 sempre; C e D mudam e somem. Produto: `AB'`",
      exampleRow: 3, // linha destacada no mapa (0 = AB 00, 1 = 01, 2 = 11, 3 = 10)
      note: "O segmento g precisa de 5 grupos."
    },
    reg: {
      title: "Ajuda: registrador com flip-flops D",
      intro: "Um flip-flop D copia a entrada D para a saída Q a cada pulso de clock.",
      steps: [
        "Os 3 flip-flops mudam AO MESMO TEMPO, usando os valores de ANTES do pulso.",
        "No circuito da sala: `D2 = Q1`, `D1 = Q0` e `D0 = Q2 XOR Q1`.",
        "Façam uma tabela pulso a pulso (os 2 primeiros já estão abaixo).",
        "No pulso 5, convertam Q2 Q1 Q0 de binário para decimal: é o número do arquivo."
      ],
      table: { head: ["Pulso", "Q2", "Q1", "Q0"], rows: [["0 (início)", 0, 0, 1], ["1", 0, 1, 0], ["2", 1, 0, 1], ["3", "?", "?", "?"], ["4", "?", "?", "?"], ["5", "?", "?", "?"]] },
      note: "XOR dá 1 quando as duas entradas são diferentes."
    },
    c: {
      title: "Ajuda: os bugs do decifra.c",
      intro: "A função `decifra()` tem 5 bugs. Consertem todos para a mensagem sair limpa.",
      steps: [
        "Falta um `;`. A mensagem do compilador diz em que linha.",
        "O `for` passa uma posição do fim da string: os índices vão de `0` a `n - 1`.",
        "A chave tem `k` letras, não `n`. Quando a chave acaba, ela recomeça do início.",
        "Em C, o resto de um número negativo é negativo: `-3 % 26` dá `-3`. Somem 26 antes de tirar o resto.",
        "Toda string em C termina com `'\\0'`. Depois do laço, ninguém colocou o `'\\0'` no fim da saída."
      ],
      note: "Para executar: escolham o arquivo msg_N e digitem a chave em MAIÚSCULAS."
    }
  }
};
