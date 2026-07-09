import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Image as ImageIcon, Loader2, ExternalLink, Upload, Link as LinkIcon } from 'lucide-react';
import Modal from '../../components/admin/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import galleryService from '../../services/galleryService';
import type { GalleryImage } from '../../types';

type UploadMode = 'file' | 'url';

const ManageGallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadMode, setUploadMode] = useState<UploadMode>('file');
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const openModal = () => {
    setTitle('');
    setImageUrl('');
    setSelectedFile(null);
    setFilePreview('');
    setError('');
    setUploadMode('file');
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setFilePreview(URL.createObjectURL(file));
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Only image files are allowed'); return; }
    setSelectedFile(file);
    setFilePreview(URL.createObjectURL(file));
    if (!title) setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setError('Please enter a title'); return; }
    if (uploadMode === 'file' && !selectedFile) { setError('Please select an image file'); return; }
    if (uploadMode === 'url' && !imageUrl.trim()) { setError('Please enter an image URL'); return; }

    setError('');
    setIsSubmitting(true);
    try {
      let finalUrl = imageUrl;
      if (uploadMode === 'file' && selectedFile) {
        finalUrl = await galleryService.uploadFile(selectedFile);
      }
      await galleryService.create({ title: title.trim(), imageUrl: finalUrl });
      setIsModalOpen(false);
      fetchImages();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to add image');
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
        <Button variant="secondary" leftIcon={<Plus className="w-5 h-5" />} onClick={openModal}>
          Add Image
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
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
              <div className="h-48 bg-slate-100 relative overflow-hidden">
                {img.imageUrl ? (
                  <img src={img.imageUrl} alt={img.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-dark to-primary flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-white/30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center gap-3">
                  {img.imageUrl && (
                    <a href={img.imageUrl} target="_blank" rel="noreferrer"
                      className="opacity-0 group-hover:opacity-100 p-2.5 rounded-xl bg-white/80 text-slate-700 hover:bg-white transition-all duration-300">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  <button onClick={() => handleDelete(img._id)}
                    className="opacity-0 group-hover:opacity-100 p-2.5 rounded-xl bg-red-500/80 text-white hover:bg-red-500 transition-all duration-300">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <p className="font-semibold text-slate-800 text-sm truncate">{img.title}</p>
                <p className="text-xs text-slate-400 mt-1">{new Date(img.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Image Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Image to Gallery" size="md">
        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">{error}</div>
          )}

          <Input id="gallery-title" label="Image Title" placeholder="e.g. Sunday Service Praise" required
            value={title} onChange={(e) => setTitle(e.target.value)} />

          {/* Mode toggle */}
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-2 block">Upload Method</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button type="button"
                onClick={() => { setUploadMode('file'); setImageUrl(''); }}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${
                  uploadMode === 'file'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-slate-200 text-slate-500 hover:border-slate-300'
                }`}>
                <Upload className="w-4 h-4" /> Upload File
              </button>
              <button type="button"
                onClick={() => { setUploadMode('url'); setSelectedFile(null); setFilePreview(''); }}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${
                  uploadMode === 'url'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-slate-200 text-slate-500 hover:border-slate-300'
                }`}>
                <LinkIcon className="w-4 h-4" /> Image URL
              </button>
            </div>
          </div>

          {/* File upload area */}
          {uploadMode === 'file' && (
            <div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                onChange={handleFileChange} />
              {filePreview ? (
                <div className="relative rounded-xl overflow-hidden border border-slate-200 h-44">
                  <img src={filePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setFilePreview('');
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-lg p-1.5 hover:bg-red-600 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-3 py-2">
                    <p className="text-white text-xs truncate">{selectedFile?.name}</p>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-slate-200 rounded-xl p-10 flex flex-col items-center justify-center text-center hover:border-primary/40 hover:bg-primary/5 transition-colors cursor-pointer"
                >
                  <Upload className="w-10 h-10 text-slate-400 mb-3" />
                  <p className="font-semibold text-slate-600 text-sm">Click to browse or drag & drop</p>
                  <p className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP, GIF — max 5MB</p>
                </div>
              )}
            </div>
          )}

          {/* URL input */}
          {uploadMode === 'url' && (
            <div>
              <Input id="gallery-url" label="Image URL" placeholder="https://example.com/photo.jpg"
                value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
              {imageUrl && (
                <div className="mt-3 rounded-xl overflow-hidden border border-slate-200 h-40">
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-1">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="secondary" isLoading={isSubmitting}>
              Add to Gallery
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageGallery;
