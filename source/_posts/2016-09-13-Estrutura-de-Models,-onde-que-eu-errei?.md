---
layout: post
title: "Estrutura de Models, onde que eu errei?"
date: 2016-09-13 16:40:00
comments: true
description: "Em um teste, acabei vendo como compliquei a situação com a utilização e o mapeamento errado de objetos no modelo de minha aplicação."
keywords: ""
categories:
- iOS
tags:
- iOS
---

### Conceituando o Model

Fala pessoal, tudo beleza com vocês né? Estava eu fazendo um teste de admissão e me deparei com a seguinte situação, como seperar a minha lógica de receber os dados de uma API e fazer a interpreção para objetos? Você pensa, "ah, vou colocar no `Model` e depois fazer a conversão do objeto em outra classe, fica mais fácil." Enganado!

Comecei fazendo a aplicação com este pensamento, de utilizar do `init(json: NSDictionary)` e tudo iria ser mais fácil, já que estava acostumado a fazer dessa maneira padrão do iOS.
Um outro conceito que é importante observarmos é quando usar o `Class` e o `Struct`, no Swift temos muito bem aplicado esse conceito de Value Types e as vezes acabamos utilizando-os da maneira incorreta. Um exemplo, devemos usar o `Struct` com,

`Location stuff (you have 1 GPS)`,
`Screen-drawing stuff (you have 1 display)`,
`Stuff that talks to UIApplication.sharedApplication()`

Não é aconselhável usar com,

`File I/O`, `Networking`, `Message passing`, `Heap memory allocation`

Que é onde entra o conceito de objetos mutáveis e não mutáveis, tem um artigo muito interessante que aborda isto mais aprofundando, que não é o enfoque deste post. [Struct or Classes](http://faq.sealedabstract.com/structs_or_classes/)


### O problema

A criação do meu modelo foi feita de forma padrão sem a utilização de nenhuma biblioteca para fazer o mapeamento do objeto desta forma,

<script src="https://gist.github.com/Viniciuscarvalho/3b062afa7e9f6166575237a4d7083bdd.js"></script>

Não que desta maneira esteja errado de inicializar e ler os dados do JSON, mas fica mais complicado na hora de conversão para objeto. Pois bem, o retorno do JSON é desta maneira,

```
[
  {
    "url": "https://api.github.com/repos/elastic/elasticsearch/pulls/20453",
    "id": 85080406,
    "html_url": "https://github.com/elastic/elasticsearch/pull/20453",
    "diff_url": "https://github.com/elastic/elasticsearch/pull/20453.diff",
    "patch_url": "https://github.com/elastic/elasticsearch/pull/20453.patch",
    "issue_url": "https://api.github.com/repos/elastic/elasticsearch/issues/20453",
    "number": 20453,
    "state": "open",
    "locked": false,
    "title": "[Packaging] Fix Bats upgrade tests",
    "user": {
      "login": "tlrx",
      "id": 642733,
      "avatar_url": "https://avatars.githubusercontent.com/u/642733?v=3",
      "gravatar_id": "",
      "url": "https://api.github.com/users/tlrx",
      "html_url": "https://github.com/tlrx",
      "followers_url": "https://api.github.com/users/tlrx/followers",
      "following_url": "https://api.github.com/users/tlrx/following{/other_user}",
      "gists_url": "https://api.github.com/users/tlrx/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/tlrx/starred{/owner}{/repo}",
   }
```

Onde teríamos que fazer a conversão em um Array de `Dictionaries` correto? Então criei uma classe para fazer essa conversão e poder receber os meus objetos e trabalhar com eles na minha tabela.

Primeiro criei uma validação para meu JSON,

<script src="https://gist.github.com/Viniciuscarvalho/d27a100b3f5966d0c54880464c987384.js"></script>

Em seguida fiz a chamada com utilizando o [Alamofire](https://github.com/Alamofire/Alamofire),

<script src="https://gist.github.com/Viniciuscarvalho/28738b87531f49a82e759ce4514035ee.js"></script>

Veja que no caso de sucesso, eu estou fazendo aquela validação do meu JSON que tinha aplicado anteriormente na outra classe.
Por fim, na classe `ManagerRequests`, é feita a chamada completa com os estados possíveis da resposta do JSON e chamando meu JSONObject.

<script src="https://gist.github.com/Viniciuscarvalho/9ec5b2f32aa48b7f12b61f40e0f1d6c8.js"></script>

Mas Vinicius, até ai tudo bem, o que foi que tu achou de difícil nisso? Nobre leitor, temos que usar as armas e ferramentas que temos em nossas mãos, se podemos fazer essa conversão e evitar esse trabalhar e deixar o código mais organizado melhor.

## Utilização de libs e resolvendo

Temos algumas bibliotecas que já fazem as duas coisas de fazer a leitura e transformação do objeto do JSON, [SwiftyJSON](https://github.com/SwiftyJSON/SwiftyJSON), outras que fazem somente a leitura desses objetos e o tornam mais fáceis de se trabalhar, [AlamofireObjectMapper](https://github.com/tristanhimmelman/AlamofireObjectMapper), [Unbox](https://github.com/JohnSundell/Unbox).

O conceito da biblioteca do `ObjectMapper` é fazer o suporte a classes e structs para o protocolo `Mappable`, da seguinte maneira

<script src="https://gist.github.com/Viniciuscarvalho/3614e0c7af090e126d8a5e2ea7b4ba1c.js"></script>

No uso do `ObjectMapper` temos que usar o operador `<-` que define a variável que teremos que mapear vindo do JSON.

<script src="https://gist.github.com/Viniciuscarvalho/bed2ded4e5b048ab245dd86c091ff446.js"></script>

Pois bem, visto esses conceitos, faremos a conversão para o nosso modelo que estamos trabalhando que é o de `PullRequest`

<script src="https://gist.github.com/Viniciuscarvalho/27fafd4715e4f1ddf69b04a2f0631649.js"></script>

Lembra que após receber os dados que teríamos que manipular no `Model` passamos para fazer uma classe de conversão do JSON, pois bem aqui não temos que trabalhar com isso, na biblioteca `AlamofireObjectMapper`, possui um método `.responseArray` que já faz isso e olha como fica,

<script src="https://gist.github.com/Viniciuscarvalho/524e43102817849068c95e8e3bf004b5.js"></script>

Muito mais fácil não? Há outras maneiras de fazer o tratamento deste JSON, mas só para mostrar como fazer a utilização da lib tornou mais fácil e rápido o desenvolvimento.

Gostaria de agradecer ao meu amigo [Bruno Luz](https://twitter.com/brunodlz) que me ajudou nessa missão de facilitar o tratamento do `Model` e segue alguns artigos que li quando estava fazendo este teste e produzindo esse post.

Obrigado e até a próxima!

[Objc.io](https://www.objc.io/issues/16-swift/swift-classes-vs-structs/)