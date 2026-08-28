import React, { useEffect, useRef } from 'react';

export function FooterLiquidOrbCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    // Generate thousands of interior fluid stipple particles inside the liquid orb
    const particleCount = 1400;
    const particles: { theta: number; phi: number; r: number; speed: number; size: number; brightness: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      // Volume distribution with concentration towards surface
      const r = 0.35 + Math.pow(Math.random(), 0.6) * 0.65;
      particles.push({
        theta,
        phi,
        r,
        speed: 0.2 + Math.random() * 0.8,
        size: 0.6 + Math.random() * 1.4,
        brightness: 0.4 + Math.random() * 0.6,
      });
    }

    // Chromatic dispersion sparkle nodes on refractive peaks
    const sparksCount = 28;
    const sparks: { angle: number; ringIndex: number; speed: number; length: number; colorOffset: number }[] = [];
    for (let i = 0; i < sparksCount; i++) {
      sparks.push({
        angle: Math.random() * Math.PI * 2,
        ringIndex: Math.floor(Math.random() * 3),
        speed: (Math.random() - 0.5) * 0.02,
        length: 12 + Math.random() * 24,
        colorOffset: Math.random() * 3,
      });
    }

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

    // 3D Noise / Harmonic deformer for liquid sphere
    const getOrbDisplacement = (theta: number, phi: number, t: number) => {
      const s1 = Math.sin(theta * 3.0 + t * 1.6) * Math.cos(phi * 2.0 - t * 1.2);
      const s2 = Math.sin(phi * 4.0 + t * 2.1) * Math.cos(theta * 2.0 + t * 0.8);
      const s3 = Math.sin((theta + phi) * 5.0 - t * 2.5) * 0.4;
      const pulse = Math.sin(t * 1.8) * 0.08;
      return 1.0 + (s1 * 0.18 + s2 * 0.15 + s3 * 0.09) + pulse;
    };

    const render = () => {
      time += 0.016;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      ctx.clearRect(0, 0, width, height);

      // Deep pitch black void
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      const centerX = width * 0.5;
      const centerY = height * 0.52;
      const baseRadius = Math.min(width, height) * 0.32;

      // 1. Soft atmospheric volumetric bloom
      const ambientGlow = ctx.createRadialGradient(
        centerX,
        centerY,
        baseRadius * 0.2,
        centerX,
        centerY,
        baseRadius * 1.6
      );
      ambientGlow.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
      ambientGlow.addColorStop(0.3, 'rgba(100, 160, 255, 0.06)');
      ambientGlow.addColorStop(0.7, 'rgba(20, 40, 90, 0.02)');
      ambientGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = ambientGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius * 1.6, 0, Math.PI * 2);
      ctx.fill();

      // 2. 3D Elliptical Orbital Rings around the liquid ball
      const orbitalRings = [
        { rx: baseRadius * 1.55, ry: baseRadius * 0.55, rot: -0.35 + Math.sin(time * 0.3) * 0.05, tilt: 0.4 },
        { rx: baseRadius * 1.45, ry: baseRadius * 0.65, rot: 0.65 + Math.cos(time * 0.25) * 0.06, tilt: -0.3 },
        { rx: baseRadius * 1.35, ry: baseRadius * 0.45, rot: 1.8 + Math.sin(time * 0.2) * 0.08, tilt: 0.75 },
      ];

      orbitalRings.forEach((ring, rIdx) => {
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(ring.rot);

        // Thin orbital wire ring
        ctx.beginPath();
        ctx.ellipse(0, 0, ring.rx, ring.ry, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.18 - rIdx * 0.03})`;
        ctx.lineWidth = 1.0;
        ctx.stroke();

        ctx.restore();
      });

      // 3. Render Shimmering Liquid Fluid Particle Volume (Interior Stippling)
      ctx.save();
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Fluid rotation inside orb
        const curTheta = p.theta + time * 0.4 * p.speed;
        const curPhi = p.phi + Math.sin(time * 0.3 + p.theta) * 0.15;

        const disp = getOrbDisplacement(curTheta, curPhi, time);
        const r = baseRadius * p.r * disp;

        // 3D coordinates
        const x3d = r * Math.sin(curPhi) * Math.cos(curTheta);
        const y3d = r * Math.sin(curPhi) * Math.sin(curTheta);
        const z3d = r * Math.cos(curPhi);

        // Rotate in 3D (pitch & yaw)
        const yaw = time * 0.35;
        const pitch = 0.45;
        const xRot = x3d * Math.cos(yaw) - z3d * Math.sin(yaw);
        const zRot1 = x3d * Math.sin(yaw) + z3d * Math.cos(yaw);
        const yRot = y3d * Math.cos(pitch) - zRot1 * Math.sin(pitch);
        const zRot = y3d * Math.sin(pitch) + zRot1 * Math.cos(pitch);

        const screenX = centerX + xRot;
        const screenY = centerY + yRot;

        // Depth perspective & brightness
        const depth = (zRot + baseRadius * 1.2) / (baseRadius * 2.4);
        if (depth > 0.1) {
          const alpha = Math.max(0.05, Math.min(0.95, depth * p.brightness * 0.85));
          
          // Slight chromatic split on bright outer particles
          if (p.r > 0.8 && Math.random() > 0.7) {
            ctx.fillStyle = `rgba(180, 230, 255, ${alpha})`;
          } else {
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          }

          ctx.beginPath();
          ctx.arc(screenX, screenY, p.size * (0.6 + depth * 0.7), 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();

      // 4. Liquid Surface Deformed Contour & Specular Rim Refractions
      const contourSteps = 120;
      ctx.save();
      ctx.beginPath();
      
      const contourPoints: { x: number; y: number; disp: number; angle: number }[] = [];
      for (let i = 0; i <= contourSteps; i++) {
        const angle = (i / contourSteps) * Math.PI * 2;
        const disp = getOrbDisplacement(angle, Math.PI / 2 + Math.sin(angle * 3.0 + time) * 0.4, time);
        const radius = baseRadius * disp;
        
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius * 0.96;
        contourPoints.push({ x, y, disp, angle });

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();

      // Liquid Chrome & Specular Sheen Gradient
      const liquidGrad = ctx.createRadialGradient(
        centerX - baseRadius * 0.35,
        centerY - baseRadius * 0.35,
        baseRadius * 0.1,
        centerX,
        centerY,
        baseRadius * 1.15
      );
      liquidGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
      liquidGrad.addColorStop(0.3, 'rgba(210, 225, 245, 0.22)');
      liquidGrad.addColorStop(0.7, 'rgba(40, 60, 95, 0.35)');
      liquidGrad.addColorStop(0.92, 'rgba(10, 15, 25, 0.75)');
      liquidGrad.addColorStop(1, 'rgba(0, 0, 0, 0.9)');

      ctx.fillStyle = liquidGrad;
      ctx.fill();

      // Liquid rim outline with specular highlight
      ctx.lineWidth = 2.0;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.shadowColor = 'rgba(255, 255, 255, 0.9)';
      ctx.shadowBlur = 14;
      ctx.stroke();
      ctx.restore();

      // 5. Chromatic Aberration / Iridescent Prismatic Dispersion Flares (RGB Split Refraction)
      // Exactly reproducing the rainbow prism refractions on orbital intersections & fluid peaks from the video
      ctx.save();
      orbitalRings.forEach((ring, rIdx) => {
        const sparkAngles = [
          time * 0.8 + rIdx * 1.8,
          time * 0.8 + Math.PI + rIdx * 1.8,
          -time * 0.6 + rIdx * 2.2,
        ];

        sparkAngles.forEach((ang) => {
          const cosA = Math.cos(ang);
          const sinA = Math.sin(ang);

          // Local coordinates on ring
          const lx = ring.rx * cosA;
          const ly = ring.ry * sinA;

          // Apply ring rotation
          const cosR = Math.cos(ring.rot);
          const sinR = Math.sin(ring.rot);
          const px = centerX + (lx * cosR - ly * sinR);
          const py = centerY + (lx * sinR + ly * cosR);

          // Draw chromatic split prism lines (Red, Green, Cyan, Violet)
          const prismLen = 22 + Math.sin(ang * 4.0 + time * 3.0) * 8;
          const normAng = Math.atan2(ly, lx) + ring.rot + Math.PI / 2;

          const dx = Math.cos(normAng) * prismLen;
          const dy = Math.sin(normAng) * prismLen;

          // Red channel offset
          ctx.beginPath();
          ctx.moveTo(px - dx * 0.6 - 2.5, py - dy * 0.6);
          ctx.lineTo(px + dx * 0.6 - 2.5, py + dy * 0.6);
          ctx.strokeStyle = 'rgba(255, 60, 60, 0.85)';
          ctx.lineWidth = 2.4;
          ctx.stroke();

          // Green / Yellow channel
          ctx.beginPath();
          ctx.moveTo(px - dx * 0.5, py - dy * 0.5);
          ctx.lineTo(px + dx * 0.5, py + dy * 0.5);
          ctx.strokeStyle = 'rgba(255, 230, 80, 0.9)';
          ctx.lineWidth = 1.8;
          ctx.stroke();

          // Cyan / Blue channel offset
          ctx.beginPath();
          ctx.moveTo(px - dx * 0.6 + 2.5, py - dy * 0.6);
          ctx.lineTo(px + dx * 0.6 + 2.5, py + dy * 0.6);
          ctx.strokeStyle = 'rgba(60, 220, 255, 0.9)';
          ctx.lineWidth = 2.4;
          ctx.stroke();

          // Core bright white flare dot
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx.shadowColor = '#ffffff';
          ctx.shadowBlur = 10;
          ctx.fill();
        });
      });
      ctx.restore();

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
      style={{
        filter: 'contrast(1.15) brightness(0.95)',
      }}
    />
  );
}
