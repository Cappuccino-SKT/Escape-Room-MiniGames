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
| `js/config.js` | Configuração geral: nível, boot, sustos (`scareMedia`, `scareRules`, volume), sons |
| `js/os.js` | "Sistema operacional": janelas, ícones, diálogos (`OS.dialog`), notificações, `OS.showIcon`, `GATE`, revelar senha (`api.win`) |
| `js/interference.js` | Sustos: `Interference.scare(lugar)` (vídeo/imagem do lugar ou rosto SVG + grito), `Interference.error(lugar)` (erro: só às vezes vira susto), `Interference.run()` (interferência do hacker, Ctrl+Shift+H) |
| `js/phaselog.js` | Registro de tempo por etapa (Ctrl+Shift+L) |
| `js/level1-data.js` / `js/level1.js` | **Nível 1 "As Notas"**: dados do caso / apps do desktop |
| `js/level2-data.js` / `js/level2.js` | **Nível 2 "O Cúmplice"**: dados do caso / apps do desktop |
| `projetor.html` | Tela do projetor no PC do mestre do jogo, para os 2 níveis (cronômetro, punição P, dicas D, vitória V) |
| `js/final-scare.js` | Cena do susto da senha final errada (P no Nível 1): parabéns → "você errou" + luz vermelha → preto → cmd → chuva de erros → anel → olhos/boca brava/sorriso → máscara pula. Tudo HTML/CSS + WebAudio (o vídeo do Gemini não ficou bom) |
| `imprimir-nivel1.html` / `imprimir-nivel2.html` | Papéis da sala de cada nível |
| `TESTES-NIVEL1.md` / `TESTES-NIVEL2.md` | Guias (spoiler): respostas, lógica, dicas prontas. **Atualize junto com os dados do nível** |
| `videos/` | Vídeos dos jump scares (listar em `CONFIG.scareMedia`) |
| `apps/apps.js`, `apps/terminal.js`, `apps/wires.js` | Lista base `APPS` (cada nível a substitui) e 2 minigames antigos guardados para outros níveis |

Atalhos do mestre do jogo no notebook: **Ctrl+Shift+X** reinicia (mesmo nível), **Ctrl+Shift+1/2** troca de nível, **Ctrl+Shift+H** dispara a interferência, **Ctrl+Shift+L** mostra o tempo das etapas.
Não use Ctrl+Shift+N/T/W: o Chrome reserva esses atalhos e a página não os recebe.

Os dois níveis seguem o mesmo formato: um mistério só, pistas no PC + na sala, minijogos opcionais com pistas extras, resposta **falada** ao mestre do jogo (que é o J), cronômetro/punição/vitória no `projetor.html`, dicas 1 por jogador pela câmera. `level1.js` e `level2.js` só rodam no seu nível (`CONFIG.level`, de `?nivel=`) e cada um troca a lista `APPS`.

## Nível 1 — "As Notas" (`index.html?nivel=1`)
Para iniciantes (mais guiado que o Nível 2). O J trocou a senha do Sistema de Notas do **Prof. Muriel Godoi**; quando o tempo acabar, as notas são zeradas. Detalhes e respostas em `TESTES-NIVEL1.md`.
- **Só o nome do professor é real** (decisão do usuário); filha, formatura, número da sorte, fotos e e-mails são inventados. **O professor ainda não autorizou** — o nome fica só em `L1.professor`.
- Resposta: **ALICE19987** (filha Alice + formatura 1994+4 = 1998 + sorte 111 em binário = 7). A fórmula aparece em "Esqueci a senha". Resposta errada = tecla P no projetor (susto + perde **2 min**).
- Trilha principal: Sistema de Notas → E-mail da escola (anexo turma 3B) + desenhos na sala → `formatura.c` (lacuna + diploma na sala) → post-it 111 + tabela binária / `aula_binario`.
- Opcionais: `anotacoes.docx` (texto branco, Ctrl+A), `memoria.exe` (libera a foto da formatura), Navegador (histórico), Lixeira (isca + armadilha `NAO_ABRA.exe`).
- O Nível 1 antigo (admin, hacker, labirinto, cmd, ransomware) foi removido a pedido do usuário; está na tag git `nivel1-antigo`.

## Nível 2 — "O Cúmplice" (`index.html?nivel=2`)
Partida separada de 30 min (cada grupo escolhe o nível na inscrição). Mesmo hacker (J), história nova: descobrir quem instalou o vírus no Lab. N112. Detalhes e respostas em `TESTES-NIVEL2.md`.
- Resposta: **Elisa**, falada ao mestre do jogo. Acusação errada = tecla P no `projetor.html` (jump scare + perde 5 min + segunda chance). Dicas: 1 por jogador, pedidas pela câmera.
- Trilha principal: senha do notebook (cartas na sala) → `fechadura.exe` (deduzir AND/OR pelo registro) → lista de monitores (sala) → `chat_monitores` (senha = saída do `limpeza.c`) → depoimentos + bilhete de ônibus.
- Opcionais com pistas extras: `terminal.exe` (arquivos ocultos), `cameras.exe` (horário), `email_bruno` (senha deduzida), `rede.exe` (MAC decimal → hex). Erros = jump scare.
- O `level1.js` e o `level2.js` só rodam no seu nível (`CONFIG.level`, vindo de `?nivel=`). O Nível 2 troca a lista `APPS`.
- Decisões do usuário: só um notebook na sala; projetor ligado ao PC do mestre do jogo; sem reviravolta no final; sala real ainda não definida.

## Pendências / decisões em aberto
- **Autorização do Prof. Muriel Godoi** para usar o nome no Nível 1.
- **Sala real do evento**: ainda não decidida (o Nível 2 usa "N112" em `js/level2-data.js`).
- **Vídeos dos sustos**: o usuário vai gerar com IA. Cada lugar tem sua lista em `CONFIG.scareMedia` (arquivos em `videos/`); com vários, sorteia sem repetir. Lugares: padrao, interferencia, nivel1, nivel1_armadilha, nivel2, nivel2_armadilha, projetor_punicao, projetor_tempo.
- **Sustos por erro são condicionais** (`Interference.error` + `CONFIG.scareRules`): nunca no 1º erro, descanso de 90 s após qualquer susto, chance crescente (30% por erro). Sem susto = efeito leve. Armadilhas e projetor sempre assustam.
- **Sons**: ainda sem arquivos (pasta `sounds/` + `CONFIG.sounds.*`).
- **Nível 3**: não definido. O documento original (PDF "escape-room-jogos-mortais-v4") sugere arquivos ocultos, cifras (César/Vigenère), binário/hex → texto, Base64, QR code, luz UV, Morse.

## Como testar
Abra `index.html` e escolha o nível. No console do navegador, `CONFIG.bootSpeed = 20` acelera o boot; `OS.openApp('id')` abre qualquer app.
Para testar localmente com servidor: `python -m http.server 8123` na pasta do projeto (o navegador pode guardar JS antigo em cache; recarregue com Ctrl+F5).
