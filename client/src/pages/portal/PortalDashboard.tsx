import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  LayoutDashboard,
  Radio,
  Video,
  VideoOff,
  BookOpen,
  CalendarDays,
  HeartHandshake,
  LogOut,
  User,
  Users,
  Menu,
  X,
  ChevronRight,
  Clock,
  MapPin,
  Sparkles,
  CheckCircle2,
  Calendar,
  Mic,
  Play,
  Send,
  Lock,
  Plus,
  Search,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Phone,
  Mail,
  RefreshCw,
  Check,
} from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import sermonService from '../../services/sermonService';
import eventService from '../../services/eventService';
import prayerService from '../../services/prayerService';
import broadcastService from '../../services/broadcastService';
import authService from '../../services/authService';
import type { Sermon, Event, PrayerRequest, BroadcastSession, VirtualParticipant, BroadcastRestriction } from '../../types';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import lrtLogo from '../../assets/LRT_LOGO.jpeg';
import getMediaUrl from '../../utils/imageUrl';
import getEmbedStreamUrl from '../../utils/streamUrl';
import isEventRegistrationClosed from '../../utils/eventUtils';
import NotificationBell from '../../components/ui/NotificationBell';

type TabType = 'overview' | 'live' | 'sermons' | 'events' | 'prayer' | 'profile';

const PortalDashboard = () => {
  const { user, logout, updateUser } = useAuthStore();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Data states
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [myPrayers, setMyPrayers] = useState<PrayerRequest[]>([]);
  const [publicPrayers, setPublicPrayers] = useState<PrayerRequest[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Live Broadcast & Virtual Sanctuary states
  const [broadcast, setBroadcast] = useState<BroadcastSession | null>(null);
  const [broadcastRestriction, setBroadcastRestriction] = useState<BroadcastRestriction | null>(null);
  const [broadcastParticipants, setBroadcastParticipants] = useState<VirtualParticipant[]>([]);
  const [cameraActive, setCameraActive] = useState(false);
  const [locationInput, setLocationInput] = useState('');
  const [userLocation, setUserLocation] = useState('Online Worshipper');
  const [myParticipant, setMyParticipant] = useState<VirtualParticipant | null>(null);
  const [recentReactionSent, setRecentReactionSent] = useState('');
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  // Action states
  const [registeringEventId, setRegisteringEventId] = useState<string | null>(null);
  const [prayerModalOpen, setPrayerModalOpen] = useState(false);
  const [selectedPrayerDetail, setSelectedPrayerDetail] = useState<PrayerRequest | null>(null);
  const [prayerForm, setPrayerForm] = useState({ request: '', isPrivate: false });
  const [isSubmittingPrayer, setIsSubmittingPrayer] = useState(false);
  const [prayerSuccessMsg, setPrayerSuccessMsg] = useState('');
  const [prayerErrorMsg, setPrayerErrorMsg] = useState('');

  // Profile update form
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phoneNumber: user?.phone || '',
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');
  const [profileErrorMsg, setProfileErrorMsg] = useState('');

  // Search & filter states
  const [sermonSearch, setSermonSearch] = useState('');
  const [eventFilter, setEventFilter] = useState<'all' | 'registered'>('all');
  const [prayerWallTab, setPrayerWallTab] = useState<'my' | 'community'>('my');

  // Load all initial portal data
  const fetchPortalData = async () => {
    setIsLoadingData(true);
    try {
      const [sermonsRes, eventsRes, myPrayersRes, publicPrayersRes] = await Promise.allSettled([
        sermonService.getAll(),
        eventService.getAll(),
        prayerService.getMy(),
        prayerService.getPublic(),
      ]);

      if (sermonsRes.status === 'fulfilled' && sermonsRes.value.data) {
        setSermons(sermonsRes.value.data);
      }
      if (eventsRes.status === 'fulfilled' && eventsRes.value.data) {
        setEvents(eventsRes.value.data);
      }
      if (myPrayersRes.status === 'fulfilled' && myPrayersRes.value.data) {
        setMyPrayers(myPrayersRes.value.data);
      }
      if (publicPrayersRes.status === 'fulfilled' && publicPrayersRes.value.data) {
        setPublicPrayers(publicPrayersRes.value.data);
      }
    } catch {
      // Data fetch fallback
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchPortalData();
  }, []);

  // Listen to tab in query parameter (e.g. ?tab=live)
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['overview', 'live', 'sermons', 'events', 'prayer', 'profile'].includes(tabParam)) {
      setActiveTab(tabParam as TabType);
    }
  }, [searchParams]);

  // Fetch live broadcast status periodically
  const fetchBroadcastData = async () => {
    try {
      const res = await broadcastService.getCurrent();
      if (res.data) {
        setBroadcast(res.data.broadcast);
        setBroadcastParticipants(res.data.participants || []);
        setBroadcastRestriction(res.data.restriction || null);
        if (user && res.data.participants) {
          const mine = res.data.participants.find((p) => p.userId === user._id);
          if (mine) setMyParticipant(mine);
        }
      }
    } catch {
      // Quiet fail
    }
  };

  useEffect(() => {
    fetchBroadcastData();
    const intervalTime = activeTab === 'live' ? 4000 : 20000;
    const interval = setInterval(fetchBroadcastData, intervalTime);
    return () => clearInterval(interval);
  }, [activeTab, user]);

  // Presence heartbeat when camera is active
  useEffect(() => {
    if (!cameraActive) return;
    const pingInterval = setInterval(async () => {
      try {
        await broadcastService.pingPresence();
      } catch {
        // Quiet fail
      }
    }, 15000);
    return () => clearInterval(pingInterval);
  }, [cameraActive]);

  // Restore camera video stream preview when live tab is displayed
  useEffect(() => {
    if (activeTab === 'live' && cameraActive && localStreamRef.current && videoPreviewRef.current) {
      videoPreviewRef.current.srcObject = localStreamRef.current;
    }
  }, [activeTab, cameraActive]);

  // Cleanup media tracks on unmount
  useEffect(() => {
    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  // Camera controls for Virtual Sanctuary
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 360 } },
        audio: true,
      });
      localStreamRef.current = stream;
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
      }
      setCameraActive(true);

      const loc = locationInput.trim() || 'Online Worshipper';
      setUserLocation(loc);

      const res = await broadcastService.joinPresence({
        location: loc,
        hasCamera: true,
        hasAudio: true,
      });
      if (res.data) setMyParticipant(res.data);
    } catch {
      alert('Could not access camera/microphone. Please ensure permissions are granted in your browser.');
    }
  };

  const stopCamera = async () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }
    if (videoPreviewRef.current) {
      videoPreviewRef.current.srcObject = null;
    }
    setCameraActive(false);
    await broadcastService.leavePresence();
    setMyParticipant(null);
  };

  const handleSendReaction = async (type: string) => {
    try {
      setRecentReactionSent(type);
      await broadcastService.sendReaction(type);
      setTimeout(() => setRecentReactionSent(''), 1500);
    } catch {
      // Quiet fail
    }
  };

  // Prevent body scroll when mobile drawer or modal is open
  useEffect(() => {
    if (isMobileMenuOpen || prayerModalOpen || selectedPrayerDetail) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen, prayerModalOpen, selectedPrayerDetail]);

  // Close modals on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setPrayerModalOpen(false);
        setSelectedPrayerDetail(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Update profileForm if user changes in store
  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phoneNumber: user.phone || '',
      });
    }
  }, [user]);

  // Handle Event Registration
  const handleEventRegister = async (eventId: string) => {
    try {
      const targetEvent = events.find((e) => e._id === eventId);
      if (targetEvent && isEventRegistrationClosed(targetEvent.date)) {
        alert('Registration is closed for this event as the due date has been reached.');
        return;
      }
      setRegisteringEventId(eventId);
      await eventService.register(eventId);
      setEvents((prev) =>
        prev.map((e) =>
          e._id === eventId
            ? { ...e, registeredAttendees: [...(e.registeredAttendees || []), user!._id] }
            : e
        )
      );
      fetchBroadcastData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to register for this event');
    } finally {
      setRegisteringEventId(null);
    }
  };

  // Handle Prayer Request Submission
  const handleSubmitPrayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prayerForm.request.trim()) return;
    setIsSubmittingPrayer(true);
    setPrayerErrorMsg('');
    try {
      const res = await prayerService.create({
        request: prayerForm.request,
        isPrivate: prayerForm.isPrivate,
      });
      if (res.data) {
        // Ensure user object is populated with current user's profile if missing
        const newPrayer = { ...res.data };
        if (!newPrayer.user || typeof newPrayer.user !== 'object' || !newPrayer.user.firstName) {
          newPrayer.user = {
            _id: user?._id || '',
            firstName: user?.firstName || 'Member',
            lastName: user?.lastName || '',
            email: user?.email || '',
          };
        }
        setMyPrayers((prev) => [newPrayer, ...prev]);
        if (!newPrayer.isPrivate) {
          setPublicPrayers((prev) => [newPrayer, ...prev]);
        }
      }
      setPrayerSuccessMsg('Your prayer request has been received by the intercessory team.');
      setPrayerForm({ request: '', isPrivate: false });
      setTimeout(() => {
        setPrayerModalOpen(false);
        setPrayerSuccessMsg('');
      }, 1600);
    } catch (err: any) {
      setPrayerErrorMsg(err.response?.data?.message || 'Failed to submit prayer request');
    } finally {
      setIsSubmittingPrayer(false);
    }
  };

  // Handle Profile Update
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setProfileErrorMsg('');
    setProfileSuccessMsg('');
    try {
      const res = await authService.updateProfile({
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        phoneNumber: profileForm.phoneNumber,
      });
      if (res.data) {
        updateUser(res.data);
      }
      setProfileSuccessMsg('Your personal profile has been updated successfully.');
      setTimeout(() => setProfileSuccessMsg(''), 4000);
    } catch (err: any) {
      setProfileErrorMsg(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Derived calculations
  const isBroadcastLive = broadcast?.status === 'live';
  const isDialogueActive = myParticipant && (!myParticipant.isMutedByAdmin || myParticipant.isSpotlighted);
  const embedData = broadcast
    ? getEmbedStreamUrl(broadcast.streamUrl, broadcast.sourceType)
    : { embedUrl: '', isEmbeddable: false };

  const registeredEvents = events.filter((e) => e.registeredAttendees?.includes(user?._id || ''));
  const answeredPrayersCount = myPrayers.filter((p) => p.status === 'Answered').length;
  const latestSermon = sermons[0];

  const filteredSermons = sermons.filter(
    (s) =>
      s.title?.toLowerCase().includes(sermonSearch.toLowerCase()) ||
      s.speaker?.toLowerCase().includes(sermonSearch.toLowerCase()) ||
      s.notes?.toLowerCase().includes(sermonSearch.toLowerCase())
  );

  const displayedEvents =
    eventFilter === 'registered' ? registeredEvents : events;

  const isAdminOrPastor = ['admin', 'pastor', 'editor'].includes(user?.role?.toLowerCase() || '');

  // Navigation items config
  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, count: undefined, badge: undefined },
    {
      id: 'live',
      label: 'Live Sanctuary',
      icon: Radio,
      count: undefined,
      badge: isBroadcastLive ? 'LIVE' : undefined,
    },
    { id: 'sermons', label: 'Sermons', icon: BookOpen, count: sermons.length || undefined, badge: undefined },
    { id: 'events', label: 'Events', icon: CalendarDays, count: registeredEvents.length || undefined, badge: undefined },
    { id: 'prayer', label: 'Prayer Requests', icon: HeartHandshake, count: myPrayers.length || undefined, badge: undefined },
    { id: 'profile', label: 'My Profile', icon: User, count: undefined, badge: undefined },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-body">
      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`w-72 bg-slate-950 text-white flex flex-col fixed h-full z-50 transition-transform duration-300 ease-in-out border-r border-white/10 lg:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-slate-950/80">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-secondary to-primary opacity-60 blur-xs group-hover:opacity-100 transition-opacity" />
              <img
                src={lrtLogo}
                alt="LRT"
                className="relative w-10 h-10 rounded-full object-cover border-2 border-secondary/60"
              />
            </div>
            <div>
              <span className="text-base font-heading font-extrabold text-white tracking-tight leading-none block">
                Latter Rain
              </span>
              <span className="text-[10px] font-bold text-secondary tracking-[0.2em] uppercase block mt-0.5">
                Member Portal
              </span>
            </div>
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white lg:hidden transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-4 py-6 flex flex-col gap-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
            Menu
          </div>
          {navItems.map(({ id, label, icon: Icon, count, badge }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => {
                  setActiveTab(id as TabType);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-primary to-primary-light text-white shadow-lg shadow-primary/25'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-5 h-5 transition-colors ${
                      isActive
                        ? 'text-secondary-light'
                        : id === 'live' && isBroadcastLive
                        ? 'text-red-400 animate-pulse'
                        : 'text-slate-400'
                    }`}
                  />
                  <span>{label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wider bg-red-600 text-white animate-pulse shadow-sm shadow-red-500/50">
                      {badge}
                    </span>
                  )}
                  {count !== undefined && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-white/10 text-secondary'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </div>
              </button>
            );
          })}

          {/* Quick External Links */}
          <div className="pt-6 mt-4 border-t border-white/10 px-3">
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block mb-2">
              Church Links
            </span>
            <Link
              to="/"
              className="flex items-center justify-between py-2.5 text-xs text-slate-300 hover:text-secondary transition-colors"
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5 text-primary-light" />
                Public Website
              </span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
            </Link>

            {isAdminOrPastor && (
              <Link
                to="/admin/dashboard"
                className="flex items-center justify-between py-2 text-xs text-slate-400 hover:text-secondary transition-colors"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                  Admin Console
                </span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
              </Link>
            )}
          </div>
        </nav>

        {/* Member Card & Sign Out at bottom */}
        <div className="p-4 border-t border-white/10 bg-slate-950/90">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary via-secondary to-amber-600 text-slate-950 font-bold flex items-center justify-center text-sm shadow-md flex-shrink-0">
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] text-slate-300 font-medium truncate">
                  Church Member
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-red-300 hover:bg-red-500/10 hover:text-red-200 border border-transparent hover:border-red-500/20 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <div className="flex-1 lg:ml-72 flex flex-col min-w-0">
        {/* Top Sticky Bar */}
        <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-xl border-b border-slate-200/80 px-3.5 sm:px-8 py-3 sm:py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-1 sm:-ml-2 rounded-xl hover:bg-slate-100 text-slate-600 lg:hidden transition-colors cursor-pointer flex-shrink-0"
              aria-label="Open portal navigation"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl font-heading font-extrabold text-slate-900 capitalize truncate">
                {activeTab === 'overview'
                  ? 'Dashboard Overview'
                  : activeTab === 'live'
                  ? 'Live Sanctuary'
                  : activeTab.replace('-', ' ')}
              </h1>
              <p className="text-xs text-slate-400 hidden sm:block truncate">
                Latter Rain Tabernacle • Member Sanctuary
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <button
              onClick={() => fetchPortalData()}
              title="Refresh data"
              className="p-2 sm:p-2.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-primary transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingData ? 'animate-spin text-primary' : ''}`} />
            </button>

            {/* In-App Live Notifications */}
            <NotificationBell />

            <button
              onClick={() => setPrayerModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-secondary to-secondary-light hover:from-amber-400 hover:to-secondary text-slate-950 text-xs font-extrabold px-3.5 sm:px-4 py-2 rounded-xl transition-all shadow-md shadow-secondary/20 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-slate-950" />
              Submit Prayer
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs hover:bg-primary hover:text-white transition-all cursor-pointer"
              title="My Profile"
            >
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </button>
          </div>
        </header>

        {/* Main Tab Pages */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto min-w-0 overflow-x-hidden">
          {/* ══════════════════════════════════════════════════════════
              TAB 1: OVERVIEW
             ══════════════════════════════════════════════════════════ */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fade-in">
              {/* Live Service Broadcast Alert Banner */}
              {isBroadcastLive && (
                <div className={`p-6 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-5 border ${
                  broadcastRestriction?.isRestricted
                    ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 shadow-amber-600/20 border-amber-400/40'
                    : 'bg-gradient-to-r from-red-600 via-rose-600 to-primary shadow-red-600/20 border-red-400/40'
                }`}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white flex-shrink-0">
                      {broadcastRestriction?.isRestricted ? (
                        <Lock className="w-6 h-6 text-amber-200" />
                      ) : (
                        <Radio className="w-6 h-6 animate-pulse" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                        <span className="text-xs font-black uppercase tracking-wider text-secondary">
                          {broadcastRestriction?.isRestricted ? 'Restricted Event Live Now' : 'Service Live Now'}
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-heading font-extrabold text-white">
                        {broadcast?.title || 'Sunday Worship Service'}
                      </h3>
                      <p className="text-xs text-slate-100">
                        {broadcastRestriction?.isRestricted
                          ? `Restricted to registered attendees of ${broadcastRestriction.event?.title || 'this event'}. Tap to unlock access.`
                          : `Ministration by ${broadcast?.preacher || 'Pastor Joel'} • Appear on the church projector wall!`}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setActiveTab('live')}
                    leftIcon={broadcastRestriction?.isRestricted ? <Lock className="w-4 h-4 text-slate-950" /> : <Play className="w-4 h-4 text-slate-950" />}
                    className="shadow-lg shadow-black/20 flex-shrink-0"
                  >
                    {broadcastRestriction?.isRestricted ? 'View Access & Register' : 'Join Live Sanctuary'}
                  </Button>
                </div>
              )}

              {/* Hero Banner with Royal Blue & Gold theme */}
              <div className="relative rounded-3xl bg-gradient-to-br from-slate-950 via-primary-dark to-primary text-white p-6 sm:p-10 overflow-hidden shadow-2xl shadow-primary/20 border border-white/10">
                <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-primary-light/20 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 max-w-3xl">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md mb-4">
                    <Sparkles className="w-3.5 h-3.5 text-secondary" />
                    <span className="text-secondary text-xs font-bold uppercase tracking-widest">
                      Member Portal
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-white tracking-tight mb-3">
                    Welcome back, {user?.firstName} {user?.lastName}
                  </h2>
                  <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-6">
                    Stay equipped and spiritually nourished. Access recent sermons, track prayer requests,
                    and reserve your attendance for upcoming church fellowships.
                  </p>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => setPrayerModalOpen(true)}
                      className="inline-flex items-center gap-2 bg-secondary text-slate-950 font-bold text-xs sm:text-sm px-5 py-3 rounded-xl hover:bg-secondary-light transition-all shadow-lg shadow-secondary/30 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      Submit Prayer Request
                    </button>
                    <button
                      onClick={() => setActiveTab('events')}
                      className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs sm:text-sm px-5 py-3 rounded-xl transition-all cursor-pointer"
                    >
                      <CalendarDays className="w-4 h-4 text-secondary" />
                      Browse Events
                    </button>
                  </div>
                </div>
              </div>

              {/* Stat Summary Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {[
                  {
                    label: 'Registered Events',
                    value: registeredEvents.length,
                    subtext: 'Upcoming fellowships',
                    icon: CalendarDays,
                    iconBg: 'bg-primary/10 text-primary',
                    borderGlow: 'hover:border-primary/40',
                    onClick: () => setActiveTab('events'),
                  },
                  {
                    label: 'Prayer Requests',
                    value: myPrayers.length,
                    subtext: 'Submitted by you',
                    icon: HeartHandshake,
                    iconBg: 'bg-secondary/20 text-secondary-dark',
                    borderGlow: 'hover:border-secondary/40',
                    onClick: () => setActiveTab('prayer'),
                  },
                  {
                    label: 'Answered Prayers',
                    value: answeredPrayersCount,
                    subtext: 'Praise reports',
                    icon: CheckCircle2,
                    iconBg: 'bg-emerald-50 text-emerald-600',
                    borderGlow: 'hover:border-emerald-300',
                    onClick: () => setActiveTab('prayer'),
                  },
                  {
                    label: 'Sermons in Archive',
                    value: sermons.length,
                    subtext: 'Messages available',
                    icon: BookOpen,
                    iconBg: 'bg-indigo-50 text-indigo-600',
                    borderGlow: 'hover:border-indigo-300',
                    onClick: () => setActiveTab('sermons'),
                  },
                ].map(({ label, value, subtext, icon: Icon, iconBg, borderGlow, onClick }) => (
                  <div
                    key={label}
                    onClick={onClick}
                    className={`bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer ${borderGlow}`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${iconBg}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 leading-none mb-1">
                      {value}
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-slate-700">{label}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{subtext}</p>
                  </div>
                ))}
              </div>

              {/* Main Dual Grid: Registered Events & Latest Sermon */}
              <div className="grid lg:grid-cols-12 gap-8">
                {/* Left 7 Columns: Registered Events & Recent Prayers */}
                <div className="lg:col-span-7 space-y-8">
                  {/* Registered Events Card */}
                  <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm">
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                          <CalendarDays className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900">
                            Your Event Registrations
                          </h3>
                          <p className="text-xs text-slate-400">Events you are attending</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveTab('events')}
                        className="text-xs font-bold text-primary hover:text-primary-dark inline-flex items-center gap-1 cursor-pointer"
                      >
                        View All
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {registeredEvents.length === 0 ? (
                      <div className="text-center py-8 px-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <CalendarDays className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                        <p className="font-heading font-bold text-slate-700 text-sm mb-1">
                          No Active Event Registrations
                        </p>
                        <p className="text-slate-400 text-xs max-w-xs mx-auto mb-4">
                          Browse upcoming fellowships and reserve your attendance with one click.
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setActiveTab('events')}
                          leftIcon={<CalendarDays className="w-4 h-4" />}
                        >
                          Explore Upcoming Events
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {registeredEvents.slice(0, 3).map((event) => (
                          <div
                            key={event._id}
                            className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/70 border border-slate-100 transition-colors"
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              <div className="w-12 h-12 rounded-xl bg-primary text-white flex flex-col items-center justify-center flex-shrink-0 font-heading">
                                <span className="text-xs font-bold leading-none">
                                  {event.date ? new Date(event.date).getDate() : '--'}
                                </span>
                                <span className="text-[10px] text-blue-200 uppercase font-semibold">
                                  {event.date
                                    ? new Date(event.date).toLocaleDateString('en-US', { month: 'short' })
                                    : ''}
                                </span>
                              </div>
                              <div className="min-w-0">
                                <h4 className="font-heading font-bold text-slate-900 text-sm truncate">
                                  {event.title}
                                </h4>
                                <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3 text-primary" />
                                    {event.location}
                                  </span>
                                  {event.date && (
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3 text-secondary-dark" />
                                      {new Date(event.date).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      })}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {isEventRegistrationClosed(event.date) ? (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 bg-slate-200/70 border border-slate-200 px-3 py-1.5 rounded-xl flex-shrink-0">
                                Closed (Past)
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex-shrink-0">
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                Registered
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Prayer Requests Status Tracker */}
                  <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm">
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-secondary/20 text-secondary-dark flex items-center justify-center">
                          <HeartHandshake className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900">
                            Your Prayer Requests
                          </h3>
                          <p className="text-xs text-slate-400">Intercessory status updates</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveTab('prayer')}
                        className="text-xs font-bold text-secondary-dark hover:text-secondary inline-flex items-center gap-1 cursor-pointer"
                      >
                        View All
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {myPrayers.length === 0 ? (
                      <div className="text-center py-8 px-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <HeartHandshake className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                        <p className="font-heading font-bold text-slate-700 text-sm mb-1">
                          No Prayer Requests Submitted
                        </p>
                        <p className="text-slate-400 text-xs max-w-xs mx-auto mb-4">
                          Need prayer? Share what is on your heart and our pastoral intercessory team will stand with you.
                        </p>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setPrayerModalOpen(true)}
                          leftIcon={<Plus className="w-4 h-4" />}
                        >
                          Submit a Prayer Request
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {myPrayers.slice(0, 3).map((p) => {
                          const statusConfig = {
                            Answered: {
                              bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                              icon: CheckCircle2,
                            },
                            Praying: {
                              bg: 'bg-blue-50 text-blue-700 border-blue-200',
                              icon: HeartHandshake,
                            },
                            Pending: {
                              bg: 'bg-amber-50 text-amber-700 border-amber-200',
                              icon: Clock,
                            },
                          }[p.status || 'Pending'] || {
                            bg: 'bg-slate-100 text-slate-700 border-slate-200',
                            icon: Clock,
                          };
                          const StatusIcon = statusConfig.icon;

                          return (
                            <div
                              key={p._id}
                              className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/70 border border-slate-100 transition-colors"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span
                                  className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-xl border ${statusConfig.bg}`}
                                >
                                  <StatusIcon className="w-3.5 h-3.5" />
                                  {p.status}
                                </span>
                                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(p.createdAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                  })}
                                </span>
                              </div>
                              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed line-clamp-2">
                                {p.request}
                              </p>
                              {p.request.length > 80 && (
                                <button
                                  type="button"
                                  onClick={() => setSelectedPrayerDetail(p)}
                                  className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:text-primary-dark transition-colors cursor-pointer group"
                                >
                                  <span>Read full request</span>
                                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform text-secondary-dark" />
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right 5 Columns: Latest Sermon & Profile Snippet */}
                <div className="lg:col-span-5 space-y-8">
                  {/* Latest Sermon Highlight Card */}
                  {latestSermon && (
                    <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm flex flex-col">
                      <div className="relative bg-slate-950 h-44 flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary to-slate-950 opacity-90" />
                        <div className="relative z-10 text-center px-4">
                          <div className="w-12 h-12 rounded-full bg-secondary text-slate-950 flex items-center justify-center mx-auto mb-2.5 shadow-lg shadow-secondary/40">
                            <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
                          </div>
                          <span className="text-secondary text-[11px] font-bold uppercase tracking-widest block">
                            Latest Message
                          </span>
                        </div>
                      </div>

                      <div className="p-6 flex flex-col flex-1">
                        <h4 className="font-heading font-extrabold text-slate-900 text-lg mb-2 line-clamp-1">
                          {latestSermon.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                          <Mic className="w-3.5 h-3.5 text-primary" />
                          <span className="font-semibold text-slate-700">{latestSermon.speaker}</span>
                          <span>•</span>
                          <span>
                            {latestSermon.datePreached
                              ? new Date(latestSermon.datePreached).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                })
                              : 'Recent'}
                          </span>
                        </div>
                        {latestSermon.notes && (
                          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4">
                            {latestSermon.notes}
                          </p>
                        )}
                        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
                          <button
                            onClick={() => setActiveTab('sermons')}
                            className="text-xs font-bold text-primary hover:text-primary-dark inline-flex items-center gap-1 cursor-pointer"
                          >
                            Listen in Portal
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                          {latestSermon.videoUrl && (
                            <a
                              href={latestSermon.videoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-bold text-secondary-dark hover:text-secondary inline-flex items-center gap-1"
                            >
                              External Link
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Member Profile Summary */}
                  <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm">
                    <div className="flex items-center gap-3.5 mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-light text-white font-bold flex items-center justify-center text-base shadow-md shadow-primary/20">
                        {user?.firstName?.[0]}
                        {user?.lastName?.[0]}
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-slate-900 text-base">
                          {user?.firstName} {user?.lastName}
                        </h4>
                        <div className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Church Member</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 py-3 border-y border-slate-100 text-xs text-slate-600">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-slate-400">
                          <Mail className="w-3.5 h-3.5 text-primary" />
                          Email
                        </span>
                        <span className="font-semibold text-slate-800 truncate max-w-[180px]">
                          {user?.email}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-slate-400">
                          <Phone className="w-3.5 h-3.5 text-primary" />
                          Phone
                        </span>
                        <span className="font-semibold text-slate-800">
                          {user?.phone || 'Not provided'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-slate-400">
                          <Calendar className="w-3.5 h-3.5 text-secondary-dark" />
                          Member Since
                        </span>
                        <span className="font-semibold text-slate-800">
                          {user?.createdAt
                            ? new Date(user.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                year: 'numeric',
                              })
                            : '2026'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveTab('profile')}
                      className="w-full mt-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-primary/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5 text-primary" />
                      Manage Profile Information
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              TAB: LIVE SANCTUARY & VIRTUAL CONGREGATION
             ══════════════════════════════════════════════════════════ */}
          {activeTab === 'live' && (
            <div className="space-y-6 animate-fade-in">
              {/* Restricted Event Gate (When user is not registered for this event) */}
              {isBroadcastLive && broadcastRestriction?.isRestricted ? (
                <div className="bg-white rounded-3xl p-6 sm:p-12 border border-slate-200/80 shadow-xl text-center max-w-2xl mx-auto space-y-6 my-4">
                  <div className="w-20 h-20 rounded-3xl bg-amber-50 text-amber-600 border border-amber-200/80 flex items-center justify-center mx-auto shadow-md">
                    <Lock className="w-10 h-10 text-amber-600" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold uppercase tracking-wider mb-3">
                      <span>Restricted Fellowship Broadcast</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 mb-2">
                      Registered Attendees Only
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed max-w-lg mx-auto">
                      This live service is reserved for church members registered for{' '}
                      <strong className="text-slate-900">{broadcastRestriction.event?.title || 'this fellowship program'}</strong>.
                    </p>
                  </div>

                  {broadcastRestriction.event && (
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2.5 max-w-md mx-auto">
                      <div className="flex items-center justify-between font-bold text-slate-800">
                        <span className="text-sm text-primary">{broadcastRestriction.event.title}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Calendar className="w-4 h-4 text-secondary-dark flex-shrink-0" />
                        <span>
                          {new Date(broadcastRestriction.event.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      {broadcastRestriction.event.location && (
                        <div className="flex items-center gap-2 text-slate-600">
                          <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                          <span>{broadcastRestriction.event.location}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action / Unlock Button */}
                  <div>
                    {broadcastRestriction.event?.isRegistrationClosed ? (
                      <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold max-w-md mx-auto space-y-1">
                        <p className="font-bold">Registration Portal Closed</p>
                        <p className="text-[11px] text-red-600">
                          The due date for registration has passed. If you should have access to this event, please contact the church office or media team.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Button
                          variant="primary"
                          size="lg"
                          onClick={async () => {
                            if (broadcastRestriction.event?._id) {
                              await handleEventRegister(broadcastRestriction.event._id);
                            }
                          }}
                          isLoading={registeringEventId === broadcastRestriction.event?._id}
                          leftIcon={<CheckCircle2 className="w-5 h-5 text-secondary" />}
                          className="shadow-xl shadow-primary/25 cursor-pointer"
                        >
                          Register Now to Unlock Live Stream
                        </Button>
                        <p className="text-[11px] text-slate-400">
                          Registration is instant. Once registered, your broadcast stream and video wall tile will unlock immediately.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {/* Verified Attendee Exclusive Ribbon */}
                  {isBroadcastLive && broadcast?.accessLevel === 'registered_only' && (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        Verified Attendee Access • You are registered for this exclusive program
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full font-extrabold w-fit">
                        {broadcastRestriction?.event?.title || 'Exclusive Session'}
                      </span>
                    </div>
                  )}

                  {/* Pastor Dialogue Live Alert (When Pastor talks to member) */}
                  {isDialogueActive && (
                    <div className="p-6 rounded-3xl bg-amber-400 text-slate-950 font-heading shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-2 border-amber-300 animate-slide-up">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-950 text-amber-400 flex items-center justify-center flex-shrink-0 text-xl font-extrabold animate-bounce">
                          🎤
                        </div>
                        <div>
                          <h3 className="text-xl font-extrabold leading-tight">
                            Pastor Is Speaking With You Live!
                          </h3>
                          <p className="text-xs sm:text-sm font-semibold text-slate-900 mt-0.5">
                            Your video is spotlighted on the church screen and your microphone is live. Speak clearly into your device.
                          </p>
                        </div>
                      </div>
                      <span className="px-4 py-2 rounded-xl bg-slate-950 text-white text-xs font-extrabold flex items-center gap-1.5 w-fit">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        Microphone Live
                      </span>
                    </div>
                  )}

              {/* Main Live Player + Information Grid */}
              <div className="grid lg:grid-cols-12 gap-6">
                {/* Left 8 Columns: Live Video Stream Player */}
                <div className="lg:col-span-8 space-y-5">
                  <div className="bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
                    {/* Aspect Ratio 16:9 Video Container */}
                    <div className="aspect-video w-full relative bg-slate-900">
                      {embedData.isEmbeddable ? (
                        <iframe
                          src={embedData.embedUrl}
                          title="LRT Live Broadcast"
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-white">
                          <Radio className="w-12 h-12 text-secondary mb-3 animate-pulse" />
                          <h3 className="text-xl font-heading font-bold mb-1">
                            {isBroadcastLive ? 'Connecting to Stream...' : 'Broadcast Standby'}
                          </h3>
                          <p className="text-xs text-slate-400 max-w-sm">
                            {isBroadcastLive
                              ? 'The stream is loading. If it does not begin automatically, please refresh.'
                              : 'No service is currently on air. Join us during our Sunday services and midweek fellowships.'}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Player Bottom Bar */}
                    <div className="p-5 bg-slate-900/90 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${
                              isBroadcastLive ? 'bg-red-500 animate-pulse' : 'bg-slate-500'
                            }`}
                          />
                          <span className="text-xs font-bold uppercase tracking-wider text-secondary">
                            {isBroadcastLive ? 'Live On Air' : 'Standby'}
                          </span>
                        </div>
                        <h2 className="text-lg font-heading font-extrabold text-white">
                          {broadcast?.title || 'Sunday Worship Service'}
                        </h2>
                        <p className="text-xs text-slate-400">
                          Ministration by {broadcast?.preacher || 'Pastor Joel'}
                        </p>
                      </div>

                      {/* Viewers presence count */}
                      <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 text-white text-xs font-bold border border-white/10 w-fit">
                        <Users className="w-4 h-4 text-secondary" />
                        <span>{broadcastParticipants.length} Worshipping Online</span>
                      </div>
                    </div>
                  </div>

                  {/* Live Floating Reaction Buttons */}
                  <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between gap-2 overflow-x-auto">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-2 hidden sm:inline">
                      Live Reactions:
                    </span>
                    <div className="flex items-center gap-2 flex-1 justify-around sm:justify-end">
                      {[
                        { type: 'amen', label: 'Amen', icon: '🙏' },
                        { type: 'hallelujah', label: 'Hallelujah', icon: '🙌' },
                        { type: 'praise', label: 'Praise', icon: '🔥' },
                        { type: 'clap', label: 'Clap', icon: '👏' },
                        { type: 'love', label: 'Love', icon: '❤️' },
                      ].map(({ type, label, icon }) => (
                        <button
                          key={type}
                          onClick={() => handleSendReaction(type)}
                          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all transform active:scale-90 cursor-pointer ${
                            recentReactionSent === type
                              ? 'bg-secondary text-slate-950 scale-110 shadow-lg shadow-secondary/30'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          <span className="text-base">{icon}</span>
                          <span className="hidden md:inline">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right 4 Columns: Virtual Congregation Webcam Panel */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-5">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <Video className="w-5 h-5 text-secondary-dark" />
                        <h3 className="font-heading font-extrabold text-slate-900 text-base">
                          Virtual Sanctuary Wall
                        </h3>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Church LED Feed
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed">
                      Appear on the church projector and LED screen inside the physical sanctuary during worship and prayer!
                    </p>

                    {/* Camera Preview / Video Tile */}
                    <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-950 border border-slate-200 flex items-center justify-center">
                      <video
                        ref={videoPreviewRef}
                        autoPlay
                        playsInline
                        muted
                        className={`w-full h-full object-cover transform -scale-x-100 ${
                          cameraActive ? 'block' : 'hidden'
                        }`}
                      />
                      {!cameraActive && (
                        <div className="flex flex-col items-center justify-center text-center p-4">
                          <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center mb-2">
                            <VideoOff className="w-6 h-6 text-slate-400" />
                          </div>
                          <p className="text-xs text-slate-300 font-semibold">Camera is Turned Off</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            Click below to appear on the church video wall
                          </p>
                        </div>
                      )}

                      {/* Overlay Name Tag */}
                      {cameraActive && (
                        <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-[11px] font-bold text-white border border-white/10 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span>{user ? `${user.firstName} ${user.lastName}` : 'You'} • {userLocation}</span>
                        </div>
                      )}
                    </div>

                    {/* Location Input (if not active) */}
                    {!cameraActive && (
                      <div>
                        <label className="text-xs font-semibold text-slate-700 mb-1.5 block">
                          Your City & Country
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Buea, Cameroon"
                          value={locationInput}
                          onChange={(e) => setLocationInput(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                        />
                      </div>
                    )}

                    {/* Camera Toggle Button */}
                    <div>
                      {cameraActive ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={stopCamera}
                          leftIcon={<VideoOff className="w-4 h-4 text-red-500" />}
                          className="w-full text-red-600 border-red-200 hover:bg-red-50"
                        >
                          Leave Sanctuary Wall
                        </Button>
                      ) : (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={startCamera}
                          leftIcon={<Video className="w-4 h-4 text-slate-950" />}
                          className="w-full"
                        >
                          Join with Camera
                        </Button>
                      )}
                    </div>

                    {/* Info note */}
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] text-slate-500 leading-relaxed space-y-1">
                      <p className="font-bold text-slate-700 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Sanctuary Audio Safety
                      </p>
                      <p>
                        Your microphone is muted by default to prevent auditorium echo. The media team or pastor will enable your mic when speaking with you.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

          {/* ══════════════════════════════════════════════════════════
              TAB 2: SERMONS IN-DASHBOARD
             ══════════════════════════════════════════════════════════ */}
          {activeTab === 'sermons' && (
            <div className="space-y-6 animate-fade-in">
              {/* Header with Search */}
              <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/80 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900">
                      Sermon Archive
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Explore anointed teachings and messages from Latter Rain Tabernacle.
                    </p>
                  </div>

                  <div className="relative w-full md:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search title, speaker, notes..."
                      value={sermonSearch}
                      onChange={(e) => setSermonSearch(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Sermons Grid */}
              {filteredSermons.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-8">
                  <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="font-heading font-bold text-slate-700 text-lg mb-1">
                    No Sermons Found
                  </h3>
                  <p className="text-slate-400 text-sm">
                    {sermonSearch ? 'Try a different search query' : 'Messages will appear here as they are published.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {filteredSermons.map((sermon) => (
                    <div
                      key={sermon._id}
                      className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
                    >
                      <div className="relative bg-slate-950 h-44 flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary to-slate-950 opacity-90 group-hover:scale-105 transition-transform duration-700" />
                        {sermon.videoUrl ? (
                          <a
                            href={sermon.videoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="relative z-10 w-14 h-14 rounded-full bg-secondary text-slate-950 flex items-center justify-center shadow-lg shadow-secondary/40 group-hover:scale-110 transition-transform"
                          >
                            <Play className="w-6 h-6 ml-1" fill="currentColor" />
                          </a>
                        ) : (
                          <div className="relative z-10 w-14 h-14 rounded-full bg-white/15 border border-white/20 flex items-center justify-center text-white/60">
                            <Play className="w-6 h-6 ml-1" />
                          </div>
                        )}
                      </div>

                      <div className="p-6 flex flex-col flex-1">
                        <h3 className="font-heading font-bold text-slate-900 text-base mb-2 group-hover:text-primary transition-colors line-clamp-1">
                          {sermon.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                          <Mic className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                          <span className="font-semibold text-slate-700 truncate">{sermon.speaker}</span>
                        </div>
                        {sermon.notes && (
                          <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-2">
                            {sermon.notes}
                          </p>
                        )}
                        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-secondary-dark" />
                            {sermon.datePreached
                              ? new Date(sermon.datePreached).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })
                              : 'Date not set'}
                          </span>
                          {sermon.videoUrl && (
                            <a
                              href={sermon.videoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-primary font-bold hover:text-primary-dark inline-flex items-center gap-1"
                            >
                              Watch
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              TAB 3: EVENTS IN-DASHBOARD
             ══════════════════════════════════════════════════════════ */}
          {activeTab === 'events' && (
            <div className="space-y-6 animate-fade-in">
              {/* Header with Filter Pills */}
              <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900">
                    Church Events & Fellowships
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Manage your event registrations and save your spot for upcoming services.
                  </p>
                </div>

                <div className="inline-flex p-1 bg-slate-100 rounded-2xl gap-1 w-full sm:w-auto">
                  <button
                    onClick={() => setEventFilter('all')}
                    className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      eventFilter === 'all'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    All Events ({events.length})
                  </button>
                  <button
                    onClick={() => setEventFilter('registered')}
                    className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      eventFilter === 'registered'
                        ? 'bg-secondary text-slate-950 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    My Registered ({registeredEvents.length})
                  </button>
                </div>
              </div>

              {/* Events List */}
              {displayedEvents.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-8">
                  <CalendarDays className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="font-heading font-bold text-slate-700 text-lg mb-1">
                    {eventFilter === 'registered'
                      ? 'No Event Registrations Yet'
                      : 'No Upcoming Events'}
                  </h3>
                  <p className="text-slate-400 text-sm max-w-sm mx-auto mb-4">
                    {eventFilter === 'registered'
                      ? 'You have not registered for any events yet. Click below to view all upcoming church events.'
                      : 'Check back soon for new announcements and schedules.'}
                  </p>
                  {eventFilter === 'registered' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setEventFilter('all')}
                    >
                      Browse All Events
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {displayedEvents.map((event) => {
                    const isRegistered = event.registeredAttendees?.includes(user?._id || '');
                    const atCapacity =
                      !!event.maxCapacity && (event.registeredAttendees?.length || 0) >= event.maxCapacity;
                    const isClosed = isEventRegistrationClosed(event.date);

                    return (
                      <div
                        key={event._id}
                        className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                      >
                        {event.flierUrl ? (
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={getMediaUrl(event.flierUrl)}
                              alt={event.title}
                              className="w-full h-full object-cover"
                            />
                            {event.date && (
                              <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-white rounded-xl px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 border border-white/10">
                                <CalendarDays className="w-3.5 h-3.5 text-secondary" />
                                {new Date(event.date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </div>
                            )}
                            {isClosed && (
                              <div className="absolute top-3 right-3 bg-red-950/85 backdrop-blur-md text-red-200 border border-red-500/40 rounded-xl px-2.5 py-1 text-[11px] font-bold flex items-center gap-1 shadow-lg">
                                <Lock className="w-3 h-3 text-red-400" />
                                Closed
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="bg-gradient-to-r from-primary-dark via-primary to-slate-950 p-6 flex items-center justify-between text-white">
                            <div>
                              <span className="text-[11px] font-bold text-secondary uppercase tracking-widest block">
                                LRT Fellowship
                              </span>
                              <h3 className="text-xl font-heading font-extrabold">{event.title}</h3>
                            </div>
                            <div className="flex items-center gap-2">
                              {isClosed && (
                                <span className="bg-red-500/20 border border-red-400/40 text-red-200 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                                  <Lock className="w-3 h-3 text-red-300" />
                                  Closed
                                </span>
                              )}
                              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex flex-col items-center justify-center font-heading">
                                <span className="text-sm font-bold leading-none">
                                  {event.date ? new Date(event.date).getDate() : '--'}
                                </span>
                                <span className="text-[10px] text-blue-200 uppercase font-semibold">
                                  {event.date
                                    ? new Date(event.date).toLocaleDateString('en-US', { month: 'short' })
                                    : ''}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="p-6 flex flex-col flex-1">
                          {event.flierUrl && (
                            <h3 className="font-heading font-bold text-slate-900 text-lg mb-2">
                              {event.title}
                            </h3>
                          )}

                          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-5 line-clamp-3">
                            {event.description}
                          </p>

                          <div className="space-y-2 text-xs text-slate-600 mb-6 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                            {event.date && (
                              <div className="flex items-center gap-2">
                                <Clock className="w-3.5 h-3.5 text-primary" />
                                <span>
                                  {new Date(event.date).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    month: 'long',
                                    day: 'numeric',
                                  })}{' '}
                                  at{' '}
                                  {new Date(event.date).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3.5 h-3.5 text-secondary-dark" />
                              <span>{event.location}</span>
                            </div>
                          </div>

                          <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-xs text-slate-400">
                              {event.maxCapacity
                                ? `${event.registeredAttendees?.length || 0} / ${event.maxCapacity} spots registered`
                                : `${event.registeredAttendees?.length || 0} registered`}
                            </span>

                            {isRegistered ? (
                              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <Check className="w-4 h-4 text-emerald-600" />
                                {isClosed ? 'Registered (Closed)' : 'Registered'}
                              </span>
                            ) : isClosed ? (
                              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200">
                                <Lock className="w-3.5 h-3.5 text-slate-400" />
                                Registration Closed
                              </span>
                            ) : (
                              <Button
                                variant={atCapacity ? 'ghost' : 'secondary'}
                                size="sm"
                                onClick={() => handleEventRegister(event._id)}
                                isLoading={registeringEventId === event._id}
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
          )}

          {/* ══════════════════════════════════════════════════════════
              TAB 4: PRAYER REQUESTS IN-DASHBOARD
             ══════════════════════════════════════════════════════════ */}
          {activeTab === 'prayer' && (
            <div className="space-y-6 animate-fade-in">
              {/* Header with Submit CTA */}
              <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900">
                    Prayer Requests & Intercession
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Track the prayers you have submitted and join the church in agreeing for others.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="inline-flex p-1 bg-slate-100 rounded-2xl gap-1 w-full sm:w-auto">
                    <button
                      onClick={() => setPrayerWallTab('my')}
                      className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        prayerWallTab === 'my'
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      My Requests ({myPrayers.length})
                    </button>
                    <button
                      onClick={() => setPrayerWallTab('community')}
                      className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        prayerWallTab === 'community'
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Community Wall ({publicPrayers.length})
                    </button>
                  </div>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setPrayerModalOpen(true)}
                    leftIcon={<Plus className="w-4 h-4" />}
                    className="w-full sm:w-auto"
                  >
                    New Request
                  </Button>
                </div>
              </div>

              {/* Prayer Requests Content */}
              {prayerWallTab === 'my' ? (
                myPrayers.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-8">
                    <HeartHandshake className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="font-heading font-bold text-slate-700 text-lg mb-1">
                      No Personal Prayer Requests Yet
                    </h3>
                    <p className="text-slate-400 text-sm max-w-md mx-auto mb-5">
                      You haven't submitted any prayer requests. The pastoral intercessory team is always ready to agree with you in faith.
                    </p>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setPrayerModalOpen(true)}
                      leftIcon={<Plus className="w-4 h-4" />}
                    >
                      Submit a Prayer Request
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                    {myPrayers.map((prayer) => {
                      const statusStyles = {
                        Answered: {
                          badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                          border: 'border-l-4 border-l-emerald-500',
                          icon: CheckCircle2,
                        },
                        Praying: {
                          badge: 'bg-blue-50 text-blue-700 border-blue-200',
                          border: 'border-l-4 border-l-primary',
                          icon: HeartHandshake,
                        },
                        Pending: {
                          badge: 'bg-amber-50 text-amber-700 border-amber-200',
                          border: 'border-l-4 border-l-secondary',
                          icon: Clock,
                        },
                      }[prayer.status || 'Pending'] || {
                        badge: 'bg-slate-100 text-slate-700 border-slate-200',
                        border: 'border-l-4 border-l-slate-400',
                        icon: Clock,
                      };
                      const StatusIcon = statusStyles.icon;
                      const isLong = prayer.request.length > 110;
                      const previewText = isLong
                        ? `${prayer.request.slice(0, 110).trimEnd()}…`
                        : prayer.request;

                      return (
                        <div
                          key={prayer._id}
                          className={`bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between ${statusStyles.border}`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-3 gap-2">
                              <span
                                className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-xl border ${statusStyles.badge}`}
                              >
                                <StatusIcon className="w-3.5 h-3.5" />
                                {prayer.status}
                              </span>
                              <div className="flex items-center gap-2 text-xs text-slate-400">
                                {prayer.isPrivate && (
                                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                                    <Lock className="w-3 h-3 text-slate-400" />
                                    Private
                                  </span>
                                )}
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(prayer.createdAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })}
                                </span>
                              </div>
                            </div>
                            <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-wrap">
                              {previewText}
                            </p>
                          </div>
                          <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between">
                            {isLong ? (
                              <button
                                type="button"
                                onClick={() => setSelectedPrayerDetail(prayer)}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-dark transition-colors cursor-pointer group"
                              >
                                <span>Read full request</span>
                                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-secondary-dark" />
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setSelectedPrayerDetail(prayer)}
                                className="text-[11px] font-semibold text-slate-500 hover:text-primary transition-colors cursor-pointer"
                              >
                                View Details
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )
              ) : (
                /* Community Wall Tab */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  {publicPrayers.length === 0 ? (
                    <div className="col-span-full text-center py-16 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-8">
                      <HeartHandshake className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <h3 className="font-heading font-bold text-slate-700 text-lg mb-1">
                        Community Prayer Wall Empty
                      </h3>
                      <p className="text-slate-400 text-sm">
                        Public prayer requests shared by church members will appear here.
                      </p>
                    </div>
                  ) : (
                    publicPrayers.map((prayer) => {
                      const u: any = prayer.user;
                      const authorName =
                        u && typeof u === 'object' && (u.firstName || u.lastName)
                          ? `${u.firstName || ''} ${u.lastName || ''}`.trim()
                          : 'Church Member';
                      const authorInitial =
                        u && typeof u === 'object' && u.firstName
                          ? u.firstName[0].toUpperCase()
                          : 'M';
                      const isLong = prayer.request.length > 110;
                      const previewText = isLong
                        ? `${prayer.request.slice(0, 110).trimEnd()}…`
                        : prayer.request;

                      return (
                        <div
                          key={prayer._id}
                          className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-3 gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary font-bold flex items-center justify-center text-xs flex-shrink-0">
                                  {authorInitial}
                                </div>
                                <span className="text-xs font-bold text-slate-800 truncate">
                                  {authorName}
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-400 flex-shrink-0">
                                {new Date(prayer.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </span>
                            </div>
                            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                              {previewText}
                            </p>
                          </div>
                          <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between">
                            {isLong ? (
                              <button
                                type="button"
                                onClick={() => setSelectedPrayerDetail(prayer)}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-dark transition-colors cursor-pointer group"
                              >
                                <span>Read full request</span>
                                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-secondary-dark" />
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setSelectedPrayerDetail(prayer)}
                                className="text-[11px] font-semibold text-slate-500 hover:text-primary transition-colors cursor-pointer"
                              >
                                View Details
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              TAB 5: MY PROFILE IN-DASHBOARD
             ══════════════════════════════════════════════════════════ */}
          {activeTab === 'profile' && (
            <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
              <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/80 shadow-sm">
                <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
                  <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-primary via-primary to-primary-light text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900">
                      {user?.firstName} {user?.lastName}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex items-center gap-1 text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-xl">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Church Member
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        Latter Rain Tabernacle
                      </span>
                    </div>
                  </div>
                </div>

                {profileSuccessMsg && (
                  <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs sm:text-sm flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span>{profileSuccessMsg}</span>
                  </div>
                )}

                {profileErrorMsg && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs sm:text-sm flex items-center gap-2.5">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <span>{profileErrorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleUpdateProfile} className="mt-6 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      id="prof-firstName"
                      label="First Name"
                      value={profileForm.firstName}
                      onChange={(e) =>
                        setProfileForm((p) => ({ ...p, firstName: e.target.value }))
                      }
                      required
                    />
                    <Input
                      id="prof-lastName"
                      label="Last Name"
                      value={profileForm.lastName}
                      onChange={(e) =>
                        setProfileForm((p) => ({ ...p, lastName: e.target.value }))
                      }
                      required
                    />
                  </div>

                  <Input
                    id="prof-email"
                    label="Email Address"
                    value={user?.email || ''}
                    disabled
                    leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                    className="bg-slate-100 text-slate-500 cursor-not-allowed"
                  />
                  <p className="text-[11px] text-slate-400 -mt-2">
                    Email address is tied to your login credentials and cannot be modified here.
                  </p>

                  <Input
                    id="prof-phone"
                    label="Phone Number"
                    placeholder="e.g. +237 677 000 000"
                    value={profileForm.phoneNumber}
                    onChange={(e) =>
                      setProfileForm((p) => ({ ...p, phoneNumber: e.target.value }))
                    }
                    leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
                  />

                  <div className="pt-4 flex justify-end">
                    <Button
                      type="submit"
                      variant="primary"
                      isLoading={isUpdatingProfile}
                      leftIcon={<Check className="w-4 h-4" />}
                    >
                      Save Profile Changes
                    </Button>
                  </div>
                </form>
              </div>

              {/* Security info card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-secondary/15 text-secondary-dark flex items-center justify-center flex-shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-slate-900 text-sm mb-0.5">
                    Account Protection
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Your session is securely authenticated with encrypted JWT tokens. Remember to sign out when accessing your account from a public device.
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── Submit Prayer Request Modal ── */}
      {prayerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs"
            onClick={() => setPrayerModalOpen(false)}
          />

          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 sm:p-8 overflow-hidden animate-slide-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-secondary/20 text-secondary-dark flex items-center justify-center">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-slate-900 text-lg">
                    New Prayer Request
                  </h3>
                  <p className="text-xs text-slate-400">Our intercessors will agree with you</p>
                </div>
              </div>
              <button
                onClick={() => setPrayerModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {prayerSuccessMsg && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs sm:text-sm mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>{prayerSuccessMsg}</span>
              </div>
            )}

            {prayerErrorMsg && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs sm:text-sm mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <span>{prayerErrorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmitPrayer} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                  Your Prayer Need <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Share what's on your heart. The intercessory team will lift this up in prayer..."
                  value={prayerForm.request}
                  onChange={(e) =>
                    setPrayerForm((prev) => ({ ...prev, request: e.target.value }))
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs sm:text-sm text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  {prayerForm.request.length} characters
                </p>
              </div>

              {/* Private Checkbox */}
              <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={prayerForm.isPrivate}
                  onChange={(e) =>
                    setPrayerForm((prev) => ({ ...prev, isPrivate: e.target.checked }))
                  }
                  className="mt-0.5 rounded border-slate-300 text-primary focus:ring-primary/30"
                />
                <div>
                  <p className="text-xs font-bold text-slate-800">Keep this request private</p>
                  <p className="text-[11px] text-slate-400">
                    Only church pastors and the intercessory team will see this. It will not appear on the community wall.
                  </p>
                </div>
              </label>

              <div className="pt-2 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPrayerModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="secondary"
                  size="sm"
                  isLoading={isSubmittingPrayer}
                  leftIcon={<Send className="w-4 h-4" />}
                >
                  Submit Prayer
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── View Full Prayer Request Detail Modal ── */}
      {selectedPrayerDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <div
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs"
            onClick={() => setSelectedPrayerDetail(null)}
          />

          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-5 sm:p-7 overflow-hidden animate-slide-up flex flex-col max-h-[88vh]">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 mb-4 gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-secondary/20 text-secondary-dark flex items-center justify-center flex-shrink-0">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-heading font-extrabold text-slate-900 text-base sm:text-lg leading-tight truncate">
                    Prayer Request
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-slate-400">
                      {new Date(selectedPrayerDetail.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    {selectedPrayerDetail.isPrivate && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                        <Lock className="w-2.5 h-2.5" /> Private
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedPrayerDetail(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer flex-shrink-0"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Submitter & Status Row */}
            <div className="flex items-center justify-between mb-4 bg-slate-50/80 p-3 rounded-2xl border border-slate-100 gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary font-bold flex items-center justify-center text-xs flex-shrink-0">
                  {(() => {
                    const u: any = selectedPrayerDetail.user;
                    if (u && typeof u === 'object' && u.firstName) return u.firstName[0].toUpperCase();
                    return 'M';
                  })()}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">
                    {(() => {
                      const u: any = selectedPrayerDetail.user;
                      if (!u) return 'Anonymous';
                      if (typeof u === 'object' && (u.firstName || u.lastName)) {
                        return `${u.firstName || ''} ${u.lastName || ''}`.trim();
                      }
                      return 'Church Member';
                    })()}
                  </p>
                  <p className="text-[10px] text-slate-400">Prayer Requester</p>
                </div>
              </div>

              <span
                className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-xl border flex-shrink-0 ${
                  selectedPrayerDetail.status === 'Answered'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : selectedPrayerDetail.status === 'Praying'
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                {selectedPrayerDetail.status || 'Pending'}
              </span>
            </div>

            {/* Full Request Body */}
            <div className="flex-1 overflow-y-auto mb-4 p-4 rounded-2xl bg-slate-50/60 border border-slate-100">
              <p className="text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                {selectedPrayerDetail.request}
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-3">
              <p className="text-[11px] text-slate-400 italic hidden sm:block truncate">
                "For where two or three are gathered together in my name, there am I in the midst of them."
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setSelectedPrayerDetail(null)}
                className="w-full sm:w-auto"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortalDashboard;
