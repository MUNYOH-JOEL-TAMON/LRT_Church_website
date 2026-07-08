import { useState } from 'react';
import { Plus, Edit, Trash2, Search, FileText } from 'lucide-react';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const PLACEHOLDER_POSTS = [
  { _id: '1', title: 'The Importance of Fellowship', author: 'Pastor Joel Tamon', status: 'Published', views: 342, createdAt: '2025-07-02' },
  { _id: '2', title: '5 Prayers for the Nation', author: 'Grace Munyoh', status: 'Published', views: 218, createdAt: '2025-06-25' },
  { _id: '3', title: 'Understanding the Book of Revelation', author: 'Pastor Joel Tamon', status: 'Draft', views: 0, createdAt: '2025-07-06' },
];

type BlogItem = typeof PLACEHOLDER_POSTS[0];

const STATUS_STYLES: Record<string, string> = {
  Published: 'bg-emerald-100 text-emerald-700',
  Draft: 'bg-amber-100 text-amber-700',
};

const ManageBlog = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = PLACEHOLDER_POSTS.filter(
    (p) => p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      key: 'title',
      header: 'Blog Post',
      render: (item: BlogItem) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-slate-800">{item.title}</p>
            <p className="text-xs text-slate-400">by {item.author}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: BlogItem) => (
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_STYLES[item.status]}`}>{item.status}</span>
      ),
    },
    {
      key: 'views',
      header: 'Views',
      render: (item: BlogItem) => <span className="text-slate-600 font-medium">{item.views.toLocaleString()}</span>,
    },
    {
      key: 'createdAt',
      header: 'Date',
      render: (item: BlogItem) => <span className="text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</span>,
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
          <h2 className="text-2xl font-heading font-extrabold text-slate-800">Blog Posts</h2>
          <p className="text-sm text-slate-500">{PLACEHOLDER_POSTS.length} total posts</p>
        </div>
        <Button variant="secondary" leftIcon={<Plus className="w-5 h-5" />} onClick={() => setIsModalOpen(true)}>
          New Post
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input type="text" placeholder="Search blog posts..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all" />
      </div>

      <DataTable columns={columns} data={filtered} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Blog Post" size="lg">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
          <Input id="blog-title" label="Title" placeholder="Enter blog post title" required />
          <Input id="blog-author" label="Author" placeholder="e.g. Pastor Joel Tamon" required />
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Content</label>
            <textarea rows={8} placeholder="Write your blog post content..." className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all resize-none" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Save Draft</Button>
            <Button type="submit" variant="secondary">Publish</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageBlog;
