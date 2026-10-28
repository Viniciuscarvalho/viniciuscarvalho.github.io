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



## The Pipeline (Jekyll)

O redesign preserva Jekyll e o acervo de Apps/Blog. Novos dados editoriais estão
em `_data/content.json` e `_data/projects.json`; estudos PT/EN em `_projects/`.

```bash
npm ci
bundle install
npm run build
node --test tests/networking.test.mjs
bundle exec jekyll build
node scripts/check.mjs --site
bundle exec jekyll serve
```

`npm run snapshot` atualiza somente os seis repositórios selecionados e mantém
as observações anteriores se a API falhar. O build normal é offline em relação
à API GitHub. Nunca colocar tokens em dados públicos.

Assets de networking, fontes OFL locais e bundles são gerados por
`npm run build:assets`. Os termos das fontes acompanham os arquivos publicados.
As imagens de projetos são composições próprias, não cópias das referências.

### Ativação de viniciuscarvalho.dev

A compra e o DNS ainda precisam ser concluídos. `_config.domain.yml` prepara a
URL futura; não altera a hospedagem por si só. No lançamento:

1. Configurar o domínio no registrador e em Settings → Pages conforme a
   [documentação oficial](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).
2. Atualizar `url` em `_config.yml` e `CNAME` juntos. Usar `SITE_URL` no build
   de assets com o mesmo endereço. Não gerar QR com configurações divergentes.
3. Gerar assets novamente, verificar HTTPS, canonical, OG e o QR em aparelhos.
4. Somente então divulgar o endereço e imprimir materiais.

Para ensaiar localmente a configuração futura:

```bash
SITE_URL=https://viniciuscarvalho.dev npm run build
bundle exec jekyll build --config _config.yml,_config.domain.yml
```

O workflow verifica PRs sem publicar e faz deploy apenas de `master`.
Rollback: reverter o commit de lançamento e executar novamente o workflow.
Testes em navegador automatizado não substituem importação de contato e leitura
do QR em iOS/Android reais; registrar essas etapas antes do lançamento.
