import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Church } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import lrtLogo from '../../assets/LRT_LOGO.jpeg';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [validationError, setValidationError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearError();
    setValidationError('');
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setValidationError('Passwords do not match.');
      return;
    }
    if (form.password.length < 8) {
      setValidationError('Password must be at least 8 characters.');
      return;
    }
    await register(form.firstName, form.lastName, form.email, form.password);
    if (!useAuthStore.getState().error) {
      navigate('/portal/dashboard');
    }
  };

  const displayError = validationError || error;

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary rounded-full filter blur-3xl opacity-20"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary rounded-full filter blur-3xl opacity-15"></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <img src={lrtLogo} alt="LRT" className="w-20 h-20 rounded-full object-cover border-2 border-secondary/40 mb-4 shadow-lg" />
            <h1 className="text-3xl font-heading font-extrabold text-white">Join LRT</h1>
            <p className="text-slate-400 text-sm mt-1">Create your member account</p>
          </div>

          {/* Error Alert */}
          {displayError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl p-3 mb-6 text-center">
              {displayError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="firstName"
                name="firstName"
                label="First Name"
                placeholder="Joel"
                value={form.firstName}
                onChange={handleChange}
                leftIcon={<User className="w-4 h-4" />}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
              />
              <Input
                id="lastName"
                name="lastName"
                label="Last Name"
                placeholder="Tamon"
                value={form.lastName}
                onChange={handleChange}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
              />
            </div>
            <Input
              id="reg-email"
              name="email"
              type="email"
              label="Email Address"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              leftIcon={<Mail className="w-4 h-4" />}
              required
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
            />
            <Input
              id="reg-password"
              name="password"
              type="password"
              label="Password"
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={handleChange}
              leftIcon={<Lock className="w-4 h-4" />}
              required
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
            />
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirm Password"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={handleChange}
              leftIcon={<Lock className="w-4 h-4" />}
              required
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
            />

            <Button
              type="submit"
              variant="secondary"
              size="lg"
              isLoading={isLoading}
              className="w-full mt-2"
            >
              Create Account
            </Button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="text-slate-500 text-sm">or</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          <p className="text-center text-slate-400 text-sm">
            Already have an account?{' '}
            <Link to="/portal/login" className="text-secondary font-semibold hover:text-secondary-light transition-colors">
              Sign in
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

export default RegisterPage;
