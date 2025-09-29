---
layout: post
title:  "Applying concepts I learned from System Design"
date:   2025-09-29 12:00:36 +0530
categories: Swift, SwiftUI, Tuist, Architecture, TCA
---

I started to delve deeper into the concepts of the book I mentioned in the previous article. If you haven't read it, go ahead and take a look at the tips. I decided to put the entire flow into practice to do three things I've wanted to do for a long time. One was to create an application from scratch for my portfolio, with many features, from conception to data modeling and screens. I also wanted to delve deeper into a specific architecture, which in this case is Composable or TCA, and invest time in learning more about the features of the system build, which is Tuist.

So, this article is to explain my journey so far.

Let's do it.

## Point of start

In the previous article, I was putting together something related to an interview I had seen from the book, which was to set up a chat system. This is complex, and yes, it is necessary to know the layers and how the system itself works, not just to design screens or what happens there on the screen. Now I wanted to practice two things, which were to put together a complete software package and apply the concepts of architecture from the [Composable](https://github.com/pointfreeco/swift-composable-architecture).

First point, don't replicate anything, so I wanted to create an app from scratch with something I wanted, which was a problem involving exchanging concert tickets. I started by putting together a scope of screens and then went step by step, just like I was reading in the book. This is useful not only for interviews, OK?  - It's for the life of a software developer.

*Remember: I was both the interviewer and the interviewee in this case, so I had to gather the requirements and say which ones were functional and which ones were non-functional.*

With the project created, requirements gathered, data models, mock screens, and JSON to consume the data ready, I moved on to the code.

## The code

I wanted to put into practice things that I hadn't built from scratch, Tuist and a new architecture. [Tuist](https://tuist.dev/) is a build system that differs from the one used in Xcode and is very useful for large-scale projects. It's worth checking out and understanding how it works on the website I've provided here. 

*The aim is not to delve into specific topics, but to show what I used to put it together and the real difficulties I faced in creating something.*


```Swift
import ProjectDescription

let project = Project(
    name: "SocialApp",
    packages: [
        .remote(
            url: "https://github.com/pointfreeco/swift-composable-architecture",
            requirement: .upToNextMajor(from: "1.0.0")
        )
    ],
    settings: .settings(
        configurations: [
            .debug(name: "Debug"),
            .release(name: "Release")
        ]
    ),
    targets: [
        .target(
            name: "SocialApp",
            destinations: .iOS,
            product: .app,
            bundleId: "dev.tuist.SocialApp",
            infoPlist: .default,
            sources: [
                "./SocialApp/Sources/**",
                "./SharedModels/Sources/**",
                "./Projects/Features/Events/Sources/**",
                "./Projects/Features/TicketsList/Sources/**", 
                "./Projects/Features/TicketDetail/Sources/**"
            ],
            resources: ["SocialApp/Resources/**"],
            dependencies: [
                .package(product: "ComposableArchitecture")
            ],
            settings: .settings(
                configurations: [
                    .debug(name: "Debug"),
                    .release(name: "Release")
                ]
            )
        ),

        .target(
            name: "SocialAppTests",
            destinations: .iOS,
            product: .unitTests,
            bundleId: "dev.tuist.SocialAppTests",
            infoPlist: .default,
            buildableFolders: [
                "SocialApp/Tests"
            ],
            dependencies: [.target(name: "SocialApp")]
        )
    ]   
)
```

The initial structure looks something like this, and when you run the commands `tuist init` and `tuist install`, voilà, we already have the structure set up in our Xcode. Then, with `tuist generate`, we already have the project ready to run. I believe that because it is a different System Build, you can create different features for each one and make each feature isolated just by changing the path in the Project file. This is one of the coolest things I see in Tuist. If I were to use it directly in Xcode, it would be a lot more work. Now imagine if it were a huge project?

Now I wanted to validate the creation of how to scale if it were a simple project and then increase to 300 modules, for example. Would TCA help me more or hinder me? Would it be easier or more difficult than a simple approach?

### Problems on the way

The structure I had sketched out would be:

Services -> DataDomain -> Features (UI)

The problems started to appear when I created a Project for each of the features and had Composable as a dependency. Until then, I didn't know I had to have that dependency. The build was working, but the errors it presented were that there was cross-dependency between features. 

In Composable, based on the example projects and also with the help of Cursor <3, I understood that I had a connection to my View, which was this connection in the init of my features,

```Swift
public struct EventsView: View {
    @Bindable var store: StoreOf<EventsFeature>
    
    public init(store: StoreOf<EventsFeature>) {
        self.store = store
    }
```

That was how I handled events linked to View. Since I wanted to use everything in the library, I didn't want to remove this Store concept, so I removed it and left everything in the same path as it was in Project and removed all Projects from each of the features. Maybe I'll be able to do this later, or maybe I'm doing something wrong with TCA.

Another point I identified was something I'm putting to the test, which is the speed of creating a feature or adding functionality to the code I already have. 
I wanted to add a favorite and unfavorite using SwiftData, and apparently it was something simple, but I may be creating boilerplates for this, as I only have one View and one Feature and the Client that connects to my Domain layer. I will look into it further to see if it was done correctly or not, but I thought it was pluggable enough to grow the number of features.

## What's next?

Finally, the project's evolution includes phases such as creating an API for information consumption, Firebase authentication, push notifications, adding and removing tickets in the app itself, and a seller rating system. There are some features that are emerging and elevating this proof of concept.

It's excellent to put into practice the concepts I've been studying, Composable, Tuist, System Design from scratch, setting up an API system to design this structure, and also making the project available for collaboration on Github. Next will be bringing the use of iOS 26 and other features to this same project.

See ya, até mais!