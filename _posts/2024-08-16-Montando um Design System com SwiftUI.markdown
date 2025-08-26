---
layout: post
title:  "Montando um Design System com SwiftUI"
date:   2024-08-16 12:00:36 +0530
categories: Swift, DesignSystem, SwiftUI 
---

Fala pessoal, voltei e já voltei com um desafio que nunca tinha encarado em todos esses anos nessa indústria vital. Criar um Design System, ainda mais que era em SwiftUI, algo que nunca tinha feito ou trabalhado antes, apenas em estudos.

## Problema
Aqui não vamos falar o porque devemos construir um Design System, mas sim a concepção de como construir um utilizando o SwiftUI e toda sua robustez, caramba ficou até bonito pareceu até escrito por IA.
Os primeiros problemas até chegar aqui foi a utilização ou não utilização dos componentes básicos do iOS, como buttons, shapes, entre outros, era feito um wrapper para que conseguisse utilizar algumas propriedades, vou mostrar um exemplo de como era usado anteriormente, 

![Componente_Antigo](https://imgur.com/NYtLGT4.png)

Como você observa em muitos dos componentes, ele tem no init tudo que ele vai receber e ser alterado, isso é bem ruim pois torna o componente engessado e todas as vezes que iria ser alterado não é usado o componente da Apple. Lembrando, alguns casos nem sempre vai dar pra usar o próprio que é disponibilizado pela Apple, mas em muitos outros casos conseguiremos utilizar o próprio.
"Ah Vinicius, mas eu conseguiria criar um convenience init para esses casos e não precisaria ficar passando toda hora isso, seria apenas uma vez."
Não, a tática aqui é usar Styles para poder resolver isso e também todo o poder do SwiftUI.

## Como resolver esse init engessado?
Aqui foi onde descobri todo o poder dos modifiers, no caso de um botão podemos aplicar um estilo a esse botão e utilizar alguns modificadores.
Vou mostrar como isso ficaria na prática com um botão e já não teríamos mais aquele init anterior,

```Swift
Button {
  
} label: {
  HStack {
    Spacer()
    Text("Continue")
    Spacer()
  }
  .padding(EdgeInsets(top: 12,
                      leading: 24,
                      trailing: 24)
                      )
}
.font(.system(.title2, design: .rounded, weight: .bold))
.foregroundColor(.yellow)
.background(Capsule().stroke(.yellow, lineWidthL 2))
```

Aqui é um simples botão que pode ser usado, mas ainda não está muito reusável correto? Pois teríamos que ficar replicando esse HStack e os modificadores todas as vezes.
Ai que surge a idéia de aplicar os Styles.

## Utilizando Style e Composição de Style
Quando construímos uma aplicação, normalmente queremos que as Views e os Controls tenham um estilo consistente em toda a aplicação, tanto para as tornar reconhecível para quem está utilizando, como para estabelecer um tema para a aplicação ou a ligação à marca de uma empresa, que é o que estou propondo aqui.
Para facilitar a aplicação do mesmo estilo a muitas views Button, uma opção é criar uma nova view de botão com uma API semelhante ao Button do SwiftUI e aplicar o estilo:

```Swift
struct MyButton<Label: View>: View {
  var action: () -> Void
  var label: label

  init(action: @escaping () -> Void, @ViewBuilder label: () -> Label) {
    self.action = action
    self.label = label()
  }

  var body: some View {
    Button {
      action()
    } label: {
        HStack {
          Spacer()
          label
          Spacer()
        }
        .padding(EdgeInsets(top: 12,
                            bottom: 12,
                            leading: 24,
                            trailing: 24)
                            )
      }
      .font(.system(.title2, design: .rounded, weight: .bold))
      .foregroundColor(.yellow)
      .background(Capsule().stroke(.yellow, lineWidth 2))
    }
}
```

Mas a grande sacada aqui não é a construção do botão e sim fazer um wrapper view que vai suportar esse convenience initiliazer que vai fazer esse wrapper, esse é o verdadeiro pulo do gato.

```Swift
extension MyButton where Label == Text {
  @_disfavoredOverload
  init(_ title: some StringProtocol, action: @escaping () -> Void) {
    self.action = action
    self.label = Text(title)
  }

  init(_ titleKey: LocalizedStringKey, action: @escaping () -> Void) {
    self.action = action
    self.label = Text(titleKey)
  }
}
```

Temos agora o style para aplicar e ficou muito fácil,

```Swift
VStack {
  MyButton("OK") {
    // Confirm
  }
  Button("Cancel") {
    // Wrong Button
  }
}
```

![Componente_Button_Style](https://imgur.com/0iCRAk9.png)

Aqui foi criado um style para aplicar em um Button simples, mas também podemos criar diferentes custom styles para, Toggle, Label, DisclosureGroup, ControlGroup, GroupBox, Form, todos esses são os possíveis que podem ser criados com esses Customs, isso foi um achado porque antes estava sendo feito um novo componente praticamente ao invés de fazer apenas essa utilização do do Style.
Isso tudo é direto do SwiftUI, muito massa.

## Utilização e Environment

A combinação Style, Modifier e Environment é a combinação perfeita para construir esses componentes e o mais legal disso tudo é que eu não sabia que tudo é feito a partir da propriedade de Label, tudo gira em torno da Label, mas como assim Vinicius? Vou explicar um pouco mais abaixo.

Aqui vamos fazer a definição do Style e a utilização com o seu Modifier,

```Swift
public struct PrimaryButtonStyle: ButtonStyle {
 public func makeBody(configuration: Configuration) -> some View {
  configuration.label
    .modifier(ButtonBaseModifier(
      buttonVariant: .primary,
      isPressed: configuration.isPressed
    ))
 } 
}

public extension ButtonStyle where Self == PrimaryButtonStyle {
  static var primary_button: Self { Self() }
}
```

No exemplo acima é possível ver que estamos fazendo uma extensão do protocolo do SwiftUI ButtonStyle, com o `where` é possível restringir esta extensão para que ela se aplique apenas quando o tipo `Self` for o PrimaryButtonStyle.

Já na parte do `modifier` é onde utilizamos o `ViewModifier` ele quem vai carregar basicamente os estados deste botão, tudo isso retirando a responsabilidade do componente e agregando quando for utilizar realmente, seja um focus, hover, pressed, esses estados que o botão pode carregar. Nesse caso estamos falando para o Button, mas isso vai funcionar para diferentes componentes que forem criados.

```Swift
@Environment(\.isEnabled) var isEnabled: Bool
@Environment(\.buttonLoading) var isLoading: Bool

@State var isFocused: Bool = false
@State var isHovered: Bool = false

let isPressed: Bool

var state: ButtonState {
  isLoading
    ? .loading
    : isEnabled
      ? isHovered
        ? .hover
        : isFocused
          ? .focus
          : .normal
      : .disabled
}

@ViewBuilder
func body(content: Content) -> some View {
  content
  //Variações e forma do Button
    .onFocus(@isFocused)
    .onHover(perform: { hovering in
      isHovered = hovering
    })
    .labelStyle(.button_label)
    .modifier(ButtonLoadingModifier()) //Utilização de outros modifier dentro de outros
    ...
}
```

## Muito a acrescentar

Isso tudo foi só uma parte do que está sendo feito e como pude aprender pra caramba a utilização desses Styles, Modifiers e composição dos meesmos, eu vou deixar alguns links muito interessantes que me guiaram nesse caminho e que me ajudaram a ter essas visões sobre a construção do Design System.

## Referências

- [Styling in SwiftUI](https://movingparts.io/styling-components-in-swiftui)
- [Talk sobre Design System com SwiftUI](https://youtube.com/watch?v=Z7rJKr6Jlho)
