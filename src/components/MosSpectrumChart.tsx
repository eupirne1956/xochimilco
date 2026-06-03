import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldCheck, 
  AlertTriangle, 
  Activity, 
  HelpCircle, 
  Info,
  Scale, 
  TrendingUp, 
  ThumbsUp, 
  ChevronRight,
  BookOpen,
  ExternalLink
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MosSpectrumChartProps {
  mos: number;
  noael: number;
  sed: number;
  botanicalName: string;
  isApproved: boolean;
  lang?: "es" | "en";
  evaluationRoute?: "dermal" | "oral";
}

interface SafetyZone {
  id: string;
  name: string;
  min: number;
  max: number;
  color: string;
  textColor: string;
  borderColor: string;
  accentColor: string;
  fill: string;
  desc: string;
  brief: string;
  regulatorySource: string;
}

export function MosSpectrumChart({
  mos,
  noael,
  sed,
  botanicalName,
  isApproved,
  lang = "es",
  evaluationRoute = "dermal"
}: MosSpectrumChartProps) {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [isProgressHovered, setIsProgressHovered] = useState(false);

  const isOral = evaluationRoute === "oral";
  // Under oral, 'mos' holds the calculated acceptable daily limit (ADI_TDI) and 'sed' holds the estimated daily intake (EDI)
  const oralSafetyRatio = isOral ? (sed > 0 ? (mos / sed) : 999) : mos;

  const zones: SafetyZone[] = isOral ? [
    {
      id: "critical",
      name: lang === "es" ? "Riesgo de Ingesta Severo" : "Severe Oral Ingestion Risk",
      min: 0,
      max: 1.0,
      color: "bg-rose-600",
      textColor: "text-rose-400",
      borderColor: "border-rose-500/30",
      accentColor: "#ef4444",
      fill: "rgba(239, 68, 68, 0.15)",
      brief: lang === "es" ? "Inocuidad < 1x: Ingesta supera límite diario seguro (EDI > ADI/TDI)." : "Safety Factor < 1x: Daily intake exceeds safe tolerated limit (EDI > ADI/TDI).",
      desc: lang === "es" 
        ? "La ingesta diaria estimada (EDI) supera los límites tolerables o recomendados de exposición biológica (ADI/TDI). Conlleva riesgos inminentes de toxicidad de primer paso hepática, gastrointestinal u orgánica acumulada por consumo reiterado." 
        : "The estimated daily intake (EDI) exceeds acceptable or recommended biological safety limits (ADI/TDI). Highly critical risk of first-pass hepatic, gastrointestinal, or compounded organ toxicity over chronic ingestion.",
      regulatorySource: "NOM-073-SSA1-2015 & EFSA Guidance on Botanicals"
    },
    {
      id: "warning",
      name: lang === "es" ? "Límite de Alerta Diario" : "Alert Threshold Daily Ingestion",
      min: 1.0,
      max: 2.0,
      color: "bg-amber-500",
      textColor: "text-amber-400",
      borderColor: "border-amber-500/30",
      accentColor: "#f59e0b",
      fill: "rgba(245, 158, 11, 0.15)",
      brief: lang === "es" ? "1x ≤ Factor < 2x: Muy cercano al umbral máximo de seguridad tolerable diana." : "1x ≤ Safety Factor < 2x: Close proximity to the maximum tolerated daily limit.",
      desc: lang === "es" 
        ? "La ingesta diaria estimada se posiciona dentro de un margen sumamente estrecho en relación con el límite tolerable diario seguro. Se exige precaución o de preferencia disminuir el extracto para neutralizar variabilidades metabólicas interindividuales." 
        : "The daily herbal ingestion is in close proximity to the maximum daily safety boundary. Formulation adjustments or lower extraction percentage are recommended to neutralize inter-individual clearance.",
      regulatorySource: "NOM-073-SSA1-2015 & WHO Ingestion Guidelines"
    },
    {
      id: "safe",
      name: lang === "es" ? "Consumo Oral Seguro" : "Regular Safe Oral Ingestion",
      min: 2.0,
      max: 10.0,
      color: "bg-emerald-500",
      textColor: "text-emerald-400",
      borderColor: "border-emerald-500/30",
      accentColor: "#10b981",
      fill: "rgba(16, 185, 129, 0.15)",
      brief: lang === "es" ? "2x ≤ Factor < 10x: Ingesta segura cómoda con factor de holgura adecuado." : "2x ≤ Safety Factor < 10x: Comfortable safe range with solid metabolic clearance.",
      desc: lang === "es"
        ? "Zona de conformidad estándar y de consumo regular seguro. La dosis diaria estimada del ingrediente activo se encuentra holgadamente por debajo de los límites de referencia establecidos (con un factor de protección in silico superior a la unidad)."
        : "Standard botanical food-grade comfort zone. The daily amount of active ingredient is comfortably under threshold limits, assuming excellent gastrointestinal tolerability.",
      regulatorySource: "EFSA / WHO Food-grade Botanical Principles"
    },
    {
      id: "excellent",
      name: lang === "es" ? "Tolerancia Humana Óptima" : "Ultra-Safe Oral Ingestion Tolerance",
      min: 10.0,
      max: 100.0,
      color: "bg-cyan-400",
      textColor: "text-cyan-400",
      borderColor: "border-cyan-500/30",
      accentColor: "#22d3ee",
      fill: "rgba(34, 211, 238, 0.15)",
      brief: lang === "es" ? "Factor ≥ 10x (Ultrasegura): Inofensivo o de extraordinaria inocuidad digestiva." : "Safety Factor ≥ 10x (Ultra-safe): Highly beneficial or exceptionally safe digestively.",
      desc: lang === "es"
        ? "Excelente perfil de bioseguridad sistémica por ingesta. El extracto ingerido representa una fracción minúscula e inocua del nivel de tolerancia diario, adecuado para fitomedicinas continuadas, remedios tradicionales prolongados o dosis infantiles."
        : "Exceptional safety ceiling. The estimated daily intake represents an infinitesimal fraction of Tolerable Ingestion Limits, making it perfect for long-term chronic clinical regimens.",
      regulatorySource: "FAO/WHO Principles and Methods for Risk Assessment"
    }
  ] : [
    {
      id: "critical",
      name: lang === "es" ? "Riesgo Toxicológico Severo" : "Severe Toxicological Risk",
      min: 0,
      max: 50,
      color: "bg-rose-600",
      textColor: "text-rose-400",
      borderColor: "border-rose-500/30",
      accentColor: "#ef4444",
      fill: "rgba(239, 68, 68, 0.15)",
      brief: lang === "es" ? "MoS < 50: Alta posibilidad de absorción sistémica nociva." : "MoS < 50: High probability of toxic systemic absorption.",
      desc: lang === "es" 
        ? "La exposición sistémica es alarmantemente alta. De acuerdo con el Comité Científico de Seguridad de los Consumidores (SCCS), un margen menor a 50 denota riesgo de toxicidad orgánica sistémica directa en usos continuos." 
        : "Systemic exposure is dangerously high. According to the Scientific Committee on Consumer Safety (SCCS), a margin under 50 denotes direct organic toxicological risk with continuous usage.",
      regulatorySource: "SCCS Notes of Guidance (12th Revision)"
    },
    {
      id: "warning",
      name: lang === "es" ? "Margen Insuficiente (Alerta)" : "Insufficient Margin (Warning)",
      min: 50,
      max: 100,
      color: "bg-amber-500",
      textColor: "text-amber-400",
      borderColor: "border-amber-500/30",
      accentColor: "#f59e0b",
      fill: "rgba(245, 158, 11, 0.15)",
      brief: lang === "es" ? "50 ≤ MoS < 100: Inferior al estándar regulatorio internacional." : "50 ≤ MoS < 100: Below international regulatory standards.",
      desc: lang === "es" 
        ? "Fallo de conformidad regulatoria. Aunque menor que el riesgo crítico, no alcanza la tolerancia exigida (MoS ≥ 100). Implica riesgos potenciales en el uso a mediano plazo bajo la NOM-073-SSA1-2015." 
        : "Regulatory compliance failure. Although lower than critical risk, it does not reach the required safety threshold (MoS ≥ 100). Potential medium-term health concerns in cosmetics or topicals.",
      regulatorySource: "NOM-073-SSA1-2015 & SCCS Guidelines"
    },
    {
      id: "safe",
      name: lang === "es" ? "Aceptación Regular Segura" : "Regular Safe Acceptance",
      min: 100,
      max: 300,
      color: "bg-emerald-500",
      textColor: "text-emerald-400",
      borderColor: "border-emerald-500/30",
      accentColor: "#10b981",
      fill: "rgba(16, 185, 129, 0.15)",
      brief: lang === "es" ? "100 ≤ MoS < 300: Uso cosmético y dérmico aprobado." : "100 ≤ MoS < 300: Approved cosmetic and dermal usage.",
      desc: lang === "es"
        ? "Zona de conformidad estándar. Un Margen de Seguridad superior a 100 se considera seguro para la población general, asumiendo una absorción dérmica balanceada e inocuidad celular."
        : "Standard compliance zone. A Margin of Safety above 100 is widely accepted as safe for the general population under normal dermal exposure scenarios.",
      regulatorySource: "EU Cosmetics Regulation EC 1223/2009"
    },
    {
      id: "excellent",
      name: lang === "es" ? "Tolerancia Ultra-Segura" : "Ultra-Safe Bio-Tolerance",
      min: 300,
      max: 1000,
      color: "bg-cyan-400",
      textColor: "text-slate-900",
      borderColor: "border-cyan-500/30",
      accentColor: "#22d3ee",
      fill: "rgba(34, 211, 238, 0.15)",
      brief: lang === "es" ? "MoS ≥ 300: Idoneidad excepcional para uso pediátrico y sensible." : "MoS ≥ 300: Highly suitable for pediatric and ultra-sensitive skins.",
      desc: lang === "es"
        ? "Rango de biocompatibilidad excepcional. Excede por más del triple el límite legal mínimo. Ideal para el desarrollo de productos hipoalergénicos, dermatológicos infantiles o fitomedicina de alta pureza."
        : "Exceptional biocompatibility margin. Exceeds the minimum legal requirement by over threefold. Highly recommended for hypoallergenic dermocosmetics, infant formulas, or high-purity botanical therapies.",
      regulatorySource: "SCCS Pediatric Risk Assessment Protocols"
    }
  ];

  // Helper mapping function for non-linear scale translation
  const mapMosToPercent = (value: number): number => {
    if (isOral) {
      if (value <= 0) return 0;
      if (value <= 1.0) {
        // Critical zone represents ratio 0 to 1. Maps to 0% to 25% of progress bar.
        return value * 25;
      }
      if (value <= 2.0) {
        // Warning zone represents ratio 1 to 2. Maps to 25% to 45% of progress bar.
        return 25 + (value - 1.0) * 20;
      }
      if (value <= 10.0) {
        // Safe zone represents ratio 2 to 10. Maps to 45% to 75% of progress bar.
        return 45 + ((value - 2.0) / 8.0) * 30;
      }
      // Excellent zone represents ratio 10+. Maps to 75% to 100% of progress bar.
      return Math.min(100, 75 + (Math.min(40, value - 10.0) / 40.0) * 25);
    } else {
      if (value <= 0) return 0;
      if (value <= 50) {
        // 0-50 maps to 0% to 20%
        return (value / 50) * 20;
      }
      if (value <= 100) {
        // 50-100 maps to 20% to 45%
        return 20 + ((value - 50) / 50) * 25;
      }
      if (value <= 300) {
        // 100-300 maps to 45% to 75%
        return 45 + ((value - 100) / 200) * 30;
      }
      if (value <= 500) {
        // 300-500 maps to 75% to 92%
        return 75 + ((value - 300) / 200) * 17;
      }
      // Above 500 up to 2000 maps to 92% to 100%
      return Math.min(100, 92 + (Math.min(1500, value - 500) / 1500) * 8);
    }
  };

  const rawActivePercent = mapMosToPercent(oralSafetyRatio);
  const activePercent = Math.max(6, Math.min(94, rawActivePercent));

  // Determine current active zone based on state
  const getCurrentZone = () => {
    if (isOral) {
      if (oralSafetyRatio < 1.0) return zones[0];
      if (oralSafetyRatio < 2.0) return zones[1];
      if (oralSafetyRatio < 10.0) return zones[2];
      return zones[3];
    } else {
      if (mos < 50) return zones[0];
      if (mos < 100) return zones[1];
      if (mos < 300) return zones[2];
      return zones[3];
    }
  };

  const currentZone = getCurrentZone();
  const displayedExplainZone = selectedZone 
    ? zones.find(z => z.id === selectedZone) 
    : hoveredZone 
       ? zones.find(z => z.id === hoveredZone) 
       : currentZone;

  // Comparative benchmarks of common extracts in industry
  const benchmarks = isOral ? [
    { name: lang === "es" ? "Manzanilla (Inocuidad té standard)" : "Chamomile (Standard Infusion)", val: 45, badge: "bg-cyan-500/10 text-cyan-400" },
    { name: lang === "es" ? "Menta Piperita (Taza diaria 2g)" : "Peppermint (Daily Cup 2g)", val: 22, badge: "bg-cyan-500/10 text-cyan-400" },
    { name: lang === "es" ? "Té Verde (Extracto estándar 500mg)" : "Green Tea (Std. Extract 500mg)", val: 8.5, badge: "bg-emerald-500/10 text-emerald-400" },
    { name: lang === "es" ? "Boldo (Infusión de hoja regulada)" : "Boldo Leaf Infusion", val: 1.8, badge: "bg-amber-500/10 text-amber-400" },
    { name: lang === "es" ? "Menta Poleo (Pulegona concentrada)" : "Pennyroyal (Concentrated Pulegone)", val: 0.4, badge: "bg-rose-500/10 text-rose-400" },
  ] : [
    { name: lang === "es" ? "Sábila (Aloe vera gel)" : "Aloe Vera Extract", val: 540, badge: "bg-cyan-500/10 text-cyan-400" },
    { name: lang === "es" ? "Manzanilla (Matricaria extracto)" : "Chamomile Extract", val: 245, badge: "bg-emerald-500/10 text-emerald-400" },
    { name: lang === "es" ? "Eucalipto (Aceite diluido 1%)" : "Eucalyptus Co.", val: 120, badge: "bg-emerald-500/10 text-emerald-400" },
    { name: lang === "es" ? "Árbol de Té (Concentración 5%)" : "Tea Tree Oil 5%", val: 82, badge: "bg-amber-500/10 text-amber-400" },
    { name: lang === "es" ? "Orégano (Carvacrol enriquecido)" : "Oregano Extract", val: 35, badge: "bg-rose-500/10 text-rose-400" },
  ];

  return (
    <Card className="rounded-[2.5rem] border border-primary/20 bg-card/45 backdrop-blur-xl shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="p-8 border-b border-primary/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1 text-left">
          <div className="flex items-center gap-2">
            <span className="p-1 px-1.5 rounded-md bg-primary/10 border border-primary/20 text-primary font-mono text-[9px] uppercase tracking-wider font-bold">
              {lang === "es" ? "INTERACTIVO" : "INTERACTIVE SURVEY"}
            </span>
            <Activity className="w-3.5 h-3.5 text-primary animate-pulse" />
          </div>
          <h4 className="text-xl font-bold font-serif text-white">
            {isOral
              ? (lang === "es" ? "Espectro de Tránsito Toxicológico ADI / TDI" : "ADI / TDI Toxicological Safety Spectrum")
              : (lang === "es" ? "Espectro de Tránsito Toxicológico MoS" : "MoS Toxicological Safety Spectrum")
            }
          </h4>
          <p className="text-xs text-muted-foreground">
            {isOral
              ? (lang === "es" ? "Simulador interactivo del Factor de Ingesta Segura (FII) comparado con el límite ADI / TDI" : "Interactive Ingestion Safety Factor (ISF) simulator compared to safe ADI / TDI thresholds")
              : (lang === "es" ? "Simulador interactivo del Margen de Seguridad con mapeo logarítmico regulatorio" : "Interactive Margin of Safety mapping tool based on logarithmic boundaries")
            }
          </p>
        </div>

        {/* Legend buttons */}
        <div className="flex flex-wrap gap-1.5 mt-2 md:mt-0">
          {zones.map((zone) => (
            <button
              key={zone.id}
              onClick={() => setSelectedZone(selectedZone === zone.id ? null : zone.id)}
              onMouseEnter={() => setHoveredZone(zone.id)}
              onMouseLeave={() => setHoveredZone(null)}
              className={`px-2.5 py-1 text-[10px] font-mono rounded-lg border transition-all cursor-pointer ${
                displayedExplainZone?.id === zone.id
                  ? `${zone.color} text-white border-transparent`
                  : "bg-slate-900/60 border-white/5 text-muted-foreground hover:border-white/10"
              }`}
            >
              {isOral ? (
                zone.id === "critical" ? "FII < 1.0" : zone.id === "warning" ? "1.0 - 2.0" : zone.id === "safe" ? "2.0 - 10.0" : "> 10.0"
              ) : (
                zone.id === "critical" ? "MoS < 50" : zone.id === "warning" ? "50 - 100" : zone.id === "safe" ? "100 - 300" : "> 300"
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Spectrum visual bar */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-muted-foreground">{lang === "es" ? "Zonas de Riesgo Crónico" : "Chronic Risk Zones"}</span>
            
            {/* Dynamic Reading HUD - completely inside bounds and robust */}
            <div className="min-h-[32px] w-full sm:w-auto flex items-center justify-start sm:justify-end">
              <AnimatePresence mode="wait">
                {isProgressHovered ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-center gap-2 bg-gradient-to-r from-slate-900/80 to-slate-800/80 text-white rounded-xl px-3 py-1.5 border border-primary/30 text-xs font-mono select-none"
                  >
                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: currentZone.accentColor }} />
                    <span className="text-zinc-400 font-sans font-medium">
                      {botanicalName && botanicalName !== "Compuesto Puro" && botanicalName !== "Compuesto Puro / Pure Compound" && botanicalName !== "Pure Compound" ? `${botanicalName}: ` : ""}
                    </span>
                    <strong style={{ color: currentZone.accentColor }} className="font-extrabold text-[13px]">
                      {isOral ? `Factor ${oralSafetyRatio.toFixed(2)}x` : `MoS ${mos.toFixed(1)}`}
                    </strong>
                    <span className="text-[10px] text-zinc-500">
                      ({isApproved ? (lang === "es" ? "Seguro" : "Safe") : (lang === "es" ? "Riesgo" : "Risk")})
                    </span>
                  </motion.div>
                ) : (
                  <motion.span 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 0.6 }} 
                    className="text-zinc-500 text-[10px] font-mono animate-pulse"
                  >
                    {lang === "es" ? "Coloca el puntero sobre la barra para lectura interactiva" : "Hover over the safety spectrum bar for live reading"}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div 
            onMouseEnter={() => setIsProgressHovered(true)}
            onMouseLeave={() => setIsProgressHovered(false)}
            className="relative h-10 w-full rounded-2xl bg-black/45 overflow-visible border border-white/10 p-1 flex transition-colors hover:border-white/20"
          >
            {/* Background color tracks with tooltips on hover */}
            <div 
              onMouseEnter={() => setHoveredZone("critical")}
              onMouseLeave={() => setHoveredZone(null)}
              onClick={() => setSelectedZone(selectedZone === "critical" ? null : "critical")}
              style={{ width: isOral ? "25%" : "20%" }}
              className="h-full rounded-l-xl bg-gradient-to-r from-red-600/80 to-rose-500/80 cursor-pointer relative transition-opacity hover:opacity-90 flex items-center justify-center font-mono text-[9px] font-black text-rose-100"
              title={isOral ? "Inocuidad <1x" : "Crítico (<50)"}
            >
              <span className="opacity-60 hidden sm:inline">CRÍTICO</span>
            </div>
            
            <div 
              onMouseEnter={() => setHoveredZone("warning")}
              onMouseLeave={() => setHoveredZone(null)}
              onClick={() => setSelectedZone(selectedZone === "warning" ? null : "warning")}
              style={{ width: isOral ? "20%" : "25%" }}
              className="h-full bg-gradient-to-r from-rose-500/80 to-amber-500/80 cursor-pointer relative transition-opacity hover:opacity-90 flex items-center justify-center font-mono text-[9px] font-black text-amber-100 border-l border-black/10"
              title={isOral ? "Alerta (1x-2x)" : "Alerta (50-100)"}
            >
              <span className="opacity-60 hidden sm:inline">ALERTA</span>
            </div>

            <div 
              onMouseEnter={() => setHoveredZone("safe")}
              onMouseLeave={() => setHoveredZone(null)}
              onClick={() => setSelectedZone(selectedZone === "safe" ? null : "safe")}
              className="w-[30%] h-full bg-gradient-to-r from-amber-500/80 to-emerald-500/80 cursor-pointer relative transition-opacity hover:opacity-90 flex items-center justify-center font-mono text-[9px] font-black text-emerald-100 border-l border-black/10"
              title={isOral ? "Seguro (2x-10x)" : "Seguro (100-300)"}
            >
              <span className="opacity-60 hidden sm:inline">SEGURO</span>
            </div>

            <div 
              onMouseEnter={() => setHoveredZone("excellent")}
              onMouseLeave={() => setHoveredZone(null)}
              onClick={() => setSelectedZone(selectedZone === "excellent" ? null : "excellent")}
              style={{ width: isOral ? "25%" : "25%" }}
              className="h-full rounded-r-xl bg-gradient-to-r from-emerald-500/80 to-cyan-500/80 cursor-pointer relative transition-opacity hover:opacity-90 flex items-center justify-center font-mono text-[9px] font-black text-cyan-100 border-l border-black/10"
              title={isOral ? "Excelente (>10x)" : "Excelente (>300)"}
            >
              <span className="opacity-60 hidden sm:inline font-sans">EXCELENTE</span>
            </div>

            {/* Threshold line marker */}
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-dashed border-l border-dashed border-white/60 z-20"
              style={{ left: isOral ? "25%" : "45%" }}
            >
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-1 font-mono text-[9px] text-zinc-400 font-extrabold whitespace-nowrap">
                {isOral 
                  ? (lang === "es" ? "LÍMITE ADI/TDI (FII = 1.0)" : "ADI/TDI LIMIT (ISF = 1.0)")
                  : (lang === "es" ? "LÍMITE SCCS: 100" : "SCCS LIMIT: 100")
                }
              </div>
            </div>

            {/* Needle indicator showing calculated MoS or oral Safety Ratio */}
            <motion.div 
              onMouseEnter={() => setIsProgressHovered(true)}
              onMouseLeave={() => setIsProgressHovered(false)}
              className="absolute top-0 bottom-0 w-1.5 -ml-0.5 z-30 flex flex-col items-center select-none cursor-help font-sans"
              style={{ left: `${activePercent}%` }}
              animate={{ left: `${activePercent}%` }}
              transition={{ type: "spring", stiffness: 80, damping: 15 }}
            >
              <div className="w-1.5 h-full bg-white relative">
                {/* Glowing light at top and bottom */}
                <span className={`absolute -top-2.5 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center -translate-x-1.5 shadow-lg ${
                  isApproved ? "bg-emerald-400 shadow-emerald-500/40 animate-pulse" : "bg-rose-500 shadow-rose-500/40 animate-pulse"
                }`} />
                <span className="absolute -bottom-2 w-3 h-3 rounded-full bg-white -translate-x-0.5 shadow border border-black/25 font-sans" />
              </div>
            </motion.div>
          </div>

          {/* Labels below the bar */}
          <div className="flex justify-between w-full text-[9px] font-mono text-zinc-400 px-1 pt-1.5 animate-fade-in">
            {isOral ? (
              <>
                <span>Factor: 0x</span>
                <span>0.5x</span>
                <span>1.0x</span>
                <span>2.0x</span>
                <span>5.0x</span>
                <span>10.0x</span>
                <span>50.0x+</span>
              </>
            ) : (
              <>
                <span>MoS: 0</span>
                <span>50</span>
                <span>100</span>
                <span>200</span>
                <span>300</span>
                <span>500</span>
                <span>1500+</span>
              </>
            )}
          </div>
        </div>

        {/* Selected or Hovered Zone details card */}
        <AnimatePresence mode="wait">
          {displayedExplainZone && (
            <motion.div
              key={displayedExplainZone.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={`p-6 rounded-3xl border text-left flex flex-col md:flex-row gap-5 items-start bg-slate-900/40 ${displayedExplainZone.borderColor}`}
            >
              {/* Left icon with active color */}
              <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl bg-white/5 border border-white/10" style={{ color: displayedExplainZone.accentColor }}>
                {displayedExplainZone.id === "critical" ? (
                  <AlertTriangle className="w-6 h-6 animate-pulse" />
                ) : displayedExplainZone.id === "warning" ? (
                  <Scale className="w-6 h-6" />
                ) : displayedExplainZone.id === "safe" ? (
                  <ThumbsUp className="w-6 h-6" />
                ) : (
                  <ShieldCheck className="w-6 h-6 text-cyan-400" />
                )}
              </div>

              {/* Text content details */}
              <div className="space-y-2 flex-grow text-left">
                <div className="flex items-center gap-3 flex-wrap">
                  <h5 className="font-serif font-black text-md text-white">
                    {displayedExplainZone.name}
                  </h5>
                  <Badge className="font-mono text-[9px] uppercase tracking-wider bg-white/5 text-[10px]" style={{ color: displayedExplainZone.accentColor, borderColor: `${displayedExplainZone.accentColor}30` }}>
                    {isOral ? (
                      `Rango: ${displayedExplainZone.min}x - ${displayedExplainZone.max === 100 ? "10x+" : `${displayedExplainZone.max}x`}`
                    ) : (
                      `Rango: ${displayedExplainZone.min} - ${displayedExplainZone.max === 1000 ? "300+" : displayedExplainZone.max}`
                    )}
                  </Badge>
                </div>
                
                <p className="text-xs text-muted-foreground leading-relaxed text-left text-zinc-300 font-sans">
                  {displayedExplainZone.desc}
                </p>
                
                <div className="flex items-center gap-2 pt-1 border-t border-white/5 text-[10px] font-mono text-zinc-500">
                  <Info className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    {lang === "es" ? "Fundamento Legal: " : "Regulatory Base: " }
                    <strong className="text-zinc-400 font-sans">{displayedExplainZone.regulatorySource}</strong>
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Section: Formula Factors impact Analysis (Simulado de Impacto) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-primary/10">
          <div className="space-y-3 text-left">
            <h5 className="font-serif font-bold text-sm text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              {isOral
                ? (lang === "es" ? "Factores de Adecuación ADI / TDI" : "ADI / TDI Compliance Factors")
                : (lang === "es" ? "Factores de Desviación MoS" : "MoS Derivation Factors")
              }
            </h5>
            <p className="text-xs text-muted-foreground leading-relaxed font-sans">
              {isOral 
                ? (lang === "es" 
                    ? "La holgura de ingesta diaria recomendada segura (comparada al ADI/TDI) responde de manera dinámica a las variables en la preparación herbal:" 
                    : "Your safe daily oral intake clearance compared to safe thresholds is highly sensitive to the following variables:")
                : (lang === "es" 
                    ? "El valor MoS de tu formulación herbolaria responde de manera hiper-proporcional a los siguientes componentes. Ajustar estos parámetros balancea los niveles de seguridad:" 
                    : "The MoS of your herbal formulation is highly responsive to the following variables. Tweaking them balances the safety metrics:")}
            </p>
            
            <div className="space-y-2 pt-1 text-xs font-sans">
              <div className="flex justify-between items-center bg-black/25 p-2 px-3 rounded-xl border border-white/5">
                <span className="text-zinc-400">{lang === "es" ? "Concentración de Fórmula (C)" : "Formula Concentration (C)"}</span>
                <span className="font-sans font-extrabold text-white text-[11px] bg-indigo-500/10 p-1 px-2 rounded-lg text-right animate-fade-in">
                  {lang === "es" ? "Inversamente Proporcional" : "Inversely Proportional"}
                </span>
              </div>
              <div className="flex justify-between items-center bg-black/25 p-2 px-3 rounded-xl border border-white/5 font-sans">
                <span className="text-zinc-400">{isOral ? (lang === "es" ? "Cantidad Sugerida Ingerida (A)" : "Ingested Amount (A)") : (lang === "es" ? "Frecuencia de Uso (g/día) (A)" : "Applied Amount (A)")}</span>
                <span className="font-sans font-extrabold text-white text-[11px] bg-amber-500/10 p-1 px-2 rounded-lg text-right animate-fade-in">
                  {lang === "es" ? "Inversamente Proporcional" : "Inversely Proportional"}
                </span>
              </div>
              <div className="flex justify-between items-center bg-black/25 p-2 px-3 rounded-xl border border-white/5 font-sans">
                <span className="text-zinc-400">{isOral ? (lang === "es" ? "Límite Seguro (ADI/TDI)" : "Safe Limit ADI/TDI") : (lang === "es" ? "Dosis de Cero Efecto (NOAEL)" : "No-Effect Level (NOAEL)")}</span>
                <span className="font-sans font-extrabold text-teal-400 text-[11px] bg-teal-500/10 p-1 px-2 rounded-lg text-right animate-fade-in">
                  {lang === "es" ? "Directamente Proporcional" : "Directly Proportional"}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3 text-left">
            <h5 className="font-serif font-bold text-sm text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-primary" />
              {isOral
                ? (lang === "es" ? "Análogo Comparativo Alimentario / Oral" : "Comparative Dietary & Oral Benchmarks")
                : (lang === "es" ? "Análogo Comparativo Etnofarmacológico" : "Comparative Herbological Benchmarks")
              }
            </h5>
            <p className="text-xs text-muted-foreground leading-relaxed font-sans">
              {isOral
                ? (lang === "es" 
                    ? "Inferencia in silico del Factor de Ingesta Segura (FII) en suplementos y preparados de infusión tradicionales:" 
                    : "In silico representative margins of common herbal teas and botanical ingestion products:")
                : (lang === "es" 
                    ? "Referente in silico con extractos vegetales comunes en la industria dérmica bajo idénticos factores de exposición cutánea general:" 
                    : "Ethnobotanical benchmarks under identical skin exposure parameters in standard pharmaceutical assays:")}
            </p>

            <div className="space-y-1.5 pt-1">
              {benchmarks.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-[11px] font-mono p-1 px-2 bg-black/15 hover:bg-black/25 border border-white/5 rounded-lg transition-all">
                  <span className="text-zinc-300 font-sans">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-500">{isOral ? "Factor" : "MoS"}</span>
                    <span className={`p-0.5 px-2 rounded font-black ${item.badge}`}>{isOral ? `${item.val}x` : item.val}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Extended Scientific & Bibliographic Educational Section */}
        <div className="mt-8 pt-8 border-t border-primary/20 space-y-6 text-left animate-fade-in font-sans">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-mono text-[10px] uppercase font-bold tracking-widest">
              <span>{lang === "es" ? "MARCO ACADÉMICO REGULATORIO" : "REGULATORY ACADEMIC FRAMEWORK"}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            </div>
            <h5 className="font-serif font-extrabold text-lg text-white">
              {isOral
                ? (lang === "es" ? "Límites de Ingesta Diaria Admisible (ADI / TDI)" : "Understanding Acceptable & Tolerable Daily Intake (ADI / TDI)")
                : (lang === "es" ? "Comprensión del Margen de Seguridad (MoS)" : "Understanding the Margin of Safety (MoS)")
              }
            </h5>
            <p className="text-xs text-zinc-300 leading-relaxed text-left font-sans">
              {isOral ? (
                lang === "es" 
                  ? "La Ingesta Diaria Admisible (ADI, Acceptable Daily Intake) y la Ingesta Diaria Tolerable (TDI, Tolerable Daily Intake) son indicadores cuantitativos y límites biológicos estrictos establecidos para evaluar la cantidad máxima de un principio activo, metabolito herbolario o compuesto que puede consumirse oralmente a diario a lo largo de toda una vida sin representar riesgo apreciable para la salud de un ser humano ordinario."
                  : "The Acceptable Daily Intake (ADI) and Tolerable Daily Intake (TDI) represent established biological safety thresholds defining the maximum amount of a chemical substance or botanical derivative that can be ingested orally on a daily basis over a lifetime without posing appreciable physiological risk."
              ) : (
                lang === "es" 
                  ? "El Margen de Seguridad (MoS, por sus siglas en inglés, Margin of Safety) es un indicador adimensional utilizado mundialmente en la toxicología cosmética y dermatológica para evaluar si la exposición sistémica estimada a una sustancia herbolaria o química conlleva un riesgo adverso para la salud humana."
                  : "The Margin of Safety (MoS) is a dimensionless index utilized globally in cosmetic and dermatological toxicology to evaluate whether the estimated systemic exposure to a botanical or chemical substance poses an adverse risk to human health."
              )}
            </p>
          </div>

          {/* Mathematical formulation block with detailed legends */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-black/30 p-6 rounded-[2rem] border border-white/5">
            <div className="space-y-4">
              <h6 className="font-sans font-bold text-xs text-white uppercase tracking-wider">
                {lang === "es" ? "1. Ecuación Principal y Derivaciones" : "1. Core Equation & Derivations"}
              </h6>
              
              <div className="space-y-3 font-mono text-xs text-zinc-400">
                {isOral ? (
                  <>
                    <div className="p-3 bg-slate-900/60 rounded-xl border border-white/5">
                      <span className="text-[10px] text-primary block mb-1">CONDICIÓN DE INGESTIÓN SEGURA</span>
                      <code className="text-sm font-extrabold text-white">{"EDI ≤ ADI / TDI"}</code>
                      <span className="text-[9px] text-zinc-500 block mt-1">{"Factor de Inocuidad = (ADI / TDI) / EDI ≥ 1.0x"}</span>
                    </div>

                    <div className="p-3 bg-slate-900/60 rounded-xl border border-white/5">
                      <span className="text-[10px] text-primary block mb-1">INGESTA DIARIA ESTIMADA (EDI)</span>
                      <code className="text-sm font-extrabold text-white">EDI = [A × C_frac × 1000] / BW</code>
                      <span className="text-[9px] text-zinc-500 block mt-1">Donde C_frac = C (%) / 100 y 1000 es la equivalencia g a mg.</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-3 bg-slate-900/60 rounded-xl border border-white/5">
                      <span className="text-[10px] text-primary block mb-1 font-mono">CÁLCULO DEL MARGEN DE SEGURIDAD</span>
                      <code className="text-sm font-extrabold text-white font-mono">MoS = NOAEL / SED</code>
                    </div>

                    <div className="p-3 bg-slate-900/60 rounded-xl border border-white/5">
                      <span className="text-[10px] text-primary block mb-1 font-mono">CÁLCULO DE LA DOSIS DE EXPOSICIÓN SISTÉMICA (SED)</span>
                      <code className="text-sm font-extrabold text-white font-mono">SED = [A × C_frac × DA_a × R] / BW</code>
                      <span className="text-[9px] text-zinc-500 block mt-1 font-mono font-sans">Donde C_frac = C (%) / 100</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-zinc-300">
              <h6 className="font-sans font-bold text-xs text-white uppercase tracking-wider">
                {lang === "es" ? "2. Glosario de Variables Científicas" : "2. Glossary of Scientific Variables"}
              </h6>

              <ul className="space-y-2 font-sans pl-1 list-none">
                {isOral ? (
                  <>
                    <li>
                      <strong className="text-white font-sans">ADI (Acceptable Daily Intake) / TDI (Tolerable Daily Intake):</strong>{" "}
                      {lang === "es" 
                        ? "Límite superior diario seguro de ingesta sistémica, calculado típicamente como NOAEL dividido por un factor de incertidumbre UF de 100x." 
                        : "Safe daily upper ingestion boundary, typically calculated by dividing preclinical NOAEL by a 100x safety uncertainty factor (UF)."}
                    </li>
                    <li>
                      <strong className="text-white font-sans">EDI (Estimated Daily Intake):</strong>{" "}
                      {lang === "es" 
                        ? "Cantidad diaria total calculada del metabolito activo que se estima es digerido y entra al organismo a través del consumo oral sugerido." 
                        : "The total estimated daily amount of the herbal active biomolecule that of oral prescription is ingested and processed by the system."}
                    </li>
                    <li>
                      <strong className="text-white font-sans">A (g/day):</strong>{" "}
                      {lang === "es" ? "Cantidad diaria sugerida en gramos del remedio herbolario líquido o sólido consumido." : "Suggested daily dosage in grams of the ingested final herbal preparation."}
                    </li>
                    <li>
                      <strong className="text-white font-sans">C (%):</strong>{" "}
                      {lang === "es" ? "Porcentaje de concentración o titulación de marcadores fitoquímicos específicos en la fórmula oral." : "Percentage or active concentration of the specific botanical extract formulated."}
                    </li>
                    <li>
                      <strong className="text-white font-sans">BW (Body Weight):</strong>{" "}
                      {lang === "es" ? "Peso corporal estandarizado del consumidor (predeterminado en 60 kg para adultos)." : "Standardized body weight of the human subject (defaulted to 60 kg for adult safety evaluations)."}
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <strong className="text-white font-sans">NOAEL (No Observed Adverse Effect Level):</strong>{" "}
                      {lang === "es" 
                        ? "La dosis más alta a la cual no se observan efectos adversos significativos en estudios preclínicos (expresado en mg/kg de peso corporal/día)." 
                        : "The highest dose at which no significant adverse effects are observed in preclinical trials (expressed in mg/kg systemic body weight/day)."}
                    </li>
                    <li>
                      <strong className="text-white font-sans">SED (Systemic Exposure Dose):</strong>{" "}
                      {lang === "es" 
                        ? "Cantidad diaria estimada del fitocompuesto que efectivamente ingresa al torrente sanguíneo sistémico tras su absorción dérmica local." 
                        : "Estimated daily amount of the active compound that actually enters body systemic blood circulation following local dermal absorption."}
                    </li>
                    <li>
                      <strong className="text-white font-sans">A (g/day):</strong>{" "}
                      {lang === "es" ? "Cantidad total diaria recomendada de aplicación cutánea de la formulación." : "Total daily recommended skin application amount of the final formula."}
                    </li>
                    <li>
                      <strong className="text-white font-sans">C (%):</strong>{" "}
                      {lang === "es" ? "Porcentaje o concentración del extracto vegetal específico disuelto o formulado." : "Percentage or active concentration of the specific botanical extract formulated."}
                    </li>
                    <li>
                      <strong className="text-white font-sans">DA_a (% / Fraction):</strong>{" "}
                      {lang === "es" ? "Absorción dérmica experimental o por defecto del metabolito (típicamente 10% según lineamientos EMA/SCCS)." : "Dermal absorption rate (typically defaults to 10% under conservative SCCS/EMA assumptions)."}
                    </li>
                    <li>
                      <strong className="text-white font-sans">R (Retention):</strong>{" "}
                      {lang === "es" ? "Factor de retención cutánea (1.0 para productos 'leave-on' fijos, 0.1 para enjuagables 'rinse-off')." : "Retention factor (1.0 for leave-on products, 0.1 for rinse-off cleansers)."}
                    </li>
                    <li>
                      <strong className="text-white font-sans">BW (Body Weight):</strong>{" "}
                      {lang === "es" ? "Peso corporal estandarizado del paciente (referente predeterminado de 60 kg para adultos)." : "Standardized body weight of the human subject (defaulted to 60 kg for adult safety evaluations)."}
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {/* Peer-reviewed Scientific Sources / Bibliografía Oficial */}
          <div className="space-y-3 font-sans">
            <h6 className="font-sans font-bold text-xs text-white uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              {lang === "es" ? "3. Bibliografía Toxicológica y Regulatoria Clave" : "3. Key Toxicological & Regulatory Bibliography"}
            </h6>
            
            <div className="space-y-2 text-[11px] text-zinc-400 font-sans leading-relaxed">
              <div className="p-3 rounded-xl bg-slate-900/30 border border-white/5 hover:border-primary/20 transition-all font-sans">
                <p>
                  <strong>{isOral ? "[1] EFSA (European Food Safety Authority)" : "[1] SCCS (Scientific Committee on Consumer Safety)"}</strong> (2023).{" "}
                  <span className="text-zinc-300 font-sans">
                    {isOral 
                      ? "Guidance on the assessment of the safety of botanicals and botanical preparations for use in dietary supplements and food ingredients" 
                      : "The SCCS Notes of Guidance for the Testing of Cosmetic Ingredients and their Safety Evaluation (12th Revision)"
                    }
                  </span>.{" "}
                  <span className="text-zinc-500 font-mono">{isOral ? "EFSA Journal: e09606" : "SCCS/1647/22"}</span>.{" "}
                  <a href={isOral ? "https://www.efsa.europa.eu/en/efsajournal/pub/3313" : "https://health.ec.europa.eu/publications/sccs-notes-guidance-testing-cosmetic-ingredients-and-their-safety-evaluation-12th-revision_en"} target="_blank" rel="noreferrer" className="text-primary hover:underline inline-flex items-center gap-0.5 font-mono text-[9px] shrink-0">
                    {isOral ? "EFSA Portal" : "SCCS Portal"} <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </p>
                <p className="text-[10px] text-zinc-500 mt-1 font-sans">
                  <em>
                    {isOral 
                      ? "Dictamina las guías científicas globales para evaluar de manera in silico e in vivo la inocuidad biológica diaria de compuestos y sustancias herbolarias ingeridas oralmente en remedios o alimentos." 
                      : "Determina internacionalmente que un MoS ≥ 100 es el mínimo requerido para dictaminar la inocuidad celular debido a factores de variabilidad inter-especies (10x) e intra-especies (10x)."
                    }
                  </em>
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/30 border border-white/5 hover:border-primary/20 transition-all font-sans">
                <p>
                  <strong>[2] Diario Oficial de la Federación (DOF)</strong> (2015).{" "}
                  <span className="text-zinc-300">Norma Oficial Mexicana NOM-073-SSA1-2015, Estabilidad de fármacos y medicamentos, así como de remedios herbolarios</span>.{" "}
                  <span className="text-zinc-500 font-mono">COFEPRIS Estado Mexicano</span>.{" "}
                  <a href="https://www.dof.gob.mx/nota_detalle_popup.php?codigo=5440183" target="_blank" rel="noreferrer" className="text-primary hover:underline inline-flex items-center gap-0.5 font-mono text-[9px] shrink-0">
                    DOF Portal <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </p>
                <p className="text-[10px] text-zinc-500 mt-1">
                  <em>Define los protocolos rigoristas para auditar impurezas, realizar pruebas térmicas deliberadas fitoquímicas y constatar la inocuidad microbiana del lote herbolario.</em>
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/30 border border-white/5 hover:border-primary/20 transition-all font-sans">
                <p>
                  <strong>[3] Organización Mundial de la Salud (WHO)</strong> (2010).{" "}
                  <span className="text-zinc-300">WHO Guidelines on Assessing Quality of Herbal Medicines with Reference to Contaminants and Residues</span>.{" "}
                  <span className="text-zinc-500 font-mono">Geneva World Health Organization</span>.{" "}
                  <a href="https://www.who.int/publications/i/item/9789241594448" target="_blank" rel="noreferrer" className="text-primary hover:underline inline-flex items-center gap-0.5 font-mono text-[9px] shrink-0">
                    WHO Portal <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </p>
                <p className="text-[10px] text-zinc-500 mt-1">
                  <em>Establece los marcos globales obligatorios sobre pureza organoléptica, límites seguros de metabolitos aberrantes y metodologías analíticas de cromatografía herbal.</em>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
