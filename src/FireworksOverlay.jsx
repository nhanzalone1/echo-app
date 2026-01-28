import React, { useEffect, useRef } from 'react';
import { Fireworks } from 'fireworks-js';

export default function FireworksOverlay({ isActive, onComplete, duration = 7000 }) {
  const containerRef = useRef(null);
  const fireworksRef = useRef(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    // Initialize fireworks IMMEDIATELY with high-intensity configuration
    fireworksRef.current = new Fireworks(containerRef.current, {
      autoresize: true,
      opacity: 0.5,
      acceleration: 1.05,
      friction: 0.96,
      gravity: 1.2,
      particles: 60,
      traceLength: 3,
      traceSpeed: 10,
      explosion: 7,
      intensity: 20,
      flickering: 50,
      lineStyle: 'round',
      hue: {
        min: 0,
        max: 360
      },
      delay: {
        min: 15,
        max: 30
      },
      rocketsPoint: {
        min: 25,
        max: 75
      },
      lineWidth: {
        explosion: {
          min: 1,
          max: 4
        },
        trace: {
          min: 1,
          max: 2
        }
      },
      brightness: {
        min: 50,
        max: 80
      },
      decay: {
        min: 0.015,
        max: 0.03
      },
      mouse: {
        click: false,
        move: false,
        max: 1
      }
    });

    // Start immediately
    fireworksRef.current.start();

    // Fade out before stopping
    const fadeTimeout = setTimeout(() => {
      if (fireworksRef.current) {
        fireworksRef.current.updateOptions({ intensity: 5 });
      }
    }, duration - 1500);

    // Stop and cleanup
    const stopTimeout = setTimeout(() => {
      if (fireworksRef.current) {
        fireworksRef.current.stop();
        fireworksRef.current = null;
      }
      if (onComplete) onComplete();
    }, duration);

    return () => {
      clearTimeout(fadeTimeout);
      clearTimeout(stopTimeout);
      if (fireworksRef.current) {
        fireworksRef.current.stop();
        fireworksRef.current = null;
      }
    };
  }, [isActive, duration, onComplete]);

  if (!isActive) return null;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        background: 'transparent',
        pointerEvents: 'none'
      }}
    />
  );
}
