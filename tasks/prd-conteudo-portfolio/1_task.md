# [1.0] Criar case completo do GastandoYa (M)

## Objetivo
- Criar um app/case completo do **GastandoYa** na coleção `_apps/`, com conteúdo real (features, integrações, premium, links).

## Subtarefas
- [x] 1.1 Criar `_apps/gastandoya.md` com front matter completo (featured, links, highlights)
- [x] 1.2 Escrever conteúdo: problema, proposta, features e integrações (baseado no site público)
- [ ] 1.3 Ajustar `Apps`/Home para destacar o GastandoYa

## Critérios de Sucesso
- GastandoYa aparece em `/apps/` com card bem preenchido.
- Página de detalhe comunica claramente valor e principais features.

## Dependências
- PRD e Tech Spec em `tasks/prd-conteudo-portfolio/`.

## Observações
- Referência de conteúdo: https://www.gastandoya.com.br

## markdown

## status: completed # Opções: pending, in-progress, completed, excluded

<task_context>
<domain>engine/frontend/content</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>medium</complexity>
<dependencies>http_server</dependencies>
</task_context>

# Tarefa 1.0: Criar case completo do GastandoYa

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Adicionar o GastandoYa como um app/case completo na seção Apps, com narrativa e conteúdo de features.

<requirements>
- Criar documento em `_apps/` com front matter completo (title/tagline/links/highlights).
- Conteúdo descrevendo funcionalidades (metas, iCloud, Notion, import CSV/PDF, premium).
- Aparecer em destaque na Home (se `featured: true`).
</requirements>

## Subtarefas

- [ ] 1.1 Criar `_apps/gastandoya.md`
- [ ] 1.2 Escrever conteúdo com base no site público
- [ ] 1.3 Ajustar `_layouts/home.html` para garantir destaque correto

## Detalhes de Implementação

Referência: `tasks/prd-conteudo-portfolio/techspec.md` (Modelos de Dados / Sequenciamento).

## Critérios de Sucesso

- Página `/apps/gastandoya/` renderiza bem e com conteúdo rico.

## Arquivos relevantes
- `_apps/gastandoya.md`
- `_layouts/apps.html`
- `_layouts/app.html`
- `_layouts/home.html`

