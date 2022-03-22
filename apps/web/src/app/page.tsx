import Link from 'next/link';

const portals = [
  {
    href: '/inspector',
    title: 'Inspector App',
    copy: 'Run inspections, capture photos, issue certificates.',
  },
  {
    href: '/customer',
    title: 'Customer Portal',
    copy: 'Book services, track vehicles, download certificates.',
  },
  {
    href: '/garage',
    title: 'Garage Dashboard',
    copy: 'Manage work orders, inventory, and shop analytics.',
  },
  {
    href: '/admin',
    title: 'Admin',
    copy: 'Control users, compliance, and platform settings.',
  },
];

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(135deg, #0f1c2e 0%, #3d5a73 42%, #8fa6b8 70%, #e8eef5 100%)',
        }}
      />
      <div className="absolute inset-0 -z-10 opacity-30"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.25), transparent 40%), radial-gradient(circle at 80% 0%, rgba(196,92,38,0.35), transparent 35%)',
        }}
      />
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16 text-white">
        <p className="font-display text-5xl font-bold tracking-tight md:text-7xl">AutoInspect</p>
        <h1 className="mt-4 max-w-2xl text-2xl font-medium text-white/90 md:text-3xl">
          Vehicle Inspection & Certification Platform
        </h1>
        <p className="mt-4 max-w-xl text-base text-white/75">
          Reports, photos, certificates, bookings, payments, maintenance history, and analytics —
          in one TypeScript stack.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/customer/bookings"
            className="rounded-md bg-[var(--brand-signal)] px-5 py-3 text-sm font-semibold text-white"
          >
            Start a booking
          </Link>
          <Link
            href="/inspector/inspections"
            className="rounded-md border border-white/40 bg-white/10 px-5 py-3 text-sm font-semibold backdrop-blur"
          >
            Open inspector
          </Link>
        </div>
        <section className="mt-20 grid gap-4 md:grid-cols-2">
          {portals.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="rounded-xl border border-white/20 bg-white/10 p-5 backdrop-blur transition hover:bg-white/15"
            >
              <h2 className="font-display text-xl font-semibold">{p.title}</h2>
              <p className="mt-2 text-sm text-white/75">{p.copy}</p>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}
