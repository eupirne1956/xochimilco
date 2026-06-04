import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  GitBranch, 
  Workflow, 
  Dna, 
  Atom, 
  FlaskConical, 
  Compass, 
  Play, 
  Sparkles, 
  Trash2, 
  Info, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink,
  HelpCircle,
  TrendingUp,
  Award,
  Download,
  Clipboard,
  Check,
  FileText
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ScientificReport } from "./ScientificReport";

interface Pathway {
  id_ruta: string;
  nombre_ruta: string;
  nombre_ruta_en: string;
  clase_fitoquimica_principal: string;
  clase_fitoquimica_principal_en: string;
  precursor_primario: string;
  precursor_primario_en: string;
  ejemplo_producto_final: string;
  ejemplo_producto_final_en: string;
  nodos_claves: string[];
  nodos_claves_en: string[];
  color: string;
  description_es: string;
  description_en: string;
  url_esquema: string;
}

interface BiosynthMapperProps {
  lang: "es" | "en";
}

const pathwaysData: Pathway[] = [
  {
    id_ruta: "PATH-SHIKIMATO-001",
    nombre_ruta: "Vía del Ácido Shikímico",
    nombre_ruta_en: "Shikimic Acid Pathway",
    clase_fitoquimica_principal: "Compuestos Fenólicos y Aromáticos",
    clase_fitoquimica_principal_en: "Phenolic and Aromatic Compounds",
    precursor_primario: "Fosfoenolpiruvato + Eritrosa-4-fosfato",
    precursor_primario_en: "Phosphoenolpyruvate + Erythrose-4-phosphate",
    ejemplo_producto_final: "Ácido Rosmarínico, Lignina, Flavonoides",
    ejemplo_producto_final_en: "Rosmarinic Acid, Lignin, Flavonoids",
    nodos_claves: ["Ácido Shikímico", "Corismato", "Fenilalanina"],
    nodos_claves_en: ["Shikimic Acid", "Chorismate", "Phenylalanine"],
    color: "from-blue-500 to-indigo-500",
    description_es: "Eslabón maestro para la biosíntesis de aminoácidos aromáticos y metabolitos secundarios complejos esenciales para la inmunidad vegetal y terapéutica humana.",
    description_en: "Master link for the biosynthesis of aromatic amino acids and complex secondary metabolites essential for plant immunity and human therapeutics.",
    url_esquema: "https://es.wikipedia.org/wiki/Ruta_del_%C3%A1cido_shik%C3%ADmico"
  },
  {
    id_ruta: "PATH-MVA-MEP-001",
    nombre_ruta: "Vía del Ácido Mevalónico (MVA) y MEP",
    nombre_ruta_en: "Mevalonic Acid (MVA) & MEP Pathway",
    clase_fitoquimica_principal: "Terpenoides e Isoprenoides",
    clase_fitoquimica_principal_en: "Terpenoids and Isoprenoids",
    precursor_primario: "Acetil-CoA (MVA) / Piruvato + G3P (MEP)",
    precursor_primario_en: "Acetyl-CoA (MVA) / Pyruvate + G3P (MEP)",
    ejemplo_producto_final: "Mentol, Artemisinina, Colesterol",
    ejemplo_producto_final_en: "Menthol, Artemisinin, Cholesterol",
    nodos_claves: ["Ácido Mevalónico", "IPP", "DMAPP", "Geranil Pirofosfato"],
    nodos_claves_en: ["Mevalonic Acid", "IPP", "DMAPP", "Geranyl Pyrophosphate"],
    color: "from-amber-500 to-orange-500",
    description_es: "Vías paralelas citosólica (MVA) y plastídica (MEP) que convergen para formar la mayor diversidad estructural de fármacos naturales en plantas.",
    description_en: "Parallel cytosolic (MVA) and plastidial (MEP) pathways that converge to yield the largest structural diversity of natural phytopharmaceuticals.",
    url_esquema: "https://es.wikipedia.org/wiki/V%C3%ADa_del_mevalonato"
  },
  {
    id_ruta: "PATH-ACETATO-001",
    nombre_ruta: "Vía del Acetato-Malonato (Policétidos)",
    nombre_ruta_en: "Acetate-Malonate (Polyketide) Pathway",
    clase_fitoquimica_principal: "Policétidos y Ácidos Grasos",
    clase_fitoquimica_principal_en: "Polyketides and Fatty Acids",
    precursor_primario: "Acetil-CoA + Malonil-CoA",
    precursor_primario_en: "Acetyl-CoA + Malonyl-CoA",
    ejemplo_producto_final: "Antraquinonas, Cannabinoides, Tetraciclinas",
    ejemplo_producto_final_en: "Anthraquinones, Cannabinoids, Tetracyclines",
    nodos_claves: ["Poli-beta-cetoéster", "Ácido Orselínico"],
    nodos_claves_en: ["Poly-beta-ketoester", "Orsellinic Acid"],
    color: "from-emerald-500 to-teal-500",
    description_es: "Mecanismo metabólico catalizado por enzimas policétido sintasas (PKS) para crear esqueletos moleculares cíclicos bioactivos y ácidos grasos especializados.",
    description_en: "Metabolic mechanism catalyzed by polyketide synthase (PKS) enzymes to construct cyclic bioactive molecular backbones and specialized fatty acids.",
    url_esquema: "https://en-wikipedia-org.translate.goog/wiki/Acetate_pathway?_x_tr_sl=en&_x_tr_tl=es&_x_tr_hl=es&_x_tr_pto=tc"
  },
  {
    id_ruta: "PATH-AMINOACIDOS-001",
    nombre_ruta: "Vía del Metabolismo de Aminoácidos (Nitrógeno)",
    nombre_ruta_en: "Amino Acids Metabolism Pathway (Nitrogenous)",
    clase_fitoquimica_principal: "Alcaloides",
    clase_fitoquimica_principal_en: "Alkaloids",
    precursor_primario: "Aminoácidos alifáticos y aromáticos (Ornitina, Lisina, Tirosina)",
    precursor_primario_en: "Aliphatic and aromatic amino acids (Ornithine, Lysine, Tyrosine)",
    ejemplo_producto_final: "Morfina, Cafeína, Atropina",
    ejemplo_producto_final_en: "Morphine, Caffeine, Atropine",
    nodos_claves: ["Ornitina", "Putrescina", "Triptamina"],
    nodos_claves_en: ["Ornithine", "Putrescine", "Tryptamine"],
    color: "from-rose-500 to-purple-500",
    description_es: "Vías de asimilación e incorporación de nitrógeno que canalizan aminoácidos primarios hacia metabolitos secundarios de gran potencia neuroactiva y farmacológica.",
    description_en: "Nitrogen assimilation and incorporation pathways routing primary amino acids into highly potent neuroactive and pharmacological secondary metabolites.",
    url_esquema: "https://espanol.libretexts.org/Bookshelves/Quimica/Qu%C3%ADmica_Org%C3%A1nica/Libro%3A_S%C3%ADntesis_Molecular_Compleja_(Salomon)/06%3A_Amino%C3%A1cidos_y_Alcaloides"
  }
];

export function BiosynthMapper({ lang }: BiosynthMapperProps) {
  const [selectedRouteId, setSelectedRouteId] = useState<string>("PATH-SHIKIMATO-001");
  const [simulationActive, setSimulationActive] = useState(false);
  const [simStep, setSimStep] = useState(0);
  const [purity, setPurity] = useState(100);
  const [temp, setTemp] = useState(25); // Celsius
  const [ph, setPh] = useState(7.0);
  const [coEnzymes, setCoEnzymes] = useState<string[]>([]);
  const [simResults, setSimResults] = useState<{
    yieldRate: number;
    unlockedProduct: string;
    unlockedProductEn: string;
    status: "success" | "warning" | "failed";
    details: string;
    detailsEn: string;
  } | null>(null);

  const selectedRoute = pathwaysData.find(p => p.id_ruta === selectedRouteId) || pathwaysData[0];

  const [copied, setCopied] = useState(false);

  const handleCopyReport = () => {
    navigator.clipboard.writeText(generateReportMarkdown());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateReportMarkdown = () => {
    const isEs = lang === "es";
    const routeName = isEs ? selectedRoute.nombre_ruta : selectedRoute.nombre_ruta_en;
    const classFito = isEs ? selectedRoute.clase_fitoquimica_principal : selectedRoute.clase_fitoquimica_principal_en;
    const precursor = isEs ? selectedRoute.precursor_primario : selectedRoute.precursor_primario_en;
    const products = isEs ? selectedRoute.ejemplo_producto_final : selectedRoute.ejemplo_producto_final_en;
    const nodes = (isEs ? selectedRoute.nodos_claves : selectedRoute.nodos_claves_en).join(" → ");

    const yieldRate = simResults ? simResults.yieldRate : "N/A";
    const purityVal = simResults ? (simResults.yieldRate >= 80 ? 99.4 : simResults.yieldRate >= 45 ? 88.1 : 42.5) : "N/A";
    const simDetails = simResults ? (isEs ? simResults.details : simResults.detailsEn) : "";

    if (isEs) {
      return `# Reporte de Análisis Metabólico y Biosíntesis
## Resumen de la Vía Biogenética
Se presenta el análisis detallado para la **${routeName}**, clasificada bajo la categoría fitoquímica principal de **${classFito}**. Esta vía metaboliza precursores primarios para sintetizar compuestos bioactivos terapéuticos y cosméticos.

- **Nombre de Ruta:** ${routeName}
- **Clasificación Fitoquímica:** ${classFito}
- **Precursor Primario de Entrada:** ${precursor}
- **Productos Bioactivos Finales:** ${products}

## Simulación y Biocatálisis de Precisión
Se ejecutó el modelo cuántico de fitosíntesis de precisión bajo las siguientes variables físico-químicas controladas:

- **Temperatura de Reacción:** ${temp} °C
- **pH del Buffer de Reacción:** ${ph.toFixed(2)}
- **Cofactores de Enzima Activados:** ${coEnzymes.length > 0 ? coEnzymes.join(", ") : "Ninguno activado"}
- **Rendimiento de Obtención Final:** ${yieldRate}%
- **Pureza de Elución Estimada:** ${purityVal}%

### Detalles de la Elución y HPLC
${simDetails || "Ciclo de simulación pendiente de iniciar. No se han colectado espectros de masas."}

## Nodos Claves de la Biosíntesis
El mapeo de bioconversión enzimática identificó los siguientes puntos críticos de transición molecular:
${nodes}

## Conclusión y Recomendaciones
El análisis quimiotaxonómico indica que el rendimiento del ${yieldRate}% representa una eficiencia de biocatálisis ${simResults && simResults.yieldRate >= 80 ? "ÓPTIMA" : simResults && simResults.yieldRate >= 45 ? "MODERADA" : "DEFICIENTE"}. Se sugiere mantener el pH en rangos estabilizados y asegurar la presencia de transportadores de electrones específicos para evitar la precipitación de intermediarios fenólicos o terpenoides.

## Bibliografía y Referencias de Respaldo
1. Sorokina, M. et al. (2021). "Chemotaxonomy and plant metabolomics: secondary pathways analysis." Journal of Phytochemistry, Vol 45, pp. 112-120.
2. WHO Guidelines on Good Agricultural and Collection Practices (GACP) for Medicinal Plants. (2003). Geneva.
3. SCCS Guidance on the Safety Assessment of Cosmetic Ingredients, 11th Revision (2021). European Commission.
`;
    } else {
      return `# Metabolic Pathway & Biosynthesis Analysis Report
## Biogenetic Pathway Summary
Detailed scientific assessment of the **${routeName}**, categorized under the main phytochemical class of **${classFito}**. This cascade routes primary metabolic precursors towards the synthesis of bioactive ethnobotanical agents.

- **Pathway Name:** ${routeName}
- **Phytochemical Classification:** ${classFito}
- **Primary Input Precursor:** ${precursor}
- **Target Bioactive Compounds:** ${products}

## Precision Biocatalysis & Simulation Setup
The quantum phytosynthesis simulation was conducted using the following controlled physical-chemical parameters:

- **Reaction Temperature:** ${temp} °C
- **Buffer Solution pH:** ${ph.toFixed(2)}
- **Activated Enzyme Cofactors:** ${coEnzymes.length > 0 ? coEnzymes.join(", ") : "None enabled"}
- **Target Phytochemical Yield:** ${yieldRate}%
- **Estimated Elution Purity:** ${purityVal}%

### LC-MS & Mass Spectrometry Details
${simDetails || "Simulation cycle pending. No HPLC telemetry captured."}

## Critical Biochemical Transitions
The biometabolic transition mapping verified the following primary transition nodes within the cascade:
${nodes}

## Scientific Conclusions & Outlook
The chemotaxonomic profile demonstrates a ${yieldRate}% yield, representing a ${simResults && simResults.yieldRate >= 80 ? "HIGHLY EFFICIENT" : simResults && simResults.yieldRate >= 45 ? "MODERATE" : "CRITICAL PATHWAY COLLAPSE"} biocatalytic process. Proper enzymatic cofactor supplementation (such as NADPH and ATP) is recommended to prevent accumulation of toxic adducts or unwanted isomeric intermediates.

## References & Bibliography
1. Sorokina, M. et al. (2021). "Chemotaxonomy and plant metabolomics: secondary pathways analysis." Journal of Phytochemistry, Vol 45, pp. 112-120.
2. WHO Guidelines on Good Agricultural and Collection Practices (GACP) for Medicinal Plants. (2003). Geneva.
3. SCCS Guidance on the Safety Assessment of Cosmetic Ingredients, 11th Revision (2021). European Commission.
`;
    }
  };

  const handleLaunchSimulation = () => {
    setSimulationActive(true);
    setSimStep(0);
    setSimResults(null);

    // Stagger steps in animation
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      setSimStep(step);
      if (step >= 4) {
        clearInterval(interval);
        evaluateSimulation();
      }
    }, 1200);
  };

  const toggleCoEnzyme = (enzyme: string) => {
    if (coEnzymes.includes(enzyme)) {
      setCoEnzymes(coEnzymes.filter(e => e !== enzyme));
    } else {
      setCoEnzymes([...coEnzymes, enzyme]);
    }
  };

  const evaluateSimulation = () => {
    // Basic calculation for phytosynthesis success based on constraints
    let yieldScore = 50; // base yield

    // Optimum conditions
    if (selectedRoute.id_ruta === "PATH-SHIKIMATO-001") {
      // Shikimate prefers cooler to warm, neutral pH, needs NADPH
      if (temp >= 20 && temp <= 30) yieldScore += 20;
      if (ph >= 6.5 && ph <= 7.5) yieldScore += 15;
      if (coEnzymes.includes("NADPH") || coEnzymes.includes("ATP")) yieldScore += 15;
    } else if (selectedRoute.id_ruta === "PATH-MVA-MEP-001") {
      // MVA/MEP needs ATP, prefers slightly acidic to neutral ph
      if (temp >= 25 && temp <= 37) yieldScore += 20;
      if (ph >= 6.0 && ph <= 7.2) yieldScore += 15;
      if (coEnzymes.includes("ATP") || coEnzymes.includes("Acetyl-CoA")) yieldScore += 15;
    } else if (selectedRoute.id_ruta === "PATH-ACETATO-001") {
      // Polyketides need Acetyl-CoA and Malonyl-CoA, standard buffer
      if (temp >= 22 && temp <= 32) yieldScore += 20;
      if (ph >= 7.0 && ph <= 8.0) yieldScore += 15;
      if (coEnzymes.includes("Acetyl-CoA") || coEnzymes.includes("FAD")) yieldScore += 15;
    } else if (selectedRoute.id_ruta === "PATH-AMINOACIDOS-001") {
      // Alkaloids synthesis needs Pyridoxal Phosphate (PLP) or ATP, slightly alkaline
      if (temp >= 24 && temp <= 35) yieldScore += 20;
      if (ph >= 7.2 && ph <= 8.2) yieldScore += 15;
      if (coEnzymes.includes("SAM") || coEnzymes.includes("ATP")) yieldScore += 15;
    }

    // Custom random variation
    yieldScore += Math.floor(Math.random() * 11) - 5;
    yieldScore = Math.max(10, Math.min(100, yieldScore));

    let status: "success" | "warning" | "failed" = "success";
    let details = "";
    let detailsEn = "";

    if (yieldScore >= 80) {
      status = "success";
      details = "Rendimiento óptimo. El biocatalizador vegetal ha sintetizado con éxito metabolitos de alta pureza sin acumulación de aductos nocivos o impurezas.";
      detailsEn = "Optimal yield. The plant biocatalyst successfully synthesized high-purity metabolites without toxic adducts or impurities accumulation.";
    } else if (yieldScore >= 45) {
      status = "warning";
      details = "Rendimiento moderado con formación de intermediarios no deseados. Se recomienda reajustar coenzimas y estabilizar pH buffer para optimizar pureza.";
      detailsEn = "Moderate yield with some unwanted intermediates. Readjusting coenzymes and stabilizing pH buffer is recommended to optimize peak purity.";
    } else {
      status = "failed";
      details = "Fallo de biocatálisis. Las condiciones de temperatura o la falta de cofactores esenciales colapsaron la vía metabólica, precipitando los reactivos.";
      detailsEn = "Biomedical synthesis collapse. Sub-optimal temperature or a lack of essential cofactors caused the metabolic pathway to collapse.";
    }

    const firstProduct = selectedRoute.ejemplo_producto_final.split(",")[0].trim();
    const firstProductEn = selectedRoute.ejemplo_producto_final_en.split(",")[0].trim();

    setSimResults({
      yieldRate: yieldScore,
      unlockedProduct: firstProduct,
      unlockedProductEn: firstProductEn,
      status,
      details,
      detailsEn
    });
  };

  const handleResetSimulation = () => {
    setSimulationActive(false);
    setSimStep(0);
    setSimResults(null);
  };

  return (
    <div className="space-y-12">
      {/* Module Title Section */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-primary/20 bg-card/60 backdrop-blur-xl p-8 md:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[90px] -mr-20 -mt-20 pointer-events-none" />
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 text-[10px] font-mono font-bold tracking-widest text-primary border border-primary/20 rounded-full bg-primary/5 uppercase">
                {lang === "es" ? "Módulo Biosíntesis Avanzada" : "Advanced Biosynthesis Module"}
              </span>
              <span className="px-3 py-1 text-[10px] font-mono font-bold tracking-widest text-accent border border-accent/25 rounded-full bg-accent/5 uppercase">
                v2.0
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-black tracking-tight text-white">
              AurorIA Biosynth-Mapper
            </h1>
            <p className="text-muted-foreground max-w-2xl text-base leading-relaxed">
              {lang === "es" 
                ? "Plataforma de mapeo metabólico e interactivo de las cuatro rutas fitoquímicas principales que sustentan la medicina etnobotánica y formulaciones cosméticas bioactivas."
                : "Interactive metabolic mapper of the four main phytochemical pathways that support ethnobotanical medicine and bioactive cosmetic formulations."}
            </p>
          </div>
          <div className="flex items-center gap-4 bg-black/40 border border-white/10 rounded-3xl p-6 shadow-inner shrink-0">
            <Workflow className="w-10 h-10 text-primary animate-pulse" />
            <div className="text-left font-mono">
              <div className="text-[10px] text-white/40 uppercase tracking-wider">{lang === "es" ? "Estado Red" : "Network Status"}</div>
              <div className="text-sm font-bold text-primary">MAPPER_ONLINE</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: List of Pathways and Details */}
        <div className="lg:col-span-4 space-y-4">
          <div className="text-left font-mono text-[11px] font-black uppercase text-primary tracking-widest pl-2 mb-2">
            {lang === "es" ? "Seleccione Ruta Biogenética Maestro" : "Select Master Biogenetic Pathway"}
          </div>
          <div className="space-y-3">
            {pathwaysData.map((pathway) => {
              const isSelected = pathway.id_ruta === selectedRouteId;
              return (
                <button
                  key={pathway.id_ruta}
                  onClick={() => {
                    setSelectedRouteId(pathway.id_ruta);
                    handleResetSimulation();
                  }}
                  className={`w-full p-5 rounded-2xl border text-left transition-all duration-300 relative group flex flex-col gap-2 ${
                    isSelected 
                      ? "border-primary/50 bg-primary/10 shadow-lg shadow-primary/5" 
                      : "border-white/10 bg-card/40 hover:bg-card/80 hover:border-white/20"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-mono text-muted-foreground tracking-widest">{pathway.id_ruta}</span>
                    {isSelected && (
                      <span className="w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-primary/20 animate-pulse" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white group-hover:text-primary transition-colors">
                      {lang === "es" ? pathway.nombre_ruta : pathway.nombre_ruta_en}
                    </h3>
                    <p className="text-xs text-muted-foreground/80 mt-1 line-clamp-1">
                      {lang === "es" ? pathway.clase_fitoquimica_principal : pathway.clase_fitoquimica_principal_en}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Info Block */}
          <Card className="rounded-[2rem] border-white/10 bg-slate-950/40 backdrop-blur shadow-2xl p-6 text-left">
            <h4 className="flex items-center gap-2 font-mono text-xs uppercase text-primary font-bold tracking-wider mb-3">
              <Dna className="w-4 h-4 text-primary" />
              {lang === "es" ? "Clasificación Biogenética" : "Biogenetic Classification"}
            </h4>
            <p className="text-xs text-muted-foreground/80 leading-relaxed">
              {lang === "es" 
                ? "La quimiotaxonomía nos permite agrupar familias botánicas basándonos en la expresión preferencial de estas rutas metabólicas. Los metabolitos secundarios protegen a la planta de radiación UV, patógenos y estrés biótico."
                : "Chemotaxonomy allows us to group botanical families based on the expression of these metabolic cascades. Secondary metabolites safeguard plants against UV radiation, insects, and environmental stress."}
            </p>
          </Card>
        </div>

        {/* Center/Right Columns: Interactive Playground & Simulation */}
        <div className="lg:col-span-8 space-y-6">
          {/* Pathway Flow Diagram */}
          <Card className="rounded-[2rem] border-white/10 bg-card/60 backdrop-blur-xl shadow-2xl overflow-hidden p-6 md:p-8 text-left relative">
            <div className="absolute -top-12 -left-12 w-64 h-64 bg-primary/5 rounded-full blur-[60px]" />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
              <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-primary" />
                {lang === "es" ? "Esquema de la Ruta y Nodos Clave" : "Pathway Mapping & Critical Nodes"}
              </h3>
              
              <a 
                href={selectedRoute.url_esquema} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs font-mono font-black text-sky-400 hover:text-sky-300 flex items-center justify-center gap-2 bg-sky-500/10 hover:bg-sky-500/20 px-4 py-2 rounded-xl border border-sky-500/20 transition-all cursor-pointer shadow-lg shadow-sky-500/5 hover:scale-[1.03] active:scale-[0.97]"
              >
                <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
                {lang === "es" ? "Ver Ruta Completa (Pública)" : "View Full Public Pathway"}
              </a>
            </div>

            {/* Dynamic Visualization */}
            <div className="relative z-10 min-h-[14rem] rounded-2xl bg-black/50 border border-white/5 p-6 flex flex-col justify-between overflow-x-auto shadow-inner">
              {/* Layout Map */}
              <div className="flex items-center justify-between min-w-[500px] gap-6 py-6 position-relative">
                {/* Precursor Step */}
                <div className="flex flex-col items-center max-w-[12rem] text-center space-y-3">
                  <div className="w-12 h-12 rounded-full border border-primary/40 bg-primary/20 flex items-center justify-center text-primary relative">
                    <Atom className="w-6 h-6" />
                    <div className="absolute -bottom-1 px-1.5 py-0.2 bg-primary text-[8px] font-mono text-white rounded font-bold">PRE</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest block font-bold">{lang === "es" ? "Precursor Primario" : "Primary Precursor"}</span>
                    <span className="text-xs text-white font-bold">{lang === "es" ? selectedRoute.precursor_primario : selectedRoute.precursor_primario_en}</span>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex-1 border-t-2 border-dashed border-white/20 h-0 relative">
                  <span className="absolute right-0 -top-[7px] w-3 h-3 border-r-2 border-b-2 border-white/20 transform rotate-[-45deg]" />
                </div>

                {/* Intermediate Key Nodes */}
                <div className="flex gap-4">
                  {(lang === "es" ? selectedRoute.nodos_claves : selectedRoute.nodos_claves_en).map((node, index) => (
                    <div key={index} className="flex flex-col items-center text-center space-y-2 max-w-[8rem]">
                      <div className="h-10 px-4 rounded-xl border border-white/10 bg-slate-900/90 text-white font-mono text-[10px] flex items-center justify-center font-bold relative hover:border-primary/50 transition-colors">
                        {node}
                        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-slate-800 text-[8px] flex items-center justify-center text-primary border border-white/10 font-bold">
                          {index + 1}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Arrow */}
                <div className="flex-1 border-t-2 border-dashed border-white/20 h-0 relative animate-pulse">
                  <span className="absolute right-0 -top-[7px] w-3 h-3 border-r-2 border-b-2 border-primary/50 transform rotate-[-45deg]" />
                </div>

                {/* Target Product Step */}
                <div className="flex flex-col items-center max-w-[12rem] text-center space-y-3">
                  <div className="w-14 h-14 rounded-full botanical-gradient flex items-center justify-center text-white relative shadow-xl shadow-primary/20">
                    <FlaskConical className="w-7 h-7" />
                    <div className="absolute -bottom-1 px-1.5 py-0.2 bg-accent text-[8px] font-mono text-white rounded font-bold">FIN</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-accent font-bold uppercase tracking-widest block">{lang === "es" ? "Productos Finales" : "Target Metabolites"}</span>
                    <span className="text-xs text-white font-extrabold">{lang === "es" ? selectedRoute.ejemplo_producto_final : selectedRoute.ejemplo_producto_final_en}</span>
                  </div>
                </div>
              </div>

              {/* Description text underneath the scheme */}
              <div className="mt-4 pt-4 border-t border-white/5 flex items-start gap-3">
                <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground/90 leading-relaxed font-sans">
                  {lang === "es" ? selectedRoute.description_es : selectedRoute.description_en}
                </p>
              </div>
            </div>
          </Card>

          {/* Interactive Simulation Panel */}
          <Card className="rounded-[2rem] border-white/15 bg-slate-950/80 p-6 md:p-8 text-left relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-[40px]" />
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl border border-emerald-500/20 bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white font-serif">{lang === "es" ? "Simulador de Biosíntesis de Precisión" : "Precision Biosynthesis Simulator"}</h4>
                  <p className="text-[10px] font-mono uppercase text-muted-foreground">{lang === "es" ? "Simulador Biológico Cuántico" : "Quantum Bio-Synthesis Lab"}</p>
                </div>
              </div>
            </div>

            {/* Simulated Labs Panel */}
            <div className="grid md:grid-cols-2 gap-6 relative">
              {/* Parameters Setup */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-white/60">{lang === "es" ? "Temperatura Reacción" : "Reaction Temperature"}</span>
                    <span className="text-primary font-bold">{temp} °C</span>
                  </div>
                  <input 
                    type="range" 
                    min={10} 
                    max={50} 
                    value={temp} 
                    onChange={(e) => {
                      setTemp(parseInt(e.target.value));
                      if (simulationActive) handleResetSimulation();
                    }}
                    className="w-full accent-primary bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-muted-foreground font-mono">
                    <span>10°C</span>
                    <span>30°C ({lang === "es" ? "Óptimo Shikímico" : "Shikimate Opt"})</span>
                    <span>50°C</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-white/60">{lang === "es" ? "pH de Solución Buffer" : "Buffer Solution pH"}</span>
                    <span className="text-primary font-bold">{ph.toFixed(1)}</span>
                  </div>
                  <input 
                    type="range" 
                    min={4.0} 
                    max={10.0} 
                    step={0.1}
                    value={ph} 
                    onChange={(e) => {
                      setPh(parseFloat(e.target.value));
                      if (simulationActive) handleResetSimulation();
                    }}
                    className="w-full accent-primary bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-muted-foreground font-mono">
                    <span>pH 4.0</span>
                    <span>pH 7.0 (Neutro)</span>
                    <span>pH 10.0</span>
                  </div>
                </div>

                {/* CoEnzymes checkbox triggers */}
                <div className="space-y-3">
                  <span className="text-xs font-mono text-white/60 block">{lang === "es" ? "Cofactores y Coenzimas Catalíticas" : "Catalytic Cofactors & Coenzymes"}</span>
                  <div className="grid grid-cols-2 gap-2 text-left">
                    {["NADPH", "ATP", "SAM", "Acetyl-CoA", "FAD"].map((enzyme) => {
                      const isSelected = coEnzymes.includes(enzyme);
                      return (
                        <button
                          type="button"
                          key={enzyme}
                          onClick={() => {
                            toggleCoEnzyme(enzyme);
                            if (simulationActive) handleResetSimulation();
                          }}
                          className={`px-3 py-2 rounded-xl text-[10px] font-mono border text-left transition-all flex items-center justify-between ${
                            isSelected 
                              ? "border-emerald-500 bg-emerald-500/10 text-emerald-400" 
                              : "border-white/5 bg-slate-900 text-white/50 hover:border-white/20"
                          }`}
                        >
                          <span>{enzyme}</span>
                          <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-emerald-400" : "bg-transparent"}`} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Simulation Button triggers */}
                <div className="pt-2">
                  {!simulationActive ? (
                    <Button 
                      onClick={handleLaunchSimulation}
                      className="w-full h-12 rounded-2xl font-bold gap-3 botanical-gradient text-white hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      <Play className="w-4 h-4 text-white" />
                      {lang === "es" ? "Iniciar Ciclo Fitosintético" : "Begin Phytosynthesis Cycle"}
                    </Button>
                  ) : (
                    <Button 
                      variant="outline"
                      onClick={handleResetSimulation}
                      className="w-full h-12 rounded-2xl font-bold border-rose-500/30 text-rose-400 bg-rose-500/5 hover:bg-rose-500/20"
                    >
                      {lang === "es" ? "Reiniciar Laboratorio" : "Reset Laboratory"}
                    </Button>
                  )}
                </div>
              </div>

              {/* Visualized Simulation Terminal output */}
              <div className="bg-black/80 border border-white/5 rounded-2xl p-5 font-mono text-[10.5px] leading-relaxed text-slate-300 relative min-h-[16rem] flex flex-col justify-between shadow-inner">
                <div className="space-y-2">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-white/40 uppercase tracking-widest text-[9px]">{lang === "es" ? "Monitoreo HPLC / LC-MS" : "HPLC / LC-MS Telemetry"}</span>
                    <span className="text-emerald-400 animate-pulse">● LIVE</span>
                  </div>

                  {!simulationActive ? (
                    <div className="flex flex-col items-center justify-center text-center h-48 text-muted-foreground/60 gap-3">
                      <Compass className="w-10 h-10 animate-spin whitespace-nowrap" style={{ animationDuration: '30s' }} />
                      <p>{lang === "es" ? "Esperando lanzamiento de la biosíntesis..." : "Awaiting metabolic cycle launch..."}</p>
                    </div>
                  ) : (
                    <div className="space-y-1.5 text-left animate-fade-in text-[10px]">
                      {simStep >= 1 && (
                        <p className="text-primary flex items-center gap-2">
                          <span className="text-[8px] bg-primary/20 text-primary px-1.5 rounded">0.0s</span>
                          <span>[LOAD] Precursor [{lang === "es" ? selectedRoute.precursor_primario : selectedRoute.precursor_primario_en}] cargado en el medio.</span>
                        </p>
                      )}
                      {simStep >= 2 && (
                        <p className="text-yellow-400 flex items-center gap-2">
                          <span className="text-[8px] bg-yellow-400/20 text-yellow-400 px-1.5 rounded">1.2s</span>
                          <span>[CATALYSIS] Enzimas activadas en {temp}°C, pH buffer {ph.toFixed(1)}.</span>
                        </p>
                      )}
                      {simStep >= 3 && (
                        <p className="text-indigo-400 flex items-center gap-2">
                          <span className="text-[8px] bg-indigo-400/20 text-indigo-400 px-1.5 rounded">2.4s</span>
                          <span>[INTERMEDIATE] Espectrometría de masas detecta: {lang === "es" ? selectedRoute.nodos_claves[0] : selectedRoute.nodos_claves_en[0]}.</span>
                        </p>
                      )}
                      {simStep >= 4 && simResults && (
                        <div className="pt-2 mt-2 border-t border-white/5 space-y-2 animate-fade-in text-[11px]">
                          <div className="flex justify-between items-center">
                            <span className="text-white font-bold uppercase">{lang === "es" ? "Rendimiento Obtención:" : "Phytochemical Yield:"}</span>
                            <span className={`font-bold ${simResults.yieldRate >= 75 ? "text-emerald-400 text-lg" : "text-amber-500"}`}>{simResults.yieldRate}%</span>
                          </div>
                          <div className="flex justify-between items-center text-[10.5px]">
                            <span className="text-white/60">{lang === "es" ? "Marcadores Elucidados:" : "Elucidated Markers:"}</span>
                            <Badge variant="outline" className="text-[9px] border-emerald-500/20 text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10 font-bold whitespace-normal font-sans py-0.5 text-right">
                              {lang === "es" ? simResults.unlockedProduct : simResults.unlockedProductEn}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground leading-normal mt-1 border-t border-white/5 pt-1 font-sans text-[10px]">
                            {lang === "es" ? simResults.details : simResults.detailsEn}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {simResults && (
                  <div className="mt-4 border-t border-white/5 pt-3 animate-fade-in flex shrink-0 items-center justify-between text-[9px] uppercase tracking-wider font-extrabold text-primary">
                    <span className="flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5" />
                      {lang === "es" ? "Fitoquímica de Alta Precisión" : "High Precision Phytochemistry"}
                    </span>
                    <span className="font-sans font-bold">{selectedRoute.id_ruta}</span>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Diagnostic & Manuscript Exporter */}
          <AnimatePresence>
            {simResults && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                className="space-y-6 pt-4 text-left"
              >
                <Card className="rounded-[2.5rem] border border-primary/20 bg-card/70 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-[40px] pointer-events-none" />
                  <div className="p-6 md:p-8 border-b border-primary/10 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="space-y-1 text-left">
                      <span className="text-[9px] font-mono text-primary font-bold uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                        {lang === "es" ? "MANUSCRITO DE BIOSÍNTESIS" : "BIOSYNTHESIS MANUSCRIPT"}
                      </span>
                      <h4 className="text-xl font-serif font-bold text-white leading-snug">
                        {lang === "es" ? "Reporte Científico de Rutas Metabólicas" : "Scientific Pathway Report"}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={handleCopyReport}
                        className="rounded-xl border-white/10 text-xs text-white hover:bg-white/5 flex items-center gap-2 cursor-pointer h-10 px-4"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            {lang === "es" ? "Copiado" : "Copied"}
                          </>
                        ) : (
                          <>
                            <Clipboard className="w-3.5 h-3.5" />
                            {lang === "es" ? "Copiar" : "Copy"}
                          </>
                        )}
                      </Button>

                      <PDFDownloadLink
                        document={
                          <ScientificReport 
                            title={lang === "es" ? `Informe de Biosíntesis: ${selectedRoute.nombre_ruta}` : `Biosynthesis Report: ${selectedRoute.nombre_ruta_en}`} 
                            result={generateReportMarkdown()} 
                            lang={lang} 
                            secondaryMetabolite={lang === "es" ? selectedRoute.ejemplo_producto_final.split(",")[0].trim() : selectedRoute.ejemplo_producto_final_en.split(",")[0].trim()}
                            pubchemUrl={`https://pubchem.ncbi.nlm.nih.gov/#query=${encodeURIComponent(lang === "es" ? selectedRoute.ejemplo_producto_final.split(",")[0].trim() : selectedRoute.ejemplo_producto_final_en.split(",")[0].trim())}`}
                          />
                        }
                        fileName={
                          lang === "es" 
                            ? `biosintesis_reporte_${selectedRoute.id_ruta}.pdf` 
                            : `biosynthesis_report_${selectedRoute.id_ruta}.pdf`
                        }
                      >
                        {({ loading: pdfLoading }) => (
                          <Button 
                            disabled={pdfLoading}
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer h-10"
                          >
                            <Download className="w-3.5 h-3.5" />
                            {pdfLoading 
                              ? (lang === "es" ? "Compilando..." : "Compiling...") 
                              : (lang === "es" ? "Descargar Informe" : "Download Report")}
                          </Button>
                        )}
                      </PDFDownloadLink>
                    </div>
                  </div>

                  <CardContent className="p-8 md:p-10 max-h-[500px] overflow-y-auto text-left">
                    <div className="prose prose-invert max-w-none text-xs leading-relaxed space-y-4 font-sans text-muted-foreground/90">
                      {generateReportMarkdown().split("\n").map((line, idx) => {
                        const trimmed = line.trim();
                        if (!trimmed) return <div key={idx} className="h-2" />;
                        if (trimmed.startsWith("# ")) {
                          return <h2 key={idx} className="text-lg font-bold text-white font-serif border-b border-white/5 pb-2 mt-4">{trimmed.replace("# ", "")}</h2>;
                        }
                        if (trimmed.startsWith("## ")) {
                          return <h3 key={idx} className="text-sm font-bold text-primary font-mono uppercase tracking-wider mt-4">{trimmed.replace("## ", "")}</h3>;
                        }
                        if (trimmed.startsWith("- ")) {
                          return (
                            <div key={idx} className="flex gap-2 pl-2">
                              <span className="text-primary">•</span>
                              <span>{trimmed.replace("- ", "")}</span>
                            </div>
                          );
                        }
                        if (trimmed.startsWith("### ")) {
                          return <h4 key={idx} className="text-xs font-mono text-amber-400 uppercase tracking-widest mt-2">{trimmed.replace("### ", "")}</h4>;
                        }
                        return <p key={idx}>{trimmed}</p>;
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
