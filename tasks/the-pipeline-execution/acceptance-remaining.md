# Aceite das 14 issues

O critério, e não o número de PRs, determina conclusão. Nenhum teste físico é inferido de emulação.

| Issue | Evidência entregue | Falta para concluir |
| --- | --- | --- |
| #5 | Configuração única consumida por QR/vCard/canonical; overlay .dev | DNS/Pages/CNAME/HTTPS do endereço final, não comprovados. |
| #6 | Monograma, ausência de números/cargo atual não confirmados; fontes dos marcos | Data/horário da Xconf e confirmação editorial do proprietário. |
| #7 | Jekyll, 16 rotas, pares PT/EN, metadata e fontes OFL locais; testes de rotas e axe | Critérios técnicos atendidos na master. |
| #8 | Card PT/EN, três destaques, contato sem JS e scripts próprios; testes de viewport/texto ampliado | Critérios técnicos atendidos na master. |
| #9 | vCard CRLF, QR decodificado, share, palco e OG gerados/testados | Importar contato em iOS/Android, scan em dois aparelhos, projeção e preview real em mensageiro. |
| #10 | Seis estudos com problema/papel/decisões/trade-offs/resultados documentados, fontes e arquivo completo | Revisão do PR de fechamento e confirmação de atribuição editorial pelo autor. |
| #11 | Lockfiles, checks de PR, deploy master, orçamento JS e permissões mínimas | Critérios técnicos atendidos na master. |
| #12 | Inventário documentado: 34 URLs HTML antigas presentes; CI repete comparação | Revisão/merge do inventário e validação dos links no endereço final. |
| #13 | Teclado, axe, redução de movimento, FPS, DPR e JS ~55 KB verificados | LCP mobile 4G e uso real de VoiceOver/TalkBack. |
| #14 | Hero sem JS, import dinâmico, refração e ASCII/monograma | Retrato aprovado e QA da foto final. |
| #15 | Pan com grade alternativa, filtros, links estáticos, íris cancelável por Escape | Merge do cancelamento e teste de regressão novo. |
| #16 | Cinco competências, terminal, contato, SHA/data reais e comparação de foto por botão quando aprovada | Aprovação da foto e revisão final PT/EN. |
| #17 | Spring da arte, partículas ASCII e giroscópio opcionais não bloqueiam contato; clique durante pan testado | Registro dos itens adiados abaixo e revisão/merge. |
| #18 | CI, testes, inventário, rollback descrito e relatório por efeito | Domínio/QR definitivo e execução física dos testes abaixo. |

## Efeitos entregues e adiados — #17

| Efeito | Situação / motivo |
| --- | --- |
| Pêndulo/spring da arte | Implementado; interação decorativa separada dos links. |
| Partículas ASCII | Dispersão determinística implementada no monograma; retrato aguarda aprovação. |
| ASCII em vídeo | Adiado: não há vídeo aprovado e é um corte explícito de prioridade por performance. |
| Giroscópio | Implementado sob gesto e permissão; funcionamento físico ainda não comprovado. |
| Modo claro | Opcional e adiado para preservar o escopo de lançamento da Xconf. |
| NFC | Opcional e adiado até domínio final e tag física estarem disponíveis. |

## Roteiro de aceite físico

Registrar aparelho, sistema/browser, data, resultado e evidência para cada execução:
1. iPhone Safari e Android Chrome: abrir home/card PT e EN e navegar usando leitor de tela.
2. Importar vCard e conferir nome, e-mail e URL; testar compartilhar/cancelar/copiar.
3. Escanear QR com dois aparelhos a partir de outra tela, verificando domínio e HTTPS.
4. Projetar /card?stage=1, testar leitura do QR, legibilidade e saída.
5. Medir LCP com rede 4G documentando aparelho, configuração, build e resultado.
6. Conferir URLs históricas no domínio final e ensaiar rollback.

## Dados necessários do proprietário

Data/horário da Xconf; aprovação do retrato assets/perfil_site.png ou outra foto; confirmação de cargo atual e tempo de experiência se quiser publicá-los; situação da compra e DNS de viniciuscarvalho.dev. Sem confirmação, números e cargo atual permanecem omitidos.

## Rollback

Baseline anterior ao redesign: 9925b3685070c14440c94c154dc4826bc08127aa.
Reverter os merges do redesign em ordem inversa com commits de reversão, revisar o diff e executar o workflow master; não resetar/forçar a branch compartilhada. Reverter domínio/DNS é uma operação separada, somente se tiver sido alterada no lançamento.
