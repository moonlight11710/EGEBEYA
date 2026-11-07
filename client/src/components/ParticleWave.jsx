import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function ParticleWave() {
  const canvasRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let isVisible = true;
    let width = (canvas.width = canvas.parentElement.offsetWidth);
    let height = (canvas.height = canvas.parentElement.offsetHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Pause rendering when canvas is scrolled out of viewport for ultra-smooth scrolling
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !animationFrameId) {
          animationFrameId = requestAnimationFrame(render);
        } else if (!isVisible && animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    // Optimized particle grid parameters (balanced fidelity and smooth 60fps)
    const cols = 46;
    const rows = 30;
    let step = 0;

    // Pre-allocated styles to prevent per-frame string allocations
    const rgbPrefix = isDark ? '226, 232, 240' : '30, 41, 59';
    const numBuckets = 5;
    const bucketColors = [
      `rgba(${rgbPrefix}, 0.08)`,
      `rgba(${rgbPrefix}, 0.16)`,
      `rgba(${rgbPrefix}, 0.24)`,
      `rgba(${rgbPrefix}, 0.32)`,
      `rgba(${rgbPrefix}, 0.40)`,
    ];

    const render = () => {
      if (!isVisible) return;

      ctx.clearRect(0, 0, width, height);

      step += 0.012;

      // Create batched paths for each opacity tier
      const paths = [
        new Path2D(),
        new Path2D(),
        new Path2D(),
        new Path2D(),
        new Path2D(),
      ];

      for (let i = 0; i < cols; i++) {
        const u = i / cols;
        const angle1 = u * Math.PI * 3 + step;
        const cosU = Math.cos(u * Math.PI * 2 - step * 0.6);
        const xOffset = width * 0.25 + u * width * 0.85;

        for (let j = 0; j < rows; j++) {
          const v = j / rows;
          const angle2 = v * Math.PI * 2.5 + step * 0.8;
          const wave = Math.sin(angle1) * Math.cos(angle2);
          const wave2 = cosU * Math.sin(v * Math.PI * 3);

          const x = xOffset + (v - 0.5) * 120;
          const baseY = height * 0.42 + (v - 0.5) * height * 0.65;
          const y = baseY + wave * 90 + wave2 * 45;

          const z = (Math.sin(angle1 + angle2) + 1) * 0.5;
          const radius = 0.8 + z * 1.6;
          const rawAlpha = (0.05 + z * 0.35) * (1 - Math.abs(v - 0.5) * 1.2);

          if (rawAlpha > 0.02 && x >= 0 && x <= width && y >= 0 && y <= height) {
            // Map rawAlpha to bucket 0..4
            const bIndex = Math.min(
              numBuckets - 1,
              Math.max(0, Math.floor((rawAlpha / 0.4) * numBuckets))
            );
            paths[bIndex].moveTo(x + radius, y);
            paths[bIndex].arc(x, y, radius, 0, Math.PI * 2);
          }
        }
      }

      // 5 draw calls total instead of thousands!
      for (let b = 0; b < numBuckets; b++) {
        ctx.fillStyle = bucketColors[b];
        ctx.fill(paths[b]);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{ willChange: 'transform', transform: 'translateZ(0)' }}
    />
  );
}
