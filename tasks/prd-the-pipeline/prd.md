# PRD — The Pipeline
Data: 28/10/2026. Autor do briefing: Vinicius Carvalho Marques.
Status: proposta para execução antes da Xconf. Data exata do evento pendente.
Este documento sucede propostas de conteúdo anteriores apenas no escopo de redesign. Este PR não implementa nem publica o site.

## Resultado esperado
Transformar o portfólio em uma demonstração de engenharia: Ideia → Spec → Agentes → PR → Produção. A apresentação comunica Senior Software Engineer, com profundidade em iOS e atuação em arquitetura, plataforma, ferramentas e IA aplicada.

PT-BR padrão, EN com conteúdo equivalente. O /card é o primeiro entregável e funciona como apresentação rápida, compartilhável e utilizável em conferência.

## Estado encontrado no repositório
- Branch padrão master; Jekyll/Liquid + Tailwind 3.
- Home, Apps, Blog, Sobre, posts e páginas de produtos existentes.
- Deploy em .github/workflows/pages.yml gera _site e publica no GitHub Pages.
- CNAME contém theswiftmah.com.br.
- Endereço do repositório: https://github.com/Viniciuscarvalho/viniciuscarvalho.github.io.
- viniciuscarvalho.io não foi comprovado como domínio próprio. O endereço correspondente ao repositório é viniciuscarvalho.github.io; o domínio personalizado atual pode afetar sua navegação.
- Há retrato em assets/perfil_site.png; avaliar qualidade e obter aprovação de uso antes da conversão ASCII.

## Originalidade e referências
Briefing do proprietário é a fonte da direção visual. Não se afirma inspeção independente das galerias.
Referências: https://motionin.design/, https://devault-ascii.pages.dev/, https://landdding.com/, https://modulify.ai/templates, https://theinternetdesigns.com/ e post https://x.com/vullnetademaj/status/2114677448734363782.
Usar apenas técnicas gerais: tipografia expressiva, refração, representação ASCII, progressão de cenas, foco e transições geométricas. Criar composição, conteúdo, ativos e implementação próprios. Não transcrever descrições comerciais, copiar layouts ou acessar material pago sem autorização.

## Identidade
Fundo #0A0A0C, painel #121216, borda #26262C.
Texto #F2EFE8, secundário #9A9AA3, acento #FF5A1F.
Fósforo #B8FF3C reservado a estados positivos e adições; erro #FF4D6A.
Um acento dominante por cena. Validar contraste nas combinações e tamanhos efetivos.
Display Space Grotesk; corpo Geist; metadados JetBrains Mono. Validar licenças e usar fontes locais/subsets. Pixel 5×7 apenas como decoração, com equivalente textual no DOM.
Fit-text com medição e ResizeObserver; permitir quebra acessível quando necessário, sem texto microscópico ou overflow.

## Conteúdo e claims
Dados informados pelo proprietário, sujeitos à revisão final:
- Senior iOS Engineer na TELUS Digital desde novembro/2025; adoção de IA, agentes e ferramentas internas.
- Staff iOS no Grupo OLX: Design System SwiftUI/UIKit, SDUI e redução de 35% no custo de CI.
- Senior iOS no Mercado Livre.
- Organizador CocoaHeads Br.
- Mais de 12 anos desenvolvendo software: confirmar número antes de publicar.
A redução de CI é um resultado profissional na OLX; não atribuí-la como resultado medido do ci-guard.
Não transformar quantidade de projetos selecionados em claim de ferramentas lançadas.
Sem métricas fictícias, datas inferidas ou links de palestra inventados.

Copy PT proposta: “Engenharia de software que escala — e que se automatiza.”
Subtítulo: “Sênior com 12+ anos em arquitetura, plataforma e IA aplicada: apps, backends e ferramentas para times entregarem melhor.”
EN: “Software engineering that scales, and automates itself.”
“Senior engineer with 12+ years across architecture, platform and applied AI: apps, backends and tooling that help teams ship better.”
Se tempo de experiência não confirmado, retirar o número das duas versões.
Distinguir headline display da copy principal para evitar dois títulos gigantes concorrentes.

## Jornadas e seções
1. Hero: nome, posicionamento e ações; retrato ASCII decorativo com foto alternativa; lente e desintegração progressivas, sem bloquear leitura.
2. Build/Projetos: destaques em ordem editorial, filtros IA/Agentes, DevOps, Backend, Devtools e iOS; arquivo completo ao final.
3. Stack/Expertise: cinco competências, navegação por foco e teclado, evidências associadas.
4. Log/Sobre: história curta e marcos Mercado Livre → OLX → TELUS; terminal é representação editorial, sem inventar hashes históricos.
5. Contato: e-mail clicável, redes e vCard.
6. /card: apresentação de networking; /card?stage=1 para projeção.

Projetos na ordem:
| Projeto | URL | Narrativa e evidência necessária |
| --- | --- | --- |
| monozukuri | https://github.com/viniciuscarvalho/monozukuri | Backlog em PRs pequenos com agentes, memória e controle de custo; diagrama backlog → PR; verificar npm/Homebrew. |
| SavePlace | https://github.com/viniciuscarvalho/SavePlace | URL social pública em lugar verificado; diagrama, cache, idempotência e métricas reais de custo/latência. |
| ci-guard | https://github.com/viniciuscarvalho/ci-guard | Classificação de falhas antes do rerun; contexto profissional de CI separado do resultado do repo. |
| swift-code-reviewer-skill | https://github.com/viniciuscarvalho/swift-code-reviewer-skill | Review Swift/SwiftUI em camadas; verificar licença, integrações e contribuidores externos. |
| Feature-marker | https://github.com/viniciuscarvalho/Feature-marker | PRD → spec → tarefas → implementação → testes → PR; verificar checkpoint/resume e modos suportados. |
| gastandoya-api | https://github.com/viniciuscarvalho/gastandoya-api | Backend e integração Notion; ilustrar isolamento e fluxo de tokens sem publicar segredos. |
Reservas: ios_interview, mac-ssd-rescue e seb. Estrelas fornecidas no briefing são snapshots, não valores atuais verificados.

Cada detalhe possui problema, papel, decisões, trade-offs, diagrama quando útil, resultado verificável e links. Mostrar data da atualização dos metadados. Falha da API usa snapshot e não interrompe a página.

## Card — P0
Nome, cargo, retrato/monograma e três destaques: monozukuri, swift-code-reviewer-skill e Feature-marker.
Links: GitHub https://github.com/Viniciuscarvalho; X https://x.com/viniciusc70; LinkedIn https://www.linkedin.com/in/viniciuscarvalhomarques/; e-mail viniciuscarvalho789@gmail.com.
Salvar contato baixa vCard UTF-8 com CRLF, nome estruturado e dados públicos informados; sem telefone inferido.
Compartilhar via Web Share com fallback de cópia e URL selecionável.
QR codifica URL canônica estável de /card; não inclui stage=1 ou idioma por acidente.
Modo palco: QR grande, nome e URL legível, fundo de contraste, botão de saída e Escape.
Frente/verso por botão explícito “Mostrar QR”; não capturar toque em links para virar o card. Verso inativo fora da ordem de foco; restaurar foco ao voltar.
Tilt por cursor é aprimoramento; giroscópio opcional, apenas após consentimento por gesto e detecção de suporte. Nunca necessário para contato.
Uma tela em alturas adequadas é objetivo visual; permitir rolagem em telas baixas, zoom e fontes ampliadas.
PT /card e EN /en/card. Toggle preserva página e contexto; URL canônica por idioma.
OG estático legível em mensageiros, que abre experiência interativa no navegador.
NFC é tarefa física opcional posterior; nenhum gasto autorizado.

## Motion
Projetos podem usar pan horizontal com pin apenas em desktop compatível; mobile e reduced-motion usam lista vertical. Filtros recalculam limites e mantêm seleção válida.
Transições de detalhe por círculo são opcionais; URL direta, Voltar, foco e Escape funcionam sem animação.
Expertise apresenta todas as competências no DOM, sem depender de scroll para acesso. Setas agem somente com componente focado, nunca globalmente em inputs.
Um relógio explícito para cenas de canvas/scroll; Motion continua responsável por suas springs de UI. Não prometer um único loop interno para bibliotecas independentes.
Sem ambiência sonora, flash, hijack de scroll obrigatório ou conteúdo exclusivo em canvas.

## Prioridades
P0: card completo, PT/EN, QR/palco, vCard, share, OG, home e seis projetos, contato, reduced-motion e deploy verificável.
P1: hero ASCII/lente, pan desktop, detalhe por íris, foco de expertise, arquivo/filtros.
P2: pêndulos, partículas sofisticadas, giroscópio, modo claro e NFC.
A direção visual deve existir mesmo com efeitos desligados.

## Aceite
- /, /en, /card e /en/card carregam diretamente.
- Card funciona sem foto final usando monograma identificado, sem retrato fictício.
- Links, vCard, compartilhar/cópia e QR testados em iOS Safari e Android Chrome.
- QR escaneado em dois aparelhos a partir de tela; palco testado em projeção ou tela externa.
- Teclado, VoiceOver/TalkBack, zoom 200%, foco visível e contraste AA.
- Reduced-motion produz lista vertical, retrato estático e sem efeitos ambientais.
- Conteúdo principal permanece em HTML antes de carregar animações.
- Meta LCP <2,5s em teste mobile 4G documentado e JS inicial <200 kB gzip por rota.
- Nenhum token de GitHub no cliente; falha de API mantém conteúdo.
- Claims revisados e métricas com atribuição correta.
- URLs antigas de blog/apps preservadas ou mapeadas; nenhum acervo removido sem inventário.
- Domínio e QR final definidos antes de divulgar.
