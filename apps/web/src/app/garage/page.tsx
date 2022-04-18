import Link from 'next/link';

const cards = [
  { href: '/garage/inspections', label: 'Inspection Reports' },
  { href: '/garage/photos', label: 'Photos' },
  { href: '/garage/certificates', label: 'Certificates' },
  { href: '/garage/bookings', label: 'Bookings' },
  { href: '/garage/payments', label: 'Payments' },
  { href: '/garage/maintenance', label: 'Maintenance History' },
  { href: '/garage/analytics', label: 'Analytics' },
];

export default function GarageDashboard() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-slate-900">Garage dashboard</h1>
        <p className="mt-2 text-slate-600">
          AutoInspect garage workspace for vehicle inspection operations.
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
            <p className="mt-2 text-sm text-slate-600">Open {c.label.toLowerCase()} in the garage app.</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
