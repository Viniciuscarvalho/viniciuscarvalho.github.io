---
layout: post
title: SwiftUI — Building an animated credit card
date: 2020-07-29 12:00:36 +0530
categories:
  - iOS,
  - SwiftUI,
  - Apple
lang: en
alternate: /ios,/swiftui,/apple/2020/07/29/SwiftUI-Implementando-um-visual-de-cart%C3%A3o-de-cr%C3%A9dito-animado.html
permalink: /en/ios,/swiftui,/apple/2020/07/29/SwiftUI-Implementando-um-visual-de-cart%C3%A3o-de-cr%C3%A9dito-animado.html
---
Hello, scholars and diplomats! Before diving into SwiftUI, here’s the story behind that greeting. My friends and I used to greet each other in unusual ways. One day, someone started calling us scholars and diplomats because of [this Trapalhões video](https://www.youtube.com/watch?v=G8nFFJLEGtA). We found it funny, and the greeting stuck. Now, on to the code! o/

As I mentioned last week, I’ve been studying SwiftUI and experimenting with Xcode 12 and Swift 5.2 on the Big Sur beta. I built a simple project displaying the front of a card, animating a flip, and adding a name and number. It’s straightforward, but I was able to reproduce it thanks to what I’d learned in the course. Here’s how I divided the work.

First, we create the front and back of the card with a gradient, roughly like this:

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
Pay close attention to where your stacks close in SwiftUI, since misplaced braces often cause errors. The code above shows how easy it is to apply a color gradient and define its start and end points.

Next, we’ll make the card flip. This part is even easier.

In `ContentView`, we create the following structure:

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

Now the card can rotate around the Y axis, as shown, or around the other axes. Notice the variable controlling the flip: state is a key part of SwiftUI.

Finally, add the elements that fill out the card:

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

Very simple!

Seeing how easy it was to manipulate and flip a card without any extra libraries, and to build these animations quickly, made me even more excited about SwiftUI.

The complete code is in [this GitHub repository](https://github.com/Viniciuscarvalho/CreditCardExampleSwiftUI) if you want to download, build, and test it. Remember that this example requires Xcode 12 and an up-to-date Swift version for that release.

This week’s post was shorter. I’ll keep sharing what I learn from the course, and next week I’ll try to walk through building a flow in a SwiftUI project.


See you next week!
