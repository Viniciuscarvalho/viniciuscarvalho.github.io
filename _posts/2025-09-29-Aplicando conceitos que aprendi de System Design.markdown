---
layout: post
title:  "You need System Design to understand software"
date:   2025-09-16 12:00:36 +0530
categories: Swift, SwiftUI, iOS, Architecture
---

Continuando os posts em inglês, agora vou contar um pouco sobre como tem sido estudar mais sobre System Design e não a parte visual que é o Design System, isso é uma coisa totaaaalmente diferente tá? E acho que todo desenvolvedor de software, seja mobile ou não, deveria conhecer ponta a ponta a estrutura e montagem de um sistema assim mesmo que você não precise se aprofundar bastante.

Where did all this come from to see these software concepts? An article in Gergely Orosz's newsletter talks about how not to get stuck in coding interviews. Here, I will try to address how I have been studying this and the book I am reading on System Design.

Let's do it.

## Problem

When I started conducting interviews at the companies I worked for, each one had its own structure and model. There are algorithm interviews and other types as well. What I will discuss here is one of these phases that I am delving into more and more: Mobile System Design.

## MIKE framework

First of all, I had read about this framework in the book Cracking The Coding Interview, and it is specifically designed for solving algorithm tests and approaching this type of problem, but I believe it can also be the key to solving other software problems.

What each of the letters means:

- [M]inimally sketch the naive solution: Start by establishing a baseline approach, even if it’s inefficient. This ensures you understand the problem, and it gives you something to optimize.
- [I]dentify upper and lower bounds: Use big O analysis to narrow down the range of possible solutions. This helps you quickly discard approaches that are too slow or unrealistically fast. See a helpful visual introduction to Big O analysis.
- [K]eywords/triggers: Look for hints in the problem statement that suggest specific techniques. For example, a sorted input array might trigger thoughts of binary search, while questions involving parentheses often suggest use of a stack.
- [E]mploy boosters: If the first three parts don’t get you unstuck, there’s a series of techniques designed to give you a “boost”. These include optimizing the brute force solution, hunting for useful properties, and ways to decrease difficulty.
This framework isn’t revolutionary; it simply spells out what good problem solvers do instinctively.

As you can see, this is much more focused on solving algorithms. What I want to bring up here with this type of approach is to break down the problem before tackling a solution, where we are very accustomed to just executing and executing.

Next, I will try to break down a little more about how to proceed with System Design and provide some guidance, which is what I have been practicing and studying.

## 5 points to start

I will divide the analysis until I arrive at the solution design, which are as follows:

1) Capturing the briefing
2) Defining scope and requirements
3) Finding secondary or hidden requirements
4) Uncovering failure requirements and edge cases
5) Turning requirements into a System Design

This is just part of the book by [Tjeerd](https://www.mobilesystemdesign.com), and I'm studying based on it, which is very comprehensive and straightforward material. I highly recommend it, and it's worth it!

## Capturing the briefing

I'll tell you about my case. Usually, we receive one or two screens to describe how this can evolve or grow from these screens, and it's a common routine: We receive some designs, some (vague notion of) requirements, and then we are asked “Can you make this?” followed by the fan-favorite “When do you think it will be finished?”

Usually, the interviewee is already confused, and those who are not used to it start doing the architecture part or connecting what the features would do. I know, we've all done this in our eagerness to solve it quickly and because we've done it countless times, right?
But there's no need to be so eager. Let's take it step by step, explain everything clearly, and show that you understand what is being asked.
This is very quick and can be done in these first three topics.

- Ask about acceptance criteria;
- Be clear about the scope: Define key deliverables
- Listen carefully: Capture all ideas
- Categorize and confirm: To ensure alignment

## Defining scope and requirements

- Clearly define essential features
- Explicity categorie
- Understand dependencies
- Validate with stakeholders and interviewers

## Finding secondary or hidden requirements

- Imagine walking through an entire feature from user's perspective
- Clarify vague descriptions
- Pay atention to competitor comparisons

## Turning requirements into a System Design

Having completed this preliminary analysis, which is quick but necessary, we move on to the high-level requirements, or the functional and non-functional requirements.
Let's continue with the same example used in one of the books I mentioned above, which was also one of the tests I did, using a two-screen chat communication.

<a href="https://ibb.co/TMnT82Nd"><img src="https://i.ibb.co/hFnMW9Tw/Captura-de-Tela-2025-09-16-s-11-56-15.png" alt="Captura-de-Tela-2025-09-16-s-11-56-15" border="0"></a>

*Let's look at the functional requirements first*,

- Send/receive messages
- Send/receive files and images
- Supports 1-1 chats, no groups
- User can view chats when offline
- Supports downloading and viewing profile image quality

*The non-functional ones*,

- Offline support (sending messages)
- Real-time updates
- Optimization for slow connections and when the battery is low

Having raised these points, we move on to the step-by-step process of the points previously discussed. This should take a maximum of 10 minutes and must be very brief so that we can move on to designing the solution itself.

Next, we create the DataModels for the application in question, so we will have Chat, User, Message, and Attachment. I will not detail the fields here, but it is important to know what you are putting in and what to transmit the application information.

### Decide which architecture?

No. Don't do that. First, understand the problem and try not to put it in the design right away. Remember that what was asked previously is essential for building the software. Before assuming that you will use MVVM or TCA, it may not even be in SwiftUI. All of this must be taken into consideration in the project you are working on and the one you will be joining.

### Turn the Types into a Graph

Now we will first draw at a high level and then detail the flow of a message, for example, which is the case we are addressing.

<a href="https://ibb.co/MkBG8d7x"><img src="https://i.ibb.co/1GzdscTt/Captura-de-Tela-2025-09-16-s-14-49-10.png" alt="Captura-de-Tela-2025-09-16-s-14-49-10" border="0"></a>

This is an example from the Mobile System Design book in the Quick Reference.

We have seen that I am not defining any type of architecture or anything like that, but we can move on to separating the systems and using what the problem will have. Since we are dealing with a chat case, we already know from gathering the functional requirements what we will need to build our system, right? Let's get started.

- ChatService
- WebSocket
- SyncEngine
- APIClient
- ChatRepository
- LocalDB
- FileStorage

*P.S: The purpose here is not to show how to set up the flow, but to present what will be contained in the system. To understand the connections between classes, please study the book.* 

These are some of the boxes we should follow from that first pre-assembly of the image, from which we will continue with the design of our solution. Again, the visual aspect can take a back seat at first, because what matters here is how the message is sent and received. 

To show how the arrows in our design work and connect, this is the main requirement you have to meet: knowing how to explain how a message is sent and received. 

The points that come after that are a consequence of your system, such as how the cache system works, how WebSocket works and communicates with the Repository, how it checks whether the message is being read online or from Storage, the number of calls made to APIClient, will it always be requested?
All of this is part of building your system so that you can then explain the visual presentation part. Try to group by Domains, so it will be clearer when you are explaining and also to make clear the most and least critical parts of your system.

### One plus

There isn't usually much time to present this part of the methods or what each of the system boxes will have, but it's a big plus to explain, for example, that ChatRepository will have the `saveChats([Chat])` method and also `fetchChats()`. Remember that the solution design goes through all layers, and in the end, it's as if you were looking at the design and were ready to code.
This is also important for studying and showing what each of the layers and boxes will do in the system itself.

## What's next?

I tried to convey an overview of how it is constructed and how I have been studying more about System Design, whether for interviews or interviewing others. It is part of the process for a software engineer to identify these gaps and understand what is being done in each part of the project.
I will leave some links to interesting videos and also strongly recommend the book [Mobile System Design](https://www.mobilesystemdesign.com), which was widely used as a reference to study and explain some of these concepts.

- [4 erros comuns em entrevista de Mobile System Design](https://youtu.be/TP5mCDConxI?si=b_HEsXi72_-wUfYa)
- [Design Uber Eats Mock Interview](https://www.youtube.com/watch?v=SbXDhAKgWek)
- [Chat Mock Interview](https://www.youtube.com/watch?v=m6ab37t2ypQ)

Nos vemos no próximo post! See ya!