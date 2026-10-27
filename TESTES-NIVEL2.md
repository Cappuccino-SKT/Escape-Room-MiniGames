# Nível 2 – "O Cúmplice" – Guia de testes e do mestre do jogo

> ⚠ **SPOILER.** Este documento tem todas as respostas. É só para testadores e para o mestre do jogo, nunca deixe os jogadores verem.

Todos os valores abaixo vêm de `js/level2-data.js`. Se alguém mudar esse arquivo, este guia precisa ser atualizado.

---

## 1. Montagem

| O quê | Onde | Como |
|---|---|---|
| Jogo | Notebook da sala | Abrir **`index.html?nivel=2`** no Chrome |
| Projetor | PC do mestre do jogo, ligado ao projetor | Abrir **`projetor.html`** e apertar **F** (tela cheia) |
| Papéis | Sala | Imprimir **`imprimir-nivel2.html`** (Ctrl + P, A4) |

O que fazer com cada papel:
- **Página 1, cartas da senha (T-R-A-I-C-A-O):** recortar as 7 cartas e esconder cada uma num ponto diferente da sala.
- **Página 2, lista de monitores:** colar na parede.
- **Página 3, livro de chaves:** deixar numa pasta ou sobre uma mesa.
- **Página 4, bilhete de ônibus:** recortar e esconder, por exemplo numa mochila ou num casaco.

O `projetor.html` aceita ajustes pelo endereço: `projetor.html?min=30&punicao=5&dicas=5`.

---

## 2. Resposta e cola rápida

**Resposta final: ELISA (Elisa Prado).** O grupo fala o nome para o mestre do jogo pela câmera.

| Etapa | Resposta |
|---|---|
| Senha do notebook | **`TRAICAO`** (sem cedilha nem til; maiúscula ou minúscula, tanto faz) |
| fechadura.exe | G1 = **AND**, G2 = **OR**; depois, A = **1** e B = **1** |
| Senha do chat_monitores | **`MNTRA9`** (saída do limpeza.c) |
| Senha do email_bruno | **`bit2024`** |
| cameras.exe | O horário-chave é **23:03**. Também têm gravação: 22:00, 22:50, 22:58 e 23:09 |
| rede.exe | **`3C:7A:1F:09:A4:5E`** é o celular da Elisa. Também existem `…:11:02` (Bruno) e `…:1B:C8` (Diego) |
| terminal.exe | `dir /a`, depois `cd .backup` e `type rascunho.txt` |

---

## 3. A lógica do caso

**Regra do J:** o cúmplice **mente**; os inocentes dizem a **verdade**. O vírus foi instalado no N112 entre 23:00 e 23:10.

1. **Fechadura:** o circuito é `PORTA = (A AND B) OR C`. O registro reconstruído das 23:03 mostra **C = 0** (a chave física não foi usada) e a porta **aberta**. Logo, **A = 1 e B = 1**: quem entrou tinha **crachá de monitor** e sabia a **senha da porta**.
2. **Lista de monitores (sala):** dos 5 suspeitos, têm crachá **Bruno, Elisa e Rafael**. Carla e Diego estão fora.
3. **Chat:** a senha nova da porta foi enviada às **21:00**, e o **Rafael saiu do grupo às 20:15**. Ele não sabe a senha e está fora.
4. **Bruno × Elisa:**
   - Rafael, que é inocente e por isso fala a verdade, diz que às 23h o Bruno estava no ônibus com ele. O bilhete das 22:58 confirma, e as câmeras e o e-mail também, para quem jogou os opcionais. **O Bruno está fora.**
   - A Elisa diz que foi embora antes das 23h e que o Bruno voltou ao laboratório. As duas coisas são falsas, então **ela mente: é a cúmplice.**

Todos os outros depoimentos batem com a Elisa como culpada: o Diego viu "alguém com crachá de monitor", e a Carla devolveu a chave às 22h, como mostra o livro de chaves.

---

## 4. O jogo, app por app

O notebook abre pedindo senha. Depois de 3 erros, aparece o botão de dica: "As letras estão espalhadas pela sala. Os números dizem a ordem." Ao entrar, o `caso.txt` abre sozinho.

### Trilha principal
| App | O que tem | Erro |
|---|---|---|
| `caso.txt` | Regras do J | – |
| `suspeitos` | Fichas: curso, ano de ingresso e observações | – |
| `depoimentos` | O que cada suspeito disse | – |
| `fechadura.exe` | O grupo escolhe as portas G1 e G2 olhando o registro do dia e depois confirma A e B das 23:03 | Reparo errado ou A/B errados: **jump scare** |
| `limpeza.c` | O código em C. "Compilar e executar" só mostra "compilador corrompido" | – |
| `chat_monitores` | Trancado com a senha `MNTRA9`. Mostra a saída do Rafael (20:15) e a senha nova (21:00) | Cada senha errada: **jump scare** |

**Como sai `MNTRA9`:** o `for` percorre "MONITORIA" e o `if (i % 2 == 0)` imprime as letras nas posições pares: 0 = M, 2 = N, 4 = T, 6 = R e 8 = A. Quando o laço termina, `i` vale 9, e o programa imprime o 9.

**Como deduzir as portas pelo registro:**
- As linhas com C = 0 mostram que G1(1,1) = 1, G1(1,0) = 0 e G1(0,1) = 0. Logo, **G1 é AND**.
- A linha das 19:20 (A = 1, B = 1, C = 1, porta aberta) separa OR de XOR, porque 1 XOR 1 daria 0. Logo, **G2 é OR**.

### Opcionais (pistas extras, nenhum é obrigatório)
| App | Como resolver | Pista extra | Erro |
|---|---|---|---|
| `terminal.exe` | `help`, `dir /a` (mostra a pasta oculta `.backup`) e `type rascunho.txt` | "Ninguém desconfia de uma **monitora**." Das 3 pessoas que têm crachá, a única mulher é a Elisa | `jigsaw.exe` (em Downloads) ou `del`: **jump scare** |
| `terminal.exe` | `cd Usuarios\bruno`, depois `type lembrete.txt` | Como montar a senha do e-mail (gato + ano de ingresso) | – |
| `cameras.exe` | Digitar um horário HH:MM tirado de outras pistas | 23:03: pessoa com crachá e **tubo de projeto**. A ficha da Elisa diz que ela é de Arquitetura e anda com tubo | Horário sem gravação: **jump scare** |
| `email_bruno` | Senha `bit2024`: o gato Bit, da ficha e do terminal, mais o ingresso em 2024, da ficha | Recibo do ônibus das 22:58 com o Rafael, que confirma o álibi do Bruno. Também tem um e-mail suspeito da Elisa | As 2 primeiras senhas erradas só avisam. **Da 3ª em diante: jump scare** |
| `rede.exe` | O log mostra os 2 últimos blocos em **decimal**; é preciso converter para **hexadecimal**: 164 = A4 e 94 = 5E | O celular da Elisa conectou às **23:02** e desconectou às 23:09 | MAC em hexadecimal que não existe: **jump scare**. Formato errado, como "164", só avisa |

---

## 5. Mestre do jogo: projetor e acusação

| Tecla (`projetor.html`) | O que faz |
|---|---|
| **Espaço** | Inicia ou pausa o cronômetro (30:00) |
| **P** | **Acusação errada:** jump scare no projetor, perde 5 min e mostra "Mais uma chance" |
| **V** | **Acusação certa:** tela de vitória ("Meu cúmplice era Elisa Prado") |
| **D / Shift + D** | +1 / −1 dica usada (o contador aparece na parede) |
| **↑ / ↓** | +1 / −1 minuto |
| **R** (2 vezes seguidas) | Reinicia tudo |
| **F / H** | Tela cheia / esconde o painel de teclas |

**Na acusação:** se o grupo falar um nome errado, aperte **P**. Se acertar, aperte **V**. Se o tempo acabar, o projetor mostra o susto e "TEMPO ESGOTADO" sozinho.

**Atalhos no notebook:** **Ctrl + Shift + X** reinicia o jogo; **Ctrl + Shift + L** mostra o tempo de cada etapa (entrada, fechadura, chat e opcionais).

---

## 6. Dicas prontas (1 por jogador, pedidas pela câmera)

Comece pela dica mais leve. Aperte **D** no projetor a cada dica dada.

| Onde o grupo travou | Dica leve | Dica direta |
|---|---|---|
| Senha do notebook | "Cada letra tem um número. Procurem em todo canto da sala." | "São 7 letras. Juntem na ordem dos números." |
| Não sabe por onde começar | "Quem consegue abrir a porta do laboratório depois das 23h?" | "Abram a fechadura.exe. O registro do dia conta como a porta funciona." |
| fechadura.exe | "Olhem só as linhas em que C = 0. Quando a porta abriu?" | "G1 só dá 1 quando A e B são 1. E basta C = 1 para abrir." |
| limpeza.c | "Escrevam o índice de cada letra de MONITORIA, começando no 0." | "Só as posições pares são impressas. E depois o valor final de i." |
| Lista de monitores | "Quem tem crachá? Isso está escrito em algum lugar da sala." | "Procurem a lista de monitores na parede." |
| Rafael | "O Rafael sabia a senha nova da porta?" | "Vejam no chat quando ele saiu e quando a senha foi enviada." |
| Bruno × Elisa | "Lembrem a regra: um inocente nunca mente." | "Se o Rafael fala a verdade, onde estava o Bruno às 23h?" |
| rede.exe | "Esses números não estão em hexadecimal." | "Convertam 164 e 94 para hexadecimal." |
| email_bruno | "O Bruno deixou um lembrete no computador." | "terminal: cd Usuarios\bruno, depois type lembrete.txt. O ano está na ficha." |

---

## 7. Pular etapas (console do navegador, F12)

```js
CONFIG.bootSpeed = 20      // boot rápido (antes de ligar)
OS.openApp('fechadura')    // abrir qualquer app pelo id: caso, suspeitos, depoimentos, fechadura,
                           // limpeza, chat, terminal, cameras, email, rede, lixeira
```

---

## 8. O que observar nos testes

- **Todo mundo participa?** Quem fica parado? A divisão entre computador, sala e mesa acontece naturalmente?
- **Tempo:** a meta é terminar perto dos 30 min. Use o Ctrl + Shift + L no notebook e anote o tempo do projetor.
- **Dificuldade:** onde o grupo mais pede dica? A dedução final (Bruno × Elisa) fica clara?
- **Opcionais:** o grupo tenta os minijogos opcionais? Eles atrapalham por gastar tempo ou ajudam?
- **Sustos:** são sustos demais? O mais fácil de cair em sequência é o do cameras.exe, se o grupo começar a chutar horários.

## 9. Ainda provisório

- Nomes dos suspeitos e a sala **N112**: a sala real do evento ainda não foi decidida. Se mudar, substitua todos os "N112" em `js/level2-data.js` e reimprima os papéis.
- Sons: todos ainda vazios. O grito do susto é gerado pelo navegador.
