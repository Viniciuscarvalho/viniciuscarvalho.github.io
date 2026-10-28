# Continuação: card e verificações automatizadas

Base: PR #20, que depende do #19. Não publica site, não altera CNAME/DNS e não fecha issues com validação física pendente.

## Implementação
- Título em bitmap original 5×7 com nome acessível no DOM e fallback sem JS; monograma VC e dither Bayer de paleta fechada.
- Flip em duas etapas com cancelamento seguro por Escape/reduced-motion; faces inativas hidden/inert. Botões permanecem fora da face animada.
- Tilt por spring e brilho por transform; loop preguiçoso só enquanto visível e convergindo; redução de movimento e FPS baixo desligam a interação.
- Giroscópio opcional, permissão apenas após gesto explícito. Negativa não bloqueia contato. Ao ocultar a aba, entrar em palco ou reduzir movimento, o sensor é desligado.
- Palco mantém foco na saída e funciona por URL direta em PT/EN. Compartilhamento trata cancelamento sem falso erro e oferece URL selecionável quando copiar falha.
- Layout compacto no celular com rolagem disponível em telas baixas; correção do overflow causado pelo brilho.
- Build limpa apenas seu diretório de bundles gerados, evitando acúmulo de chunks antigos. Manifesto de URL liga geração de QR à checagem de canonical/OG para prevenir divergência no lançamento do .dev.

## Validação
- 10 testes Node: springs, qualidade, corte de projetos, Bayer, glyphs, vCard, OG, curadoria, idiomas e decodificação do QR.
- Suíte Playwright versionada, executada também no CI: card sem JS, flip/Escape, palco/foco, PT/EN, falhas e cancelamento de share, permissão de sensor, texto a 200%, galeria/filtros, teclado e reduced-motion ao vivo.
- Axe automatizado em home, cards PT/EN e estudo EN, com zero violações nos checks WCAG A/AA habilitados.
- Build Jekyll, links internos e orçamento de scripts (~55 KB gzip no total) passaram localmente.
- Capturas do card e palco inspecionadas. Isso não comprova leitor de tela, importação do vCard, giroscópio ou projeção em aparelhos reais.

## Pendências que exigem ambiente/insumo real
Compra e ativação de viniciuscarvalho.dev, DNS/HTTPS e QR definitivo; aprovação do retrato; número de anos/cargo atual/métricas; VoiceOver/TalkBack e teste de sensores/contato em iPhone/Android; LCP sob 4G em dispositivo; ensaio de palco. NFC e modo claro seguem opcionais.
