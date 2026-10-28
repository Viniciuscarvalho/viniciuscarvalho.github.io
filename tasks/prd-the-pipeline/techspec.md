# Tech spec — The Pipeline
Status: proposta; nenhuma alteração de runtime neste PR.

## Estratégia
Reutilizar o repositório e seu histórico. Next.js App Router + TypeScript + Tailwind é a stack desejada. Implementar inicialmente em diretório isolado, por exemplo web/, com lockfile e scripts próprios; o workflow Jekyll existente só muda no PR de lançamento.

Escolha recomendada para endereço GitHub Pages já existente: exportação estática Next.js, com trailingSlash e saída out/. É uma adaptação explícita do briefing para evitar depender da compra do .dev ou da configuração de Vercel antes da Xconf.
Alternativa se Vercel for configurada: Next.js com runtime, ISR horário e route handlers. Não misturar os dois contratos de hospedagem.

| Recurso | Pages estático | Vercel com runtime |
| --- | --- | --- |
| GitHub | Fetch no build, snapshot local; rebuild agendado opcional | Cache/ISR 3600 s com fallback |
| vCard | Arquivo gerado no build, link estável | GET /card/vcard |
| OG | PNG gerado no build, metadado absoluto | next/og no build ou runtime |
| QR | SVG gerado com baseUrl canônica | Mesmo contrato |
| Projetos | Rotas pré-geradas | Rotas pré-geradas ou cache |
| Imagens | Otimização prévia e configuração compatível com export | Otimizador do servidor quando disponível |
Fonte oficial: https://nextjs.org/docs/app/guides/static-exports
ISR não existe em exportação estática; GET handlers só servem quando pré-renderizáveis. Não depender de requisição para gerar arquivos estáticos.

## Organização proposta
web/src/content/content.ts: fonte de textos PT/EN, perfil, marcos e referências.
web/src/content/projects.json: dados editoriais e snapshot GitHub com observedAt.
web/src/app/: rotas PT e EN, metadados, projetos e card.
web/src/components/: navegação, card, projetos, diagramas, expertise.
web/src/motion/: controlador de cenas e política de qualidade.
web/scripts/: validação, snapshot GitHub, vCard, OG e QR.
Diagramas precisam de alternativa textual e conteúdo real; não usar geração de imagem para fluxos precisos.

## Dados
Project: slug, repository, title, summary[locale], category[], stack[], status, links, evidence, caseStudy[locale], featuredOrder.
GitHubSnapshot: stars, contributors opcionais, fetchedAt, source.
Claim: text[locale], source, attribution, confirmed, publicationAllowed.
Config: baseUrl, localeRoutes, stageEnabled, buildSha, buildDate.
Claims não confirmados não são renderizados. Ausência de métrica remove o número.
Consultar seis repositórios nomeados, validar README/licença e separar descrição editorial de propriedades da API.
Atualização horária no Pages significa rebuild, não “ao vivo”; exibir horário e permitir snapshot antigo. Não falhar deploy por indisponibilidade de estrelas.
Token de leitura mínimo apenas em ambiente de build/runtime. Nunca prefixo público; logs sem headers ou tokens.

## Motion e degradação
Motion para gestos/layout; GSAP/ScrollTrigger para cenas; Lenis somente se trouxer benefício mensurável e após integrar teclado/âncoras.
Um owner por propriedade transformada: evitar Motion e GSAP escreverem no mesmo elemento.
Canvas inicia após conteúdo essencial e importação dinâmica. Retrato estático ou monograma evita canvas como LCP.
Limitar DPR a 2 e aplicar orçamento de pixels, IntersectionObserver, visibilitychange e cleanup.
Preferir transform/opacity em DOM; refração SVG é exceção cara, restrita e desligável. Detectar capacidade de renderização, não só user agent.
deviceMemory é opcional e não disponível em todos os browsers; nunca exigir essa API no Safari. Usar decisão conservadora e amostragem sustentada de FPS <40 com histerese.
Reduced-motion desliga pin, tilt, partículas, refração ambiental, smooth scroll e digitação. Texto imediato, imagem estática, links nativos.
Testar cancelamento, navegação entre rotas e montagem repetida sem acumular listeners/tickers.

## Acessibilidade e card
Texto semântico no DOM acompanha qualquer canvas; canvas decorativo aria-hidden.
Botão de flip com aria-expanded/controls, face oculta inert e gestão de foco.
Detalhe/modal com foco contido somente quando modal, Escape e retorno ao acionador; rota direta funciona sem origem do clique.
Giroscópio só após botão de ativação e permission API quando exigida; cursor estático como fallback.
vCard 3.0 com escape de vírgulas, ponto e vírgula e quebras, CRLF; testar importação real. Link público de download sem coleta de dados.
stage=1 é interpretado no cliente em export estático sem alterar o HTML/OG canônico. UI normal permanece funcional sem JavaScript.

## Domínio, migração e segurança de lançamento
CNAME atual aponta para theswiftmah.com.br. Para usar github.io, retirar vínculo customizado no deploy/Settings Pages e atualizar URL/configuração; remover só o arquivo pode ser insuficiente. Executar apenas no corte de lançamento.
Não comprar viniciuscarvalho.dev ou viniciuscarvalho.io; preço e disponibilidade do briefing não foram verificados e não são orçamento.
Validar HTTPS e comportamento real de github.io antes de imprimir QR. Se usar preview Vercel, escolher URL durável, sem usar deployment efêmero.
Inventariar _posts, _apps, /blog, /apps, /sobre e /thais. Preservar arquivos e rotas existentes fora do redesign. Definir destino por URL antes de substituir build.
GitHub Pages não fornece redirects de servidor configurados pelo Next; preservar páginas antigas ou gerar páginas de migração explícitas quando necessário.
Guardar commit de rollback e artifact anterior. Não mudar Pages/DNS neste PR de proposta.
Preview deve ficar separado do deploy público; PR documental não precisa publicar Jekyll.

## Verificação
Checagem de tipos, validação de conteúdo e build/export.
Testes relevantes: fallback de API; escape do vCard; mapeamento PT/EN; /card?stage=1; links de projeto; reduced-motion; teclado/flip e histórico de detalhes.
QA manual em iPhone e Android, tamanhos 360/390/768/1440 px, alturas pequenas, zoom e leitor de tela.
Medir bundle gzip por rota e Lighthouse mobile; registrar dispositivo, rede e build.
Budgets são metas até haver medição. Conferir licenças/versões de Motion, GSAP e demais libs na implementação.
