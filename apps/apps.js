// ===== APLICATIVOS DA ÁREA DE TRABALHO =====
// Para adicionar um minigame, adicione um objeto nesta lista:
//   id:      identificador único
//   title:   nome exibido no ícone e na janela
//   icon:    emoji do ícone
//   width/height: tamanho inicial da janela (px)
//   locked:  (opcional) true = arquivo começa trancado e pede senha
//   password: senha que abre o arquivo trancado
//   next:    id do próximo arquivo; ao vencer, o jogo mostra a senha dele
//   render(container, api): função que monta o conteúdo da janela.
//     api.close()       fecha a janela
//     api.unlock(id)    desbloqueia outro app (ex.: ao vencer um minigame)
//     api.notify(text)  mostra uma notificação
//     api.win(container) vitória: mostra a senha do arquivo "next"
window.APPS = [
  {
    id: "readme",
    title: "LEIA-ME.txt",
    icon: "📄",
    width: 460, height: 340,
    render(el) {
      el.innerHTML = `<div class="notepad">Olá.

Eu quero jogar um jogo.

Durante toda a sua vida você ignorou os sinais.
Hoje, cada arquivo neste computador é uma escolha.

Resolva os desafios. Encontre a saída.
O relógio no canto da tela não vai esperar por você.

Viver ou morrer. A escolha é sua.

                                  — J</div>`;
    }
  },
  {
    id: "terminal", title: "acesso_remoto.exe", icon: "💻",
    next: "wires",
    width: 760, height: 480,
    render: (el, api) => TerminalGame(el, api)
  },
  {
    id: "wires", title: "painel_energia.exe", icon: "🔌",
    locked: true, password: "ADAM",       // <<< senha revelada pelo terminal
    next: "game3",
    width: 820, height: 500,
    render: (el, api) => WiresGame(el, api)
  },
  {
    id: "game3", title: "Jogo 3", icon: "⏱️",
    locked: true, password: "BILLY",      // <<< senha revelada pelo painel de fios
    width: 500, height: 380, render: placeholder
  },
  {
    id: "trash",
    title: "Lixeira",
    icon: "🗑️",
    width: 380, height: 220,
    render(el) { el.innerHTML = `<p class="center muted">A lixeira está vazia.<br>Por enquanto.</p>`; }
  }
];

function placeholder(el, api) {
  el.innerHTML = `<p class="center muted">Minigame ainda não instalado.</p>`;
}
