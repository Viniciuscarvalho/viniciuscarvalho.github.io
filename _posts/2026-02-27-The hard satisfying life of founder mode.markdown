---
layout: post
title:  "The hard satisfying life of founder mode"
date:   2026-02-27 12:00:36 +0530
categories: Founder Mode, Product, iOS, Indie Dev
---

Paul Graham wrote an essay called [Founder Mode](https://paulgraham.com/foundermode.html) that hit me harder than any technical article ever did. He talks about how founders operate differently from hired managers — they don't just delegate and disappear. They stay deeply involved, they break hierarchy when needed, and they trust their instincts even when conventional wisdom tells them to step back. Reading that, I realized I've been living a version of this without having a name for it.

I shipped 3 iOS apps to the App Store — **GastandoYa**, **ChooseThere**, and **FitToday**. People see the launch tweets, the App Store screenshots, maybe a demo video. What they don't see is everything behind it. The launches are the tip of the iceberg. The real challenge is the mode you have to be in to get there and stay there.

Let's do it.

## Writing code is not the hard part anymore

I've been writing Swift for years. At some point, writing code stopped being the bottleneck. You learn the patterns, the frameworks, the architecture. You can set up a Clean Architecture project with protocol-based layers almost on autopilot. And now with the AI boom — Cursor, Claude, Copilot — code generation is faster than ever. I use these tools every day and I wrote about this in my previous post about not vibe coding.

But here's the thing nobody talks about: **the code is the easy part now**. What's hard is everything around it. Thinking about what to build, for whom, and why. Defining the scope. Making product decisions. Designing the user experience. Setting up monetization. Writing the App Store metadata. Handling TestFlight feedback. Planning the roadmap. Marketing. Support. Analytics. The list goes on.

When you're building apps for a company, someone else handles all of that. You receive a Figma file, a Jira ticket, maybe a PRD if you're lucky, and you execute. That's comfortable. That's developer mode. Founder mode is the opposite of comfortable.

## The switch nobody prepares you for

Paul Graham talks about how founders get pressured to adopt "manager mode" — to hire people, delegate, and step away from the details. For indie developers, the pressure is different but equally real. You get told to "just ship it," to "move fast," to "let the market decide." But when you're the only person, you can't afford to not think deeply about every decision.

The hardest switch I had to make was going from **developer who builds features** to **CTO of my own products**. These are fundamentally different mindsets. As a developer, you optimize for code quality, architecture, test coverage. As a founder-CTO, you optimize for product-market fit, user retention, revenue, and you STILL need the code quality because you're also the only engineer.

With GastandoYa, I have 18 PRD workstreams. Eighteen. That's not just writing code — that's product strategy. Monetization with StoreKit 2, CSV and PDF import flows, visual redesign, gamification, budget categories. Each one requires thinking about the user problem first, then the technical solution. With FitToday, I had to learn about AI integration with OpenAI, design a Firebase backend, set up subscription tiers, think about the personal trainer CMS. With ChooseThere, I made every decision about offline-first architecture, couple sync, and the entire UX flow for something as simple as "where do we eat tonight?"

None of these decisions are coding decisions. They're product decisions that happen to require code.

## Engineering thinking matters more than engineering execution

I believe this is the biggest shift happening right now. With AI tools accelerating code generation, the value of a developer is moving from "can you write this?" to "should we build this, and how should it work?"

System Design, which I've been studying and writing about, is exactly this kind of thinking. Understanding the layers, the data flow, the trade-offs. When I write a PRD before touching Xcode, I'm doing System Design for my product. When I define protocols in the Domain layer before implementing anything, I'm engineering the solution before coding it.

The developer who can think in solutions, architect systems, model domains, and make product trade-offs is infinitely more valuable than the one who can write Swift fast. AI can write Swift fast. AI can't decide that your finance app needs a gamification layer to improve retention, or that your fitness app should use a 2-click questionnaire instead of a 10-screen onboarding flow.

## The discipline of founder mode

What makes founder mode hard is not any single skill — it's the discipline of wearing all the hats consistently. On any given week, I might be:

- Writing a PRD for a new GastandoYa feature
- Debugging a SwiftData migration in ChooseThere
- Reviewing App Store analytics for FitToday
- Designing a new screen flow in Figma
- Writing App Store descriptions and screenshots
- Setting up TestFlight builds and reviewing crash reports
- Studying competitors and thinking about differentiation
- Writing blog posts (like this one) to build in public

The context switching is brutal. Your brain wants to stay in one mode — the deep focus of writing code, or the creative flow of product thinking. Founder mode requires you to jump between them constantly. And the worst part? Nobody is assigning you these tasks. There's no sprint board someone else filled out. You have to create the sprint board, fill it out, and then execute it. You are the PM, the designer, the engineer, the QA, and the marketing team.

Paul Graham says founder mode is still being discovered — that we don't have established frameworks for it yet. I feel that in my bones. Every day I'm figuring it out as I go. Should I prioritize the new FitToday feature or fix that edge case in GastandoYa? Should I write tests or write marketing copy? Should I study a new framework or study my analytics dashboard?

## Why it's satisfying despite being hard

After everything I said, you might think I'm complaining. I'm not. This is the most satisfying work I've ever done. When a user sends feedback about GastandoYa helping them control their finances, that's mine. When ChooseThere actually solves the "where do we eat" argument for a couple, that's mine. When someone completes a workout in FitToday, that's mine.

Building apps for companies is rewarding in its own way, but you're always building someone else's vision. Founder mode means your name is on it. Your decisions shaped it. Your architecture holds it together. Your 99.9% crash-free rate keeps it running. That ownership changes everything.

The code was never the hard part. The hard part is becoming the person who can do everything else around the code and still maintain the engineering discipline that makes the product reliable. That's founder mode for a developer. And honestly? I wouldn't trade it for anything.

## What's next?

I'm continuing to evolve all three apps and thinking about how to grow them as real products, not just portfolio pieces. I want to write more about the product side of indie development — the decisions, the trade-offs, the failures, and the wins. The technical posts will keep coming because I genuinely love architecture and system design, but the founder mode perspective is something I want to explore more.

If you're a developer thinking about launching your own thing, my advice is simple: the code is the easiest part. Start exercising the other muscles now — product thinking, user empathy, business strategy, marketing. You'll need all of them, and none of them come naturally to someone who spent years optimizing for clean code.

See ya, até mais!