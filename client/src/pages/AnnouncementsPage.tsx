import { useState, useEffect } from 'react';
import { Megaphone, Calendar, Loader2, X, ChevronRight } from 'lucide-react';
import announcementService from '../services/announcementService';
import type { Announcement } from '../types';
import PageBanner from '../components/ui/PageBanner';

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
      } catch {
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
    <div className="pb-24 bg-background min-h-screen">
      {/* Page Header with Background Image & Video Animation */}
      <PageBanner
        badgeIcon={<Megaphone className="w-4 h-4 text-secondary" />}
        badgeText="Updates"
        title="Announcements"
        subtitle="Stay up to date with the latest news and updates from Latter Rain Tabernacle."
        backgroundImage="https://images.unsplash.com/photo-1519791883288-dc8bd696e667?auto=format&fit=crop&w=1920&q=85"
        videoUrl="https://assets.mixkit.co/videos/preview/mixkit-rays-of-light-in-a-dark-room-41573-large.mp4"
      />

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
          <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm p-12">
            <div className="w-16 h-16 rounded-2xl bg-secondary/15 flex items-center justify-center mx-auto mb-5">
              <Megaphone className="w-8 h-8 text-secondary-dark" />
            </div>
            <h3 className="text-xl font-heading font-bold text-slate-800 mb-2">No Announcements</h3>
            <p className="text-slate-400">Check back soon for updates from the church.</p>
          </div>
        )}

        {/* Announcements list */}
        {!isLoading && !error && announcements.length > 0 && (
          <div className="flex flex-col gap-5">
            {announcements.map((item, index) => (
              <article
                key={item._id}
                className="group bg-white rounded-3xl border border-slate-100 shadow-md shadow-slate-200/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-7 flex gap-5 cursor-pointer relative overflow-hidden"
                style={{ animationDelay: `${index * 0.04}s` }}
                onClick={() => setSelectedItem(item)}
              >
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Icon */}
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-secondary/15 border border-secondary/30 flex items-center justify-center group-hover:bg-secondary group-hover:text-slate-950 transition-colors text-secondary-dark">
                  <Megaphone className="w-6 h-6" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-heading font-bold text-slate-900 group-hover:text-primary transition-colors mb-1.5">
                    {item.title}
                  </h2>
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
                    {item.content}
                  </p>
                  <div className="flex items-center gap-1.5 mt-3.5 text-xs text-slate-400 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
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
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
            onClick={() => setSelectedItem(null)}
          />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Accent bar */}
            <div className="h-2.5 bg-gradient-to-r from-secondary via-primary to-secondary flex-shrink-0" />

            {/* Header */}
            <div className="flex items-start justify-between px-8 py-6 border-b border-slate-100 flex-shrink-0">
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-2 mb-2">
                  <Megaphone className="w-4 h-4 text-secondary-dark" />
                  <span className="text-xs font-bold text-secondary-dark uppercase tracking-widest">Announcement</span>
                </div>
                <h2 className="text-2xl font-heading font-bold text-slate-900">{selectedItem.title}</h2>
                <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
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
