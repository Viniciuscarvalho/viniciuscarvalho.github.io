---
layout: post
title: Building a Design System with SwiftUI
date: 2024-08-16 12:00:36 +0530
categories:
  - Swift,
  - DesignSystem,
  - SwiftUI
lang: en
alternate: /swift,/designsystem,/swiftui/2024/08/16/Montando-um-Design-System-com-SwiftUI.html
permalink: /en/swift,/designsystem,/swiftui/2024/08/16/Montando-um-Design-System-com-SwiftUI.html
---

Hello, everyone! I’m back with a challenge I hadn’t faced in all my years in software: building a Design System, using SwiftUI, which until then I’d mainly explored through study.

## The problem
This isn’t about why to build a Design System, but how to build one using SwiftUI and its capabilities. That sentence almost sounds AI-written!
An early question was whether to use native iOS components such as buttons and shapes. Previously, wrappers exposed the properties we needed. Here’s an example of that approach:

![Componente_Antigo](https://imgur.com/NYtLGT4.png)

As you can see, many components receive all their configurable properties through `init`. This makes them rigid, and changes go through the custom component rather than Apple’s native API. Sometimes a fully custom component is necessary, but often the native component is enough.
“But Vinicius, couldn’t I add a convenience initializer and avoid passing those arguments every time?”
The approach here is to use styles and the capabilities SwiftUI already provides.

## Moving beyond a rigid initializer
This is where I discovered the power of modifiers. We can apply a style and modifiers to a button. Here’s what that looks like without the previous initializer:

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

This simple button works, but isn’t very reusable yet. We’d have to repeat the HStack and modifiers each time. That’s where styles come in.

## Styles and style composition
When building an app, we usually want views and controls to look consistent, both to make them recognizable and to establish a theme or brand identity. That’s the goal here.
One way to apply a shared style to many buttons is to create a button view with an API similar to SwiftUI’s Button:

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

The key isn’t simply building a button. It’s creating a wrapper view with a convenience initializer that supports this composition. That’s the useful part.

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

Now we have a style that’s easy to apply:

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

We created a style for a simple Button, but can also define custom styles for Toggle, Label, DisclosureGroup, ControlGroup, GroupBox, and Form. Previously, we were practically rebuilding components rather than using their styling mechanisms. All of this comes directly from SwiftUI.

## Usage and Environment

Styles, modifiers, and environment values work well together for these components. One thing I hadn’t realized was how central the Label property is. What does that mean? Let’s look more closely.

Here we define the style and use it with its modifier:

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

This example extends SwiftUI’s `ButtonStyle` protocol. The `where` clause restricts the extension to cases where `Self` is `PrimaryButtonStyle`.

The `ViewModifier` carries the button’s states, such as focus, hover, and pressed. This moves responsibilities out of the component and composes them when it is used. Although this example uses Button, the approach applies to other components too.

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

## More to explore

This is only part of the work, but it taught me a lot about styles, modifiers, and composing them. Here are some resources that helped shape my approach to building a Design System.

## References

- [Styling in SwiftUI](https://movingparts.io/styling-components-in-swiftui)
- [A talk on Design Systems with SwiftUI](https://youtube.com/watch?v=Z7rJKr6Jlho)
