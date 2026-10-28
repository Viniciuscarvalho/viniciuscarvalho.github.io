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

### Domínio público: viniciuscarvalho.dev

Compra confirmada pelo proprietário em 28/10/2026. A configuração canônica é
`url` em `_config.yml`, com `baseurl` vazio; `CNAME` registra o mesmo hostname.
QR, vCard, canonical, sitemap e URLs das imagens OG usam esse endereço no build.
Não é mais necessário overlay ou `SITE_URL` para usar o domínio definitivo.

O deploy usa GitHub Actions. Nesse modo, o arquivo CNAME não configura o domínio
no serviço: é necessário salvar o hostname em Settings → Pages.

1. Em [Settings → Pages](https://github.com/Viniciuscarvalho/viniciuscarvalho.github.io/settings/pages),
   selecionar Source **GitHub Actions**, informar **viniciuscarvalho.dev** em
   Custom domain e salvar.
2. No DNS do registrador, conferir os registros abaixo. Substituir apenas registros
   de estacionamento/redirecionamento que conflitem nesses hosts; preservar MX/TXT
   e outros registros usados por e-mail e verificações.

| Tipo | Nome | Valor |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | viniciuscarvalho.github.io |

O CNAME DNS de `www` é diferente do arquivo CNAME do repositório. Para IPv6,
usar os quatro AAAA documentados pelo GitHub, além dos A acima; não manter AAAA
apontando para hospedagem antiga.

3. Aguardar o DNS check e a emissão do certificado; ativar **Enforce HTTPS**
   quando disponível. A propagação DNS e a disponibilidade do HTTPS podem levar
   até 24 horas, segundo a documentação oficial.
4. Integrar a alteração de domínio na master e confirmar o workflow de deploy.
5. Validar `https://viniciuscarvalho.dev/`, `/en/`, `/card/`, `/card/?stage=1`,
   sitemap, canonical e preview OG. O QR e a vCard devem apontar para
   `https://viniciuscarvalho.dev/card/`. Conferir redirecionamento de `www` e
   de HTTP para HTTPS, além de importar contato e escanear QR em aparelhos.

[Documentação oficial de domínio/DNS](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).
Os testes automatizados verificam consistência do build; não comprovam DNS,
certificado ou Settings → Pages. Essas verificações públicas continuam pendentes.
O conector GitHub disponível nesta execução não permite administrar Pages.

O workflow verifica PRs sem publicar e faz deploy apenas de `master`.
Rollback: reverter o commit de domínio e executar o workflow; DNS e Custom domain
são configurações separadas e precisam ser revertidos coerentemente, se alterados.
Não voltar a divulgar o domínio antigo vencido.

### Testes de navegador

Depois de gerar `_site`, execute:

```bash
npx playwright install chromium
npm run test:browser
```

O CI executa a mesma suíte em Chromium. Ela cobre conteúdo sem JavaScript,
idiomas, filtros/grade, teclado, mudança de reduced-motion, QR/palco, saída
imediata do flip, falhas/cancelamento de compartilhamento e permissão de sensor.
Isso não substitui a validação física de giroscópio, importação do vCard e
leitura do QR. O giroscópio só é solicitado após tocar em “Ativar movimento”.

Os PRs de continuação são empilhados: base #19 → motion → acabamento do card.
Mesclar na ordem e revisar a base dos PRs seguintes quando cada um entrar.
