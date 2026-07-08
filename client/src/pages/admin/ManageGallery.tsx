import { useState } from 'react';
import { Plus, Trash2, Image as ImageIcon, Upload } from 'lucide-react';
import Modal from '../../components/admin/Modal';
import Button from '../../components/ui/Button';

const PLACEHOLDER_IMAGES = [
  { _id: '1', title: 'Sunday Service Praise', url: '', uploadedAt: '2025-07-06' },
  { _id: '2', title: 'Youth Camp 2025', url: '', uploadedAt: '2025-06-20' },
  { _id: '3', title: 'Easter Celebration', url: '', uploadedAt: '2025-04-20' },
  { _id: '4', title: 'Community Outreach', url: '', uploadedAt: '2025-03-15' },
  { _id: '5', title: 'Choir Anniversary', url: '', uploadedAt: '2025-02-10' },
  { _id: '6', title: 'Christmas Program', url: '', uploadedAt: '2024-12-25' },
];

const ManageGallery = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-slate-800">Media Gallery</h2>
          <p className="text-sm text-slate-500">{PLACEHOLDER_IMAGES.length} images</p>
        </div>
        <Button variant="secondary" leftIcon={<Plus className="w-5 h-5" />} onClick={() => setIsModalOpen(true)}>
          Upload Image
        </Button>
      </div>

      {/* Gallery Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {PLACEHOLDER_IMAGES.map((img) => (
          <div key={img._id} className="group bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300">
            {/* Image Placeholder */}
            <div className="h-48 bg-gradient-to-br from-primary-dark to-primary flex items-center justify-center relative">
              <ImageIcon className="w-12 h-12 text-white/30" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                <button className="opacity-0 group-hover:opacity-100 p-3 rounded-xl bg-red-500/80 text-white hover:bg-red-500 transition-all duration-300">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            {/* Info */}
            <div className="p-4">
              <p className="font-semibold text-slate-800 text-sm">{img.title}</p>
              <p className="text-xs text-slate-400 mt-1">{new Date(img.uploadedAt).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Upload Image">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center hover:border-primary/40 hover:bg-primary/5 transition-colors cursor-pointer">
            <Upload className="w-10 h-10 text-slate-400 mb-3" />
            <p className="font-semibold text-slate-600">Click to upload or drag & drop</p>
            <p className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP up to 5MB</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Image Title</label>
            <input
              type="text"
              placeholder="e.g. Sunday Service Praise"
              className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="secondary">Upload</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageGallery;
