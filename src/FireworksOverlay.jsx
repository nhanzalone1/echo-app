import React, { useEffect, useRef } from 'react';
import { Fireworks } from 'fireworks-js';

export default function FireworksOverlay({ isActive, onComplete }) {
  const canvasRef = useRef(null);
  const fireworksRef = useRef(null);

  useEffect(() => {
    if (!isActive) return;

    console.log("Fireworks Component MOUNTED");

    if (!canvasRef.current) {
      console.log("Fireworks: Canvas ref is null!");
      return;
    }

    const canvas = canvasRef.current;

    // Force canvas to full viewport dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    console.log("Fireworks: Canvas dimensions set to:", canvas.width, "x", canvas.height);

    const initTimeout = setTimeout(() => {
      try {
        // Initialize fireworks directly on the canvas element
        fireworksRef.current = new Fireworks(canvas, {
          autoresize: true,
          opacity: 0.5,
          acceleration: 1.05,
          friction: 0.96,
          gravity: 1.2,
          particles: 80,
          traceLength: 3,
          traceSpeed: 10,
          explosion: 8,
          intensity: 30,
          flickering: 50,
          lineStyle: 'round',
          hue: { min: 0, max: 360 },
          delay: { min: 15, max: 30 },
          rocketsPoint: { min: 25, max: 75 },
          lineWidth: {
            explosion: { min: 2, max: 5 },
            trace: { min: 1, max: 3 }
          },
          brightness: { min: 50, max: 80 },
          decay: { min: 0.015, max: 0.03 },
          mouse: { click: false, move: false, max: 1 }
        });

        fireworksRef.current.start();
        console.log("Fireworks: Started on canvas!");

        // Verify it's running
        setTimeout(() => {
          console.log("Fireworks: isRunning =", fireworksRef.current?.isRunning);
        }, 500);

      } catch (err) {
        console.error("Fireworks ERROR:", err);
      }
    }, 50);

    // Auto-stop after 6 seconds
    const stopTimeout = setTimeout(() => {
      console.log("Fireworks: Stopping...");
      if (fireworksRef.current) {
        fireworksRef.current.stop();
        fireworksRef.current = null;
      }
      if (onComplete) onComplete();
    }, 6000);

    return () => {
      clearTimeout(initTimeout);
      clearTimeout(stopTimeout);
      if (fireworksRef.current) {
        fireworksRef.current.stop();
        fireworksRef.current = null;
      }
    };
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 2147483647,
        pointerEvents: 'none',
        background: 'transparent'
      }}
    />
  );
}
