import {
  ArrowRight,
  PlayCircle,
  Calendar,
  Heart,
  BookOpen,
  Clock,
  Users,
  Megaphone,
  Image as ImageIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AmbientLightCanvas } from '../components/ui/PageBanner';

const HERO_BG_IMAGE =
  'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=2000&q=85';

const HERO_VIDEO_URL =
  'https://assets.mixkit.co/videos/preview/mixkit-rays-of-light-in-a-dark-room-41573-large.mp4';

const Home = () => {
  return (
    <div className="flex flex-col overflow-hidden">
      {/* ── Cinematic Hero Section with Video Animation & Background Image ── */}
      <section className="relative bg-slate-950 text-white min-h-screen flex flex-col justify-between pt-28 pb-16 overflow-hidden">
        {/* Background Image + Looping Video Layer */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img
            src={HERO_BG_IMAGE}
            alt="Worship sanctuary"
            className="w-full h-full object-cover object-center opacity-40 animate-ken-burns"
          />
          <video
            autoPlay
            loop
            muted
            playsInline
            poster={HERO_BG_IMAGE}
            className="absolute inset-0 w-full h-full object-cover opacity-45 mix-blend-screen"
          >
            <source src={HERO_VIDEO_URL} type="video/mp4" />
          </video>

          {/* Deep Royal Blue, Slate & Gold Atmospheric Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-900/70 to-slate-950" />
          <div className="absolute -top-40 -right-40 w-[32rem] h-[32rem] bg-primary rounded-full mix-blend-screen filter blur-[120px] opacity-45 animate-float" />
          <div
            className="absolute top-1/3 -left-40 w-[28rem] h-[28rem] bg-secondary rounded-full mix-blend-screen filter blur-[120px] opacity-25 animate-float"
            style={{ animationDelay: '2s' }}
          />
        </div>

        {/* 60fps "Latter Rain" Golden Light & Particle Canvas Animation */}
        <AmbientLightCanvas particleCount={55} mode="rain-and-particles" />

        {/* Subtle Grid Overlay */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none z-[2]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
            backgroundSize: '56px 56px',
          }}
        />

        {/* Hero Main Content */}
        <div className="container relative z-10 mx-auto px-4 my-auto pt-12 pb-16 text-center">
          <div className="inline-block mb-6 px-5 py-2 rounded-full border border-secondary/40 bg-secondary/10 backdrop-blur-md shadow-[0_0_25px_rgba(234,179,8,0.2)] animate-fade-in">
            <span className="text-secondary font-bold text-xs sm:text-sm tracking-[0.22em] uppercase">
              Welcome Home
            </span>
          </div>

          <h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-extrabold mb-6 text-white tracking-tight leading-[1.08] max-w-5xl mx-auto animate-slide-up"
            style={{ animationDelay: '0.1s', opacity: 0 }}
          >
            Experience the{' '}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-light via-secondary to-amber-500">
                Latter Rain
              </span>
              <span className="absolute -bottom-1.5 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-secondary to-transparent rounded-full opacity-80" />
            </span>{' '}
            Tabernacle
          </h1>

          <p
            className="text-lg md:text-2xl text-slate-300/95 mb-12 max-w-2xl mx-auto leading-relaxed animate-slide-up"
            style={{ animationDelay: '0.2s', opacity: 0 }}
          >
            A Spirit-filled community dedicated to excellence, worship, and spreading the Gospel to all nations.
          </p>

          <div
            className="flex flex-col sm:flex-row justify-center gap-5 animate-slide-up"
            style={{ animationDelay: '0.3s', opacity: 0 }}
          >
            <Link
              to="/about"
              className="group relative bg-gradient-to-r from-secondary via-secondary-light to-secondary text-slate-950 font-extrabold px-9 py-4.5 rounded-2xl transition-all duration-300 shadow-[0_0_25px_rgba(234,179,8,0.45)] hover:shadow-[0_0_40px_rgba(234,179,8,0.75)] hover:-translate-y-0.5 flex items-center justify-center gap-2.5 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Our Vision
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </span>
            </Link>

            <Link
              to="/sermons"
              className="group bg-white/10 backdrop-blur-xl border border-white/20 hover:border-secondary/50 text-white font-semibold px-9 py-4.5 rounded-2xl hover:bg-white/15 transition-all duration-300 flex items-center justify-center gap-3 shadow-xl hover:-translate-y-0.5"
            >
              <span className="w-8 h-8 rounded-full bg-secondary/20 border border-secondary/40 flex items-center justify-center group-hover:scale-110 group-hover:bg-secondary group-hover:text-slate-900 transition-all">
                <PlayCircle className="w-5 h-5 text-secondary group-hover:text-slate-900" />
              </span>
              Watch Latest Sermon
            </Link>
          </div>
        </div>

        {/* Glassmorphic Service Times Strip at Bottom of Hero */}
        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-5xl mx-auto rounded-3xl bg-white/[0.06] backdrop-blur-2xl border border-white/15 p-5 sm:p-6 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 divide-y md:divide-y-0 md:divide-x divide-white/10">
              {[
                { title: 'Sunday Service', time: '9:00 AM', tag: 'Main Worship' },
                { title: 'Bible Study', time: 'Friday, 4:00 PM', tag: 'Word & Doctrine' },
                { title: 'Prayer Meeting', time: 'Saturday, 4:00 PM', tag: 'Intercession' },
              ].map(({ title, time, tag }) => (
                <div
                  key={title}
                  className="flex items-center gap-4 pt-4 md:pt-0 first:pt-0 md:px-4 first:md:pl-2"
                >
                  <div className="w-11 h-11 rounded-2xl bg-secondary/15 border border-secondary/30 flex items-center justify-center text-secondary flex-shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-secondary block">
                      {tag}
                    </span>
                    <p className="text-white font-heading font-bold text-base leading-tight">
                      {title}
                    </p>
                    <p className="text-slate-300 text-xs mt-0.5">{time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Quick Info Section ("Connect With Us") ── */}
      <section className="py-24 md:py-32 relative bg-background overflow-hidden">
        {/* Subtle decorative background accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container relative z-10 mx-auto px-4">
          <div className="text-center mb-16 animate-slide-up">
            <span className="inline-block text-primary font-bold text-xs uppercase tracking-[0.22em] bg-primary/10 px-4 py-1.5 rounded-full mb-3">
              Fellowship & Ministry
            </span>
            <h2 className="text-3xl md:text-5xl font-heading font-extrabold mb-4 text-slate-900">
              Connect With Us
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-primary via-secondary to-primary mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Card 1: Join Us Live */}
            <div className="group rounded-3xl bg-white shadow-xl shadow-slate-200/60 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-slate-100 relative overflow-hidden flex flex-col">
              <div className="relative h-48 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=900&q=80"
                  alt="Join Us Live"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/35 to-transparent" />
                <div className="absolute bottom-4 left-6 w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/40 group-hover:bg-secondary group-hover:text-slate-950 transition-colors duration-300">
                  <Calendar className="w-7 h-7" />
                </div>
              </div>
              <div className="p-8 flex flex-col flex-1">
                <h3 className="text-2xl font-heading font-bold mb-3 text-slate-900 group-hover:text-primary transition-colors">
                  Join Us Live
                </h3>
                <p className="text-slate-500 mb-8 leading-relaxed flex-1">
                  Experience the power of God in our Sunday Services and Mid-week meetings.
                </p>
                <Link
                  to="/events"
                  className="text-primary font-bold hover:text-primary-dark inline-flex items-center gap-2 group/link"
                >
                  View Service Times
                  <ArrowRight className="w-5 h-5 group-hover/link:translate-x-1.5 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Card 2: Need Prayer? */}
            <div className="group rounded-3xl bg-white shadow-xl shadow-slate-200/60 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-slate-100 relative overflow-hidden flex flex-col">
              <div className="relative h-48 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=900&q=80"
                  alt="Need Prayer"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/35 to-transparent" />
                <div className="absolute bottom-4 left-6 w-14 h-14 rounded-2xl bg-secondary text-slate-950 flex items-center justify-center shadow-lg shadow-secondary/40 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <Heart className="w-7 h-7" />
                </div>
              </div>
              <div className="p-8 flex flex-col flex-1">
                <h3 className="text-2xl font-heading font-bold mb-3 text-slate-900 group-hover:text-secondary-dark transition-colors">
                  Need Prayer?
                </h3>
                <p className="text-slate-500 mb-8 leading-relaxed flex-1">
                  Our intercessory team is standing by to agree with you in prayer right now.
                </p>
                <Link
                  to="/prayer-requests"
                  className="text-secondary-dark font-bold hover:text-secondary inline-flex items-center gap-2 group/link"
                >
                  Submit Request
                  <ArrowRight className="w-5 h-5 group-hover/link:translate-x-1.5 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Card 3: Sermon Archive */}
            <div className="group rounded-3xl bg-white shadow-xl shadow-slate-200/60 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-slate-100 relative overflow-hidden flex flex-col">
              <div className="relative h-48 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=900&q=80"
                  alt="Sermon Archive"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/35 to-transparent" />
                <div className="absolute bottom-4 left-6 w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/40 group-hover:bg-secondary group-hover:text-slate-950 transition-colors duration-300">
                  <BookOpen className="w-7 h-7" />
                </div>
              </div>
              <div className="p-8 flex flex-col flex-1">
                <h3 className="text-2xl font-heading font-bold mb-3 text-slate-900 group-hover:text-primary transition-colors">
                  Sermon Archive
                </h3>
                <p className="text-slate-500 mb-8 leading-relaxed flex-1">
                  Revisit powerful messages from our services. Let the Word of God transform your life.
                </p>
                <Link
                  to="/sermons"
                  className="text-primary font-bold hover:text-primary-dark inline-flex items-center gap-2 group/link"
                >
                  Explore Messages
                  <ArrowRight className="w-5 h-5 group-hover/link:translate-x-1.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Prophetic Mandate & Community Banner with Background Image & Animation ── */}
      <section className="relative py-28 bg-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1519791883288-dc8bd696e667?auto=format&fit=crop&w=1920&q=80"
            alt="Church community"
            className="w-full h-full object-cover opacity-25 animate-ken-burns"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-primary-dark/85 to-slate-950/95" />
        </div>

        <AmbientLightCanvas particleCount={30} mode="particles-only" />

        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block text-secondary font-bold text-xs uppercase tracking-[0.25em] border border-secondary/30 bg-secondary/10 px-4 py-1.5 rounded-full mb-6">
              Our Scripture • Joel 2:23
            </span>
            <blockquote className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-white leading-relaxed italic mb-10">
              "Be glad then, ye children of Zion, and rejoice in the LORD your God: for he hath given you the former rain moderately, and he will cause to come down for you the rain, the former rain, and the latter rain in the first month."
            </blockquote>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12">
              <Link
                to="/blog"
                className="group p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-secondary/40 backdrop-blur-md transition-all text-left flex items-center justify-between"
              >
                <div>
                  <Users className="w-6 h-6 text-secondary mb-2" />
                  <h4 className="font-heading font-bold text-white text-lg">Blog & Devotionals</h4>
                  <p className="text-slate-400 text-xs mt-0.5">Insights from the LRT family</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-secondary group-hover:translate-x-1 transition-all" />
              </Link>

              <Link
                to="/announcements"
                className="group p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-secondary/40 backdrop-blur-md transition-all text-left flex items-center justify-between"
              >
                <div>
                  <Megaphone className="w-6 h-6 text-secondary mb-2" />
                  <h4 className="font-heading font-bold text-white text-lg">Announcements</h4>
                  <p className="text-slate-400 text-xs mt-0.5">Latest news and church updates</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-secondary group-hover:translate-x-1 transition-all" />
              </Link>

              <Link
                to="/gallery"
                className="group p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-secondary/40 backdrop-blur-md transition-all text-left flex items-center justify-between"
              >
                <div>
                  <ImageIcon className="w-6 h-6 text-secondary mb-2" />
                  <h4 className="font-heading font-bold text-white text-lg">Photo Gallery</h4>
                  <p className="text-slate-400 text-xs mt-0.5">Moments from our services</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-secondary group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
