---
layout: post
title: Back to data structures in Swift — and why
date: 2021-02-10 12:00:36 +0530
categories:
  - Swift,
  - DataStructure,
  - Algorithm
lang: en
alternate: /swift,/datastructure,/algorithm/2021/02/10/Voltei-a-estrutura-de-dados-em-Swift.html
permalink: /en/swift,/datastructure,/algorithm/2021/02/10/Voltei-a-estrutura-de-dados-em-Swift.html
---

After a year-end break, I’m writing again. The Airbnb clone is on hold while I spend less time on SwiftUI, so I’m taking a step back to discuss data structures. Why talk about something we supposedly don’t use every day? We do use these ideas. I’ll revisit queues, stacks, FIFO, and the concepts you may have studied only to pass an exam, just as I did.

---

If you studied engineering or computing, you’ll remember queues and stacks. FIFO means first in, first out: elements are added with enqueue and removed with dequeue in arrival order. In this example, stacks provide the underlying implementation. Revisiting these ideas makes them feel much more logical than when I was juggling so many subjects at university.

Here’s some code illustrating the idea:

```
struct QueueStack<T>: Queue {
  private var dequeueStack: [T] = []
  private var enqueueStack: [T] = []
  var isEmpty: Bool {
    return dequeueStack.isEmpty && enqueueStack.isEmpty
  }
  var peek: T? {
    return !dequeueStack.isEmpty ? dequeueStack.last : enqueueStack.first
  }

  mutating func enqueue(_ element: T) {
    enqueueStack.append(element)
  }

  @discardableResult
  mutating func dequeue() -> T? {
    if dequeueStack.isEmpty {
      dequeueStack = enqueueStack.reversed()
      enqueueStack.removeAll()
    }
    return dequeueStack.popLast()
  }
}
```

----

First, we create the two stacks used for adding and removing elements. Then we check whether they’re empty. Notice the arrays of `T`: Swift’s generics let us work with any element type. The remaining functions, *enqueue* and *dequeue*, describe their roles in implementing *FIFO*.

To test the stacks, we use the following:

```
final class QueueTestCase: XCTestCase {
  var queueArray = QueueArray<String>()
  var queueStack = QueueStack<String>()

  override func setUp() {
    queueArray.enqueue("Pusheen")
    queueArray.enqueue("Keyboard Cat")
    queueArray.enqueue("Lil Bub")

    queueStack.enqueue("Milo")
    queueStack.enqueue("Sassy")
    queueStack.enqueue("Ozma")
  }

  func test_enqueueArray() {
    XCTAssertEqual(queueArray.peek, "Pusheen")
  }

  func test_enqueueStack() {
    XCTAssertEqual(queueStack.peek, "Milo")
  }

  func test_dequeueArray() {
    queueArray.dequeue()
    queueArray.dequeue()
    XCTAssertEqual(queueArray.peek, "Lil Bub")
    queueArray.dequeue()
    XCTAssertTrue(queueArray.isEmpty)
  }

  func test_dequeueStack() {
    queueStack.dequeue()
    queueStack.dequeue()
    XCTAssertEqual(queueStack.peek, "Ozma")
    queueStack.dequeue()
    XCTAssertTrue(queueStack.isEmpty)
  }
}
```

Here we test dequeue operations with both an array and a stack-based implementation. The two-stack approach splits the work across the stacks. The article compares their efficiency; in the two-stack queue, dequeue has amortized O(1) complexity rather than the cost of repeatedly removing the first item of an array.

---

Next, let’s look at a practical game example: tracking which player goes next.

```
protocol BoardGameManager {
	associatedtype Player
	mutating func nextPlayer() -> Player?
}
```

We extend `QueueStack` to conform to `BoardGameManager` and implement the next-player function. A player is added to the back of the queue and returned from the method.

```
extension QueueStack BoardGameManager {
	typealias Player = T

	mutating func nextPlayer() -> Player? {
		guard let player = dequeue() else { return nil }
	}
	enqueue(player)
	return player
}
```

That’s a little of what I’ve been studying about stacks and queues. Writing about it helps me retain what I learn. In the next posts, I’ll look at sorting algorithms.

See you next time!
