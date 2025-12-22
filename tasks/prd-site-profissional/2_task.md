# [2.0] Layout base + design system mínimo (dark-only) (M)

## Objetivo
- Refatorar a estrutura base do site (layout, navegação, footer) para Tailwind e tornar o site dark-only.

## Subtarefas
- [ ] 2.1 Criar `_includes/nav.html` e `_includes/footer.html`
- [ ] 2.2 Atualizar `_layouts/default.html` para usar includes e Tailwind
- [ ] 2.3 Remover toggle/JS de dark mode e garantir `color-scheme: dark`

## Critérios de Sucesso
- Navegação consistente em Home/Apps/Blog/Sobre.
- Nenhuma referência ao tema claro/toggle.
- Layout responsivo (mobile menu funcional).

## Dependências
- 1.0 concluída.

## Observações
- Manter o site simples (Liquid/Jekyll), sem frameworks JS.

## markdown

## status: completed # Opções: pending, in-progress, completed, excluded

<task_context>
<domain>engine/frontend/layout</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>medium</complexity>
<dependencies>http_server</dependencies>
</task_context>

# Tarefa 2.0: Layout base + design system mínimo (dark-only)

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Criar um “esqueleto” profissional com Tailwind (nav/footer/layout), removendo completamente o suporte ao tema claro e deixando o site dark-only.

<requirements>
- Layout base usa Tailwind e inclui `nav.html`/`footer.html`.
- Site fica dark-only (sem `darkmode.js`).
- Tipografia do conteúdo (blog/apps/sobre) usa `@tailwindcss/typography`.
</requirements>

## Subtarefas

- [ ] 2.1 Atualizar `_includes/head.html` para apontar para `assets/css/site.css` e fontes
- [ ] 2.2 Atualizar `_layouts/default.html` para usar Tailwind e incluir nav/footer
- [ ] 2.3 Remover `assets/js/darkmode.js` e ajustar `_config.yml` (dark_mode false)

## Detalhes de Implementação

Referência: `tasks/prd-site-profissional/techspec.md` (seções: Layout/IA, dark-only).

## Critérios de Sucesso

- Navegação funciona em desktop e mobile.
- CSS é aplicado corretamente em todas as páginas.

## Arquivos relevantes
- `_layouts/default.html`
- `_includes/nav.html`
- `_includes/footer.html`
- `_includes/head.html`
- `_config.yml`
- `assets/css/main.css`

