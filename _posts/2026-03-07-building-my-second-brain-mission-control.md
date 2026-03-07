---
layout: post
title: "Building my Second Brain — How I designed a Mission Control system for real"
date: 2026-03-07
categories: [productivity, automation, openclaw, discord, linear]
tags: [second-brain, mission-control, openclaw, linear, github, discord, notion, automation]
---

# Building my Second Brain — How I designed a Mission Control system for real

I've been running an OpenClaw instance as my Mission Control for a while now. It connects to my Google Workspace, reads my Notion notes, pulls data from Paperclip for my company, and even runs a Tech Journal that curates relevant news for me every day. But I felt like something was missing. Everything was reactive — I was the one asking, always pulling information. I wanted the system to push things to me, challenge my priorities, and actually help me ship products faster.

So I decided to go deeper and build what people call a "Second Brain" — not just a note-taking system, but a full operational layer on top of my tools. This article is about how I designed and connected everything, the technical decisions, the problems I hit, and what I learned.

Let's do it.

## Point of start

The concept of a Second Brain comes from Tiago Forte and his C.O.D.E. framework — Capture, Organize, Distill, Express. The idea is simple: your biological brain is terrible at storing and retrieving information, so you offload that to a system and let your brain focus on what it does best — thinking, creating, deciding.

I already had pieces of this scattered across my tools. GitHub for code, Notion for notes, Google Calendar for events, Paperclip for business ops. But they were all silos. The OpenClaw was connecting them, sure, but without structure. Without routines. Without a feedback loop.

*The real problem wasn't the tools. It was the lack of a system that tied them together with intention.*

My goal was to design something with three properties:

1. **Proactive** — it tells me what matters before I ask
2. **Connected** — every tool feeds into a single flow
3. **Sustainable** — routines I can actually maintain without burning out

## The architecture

I mapped everything into four layers following C.O.D.E.:

```
[ CAPTURE ]  →  Quick ideas, tasks, links, voice notes, emails
      ↓
[ ORGANIZE ]  →  AI triages into PARA (Projects / Areas / Resources / Archive)
      ↓
[ DISTILL ]  →  Weekly summaries, progressive summarization, insight connections
      ↓
[ EXPRESS ]  →  Code shipped, docs published, decisions made, products launched
```

The key architectural decision was making **OpenClaw the orchestrator** — a hub-and-spoke model where everything flows through it. OpenClaw reads from all sources, processes with AI, and pushes outputs to the right destination.

### The stack

After evaluating a few options, this is what I landed on:

| Role | Tool | Why |
|------|------|-----|
| Orchestrator | OpenClaw | Already integrated with Workspace, Notion, Paperclip |
| Task Management | Linear (Free) | Native GitHub integration, Cycles, Roadmaps, API-first |
| Code & Deploy | GitHub | Repos, PRs, Actions, CI/CD |
| Notifications | Discord | Free, unlimited history, native webhooks |
| Knowledge Base | Notion | PARA structure, meeting notes, SOPs |
| Calendar | Google Calendar | Time-blocking, deadlines sync |
| Business Ops | Paperclip | Financial metrics, contracts |
| News Curation | Tech Journal | Daily curated feed via OpenClaw |

*I chose Linear over Todoist because my workflow is dev/product-centric. Linear speaks my language — it has Cycles (sprints), native GitHub sync where PRs automatically move issues, and an API that OpenClaw can talk to. The free tier gives you 250 active issues, all integrations, and full API access. More than enough.*

## The technical bits

### Linear ↔ GitHub (Native)

This was the easiest integration. Linear has built-in GitHub support. Once connected:

- Opening a PR with the Linear issue ID in the branch name automatically moves the issue to "In Progress"
- Merging the PR moves it to "Done"
- Linear generates standardized branch names like `feat/LIN-123-auth-oauth`

You set this up in Linear under **Settings → Integrations → GitHub**. Done in 2 minutes.

### Discord as the notification hub

This is where it got interesting. I don't use Slack — it's expensive and I don't need another tool to manage. Discord does everything I need for free.

I created a personal server called "Mission Control" with dedicated channels:

```
📁 SECOND BRAIN
├── #mission-control    → Morning Briefing, Evening Shutdown
├── #linear-updates     → Issue changes, daily wrap
├── #github-feed        → Commits, PRs, CI/CD status
├── #tech-journal       → Curated daily news
├── #alerts             → Paperclip metrics, deadline warnings
└── #capture-inbox      → Quick capture → bot processes → Linear/Notion
```

**Linear → Discord** is native. You just go to Linear Settings → Integrations → Discord, authorize the bot, and point it to `#linear-updates`. Then you get slash commands like `/linear issue` to create issues from Discord, `/linear search` to find them, and `/linear wrap` to post a summary of your day's work.

**GitHub → Discord** is also native. On each repo, go to Settings → Webhooks → Add webhook, and paste your Discord webhook URL with `/github` appended:

```
https://discord.com/api/webhooks/YOUR_ID/YOUR_TOKEN/github
```

Select the events you want (pushes, PRs, releases, workflow runs) and save. No Zapier, no n8n, no middleware.

**OpenClaw → Discord** uses standard webhook POSTs. I configured OpenClaw to send rich embeds for the Morning Briefing:

```json
{
  "username": "Mission Control",
  "embeds": [{
    "title": "☕ Morning Briefing — 07 Mar 2026",
    "color": 1733352,
    "fields": [
      { "name": "📅 Agenda", "value": "[Calendar data]" },
      { "name": "🎯 Top 3 Tasks", "value": "[Linear cycle priorities]" },
      { "name": "🔀 PRs Pending", "value": "[GitHub open PRs]" },
      { "name": "📰 Tech News", "value": "[Journal highlights]" },
      { "name": "📊 Metrics", "value": "[Paperclip KPIs]" }
    ],
    "footer": { "text": "Second Brain Mission Control" },
    "timestamp": "2026-03-07T07:00:00.000Z"
  }]
}
```

The same pattern works for the Evening Shutdown, Tech Journal digest, and Paperclip alerts — just change the webhook URL to target the right channel.

### Notion PARA structure

I organized Notion into four top-level databases following the PARA method:

- **Projects** — things with a deadline or clear goal (linked to Linear initiatives)
- **Areas** — ongoing responsibilities with standards to maintain
- **Resources** — references, tutorials, SOPs, playbooks
- **Archive** — completed projects, old references (searchable but out of the way)

The key properties on the Projects database: Status, Priority (P0-P3), Area (relation), Linear Link, GitHub Repo, Target Date, and a Progress rollup.

*The important thing here is that Notion is the knowledge layer, not the execution layer. Execution lives in Linear. Notion stores the "why" and "what I learned", Linear tracks the "what to do next".*

### OpenClaw routines

The routines are what make this a system instead of just a collection of tools. I configured three core loops:

**Morning Briefing (7:00 AM)** — OpenClaw pulls Calendar events, Linear top priorities, GitHub pending PRs, Tech Journal headlines, and Paperclip metrics. Formats everything into a Discord embed and sends to `#mission-control`.

**Evening Shutdown (5:30 PM)** — Auto-logs what was done (from Linear status changes), identifies what's still pending, moves incomplete tasks to tomorrow, and sets the top 3 for the next day.

**Weekly Review (Friday 5:00 PM)** — Compares planned vs. completed tasks from the Linear cycle, summarizes GitHub activity, flags stale projects (no activity > 7 days), and suggests priority adjustments for next week.

## Problems on the way

The biggest challenge wasn't technical — it was **over-engineering**. My first attempt had too many automations, too many channels, too many notifications. I was spending more time configuring the system than actually using it.

I scaled back to the essentials: Morning Briefing, Evening Shutdown, and the three Discord integrations (Linear, GitHub, OpenClaw). Everything else can come later.

Another problem was the **capture habit**. Having a `#capture-inbox` channel is useless if you don't actually use it. I'm still building the muscle memory of typing ideas into Discord instead of letting them dissolve. The friction is low — open Discord, type in the channel, done — but the habit takes time.

The Linear free tier limit of 250 active issues also means you need to be disciplined about archiving completed work. Not a dealbreaker, but something to keep in mind.

*One thing I realized: the best system is the one you actually use. Start simple, iterate fast. Don't try to build the perfect Second Brain on day one.*

## What's next?

The system is running. The foundation is solid. But there's a lot of room to grow:

- **Capture bot** — A Discord bot that listens to `#capture-inbox`, sends messages to OpenClaw for AI classification, and auto-creates issues in Linear or notes in Notion
- **Thought Partner mode** — An OpenClaw routine that proactively challenges my priorities, identifies blind spots, and suggests connections between projects
- **Dashboard** — A visual overview pulling metrics from all sources into a single view
- **Monthly retro automation** — OKR tracking, financial summary from Paperclip, learning log from Notion, all auto-generated

The evolution of this project mirrors what I do with code: start with a working prototype, ship it, observe, iterate. The same System Design thinking I applied to building iOS apps applies here — define requirements, design the architecture, implement incrementally, and refine based on real usage.

If you're drowning in tools and feeling like nothing connects, start with one integration. Just one. Connect your GitHub to a Discord webhook. See that notification pop up. Feel the dopamine. Then add the next piece. Before you know it, you have a system that works *for* you instead of you working *for* the system.

See ya, até mais!
