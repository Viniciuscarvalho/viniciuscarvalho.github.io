---
layout: post
title: Back to the blog — WWDC, Swift Testing, and much more!
date: 2024-06-28 12:00:36 +0530
categories:
  - Swift,
  - WWDC,
  - Tests,
  - News
lang: en
alternate: /swift,/wwdc,/tests,/novidades/2024/06/28/Retorno-ao-blog,-WWDC,-Swift-Testing,-muita-coisa.html
permalink: /en/swift,/wwdc,/tests,/novidades/2024/06/28/Retorno-ao-blog,-WWDC,-Swift-Testing,-muita-coisa.html
---

# I’m back!
Hello, everyone! After years away from writing here, I’m back. I’ll try to post more consistently and avoid another long hiatus.

## A brief WWDC recap
Let’s start with what’s new in Swift 6, SwiftUI, Xcode, and iOS. Migrating large projects to the new Swift version will take some work. There’s even a [WWDC session](https://developer.apple.com/videos/play/wwdc2024/10169/) explaining how to migrate. Here are a few talks I found interesting. This was the first year I watched so many sessions in the first few weeks; there are still sessions from 2020 I haven’t watched!

1. [Migrate your app to Swift 6](https://developer.apple.com/videos/play/wwdc2024/10169/)
2. [What’s new in UIKit](https://developer.apple.com/videos/play/wwdc2024/10118/)
3. [What’s new in App Intents](https://developer.apple.com/videos/play/wwdc2024/10134/)
4. [Bring your app’s core features to users with App Intents](https://developer.apple.com/videos/play/wwdc2024/10210/)
5. [Run, Break, Inspect: Explore effective debugging in LLDB](https://developer.apple.com/videos/play/wwdc2024/10198/)

And, of course, the session on [Swift Testing](https://developer.apple.com/videos/play/wwdc2024/10179/?time=118), our main topic today. It brings major changes compared with the XCTest approach we’re used to.

## Swift Testing

### Introduction
At this year’s WWDC, Apple introduced Swift Testing, a testing framework with a different approach from XCTest. Both can coexist, and Apple provides guidance for migrating tests to the new framework. Here, I’ll cover what’s different, what’s new, and a practical testing example.

### Getting started
One major difference is that Swift Testing runs tests in parallel by default.
- It supports synchronous and asynchronous tests. XCTest parallelization uses multiple processes, each running a test at a time.
- The `.serialized` trait controls serial execution in Swift Testing.
- Test execution order is not guaranteed by default.

| Feature | XCTest | Swift Testing |
| --- | --- | --- |
| Discovery | Name begins with `test`; subclass of XCTestCase | @Test, @Suite |
| Supported types | Instance methods | Instance methods, static/class methods, global functions |
| Traits | No | Yes |
| Parallel execution | Multiple processes, macOS and Simulator | In-process, supports devices |
| Types | Class | Struct, actor, class |
| Before each test | setUp(), setUpWithError(), setUp async throws | init() async throws |
| After each test | tearDown async throws, tearDown() | deinit |
| Subgroups | Unsupported | Type nesting |

### Changes to test functions

Test names no longer need to begin with `test`, as they did with XCTest. We import `Testing` instead.

We use `#expect(...)` for assertions:

```Swift
import Testing
@Test myFirstFunctionForTest() {
    #expect (1 == 1)
}

```

Assertions also become simpler by replacing XCTest assertions with `#expect`:

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

### Using suites to organize tests

For large projects or files with many test functions, suites help organize the tests.

According to [Apple’s documentation](https://developer.apple.com/documentation/testing/organizingtests), there are two ways to define a test suite:

- Place tests in a Swift type.
- Place tests in a Swift type annotated with the `@Suite` attribute.

Suites can use a struct, final class, enum, or actor.

The `@Suite` attribute can be omitted when the compiler can infer it from a type containing `@Test` functions, but it also allows customization:

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

When working with nested suites, properties initialized on an outer suite are not automatically available to the inner suite.

### setUp and tearDown

In `XCTestCase`, we configure work before and after tests with these functions:

```Swift
func setUp() {
    sut = xptoSpy()
 }

func tearDown(){
    sut = nil
 }
```

Swift Testing doesn’t have those methods. We use `init` and `deinit`; structs can use their memberwise initializer.

### Traits

Traits make tests more descriptive and let us customize whether a test runs and how it behaves. XCTest doesn’t have the same trait system. Here’s how it works:

- `Description trait`

Provide more detail about the test. Xcode displays a descriptive name for the function:

```Swift
@Test("Given correct value for parameters, should return success")
func validateParameters() { }
```

- `Tag trait`

Tags classify tests. We can define custom tags by extending `Tag` and apply them to test functions:

```Swift
@Test(.tags(.restaurantNearby))

private extension Tag {
    @Tag static var restaurantNearby: Self
}
```

Tags provide semantic information that can be shared across suites, source files, and even test targets. They let us run selected tests or filter results in Insights after execution. After watching the session, I saw their value for grouping tests across targets, something I don’t currently do with XCTest.

> Benefits of tags:
> - Analyze results across test targets.
> - Include or exclude tags from a test plan.

- `Toggle trait`

Enable or disable a test based on a runtime condition, skipping it when the specified condition applies:

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

### Parameterized tests

This is a major improvement. With XCTest, we often used multiple test functions and assertions to cover different scenarios.

As shown in the testing session, we can write one function and pass different parameters to cover multiple cases. Supply `arguments:` and add the corresponding function parameter:

```Swfit
@Test(
    "Given different type, should display correct screen error",
    arguments: [ErrorType.decodeError, .loadingScreen, . failedConnection, . missParameter]
)
...
```

The arguments are independent, so individual cases can be rerun and can execute in parallel. Collections, arrays, dictionaries, and OptionSet values can be used as test arguments. One test can now cover multiple inputs, though we still need to organize scenarios carefully.

### What comes next? My impressions

This framework brings substantial improvements. Migrating from XCTest doesn’t look too difficult, and Swift Testing can coexist with XCTest. Apple’s session includes migration guidance. There’s plenty to explore and apply, especially for BDD and TDD enthusiasts.
I’ve seen LinkedIn comments from people who don’t find the descriptions sufficiently clear. I think much depends on how you write the traits and on building good habits: making tests as explanatory as possible remains good practice.

## References

- [Go further with Swift Testing](https://developer.apple.com/videos/play/wwdc2024/10195/) — WWDC24 Sessions
- [Hello Swift Testing, Goodbye XCTest](https://leocoout.medium.com/welcome-swift-testing-goodbye-xctest-7501b7a5b304)
