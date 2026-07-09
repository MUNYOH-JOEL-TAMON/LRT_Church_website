import { useState, useEffect } from 'react';
import { CalendarDays, MapPin, Clock, Users, Loader2 } from 'lucide-react';
import Button from '../components/ui/Button';
import eventService from '../services/eventService';
import type { Event } from '../types';
import useAuthStore from '../store/useAuthStore';

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [registeringId, setRegisteringId] = useState<string | null>(null);
  const [registeredIds, setRegisteredIds] = useState<Set<string>>(new Set());
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    const fetch = async () => {
      try {
        setIsLoading(true);
        const res = await eventService.getAll();
        const eventsData = res.data || [];
        setEvents(eventsData);

        // Pre-mark events the user is already registered for
        if (user) {
          const alreadyRegistered = new Set(
            eventsData
              .filter((e) => e.registeredAttendees?.includes(user._id))
              .map((e) => e._id)
          );
          setRegisteredIds(alreadyRegistered);
        }
      } catch (err) {
        setError('Failed to load events. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [user]);

  const handleRegister = async (eventId: string) => {
    if (!isAuthenticated) {
      window.location.href = '/portal/login';
      return;
    }
    try {
      setRegisteringId(eventId);
      await eventService.register(eventId);
      setRegisteredIds((prev) => new Set(prev).add(eventId));
      // Update local attendee count
      setEvents((prev) =>
        prev.map((e) =>
          e._id === eventId
            ? { ...e, registeredAttendees: [...e.registeredAttendees, user!._id] }
            : e
        )
      );
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to register for event');
    } finally {
      setRegisteringId(null);
    }
  };

  const isAtCapacity = (event: Event) =>
    !!event.maxCapacity && event.registeredAttendees?.length >= event.maxCapacity;

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

      {/* Content */}
      <div className="container mx-auto px-4">
        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-slate-500 text-sm">Loading events...</p>
          </div>
        )}

        {/* Error */}
        {!isLoading && error && (
          <div className="text-center py-24">
            <p className="text-red-500 font-medium">{error}</p>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !error && events.length === 0 && (
          <div className="text-center py-24">
            <CalendarDays className="w-14 h-14 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-heading font-bold text-slate-700 mb-2">No Upcoming Events</h3>
            <p className="text-slate-400">Check back soon — new events will be posted here.</p>
          </div>
        )}

        {/* Events List */}
        {!isLoading && !error && events.length > 0 && (
          <div className="flex flex-col gap-6 max-w-4xl mx-auto">
            {events.map((event) => {
              const atCapacity = isAtCapacity(event);
              const isRegistered = registeredIds.has(event._id);
              const isRegistering = registeringId === event._id;

              return (
                <div
                  key={event._id}
                  className="group bg-white rounded-3xl shadow-md shadow-slate-200/50 hover:shadow-xl transition-all duration-300 border border-slate-100 p-6 md:p-8 flex flex-col md:flex-row gap-6"
                >
                  {/* Date block */}
                  <div className="flex-shrink-0 w-24 h-24 rounded-2xl bg-primary-dark flex flex-col items-center justify-center text-white shadow-lg shadow-primary/20">
                    <CalendarDays className="w-7 h-7 text-secondary mb-1" />
                    {event.date ? (
                      <>
                        <span className="text-lg font-extrabold leading-none">
                          {new Date(event.date).getDate()}
                        </span>
                        <span className="text-xs text-blue-200 font-medium">
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                      </>
                    ) : (
                      <span className="text-xs text-blue-200 text-center px-1">TBD</span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-heading font-bold text-slate-800 mb-2 group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-slate-500 mb-4 leading-relaxed">{event.description}</p>

                    <div className="flex flex-wrap gap-5 text-sm text-slate-500">
                      {event.date && (
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-primary" />
                          {new Date(event.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-primary" />
                        {event.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-primary" />
                        {event.maxCapacity
                          ? `${event.registeredAttendees?.length ?? 0} / ${event.maxCapacity} registered`
                          : 'Open to all'}
                      </span>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex-shrink-0 flex items-center">
                    {isRegistered ? (
                      <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200">
                        ✓ Registered
                      </span>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRegister(event._id)}
                        isLoading={isRegistering}
                        disabled={atCapacity}
                      >
                        {atCapacity ? 'Full' : 'Register'}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
