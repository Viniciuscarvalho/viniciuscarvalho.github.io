# Diagramas de arquitetura

A home oferece uma síntese do processo e mapas dos seis projetos em destaque. Cada estudo de caso usa o mesmo componente e os mesmos dados. O /card mantém sua função de contato rápido.

## Base editorial

Os READMEs públicos foram consultados em 28/10/2026. A síntese do processo é uma interpretação técnica dos padrões nos projetos, não uma afirmação de que todo projeto segue uma única arquitetura. Fontes aparecem nos mapas e em `_data/architecture.json`.

- monozukuri: seleção, worktree, fases do agente, validação, PR e memória.
- SavePlace: metadados oficiais, cache/idempotência, candidatos da IA, verificação pelo PlaceProvider e salvamento explícito. Cache hit é um caminho separado.
- ci-guard: snapshot, classificação, orçamento, verificação e ledger; branch failure, desconhecido e limite esgotado levam à correção/investigação.
- swift-code-reviewer-skill: contexto, wrappers, sete camadas, relatório e padrões recorrentes.
- Feature-marker: instalador separado da execução; PRD/Spec/Tasks, grill, implementação e commit local/handoff. Não atribuir abertura automática de PR a esse fluxo.
- gastandoya-api: app, backend OAuth, conexão por usuário, discovery, despesas e DTO. KV é condicional à configuração, com fallback em memória.

O percurso percorre componentes para explicá-los; não simula execução, tráfego ou métricas dos sistemas. As conexões e condições estão disponíveis em texto, inclusive sem JS.

## Implementação e comportamento

- Jekyll/Liquid e JSON PT/EN; nenhum serviço novo ou biblioteca gráfica.
- Conteúdo em HTML: links dos componentes, explicações, relações e fontes. Sem JS, todas as explicações ficam disponíveis.
- SVG decorativo calcula conectores pela geometria real. ResizeObserver recalcula após resize e seleção. Conexões que saltam nós usam uma lateral quando necessário.
- Reprodução apenas por gesto; pausa, próxima etapa e Escape. O mesmo ticker do GSAP existente conduz os pontos por transform. Não há loop rAF adicional.
- Só um mapa reproduz por vez. Pausa fora da viewport, em aba oculta, pagehide, troca de mapa, reduced-motion e qualidade estática. Reduced-motion mantém seleção e avanço manual.
- O módulo de arquitetura só é carregado na home e nos estudos. O GSAP só é solicitado por esse módulo ao reproduzir; as cenas existentes compartilham o chunk.
- Links de componentes podem ser abertos em nova aba; fragmentos selecionam mapa e explicação no carregamento.

## Validação

- Build de assets e Jekyll, verificação de rotas/canonical/links e orçamento: passaram.
- 11 testes Node: passaram, incluindo integridade e localização dos grafos, relações sem destinos ausentes e cobertura dos seis projetos.
- 29 testes Playwright: passaram, incluindo teclado, seleção dos sete mapas, reprodução/pausa, mudança de mapa, offscreen, reduced-motion dinâmico, links diretos, fallback sem JS, quatro larguras e axe AA.
- Capturas reais inspecionadas em desktop e mobile. As medições de largura incluem fonte de corpo ampliada.
- JavaScript total: 57.277 bytes gzip, somando todos os chunks, abaixo do limite de 200 kB.

Safari/iPhone e TalkBack em aparelhos reais continuam na validação física geral do lançamento. As verificações automatizadas não substituem essas evidências.
