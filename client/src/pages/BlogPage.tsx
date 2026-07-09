import { useState, useEffect } from 'react';
import { PenLine, Calendar, User, Loader2, ArrowRight, X } from 'lucide-react';
import blogService from '../services/blogService';
import type { BlogPost } from '../types';

const BlogPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setIsLoading(true);
        const res = await blogService.getPublished();
        setPosts(res.data || []);
      } catch (err) {
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  // Close modal on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedPost(null);
    };
    if (selectedPost) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [selectedPost]);

  return (
    <div className="pt-24 pb-20 bg-background min-h-screen">
      {/* Page Header */}
      <div className="bg-slate-900 text-white py-20 mb-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary rounded-full filter blur-3xl opacity-15"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary rounded-full filter blur-3xl opacity-10"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-secondary/30 bg-secondary/10 mb-4">
            <PenLine className="w-4 h-4 text-secondary" />
            <span className="text-secondary font-semibold text-sm uppercase tracking-widest">Articles</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-heading font-extrabold mb-4">Blog & Devotionals</h1>
          <p className="text-slate-400 max-w-xl mx-auto text-lg">
            Insights, devotionals, and reflections from the LRT family.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4">
        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-slate-500 text-sm">Loading posts...</p>
          </div>
        )}

        {/* Error */}
        {!isLoading && error && (
          <div className="text-center py-24">
            <p className="text-red-500 font-medium">{error}</p>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !error && posts.length === 0 && (
          <div className="text-center py-24">
            <PenLine className="w-14 h-14 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-heading font-bold text-slate-700 mb-2">No Posts Yet</h3>
            <p className="text-slate-400">Check back soon — articles will be published here.</p>
          </div>
        )}

        {/* Posts Grid */}
        {!isLoading && !error && posts.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {posts.map((post, index) => (
              <article
                key={post._id}
                className="group bg-white rounded-3xl shadow-md shadow-slate-200/50 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border border-slate-100 flex flex-col overflow-hidden"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Coloured header band */}
                <div className="h-3 bg-gradient-to-r from-primary to-secondary" />

                <div className="p-6 flex flex-col flex-1">
                  <h2 className="text-xl font-heading font-bold text-slate-800 mb-3 group-hover:text-primary transition-colors leading-snug">
                    {post.title}
                  </h2>

                  {/* Preview text — first 150 chars of content */}
                  <p className="text-slate-500 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                    {post.content.length > 150 ? post.content.slice(0, 150) + '…' : post.content}
                  </p>

                  <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-4 mt-auto">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" /> {post.author}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(post.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedPost(post)}
                    className="mt-4 flex items-center gap-2 text-primary font-semibold text-sm hover:text-primary-light transition-colors group/btn"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Full Post Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedPost(null)}
          />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="h-2 bg-gradient-to-r from-primary to-secondary rounded-t-3xl flex-shrink-0" />
            <div className="flex items-start justify-between px-8 py-6 border-b border-slate-100 flex-shrink-0">
              <div className="flex-1 pr-4">
                <h2 className="text-2xl font-heading font-bold text-slate-800 leading-snug">
                  {selectedPost.title}
                </h2>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> {selectedPost.author}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(selectedPost.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Body */}
            <div className="px-8 py-6 overflow-y-auto flex-1">
              <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
                {selectedPost.content}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPage;
