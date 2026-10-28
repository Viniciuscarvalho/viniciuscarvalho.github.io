# Tech spec — The Pipeline com Jekyll
Atualização: 28/10/2026. Stack definida: Jekyll/Liquid + Tailwind + JavaScript, GitHub Pages via Actions.
Status: proposta de implementação. Este PR altera documentação.

## Arquitetura
Evoluir o site existente no próprio repositório. Manter Gemfile, coleções, histórico, npm de assets e _site como artefato.
Não introduzir Next.js, React, servidor Node de produção ou dependência de Vercel.
Jekyll monta o HTML; interatividade usa módulos JS carregados progressivamente. Node executa ferramentas de build, sem servir páginas em produção.
Referências oficiais:
- https://jekyllrb.com/docs/datafiles/
- https://jekyllrb.com/docs/collections/
- https://motion.dev/docs/quick-start

## Estrutura proposta
| Caminho | Responsabilidade |
| --- | --- |
| _data/content.yml | Perfil, textos PT/EN, expertise, carreira, claims e contatos. |
| _data/projects.yml | Ordem, tags, stack, evidências e links editoriais dos seis projetos. |
| _data/github.json | Snapshot de estrelas/contribuidores com fetchedAt por entrada. |
| _projects/ | Estudos Markdown PT/EN, output true, lang e permalink explícitos. |
| _layouts/pipeline.html | Base compartilhada do novo portfólio, preservando layouts antigos. |
| _layouts/pipeline-home.html | Hero, projetos, expertise, sobre e contato. |
| _layouts/card.html | Card autônomo e estados de networking/palco. |
| _layouts/project.html | Estudo de caso acessível por URL direta. |
| _includes/pipeline/ | Navegação, metadados, filtros, projetos e diagramas. |
| card/index.html, en/card/index.html | Front matter com lang, translation_key e permalink. |
| en/index.html | Home EN; home PT permanece /. |
| assets/src/ | JS de entrada, motion, canvas e estilos de origem. |
| assets/dist/ | Módulos locais compilados, incluindo chunks dinâmicos. |
| assets/generated/ | QR SVG/PNG, OG PNG, retrato estático e vCard. |
| scripts/ | Snapshot GitHub, validação, geração de assets e orçamento. |

Configurar Tailwind para inspecionar os novos layouts/includes/JS; usar classes literais ou safelist para evitar estilos ausentes. Excluir fontes de build, scripts e documentação de tarefas de _site.
Usar relative_url/absolute_url para baseurl/URL; nenhum hostname definitivo hardcoded nos componentes.

## Idiomas e SEO
Rotas PT /, /card/, /projetos/:slug/; EN /en/, /en/card/, /en/projects/:slug/.
Gerar documentos de coleção para os dois idiomas com permalinks explícitos e translation_key comum. Layout compartilhado consulta o dicionário pelo lang.
Toggle usa o par equivalente e preserva stage quando pertinente; idioma não depende de localStorage.
lang no HTML, títulos/descrições, canonical e hreflang coerentes, Open Graph por idioma, JSON-LD Person seguro e sitemap com rotas públicas.
Evitar duplicação dos metadados existentes de jekyll-seo-tag. Build SHA e data são valores reais de CI, nunca commits fictícios de carreira.

## Dados e GitHub
Separar conteúdo editorial de snapshot remoto; validar slugs, campos obrigatórios e URLs.
Script de build consulta somente os seis repositórios permitidos. Token de leitura, se necessário, apenas em env do CI. Sem token nos arquivos publicados, mapas de fonte ou logs.
Fallback por repositório: preservar último snapshot válido quando API falhar, com fetchedAt original; não inventar zero estrelas ou disponibilidade de package.
Atualização horária é rebuild agendado via Actions, sujeito a atraso. Não chamar de dado “ao vivo” nem prometer ISR.
Claims têm confirmed, attribution, source e publicationAllowed. A redução de 35% de CI pertence ao contexto OLX, sem atribuição causal ao ci-guard.

## Build e deploy
Manter o caminho npm → Bundler/Jekyll → upload de _site → deploy-pages.
Sequência proposta:
1. Instalar dependências com versões travadas e cache; criar lockfiles adequados.
2. Atualizar snapshot com fallback, sem escrita automática na branch.
3. Validar YAML, traduções, claims e permalinks.
4. Gerar vCard, QR, OG e imagens otimizadas.
5. Compilar CSS Tailwind e JS com esbuild, módulos e splitting; plugins pagos não são dependência.
6. JEKYLL_ENV=production bundle exec jekyll build --destination ./_site.
7. Verificar HTML gerado, links internos, assets, tamanho JS e vazamento de dados.
8. Upload/deploy pelo workflow atual.
Adicionar trigger pull_request para build/check, condicionando job de deploy a push na branch publicada ou workflow_dispatch autorizado. PR não publica automaticamente o site.
Rebuild agendado opcional reutiliza branch de produção e política de deploy. Permissões mínimas; builds de PR sem acesso a secrets de terceiros.

## Recursos antes previstos para servidor
| Recurso | Solução Jekyll/Pages |
| --- | --- |
| vCard | Gerar .vcf UTF-8 com CRLF em assets/generated; link download. |
| OG | Gerar PNG 1200×630 com SVG próprio e rasterizador no build; metadata absoluta. |
| QR | qrcode em Node gera SVG/PNG da URL canônica do card. |
| Dados horários | Snapshot no build + Actions schedule opcional. |
| Detalhes | Coleção estática com permalink; JS aprimora abertura por íris. |
| Analytics | Opcional, compatível com site estático; não depender de Vercel Analytics. |

OG não precisa ser recalculado por visitante. VCard valida escape, folding e importação real. Não gerar HTML no caminho que deveria baixar contato.
Uma única configuração de URL alimenta canonical, QR, vCard e OG; validar a URL pública antes de distribuir materiais.

## Motion completo sem React
Usar API JS do pacote motion quando útil; GSAP/ScrollTrigger para pin/scrub e cenas, canvas 2D para retrato/pixel/dither, WebGL2 opcional. Lenis somente com integração acessível e benefício medido.
Não adicionar runtime React apenas para springs. Estilos e conteúdo existem antes de executar JS.
Um proprietário por propriedade animada; relógio de cena compartilhado para canvas/parallax/pêndulo. Bibliotecas podem manter loops internos.
Implementar hero com fit-text, revelação e lente; projetos com pan, parallax, pêndulos, corte de texto e íris; expertise com foco, poses e teclado; carreira com typewriter; contato com lente leve; card com flip, tilt, brilho e pixel/dither.
Transições de detalhe mantêm link real: sem JS navegam; com JS podem usar dialog e history, tratando URL direta, Voltar, título, foco e Escape. Falha de carregamento navega ao permalink.
Filtro recalcula geometria do ScrollTrigger e mantém todos os resultados acessíveis. Mobile usa fluxo vertical.
Sem API paga de texto/motion obrigatória. Implementar divisão de caracteres própria com alternativa semântica única.

## Performance e degradação
DPR <=2 e orçamento de pixels; pausar fora da viewport e aba oculta. Import dinâmico de efeitos após conteúdo principal, sem transformar canvas no LCP.
Reduced-motion: sem pin, tilt, partículas, smooth scroll, typewriter ou lente ambiental; retrato estático, texto imediato, lista vertical.
deviceMemory é opcional; Safari não depende dessa API. Amostrar FPS sustentado e degradar abaixo de 40, com histerese para evitar alternância.
DOM usa transform/opacity; refração SVG é exceção isolada, testada e desligável. Canvas sem filter blur, usar assets pré-processados.
Metas por rota: JS inicial <200 kB gzip, LCP <2,5s em mobile 4G documentado, fontes locais com swap/subsets e imagens dimensionadas.
Carregar scripts do card separadamente dos efeitos pesados da home.

## Acessibilidade
DOM semântico para todo conteúdo; canvas decorativo aria-hidden.
Controle de flip explícito, face oculta inert e retorno do foco; links não disparam flip.
Giroscópio só após ação e permissão quando exigida; cursor e visual estático são equivalentes.
Foto original acessível por botão/teclado além de pointer hold. Setas de expertise apenas com foco local.
stage=1 interpretado no navegador; modo palco oferece saída e Escape sem depender de Fullscreen API.
Contato, projetos e idiomas funcionam sem JS; share tem fallback de cópia/URL.
Validar AA, zoom 200%, foco, VoiceOver e TalkBack.

## Compatibilidade e lançamento
Preservar _posts, _apps, /blog, /apps, /sobre, /thais e assets usados. Inventariar URLs e evitar colisões com nova coleção.
CNAME aponta para theswiftmah.com.br. Usar github.io exige revisar também Settings Pages e URL em _config.yml; não basta presumir que apagar o arquivo resolve.
Nenhuma compra de domínio ou migração de host é necessária. Não alterar DNS/Pages neste PR documental.
Preparar commit e artefato de rollback; validar HTTPS, URL pública e QR final no lançamento.

## Verificação de implementação
Build Jekyll e assets reproduzível; validação de conteúdo e HTML gerado.
Testes significativos: fallback GitHub, vCard/QR, pares de idioma, palco, flip e foco, filtros/reflow, histórico do detalhe e reduced-motion.
QA em iPhone Safari e Android Chrome, larguras 360/390/768/1440, altura baixa e zoom.
Comparar referência funcional ao checklist do PRD, registrando efeitos concluídos, adiados e motivos. Não marcar o briefing completo sem entregar os itens obrigatórios.
