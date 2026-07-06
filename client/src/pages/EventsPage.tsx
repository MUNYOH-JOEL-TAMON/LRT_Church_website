import { CalendarDays, MapPin, Clock, Users } from 'lucide-react';
import Button from '../components/ui/Button';

const PLACEHOLDER_EVENTS = [
  {
    _id: '1',
    title: 'Sunday Worship Service',
    description: 'Our flagship weekly service. Come experience vibrant praise, powerful preaching, and genuine community.',
    startDate: 'Every Sunday, 9:00 AM',
    location: 'Main Sanctuary, LRT Church',
    category: 'Weekly Service',
    categoryColor: 'bg-blue-100 text-blue-700',
    capacity: 'Open to all',
    isRecurring: true,
  },
  {
    _id: '2',
    title: 'Mid-Week Bible Study',
    description: 'A deep dive into the Word of God. Perfect for growing in understanding of scripture.',
    startDate: 'Every Wednesday, 6:00 PM',
    location: 'Fellowship Hall',
    category: 'Bible Study',
    categoryColor: 'bg-emerald-100 text-emerald-700',
    capacity: 'Open to all',
    isRecurring: true,
  },
  {
    _id: '3',
    title: 'Youth Encounter Night',
    description: 'A powerful night of worship and ministry designed specifically for the youth of Latter Rain.',
    startDate: 'July 19, 2025 — 5:00 PM',
    location: 'Youth Centre',
    category: 'Youth',
    categoryColor: 'bg-purple-100 text-purple-700',
    capacity: '80 seats',
    isRecurring: false,
  },
  {
    _id: '4',
    title: 'Prayer & Intercession Summit',
    description: 'A concentrated weekend of corporate prayer for the nation, the church, and the nations of the earth.',
    startDate: 'July 25–27, 2025',
    location: 'Main Sanctuary',
    category: 'Prayer',
    categoryColor: 'bg-rose-100 text-rose-700',
    capacity: '200 seats',
    isRecurring: false,
  },
  {
    _id: '5',
    title: 'Women of Purpose Conference',
    description: 'An empowering conference celebrating and equipping women to walk in their God-given purpose.',
    startDate: 'August 9, 2025 — 10:00 AM',
    location: 'Main Sanctuary',
    category: 'Conference',
    categoryColor: 'bg-pink-100 text-pink-700',
    capacity: '150 seats',
    isRecurring: false,
  },
];

const EventsPage = () => {
  return (
    <div className="pt-24 pb-20 bg-background min-h-screen">
      {/* Page Header */}
      <div className="bg-slate-900 text-white py-20 mb-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-80 h-80 bg-secondary rounded-full filter blur-3xl opacity-10"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-secondary/30 bg-secondary/10 mb-4">
            <CalendarDays className="w-4 h-4 text-secondary" />
            <span className="text-secondary font-semibold text-sm uppercase tracking-widest">What's On</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-heading font-extrabold mb-4">Events & Services</h1>
          <p className="text-slate-400 max-w-xl mx-auto text-lg">
            Stay connected with everything happening at Latter Rain Tabernacle.
          </p>
        </div>
      </div>

      {/* Events List */}
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-6 max-w-4xl mx-auto">
          {PLACEHOLDER_EVENTS.map((event) => (
            <div
              key={event._id}
              className="group bg-white rounded-3xl shadow-md shadow-slate-200/50 hover:shadow-xl transition-all duration-300 border border-slate-100 p-6 md:p-8 flex flex-col md:flex-row gap-6"
            >
              {/* Date Block */}
              <div className="flex-shrink-0 w-24 h-24 rounded-2xl bg-primary-dark flex flex-col items-center justify-center text-white shadow-lg shadow-primary/20">
                <CalendarDays className="w-7 h-7 text-secondary mb-1" />
                <span className="text-xs font-semibold text-blue-200 text-center leading-tight px-2">
                  {event.isRecurring ? 'Recurring' : 'Upcoming'}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${event.categoryColor}`}>
                    {event.category}
                  </span>
                </div>
                <h3 className="text-2xl font-heading font-bold text-slate-800 mb-2 group-hover:text-primary transition-colors">
                  {event.title}
                </h3>
                <p className="text-slate-500 mb-4 leading-relaxed">{event.description}</p>

                <div className="flex flex-wrap gap-5 text-sm text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-primary" /> {event.startDate}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-primary" /> {event.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-primary" /> {event.capacity}
                  </span>
                </div>
              </div>

              {/* CTA */}
              <div className="flex-shrink-0 flex items-center">
                <Button variant="outline" size="sm">
                  Register
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
