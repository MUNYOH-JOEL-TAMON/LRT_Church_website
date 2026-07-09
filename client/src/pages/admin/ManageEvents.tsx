import { useState, useEffect, useRef } from 'react';
import { Plus, Edit, Trash2, Search, MapPin, Users as UsersIcon, Loader2, Upload, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import eventService from '../../services/eventService';
import galleryService from '../../services/galleryService';
import type { Event } from '../../types';

type FlierMode = 'file' | 'url' | 'none';

const EMPTY_FORM = { title: '', description: '', date: '', location: '', maxCapacity: '' };

const ManageEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [flierMode, setFlierMode] = useState<FlierMode>('none');
  const [flierUrl, setFlierUrl] = useState('');
  const [flierFile, setFlierFile] = useState<File | null>(null);
  const [flierPreview, setFlierPreview] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const res = await eventService.getAll();
      setEvents(res.data || []);
    } catch (err) {
      console.error('Failed to fetch events:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  const resetFlier = () => {
    setFlierMode('none');
    setFlierUrl('');
    setFlierFile(null);
    setFlierPreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const openAddModal = () => {
    setEditingEvent(null);
    setFormData(EMPTY_FORM);
    resetFlier();
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date ? event.date.slice(0, 10) : '',
      location: event.location,
      maxCapacity: event.maxCapacity ? String(event.maxCapacity) : '',
    });
    resetFlier();
    if (event.flierUrl) {
      setFlierMode('url');
      setFlierUrl(event.flierUrl);
      setFlierPreview(event.flierUrl);
    }
    setError('');
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFlierFile(file);
    setFlierPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    setFlierFile(file);
    setFlierPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      let finalFlierUrl: string | undefined;

      if (flierMode === 'file' && flierFile) {
        finalFlierUrl = await galleryService.uploadFile(flierFile);
      } else if (flierMode === 'url' && flierUrl.trim()) {
        finalFlierUrl = flierUrl.trim();
      } else if (editingEvent?.flierUrl && flierMode !== 'none') {
        finalFlierUrl = editingEvent.flierUrl;
      }

      const payload: any = {
        ...formData,
        maxCapacity: formData.maxCapacity ? Number(formData.maxCapacity) : undefined,
        flierUrl: finalFlierUrl,
      };

      if (editingEvent) {
        await eventService.update(editingEvent._id, payload);
      } else {
        await eventService.create(payload);
      }
      setIsModalOpen(false);
      fetchEvents();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to save event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await eventService.remove(id);
      fetchEvents();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete event');
    }
  };

  const filtered = events.filter((e) =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      key: 'title',
      header: 'Event',
      render: (item: Event) => (
        <div className="flex items-center gap-3">
          {item.flierUrl ? (
            <img src={item.flierUrl} alt={item.title}
              className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-slate-100" />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <ImageIcon className="w-5 h-5 text-primary/40" />
            </div>
          )}
          <div>
            <p className="font-semibold text-slate-800">{item.title}</p>
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3" /> {item.location}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      render: (item: Event) => (
        <span className="text-slate-500">
          {item.date ? new Date(item.date).toLocaleDateString() : '—'}
        </span>
      ),
    },
    {
      key: 'capacity',
      header: 'Registrations',
      render: (item: Event) => (
        <div className="flex items-center gap-2">
          <UsersIcon className="w-4 h-4 text-slate-400" />
          <span className="text-slate-700 font-medium">{item.registeredAttendees?.length ?? 0}</span>
          {item.maxCapacity && (
            <span className="text-slate-400 text-xs">/ {item.maxCapacity}</span>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: Event) => (
        <div className="flex items-center gap-1">
          <button onClick={() => openEditModal(item)}
            className="p-2 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => handleDelete(item._id)}
            className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
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
          <h2 className="text-2xl font-heading font-extrabold text-slate-800">Manage Events</h2>
          <p className="text-sm text-slate-500">{events.length} total events</p>
        </div>
        <Button variant="secondary" leftIcon={<Plus className="w-5 h-5" />} onClick={openAddModal}>
          Create Event
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input type="text" placeholder="Search events..." value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all" />
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : (
        <DataTable columns={columns} data={filtered} emptyMessage="No events found. Create your first event!" />
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}
        title={editingEvent ? 'Edit Event' : 'Create New Event'} size="lg">
        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">{error}</div>}

          <Input id="event-title" label="Event Title" placeholder="e.g. Sunday Worship Service"
            required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input id="event-date" label="Date" type="date" required
              value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
            <Input id="event-capacity" label="Max Capacity (Optional)" type="number" placeholder="e.g. 200"
              value={formData.maxCapacity} onChange={(e) => setFormData({ ...formData, maxCapacity: e.target.value })} />
          </div>

          <Input id="event-location" label="Location" placeholder="e.g. Main Sanctuary"
            required value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />

          <div>
            <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Description</label>
            <textarea rows={3} required placeholder="Describe the event..."
              value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all resize-none" />
          </div>

          {/* ── Flier / Banner ── */}
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-2 block">
              Event Flier / Banner <span className="text-slate-400 font-normal">(optional)</span>
            </label>

            {/* Mode selector */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              {(['none', 'file', 'url'] as FlierMode[]).map((mode) => (
                <button key={mode} type="button"
                  onClick={() => { setFlierMode(mode); if (mode === 'none') resetFlier(); }}
                  className={`py-2 rounded-xl border-2 text-xs font-semibold transition-all capitalize flex items-center justify-center gap-1.5 ${
                    flierMode === mode
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}>
                  {mode === 'none' && <><ImageIcon className="w-3.5 h-3.5" /> No Flier</>}
                  {mode === 'file' && <><Upload className="w-3.5 h-3.5" /> Upload File</>}
                  {mode === 'url'  && <><LinkIcon  className="w-3.5 h-3.5" /> Image URL</>}
                </button>
              ))}
            </div>

            {/* File upload */}
            {flierMode === 'file' && (
              <>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                {flierPreview ? (
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 h-40">
                    <img src={flierPreview} alt="Flier preview" className="w-full h-full object-cover" />
                    <button type="button"
                      onClick={() => { setFlierFile(null); setFlierPreview(''); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-lg p-1.5 hover:bg-red-600 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div onClick={() => fileInputRef.current?.click()} onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}
                    className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-primary/40 hover:bg-primary/5 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-slate-400 mb-2" />
                    <p className="font-semibold text-slate-600 text-sm">Click or drag & drop</p>
                    <p className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP — max 5MB</p>
                  </div>
                )}
              </>
            )}

            {/* URL input */}
            {flierMode === 'url' && (
              <>
                <Input id="event-flier-url" label="" placeholder="https://example.com/flier.jpg"
                  value={flierUrl} onChange={(e) => { setFlierUrl(e.target.value); setFlierPreview(e.target.value); }} />
                {flierPreview && (
                  <div className="mt-2 rounded-xl overflow-hidden border border-slate-200 h-40">
                    <img src={flierPreview} alt="Flier preview" className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  </div>
                )}
              </>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-1">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" variant="secondary" isLoading={isSubmitting}>
              {editingEvent ? 'Save Changes' : 'Create Event'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageEvents;
