import { useState, useEffect } from 'react';
import { BookOpen, Play, Calendar, Loader2, Mic } from 'lucide-react';
import sermonService from '../services/sermonService';
import type { Sermon } from '../types';

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
      } catch (err) {
        setError('Failed to load sermons. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="pt-24 pb-20 bg-background min-h-screen">
      {/* Page Header */}
      <div className="bg-slate-900 text-white py-20 mb-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary rounded-full filter blur-3xl opacity-20"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-secondary/30 bg-secondary/10 mb-4">
            <BookOpen className="w-4 h-4 text-secondary" />
            <span className="text-secondary font-semibold text-sm uppercase tracking-widest">Messages</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-heading font-extrabold mb-4">Sermon Archive</h1>
          <p className="text-slate-400 max-w-xl mx-auto text-lg">
            Revisit powerful messages from our services. Let the Word of God transform your life.
          </p>
        </div>
      </div>

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
          <div className="text-center py-24">
            <BookOpen className="w-14 h-14 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-heading font-bold text-slate-700 mb-2">No Sermons Yet</h3>
            <p className="text-slate-400">Check back soon — messages will be uploaded here.</p>
          </div>
        )}

        {/* Sermons Grid */}
        {!isLoading && !error && sermons.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sermons.map((sermon, index) => (
              <div
                key={sermon._id}
                className="group bg-white rounded-3xl shadow-md shadow-slate-200/50 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden border border-slate-100 flex flex-col"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Thumbnail / Play area */}
                <div className="relative bg-gradient-to-br from-primary-dark to-primary h-48 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-black/20"></div>
                  {sermon.videoUrl ? (
                    <a
                      href={sermon.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="relative z-10 w-16 h-16 rounded-full bg-secondary flex items-center justify-center shadow-lg shadow-secondary/40 group-hover:scale-110 transition-transform duration-300"
                      aria-label={`Watch ${sermon.title}`}
                    >
                      <Play className="w-7 h-7 text-slate-900 ml-1" fill="currentColor" />
                    </a>
                  ) : (
                    <div className="relative z-10 w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                      <Play className="w-7 h-7 text-white/40 ml-1" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-heading font-bold text-slate-800 mb-2 group-hover:text-primary transition-colors">
                    {sermon.title}
                  </h3>

                  <div className="flex items-center gap-2 text-slate-500 text-sm mb-3">
                    <Mic className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span>{sermon.speaker}</span>
                  </div>

                  {sermon.notes && (
                    <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-2">
                      {sermon.notes}
                    </p>
                  )}

                  <div className="mt-auto flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-4">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
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
                        className="text-primary font-semibold hover:text-primary-light transition-colors"
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
