---
title: "MindKit"
tagline: "Sincronize configs de IA entre Claude, Cursor e mais."
description: "CLI tool para sincronizar configurações de desenvolvimento com IA através de múltiplas plataformas, com templates e backup automático."
kind: "app"
status: "Open Source"
featured: true
stack:
  - TypeScript
  - Node.js
  - CLI
links:
  website: ""
  app_store: ""
  github: "https://github.com/Viniciuscarvalho/mindkit"
cover_image: "/assets/apps/mindkit/og-image.png"
screenshots: []
highlights:
  - "Sincronização entre Claude Code, Cursor e OpenAI Codex"
  - "TUI interativa para seleção de ferramentas"
  - "Templates customizáveis de comandos e agentes"
  - "Backup automático e watch mode com sync em tempo real"
---

## Visão geral

O **MindKit** é uma ferramenta CLI para **sincronizar configurações de desenvolvimento com IA** entre múltiplas plataformas. A ideia é manter consistência de comandos, agentes e documentação em ferramentas como Claude Code, Cursor e OpenAI Codex.

## Funcionalidades principais

- **Suporte multi-plataforma**: sincroniza configs entre Claude Code, Cursor e OpenAI Codex de forma transparente.
- **Interface interativa**: TUI (Terminal User Interface) bonita para selecionar ferramentas e componentes.
- **Sistema de templates**: comandos, agentes e documentação customizáveis e reutilizáveis.
- **Proteção automática**: backup automático para proteger contra perda de configurações.
- **Watch mode**: sincronização em tempo real quando arquivos são modificados.
- **Path placeholders**: caminhos agnósticos de ferramenta que resolvem corretamente para cada plataforma.

## Templates Built-in

O MindKit já vem com templates prontos para uso:

**Comandos**:
- `create-prd`: criar Product Requirements Documents
- `generate-spec`: gerar especificações de features
- `generate-tasks`: quebrar specs em tarefas implementáveis

**Agentes**:
- `swift-expert`: especialista em iOS/macOS com Swift
- `backend-developer`: engenheiro backend sênior
- `ui-designer`: designer visual especializado
- `typescript-pro`: expert em TypeScript

## Instalação

```bash
# Uso direto (sem instalação)
npx mindkit install

# Instalação global via npm
npm install -g mindkit

# Via Homebrew
brew tap Viniciuscarvalho/mindkit
brew install mindkit
```

## Comandos principais

- `mindkit install` – instalar configurações nas ferramentas de IA
- `mindkit init` – inicializar em um projeto
- `mindkit sync` – sincronizar entre ferramentas
- `mindkit backup` – gerenciar backups
- `mindkit list` – exibir componentes disponíveis

## Links

- GitHub: [github.com/Viniciuscarvalho/mindkit](https://github.com/Viniciuscarvalho/mindkit)
