import { ArrowRight, PlayCircle, Calendar, Heart, HandCoins } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white min-h-[90vh] flex items-center justify-center pt-20 pb-32">
        {/* Dynamic Background Gradient */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-float"></div>
          <div className="absolute top-40 -left-40 w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-0 left-1/2 w-full h-1/2 bg-gradient-to-t from-slate-900 to-transparent"></div>
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-secondary/30 bg-secondary/10 backdrop-blur-sm animate-fade-in">
            <span className="text-secondary font-semibold text-sm tracking-widest uppercase">Welcome Home</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-extrabold mb-6 animate-slide-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
            Experience the <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-light to-secondary">Latter Rain</span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-300 mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
            A Spirit-filled community dedicated to excellence, worship, and spreading the Gospel to all nations.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 animate-slide-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
            <Link to="/about" className="group relative bg-secondary text-slate-900 font-bold px-8 py-4 rounded-xl hover:bg-secondary-light transition-all shadow-[0_0_20px_rgba(234,179,8,0.4)] hover:shadow-[0_0_30px_rgba(234,179,8,0.6)] flex items-center justify-center gap-2 overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">Our Vision <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></span>
            </Link>
            <Link to="/sermons" className="group bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/20 transition-all flex items-center justify-center gap-3 hover:shadow-lg">
              <PlayCircle className="w-6 h-6 text-secondary group-hover:scale-110 transition-transform" />
              Watch Latest Sermon
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Info Section */}
      <section className="py-24 relative bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-3xl md:text-5xl font-heading font-extrabold mb-4 text-slate-800">Connect With Us</h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="group p-8 rounded-3xl bg-white shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-slate-100 relative overflow-hidden">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300 text-primary">
                <Calendar className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-heading font-bold mb-3 text-slate-800">Join Us Live</h3>
              <p className="text-slate-500 mb-8 leading-relaxed">Experience the power of God in our Sunday Services and Mid-week meetings.</p>
              <Link to="/events" className="text-primary font-bold hover:text-primary-dark flex items-center gap-2 group/link">
                View Service Times <ArrowRight className="w-5 h-5 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Card 2 */}
            <div className="group p-8 rounded-3xl bg-white shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
              <div className="w-16 h-16 rounded-2xl bg-secondary/20 flex items-center justify-center mb-6 group-hover:bg-secondary group-hover:text-white transition-colors duration-300 text-secondary-dark">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-heading font-bold mb-3 text-slate-800">Need Prayer?</h3>
              <p className="text-slate-500 mb-8 leading-relaxed">Our intercessory team is standing by to agree with you in prayer right now.</p>
              <Link to="/prayer-requests" className="text-secondary-dark font-bold hover:text-secondary flex items-center gap-2 group/link">
                Submit Request <ArrowRight className="w-5 h-5 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Card 3 */}
            <div className="group p-8 rounded-3xl bg-white shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-slate-100 relative overflow-hidden">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300 text-primary">
                <HandCoins className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-heading font-bold mb-3 text-slate-800">Give Online</h3>
              <p className="text-slate-500 mb-8 leading-relaxed">Support the ministry safely and securely via MTN Mobile Money or Orange Money.</p>
              <Link to="/give" className="text-primary font-bold hover:text-primary-dark flex items-center gap-2 group/link">
                Ways to Give <ArrowRight className="w-5 h-5 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
