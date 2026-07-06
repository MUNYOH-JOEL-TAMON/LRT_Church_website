import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Church } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import lrtLogo from '../../assets/LRT_LOGO.jpeg';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearError();
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(form.email, form.password);
    // If no error after login, navigate to member portal
    if (!useAuthStore.getState().error) {
      navigate('/portal/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary rounded-full filter blur-3xl opacity-20"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-secondary rounded-full filter blur-3xl opacity-15"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Card */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <img src={lrtLogo} alt="LRT" className="w-20 h-20 rounded-full object-cover border-2 border-secondary/40 mb-4 shadow-lg" />
            <h1 className="text-3xl font-heading font-extrabold text-white">Member Portal</h1>
            <p className="text-slate-400 text-sm mt-1">Sign in to your LRT account</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl p-3 mb-6 text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              id="email"
              name="email"
              type="email"
              label="Email Address"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              leftIcon={<Mail className="w-4 h-4" />}
              required
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:bg-white/10"
            />
            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              leftIcon={<Lock className="w-4 h-4" />}
              required
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:bg-white/10"
            />

            <div className="flex justify-end -mt-2">
              <Link to="/portal/forgot-password" className="text-sm text-slate-400 hover:text-secondary transition-colors">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="secondary"
              size="lg"
              isLoading={isLoading}
              className="w-full mt-2"
            >
              Sign In
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="text-slate-500 text-sm">or</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          <p className="text-center text-slate-400 text-sm">
            Don&apos;t have an account?{' '}
            <Link to="/portal/register" className="text-secondary font-semibold hover:text-secondary-light transition-colors">
              Register here
            </Link>
          </p>
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          <Link to="/" className="hover:text-slate-400 transition-colors">← Back to website</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
