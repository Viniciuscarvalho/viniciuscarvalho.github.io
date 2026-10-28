# Plano de execução — Xconf
Data exata do evento deve ser fixada no início. Plano de três dias é estimativa; card tem prioridade.

## Dia 1 — identidade e networking
- [ ] Auditar README e estado dos seis projetos e confirmar claims.
- [ ] Definir URL de lançamento e Jekyll no GitHub Pages.
- [ ] Inventariar URLs antigas e definir preservação.
- [ ] Criar layouts/includes Liquid, tokens, _data/content.yml PT/EN e coleção _projects.
- [ ] Implementar /card e /en/card com monograma ou retrato aprovado.
- [ ] QR, modo palco, share/cópia, vCard e preview social.
- [ ] Preview acessível em celular e testes de importação do contato.

## Dia 2 — apresentação e evidências
- [ ] Home com narrativa The Pipeline e contatos.
- [ ] Seis projetos na ordem aprovada, detalhes e diagramas reais.
- [ ] Snapshot GitHub com fallback e horário; nenhuma dependência no cliente.
- [ ] Hero estático completo antes de adicionar lente/ASCII.
- [ ] Implementar motion JS progressivo com checklist de cobertura de todos os efeitos do briefing.
- [ ] Preservar destinos antigos de apps/blog.

## Dia 3 — acabamento e lançamento
- [ ] Expertise e marcos profissionais PT/EN.
- [ ] Reduced-motion, teclado, leitores de tela e gestão de foco.
- [ ] QA iOS/Android e performance/bundle.
- [ ] Validar metadados, URLs canônicas, sitemap e JSON-LD Person.
- [ ] Revisar claims com Vinicius; retirar os não confirmados.
- [ ] Preparar PR de implementação com evidências e rollback.
- [ ] Executar corte de deploy e eventual remoção do domínio antigo somente no lançamento.
- [ ] Validar URL pública/HTTPS; gerar QR definitivo e ensaiar palco.

## Ordem de corte
Pêndulos → partículas/vídeo ASCII → giroscópio → modo claro → pan pinado e íris.
Preservar conteúdo, contato, idioma, QR, acessibilidade e funcionamento do card.

## Pendências do proprietário
- [ ] Data e horário da participação na Xconf.
- [ ] Confirmar tempo de experiência e cargo atual para publicação.
- [ ] Aprovar retrato existente ou fornecer foto nova.
- [ ] Confirmar menção CocoaHeads e URLs de palestras.
- [ ] Escolha/compra de .dev é opcional e não bloqueia Pages.
- [ ] Revisar métricas e suas fontes antes de publicar.

## Definition of done
Checklist de aceite do PRD atendido, build reproduzível, QA documentado, links/QR/vCard verificados e nenhuma promessa de validação em aparelho sem teste efetivo.

## Cobertura completa em Jekyll
- [ ] Empacotar Motion JS sem React, GSAP/ScrollTrigger e módulos canvas; manter build Tailwind/Jekyll.
- [ ] Hero: fit-text, revelação, lente, ASCII/braille e desintegração.
- [ ] Projetos: pan/pin, parallax, pêndulo/arraste, corte sincronizado e íris.
- [ ] Filtros, arquivo, badges reais e snapshot GitHub com fallback.
- [ ] Expertise: cinco competências, foco/teclado, claims e poses por progresso.
- [ ] Sobre: terminal e acesso ao retrato original por toque e teclado.
- [ ] Contato: lente leve, redes e build info real.
- [ ] Card: pixel 5×7, dither, flip, tilt/brilho, giroscópio opcional, palco e share.
- [ ] Gerar OG PNG, QR SVG/PNG e vCard no build a partir da URL canônica.
- [ ] Validar pares PT/EN, build Jekyll, leitor de tela e reduced-motion.
- [ ] Registrar efeitos concluídos e adiados; ordem de corte não exclui automaticamente o briefing.
Modo claro e NFC permanecem opcionais. Três dias são estimativa; card funcional tem prioridade.
