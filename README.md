# Site profissional (Jekyll + Tailwind)

Este repositório contém meu site (Home + Apps + Blog + Sobre), construído com **Jekyll/Liquid** e estilizado com **Tailwind CSS** (dark-only). O deploy é feito no **GitHub Pages via GitHub Actions**.

## Requisitos

- Ruby (recomendado 3.2+)
- Bundler
- Node.js (recomendado 20+)

## Rodando localmente

1) Instale dependências Ruby:

```bash
bundle install
```

2) Instale dependências Node:

```bash
npm install
```

3) Gere o CSS do Tailwind (obrigatório para ver estilos):

```bash
npm run build:css
```

4) Suba o Jekyll:

```bash
bundle exec jekyll serve --livereload
```

Abra o endereço mostrado no terminal (geralmente `http://localhost:4000`).

### Desenvolvimento com “watch” do CSS

Em um terminal:

```bash
npm run watch:css
```

Em outro terminal:

```bash
bundle exec jekyll serve --livereload
```

## Conteúdo

- **Posts do blog**: `_posts/`
- **Apps/Produtos (coleção Jekyll)**: `_apps/`
  - Cada arquivo em `_apps/*.md` gera uma página em `/apps/:name/`.
- **Páginas**:
  - Home: `index.md` + `_layouts/home.html`
  - Apps: `apps/index.md` + `_layouts/apps.html`
  - Blog: `blog/index.md` + `_layouts/blog.html`
  - Sobre: `sobre/index.md`

## CSS (Tailwind)

- Entrada: `assets/css/main.css`
- Saída (gerada): `assets/css/site.css` (minificada)

Observação: `assets/css/site.css` é gerado no build (CI/local) e não é versionado.

## Deploy (GitHub Pages)

O workflow em `.github/workflows/pages.yml` faz:

1. `npm install`
2. `npm run build:css`
3. `bundle exec jekyll build`
4. Publica `_site` no GitHub Pages

No GitHub, configure **Settings → Pages** para usar **Source: GitHub Actions**.


