import { useState } from 'react';
import { Plus, Edit, Trash2, Megaphone } from 'lucide-react';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const PLACEHOLDER_ANNOUNCEMENTS = [
  { _id: '1', title: 'Building Fund Update', excerpt: 'We have reached 60% of our building fund goal...', status: 'Published', createdAt: '2025-07-05' },
  { _id: '2', title: 'New Service Hours', excerpt: 'Starting August, our Sunday services will begin at 8:30 AM...', status: 'Published', createdAt: '2025-07-01' },
  { _id: '3', title: 'Back-to-School Drive', excerpt: 'Collecting school supplies for children in the community...', status: 'Draft', createdAt: '2025-06-28' },
];

type AnnouncementItem = typeof PLACEHOLDER_ANNOUNCEMENTS[0];

const STATUS_STYLES: Record<string, string> = {
  Published: 'bg-emerald-100 text-emerald-700',
  Draft: 'bg-slate-100 text-slate-600',
};

const ManageAnnouncements = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [
    {
      key: 'title',
      header: 'Announcement',
      render: (item: AnnouncementItem) => (
        <div>
          <p className="font-semibold text-slate-800 flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-secondary" /> {item.title}
          </p>
          <p className="text-xs text-slate-400 mt-0.5 max-w-md truncate">{item.excerpt}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: AnnouncementItem) => (
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_STYLES[item.status]}`}>{item.status}</span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Date',
      render: (item: AnnouncementItem) => <span className="text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: () => (
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"><Edit className="w-4 h-4" /></button>
          <button className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-slate-800">Announcements</h2>
          <p className="text-sm text-slate-500">{PLACEHOLDER_ANNOUNCEMENTS.length} total</p>
        </div>
        <Button variant="secondary" leftIcon={<Plus className="w-5 h-5" />} onClick={() => setIsModalOpen(true)}>
          New Announcement
        </Button>
      </div>

      <DataTable columns={columns} data={PLACEHOLDER_ANNOUNCEMENTS} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Announcement">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
          <Input id="ann-title" label="Title" placeholder="e.g. Building Fund Update" required />
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Content</label>
            <textarea rows={5} placeholder="Write the announcement content..." className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all resize-none" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="secondary">Publish</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageAnnouncements;
