import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Lock, LogIn, UserPlus, Send, CheckCircle, ArrowRight } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import prayerService from '../services/prayerService';
import Button from '../components/ui/Button';
import PageBanner from '../components/ui/PageBanner';

const PrayerRequestPage = () => {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({ request: '', isPrivate: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.request.trim()) return;
    setError('');
    setIsSubmitting(true);
    try {
      await prayerService.create({ request: form.request, isPrivate: form.isPrivate });
      setIsSuccess(true);
      setForm({ request: '', isPrivate: false });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pb-24 bg-background min-h-screen">
      {/* Page Header with Background Image & Video Animation */}
      <PageBanner
        badgeIcon={<Heart className="w-4 h-4 text-secondary" />}
        badgeText="Prayer"
        title="Submit a Prayer Request"
        subtitle="Our intercessory team is standing by to agree with you in prayer."
        backgroundImage="https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1920&q=85"
        videoUrl="https://assets.mixkit.co/videos/preview/mixkit-rays-of-light-in-a-dark-room-41573-large.mp4"
      />

      <div className="container mx-auto px-4 max-w-xl">

        {/* ── NOT LOGGED IN ── */}
        {!isAuthenticated && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 p-10 text-center relative overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-primary via-secondary to-primary absolute top-0 left-0 right-0" />
            <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
              <Lock className="w-9 h-9 text-primary" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-slate-900 mb-3">
              Sign In to Submit a Request
            </h2>
            <p className="text-slate-500 leading-relaxed mb-8">
              You need a member account to submit a prayer request. It only takes a moment to create one — and it's completely free.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/portal/login"
                state={{ from: '/prayer-requests' }}
                className="flex items-center justify-center gap-2 bg-primary text-white font-bold px-6 py-3.5 rounded-xl hover:bg-primary-light transition-all shadow-lg shadow-primary/30"
              >
                <LogIn className="w-5 h-5" />
                Sign In
              </Link>
              <Link
                to="/portal/register"
                state={{ from: '/prayer-requests' }}
                className="flex items-center justify-center gap-2 bg-secondary text-slate-950 font-bold px-6 py-3.5 rounded-xl hover:bg-secondary-light transition-all shadow-lg shadow-secondary/30"
              >
                <UserPlus className="w-5 h-5" />
                Create Account
              </Link>
            </div>
            <p className="text-slate-400 text-sm mt-8">
              Already have an account?{' '}
              <Link to="/portal/login" state={{ from: '/prayer-requests' }} className="text-primary font-semibold hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        )}

        {/* ── SUCCESS STATE ── */}
        {isAuthenticated && isSuccess && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 p-10 text-center relative overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-primary via-secondary to-primary absolute top-0 left-0 right-0" />
            <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-slate-900 mb-3">
              Request Submitted!
            </h2>
            <p className="text-slate-500 leading-relaxed mb-8">
              Thank you, <span className="font-semibold text-slate-700">{user?.firstName}</span>. Our intercessory team will be praying for you. God hears every prayer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                onClick={() => setIsSuccess(false)}
                leftIcon={<Heart className="w-4 h-4" />}
              >
                Submit Another
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate('/')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Back to Home
              </Button>
            </div>
          </div>
        )}

        {/* ── FORM (logged in, not yet submitted) ── */}
        {isAuthenticated && !isSuccess && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 p-8 relative overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-primary via-secondary to-primary absolute top-0 left-0 right-0" />

            {/* Greeting */}
            <div className="flex items-center gap-3.5 mb-8 p-4 bg-primary/5 rounded-2xl border border-primary/15">
              <div className="w-11 h-11 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-md shadow-primary/20">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">
                  Submitting as {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-slate-500">Your request will be received by our prayer team</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                  Your Prayer Request <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={6}
                  required
                  placeholder="Share what's on your heart. Our team will pray specifically for your needs..."
                  value={form.request}
                  onChange={(e) => setForm({ ...form, request: e.target.value })}
                  className="w-full bg-slate-50/60 border border-slate-200 rounded-2xl py-3.5 px-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all resize-none"
                />
                <p className="text-xs text-slate-400 mt-1.5">{form.request.length} characters</p>
              </div>

              {/* Private toggle */}
              <label className="flex items-start gap-3 p-4 rounded-2xl border border-slate-200 cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all group">
                <div className="relative flex-shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    checked={form.isPrivate}
                    onChange={(e) => setForm({ ...form, isPrivate: e.target.checked })}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${form.isPrivate ? 'bg-primary border-primary' : 'border-slate-300 group-hover:border-primary/50'}`}>
                    {form.isPrivate && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Keep this request private</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Only the prayer team will see this. It will not be visible to other members.
                  </p>
                </div>
              </label>

              <Button
                type="submit"
                variant="secondary"
                size="lg"
                isLoading={isSubmitting}
                leftIcon={<Send className="w-5 h-5" />}
                className="w-full"
              >
                Submit Prayer Request
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrayerRequestPage;
