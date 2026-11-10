import React, { useState, useEffect, useRef } from 'react';
import {
  Radio,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Users,
  Sparkles,
  Heart,
  MessageCircle,
  HelpCircle,
  CheckCircle2,
  Tv,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import Button from '../components/ui/Button';
import PageBanner from '../components/ui/PageBanner';
import broadcastService from '../services/broadcastService';
import getEmbedStreamUrl from '../utils/streamUrl';
import useAuthStore from '../store/useAuthStore';
import type { BroadcastSession, VirtualParticipant } from '../types';

const LiveBroadcastPage: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [broadcast, setBroadcast] = useState<BroadcastSession | null>(null);
  const [participants, setParticipants] = useState<VirtualParticipant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // User Local Media & Presence State
  const [cameraActive, setCameraActive] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [locationInput, setLocationInput] = useState('');
  const [userLocation, setUserLocation] = useState('Online Worshipper');
  const [myParticipant, setMyParticipant] = useState<VirtualParticipant | null>(null);
  const [recentReactionSent, setRecentReactionSent] = useState('');

  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  // Fetch broadcast data
  const fetchBroadcast = async () => {
    try {
      const res = await broadcastService.getCurrent();
      if (res.data) {
        setBroadcast(res.data.broadcast);
        setParticipants(res.data.participants || []);

        if (user && res.data.participants) {
          const mine = res.data.participants.find((p) => p.userId === user._id);
          if (mine) setMyParticipant(mine);
        }
      }
    } catch {
      // Quiet fail
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBroadcast();
    const interval = setInterval(fetchBroadcast, 4000);
    return () => clearInterval(interval);
  }, [user]);

  // Presence heartbeat when connected
  useEffect(() => {
    if (!isAuthenticated || !cameraActive) return;

    const pingInterval = setInterval(async () => {
      try {
        await broadcastService.pingPresence();
      } catch {
        // Quiet fail
      }
    }, 15000);

    return () => clearInterval(pingInterval);
  }, [isAuthenticated, cameraActive]);

  // Start webcam
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
      setMicActive(true);

      const loc = locationInput.trim() || 'Online Worshipper';
      setUserLocation(loc);

      if (isAuthenticated) {
        const res = await broadcastService.joinPresence({
          location: loc,
          hasCamera: true,
          hasAudio: true,
        });
        if (res.data) setMyParticipant(res.data);
      }
    } catch (err) {
      alert('Could not access camera/microphone. Please ensure permissions are granted in your browser.');
    }
  };

  // Stop webcam
  const stopCamera = async () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }
    if (videoPreviewRef.current) {
      videoPreviewRef.current.srcObject = null;
    }
    setCameraActive(false);
    setMicActive(false);

    if (isAuthenticated) {
      await broadcastService.leavePresence();
      setMyParticipant(null);
    }
  };

  // Send live reaction
  const handleSendReaction = async (type: string) => {
    try {
      setRecentReactionSent(type);
      await broadcastService.sendReaction(type);
      setTimeout(() => setRecentReactionSent(''), 1500);
    } catch {
      // Quiet fail
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const embedData = broadcast
    ? getEmbedStreamUrl(broadcast.streamUrl, broadcast.sourceType)
    : { embedUrl: '', isEmbeddable: false };

  const isLive = broadcast?.status === 'live';
  const isDialogueActive = myParticipant && (!myParticipant.isMutedByAdmin || myParticipant.isSpotlighted);

  return (
    <div className="pb-24 bg-background min-h-screen">
      {/* Page Header */}
      <PageBanner
        badgeIcon={<Radio className="w-4 h-4 text-secondary" />}
        badgeText={isLive ? 'Live Sanctuary' : 'Broadcast Standby'}
        title="LRT Online Sanctuary"
        subtitle="Worship with the Latter Rain Tabernacle family anywhere in the world."
        backgroundImage="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1920&q=85"
      />

      <div className="container mx-auto px-4 max-w-6xl -mt-10 relative z-20 space-y-8">
        {/* ── Pastor Dialogue Live Alert (When Pastor talks to member) ── */}
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

        {/* ── Main Live Player + Information Grid ── */}
        <div className="grid lg:grid-cols-12 gap-8">
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
                    <h3 className="text-xl font-heading font-bold mb-1">Service is Starting Soon</h3>
                    <p className="text-xs text-slate-400 max-w-sm">
                      Check back shortly or stay on this page. The stream will begin automatically once the service goes live.
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
                        isLive ? 'bg-red-500 animate-pulse' : 'bg-slate-500'
                      }`}
                    />
                    <span className="text-xs font-bold uppercase tracking-wider text-secondary">
                      {isLive ? 'Live On Air' : 'Standby'}
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
                  <span>{participants.length} Worshipping Online</span>
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
                    Virtual Congregation Wall
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
                      Click below to join the church video wall
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

              {/* Location Input (if not set) */}
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
                    Leave Congregation Wall
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
                  Church Sanctuary Audio Safety
                </p>
                <p>
                  Microphones are muted by default to eliminate echo in the church auditorium. The pastor or media team can unmute your audio when talking with you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveBroadcastPage;
