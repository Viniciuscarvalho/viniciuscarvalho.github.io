---
layout: post
title:  "Voltei a estrutura de dados em Swift e o porquê disso!"
date:   2021-02-10 12:00:36 +0530
categories: Swift, DataStructure, Algorithm 
---

Voltando a escrever depois de um hiato de final de ano e com o projeto do clone do Airbnb parado, por não estar focando tanto em SwiftUI agora, volto duas casas pra falar um pouco sobre estrutura de dados. Mas porque falar sobre isso sendo que a gente nem usa no nosso dia a dia? Aí que você está enganado, vou passar por algumas das implementações de fila, pilha, fifo, aquilo tudo que você deixa passar na faculdade ou estudou só pra passar, assim como eu, veremos novamente aqui.

---

Quem estudou engenharia ou computação vai lembrar muito desses casos de Queue, Stack, e por ai vai. O famigerado FIFO(first-in-first-out) nada mais é que empilhar e depois remover da pilha. Assim como nesse exemplo, são colocados elementos com o Enqueue e removidos com o Dequeue da Stack, assim fazendo jus ao nome, primeiro você empilha para depois desempilha, funcionando como uma sincronia mesmo de só é alocado quando tem espaço na pilha. Caramba que fácil não é? Na faculdade era tanta disciplina que a gente acaba estudando somente pra passar e não vê a belezura de como isso é fácil e lógico.

Um exemplo com código para demonstrar o que foi falado aqui,

```Swift
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

Explicando um pouco do que ta escrito ai, primeiro criamos as duas Stacks que vamos empilhar e desempilhar. Em seguida, verificamos se elas estão realmente vazias, veja que criamos arrays de T, sendo o T qualquer tipo genérico, algo que o Swift nos traz e facilita a compreensão. As outras funções falam por si só e o que executam, *enqueue* e *dequeue*. Assim fazendo o *FIFO* ser implementado.

Para testar se as Stacks, temos o seguinte teste,

```Swift
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

Veja que aqui nesse caso temos tanto o teste da dequeue no Array quanto na Stack, o mais preciso e mais eficiente segue sendo quando temos duas stacks, não só pela quantidade pilhas mas o tempo que ele demora para percorrer as duas pilhas é dividido, ou seja algoritmicamente falando é O(1) enquanto que somente em array é 0()

---

Um problema real de um jogo é o que iremos abordar a seguir, para fazer o *track* de qual jogador será o próximo,

```
protocol BoardGameManager {
	associatedtype Player
	mutating func nextPlayer() -> Player?
}
```

Para isso seguimos com a seguinte abordagem, criamos uma extensão de QueueStack que herda do nosso protocolo BoardGameManager, em seguida iremos implementar a função de próximo jogador. Adicionamos um jogador atrás da Queue e retornamos dentro do método.

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

Bem isso foi um pouquinho do que andei estudando sobre Stack e Queue e resolvi trazer para o blog pois é uma maneira de fixar também o que estudei, nos próximos posts vou trazer sobre algoritmos de sortear.

Até a próxima!