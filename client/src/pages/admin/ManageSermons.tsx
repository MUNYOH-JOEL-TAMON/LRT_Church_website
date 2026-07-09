import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Play, Search, Loader2 } from 'lucide-react';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import sermonService from '../../services/sermonService';
import type { Sermon } from '../../types';

const EMPTY_FORM = { title: '', speaker: '', videoUrl: '', audioUrl: '', notes: '', datePreached: '' };

const ManageSermons = () => {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSermon, setEditingSermon] = useState<Sermon | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState(EMPTY_FORM);

  const fetchSermons = async () => {
    try {
      setIsLoading(true);
      const res = await sermonService.getAll();
      setSermons(res.data || []);
    } catch (err) {
      console.error('Failed to fetch sermons:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchSermons(); }, []);

  const openAddModal = () => {
    setEditingSermon(null);
    setFormData(EMPTY_FORM);
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (sermon: Sermon) => {
    setEditingSermon(sermon);
    setFormData({
      title: sermon.title,
      speaker: sermon.speaker,
      videoUrl: sermon.videoUrl || '',
      audioUrl: sermon.audioUrl || '',
      notes: sermon.notes || '',
      datePreached: sermon.datePreached ? sermon.datePreached.slice(0, 10) : '',
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      if (editingSermon) {
        await sermonService.update(editingSermon._id, formData);
      } else {
        await sermonService.create(formData);
      }
      setIsModalOpen(false);
      fetchSermons();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save sermon');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this sermon?')) return;
    try {
      await sermonService.remove(id);
      fetchSermons();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete sermon');
    }
  };

  const filtered = sermons.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.speaker.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      key: 'title',
      header: 'Sermon',
      render: (item: Sermon) => (
        <div>
          <p className="font-semibold text-slate-800">{item.title}</p>
          <p className="text-xs text-slate-400 mt-0.5">
            {item.datePreached ? new Date(item.datePreached).toLocaleDateString() : '—'}
          </p>
        </div>
      ),
    },
    { key: 'speaker', header: 'Speaker' },
    {
      key: 'videoUrl',
      header: 'Media',
      render: (item: Sermon) =>
        item.videoUrl ? (
          <a
            href={item.videoUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-primary text-xs font-semibold hover:text-primary-light"
          >
            <Play className="w-3.5 h-3.5" /> Watch
          </a>
        ) : (
          <span className="text-slate-400 text-xs">No media</span>
        ),
    },
    {
      key: 'createdAt',
      header: 'Added',
      render: (item: Sermon) => (
        <span className="text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: Sermon) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => openEditModal(item)}
            className="p-2 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(item._id)}
            className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
          >
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
          <h2 className="text-2xl font-heading font-extrabold text-slate-800">Manage Sermons</h2>
          <p className="text-sm text-slate-500">{sermons.length} total sermons</p>
        </div>
        <Button variant="secondary" leftIcon={<Plus className="w-5 h-5" />} onClick={openAddModal}>
          Add Sermon
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search sermons..."
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
        <DataTable columns={columns} data={filtered} emptyMessage="No sermons found. Add your first sermon!" />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSermon ? 'Edit Sermon' : 'Add New Sermon'}
        size="lg"
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-semibold">{error}</div>}
          <Input
            id="sermon-title"
            label="Title"
            placeholder="e.g. Walking in the Spirit"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="sermon-speaker"
              label="Speaker"
              placeholder="Pastor Joel Tamon"
              required
              value={formData.speaker}
              onChange={(e) => setFormData({ ...formData, speaker: e.target.value })}
            />
            <Input
              id="sermon-date"
              label="Date Preached"
              type="date"
              required
              value={formData.datePreached}
              onChange={(e) => setFormData({ ...formData, datePreached: e.target.value })}
            />
          </div>
          <Input
            id="sermon-video"
            label="YouTube / Video URL"
            placeholder="https://youtube.com/watch?v=..."
            value={formData.videoUrl}
            onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
          />
          <Input
            id="sermon-audio"
            label="Audio URL (Optional)"
            placeholder="URL to audio file"
            value={formData.audioUrl}
            onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
          />
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Notes / Description</label>
            <textarea
              rows={4}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add sermon notes or a brief description..."
              className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all resize-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="secondary" isLoading={isSubmitting}>
              {editingSermon ? 'Save Changes' : 'Add Sermon'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageSermons;
