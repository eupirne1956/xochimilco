import React, { useEffect, useRef } from "react";

/**
 * NatureMagazineCanvas
 * An elegant, high-perf dynamic HTML5 canvas that programmatically renders:
 * - Over-the-shoulder view of a female scientist in a white coat.
 * - Deep, glowing laboratory background (blurred amber & green beakers).
 * - A central beautifully-detailed magazine resting on a bench with highly saturated orange, purple, and radiant yellow drug design diagrams.
 * - Hands clad in subtle blue nitrile gloves holding the textured paper.
 * - Multi-colored swirling kinetic energy particles and glowing molecules.
 */
export const NatureMagazineCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.offsetWidth || 400);
    let height = (canvas.height = canvas.offsetHeight || 200);

    // Particle system representing kinetic molecular energy
    const particles: {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      alpha: number;
      pulseSpeed: number;
    }[] = [];

    const colors = [
      "rgba(249, 115, 22, 0.8)", // Orange
      "rgba(168, 85, 247, 0.8)",  // Purple
      "rgba(234, 179, 8, 0.8)",   // Yellow
      "rgba(6, 182, 212, 0.8)",   // Cyan
    ];

    for (let i = 0; i < 28; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.5 + 1,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4 - 0.2, // Drifts upwards slightly
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.3,
        pulseSpeed: Math.random() * 0.05 + 0.01,
      });
    }

    let frame = 0;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || 400;
      height = canvas.height = canvas.offsetHeight || 200;
    };

    window.addEventListener("resize", handleResize);

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // --- 1. Background: Deep Lab Shadows + Glowing Beakers (Out of Focus) ---
      // Left beaker: glowing emerald green
      const greenGlow = ctx.createRadialGradient(
        width * 0.15,
        height * 0.4,
        0,
        width * 0.15,
        height * 0.4,
        height * 0.5
      );
      greenGlow.addColorStop(0, "rgba(16, 185, 129, 0.25)");
      greenGlow.addColorStop(0.5, "rgba(16, 185, 129, 0.08)");
      greenGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = greenGlow;
      ctx.fillRect(0, 0, width, height);

      // Right/Center beaker: glowing amber/orange
      const amberGlow = ctx.createRadialGradient(
        width * 0.8,
        height * 0.3,
        0,
        width * 0.8,
        height * 0.3,
        height * 0.6
      );
      amberGlow.addColorStop(0, "rgba(245, 158, 11, 0.22)");
      amberGlow.addColorStop(0.5, "rgba(239, 68, 68, 0.07)");
      amberGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = amberGlow;
      ctx.fillRect(0, 0, width, height);

      // Ambient radial darkness vignetting
      const darkGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        width * 0.3,
        width / 2,
        height / 2,
        width * 0.8
      );
      darkGrad.addColorStop(0, "rgba(15, 23, 42, 0.1)");
      darkGrad.addColorStop(1, "rgba(2, 6, 23, 0.95)");
      ctx.fillStyle = darkGrad;
      ctx.fillRect(0, 0, width, height);

      // --- 2. The Science Magazine resting on the dark bench (Perspective) ---
      // We will draw a rectangular page in perspective, tilted on the table
      const pageX = width * 0.3;
      const pageY = height * 0.42;
      const pageW = width * 0.42;
      const pageH = height * 0.45;

      ctx.save();
      // Apply slight tilt/perspective
      ctx.translate(pageX + pageW / 2, pageY + pageH / 2);
      ctx.rotate(-0.06); // Sleek slight tilt
      ctx.translate(-(pageX + pageW / 2), -(pageY + pageH / 2));

      // Draw the magazine paper backplate with fine shadow
      ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
      ctx.shadowBlur = 12;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 4;
      ctx.fillStyle = "rgba(24, 24, 27, 0.9)"; // Dark sleek paper borders
      ctx.strokeStyle = "rgba(249, 115, 22, 0.35)";
      ctx.lineWidth = 1;
      
      // Draw tilted rounded booklet card
      ctx.beginPath();
      ctx.roundRect(pageX, pageY, pageW, pageH, 4);
      ctx.fill();
      ctx.stroke();
      ctx.shadowColor = "transparent"; // Reset shadow

      // Draw paper inner cover: A magnificent explosion of color
      // Vibrant gradient (purples, deep oranges, radiant yellows)
      const coverGrad = ctx.createLinearGradient(pageX, pageY, pageX + pageW, pageY + pageH);
      coverGrad.addColorStop(0, "#4c1d95"); // Deep rich purple
      coverGrad.addColorStop(0.3, "#c084fc"); // Vivid purple transition
      coverGrad.addColorStop(0.6, "#f97316"); // Saturated orange
      coverGrad.addColorStop(1, "#facc15"); // Radiant yellow
      ctx.fillStyle = coverGrad;
      ctx.beginPath();
      ctx.roundRect(pageX + 4, pageY + 4, pageW - 8, pageH - 8, 2);
      ctx.fill();

      // Magazine Headline text "NATURE" or "BIOACTIVE"
      ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
      ctx.font = "bold 13px 'Space Grotesk', system-ui, sans-serif";
      ctx.fillText("NATURE", pageX + 10, pageY + 18);
      
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      ctx.font = "500 6px monospace";
      ctx.fillText("SPECIAL ISSUE ON BIOACTIVES", pageX + 10, pageY + 25);

      // Draw a highly saturated drug design molecular overlay on the cover
      ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
      ctx.lineWidth = 1.2;
      // Drawing a miniature hexagon network
      const drawHex = (cx: number, cy: number, r: number) => {
        ctx.beginPath();
        for (let s = 0; s < 6; s++) {
          const angle = (Math.PI / 3) * s;
          const x = cx + r * Math.cos(angle);
          const y = cy + r * Math.sin(angle);
          if (s === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
      };

      // Drawing three connected beautiful rings
      const centerHexX = pageX + pageW * 0.6;
      const centerHexY = pageY + pageH * 0.55;
      
      ctx.save();
      // Add subtle glow to the molecular lines
      ctx.shadowColor = "#facc15";
      ctx.shadowBlur = 6;
      ctx.strokeStyle = "#ffffff";
      drawHex(centerHexX, centerHexY, 15);
      
      ctx.shadowColor = "#f97316";
      ctx.strokeStyle = "rgba(252, 211, 77, 0.9)";
      drawHex(centerHexX + 22, centerHexY + 8, 12);

      ctx.strokeStyle = "rgba(192, 132, 252, 0.9)";
      ctx.shadowColor = "#c084fc";
      drawHex(centerHexX - 18, centerHexY - 12, 10);
      
      // Dynamic pulsing atom balls on the vertices
      const pulseRadius = Math.abs(Math.sin(frame * 0.05)) * 2 + 2;
      ctx.fillStyle = "#facc15";
      ctx.beginPath();
      ctx.arc(centerHexX + 15, centerHexY, pulseRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(centerHexX - 9, centerHexY - 15, 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#22d3ee";
      ctx.beginPath();
      ctx.arc(centerHexX + 22 + 12, centerHexY + 8, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Simple grid lines simulating botanical/microscopy data layout
      ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(pageX + 10, pageY + pageH * 0.8);
      ctx.lineTo(pageX + pageW - 10, pageY + pageH * 0.8);
      ctx.stroke();

      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.font = "italic 6px serif";
      ctx.fillText("Fig 4.2: Phytochemical Margin of Safety (MoS)", pageX + 10, pageY + pageH * 0.91);

      ctx.restore();

      // --- 3. Female Scientist Silhouette (Over-the-shoulder perspective) ---
      // The shoulder comes from the lower-left, leaning forward
      ctx.save();
      
      // Draw white lab coat shoulder
      ctx.fillStyle = "rgba(226, 232, 240, 0.85)"; // Off-white/Slate-100 representing lab coat
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height);
      // Curve up to form shoulder hump
      ctx.bezierCurveTo(width * 0.08, height * 0.65, width * 0.18, height * 0.68, width * 0.28, height);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Scientist collar line
      ctx.strokeStyle = "rgba(203, 213, 225, 0.9)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(width * 0.15, height * 0.75);
      ctx.lineTo(width * 0.22, height * 0.82);
      ctx.lineTo(width * 0.25, height);
      ctx.stroke();

      // Black hair / Head silhouette coming from top-left, peering down
      ctx.fillStyle = "rgba(9, 9, 11, 0.92)"; // Dark elegant hair
      ctx.beginPath();
      ctx.arc(width * 0.08, height * 0.25, 42, 0, Math.PI * 2);
      ctx.fill();

      // Soft beautiful ponytail curl
      ctx.beginPath();
      ctx.ellipse(width * 0.06, height * 0.45, 12, 28, Math.PI / 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // --- 4. Hands Clad in Subtle Blue Nitrile Gloves (Gently holding paper) ---
      ctx.save();
      // Left hand holding paper from lower left edge
      ctx.fillStyle = "rgba(56, 189, 248, 0.85)"; // Vibrant nitrile blue
      ctx.strokeStyle = "rgba(14, 165, 233, 1)";
      ctx.lineWidth = 1.2;
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
      ctx.shadowBlur = 4;

      // Draw glove thumb and palm overlapping page edge
      ctx.beginPath();
      ctx.ellipse(pageX + 4, pageY + pageH * 0.6, 7, 11, Math.PI / 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Draw subtle finger lines
      ctx.beginPath();
      ctx.roundRect(pageX - 2, pageY + pageH * 0.62, 10, 4, 2);
      ctx.fill();
      ctx.stroke();

      // Right hand holding paper from lower right edge
      ctx.beginPath();
      ctx.ellipse(pageX + pageW - 4, pageY + pageH * 0.75, 8, 10, -Math.PI / 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      ctx.beginPath();
      ctx.roundRect(pageX + pageW - 12, pageY + pageH * 0.77, 11, 4, 1.5);
      ctx.fill();
      ctx.stroke();

      ctx.restore();

      // --- 5. Kinetic overlay of swirling magical particles ---
      ctx.save();
      particles.forEach((p) => {
        // Pulse alpha gently
        p.alpha += p.pulseSpeed;
        if (p.alpha > 0.8 || p.alpha < 0.2) p.pulseSpeed = -p.pulseSpeed;
        p.alpha = Math.max(0.1, Math.min(0.9, p.alpha));

        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap particles
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Draw particle dot with customized radial halo
        const dotGlow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3.5);
        dotGlow.addColorStop(0, p.color);
        dotGlow.addColorStop(0.4, p.color.replace("0.8", (p.alpha * 0.3).toFixed(2)));
        dotGlow.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = dotGlow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3.5, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      // --- 6. Volumetric solar light ray streaks filtering from top-right ---
      ctx.save();
      const lightGrad = ctx.createLinearGradient(width * 0.8, 0, width * 0.3, height);
      lightGrad.addColorStop(0, "rgba(253, 224, 71, 0.15)"); // warm gold sunray
      lightGrad.addColorStop(0.5, "rgba(249, 115, 22, 0.05)");
      lightGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = lightGrad;

      // Draw custom trapezoidal light beam
      ctx.beginPath();
      ctx.moveTo(width * 0.5, 0);
      ctx.lineTo(width, 0);
      ctx.lineTo(width * 0.9, height);
      ctx.lineTo(width * 0.1, height);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.06]"
      id="nature-canvas-scientist-background"
    />
  );
};
