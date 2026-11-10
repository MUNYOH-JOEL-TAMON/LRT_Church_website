import React, { useState, useEffect, useRef } from 'react';
import {
  Radio,
  Tv,
  Play,
  Square,
  Users,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Star,
  ExternalLink,
  Volume2,
  VolumeX,
  AlertCircle,
  CheckCircle2,
  Lock,
  Globe,
  Calendar,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import broadcastService from '../../services/broadcastService';
import eventService from '../../services/eventService';
import getEmbedStreamUrl from '../../utils/streamUrl';
import type { BroadcastSession, VirtualParticipant, LiveReaction, Event } from '../../types';

const ManageBroadcast: React.FC = () => {
  const [broadcast, setBroadcast] = useState<BroadcastSession | null>(null);
  const [participants, setParticipants] = useState<VirtualParticipant[]>([]);
  const [reactions, setReactions] = useState<LiveReaction[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const isFormInitialized = useRef(false);

  // Form State
  const [formData, setFormData] = useState({
    title: 'Sunday Worship Service',
    preacher: 'Pastor',
    sourceType: 'youtube' as 'youtube' | 'facebook' | 'direct',
    streamUrl: '',
    allowWebcams: true,
    accessLevel: 'all' as 'all' | 'registered_only',
    eventId: '',
  });

  const fetchBroadcastData = async () => {
    try {
      const [res, eventsRes] = await Promise.allSettled([
        broadcastService.getCurrent(),
        eventService.getAll(),
      ]);

      if (eventsRes.status === 'fulfilled' && eventsRes.value.data) {
        setEvents(eventsRes.value.data);
      }

      if (res.status === 'fulfilled' && res.value.data) {
        setBroadcast(res.value.data.broadcast);
        setParticipants(res.value.data.participants || []);
        setReactions(res.value.data.reactions || []);

        // Only initialize form data once on initial load so polling does not overwrite admin inputs
        if (res.value.data.broadcast && !isFormInitialized.current) {
          isFormInitialized.current = true;
          const b = res.value.data.broadcast;
          setFormData({
            title: b.title || 'Sunday Worship Service',
            preacher: b.preacher || 'Pastor',
            sourceType: b.sourceType || 'youtube',
            streamUrl: b.streamUrl || '',
            allowWebcams: b.allowWebcams !== false,
            accessLevel: b.accessLevel || 'all',
            eventId: typeof b.eventId === 'object' && b.eventId ? (b.eventId as any)._id : b.eventId || '',
          });
        }
      }
    } catch {
      setError('Failed to load current broadcast state.');
    }
  };

  useEffect(() => {
    fetchBroadcastData();
    // Poll active participants and reactions every 4 seconds while on the control room
    const interval = setInterval(fetchBroadcastData, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleStartBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.streamUrl.trim()) {
      setError('Please provide a valid YouTube or Facebook streaming link.');
      return;
    }
    if (formData.accessLevel === 'registered_only' && !formData.eventId) {
      setError('Please select an event from the dropdown for the restricted broadcast.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      const res = await broadcastService.startBroadcast({
        ...formData,
        eventId: formData.accessLevel === 'registered_only' ? formData.eventId : null,
        _id: broadcast?._id,
      });
      if (res.data) {
        setBroadcast(res.data);
        setSuccessMsg(
          formData.accessLevel === 'registered_only'
            ? 'Restricted Event Broadcast is LIVE! In-app notifications sent to registered attendees.'
            : 'Broadcast is LIVE! In-app notification sent to all church members.'
        );
        setTimeout(() => setSuccessMsg(''), 5000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to start broadcast');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEndBroadcast = async () => {
    if (!broadcast?._id) return;
    if (!window.confirm('Are you sure you want to end the live broadcast?')) return;
    setIsSubmitting(true);
    try {
      const res = await broadcastService.endBroadcast(broadcast._id);
      if (res.data) {
        setBroadcast(res.data);
        setSuccessMsg('Broadcast ended successfully.');
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to end broadcast');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleMemberAudio = async (participant: VirtualParticipant) => {
    try {
      const newMutedState = !participant.isMutedByAdmin;
      await broadcastService.setMemberAudio(participant.userId, newMutedState);
      setParticipants((prev) =>
        prev.map((p) =>
          p.userId === participant.userId ? { ...p, isMutedByAdmin: newMutedState } : p
        )
      );
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update member audio state');
    }
  };

  const handleToggleSpotlight = async (memberId: string) => {
    if (!broadcast?._id) return;
    try {
      const newTarget = broadcast.spotlightedMemberId === memberId ? null : memberId;
      await broadcastService.spotlightMember(broadcast._id, newTarget);
      setBroadcast((prev) => (prev ? { ...prev, spotlightedMemberId: newTarget } : prev));
      setParticipants((prev) =>
        prev.map((p) => ({
          ...p,
          isSpotlighted: p.userId === newTarget,
          isMutedByAdmin: p.userId === newTarget ? false : p.isMutedByAdmin,
        }))
      );
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to spotlight member');
    }
  };

  const openProjectorScreen = () => {
    window.open('/live/screen', '_blank', 'width=1920,height=1080');
  };

  const embedPreview = getEmbedStreamUrl(formData.streamUrl, formData.sourceType);
  const isLive = broadcast?.status === 'live';

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* ── Top Header Banner ── */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-2xl border border-white/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div
                className={`w-3.5 h-3.5 rounded-full ${
                  isLive ? 'bg-red-500 animate-pulse ring-4 ring-red-500/30' : 'bg-slate-500'
                }`}
              />
              <span
                className={`text-xs font-bold uppercase tracking-widest ${
                  isLive ? 'text-red-400' : 'text-slate-400'
                }`}
              >
                {isLive ? 'Broadcast Live On Air' : 'Broadcasting Offline'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight">
              Media Ministry Broadcast Control
            </h1>
            <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
              Manage YouTube & Facebook live streams, monitor online congregation webcams, and control dialogue with online members during service.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={openProjectorScreen}
              leftIcon={<Tv className="w-4 h-4 text-secondary" />}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Open Sanctuary Projector Wall
            </Button>
            {isLive ? (
              <Button
                variant="danger"
                size="sm"
                onClick={handleEndBroadcast}
                isLoading={isSubmitting}
                leftIcon={<Square className="w-4 h-4" />}
              >
                End Live Service
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleStartBroadcast}
                isLoading={isSubmitting}
                leftIcon={<Play className="w-4 h-4" />}
              >
                Go Live Now
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 text-sm font-semibold animate-slide-up">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          {successMsg}
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl flex items-center gap-3 text-sm font-semibold animate-slide-up">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* ── Main Dual Grid: Setup Form + Live Stream Preview ── */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left 7 Columns: Broadcast Settings Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <Radio className="w-5 h-5 text-primary" />
              <h2 className="font-heading font-extrabold text-slate-900 text-lg">
                Service Configuration
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-400">
              Syncs with YouTube & Facebook
            </span>
          </div>

          <form onSubmit={handleStartBroadcast} className="space-y-5">
            <Input
              id="broadcast-title"
              label="Service / Program Title"
              placeholder="e.g. Sunday Worship & Prophetic Word"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />

            <Input
              id="broadcast-preacher"
              label="Minister / Preacher"
              placeholder="e.g. Pastor Joel"
              required
              value={formData.preacher}
              onChange={(e) => setFormData({ ...formData, preacher: e.target.value })}
            />

            {/* Platform Selector Tabs */}
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">
                Streaming Destination
              </label>
              <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-2xl">
                {(['youtube', 'facebook', 'direct'] as const).map((source) => (
                  <button
                    type="button"
                    key={source}
                    onClick={() => setFormData({ ...formData, sourceType: source })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                      formData.sourceType === source
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {source === 'youtube'
                      ? 'YouTube Live'
                      : source === 'facebook'
                      ? 'Facebook Live'
                      : 'Direct HLS / Stream'}
                  </button>
                ))}
              </div>
            </div>

            <Input
              id="broadcast-url"
              label={
                formData.sourceType === 'youtube'
                  ? 'YouTube Live Video URL or Video ID'
                  : formData.sourceType === 'facebook'
                  ? 'Facebook Live Video URL'
                  : 'HLS (.m3u8) or Custom Video URL'
              }
              placeholder={
                formData.sourceType === 'youtube'
                  ? 'https://www.youtube.com/watch?v=XXXX or video ID'
                  : 'https://www.facebook.com/.../videos/XXXX'
              }
              required
              value={formData.streamUrl}
              onChange={(e) => setFormData({ ...formData, streamUrl: e.target.value })}
            />

            {/* Audience Access Restrictions */}
            <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-800 block mb-1">
                  Audience Access Restriction
                </label>
                <p className="text-xs text-slate-500">
                  Choose whether this live broadcast is open to all church members or restricted to registered attendees of a specific program (e.g. Youths, Couples, Workers).
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, accessLevel: 'all', eventId: '' }))}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                    formData.accessLevel === 'all'
                      ? 'border-primary bg-primary/5 text-primary-dark shadow-xs ring-2 ring-primary/20'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <Globe className={`w-5 h-5 flex-shrink-0 mt-0.5 ${formData.accessLevel === 'all' ? 'text-primary' : 'text-slate-400'}`} />
                  <div>
                    <span className="text-xs font-bold block">All Church Members</span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      Open to all members in the Member Portal
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      accessLevel: 'registered_only',
                      eventId: prev.eventId || events[0]?._id || '',
                    }));
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                    formData.accessLevel === 'registered_only'
                      ? 'border-secondary-dark bg-secondary/10 text-slate-900 shadow-xs ring-2 ring-secondary/40'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <Lock className={`w-5 h-5 flex-shrink-0 mt-0.5 ${formData.accessLevel === 'registered_only' ? 'text-amber-600' : 'text-slate-400'}`} />
                  <div>
                    <span className="text-xs font-bold block">Registered Attendees Only</span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      Restricted to members registered for an event
                    </span>
                  </div>
                </button>
              </div>

              {/* Event Selector when restricted */}
              {formData.accessLevel === 'registered_only' && (
                <div className="pt-3 border-t border-slate-200 space-y-3">
                  <div>
                    <label htmlFor="event-select" className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-secondary-dark" />
                      Select Church Event:
                    </label>
                    {events.length === 0 ? (
                      <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800">
                        No events found in the database. Please create an event first in Event Management.
                      </div>
                    ) : (
                      <select
                        id="event-select"
                        value={formData.eventId}
                        onChange={(e) => setFormData({ ...formData, eventId: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary cursor-pointer"
                        required
                      >
                        <option value="" disabled>-- Select an Event --</option>
                        {events.map((ev) => (
                          <option key={ev._id} value={ev._id}>
                            {ev.title} ({ev.registeredAttendees?.length || 0} Registered Attendees)
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {formData.eventId && (() => {
                    const selectedEv = events.find((e) => e._id === formData.eventId);
                    if (!selectedEv) return null;
                    return (
                      <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                        <div className="flex items-center justify-between font-bold text-slate-800">
                          <span>{selectedEv.title}</span>
                          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            {selectedEv.registeredAttendees?.length || 0} Registered Members
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          📅 {new Date(selectedEv.date).toLocaleDateString()} • 📍 {selectedEv.location}
                        </p>
                        <p className="text-[10px] text-amber-800 font-medium pt-1">
                          🔒 Only these {selectedEv.registeredAttendees?.length || 0} registered members will have access to watch and appear on the video wall. Non-registered members will see a prompt to register.
                        </p>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <input
                type="checkbox"
                id="allow-webcams"
                checked={formData.allowWebcams}
                onChange={(e) => setFormData({ ...formData, allowWebcams: e.target.checked })}
                className="w-4 h-4 rounded text-primary focus:ring-primary/30 cursor-pointer"
              />
              <label htmlFor="allow-webcams" className="text-xs sm:text-sm text-slate-700 font-semibold cursor-pointer">
                Enable Virtual Congregation Video Wall (members can join with camera)
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSubmitting}
                leftIcon={<Play className="w-4 h-4" />}
              >
                {isLive ? 'Update Live Settings' : 'Save & Start Broadcast'}
              </Button>
            </div>
          </form>
        </div>

        {/* Right 5 Columns: Live Stream Player Preview */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col">
            <h3 className="font-heading font-extrabold text-slate-900 text-base mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>Stream Monitor</span>
                {broadcast?.accessLevel === 'registered_only' ? (
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" />
                    Registered Only
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Globe className="w-2.5 h-2.5 text-slate-400" />
                    All Members
                  </span>
                )}
              </div>
              {isLive && (
                <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  Live Preview
                </span>
              )}
            </h3>

            {embedPreview.isEmbeddable ? (
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 shadow-inner border border-slate-200">
                <iframe
                  src={embedPreview.embedUrl}
                  title="Stream Preview"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="aspect-video w-full rounded-2xl bg-slate-900 text-slate-400 flex flex-col items-center justify-center p-6 text-center border border-slate-800">
                <Tv className="w-10 h-10 mb-2 text-slate-600" />
                <p className="text-xs font-semibold">No valid video URL entered yet</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Paste your YouTube or Facebook live link to monitor
                </p>
              </div>
            )}

            {/* Quick stats strip */}
            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100 text-center">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-xs text-slate-400">Online Congregation</p>
                <p className="text-xl font-heading font-extrabold text-slate-900">
                  {participants.length}
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-xs text-slate-400">Live Reactions</p>
                <p className="text-xl font-heading font-extrabold text-secondary-dark">
                  {reactions.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Virtual Congregation Console (Pastor Dialogue & Member Audio) ── */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2.5">
              <Users className="w-5 h-5 text-secondary-dark" />
              <h2 className="font-heading font-extrabold text-slate-900 text-lg">
                Virtual Congregation & Pastor Dialogue Console
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Control which online member speaks live with the pastor and spotlight their video box on the Sanctuary LED screen.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">
              {participants.filter((p) => p.hasCamera).length} cameras active
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={openProjectorScreen}
              leftIcon={<ExternalLink className="w-3.5 h-3.5" />}
            >
              View Screen
            </Button>
          </div>
        </div>

        {/* Participants Table / Card Grid */}
        {participants.length === 0 ? (
          <div className="py-12 text-center bg-slate-50 rounded-2xl border border-slate-100 p-8">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-heading font-bold text-slate-700">
              No online worshippers connected yet
            </p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              When members join the Live Sanctuary from home and turn on their cameras, they will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {participants.map((p) => (
              <div
                key={p.userId}
                className={`p-5 rounded-2xl border transition-all ${
                  p.isSpotlighted
                    ? 'bg-amber-50/60 border-amber-300 shadow-md ring-2 ring-amber-400/50'
                    : 'bg-slate-50 border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-primary text-white font-bold text-sm flex items-center justify-center flex-shrink-0">
                      {p.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{p.name}</p>
                      <p className="text-xs text-slate-400 truncate">{p.location}</p>
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {p.hasCamera ? (
                      <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700" title="Camera is ON">
                        <Video className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="p-1.5 rounded-lg bg-slate-200 text-slate-500" title="Camera is OFF">
                        <VideoOff className="w-3.5 h-3.5" />
                      </span>
                    )}

                    {!p.isMutedByAdmin ? (
                      <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700" title="Audio is LIVE">
                        <Volume2 className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="p-1.5 rounded-lg bg-red-100 text-red-600" title="Audio is MUTED">
                        <VolumeX className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                </div>

                {/* Pastor Dialogue Control Buttons */}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-200/70">
                  {/* Spotlight on Projector Screen */}
                  <button
                    onClick={() => handleToggleSpotlight(p.userId)}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      p.isSpotlighted
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-400/30'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${p.isSpotlighted ? 'fill-slate-950' : ''}`} />
                    {p.isSpotlighted ? 'Spotlighted' : 'Spotlight'}
                  </button>

                  {/* Remote Mute / Unmute Audio */}
                  <button
                    onClick={() => handleToggleMemberAudio(p)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      p.isMutedByAdmin
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
                    }`}
                  >
                    {p.isMutedByAdmin ? (
                      <>
                        <Mic className="w-3.5 h-3.5" />
                        Unmute for Pastor
                      </>
                    ) : (
                      <>
                        <MicOff className="w-3.5 h-3.5" />
                        Mute
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBroadcast;
