# AutoInspect

**Vehicle Inspection & Certification Platform**

AutoInspect is a full-stack TypeScript monorepo for managing vehicle inspections end to end — from booking and field inspection through photos, certificates, payments, maintenance history, and analytics.

Built for inspectors, customers, garages, and platform admins, it ships four focused applications on a shared NestJS API and Next.js web layer, ready to run locally or via Docker.

---

## Table of Contents

- [Overview](#overview)
- [Applications](#applications)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Docker](#docker)
- [Testing](#testing)
- [API Overview](#api-overview)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

AutoInspect centralizes the operational workflows of a modern inspection network:

| Role | What they do in AutoInspect |
| --- | --- |
| **Inspectors** | Run inspections, capture photos, complete checklists, issue certificates |
| **Customers** | Book services, manage vehicles, pay invoices, download certificates |
| **Garages** | Manage work orders, inventory, scheduling, and shop analytics |
| **Admins** | Control users, organizations, compliance, audit logs, and settings |

The platform is designed as an npm workspaces monorepo so shared types and domain utilities stay consistent across the API and web clients.

---

## Applications

| App | Path | Description |
| --- | --- | --- |
| **Inspector App** | `/inspector` | Field inspection workspace |
| **Customer Portal** | `/customer` | Self-service booking and vehicle hub |
| **Garage Dashboard** | `/garage` | Shop operations and analytics |
| **Admin** | `/admin` | Platform administration |

Backend API: NestJS service under `apps/api` (default `http://localhost:4000/api`).

---

## Features

- **Inspection Reports** — create, score, update, and export inspection records
- **Photos** — attach and manage inspection imagery with metadata
- **Certificates** — issue, track, and expire vehicle certificates
- **Bookings** — schedule inspection appointments with confirmation codes
- **Payments** — record transactions, fees, and refunds
- **Maintenance History** — store service records and next-due dates
- **Analytics** — aggregate metrics for operators and admins

Additional domain modules include vehicles, users, garages, inventory, work orders, invoices, compliance, notifications, and more.

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Language | TypeScript |
| Web | Next.js 14, React 18, Tailwind CSS |
| API | NestJS 10, Passport JWT, Swagger |
| Data | PostgreSQL, TypeORM |
| Shared | `@autoinspect/shared` workspace package |
| Tooling | Jest, Docker, Docker Compose |
| Package manager | npm workspaces |

---

## Repository Structure

```text
AutoInspect/
├── apps/
│   ├── api/                 # NestJS backend
│   └── web/                 # Next.js portals (inspector, customer, garage, admin)
├── packages/
│   └── shared/              # Shared types, utils, and domain rules
├── .github/                 # Issue & PR templates
├── docker-compose.yml
├── package.json
├── CONTRIBUTING.md
└── README.md
```

---

## Prerequisites

- **Node.js** 18+ (20 recommended)
- **npm** 9+
- **Docker** & **Docker Compose** (optional, recommended for PostgreSQL)
- **Git**

---

## Installation

### 1. Clone the repository

```bash
git clone git@github.com:Biruk-ak/AutoInspect.git
cd AutoInspect
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env` as needed (see [Configuration](#configuration)).

### 4. Start PostgreSQL

```bash
docker compose up -d db
```

### 5. Run the apps

```bash
# Terminal 1 — API
npm run dev:api

# Terminal 2 — Web
npm run dev:web
```

- Web: [http://localhost:3000](http://localhost:3000)
- API: [http://localhost:4000/api](http://localhost:4000/api)
- Swagger: [http://localhost:4000/api/docs](http://localhost:4000/api/docs)

---

## Configuration

Copy `.env.example` to `.env` and adjust values:

| Variable | Description | Default |
| --- | --- | --- |
| `DATABASE_HOST` | PostgreSQL host | `localhost` |
| `DATABASE_PORT` | PostgreSQL port | `5432` |
| `DATABASE_USER` | Database user | `autoinspect` |
| `DATABASE_PASSWORD` | Database password | `autoinspect` |
| `DATABASE_NAME` | Database name | `autoinspect` |
| `JWT_SECRET` | JWT signing secret | `dev-secret` |
| `PORT` | API port | `4000` |
| `NEXT_PUBLIC_API_URL` | Web → API base URL | `http://localhost:4000/api` |

> **Security:** Never commit real secrets. Keep production credentials in your host/CI secret store.

---

## Usage

### Open a portal

From the landing page, pick a workspace:

```text
http://localhost:3000/inspector
http://localhost:3000/customer
http://localhost:3000/garage
http://localhost:3000/admin
```

### Register / login (API)

```bash
# Register
curl -X POST http://localhost:4000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "inspector@example.com",
    "password": "password1",
    "name": "Alex Inspector",
    "role": "inspector",
    "organizationId": "00000000-0000-0000-0000-000000000001"
  }'

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "inspector@example.com",
    "password": "password1"
  }'
```

### Create an inspection (example)

```bash
TOKEN="<accessToken from login>"

curl -X POST http://localhost:4000/api/inspections \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "status": "draft",
    "notes": "Annual safety inspection",
    "organizationId": "00000000-0000-0000-0000-000000000001",
    "priority": 70,
    "tags": ["annual", "safety"]
  }'
```

### List bookings

```bash
curl "http://localhost:4000/api/bookings?page=1&limit=20" \
  -H "Authorization: Bearer $TOKEN"
```

### Health check

```bash
curl http://localhost:4000/api/health
```

---

## Docker

Run the full stack (database + API + web):

```bash
docker compose up --build -d
```

Stop:

```bash
docker compose down
```

Services:

| Service | Port |
| --- | --- |
| `web` | `3000` |
| `api` | `4000` |
| `db` | `5432` |

---

## Testing

```bash
# All workspaces
npm test

# Shared package only
npm run test -w @autoinspect/shared

# API only
npm run test -w @autoinspect/api

# Web only
npm run test -w @autoinspect/web
```

The repository includes **300+** automated test cases covering services, controllers, entities, shared utilities, and client helpers.

---

## API Overview

Authenticated routes use Bearer JWT. Core resource modules expose consistent CRUD-style endpoints, for example:

| Module | Base path |
| --- | --- |
| Auth | `/api/auth` |
| Inspections | `/api/inspections` |
| Photos | `/api/photos` |
| Certificates | `/api/certificates` |
| Bookings | `/api/bookings` |
| Payments | `/api/payments` |
| Maintenance | `/api/maintenance` |
| Analytics | `/api/analytics` |
| Vehicles | `/api/vehicles` |

Interactive docs are available at `/api/docs` when the API is running.

---

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for clone, setup, branch, and pull request guidelines.

Use the GitHub issue templates for bugs and feature requests, and fill out the pull request template when opening a PR.

---

## Author

**Biruk-ak** — [birukaklilu0110@gmail.com](mailto:birukaklilu0110@gmail.com)

Repository: [github.com/Biruk-ak/AutoInspect](https://github.com/Biruk-ak/AutoInspect)

---

## License

MIT © Biruk-ak
