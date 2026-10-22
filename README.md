# Escape Room – Jogos Mortais (JIGSAW OS)

Simulação de computador para escape room: **ligar → boot → login com senha → área de trabalho** com ícones que abrem minigames.

## Como usar
Abra `index.html` no navegador (Chrome recomendado). Não precisa de internet nem instalação.

- Clique no botão de ligar (entra em tela cheia).
- Senha atual: `Muriel` — para trocar, edite a linha `password` em `js/config.js`.
- **Ctrl + Shift + X**: reinicia tudo (atalho do mestre do jogo).

## Configuração
`js/config.js` – usuário, senha, dica, cronômetro (0 = desligado), velocidade do boot e efeitos sonoros (coloque os áudios em `sounds/` e preencha os caminhos).

## Adicionar minigames
Em `apps/apps.js`, adicione um item na lista `APPS` com uma função `render(container, api)`.
`api.unlock("id")` desbloqueia outro app (ex.: vencer o Jogo 1 libera o Jogo 2).

## Minigames atuais (sequência)
1. **acesso_remoto.exe** – terminal hacker: `help` → `scan` → `crack 192.168.6.66` → `connect 192.168.6.66` → `ls`/`cat` → `decrypt chave.enc`. Revela a senha do próximo arquivo.
2. **painel_energia.exe** (senha `ADAM`) – ligar os fios da fonte ATX nos pinos certos usando o manual. Revela a próxima senha.
3. **Jogo 3** (senha `BILLY`) – a fazer.

Senhas dos arquivos: campo `password` em `apps/apps.js`. A senha revelada ao vencer é sempre a do arquivo indicado em `next`.
