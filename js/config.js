// ===== CONFIGURAÇÃO DO JOGO =====
// Edite aqui sem precisar mexer no resto do código.
window.CONFIG = {
  // Nível do jogo: ao abrir o index.html, o jogo pergunta qual nível (ou use index.html?nivel=1 / ?nivel=2).
  // Atalhos do mestre do jogo: Ctrl+Shift+1 / Ctrl+Shift+2 trocam de nível a qualquer momento.
  level: Number(new URLSearchParams(location.search).get("nivel")) || 1,
  levelChosen: !!Number(new URLSearchParams(location.search).get("nivel")),

  userName: "Convidado",
  password: "",                // senha da tela de login. "" = sem login (começa direto na área de trabalho)
  hint: "Quem quer jogar um jogo com você?",
  maxHintAttempts: 3,          // nº de erros antes de liberar o botão de dica (0 = sempre)

  // Cronômetro na barra de tarefas. 0 = desativado.
  // Começa a contar quando o jogador entra na área de trabalho.
  timerMinutes: 0,
  timerEndMessage: "O TEMPO ACABOU. GAME OVER.",

  // Atalho do mestre do jogo para reiniciar tudo: Ctrl + Shift + X
  bootSpeed: 1,                // 1 = normal, 2 = 2x mais rápido...
  fullscreenOnStart: true,

  // ===== NÍVEL 1 =====
  adminPassword: "KRAMER",     // <<< senha de permissão de ADMINISTRADOR (escondida na sala)
  hackerMinutes: 5,            // tempo para excluir o hacker antes que ele exclua você
  wrongDeletePenalty: 30,      // segundos perdidos ao excluir um usuário inocente
  // A lista de usuários (users) fica mais abaixo.

  // Dicas que cada fase desbloqueia (a 5ª é a física, dentro da caixa). Ficam salvas em dicas.txt.
  // >>> TEXTOS PROVISÓRIOS: trocar quando a resposta final for decidida.
  hints: [
    "DICA 1 (a definir)",
    "DICA 2 (a definir)",
    "DICA 3 (a definir)",
    "DICA 4 (a definir)"
  ],

  // Fase 2: registro de segurança (app log_seguranca.txt). É a pista para descobrir o hacker:
  // acesso REMOTO, HOJE às 23:59, com nível ADMINISTRADOR → só o t.hoffman bate com tudo na lista de usuários.
  securityLog: [
    "=== REGISTRO DE SEGURANÇA — JIGSAW OS ===",
    "",
    "hoje 21:53   login local ............. m.guimaraes",
    "hoje 22:26   backup automático ....... concluído",
    "hoje 23:06   3 senhas incorretas ..... b.lima (bloqueado)",
    "hoje 23:41   login local ............. i.ribeiro",
    "hoje 23:58   conexão externa recebida de 192.168.6.66",
    "hoje 23:59   login local ............. h.costa",
    "hoje 23:59   login REMOTO ............ ████████  (192.168.6.66)",
    "             nível da conta: ADMINISTRADOR",
    "hoje 23:59   login local ............. s.freitas",
    "hoje 23:59   câmera 02 ativada remotamente",
    "hoje 23:59   ████████ tentou apagar este registro",
    "",
    "AVISO: o nome da conta remota foi apagado deste registro."
  ],
  // ===== FASE 3: BIOS — JOGO DO LABIRINTO =====
  // Cada componente é um labirinto. O ponto anda sozinho; o jogador muda a direção com WASD ou setas.
  // w = largura dos corredores (em blocos; 1 = estreito), cols/rows = tamanho do labirinto em "salas",
  // speed = velocidade (blocos por segundo). seed = sorteio fixo (mesmos labirintos em todas as partidas).
  maze: {
    seed: 666,
    levels: [
      { label: "CPU", color: "#ff3b3b", w: 3, cols: 4,  rows: 3, speed: 3.5 },
      { label: "RAM", color: "#2ee86a", w: 3, cols: 5,  rows: 3, speed: 4 },
      { label: "GPU", color: "#3b8bff", w: 2, cols: 6,  rows: 4, speed: 4 },
      { label: "SSD", color: "#ffe03b", w: 2, cols: 7,  rows: 4, speed: 4.5 },
      { label: "PSU", color: "#ff9a1f", w: 1, cols: 9,  rows: 5, speed: 4 },
      { label: "FAN", color: "#c45cff", w: 1, cols: 11, rows: 6, speed: 4.5 }
    ],
    // Interferência do hacker (acontece UMA vez na fase 3, no que vier primeiro):
    interferenceMinutes: 5,   // tempo jogando sem terminar
    interferenceErrors: 30,   // erros acumulados
    // ...ou, garantido, ao terminar o último labirinto.
  },

  // ===== FASE 4: RECONFIGURAÇÃO PELO CMD =====
  // A tela mostra uma correção (task). Na sala, o papel "Tabela de correções" liga a correção ao número (num),
  // e o papel "Manual de comandos" (do lado oposto) liga o número ao comando (cmd).
  // A cada partida são sorteadas "steps" correções. Comando válido mas errado = recomeça do zero.
  // Depois de mudar esta lista, imprima de novo os papéis (imprimir.html).
  reconfig: {
    steps: 6,
    tasks: [
      { task: "Formatar Windows",               num: 1,  cmd: "fw" },
      { task: "Atualizar registro do sistema",  num: 2,  cmd: "arg" },
      { task: "Ativar antivírus",               num: 3,  cmd: "atv" },
      { task: "Recriar ícones",                 num: 4,  cmd: "ric" },
      { task: "Recuperar arquivos do usuário",  num: 6,  cmd: "rau" },
      { task: "Restaurar área de trabalho",     num: 7,  cmd: "rad" },
      { task: "Montar disco C:",                num: 8,  cmd: "mdc" },
      { task: "Configurar data e hora",         num: 9,  cmd: "cdh" },
      { task: "Restaurar papel de parede",      num: 11, cmd: "rpp" },
      { task: "Reinstalar drivers de vídeo",    num: 12, cmd: "rdv" },
      { task: "Reiniciar serviços do sistema",  num: 14, cmd: "rss" },
      { task: "Reconectar à rede",              num: 15, cmd: "rcn" }
    ],
    // Comandos falsos: aparecem no manual, são aceitos pelo cmd, mas nunca são a resposta certa.
    decoys: [
      { num: 5,  cmd: "wf" },  { num: 10, cmd: "dar" }, { num: 13, cmd: "rvd" },
      { num: 16, cmd: "ncr" }, { num: 17, cmd: "tva" }, { num: 18, cmd: "pps" }
    ]
  },

  // Jump scare: imagem e volume. Deixe scareImage "" para usar o rosto desenhado no código.
  // Para usar um som próprio, preencha sounds.scare (senão um grito é gerado pelo navegador).
  scareImage: "",
  scareVolume: 1.0,           // 0.0 a 1.0

  // Vídeos (ou imagens) do susto, por lugar. Coloque os arquivos na pasta videos/ e liste aqui.
  // Com vários arquivos num lugar, o jogo sorteia um (sem repetir o último). Lista vazia = usa "padrao";
  // "padrao" vazio = rosto desenhado + grito gerado pelo navegador. Vídeo toca com o som dele.
  scareMedia: {
    padrao: [],              // ex.: ["videos/susto1.mp4", "videos/susto2.mp4"]
    interferencia: [],       // Nível 1, fase 3: fim da interferência do hacker
    cmd_n: [],               // Nível 1, fase 4: 1º "N" no cmd
    ransomware: [],          // Nível 1, fase 5: tempo do ransomware acabou
    nivel2: [],              // Nível 2: erros nos minijogos (quando o erro vira susto)
    nivel2_armadilha: [],    // Nível 2: abrir o jigsaw.exe no terminal
    projetor_punicao: [],    // projetor: acusação errada (tecla P)
    projetor_tempo: []       // projetor: tempo esgotado
  },
  scareMaxSeconds: 8,        // corta o vídeo do susto depois desse tempo

  // Erros nem sempre dão susto (para os jogadores não se acostumarem):
  // nunca antes do erro nº firstAfterErrors; depois de qualquer susto, cooldownSeconds de descanso;
  // passado o descanso, cada erro soma chanceStep à chance (0.3 → 30%, 60%, 90%, 100%).
  // Nos erros sem susto aparece um efeito leve (tela falha, sussurro ou clarão vermelho).
  scareRules: { firstAfterErrors: 2, cooldownSeconds: 90, chanceStep: 0.3 },
  mockImage: "",              // máscara neutra do easter egg da fase 4 ("" = desenhada no código)

  // ===== FASE 5: RANSOMWARE =====
  // A chave é impressa (imprimir.html, página 3), rasgada nos "-" e os pedaços são escondidos na sala.
  // Ao digitar a chave certa, o jogo mostra o código do cadeado da caixa (onde está a última dica).
  ransom: {
    minutes: 8,                        // se acabar: jump scare e o cronômetro recomeça
    key: "K7RX-M3Q9-ZT4H-W8PL-6NFD",   // 5 pedaços (um por jogador)
    lockCode: "0000"                   // >>> código do cadeado da caixa (a definir)
  },

  // Lista do Gerenciador de Usuários. Marque o hacker com hacker: true.
  // O usuário criado pelo jogador é inserido em uma posição aleatória.

  users: [
    { name: "a.souza", level: "Editor", last: "ontem, 18:41" },
    { name: "b.lima", level: "Espectador", last: "hoje, 23:06" },
    { name: "c.ferreira", level: "Editor", last: "09/10, 07:58" },
    { name: "d.rocha", level: "Administrador", last: "hoje, 23:58" },
    { name: "e.martins", level: "Editor", last: "15/10, 08:15" },
    { name: "f.alves", level: "Espectador", last: "09/10, 19:03" },
    { name: "g.nunes", level: "Espectador", last: "ontem, 07:36" },
    { name: "h.costa", level: "Editor", last: "hoje, 23:59" },
    { name: "i.ribeiro", level: "Administrador", last: "hoje, 23:41" },
    { name: "j.carvalho", level: "Editor", last: "ontem, 23:07" },
    { name: "k.pereira", level: "Espectador", last: "09/10, 11:06" },
    { name: "l.mendes", level: "Espectador", last: "12/10, 09:35" },
    { name: "m.teixeira", level: "Espectador", last: "09/10, 07:39" },
    { name: "n.gomes", level: "Espectador", last: "15/10, 23:27" },
    { name: "o.barbosa", level: "Editor", last: "15/10, 20:23" },
    { name: "p.araujo", level: "Espectador", last: "ontem, 11:44" },
    { name: "q.cardoso", level: "Espectador", last: "hoje, 15:33" },
    { name: "r.dias", level: "Editor", last: "12/10, 20:18" },
    { name: "s.freitas", level: "Espectador", last: "hoje, 23:59" },
    { name: "u.moreira", level: "Espectador", last: "21/10, 16:09" },
    { name: "v.pinto", level: "Editor", last: "15/10, 07:42" },
    { name: "w.ramos", level: "Espectador", last: "21/10, 23:36" },
    { name: "x.vieira", level: "Editor", last: "12/10, 17:38" },
    { name: "y.monteiro", level: "Editor", last: "09/10, 20:04" },
    { name: "z.moura", level: "Espectador", last: "12/10, 21:44" },
    { name: "a.castro", level: "Espectador", last: "hoje, 15:41" },
    { name: "t.hoffman", level: "Administrador", last: "hoje, 23:59", hacker: true },
    { name: "b.campos", level: "Editor", last: "12/10, 18:56" },
    { name: "c.fonseca", level: "Editor", last: "hoje, 20:22" },
    { name: "d.lopes", level: "Espectador", last: "09/10, 09:31" },
    { name: "e.machado", level: "Espectador", last: "ontem, 15:08" },
    { name: "f.duarte", level: "Espectador", last: "15/10, 18:58" },
    { name: "g.nascimento", level: "Editor", last: "hoje, 11:28" },
    { name: "h.correia", level: "Editor", last: "09/10, 14:56" },
    { name: "i.batista", level: "Espectador", last: "21/10, 19:55" },
    { name: "j.farias", level: "Administrador", last: "ontem, 23:59" },
    { name: "k.reis", level: "Editor", last: "ontem, 10:05" },
    { name: "l.santana", level: "Espectador", last: "ontem, 13:42" },
    { name: "m.guimaraes", level: "Espectador", last: "hoje, 21:53" },
    { name: "n.xavier", level: "Espectador", last: "12/10, 15:00" }
  ],

  // Efeitos sonoros: coloque os arquivos na pasta "sounds/" e preencha o caminho.
  // Deixe "" para ficar sem som.
  sounds: {
    boot: "",        // ao ligar
    loginError: "",  // senha errada
    loginOk: "",     // senha certa
    denied: "",      // abrir arquivo bloqueado
    unlock: "",      // minigame liberado
    scare: ""        // jump scare
  }
};
