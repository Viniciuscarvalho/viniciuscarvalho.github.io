---
layout: post
title:  "SOLID em aplicações reais, OCP - Open/Closed Principle"
date:   2021-02-24 12:00:36 +0530
categories: Swift, Design Patterns, Algorithm 
---

Esta semana estava lendo o livro, Refatoração - Aperfeiçoando o design de códigos existentes do Martinho Fowler e me deparei com situações que acabam passando batido no nosso dia a dia quando estamos desenvolvendo algum software e possam se encaixar nos princípios do SOLID para entendermos como resolver tais problemas. Lembrando que esse texto é baseado nos estudos que faço em cima dos cursos do RayWenderlich.

Um deles foi o OCP - Open/Closed Principle, vamos começar com a classe de animais, não não, to brincando, não estamos nos livros do Deitel de Java que todos os exemplos eram assim rs. Vamos abordar um app de café.

Temos as seguintes estruturas, uma função de fazer café e outras classes com os tipos de café, o grão, adicionar o grão de café e filtro de café. Vamos ver como isso vai nos ajudar a entender os princípios de refatoração e esse pattern.

```
func makeCoffeForMe() {
	let coffeMaker = FilterCoffeeMaker()
	coffeMaker.fill(with: Bean.arabica.grind())
	coffeMaker.brew()
}
```

A leitura do código é que temos a função de fazer o café e usamos o filtro com o tipo do grão arabica e depois é fermentado ou coado o café, até aqui tudo bem né? Mas digamos que eu queira mudar o meu café? Teria que mudar a primeira linha e ficaria assim,

```
let coffeMaker = BeanToCupMachine()
coffeMaker.add(.arabica)
coffeMaker.make()
```

Achamos um pequeno problema aqui, caso eu queria mudar um pedido de café, teríamos que mudar a função completamente para poder fazer uma alteração, entende? Digamos que minha função não tá extensível ou factível a mudanças. 

Como já diria Martinho Fowler, você pode usar de outros princípios do solid para resolver um pattern, pois eles são muito interligados. Dependência inversa e Liskov são alguns do que iremos abordar aqui para resolver esse problema.

Pensando em dependência inversa, vamos fazer com que o coffeMaker tenha um protocolo genérico e esse protocolo conforme com o princípio de Liskov, significa que podemos trocar uma versão de coffeMaker sem dificuldades ou alterar essa classe.

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

Implementado o nosso protocolo e a classe tendo conformado com o mesmo para fazer as alterações, conseguimos alterar a classe de fazer café.

```
func MakeCoffeForMe() {
	let coffeMaker: CoffeMaker = BeanToCupMachine()
	coffeMaker.prepare(with: .arabica)
	coffeMaker.make()
}
```

Ficou bem mais simples a mudança dessa função e não precisamos ficar alterando toda hora sua execução, apenas a implementação do protocolo já nos deu esse poder todo, olha que maravilha esse open / closed principle não é mesmo?

No próximo artigo traremos mais um caso que podemos abordar o SOLID em casos do nosso dia a dia e como podemos resolver usando o Swift.

Ah, o link para o código aqui usado está no [GitHub](https://gist.github.com/viniciuscarvalhom/494c805b47b1893fcf56f9c675ebd87e)

Até a próxima!