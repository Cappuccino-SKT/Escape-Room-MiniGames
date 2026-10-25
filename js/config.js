// ===== CONFIGURAÇÃO DO JOGO =====
// Edite aqui sem precisar mexer no resto do código.
window.CONFIG = {
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
  // Lista do Gerenciador de Usuários. Marque o hacker com hacker: true.
  // O usuário criado pelo jogador é inserido em uma posição aleatória.
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

  // Jump scare: imagem e volume. Deixe scareImage "" para usar o rosto desenhado no código.
  // Para usar um som próprio, preencha sounds.scare (senão um grito é gerado pelo navegador).
  scareImage: "",
  scareVolume: 1.0,           // 0.0 a 1.0

  users: [
    { name: "a.souza", level: "Editor", last: "ontem, 18:41" },
    { name: "b.lima", level: "Espectador", last: "hoje, 23:06" },
    { name: "c.ferreira", level: "Editor", last: "09/10, 07:58" },
    { name: "d.rocha", level: "Administrador", last: "ontem, 07:05" },
    { name: "e.martins", level: "Editor", last: "15/10, 08:15" },
    { name: "f.alves", level: "Espectador", last: "09/10, 19:03" },
    { name: "g.nunes", level: "Espectador", last: "ontem, 07:36" },
    { name: "h.costa", level: "Editor", last: "hoje, 13:02" },
    { name: "i.ribeiro", level: "Administrador", last: "21/10, 10:18" },
    { name: "j.carvalho", level: "Editor", last: "ontem, 23:07" },
    { name: "k.pereira", level: "Espectador", last: "09/10, 11:06" },
    { name: "l.mendes", level: "Espectador", last: "12/10, 09:35" },
    { name: "m.teixeira", level: "Espectador", last: "09/10, 07:39" },
    { name: "n.gomes", level: "Espectador", last: "15/10, 23:27" },
    { name: "o.barbosa", level: "Editor", last: "15/10, 20:23" },
    { name: "p.araujo", level: "Espectador", last: "ontem, 11:44" },
    { name: "q.cardoso", level: "Espectador", last: "hoje, 15:33" },
    { name: "r.dias", level: "Editor", last: "12/10, 20:18" },
    { name: "s.freitas", level: "Espectador", last: "hoje, 22:26" },
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
    { name: "j.farias", level: "Administrador", last: "12/10, 19:22" },
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
