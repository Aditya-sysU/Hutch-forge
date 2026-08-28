import React, { useEffect, useRef } from 'react';

export function FooterWaveCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

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
      time += 0.006;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      ctx.clearRect(0, 0, width, height);

      // 1. Pure Pitch Black Background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // 2. Monochromatic Fluid Smoke & Silk Ribbon Wave Layers (Matching Screenshot)
      // Generates multiple volumetric undulating layers of luminous silver-white silk ribbons
      const ribbons = [
        {
          speed: 1.0,
          baseY: height * 0.48,
          amplitude: height * 0.16,
          freq: 2.2,
          thickness: height * 0.22,
          alpha: 0.18,
          coreAlpha: 0.85,
        },
        {
          speed: 0.75,
          baseY: height * 0.52,
          amplitude: height * 0.14,
          freq: 2.8,
          thickness: height * 0.18,
          alpha: 0.12,
          coreAlpha: 0.65,
        },
        {
          speed: 1.25,
          baseY: height * 0.44,
          amplitude: height * 0.18,
          freq: 1.8,
          thickness: height * 0.28,
          alpha: 0.15,
          coreAlpha: 0.75,
        },
      ];

      ribbons.forEach((ribbon, rIdx) => {
        ctx.save();

        const points: { x: number; y: number; thickness: number }[] = [];
        const steps = 60;
        const stepX = width / steps;

        for (let i = 0; i <= steps; i++) {
          const x = i * stepX;
          const nx = x / width;

          // Organic undulating ribbon curve with multi-frequency harmonic flow
          const w1 = Math.sin(nx * ribbon.freq * Math.PI + time * ribbon.speed + rIdx * 1.5);
          const w2 = Math.cos(nx * 4.2 - time * ribbon.speed * 0.8 + rIdx);
          const w3 = Math.sin(nx * 6.5 + time * 1.2) * 0.3;
          const curve = (w1 * 0.65 + w2 * 0.25 + w3 * 0.1) * ribbon.amplitude;

          const y = ribbon.baseY + curve;
          const localThickness = ribbon.thickness * (0.7 + 0.3 * Math.sin(nx * 3.0 + time + rIdx));

          points.push({ x, y, thickness: localThickness });
        }

        // A. Wide Smoky Diffusion Body (Soft Ambient Smoke)
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y - points[0].thickness * 1.2);

        for (let i = 0; i < points.length - 1; i++) {
          const xc = (points[i].x + points[i + 1].x) / 2;
          const yc = (points[i].y + points[i + 1].y) / 2 - (points[i].thickness + points[i + 1].thickness) * 0.6;
          ctx.quadraticCurveTo(points[i].x, points[i].y - points[i].thickness * 1.2, xc, yc);
        }
        ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y - points[points.length - 1].thickness * 1.2);

        for (let i = points.length - 1; i > 0; i--) {
          const xc = (points[i].x + points[i - 1].x) / 2;
          const yc = (points[i].y + points[i - 1].y) / 2 + (points[i].thickness + points[i - 1].thickness) * 0.6;
          ctx.quadraticCurveTo(points[i].x, points[i].y + points[i].thickness * 1.2, xc, yc);
        }
        ctx.closePath();

        const smokeGrad = ctx.createLinearGradient(0, ribbon.baseY - ribbon.amplitude, 0, ribbon.baseY + ribbon.amplitude + ribbon.thickness);
        smokeGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
        smokeGrad.addColorStop(0.3, `rgba(255, 255, 255, ${ribbon.alpha * 0.4})`);
        smokeGrad.addColorStop(0.5, `rgba(255, 255, 255, ${ribbon.alpha})`);
        smokeGrad.addColorStop(0.7, `rgba(255, 255, 255, ${ribbon.alpha * 0.4})`);
        smokeGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = smokeGrad;
        ctx.fill();

        // B. Dense Monochromatic Fluid Ribbon Body
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y - points[0].thickness * 0.5);

        for (let i = 0; i < points.length - 1; i++) {
          const xc = (points[i].x + points[i + 1].x) / 2;
          const yc = (points[i].y + points[i + 1].y) / 2 - (points[i].thickness + points[i + 1].thickness) * 0.25;
          ctx.quadraticCurveTo(points[i].x, points[i].y - points[i].thickness * 0.5, xc, yc);
        }
        ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y - points[points.length - 1].thickness * 0.5);

        for (let i = points.length - 1; i > 0; i--) {
          const xc = (points[i].x + points[i - 1].x) / 2;
          const yc = (points[i].y + points[i - 1].y) / 2 + (points[i].thickness + points[i - 1].thickness) * 0.25;
          ctx.quadraticCurveTo(points[i].x, points[i].y + points[i].thickness * 0.5, xc, yc);
        }
        ctx.closePath();

        const ribbonGrad = ctx.createLinearGradient(0, ribbon.baseY - ribbon.amplitude, width, ribbon.baseY + ribbon.amplitude);
        ribbonGrad.addColorStop(0, `rgba(180, 180, 180, ${ribbon.alpha * 0.6})`);
        ribbonGrad.addColorStop(0.5, `rgba(255, 255, 255, ${ribbon.alpha * 1.5})`);
        ribbonGrad.addColorStop(1, `rgba(160, 160, 160, ${ribbon.alpha * 0.5})`);

        ctx.fillStyle = ribbonGrad;
        ctx.fill();

        // C. Bright Specular Core Silk Line (Matches the high-contrast bright edge in image)
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        for (let i = 0; i < points.length - 1; i++) {
          const xc = (points[i].x + points[i + 1].x) / 2;
          const yc = (points[i].y + points[i + 1].y) / 2;
          ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }
        ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);

        ctx.lineWidth = 2.5;
        const coreGrad = ctx.createLinearGradient(0, 0, width, 0);
        coreGrad.addColorStop(0, 'rgba(255, 255, 255, 0.05)');
        coreGrad.addColorStop(0.2, `rgba(255, 255, 255, ${ribbon.coreAlpha * 0.7})`);
        coreGrad.addColorStop(0.5, `rgba(255, 255, 255, ${ribbon.coreAlpha})`);
        coreGrad.addColorStop(0.8, `rgba(255, 255, 255, ${ribbon.coreAlpha * 0.7})`);
        coreGrad.addColorStop(1, 'rgba(255, 255, 255, 0.05)');

        ctx.strokeStyle = coreGrad;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
        ctx.shadowBlur = 18;
        ctx.stroke();

        ctx.restore();
      });

      // 3. Subtle Vignette Overlays for Depth
      const topFade = ctx.createLinearGradient(0, 0, 0, height * 0.25);
      topFade.addColorStop(0, 'rgba(0, 0, 0, 0.9)');
      topFade.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = topFade;
      ctx.fillRect(0, 0, width, height * 0.25);

      const bottomFade = ctx.createLinearGradient(0, height * 0.75, 0, height);
      bottomFade.addColorStop(0, 'rgba(0, 0, 0, 0)');
      bottomFade.addColorStop(1, 'rgba(0, 0, 0, 0.85)');
      ctx.fillStyle = bottomFade;
      ctx.fillRect(0, height * 0.75, width, height * 0.25);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
