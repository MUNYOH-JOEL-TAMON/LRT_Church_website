import { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronRight } from 'lucide-react';
import lrtLogo from '../assets/LRT_LOGO.jpeg';

const NAV_LINKS = [
  { to: '/',             label: 'Home' },
  { to: '/about',        label: 'About' },
  { to: '/sermons',      label: 'Sermons' },
  { to: '/events',       label: 'Events' },
  { to: '/blog',         label: 'Blog' },
  { to: '/announcements',label: 'Announcements' },
  { to: '/gallery',      label: 'Gallery' },
];

const PublicLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled]  = useState(false);
  const location = useLocation();
  const menuRef  = useRef<HTMLDivElement>(null);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  // Shrink navbar on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const isActive = (to: string) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <div className="min-h-screen flex flex-col font-body selection:bg-secondary selection:text-slate-900">

      {/* ── Navbar ── */}
      <header
        ref={menuRef}
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-slate-900/95 backdrop-blur-xl shadow-xl shadow-black/20 py-0'
            : 'bg-slate-900/80 backdrop-blur-lg'
        } border-b border-white/10`}
      >
        <div className="container mx-auto px-4">
          <div className={`flex justify-between items-center transition-all duration-300 ${scrolled ? 'py-3' : 'py-4'}`}>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
              <img
                src={lrtLogo}
                alt="Latter Rain Tabernacle"
                className={`rounded-full object-cover border-2 border-secondary/40 group-hover:border-secondary transition-all duration-300 ${scrolled ? 'w-9 h-9' : 'w-11 h-11'}`}
              />
              <div className="hidden sm:block">
                <span className="text-lg font-heading font-extrabold text-white tracking-tight leading-none block">
                  Latter Rain
                </span>
                <span className="text-xs font-semibold text-secondary tracking-widest uppercase">
                  Tabernacle
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(to)
                      ? 'text-secondary bg-white/10'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <Link
                to="/portal/login"
                className="hidden sm:inline-flex items-center bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-secondary hover:text-slate-900 hover:border-transparent transition-all duration-300 shadow-lg hover:shadow-[0_0_15px_rgba(234,179,8,0.4)]"
              >
                Member Portal
              </Link>

              {/* Hamburger — visible below lg */}
              <button
                onClick={() => setMenuOpen((v) => !v)}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-200"
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile drawer ── */}
        <div
          className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            menuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-slate-900/98 backdrop-blur-xl border-t border-white/10 px-4 pt-3 pb-6">

            {/* Nav links */}
            <nav className="flex flex-col gap-1 mb-5">
              {NAV_LINKS.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive(to)
                      ? 'bg-secondary text-slate-900'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {label}
                  <ChevronRight className={`w-4 h-4 ${isActive(to) ? 'text-slate-900' : 'text-slate-500'}`} />
                </Link>
              ))}
            </nav>

            {/* Divider */}
            <div className="h-px bg-white/10 mb-5" />

            {/* Member Portal CTA */}
            <Link
              to="/portal/login"
              className="flex items-center justify-center gap-2 w-full bg-secondary text-slate-900 font-bold py-3.5 rounded-xl hover:bg-secondary-light transition-all shadow-lg shadow-secondary/20"
            >
              Member Portal →
            </Link>
          </div>
        </div>
      </header>

      {/* Backdrop overlay when menu open */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* ── Footer ── */}
      <footer className="bg-slate-950 text-slate-400 border-t border-white/10">
        <div className="container mx-auto px-4 py-12 md:py-16">

          {/* Top section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <img src={lrtLogo} alt="LRT" className="w-12 h-12 rounded-full object-cover border-2 border-secondary/30 opacity-80" />
                <div>
                  <p className="text-white font-heading font-bold leading-none">Latter Rain</p>
                  <p className="text-secondary text-xs font-semibold tracking-widest uppercase">Tabernacle</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed">
                Equipping the saints for the work of the ministry, building up the body of Christ.
              </p>
            </div>

            {/* Explore */}
            <div>
              <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-4">Explore</h4>
              <ul className="space-y-2.5 text-sm">
                {[
                  { to: '/about',   label: 'About Us' },
                  { to: '/sermons', label: 'Sermons' },
                  { to: '/events',  label: 'Events' },
                  { to: '/gallery', label: 'Gallery' },
                ].map(({ to, label }) => (
                  <li key={to}>
                    <Link to={to} className="hover:text-white transition-colors">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Community */}
            <div>
              <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-4">Community</h4>
              <ul className="space-y-2.5 text-sm">
                {[
                  { to: '/blog',             label: 'Blog' },
                  { to: '/announcements',    label: 'Announcements' },
                  { to: '/prayer-requests',  label: 'Prayer Requests' },
                  { to: '/portal/login',     label: 'Member Portal' },
                ].map(({ to, label }) => (
                  <li key={to}>
                    <Link to={to} className="hover:text-white transition-colors">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Service times */}
            <div>
              <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-4">Service Times</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <p className="text-white font-medium">Sunday Service</p>
                  <p>9:00 AM</p>
                </li>
                <li>
                  <p className="text-white font-medium">Bible Study</p>
                  <p>Friday, 4:00 PM</p>
                </li>
                <li>
                  <p className="text-white font-medium">Prayer Meeting</p>
                  <p>Saturday, 4:00 PM</p>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <p>&copy; {new Date().getFullYear()} Latter Rain Tabernacle. All rights reserved.</p>
            <p>Built with ❤️ for the Kingdom</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
