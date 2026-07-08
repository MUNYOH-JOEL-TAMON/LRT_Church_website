import { Link } from 'react-router-dom';
import {
  Users,
  BookOpen,
  CalendarDays,
  HeartHandshake,
  Megaphone,
  PenLine,
  Image,
  Plus,
  TrendingUp,
  UserPlus,
  ArrowRight,
} from 'lucide-react';
import StatCard from '../../components/admin/StatCard';
import useAuthStore from '../../store/useAuthStore';

// Placeholder stats — these will be replaced with real API data
const STATS = [
  { label: 'Total Members', value: 128, subtitle: '+12 this month', icon: <Users className="w-6 h-6 text-primary" /> },
  { label: 'Sermons', value: 47, subtitle: '3 new this week', icon: <BookOpen className="w-6 h-6 text-blue-600" /> },
  { label: 'Upcoming Events', value: 5, subtitle: 'Next: Sunday Service', icon: <CalendarDays className="w-6 h-6 text-emerald-600" /> },
  { label: 'Prayer Requests', value: 14, subtitle: '6 pending', icon: <HeartHandshake className="w-6 h-6 text-rose-600" /> },
];

const RECENT_ACTIVITY = [
  { icon: UserPlus, text: 'New member registered: Grace Munyoh', time: '2 hours ago', color: 'text-emerald-600 bg-emerald-50' },
  { icon: BookOpen, text: 'Sermon uploaded: Walking in the Spirit', time: '5 hours ago', color: 'text-blue-600 bg-blue-50' },
  { icon: CalendarDays, text: 'Youth Encounter Night created', time: '1 day ago', color: 'text-purple-600 bg-purple-50' },
  { icon: HeartHandshake, text: 'Prayer request marked as Answered', time: '2 days ago', color: 'text-rose-600 bg-rose-50' },
  { icon: Megaphone, text: 'New announcement published', time: '3 days ago', color: 'text-amber-600 bg-amber-50' },
];

const QUICK_ACTIONS = [
  { label: 'Add Sermon', to: '/admin/sermons', icon: BookOpen, color: 'bg-primary' },
  { label: 'Create Event', to: '/admin/events', icon: CalendarDays, color: 'bg-emerald-600' },
  { label: 'New Post', to: '/admin/blog', icon: PenLine, color: 'bg-purple-600' },
  { label: 'Upload Image', to: '/admin/gallery', icon: Image, color: 'bg-amber-600' },
];

const DashboardOverview = () => {
  const { user } = useAuthStore();

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-primary-dark via-primary to-primary-light text-white p-8 relative overflow-hidden shadow-xl shadow-primary/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-white/5 rounded-full translate-y-1/2"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-secondary font-semibold text-sm tracking-widest uppercase mb-2">Admin Dashboard</p>
            <h2 className="text-3xl font-heading font-extrabold mb-2">
              Welcome back, {user?.firstName}! 👋
            </h2>
            <p className="text-blue-100 max-w-lg">
              Here is an overview of your church platform. Manage members, content, and events all from one place.
            </p>
          </div>
          <TrendingUp className="w-16 h-16 text-secondary/30 hidden lg:block" />
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Quick Actions + Recent Activity */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="text-lg font-heading font-bold text-slate-800 mb-5">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {QUICK_ACTIONS.map(({ label, to, icon: Icon, color }) => (
              <Link
                key={label}
                to={to}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-slate-50 transition-colors group border border-slate-100"
              >
                <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}>
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-semibold text-slate-600">{label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-heading font-bold text-slate-800">Recent Activity</h3>
            <span className="text-xs text-slate-400">Last 7 days</span>
          </div>
          <div className="space-y-4">
            {RECENT_ACTIVITY.map(({ icon: Icon, text, time, color }, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">{text}</p>
                  <p className="text-xs text-slate-400">{time}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
