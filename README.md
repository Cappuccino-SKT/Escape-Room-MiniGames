# Escape Room – Jogos Mortais (JIGSAW OS)

Simulação de computador para escape room: **ligar → boot → login com senha → área de trabalho** com ícones que abrem minigames.

## Como usar
Abra `index.html` no navegador (Chrome recomendado). Não precisa de internet nem instalação.
O jogo pergunta **qual nível** vai ser jogado (1 ou 2). Para trocar depois: **Ctrl + Shift + 1** ou **Ctrl + Shift + 2**.

- Clique no botão de ligar (entra em tela cheia). O jogo começa direto na área de trabalho.
- Tela de login opcional: preencha `password` em `js/config.js` (vazio = sem login).
- **Ctrl + Shift + X**: reinicia tudo (atalho do mestre do jogo).

## Configuração
`js/config.js` – usuário, senha, dica, cronômetro (0 = desligado), velocidade do boot e efeitos sonoros (coloque os áudios em `sounds/` e preencha os caminhos).

## Adicionar minigames
Em `apps/apps.js`, adicione um item na lista `APPS` com uma função `render(container, api)`.
`api.unlock("id")` desbloqueia outro app (ex.: vencer o Jogo 1 libera o Jogo 2).

## Nível 1 (`js/level1.js`)
1. **Acesso de administrador:** qualquer app mostra "Acesso negado" → aparece `cadastro_adm` → criar usuário e escolher o nível. O nível Administrador pede a **senha de permissão** (`adminPassword` em `js/config.js`, escondida na sala). Se escolher outro nível, o jogo segue normalmente.
2. **Remover o hacker:** alerta de segurança → aparecem `gerenciador_usuarios` e `log_seguranca.txt` (pista de quem é o hacker) e começa a contagem (`hackerMinutes`). Excluir um inocente tira `wrongDeletePenalty` segundos. O gerenciador exige administrador (o botão "Não" não funciona). Exclua o hacker (`hacker: true` na lista `users` do config).
   - Pegadinha: excluir o próprio usuário pede confirmação; se confirmar, precisa recriar o usuário.
   - Se o tempo acabar, o usuário do jogador é excluído e precisa ser recriado. Os usuários já excluídos continuam excluídos.
3. **BIOS (jogo do labirinto):** aparece `bios_setup`. Para cada um dos 6 componentes, o ponto anda sozinho e o jogador muda a direção com **WASD/setas** até chegar ao ponto colorido. Bater na parede = erro (volta ao início daquele labirinto).
   - **Interferência do hacker** (uma única vez): aos 5 min jogando, OU com 30 erros acumulados, OU, garantido, ao terminar. Janelas de cmd e erros se sobrepõem, e no fim vem o jump scare com som alto.
   - Configuração em `maze`, `scareImage` e `scareVolume` no `js/config.js`.
   - Atalhos do mestre do jogo: **Ctrl + Shift + H** dispara a interferência (teste); **Ctrl + Shift + S** pula o componente atual.
4. **Reconfiguração (cmd.exe):** a BIOS perdeu a configuração. O cmd pergunta `Y/N` (N = susto). Em cada etapa aparece uma correção; o grupo usa a **Tabela de correções** (correção → número) e o **Manual de comandos** (número → comando) colados na sala. Comando errado = recomeça do zero.
   - Lista em `reconfig` no `js/config.js`. Para imprimir os dois papéis, abra **`imprimir.html`** e use Ctrl+P.
   - **Ctrl + Shift + S** completa a correção atual.
5. **Ransomware (final):** o hacker sequestra o sistema. A chave de recuperação (página 3 do `imprimir.html`) é rasgada e escondida pela sala. Com a chave certa, aparece o código do cadeado da caixa (`ransom.lockCode`). Se o cronômetro (`ransom.minutes`) acabar, vem um susto e ele recomeça. **Ctrl + Shift + S** preenche a chave.

**Dicas e final:** as fases 1 a 4 desbloqueiam dicas (`hints` no config, guardadas em `dicas.txt`). A 5ª está na caixa. Com todas, o grupo fala a resposta final para o mestre do jogo.

**Tempo por fase:** **Ctrl + Shift + L** mostra quanto tempo cada fase levou (útil nos testes).

## Minigames guardados (escondidos do desktop, para outros níveis)
- **acesso_remoto.exe** – terminal hacker: `help` → `scan` → `crack 192.168.6.66` → `connect 192.168.6.66` → `ls`/`cat` → `decrypt chave.enc`. Revela a senha do próximo arquivo.
- **painel_energia.exe** (senha `ADAM`) – ligar os fios da fonte ATX nos pinos certos usando o manual.
- **Jogo 3** (senha `BILLY`) – a fazer.

Senhas dos arquivos: campo `password` em `apps/apps.js`. A senha revelada ao vencer é sempre a do arquivo indicado em `next`.

## Nível 2 – "O Cúmplice"
Abra `index.html` e escolha **Nível 2** (ou abra direto `index.html?nivel=2`). Investigação: descobrir quem, entre 5 suspeitos, instalou o vírus do hacker. A resposta é falada ao mestre do jogo.
- **`projetor.html`**, no PC do mestre do jogo ligado ao projetor: cronômetro, punição por acusação errada (tecla P), dicas usadas (D) e vitória (V).
- **`imprimir-nivel2.html`**: papéis da sala (cartas da senha, lista de monitores, livro de chaves, bilhete).
- Dados do caso em `js/level2-data.js`. Guia completo (spoiler) em `TESTES-NIVEL2.md`.
