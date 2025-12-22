# Template de Documento de Requisitos de Produto (PRD)

## Visão Geral

O site já foi modernizado (Jekyll + Tailwind, dark-only) e agora precisa de **conteúdo real** para servir de base profissional e portfólio.

Esta fase foca em:

- Transformar o app **GastandoYa** (baseado no site público) em um **case/app completo** dentro da seção **Apps**, com descrição, stack, highlights, features e links.
- Adicionar um **segundo app/case** focado em portfólio, mesmo que inicialmente ele tenha apenas imagens (screenshots) e uma descrição breve.
- Ajustar finamente a Home para destacar esses projetos e alinhar a narrativa.

Referência de conteúdo do app: [GastandoYa](https://www.gastandoya.com.br).

## Objetivos

- Fazer a seção **Apps** parecer um portfólio de verdade, com pelo menos **2 itens fortes**:
  - 1 app com conteúdo completo (GastandoYa)
  - 1 case/app com foco visual (imagens/screeenshots)
- Melhorar clareza do posicionamento e CTAs da Home.
- Manter manutenção simples (sem React) e sem “gambiarras” de build.

## Histórias de Usuário

- Como recrutador/cliente, eu quero ver um app com descrição completa (problema, solução, features, stack, links), para avaliar profundidade.
- Como visitante, eu quero entender rapidamente o que o GastandoYa faz e por que é relevante, para explorar mais.
- Como visitante, eu quero ver um app/case visual para entender “qualidade de UI” e atenção a detalhes.
- Como dono do site, eu quero adicionar novos apps/cases em Markdown sem mexer em código complexo.

## Funcionalidades Principais

1. **App/Case: GastandoYa**
   1.1 Criar/atualizar documento em `_apps/` com conteúdo real.  
   1.2 Adicionar seção de features (baseado no site).  
   1.3 Adicionar links (site, App Store quando existir, contato/suporte).  
   1.4 Adicionar screenshots (quando disponíveis no repositório).  

2. **App/Case: Portfólio Visual (imagens)**
   2.1 Criar documento em `_apps/` com foco em screenshots e descrição breve.  
   2.2 Exibir como card na listagem e incluir no “featured” se fizer sentido.  

3. **Ajustes finos de Home**
   3.1 Ajustar textos e destaques para refletir os dois apps/cases.  
   3.2 Garantir que “Apps em destaque” liste os novos itens.  

## Experiência do Usuário

- Home com mensagem direta e CTAs claros.
- Página do GastandoYa com boa hierarquia: resumo → features → integrações/premium → links.
- Página do case visual com galeria de imagens.
- Responsivo e consistente no dark-only.

## Restrições Técnicas de Alto Nível

- Manter **Jekyll/Liquid** (sem React).
- Conteúdo em **Markdown** dentro da coleção `_apps/`.
- Tailwind deve continuar “purgeando” corretamente (garantir classes usadas em templates/JS).
- Imagens devem ser servidas como assets estáticos do repositório.

Detalhes de implementação serão abordados na Especificação Técnica.

## Não-Objetivos (Fora de Escopo)

- Refazer o design inteiro novamente.
- Criar CMS.
- Implementar blog bilíngue nesta fase.

(Nota: Riscos de implementação técnica serão detalhados na Tech Spec.)

## Questões em Aberto

- Quais **imagens/screenhots** do case visual serão adicionadas (e em quais tamanhos)?
- O GastandoYa já possui link público de App Store? (Se sim, qual?)


