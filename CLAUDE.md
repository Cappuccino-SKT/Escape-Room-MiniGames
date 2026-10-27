# Escape Room – Jogos Mortais (JIGSAW OS) — contexto e progresso

Leia este arquivo antes de começar. Ele resume o projeto e onde paramos.

## O projeto
Evento de escape room com tema Jogos Mortais do **CA de Engenharia da Computação**: grupos de até 5 pessoas, 30 min por grupo e um vilão que fala por câmera e projetor.
Este repositório é o **jogo no notebook da sala**: uma simulação de computador (área de trabalho) com os minigames dentro.
- HTML/CSS/JS puro, sem build e sem internet. Para rodar, basta abrir `index.html` no Chrome.
- Idioma da interface: português (BR). Tom: terror psicológico, sem gore.
- Preferências do usuário: fazer perguntas quando faltar informação; ser econômico, mas sem perder qualidade.
- Branch de trabalho: `claude/relaxed-planck-j4r121`.

## Estrutura
| Arquivo | O que é |
|---|---|
| `index.html` | Telas: escolha do nível (se não houver `?nivel=`) → ligar → boot → (login opcional) → área de trabalho. Ctrl+Shift+1/2 trocam de nível |
| `js/config.js` | **Tudo configurável**: senhas, lista de usuários, labirintos, susto, sons |
| `js/os.js` | "Sistema operacional": janelas, ícones, diálogos (`OS.dialog`), notificações, `OS.showIcon`, `GATE` (regra para abrir apps), revelar senha (`api.win`) |
| `js/level1.js` | Lógica do Nível 1 (fases 1 a 5) + dicas + apps `cadastro_adm`, `gerenciador_usuarios`, `log_seguranca.txt`, `dicas.txt`, `bios_setup` e `cmd.exe` |
| `js/ransom.js` | Fase 5: tela do ransomware + tela final (código do cadeado) |
| `js/phaselog.js` | Registro de tempo por fase (para testes) |
| `js/interference.js` | Interferência do hacker (cmds + erros se sobrepondo) + jump scare (grito sintetizado via WebAudio, rosto do boneco em SVG). `Interference.scare()` = só o susto |
| `apps/apps.js` | Lista `APPS` (LEIA-ME, Lixeira e minigames guardados) |
| `apps/bios.js` | Fase 3: jogo do labirinto |
| `apps/reconfig.js` | Fase 4: reconfiguração pelo cmd |
| `imprimir.html` | Papéis da sala para imprimir: manual e tabela da fase 4 + chave da fase 5 (gerados do config) |
| `js/level2-data.js` | **Nível 2**: todos os dados do caso (suspeitos, depoimentos, fechadura, chat, arquivos, câmeras, e-mails, Wi-Fi, papéis) |
| `js/level2.js` | **Nível 2**: apps do desktop (ativo com `index.html?nivel=2`) |
| `projetor.html` | **Nível 2**: tela do projetor no PC do mestre do jogo (cronômetro, punição, dicas, vitória) |
| `imprimir-nivel2.html` | **Nível 2**: papéis da sala |
| `TESTES-NIVEL2.md` | Guia do Nível 2 (spoiler): respostas, lógica, dicas prontas para o mestre do jogo |
| `TESTES-NIVEL1.md` | Guia para testadores (spoiler): fluxo, senhas, comandos, atalhos. **Atualize junto com o config** |
| `apps/terminal.js`, `apps/wires.js` | Minigames prontos, mas **escondidos** (`hidden: true`), guardados para outros níveis |

Atalhos do mestre do jogo: **Ctrl+Shift+X** reinicia, **Ctrl+Shift+H** dispara a interferência, **Ctrl+Shift+S** pula o labirinto atual / a correção atual do cmd / preenche a chave do ransomware, **Ctrl+Shift+L** mostra o tempo de cada fase (fica salvo no navegador).
Não use Ctrl+Shift+N/T/W: o Chrome reserva esses atalhos e a página não os recebe.

## Nível 1 — o que está pronto (5 fases)
**Final do jogo:** cada fase de 1 a 4 desbloqueia uma dica (`CONFIG.hints`, guardadas em `dicas.txt`). A 5ª dica é física, dentro da caixa com cadeado. Com as 5 dicas, o grupo descobre a resposta final e fala para o mestre do jogo, que na história é o hacker.
O jogo começa direto na área de trabalho (login desativado: `password: ""`).

**Fase 1 – Acesso de administrador.** Qualquer app → "Acesso negado, precisa ser ADMINISTRADOR" → aparece `cadastro_adm`. O jogador cria um usuário e escolhe o nível (Espectador / Editor / Administrador). O nível Administrador pede `adminPassword` (hoje `KRAMER`). A senha é achada na sala em 2 etapas (uma pista leva à outra), só com objetos físicos, sem nada no código. Com outro nível, nada acontece e o jogo segue.

**Fase 2 – Remover o hacker.** Alerta de segurança → aparece `gerenciador_usuarios`, com contagem de 5 min (`hackerMinutes`).
- Se o usuário não for admin, o jogo pergunta "quer se tornar adm?". O botão "Não" é morto (só treme) e o "Sim" pede a senha.
- A lista tem 40 usuários; o hacker é `t.hoffman` (`hacker: true`).
- Pista: `log_seguranca.txt` (`CONFIG.securityLog`) mostra login REMOTO hoje às 23:59 com nível ADMINISTRADOR, sem o nome. Na lista, só o `t.hoffman` bate com tudo. Iscas: h.costa e s.freitas (23:59, mas login local e não admin), d.rocha (admin 23:58), j.farias (admin, ontem 23:59).
- Excluir um inocente tira `wrongDeletePenalty` (30 s) do cronômetro.
- Pegadinha: o usuário do jogador aparece numa posição aleatória. Excluí-lo pede "Você quer mesmo apagar você próprio?"; se confirmar, ele precisa recriar o usuário.
- Se o tempo acabar, o usuário do jogador é excluído e ele recria. Os usuários já excluídos continuam excluídos.
- Ao excluir o hacker: "Ameaça eliminada" → "FALHA CRÍTICA NA BIOS" (o hacker danificou CPU, RAM, GPU, SSD, PSU e FAN), que justifica a fase 3.

**Fase 3 – BIOS / jogo do labirinto.** Aparece `bios_setup`, com 6 labirintos em sequência (CPU, RAM, GPU, SSD, PSU, FAN).
- Começa com "Podemos iniciar?" (o "Não" é morto). O ponto anda sozinho; WASD/setas mudam a direção (com curva "guardada").
- Bater na parede = erro e volta ao **início do labirinto atual** (decisão do usuário).
- Labirintos gerados com seed fixa (`maze` no config: `w` = largura do corredor, `cols`/`rows`, `speed`).
- **Interferência do hacker: acontece UMA única vez na fase 3**, no que vier primeiro: 5 min jogando (`interferenceMinutes`), 30 erros acumulados (`interferenceErrors`) ou ao terminar (garantida). Depois: "Podemos continuar?" (se foi no meio do jogo) ou a vitória.
- Ao vencer: "BIOS reparada" → "CONFIGURAÇÃO PERDIDA" → aparece `cmd.exe` (fase 4).

**Fase 4 – Reconfiguração pelo cmd (trabalho em grupo).** `cmd.exe` pergunta "Iniciar reconfiguração? (Y/N)".
- Y = começa. N = pergunta de novo, com easter egg: 1º N = jump scare (`Interference.scare()`), 2º N = máscara neutra "Você é burro? Apertou N de novo?" (`Interference.mock()`, sem grito; imagem própria em `CONFIG.mockImage`), do 3º em diante = "Aperte Y logo." no cmd. A contagem vale para a partida toda.
- São sorteadas 6 (`reconfig.steps`) das 12 correções. A tela mostra uma por vez (ex.: "FORMATAR WINDOWS").
- Na sala há 2 papéis (`imprimir.html`): **Tabela de correções** (correção → número) e, do lado oposto à tela, **Manual de comandos** (número → comando, espalhados, com 6 comandos falsos).
- Comando válido mas errado (inclusive falso) = recomeça do zero com novo sorteio. Comando inexistente = só avisa. Sem cronômetro. `help` manda procurar o manual.
- Mudou `CONFIG.reconfig`? Imprima os papéis de novo.

**Fase 5 – Ransomware (final).** Reinício falso ("Sistema restaurado") → tela vermelha "SEUS ARQUIVOS FORAM SEQUESTRADOS".
- A chave `ransom.key` (5 blocos) é impressa na página 3 do `imprimir.html`, rasgada nas linhas tracejadas e os pedaços escondidos na sala. As linhas do desenho atravessam os pedaços para ajudar a montar na ordem.
- Cronômetro `ransom.minutes` (8). Se acabar: jump scare e recomeça. Chave errada: só uma provocação.
- Chave certa → tela final (fica até Ctrl+Shift+X): código do cadeado (`ransom.lockCode`, hoje provisório `0000`), as 4 dicas e "digam a resposta final em voz alta".

## Nível 2 — "O Cúmplice" (`index.html?nivel=2`)
Partida separada de 30 min (cada grupo escolhe o nível na inscrição). Mesmo hacker (J), história nova: descobrir quem instalou o vírus no Lab. N112. Detalhes e respostas em `TESTES-NIVEL2.md`.
- Resposta: **Elisa**, falada ao mestre do jogo. Acusação errada = tecla P no `projetor.html` (jump scare + perde 5 min + segunda chance). Dicas: 1 por jogador, pedidas pela câmera.
- Trilha principal: senha do notebook (cartas na sala) → `fechadura.exe` (deduzir AND/OR pelo registro) → lista de monitores (sala) → `chat_monitores` (senha = saída do `limpeza.c`) → depoimentos + bilhete de ônibus.
- Opcionais com pistas extras: `terminal.exe` (arquivos ocultos), `cameras.exe` (horário), `email_bruno` (senha deduzida), `rede.exe` (MAC decimal → hex). Erros = jump scare.
- O `level1.js` e o `level2.js` só rodam no seu nível (`CONFIG.level`, vindo de `?nivel=`). O Nível 2 troca a lista `APPS`.
- Decisões do usuário: só um notebook na sala; projetor ligado ao PC do mestre do jogo; sem reviravolta no final; sala real ainda não definida.

## Pendências / decisões em aberto
- **Resposta final e textos das dicas**: ainda não decididos. Quando decidir, preencher `CONFIG.hints` (4 dicas) e preparar a 5ª, física.
- **Cadeado da caixa**: tipo ainda não decidido. Código em `ransom.lockCode` (provisório `0000`).
- **Pistas físicas da fase 1** (senha em 2 etapas): o usuário prepara na sala.
- **Dificuldade dos labirintos**: o usuário vai testar e pedir ajustes (`speed`, `w`, `cols`, `rows`).
- **Nomes definitivos** (senha admin `KRAMER`, hacker `t.hoffman`): vão mudar depois; manter por enquanto.
- **Sons e imagem do susto**: ainda sem arquivos. Quando chegarem: pasta `sounds/` + `CONFIG.sounds.*`, `CONFIG.scareImage`, `CONFIG.scareVolume`.
- **Níveis 2 e 3**: não definidos. Candidatos já prontos: terminal hacker (`apps/terminal.js`) e painel de fios ATX (`apps/wires.js`). Para usar, tire o `hidden: true` em `apps/apps.js`.
- O documento original do projeto (PDF "escape-room-jogos-mortais-v4") traz ideias de minigames por nível: memória de hardware, C com lacuna, portas lógicas, cifras, binário/hex, Base64, arquivos ocultos.

## Como testar
Abra `index.html`. No console do navegador, `CONFIG.bootSpeed = 20` acelera o boot.
Para ir direto à fase 3: `window.GATE = null; OS.showIcon('bios')`.
Para ir direto à fase 4: `MazeState.onDone()` (mostra os avisos) e depois `window.GATE = null; OS.openApp('reconfig')`.
Para ir direto à fase 5: `Ransom.start()`.
Para testar localmente com servidor: `python -m http.server 8123` na pasta do projeto.
