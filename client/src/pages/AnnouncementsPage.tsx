import { useState, useEffect } from 'react';
import { Megaphone, Calendar, Loader2, X, ChevronRight } from 'lucide-react';
import announcementService from '../services/announcementService';
import type { Announcement } from '../types';

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedItem, setSelectedItem] = useState<Announcement | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setIsLoading(true);
        const res = await announcementService.getPublished();
        setAnnouncements(res.data || []);
      } catch (err) {
        setError('Failed to load announcements. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedItem(null);
    };
    if (selectedItem) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [selectedItem]);

  return (
    <div className="pt-24 pb-20 bg-background min-h-screen">
      {/* Page Header */}
      <div className="bg-slate-900 text-white py-20 mb-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-80 h-80 bg-secondary rounded-full filter blur-3xl opacity-10"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary rounded-full filter blur-3xl opacity-15"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-secondary/30 bg-secondary/10 mb-4">
            <Megaphone className="w-4 h-4 text-secondary" />
            <span className="text-secondary font-semibold text-sm uppercase tracking-widest">Updates</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-heading font-extrabold mb-4">Announcements</h1>
          <p className="text-slate-400 max-w-xl mx-auto text-lg">
            Stay up to date with the latest news and updates from Latter Rain Tabernacle.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-slate-500 text-sm">Loading announcements...</p>
          </div>
        )}

        {/* Error */}
        {!isLoading && error && (
          <div className="text-center py-24">
            <p className="text-red-500 font-medium">{error}</p>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !error && announcements.length === 0 && (
          <div className="text-center py-24">
            <Megaphone className="w-14 h-14 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-heading font-bold text-slate-700 mb-2">No Announcements</h3>
            <p className="text-slate-400">Check back soon for updates from the church.</p>
          </div>
        )}

        {/* Announcements list */}
        {!isLoading && !error && announcements.length > 0 && (
          <div className="flex flex-col gap-4">
            {announcements.map((item, index) => (
              <article
                key={item._id}
                className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 p-6 flex gap-5 cursor-pointer"
                style={{ animationDelay: `${index * 0.04}s` }}
                onClick={() => setSelectedItem(item)}
              >
                {/* Icon */}
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                  <Megaphone className="w-6 h-6 text-secondary-dark" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-heading font-bold text-slate-800 group-hover:text-primary transition-colors mb-1">
                    {item.title}
                  </h2>
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
                    {item.content}
                  </p>
                  <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(item.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                </div>

                <ChevronRight className="flex-shrink-0 w-5 h-5 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all self-center" />
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Full Announcement Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedItem(null)}
          />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col">
            {/* Accent bar */}
            <div className="h-2 bg-gradient-to-r from-secondary to-primary rounded-t-3xl flex-shrink-0" />

            {/* Header */}
            <div className="flex items-start justify-between px-8 py-6 border-b border-slate-100 flex-shrink-0">
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-2 mb-2">
                  <Megaphone className="w-4 h-4 text-secondary-dark" />
                  <span className="text-xs font-bold text-secondary-dark uppercase tracking-widest">Announcement</span>
                </div>
                <h2 className="text-2xl font-heading font-bold text-slate-800">{selectedItem.title}</h2>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(selectedItem.createdAt).toLocaleDateString('en-US', {
                    month: 'long', day: 'numeric', year: 'numeric',
                  })}
                </p>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-8 py-6 overflow-y-auto flex-1">
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{selectedItem.content}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementsPage;
