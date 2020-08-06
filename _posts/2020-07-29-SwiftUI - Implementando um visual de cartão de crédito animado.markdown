---
layout: post
title:  "SwiftUI - Implementando um visual de cartão de crédito animado"
date:   2020-07-29 12:00:36 +0530
categories: iOS, SwiftUI, Apple 
---
Olá bacharéis e diplomatas, uma explicação rápida sobre a história dos bacharéis antes de entrar no assunto SwiftUI. Tinha um grupo de amigos que sempre nos cumprimentavamos de formas inusitadas e teve um famigerado dia que um deles chegou chamando todos de diplomatas e bacharéis tudo por causa desse [vídeo dos trapalhões](https://www.youtube.com/watch?v=G8nFFJLEGtA), assim ficou até hoje eles chamando disso pelo simples fato desse vídeo e eles acharem engraçado no momento. Bem a história de resumo foi essa e sigamos para o que interessa, código! o/

Na semana passada como vinha comentado estava estudando um pouco mais sobre SwiftUI e tentando fazer algumas coisas já com o Xcode 12 e Swift 5.2 aqui no beta do BigSur. Peguei um projeto simples de mostrar a frente de um cartão e fazer uma animação de virar e também acrescentar o nome e número nele, é bem simples mas acaba que foi com base no que tava estudando no curso que consegui reproduzir. Vou contar aqui como foi o processo e como foi dividido.

Primeiramente, a gente vai criar a parte da frente do cartão e o verso com o gradient, que ficaria mais ou menos assim,

```swift

struct CreditCardFront: View {

var body: some View {
	VStack(alignment: .leading) {
	
	"Nome"
	"Data de expirar"
	....
	
	}
	
}.frame(width: 300, height: 200)
 .padding()
 .background(LinearGradient(gradient: Gradient(colors: [Color(#colorLiteral(red: 0.5481430292, green: 0, blue: 0.4720868468, alpha: 1)), Color.blue]), startPoint: .topLeading, endPoint: .bottomTrailing))
 .cornerRadius(10)

}

```
Uma coisa para se atentar muito em SwiftUI é onde está se fechando as stacks porque isso é o que muitas vezes acaba resultando em erros. No código acima a gente vê que é bem simples aplicar o gradiente de cores e de onde ele começa e também onde termina.

Agora para um segundo passo a gente vai fazer o flip nesse cartão, ai vocês vão ver como é mais fácil ainda.

Na nossa `ContentView` a gente cria a seguinte estrutura,

```swift

@State private var degrees: Double = 0
@State private var flipped: Bool = false

@State private var name: String = ""
@State private var expires: String = ""
@State private var cvv: String = ""

var body: some View {
        VStack {
            CreditCard {
                
                VStack {
                    Group {
                        if flipped {
                            CreditCardBack(cvv: cvv)
                        } else {
                            CreditCardFront(name: name, expires: expires)
                        }
                    }
                }.rotation3DEffect(
                    .degrees(degrees),
                    axis: (x: 0.0, y: 1.0, z: 0.0)
                )
                
            }
            .onTapGesture {
                withAnimation {
                    degrees += 180
                    flipped.toggle()
                }
            }


```

Com isso a gente consegue fazer o cartão que criamos girar, seja no eixo Y como está marcado ali ou nos demais, simples não? Note que criamos uma variável para o flip, isso é muito usado em SwiftUI que trabalha com o State.

Por fim, você pode adicionar os elementos para preencher o seu cartão, 

```swift

Dentro do body da primeira estrutura...

			HStack(alignment: .top) {
                Image(systemName: "checkmark.circle.fill")
                    .foregroundColor(Color.white)
            
                Spacer()
                
                Text("VISA")
                    .foregroundColor(Color.white)
                    .font(.system(size: 24))
                    .fontWeight(.bold)
            
            }
            
            Spacer()
            
            Text("**** **** **** 2864")
                .foregroundColor(Color.white)
                .font(.system(size: 32))
            
            Spacer()
            
            HStack {
                
                VStack(alignment: .leading) {
                    Text("CARD HOLDER")
                        .font(.caption)
                        .fontWeight(.bold)
                        .foregroundColor(Color.gray)
                    
                    Text(name)
                        .font(.caption)
                        .fontWeight(.bold)
                        .foregroundColor(Color.white)
                    
                }
                
                Spacer()
                
                VStack {
                    Text("EXPIRES")
                        .font(.caption)
                        .fontWeight(.bold)
                        .foregroundColor(Color.gray)
                    Text(expires)
                        .font(.caption)
                        .fontWeight(.bold)
                        .foregroundColor(Color.white)
                }
                
            }


```

Simples demais!

Quando eu olhei a aula e vi como era fácil manusear e virar um cartão sem lib alguma e fazendo essas animações rapidamente acho que fiquei mais entusiasmado por fazer algo em SwiftUI.

Eu vou deixar o código completo aqui nesse [link do Github](https://github.com/Viniciuscarvalho/CreditCardExampleSwiftUI) pra quem quiser compilar e baixar e testar, lembrando que precisa do Xcode 12 e o Swift mais atual.

Essa semana foi bem mais compacto e vou tentando mostrar um pouco mais do curso. Na semana que vem vou tentar trazer o desenvolvimento passo a passo de um fluxo em SwiftUI de algum projeto.


Até semana que vem!

