# Template de Documento de Requisitos de Produto (PRD)

## Visão Geral

O site atual é um blog pessoal em Jekyll. O objetivo é transformá-lo em um **site profissional** que una:

- **Portfólio** (apresentação profissional e posicionamento)
- **Apps/Produtos** (vitrine com páginas de detalhe)
- **Blog** (posts existentes continuam publicados e fáceis de navegar)

A base criativa/intelectual do visual e estrutura é inspirada nos templates [Sampo](https://onepagelove.com/sampo) e [Najaf](https://onepagelove.com/najaf), mantendo a implementação simples (Jekyll/Liquid, sem React) e com **visual dark-only**.

## Objetivos

- Tornar o site uma “home” profissional para compartilhar apps, conteúdo e perfil.
- Criar uma seção de **Apps** com listagem e páginas de detalhe.
- Preservar e integrar o **Blog** (posts existentes) na nova navegação.
- Migrar a base visual para **Tailwind CSS**.
- Simplificar para **dark-only** (remover tema claro/toggle).
- Automatizar build e deploy no **GitHub Pages via GitHub Actions**.

## Histórias de Usuário

- Como visitante, eu quero entender rapidamente quem é o autor e o que ele faz, para decidir se devo entrar em contato.
- Como recrutador/cliente, eu quero ver apps/projetos e detalhes (stack, highlights, links), para avaliar experiência e qualidade.
- Como leitor, eu quero navegar e ler posts com conforto e boa tipografia, para consumir conteúdo técnico.
- Como dono do site, eu quero manter o frontend simples (sem React) para conseguir dar manutenção sozinho.

## Funcionalidades Principais

1. **Home (Landing)**
   1.1 Exibir hero com posicionamento e CTA para Apps/Blog.  
   1.2 Exibir highlights (ex: produto/arquitetura/sistema).  
   1.3 Exibir Apps em destaque (até 3).  
   1.4 Exibir últimos posts (até 3).  
   1.5 Exibir CTA de contato (LinkedIn/GitHub).

2. **Apps / Produtos**
   2.1 Listagem de apps em `/apps/` com cards (título, tagline, status, highlights).  
   2.2 Página de detalhe por app com descrição, stack, links e screenshots.  
   2.3 Conteúdo editável via markdown (coleção Jekyll).

3. **Blog**
   3.1 Listagem em `/blog/` com cards (data, título, excerpt).  
   3.2 Página de post com layout de leitura (`prose`), tags/categorias e link de retorno.  
   3.3 Busca opcional por posts (mantendo `search.json` + SimpleJekyllSearch).

4. **Sobre**
   4.1 Página `/sobre/` com narrativa profissional e links de contato.

5. **Tema / UI**
   5.1 Site dark-only (sem toggle).  
   5.2 Visual moderno e consistente (tipografia, cards, CTAs).  
   5.3 Responsividade (mobile-first).

6. **Build/Deploy**
   6.1 Tailwind compilado via workflow (GitHub Actions).  
   6.2 `bundle exec jekyll build` publica no GitHub Pages.

## Experiência do Usuário

- Navegação simples: **Home**, **Apps**, **Blog**, **Sobre**.
- Leitura confortável no blog (largura adequada, contraste, estilos de código).
- Cards e CTAs claros para guiar o usuário (apps, leitura, contato).
- Acessibilidade básica: foco visível, `aria-label`/`aria-controls` no menu mobile, bom contraste.

## Restrições Técnicas de Alto Nível

- **Sem React** (manutenção pelo autor).
- Manter **Jekyll** e posts existentes em `_posts/`.
- Adotar **Tailwind CSS** como base visual.
- Site deve ser **dark-only**.
- Deploy via **GitHub Actions** (GitHub Pages).

Detalhes de implementação serão abordados na Especificação Técnica.

## Não-Objetivos (Fora de Escopo)

- CMS/headless CMS (ex: Contentful/Sanity) neste momento.
- Backend próprio para o site (ex: APIs/DB) neste momento.
- Migração do blog para outra plataforma (ex: Ghost/Next.js).
- Área logada/administrativa.

(Nota: Riscos de implementação técnica serão detalhados na Tech Spec.)

## Questões em Aberto

- Quais apps/projetos devem entrar como “destaque” inicialmente?
- O site deve ficar 100% em PT-BR ou bilíngue (PT/EN)?
- Quer manter a busca de posts como elemento central do blog, ou opcional?


