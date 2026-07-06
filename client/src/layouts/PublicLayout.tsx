import { Outlet, Link } from 'react-router-dom';
import { Church } from 'lucide-react';

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col font-body">
      {/* Navigation Bar */}
      <header className="bg-primary text-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <Church className="w-8 h-8 text-secondary" />
            <span className="text-xl font-heading font-bold">Latter Rain Tabernacle</span>
          </Link>
          <nav className="hidden md:flex gap-6 font-medium">
            <Link to="/" className="hover:text-secondary transition-colors">Home</Link>
            <Link to="/about" className="hover:text-secondary transition-colors">About</Link>
            <Link to="/sermons" className="hover:text-secondary transition-colors">Sermons</Link>
            <Link to="/events" className="hover:text-secondary transition-colors">Events</Link>
          </nav>
          <Link to="/portal/login" className="bg-secondary text-primary font-semibold px-5 py-2 rounded-lg hover:bg-secondary-light transition-colors">
            Member Login
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Latter Rain Tabernacle. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
