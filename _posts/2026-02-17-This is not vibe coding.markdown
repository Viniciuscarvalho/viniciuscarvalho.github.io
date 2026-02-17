---
layout: post
title:  "This is not vibe coding"
date:   2026-02-17 12:00:36 +0530
categories: Swift, SwiftUI, Architecture, iOS, Clean Architecture
---

Everyone is talking about vibe coding. Prompt something, ship whatever comes out, hope for the best, and call it a product. Twitter is full of "I built an app in 2 hours with AI" threads. And look, I love AI tools — I use Cursor every single day. But there's a difference between using AI as a tool and using AI as a substitute for understanding what you're building.

I built 3 iOS apps from scratch — **GastandoYa**, **ChooseThere**, and **FitToday** — all with a 99.9% crash-free rate. All of them shipped to the App Store. All of them handle real complexity with real users. And none of them were vibe coded.

This is how I did it.

Let's do it.

## What is vibe coding and why I don't do it

Vibe coding is essentially this: you open an AI tool, describe what you want in natural language, accept whatever the model generates, glue the pieces together, and ship it. No spec. No domain modeling. No architecture decisions. No test strategy. You just... vibe.

The problem? It works for demos. It fails for products. When you don't understand the domain, you build the wrong abstractions. When you don't have a spec, requirements live only in your head and change every prompt. When you don't test, you discover bugs in production. When you don't think about architecture, every new feature is a fight against the codebase.

What I do instead is the opposite of vibing. I follow two practices that have given me consistent, maintainable, crash-free results across all three apps: **Spec Driven Development** and **Domain Driven Development**. These are the fundamentals. AI helps me move faster within them — but it never replaces them.

## The three apps

Before diving into the methodology, let me introduce the apps so you understand the range of complexity we're talking about. These are not toy apps or weekend projects.

**GastandoYa** is a personal finance manager. Track income and expenses, set goals and budgets, import transactions from CSV and PDF, and stay motivated with gamification. It runs on iOS, iPadOS, and macOS. It uses StoreKit 2 for a freemium model. There are 18 PRD workstreams covering monetization, import, visual redesign, and more.

**ChooseThere** helps couples decide where to eat — the eternal question, né? It's a restaurant roulette with filters, learned preferences, history, and couple sync/backup. The entire app is offline-first with no backend. All data lives on device with SwiftData.

**FitToday** is an AI-powered fitness app. A daily 2-click questionnaire generates a personalized workout using OpenAI. It has programs, social groups and challenges, a personal trainer CMS, and a Firebase backend with StoreKit 2 Pro tier.

Each one has different data strategies, different backend needs, and different user flows. But they all share the same development methodology. That's the point — the methodology scales across problem domains.

## Spec Driven Development — PRD before code

Here's the workflow I follow for every feature in every app: **PRD -> TechSpec -> Tasks -> Implementation**.

Before I write a single line of Swift, I write a Product Requirements Document. What is this feature? Who is it for? What are the acceptance criteria? What are the edge cases? Then I write a Technical Specification: what are the interfaces, the data models, the dependencies? Then I break it into tasks. Only then do I open Xcode.

All three apps follow this exact pipeline:

- **GastandoYa** has 18 PRD workstreams. Monetization, CSV/PDF import, visual redesign, budget categories, gamification — each one started as a PRD.
- **ChooseThere** has 9 PRD folders with Cursor commands that enforce asking clarification questions BEFORE writing the PRD. Each PRD has a QA checklist baked in.
- **FitToday** has PRDs for the MVP, Programs feature, ExerciseDB migration, and a Performance sprint. Validation documents serve as acceptance criteria.

The key insight is this: **specs define Swift interfaces before code is written**. Protocols, entities, repository contracts — they come from the spec, not from improvisation. All three apps share the same templates: `prd-template.md`, `techspec-template.md`, `task-template.md`.

When you have a spec, AI becomes incredibly useful. You can point Cursor at a TechSpec and say "implement this protocol." That's not vibe coding — that's using AI to execute on a well-defined plan.

## Domain Driven Development — the domain layer knows nothing

This is where the architecture discipline lives. Across all three apps, the Domain layer has **zero framework imports**. Only `Foundation`. No SwiftData, no Firebase, no UIKit, no SwiftUI. Nothing.

The pattern is the same in GastandoYa, ChooseThere, and FitToday:

- **Domain Entities** are pure Swift structs — not SwiftData `@Model` classes
- **Repository protocols** are defined in the Domain layer, implemented in the Data layer
- **Use Cases** encapsulate business logic and depend only on protocols
- **Mappers** convert between Domain entities and Data layer models

Here's what a Domain repository protocol looks like. This is from GastandoYa:

```Swift
import Foundation

protocol TransactionRepositoryProtocol {
    func fetchTransactions() async throws -> [Transaction]
    func addTransaction(_ transaction: Transaction) async throws
    func updateTransaction(_ transaction: Transaction) async throws
    func deleteTransaction(_ transaction: Transaction) async throws
    func fetchTransactions(for category: TransactionCategory) async throws -> [Transaction]
}
```

Notice what's NOT there. No `import SwiftData`. No `@Model`. No `ModelContext`. The Domain defines the contract — what the app needs — without caring about how the data is stored. The Data layer implements this protocol using SwiftData, or Firebase, or a mock for testing. The Domain doesn't care.

The result? I can swap SwiftData for CoreData, or Firebase for a local mock, and the Domain layer doesn't change. That's not just clean code theory — it's what makes these apps testable and maintainable in practice.

## The architecture that holds everything together

All 3 apps share Clean Architecture with the same layer separation:

```
Domain → Data → Presentation
```

At the Presentation layer, all three use MVVM. The data flow for any user action looks like this:

```
User Action → SwiftUI View → ViewModel → Use Case → Repository (protocol) → SwiftData/Firebase
```

The View observes the ViewModel. The ViewModel calls a Use Case. The Use Case calls a Repository protocol. The Data layer provides the concrete implementation. Every dependency points inward toward the Domain.

For dependency injection, GastandoYa and FitToday use Swinject, while ChooseThere uses simple initializer injection. Different scale, same principle — dependencies are injected, never hardcoded.

Navigation follows a Router pattern in all three apps, keeping navigation logic out of Views and ViewModels.

Protocol-based design is what makes all of this work. Every boundary between layers is a protocol. Every protocol can be mocked. Every mock enables a test. This is the architecture that produces a 99.9% crash-free rate — not because I'm a genius, but because the system is designed to be testable from the ground up.

## Testing is not optional

This is where the crash-free rate comes from. When your Domain is pure Swift with no framework dependencies and every boundary is a protocol, testing becomes straightforward.

The numbers:

- **GastandoYa**: 250+ unit tests. Mock repositories for every data source. Fixture CSV files for import testing. Fastlane CI running on every push.
- **ChooseThere**: 100+ unit tests. Injectable random number generators for deterministic tests on the roulette feature. SwiftData in-memory configurations for isolated data layer tests.
- **FitToday**: ViewModel tests covering all user flows. Mock protocol implementations for Firebase and OpenAI services. Async test patterns for workout generation.

The formula is simple: domain logic is tested because it has no dependencies. The data layer is tested in isolation because repositories conform to protocols. The presentation layer is predictable because ViewModels are just state machines.

99.9% crash-free is not luck. It's the natural outcome of treating testing as a first-class part of the development process, not an afterthought.

## What's next?

I'm continuing to evolve all three apps. iOS 26 is bringing exciting features and I want to bring them into these projects. The methodology stays the same — PRD first, spec the interfaces, implement with clean architecture, test everything.

If you're building apps and want to move beyond vibe coding, start with the fundamentals. Write a spec before you write code. Model your domain before you pick a framework. Test your logic before you ship. AI is an incredible accelerator, but only when you know where you're going.

See ya, até mais!
