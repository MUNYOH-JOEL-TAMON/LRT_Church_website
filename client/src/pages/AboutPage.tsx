import { Target, Eye, Heart, Users, Award } from 'lucide-react';

const VALUES = [
  { icon: Heart, title: 'Faith', description: 'We believe in a living, active faith that moves mountains and transforms lives.' },
  { icon: Users, title: 'Community', description: 'We are a family committed to loving, serving, and growing together.' },
  { icon: Target, title: 'Purpose', description: 'Every believer is called and equipped to fulfil a unique God-given destiny.' },
  { icon: Award, title: 'Excellence', description: 'We honour God by pursuing excellence in everything we do for His Kingdom.' },
];

const LEADERSHIP = [
  { name: 'Pastor Joel Tamon', title: 'Senior Pastor & Founder', initials: 'JT' },
  { name: 'Deacon Michael Ndi', title: 'Church Administrator', initials: 'MN' },
  { name: 'Sister Grace Munyoh', title: 'Worship Director', initials: 'GM' },
];

const AboutPage = () => {
  return (
    <div className="pt-24 pb-20 min-h-screen">
      {/* Page Header */}
      <div className="bg-slate-900 text-white py-20 mb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full filter blur-3xl opacity-15 pointer-events-none"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-heading font-extrabold mb-4">Our Story</h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Founded on faith and fuelled by the Holy Spirit — Latter Rain Tabernacle is more than a church; it is a movement.
          </p>
        </div>
      </div>

      {/* Mission & Vision */}
      <section className="container mx-auto px-4 mb-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-secondary font-bold text-sm uppercase tracking-widest">Who We Are</span>
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-slate-800 mt-2 mb-6">
              A Spirit-Filled Church for the Nations
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Latter Rain Tabernacle (LRT) is a vibrant, Spirit-filled local church committed to the full Gospel of Jesus Christ. We believe in the power of the Holy Spirit to transform lives, heal the sick, and bring hope to the hopeless.
            </p>
            <p className="text-slate-600 leading-relaxed">
              We were founded with a mandate to raise a generation of believers who are rooted in the Word, led by the Spirit, and sent into the harvest field with power and purpose.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-primary text-white shadow-xl shadow-primary/20">
              <Eye className="w-8 h-8 text-secondary mb-4" />
              <h3 className="text-xl font-heading font-bold mb-2">Our Vision</h3>
              <p className="text-blue-100 text-sm leading-relaxed">
                To be a lighthouse of God's glory, impacting every sphere of society with the Kingdom of God.
              </p>
            </div>
            <div className="p-6 rounded-3xl bg-secondary text-slate-900 shadow-xl shadow-secondary/20">
              <Target className="w-8 h-8 text-slate-900 mb-4" />
              <h3 className="text-xl font-heading font-bold mb-2">Our Mission</h3>
              <p className="text-slate-700 text-sm leading-relaxed">
                To win souls, make disciples, and equip believers to walk in their God-given calling and authority.
              </p>
            </div>
            <div className="col-span-2 p-6 rounded-3xl bg-slate-900 text-white shadow-xl">
              <h3 className="text-lg font-heading font-bold text-secondary mb-2">Our Scripture</h3>
              <p className="text-slate-300 text-sm italic leading-relaxed">
                "Be glad then, ye children of Zion, and rejoice in the LORD your God: for he hath given you the former rain moderately, and he will cause to come down for you the rain, the former rain, and the latter rain in the first month." — Joel 2:23
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-slate-50 py-20 mb-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-slate-800 mb-3">Core Values</h2>
            <div className="w-20 h-1.5 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {VALUES.map(({ icon: Icon, title, description }) => (
              <div key={title} className="group text-center p-8 bg-white rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-slate-100">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary group-hover:text-white transition-colors duration-300 text-primary">
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-heading font-bold text-slate-800 mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-slate-800 mb-3">Our Leadership</h2>
          <div className="w-20 h-1.5 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          {LEADERSHIP.map(({ name, title, initials }) => (
            <div key={name} className="group text-center w-64">
              <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-primary-dark to-primary flex items-center justify-center mx-auto mb-5 shadow-xl shadow-primary/20 group-hover:shadow-primary/40 transition-shadow duration-300">
                <span className="text-3xl font-heading font-extrabold text-secondary">{initials}</span>
              </div>
              <h3 className="text-xl font-heading font-bold text-slate-800">{name}</h3>
              <p className="text-slate-500 text-sm mt-1">{title}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
