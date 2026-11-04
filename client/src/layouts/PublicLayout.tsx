import { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronRight, Clock, MapPin } from 'lucide-react';
import lrtLogo from '../assets/LRT_LOGO.jpeg';

const NAV_LINKS = [
  { to: '/',                label: 'Home' },
  { to: '/about',           label: 'About' },
  { to: '/sermons',         label: 'Sermons' },
  { to: '/events',          label: 'Events' },
  { to: '/blog',            label: 'Blog' },
  { to: '/announcements',   label: 'Announcements' },
  { to: '/gallery',         label: 'Gallery' },
  { to: '/prayer-requests', label: 'Prayer Requests' },
];

const PublicLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled]  = useState(false);
  const location = useLocation();
  const menuRef  = useRef<HTMLDivElement>(null);

  // Close menu on route change & scroll to top
  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

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
    <div className="min-h-screen flex flex-col font-body selection:bg-secondary selection:text-slate-900 bg-background">

      {/* ── Navbar ── */}
      <header
        ref={menuRef}
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-slate-950/90 backdrop-blur-2xl shadow-2xl shadow-black/30 py-0 border-b border-white/10'
            : 'bg-gradient-to-b from-slate-950/90 via-slate-900/75 to-transparent backdrop-blur-md border-b border-white/5'
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className={`flex justify-between items-center transition-all duration-300 ${scrolled ? 'py-3' : 'py-4'}`}>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3.5 group flex-shrink-0">
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-secondary to-primary opacity-50 blur-sm group-hover:opacity-100 transition-opacity duration-300" />
                <img
                  src={lrtLogo}
                  alt="Latter Rain Tabernacle"
                  className={`relative rounded-full object-cover border-2 border-secondary/60 group-hover:border-secondary transition-all duration-300 ${scrolled ? 'w-10 h-10' : 'w-11 h-11'}`}
                />
              </div>
              <div className="hidden sm:block">
                <span className="text-lg font-heading font-extrabold text-white tracking-tight leading-none block group-hover:text-secondary-light transition-colors">
                  Latter Rain
                </span>
                <span className="text-[11px] font-bold text-secondary tracking-[0.22em] uppercase block mt-0.5">
                  Tabernacle
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1 bg-white/[0.04] border border-white/10 rounded-2xl p-1.5 backdrop-blur-xl">
              {NAV_LINKS.map(({ to, label }) => {
                const active = isActive(to);
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`relative px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      active
                        ? 'text-slate-900 bg-secondary font-bold shadow-[0_0_15px_rgba(234,179,8,0.35)]'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <Link
                to="/portal/login"
                className="hidden sm:inline-flex items-center bg-gradient-to-r from-primary to-primary-light hover:from-secondary hover:to-secondary-light text-white hover:text-slate-900 border border-white/15 hover:border-transparent text-sm font-bold px-5 py-2.5 rounded-xl transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-[0_0_20px_rgba(234,179,8,0.45)]"
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
          <div className="bg-slate-950/98 backdrop-blur-2xl border-t border-white/10 px-4 pt-3 pb-6">

            {/* Nav links */}
            <nav className="flex flex-col gap-1 mb-5">
              {NAV_LINKS.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive(to)
                      ? 'bg-secondary text-slate-900 shadow-md shadow-secondary/20'
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
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* ── Footer ── */}
      <footer className="relative bg-slate-950 text-slate-400 border-t border-white/10 overflow-hidden">
        {/* Ambient footer glow */}
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top gradient accent line */}
        <div className="h-1 w-full bg-gradient-to-r from-primary-dark via-secondary to-primary-dark opacity-80" />

        <div className="container relative z-10 mx-auto px-4 lg:px-8 py-14 md:py-20">

          {/* Top section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3.5 mb-5">
                <img
                  src={lrtLogo}
                  alt="LRT"
                  className="w-12 h-12 rounded-full object-cover border-2 border-secondary/50 shadow-lg shadow-secondary/10"
                />
                <div>
                  <p className="text-white font-heading font-extrabold text-lg leading-none">Latter Rain</p>
                  <p className="text-secondary text-xs font-bold tracking-[0.2em] uppercase mt-1">Tabernacle</p>
                </div>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                Equipping the saints for the work of the ministry, building up the body of Christ.
              </p>
              <div className="inline-flex items-center gap-2 text-xs text-secondary/90 bg-secondary/10 border border-secondary/20 px-3.5 py-2 rounded-xl">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Spirit-Filled Community for All Nations</span>
              </div>
            </div>

            {/* Explore */}
            <div>
              <h4 className="text-white font-heading font-bold text-sm uppercase tracking-widest mb-5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary inline-block" />
                Explore
              </h4>
              <ul className="space-y-3 text-sm">
                {[
                  { to: '/about',   label: 'About Us' },
                  { to: '/sermons', label: 'Sermons' },
                  { to: '/events',  label: 'Events' },
                  { to: '/gallery', label: 'Gallery' },
                ].map(({ to, label }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="inline-flex items-center gap-1.5 hover:text-secondary hover:translate-x-1 transition-all duration-200"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-primary-light" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Community */}
            <div>
              <h4 className="text-white font-heading font-bold text-sm uppercase tracking-widest mb-5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary-light inline-block" />
                Community
              </h4>
              <ul className="space-y-3 text-sm">
                {[
                  { to: '/blog',            label: 'Blog' },
                  { to: '/announcements',   label: 'Announcements' },
                  { to: '/prayer-requests', label: 'Prayer Requests' },
                  { to: '/portal/login',    label: 'Member Portal' },
                ].map(({ to, label }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="inline-flex items-center gap-1.5 hover:text-secondary hover:translate-x-1 transition-all duration-200"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-secondary/70" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Service times */}
            <div>
              <h4 className="text-white font-heading font-bold text-sm uppercase tracking-widest mb-5 flex items-center gap-2">
                <Clock className="w-4 h-4 text-secondary" />
                Service Times
              </h4>
              <ul className="space-y-3.5 text-sm">
                <li className="p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-secondary/30 transition-colors">
                  <p className="text-white font-semibold">Sunday Service</p>
                  <p className="text-secondary text-xs font-medium mt-0.5">9:00 AM</p>
                </li>
                <li className="p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-secondary/30 transition-colors">
                  <p className="text-white font-semibold">Bible Study</p>
                  <p className="text-secondary text-xs font-medium mt-0.5">Friday, 4:00 PM</p>
                </li>
                <li className="p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-secondary/30 transition-colors">
                  <p className="text-white font-semibold">Prayer Meeting</p>
                  <p className="text-secondary text-xs font-medium mt-0.5">Saturday, 4:00 PM</p>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>&copy; {new Date().getFullYear()} Latter Rain Tabernacle. All rights reserved.</p>
            <p className="text-slate-400">Built with ❤️ for the Kingdom</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
