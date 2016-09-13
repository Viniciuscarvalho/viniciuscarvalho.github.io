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

```
Location stuff (you have 1 GPS)
Screen-drawing stuff (you have 1 display)
Stuff that talks to UIApplication.sharedApplication()
```
Não é aconselhável usar com,

```
File I/O
Networking
Message passing
Heap memory allocation
```

Que é onde entra o conceito de objetos mutáveis e não mutáveis, tem um artigo muito interessante que aborda isto mais aprofundando, que não é o enfoque deste post. [Struct or Classes](http://faq.sealedabstract.com/structs_or_classes/)


### O problema

A criação do meu modelo foi feita de forma padrão sem a utilização de nenhuma biblioteca para fazer o mapeamento do objeto desta forma,

```
init(json: NSDictionary) {
        self.title = json["title"] as? String
        self.body = json["body"] as? String
        self.url = json["html_url"] as? String
        self.date = json["created_at"] as? String
        
        let user = json["user"] as! NSDictionary
        let login = user.valueForKey("login")
        self.nameAuthor = login as? String
        
        let avatar = user.valueForKey("avatar_url")
        self.avatarURL = avatar as? String
    }
```

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

```
struct JSONValidatePullRequests {

    func convertToPullRequests(response: Array<NSDictionary>) -> [PullRequest] {
    
        var pullRequests = [PullRequest]()
        
        for info in response {
            let pullRequest = PullRequest(json: info)
            pullRequests.append(pullRequest)
        }
        
        return pullRequests
    }
}
```

Em seguida fiz a chamada com utilizando o [Alamofire](https://github.com/Alamofire/Alamofire),

```
import Alamofire

class PullRequestsNetworkController : NSObject {

    func getPullRequests(userName: String, repositoryName: String, callback: (Result<[PullRequest]>) -> ()) {
        
        let ids = ManagerRequests()
        ids.getPullRequests(userName, repositoryName: repositoryName) { result in
            
            switch result {
            case .Success(let value):
                
                let validatePullRequests = JSONValidatePullRequests()
                let pullRequests = validatePullRequests.convertToPullRequests(value)
                callback(.Success(pullRequests))
                
                break
            
            case .Failure(let error):
                callback(.Failure(error))
                break
            }
        }
    }
}
```

Veja que no caso de sucesso, eu estou fazendo aquela validação do meu JSON que tinha aplicado anteriormente na outra classe.
Por fim, na classe `ManagerRequests`, é feita a chamada completa com os estados possíveis da resposta do JSON e chamando meu JSONObject.

```
func getPullRequests(userName:String, repositoryName:String, completion: (Result<[NSDictionary]>) -> Void) {
        UIApplication.sharedApplication().networkActivityIndicatorVisible = true
        
        Alamofire.request(.GET, Routes.pullRequestsURL(userName, repositoryName: repositoryName)).response {
            (request, response, data, error) in
    
                guard error == nil else {
                    completion(.Failure(HTTPStatusCode(HTTPResponse: response)?.code()))
                    return
                }
                
                guard response!.statusCode == 200 else {
                    completion(.Failure(HTTPStatusCode(HTTPResponse: response)?.code()))
                    return
                }
                
                guard let jSONData = data,
                    let jSONObject = try? NSJSONSerialization.JSONObjectWithData(jSONData, options: []),
                    let jSONPullRequests = jSONObject as? NSArray
                    else {
                        completion(.Failure(HTTPStatusCode(HTTPResponse: response)?.code()))
                        return
                }
                
                self.validateJSONPullRequest(json: jSONPullRequests)
                
                completion(.Success(self.listAllJSON))
                return
        }
    }
```

Mas Vinicius, até ai tudo bem, o que foi que tu achou de difícil nisso? Nobre leitor, temos que usar as armas e ferramentas que temos em nossas mãos, se podemos fazer essa conversão e evitar esse trabalhar e deixar o código mais organizado melhor.

## Utilização de libs e resolvendo

Temos algumas bibliotecas que já fazem as duas coisas de fazer a leitura e transformação do objeto do JSON, [SwiftyJSON](https://github.com/SwiftyJSON/SwiftyJSON), outras que fazem somente a leitura desses objetos e o tornam mais fáceis de se trabalhar, [AlamofireObjectMapper](https://github.com/tristanhimmelman/AlamofireObjectMapper), [Unbox](https://github.com/JohnSundell/Unbox).

O conceito da biblioteca do `ObjectMapper` é fazer o suporte a classes e structs para o protocolo `Mappable`, da seguinte maneira

```
public protocol Mappable {
    init?(_ map: Map)
    mutating func mapping(map: Map)
    static func objectForMapping(map: Map) -> Mappable? // Optional
}
```
No uso do `ObjectMapper` temos que usar o operador `<-` que define a variável que teremos que mapear vindo do JSON.

```
func mapping(map: Map) {
        username    <- map["username"]
        age         <- map["age"]
        weight      <- map["weight"]
        array       <- map["arr"]
        dictionary  <- map["dict"]
        bestFriend  <- map["best_friend"]
        friends     <- map["friends"]
        birthday    <- (map["birthday"], DateTransform())
    }
```

Pois bem visto esses conceitos, faremos a conversão para o nosso modelo que estamos trabalhando que é o de `PullRequest`

```
import ObjectMapper

class PullRequestModel: Mappable {
    
    var authorName:String?
    var avatarURL:String?
    var title:String?
    var body:String?
    var url:String?
    var date:String?
    var state: String?
    
    required init?(_ map: Map) {
        mapping(map)
    }
    
    func mapping(map: Map) {
        authorName <- map["user.login"]
        avatarURL <- map["user.avatar_url"]
        title <- map["title"]
        body <- map["body"]
        url <- map["html_url"]
        date <- map["created_at"]
        state <- map["state"]
    }
}
```

Lembra que após receber os dados que teríamos que manipular no `Model` passamos para fazer uma classe de conversão do JSON, pois bem aqui não temos que trabalhar com isso, na biblioteca `AlamofireObjectMapper`, possui um método `.responseArray` que já faz isso e olha como fica,

```
func getPullRequests(userName:String, repositoryName:String, completion:([PullRequestModel]) -> Void) {
        UIApplication.sharedApplication().networkActivityIndicatorVisible = true
        Alamofire.request(.GET, Routes.pullRequestsURL(userName, repositoryName: repositoryName)).responseArray {
            (response: Response<[PullRequestModel], NSError>) in
            let result = response.result.value
                if let pulls = result{
                    completion(pulls)
                }
            }
    }

```

Muito mais fácil não? Há outras maneiras de fazer o tratamento deste JSON, mas só para mostrar como fazer a utilização da lib tornou mais fácil e rápido o desenvolvimento.

Gostaria de agradecer ao meu amigo [Bruno Luz](https://twitter.com/brunodlz) que me ajudou nessa missão de facilitar o tratamento do `Model` e segue alguns artigos que li quando estava fazendo este teste e produzindo esse post.

Obrigado e até a próxima!

[Objc.io](https://www.objc.io/issues/16-swift/swift-classes-vs-structs/)