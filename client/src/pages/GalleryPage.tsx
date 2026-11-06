import { useState, useEffect } from 'react';
import { Image as ImageIcon, Loader2, X, ZoomIn } from 'lucide-react';
import galleryService from '../services/galleryService';
import type { GalleryImage } from '../types';
import PageBanner from '../components/ui/PageBanner';
import getMediaUrl from '../utils/imageUrl';

const GalleryPage = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setIsLoading(true);
        const res = await galleryService.getAll();
        setImages(res.data || []);
      } catch {
        setError('Failed to load gallery. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  // Close lightbox on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxImage(null);
    };
    if (lightboxImage) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [lightboxImage]);

  return (
    <div className="pb-24 bg-background min-h-screen">
      {/* Page Header with Background Image & Video Animation */}
      <PageBanner
        badgeIcon={<ImageIcon className="w-4 h-4 text-secondary" />}
        badgeText="Photos"
        title="Gallery"
        subtitle="Moments captured from our services, events, and community life at LRT."
        backgroundImage="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1920&q=85"
        videoUrl="https://assets.mixkit.co/videos/preview/mixkit-rays-of-light-in-a-dark-room-41573-large.mp4"
      />

      {/* Content */}
      <div className="container mx-auto px-4">
        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-slate-500 text-sm">Loading gallery...</p>
          </div>
        )}

        {/* Error */}
        {!isLoading && error && (
          <div className="text-center py-24">
            <p className="text-red-500 font-medium">{error}</p>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !error && images.length === 0 && (
          <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm max-w-xl mx-auto p-12">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <ImageIcon className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-heading font-bold text-slate-800 mb-2">No Photos Yet</h3>
            <p className="text-slate-400">Check back soon — photos will be added here.</p>
          </div>
        )}

        {/* Masonry-style grid */}
        {!isLoading && !error && images.length > 0 && (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5 space-y-5">
            {images.map((img, index) => (
              <div
                key={img._id}
                className="break-inside-avoid group relative rounded-3xl overflow-hidden cursor-pointer shadow-lg shadow-slate-200/50 hover:shadow-2xl border border-slate-100 transition-all duration-300"
                style={{ animationDelay: `${index * 0.04}s` }}
                onClick={() => setLightboxImage(img)}
              >
                {img.imageUrl ? (
                  <img
                    src={getMediaUrl(img.imageUrl)}
                    alt={img.title}
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-primary-dark to-primary flex items-center justify-center">
                    <ImageIcon className="w-10 h-10 text-white/30" />
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end">
                  <div className="w-full p-5 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <p className="text-white font-heading font-bold text-base truncate">{img.title}</p>
                    <p className="text-secondary text-xs font-medium mt-0.5">
                      {new Date(img.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="absolute top-3.5 right-3.5">
                    <div className="w-9 h-9 rounded-xl bg-secondary text-slate-950 shadow-lg flex items-center justify-center">
                      <ZoomIn className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md"
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute top-5 right-5 p-3 rounded-2xl bg-white/10 hover:bg-secondary hover:text-slate-950 text-white transition-colors"
            onClick={() => setLightboxImage(null)}
          >
            <X className="w-6 h-6" />
          </button>

          <div
            className="max-w-5xl max-h-[85vh] flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={getMediaUrl(lightboxImage.imageUrl)}
              alt={lightboxImage.title}
              className="max-h-[75vh] max-w-full object-contain rounded-3xl shadow-2xl border border-white/10"
            />
            <div className="text-center">
              <p className="text-white font-heading font-bold text-lg">{lightboxImage.title}</p>
              <p className="text-secondary text-sm mt-1">
                {new Date(lightboxImage.createdAt).toLocaleDateString('en-US', {
                  month: 'long', day: 'numeric', year: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
