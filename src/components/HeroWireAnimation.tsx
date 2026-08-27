import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Play, RotateCcw, ChevronDown } from 'lucide-react';

interface HeroWireAnimationProps {
  onAnimationComplete?: () => void;
  isScrolledPastHero: boolean;
  onExploreClick: () => void;
}

export function HeroWireAnimation({
  onAnimationComplete,
  isScrolledPastHero,
  onExploreClick,
}: HeroWireAnimationProps) {
  const [animationStage, setAnimationStage] = useState<
    'initial' | 'wires_traveling' | 'connecting' | 'aligning' | 'resolved'
  >('initial');
  const [hasInteracted, setHasInteracted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Scroll linked motion for the wordmark
  const { scrollY } = useScroll();
  const wordmarkScale = useTransform(scrollY, [0, 350], [1, 0.28]);
  const wordmarkY = useTransform(scrollY, [0, 350], [0, -280]);
  const wordmarkX = useTransform(scrollY, [0, 350], [0, -320]);
  const wordmarkOpacity = useTransform(scrollY, [0, 300, 380], [1, 0.9, 0]);
  const heroGridOpacity = useTransform(scrollY, [0, 250], [0.6, 0]);

  // Check prefers reduced motion
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(media.matches);
    if (media.matches) {
      setAnimationStage('resolved');
      onAnimationComplete?.();
    }
  }, [onAnimationComplete]);

  // Sequence controller
  useEffect(() => {
    if (prefersReducedMotion) return;

    // Reset & start sequence
    const t0 = setTimeout(() => {
      setAnimationStage('wires_traveling');
    }, 400);

    const t1 = setTimeout(() => {
      setAnimationStage('connecting');
    }, 1400);

    const t2 = setTimeout(() => {
      setAnimationStage('aligning');
    }, 2400);

    const t3 = setTimeout(() => {
      setAnimationStage('resolved');
      onAnimationComplete?.();
    }, 3200);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [hasInteracted, prefersReducedMotion, onAnimationComplete]);

  // Canvas Technical Wire Engine
  useEffect(() => {
    if (prefersReducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const startTime = performance.now();

    // Wire trace definitions (originating from top-left)
    interface Wire {
      points: { x: number; y: number }[];
      delay: number;
      speed: number;
      color: string;
      width: number;
      junctionPoints: { x: number; y: number }[];
    }

    const midX = width / 2;
    const midY = height / 2;

    const generateWires = (): Wire[] => {
      const wires: Wire[] = [];
      const count = 14;

      for (let i = 0; i < count; i++) {
        const targetX = midX - 260 + (i * 520) / count;
        const targetY = midY;
        const cornerY = 80 + i * 28;
        const cornerX = 40 + i * 36;

        wires.push({
          points: [
            { x: 0, y: 30 + i * 15 },
            { x: cornerX, y: 30 + i * 15 },
            { x: cornerX, y: cornerY },
            { x: targetX, y: cornerY },
            { x: targetX, y: targetY - 40 + (i % 3) * 30 },
          ],
          delay: i * 80,
          speed: 1.6 + (i % 4) * 0.2,
          color: i % 3 === 0 ? '#002B5B' : i % 2 === 0 ? '#64748b' : '#334155',
          width: i % 3 === 0 ? 1.5 : 1,
          junctionPoints: [
            { x: cornerX, y: cornerY },
            { x: targetX, y: cornerY },
          ],
        });
      }
      return wires;
    };

    const wires = generateWires();

    const render = (time: number) => {
      const elapsed = time - startTime;
      ctx.clearRect(0, 0, width, height);

      // Draw faint technical guide lines
      ctx.strokeStyle = 'rgba(0, 43, 91, 0.2)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, midY);
      ctx.lineTo(width, midY);
      ctx.moveTo(midX, 0);
      ctx.lineTo(midX, height);
      ctx.stroke();

      // Render each wire progressively
      wires.forEach((wire) => {
        const wireElapsed = Math.max(0, elapsed - wire.delay);
        if (wireElapsed <= 0) return;

        ctx.strokeStyle = wire.color;
        ctx.lineWidth = wire.width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Calculate current progress along segments
        const totalSegments = wire.points.length - 1;
        const progress = Math.min(1, wireElapsed / (1800 / wire.speed));

        ctx.beginPath();
        ctx.moveTo(wire.points[0].x, wire.points[0].y);

        const currentSegmentIndex = Math.min(
          totalSegments - 1,
          Math.floor(progress * totalSegments)
        );
        const segmentProgress =
          (progress * totalSegments) - currentSegmentIndex;

        for (let j = 0; j <= currentSegmentIndex; j++) {
          const p1 = wire.points[j];
          const p2 = wire.points[j + 1];

          if (j < currentSegmentIndex) {
            ctx.lineTo(p2.x, p2.y);
          } else {
            const curX = p1.x + (p2.x - p1.x) * segmentProgress;
            const curY = p1.y + (p2.y - p1.y) * segmentProgress;
            ctx.lineTo(curX, curY);

            // Draw active leading point
            ctx.fillStyle = '#60a5fa';
            ctx.beginPath();
            ctx.arc(curX, curY, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.stroke();

        // Draw technical junction markers
        if (progress > 0.4) {
          wire.junctionPoints.forEach((jp) => {
            ctx.fillStyle = 'rgba(0, 43, 91, 0.9)';
            ctx.beginPath();
            ctx.arc(jp.x, jp.y, 2, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.lineWidth = 0.5;
            ctx.strokeRect(jp.x - 4, jp.y - 4, 8, 8);
          });
        }
      });

      // Stop canvas loop after 4 seconds to conserve performance
      if (elapsed < 4200) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [hasInteracted, prefersReducedMotion]);

  const replayAnimation = () => {
    setAnimationStage('initial');
    setHasInteracted((prev) => !prev);
  };

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full flex flex-col justify-between items-center overflow-hidden technical-grid"
      id="hero"
    >
      {/* Background Technical Grid and Ambient Vectors */}
      <motion.div
        className="absolute inset-0 pointer-events-none technical-grid-fine opacity-40"
        style={{ opacity: heroGridOpacity }}
      />

      {/* Editorial Aesthetic SVG Wire Grid */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-25"
        viewBox="0 0 1024 400"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 100 H1024" stroke="#002B5B" strokeWidth="0.75" fill="none" />
        <path d="M0 300 H1024" stroke="#002B5B" strokeWidth="0.75" fill="none" />
        <path d="M200 0 V400" stroke="#002B5B" strokeWidth="0.75" fill="none" />
        <path d="M824 0 V400" stroke="#002B5B" strokeWidth="0.75" fill="none" />
        <path d="M100 50 L300 250 L500 150 L800 350" stroke="#F5F5F5" strokeWidth="0.3" fill="none" opacity="0.3" />
      </svg>

      {/* Origin Vector Coordinates (Top Left Technical Marker) */}
      <div className="absolute top-6 left-6 md:top-8 md:left-10 z-10 flex items-center gap-3 text-[11px] font-mono tracking-widest text-white/40 uppercase select-none">
        <span className="w-1.5 h-1.5 rounded-full bg-[#002B5B] animate-pulse" />
        <span>SYS // ORIGIN: [00, 00]</span>
        <span className="hidden sm:inline text-white/20">|</span>
        <span className="hidden sm:inline">STUDIO ARCHITECTURE</span>
      </div>

      {/* Top Right Coordinate / State */}
      <div className="absolute top-6 right-6 md:top-8 md:right-10 z-10 flex items-center gap-4 text-[11px] font-mono tracking-widest text-white/40 uppercase select-none">
        <span className="hidden md:inline">SEQUENCE: {animationStage.toUpperCase()}</span>
        <button
          onClick={replayAnimation}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white transition-colors cursor-pointer text-[10px]"
          title="Replay Brand Formation"
        >
          <RotateCcw className="w-3 h-3 text-[#60a5fa]" />
          <span>REPLAY</span>
        </button>
      </div>

      {/* Interactive Wire Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0"
      />

      {/* Main Center Brand Hero Expression */}
      <div className="flex-1 w-full flex flex-col items-center justify-center relative z-10 px-4 sm:px-6">
        <motion.div
          style={{
            scale: wordmarkScale,
            y: wordmarkY,
            x: wordmarkX,
            opacity: wordmarkOpacity,
          }}
          className="flex flex-col items-center text-center select-none will-change-transform"
        >
          {/* Engineering Blueprint Guides */}
          <div className="flex items-center justify-between w-full max-w-2xl px-2 mb-3 text-[10px] font-mono tracking-widest text-white/30 uppercase">
            <span className="flex items-center gap-1">
              <span className="text-[#3b82f6]">+</span> L_ALIGN
            </span>
            <span className="tracking-[0.25em]">CREATIVE DIGITAL STUDIO</span>
            <span className="flex items-center gap-1">
              R_ALIGN <span className="text-[#3b82f6]">+</span>
            </span>
          </div>

          {/* THE SIGNATURE WORDMARK */}
          <div className="relative overflow-visible py-2">
            {/* Alignment crosshairs and precision bounding box */}
            <div className="absolute -inset-x-6 -inset-y-2 border-y border-white/10 flex justify-between pointer-events-none">
              <div className="w-2 h-full border-l border-white/20" />
              <div className="w-2 h-full border-r border-white/20" />
            </div>

            <motion.h1
              className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-[-0.04em] text-white leading-none font-sans"
              initial={{ letterSpacing: '0.12em', opacity: 0.2 }}
              animate={{
                letterSpacing: animationStage === 'resolved' ? '-0.04em' : '0.04em',
                opacity: 1,
              }}
              transition={{
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              HUTCHFORGE
            </motion.h1>
          </div>

          {/* Subtitle Status & Technical Descriptor */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: animationStage === 'resolved' ? 1 : 0,
              y: animationStage === 'resolved' ? 0 : 10,
            }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs md:text-sm font-mono text-white/60 tracking-wider"
          >
            <span>WEB DESIGN</span>
            <span className="text-white/20">•</span>
            <span>UI/UX SYSTEMS</span>
            <span className="text-white/20">•</span>
            <span>WEBSITE DEVELOPMENT</span>
            <span className="text-white/20">•</span>
            <span>DIGITAL EXPERIENCES</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: animationStage === 'resolved' ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="relative z-10 pb-8 sm:pb-12 flex flex-col items-center gap-2 cursor-pointer"
        onClick={onExploreClick}
      >
        <div className="flex items-center gap-2 text-[11px] font-mono tracking-widest text-white/50 hover:text-white uppercase transition-colors">
          <span>EXPLORE STUDIO</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#3b82f6] animate-bounce" />
        </div>
      </motion.div>
    </div>
  );
}
