import React, { useEffect, useRef } from "react";

/**
 * CofeprisHQCanvas
 * An elegant programmatical HTML5 canvas that renders a high-tech modern government headquarters
 * reflecting a stunning sunset (magenta, fiery orange, deep purple).
 * - High-tech sleek glass building facade with reflective properties.
 * - Manicured exotic garden in the foreground with glowing neon-green and bright-yellow medicinal plants.
 * - Polished dark stone monument with the "COFEPRIS" logo etched elegantly.
 * - Dynamic light effects & sunset dust particles.
 */
export const CofeprisHQCanvas: React.FC<{ lang?: "es" | "en" }> = ({ lang = "es" }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.offsetWidth || 400);
    let height = (canvas.height = canvas.offsetHeight || 200);

    // Glow particles in the garden representing bioactive mist of medicinal plants
    const glowParticles: {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      hue: number;
      opacity: number;
      pulseDirection: number;
    }[] = [];

    // Initialize 24 organic glowing seeds in the bottom landscape zone
    for (let i = 0; i < 24; i++) {
      glowParticles.push({
        x: Math.random() * width,
        y: height * 0.7 + Math.random() * (height * 0.3),
        size: Math.random() * 2 + 1,
        speedY: -(Math.random() * 0.2 + 0.1),
        speedX: (Math.random() - 0.5) * 0.15,
        hue: Math.random() > 0.55 ? 120 : 60, // Neon Green (120) or Bright Yellow/Amber (60)
        opacity: Math.random() * 0.6 + 0.3,
        pulseDirection: Math.random() > 0.5 ? 0.015 : -0.015,
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

      // --- 1. Sunset sky background with deep gradients (Magenta, Crimson, Deep Purple) ---
      const sunsetGrad = ctx.createLinearGradient(0, 0, 0, height);
      sunsetGrad.addColorStop(0, "#1e1b4b"); // Deep Indigo/Purple sky
      sunsetGrad.addColorStop(0.35, "#581c87"); // Royal Magenta
      sunsetGrad.addColorStop(0.7, "#be123c"); // Crimson Red
      sunsetGrad.addColorStop(1, "#ea580c"); // Fiery Orange horizon
      ctx.fillStyle = sunsetGrad;
      ctx.fillRect(0, 0, width, height);

      // Ambient golden sun glow on the horizon (bottom-center)
      const sunCenter = width * 0.72;
      const sunY = height * 0.65;
      const sunGlow = ctx.createRadialGradient(
        sunCenter,
        sunY,
        0,
        sunCenter,
        sunY,
        height * 0.85
      );
      sunGlow.addColorStop(0, "rgba(253, 224, 71, 0.45)"); // Golden core
      sunGlow.addColorStop(0.3, "rgba(249, 115, 22, 0.25)"); // Orange aura
      sunGlow.addColorStop(0.75, "rgba(219, 39, 119, 0.08)"); // Magenta border
      sunGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = sunGlow;
      ctx.fillRect(0, 0, width, height);

      // --- 2. Programmatic Drawing: The Modern Sleek Glass Facade Headquarters ---
      // Perspectives of the government building on the right/center
      const buildingLeft = width * 0.25;
      const buildingWidth = width * 0.75;
      const buildingHeight = height * 0.72;

      ctx.save();
      // Apply linear perspective distortion
      ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
      ctx.shadowBlur = 15;

      // Headquarters structural outline (sleek polygonal architecture)
      ctx.fillStyle = "rgba(15, 23, 42, 0.95)"; // Slate-900 building body
      ctx.beginPath();
      ctx.moveTo(buildingLeft, buildingHeight);
      ctx.lineTo(buildingLeft + buildingWidth * 0.1, height * 0.1); // Angular sleek facade
      ctx.lineTo(width, height * 0.05);
      ctx.lineTo(width, buildingHeight);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0; // reset shadow

      // Sleek glass panel reflections of sunset
      // Multiple glass shards of orange, magenta, and cyan hues
      const facadeGrad = ctx.createLinearGradient(
        buildingLeft,
        height * 0.1,
        width,
        buildingHeight
      );
      facadeGrad.addColorStop(0, "rgba(192, 132, 252, 0.23)"); // Purple sheen
      facadeGrad.addColorStop(0.5, "rgba(244, 63, 94, 0.35)");  // Magenta Sunset reflective sheen
      facadeGrad.addColorStop(1, "rgba(234, 179, 8, 0.15)");    // Fiery Yellow edge
      ctx.fillStyle = facadeGrad;
      
      ctx.beginPath();
      ctx.moveTo(buildingLeft + 2, buildingHeight);
      ctx.lineTo(buildingLeft + buildingWidth * 0.1 + 2, height * 0.1 + 2);
      ctx.lineTo(width - 2, height * 0.05 + 2);
      ctx.lineTo(width - 2, buildingHeight);
      ctx.closePath();
      ctx.fill();

      // Modern structural grid lines & glass frames (sleek cyan-blue metallic beams)
      ctx.strokeStyle = "rgba(34, 211, 238, 0.35)"; // Cyan-400
      ctx.lineWidth = 1;
      
      const colsCount = 8;
      const rowsCount = 5;
      const bLeftTopX = buildingLeft + buildingWidth * 0.1;
      const bTopY = height * 0.1;

      // Draw horizontal beam structures
      for (let r = 0; r <= rowsCount; r++) {
        const ratio = r / rowsCount;
        const startY = bTopY + (buildingHeight - bTopY) * ratio;
        const endY = (height * 0.05) + (buildingHeight - (height * 0.05)) * ratio;
        const startX = buildingLeft + (bLeftTopX - buildingLeft) * (1 - ratio);

        ctx.strokeStyle = r === 0 || r === rowsCount ? "rgba(34, 211, 238, 0.6)" : "rgba(34, 211, 238, 0.25)";
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(width, endY);
        ctx.stroke();
      }

      // Draw vertical glass window mullions
      for (let col = 1; col < colsCount; col++) {
        const ratio = col / colsCount;
        const startX = bLeftTopX + (width - bLeftTopX) * ratio;
        const startY = bTopY + ((height * 0.05) - bTopY) * ratio;
        const endX = buildingLeft + (width - buildingLeft) * ratio;

        ctx.strokeStyle = "rgba(34, 211, 238, 0.2)";
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, buildingHeight);
        ctx.stroke();
      }

      // Volumetric light refraction reflecting on structural elements
      ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
      ctx.beginPath();
      ctx.moveTo(buildingLeft + 40, buildingHeight);
      ctx.lineTo(buildingLeft + buildingWidth * 0.3, height * 0.08);
      ctx.lineTo(buildingLeft + buildingWidth * 0.38, height * 0.08);
      ctx.lineTo(buildingLeft + 60, buildingHeight);
      ctx.closePath();
      ctx.fill();

      ctx.restore();

      // --- 3. The Polished Dark Stone Monument at the Entrance (Bottom-Left) ---
      const monX = width * 0.05;
      const monY = height * 0.52;
      const monW = width * 0.32;
      const monH = height * 0.28;

      ctx.save();
      // Sleek volumetric shadow underneath the stone
      ctx.shadowColor = "rgba(0, 0, 0, 0.85)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 4;
      
      // Slate-950 Dark Stone Monument
      const stoneGrad = ctx.createLinearGradient(monX, monY, monX + monW * 0.5, monY + monH);
      stoneGrad.addColorStop(0, "#0f172a"); // Dark slate
      stoneGrad.addColorStop(1, "#020617"); // Absolute obsidian dark slate
      ctx.fillStyle = stoneGrad;

      // Polygon for structural look
      ctx.beginPath();
      ctx.moveTo(monX, monY + monH * 0.15); // Top slant
      ctx.lineTo(monX + monW * 0.85, monY); 
      ctx.lineTo(monX + monW, monY + monH * 0.1); 
      ctx.lineTo(monX + monW, monY + monH); 
      ctx.lineTo(monX, monY + monH); 
      ctx.closePath();
      ctx.fill();

      // Subtle metallic highlight along the stone's corner bevels
      ctx.strokeStyle = "rgba(226, 232, 240, 0.4)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(monX, monY + monH * 0.15);
      ctx.lineTo(monX + monW * 0.85, monY);
      ctx.lineTo(monX + monW, monY + monH * 0.1);
      ctx.stroke();

      ctx.shadowColor = "transparent"; // Reset shadow for fine text

      // "COFEPRIS" Logo etched perfectly into the stone
      // Highly-detailed gold/white metallic lettering
      const pulseLogoGlow = Math.abs(Math.sin(frame * 0.03)) * 4 + 4;
      ctx.shadowColor = "rgba(253, 224, 71, 0.65)";
      ctx.shadowBlur = pulseLogoGlow;
      
      ctx.fillStyle = "#fef08a"; // Elegant gold color
      ctx.font = "bold 13px 'Space Grotesk', system-ui, sans-serif";
      ctx.letterSpacing = "2px";
      ctx.fillText("COFEPRIS", monX + monW * 0.15, monY + monH * 0.52);

      // Mini subtext: "EVALUACIÓN REGULATORIA"
      ctx.letterSpacing = "1px";
      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      ctx.font = "900 5.5px monospace";
      ctx.fillText(lang === "es" ? "NUCLEO DE INOCUIDAD" : "SAFETY COMPLIANCE CORE", monX + monW * 0.15, monY + monH * 0.74);
      
      ctx.restore();

      // --- 4. Beautiful Foreground Manicured Garden with exotic medicinal herbs ---
      // We draw wave-like overlapping landscape beds in neon-greens, gold-yellows, and deep teal greens at the bottom
      const landscapePlates = [
        { fill: "#022c22", stroke: "#064e3b", waveAmp: 3, waveFreq: 0.02, heightRatio: 0.88 }, // Deep forest bed
        { fill: "#064e4f", stroke: "#115e59", waveAmp: 4, waveFreq: 0.015, heightRatio: 0.85 }, // Teal botanical bed
        { fill: "#14532d", stroke: "#15803d", waveAmp: 5, waveFreq: 0.03, heightRatio: 0.82 }, // Rich dark green bed
        { fill: "#166534", stroke: "#22c55e", waveAmp: 3, waveFreq: 0.01, heightRatio: 0.77 }, // Bright green garden row
      ];

      landscapePlates.forEach((plate) => {
        ctx.fillStyle = plate.fill;
        ctx.strokeStyle = plate.stroke;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, height);
        
        for (let x = 0; x <= width; x += 10) {
          const waveY = height * plate.heightRatio + Math.sin(x * plate.waveFreq + frame * 0.005) * plate.waveAmp;
          ctx.lineTo(x, waveY);
        }
        
        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      });

      // --- 5. Exotic Glowing Neon Plants / Herbs ---
      // Draw organic abstract sprouting stems and glowing flowery bells pointing up
      ctx.save();
      const drawGlowingHerb = (x: number, y: number, stemColor: string, budColor: string, h: number) => {
        ctx.strokeStyle = stemColor;
        ctx.lineWidth = 1.5;
        // Sway effect
        const sway = Math.sin(frame * 0.02 + x) * 2.5;

        // Stem
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.bezierCurveTo(x - 5 + sway, y - h * 0.5, x + 8 + sway, y - h * 0.8, x + sway, y - h);
        ctx.stroke();

        // Sprouting medical leaves
        ctx.fillStyle = stemColor;
        ctx.beginPath();
        ctx.ellipse(x - 3 + sway * 0.5, y - h * 0.4, 3, 5, -Math.PI / 4, 0, Math.PI * 2);
        ctx.ellipse(x + 5 + sway * 0.8, y - h * 0.6, 2.5, 4, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();

        // Luminous flowers buds
        ctx.shadowColor = budColor;
        ctx.shadowBlur = 8;
        ctx.fillStyle = budColor;
        ctx.beginPath();
        ctx.arc(x + sway, y - h, 3.5, 0, Math.PI * 2);
        ctx.fill();
      };

      // Sprout high-quality neon-green, purple, and amber floral stems in the foreground garden
      drawGlowingHerb(width * 0.12, height * 0.92, "rgba(34, 197, 94, 0.85)", "#22c55e", 18);
      drawGlowingHerb(width * 0.18, height * 0.86, "rgba(234, 179, 8, 0.85)", "#facc15", 15);
      drawGlowingHerb(width * 0.45, height * 0.89, "rgba(34, 197, 94, 0.85)", "#4ade80", 22);
      drawGlowingHerb(width * 0.52, height * 0.94, "rgba(168, 85, 247, 0.85)", "#c084fc", 14);
      drawGlowingHerb(width * 0.78, height * 0.88, "rgba(234, 179, 8, 0.85)", "#facc15", 25);
      drawGlowingHerb(width * 0.88, height * 0.92, "rgba(34, 197, 94, 0.85)", "#22c55e", 19);

      ctx.restore();

      // --- 6. Particles system updraft animation ---
      ctx.save();
      glowParticles.forEach((p) => {
        p.opacity += p.pulseDirection;
        if (p.opacity > 0.8 || p.opacity < 0.25) p.pulseDirection = -p.pulseDirection;
        p.opacity = Math.max(0.1, Math.min(0.9, p.opacity));

        p.y += p.speedY;
        p.x += p.speedX;

        // Reset if drifted beyond top boundary
        if (p.y < height * 0.55) {
          p.y = height * 0.95;
          p.x = Math.random() * width;
        }

        const radGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3.5);
        radGrad.addColorStop(0, `hsla(${p.hue}, 90%, 65%, ${p.opacity})`);
        radGrad.addColorStop(0.4, `hsla(${p.hue}, 90%, 65%, ${p.opacity * 0.25})`);
        radGrad.addColorStop(1, "rgba(0,0,0,0)");

        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3.5, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, [lang]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.06]"
      id="cofepris-hq-canvas-background"
    />
  );
};
