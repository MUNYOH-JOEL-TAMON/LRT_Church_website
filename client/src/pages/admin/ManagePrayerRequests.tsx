import { useState, useEffect } from 'react';
import { Search, Eye, Loader2 } from 'lucide-react';
import DataTable from '../../components/admin/DataTable';
import prayerService from '../../services/prayerService';
import type { PrayerRequest } from '../../types';

const STATUS_STYLES: Record<string, string> = {
  Pending: 'bg-amber-100 text-amber-700',
  Praying: 'bg-blue-100 text-blue-700',
  Answered: 'bg-emerald-100 text-emerald-700',
};

const ManagePrayerRequests = () => {
  const [requests, setRequests] = useState<PrayerRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const res = await prayerService.getAll();
      setRequests(res.data || []);
    } catch (err) {
      console.error('Failed to fetch prayer requests:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await prayerService.updateStatus(id, status);
      // Update locally for instant UI feedback
      setRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: status as PrayerRequest['status'] } : r))
      );
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const filtered = requests.filter((r) =>
    r.request.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingCount = requests.filter((r) => r.status === 'Pending').length;

  const columns = [
    {
      key: 'request',
      header: 'Prayer Request',
      render: (item: PrayerRequest) => (
        <div className="flex items-start gap-2 max-w-sm">
          <p className="text-slate-800 leading-relaxed">{item.request}</p>
          {item.isPrivate && (
            <span className="flex-shrink-0 text-xs bg-rose-100 text-rose-600 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Eye className="w-3 h-3" /> Private
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'user',
      header: 'Submitted By',
      render: (item: PrayerRequest) =>
        item.user ? (
          <span className="text-slate-700">
            {(item.user as any).firstName} {(item.user as any).lastName}
          </span>
        ) : (
          <span className="text-slate-400 italic">Anonymous</span>
        ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: PrayerRequest) => (
        <select
          value={item.status}
          onChange={(e) => handleStatusChange(item._id, e.target.value)}
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
      render: (item: PrayerRequest) => (
        <span className="text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-extrabold text-slate-800">Prayer Requests</h2>
        <p className="text-sm text-slate-500">
          {requests.length} total · {pendingCount} pending
        </p>
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

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : (
        <DataTable columns={columns} data={filtered} emptyMessage="No prayer requests found." />
      )}
    </div>
  );
};

export default ManagePrayerRequests;
