import { NavLink } from 'react-router-dom';
import { cn } from '../../utils/cn';

const navItems = [
  { to: '/', label: 'Home', icon: '◉' },
  { to: '/lock', label: 'Lock', icon: '◈' },
  { to: '/stations', label: 'Stations', icon: '◎' },
  { to: '/analytics', label: 'Stats', icon: '◇' },
  { to: '/settings', label: 'Settings', icon: '⚙' },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface/80 backdrop-blur-xl border-t border-surface-border safe-bottom z-40">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors min-w-[56px]',
                isActive ? 'text-accent' : 'text-muted hover:text-white',
              )
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
