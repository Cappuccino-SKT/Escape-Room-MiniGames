# Escape Room – Jogos Mortais (JIGSAW OS)

Simulação de computador para escape room: **escolha do nível → ligar → boot → área de trabalho** com o mistério de cada nível.

## Como usar
Abra `index.html` no navegador (Chrome recomendado). Não precisa de internet nem instalação.
O jogo pergunta **qual nível** vai ser jogado (1, 2 ou 3). Para trocar depois: **Ctrl + Shift + 1**, **2** ou **3**.

- Clique no botão de ligar (entra em tela cheia).
- **Ctrl + Shift + X**: reinicia tudo (atalho do mestre do jogo).

## Configuração
`js/config.js` – configuração geral: velocidade do boot, sustos (vídeos por lugar em `scareMedia`, regras em `scareRules`, volume) e sons (pasta `sounds/`).
Os dados de cada nível ficam em `js/level1-data.js`, `js/level2-data.js` e `js/level3-data.js`.

## Nível 1 – "As Notas"
Abra `index.html` e escolha **Nível 1**. O hacker trocou a senha do Sistema de Notas do professor; o grupo investiga o computador e a sala para descobrir a senha (nome da filha + ano da formatura + número da sorte) e fala a resposta ao mestre do jogo.
- **`projetor.html`** (escolha Nível 1): cronômetro "notas zeradas em", punição por senha errada (P, −2 min), dicas (D) e vitória (V).
- **`imprimir-nivel1.html`**: papéis da sala (desenhos das crianças, diploma, post-it, tabela binária).
- Dados do caso em `js/level1-data.js`. Guia completo (spoiler) em `TESTES-NIVEL1.md`.

## Nível 2 – "O Cúmplice"
Abra `index.html` e escolha **Nível 2** (ou abra direto `index.html?nivel=2`). Investigação: descobrir quem, entre 5 suspeitos, instalou o vírus do hacker. A resposta é falada ao mestre do jogo.
- **`projetor.html`** (escolha Nível 2), no PC do mestre do jogo ligado ao projetor: cronômetro, punição por acusação errada (P, −5 min), dicas usadas (D) e vitória (V).
- **`imprimir-nivel2.html`**: papéis da sala (cartas da senha, lista de monitores, livro de chaves, bilhete).
- Dados do caso em `js/level2-data.js`. Guia completo (spoiler) em `TESTES-NIVEL2.md`.

## Nível 3 – "A Prova Final"
Abra `index.html` e escolha **Nível 3**. O nível mais difícil: as questões principais exigem C, estruturas de dados e circuitos digitais (até o 3º semestre); cada uma tem um minijogo opcional que dá uma ajuda para quem não sabe. No final, o grupo conserta uma função em C de verdade (interpretador em `js/minic.js`) e fala o kill switch ao mestre do jogo.
- **`projetor.html`** (escolha Nível 3): cronômetro, punição (P, −5 min), dicas (D) e vitória (V).
- **`imprimir-nivel3.html`**: papéis da sala (nós da lista, circuito do registrador, tabela ASCII, código Morse).
- Dados do caso em `js/level3-data.js`. Guia completo (spoiler) em `TESTES-NIVEL3.md`.

## Documentação em PDF
A pasta **`pdf/`** tem os guias em PDF, para a equipe ler e imprimir: visão geral, guias dos Níveis 1, 2 e 3 (com spoilers) e o contexto técnico.
Depois de mudar algum `.md`, gere de novo com `python gerar-pdfs.py`. É preciso ter o Chrome ou o Edge e o pacote markdown (`python -m pip install markdown`).

## Minigames reaproveitados
`apps/terminal.js` (terminal hacker) e `apps/wires.js` (painel de fios ATX) são opcionais do Nível 3 (`invasao.exe` e `energia.exe`).
O Nível 1 antigo (admin, hacker, labirinto, cmd, ransomware) está guardado no git, na tag `nivel1-antigo`.
