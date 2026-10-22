# Escape Room – Jogos Mortais (JIGSAW OS)

Simulação de computador para escape room: **ligar → boot → login com senha → área de trabalho** com ícones que abrem minigames.

## Como usar
Abra `index.html` no navegador (Chrome recomendado). Não precisa de internet nem instalação.

- Clique no botão de ligar (entra em tela cheia).
- Senha padrão: `JIGSAW` (configurável).
- **Ctrl + Shift + X**: reinicia tudo (atalho do mestre do jogo).

## Configuração
`js/config.js` – usuário, senha, dica, cronômetro, velocidade do boot.

## Adicionar minigames
Em `apps/apps.js`, adicione um item na lista `APPS` com uma função `render(container, api)`.
`api.unlock("id")` desbloqueia outro app (ex.: vencer o Jogo 1 libera o Jogo 2).
