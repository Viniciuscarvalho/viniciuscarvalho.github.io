# [1.0] Pipeline de build/deploy (Tailwind + GitHub Actions + Jekyll) (M)

## Objetivo
- Garantir que o site compile Tailwind e gere o build do Jekyll automaticamente, publicando no GitHub Pages via GitHub Actions.

## Subtarefas
- [ ] 1.1 Adicionar configuração Tailwind (entrada `assets/css/main.css`, config e scripts npm)
- [ ] 1.2 Criar workflow de GitHub Pages (`.github/workflows/pages.yml`) com build Tailwind + Jekyll
- [ ] 1.3 Garantir que o build funcione em branches `main` e `master`

## Critérios de Sucesso
- O workflow roda sem erros e publica o conteúdo de `_site` no GitHub Pages.
- O CSS final é gerado como `assets/css/site.css` durante o build.

## Dependências
- PRD e Tech Spec existentes em `tasks/prd-site-profissional/`.

## Observações
- Tailwind precisa escanear arquivos de template (Liquid/HTML/MD) e também JS que contenha classes.

## markdown

## status: completed # Opções: pending, in-progress, completed, excluded

<task_context>
<domain>engine/infra/pages</domain>
<type>integration</type>
<scope>configuration</scope>
<complexity>medium</complexity>
<dependencies>http_server</dependencies>
</task_context>

# Tarefa 1.0: Pipeline de build/deploy (Tailwind + GitHub Actions + Jekyll)

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Configurar a cadeia de build para compilar Tailwind e gerar o site Jekyll em CI, publicando no GitHub Pages usando o padrão moderno de Pages via GitHub Actions.

<requirements>
- Tailwind configurado com `content` apontando para templates e JS relevantes.
- Workflow em `.github/workflows/pages.yml` builda Tailwind e executa `bundle exec jekyll build`.
- Publicação via `actions/deploy-pages`.
</requirements>

## Subtarefas

- [ ] 1.1 Criar `package.json`, `tailwind.config.js`, `postcss.config.js` e `assets/css/main.css`
- [ ] 1.2 Criar `.github/workflows/pages.yml` com etapas de Node, Ruby, Tailwind e Jekyll
- [ ] 1.3 Ajustar `.gitignore` e `exclude` no `_config.yml` para não poluir o build

## Detalhes de Implementação

Referência: `tasks/prd-site-profissional/techspec.md` (seções: Tailwind, GitHub Actions, CI/CD).

## Critérios de Sucesso

- Workflow executa e publica com sucesso no Pages.
- CSS final existe e é referenciado em `_includes/head.html`.

## Arquivos relevantes
- `.github/workflows/pages.yml`
- `package.json`
- `tailwind.config.js`
- `postcss.config.js`
- `assets/css/main.css`
- `_includes/head.html`
- `_config.yml`

