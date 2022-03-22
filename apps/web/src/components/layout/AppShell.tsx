'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV: Record<string, { href: string; label: string }[]> = {
  inspector: [
    { href: '/inspector', label: 'Dashboard' },
    { href: '/inspector/inspections', label: 'Inspections' },
    { href: '/inspector/photos', label: 'Photos' },
    { href: '/inspector/certificates', label: 'Certificates' },
    { href: '/inspector/checklists', label: 'Checklists' },
    { href: '/inspector/defects', label: 'Defects' },
  ],
  customer: [
    { href: '/customer', label: 'Dashboard' },
    { href: '/customer/bookings', label: 'Bookings' },
    { href: '/customer/vehicles', label: 'Vehicles' },
    { href: '/customer/certificates', label: 'Certificates' },
    { href: '/customer/payments', label: 'Payments' },
    { href: '/customer/maintenance', label: 'Maintenance' },
  ],
  garage: [
    { href: '/garage', label: 'Dashboard' },
    { href: '/garage/bookings', label: 'Bookings' },
    { href: '/garage/workorders', label: 'Work Orders' },
    { href: '/garage/inventory', label: 'Inventory' },
    { href: '/garage/invoices', label: 'Invoices' },
    { href: '/garage/analytics', label: 'Analytics' },
  ],
  admin: [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/users', label: 'Users' },
    { href: '/admin/garages', label: 'Garages' },
    { href: '/admin/inspectors', label: 'Inspectors' },
    { href: '/admin/analytics', label: 'Analytics' },
    { href: '/admin/audit', label: 'Audit' },
    { href: '/admin/settings', label: 'Settings' },
  ],
};

export function AppShell({
  portal,
  children,
}: {
  portal: 'inspector' | 'customer' | 'garage' | 'admin';
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const links = NAV[portal];

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_#e8eef5_0%,_#f7f5f1_45%,_#eef2f7_100%)]">
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold tracking-tight text-slate-900">
            AutoInspect
          </Link>
          <nav className="flex flex-wrap gap-1">
            {links.map((link) => {
              const active = pathname === link.href || pathname.startsWith(link.href + '/');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-md px-3 py-1.5 text-sm ${
                    active ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
