import { useState, useEffect } from 'react';
import { Search, Eye, Loader2, HeartHandshake, Lock, User, CalendarDays, ChevronRight } from 'lucide-react';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import prayerService from '../../services/prayerService';
import type { PrayerRequest } from '../../types';

const STATUS_STYLES: Record<string, string> = {
  Pending: 'bg-amber-100 text-amber-700',
  Praying: 'bg-blue-100 text-blue-700',
  Answered: 'bg-emerald-100 text-emerald-700',
};

const STATUS_BADGE_STYLES: Record<string, string> = {
  Pending: 'bg-amber-50 text-amber-700 border border-amber-200',
  Praying: 'bg-blue-50 text-blue-700 border border-blue-200',
  Answered: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
};

/** Number of characters beyond which we truncate in the table cell */
const PREVIEW_LENGTH = 80;

const ManagePrayerRequests = () => {
  const [requests, setRequests] = useState<PrayerRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<PrayerRequest | null>(null);

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
      // Also update the modal view if it's showing this item
      setSelectedRequest((prev) =>
        prev && prev._id === id ? { ...prev, status: status as PrayerRequest['status'] } : prev
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
      render: (item: PrayerRequest) => {
        const isLong = item.request.length > PREVIEW_LENGTH;
        const preview = isLong
          ? item.request.slice(0, PREVIEW_LENGTH).trimEnd() + '…'
          : item.request;

        return (
          <div className="max-w-xs lg:max-w-sm space-y-1">
            {/* Privacy badge */}
            {item.isPrivate && (
              <span className="inline-flex items-center gap-1 text-xs bg-rose-100 text-rose-600 font-semibold px-2 py-0.5 rounded-full mb-1">
                <Eye className="w-3 h-3" /> Private
              </span>
            )}
            {/* Truncated text */}
            <p className="text-slate-800 text-sm leading-relaxed">{preview}</p>
            {/* "Read full request" trigger */}
            {isLong && (
              <button
                type="button"
                onClick={() => setSelectedRequest(item)}
                className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-dark transition-colors group mt-0.5"
              >
                Read full request
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}
          </div>
        );
      },
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

      {/* ── Full Prayer Request Detail Modal ── */}
      <Modal
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        title="Full Prayer Request"
        size="md"
      >
        {selectedRequest && (
          <div className="space-y-6">
            {/* Icon + Header Row */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center flex-shrink-0">
                <HeartHandshake className="w-6 h-6 text-rose-500" />
              </div>
              <div className="flex-1 min-w-0">
                {/* Submitter */}
                <div className="flex items-center gap-2 mb-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-sm font-semibold text-slate-700">
                    {selectedRequest.user
                      ? `${(selectedRequest.user as any).firstName} ${(selectedRequest.user as any).lastName}`
                      : 'Anonymous'}
                  </span>
                  {selectedRequest.isPrivate && (
                    <span className="inline-flex items-center gap-1 text-xs bg-rose-100 text-rose-600 font-semibold px-2 py-0.5 rounded-full">
                      <Lock className="w-2.5 h-2.5" /> Private
                    </span>
                  )}
                </div>
                {/* Date */}
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs text-slate-400">
                    {new Date(selectedRequest.createdAt).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
              {/* Status badge */}
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full flex-shrink-0 ${STATUS_BADGE_STYLES[selectedRequest.status]}`}>
                {selectedRequest.status}
              </span>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-100" />

            {/* Full request text */}
            <div className="bg-slate-50 rounded-2xl p-5">
              <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-wrap">
                {selectedRequest.request}
              </p>
            </div>

            {/* Update Status inline */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-1">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Update Status
                </p>
                <select
                  value={selectedRequest.status}
                  onChange={(e) => handleStatusChange(selectedRequest._id, e.target.value)}
                  className={`text-xs font-bold px-4 py-2 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 ${STATUS_STYLES[selectedRequest.status]}`}
                >
                  <option value="Pending">Pending</option>
                  <option value="Praying">Praying</option>
                  <option value="Answered">Answered</option>
                </select>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="sm:self-end px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
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

export default ManagePrayerRequests;
