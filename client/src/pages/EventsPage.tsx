import { useState, useEffect } from 'react';
import { CalendarDays, MapPin, Clock, Users, Loader2, Image as ImageIcon } from 'lucide-react';
import Button from '../components/ui/Button';
import PageBanner from '../components/ui/PageBanner';
import eventService from '../services/eventService';
import type { Event } from '../types';
import useAuthStore from '../store/useAuthStore';
import getMediaUrl from '../utils/imageUrl';

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
        if (user) {
          const already = new Set(
            eventsData.filter((e) => e.registeredAttendees?.includes(user._id)).map((e) => e._id)
          );
          setRegisteredIds(already);
        }
      } catch {
        setError('Failed to load events. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [user]);

  const handleRegister = async (eventId: string) => {
    if (!isAuthenticated) { window.location.href = '/portal/login'; return; }
    try {
      setRegisteringId(eventId);
      await eventService.register(eventId);
      setRegisteredIds((prev) => new Set(prev).add(eventId));
      setEvents((prev) =>
        prev.map((e) =>
          e._id === eventId ? { ...e, registeredAttendees: [...e.registeredAttendees, user!._id] } : e
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
    <div className="pb-24 bg-background min-h-screen">
      {/* Page Header with Background Image & Video Animation */}
      <PageBanner
        badgeIcon={<CalendarDays className="w-4 h-4 text-secondary" />}
        badgeText="What's On"
        title="Events & Services"
        subtitle="Stay connected with everything happening at Latter Rain Tabernacle."
        backgroundImage="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1920&q=85"
        videoUrl="https://assets.mixkit.co/videos/preview/mixkit-rays-of-light-in-a-dark-room-41573-large.mp4"
      />

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
          <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm max-w-xl mx-auto p-12">
            <div className="w-16 h-16 rounded-2xl bg-secondary/15 flex items-center justify-center mx-auto mb-5">
              <CalendarDays className="w-8 h-8 text-secondary-dark" />
            </div>
            <h3 className="text-xl font-heading font-bold text-slate-800 mb-2">No Upcoming Events</h3>
            <p className="text-slate-400">Check back soon — new events will be posted here.</p>
          </div>
        )}

        {/* Events */}
        {!isLoading && !error && events.length > 0 && (
          <div className="flex flex-col gap-8 max-w-4xl mx-auto">
            {events.map((event) => {
              const atCapacity = isAtCapacity(event);
              const isRegistered = registeredIds.has(event._id);
              const isRegistering = registeringId === event._id;

              return (
                <div
                  key={event._id}
                  className="group bg-white rounded-3xl shadow-lg shadow-slate-200/50 hover:shadow-2xl transition-all duration-300 border border-slate-100 overflow-hidden"
                >
                  {/* ── Flier image (full width when present) ── */}
                  {event.flierUrl ? (
                    <div className="relative w-full h-64 sm:h-80 overflow-hidden">
                      <img
                        src={getMediaUrl(event.flierUrl)}
                        alt={`${event.title} flier`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                      {/* date badge overlay */}
                      {event.date && (
                        <div className="absolute top-4 left-4 bg-slate-950/85 backdrop-blur-md text-white rounded-2xl px-4 py-2 flex items-center gap-2 shadow-lg border border-white/10">
                          <CalendarDays className="w-4 h-4 text-secondary" />
                          <span className="text-sm font-semibold">
                            {new Date(event.date).toLocaleDateString('en-US', {
                              month: 'short', day: 'numeric', year: 'numeric',
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* No flier — coloured banner with date block */
                    <div className="relative bg-gradient-to-r from-slate-950 via-primary-dark to-primary p-7 flex items-center gap-5 overflow-hidden">
                      <div className="w-16 h-16 rounded-2xl bg-secondary/15 border border-secondary/30 flex flex-col items-center justify-center text-white flex-shrink-0">
                        {event.date ? (
                          <>
                            <span className="text-xl font-extrabold text-secondary leading-none">
                              {new Date(event.date).getDate()}
                            </span>
                            <span className="text-xs text-blue-100 font-semibold uppercase mt-0.5">
                              {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                            </span>
                          </>
                        ) : (
                          <ImageIcon className="w-6 h-6 text-white/40" />
                        )}
                      </div>
                      <h3 className="text-2xl font-heading font-bold text-white">
                        {event.title}
                      </h3>
                    </div>
                  )}

                  {/* ── Event details ── */}
                  <div className="p-6 md:p-8">
                    {event.flierUrl && (
                      <h3 className="text-2xl font-heading font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>
                    )}

                    <p className="text-slate-600 leading-relaxed mb-6">{event.description}</p>

                    {/* Meta row */}
                    <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      {event.date && (
                        <span className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                          {new Date(event.date).toLocaleDateString('en-US', {
                            weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
                          })}
                        </span>
                      )}
                      <span className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-secondary-dark flex-shrink-0" />
                        {event.location}
                      </span>
                      <span className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary flex-shrink-0" />
                        {event.maxCapacity
                          ? `${event.registeredAttendees?.length ?? 0} / ${event.maxCapacity} registered`
                          : 'Open to all'}
                      </span>
                    </div>

                    {/* CTA */}
                    <div className="flex items-center justify-between">
                      {event.maxCapacity ? (
                        <div className="flex-1 mr-6">
                          <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                            <span>{event.registeredAttendees?.length ?? 0} registered</span>
                            <span>{event.maxCapacity} spots</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${atCapacity ? 'bg-red-400' : 'bg-gradient-to-r from-primary to-secondary'}`}
                              style={{
                                width: `${Math.min(
                                  100,
                                  ((event.registeredAttendees?.length ?? 0) / event.maxCapacity) * 100
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div />
                      )}

                      {isRegistered ? (
                        <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-5 py-2.5 rounded-xl border border-emerald-200">
                          ✓ Registered
                        </span>
                      ) : (
                        <Button
                          variant={atCapacity ? 'ghost' : 'secondary'}
                          size="sm"
                          onClick={() => handleRegister(event._id)}
                          isLoading={isRegistering}
                          disabled={atCapacity}
                        >
                          {atCapacity ? 'Fully Booked' : 'Register Now'}
                        </Button>
                      )}
                    </div>
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
