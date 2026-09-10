import { useState, useEffect } from 'react';

interface ParallaxOffset {
  x: number;
  y: number;
}

/**
 * Lightweight, desktop-only hook for subtle background parallax.
 * Clamped to ±8px (X) and ±6px (Y).
 * Completely disabled on touch devices and when prefers-reduced-motion is active.
 */
export function useMouseParallax(maxX = 8, maxY = 6): ParallaxOffset {
  const [offset, setOffset] = useState<ParallaxOffset>({ x: 0, y: 0 });

  useEffect(() => {
    // Check for reduced motion preference
    if (typeof window === 'undefined') return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (prefersReducedMotion || isTouchDevice) {
      return;
    }

    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        const normalizedX = (e.clientX - centerX) / centerX;
        const normalizedY = (e.clientY - centerY) / centerY;

        setOffset({
          x: Math.max(-maxX, Math.min(maxX, normalizedX * maxX)),
          y: Math.max(-maxY, Math.min(maxY, normalizedY * maxY)),
        });
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [maxX, maxY]);

  return offset;
}
