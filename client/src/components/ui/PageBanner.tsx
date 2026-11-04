import React, { useEffect, useRef } from 'react';

interface AmbientLightCanvasProps {
  particleCount?: number;
  mode?: 'rain-and-particles' | 'particles-only';
}

/**
 * Hardware-accelerated 60fps canvas animation that renders subtle golden light particles
 * and gentle "Latter Rain" light streaks over hero videos and background images.
 */
export const AmbientLightCanvas: React.FC<AmbientLightCanvasProps> = ({
  particleCount = 45,
  mode = 'rain-and-particles',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    // Floating golden & royal-blue orbs
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2.4 + 0.8,
      vx: (Math.random() - 0.5) * 0.35,
      vy: -Math.random() * 0.45 - 0.15,
      alpha: Math.random() * 0.55 + 0.15,
      pulseSpeed: Math.random() * 0.02 + 0.008,
      pulsePhase: Math.random() * Math.PI * 2,
      isGold: Math.random() > 0.3,
    }));

    // Subtle "Latter Rain" light streaks
    const streaks =
      mode === 'rain-and-particles'
        ? Array.from({ length: 18 }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            length: Math.random() * 70 + 35,
            speed: Math.random() * 1.4 + 0.6,
            alpha: Math.random() * 0.14 + 0.04,
          }))
        : [];

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw gentle descending light streaks ("Latter Rain")
      for (const s of streaks) {
        const grad = ctx.createLinearGradient(s.x, s.y, s.x, s.y + s.length);
        grad.addColorStop(0, 'rgba(253, 224, 71, 0)');
        grad.addColorStop(0.5, `rgba(234, 179, 8, ${s.alpha})`);
        grad.addColorStop(1, 'rgba(59, 130, 246, 0)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x, s.y + s.length);
        ctx.stroke();

        s.y += s.speed;
        if (s.y > height) {
          s.y = -s.length;
          s.x = Math.random() * width;
        }
      }

      // Draw glowing floating particles
      for (const p of particles) {
        p.pulsePhase += p.pulseSpeed;
        const currentAlpha = p.alpha * (0.65 + 0.35 * Math.sin(p.pulsePhase));

        ctx.save();
        ctx.beginPath();
        const glowColor = p.isGold
          ? `rgba(253, 224, 71, ${currentAlpha})`
          : `rgba(96, 165, 250, ${currentAlpha})`;
        ctx.fillStyle = glowColor;
        ctx.shadowColor = p.isGold ? 'rgba(234, 179, 8, 0.8)' : 'rgba(59, 130, 246, 0.8)';
        ctx.shadowBlur = 10;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        p.x += p.vx;
        p.y += p.vy;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [particleCount, mode]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-[2]"
      aria-hidden="true"
    />
  );
};

interface PageBannerProps {
  badgeIcon?: React.ReactNode;
  badgeText?: string;
  title: string;
  subtitle: string;
  backgroundImage: string;
  videoUrl?: string;
}

export const PageBanner: React.FC<PageBannerProps> = ({
  badgeIcon,
  badgeText,
  title,
  subtitle,
  backgroundImage,
  videoUrl,
}) => {
  return (
    <div className="relative bg-slate-950 text-white py-24 md:py-32 mb-16 overflow-hidden border-b border-white/10">
      {/* Background Image with slow Ken-Burns zoom animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img
          src={backgroundImage}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-center opacity-35 animate-ken-burns"
        />
        {videoUrl && (
          <video
            autoPlay
            loop
            muted
            playsInline
            poster={backgroundImage}
            className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-lighten"
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        )}
      </div>

      {/* Multi-layered Royal Blue, Gold & Deep Slate Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-900/75 to-slate-950/95 pointer-events-none z-[1]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(29,78,216,0.32),transparent_60%),radial-gradient(ellipse_at_bottom_left,rgba(234,179,8,0.18),transparent_55%)] pointer-events-none z-[1]" />

      {/* Animated Golden & Blue Light Particles */}
      <AmbientLightCanvas particleCount={32} mode="rain-and-particles" />

      {/* Subtle architectural grid texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none z-[2]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Content */}
      <div className="container mx-auto px-4 text-center relative z-10">
        {badgeText && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-secondary/40 bg-secondary/10 backdrop-blur-md mb-5 shadow-[0_0_20px_rgba(234,179,8,0.15)] animate-fade-in">
            {badgeIcon}
            <span className="text-secondary font-semibold text-xs md:text-sm uppercase tracking-widest">
              {badgeText}
            </span>
          </div>
        )}
        <h1 className="text-4xl md:text-6xl font-heading font-extrabold mb-5 tracking-tight text-white drop-shadow-sm animate-slide-up">
          {title}
        </h1>
        <p className="text-slate-300 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed animate-slide-up">
          {subtitle}
        </p>
        <div className="w-20 h-1 bg-gradient-to-r from-primary-light via-secondary to-primary-light mx-auto mt-8 rounded-full opacity-80" />
      </div>
    </div>
  );
};

export default PageBanner;

