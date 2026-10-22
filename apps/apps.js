// ===== APLICATIVOS DA ÁREA DE TRABALHO =====
// Para adicionar um minigame, adicione um objeto nesta lista:
//   id:      identificador único
//   title:   nome exibido no ícone e na janela
//   icon:    emoji do ícone
//   width/height: tamanho inicial da janela (px)
//   locked:  (opcional) true = mostra "acesso negado" ao abrir
//   render(container, api): função que monta o conteúdo da janela.
//     api.close()       fecha a janela
//     api.unlock(id)    desbloqueia outro app (ex.: ao vencer um minigame)
//     api.notify(text)  mostra uma notificação
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
  { id: "game1", title: "Jogo 1", icon: "🧩", width: 500, height: 380, render: placeholder },
  { id: "game2", title: "Jogo 2", icon: "🔪", locked: true, width: 500, height: 380, render: placeholder },
  { id: "game3", title: "Jogo 3", icon: "⏱️", locked: true, width: 500, height: 380, render: placeholder },
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
