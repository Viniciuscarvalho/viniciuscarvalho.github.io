---
layout: post
title:  "Utilizando VSCode/Cursor para desenvolver para iOS"
date:   2025-08-19 12:00:36 +0530
categories: Swift, IA, SwiftUI, Claude
---

# Aproveitando todo o hype e uso das IAs

Nos últimos tempos quem não utiliza alguma IA pode se sentir que está um pouco atrasado ou ficando para trás não é mesmo?
Existem inúmeras hoje em dia, ChatGPT, Gemini, Deepseek, não irei entrar no mérito de explicar o que cada uma é qual modelo utiliza e como funciona, vou tentar abordar o uso do VSCode/Cursor com o [Claude AI](https://claude.ai) que é um Agent para diversas IDEs, mas aqui no caso iremos utilizar o Cursor. Há também uma atualização do Xcode 26 que traz muitas melhorias e integração com essas diversas ferramentas, vou deixar o [link](https://wendyliga.com/blog/xcode-26-custom-model/) aqui para testarem caso estejam na beta, já que esse texto está saindo em agosto.

Vamos lá!

## Setup IDE

Vamos começar baixando o [Cursor](www.cursor.com), ele é free, mas tem algumas features que podem ser pagar com a inscrição de $20, uma vez instalado vamos para as extensões e brews necessárias para transformar nosso editor em uma ferramente bem melhor que o Xcode (?), só o tempo dirá!

### Instalações

1. `SweetPad`
2. `brew install xcode-build-server`
3. `brew install xcbeautify`
4. `brew install swiftformat` 


1) SweetPad

A instalação da extensão pode ser feita tanto no VSCode quanto no Cursor e para rodar o simulador é bem simples, é posseivel selecionar o ícone de um bombom na barra do Cursor e você conseguirá visualizar e buildar o seu projeto iOS.

2) Xcode Build Server

Responsável pelo auto-complete, ir diretamente para a definição, error highlight.

3) `brew install ios-deploy` e Xcbeautify

Torna muito mais fácil a leitura no terminal diretamente nas IDEs e errors logs.

4) Swift Language Support

Importante para termos a leitura correta do Swift nas IDEs

## Setup projeto

Aqui eu vou utilizar o Cursor que fica mais prático e estou tentando direcionar tudo por lá, mas também pode ser no VSCode.
É necessário um projeto criado no Xcode ou você também pode criar um do zero para depois abri-lo diretamente no Cursor, 
após ter aberto o projeto,

Para conseguir gerar essa tela é necessário fazer o comando, `CMD+SHIFT+P` e selecionar o `Sweetpad: Generate Build Server Config`

Isso irá criar o `buildServer.json` e irá para a raíz do projeto e habilita o Xcode Build Server para funcionar com o seu diretório.

<a href="https://ibb.co/0LYr1w5"><img src="https://i.ibb.co/YSfhJrg/Captura-de-Tela-2025-08-19-s-18-36-28.png" alt="Captura-de-Tela-2025-08-19-s-18-36-28" border="0"></a>

SweetPad para gerar o projeto tanto com Tuist, Xcodegen ou Build

Após isso e clicar no botão de running você também vai ver que há a lista de simuladores disponíveis para poder rodar o projeto,

<a href="https://ibb.co/nqWFB7YM"><img src="https://i.ibb.co/kVdtJ4w2/Captura-de-Tela-2025-08-19-s-18-51-33.png" alt="Captura-de-Tela-2025-08-19-s-18-51-33" border="0"></a>

**Atenção**
Lembre-se de abrir o info.plist e verificar todas as permissões que são enviadas do seu app, para não ter nada de envio que não queira e aja alguma brecha.

## Quais features você terá com o Cursor?

O que mais queria utilizar do Cursor era o autocomplete diretamente com o AI-based, porém isso também já possuímos no Xcode correto? Mas sabemos que isso não é tão bom... Aqui gostaria de tirar o melhor e mais completo dessa feature de acordo com o contexto do projeto e assim ter uma assertividade ainda melhor com o Cursor.

### Inline Edit

Pressionando `CMD+K` em uma linha vazia permitirá que gere código contextual a partir de qualquer prompt. Também podemos pressionar o `CMD+K` em uma linha de código, o que irá incorporar o trecho de código revelante no prompt. Podemos a partir disso escrever um prompt solicitando uma refatoração ou qualquer outra coisa.

### Chat

Podemos pressionar o `CMD+L` que irá abrir o painel e nisso podemos escolher o modelo com quem podemos conversar e adicionar trechos de código, arquivos de acordo com o contexto, isso facilita e muito nosso trabalho. Aqui claramente poderíamos usar a interface do ChatGPT ou do Claude web de ambos, mas o Cursor permite que você fazer isso sem mudar de contexto diretamente no editor do código. Pra mim isso é o grande gap entre o Cursor e o Xcode hoje em dia e agiliza muito a codificação.

### Composer

Esse é uma feature muito semelhante ao do Chat, mas é útil se precisamos editar e gerar vários arquivos. Acho que isso possa ser bom em projetos quando criados do zero, em projetos já estruturados não seja de grande valia para utilizar isso.

## Considerações finais

Tenho estudado e visto bastante coisa para utilizar com IA e porque não unir essas ferramentas ao que trabalhamos durante todo o dia que é o iOS, já que o Xcode ainda não tem essa potência de conseguir utilizar diretamente no Xcode, sem ser no Xcode 26, essa é uma perspectiva de trabalhar no seu projeto iOS com um editor diferente e conseguir ter todas as ferramentas e até mais que o próprio Xcode.

Um texto simples e prático de algumas coisas que venho estudando nos útlimos dias, muito bom voltar a escrever e tentarei manter uma frequência maior e com assuntos que estou estudando.

## Referências

https://dimillian.medium.com/how-to-use-cursor-for-ios-development-54b912c23941

https://www.reddit.com/r/ChatGPTPro/comments/1i00wmh/this_is_the_right_way_to_build_ios_app_with_ai/ 

https://wendyliga.com/blog/xcode-26-custom-model/

