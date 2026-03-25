import { NavLink } from 'react-router-dom';
import { Home, Pill, BarChart3, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/patient/home', icon: Home, label: 'Home' },
  { to: '/patient/medications', icon: Pill, label: 'Medications' },
  { to: '/patient/history', icon: BarChart3, label: 'History' },
  { to: '/patient/settings', icon: Settings, label: 'Settings' },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white/95 backdrop-blur-md border-t border-gray-200 z-50">
      <div className="flex items-center justify-around py-2 px-4">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors',
                isActive ? 'text-medical-600' : 'text-gray-400 hover:text-gray-600',
              )
            }
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
