import { BookOpen, Play, Calendar, Clock } from 'lucide-react';

// Placeholder data to display until the backend is connected
const PLACEHOLDER_SERMONS = [
  {
    _id: '1',
    title: 'Walking in the Spirit',
    preacher: 'Pastor Joel Tamon',
    series: 'Living by Faith',
    scripture: 'Galatians 5:16-25',
    date: 'June 29, 2025',
    duration: '52 min',
  },
  {
    _id: '2',
    title: 'The Power of the Latter Rain',
    preacher: 'Pastor Joel Tamon',
    series: 'Signs and Wonders',
    scripture: 'Joel 2:23-29',
    date: 'June 22, 2025',
    duration: '48 min',
  },
  {
    _id: '3',
    title: 'Unshakeable Faith',
    preacher: 'Pastor Joel Tamon',
    series: 'Living by Faith',
    scripture: 'Hebrews 11:1-6',
    date: 'June 15, 2025',
    duration: '61 min',
  },
  {
    _id: '4',
    title: 'The Fullness of the Holy Spirit',
    preacher: 'Guest Speaker',
    series: 'Spirit-Filled Living',
    scripture: 'Acts 2:1-4',
    date: 'June 8, 2025',
    duration: '55 min',
  },
  {
    _id: '5',
    title: 'Pressing Towards the Mark',
    preacher: 'Pastor Joel Tamon',
    series: 'Purpose & Destiny',
    scripture: 'Philippians 3:13-14',
    date: 'June 1, 2025',
    duration: '44 min',
  },
  {
    _id: '6',
    title: 'Renewing the Mind',
    preacher: 'Pastor Joel Tamon',
    series: 'Transformation',
    scripture: 'Romans 12:2',
    date: 'May 25, 2025',
    duration: '50 min',
  },
];

// Colour map per series for the accent badge
const SERIES_COLORS: Record<string, string> = {
  'Living by Faith': 'bg-blue-100 text-blue-700',
  'Signs and Wonders': 'bg-purple-100 text-purple-700',
  'Spirit-Filled Living': 'bg-amber-100 text-amber-700',
  'Purpose & Destiny': 'bg-emerald-100 text-emerald-700',
  'Transformation': 'bg-rose-100 text-rose-700',
};

const SermonsPage = () => {
  return (
    <div className="pt-24 pb-20 bg-background min-h-screen">
      {/* Page Header */}
      <div className="bg-slate-900 text-white py-20 mb-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary rounded-full filter blur-3xl opacity-20"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-secondary/30 bg-secondary/10 mb-4">
            <BookOpen className="w-4 h-4 text-secondary" />
            <span className="text-secondary font-semibold text-sm uppercase tracking-widest">Messages</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-heading font-extrabold mb-4">Sermon Archive</h1>
          <p className="text-slate-400 max-w-xl mx-auto text-lg">
            Revisit powerful messages from our services. Let the Word of God transform your life.
          </p>
        </div>
      </div>

      {/* Sermons Grid */}
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PLACEHOLDER_SERMONS.map((sermon, index) => (
            <div
              key={sermon._id}
              className="group bg-white rounded-3xl shadow-md shadow-slate-200/50 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden border border-slate-100 flex flex-col"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Thumbnail Placeholder */}
              <div className="relative bg-gradient-to-br from-primary-dark to-primary h-48 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <button className="relative z-10 w-16 h-16 rounded-full bg-secondary flex items-center justify-center shadow-lg shadow-secondary/40 group-hover:scale-110 transition-transform duration-300">
                  <Play className="w-7 h-7 text-slate-900 ml-1" fill="currentColor" />
                </button>
                <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {sermon.duration}
                </span>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <span className={`self-start text-xs font-bold px-3 py-1 rounded-full mb-3 ${SERIES_COLORS[sermon.series] || 'bg-slate-100 text-slate-600'}`}>
                  {sermon.series}
                </span>
                <h3 className="text-xl font-heading font-bold text-slate-800 mb-2 group-hover:text-primary transition-colors">
                  {sermon.title}
                </h3>
                <p className="text-slate-500 text-sm mb-4">{sermon.preacher}</p>

                <div className="mt-auto flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-4">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" /> {sermon.scripture}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> {sermon.date}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SermonsPage;
