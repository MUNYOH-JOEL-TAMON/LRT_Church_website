import { Outlet, Link } from 'react-router-dom';
import lrtLogo from '../assets/LRT_LOGO.jpeg';

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col font-body selection:bg-secondary selection:text-slate-900">
      {/* Navigation Bar - Glassmorphism */}
      <header className="fixed w-full top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-white/10 transition-all duration-300">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={lrtLogo}
              alt="Latter Rain Tabernacle Logo"
              className="w-12 h-12 rounded-full object-cover border-2 border-secondary/40 group-hover:border-secondary transition-all duration-300"
            />
            <span className="text-xl font-heading font-extrabold text-white tracking-tight hidden sm:block">
              Latter Rain <span className="text-secondary">Tabernacle</span>
            </span>
          </Link>
          <nav className="hidden md:flex gap-8 font-medium text-slate-300">
            <Link to="/" className="hover:text-white hover:text-shadow-sm transition-all duration-300">Home</Link>
            <Link to="/about" className="hover:text-white transition-all duration-300">About</Link>
            <Link to="/sermons" className="hover:text-white transition-all duration-300">Sermons</Link>
            <Link to="/events" className="hover:text-white transition-all duration-300">Events</Link>
            <Link to="/blog" className="hover:text-white transition-all duration-300">Blog</Link>
            <Link to="/announcements" className="hover:text-white transition-all duration-300">Announcements</Link>
            <Link to="/gallery" className="hover:text-white transition-all duration-300">Gallery</Link>
          </nav>
          <Link to="/portal/login" className="bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-secondary hover:text-slate-900 hover:border-transparent transition-all duration-300 shadow-lg hover:shadow-[0_0_15px_rgba(234,179,8,0.5)]">
            Member Portal
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-16 border-t border-white/10">
        <div className="container mx-auto px-4 flex flex-col items-center">
          <img
            src={lrtLogo}
            alt="LRT Logo"
            className="w-20 h-20 rounded-full object-cover border-2 border-secondary/30 mb-6 opacity-80"
          />
          <h2 className="text-2xl font-heading font-bold text-white mb-2">Latter Rain Tabernacle</h2>
          <p className="mb-8 text-center max-w-md">Equipping the saints for the work of the ministry, building up the body of Christ.</p>
          <p className="text-sm">&copy; {new Date().getFullYear()} Latter Rain Tabernacle. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
