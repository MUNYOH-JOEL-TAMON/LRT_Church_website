import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-primary-dark text-white py-20 md:py-32 border-b-4 border-secondary">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">
            Welcome to <span className="text-secondary">Latter Rain</span> Tabernacle
          </h1>
          <p className="text-lg md:text-xl text-slate-200 mb-10 max-w-2xl mx-auto">
            A Spirit-filled community dedicated to excellence, worship, and spreading the Gospel to all nations.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/about" className="bg-secondary text-primary font-semibold px-8 py-3 rounded-lg hover:bg-secondary-light transition-colors flex items-center justify-center gap-2">
              Our Vision <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/sermons" className="bg-transparent border-2 border-slate-300 text-white font-semibold px-8 py-3 rounded-lg hover:border-white transition-colors">
              Watch Latest Sermon
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Info Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8 text-center">
          <div className="p-8 rounded-2xl bg-background shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <h3 className="text-2xl font-heading font-bold text-primary mb-3">Join Us Live</h3>
            <p className="text-slate-600 mb-6">Experience the power of God in our Sunday Services and Mid-week meetings.</p>
            <Link to="/events" className="text-primary font-semibold hover:text-secondary flex items-center justify-center gap-1">
              View Service Times <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="p-8 rounded-2xl bg-background shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <h3 className="text-2xl font-heading font-bold text-primary mb-3">Need Prayer?</h3>
            <p className="text-slate-600 mb-6">Our intercessory team is standing by to agree with you in prayer.</p>
            <Link to="/prayer-requests" className="text-primary font-semibold hover:text-secondary flex items-center justify-center gap-1">
              Submit Request <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="p-8 rounded-2xl bg-background shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <h3 className="text-2xl font-heading font-bold text-primary mb-3">Give Online</h3>
            <p className="text-slate-600 mb-6">Support the ministry via MTN Mobile Money or Orange Money.</p>
            <Link to="/give" className="text-primary font-semibold hover:text-secondary flex items-center justify-center gap-1">
              Ways to Give <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
