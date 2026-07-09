import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Megaphone, Loader2 } from 'lucide-react';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import announcementService from '../../services/announcementService';
import type { Announcement } from '../../types';

const EMPTY_FORM = { title: '', content: '', status: 'Draft' };

const STATUS_STYLES: Record<string, string> = {
  Published: 'bg-emerald-100 text-emerald-700',
  Draft: 'bg-slate-100 text-slate-600',
};

const ManageAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Announcement | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [error, setError] = useState('');

  const fetchAnnouncements = async () => {
    try {
      setIsLoading(true);
      const res = await announcementService.getAll();
      setAnnouncements(res.data || []);
    } catch (err) {
      console.error('Failed to fetch announcements:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchAnnouncements(); }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setFormData(EMPTY_FORM);
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (item: Announcement) => {
    setEditingItem(item);
    setFormData({ title: item.title, content: item.content, status: item.status });
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      if (editingItem) {
        await announcementService.update(editingItem._id, formData);
      } else {
        await announcementService.create(formData);
      }
      setIsModalOpen(false);
      fetchAnnouncements();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save announcement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      await announcementService.remove(id);
      fetchAnnouncements();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  const columns = [
    {
      key: 'title',
      header: 'Announcement',
      render: (item: Announcement) => (
        <div>
          <p className="font-semibold text-slate-800 flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-secondary flex-shrink-0" /> {item.title}
          </p>
          <p className="text-xs text-slate-400 mt-0.5 max-w-md truncate">{item.content}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: Announcement) => (
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_STYLES[item.status]}`}>
          {item.status}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Date',
      render: (item: Announcement) => (
        <span className="text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: Announcement) => (
        <div className="flex items-center gap-1">
          <button onClick={() => openEditModal(item)} className="p-2 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => handleDelete(item._id)} className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-slate-800">Announcements</h2>
          <p className="text-sm text-slate-500">{announcements.length} total</p>
        </div>
        <Button variant="secondary" leftIcon={<Plus className="w-5 h-5" />} onClick={openAddModal}>
          New Announcement
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
      ) : (
        <DataTable columns={columns} data={announcements} emptyMessage="No announcements yet." />
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Announcement' : 'New Announcement'}>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-semibold">{error}</div>}
          <Input id="ann-title" label="Title" placeholder="e.g. Building Fund Update" required
            value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Content</label>
            <textarea rows={5} required placeholder="Write the announcement content..."
              value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all resize-none" />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Status</label>
            <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all">
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" variant="secondary" isLoading={isSubmitting}>
              {editingItem ? 'Save Changes' : 'Publish'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageAnnouncements;
