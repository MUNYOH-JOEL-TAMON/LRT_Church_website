import { Target, Eye, Heart, Users, Award, BookOpen } from 'lucide-react';
import PageBanner from '../components/ui/PageBanner';

const VALUES = [
  { icon: Heart, title: 'Faith', description: 'We believe in a living, active faith that moves mountains and transforms lives.' },
  { icon: Users, title: 'Community', description: 'We are a family committed to loving, serving, and growing together.' },
  { icon: Target, title: 'Purpose', description: 'Every believer is called and equipped to fulfil a unique God-given destiny.' },
  { icon: Award, title: 'Excellence', description: 'We honour God by pursuing excellence in everything we do for His Kingdom.' },
];

const LEADERSHIP = [
  { name: 'Apostle N.A Stanley', title: 'Overseer & Founder', initials: 'AT' },
  { name: 'Pastor A Beckley', title: 'Pastor', initials: 'AB' },
  { name: 'Evangelist F Fidelis', title: 'Deacon', initials: 'FF' },
];

const AboutPage = () => {
  return (
    <div className="pb-24 min-h-screen bg-background">
      {/* Page Header with Background Image & Video Animation */}
      <PageBanner
        badgeText="About Us"
        title="Our Story"
        subtitle="Founded on faith and fuelled by the Holy Spirit — Latter Rain Tabernacle is more than a church; it is a movement."
        backgroundImage="https://images.unsplash.com/photo-1478147427282-58a87a120781?auto=format&fit=crop&w=1920&q=85"
        videoUrl="https://assets.mixkit.co/videos/preview/mixkit-rays-of-light-in-a-dark-room-41573-large.mp4"
      />

      {/* Mission & Vision */}
      <section className="container mx-auto px-4 mb-24">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Text + Featured Image Card */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/15 text-secondary-dark font-bold text-xs uppercase tracking-[0.2em]">
              Who We Are
            </div>
            <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-slate-900 leading-tight">
              A Spirit-Filled Church for the Nations
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              Latter Rain Tabernacle (LRT) is a vibrant, Spirit-filled local church committed to the full Gospel of Jesus Christ. We believe in the power of the Holy Spirit to transform lives, heal the sick, and bring hope to the hopeless.
            </p>
            <p className="text-slate-600 text-lg leading-relaxed">
              We were founded with a mandate to raise a generation of believers who are rooted in the Word, led by the Spirit, and sent into the harvest field with power and purpose.
            </p>

            {/* Sanctuary visual strip */}
            <div className="relative rounded-3xl overflow-hidden h-56 shadow-xl border border-slate-200/80 group mt-4">
              <img
                src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80"
                alt="Worship at Latter Rain Tabernacle"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/30 to-transparent flex items-end p-6">
                <div>
                  <span className="text-secondary text-xs font-bold uppercase tracking-widest block">
                    Latter Rain Tabernacle
                  </span>
                  <p className="text-white font-heading font-bold text-lg">
                    Rooted in the Word • Led by the Spirit
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Vision, Mission & Scripture */}
          <div className="lg:col-span-6 grid sm:grid-cols-2 gap-6">
            <div className="p-8 rounded-3xl bg-gradient-to-br from-primary-dark via-primary to-primary-light text-white shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
              <div className="absolute -right-8 -top-8 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
              <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center mb-6">
                <Eye className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="text-2xl font-heading font-bold mb-3">Our Vision</h3>
              <p className="text-blue-100 text-sm leading-relaxed">
                To be a lighthouse of God's glory, impacting every sphere of society with the Kingdom of God.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-gradient-to-br from-secondary via-secondary to-secondary-light text-slate-950 shadow-xl shadow-secondary/25 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
              <div className="absolute -right-8 -top-8 w-28 h-28 bg-white/30 rounded-full blur-xl pointer-events-none" />
              <div className="w-14 h-14 rounded-2xl bg-slate-950/10 flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-slate-950" />
              </div>
              <h3 className="text-2xl font-heading font-bold mb-3">Our Mission</h3>
              <p className="text-slate-800 text-sm leading-relaxed font-medium">
                To win souls, make disciples, and equip believers to walk in their God-given calling and authority.
              </p>
            </div>

            <div className="sm:col-span-2 p-8 rounded-3xl bg-slate-950 text-white shadow-2xl border border-white/10 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <img
                  src="https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1000&q=80"
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-slate-950/80" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-secondary mb-3">
                  <BookOpen className="w-5 h-5" />
                  <h3 className="text-lg font-heading font-bold uppercase tracking-wider">Our Scripture</h3>
                </div>
                <p className="text-slate-200 text-base italic leading-relaxed">
                  "Be glad then, ye children of Zion, and rejoice in the LORD your God: for he hath given you the former rain moderately, and he will cause to come down for you the rain, the former rain, and the latter rain in the first month." — Joel 2:23
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="relative py-24 mb-24 bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1920&q=80"
            alt=""
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/90 to-slate-950" />
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-secondary font-bold text-xs uppercase tracking-[0.22em] block mb-2">
              What Guides Us
            </span>
            <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-white mb-4">Core Values</h2>
            <div className="w-20 h-1.5 bg-gradient-to-r from-primary-light to-secondary mx-auto rounded-full" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {VALUES.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="group text-center p-8 bg-white/[0.05] backdrop-blur-xl rounded-3xl shadow-xl hover:bg-white/[0.1] hover:-translate-y-2 transition-all duration-300 border border-white/10 hover:border-secondary/40"
              >
                <div className="w-16 h-16 rounded-2xl bg-secondary/15 border border-secondary/30 flex items-center justify-center mx-auto mb-6 group-hover:bg-secondary group-hover:text-slate-950 transition-colors duration-300 text-secondary">
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-heading font-bold text-white mb-3">{title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-primary font-bold text-xs uppercase tracking-[0.22em] block mb-2">
            Shepherds of the House
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-slate-900 mb-4">Our Leadership</h2>
          <div className="w-20 h-1.5 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full" />
        </div>
        <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {LEADERSHIP.map(({ name, title, initials }) => (
            <div
              key={name}
              className="group text-center bg-white p-8 rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="relative w-32 h-32 mx-auto mb-6">
                <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-br from-secondary to-primary opacity-40 blur-md group-hover:opacity-80 transition-opacity" />
                <div className="relative w-full h-full rounded-3xl bg-gradient-to-br from-slate-900 via-primary-dark to-primary flex items-center justify-center shadow-xl border-2 border-secondary/40">
                  <span className="text-3xl font-heading font-extrabold text-secondary">{initials}</span>
                </div>
              </div>
              <h3 className="text-xl font-heading font-bold text-slate-900 group-hover:text-primary transition-colors">
                {name}
              </h3>
              <p className="text-secondary-dark font-semibold text-sm mt-1.5">{title}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
