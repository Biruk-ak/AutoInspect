import Link from 'next/link';

const cards = [
  { href: '/inspector/inspections', label: 'Inspection Reports' },
  { href: '/inspector/photos', label: 'Photos' },
  { href: '/inspector/certificates', label: 'Certificates' },
  { href: '/inspector/bookings', label: 'Bookings' },
  { href: '/inspector/payments', label: 'Payments' },
  { href: '/inspector/maintenance', label: 'Maintenance History' },
  { href: '/inspector/analytics', label: 'Analytics' },
];

export default function InspectorDashboard() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-slate-900">Inspector dashboard</h1>
        <p className="mt-2 text-slate-600">
          AutoInspect inspector workspace for vehicle inspection operations.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="rounded-xl border border-slate-200 bg-white/80 p-5 shadow-sm transition hover:border-slate-400"
          >
            <h2 className="text-lg font-semibold text-slate-900">{c.label}</h2>
            <p className="mt-2 text-sm text-slate-600">Open {c.label.toLowerCase()} in the inspector app.</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
