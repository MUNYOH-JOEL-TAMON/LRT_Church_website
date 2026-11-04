import { useState, useEffect } from 'react';
import { BookOpen, Play, Calendar, Loader2, Mic } from 'lucide-react';
import sermonService from '../services/sermonService';
import type { Sermon } from '../types';
import PageBanner from '../components/ui/PageBanner';

const SERMON_CARD_BG =
  'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=900&q=80';

const SermonsPage = () => {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        setIsLoading(true);
        const res = await sermonService.getAll();
        setSermons(res.data || []);
      } catch {
        setError('Failed to load sermons. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="pb-24 bg-background min-h-screen">
      {/* Page Header with Background Image & Video Animation */}
      <PageBanner
        badgeIcon={<BookOpen className="w-4 h-4 text-secondary" />}
        badgeText="Messages"
        title="Sermon Archive"
        subtitle="Revisit powerful messages from our services. Let the Word of God transform your life."
        backgroundImage="https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1920&q=85"
        videoUrl="https://assets.mixkit.co/videos/preview/mixkit-rays-of-light-in-a-dark-room-41573-large.mp4"
      />

      {/* Content */}
      <div className="container mx-auto px-4">
        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-slate-500 text-sm">Loading sermons...</p>
          </div>
        )}

        {/* Error state */}
        {!isLoading && error && (
          <div className="text-center py-24">
            <p className="text-red-500 font-medium">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && sermons.length === 0 && (
          <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm max-w-xl mx-auto p-12">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-heading font-bold text-slate-800 mb-2">No Sermons Yet</h3>
            <p className="text-slate-400">Check back soon — messages will be uploaded here.</p>
          </div>
        )}

        {/* Sermons Grid */}
        {!isLoading && !error && sermons.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sermons.map((sermon, index) => (
              <div
                key={sermon._id}
                className="group bg-white rounded-3xl shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-slate-100 flex flex-col"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Thumbnail / Play area with atmospheric background image */}
                <div className="relative bg-slate-950 h-52 flex items-center justify-center overflow-hidden">
                  <img
                    src={SERMON_CARD_BG}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover opacity-45 group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-primary-dark/65 to-slate-900/40" />

                  {sermon.videoUrl ? (
                    <a
                      href={sermon.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="relative z-10 w-16 h-16 rounded-full bg-secondary flex items-center justify-center shadow-[0_0_25px_rgba(234,179,8,0.5)] group-hover:scale-110 transition-transform duration-300"
                      aria-label={`Watch ${sermon.title}`}
                    >
                      <Play className="w-7 h-7 text-slate-950 ml-1" fill="currentColor" />
                    </a>
                  ) : (
                    <div className="relative z-10 w-16 h-16 rounded-full bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center">
                      <Play className="w-7 h-7 text-white/60 ml-1" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-7 flex flex-col flex-1">
                  <h3 className="text-xl font-heading font-bold text-slate-900 mb-2.5 group-hover:text-primary transition-colors">
                    {sermon.title}
                  </h3>

                  <div className="flex items-center gap-2 text-slate-600 text-sm font-medium mb-3">
                    <span className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <Mic className="w-3.5 h-3.5 flex-shrink-0" />
                    </span>
                    <span>{sermon.speaker}</span>
                  </div>

                  {sermon.notes && (
                    <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">
                      {sermon.notes}
                    </p>
                  )}

                  <div className="mt-auto flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-4">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-secondary-dark" />
                      {sermon.datePreached
                        ? new Date(sermon.datePreached).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : 'Date unknown'}
                    </span>
                    {sermon.videoUrl && (
                      <a
                        href={sermon.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary font-bold hover:text-primary-dark transition-colors"
                      >
                        Watch →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SermonsPage;
