# [4.0] Seção Apps (coleção + listagem + detalhe) (M)

## Objetivo
- Criar uma vitrine de Apps/Produtos com listagem e páginas de detalhe, baseada em coleção Jekyll (`_apps/`).

## Subtarefas
- [ ] 4.1 Configurar coleção `apps` no `_config.yml` (output + permalink + defaults)
- [ ] 4.2 Criar listagem `/apps/` com cards
- [ ] 4.3 Criar layout de detalhe de app com stack/links/screenshots

## Critérios de Sucesso
- `/apps/` lista apps e prioriza `featured`.
- Cada app em `_apps/` gera uma página em `/apps/:name/`.

## Dependências
- 2.0 concluída.

## Observações
- Conteúdo editável via markdown.

## markdown

## status: completed # Opções: pending, in-progress, completed, excluded

<task_context>
<domain>engine/frontend/apps</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>medium</complexity>
<dependencies>http_server</dependencies>
</task_context>

# Tarefa 4.0: Seção Apps (coleção + listagem + detalhe)

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Implementar a seção de Apps como coleção Jekyll, criando cards e páginas de detalhe para servir como vitrine de portfólio.

<requirements>
- Coleção `apps` habilitada com `output: true` e `permalink`.
- Listagem em `/apps/` com cards.
- Detalhe de app com stack/links e screenshots (quando existir).
</requirements>

## Subtarefas

- [ ] 4.1 Atualizar `_config.yml` com `collections.apps` e `defaults` de layout
- [ ] 4.2 Criar `apps/index.md` + `_layouts/apps.html`
- [ ] 4.3 Criar `_layouts/app.html` e adicionar conteúdo em `_apps/`

## Detalhes de Implementação

Referência: `tasks/prd-site-profissional/techspec.md` (seções: Modelos de dados, Apps, Collections).

## Critérios de Sucesso

- Navegação Apps → detalhe → voltar funciona.
- Conteúdo dos apps aparece corretamente.

## Arquivos relevantes
- `_config.yml`
- `_apps/`
- `apps/index.md`
- `_layouts/apps.html`
- `_layouts/app.html`

