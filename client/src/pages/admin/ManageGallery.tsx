import { useState, useEffect } from 'react';
import { Plus, Trash2, Image as ImageIcon, Loader2, ExternalLink } from 'lucide-react';
import Modal from '../../components/admin/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import galleryService from '../../services/galleryService';
import type { GalleryImage } from '../../types';

const ManageGallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', imageUrl: '' });
  const [error, setError] = useState('');

  const fetchImages = async () => {
    try {
      setIsLoading(true);
      const res = await galleryService.getAll();
      setImages(res.data || []);
    } catch (err) {
      console.error('Failed to fetch gallery:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchImages(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await galleryService.create(formData);
      setIsModalOpen(false);
      setFormData({ title: '', imageUrl: '' });
      fetchImages();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add image');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this image?')) return;
    try {
      await galleryService.remove(id);
      setImages((prev) => prev.filter((img) => img._id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete image');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-slate-800">Media Gallery</h2>
          <p className="text-sm text-slate-500">{images.length} images</p>
        </div>
        <Button variant="secondary" leftIcon={<Plus className="w-5 h-5" />} onClick={() => { setError(''); setIsModalOpen(true); }}>
          Add Image
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
      ) : images.length === 0 ? (
        <div className="text-center py-24">
          <ImageIcon className="w-14 h-14 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-heading font-bold text-slate-700 mb-2">No Images Yet</h3>
          <p className="text-slate-400">Add your first image to the gallery.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img) => (
            <div key={img._id} className="group bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300">
              {/* Image */}
              <div className="h-48 bg-slate-100 relative overflow-hidden">
                {img.imageUrl ? (
                  <img
                    src={img.imageUrl}
                    alt={img.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-dark to-primary flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-white/30" />
                  </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center gap-3">
                  {img.imageUrl && (
                    <a
                      href={img.imageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="opacity-0 group-hover:opacity-100 p-2.5 rounded-xl bg-white/80 text-slate-700 hover:bg-white transition-all duration-300"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={() => handleDelete(img._id)}
                    className="opacity-0 group-hover:opacity-100 p-2.5 rounded-xl bg-red-500/80 text-white hover:bg-red-500 transition-all duration-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {/* Info */}
              <div className="p-4">
                <p className="font-semibold text-slate-800 text-sm truncate">{img.title}</p>
                <p className="text-xs text-slate-400 mt-1">{new Date(img.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Image to Gallery">
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-semibold">{error}</div>}
          <Input id="gallery-title" label="Image Title" placeholder="e.g. Sunday Service Praise" required
            value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
          <Input id="gallery-url" label="Image URL" placeholder="https://example.com/image.jpg" required
            value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} />
          <p className="text-xs text-slate-400">
            Paste a direct image URL. File upload support (local/S3) will be added in a future phase.
          </p>
          {formData.imageUrl && (
            <div className="rounded-xl overflow-hidden border border-slate-200 h-40">
              <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = ''; }} />
            </div>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" variant="secondary" isLoading={isSubmitting}>Add to Gallery</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageGallery;
