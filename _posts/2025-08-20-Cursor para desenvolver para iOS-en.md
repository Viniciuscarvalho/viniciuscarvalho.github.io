---
layout: post
title: Using VSCode and Cursor for iOS development
date: 2025-08-19 12:00:36 +0530
categories:
  - Swift
  - AI
  - SwiftUI
  - Claude
lang: en
alternate: /swift/ia/swiftui/claude/2025/08/19/Cursor-para-desenvolver-para-iOS.html
permalink: /en/swift/ia/swiftui/claude/2025/08/19/Cursor-para-desenvolver-para-iOS.html
---

These days, not using AI can make you feel as though you’re falling behind. There are many tools: ChatGPT, Gemini, DeepSeek, and more. Rather than explain their models, I’ll focus on using VSCode or Cursor with [Claude AI](https://claude.ai), particularly Cursor. Xcode 26 also brings improvements and integrations with these tools. Here’s a [guide to try](https://wendyliga.com/blog/xcode-26-custom-model/) if you’re running the beta, since I’m writing this in August.

Let’s get started!

## IDE setup

Download [Cursor](https://www.cursor.com). At the time of writing, it has a free tier and additional features with a $20 subscription. Once installed, we’ll add the extensions and Homebrew tools needed to turn the editor into something potentially better than Xcode. Time will tell!

### Installations

1. `SweetPad`
2. `brew install xcode-build-server`
3. `brew install xcbeautify`
4. `brew install swiftformat`


1) SweetPad

The extension works in both VSCode and Cursor. To run the simulator, select the candy icon in Cursor’s sidebar, where you can view and build your iOS project.

2) Xcode Build Server

This provides autocomplete, go-to-definition, and error highlighting.

3) `brew install ios-deploy` and Xcbeautify

These tools improve terminal output and error-log readability directly in the IDE.

4) Swift Language Support

This is important for proper Swift language support in the editor.

## Project setup

I’ll use Cursor, where I’m trying to centralize my work, but VSCode also works. You need a project created in Xcode, or you can create one first and then open it in Cursor. Once the project is open:

Press `CMD+SHIFT+P` and select `Sweetpad: Generate Build Server Config` to generate this configuration.

This creates `buildServer.json` in the project root, enabling Xcode Build Server to work with that directory.

<a href="https://ibb.co/0LYr1w5"><img src="https://i.ibb.co/YSfhJrg/Captura-de-Tela-2025-08-19-s-18-36-28.png" alt="Build server configuration in Cursor" border="0"></a>

SweetPad can generate the project using Tuist, XcodeGen, or Build.

After clicking Run, you’ll see the list of available simulators:

<a href="https://ibb.co/nqWFB7YM"><img src="https://i.ibb.co/kVdtJ4w2/Captura-de-Tela-2025-08-19-s-18-51-33.png" alt="Available iOS simulators in Cursor" border="0"></a>

**Note**
Remember to review `Info.plist` and your app’s permissions so that you don’t accidentally enable unwanted data access or leave a security gap.

## What does Cursor offer?

The feature I most wanted was AI-based autocomplete. Xcode already offers autocomplete, but there’s room for improvement. I wanted more complete suggestions informed by the project’s context, which is where Cursor could help.

### Inline Edit

Press `CMD+K` on an empty line to generate context-aware code from a prompt. On an existing line of code, it includes the relevant snippet in the prompt. You can then request a refactoring or another change.

### Chat

Press `CMD+L` to open the panel, select a model, and attach code snippets or files for context. We could use ChatGPT or Claude on the web, but Cursor lets us do this inside the editor without switching contexts. For me, that’s a major difference from Xcode and helps speed up coding.

### Composer

This resembles Chat but helps edit and generate multiple files. I can see its value when starting a project from scratch; in an established project, I’m less convinced of its usefulness.

## Final thoughts

I’ve been exploring AI tools, so why not bring them into the iOS work I do every day? Before the capabilities arriving in Xcode 26, using another editor offered a way to get similar tools and some additional features for iOS development.

This was a practical overview of what I’ve been studying recently. It’s good to write again, and I’ll try to post more regularly about the things I’m learning.

## References

https://dimillian.medium.com/how-to-use-cursor-for-ios-development-54b912c23941

https://www.reddit.com/r/ChatGPTPro/comments/1i00wmh/this_is_the_right_way_to_build_ios_app_with_ai/

https://wendyliga.com/blog/xcode-26-custom-model/
