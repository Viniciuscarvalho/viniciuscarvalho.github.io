# [2.0] Criar case visual (apenas imagens) para portfólio (S/M)

## Objetivo
- Criar um app/case focado em **screenshots** para servir como portfólio visual, mesmo com pouco texto.

## Subtarefas
- [ ] 2.1 Criar `_apps/portfolio-visual.md` com `screenshots` e `cover_image`
- [ ] 2.2 Adicionar imagens do case em `assets/` e referenciar paths corretos
- [ ] 2.3 Marcar `featured: true` se for um item principal

## Critérios de Sucesso
- Case aparece em `/apps/` e a página de detalhe mostra a galeria.

## Dependências
- 1.0 pode ser feito em paralelo, mas idealmente depois para ajustar destaques.

## Observações
- Sem imagens reais no repo, usar placeholders e depois substituir.

## markdown

## status: completed # Opções: pending, in-progress, completed, excluded

<task_context>
<domain>engine/frontend/content</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>medium</complexity>
<dependencies>http_server</dependencies>
</task_context>

# Tarefa 2.0: Criar case visual (apenas imagens) para portfólio

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Adicionar um segundo item de portfólio em Apps para evidenciar qualidade visual e UI.

<requirements>
- Documento em `_apps/` com `screenshots` listando imagens existentes em `assets/`.
- Layout de detalhe exibe imagens em grid.
</requirements>

## Subtarefas

- [ ] 2.1 Criar `_apps/portfolio-visual.md`
- [ ] 2.2 Adicionar imagens em `assets/apps/portfolio-visual/`
- [ ] 2.3 Ajustar `cover_image` e `featured`

## Detalhes de Implementação

Referência: `tasks/prd-conteudo-portfolio/techspec.md` (Assets / Riscos).

## Critérios de Sucesso

- Página renderiza sem imagens quebradas.

## Arquivos relevantes
- `_apps/portfolio-visual.md`
- `assets/apps/portfolio-visual/*`

