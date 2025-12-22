# Template de Especificação Técnica

## Resumo Executivo

Esta fase adiciona **conteúdo real de portfólio** usando a coleção Jekyll `_apps/`. Vamos criar dois itens:

- **GastandoYa** como um app/case completo (texto, features, integrações, links).
- Um **case visual** (app com foco em screenshots) para servir como portfólio mesmo sem texto extenso.

A implementação continua simples: Markdown + front matter em `_apps/`, renderizado pelos layouts existentes (`_layouts/apps.html` e `_layouts/app.html`).

## Arquitetura do Sistema

### Visão Geral dos Componentes

- **Jekyll**: processa coleção `_apps/` e gera páginas em `/apps/:name/`.
- **Layouts**:
  - `_layouts/apps.html` (listagem)
  - `_layouts/app.html` (detalhe)
  - `_layouts/home.html` (featured + últimos posts)
- **Tailwind**:
  - `assets/css/main.css` → `assets/css/site.css`
  - `@tailwindcss/typography` para conteúdo rico (`prose prose-invert`)

## Design de Implementação

### Interfaces Principais

N/A (site estático).

### Modelos de Dados

#### App/Case (`_apps/*.md`)

Continuar usando o modelo já existente:

- `title`, `tagline`, `description`
- `status`, `featured`
- `stack` (lista)
- `links` (objeto: `website`, `app_store`, `github`)
- `cover_image`
- `screenshots` (lista de paths)
- `highlights` (lista)

Recomendação para o **GastandoYa**:

- `links.website = "https://www.gastandoya.com.br"`
- `links.app_store` (se existir)
- `highlights` cobrindo features principais (metas, iCloud, Notion, import CSV/PDF, premium)

### Endpoints de API

N/A.

## Pontos de Integração

- Link externo para o site do app: [GastandoYa](https://www.gastandoya.com.br)

## Abordagem de Testes

### Testes Unitários

N/A. Validação:

- Build local e em CI sem erros.
- Conferência visual: listagem e páginas de detalhe renderizando corretamente.
- Links externos funcionando.

## Sequenciamento de Desenvolvimento

### Ordem de Construção

1. Criar/atualizar `GastandoYa` em `_apps/` com conteúdo real.
2. Criar o case visual em `_apps/` e garantir imagens em `assets/`.
3. Ajustar Home para destacar os dois.
4. Polimento final (copy, links, consistência).

### Dependências Técnicas

- Imagens do portfólio precisam existir no repositório em `assets/`.

## Considerações Técnicas

### Decisões Principais

- Continuar com **coleção `_apps/`** por simplicidade e manutenção.
- Focar em **conteúdo** e **curadoria** para elevar percepção profissional.

### Riscos Conhecidos

- **Assets faltando**: se `screenshots` apontar para arquivos inexistentes, a página renderiza com imagens quebradas.

### Requisitos Especiais

- Garantir que imagens sejam otimizadas (formatos e dimensões razoáveis).

### Conformidade com Padrões

- (N/A) Não há regras adicionais em `.cursor/rules` fornecidas nesta workspace.

### Arquivos relevantes

- Conteúdo:
  - `_apps/gastandoya.md`
  - `_apps/portfolio-visual.md`
- Layout:
  - `_layouts/apps.html`
  - `_layouts/app.html`
  - `_layouts/home.html`
- Assets:
  - `assets/`


