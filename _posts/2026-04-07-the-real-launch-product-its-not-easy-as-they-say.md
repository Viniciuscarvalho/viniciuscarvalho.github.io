---
layout: post
title: "The Real Product Launch — It's Not as Easy as They Say"
date: 2026-04-07
categories: [ios, fittoday, testing, quality-assurance]
tags:
  [
    fittoday,
    ios,
    swift,
    crashlytics,
    revenuecat,
    firebase,
    apple-health,
    testing,
    qa,
    launch,
  ]
---

Everyone talks about launching a product like it's a natural step. You build the thing, you press the button, you ship. What they don't tell you is that before pressing that button, if you're doing it right, you've spent a significant amount of time making sure you actually know what's happening inside your own app.

This post is about that invisible layer — the one users never see, but without it, you're flying blind on launch day.

Let's do it.

## The invisible infrastructure

When I was getting FitToday ready for launch, I knew I had to go beyond just "it works on my iPhone". The app has a real subscription model (Pro and Elite tiers), an AI assistant (FitOrb) backed by the OpenAI API, Apple Health integration, RevenueCat for billing, Firebase for auth and data — it's not a simple app. A lot of things can go wrong, and most of them will go wrong in production, with real users, at the worst possible time.

So before even thinking about the App Store submission, I built three layers of observability:

**Crashlytics** — obvious choice. Every crash, every non-fatal, symbolicated and sent to Firebase. If something breaks silently, I need to know. This was day one.

**AppLogger** — a custom logging layer I built on top of the native `os.Logger`. Structured logs across every critical flow: authentication, workout saves, FitOrb requests, paywall events, HealthKit syncs. These logs go nowhere in production for the user — they're just for me. Debugging a session, understanding what happened before a crash, understanding the sequence of events in a weird edge case.

**RevenueCat funnel events** — the one that matters most for the business. I needed to know if users were even _seeing_ the paywall. Not just if they were buying — if they were getting there at all. RevenueCat gives you purchase events out of the box, but I wired it into my own funnel so I could track the full journey: feature tap → paywall displayed → plan selected → purchase attempted → purchase confirmed. If someone drops between "paywall displayed" and "plan selected", that's a UX problem. If they drop between "purchase attempted" and "purchase confirmed", that's a billing or trust problem. Different diagnosis, different fix.

_None of this is visible to the user. The app feels clean and fast. But behind every screen there's a trail of structured events that tells me exactly what happened and in what order._

## The testing scenario

With the observability in place, the next step was defining the test cases. Not vague ones like "auth works" — actual acceptance criteria. Things I can check, reproduce, and verify before every release.

I divided it into one main part to start with: the iOS app itself, the end-user flows. Here's everything I mapped out.

---

### Part 1 — FitToday iOS App (End User Flows)

#### 1.1 Onboarding & Authentication

| #   | Test Case                      | Acceptance Criteria                                                                      |
| --- | ------------------------------ | ---------------------------------------------------------------------------------------- |
| 1   | Sign up with email + password  | Account created in Firebase Auth, document created in Firestore, redirect to home screen |
| 2   | Login with valid credentials   | Session started, data loaded correctly                                                   |
| 3   | Login with invalid credentials | Clear error message, no crash                                                            |
| 4   | Password recovery              | Email sent, link functional, password changed successfully                               |
| 5   | Apple Sign-In (social login)   | Account linked, profile data populated                                                   |
| 6   | Logout and re-login            | Session cleanly terminated, data reloaded on re-login                                    |
| 7   | Expired session                | Token silently renewed or redirect to login                                              |
| 8   | User deletes account           | Data removed from Firestore + Auth, confirmation displayed                               |

#### 1.2 Training Programs (12 free programs)

| #   | Test Case                                          | Acceptance Criteria                                              |
| --- | -------------------------------------------------- | ---------------------------------------------------------------- |
| 9   | List all programs                                  | 12 programs displayed with name, description, and image          |
| 10  | Open program and view workouts                     | Workout list with exercises, sets, reps                          |
| 11  | Start a workout                                    | Timer starts, exercises displayed in correct order               |
| 12  | Log sets (weight + reps)                           | Data saved to Firestore, visible in history                      |
| 13  | Complete a workout                                 | Summary shown (duration, volume), workout saved to history       |
| 14  | Workout interrupted (app backgrounded / killed)    | Partial data preserved or recovery offered on reopen             |
| 15  | Exercise with video/image from catalog             | Media loaded from Firebase Storage without excessive delay (<3s) |
| 16  | Exercise referenced by catalog ID in OpenAI prompt | Correct name and media displayed, no mismatch                    |

#### 1.3 FitOrb (AI Assistant)

| #   | Test Case                      | Acceptance Criteria                                                  |
| --- | ------------------------------ | -------------------------------------------------------------------- |
| 17  | Free user sends message        | Response generated, message counter incremented                      |
| 18  | Free user hits limit           | Clear limit message + upgrade CTA                                    |
| 19  | Pro/Elite user sends message   | Response generated with no limit                                     |
| 20  | Prompt with Apple Health data  | Contextualised response (e.g. "you slept less than usual yesterday") |
| 21  | Generate personalised workout  | Workout generated with valid exercises from catalog (by ID)          |
| 22  | OpenAI API timeout / error     | Friendly error message, retry available                              |
| 23  | Inappropriate content in input | Response refused or correctly filtered                               |
| 24  | Conversation history           | Previous messages visible on reopening the chat                      |

#### 1.4 Apple Health Integration

| #   | Test Case                                | Acceptance Criteria                                 |
| --- | ---------------------------------------- | --------------------------------------------------- |
| 25  | Permission requested during onboarding   | Native HealthKit modal displayed                    |
| 26  | Permission granted                       | Sleep, steps, calories, HRV synced correctly        |
| 27  | Permission denied                        | App works normally without health data, no crash    |
| 28  | Permission revoked afterwards            | Health data stops updating, UI adapts without error |
| 29  | Workout completed → written to HealthKit | Workout appears in the iPhone Health app            |

#### 1.5 Paywall & Subscriptions (RevenueCat)

| #   | Test Case                             | Acceptance Criteria                                        |
| --- | ------------------------------------- | ---------------------------------------------------------- |
| 30  | Display paywall for free user         | Pro and Elite plans shown with correct prices (BRL)        |
| 31  | Purchase Pro subscription             | RevenueCat confirms, Pro features unlocked immediately     |
| 32  | Purchase Elite subscription           | Elite features unlocked                                    |
| 33  | Restore purchases                     | Subscription restored on new device or after reinstall     |
| 34  | Cancel subscription                   | Access maintained until end of period, downgrade on expiry |
| 35  | Sandbox purchase (TestFlight)         | Full flow works in Apple's test environment                |
| 36  | Paywall displayed from locked feature | Tapping a Pro/Elite feature redirects to paywall           |
| 37  | RevenueCat webhook → Firestore        | Subscription status updated on the backend                 |

---

## Why case 37 is the most critical one

I intentionally kept that last one for last. Test case 37 — the RevenueCat webhook to Firestore — is the most important piece in the entire list, and also the hardest to test properly.

Here's why: everything else is local. Auth, workouts, HealthKit, even the paywall UI — those are either on-device or directly tied to a Firebase call I control. But the webhook is an external event. RevenueCat sends an HTTPS POST to my backend function after a purchase is confirmed, and my function updates the user's subscription status in Firestore. If that fails — network issue, validation error, wrong payload format, cold start timeout — the user paid but the app doesn't know about it.

That's the worst possible state. The user is frustrated, support burden increases, and you have a trust problem before you even built any retention.

_So I tested this in isolation, then in the full flow: sandbox purchase on TestFlight, RevenueCat event fired, webhook hits the Cloud Function, Firestore document updated, app detects the change via snapshot listener, features unlock. Every step logged. Every state change verified._

## What I learned

Building this testing scenario took longer than I expected. Not because the cases were complex individually — most of them are straightforward happy paths and a few edge cases. What took time was thinking clearly about the boundaries: where does my code end and the external service begin? What can I control and what can I only observe?

The AppLogger layer paid off faster than I thought. Within the first few days of TestFlight, I caught a silent failure in the HealthKit sync path — the permission was granted but the query was returning empty data silently. No crash, no error shown to the user. Just missing data. Found it in the logs in 10 minutes.

The RevenueCat funnel events also gave me something I didn't expect: the paywall conversion rate before launch. I saw that users were reaching the paywall, but a significant portion weren't scrolling past the first plan. That's a layout problem. I fixed it before the public launch. That's the whole point.

_You don't build test scenarios to find bugs in the obvious paths. You build them to know what you don't know — and to get ahead of the edge cases before your users find them for you._

## What's next

This is Part 1 — just the iOS app's end-user flows. There's more infrastructure underneath that I haven't covered here: the backend Cloud Functions, the Firestore security rules, the RevenueCat webhook handler, and the analytics pipeline. Those deserve their own post.

For now, FitToday is in the App Store. The observability is in place. The test scenarios are documented. And when something breaks — because it will — I'll know where to look.

See ya, até mais!
