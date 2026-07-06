import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  CalendarDays,
  HeartHandshake,
  LogOut,
  User,
  Bell,
} from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import lrtLogo from '../../assets/LRT_LOGO.jpeg';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/portal/dashboard' },
  { icon: BookOpen, label: 'Sermons', to: '/portal/sermons' },
  { icon: CalendarDays, label: 'Events', to: '/portal/events' },
  { icon: HeartHandshake, label: 'Prayer Requests', to: '/portal/prayer' },
];

const PortalDashboard = () => {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full z-40">
        {/* Brand */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
          <img src={lrtLogo} alt="LRT" className="w-10 h-10 rounded-full object-cover border border-secondary/40" />
          <span className="text-lg font-heading font-extrabold text-white">
            Latter Rain <span className="text-secondary">LRT</span>
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 flex flex-col gap-1">
          {navItems.map(({ icon: Icon, label, to }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-200 group"
            >
              <Icon className="w-5 h-5 group-hover:text-secondary transition-colors" />
              <span className="font-medium">{label}</span>
            </Link>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-3 mb-1 rounded-xl bg-white/5">
            <div className="w-9 h-9 rounded-full bg-secondary/20 border border-secondary/30 flex items-center justify-center text-secondary font-bold text-sm">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-slate-400 truncate capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 group"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
          <h1 className="text-xl font-heading font-bold text-slate-800">Dashboard</h1>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-500">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-secondary rounded-full"></span>
            </button>
            <Link to="/portal/profile" className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-500">
              <User className="w-5 h-5" />
            </Link>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-8">
          {/* Welcome Banner */}
          <div className="rounded-3xl bg-gradient-to-br from-primary-dark via-primary to-primary-light text-white p-8 mb-8 relative overflow-hidden shadow-xl shadow-primary/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-white/5 rounded-full translate-y-1/2"></div>
            <div className="relative z-10">
              <p className="text-secondary font-semibold text-sm tracking-widest uppercase mb-2">Member Portal</p>
              <h2 className="text-3xl md:text-4xl font-heading font-extrabold mb-3">
                Welcome back, {user?.firstName}! 👋
              </h2>
              <p className="text-blue-100 max-w-lg">
                You are connected to your LRT account. Explore sermons, register for events, and submit prayer requests below.
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { label: 'Latest Sermon', value: 'Available', sub: 'Watch the most recent message', icon: BookOpen, color: 'text-primary' },
              { label: 'Upcoming Events', value: '3 Events', sub: 'Register and save your spot', icon: CalendarDays, color: 'text-secondary-dark' },
              { label: 'Prayer Requests', value: 'Submit Now', sub: 'Our team is praying for you', icon: HeartHandshake, color: 'text-emerald-600' },
            ].map(({ label, value, sub, icon: Icon, color }) => (
              <div key={label} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className={`${color} mb-4`}>
                  <Icon className="w-8 h-8" />
                </div>
                <p className="text-slate-500 text-sm font-medium mb-1">{label}</p>
                <p className="text-2xl font-heading font-bold text-slate-800 mb-1">{value}</p>
                <p className="text-slate-400 text-xs">{sub}</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PortalDashboard;
