import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Cpu, RefreshCw, Zap, Server, ShieldCheck, HelpCircle } from "lucide-react";

interface PhytoReactorEngineProps {
  lang: "es" | "en";
  activeRoute: "oral" | "dermal";
  metaboliteName: string;
}

export function PhytoReactorEngine({ lang, activeRoute, metaboliteName }: PhytoReactorEngineProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [rpm, setRpm] = useState(120);
  const [temp, setTemp] = useState(24.5);
  const [sec, setSec] = useState(0);

  const stepsEs = [
    "Inicializando Reactor de Simulación Fitoquímica (In Silico)...",
    "Sincronizando parámetros de la NOM-073-SSA1-2015 y Directrices SCCS...",
    `Rastreando huella estructural para: ${metaboliteName || "Metabolito Activo"}...`,
    "Consultando repositorios abiertos de quimioinformática global (PubChem, EFSA)...",
    "Calculando la Dosis de Exposición Sistémica Estimada (SED / EDI)...",
    activeRoute === "oral" 
      ? "Simulando tránsito gastrointestinal y primer paso hepático..." 
      : "Modelando tasa de absorción y permeabilidad dérmica in silico...",
    "Cruzando valores experimentales de NOAEL vs. Umbral de Preocupación Toxicológica (TTC)...",
    "Evaluando Márgenes de Seguridad (MoS/MdS) para formulación cosmética...",
    "Estructurando veredicto regulatorio de AurorIA..."
  ];

  const stepsEn = [
    "Initializing Phytochemical In-Silico Simulation Engine...",
    "Syncing NOM-073-SSA1-2015 regulatory bounds and SCCS standards...",
    `Tracing structural fingerprint for: ${metaboliteName || "Active Metabolite"}...`,
    "Querying global chemoinformatics repositories (PubChem, EFSA databases)...",
    "Computing Estimated Systemic Exposure Dosage (SED / EDI)...",
    activeRoute === "oral" 
      ? "Simulating gastrointestinal transit and first-pass hepatic clearance..." 
      : "Modeling skin absorption coefficient and dermal permeability in silico...",
    "Cross-referencing experimental NOAEL against Threshold of Toxicological Concern (TTC)...",
    "Evaluating safety margins (MoS) for high-integrity cosmetics and remedies...",
    "Fleshing out Auroria's official regulatory compliance verdict..."
  ];

  const activeSteps = lang === "es" ? stepsEs : stepsEn;

  useEffect(() => {
    // Progress steps
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % activeSteps.length);
    }, 1800);

    // Minor telemetry fluctuation
    const telemetryInterval = setInterval(() => {
      setRpm(() => Math.floor(180 + Math.random() * 45));
      setTemp((prev) => +(prev + (Math.random() - 0.5) * 0.4).toFixed(1));
      setSec((prev) => prev + 1);
    }, 900);

    return () => {
      clearInterval(stepInterval);
      clearInterval(telemetryInterval);
    };
  }, [activeSteps.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="p-8 rounded-[2.5rem] bg-slate-950/90 border border-primary/20 shadow-2xl relative overflow-hidden"
    >
      {/* Background cyber grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08),transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-pulse" />

      {/* Main Kinetic Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Left column: Kinetic spinning molecular reactor machine */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-4">
          <div className="relative w-40 h-40 flex items-center justify-center">
            
            {/* outer orbit track */}
            <div className="absolute w-40 h-40 rounded-full border border-zinc-800 border-dashed" />
            
            {/* outermost slower blue rotation */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
              className="absolute w-36 h-36 rounded-full border-2 border-indigo-500/10 border-t-indigo-500/50 border-r-indigo-500/30 flex items-center justify-center"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 absolute -top-1 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 absolute -bottom-0.5" />
            </motion.div>

            {/* middle opposite gold/purple rotation */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              className="absolute w-28 h-28 rounded-full border border-purple-500/10 border-b-purple-400/60 border-l-purple-500/40 flex items-center justify-center"
            >
              <div className="w-2 h-2 rounded-full bg-purple-400 absolute -bottom-1 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500 absolute -right-0.5" />
            </motion.div>

            {/* innermost turbine/gears spinner */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              className="absolute w-18 h-18 rounded-full border-2 border-dashed border-primary/20 flex items-center justify-center"
            >
              <Cpu className="w-6 h-6 text-primary animate-pulse text-indigo-400" />
            </motion.div>

            {/* Pulsating radial core glow */}
            <div className="absolute w-16 h-16 rounded-full bg-primary/10 blur-xl animate-ping opacity-75" />

            {/* Orbiting atoms nodes */}
            <div className="absolute text-[9px] font-mono font-bold text-indigo-400 -bottom-2 border border-indigo-500/20 bg-slate-900/90 rounded-full px-2.5 py-0.5 tracking-wider uppercase animate-pulse">
              {rpm} RPM
            </div>
          </div>

          <div className="text-center space-y-1">
            <span className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase">
              {lang === "es" ? "MOTOR KINÉTICO ACTIVO" : "KINETIC ENGINE MODULE ACTIVE"}
            </span>
            <div className="flex items-center gap-1.5 justify-center">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
              <span className="text-xs font-bold font-mono text-indigo-300">
                {lang === "es" ? `Procesando: ${metaboliteName || "Compuesto"}` : `Processing: ${metaboliteName || "Compound"}`}
              </span>
            </div>
          </div>
        </div>

        {/* Right column: Interactive telemetry terminal and current action details */}
        <div className="lg:col-span-7 space-y-5 text-left">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-primary animate-bounce" />
              <span className="text-[10px] font-bold font-mono tracking-widest text-primary uppercase">
                {lang === "es" ? "Simulador Fitoquímico In Silico" : "In Silico Phytochemical Simulation"}
              </span>
            </div>
            <h4 className="text-lg font-serif font-bold text-white leading-snug">
              {lang === "es" ? "Cálculo Riguroso de Conformidad Regulatoria" : "Rigorous Regulatory Safety Assessment"}
            </h4>
          </div>

          {/* Core Animated Indicator Card */}
          <div className="bg-black/40 rounded-2xl p-4.5 border border-white/5 space-y-3 relative overflow-hidden">
            <div className="absolute top-1 right-2 flex items-center gap-1 font-mono text-[9px] text-zinc-500">
              <Zap className="w-3 h-3 text-yellow-500 animate-pulse" />
              <span>CORE GAIA-v4</span>
            </div>

            <div className="space-y-2">
              <div className="text-[10px] uppercase font-mono font-bold tracking-wider text-indigo-400 flex justify-between items-center">
                <span>{lang === "es" ? `Paso ${currentStep + 1} de ${activeSteps.length}` : `Step ${currentStep + 1} of ${activeSteps.length}`}</span>
                <span className="text-zinc-500 animate-pulse">{sec}s</span>
              </div>
              
              <div className="min-h-[44px] flex items-center">
                <span className="text-sm font-semibold text-zinc-200 border-l-2 border-primary pl-3">
                  {activeSteps[currentStep]}
                </span>
              </div>
            </div>

            {/* Live Progress Bar indicator */}
            <div className="w-full bg-zinc-800/80 h-1.5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary via-indigo-500 to-purple-500 rounded-full"
                animate={{ width: `${((currentStep + 1) / activeSteps.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Micro Telemetry Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-left">
              <div className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider">
                {lang === "es" ? "Temp. CPU" : "CPU Temp"}
              </div>
              <div className="text-sm font-extrabold font-mono text-zinc-200 mt-1">
                {temp}°C
              </div>
            </div>

            <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-left">
              <div className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider">
                {lang === "es" ? "Resolución" : "Resolution"}
              </div>
              <div className="text-sm font-extrabold font-mono text-indigo-400 mt-1">
                0.001 ppm
              </div>
            </div>

            <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-left">
              <div className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider">
                {lang === "es" ? "Algoritmo" : "Algorithm"}
              </div>
              <div className="text-sm font-extrabold font-mono text-zinc-200 mt-1 truncate">
                {activeRoute === "oral" ? "NGRA-EDI" : "SCCS-MoS"}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 italic">
            <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>
              {lang === "es"
                ? "Cumpliendo con NOM-073-SSA1-2015, SCCS (2023) y WHO (2010)"
                : "Complying with NOM-073-SSA1-2015, SCCS (2023) & WHO (2010)"}
            </span>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
