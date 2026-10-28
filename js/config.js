// ===== CONFIGURAÇÃO DO JOGO =====
// Edite aqui sem precisar mexer no resto do código.
// Os dados de cada nível ficam em js/level1-data.js, js/level2-data.js e js/level3-data.js.
window.CONFIG = {
  // Nível do jogo: ao abrir o index.html, o jogo pergunta qual nível (ou use index.html?nivel=1, 2 ou 3).
  // Atalhos do mestre do jogo: Ctrl+Shift+1 / 2 / 3 trocam de nível a qualquer momento.
  // Nível inválido (ex.: ?nivel=4) = mostra a tela de escolha.
  level: [1, 2, 3].includes(Number(new URLSearchParams(location.search).get("nivel"))) ? Number(new URLSearchParams(location.search).get("nivel")) : 1,
  levelChosen: [1, 2, 3].includes(Number(new URLSearchParams(location.search).get("nivel"))),

  userName: "Convidado",
  password: "",                // senha da tela de login. "" = sem login (cada nível ajusta)
  hint: "Quem quer jogar um jogo com você?",
  maxHintAttempts: 3,          // nº de erros antes de liberar o botão de dica (0 = sempre)

  // Cronômetro na barra de tarefas. 0 = desativado (o cronômetro oficial fica no projetor.html).
  timerMinutes: 0,
  timerEndMessage: "O TEMPO ACABOU. GAME OVER.",

  // Atalho do mestre do jogo para reiniciar tudo: Ctrl + Shift + X
  bootSpeed: 1,                // 1 = normal, 2 = 2x mais rápido...
  fullscreenOnStart: true,

  // Jump scare: imagem e volume. Deixe scareImage "" para usar o rosto desenhado no código.
  // Para usar um som próprio, preencha sounds.scare (senão um grito é gerado pelo navegador).
  scareImage: "",
  scareVolume: 1.0,           // 0.0 a 1.0

  // Vídeos (ou imagens) do susto, por lugar. Coloque os arquivos na pasta videos/ e liste aqui.
  // Com vários arquivos num lugar, o jogo sorteia um (sem repetir o último). Lista vazia = usa "padrao";
  // "padrao" vazio = rosto desenhado + grito gerado pelo navegador. Vídeo toca com o som dele.
  scareMedia: {
    padrao: [],              // ex.: ["videos/susto1.mp4", "videos/susto2.mp4"]
    interferencia: [],       // interferência do hacker disparada pelo mestre do jogo (Ctrl+Shift+H)
    nivel1: [],              // Nível 1: erros (quando o erro vira susto)
    nivel1_armadilha: [],    // Nível 1: abrir o NAO_ABRA.exe da Lixeira
    nivel2: [],              // Nível 2: erros nos minijogos (quando o erro vira susto)
    nivel2_armadilha: [],    // Nível 2: abrir o jigsaw.exe no terminal
    nivel3: [],              // Nível 3: erros nos minijogos (quando o erro vira susto)
    nivel3_armadilha: [],    // Nível 3: executar o kill_switch.exe da Lixeira
    projetor_punicao: [],    // projetor: acusação errada no Nível 2 (tecla P). Nos Níveis 1 e 3 a tecla P toca a cena do js/final-scare.js
    projetor_tempo: []       // projetor: tempo esgotado
  },
  scareMaxSeconds: 8,        // corta o vídeo do susto depois desse tempo

  // Erros nem sempre dão susto (para os jogadores não se acostumarem):
  // nunca antes do erro nº firstAfterErrors; depois de qualquer susto, cooldownSeconds de descanso;
  // passado o descanso, cada erro soma chanceStep à chance (0.3 → 30%, 60%, 90%, 100%).
  // Nos erros sem susto aparece um efeito leve (tela falha, sussurro ou clarão vermelho).
  scareRules: { firstAfterErrors: 2, cooldownSeconds: 90, chanceStep: 0.3 },

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
