import { useState } from 'react';
import { Plus, Edit, Trash2, Play, Search } from 'lucide-react';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const PLACEHOLDER_SERMONS = [
  { _id: '1', title: 'Walking in the Spirit', preacher: 'Pastor Joel Tamon', series: 'Living by Faith', scripture: 'Galatians 5:16-25', videoUrl: 'https://youtube.com/watch?v=example1', createdAt: '2025-06-29' },
  { _id: '2', title: 'The Power of the Latter Rain', preacher: 'Pastor Joel Tamon', series: 'Signs and Wonders', scripture: 'Joel 2:23-29', videoUrl: 'https://youtube.com/watch?v=example2', createdAt: '2025-06-22' },
  { _id: '3', title: 'Unshakeable Faith', preacher: 'Pastor Joel Tamon', series: 'Living by Faith', scripture: 'Hebrews 11:1-6', videoUrl: '', createdAt: '2025-06-15' },
];

type SermonItem = typeof PLACEHOLDER_SERMONS[0];

const ManageSermons = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = PLACEHOLDER_SERMONS.filter(
    (s) => s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.preacher.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      key: 'title',
      header: 'Sermon',
      render: (item: SermonItem) => (
        <div>
          <p className="font-semibold text-slate-800">{item.title}</p>
          <p className="text-xs text-slate-400">{item.series} · {item.scripture}</p>
        </div>
      ),
    },
    { key: 'preacher', header: 'Preacher' },
    {
      key: 'videoUrl',
      header: 'Media',
      render: (item: SermonItem) => (
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
      render: (item: SermonItem) => <span className="text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</span>,
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
          <p className="text-sm text-slate-500">{PLACEHOLDER_SERMONS.length} total sermons</p>
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

      <DataTable columns={columns} data={filtered} emptyMessage="No sermons found." />

      {/* Add Sermon Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Sermon" size="lg">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
          <Input id="sermon-title" label="Title" placeholder="e.g. Walking in the Spirit" required />
          <div className="grid grid-cols-2 gap-4">
            <Input id="sermon-preacher" label="Preacher" placeholder="Pastor Joel Tamon" required />
            <Input id="sermon-series" label="Series" placeholder="e.g. Living by Faith" />
          </div>
          <Input id="sermon-scripture" label="Scripture Reference" placeholder="e.g. Galatians 5:16-25" />
          <Input id="sermon-video" label="YouTube Video URL" placeholder="https://youtube.com/watch?v=..." />
          <Input id="sermon-audio" label="Audio URL (Optional)" placeholder="URL or local file path" />
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Description / Notes</label>
            <textarea
              rows={4}
              placeholder="Add sermon notes or a brief description..."
              className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all resize-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="secondary">Save Sermon</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageSermons;
