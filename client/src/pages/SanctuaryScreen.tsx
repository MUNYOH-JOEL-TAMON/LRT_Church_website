import React, { useState, useEffect, useRef } from 'react';
import {
  Maximize,
  Minimize,
  Radio,
  Users,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Star,
  Volume2,
} from 'lucide-react';
import broadcastService from '../services/broadcastService';
import lrtLogo from '../assets/LRT_LOGO.jpeg';
import type { BroadcastSession, VirtualParticipant, LiveReaction } from '../types';

const SanctuaryScreen: React.FC = () => {
  const [broadcast, setBroadcast] = useState<BroadcastSession | null>(null);
  const [participants, setParticipants] = useState<VirtualParticipant[]>([]);
  const [reactions, setReactions] = useState<LiveReaction[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  // Poll participants, broadcast status, and reactions every 2.5 seconds
  useEffect(() => {
    const fetchState = async () => {
      try {
        const res = await broadcastService.getCurrent();
        if (res.data) {
          setBroadcast(res.data.broadcast);
          setParticipants(res.data.participants || []);
          setReactions(res.data.reactions || []);
        }
      } catch {
        // Quiet fail
      }
    };

    fetchState();
    const interval = setInterval(fetchState, 2500);
    const clockInterval = setInterval(() => setCurrentTime(new Date()), 1000);

    return () => {
      clearInterval(interval);
      clearInterval(clockInterval);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Determine active spotlighted member
  const spotlightedMember = participants.find(
    (p) => p.userId === broadcast?.spotlightedMemberId || p.isSpotlighted
  );

  // Filter camera participants or show all active participants
  const displayedParticipants = participants;

  // Calculate dynamic grid template columns based on count
  const getGridColsClass = (count: number) => {
    if (count <= 1) return 'grid-cols-1 max-w-2xl';
    if (count <= 4) return 'grid-cols-2 max-w-5xl';
    if (count <= 9) return 'grid-cols-3 max-w-7xl';
    if (count <= 16) return 'grid-cols-4 max-w-7xl';
    return 'grid-cols-5 max-w-full';
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-slate-950 text-white flex flex-col justify-between overflow-hidden relative select-none font-body"
    >
      {/* ── Top Floating Broadcast Bar ── */}
      <header className="relative z-20 px-8 py-5 flex items-center justify-between border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <img
            src={lrtLogo}
            alt="LRT"
            className="w-12 h-12 rounded-full object-cover border-2 border-secondary/60 shadow-lg"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-secondary">
                Virtual Sanctuary • Live Wall
              </span>
            </div>
            <h1 className="text-xl font-heading font-extrabold tracking-tight text-white leading-tight">
              {broadcast?.title || 'Latter Rain Tabernacle Service'}
            </h1>
            <p className="text-xs text-slate-400">
              Ministration by {broadcast?.preacher || 'Pastor'}
            </p>
          </div>
        </div>

        {/* Right Info: Live Counter & Fullscreen */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold text-slate-300">
            <Users className="w-4 h-4 text-secondary" />
            <span>{participants.length} Worshippers Online</span>
          </div>

          <div className="text-right hidden sm:block">
            <p className="text-base font-heading font-bold text-white leading-none">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">Sanctuary Live Time</p>
          </div>

          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer border border-white/10"
          >
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* ── Main Sanctuary Video Grid / Spotlight Stage ── */}
      <main className="flex-1 p-6 md:p-8 flex items-center justify-center relative z-10 overflow-hidden">
        {/* Scenario 1: Pastor is talking to a Spotlighted Member */}
        {spotlightedMember ? (
          <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center gap-8 animate-fade-in">
            {/* Center Stage: Enlarged Spotlighted Box */}
            <div className="flex-1 w-full relative rounded-3xl overflow-hidden aspect-video bg-gradient-to-br from-slate-900 via-primary-dark/40 to-slate-900 border-4 border-amber-400 shadow-[0_0_60px_rgba(234,179,8,0.35)] flex flex-col justify-between p-6">
              {/* Top Banner Tag */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400 text-slate-950 text-xs font-heading font-extrabold shadow-lg">
                  <Star className="w-4 h-4 fill-slate-950" />
                  Live Dialogue with Pastor
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold animate-pulse">
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                  Microphone Active
                </span>
              </div>

              {/* Avatar Center (when camera stream placeholder) */}
              <div className="flex flex-col items-center justify-center my-auto">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-secondary to-amber-500 flex items-center justify-center text-slate-950 font-extrabold text-4xl shadow-2xl border-4 border-white/20">
                    {spotlightedMember.name.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center">
                    <Mic className="w-4 h-4 text-white" />
                  </span>
                </div>
              </div>

              {/* Bottom Tag */}
              <div className="bg-slate-950/80 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-heading font-bold text-white">
                    {spotlightedMember.name}
                  </h3>
                  <p className="text-xs text-secondary font-semibold">
                    {spotlightedMember.location}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-300">Speaking Live</span>
                </div>
              </div>
            </div>

            {/* Other Congregation Members in a side strip */}
            <div className="w-full lg:w-72 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto max-h-[30rem] scrollbar-none">
              {participants
                .filter((p) => p.userId !== spotlightedMember.userId)
                .slice(0, 6)
                .map((p) => (
                  <div
                    key={p.userId}
                    className="flex-shrink-0 w-44 lg:w-full p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3 backdrop-blur-md"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/10 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                      {p.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{p.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{p.location}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          /* Scenario 2: Standard Mosaic Video Grid (The Tiles) */
          <div className="w-full h-full flex flex-col items-center justify-center">
            {displayedParticipants.length === 0 ? (
              <div className="text-center p-12 rounded-3xl bg-white/5 border border-white/10 max-w-md mx-auto backdrop-blur-xl">
                <div className="w-16 h-16 rounded-2xl bg-secondary/15 border border-secondary/30 flex items-center justify-center mx-auto mb-4 text-secondary">
                  <Radio className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-heading font-bold text-white mb-2">
                  Virtual Sanctuary Standby
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Waiting for online worshippers to join from home. When members connect their cameras, their boxes will automatically appear here.
                </p>
              </div>
            ) : (
              <div
                className={`grid gap-4 sm:gap-6 w-full ${getGridColsClass(
                  displayedParticipants.length
                )} justify-center items-center`}
              >
                {displayedParticipants.map((p) => (
                  <div
                    key={p.userId}
                    className="group relative rounded-3xl aspect-video bg-gradient-to-br from-slate-900 to-slate-850 border border-white/15 overflow-hidden shadow-xl flex flex-col justify-between p-4 hover:border-secondary/60 transition-all"
                  >
                    {/* Top status */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        {p.hasCamera ? (
                          <span className="p-1 rounded-md bg-emerald-500/20 text-emerald-400">
                            <Video className="w-3 h-3" />
                          </span>
                        ) : (
                          <span className="p-1 rounded-md bg-slate-700/50 text-slate-400">
                            <VideoOff className="w-3 h-3" />
                          </span>
                        )}
                      </div>

                      {!p.isMutedByAdmin ? (
                        <span className="p-1 rounded-md bg-emerald-500/20 text-emerald-400 animate-pulse">
                          <Mic className="w-3 h-3" />
                        </span>
                      ) : (
                        <span className="p-1 rounded-md bg-white/10 text-slate-500">
                          <MicOff className="w-3 h-3" />
                        </span>
                      )}
                    </div>

                    {/* Member Box Avatar Center */}
                    <div className="flex flex-col items-center justify-center my-auto">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-slate-950 font-extrabold text-xl sm:text-2xl shadow-lg border border-white/20 group-hover:scale-105 transition-transform">
                        {p.name.slice(0, 2).toUpperCase()}
                      </div>
                    </div>

                    {/* Bottom frosted glass nametag */}
                    <div className="bg-slate-950/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 flex items-center justify-between">
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-bold text-white truncate">{p.name}</p>
                        <p className="text-[10px] text-secondary font-medium truncate">{p.location}</p>
                      </div>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0 animate-ping" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── Floating Reaction Rain Overlay ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
        {reactions.slice(-8).map((r, i) => (
          <div
            key={r.id + i}
            className="absolute bottom-16 px-4 py-2 rounded-full bg-slate-900/90 border border-secondary/40 text-white shadow-2xl flex items-center gap-2 backdrop-blur-xl animate-float-up"
            style={{
              left: `${15 + (i * 12) % 70}%`,
              animationDelay: `${i * 0.2}s`,
            }}
          >
            <span className="text-xl">
              {r.type === 'amen'
                ? '🙏'
                : r.type === 'hallelujah'
                ? '🙌'
                : r.type === 'praise'
                ? '🔥'
                : r.type === 'clap'
                ? '👏'
                : '❤️'}
            </span>
            <span className="text-xs font-bold text-secondary">{r.userName}</span>
            <span className="text-[10px] uppercase font-bold text-slate-300 capitalize">
              {r.type}
            </span>
          </div>
        ))}
      </div>

      {/* ── Footer Branding Strip ── */}
      <footer className="relative z-20 px-8 py-3.5 border-t border-white/10 bg-slate-950/90 text-center flex items-center justify-between text-xs text-slate-400">
        <span>Latter Rain Tabernacle • Holy Ghost Sanctuary</span>
        <span className="text-[11px] text-secondary font-semibold">
          Projector & LED Wall Feed
        </span>
      </footer>
    </div>
  );
};

export default SanctuaryScreen;
