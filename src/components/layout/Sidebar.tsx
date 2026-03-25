import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileBarChart, Cable, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Overview', end: true },
  { to: '/dashboard/reports', icon: FileBarChart, label: 'Reports' },
  { to: '/dashboard/integration', icon: Cable, label: 'Integration' },
];

export function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-medical-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">MediSync</h1>
            <p className="text-[11px] text-gray-400">Care Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-medical-50 text-medical-700'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700',
              )
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Back to home */}
      <div className="p-4 border-t border-gray-100">
        <NavLink
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </NavLink>
      </div>
    </aside>
  );
}
