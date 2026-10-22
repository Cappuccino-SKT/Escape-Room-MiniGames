// ===== CONFIGURAÇÃO DO JOGO =====
// Edite aqui sem precisar mexer no resto do código.
window.CONFIG = {
  userName: "Convidado",
  password: "JIGSAW",          // senha de login (não diferencia maiúsculas/minúsculas)
  hint: "Quem quer jogar um jogo com você?",
  maxHintAttempts: 3,          // nº de erros antes de liberar o botão de dica (0 = sempre)

  // Cronômetro na barra de tarefas. 0 = desativado.
  // Começa a contar quando o jogador entra na área de trabalho.
  timerMinutes: 60,
  timerEndMessage: "O TEMPO ACABOU. GAME OVER.",

  // Atalho do mestre do jogo para reiniciar tudo: Ctrl + Shift + X
  bootSpeed: 1,                // 1 = normal, 2 = 2x mais rápido...
  fullscreenOnStart: true
};
