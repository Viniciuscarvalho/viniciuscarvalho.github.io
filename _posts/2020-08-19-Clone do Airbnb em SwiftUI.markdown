---
layout: post
title:  "Clone do Airbnb em SwiftUI"
date:   2020-08-19 12:00:36 +0530
categories: iOS, SwiftUI 
---
Olar a todos que estão chegando nesse blog, passaram-se alguns dias desde que escrevi a última vez, foi por falta de tempo mesmo, estava em processo de transição saindo do Itaú e indo para o iFood, um novo desafio e com poucas semanas aqui sei que vai ser muito massa encarar esse grande projeto que tem muito ainda a crescer, dito isto vamos ao projeto que não parou. o/

A duas semanas, comecei um projeto de replicar interfaces de grandes projetos em SwiftUI, o primeiro que vi foi o do Airbnb.

Cheguei esperançoso de que iria criar facilmente a home e em um dia ia estar escrevendo novamente, grande engano. Primeiro, comecei estruturando a tela em stacks como é mais ou menos no SwiftUI,

```swift
// First card with big image
        ScrollView {
            VStack() {
                Image("airbnb-home-cardPrincipal")
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .frame(width: self.width, height: self.height)
            }
            .cornerRadius(borderRounded)

```

Esse era pra ficar igual ao primeiro card que aparece na home do Airbnb original, não ficou muito bem como eu esperava, pois se tratava de uma imagem que estava tentando manusear onde tinha tirado o print da imagem original do app e não consegui fazer com que ela ficasse arredondada com isso `.cornerRadius(borderRounded)`...Parti para a segunda parte que era fazer o scroll horizontal dos cards como está aqui,

```swift
            GeometryReader { bounds in
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 20) {
                        ForEach(homeData) { item in
                            GeometryReader { geometry in
                                Home(item)
                                    .rotation3DEffect(Angle(degrees:
                                        Double(geometry.frame(in: .global).minX - 30) / -getAngleMultiplier(bounds: bounds)
                                    ), axis: (x: 0, y: 10, z: 0))
                            }
                            .frame(width: 275, height: 275)
                        }
                    }
                    .padding(30)
                    .padding(.bottom, 30)
                }
            }
```

Entretanto, encarei de frente com outro empecilho que quis fazer, estava criando um array que serviria para popular o meu `ForEach` mas não deu muito certo pois parece que ele não estava percorrendo o for e também apresentava erro de inicialização nos mesmos,

```swift
struct Home: Identifiable {
    var id = UUID()
    var image: Image
    var color: Color
}

let homeData = [
    Home(text: "Online Experiences", image: Image(uiImage: #imageLiteral(resourceName: "airbnb-home-card1")), color: Color(#colorLiteral(red: 0.2196078449, green: 0.007843137719, blue: 0.8549019694, alpha: 1))),
    Home(text: "Unique stays", image: Image(uiImage: #imageLiteral(resourceName: "airbnb-home-card2")), color: Color(#colorLiteral(red: 0.2196078449, green: 0.007843137719, blue: 0.8549019694, alpha: 1))),
    Home(text: "Entire homes", image: Image(uiImage: #imageLiteral(resourceName: "airbnb-home-card3")), color: Color(#colorLiteral(red: 0.2196078449, green: 0.007843137719, blue: 0.8549019694, alpha: 1)))
]

```

Aqui o problema é de não inicialização do `Home` e ai ele não consegue percorre o array :(

Eu tava relutante em trazer essa experiência não muito agradável que tive com SwiftUI, mas foi legal pra aprender e ver como estruturar melhor a view para montar uma tela que parece bem simples, mas é uma nova concepção que ainda estou aprendendo.

Quem tiver sugestões ou souber como melhor adaptar essas duas primeiras partes da tela, pode mandar PR, comentar no projeto do [Github](https://github.com/Viniciuscarvalho/reproduce-projects-SwiftUI) que daqui 15 dias eu volto com a continuação dessa saga pra ver se resolvi ou não esse projeto.

Até mais!





