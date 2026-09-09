# Contributing to VoiceShield

Thank you for your interest in contributing to VoiceShield. This document outlines
the standards and workflow we follow to keep the codebase professional, consistent,
and SIH-ready.

---

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Branch Naming](#branch-naming)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Code Standards](#code-standards)
- [Testing](#testing)
- [Documentation](#documentation)

---

## Getting Started

1. **Fork** the repository (external contributors) or create a branch (team members)
2. **Clone** your fork locally
3. Set up the development environment following [README.md](README.md#local-setup)
4. Create a branch from `develop` (never from `main`)
5. Make your changes and open a pull request

---

## Development Workflow

```
main ← stable, judge-demo-ready only
└── develop ← team integration branch
    ├── feature/frontend-risk-dashboard
    ├── feature/websocket-reconnection
    ├── feature/ml-aasist-integration
    ├── fix/spectrogram-overflow
    └── docs/deployment-guide
```

- **Never push directly to `main`**
- All features must go through `develop` via pull request
- `main` receives merges only when the demo is fully stable

---

## Branch Naming

Use lowercase, hyphens, and a prefix:

| Prefix | Purpose | Example |
|---|---|---|
| `feature/` | New functionality | `feature/challenge-response-ui` |
| `fix/` | Bug fixes | `fix/websocket-reconnect-loop` |
| `docs/` | Documentation only | `docs/ml-pipeline-guide` |
| `chore/` | Config, tooling, CI | `chore/update-eslint-config` |
| `refactor/` | Code restructure | `refactor/audio-streamer-hook` |

---

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

**Types:** `feat` · `fix` · `docs` · `style` · `refactor` · `test` · `chore`

**Examples:**
- `feat(web): add real-time spectrogram heatmap overlay`
- `fix(api): prevent WebSocket crash on empty audio chunk`
- `docs(readme): update local setup instructions`
- `chore(ci): add GitHub Actions lint workflow`
- `feat(ml): integrate AASIST inference pipeline`
- `refactor(audio): replace ScriptProcessor with AudioWorklet`

---

## Pull Request Process

1. Ensure your branch is up to date with `develop`
2. Run all checks locally before opening a PR:
```bash
   pnpm lint && pnpm typecheck && pnpm build   # Frontend
   pytest tests/                               # Backend
```
3. Fill out the PR template completely
4. Request review from at least one team member
5. PRs must pass all GitHub Actions checks before merge
6. Squash commits before merging when appropriate

**PR Title format:** Same as commit messages — `feat(scope): description`

---

## Code Standards

### TypeScript (Frontend)
- Strict mode enabled — no `any` types
- All components fully typed with interfaces in `/types/`
- Use named exports (avoid default exports for components)
- Follow the existing folder structure under `apps/web/`

### Python (Backend)
- Python 3.11+, type hints on all functions
- Docstrings on all classes and public methods (Google style)
- Use `async def` for all WebSocket handlers and DB operations
- Format with `ruff` or `black`; lint with `ruff`

### General
- No secrets, API keys, or `.env` values in any commit
- No large binary files (models, datasets) committed to Git
- Keep functions focused — single responsibility
- Add comments for non-obvious logic

---

## Testing

### Frontend
```bash
pnpm --dir apps/web test
```

### Backend
```bash
cd apps/api && pytest tests/ -v
```

Write tests for:
- Decision engine threshold logic
- WebSocket protocol message handling
- Feature extraction output shapes
- Supabase insert/update functions

---

## Documentation

- Update the relevant `.md` file in `/docs/` when changing architecture or APIs
- Keep `API.md` in sync with any WebSocket message schema changes
- Add a model card in `/ml/model_cards/` when integrating a new anti-spoofing model
- Keep `.env.example` updated with all new environment variables (no real values)

---

## Questions?

Open a [GitHub Discussion](https://github.com/voiceshield-team/voiceshield-sih-2026/discussions)
or email the team at **voiceshield.sih@gmail.com**.

We appreciate every contribution — code, documentation, testing, or feedback.
