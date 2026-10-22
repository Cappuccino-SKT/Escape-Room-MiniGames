// ===== CONFIGURAÇÃO DO JOGO =====
// Edite aqui sem precisar mexer no resto do código.
window.CONFIG = {
  userName: "Convidado",
  password: "Muriel",          // <<< SENHA DE LOGIN: troque aqui (não diferencia maiúsculas/minúsculas)
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
  users: [
    { name: "a.souza",    level: "Espectador",    last: "ontem, 18:40" },
    { name: "b.lima",     level: "Editor",        last: "hoje, 08:12" },
    { name: "c.ferreira", level: "Espectador",    last: "12/10, 14:03" },
    { name: "d.rocha",    level: "Editor",        last: "hoje, 09:55" },
    { name: "e.martins",  level: "Espectador",    last: "03/10, 11:20" },
    { name: "f.alves",    level: "Administrador", last: "hoje, 07:01" },
    { name: "g.nunes",    level: "Espectador",    last: "ontem, 22:17" },
    { name: "h.costa",    level: "Editor",        last: "15/10, 16:44" },
    { name: "i.ribeiro",  level: "Espectador",    last: "hoje, 10:30" },
    { name: "t.hoffman",  level: "Administrador", last: "hoje, 23:59", hacker: true },
    { name: "j.carvalho", level: "Editor",        last: "ontem, 13:08" },
    { name: "k.pereira",  level: "Espectador",    last: "09/10, 19:26" },
    { name: "l.mendes",   level: "Editor",        last: "hoje, 06:45" },
    { name: "m.teixeira", level: "Espectador",    last: "ontem, 20:02" }
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
