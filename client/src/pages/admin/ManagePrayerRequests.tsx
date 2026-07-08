import { useState } from 'react';
import { Search, Eye } from 'lucide-react';
import DataTable from '../../components/admin/DataTable';

const PLACEHOLDER_REQUESTS = [
  { _id: '1', subject: 'Healing for my mother', requestedBy: 'Grace Munyoh', isAnonymous: false, isPrivate: true, status: 'Pending', createdAt: '2025-07-06' },
  { _id: '2', subject: 'Guidance for my career', requestedBy: 'Anonymous', isAnonymous: true, isPrivate: false, status: 'Praying', createdAt: '2025-07-05' },
  { _id: '3', subject: 'Financial breakthrough', requestedBy: 'Daniel Nji', isAnonymous: false, isPrivate: false, status: 'Pending', createdAt: '2025-07-04' },
  { _id: '4', subject: 'Safe delivery for my wife', requestedBy: 'Michael Ndi', isAnonymous: false, isPrivate: true, status: 'Answered', createdAt: '2025-06-28' },
  { _id: '5', subject: 'Peace in my home', requestedBy: 'Anonymous', isAnonymous: true, isPrivate: false, status: 'Praying', createdAt: '2025-06-25' },
];

type PrayerItem = typeof PLACEHOLDER_REQUESTS[0];

const STATUS_STYLES: Record<string, string> = {
  Pending: 'bg-amber-100 text-amber-700',
  Praying: 'bg-blue-100 text-blue-700',
  Answered: 'bg-emerald-100 text-emerald-700',
};

const ManagePrayerRequests = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = PLACEHOLDER_REQUESTS.filter(
    (r) => r.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      key: 'subject',
      header: 'Prayer Request',
      render: (item: PrayerItem) => (
        <div className="flex items-center gap-2">
          <p className="font-semibold text-slate-800">{item.subject}</p>
          {item.isPrivate && (
            <span className="text-xs bg-rose-100 text-rose-600 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Eye className="w-3 h-3" /> Private
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'requestedBy',
      header: 'Submitted By',
      render: (item: PrayerItem) => (
        <span className={item.isAnonymous ? 'text-slate-400 italic' : 'text-slate-700'}>
          {item.requestedBy}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: PrayerItem) => (
        <select
          defaultValue={item.status}
          className={`text-xs font-bold px-3 py-1.5 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 ${STATUS_STYLES[item.status]}`}
        >
          <option value="Pending">Pending</option>
          <option value="Praying">Praying</option>
          <option value="Answered">Answered</option>
        </select>
      ),
    },
    {
      key: 'createdAt',
      header: 'Date',
      render: (item: PrayerItem) => <span className="text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-extrabold text-slate-800">Prayer Requests</h2>
        <p className="text-sm text-slate-500">{PLACEHOLDER_REQUESTS.length} total requests · {PLACEHOLDER_REQUESTS.filter(r => r.status === 'Pending').length} pending</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search prayer requests..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
        />
      </div>

      <DataTable columns={columns} data={filtered} emptyMessage="No prayer requests found." />
    </div>
  );
};

export default ManagePrayerRequests;
