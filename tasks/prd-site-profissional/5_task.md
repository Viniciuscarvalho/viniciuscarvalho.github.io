# [5.0] Blog (listagem, post, busca opcional) (M)

## Objetivo
- Integrar o blog ao novo layout e garantir boa experiência de leitura, com busca opcional.

## Subtarefas
- [ ] 5.1 Criar `/blog/` com listagem em cards
- [ ] 5.2 Atualizar layout de post para `prose prose-invert` (leitura + código)
- [ ] 5.3 Implementar busca opcional (search.json + SimpleJekyllSearch)

## Critérios de Sucesso
- `/blog/` lista posts, `/YYYY/MM/DD/...` abre posts com boa legibilidade.
- Busca não quebra páginas que não tenham searchbar.

## Dependências
- 2.0 concluída.

## Observações
- Tailwind precisa escanear JS com classes usadas em templates de busca.

## markdown

## status: completed # Opções: pending, in-progress, completed, excluded

<task_context>
<domain>engine/frontend/blog</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>medium</complexity>
<dependencies>http_server</dependencies>
</task_context>

# Tarefa 5.0: Blog (listagem, post, busca opcional)

<critical>Ler os arquivos de prd.md e techspec.md desta pasta, se você não ler esses arquivos sua tarefa será invalidada</critical>

## Visão Geral

Modernizar a apresentação do blog (listagem e post) e manter a busca opcional com `search.json`.

<requirements>
- `/blog/` usando layout próprio (`_layouts/blog.html`).
- Post usando `_layouts/post.html` com tipografia e estilos de código.
- Busca opcional usando `search.json` + `SimpleJekyllSearch`.
</requirements>

## Subtarefas

- [ ] 5.1 Criar `blog/index.md` e `_layouts/blog.html`
- [ ] 5.2 Atualizar `_layouts/post.html` para layout de leitura
- [ ] 5.3 Ajustar `assets/js/search.js` e garantir `tailwind.config.js` inclui JS em `content`

## Detalhes de Implementação

Referência: `tasks/prd-site-profissional/techspec.md` (seções: Blog, Busca, Tailwind content).

## Critérios de Sucesso

- Busca funciona em `/blog/` quando habilitada.
- Não há erros JS em páginas sem search.

## Arquivos relevantes
- `blog/index.md`
- `_layouts/blog.html`
- `_layouts/post.html`
- `search.json`
- `assets/js/search.js`
- `assets/js/simple-jekyll-search.min.js`
- `tailwind.config.js`

