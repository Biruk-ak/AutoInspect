# Contributing to AutoInspect

Thank you for your interest in contributing to **AutoInspect** — the Vehicle Inspection & Certification Platform. This guide explains how to set up the project, work on changes, and submit pull requests.

---

## Code of Conduct

Be respectful, constructive, and collaborative. Assume good intent, keep discussions technical, and help maintain a professional environment for inspectors, garage operators, and platform engineers alike.

---

## Ways to Contribute

- Report bugs using the **Bug report** issue template
- Propose features using the **Feature request** issue template
- Improve documentation (`README.md`, `CONTRIBUTING.md`, comments, examples)
- Fix issues labeled `good first issue` or `help wanted`
- Submit pull requests that improve reliability, DX, tests, or performance

---

## Development Setup

### 1. Fork and clone

```bash
git clone git@github.com:<your-username>/AutoInspect.git
cd AutoInspect
git remote add upstream git@github.com:Biruk-ak/AutoInspect.git
```

### 2. Install dependencies

```bash
npm install
```

Requires **Node.js 18+**.

### 3. Environment

```bash
cp .env.example .env
```

Do not commit `.env` or any file containing secrets.

### 4. Start dependencies

```bash
docker compose up -d db
```

### 5. Run locally

```bash
npm run dev:api   # http://localhost:4000/api
npm run dev:web   # http://localhost:3000
```

### 6. Verify

```bash
npm test
npm run lint
```

---

## Project Layout (quick map)

| Path | Purpose |
| --- | --- |
| `apps/api` | NestJS API (auth, inspections, bookings, payments, …) |
| `apps/web` | Next.js portals (inspector / customer / garage / admin) |
| `packages/shared` | Shared TypeScript types, utils, and domain rules |
| `.github/` | Issue and pull request templates |

---

## Branching Workflow

1. Sync with upstream `main`:

   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. Create a descriptive branch:

   ```bash
   git checkout -b fix/inspection-export-csv
   # or
   git checkout -b feature/booking-reminder-emails
   ```

3. Prefer small, focused commits with clear messages:

   ```text
   Fix CSV export headers for inspection reports
   Add booking confirmation email hook
   Improve garage analytics empty state
   ```

---

## Coding Guidelines

- Prefer TypeScript strict typing; avoid unnecessary `any`
- Match existing NestJS module patterns (entity / DTO / service / controller / tests)
- Keep Next.js portal pages consistent with shared UI components under `apps/web/src/components`
- Reuse `@autoinspect/shared` types/utilities when possible
- Add or update tests for behavior changes
- Do not commit secrets, credentials, or local database dumps

---

## Tests

Before opening a PR, run:

```bash
npm test
```

Targeted runs:

```bash
npm run test -w @autoinspect/api
npm run test -w @autoinspect/web
npm run test -w @autoinspect/shared
```

---

## Submitting a Pull Request

1. Push your branch to your fork:

   ```bash
   git push -u origin HEAD
   ```

2. Open a PR against `Biruk-ak/AutoInspect` `main`
3. Fill out the pull request template completely
4. Link related issues (`Closes #123`)
5. Ensure CI checks (when configured) and tests pass
6. Keep the PR focused — large unrelated changes are harder to review

### PR checklist

- [ ] Branch is up to date with `main`
- [ ] Tests added/updated where appropriate
- [ ] Docs updated if behavior or setup changed
- [ ] No secrets or generated junk committed
- [ ] Issue linked (if applicable)

---

## Reporting Bugs

Use **.github/ISSUE_TEMPLATE/bug_report.md** and include:

- Clear title
- Steps to reproduce
- Expected vs actual behavior
- Environment (OS, Node version, browser if UI)
- Logs / screenshots when useful

---

## Requesting Features

Use **.github/ISSUE_TEMPLATE/feature_request.md** and include:

- Problem statement
- Proposed solution
- Alternatives considered
- Impacted portal(s): Inspector / Customer / Garage / Admin

---

## Review Process

Maintainers review PRs for correctness, clarity, test coverage, and fit with AutoInspect architecture. You may be asked for changes — that is normal. Once approved, a maintainer will merge.

---

## Questions

Open a GitHub Discussion or Issue, or contact the maintainer:

- **Biruk-ak** — birukaklilu0110@gmail.com
- Repository: https://github.com/Biruk-ak/AutoInspect

Thank you for helping improve AutoInspect.
