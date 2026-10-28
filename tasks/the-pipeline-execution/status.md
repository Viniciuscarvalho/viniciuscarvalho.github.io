# Execução — The Pipeline

Atualização: 28/10/2026. Primeira entrega de implementação; não é declaração
de conclusão das 14 issues. Nenhuma issue deve ser fechada automaticamente
por este PR. Site público e DNS não foram alterados.

## Estado das issues

| Issue | Entrega nesta branch | Pendência |
| --- | --- | --- |
| #5 | URL de fallback github.io e overlay do .dev preparados | Compra, DNS, Pages, CNAME e HTTPS finais. |
| #6 | Monograma explícito, sem anos/cargo empresarial ou métricas não confirmados | Revisão de claims, retrato e data do evento. |
| #7 | Layouts Liquid, dados JSON, seis pares de estudos PT/EN, fontes locais OFL e metadados | Revisão editorial e visual final. |
| #8 | /card e /en/card, três destaques e links públicos | QA real de zoom/leitores de tela. |
| #9 | vCard, QR SVG/PNG, palco, share com fallback e OG PNG | Importação/scan em aparelhos e ensaio em projeção. |
| #10 | Seis projetos, README auditado, snapshot real e diagramas HTML acessíveis | Autoria/papel e resultados específicos revisados; badges e evidências mais ricas. |
| #11 | Build/check de PR, teste, bundle budget e deploy limitado a master | Confirmar execução remota verde. |
| #12 | Coleções/posts e páginas existentes preservados; checagem de rotas antigas | Auditoria exaustiva de links históricos. |
| #13 | Conteúdo em HTML, foco, reduced-motion, pausa de lente e limite de scripts | Leitores de tela reais, LCP 4G e política de degradação completa. |
| #14 | Hero estático, entrada e lente decorativa leve | Fit-text por medição, revelação por letra, retrato ASCII aprovado, refração e desintegração. |
| #15 | Filtros, pan/pin desktop, íris de navegação e detalhes estáticos | Corte sincronizado, parallax e refinamento de foco/geometria. |
| #16 | Cinco competências por teclado, Sobre, contato e SHA/data reais | Terminal de carreira com marcos aprovados, typewriter e foto original. |
| #17 | Tilt por cursor no card | Pêndulos, partículas, giroscópio; modo claro/NFC opcionais. |
| #18 | Build local, testes de navegação e plano de rollback no README | Aparelhos reais, domínio ativo, QR final e lançamento. |

## Evidências de verificação local

- `npm run build`: assets, fontes, vCard, QR e OG gerados; Tailwind compilado.
- `bundle exec jekyll build --destination _site`: passou em Ruby 3.2/Jekyll 4.4.1.
- `node scripts/check.mjs --site`: conteúdo, 16 rotas novas/principais,
  links locais das novas páginas e rotas históricas principais passaram.
- `npm test`: quatro testes passaram (vCard, PNGs OG, curadoria e pares PT/EN).
- Chromium headless: card em 390×844 sem overflow; flip/QR e Escape;
  palco/saída; EN; home mobile sem overflow; filtro Backend retorna 2 projetos;
  desktop 1440 px; reduced-motion sem pin; zero erros JS observados.
- Bundle agregado dos módulos gerados: aproximadamente 50 KB gzip,
  abaixo do limite inicial de 200 KB. Não é medição de LCP/INP real.
- Capturas desktop/mobile inspecionadas internamente, sem publicar retrato
  pessoal nem screenshots como acervo.

## Auditoria de projetos

README dos seis repositórios consultado em 28/10/2026. Feature-marker atual é
skill-first com instalador; não alegamos os modos de CLI do briefing anterior.
SavePlace verifica lugares via provedores e não via LLM; decisões dos estudos
são síntese editorial, sem números de custo/latência fabricados. GastandoYa
mantém sua própria licença; não alegamos que todo projeto seja MIT.
Estrelas são snapshot datado e nunca dado ao vivo. A atualização opcional
`npm run snapshot` preserva último dado válido por projeto em falha.

## Domínio e rollback

O CNAME antigo permanece nesta branch até a preparação do corte. A URL github.io
no HTML é configuração de desenvolvimento/contingência e precisa ser validada
no ambiente Pages, pois o vínculo customizado antigo pode redirecionar.
A compra de viniciuscarvalho.dev não está concluída por esta execução.
Não distribuir o QR como definitivo antes de validar o domínio.
Rollback: reverter o commit de implementação e reexecutar o workflow da master.
