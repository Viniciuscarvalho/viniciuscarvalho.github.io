---
layout: post
title: Cloning Airbnb with SwiftUI
date: 2020-08-19 12:00:36 +0530
categories:
  - iOS,
  - SwiftUI
lang: en
alternate: /ios,/swiftui/2020/08/19/Clone-do-Airbnb-em-SwiftUI.html
permalink: /en/ios,/swiftui/2020/08/19/Clone-do-Airbnb-em-SwiftUI.html
---
Hello to everyone arriving at the blog! It’s been a few days since my last post. I’ve been short on time while moving from Itaú to iFood, a new challenge. After just a few weeks, I can already tell this will be an exciting project with plenty of room to grow. With that said, let’s return to the side project, which hasn’t stopped! o/

Two weeks ago, I started recreating interfaces from major apps in SwiftUI. Airbnb was the first one I chose.

I thought I’d build the home screen easily and write about it the next day. I was wrong! I started by organizing the screen into stacks, as we do in SwiftUI:

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

This was meant to look like the first card on Airbnb’s original home screen. It didn’t turn out as expected: I was working with a screenshot from the app and couldn’t get `.cornerRadius(borderRounded)` to round it properly. I moved on to the second part, a horizontally scrolling set of cards:

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

Then I ran into another obstacle. I was creating an array to populate `ForEach`, but the loop didn’t seem to run, and I also got initialization errors:

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

The problem here is that `Home` isn’t initialized, so it can’t iterate through the array. :(

I hesitated to share this less-than-pleasant SwiftUI experience, but it was a useful lesson in structuring a view. A screen that seems simple requires a new way of thinking, and I’m still learning it.

If you have suggestions for improving these first two sections, feel free to send a PR or comment on the [GitHub project](https://github.com/Viniciuscarvalho/reproduce-projects-SwiftUI). I’ll be back in two weeks to continue the story and see whether I’ve solved these issues.

See you soon!
