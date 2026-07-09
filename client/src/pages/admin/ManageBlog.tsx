import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, FileText, Loader2 } from 'lucide-react';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import blogService from '../../services/blogService';
import type { BlogPost } from '../../types';

const EMPTY_FORM = { title: '', author: '', content: '', status: 'Draft' };

const STATUS_STYLES: Record<string, string> = {
  Published: 'bg-emerald-100 text-emerald-700',
  Draft: 'bg-amber-100 text-amber-700',
};

const ManageBlog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [error, setError] = useState('');

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const res = await blogService.getAll();
      setPosts(res.data || []);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setFormData(EMPTY_FORM);
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (item: BlogPost) => {
    setEditingItem(item);
    setFormData({ title: item.title, author: item.author, content: item.content, status: item.status });
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      if (editingItem) {
        await blogService.update(editingItem._id, formData);
      } else {
        await blogService.create(formData);
      }
      setIsModalOpen(false);
      fetchPosts();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this blog post?')) return;
    try {
      await blogService.remove(id);
      fetchPosts();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  const filtered = posts.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      key: 'title',
      header: 'Blog Post',
      render: (item: BlogPost) => (
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
      render: (item: BlogPost) => (
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_STYLES[item.status]}`}>
          {item.status}
        </span>
      ),
    },
    {
      key: 'views',
      header: 'Views',
      render: (item: BlogPost) => (
        <span className="text-slate-600 font-medium">{item.views.toLocaleString()}</span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Date',
      render: (item: BlogPost) => (
        <span className="text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: BlogPost) => (
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-slate-800">Blog Posts</h2>
          <p className="text-sm text-slate-500">{posts.length} total posts</p>
        </div>
        <Button variant="secondary" leftIcon={<Plus className="w-5 h-5" />} onClick={openAddModal}>
          New Post
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input type="text" placeholder="Search blog posts..." value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all" />
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
      ) : (
        <DataTable columns={columns} data={filtered} emptyMessage="No blog posts yet." />
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Post' : 'New Blog Post'} size="lg">
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-semibold">{error}</div>}
          <Input id="blog-title" label="Title" placeholder="Enter blog post title" required
            value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input id="blog-author" label="Author" placeholder="e.g. Pastor Joel Tamon" required
              value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} />
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Status</label>
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all">
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Content</label>
            <textarea rows={8} required placeholder="Write your blog post content..."
              value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all resize-none" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" variant="secondary" isLoading={isSubmitting}>
              {editingItem ? 'Save Changes' : 'Publish Post'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageBlog;
