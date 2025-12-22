# [3.0] Home (landing) inspirada em Sampo/Najaf (M)

## Objetivo
- Criar uma Home profissional (landing) com seções, CTAs e narrativa visual inspirada em Sampo/Najaf.

## Subtarefas
- [ ] 3.1 Implementar hero (posição + CTA Apps/Blog)
- [ ] 3.2 Implementar highlights (3 cards)
- [ ] 3.3 Implementar seções: Apps em destaque + Últimos posts + CTA final

## Critérios de Sucesso
- Home comunica claramente: quem é você, o que faz, e para onde o visitante deve ir.
- Responsiva e consistente com o resto do site.

## Dependências
- 2.0 concluída.

## Observações
- Evitar excesso de conteúdo: foco em clareza e hierarquia.

## markdown

## status: completed # Opções: pending, in-progress, completed, excluded

<task_context>
<domain>engine/frontend/home</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>medium</complexity>
<dependencies>http_server</dependencies>
</task_context>

# Tarefa 3.0: Home (landing) inspirada em Sampo/Najaf

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Implementar uma landing “one-page” que mistura portfólio + blog: hero, seções de apps e posts, e CTA.

<requirements>
- Home deve ter hero com CTAs (Apps/Blog).
- Seções “Apps em destaque” e “Últimos posts”.
- CTA final para contato (LinkedIn/GitHub).
</requirements>

## Subtarefas

- [ ] 3.1 Atualizar `_layouts/home.html` com hero + highlights
- [ ] 3.2 Integrar apps em destaque via coleção `site.apps` (`featured: true`)
- [ ] 3.3 Integrar últimos posts via `site.posts`

## Detalhes de Implementação

Referência: `tasks/prd-site-profissional/techspec.md` (seções: Home, Apps, Blog).

## Critérios de Sucesso

- Home renderiza sem erros e com boa hierarquia visual.

## Arquivos relevantes
- `_layouts/home.html`
- `_apps/*`
- `_posts/*`

