import { Outlet, Link } from 'react-router-dom';
import { Church } from 'lucide-react';

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col font-body selection:bg-secondary selection:text-slate-900">
      {/* Navigation Bar - Glassmorphism */}
      <header className="fixed w-full top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-white/10 transition-all duration-300">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2 bg-secondary/10 rounded-xl group-hover:bg-secondary/20 transition-colors">
              <Church className="w-8 h-8 text-secondary" />
            </div>
            <span className="text-2xl font-heading font-extrabold text-white tracking-tight">
              LRT<span className="text-secondary">.</span>
            </span>
          </Link>
          <nav className="hidden md:flex gap-8 font-medium text-slate-300">
            <Link to="/" className="hover:text-white hover:text-shadow-sm transition-all duration-300">Home</Link>
            <Link to="/about" className="hover:text-white transition-all duration-300">About</Link>
            <Link to="/sermons" className="hover:text-white transition-all duration-300">Sermons</Link>
            <Link to="/events" className="hover:text-white transition-all duration-300">Events</Link>
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
          <Church className="w-12 h-12 text-secondary mb-6 opacity-50" />
          <h2 className="text-2xl font-heading font-bold text-white mb-2">Latter Rain Tabernacle</h2>
          <p className="mb-8 text-center max-w-md">Equipping the saints for the work of the ministry, building up the body of Christ.</p>
          <p className="text-sm">&copy; {new Date().getFullYear()} Latter Rain Tabernacle. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
