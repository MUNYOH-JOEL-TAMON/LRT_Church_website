import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  BookOpen,
  CalendarDays,
  HeartHandshake,
  Megaphone,
  PenLine,
  Image,
  TrendingUp,
  Loader2,
} from 'lucide-react';
import StatCard from '../../components/admin/StatCard';
import useAuthStore from '../../store/useAuthStore';
import userService from '../../services/userService';
import sermonService from '../../services/sermonService';
import eventService from '../../services/eventService';
import prayerService from '../../services/prayerService';
import announcementService from '../../services/announcementService';
import type { Sermon, Event, PrayerRequest, Announcement } from '../../types';
import Modal from '../../components/admin/Modal';

const QUICK_ACTIONS = [
  { label: 'Add Sermon', to: '/admin/sermons', icon: BookOpen, color: 'bg-primary' },
  { label: 'Create Event', to: '/admin/events', icon: CalendarDays, color: 'bg-emerald-600' },
  { label: 'New Post', to: '/admin/blog', icon: PenLine, color: 'bg-purple-600' },
  { label: 'Upload Image', to: '/admin/gallery', icon: Image, color: 'bg-amber-600' },
];

// How long ago a date was, in a human-readable format
const timeAgo = (dateStr: string): string => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} minute${mins !== 1 ? 's' : ''} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? 's' : ''} ago`;
};

interface ActivityItem {
  icon: typeof BookOpen;
  text: string;
  time: string;
  color: string;
  sortKey: number;
}

const DashboardOverview = () => {
  const { user } = useAuthStore();

  const [stats, setStats] = useState({
    members: 0,
    sermons: 0,
    events: 0,
    pendingPrayers: 0,
    totalPrayers: 0,
  });
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setIsLoading(true);

        // Fetch all data in parallel
        const [usersRes, sermonsRes, eventsRes, prayersRes, announcementsRes] = await Promise.allSettled([
          userService.getAll(),
          sermonService.getAll(),
          eventService.getAll(),
          prayerService.getAll(),
          announcementService.getAll(),
        ]);

        const users    = usersRes.status    === 'fulfilled' ? (usersRes.value.data    || []) : [];
        const sermons  = sermonsRes.status  === 'fulfilled' ? (sermonsRes.value.data  || []) : [];
        const events   = eventsRes.status   === 'fulfilled' ? (eventsRes.value.data   || []) : [];
        const prayers  = prayersRes.status  === 'fulfilled' ? (prayersRes.value.data  || []) : [];
        const announcements = announcementsRes.status === 'fulfilled' ? (announcementsRes.value.data || []) : [];

        // KPI counts
        const pendingPrayers = prayers.filter((p: PrayerRequest) => p.status === 'Pending').length;
        const upcomingEvents = events.filter((e: Event) => new Date(e.date) >= new Date()).length;

        setStats({
          members: users.length,
          sermons: sermons.length,
          events: upcomingEvents,
          pendingPrayers,
          totalPrayers: prayers.length,
        });

        // Build recent activity from latest items across all collections
        const activityItems: ActivityItem[] = [];

        // Latest 2 users
        users.slice(0, 2).forEach((u: any) => {
          activityItems.push({
            icon: Users,
            text: `New member registered: ${u.firstName} ${u.lastName}`,
            time: timeAgo(u.createdAt),
            color: 'text-emerald-600 bg-emerald-50',
            sortKey: new Date(u.createdAt).getTime(),
          });
        });

        // Latest 2 sermons
        sermons.slice(0, 2).forEach((s: Sermon) => {
          activityItems.push({
            icon: BookOpen,
            text: `Sermon uploaded: ${s.title}`,
            time: timeAgo(s.createdAt),
            color: 'text-blue-600 bg-blue-50',
            sortKey: new Date(s.createdAt).getTime(),
          });
        });

        // Latest 2 events
        events.slice(0, 2).forEach((e: Event) => {
          activityItems.push({
            icon: CalendarDays,
            text: `Event created: ${e.title}`,
            time: timeAgo(e.createdAt),
            color: 'text-purple-600 bg-purple-50',
            sortKey: new Date(e.createdAt).getTime(),
          });
        });

        // Latest 2 prayer requests
        prayers.slice(0, 2).forEach((p: PrayerRequest) => {
          activityItems.push({
            icon: HeartHandshake,
            text: p.isPrivate
              ? 'Private prayer request submitted'
              : `Prayer request: "${p.request.slice(0, 40)}${p.request.length > 40 ? '…' : ''}"`,
            time: timeAgo(p.createdAt),
            color: 'text-rose-600 bg-rose-50',
            sortKey: new Date(p.createdAt).getTime(),
          });
        });

        // Latest 1 announcement
        announcements.slice(0, 1).forEach((a: Announcement) => {
          activityItems.push({
            icon: Megaphone,
            text: `Announcement: ${a.title}`,
            time: timeAgo(a.createdAt),
            color: 'text-amber-600 bg-amber-50',
            sortKey: new Date(a.createdAt).getTime(),
          });
        });

        // Sort by most recent and take top 4 to save space
        activityItems.sort((a, b) => b.sortKey - a.sortKey);
        setActivity(activityItems.slice(0, 4));

      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const statCards = [
    {
      label: 'Total Members',
      value: isLoading ? '—' : stats.members,
      subtitle: 'Registered accounts',
      icon: <Users className="w-6 h-6 text-primary" />,
    },
    {
      label: 'Sermons',
      value: isLoading ? '—' : stats.sermons,
      subtitle: 'In the archive',
      icon: <BookOpen className="w-6 h-6 text-blue-600" />,
    },
    {
      label: 'Upcoming Events',
      value: isLoading ? '—' : stats.events,
      subtitle: 'Scheduled ahead',
      icon: <CalendarDays className="w-6 h-6 text-emerald-600" />,
    },
    {
      label: 'Prayer Requests',
      value: isLoading ? '—' : stats.totalPrayers,
      subtitle: `${isLoading ? '—' : stats.pendingPrayers} pending`,
      icon: <HeartHandshake className="w-6 h-6 text-rose-600" />,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-primary-dark via-primary to-primary-light text-white p-6 md:p-8 relative overflow-hidden shadow-xl shadow-primary/20">
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
        {statCards.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Quick Actions + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h3 className="text-lg font-heading font-bold text-slate-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-2 gap-3">
            {QUICK_ACTIONS.map(({ label, to, icon: Icon, color }) => (
              <Link
                key={label}
                to={to}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-slate-50 active:bg-slate-100 transition-colors group border border-slate-100"
              >
                <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs font-semibold text-slate-600 text-center leading-tight">{label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-heading font-bold text-slate-800">Recent Activity</h3>
            <span className="text-xs text-slate-400">Live data</span>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-7 h-7 text-primary animate-spin" />
            </div>
          ) : activity.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-slate-400 text-sm">No recent activity yet.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {activity.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 active:bg-slate-100 transition-colors"
                  >
                    <div className={`w-9 h-9 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">
                        {item.text}
                      </p>
                      <p className="text-xs text-slate-400">{item.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Activity Detail Modal */}
      <Modal
        isOpen={!!selectedActivity}
        onClose={() => setSelectedActivity(null)}
        title="Activity Details"
        size="sm"
      >
        {selectedActivity && (
          <div className="space-y-5 text-center py-2">
            <div className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center ${selectedActivity.color}`}>
              <selectedActivity.icon className="w-7 h-7" />
            </div>
            <div className="space-y-2 px-2">
              <p className="text-base font-semibold text-slate-800 leading-relaxed">
                {selectedActivity.text}
              </p>
              <p className="text-xs text-slate-400">
                Occurred {selectedActivity.time}
              </p>
            </div>
            <div className="pt-2 flex justify-center">
              <button
                onClick={() => setSelectedActivity(null)}
                className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DashboardOverview;
