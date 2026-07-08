import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CalendarDays,
  HeartHandshake,
  Megaphone,
  PenLine,
  Image,
  LogOut,
  Bell,
  ChevronRight,
} from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import lrtLogo from '../assets/LRT_LOGO.jpeg';

interface NavItem {
  icon: typeof LayoutDashboard;
  label: string;
  to: string;
  roles: string[]; // Which roles can see this item
}

const allNavItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/admin/dashboard', roles: ['Admin', 'Pastor', 'Editor'] },
  { icon: Users, label: 'Members', to: '/admin/users', roles: ['Admin'] },
  { icon: BookOpen, label: 'Sermons', to: '/admin/sermons', roles: ['Admin', 'Pastor'] },
  { icon: CalendarDays, label: 'Events', to: '/admin/events', roles: ['Admin', 'Pastor', 'Editor'] },
  { icon: HeartHandshake, label: 'Prayer Requests', to: '/admin/prayer-requests', roles: ['Admin', 'Pastor'] },
  { icon: Megaphone, label: 'Announcements', to: '/admin/announcements', roles: ['Admin', 'Editor'] },
  { icon: PenLine, label: 'Blog Posts', to: '/admin/blog', roles: ['Admin', 'Editor'] },
  { icon: Image, label: 'Gallery', to: '/admin/gallery', roles: ['Admin', 'Editor'] },
];

const AdminLayout = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  // Filter nav items based on user role
  const visibleNavItems = allNavItems.filter(
    (item) => user && item.roles.includes(user.role)
  );

  // Get current page title from nav items
  const currentPage = allNavItems.find((item) => location.pathname.startsWith(item.to));

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* ── Sidebar ── */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full z-40">
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <img
            src={lrtLogo}
            alt="LRT"
            className="w-10 h-10 rounded-full object-cover border border-secondary/40"
          />
          <div>
            <span className="text-sm font-heading font-extrabold text-white block leading-tight">
              LRT Admin
            </span>
            <span className="text-xs text-secondary font-semibold capitalize">{user?.role}</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
          {visibleNavItems.map(({ icon: Icon, label, to }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group
                  ${isActive
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'text-slate-400 hover:bg-white/10 hover:text-white'
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-secondary' : 'group-hover:text-secondary transition-colors'}`} />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight className="w-4 h-4 text-secondary/70" />}
              </Link>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="px-3 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-white/5">
            <div className="w-9 h-9 rounded-full bg-secondary/20 border border-secondary/30 flex items-center justify-center text-secondary font-bold text-xs">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 text-sm font-medium"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shadow-sm">
          <div>
            <h1 className="text-xl font-heading font-bold text-slate-800">
              {currentPage?.label || 'Admin'}
            </h1>
            <p className="text-xs text-slate-400">Latter Rain Tabernacle Management</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2.5 rounded-xl hover:bg-slate-100 transition-colors text-slate-500">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <Link
              to="/"
              className="text-sm text-slate-500 hover:text-primary px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
            >
              View Site →
            </Link>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
