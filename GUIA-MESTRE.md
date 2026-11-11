# Guia do Mestre do Jogo

> ⚠ **SPOILER TOTAL.** Este guia tem todas as respostas dos 3 níveis. É só para o mestre do jogo. Nunca deixe os jogadores verem.

Este guia mostra **como resolver cada nível, passo a passo**, na ordem em que o grupo costuma jogar. Para dar dicas, use o outro PDF, **Dicas do Mestre** (`DICAS-MESTRE.md`), que tem uma dica pronta para cada situação de travamento.

---

## 0. Antes de qualquer partida

### Como a resposta final funciona (vale para os 3 níveis)
- A resposta final é **sempre uma palavra só**, e o grupo precisa **falar em voz alta**, pela câmera: **"A palavra-chave é ___."**
- Nenhum programa entrega a resposta pronta: o grupo junta as pistas e **deduz** a palavra.
- Se o grupo disser a palavra certa: aperte **V** no projetor (vitória).
- Se disser uma palavra errada: aperte **P** (cena do susto + perde tempo + pode tentar de novo).
- Se o grupo só "pensar alto" ou citar várias palavras ao mesmo tempo, peça: *"Qual é a palavra-chave? Digam a frase inteira."* Só vale a frase completa.

| Nível | Palavra-chave | Punição se errar |
|---|---|---|
| 1 — As Notas | **ALICE** | −2 min + susto final |
| 2 — O Cúmplice | **ELISA** | −5 min + susto final |
| 3 — A Prova Final | **SEGFAULT** | −5 min + susto final |

### Montagem (todos os níveis)
1. **Notebook da sala:** abrir `index.html` no Chrome e escolher o nível (ou Ctrl + Shift + 1, 2 ou 3).
2. **PC do mestre (ligado ao projetor):** abrir `projetor.html`, escolher o mesmo nível, apertar **F** (tela cheia) e **H** (esconder o painel de teclas).
3. **Papéis da sala:** imprimir `imprimir-nivel1.html`, `-nivel2` ou `-nivel3` (Ctrl + P, A4) e espalhar como indicado em cada nível abaixo.
4. Aperte **Espaço** no projetor quando o grupo entrar: o cronômetro de 30 min começa.

### Teclas do projetor

| Tecla | O que faz |
|---|---|
| **Espaço** | Inicia ou pausa o cronômetro |
| **V** | Resposta certa (vitória) |
| **P** | Resposta errada (susto final de ~30 s + perde tempo) |
| **D / Shift + D** | +1 / −1 dica usada (aparece na parede) |
| **↑ / ↓** | +1 / −1 minuto |
| **R** (2 vezes) | Reinicia tudo |
| **F / H** | Tela cheia / esconde o painel de teclas |

### Atalhos no notebook da sala
- **Ctrl + Shift + X:** reinicia o jogo no mesmo nível (use entre um grupo e outro).
- **Ctrl + Shift + L:** mostra quanto tempo o grupo levou em cada etapa.
- **Ctrl + Shift + H:** dispara a "interferência do hacker" (susto) quando você quiser.

### Regras das dicas
- **1 dica por jogador** (5 no máximo para um grupo de 5), pedida pela câmera.
- Aperte **D** a cada dica dada.
- Comece sempre pela dica mais leve (nível 1 no PDF de dicas). Só suba de nível se o grupo continuar travado.

---

## NÍVEL 1 — "As Notas" (iniciantes)

**História:** o J trocou a senha do Sistema de Notas do Prof. Muriel Godoi. Quando o tempo acabar, as notas da turma serão zeradas. A senha nova é **uma palavra só** e "tem a cara do professor".

**Palavra-chave: ALICE** (o nome da filha do professor).

### Papéis na sala

| Papel | Onde colocar |
|---|---|
| 3 desenhos de criança (Alice, Pedro e Sofia) | Parede, como um mural |
| Diploma do professor com o **canto do ano rasgado** | Moldura ou parede |
| Post-it "111 — meu número da sorte, em binário" | Colado no monitor ou na mesa |
| Tabela binária (4 · 2 · 1) | Parede, como material de aula |

### Mapa do nível
```
LEIA-ME (o J) ──► Sistema de Notas ──► "Esqueci a senha" = 2 perguntas de segurança
                                         │
              ┌──────────────────────────┴──────────────────────────┐
     Pergunta 1: ano da formatura                     Pergunta 2: número da sorte
     diploma (4 anos) + formatura.c (1994 + 4)        post-it "111" + tabela binária / aula_binario
              = 1998                                             = 7
              └──────────────────────────┬──────────────────────────┘
                     Lembrete: "Uma palavra só: o nome da minha filha."
                                         │
     Desenhos (Alice, Pedro, Sofia) + e-mail da escola + lista da turma 3B
                                         │
                         "A palavra-chave é ALICE."
```

### Passo a passo
**Passo 1 — Entender o objetivo.**
O jogo abre direto na área de trabalho com o `LEIA-ME.txt`. O J diz que trocou a senha, que ela é uma palavra só, que "tem a cara do professor" e que deve ser dita em voz alta com "A palavra-chave é...".

**Passo 2 — Achar o "Esqueci a senha".**
No app **Sistema de Notas**, o campo de senha não aceita nada (digitar ali conta como erro). Clicando em **"Esqueci a senha"** aparecem as **perguntas de segurança**:
1. "Em que ano você se formou?"
2. "Qual é o seu número da sorte? (em decimal)"

**Passo 3 — Descobrir o ano da formatura: 1998.**
- O **diploma** na parede está com o ano rasgado, mas diz que o curso durou **4 (quatro) anos**.
- No PC, o `formatura.c` tem `ingresso = 1994` e uma **lacuna** em `duracao = ___`.
- Digitar **4** na lacuna e clicar em **"Compilar e executar"** → o programa imprime **"Me formei em 1998"**.
- Atalho opcional: o `memoria.exe` (jogo da memória de hardware) recupera a `formatura.jpg` no app Fotos, com a faixa "FORMANDOS ENG. COMPUTAÇÃO **1998**".

**Passo 4 — Descobrir o número da sorte: 7.**
- O **post-it** diz "111 — meu número da sorte, em binário".
- A **tabela binária** da parede (ou os slides do `aula_binario.pptx`) explica: cada posição vale 4, 2 e 1.
- **111 = 4 + 2 + 1 = 7.**
- Se o grupo digitar 111 na pergunta, o sistema só avisa: "Isso está em binário. O sistema pede o número em decimal." (não é erro).

**Passo 5 — Responder as perguntas de segurança.**
Digitar **1998** e **7** e clicar em **Confirmar**. O sistema mostra o lembrete do professor:
**"Uma palavra só: o nome da minha filha."**
Respostas erradas contam como erro (podem dar susto) e dizem quantas das duas estão certas.

**Passo 6 — Descobrir quem é a filha (a dedução final).**
Há 3 desenhos de criança na parede. O grupo precisa descobrir qual é a **filha**:

| Criança | Quem é | Como descobrir |
|---|---|---|
| **Alice** | **A filha** | O e-mail da escola fala da "sua **filha**, da turma **3B**"; o anexo `lista_turma_3B.txt` tem **Alice**. O desenho dela diz "Eu, o **papai** e o Pedro". |
| Pedro | O filho | Outro e-mail fala do "seu **filho**, da turma 5A" (feira de ciências, foguete). O histórico do navegador cita "feira de ciências do Pedro". |
| Sofia | A sobrinha | O desenho dela diz "Para o **tio**, com amor". Ela não está na lista da turma 3B. |

**Passo 7 — Falar a resposta.**
**"A palavra-chave é ALICE."** → aperte **V**.

### Opcionais do Nível 1 (ajudam, mas não são obrigatórios)

| App | Como resolver | O que ganha |
|---|---|---|
| `anotacoes.docx` | Parece vazio. **Ctrl + A** (ou arrastar o mouse) mostra o texto em branco | Confirma que as perguntas de segurança são o ano da formatura e o número da sorte (em decimal) |
| `memoria.exe` | Jogo da memória: ligar cada ícone ao nome (CPU, RAM, SSD, Mouse, Teclado, GPU) | Recupera a `formatura.jpg` com o ano **1998** |
| `Navegador` | Ler o histórico | Pistas sobre a filha (8 anos, turma 3B), o Pedro e as perguntas de segurança |
| `Lixeira` → `senha_antiga.txt` | Ler | **Isca:** "pedro2020 (não serve mais)" |
| `Lixeira` → `NAO_ABRA.exe` | — | **Armadilha:** sempre dá susto |

### Respostas erradas comuns
- "ALICE19987", "ALICE1998", "PEDRO", "SOFIA": aperte **P**.
- "1998" ou "7": não são a palavra-chave; são só as respostas das perguntas de segurança.

---

## NÍVEL 2 — "O Cúmplice" (intermediário)

**História:** entre 23:00 e 23:10 de ontem, alguém instalou o vírus do J no computador do Laboratório N112. O J tem um **cúmplice** entre 5 suspeitos. **Regra do J: o cúmplice mente; os inocentes dizem a verdade.**

**Palavra-chave: ELISA** (Elisa Prado, a cúmplice).

### Papéis na sala

| Papel | Onde colocar |
|---|---|
| 7 cartas de letra com número (T-R-A-I-C-A-O) | Uma em cada canto da sala, escondidas |
| Lista de monitores (crachá) | Parede |
| Livro de chaves | Pasta ou mesa |
| Bilhete de ônibus (22:58, Bruno + Rafael) | Escondido numa mochila ou casaco |

### Mapa do nível
```
Cartas na sala ──► senha do notebook TRAICAO ──► caso.txt (regras do J)
                                                   │
fechadura.exe: G1 = AND, G2 = OR  ──►  às 23:03: A = 1 (crachá) e B = 1 (senha da porta)
                                                   │
Lista de monitores (sala): têm crachá ──► Bruno, Elisa, Rafael
                                                   │
limpeza.c (de cabeça) = MNTRA9 ──► chat_monitores: Rafael saiu ANTES da senha nova ──► Rafael fora
                                                   │
Rafael (inocente, fala a verdade): "Bruno estava no ônibus comigo" + bilhete 22:58 ──► Bruno fora
                                                   │
Elisa mente no depoimento ──► "A palavra-chave é ELISA."
```

### Passo a passo
**Passo 1 — Entrar no notebook: senha TRAICAO.**
O notebook abre pedindo senha. As **7 cartas** espalhadas pela sala têm uma letra e um número (a posição). Na ordem dos números: **T-R-A-I-C-A-O** → senha **`TRAICAO`** (sem cedilha e sem til; maiúscula ou minúscula). Depois de 3 erros aparece o botão de dica: "As letras estão espalhadas pela sala. Os números dizem a ordem."

**Passo 2 — Ler o caso.**
O `caso.txt` abre sozinho: o vírus foi instalado entre 23:00 e 23:10; há 5 suspeitos; **o cúmplice mente, os inocentes falam a verdade**. Os apps `suspeitos` (fichas) e `depoimentos` mostram quem é cada um e o que disse.

**Passo 3 — Consertar a fechadura (`fechadura.exe`): G1 = AND, G2 = OR.**
O circuito da porta é `PORTA = (A G1 B) G2 C`, onde **A** = crachá de monitor, **B** = senha da porta, **C** = chave física. As portas lógicas G1 e G2 estão "queimadas"; o grupo deduz quais são pelo **registro do dia**:
- Nas linhas com C = 0: só abriu com A = 1 **e** B = 1 (08:12). Com só A ou só B, não abriu. → **G1 = AND**.
- Com C = 1 a porta sempre abriu (15:30, 18:47). A linha das 19:20 (A = 1, B = 1, C = 1, porta aberta) elimina o XOR (1 XOR 1 = 0). → **G2 = OR**.

Com o reparo certo, aparece o registro das **23:03**: C = 0 (ninguém usou a chave física) e a porta **abriu**. O grupo confirma **A = 1 e B = 1**: quem entrou tinha **crachá de monitor** e sabia a **senha da porta**. Reparo errado ou A/B errados contam como erro.

**Passo 4 — Ver quem tem crachá (sala).**
A **lista de monitores** na parede: dos 5 suspeitos, só **Bruno, Elisa e Rafael** são monitores. **Carla e Diego estão fora.**

**Passo 5 — Abrir o chat (`chat_monitores`): senha MNTRA9.**
A senha é a **saída do `limpeza.c`**. O "compilar" está corrompido, então o grupo roda o código de cabeça:
- `s = "MONITORIA"`; o `for` imprime só as letras nas **posições pares** (`i % 2 == 0`): posição 0 = M, 2 = N, 4 = T, 6 = R, 8 = A → **MNTRA**.
- Quando o laço termina, `i` vale **9** (o tamanho da palavra), e o programa imprime o 9.
- Senha: **`MNTRA9`**. Cada senha errada conta como erro.

**Passo 6 — Eliminar o Rafael.**
No chat: a senha nova da porta foi enviada às **21:00**, mas o **Rafael saiu do grupo às 20:15**. Ele **não sabia a senha** (B = 0). **Rafael fora.**

**Passo 7 — Bruno × Elisa (a dedução final).**
- O Rafael é inocente, então **fala a verdade**. Ele diz que às 23h o **Bruno estava no ônibus com ele**. O **bilhete de ônibus** escondido na sala (22:58, Bruno + Rafael) confirma. **Bruno fora.**
- A **Elisa** diz que foi embora antes das 23h e que viu o Bruno voltar ao laboratório. As duas coisas são **falsas** (o Bruno estava no ônibus). Quem mente é o cúmplice.
- Os outros depoimentos batem: Diego viu "alguém com crachá de monitor" entrando; Carla devolveu a chave às 22h (livro de chaves).

**Passo 8 — Falar a resposta.**
**"A palavra-chave é ELISA."** → aperte **V**. (Se disserem "Elisa Prado", também vale.)

### Opcionais do Nível 2 (pistas extras que reforçam a Elisa)

| App | Como resolver | O que ganha |
|---|---|---|
| `terminal.exe` | `help` → `dir /a` (mostra a pasta oculta `.backup`) → `cd .backup` → `type rascunho.txt` | "Ninguém desconfia de uma **monitora**." A única mulher com crachá é a Elisa |
| `terminal.exe` | `cd Usuarios\bruno` → `type lembrete.txt` | Como montar a senha do e-mail do Bruno (gato + ano de ingresso) |
| `email_bruno` | Senha **`bit2024`** (gato Bit, da ficha + ingresso 2024, da ficha) | Recibo do ônibus 22:58 com o Rafael (álibi do Bruno) + e-mail da Elisa: "preciso do lab sozinha" |
| `cameras.exe` | Digitar horários HH:MM: **23:03** é o principal (também 22:00, 22:50, 22:58, 23:09) | 23:03: pessoa com crachá de monitor e **tubo de projeto** (a Elisa é de Arquitetura e anda com tubo) |
| `rede.exe` | Converter os 2 últimos blocos do MAC de decimal para hexadecimal: 164 = **A4**, 94 = **5E** → `3C:7A:1F:09:A4:5E` | Celular da **Elisa** conectado às 23:02 |
| `Lixeira` | Ler | Senha antiga da porta (4402): não serve para nada |
| `Downloads\jigsaw.exe` (terminal) | — | **Armadilha:** sempre dá susto. O comando `del` também conta como erro |

### Respostas erradas comuns
- "BRUNO" (cai na mentira da Elisa), "RAFAEL", "DIEGO" (o jaleco nas câmeras): aperte **P**.

---

## NÍVEL 3 — "A Prova Final" (difícil)

**História:** o J se revela: ex-aluno de Engenharia de Computação que trancou o curso no 3º semestre por causa de um *segmentation fault*. O vírus apaga tudo quando o tempo acabar. O **kill switch** está numa das 8 mensagens cifradas.

**Palavra-chave: SEGFAULT.**

### Papéis na sala

| Papel | Onde colocar |
|---|---|
| 10 cartões de nó da lista encadeada (6 certos + 4 iscas) | Espalhados e escondidos pela sala |
| Circuito do registrador (3 flip-flops D) | Parede |
| Tabela ASCII | Parede, **visível desde o começo** (é preciso para o login) |
| Código Morse | Parede ou mesa |
| Manual da fonte (para o `energia.exe`) | Escondido (gaveta, pasta) |

### Mapa do nível
```
Login: dump hex → tabela ASCII → "SENHA:PONTEIRO" ──► prova_final.txt (regras)
            │
            ├── Q1 lista encadeada (cartões na sala, head = 0x2C) ─────► MALLOC  ┐
            ├── Q2 display.exe (mapa de Karnaugh do segmento g) ───────► DEAD    ┴─► chave MALLOCDEAD
            └── Q3 registrador (circuito na parede, 5 pulsos) ─────────► 110 = 6 ──► arquivo msg_6
                                                │
            decifra.c: consertar os 5 bugs, rodar com msg_6 + MALLOCDEAD
                                                │
            saída: OKILLSWITCHESEGFAULT = "O KILL SWITCH É SEGFAULT"
                                                │
                              "A palavra-chave é SEGFAULT."
```
Q1, Q2 e Q3 podem ser feitas **ao mesmo tempo**, por pessoas diferentes. Cada uma tem um **minigame opcional** (sem conhecimento prévio) que dá uma ajuda, guardada em `ajudas.txt`.

### Passo a passo
**Passo 1 — Login: senha PONTEIRO.**
A tela de login mostra 14 bytes em hexadecimal: `53 45 4E 48 41 3A 50 4F 4E 54 45 49 52 4F`. Com a **tabela ASCII** da parede: 53 = S, 45 = E, 4E = N, 48 = H, 41 = A, 3A = :, 50 = P, 4F = O, 4E = N, 54 = T, 45 = E, 49 = I, 52 = R, 4F = O → **"SENHA:PONTEIRO"**. A senha é **`PONTEIRO`**. Depois de 3 erros aparece a dica do byte em hexadecimal.

**Passo 2 — Ler as regras (`prova_final.txt`).**
- **A CHAVE** = o que a lista encadeada guarda + o que o display mostra, tudo junto, em maiúsculas.
- **O ARQUIVO** = `msg_N`, onde N é o estado do registrador (Q2 Q1 Q0, em decimal) depois de **5 pulsos**, começando em `0 0 1`.
- **O decifra.c** faz o resto (precisa consertar).

**Passo 3 — Q1: lista encadeada → MALLOC.**
O `lista.c` mostra `head = 0x2C`. O grupo acha os cartões na sala e segue os `next`:

| Endereço | Dado | next |
|---|---|---|
| 0x2C | **M** | 0x7A |
| 0x7A | **A** | 0x13 |
| 0x13 | **L** | 0x5E |
| 0x5E | **L** | 0x91 |
| 0x91 | **O** | 0x3B |
| 0x3B | **C** | NULL |

Palavra: **MALLOC**. Iscas (ninguém da lista aponta para elas): 0x68 'R', 0xA0 'E', 0x4F 'X', 0xC7 'F'.

**Passo 4 — Q2: display.exe → DEAD.**
O segmento **g** do display de 7 segmentos está queimado e o display fica "SEM SINAL". A folha de dados mostra a coluna de g para os dígitos 0 a F. O grupo monta o **mapa de Karnaugh** e digita a expressão de g com **no máximo 12 literais**. Qualquer expressão equivalente vale. Resposta mínima (11 literais):

`A'BC' + AB' + B'C + CD' + AD`

(`+` = OU, letras juntas = E, `'` = NÃO.) Mais de 12 literais: só pede para simplificar. Expressão errada: diz em quantas entradas não bate e conta como erro. Com a expressão certa, o display mostra **dEAd** → **DEAD**.

**Passo 5 — Q3: registrador → arquivo msg_6.**
Circuito na parede: `D2 = Q1`, `D1 = Q0`, `D0 = Q2 XOR Q1`. Os 3 flip-flops mudam **ao mesmo tempo**, usando os valores de antes do pulso.

| Pulso | Q2 Q1 Q0 |
|---|---|
| 0 (início) | 0 0 1 |
| 1 | 0 1 0 |
| 2 | 1 0 1 |
| 3 | 0 1 1 |
| 4 | 1 1 1 |
| 5 | **1 1 0 = 6** |

Arquivo: **msg_6**. (Os outros 7 arquivos, com a chave certa, também dizem "O KILL SWITCH E ..." com outra palavra: NULLPOINTER, STACKOVERFLOW, DEADLOCK, MEMORYLEAK, BUFFEROVERFLOW, RECURSAO, KERNELPANIC. Sem o registrador, o grupo não sabe qual é a verdadeira.)

**Passo 6 — Montar a chave: MALLOCDEAD.**
Lista + display, tudo junto: **`MALLOCDEAD`** (10 letras).

**Passo 7 — Consertar o decifra.c (5 bugs).**
Só a função `decifra()` pode ser editada. O código roda num interpretador de C de verdade.

| # | Bug | Correção |
|---|---|---|
| 1 | Falta `;` depois de `strlen(chave)` (erro de compilação na linha 8) | `int k = strlen(chave);` |
| 2 | `i <= n` passa do fim da string | `i < n` |
| 3 | `chave[i % n]` usa o tamanho errado (embaralha a mensagem) | `chave[i % k]` |
| 4 | `(c - d) % 26` fica negativo em C | `(c - d + 26) % 26` |
| 5 | Falta o `'\0'` no fim (a saída termina com lixo) | `saida[n] = '\0';` depois do `for` |

Função corrigida:
```c
void decifra(char *msg, char *chave, char *saida) {
    int n = strlen(msg);
    int k = strlen(chave);
    for (int i = 0; i < n; i++) {
        int c = msg[i] - 'A';
        int d = chave[i % k] - 'A';
        saida[i] = (c - d + 26) % 26 + 'A';
    }
    saida[n] = '\0';
}
```
Qualquer outra solução que funcione também vale. O botão **↺ Restaurar original** volta o código do começo. Erros de compilação no `decifra.c` **não** dão susto.

**Passo 8 — Executar com msg_6 e MALLOCDEAD.**
Escolher **`msg_6.txt`**, digitar a chave **`MALLOCDEAD`** e clicar em **Compilar e executar**. Saída: **`OKILLSWITCHESEGFAULT`**. O grupo precisa separar as palavras: "O KILL SWITCH É **SEGFAULT**". O J diz: "Agora digam para mim."

**Passo 9 — Falar a resposta.**
**"A palavra-chave é SEGFAULT."** → aperte **V**.

### Opcionais do Nível 3 (cada um dá a ajuda de uma questão)

| Opcional | Como vencer | Ajuda que libera |
|---|---|---|
| `radio.exe` | Ouvir o Morse rápido (som + lâmpada), decodificar com a tabela da sala e digitar a frase: **SIGA O NEXT ATE O NULL** (espaços e maiúsculas não importam; pode ouvir quantas vezes quiser) | Como ler a lista encadeada (Q1) |
| `placa.exe` | Girar as peças da placa 6×6 (clique gira, botão direito gira ao contrário) até **todas as 36** ficarem ligadas ao chip do centro, **sem pontas soltas**. A cada 50 s o J gira 2 peças | Mapa de Karnaugh de g preenchido + passos + exemplo (Q2) |
| `energia.exe` | Ligar os fios aos pinos usando o **manual escondido na sala** (cor → sinal → número do pino): **Amarelo→3, Vermelho→6, Laranja→5, Preto→2, Verde→4, Roxo→1**. Um curto desliga todos os fios e conta como erro | Como funciona o flip-flop D + os 2 primeiros pulsos (Q3) |
| `invasao.exe` | Terminal sem dicas, com rastreamento de 75 s: `help` → `scan` → `crack 192.168.6.66` → `connect 192.168.6.66` → `ls` → `decrypt chave.enc` | A lista dos 5 bugs do `decifra.c`, sem a correção pronta (Final) |
| `diario.txt` | Ler | Só história do J |
| `Lixeira` → `kill_switch.exe` | — | **Armadilha:** sempre dá susto |

### Respostas erradas comuns
- "OKILLSWITCHESEGFAULT", "KILL SWITCH": peça a palavra-chave (uma palavra só). Se insistirem, aperte **P**.
- DEADLOCK, RECURSAO, NULLPOINTER etc. (arquivo errado): aperte **P**.
- "MALLOCDEAD", "PONTEIRO", "MALLOC", "DEAD": são passos intermediários, não a palavra-chave → **P**.

---

## Depois da partida
1. No notebook: **Ctrl + Shift + L** para anotar o tempo de cada etapa (ajuda a calibrar a dificuldade).
2. No notebook: **Ctrl + Shift + X** para reiniciar.
3. No projetor: **R** duas vezes para reiniciar.
4. Recolocar os papéis da sala no lugar (cartas, cartões, bilhete, manual).
