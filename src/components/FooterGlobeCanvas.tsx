import React, { useEffect, useRef } from 'react';

export function FooterGlobeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let rotation = 0;
    const tilt = 0.38; // ~22 degree axial tilt

    // Generate procedural 3D landmass and grid points on the sphere
    const points: { lat: number; lon: number; isLand: boolean; size: number }[] = [];
    
    // Create latitude & longitude rings + continent clusters
    const rings = 42;
    for (let i = 0; i < rings; i++) {
      const lat = (i / (rings - 1)) * Math.PI - Math.PI / 2; // -PI/2 to PI/2
      const radiusAtLat = Math.cos(lat);
      const pointsInRing = Math.max(8, Math.floor(75 * radiusAtLat));

      for (let j = 0; j < pointsInRing; j++) {
        const lon = (j / pointsInRing) * Math.PI * 2 - Math.PI;

        // Procedural continent density mask (approximating Earth's landmass clusters)
        const n1 = Math.sin(lon * 2.2 + Math.cos(lat * 3.1) * 1.5);
        const n2 = Math.cos(lon * 3.5 - Math.sin(lat * 2.4));
        const n3 = Math.sin(lat * 4.0 + lon * 1.2);
        const landFactor = n1 * 0.45 + n2 * 0.35 + n3 * 0.2;

        const isLand = landFactor > 0.08 || Math.abs(lat) > 1.35; // Landmasses + polar regions

        points.push({
          lat,
          lon,
          isLand,
          size: isLand ? 1.4 : 0.8,
        });
      }
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

    const render = () => {
      rotation += 0.0035; // Slow, majestic planetary rotation
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      ctx.clearRect(0, 0, width, height);

      // Deep space black background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // Globe center positioned slightly offset or centered
      const globeRadius = Math.min(width, height) * 0.42;
      const centerX = width * 0.5;
      const centerY = height * 0.52;

      // 1. Atmosphere / Outer Soft Glowing Halo
      const outerGlow = ctx.createRadialGradient(
        centerX,
        centerY,
        globeRadius * 0.85,
        centerX,
        centerY,
        globeRadius * 1.45
      );
      outerGlow.addColorStop(0, 'rgba(19, 104, 230, 0.22)');
      outerGlow.addColorStop(0.35, 'rgba(59, 130, 246, 0.12)');
      outerGlow.addColorStop(0.7, 'rgba(14, 30, 70, 0.04)');
      outerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = outerGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, globeRadius * 1.5, 0, Math.PI * 2);
      ctx.fill();

      // 2. Dark Planet Sphere Body with Specular Curved Limb Lighting
      const sphereGrad = ctx.createRadialGradient(
        centerX - globeRadius * 0.35,
        centerY - globeRadius * 0.35,
        globeRadius * 0.1,
        centerX,
        centerY,
        globeRadius
      );
      sphereGrad.addColorStop(0, 'rgba(12, 28, 56, 0.45)');
      sphereGrad.addColorStop(0.6, 'rgba(4, 10, 24, 0.85)');
      sphereGrad.addColorStop(0.95, 'rgba(2, 4, 10, 0.98)');
      sphereGrad.addColorStop(1, 'rgba(0, 0, 0, 1)');

      ctx.fillStyle = sphereGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, globeRadius, 0, Math.PI * 2);
      ctx.fill();

      // 3. Render 3D Latitude & Longitude Meridian Arcs
      const meridians = 12;
      for (let m = 0; m < meridians; m++) {
        const lon = (m / meridians) * Math.PI * 2 + rotation;
        ctx.beginPath();
        let first = true;

        for (let la = -Math.PI / 2; la <= Math.PI / 2; la += 0.1) {
          // 3D Spherical Coordinates
          const x3d = globeRadius * Math.cos(la) * Math.sin(lon);
          const y3d = globeRadius * Math.sin(la);
          const z3d = globeRadius * Math.cos(la) * Math.cos(lon);

          // Axial tilt rotation (around X axis)
          const yTilted = y3d * Math.cos(tilt) - z3d * Math.sin(tilt);
          const zTilted = y3d * Math.sin(tilt) + z3d * Math.cos(tilt);

          if (zTilted > -globeRadius * 0.15) {
            const screenX = centerX + x3d;
            const screenY = centerY + yTilted;
            if (first) {
              ctx.moveTo(screenX, screenY);
              first = false;
            } else {
              ctx.lineTo(screenX, screenY);
            }
          }
        }

        const meridianAlpha = 0.05 + 0.04 * Math.sin(m + rotation);
        ctx.strokeStyle = `rgba(96, 165, 250, ${meridianAlpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // 4. Render Rotating Earth Points / Landmass Particles
      for (let i = 0; i < points.length; i++) {
        const pt = points[i];
        const currentLon = pt.lon + rotation;

        // 3D coordinates
        const x3d = globeRadius * Math.cos(pt.lat) * Math.sin(currentLon);
        const y3d = globeRadius * Math.sin(pt.lat);
        const z3d = globeRadius * Math.cos(pt.lat) * Math.cos(currentLon);

        // Apply axial tilt
        const yTilted = y3d * Math.cos(tilt) - z3d * Math.sin(tilt);
        const zTilted = y3d * Math.sin(tilt) + z3d * Math.cos(tilt);

        // Only draw front-facing points (with subtle wrap-around on rim)
        if (zTilted > -globeRadius * 0.05) {
          const depthAlpha = Math.pow((zTilted + globeRadius * 0.05) / (globeRadius * 1.05), 1.2);
          const screenX = centerX + x3d;
          const screenY = centerY + yTilted;

          ctx.beginPath();

          if (pt.isLand) {
            // Illuminated Landmass Node (Cyan / Azure Glow)
            const alpha = Math.min(1, depthAlpha * 0.75);
            ctx.fillStyle = `rgba(147, 197, 253, ${alpha})`;
            ctx.arc(screenX, screenY, pt.size * (0.8 + depthAlpha * 0.6), 0, Math.PI * 2);
            ctx.fill();

            // Occasional bright glowing capital nodes
            if (i % 38 === 0 && depthAlpha > 0.4) {
              ctx.fillStyle = `rgba(255, 255, 255, ${depthAlpha * 0.95})`;
              ctx.beginPath();
              ctx.arc(screenX, screenY, 2.2, 0, Math.PI * 2);
              ctx.fill();
            }
          } else {
            // Subtle Ocean Grid Point
            const alpha = Math.min(1, depthAlpha * 0.18);
            ctx.fillStyle = `rgba(59, 130, 246, ${alpha})`;
            ctx.arc(screenX, screenY, pt.size * 0.75, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // 5. High-Intensity Fresnel Rim Glow on Left/Top Limb
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, globeRadius, 0, Math.PI * 2);
      ctx.clip();

      const rimGlow = ctx.createRadialGradient(
        centerX - globeRadius * 0.5,
        centerY - globeRadius * 0.5,
        globeRadius * 0.4,
        centerX,
        centerY,
        globeRadius
      );
      rimGlow.addColorStop(0, 'rgba(0, 0, 0, 0)');
      rimGlow.addColorStop(0.75, 'rgba(19, 104, 230, 0.1)');
      rimGlow.addColorStop(0.92, 'rgba(96, 165, 250, 0.45)');
      rimGlow.addColorStop(1, 'rgba(255, 255, 255, 0.75)');

      ctx.fillStyle = rimGlow;
      ctx.fillRect(centerX - globeRadius, centerY - globeRadius, globeRadius * 2, globeRadius * 2);
      ctx.restore();

      // 6. Delicate Atmospheric Outer Ring Border
      ctx.beginPath();
      ctx.arc(centerX, centerY, globeRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(96, 165, 250, 0.35)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

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
        filter: 'blur(4px) contrast(1.15) brightness(0.9)',
        transform: 'scale(1.08)',
      }}
    />
  );
}
