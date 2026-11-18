import React, { useEffect, useRef } from 'react';

/**
 * Procedural "Growing Biosphere" Filling Timer Background
 * An organic canvas animation where forest canopy, climbing vines, 
 * unfurling leaves, wildflowers, and spores rise to fill the screen as time progresses.
 *
 * Optimized for rock-solid 60 FPS performance:
 * - Ref-based state updates prevent effect re-runs, eliminating particle reset hitching
 * - Smooth lerp interpolation for liquid soil/water fill level
 * - High-DPI screen scaling (devicePixelRatio)
 * - WCAG prefers-reduced-motion compliance
 */
export default function BiosphereTimerBackground({ progress = 0, isUrgent = false, stage = 'spot', theme = 'solarpunk' }) {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  // Maintain refs so the animation loop runs continuously at 60 FPS without tearing down
  const progressRef = useRef(progress);
  progressRef.current = progress;
  const isUrgentRef = useRef(isUrgent);
  isUrgentRef.current = isUrgent;
  const stageRef = useRef(stage);
  stageRef.current = stage;
  const themeRef = useRef(theme);
  themeRef.current = theme;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const dpr = window.devicePixelRatio || 1;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const setCanvasSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      if (ctx.scale) {
        ctx.setTransform?.(dpr, 0, 0, dpr, 0, 0);
      }
    };

    setCanvasSize();

    const handleResize = () => {
      setCanvasSize();
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Procedural spores & floating flora seeds (initialized once, no hitching)
    const spores = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 1.5 + Math.random() * 3,
      speedY: 0.3 + Math.random() * 0.9,
      speedX: (Math.random() - 0.5) * 0.6,
      opacity: 0.2 + Math.random() * 0.6,
      hue: 90 + Math.random() * 50,
      phase: Math.random() * Math.PI * 2,
    }));

    // Fixed trunk/vine anchors for consistent organic growth
    const vines = [
      { xPct: 0.08, swaySpeed: 0.0015, curve: -40, maxBranch: 5, flowerColor: '#ffb3ba' },
      { xPct: 0.22, swaySpeed: 0.002, curve: 35, maxBranch: 4, flowerColor: '#ffffba' },
      { xPct: 0.38, swaySpeed: 0.0018, curve: -25, maxBranch: 6, flowerColor: '#baffc9' },
      { xPct: 0.52, swaySpeed: 0.0014, curve: 30, maxBranch: 5, flowerColor: '#bae1ff' },
      { xPct: 0.68, swaySpeed: 0.0022, curve: -35, maxBranch: 6, flowerColor: '#ffdfba' },
      { xPct: 0.82, swaySpeed: 0.0017, curve: 25, maxBranch: 4, flowerColor: '#e8baff' },
      { xPct: 0.94, swaySpeed: 0.0019, curve: -30, maxBranch: 5, flowerColor: '#ffffba' },
    ];

    let time = 0;
    let smoothedProgress = progressRef.current;

    const render = () => {
      const urgent = isUrgentRef.current;
      const targetProgress = Math.min(1, Math.max(0, progressRef.current));
      
      // Smooth lerp interpolation for liquid fill level (butter smooth at 60 FPS)
      smoothedProgress += (targetProgress - smoothedProgress) * 0.08;

      if (!prefersReducedMotion) {
        time += 0.02;
      }

      ctx.clearRect(0, 0, width, height);

      // 1. Atmospheric Deep Eco Gradient Base
      const currentTheme = themeRef.current;
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      if (urgent) {
        bgGrad.addColorStop(0, '#0f241a');
        bgGrad.addColorStop(0.7, '#1b382b');
        bgGrad.addColorStop(1, '#3b2512'); // Amber soil glow when urgent
      } else if (currentTheme === 'hydro-droplet') {
        bgGrad.addColorStop(0, '#041c26');
        bgGrad.addColorStop(0.5, '#062633');
        bgGrad.addColorStop(1, '#02121a');
      } else if (currentTheme === 'clay-pebble' || currentTheme === 'stone') {
        bgGrad.addColorStop(0, '#14241b');
        bgGrad.addColorStop(0.5, '#0e1c14');
        bgGrad.addColorStop(1, '#08120c');
      } else if (currentTheme === 'herbarium' || currentTheme === 'papercraft') {
        bgGrad.addColorStop(0, '#1c2820');
        bgGrad.addColorStop(0.5, '#141d17');
        bgGrad.addColorStop(1, '#0c120e');
      } else {
        bgGrad.addColorStop(0, '#061a12');
        bgGrad.addColorStop(0.5, '#0b261a');
        bgGrad.addColorStop(1, '#0e2f20');
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Liquid Biosphere Water/Soil Level Indicator
      const fillHeight = height * Math.min(1, Math.max(0, smoothedProgress));
      const targetWaterY = height - fillHeight;

      // Draw subtle topographic bio-contour fills behind
      ctx.save();
      const waveGrad = ctx.createLinearGradient(0, targetWaterY, 0, height);
      if (urgent) {
        waveGrad.addColorStop(0, 'rgba(217, 119, 6, 0.22)');
        waveGrad.addColorStop(0.4, 'rgba(16, 185, 129, 0.28)');
        waveGrad.addColorStop(1, 'rgba(5, 150, 105, 0.45)');
      } else if (currentTheme === 'hydro-droplet') {
        waveGrad.addColorStop(0, 'rgba(56, 189, 248, 0.28)');
        waveGrad.addColorStop(0.4, 'rgba(6, 182, 212, 0.35)');
        waveGrad.addColorStop(1, 'rgba(2, 132, 199, 0.52)');
      } else if (currentTheme === 'clay-pebble' || currentTheme === 'stone') {
        waveGrad.addColorStop(0, 'rgba(132, 204, 22, 0.22)');
        waveGrad.addColorStop(0.4, 'rgba(16, 185, 129, 0.3)');
        waveGrad.addColorStop(1, 'rgba(4, 120, 87, 0.45)');
      } else if (currentTheme === 'herbarium' || currentTheme === 'papercraft') {
        waveGrad.addColorStop(0, 'rgba(217, 119, 6, 0.2)');
        waveGrad.addColorStop(0.4, 'rgba(21, 128, 61, 0.32)');
        waveGrad.addColorStop(1, 'rgba(120, 53, 15, 0.45)');
      } else {
        waveGrad.addColorStop(0, 'rgba(52, 211, 153, 0.22)');
        waveGrad.addColorStop(0.4, 'rgba(6, 182, 212, 0.25)');
        waveGrad.addColorStop(1, 'rgba(4, 120, 87, 0.42)');
      }

      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(0, targetWaterY);
      
      // Gentle sine wave surface (static if reduced motion)
      for (let x = 0; x <= width; x += 30) {
        const wave = prefersReducedMotion 
          ? 0 
          : Math.sin(x * 0.008 + time) * 12 + Math.cos(x * 0.003 - time * 0.8) * 6;
        ctx.lineTo(x, targetWaterY + wave);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fillStyle = waveGrad;
      ctx.fill();
      ctx.restore();

      // 3. Sun Rays / Canopy Light shafts
      ctx.save();
      const sunGrad = ctx.createRadialGradient(width * 0.5, 0, 10, width * 0.5, height * 0.6, width * 0.8);
      sunGrad.addColorStop(0, urgent ? 'rgba(251, 191, 36, 0.15)' : 'rgba(167, 243, 208, 0.08)');
      sunGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = sunGrad;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      // 4. Procedural Growing Vines and Tree Saplings
      vines.forEach((vine, vIdx) => {
        const rootX = vine.xPct * width;
        const currentGrowHeight = fillHeight * (0.85 + Math.sin(vIdx * 2) * 0.2);
        if (currentGrowHeight <= 10) return;

        const vineTopY = height - currentGrowHeight;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(rootX, height);

        // Calculate sway influenced by mouse distance
        const dx = rootX - mouseRef.current.x;
        const dy = (height - currentGrowHeight * 0.5) - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const mouseRepel = dist < 220 ? (1 - dist / 220) * (dx > 0 ? 35 : -35) : 0;

        const cpX = rootX + vine.curve + (prefersReducedMotion ? 0 : Math.sin(time * 0.7 + vIdx) * 18) + mouseRepel;
        const cpY = height - currentGrowHeight * 0.5;
        const tipX = rootX + (vine.curve * 0.5) + (prefersReducedMotion ? 0 : Math.cos(time + vIdx) * 12) + mouseRepel * 1.3;

        ctx.quadraticCurveTo(cpX, cpY, tipX, vineTopY);

        ctx.strokeStyle = urgent ? 'rgba(180, 140, 60, 0.75)' : 'rgba(52, 211, 153, 0.7)';
        ctx.lineWidth = Math.max(2, 6 * (1 - currentGrowHeight / (height * 1.2)));
        ctx.lineCap = 'round';
        ctx.stroke();

        // Draw side leaves along the stem
        const leafSteps = Math.min(10, Math.floor(currentGrowHeight / 65));
        for (let l = 1; l <= leafSteps; l++) {
          const tRatio = l / (leafSteps + 1);
          const lx = (1 - tRatio) * (1 - tRatio) * rootX + 2 * (1 - tRatio) * tRatio * cpX + tRatio * tRatio * tipX;
          const ly = (1 - tRatio) * (1 - tRatio) * height + 2 * (1 - tRatio) * tRatio * cpY + tRatio * tRatio * vineTopY;

          const side = (l + vIdx) % 2 === 0 ? 1 : -1;
          const leafLen = 14 + (prefersReducedMotion ? 0 : Math.sin(l + time) * 3);
          const angle = (prefersReducedMotion ? 0 : Math.sin(time * 1.2 + l) * 0.2) + (side * 0.8);

          ctx.save();
          ctx.translate(lx, ly);
          ctx.rotate(angle);

          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(leafLen * 0.4, -leafLen * 0.5 * side, leafLen * 0.8, -leafLen * 0.3 * side, leafLen, 0);
          ctx.bezierCurveTo(leafLen * 0.8, leafLen * 0.3 * side, leafLen * 0.4, leafLen * 0.5 * side, 0, 0);

          ctx.fillStyle = urgent
            ? `rgba(${200 + side * 30}, ${160 + l * 8}, 60, 0.85)`
            : `rgba(${30 + l * 5}, ${160 + l * 8}, ${90 + side * 20}, 0.85)`;
          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(leafLen * 0.85, 0);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.restore();
        }

        // Flower blossom at tip if vine has grown significantly
        if (smoothedProgress > 0.35) {
          const blossomSize = Math.min(12, (smoothedProgress - 0.35) * 20);
          ctx.save();
          ctx.translate(tipX, vineTopY);
          for (let p = 0; p < 5; p++) {
            const petAng = (p * Math.PI * 2) / 5 + (prefersReducedMotion ? 0 : time * 0.5);
            ctx.beginPath();
            ctx.arc(
              Math.cos(petAng) * blossomSize * 0.6,
              Math.sin(petAng) * blossomSize * 0.6,
              blossomSize * 0.45,
              0,
              Math.PI * 2
            );
            ctx.fillStyle = vine.flowerColor;
            ctx.globalAlpha = 0.8;
            ctx.fill();
          }
          ctx.beginPath();
          ctx.arc(0, 0, blossomSize * 0.3, 0, Math.PI * 2);
          ctx.fillStyle = '#fef08a';
          ctx.globalAlpha = 0.95;
          ctx.fill();
          ctx.restore();
        }

        ctx.restore();
      });

      // 5. Floating Spores & Nature Dust Particles
      if (!prefersReducedMotion) {
        spores.forEach((spore) => {
          spore.y -= spore.speedY;
          spore.x += spore.speedX + Math.sin(time + spore.phase) * 0.3;

          if (spore.y < 0) {
            spore.y = height + 10;
            spore.x = Math.random() * width;
          }

          ctx.beginPath();
          ctx.arc(spore.x, spore.y, spore.size, 0, Math.PI * 2);
          ctx.fillStyle = urgent
            ? `hsla(45, 90%, 65%, ${spore.opacity})`
            : `hsla(${spore.hue}, 80%, 70%, ${spore.opacity})`;
          ctx.fill();
        });
      }

      // 6. Top Timer Wave Edge Particle Glistening
      const surfaceY = targetWaterY;
      if (surfaceY > 0 && surfaceY < height && !prefersReducedMotion) {
        ctx.save();
        for (let i = 0; i < 12; i++) {
          const sparkX = ((i * 137.5 + time * 60) % width);
          const sparkY = surfaceY + Math.sin(sparkX * 0.01 + time) * 10;
          ctx.beginPath();
          ctx.arc(sparkX, sparkY, 2 + Math.sin(time * 3 + i) * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = urgent ? 'rgba(253, 224, 71, 0.8)' : 'rgba(167, 243, 208, 0.75)';
          ctx.fill();
        }
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []); // Run effect once on mount for rock-solid 60 FPS animation

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
