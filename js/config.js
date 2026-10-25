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
  // ===== FASE 3: BIOS (labirinto de conexões) =====
  // Desenhe a SOLUÇÃO: cada letra é uma cor. MAIÚSCULA = ponto (componente), minúscula = caminho.
  // As paredes ocultas ficam entre células de letras diferentes (ou seja, só a solução passa).
  // Todas as linhas precisam ter o mesmo tamanho. Cada letra precisa ter exatamente 2 maiúsculas.
  bios: {
    grid: [
      "RrrrGgg",
      "BbbrYyg",
      "oobrryg",
      "oObBryg",
      "oPpprYG",
      "ooOPrrR"
    ],
    colors: {
      R: { color: "#ff3b3b", label: "CPU" },
      G: { color: "#2ee86a", label: "RAM" },
      B: { color: "#3b8bff", label: "GPU" },
      Y: { color: "#ffe03b", label: "SSD" },
      O: { color: "#ff9a1f", label: "PSU" },
      P: { color: "#c45cff", label: "FAN" }
    },
    decoyOpenings: 3   // nº de "passagens falsas" abertas entre cores diferentes (0 = labirinto exato)
  },

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
