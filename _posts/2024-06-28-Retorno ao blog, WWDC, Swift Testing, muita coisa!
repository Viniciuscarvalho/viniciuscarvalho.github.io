---
layout: post
title:  "Retorno ao blog, WWDC, Swift Testing, muita coisa!"
date:   2024-06-28 12:00:36 +0530
categories: Swift, WWDC, Tests, Novidades 
---

# Voltei!
Fala pessoal, depois de anos sem escrever aqui no blog estamos de volta, tentar manter uma constância maior de posts e retomada para não ter um hiato tão grande sem escrever. Voltamos!

## Breve resumo de WWDC
A seguir vamos começar falando sobre um pouco sobre a WWDC e o que teve de novidades para Swift 6, SwiftUI, Xcode, iOS. Inclusive a migração para esse novo Swift em projetos grandes vão ter um trabalhinho e tem até uma [talk da WWDC](https://developer.apple.com/videos/play/wwdc2024/10169/) explicando como migrar. Vou deixar aqui inicialmente algumas talks que achei interessante e possam assistir também, inclusive esse ano foi a primeira vez que assisti bastante coisa nas primeiras semanas, pois tem coisas que não assisti desde 2020 por exemplo rsrsrs.

1. [Migrate your app to Swift 6](https://developer.apple.com/videos/play/wwdc2024/10169/) 
2. [What's new in UIKit](https://developer.apple.com/videos/play/wwdc2024/10118/)
3. [What's new in App Intents](https://developer.apple.com/videos/play/wwdc2024/10134/)
4. [Bring your app's core features to users with App Intents](https://developer.apple.com/videos/play/wwdc2024/10210/)
5. [Run, Break, Inspect: Explore effective debugging in LLDB](https://developer.apple.com/videos/play/wwdc2024/10198/)

E claro a talk sobre [Swift Testing](https://developer.apple.com/videos/play/wwdc2024/10179/?time=118) que é o que iremos abordar hoje aqui como o caso principal e grandes mudanças nos testes em relação ao XCTest que estamos acostumados a trabalhar.

## Swift Testing

### Introdução
A Apple lançou na última WWDC deste ano um novo framework de teste, Swift Testing que possui uma nova abordagem diferente do que temos no XCTest, mas os dois podem coexistir em conjunto, mas é encorajado a migrar os XCTests para o novo framework.
A ideia aqui é abordar as diferenças o que veio de novo e trazer um teste real de como podemos aplicar.

### Vamos começar?
Antes de tudo o grande diferencial logo de cara é que Swift Testing roda os testes em paralelo por default.
- Sync e async testes, enquanto o XCTests suporta apenas paralelização usando múltiplos processos rodando um teste por vez;
- Se estiver usando XCTest e queira utilizar os testes em paralelo, tem que colocar `.serialized` trait em todos os locais;
- E Swift Testing roda testes de maneira random por default;

|             | Description | Swif Testing | 
| ----------- | ----------- | ------------ |
| Discovery      | Name begins with "test", Subclass XCTestCase | @Test, @Suite
| Supported types   | Instance methods | Instance methods <br><br> Static/class methods <br><br> Global functions
| Support traits    | No              | Yes
| Parallel execution | Multi process, macOS and Simulator | In-process, Supports devices
| Types | class | Struct, actor, class
| Before each test | setUp(), setUpWithError() throws, setUp async throws | init() async throws
| After each test | teardDown async throws, tearDown() | deinit
| Sub-groups | Unsupported | View type nesting

### Mudanças na função de teste

Já não começamos mais os testes com a palavra `test` como faziamos no XCTest e temos que importar o `Testing`.

É usado `#expect(...)` para fazermos as assertions

```Swift
import Testing
@Test myFirstFunctionForTest() {
    #expect (1 == 1)
}

```

E também tornou-se mais simples fazer o teste pois todos os `XCTestCase` foram trocados pelo `#expect`

```Swift
// XCTest
XCTAssertTrue()
XCTAssertFalse()
XCTAssertEqual()
XCTAssertNil()
XCTAssertNotNil()
XCTAssertLessThan()
XCTAssertGreaterThan()
XCTAssertLessThanOrEqual()
XCTAssertGreaterThanOrEqual()

// Swift Testing
#expect()
```

```Swift
// XCTest
func testExample() {
	self.continueAfterFailure = false
	
	XCTAssertEqual(x, y)
	XCTAssertTrue(z.isEnabled)
}

// Swift Testing
@Test func example() throws {
	try #require(x == y)
	#expect(z.isEnabled)
}
```

### Inserção de Suite para organizar os testes

Quando trabalhamos em projetos grandes ou que contenha um teste que tenha um número grande de funções de testes é uma boa utilizar Suíte de testes para organizar de uma maneira melhor.

De acordo com a [documentação da Apple](https://developer.apple.com/documentation/testing/organizingtests), existem duas maneiras de Suite de teste,

- Colocando-o num Swift type;
- Colocando num Swift type e anotando esse tipo com um atributo @Suite;

podendo utilizar struct, final class, enum ou actor nos testes suite.

Outra coisa que podemos ter com o `@Suite` podem ser omitidos porque o compilador é capaz de identificar se as `structs` contem `@Test` functions, mas isso pode ser customizado

```Swift
struct ToastListViewModelTests {
    @Test func receiveValidList() { ... }
}

@Suite("Receive Toasts Offers Success Tests") struct ToastListViewModelTests {
  @Test func receiveValidList() { ... }
}

@Suite("Receive Toasts Tests") struct ToastListViewModelTests {
  @Suite("Offers - Success") struct Success {
    @Test func receiveValidList() { ... }
  } 

```

Ao lidar com @Suites, não pode inicializar as suas propriedades e utilizá-las nos suites aninhados.

### setUp and tearDown

Em `XCTestCase` podemos configurar as propriedades que podem começar antes ou depois dos testes com as funções

```Swift
func setUp() {
    sut = xptoSpy()
 }

func tearDown(){ 
    sut = nil
 }
```

Enquanto que no Swift Testing esses métodos não existem. Usamos `init` e `deinit`. Para `struct` será utilizado o inicializador `memberwise`.

### Traits

É para deixar os testes mais descritivos e por incrível que pareça o XCTest não possui suporte a traits.
Podemos personalizar se um teste é executado e modificam como um teste se comporta. Mostrarei como funciona a seguir,

- `Description trait`

Tentar dar maiores detalhes sobre o teste que está acontecendo, o Xcode vai mostrar uma descrição do nome da função, 

```Swift
@Test("Given correct value for parameters, should return success")
func validateParameters() { }
```

- `Tag trait`

Podemos representar com uma tag o tipo de uma tag. Podemos criar novas tags para extender o uso do objeto Tag e aplicar com a macro `@Tag`:

```Swift
@Test(.tags(.restaurantNearby))

private extension Tag {
    @Tag static var restaurantNearby: Self
}
```

As tags fornecem informações semânticas para um teste que podem ser compartilhadas com qualquer outro teste em um conjunto de testes, source files, e até mesmo test targets.
Elas podem ser executadas separadamente dos outros casos ou até mesmo filtradas no menu Insights após a execução de um teste. Eu tava discutindo o real ganho de utilizar tags para os testes e depois de olhar o vídeo faz sentido quando estamos utilizando para testar em outros targets e até em outros testes, coisas que não fazemos no XCTest atual.

> Benefícios do uso de tags:
> - Ajuda a analisar resultados entre test targets
> - Incluir ou excluir tags do plano de teste

- `Toogle trait`

Habilitar ou desabilitar um teste baseado em condições. É especificar a condição em runtime que o teste pula a condição cumprida;

```Swift
@Test(
    .disabled("This test is crash, please fix it")
    .bug("Create card on Jira", "Fix failing unit test")
)
func groceriesList() { }


@Test(.disabled())
func paymentServicesScreen() { }

@Test (.enabled(if: FeatureChecker.isGroceriesListActive))
func groceriesList() { }
```

### Parametrized Tests

Acredito que esse foi um baita ganho do framework, pois em XCTest rodavamos multiplas funções de asserts para cobrir todos os cenários de testes, correto?

Como no vídeo da session de Tests, podemos criar uma função e passar diferentes parâmetros para cobrir diferentes cenários, um mesmo teste com mais parâmetros. Para usar é simples, apenas passar os `arguments:` e adicionar o parâmetro especifico para a função:

```Swfit
@Test(
    "Given different type, should display correct screen error",
    arguments: [ErrorType.decodeError, .loadingScreen, . failedConnection, . missParameter]
)
...
```

Os argumentos são independentes uns dos outros, o que significa que pode voltar a executar casos de teste individuais e também pode executá-los em paralelo. Qualquer collection, arrays, dictionaries e OptionSet são válidos para serem utilizados como um atributo de teste. Ficou muito bom não é? Agora podemos ter um único teste com diferentes parâmetros e testando várias coisas, acredito que tenha que se organizar para não se perder nos cenários de testes.

### E depois vamos pra onde? Impressões?

Acredito que foi uma baita mudança e trouxe muitos ganhos e para alterar os testes que estão em XCTest não seja tão difícil e também pode existir o Swift Testing + XCTest também sem problemas, mas na sessão da Apple eles tem uma área que sugere como pode migrar os testes para o novo framework, tem muito a evoluir e também a aplicar, baita avanço para os fãs de BDD e TDD também.
Já li em alguns posts do LinkedIn que outras pessoas não curtiram a maneira de descrever mais o teste pois não está tão descritivo assim, eu acho que seja apenas a maneira de como você escreve o seu `trait` e questão de acostumar e deixar o mais explicativo possível, isso seja uma boa prática que deve se manter.

## Referências

- [Go further with Swift Testing](https://developer.apple.com/videos/play/wwdc2024/10195/) - WWDC24 Sessions
- [Hello Swift Testing, Goodbye XCTest](https://leocoout.medium.com/welcome-swift-testing-goodbye-xctest-7501b7a5b304)