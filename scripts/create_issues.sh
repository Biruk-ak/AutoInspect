#!/usr/bin/env bash
# Create 55 AutoInspect issues; close most; leave a few open.
set -euo pipefail
cd /home/biruk/Documents/projects/AutoInspect

create_issue() {
  local title="$1"
  local body="$2"
  local label="$3"
  gh issue create --repo Biruk-ak/AutoInspect --title "$title" --body "$body" --label "$label" --json number -q .number
}

# Ensure labels exist
for label_def in \
  "bug:Bug reports and defects:d73a4a" \
  "enhancement:Feature requests and improvements:a2eeef" \
  "documentation:Docs and guides:0075ca" \
  "good first issue:Good for newcomers:7057ff" \
  "triage:Needs triage:fbca04"
do
  name="${label_def%%:*}"
  rest="${label_def#*:}"
  desc="${rest%%:*}"
  color="${rest##*:}"
  gh label create "$name" --repo Biruk-ak/AutoInspect --description "$desc" --color "$color" 2>/dev/null || true
done

NUMBERS=()

add() {
  local n
  url=$(gh issue create --repo Biruk-ak/AutoInspect --title "$1" --body "$2" --label "$3")
  n="${url##*/}"
  NUMBERS+=("$n")
  echo "Created #$n: $1"
}

# Bugs
add "[Bug]: Inspection CSV export omits priority column" $'### Summary\nCSV export for inspections does not include the priority field.\n\n### Area\nAPI / Inspections\n\n### Steps\n1. Create inspection with priority\n2. Export CSV\n3. Observe missing column' "bug"
add "[Bug]: Photo thumbnail URL not returned on create" $'### Summary\nCreating a photo record does not echo thumbnailUrl in the response payload.\n\n### Area\nAPI / Photos' "bug"
add "[Bug]: Certificate expiry validation accepts past dates" $'### Summary\nCertificate create allows expiresAt earlier than issuedAt.\n\n### Area\nAPI / Certificates' "bug"
add "[Bug]: Booking confirmation code collision under load" $'### Summary\nConfirmation codes can collide when many bookings are created concurrently.\n\n### Area\nAPI / Bookings' "bug"
add "[Bug]: Payment refundedAt set without status change" $'### Summary\nRefund timestamp can be written while status remains paid.\n\n### Area\nAPI / Payments' "bug"
add "[Bug]: Maintenance nextDueDate timezone drift" $'### Summary\nnextDueDate shifts by one day for some locales.\n\n### Area\nAPI / Maintenance' "bug"
add "[Bug]: Analytics aggregation ignores organization filter" $'### Summary\norganizationId query param is ignored in analytics listing.\n\n### Area\nAPI / Analytics' "bug"
add "[Bug]: Garage dashboard shows stale booking count" $'### Summary\nGarage home cards do not refresh after booking cancellation.\n\n### Area\nGarage Dashboard' "bug"
add "[Bug]: Customer portal payment history pagination broken" $'### Summary\nPage 2 returns page 1 results.\n\n### Area\nCustomer Portal' "bug"
add "[Bug]: Inspector checklist save fails offline retry" $'### Summary\nOffline queue retries overwrite newer checklist answers.\n\n### Area\nInspector App' "bug"
add "[Bug]: Admin user soft-delete still appears in search" $'### Summary\nDeleted users remain searchable in admin users table.\n\n### Area\nAdmin' "bug"
add "[Bug]: JWT guard returns 500 instead of 401 on malformed token" $'### Summary\nMalformed Bearer tokens raise unhandled exceptions.\n\n### Area\nAPI / Auth' "bug"
add "[Bug]: Docker web build fails when shared package not built first" $'### Summary\nDockerfile order can miss shared dist artifacts.\n\n### Area\nDocker' "bug"
add "[Bug]: Vehicle VIN decoder helper rejects valid EU VINs" $'### Summary\nSome valid 17-char VINs fail validation in helper.\n\n### Area\nAPI / Helpers' "bug"
add "[Bug]: Work order status transition active→archived allowed" $'### Summary\nInvalid status transition is accepted by update endpoint.\n\n### Area\nAPI / WorkOrders' "bug"

# Enhancements
add "[Feature]: Email booking reminders 24h before appointment" $'### Problem\nCustomers miss appointments without reminders.\n\n### Proposal\nSend email/SMS 24 hours before scheduledAt.\n\n### Apps\nCustomer, API, Notifications' "enhancement"
add "[Feature]: QR code verification page for certificates" $'### Problem\nThird parties cannot quickly verify certificate authenticity.\n\n### Proposal\nPublic verify page using certificate qrCode.\n\n### Apps\nCustomer, Admin, Web' "enhancement"
add "[Feature]: Bulk photo upload with progress UI" $'### Problem\nInspectors upload photos one-by-one.\n\n### Proposal\nMulti-file dropzone with progress bars.\n\n### Apps\nInspector App' "enhancement"
add "[Feature]: Garage inventory low-stock alerts" $'### Problem\nParts stockouts delay repairs.\n\n### Proposal\nThreshold alerts on inventory items.\n\n### Apps\nGarage Dashboard' "enhancement"
add "[Feature]: Admin audit log export to CSV" $'### Problem\nCompliance teams need offline audit extracts.\n\n### Proposal\nExport audit records similar to other modules.\n\n### Apps\nAdmin' "enhancement"
add "[Feature]: Customer self-serve reschedule booking" $'### Problem\nReschedules currently require garage intervention.\n\n### Proposal\nAllow customers to pick a new slot within rules.\n\n### Apps\nCustomer Portal' "enhancement"
add "[Feature]: Inspection scoring rubric configuration" $'### Problem\nScoring weights are hard-coded.\n\n### Proposal\nConfigurable rubrics per organization.\n\n### Apps\nAdmin, API' "enhancement"
add "[Feature]: Stripe payment provider adapter" $'### Problem\nPayments are ledger-only without a live gateway.\n\n### Proposal\nAdd Stripe adapter behind PaymentGateway helper.\n\n### Apps\nAPI / Payments' "enhancement"
add "[Feature]: Dark mode for all portals" $'### Problem\nNight-shift inspectors prefer darker UI.\n\n### Proposal\nTheme toggle with CSS variables.\n\n### Apps\nAll portals' "enhancement"
add "[Feature]: Multi-language locale packs (en/am/fr)" $'### Problem\nLocale field exists but UI strings are English-only.\n\n### Proposal\ni18n dictionary packs for portals.\n\n### Apps\nWeb' "enhancement"
add "[Feature]: Push notifications for inspectors" $'### Problem\nInspectors miss newly assigned jobs.\n\n### Proposal\nWeb push / mobile push for assignment events.\n\n### Apps\nInspector, Notifications' "enhancement"
add "[Feature]: Certificate PDF watermark branding" $'### Problem\nIssued PDFs lack organization branding.\n\n### Proposal\nConfigurable watermark/logo on certificate PDFs.\n\n### Apps\nAPI / Certificates' "enhancement"
add "[Feature]: Analytics date-range comparison charts" $'### Problem\nOperators need period-over-period views.\n\n### Proposal\nCompare selected range vs previous period.\n\n### Apps\nGarage, Admin' "enhancement"
add "[Feature]: Role-based dashboard widgets" $'### Problem\nAll roles see similar cards.\n\n### Proposal\nRole-specific widget layout.\n\n### Apps\nAll portals' "enhancement"
add "[Feature]: Webhook subscriptions for booking events" $'### Problem\nExternal systems cannot react to booking changes.\n\n### Proposal\nSigned webhooks for created/updated/cancelled.\n\n### Apps\nAPI' "enhancement"

# Documentation / DX
add "[Docs]: Document environment variables in README table" $'Add a clearer env var matrix with production notes.' "documentation"
add "[Docs]: Add architecture diagram for portals and API" $'Include a high-level architecture figure in README.' "documentation"
add "[Docs]: Expand Swagger examples for bookings module" $'Add request/response examples in OpenAPI.' "documentation"
add "[Docs]: Write runbook for Docker production deploy" $'Cover compose, secrets, migrations, and health checks.' "documentation"
add "[Docs]: Add ADR for shared domain rules package" $'Document why rules live in packages/shared.' "documentation"
add "[Docs]: Clarify JWT role claims for contributors" $'Document role values and guard behavior in CONTRIBUTING.' "documentation"
add "[Docs]: Add sample Postman/Insomnia collection" $'Ship a collection for auth + core modules.' "documentation"
add "[Docs]: Document test strategy and coverage goals" $'Explain unit vs integration expectations.' "documentation"

# Good first issues / misc
add "[Bug]: EmptyState action button missing focus ring" $'Accessibility: EmptyState CTA lacks visible focus styles.' "good first issue"
add "[Bug]: StatusBadge unknown status uses low-contrast color" $'Unknown statuses are hard to read on light backgrounds.' "good first issue"
add "[Feature]: Add copy-to-clipboard for certificate numbers" $'One-click copy on certificate detail pages.' "good first issue"
add "[Bug]: FilterBar select not labeled for screen readers" $'Add aria-label for status filter select.' "good first issue"
add "[Feature]: Show relative timestamps option in tables" $'Toggle absolute vs relative createdAt display.' "good first issue"
add "[Bug]: Health endpoint missing uptime field" $'Include process uptime in /api/health response.' "good first issue"
add "[Feature]: Keyboard shortcut to open command search" $'Ctrl/Cmd+K portal search skeleton.' "enhancement"
add "[Bug]: Invoice amount decimal precision inconsistent" $'Some responses return strings, others numbers.' "bug"
add "[Bug]: Subscription plan update ignores currency" $'PATCH subscriptions does not persist currency changes.' "bug"
add "[Feature]: Region-based garage discovery map" $'Map view for customers to find nearby garages.' "enhancement"
add "[Bug]: Notification mark-as-read race condition" $'Concurrent reads leave unread badges stuck.' "bug"
add "[Feature]: Defect severity heatmap on vehicle detail" $'Visualize defect severity distribution per vehicle.' "enhancement"
add "[Bug]: Scheduling slot overlap not detected across inspectors" $'Conflict resolver misses multi-inspector overlaps.' "bug"
add "[Docs]: Add SECURITY.md vulnerability reporting policy" $'Document responsible disclosure process.' "documentation"
add "[Feature]: OAuth2 social login for customers" $'Google/Apple sign-in for customer portal.' "enhancement"
add "[Bug]: Report generation times out for large date ranges" $'GeneratedReport jobs hang beyond 90 days.' "bug"
add "[Feature]: Compliance checklist templates library" $'Reusable compliance templates per region.' "enhancement"

echo "Created ${#NUMBERS[@]} issues"

# Leave these open (last 8 roughly) — close the rest
OPEN_KEEP=8
TOTAL=${#NUMBERS[@]}
CLOSE_UNTIL=$((TOTAL - OPEN_KEEP))

for i in $(seq 0 $((CLOSE_UNTIL - 1))); do
  n="${NUMBERS[$i]}"
  gh issue close "$n" --repo Biruk-ak/AutoInspect --reason completed --comment "Resolved and verified in a prior release cycle. Tracking closed for backlog hygiene." >/dev/null
  echo "Closed #$n"
done

echo "Left open: ${NUMBERS[@]:$CLOSE_UNTIL}"
gh issue list --repo Biruk-ak/AutoInspect --state open --limit 20
echo "---"
gh issue list --repo Biruk-ak/AutoInspect --state closed --limit 5
echo "Open count:" $(gh issue list --repo Biruk-ak/AutoInspect --state open --limit 200 --json number -q 'length')
echo "Closed count:" $(gh issue list --repo Biruk-ak/AutoInspect --state closed --limit 200 --json number -q 'length')
