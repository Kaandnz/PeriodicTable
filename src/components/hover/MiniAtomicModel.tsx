"use client";

import React, { useEffect, useRef } from "react";
import { ElementData } from "@/types/element";
import { ELEMENT_CATEGORIES } from "@/data/categories";

interface MiniAtomicModelProps {
  element: ElementData;
  size?: number; // width/height in px
}

export function MiniAtomicModel({ element, size = 160 }: MiniAtomicModelProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const centerX = size / 2;
    const centerY = size / 2;
    const categoryInfo = ELEMENT_CATEGORIES[element.category] || ELEMENT_CATEGORIES["unknown-properties"];
    const accentColor = categoryInfo.color;

    // Shell configuration (max 7 shells)
    const shells = element.shells || [element.atomicNumber];
    const maxRadius = (size / 2) - 12;
    const minRadius = 18;
    const radiusStep = shells.length > 1 ? (maxRadius - minRadius) / (shells.length - 1) : 0;

    // Particle angle trackers
    const angles = shells.map((count) => {
      const step = (Math.PI * 2) / count;
      return Array.from({ length: count }, (_, i) => i * step);
    });

    let animationFrameId: number;
    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, size, size);

      // 1. Draw central nucleus with gentle Brownian wobble
      const wobbleX = prefersReducedMotion ? 0 : Math.sin(time * 0.05) * 0.8;
      const wobbleY = prefersReducedMotion ? 0 : Math.cos(time * 0.07) * 0.8;

      // Nucleus glow
      const nucleusGrad = ctx.createRadialGradient(
        centerX + wobbleX,
        centerY + wobbleY,
        1,
        centerX + wobbleX,
        centerY + wobbleY,
        10
      );
      nucleusGrad.addColorStop(0, accentColor);
      nucleusGrad.addColorStop(1, "transparent");
      ctx.fillStyle = nucleusGrad;
      ctx.beginPath();
      ctx.arc(centerX + wobbleX, centerY + wobbleY, 10, 0, Math.PI * 2);
      ctx.fill();

      // Nucleus core bead
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(centerX + wobbleX, centerY + wobbleY, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // 2. Draw electron shells and moving electrons
      shells.forEach((electronCount, shellIdx) => {
        const radius = minRadius + shellIdx * radiusStep;
        const speed = prefersReducedMotion ? 0 : (0.015 / (shellIdx + 1)) * (shellIdx % 2 === 0 ? 1 : -1);

        // Orbital ring
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.09)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Electrons on this ring
        const ringAngles = angles[shellIdx];
        for (let i = 0; i < ringAngles.length; i++) {
          if (!prefersReducedMotion) {
            ringAngles[i] += speed;
          }
          const angle = ringAngles[i];
          const ex = centerX + Math.cos(angle) * radius;
          const ey = centerY + Math.sin(angle) * radius;

          // Electron glow
          ctx.beginPath();
          ctx.arc(ex, ey, 3, 0, Math.PI * 2);
          ctx.fillStyle = accentColor;
          ctx.shadowColor = accentColor;
          ctx.shadowBlur = 6;
          ctx.fill();

          // Electron bright core
          ctx.shadowBlur = 0;
          ctx.beginPath();
          ctx.arc(ex, ey, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = "#ffffff";
          ctx.fill();
        }
      });

      time += 1;
      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [element, size]);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <canvas ref={canvasRef} style={{ width: size, height: size }} />
    </div>
  );
}
