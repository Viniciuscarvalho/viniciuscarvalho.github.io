---
layout: post
title: SOLID in real applications — The Open/Closed Principle
date: 2021-04-02 12:00:36 +0530
categories:
  - Swift,
  - Design
  - Patterns,
  - Algorithm
lang: en
alternate: /swift,/design/patterns,/algorithm/2021/04/02/SOLID-em-aplica%C3%A7%C3%B5es-reais,-OCP-Open-Closed-Principle.html
permalink: /en/swift,/design/patterns,/algorithm/2021/04/02/SOLID-em-aplica%C3%A7%C3%B5es-reais,-OCP-Open-Closed-Principle.html
---

This week, while reading Martin Fowler’s *Refactoring: Improving the Design of Existing Code*, I noticed everyday development situations that are easy to overlook and can be understood through SOLID principles. This article is also based on my studies of RayWenderlich’s courses.

One example is OCP, the Open/Closed Principle. Let’s start with an Animal class… Just kidding! This isn’t a Deitel Java textbook where every example starts that way. We’ll use a coffee app.

We have a function that makes coffee and classes representing the coffee type, beans, adding beans, and the filter. Let’s see how these structures help explain refactoring and this principle.

```
func makeCoffeForMe() {
	let coffeMaker = FilterCoffeeMaker()
	coffeMaker.fill(with: Bean.arabica.grind())
	coffeMaker.brew()
}
```

The code makes coffee using a filter and arabica beans, then brews it. So far, so good. But what if I want a different coffee? I would need to change the first line:

```
let coffeMaker = BeanToCupMachine()
coffeMaker.add(.arabica)
coffeMaker.make()
```

Here’s the problem: changing an order would require changing the function itself. The function isn’t easy to extend.

As Fowler’s work illustrates, SOLID principles are closely connected, and one can help apply another. Dependency inversion and Liskov substitution will help solve this problem.

With dependency inversion in mind, we’ll give the coffee maker a generic protocol. Following Liskov substitution lets us replace one coffee-maker implementation with another without rewriting the consuming class.

```
protocol CoffeMaker {
	func prepare(with beans: Bean)
	func make()
}

class FilterCoffeMaker: CoffeMaker {

	private let cafetiere: Cafetiere()

	func prepare(with beans: Bean) {
		cafetiere.groundCoffe = beans.grind()
	}

	func make() {
		cafetiere.plunge()
	}

}

class BeanToCupMachine: CoffeMaker {

	private var beans: Bean?

	func prepare(with beans: Bean) {
		self.beans = beans
	}

	func make() {
		guard let groundCoffe = beans?.grind() else {
		return
		}

		_ = groundCoffe

	}
}
```

With the protocol in place and the class conforming to it, we can change how coffee is made:

```
func MakeCoffeForMe() {
	let coffeMaker: CoffeMaker = BeanToCupMachine()
	coffeMaker.prepare(with: .arabica)
	coffeMaker.make()
}
```

Changing the function is now simpler. We don’t need to rewrite its execution every time: the protocol gives us that flexibility. That’s the value of the Open/Closed Principle.

In the next article, we’ll look at another everyday SOLID example and how to solve it in Swift.

The code used here is on [GitHub](https://gist.github.com/viniciuscarvalhom/494c805b47b1893fcf56f9c675ebd87e).

See you next time!
