# Nível 1 – Guia de testes (debug)

> ⚠ **SPOILER.** Este documento tem todas as respostas. É só para testadores e para o mestre do jogo, nunca deixe os jogadores verem.

Todos os valores abaixo são os atuais do `js/config.js`. Se alguém mudar o config, este guia precisa ser atualizado.

---

## 1. Como rodar

1. Abra `index.html` no **Chrome**. Não precisa de internet.
2. Clique no botão de ligar. O jogo entra em tela cheia, mostra o boot e vai direto para a área de trabalho, sem tela de login.
3. Antes de cada partida de teste, reinicie com **Ctrl + Shift + X**.

Para imprimir os papéis da sala, abra `imprimir.html` e use Ctrl + P (A4):
- **Página 1:** Manual de comandos (fase 4).
- **Página 2:** Tabela de correções (fase 4).
- **Página 3:** Chave de recuperação (fase 5). Esta página sai em paisagem e deve ser rasgada nas linhas tracejadas.

---

## 2. Resumo rápido (cola do mestre do jogo)

| Fase | O que fazer | Resposta |
|---|---|---|
| 1. Administrador | Criar usuário com nível Administrador | Senha **`KRAMER`** (maiúscula ou minúscula, tanto faz) |
| 2. Hacker | Excluir o hacker no gerenciador | Usuário **`t.hoffman`** |
| 3. BIOS | Completar os 6 labirintos | – |
| 4. cmd | `Y`, depois 6 comandos sorteados | Veja a tabela da seção 4 |
| 5. Ransomware | Digitar a chave de recuperação | **`K7RX-M3Q9-ZT4H-W8PL-6NFD`** |
| Caixa | Código do cadeado | **`0000`** (provisório) |

---

## 3. Atalhos do mestre do jogo

| Atalho | O que faz |
|---|---|
| **Ctrl + Shift + X** | Reinicia tudo (recarrega a página, e o progresso é perdido) |
| **Ctrl + Shift + S** | Pula o labirinto atual (fase 3), completa a correção atual (fase 4) ou preenche a chave (fase 5) |
| **Ctrl + Shift + H** | Dispara a interferência do hacker (para testar) |
| **Ctrl + Shift + L** | Mostra o tempo de cada fase e o total. Fica salvo no navegador mesmo depois de reiniciar |

Não use Ctrl + Shift + N, T ou W: o Chrome reserva esses atalhos (janela anônima, reabrir aba, fechar janela).

---

## 4. Fluxo completo, fase por fase

### Fase 1 – Acesso de administrador
1. Qualquer ícone que o jogador tentar abrir mostra **"Acesso negado"** e exige ADMINISTRADOR.
2. Depois do OK, aparece o ícone **cadastro_adm**.
3. Para criar o usuário:
   - O nome precisa ter pelo menos 3 letras e não pode repetir um nome da lista do gerenciador.
   - Os níveis são Espectador, Editor ou Administrador.
   - **Administrador** pede a senha **`KRAMER`**. Senha errada mostra "Senha de permissão incorreta" e deixa tentar de novo.
   - Com Espectador ou Editor, o jogo segue normalmente, e a senha é cobrada depois, na fase 2.
4. Ao criar o usuário, aparece **DICA 1**, e o ícone **dicas.txt** surge na área de trabalho.
5. Na sala, a senha é achada em **2 etapas**: uma pista física leva à outra.

### Fase 2 – Remover o hacker (cronômetro de 5 min)
1. Aparece o **ALERTA DE SEGURANÇA**, e surgem os ícones **gerenciador_usuarios** e **log_seguranca.txt**.
2. O cronômetro começa na barra de tarefas ("Exclusão do seu usuário em 05:00").
3. Se o usuário não for administrador:
   - Ao abrir o gerenciador, o jogo pergunta "Você quer se tornar administrador?".
   - O botão **"Não" não funciona**, só treme. O **"Sim"** pede a senha `KRAMER`.
4. **Pista:** o `log_seguranca.txt` mostra um login **REMOTO**, **hoje às 23:59**, com nível **ADMINISTRADOR**, mas com o nome apagado.
5. Na lista de 40 usuários, só **`t.hoffman`** (Administrador, hoje 23:59) bate com tudo. As iscas são:

| Usuário | Por que não é ele |
|---|---|
| h.costa | Hoje 23:59, mas é **Editor**, e o log mostra login **local** |
| s.freitas | Hoje 23:59, mas é **Espectador**, e o log mostra login **local** |
| d.rocha | Administrador, mas entrou às **23:58** |
| j.farias | Administrador às 23:59, mas **ontem** |
| i.ribeiro | Administrador, mas entrou às **23:41** |

6. Regras e pegadinhas:
   - **Excluir um inocente** tira **30 segundos** do cronômetro. O relógio pisca e aparece a notificação "era inocente!".
   - **O próprio usuário do jogador** aparece numa posição aleatória da lista. Se o jogador tentar excluí-lo, o jogo pergunta "Você quer mesmo apagar você próprio?". Se ele confirmar, o usuário é apagado e precisa ser criado de novo no cadastro_adm.
   - **Se o tempo acabar**, o hacker exclui o usuário do jogador. Ele cria de novo e o cronômetro recomeça com 5 min. Os inocentes já excluídos continuam excluídos.
7. Ao excluir o `t.hoffman`, aparecem em sequência: **"Ameaça eliminada"**, **DICA 2** e **"FALHA CRÍTICA NA BIOS"**. Por fim, surge o ícone **bios_setup**.

### Fase 3 – BIOS / labirintos
1. O jogo pergunta "Podemos iniciar?". O "Não" não funciona.
2. São 6 labirintos em sequência: CPU, RAM, GPU, SSD, PSU e FAN.
3. O ponto anda sozinho, e o jogador muda a direção com **WASD ou as setas**. É preciso levar o ponto até o ponto colorido.
4. Bater na parede conta um erro e faz o ponto voltar ao início do **labirinto atual**.
5. A **interferência do hacker** acontece **uma única vez**: janelas de erro se sobrepõem, a tela fica preta e vem o jump scare com grito. Ela dispara no que vier primeiro:
   - 5 min jogando;
   - 30 erros somados;
   - o fim do último labirinto (nesse caso, é garantida).
6. Depois da interferência, se ainda houver labirinto, o jogo pergunta "Podemos continuar?".
7. Ao terminar, aparecem **"BIOS reparada"**, **DICA 3** e **"CONFIGURAÇÃO PERDIDA"**. Por fim, surge o ícone **cmd.exe**.

### Fase 4 – Reconfiguração pelo cmd (trabalho em grupo)
1. O cmd pergunta **"Iniciar reconfiguração? (Y/N)"**. O easter egg do **N** funciona assim:
   - **1º N:** jump scare (tela preta e grito).
   - **2º N:** máscara neutra com a frase "Você é burro? Apertou N de novo?", sem grito.
   - **Do 3º N em diante:** só a mensagem "Aperte Y logo.".
   - A contagem vale para a partida toda, mesmo se o cmd for fechado.
2. Ao digitar **Y** (ou S), o jogo sorteia **6** das 12 correções e mostra uma por vez.
3. Para descobrir cada comando, o grupo cruza a tabela de correções (correção → número) com o manual de comandos (número → comando):

| Correção na tela | Nº (Tabela de correções) | Comando (Manual de comandos) |
|---|---|---|
| Formatar Windows | 1 | `fw` |
| Atualizar registro do sistema | 2 | `arg` |
| Ativar antivírus | 3 | `atv` |
| Recriar ícones | 4 | `ric` |
| Recuperar arquivos do usuário | 6 | `rau` |
| Restaurar área de trabalho | 7 | `rad` |
| Montar disco C: | 8 | `mdc` |
| Configurar data e hora | 9 | `cdh` |
| Restaurar papel de parede | 11 | `rpp` |
| Reinstalar drivers de vídeo | 12 | `rdv` |
| Reiniciar serviços do sistema | 14 | `rss` |
| Reconectar à rede | 15 | `rcn` |

4. O manual também traz **comandos falsos**, que nunca são a resposta: `wf` (5), `dar` (10), `rvd` (13), `ncr` (16), `tva` (17) e `pps` (18).
5. Regras:
   - **Comando certo:** aparece uma barra de progresso, depois "OK", e o jogo vai para a próxima correção.
   - **Comando que existe, mas é o errado** (incluindo os falsos): a reconfiguração **recomeça do zero**, com um novo sorteio.
   - **Comando que não existe** (por exemplo, erro de digitação): só aparece "não é reconhecido", sem penalidade.
   - **`help`:** o cmd responde para procurar o manual. `cls` limpa a tela.
   - Maiúsculas e minúsculas tanto faz. Não há cronômetro.
6. Ao terminar, aparece **DICA 4**.

### Fase 5 – Ransomware (final, cronômetro de 8 min)
1. Primeiro vem um reinício falso: "Reiniciando..." e depois "✔ Sistema restaurado. Bem-vindo de volta."
2. Em seguida, a tela vermelha **"SEUS ARQUIVOS FORAM SEQUESTRADOS"**.
3. A chave de recuperação, rasgada em **5 pedaços** escondidos na sala, é:

   **`K7RX` – `M3Q9` – `ZT4H` – `W8PL` – `6NFD`**

   - São 5 caixas de 4 caracteres, e o cursor pula sozinho para a próxima.
   - Maiúsculas e minúsculas tanto faz.
   - As linhas desenhadas no papel atravessam os pedaços e ajudam a montar a ordem.
4. Regras:
   - **Chave errada ou fora de ordem:** aparece só uma provocação, sem penalidade.
   - **Se o tempo acabar:** vem o jump scare e o cronômetro recomeça com 8 min.
5. Com a chave certa, aparece a **tela final**. Ela mostra:
   - o **código do cadeado: `0000`** (provisório);
   - as 4 dicas, mais a observação "DICA 5: está dentro da caixa";
   - o recado: "digam a resposta final em voz alta. Eu estou ouvindo."

   Essa tela fica até alguém apertar Ctrl + Shift + X.

### Final
O grupo abre a caixa com o cadeado e encontra a **5ª dica**, que é física. Com as 5 dicas, os jogadores falam a **resposta final** para o mestre do jogo, que na história é o hacker.

---

## 5. Pular para uma fase (console do navegador)

Abra o console com **F12**, aba Console. A primeira linha serve para tudo; as outras são alternativas, conforme a fase desejada.

```js
CONFIG.bootSpeed = 20          // boot rápido (rodar ANTES de ligar o computador)
window.GATE = null; OS.showIcon('bios')                                  // ir para a fase 3
MazeState.onDone()                                                       // fim da fase 3 (avisos + DICA 3)
window.GATE = null; OS.showIcon('reconfig'); OS.openApp('reconfig')      // ir para a fase 4
Ransom.start()                                                           // ir para a fase 5
```

Ao pular fases pelo console, a numeração das dicas e o tempo por fase ficam incompletos. Para testar o tempo real, jogue do começo.

---

## 6. Onde mudar cada coisa (`js/config.js`)

| O quê | Campo |
|---|---|
| Senha de administrador | `adminPassword` |
| Tempo para excluir o hacker / penalidade | `hackerMinutes` / `wrongDeletePenalty` |
| Lista de usuários e quem é o hacker | `users` (`hacker: true`) |
| Texto do log de segurança | `securityLog` |
| Textos das 4 dicas | `hints` |
| Labirintos (tamanho, velocidade) e interferência | `maze` |
| Correções, comandos e comandos falsos da fase 4 | `reconfig` (depois, **imprima os papéis de novo**) |
| Chave, tempo e código do cadeado da fase 5 | `ransom` (mudou a chave? **imprima a página 3 de novo**) |
| Sons, imagem do susto e da máscara, volume | `sounds`, `scareImage`, `mockImage`, `scareVolume` |

---

## 7. O que observar nos testes

- **Tempo:** no fim de cada partida, aperte **Ctrl + Shift + L** e anote os tempos. A meta do Nível 1 é **pelo menos 20 min**.
- **Fase 2:** os jogadores leem o log ou saem apagando na sorte? A penalidade de 30 s está justa?
- **Fase 3:** algum labirinto está difícil ou fácil demais? Os ajustes ficam em `maze.levels` (`speed`, `w`, `cols`, `rows`).
- **Fase 4:** o grupo se divide entre os dois papéis? Quantas vezes recomeça por causa dos comandos falsos?
- **Fase 5:** quanto tempo levam para achar os 5 pedaços? Conseguem montar a ordem?
- Anote também textos confusos, travamentos ou qualquer coisa que tenha exigido Ctrl + Shift + X.

## 8. Ainda provisório

- Textos das dicas 1 a 4 ("DICA n (a definir)") e a resposta final.
- Código do cadeado (`0000`) e o tipo de cadeado.
- Sons: todos ainda vazios. O grito do susto é gerado pelo navegador.
- Nomes `KRAMER` e `t.hoffman`, que podem mudar.
