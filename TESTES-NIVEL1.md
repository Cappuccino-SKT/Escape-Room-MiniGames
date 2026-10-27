# Nível 1 – "As Notas" – Guia de testes e do mestre do jogo

> ⚠ **SPOILER.** Este documento tem todas as respostas. É só para testadores e para o mestre do jogo, nunca deixe os jogadores verem.

Todos os valores abaixo vêm de `js/level1-data.js`. Se alguém mudar esse arquivo, este guia precisa ser atualizado.

> **Professor real:** só o **nome** (Prof. Muriel Godoi) é real; a filha, o filho, a sobrinha, a formatura, o número da sorte, as fotos e os e-mails são **inventados**. **O professor ainda não autorizou o uso do nome.** Se ele não autorizar, troque `professor` em `js/level1-data.js` e reimprima os papéis.

---

## 1. Montagem

| O quê | Onde | Como |
|---|---|---|
| Jogo | Notebook da sala | Abrir `index.html` no Chrome e escolher **Nível 1** (ou Ctrl + Shift + 1) |
| Projetor | PC do mestre do jogo, ligado ao projetor | Abrir `projetor.html`, escolher **Nível 1** e apertar **F** (tela cheia) |
| Papéis | Sala | Imprimir **`imprimir-nivel1.html`** (Ctrl + P, A4) |

O que fazer com cada papel:
- **Página 1, desenhos das crianças:** recortar os 3 desenhos (Alice, Pedro e Sofia) e colar na parede, como um mural.
- **Página 2, diploma:** **rasgar o canto do ano** antes de colocar na sala. Pode ir numa moldura ou ser colado na parede.
- **Página 3, post-it "111":** recortar e colar no monitor ou na mesa.
- **Página 4, tabela binária:** colar na parede, como material de aula.

---

## 2. Resposta e cola rápida

**Resposta final: `ALICE19987`.** O grupo fala a senha para o mestre do jogo pela câmera. Maiúscula ou minúscula, tanto faz.

| Peça | Resposta | De onde vem |
|---|---|---|
| Nome da filha | **ALICE** | Desenhos na sala + e-mail da escola ("sua filha, da turma 3B") + lista da turma 3B (anexo do e-mail) |
| Ano da formatura | **1998** | Diploma na sala ("curso de 4 anos") + `formatura.c` (1994 + 4) |
| Número da sorte | **7** | Post-it "111" na sala + tabela binária ou `aula_binario.pptx` |

A ordem das peças está na dica do professor, que aparece no Sistema de Notas ao clicar em "Esqueci a senha": *"O nome da minha filha + o ano em que me formei + o meu número da sorte."*

---

## 3. A lógica do caso

1. **O objetivo é claro desde o começo:** o `LEIA-ME.txt` (o J) diz que a senha do Sistema de Notas foi trocada, e o "Esqueci a senha" mostra a fórmula. O grupo pode se dividir em 3, um para cada peça.
2. **Filha:** há 3 desenhos na parede, de Alice, Pedro e Sofia.
   - O e-mail da escola fala da "sua **filha**, da turma **3B**", e o anexo `lista_turma_3B.txt` tem a **Alice** (e não a Sofia).
   - O Pedro é o filho: outro e-mail fala do "seu **filho**, da turma 5A", e ele aparece no desenho da Alice e no histórico do navegador.
   - O desenho da Sofia diz "Para o **tio**": ela é sobrinha.
3. **Ano:** o diploma está com o ano rasgado, mas diz "curso de **4** anos". O `formatura.c` tem `ingresso = 1994` e uma **lacuna** na duração; preenchendo com 4 e clicando em "Compilar e executar", o programa imprime "Me formei em **1998**".
4. **Número da sorte:** o post-it diz "111 — meu número da sorte, em binário". A tabela na parede (ou os slides da `aula_binario`) mostra que **111 = 4 + 2 + 1 = 7**.

---

## 4. O jogo, app por app

O jogo começa direto na área de trabalho, sem senha, e o `LEIA-ME.txt` abre sozinho.

### Trilha principal
| App | O que tem |
|---|---|
| `LEIA-ME.txt` | Recado do J: as notas serão zeradas; digam a senha para mim |
| `Sistema de Notas` | Notas borradas e o cadeado "BLOQUEADO PELO J". **"Esqueci a senha"** mostra a fórmula. O campo de senha não aceita nada: digitar qualquer coisa conta como **erro** e mostra "a senha só vale se for dita para mim" |
| `E-mail` | E-mail da escola (filha, turma 3B) com o anexo **lista_turma_3B.txt**; e-mail sobre o filho (turma 5A); e-mail do J ("sua senha foi alterada") |
| `Fotos` | `familia.jpg` (pai, menina e menino, sem nomes), `gato.jpg` e `formatura.jpg` (**corrompida** até o grupo completar o `memoria.exe`) |
| `formatura.c` | Programa em C com a lacuna `duracao = ___`. Com 4, imprime 1998. Com outro número, imprime outro ano. Com texto, dá erro de compilação |
| `aula_binario.pptx` | 3 slides sobre binário. O último diz que o número da sorte está colado no monitor |

### Opcionais (pistas extras, nenhum é obrigatório)
| App | Como resolver | Pista extra |
|---|---|---|
| `anotacoes.docx` | Parece vazio. **Ctrl + A** (ou arrastar o mouse) revela o texto em branco | Confirma a ordem: nome dela, depois o ano, depois o número da sorte, tudo junto |
| `memoria.exe` | Jogo da memória: ligar cada ícone ao nome (CPU, RAM, SSD, Mouse, Teclado, GPU) | Recupera a `formatura.jpg`, com a faixa "FORMANDOS ENG. COMPUTAÇÃO **1998**". É um atalho para a peça 2 |
| `Navegador` | Só ler o histórico | "presente para menina de 8 anos", "turma 3B", "como explicar binário", "feira de ciências do Pedro" |
| `Lixeira` | `senha_antiga.txt` | Isca: "pedro2020 (não serve mais)" |
| `Lixeira` | `NAO_ABRA.exe` | **Armadilha:** dá jump scare sempre |

**O que acontece num erro:** o jogo **nem sempre** dá jump scare (`scareRules` no `js/config.js`).
- O 1º erro da partida nunca vira susto.
- Depois de qualquer susto, há 90 s de descanso.
- Passado o descanso, cada erro aumenta a chance: 30%, 60%, 90% e 100%.
- Nos erros sem susto aparece um efeito leve: a tela falha, um sussurro ou um clarão vermelho.

No Nível 1, o erro mais comum é tentar digitar a senha no Sistema de Notas.

---

## 5. Mestre do jogo: projetor e resposta

| Tecla (`projetor.html`, Nível 1) | O que faz |
|---|---|
| **Espaço** | Inicia ou pausa o cronômetro ("NOTAS ZERADAS EM 30:00") |
| **P** | **Senha errada:** toca a **cena do susto final** (cerca de 20 s, veja abaixo), depois tira **2 min** e mostra "Tentem de novo" |
| **V** | **Senha certa:** "CORRETO. A senha era ALICE19987. As notas foram salvas... por enquanto." |
| **D / Shift + D** | +1 / −1 dica usada (o contador aparece na parede) |
| **↑ / ↓** | +1 / −1 minuto |
| **R** (2 vezes seguidas) | Reinicia tudo |
| **F / H** | Tela cheia / esconde o painel de teclas |
| **Ctrl + Shift + 1/2** | Troca de nível |

**A cena do susto final (tecla P)** é toda feita em HTML/CSS, com som gerado pelo navegador (`js/final-scare.js`):
1. "PARABÉNS," e, alguns segundos depois, "VOCÊ ERROU.", com a tela em luz vermelha.
2. Corte seco para o preto.
3. Um cmd roda código, com som ambiente calmo.
4. O código trava, vem a chuva de erros e o som e o alarme ficam mais intensos.
5. Os erros correm para as bordas e formam um anel com o centro vazio.
6. Dois olhos vermelhos abrem, depois aparece a boca brava, que vira um sorriso sinistro.
7. A máscara pula para fora do projetor com um grito, e a tela fica preta.

Aperte **H** antes de começar a partida para esconder o painel de teclas: senão ele aparece por trás da mensagem.

Se o tempo acabar, o projetor mostra o susto e "TEMPO ESGOTADO — as notas de vocês foram ZERADAS" sozinho. Esse é o momento da mensagem falsa de reprovação, se a equipe usar.

**Atalhos no notebook:**
- **Ctrl + Shift + X:** reinicia o jogo, no mesmo nível.
- **Ctrl + Shift + L:** mostra o tempo de cada pista encontrada.
- **Ctrl + Shift + H:** dispara a interferência do hacker (janelas de erro e susto), quando o mestre do jogo quiser assustar.

---

## 6. Dicas prontas (1 por jogador, pedidas pela câmera)

Comece pela dica mais leve. Aperte **D** no projetor a cada dica dada.

| Onde o grupo travou | Dica leve | Dica direta |
|---|---|---|
| Não sabe por onde começar | "Todo sistema tem um botão para quem esquece a senha." | "Abram o Sistema de Notas e cliquem em 'Esqueci a senha'." |
| Nome da filha | "O professor tem mais de uma criança na vida dele." | "A escola mandou um e-mail sobre a filha. Abram o anexo." |
| Alice × Sofia | "Leiam com atenção para quem cada desenho foi feito." | "A Sofia chama o professor de 'tio'." |
| Ano da formatura | "O diploma está rasgado, mas ainda diz quanto tempo durou o curso." | "Coloquem a duração do curso na lacuna do formatura.c e executem." |
| Número da sorte | "Tem um recado colado perto do computador." | "111 em binário: cada posição vale 4, 2 e 1." |
| Ordem da senha | "A dica do professor já está na ordem certa." | "Nome + ano + número, tudo junto." |

---

## 7. Pular etapas (console do navegador, F12)

```js
CONFIG.bootSpeed = 20      // boot rápido (antes de ligar)
OS.openApp('notas')        // abrir qualquer app pelo id: leia, notas, email, fotos, formatura, aula,
                           // anotacoes, memoria, navegador, lixeira
```

---

## 8. O que observar nos testes

- **Tempo:** a meta é perto de 30 min (no mínimo 20). Use o Ctrl + Shift + L no notebook e anote o tempo do projetor.
- **Todo mundo participa?** O grupo se divide nas 3 peças?
- **Dificuldade:** em que peça o grupo mais trava? A ligação entre o diploma e o `formatura.c` fica clara?
- **Opcionais:** o grupo encontra o truque do Ctrl + A? Joga a memória?

## 9. Ainda provisório

- **Autorização do professor** para usar o nome.
- **Vídeos dos sustos:** ainda não existem (veja `videos/LEIA-ME.txt` e `scareMedia` no config).
- **Sons:** todos ainda vazios.
- **O Nível 1 antigo** (admin, hacker, labirinto, cmd e ransomware) foi removido. Ele está guardado no git, na tag **`nivel1-antigo`**.
