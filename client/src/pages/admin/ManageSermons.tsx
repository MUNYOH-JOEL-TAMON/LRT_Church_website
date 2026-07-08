import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Play, Search, Loader2 } from 'lucide-react';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import sermonService from '../../services/sermonService';
import type { Sermon } from '../../types';

const ManageSermons = () => {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    speaker: '',
    series: '',
    videoUrl: '',
    audioUrl: '',
    notes: ''
  });

  const fetchSermons = async () => {
    try {
      setIsLoading(true);
      const res = await sermonService.getAll();
      setSermons(res.data);
    } catch (err) {
      console.error('Failed to fetch sermons:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSermons();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await sermonService.create(formData);
      setIsModalOpen(false);
      setFormData({ title: '', speaker: '', series: '', videoUrl: '', audioUrl: '', notes: '' });
      fetchSermons(); // Refresh the list
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create sermon');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = sermons.filter(
    (s) => s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.speaker.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      key: 'title',
      header: 'Sermon',
      render: (item: Sermon) => (
        <div>
          <p className="font-semibold text-slate-800">{item.title}</p>
        </div>
      ),
    },
    { key: 'speaker', header: 'Preacher' },
    {
      key: 'videoUrl',
      header: 'Media',
      render: (item: Sermon) => (
        item.videoUrl ? (
          <a href={item.videoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary text-xs font-semibold hover:text-primary-light">
            <Play className="w-3.5 h-3.5" /> Watch
          </a>
        ) : <span className="text-slate-400 text-xs">No media</span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Date',
      render: (item: Sermon) => <span className="text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: () => (
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors">
            <Edit className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-slate-800">Manage Sermons</h2>
          <p className="text-sm text-slate-500">{sermons.length} total sermons</p>
        </div>
        <Button variant="secondary" leftIcon={<Plus className="w-5 h-5" />} onClick={() => setIsModalOpen(true)}>
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
        <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
      ) : (
        <DataTable columns={columns} data={filtered} emptyMessage="No sermons found." />
      )}

      {/* Add Sermon Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Sermon" size="lg">
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-semibold">{error}</div>}
          <Input id="sermon-title" label="Title" placeholder="e.g. Walking in the Spirit" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
            <Input id="sermon-preacher" label="Preacher" placeholder="Pastor Joel Tamon" required value={formData.speaker} onChange={e => setFormData({...formData, speaker: e.target.value})} />
            <Input id="sermon-series" label="Series" placeholder="e.g. Living by Faith" value={formData.series} onChange={e => setFormData({...formData, series: e.target.value})} />
          </div>
          <Input id="sermon-video" label="YouTube Video URL" placeholder="https://youtube.com/watch?v=..." value={formData.videoUrl} onChange={e => setFormData({...formData, videoUrl: e.target.value})} />
          <Input id="sermon-audio" label="Audio URL (Optional)" placeholder="URL or local file path" value={formData.audioUrl} onChange={e => setFormData({...formData, audioUrl: e.target.value})} />
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Description / Notes</label>
            <textarea
              rows={4}
              value={formData.notes}
              onChange={e => setFormData({...formData, notes: e.target.value})}
              placeholder="Add sermon notes or a brief description..."
              className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all resize-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" variant="secondary" isLoading={isSubmitting}>Save Sermon</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageSermons;
