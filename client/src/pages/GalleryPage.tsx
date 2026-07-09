import { useState, useEffect } from 'react';
import { Image as ImageIcon, Loader2, X, ZoomIn } from 'lucide-react';
import galleryService from '../services/galleryService';
import type { GalleryImage } from '../types';

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
      } catch (err) {
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
    <div className="pt-24 pb-20 bg-background min-h-screen">
      {/* Page Header */}
      <div className="bg-slate-900 text-white py-20 mb-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary rounded-full filter blur-3xl opacity-15"></div>
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-secondary rounded-full filter blur-3xl opacity-10"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-secondary/30 bg-secondary/10 mb-4">
            <ImageIcon className="w-4 h-4 text-secondary" />
            <span className="text-secondary font-semibold text-sm uppercase tracking-widest">Photos</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-heading font-extrabold mb-4">Gallery</h1>
          <p className="text-slate-400 max-w-xl mx-auto text-lg">
            Moments captured from our services, events, and community life at LRT.
          </p>
        </div>
      </div>

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
          <div className="text-center py-24">
            <ImageIcon className="w-14 h-14 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-heading font-bold text-slate-700 mb-2">No Photos Yet</h3>
            <p className="text-slate-400">Check back soon — photos will be added here.</p>
          </div>
        )}

        {/* Masonry-style grid */}
        {!isLoading && !error && images.length > 0 && (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {images.map((img, index) => (
              <div
                key={img._id}
                className="break-inside-avoid group relative rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300"
                style={{ animationDelay: `${index * 0.04}s` }}
                onClick={() => setLightboxImage(img)}
              >
                {img.imageUrl ? (
                  <img
                    src={img.imageUrl}
                    alt={img.title}
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-primary-dark to-primary flex items-center justify-center">
                    <ImageIcon className="w-10 h-10 text-white/30" />
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-end">
                  <div className="w-full p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="text-white font-semibold text-sm truncate">{img.title}</p>
                    <p className="text-white/60 text-xs mt-0.5">
                      {new Date(img.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <ZoomIn className="w-4 h-4 text-white" />
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute top-4 right-4 p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            onClick={() => setLightboxImage(null)}
          >
            <X className="w-6 h-6" />
          </button>

          <div
            className="max-w-5xl max-h-[85vh] flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxImage.imageUrl}
              alt={lightboxImage.title}
              className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl"
            />
            <div className="text-center">
              <p className="text-white font-semibold">{lightboxImage.title}</p>
              <p className="text-white/50 text-sm mt-1">
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
