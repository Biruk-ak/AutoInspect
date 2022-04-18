import Link from 'next/link';

const cards = [
  { href: '/admin/inspections', label: 'Inspection Reports' },
  { href: '/admin/photos', label: 'Photos' },
  { href: '/admin/certificates', label: 'Certificates' },
  { href: '/admin/bookings', label: 'Bookings' },
  { href: '/admin/payments', label: 'Payments' },
  { href: '/admin/maintenance', label: 'Maintenance History' },
  { href: '/admin/analytics', label: 'Analytics' },
];

export default function AdminDashboard() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-slate-900">Admin dashboard</h1>
        <p className="mt-2 text-slate-600">
          AutoInspect admin workspace for vehicle inspection operations.
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
            <p className="mt-2 text-sm text-slate-600">Open {c.label.toLowerCase()} in the admin app.</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
