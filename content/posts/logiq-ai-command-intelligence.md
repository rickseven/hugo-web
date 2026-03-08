---
title: "LogIQ: AI-Native Command Intelligence Engine"
date: 2026-03-08T07:24:36+07:00
draft: false
toc: true
images:
tags:
  - golang
  - ai
  - cli
  - developer-tools
  - mcp
  - clean-architecture
---

## The Problem

AI coding assistants are everywhere now. Claude, Cursor, GitHub Copilot - they're supposed to help you debug faster. But here's what actually happens:

Your build fails. You copy the error log. Paste it to your AI assistant. It says "I see the issue" and suggests something that doesn't work. You paste more logs. Token limit exceeded. You manually trim the logs. The AI now misses critical context. You end up debugging it yourself anyway.

Why? Because these tools weren't built to handle terminal output. They get:
- 10,000 lines of progress bars and timestamps
- The actual error buried somewhere in the middle
- No structure, just raw text
- Way too much noise for their context window

You need someone to read the logs first, find what matters, and hand over just the important bits. That's LogIQ.

## Token Savings

LogIQ's contextual compression combined with Run-Length Encoding (RLE) deduplication routinely drops AI terminal token consumption by up to 90% without losing critical debugging information:

| Framework / Tool | Raw Log Tokens | LogIQ Output | Reduction | Strategy |
|------------------|----------------|--------------|-----------|----------|
| **Cargo Test/Build** (Rust) | ~15,000 | ~1,500 | **-90%** | Removes dependency downloading noise & long stack trails |
| **Vite/Vue Build** (JS/TS) | ~4,500 | ~450 | **-90%** | Modules compiled deduplication |
| **Flutter Run** (Dart) | ~12,000 | ~1,200 | **-90%** | Device connectivity pooling & RLE |
| **Go Test** (Go) | ~6,000 | ~600 | **-90%** | Hides passing tests; surfaces exact line numbers |
| **Git Status/Diff** | ~3,000 | ~600 | **-80%** | Compact array grouping |
| **NPM Install/Yarn** | ~8,000 | ~80 | **-99%** | Suppresses ASCII loaders completely |

## What LogIQ Does

LogIQ is an AI-native command intelligence engine written in Go. It bridges the gap between human-readable command-line tools and AI coding agents by executing terminal commands, analyzing raw stdout/stderr logs in real-time, extracting structured insights, detecting common failures, suggesting actionable fixes, and compressing massive logs into condensed, highly meaningful context blocks perfectly sized for Large Language Models.

**Command Execution & Log Streaming**  
Instantly runs commands and monitors logs as they execute without memory bottlenecking.

**Error Intelligence Engine**  
Scans thousands of log lines to accurately pinpoint the root cause of a failure instead of just presenting symptoms.

**AI Debug Assistant**  
Automatically generates actionable resolution suggestions tailored to the specific failure using extensible heuristics.

**Ultra-Compact Context Compression**  
Smart filtering and Run-Length Encoding (RLE) deduplication shrinks 10,000 lines of noise purely to semantic signals, reducing AI token consumption by up to 90%.

**Token Savings Analytics**  
Built-in real-time calculation showcasing context size reduction metrics natively.

**Tee Mode (Raw Fallback Logging)**  
Automatically archives the full uncompressed raw log when errors happen, enabling AI agents to read the complete context via the `raw_log_path` API if needed.

**Command Explanation & Diagnostics**  
(`explain` / `doctor`) Translates raw semantic strings into explanations and scans local system telemetry.

**Extensible Plugin System**  
Easily inject new environment parsers via modular plugins (.so files).

**Model Context Protocol (MCP) Server**  
Native stdio-based JSON-RPC server ready to converse with Claude Desktop, Cursor, and other MCP-compatible frameworks.

## Installation

Grab the binary:

**[Download Latest Release](https://github.com/rickseven/logiq/releases/latest)**

Or install via Go:

```bash
go install github.com/rickseven/logiq/cmd/logiq@latest
```

Build from source:

```bash
git clone https://github.com/rickseven/logiq.git
cd logiq
go build -o logiq.exe ./cmd/logiq
```

## Usage

Run any command:

```bash
logiq run npm run build
logiq run flutter test
```

You get structured JSON output:

```json
{
  "tool": "vue",
  "command": "npm run build",
  "status": "failure",
  "summary": "Vite build failed due to syntax error in App.vue.",
  "metrics": {
    "duration_seconds": 4.1,
    "modules_compiled": 12,
    "original_bytes": 14500,
    "compressed_bytes": 1200,
    "savings_percentage": 91.7
  },
  "error_intel": {
    "root_cause": "SyntaxError: Unexpected token",
    "error_type": "build_error"
  },
  "suggestions": ["Check line 42 in App.vue for missing brackets/commas."],
  "raw_log_path": ".logiq/artifacts/exec-8f23719a-timestamp.log",
  "compressed_context": "..."
}
```

## Commands

| Command | What it does |
|---------|-------------|
| `logiq run <cmd>` | Execute and analyze a command |
| `logiq explain <cmd>` | Get plain English explanation |
| `logiq doctor` | System diagnostics and health check |
| `logiq trace` | View command history |
| `logiq plugins` | List available parsers |
| `logiq mcp` | Start MCP server for AI integration |

## MCP Integration

LogIQ acts as a native Model Context Protocol (MCP) server using the stdio transport, meaning it communicates via standard input/output. This is the industry-standard way to integrate tools with AI agents.

Start the MCP server:

```bash
logiq mcp
```

Available tools with Rich Markdown Outputs:

- `run_command` - Execute terminal tasks (supports Windows shell built-ins natively). Returns semantic summaries and structured metrics.
- `analyze_logs` - Ingests raw log content and applies LogIQ's compression/summarization pipeline.
- `explain` - Translates complex command syntax into plain English.
- `doctor` - Provides real-time system diagnostics and project health telemetry.

## Supported Frameworks

LogIQ supports **20+ intelligent parsers** across multiple ecosystems:

| Ecosystem | Tools & Frameworks |
|-----------|--------------------|
| **Web/JS** | Vite, Vitest, Webpack, Rollup, ESBuild, Next.js, Nuxt.js, Jest, Playwright, Cypress, ESLint, Prettier, Stylelint |
| **Mobile** | Flutter (Build, Test, Run), Android (Gradle) |
| **Microsoft/.NET** | .NET Core, ASP.NET MVC/WebForms, MSBuild, NuGet |
| **Backend & Logic** | Go Test, Python (Pytest), Rust (Cargo), golangci-lint |
| **DevOps & Infra** | Git Status/Diff, DB Migration (Prisma, Drizzle, Sequelize), NPM, PNPM, Yarn |

## Architecture

LogIQ enforces strict Clean Architecture and Layered Design ensuring uncoupled resilience:

```
CLI / MCP Server
    ↓
App Service Orchestrator
    ↓
Runtime Infrastructure
    ↓
Log Stream → Parser Plugins → Compressor → Error Intelligence → Debug Assistant
    ↓
Domain Structured Output
```

**Layers:**
1. **Domain Layer:** Pure foundational structures (`domain.StructuredOutput`)
2. **Application Layer:** Isolated core logic orchestrators (`pipeline`, `detector`, `errorintel`, `debugassist`, `ctxengine`)
3. **Infrastructure Layer:** Caching, telemetry plugins, config mapping, and physical command invocation (`runtime`)
4. **Interfaces Layer:** CLI command parsers and MCP HTTP multiplexers

## Plugin System

Built-in parsers:

- **Vue/Vite** - Vite, Vitest, Nuxt
- **Flutter** - Dart, Flutter builds, widget tests
- **.NET** - .NET Core, WebForms, MVC, MSBuild
- **Git** - Git status and diff analysis
- **Cargo** - Rust builds and tests

Adding a new tool parser amounts to writing a simple Go module implementing the `domain.Plugin` interface and pushing it into the `internal/infrastructure/plugin` loader.

## Why Use This

You're working with AI coding assistants and tired of:
- Pasting massive logs that hit token limits
- AI missing the actual error in walls of text
- Manual debugging when the AI can't figure it out
- No structured data for your automation

LogIQ handles all of that. Integrate LogIQ directly into your AI coding assistants or IDEs to automatically diagnose build failures and understand terminal workflows without passing gigabytes of redundant logs to the AI.

## Roadmap

- 🧠 **Improved Error Intelligence:** Introduce local mini-ML heuristics identifying abstract error codes natively instead of static regex
- 📡 **Distributed Mode:** Deploy logic servers entirely remotely dispatching containerized runners centrally
- 🔗 **JetBrains Integration:** Expand beyond VS Code/Cursor to support IntelliJ/WebStorm natively via MCP

## Get It

**[Download Latest Release](https://github.com/rickseven/logiq/releases/latest)**

[GitHub Repository](https://github.com/rickseven/logiq) • MIT License
