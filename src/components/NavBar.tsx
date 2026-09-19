import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Activity, LayoutDashboard, CalendarDays, TrendingUp, Scale, User, LogOut, Menu, X } from 'lucide-react';

export type Page = 'dashboard' | 'tracker' | 'progress' | 'weight' | 'profile';

const navItems: { id: Page; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'tracker', label: 'Daily Tracker', icon: <CalendarDays className="w-4 h-4" /> },
  { id: 'progress', label: 'Progress', icon: <TrendingUp className="w-4 h-4" /> },
  { id: 'weight', label: 'Weight History', icon: <Scale className="w-4 h-4" /> },
  { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
];

export default function NavBar({ page, setPage }: { page: Page; setPage: (p: Page) => void }) {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  function nav(p: Page) {
    setPage(p);
    setMobileOpen(false);
  }

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-gray-800">HealthTrack</span>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => nav(item.id)}
                className={`nav-link ${page === item.id ? 'nav-link-active' : 'nav-link-inactive'}`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
            <button
              onClick={logout}
              className="nav-link nav-link-inactive ml-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </nav>

          <div className="md:hidden flex items-center gap-3">
            <span className="text-sm text-gray-500 max-w-[100px] truncate">{user?.fullName}</span>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg hover:bg-gray-100">
              {mobileOpen ? <X className="w-5 h-5 text-gray-600" /> : <Menu className="w-5 h-5 text-gray-600" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="md:hidden pb-4 flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => nav(item.id)}
                className={`nav-link ${page === item.id ? 'nav-link-active' : 'nav-link-inactive'}`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
            <button onClick={logout} className="nav-link nav-link-inactive">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}
