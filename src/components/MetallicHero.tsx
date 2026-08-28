import React, { useEffect, useRef } from 'react';
import { PageRoute } from '../types';
import { motion } from 'motion/react';
import * as THREE from 'three';
import { ChevronDown } from 'lucide-react';

interface MetallicHeroProps {
  onNavigate?: (route: PageRoute) => void;
  onExploreClick?: () => void;
}

export function MetallicHero({ onNavigate, onExploreClick }: MetallicHeroProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Subtle mouse interaction for cinematic parallax
  const mouseRef = useRef({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // 1. Scene & Deep Cinematic Fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050507, 0.04);

    const fov = 38;
    const aspect = container.clientWidth / container.clientHeight;
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 0, 8.5);

    // 2. High-Precision Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      stencil: false,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.6;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // 3. Studio HDR Environment Map Generation (Tailored for razor-sharp edge glints)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color(0x020203);

    // Intense top key softbox for blade top specular streaks
    const keySoftbox = new THREE.Mesh(
      new THREE.PlaneGeometry(24, 10),
      new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })
    );
    keySoftbox.position.set(0, 12, 4);
    keySoftbox.lookAt(0, 0, 0);
    envScene.add(keySoftbox);

    // Back graze light strip for chain-of-pearls specular glints along the blade edges
    const rimLightStrip = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.15, 30, 16),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    rimLightStrip.position.set(4, 5, -3);
    rimLightStrip.rotation.z = Math.PI / 4;
    envScene.add(rimLightStrip);

    // Soft cool-silver fill light
    const fillSoftbox = new THREE.Mesh(
      new THREE.PlaneGeometry(16, 12),
      new THREE.MeshBasicMaterial({ color: 0x9cb4d8, side: THREE.DoubleSide })
    );
    fillSoftbox.position.set(-8, -6, 2);
    fillSoftbox.lookAt(0, 0, 0);
    envScene.add(fillSoftbox);

    const envRenderTarget = pmremGenerator.fromScene(envScene);
    scene.environment = envRenderTarget.texture;

    // 4. Create the Fin-Ribbed Metallic Turbine Helix / Slinky Coil Geometry
    // Matching the video: An array of hundreds of individual metallic blade fins
    // positioned along a dynamic, sweeping 3D torus knot / spiral spline.
    const FIN_COUNT = 340;
    
    // Sleek chamfered metallic blade geometry
    const bladeWidth = 0.055;
    const bladeHeight = 1.15;
    const bladeDepth = 0.42;
    const finGeometry = new THREE.BoxGeometry(bladeWidth, bladeHeight, bladeDepth);

    // Premium Dark Chrome / Graphite Titanium Material
    const finMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x1a1c22),
      metalness: 0.98,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      reflectivity: 1.0,
      iridescence: 0.25,
      iridescenceIOR: 1.55,
      envMapIntensity: 2.8,
    });

    const instancedFins = new THREE.InstancedMesh(finGeometry, finMaterial, FIN_COUNT);
    instancedFins.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(instancedFins);

    // 5. High-Contrast Studio Directional & Spot Lighting
    const keySpot = new THREE.SpotLight(0xffffff, 35, 50, Math.PI / 3.5, 0.35, 1.2);
    keySpot.position.set(0, 14, 8);
    scene.add(keySpot);

    const grazingRimLight = new THREE.DirectionalLight(0xffffff, 3.8);
    grazingRimLight.position.set(-5, 8, -6);
    scene.add(grazingRimLight);

    const edgeGlintLight = new THREE.PointLight(0xe2e8f0, 24, 25);
    edgeGlintLight.position.set(6, 4, 3);
    scene.add(edgeGlintLight);

    const blueGazeLight = new THREE.PointLight(0x2563eb, 10, 20);
    blueGazeLight.position.set(-8, -4, -2);
    scene.add(blueGazeLight);

    // 6. Atmospheric Floating Bokeh Light Particles (Extreme Macro Depth of Field)
    const particleCount = 180;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 22;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 18;
      particleScales[i] = Math.random() * 2.5 + 0.6;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('scale', new THREE.BufferAttribute(particleScales, 1));

    const particleMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0xdbeafe) },
      },
      vertexShader: `
        uniform float uTime;
        attribute float scale;
        varying float vAlpha;
        void main() {
          vec3 pos = position;
          pos.y += sin(uTime * 0.3 + position.x) * 0.35;
          pos.x += cos(uTime * 0.25 + position.y) * 0.35;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          
          float dist = -mvPosition.z;
          float bokeh = abs(dist - 6.5) * 0.65 + 1.0;
          gl_PointSize = scale * (26.0 / dist) * bokeh;
          
          vAlpha = smoothstep(20.0, 3.5, dist) * 0.55;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vAlpha;
        void main() {
          float d = length(gl_PointCoord - vec2(0.5));
          if (d > 0.5) discard;
          float intensity = smoothstep(0.5, 0.0, d);
          float core = smoothstep(0.18, 0.0, d) * 0.9;
          gl_FragColor = vec4(mix(uColor, vec3(1.0), core), (intensity * 0.6 + core) * vAlpha);
        }
      `,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // 7. Resize Observer
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // 8. Pre-allocated vectors for 60+ FPS zero-allocation render loop
    const pt = new THREE.Vector3();
    const ptNext = new THREE.Vector3();
    const upVector = new THREE.Vector3(0, 0, 1);
    const yUnitVector = new THREE.Vector3(0, 1, 0);
    const forwardVector = new THREE.Vector3();
    const sideVector = new THREE.Vector3();
    const normalVector = new THREE.Vector3();
    const sweepVector = new THREE.Vector3();
    const globalEuler = new THREE.Euler();
    const globalQuat = new THREE.Quaternion();
    const dummy = new THREE.Object3D();

    // Zero-allocation parametric 3D Knot Curve function
    const computeCurvePoint = (t: number, target: THREE.Vector3, radiusX = 2.8, radiusY = 2.0, radiusZ = 1.4) => {
      const p = 2;
      const q = 3;
      const phi = t * Math.PI * 2;
      
      const r = radiusX + Math.cos(q * phi) * 0.9;
      const x = r * Math.cos(p * phi);
      const y = r * Math.sin(p * phi);
      const z = Math.sin(q * phi) * radiusZ;
      target.set(x, y, z);
      return target;
    };

    // 9. Continuous Cinematic Animation Loop (Push, Zoom & Foreground Sweep)
    let animationFrameId: number;
    const clock = new THREE.Clock();
    let time = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      time += delta * 0.28; // Hypnotic cinematic flow rate

      // Mouse Parallax Smoothing
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;

      // =========================================================================
      // EXACT VIDEO MATCH CHOREOGRAPHY:
      // A sweeping loop of hundreds of metallic fins/slats that slowly flows and
      // rotates, sweeping across the foreground right past the lens with intense
      // edge reflections and dramatic depth of field.
      // =========================================================================
      
      const cycle = time * 0.35;

      // Macro Foreground Sweep & Position Transition
      const sweepX = Math.sin(cycle) * 2.6 + Math.sin(cycle * 1.8) * 0.4 + mouse.x * 0.6;
      const sweepY = Math.cos(cycle * 0.8) * 1.1 + Math.sin(cycle * 1.4) * 0.3 - mouse.y * 0.4;
      const sweepZ = Math.cos(cycle) * 3.4 + 1.1;
      sweepVector.set(sweepX, sweepY, sweepZ);

      // Global rotation of the entire fin assembly
      const rotX = time * 0.28 + Math.sin(cycle * 0.5) * 0.35 + mouse.y * 0.25;
      const rotY = time * 0.42 + cycle * 0.2 + mouse.x * 0.35;
      const rotZ = Math.sin(time * 0.22) * 0.4;

      globalEuler.set(rotX, rotY, rotZ, 'XYZ');
      globalQuat.setFromEuler(globalEuler);

      // Flow offset along the curve to make the blades continuously travel/ripple
      const flowOffset = (time * 0.08) % 1.0;

      // Update every single fin blade transformation along the 3D curve without memory allocations
      for (let i = 0; i < FIN_COUNT; i++) {
        const t = (i / FIN_COUNT + flowOffset) % 1.0;
        const nextT = ((i + 1) / FIN_COUNT + flowOffset) % 1.0;

        computeCurvePoint(t, pt);
        computeCurvePoint(nextT, ptNext);

        // Tangent vector
        forwardVector.subVectors(ptNext, pt).normalize();
        sideVector.crossVectors(forwardVector, upVector).normalize();
        normalVector.crossVectors(sideVector, forwardVector).normalize();

        // Apply local rotation and position
        dummy.position.copy(pt);

        // Orient blade to follow the curve with fan-like blade tilt
        const bladeTilt = Math.sin(t * Math.PI * 6 + time * 0.5) * 0.15;
        dummy.quaternion.setFromUnitVectors(yUnitVector, normalVector);
        dummy.rotateOnAxis(forwardVector, bladeTilt);
        dummy.rotateOnAxis(yUnitVector, Math.PI / 2);

        // Apply global sweep & rotation to dummy
        dummy.position.applyQuaternion(globalQuat);
        dummy.position.add(sweepVector);

        // Proximity scale expansion (monumental scale as it passes close to camera)
        const proximity = Math.max(0, (sweepZ + 2.0) / 6.0);
        const scaleMult = 1.0 + Math.pow(proximity, 1.4) * 0.45;
        dummy.scale.set(scaleMult, scaleMult, scaleMult);

        dummy.updateMatrix();
        instancedFins.setMatrixAt(i, dummy.matrix);
      }

      instancedFins.instanceMatrix.needsUpdate = true;

      // Dynamic Camera Push / Zoom Tracking
      const cameraPushZ = 8.0 - Math.sin(cycle * 0.5) * 1.8;
      const cameraTiltX = Math.sin(cycle * 0.55) * 0.5 + mouse.x * 0.35;
      const cameraTiltY = Math.cos(cycle * 0.45) * 0.25 + mouse.y * 0.25;

      camera.position.set(cameraTiltX, cameraTiltY, cameraPushZ);
      camera.lookAt(sweepX * 0.22, sweepY * 0.22, 0);

      // Orbiting Key Lights to make specular glints glide along blade tips
      keySpot.position.x = Math.sin(time * 0.8) * 12;
      keySpot.position.y = Math.cos(time * 0.6) * 10 + 6;
      keySpot.position.z = Math.sin(time * 0.4) * 8 + 6;

      edgeGlintLight.position.x = Math.cos(time * 1.1) * 9 + 2;
      edgeGlintLight.position.y = Math.sin(time * 0.7) * 7 - 1;

      // Update particle uniforms
      particleMaterial.uniforms.uTime.value = time;
      particles.rotation.y = time * 0.025;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      pmremGenerator.dispose();
      envRenderTarget.dispose();
      finGeometry.dispose();
      finMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  // Subtle Mouse Parallax Handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    mouseRef.current.targetX = nx;
    mouseRef.current.targetY = ny;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        mouseRef.current.targetX = 0;
        mouseRef.current.targetY = 0;
      }}
      className="relative w-full min-h-[calc(100vh+120px)] h-[calc(100vh+120px)] bg-[#020205] flex items-center justify-center overflow-hidden select-none px-6"
    >
      {/* 3D WebGL Metallic Canvas Layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-0 pointer-events-auto"
      />

      {/* Atmospheric Cinematic Gradients (Vignette & Deep Contrast) */}
      <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_25%,rgba(2,2,5,0.8)_100%] pointer-events-none z-[1]" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#000000] via-[#000000]/70 to-transparent pointer-events-none z-[1]" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#000000]/85 to-transparent pointer-events-none z-[1]" />

      {/* Optical Specular Sheen Glow Overlay */}
      <div className="absolute inset-0 pointer-events-none z-[2] mix-blend-screen opacity-35 bg-[radial-gradient(ellipse_80%_50%_at_50%_45%,rgba(19,104,230,0.18),transparent_70%)]" />

      {/* Clean Hero Headline Overlay (Matching Video Aesthetic) */}
      <div className="relative z-10 text-center max-w-5xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-center pointer-events-none">
        
        {/* Monumental Centered Headline */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.12,
                delayChildren: 0.35,
              },
            },
          }}
          className="space-y-2"
        >
          <div className="flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-4 md:gap-x-5 gap-y-2">
            {['Building', 'experiences', 'from', 'scratch'].map((word, index) => (
              <span key={index} className="inline-block overflow-hidden py-1">
                <motion.span
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: '115%',
                      filter: 'blur(8px)',
                    },
                    visible: {
                      opacity: 1,
                      y: '0%',
                      filter: 'blur(0px)',
                      transition: {
                        duration: 0.9,
                        ease: [0.16, 1, 0.3, 1],
                      },
                    },
                  }}
                  className="inline-block text-[34px] sm:text-[46px] md:text-[56px] lg:text-[66px] font-bold tracking-tight text-white leading-tight drop-shadow-[0_4px_32px_rgba(0,0,0,0.9)]"
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Subtle Scroll Down Indicator (Bottom Center) */}
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 text-white/40 hover:text-white/80 transition-colors pointer-events-auto cursor-pointer"
        onClick={() => {
          window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth',
          });
        }}
      >
        <span className="text-[10px] font-mono tracking-widest uppercase text-white/50">Scroll to Explore</span>
        <ChevronDown className="w-4 h-4 text-[#1368e6]" />
      </motion.div>
    </div>
  );
}
