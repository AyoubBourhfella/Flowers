import { Link, NavLink, Outlet } from 'react-router-dom';
import { BRAND_NAME } from '@/lib/branding';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/flowers', label: 'Flowers' },
  { to: '/admin/bouquets', label: 'Bouquets' },
  { to: '/admin/catalog', label: 'Catalog' },
  { to: '/admin/branding', label: 'Branding' },
  { to: '/admin/flags', label: 'Feature Flags' },
  { to: '/admin/analytics', label: 'Analytics' },
  { to: '/admin/reviews', label: 'Reviews' },
];

export function AdminLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white/60 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-6">
          <Link to="/" className="font-semibold text-pink-600">
            {BRAND_NAME} Admin
          </Link>
          <nav className="flex gap-4 text-sm">
            {navItems.map((i) => (
              <NavLink
                key={i.to}
                to={i.to}
                end={i.end}
                className={({ isActive }) =>
                  cn(
                    'px-2 py-1 rounded-md hover:bg-pink-50 transition-colors',
                    isActive && 'bg-pink-100 text-pink-700 font-medium'
                  )
                }
              >
                {i.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
export default AdminLayout;
