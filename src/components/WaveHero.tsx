import React, { useEffect, useRef, useState } from 'react';
import { PageRoute } from '../types';
import { motion } from 'motion/react';

interface WaveHeroProps {
  onNavigate?: (route: PageRoute) => void;
  onExploreClick?: () => void;
}

export function WaveHero({ onNavigate, onExploreClick }: WaveHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0.5,
    y: 0.5,
    targetX: 0.5,
    targetY: 0.5,
  });

  // Interactive mouse tracking for subtle light field shift
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos((prev) => ({
      ...prev,
      targetX: Math.max(0, Math.min(1, x)),
      targetY: Math.max(0, Math.min(1, y)),
    }));
  };

  // Ambient Deep Blue Glowing Canvas Animation (#1368e6)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    // Noise grain buffer for rich editorial texture
    const grainCanvas = document.createElement('canvas');
    grainCanvas.width = 160;
    grainCanvas.height = 160;
    const grainCtx = grainCanvas.getContext('2d');
    if (grainCtx) {
      const imgData = grainCtx.createImageData(160, 160);
      const buffer = new Uint32Array(imgData.data.buffer);
      for (let i = 0; i < buffer.length; i++) {
        const noise = Math.random() > 0.35 ? Math.floor(Math.random() * 26) : 0;
        buffer[i] = (noise << 24) | (noise << 16) | (noise << 8) | noise;
      }
      grainCtx.putImageData(imgData, 0, 0);
    }

    let currentMouseX = mousePos.x;
    let currentMouseY = mousePos.y;

    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const render = () => {
      time += 0.007;

      // Smooth mouse interpolation
      currentMouseX += (mousePos.targetX - currentMouseX) * 0.03;
      currentMouseY += (mousePos.targetY - currentMouseY) * 0.03;

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      ctx.clearRect(0, 0, width, height);

      // 1. Deep Black Base
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // 2. Deep Blue (#1368e6) Atmospheric Volumetric Lighting
      ctx.save();

      // Radiant center-left incandescent glow node
      const node1X = width * 0.38 + Math.sin(time * 0.85) * (width * 0.1) + (currentMouseX - 0.5) * 50;
      const node1Y = height * 0.55 + Math.cos(time * 0.65) * (height * 0.08) + (currentMouseY - 0.5) * 35;
      const radius1 = Math.min(width, height) * 0.65;

      const grad1 = ctx.createRadialGradient(node1X, node1Y, 0, node1X, node1Y, radius1);
      grad1.addColorStop(0, 'rgba(19, 104, 230, 0.82)'); // #1368e6
      grad1.addColorStop(0.26, 'rgba(19, 104, 230, 0.52)');
      grad1.addColorStop(0.58, 'rgba(10, 48, 128, 0.25)');
      grad1.addColorStop(0.85, 'rgba(4, 18, 56, 0.08)');
      grad1.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      // Secondary floating harmonic glow node (mid-right)
      const node2X = width * 0.72 + Math.cos(time * 0.75 + 1.2) * (width * 0.09) + (currentMouseX - 0.5) * 35;
      const node2Y = height * 0.42 + Math.sin(time * 0.55 + 0.8) * (height * 0.08) + (currentMouseY - 0.5) * 25;
      const radius2 = Math.min(width, height) * 0.55;

      const grad2 = ctx.createRadialGradient(node2X, node2Y, 0, node2X, node2Y, radius2);
      grad2.addColorStop(0, 'rgba(24, 116, 255, 0.62)');
      grad2.addColorStop(0.3, 'rgba(19, 104, 230, 0.38)');
      grad2.addColorStop(0.65, 'rgba(8, 35, 95, 0.16)');
      grad2.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // Ambient lower base glow
      const baseGrad = ctx.createLinearGradient(0, height * 0.35, 0, height);
      baseGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      baseGrad.addColorStop(0.4, 'rgba(6, 25, 75, 0.3)');
      baseGrad.addColorStop(0.75, 'rgba(19, 104, 230, 0.45)');
      baseGrad.addColorStop(1, 'rgba(8, 33, 89, 0.75)');

      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, height * 0.35, width, height * 0.65);

      // Texture Overlay
      if (grainCtx) {
        const pattern = ctx.createPattern(grainCanvas, 'repeat');
        if (pattern) {
          ctx.globalCompositeOperation = 'overlay';
          ctx.fillStyle = pattern;
          ctx.fillRect(0, 0, width, height);
          ctx.globalCompositeOperation = 'source-over';
        }
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mousePos.targetX, mousePos.targetY]);

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-[calc(100vh+200px)] h-[calc(100vh+200px)] bg-black flex items-center justify-center overflow-hidden select-none px-6"
    >
      {/* Animated Deep Blue (#1368e6) Glowing Base Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* Subtle Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80 pointer-events-none z-[1]" />

      {/* SVG Liquid Goo Filter Definition */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <filter id="liquidGooHero">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      {/* Falling White Liquid Droplets Streamers (Falling from Top of Hero to Form Letters) */}
      <div className="absolute inset-x-0 top-0 bottom-1/2 pointer-events-none z-10 overflow-hidden flex justify-center">
        <div className="relative w-full max-w-2xl h-full">
          {/* Individual Falling Liquid Droplet Trails */}
          {[
            { left: '18%', delay: 0.1, duration: 1.1, size: 8, height: 120 },
            { left: '38%', delay: 0.35, duration: 1.25, size: 9, height: 160 },
            { left: '60%', delay: 0.22, duration: 1.15, size: 7, height: 130 },
            { left: '82%', delay: 0.45, duration: 1.3, size: 8, height: 150 },
            { left: '28%', delay: 0.6, duration: 1.05, size: 6, height: 90 },
            { left: '72%', delay: 0.75, duration: 1.2, size: 7, height: 110 },
          ].map((drop, idx) => (
            <motion.div
              key={idx}
              initial={{ y: -80, opacity: 0, scaleY: 2.5 }}
              animate={{
                y: ['-80px', '45vh', '52vh'],
                opacity: [0, 1, 0],
                scaleY: [2.5, 3.5, 0.4],
                scaleX: [0.8, 0.6, 2],
              }}
              transition={{
                duration: drop.duration,
                delay: drop.delay,
                ease: [0.33, 1, 0.68, 1],
              }}
              style={{ left: drop.left }}
              className="absolute top-0 flex flex-col items-center"
            >
              {/* Viscous Liquid Stream Tail */}
              <div
                style={{ height: `${drop.height}px`, width: `${Math.max(2, drop.size * 0.35)}px` }}
                className="bg-gradient-to-t from-white via-white/80 to-transparent rounded-full shadow-[0_0_12px_rgba(255,255,255,0.8)]"
              />
              {/* Droplet Head */}
              <div
                style={{ width: `${drop.size}px`, height: `${drop.size * 1.4}px` }}
                className="bg-white rounded-[50%_50%_50%_50%/60%_60%_40%_40%] shadow-[0_0_20px_#ffffff,0_0_10px_#93c5fd]"
              />
              {/* Splash Ripple upon Impact */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 2.8, 3.5], opacity: [0, 0.7, 0] }}
                transition={{
                  duration: 0.6,
                  delay: drop.delay + drop.duration * 0.8,
                  ease: 'easeOut',
                }}
                className="absolute bottom-0 w-8 h-2 rounded-full border border-white/60 bg-white/20"
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Clean 26px Centered Typography Formed from White Liquid */}
      <div className="relative z-20 text-center max-w-4xl mx-auto px-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.18,
                delayChildren: 0.3,
              },
            },
          }}
          className="flex flex-wrap items-center justify-center gap-x-2.5 sm:gap-x-3.5 gap-y-1.5"
        >
          {['Building', 'experiences', 'from', 'scratch'].map((word, wordIdx) => (
            <motion.div
              key={wordIdx}
              variants={{
                hidden: {
                  opacity: 0,
                  y: -50,
                  scaleY: 2.2,
                  filter: 'blur(12px) brightness(2)',
                },
                visible: {
                  opacity: 1,
                  y: 0,
                  scaleY: 1,
                  filter: 'blur(0px) brightness(1)',
                  transition: {
                    duration: 0.95,
                    ease: [0.16, 1, 0.3, 1],
                  },
                },
              }}
              className="relative inline-flex items-center group cursor-default"
            >
              {/* Subtle top liquid drip point */}
              <motion.span
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: [0, 1.6, 0], opacity: [0, 0.95, 0] }}
                transition={{
                  duration: 0.85,
                  delay: 0.3 + wordIdx * 0.18,
                  ease: 'easeOut',
                }}
                className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-1.5 h-3.5 bg-gradient-to-b from-white to-transparent rounded-full pointer-events-none"
              />

              {/* Exact 26px High-End Centered Text */}
              <span className="text-[23px] sm:text-[26px] font-medium tracking-tight text-white leading-normal drop-shadow-[0_2px_14px_rgba(255,255,255,0.45)] group-hover:text-[#93c5fd] transition-colors duration-300">
                {word}
              </span>

              {/* Bottom Settling Liquid Dew */}
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.2, 0.8], opacity: [0, 0.85, 0] }}
                transition={{
                  duration: 1.2,
                  delay: 0.7 + wordIdx * 0.18,
                  ease: 'easeOut',
                }}
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#ffffff]"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
