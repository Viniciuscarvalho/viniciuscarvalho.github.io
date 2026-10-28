# Continuação: motion e navegação

PR baseado em `feat/the-pipeline-xconf` (#19). Nenhuma publicação ou alteração de domínio.

Implementado:
- Fit de título por medição/ResizeObserver e revelação por caracteres com uma única versão semântica.
- Lente com cópia recortada do título e displacement SVG para pointer fino; realce simples em dispositivos sem o caminho de refração.
- Campo ASCII próprio do monograma VC, respiração e dispersão reversível por scroll. O campo aceita retrato apenas se `_data/content.json → portrait.approved` estiver verdadeiro. Não é apresentado como retrato real.
- Clock de cenas compartilhado, pausa por visibilidade, DPR limitado e degradação após FPS baixo sustentado. Reduced-motion pode ser alterado durante o uso, com desmontagem e remontagem dos efeitos.
- Galeria desktop com pan, parallax, spring/pêndulo leve da arte, arraste por ponteiro, legenda recortada por linha comum, filtros e modo de grade explícito. Foco de teclado retorna à grade para manter os links alcançáveis.
- Expertise com Home/End/setas, foco, número animado e seleção por progresso sem disputar com o foco do teclado.
- Terminal com marcos de organizações fornecidos no briefing, typewriter e texto semântico imediato. Sem datas, cargos atuais ou números não confirmados.
- Íris com origem por mouse/teclado e restauração após Voltar/BFCache.
- Workflow aceita PRs empilhados para executar os checks também fora da base master; deploy continua limitado à master.

Validação: build de assets, 8 testes Node, build Jekyll e checagem de rotas passaram. Chromium automatizado em 1440 px e 360 px: filtros Backend→Todos, grade, End de expertise, redução de movimento ao vivo, retorno dos efeitos e ausência de overflow/erros JS. Capturas inspecionadas.

Pendências reais: retrato aprovado, ajuste visual com foto final, claims de carreira/números, teste em Safari/iPhone físico e medições LCP de campo. Não fecha as issues #13–#17 por inteiro.
