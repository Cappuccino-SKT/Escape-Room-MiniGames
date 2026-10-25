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
| `index.html` | Telas: ligar → boot → (login opcional) → área de trabalho |
| `js/config.js` | **Tudo configurável**: senhas, lista de usuários, labirintos, susto, sons |
| `js/os.js` | "Sistema operacional": janelas, ícones, diálogos (`OS.dialog`), notificações, `OS.showIcon`, `GATE` (regra para abrir apps), revelar senha (`api.win`) |
| `js/level1.js` | Lógica do Nível 1 (fases 1 a 3) + apps `cadastro_adm`, `gerenciador_usuarios` e `bios_setup` |
| `js/interference.js` | Interferência do hacker (cmds + erros se sobrepondo) + jump scare (grito sintetizado via WebAudio, rosto do boneco em SVG) |
| `apps/apps.js` | Lista `APPS` (LEIA-ME, Lixeira e minigames guardados) |
| `apps/bios.js` | Fase 3: jogo do labirinto |
| `apps/terminal.js`, `apps/wires.js` | Minigames prontos, mas **escondidos** (`hidden: true`), guardados para outros níveis |

Atalhos do mestre do jogo: **Ctrl+Shift+X** reinicia, **Ctrl+Shift+H** dispara a interferência, **Ctrl+Shift+N** pula o componente atual do labirinto.

## Nível 1 — o que está pronto
O jogo começa direto na área de trabalho (login desativado: `password: ""`).

**Fase 1 – Acesso de administrador.** Qualquer app → "Acesso negado, precisa ser ADMINISTRADOR" → aparece `cadastro_adm`. O jogador cria um usuário e escolhe o nível (Espectador / Editor / Administrador). O nível Administrador pede `adminPassword` (hoje `KRAMER`, pista física na sala). Com outro nível, nada acontece e o jogo segue.

**Fase 2 – Remover o hacker.** Alerta de segurança → aparece `gerenciador_usuarios`, com contagem de 5 min (`hackerMinutes`).
- Se o usuário não for admin, o jogo pergunta "quer se tornar adm?". O botão "Não" é morto (só treme) e o "Sim" pede a senha.
- A lista tem 40 usuários; o hacker é `t.hoffman` (`hacker: true`).
- Pegadinha: o usuário do jogador aparece numa posição aleatória. Excluí-lo pede "Você quer mesmo apagar você próprio?"; se confirmar, ele precisa recriar o usuário.
- Se o tempo acabar, o usuário do jogador é excluído e ele recria. Os usuários já excluídos continuam excluídos.

**Fase 3 – BIOS / jogo do labirinto.** Aparece `bios_setup`, com 6 labirintos em sequência (CPU, RAM, GPU, SSD, PSU, FAN).
- Começa com "Podemos iniciar?" (o "Não" é morto). O ponto anda sozinho; WASD/setas mudam a direção (com curva "guardada").
- Bater na parede = erro e volta ao **início do labirinto atual** (decisão do usuário).
- Labirintos gerados com seed fixa (`maze` no config: `w` = largura do corredor, `cols`/`rows`, `speed`).
- **Interferência do hacker: acontece UMA única vez na fase 3**, no que vier primeiro: 5 min jogando (`interferenceMinutes`), 30 erros acumulados (`interferenceErrors`) ou ao terminar (garantida). Depois: "Podemos continuar?" (se foi no meio do jogo) ou a vitória.
- Ao vencer, aparece a tela provisória "REBOOT – próxima fase em breve".

## Pendências / decisões em aberto
- **O que acontece depois da fase 3**: o usuário ainda não decidiu (fase 4? senha para cadeado físico? fim do nível?).
- **Dificuldade dos labirintos**: o usuário vai testar e pedir ajustes (`speed`, `w`, `cols`, `rows`).
- **Nomes definitivos** (senha admin `KRAMER`, hacker `t.hoffman`): vão mudar depois; manter por enquanto.
- **Sons e imagem do susto**: ainda sem arquivos. Quando chegarem: pasta `sounds/` + `CONFIG.sounds.*`, `CONFIG.scareImage`, `CONFIG.scareVolume`.
- **Níveis 2 e 3**: não definidos. Candidatos já prontos: terminal hacker (`apps/terminal.js`) e painel de fios ATX (`apps/wires.js`). Para usar, tire o `hidden: true` em `apps/apps.js`.
- O documento original do projeto (PDF "escape-room-jogos-mortais-v4") traz ideias de minigames por nível: memória de hardware, C com lacuna, portas lógicas, cifras, binário/hex, Base64, arquivos ocultos.

## Como testar
Abra `index.html`. No console do navegador, `CONFIG.bootSpeed = 20` acelera o boot.
Para ir direto à fase 3: `window.GATE = null; OS.showIcon('bios')`.
