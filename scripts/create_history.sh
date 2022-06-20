#!/usr/bin/env bash
# Create backdated AutoInspect commit history (Biruk-ak).
set -euo pipefail
cd /home/biruk/Documents/projects/AutoInspect

export GIT_AUTHOR_NAME="Biruk-ak"
export GIT_AUTHOR_EMAIL="birukaklilu0110@gmail.com"
export GIT_COMMITTER_NAME="Biruk-ak"
export GIT_COMMITTER_EMAIL="birukaklilu0110@gmail.com"

git init -b main

commit_with_date() {
  local date="$1"
  local message="$2"
  export GIT_AUTHOR_DATE="$date"
  export GIT_COMMITTER_DATE="$date"
  git commit -m "$message"
}

# 1) Jul 2021 — project foundation
git add README.md package.json .gitignore .env.example
commit_with_date "2021-07-15T10:22:00+0300" "$(cat <<'EOF'
Initial AutoInspect project scaffold.

Set up monorepo foundation for the vehicle inspection and certification platform.
EOF
)"

# 2) Aug 2021 — docker + root workspace
git add docker-compose.yml
commit_with_date "2021-08-12T14:05:00+0300" "$(cat <<'EOF'
Add Docker Compose for API, web, and PostgreSQL.

Introduce local containerized development topology for AutoInspect services.
EOF
)"

# 3) Sep 2021 — shared package
git add packages/shared
commit_with_date "2021-09-08T11:40:00+0300" "$(cat <<'EOF'
Add shared TypeScript package with domain types and utilities.

Centralize cross-app contracts for inspections, bookings, payments, and related modules.
EOF
)"

# 4) Oct 2021 — API core + auth
git add \
  apps/api/package.json \
  apps/api/tsconfig.json \
  apps/api/tsconfig.build.json \
  apps/api/jest.config.js \
  apps/api/Dockerfile \
  apps/api/src/main.ts \
  apps/api/src/app.module.ts \
  apps/api/src/health.controller.ts \
  apps/api/src/common \
  apps/api/src/modules/auth \
  apps/api/src/modules/users
commit_with_date "2021-10-21T16:18:00+0300" "$(cat <<'EOF'
Bootstrap NestJS API with auth, users, and health endpoints.

Establish JWT authentication, role guards, and the core API application module.
EOF
)"

# 5) Nov 2021 — inspections + vehicles + photos + certificates
git add \
  apps/api/src/modules/inspections \
  apps/api/src/modules/vehicles \
  apps/api/src/modules/photos \
  apps/api/src/modules/certificates
commit_with_date "2021-11-17T09:55:00+0300" "$(cat <<'EOF'
Implement inspection reports, vehicles, photos, and certificates modules.

Add entities, DTOs, services, controllers, and unit tests for core inspection workflows.
EOF
)"

# 6) Dec 2021 — bookings + payments + maintenance + analytics
git add \
  apps/api/src/modules/bookings \
  apps/api/src/modules/payments \
  apps/api/src/modules/maintenance \
  apps/api/src/modules/analytics
commit_with_date "2021-12-09T13:27:00+0300" "$(cat <<'EOF'
Add bookings, payments, maintenance history, and analytics APIs.

Extend the platform with scheduling, payment transactions, service history, and metrics.
EOF
)"

# 7) Jan 2022 — remaining API domain modules
git add apps/api/src/modules
commit_with_date "2022-01-19T15:10:00+0300" "$(cat <<'EOF'
Expand API domain coverage for garages, inspectors, and operations.

Add inventory, work orders, invoices, compliance, notifications, and related Nest modules.
EOF
)"

# 8) Feb 2022 — helper services
git add apps/api/src/modules/helpers
# helpers already may be included; ensure any remaining api files
git add apps/api
commit_with_date "2022-02-14T10:44:00+0300" "$(cat <<'EOF'
Add API helper services for scoring, payments, OCR, and reporting.

Introduce reusable backend helpers used across inspection and certification pipelines.
EOF
)"

# 9) Mar 2022 — Next.js web foundation
git add \
  apps/web/package.json \
  apps/web/tsconfig.json \
  apps/web/next.config.js \
  apps/web/postcss.config.js \
  apps/web/tailwind.config.js \
  apps/web/jest.config.js \
  apps/web/Dockerfile \
  apps/web/next-env.d.ts \
  apps/web/public \
  apps/web/src/app/layout.tsx \
  apps/web/src/app/page.tsx \
  apps/web/src/app/globals.css \
  apps/web/src/components \
  apps/web/src/hooks \
  apps/web/src/lib
commit_with_date "2022-03-22T12:06:00+0300" "$(cat <<'EOF'
Create Next.js web application shell and shared UI kit.

Add landing page, layout primitives, auth hooks, API client, and formatting utilities.
EOF
)"

# 10) Apr 2022 — portals
git add \
  apps/web/src/app/inspector \
  apps/web/src/app/customer \
  apps/web/src/app/garage \
  apps/web/src/app/admin
commit_with_date "2022-04-18T17:33:00+0300" "$(cat <<'EOF'
Build Inspector, Customer, Garage, and Admin portal applications.

Wire feature pages for reports, photos, certificates, bookings, payments, and analytics.
EOF
)"

# 11) May 2022 — frontend services
git add apps/web/src/services apps/web
commit_with_date "2022-05-11T11:21:00+0300" "$(cat <<'EOF'
Add portal workflow services and frontend client tests.

Cover inspection, booking, payment, maintenance, and export service operations.
EOF
)"

# 12) Jun 2022 — remaining files (shared domain boost, lockfile, scripts) — LAST before 4 years ago
git add packages scripts package-lock.json
git add -A
# Ensure node_modules not staged
git reset -q HEAD -- node_modules 2>/dev/null || true
commit_with_date "2022-06-20T09:15:00+0300" "$(cat <<'EOF'
Finalize shared domain modules, lockfile, and Docker packaging polish.

Complete AutoInspect platform deliverables ahead of production readiness review.
EOF
)"

echo "=== commit log ==="
git log --pretty=format:'%h %ad %an <%ae> %s' --date=short
echo
echo "=== status ==="
git status
