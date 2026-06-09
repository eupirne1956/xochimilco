import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  FlaskConical, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Flame, 
  Droplet, 
  Thermometer, 
  Play, 
  RotateCcw, 
  UserCheck, 
  ShieldAlert, 
  Archive, 
  Layers, 
  Calculator, 
  Check, 
  Clock, 
  FileText,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
  Waves,
  Eye,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";


const BotanicalMotor = ({ active, className = "w-8 h-8" }: { active: boolean; className?: string }) => {
  return (
    <div className={`relative ${className} flex items-center justify-center`}>
      {/* Outer spinning gear */}
      <motion.svg
        viewBox="0 0 100 100"
        className="w-full h-full text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]"
        animate={active ? { rotate: 360 } : { rotate: 0 }}
        transition={active ? { repeat: Infinity, duration: 2.5, ease: "linear" } : { duration: 0.5 }}
      >
        <g fill="currentColor">
          <rect x="44" y="2" width="12" height="15" rx="3" />
          <rect x="44" y="83" width="12" height="15" rx="3" />
          <rect x="2" y="44" width="15" height="12" rx="3" />
          <rect x="83" y="44" width="15" height="12" rx="3" />
          <rect x="44" y="2" width="12" height="15" rx="3" transform="rotate(30, 50, 50)" />
          <rect x="44" y="2" width="12" height="15" rx="3" transform="rotate(60, 50, 50)" />
          <rect x="44" y="2" width="12" height="15" rx="3" transform="rotate(120, 50, 50)" />
          <rect x="44" y="2" width="12" height="15" rx="3" transform="rotate(150, 50, 50)" />
        </g>
        <circle cx="50" cy="50" r="33" className="fill-transparent stroke-emerald-300 stroke-[6]" />
      </motion.svg>

      {/* Flower core with colorful petals spinning the opposite way */}
      <motion.svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]"
        animate={active ? { rotate: -360 } : { rotate: 0 }}
        transition={active ? { repeat: Infinity, duration: 3.5, ease: "linear" } : { duration: 0.5 }}
      >
        <g className="fill-rose-450 opacity-90">
          <ellipse cx="50" cy="32" rx="10" ry="14" />
          <ellipse cx="50" cy="68" rx="10" ry="14" />
          <ellipse cx="32" cy="50" rx="14" ry="10" />
          <ellipse cx="68" cy="50" rx="14" ry="10" />
          
          <g transform="rotate(45, 50, 50)" className="fill-amber-400">
            <ellipse cx="50" cy="34" rx="8" ry="12" />
            <ellipse cx="50" cy="66" rx="8" ry="12" />
            <ellipse cx="34" cy="50" rx="12" ry="8" />
            <ellipse cx="66" cy="50" rx="12" ry="8" />
          </g>
        </g>
        <circle cx="50" cy="50" r="9" className="fill-yellow-300 stroke-rose-500 stroke-2" />
      </motion.svg>

      {/* Spores / Sparkles */}
      {active && (
        <>
          <motion.div
            className="absolute w-2.5 h-2.5 bg-yellow-300 rounded-full blur-[0.4px]"
            animate={{ scale: [1, 2.2, 1], x: [0, 22, -10], y: [0, -25, -5], opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}
          />
          <motion.div
            className="absolute w-2 h-2 bg-sky-300 rounded-full blur-[0.4px]"
            animate={{ scale: [1, 2, 1], x: [0, -22, 12], y: [0, 20, -10], opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 1.3, delay: 0.3 }}
          />
          <motion.div
            className="absolute w-1.5 h-1.5 bg-rose-300 rounded-full blur-[0.3px]"
            animate={{ scale: [1, 1.8, 1], x: [0, 15, 25], y: [0, 15, -15], opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 1.1, delay: 0.6 }}
          />
        </>
      )}
    </div>
  );
};

// 10 Phytochemical/Botanical experiments
export interface Experiment {
  id: string;
  categoria: string;
  categoria_en: string;
  titulo: string;
  titulo_en: string;
  especie: string;
  tiempo: number;
  dificultad: "Fácil" | "Intermedia" | "Avanzada";
  dificultad_en: "Easy" | "Intermediate" | "Advanced";
  autor: string;
  objetivos: string[];
  objetivos_en: string[];
  fundamento: string;
  fundamento_en: string;
  sim_type: "distillation" | "extraction" | "chromatography" | "ultrasound" | "colorimetry" | "precipitation";
  epp: { id: string; es: string; en: string }[];
  precauciones: string[];
  precauciones_en: string[];
  biomasa: string[];
  biomasa_en: string[];
  cristaleria: string[];
  cristaleria_en: string[];
  pasos: { paso: number; instruccion: string; instruccion_en: string; es_critico: boolean }[];
  formula: string;
  formula_label: string;
  formula_label_en: string;
  input_biomass_label: string;
  input_biomass_label_en: string;
  input_yield_label: string;
  input_yield_label_en: string;
  default_biomass: number;
  default_yield_val: number;
  range_min: number;
  range_max: number;
  unidad: string;
  residuos: string[];
  residuos_en: string[];
}

const experimentsList: Experiment[] = [
  {
    id: "LAB-EXT-001",
    categoria: "Métodos de Extracción",
    categoria_en: "Extraction Methods",
    titulo: "Extracción de Aceite Esencial por Arrastre de Vapor",
    titulo_en: "Essential Oil Steam Distillation Extraction",
    especie: "Mentha piperita L.",
    tiempo: 120,
    dificultad: "Intermedia",
    dificultad_en: "Intermediate",
    autor: "AurorIA Académico",
    sim_type: "distillation",
    objetivos: [
      "Comprender el fundamento fisicoquímico de la destilación por arrastre de vapor.",
      "Aislar la fracción volátil (aceite esencial) a partir de material vegetal fresco.",
      "Calcular el rendimiento de extracción de la biomasa procesada."
    ],
    objetivos_en: [
      "Understand the physicochemical principles of steam distillation.",
      "Isolate the volatile fraction (essential oil) from fresh plant material.",
      "Calculate the extraction yield percentages of the biomass."
    ],
    fundamento: "La destilación por arrastre de vapor volatiliza compuestos orgánicos volátiles inmiscibles a bajas presiones combinadas, permitiendo aislar monoterpenos como el mentol a menos de 100°C sin degradarlos por calor directo.",
    fundamento_en: "Steam distillation volatilizes immiscible volatile organic compounds under combined pressures, allowing the isolation of monoterpenes like menthol below 100°C without direct thermal degradation.",
    epp: [
      { id: "bata", es: "Bata de algodón", en: "Cotton lab coat" },
      { id: "gafas", es: "Gafas de seguridad", en: "Safety goggles" },
      { id: "guantes", es: "Guantes de nitrilo", en: "Nitrile gloves" }
    ],
    precauciones: [
      "Asegurar juntas esmeriladas engrasadas para evitar fugas de vapor.",
      "Vigilar constantemente el flujo de agua fría en el condensador."
    ],
    precauciones_en: [
      "Ensure ground glass joints are greased to avoid high-pressure steam leaks.",
      "Constantly monitor cold water flow inside the condenser jacket."
    ],
    biomasa: ["100 g de hojas frescas de Mentha piperita", "Agua destilada", "Sulfato de sodio anhidro (desecante)"],
    biomasa_en: ["100 g fresh leaves of Mentha piperita", "Distilled water", "Anhydrous sodium sulfate (drying agent)"],
    cristaleria: ["Generador de vapor (balón plano)", "Matraz de dos bocas", "Refrigerante Liebig/serpentín", "Embudo de separación"],
    cristaleria_en: ["Steam generator flask", "Two-neck boiling flask", "Liebig condenser or coil jacket", "Separatory funnel"],
    pasos: [
      { paso: 1, instruccion: "Pesar exactamente 100 g de material vegetal fresco.", instruccion_en: "Weigh exactly 100 g of fresh plant material.", es_critico: false },
      { paso: 2, instruccion: "Ensamblar el equipo. Colocar la biomasa en el matraz de dos bocas.", instruccion_en: "Assemble distillation rig. Place biomass in the two-neck flask.", es_critico: true },
      { paso: 3, instruccion: "Activar el flujo de agua fría de refrigeración en el condensador.", instruccion_en: "Turn on cold refrigeration water flow inside the condenser.", es_critico: true },
      { paso: 4, instruccion: "Iniciar calentamiento del generador hasta ebullición constante.", instruccion_en: "Start heating steam generator to constant boil.", es_critico: false },
      { paso: 5, instruccion: "Recolectar 150 mL de mezcla bifásica (hidrolato/aceite).", instruccion_en: "Collect 150 mL of biphasic mix (hydrosol/oil).", es_critico: false },
      { paso: 6, instruccion: "Decantar en embudo de separación recuperando la fase orgánica superior.", instruccion_en: "Decant in a separatory funnel recovering the top organic layer.", es_critico: true },
      { paso: 7, instruccion: "Secar con sulfato de sodio anhidro, filtrar y registrar peso final.", instruccion_en: "Dry with anhydrous sodium sulfate, filter, and weigh oil.", es_critico: false }
    ],
    formula: "(Sustancia_g / Biomasa_g) * 100",
    formula_label: "Rendimiento Aceite (%)",
    formula_label_en: "Oil Yield (%)",
    input_biomass_label: "Peso Biomasa (g)",
    input_biomass_label_en: "Biomass Weight (g)",
    input_yield_label: "Peso Aceite Obtenido (g)",
    input_yield_label_en: "Obtained Oil Weight (g)",
    default_biomass: 100,
    default_yield_val: 1.8,
    range_min: 1.0,
    range_max: 2.5,
    unidad: "%",
    residuos: [
      "La biomasa vegetal agotada puede ir a composta orgánica.",
      "El agua e hidrolato sobrante puede ir a la tarja general.",
      "El sulfato inorgánico hidratado va al contenedor de sólidos."
    ],
    residuos_en: [
      "Spent plant biomass can be composted in general organic bins.",
      "Remaining water and hydrosol can be discharged into sinks.",
      "Hydrated sodium sulfate must go into solid inorganic waste."
    ]
  },
  {
    id: "LAB-EXT-002",
    categoria: "Métodos de Extracción",
    categoria_en: "Extraction Methods",
    titulo: "Extracción de Mucílagos por Maceración Acuosa",
    titulo_en: "Aqueous Maceration and Isolation of Mucilages",
    especie: "Opuntia ficus-indica L.",
    tiempo: 90,
    dificultad: "Fácil",
    dificultad_en: "Easy",
    autor: "Biosistemas AurorIA",
    sim_type: "extraction",
    objetivos: [
      "Extraer los polímeros hidrocoloides solubles (mucílago) mediante maceración fría.",
      "Precipitar los polisacáridos selectivamente usando alcohol etílico frío.",
      "Cuantificar el contenido de gomas naturales del nopal."
    ],
    objetivos_en: [
      "Extract soluble hydrocolloid polymers (mucilage) using cold maceration.",
      "Selectively precipitate polysaccharides using cold ethanol.",
      "Weigh and quantify the natural gel content of the cactus pads."
    ],
    fundamento: "El mucílago de nopal es un polisacárido altamente ramificado soluble en agua caliente o templada. Disminuye su solubilidad drásticamente en solventes polares de baja constante dieléctrica como el etanol frío, obligando su precipitación directa.",
    fundamento_en: "Cactus mucilage is a highly branched polysaccharide soluble in warm water. Its solubility drops drastically in polar solvents with low dielectric constants like cold ethanol, triggering immediate precipitation.",
    epp: [
      { id: "bata", es: "Bata de algodón", en: "Cotton lab coat" },
      { id: "guantes", es: "Guantes de látex", en: "General latex gloves" }
    ],
    precauciones: [
      "Evitar el contacto ocular directo con el alcohol etílico desnaturalizado.",
      "Operar la licuadora o triturador con cuidado de no salpicar fluidos viscosos."
    ],
    precauciones_en: [
      "Avoid direct ocular contact with denatured ethyl alcohol.",
      "Take care when blending mucilaginous solids to prevent viscous splashes."
    ],
    biomasa: ["200 g de cladodios de nopal frescos", "Etanol frío al 96%", "Agua destilada templada"],
    biomasa_en: ["200 g fresh cactus pads (cladodes)", "96% Cold ethanol", "Warm distilled water"],
    cristaleria: ["Vaso de precipitados (500 mL)", "Licuadora/Homogeneizador", "Tela de filtración fina", "Caja Petri"],
    cristaleria_en: ["Beaker (500 mL)", "Industrial Blender/Homogenizer", "Fine cheesecloth filter", "Petri Dish for drying"],
    pasos: [
      { paso: 1, instruccion: "Remover espinas del cladodio, cortar en cubos y pesar 200g.", instruccion_en: "De-thorn cactus pad, dice into small cubes and weigh 200g.", es_critico: false },
      { paso: 2, instruccion: "Licuar con 150 ml de agua destilada templada durante 3 minutos.", instruccion_en: "Blend with 150 ml of warm distilled water for 3 minutes.", es_critico: false },
      { paso: 3, instruccion: "Filtrar el macerado baboso usando la tela fina, exprimiendo el residuo.", instruccion_en: "Filter viscosity using cheesecloth, manually squeezing residue.", es_critico: true },
      { paso: 4, instruccion: "Medir el extracto viscoso y verter gradualmente sobre etanol frío 1:3.", instruccion_en: "Measure the slimy extract and slowly pour into 1:3 ice-cold ethanol.", es_critico: true },
      { paso: 5, instruccion: "Observar la formación de nubes gomosas blancas flotantes y pescar el gel.", instruccion_en: "Observe white gummy clouds forming and scoop out the cohesive gel.", es_critico: false },
      { paso: 6, instruccion: "Deshidratar el gel en horno a 45°C durante 12 horas hasta obtener polvo seco.", instruccion_en: "Dry in hot air oven at 45°C for 12 hours until a dry flake is active.", es_critico: false }
    ],
    formula: "(Peso_Seco_g / Peso_Nopal_Fresco_g) * 100",
    formula_label: "Rendimiento Mucílago (%)",
    formula_label_en: "Mucilage Yield (%)",
    input_biomass_label: "Peso Nopal Fresco (g)",
    input_biomass_label_en: "Fresh Cactus Weight (g)",
    input_yield_label: "Peso Mucílago Seco (g)",
    input_yield_label_en: "Dry Mucilage Weight (g)",
    default_biomass: 200,
    default_yield_val: 12.4,
    range_min: 5.0,
    range_max: 15.0,
    unidad: "%",
    residuos: [
      "El bagazo fibroso va directo a la basura orgánica.",
      "El sobrenadante de etanol-agua diluido se recupera en bote de solventes polares."
    ],
    residuos_en: [
      "Fibrous cactus pulp goes directly into organic waste.",
      "The filtered ethanol-water waste should be placed in polar solvent recovery bottles."
    ]
  },
  {
    id: "LAB-EXT-003",
    categoria: "Métodos de Extracción",
    categoria_en: "Extraction Methods",
    titulo: "Obtención de Tintura Alcohólica por Percolación",
    titulo_en: "Mother Tincture Isolation via Percolation",
    especie: "Calendula officinalis",
    tiempo: 180,
    dificultad: "Intermedia",
    dificultad_en: "Intermediate",
    autor: "Unidad Fitoquímica",
    sim_type: "extraction",
    objetivos: [
      "Operar un percolador de cilindro para extracción exhaustiva de flavonoides.",
      "Controlar la tasa de goteo para optimizar la transferencia de masa.",
      "Examinar los sólidos solubles totales de la tintura officinalis."
    ],
    objetivos_en: [
      "Operate a cylinder percolator for exhaustive extraction of flavonoids.",
      "Control drip discharge rate to optimize micro mass transfers.",
      "Determine total soluble solids inside the apothecary tincture."
    ],
    fundamento: "La percolación expone continuamente a la biomasa con solvente fresco en un flujo descendente por gravedad, minimizando el equilibrio de saturación que usualmente limita a la maceración estática.",
    fundamento_en: "Percolation exposes biomass continuously to fresh fresh solvent via descendent gravity flow, avoiding the saturation equilibrium bottlenecks typical of static maceration.",
    epp: [
      { id: "bata", es: "Bata de algodón", en: "Cotton lab coat" },
      { id: "gafas", es: "Gafas de seguridad", en: "Safety goggles" }
    ],
    precauciones: [
      "Controlar que la válvula del percolador no se bloquee con el empaque fino.",
      "Mantener el alcohol inflamable alejado de cualquier chispa electrónica cercana."
    ],
    precauciones_en: [
      "Verify the percolator bottom valve does not clog with fine debris.",
      "Keep volatile flammable alcohol solvents away from nearby computer terminals."
    ],
    biomasa: ["50 g de flores secas de Calendula", "Solución hidroalcohólica al 70%", "Algodón de laboratorio"],
    biomasa_en: ["50 g dry Calendula flower petals", "70% ethanol-water hydroalcoholic solvent", "Sterile cotton wool"],
    cristaleria: ["Percolador de vidrio cilíndrico", "Soporte universal con pinza", "Vaso recolector", "Probeta"],
    cristaleria_en: ["Glass cylinder percolator column", "Universal stand clamp holder", "Receiver beaker", "Graduated cylinder"],
    pasos: [
      { paso: 1, instruccion: "Humedecer la caléndula molida con solvente durante 4 horas en pre-maceración.", instruccion_en: "Pre-moisten ground Calendula with solvent for 4 hours in a small beaker.", es_critico: false },
      { paso: 2, instruccion: "Colocar un tapón fino de algodón y arena limpia en la base del percolador.", instruccion_en: "Assemble a fine cotton and clean sand plug at the bottom of the percolator.", es_critico: true },
      { paso: 3, instruccion: "Empacar la biomasa húmeda de manera uniforme sin dejar bolsas de aire.", instruccion_en: "Pack the moist biomass evenly inside the column avoiding air pockets.", es_critico: true },
      { paso: 4, instruccion: "Adicionar solvente cubriendo por completo la biomasa (dejar 3 cm arriba).", instruccion_en: "Pour more solvent to submerge the biomass beds (keeping a 3 cm layer on top).", es_critico: false },
      { paso: 5, instruccion: "Ajustar la válvula a una velocidad de 1 a 2 mL por minuto.", instruccion_en: "Calibrate output valve to maintain a steady flow of 1 to 2 mL per minute.", es_critico: true },
      { paso: 6, instruccion: "Recolectar el filtrado ámbar brillante profundo hasta agotar el solvente.", instruccion_en: "Collect the radiant deep amber percolation fluid until exhaust.", es_critico: false }
    ],
    formula: "(Sólidos_Secos_g / Biomasa_Inicial_g) * 100",
    formula_label: "Rendimiento Extracto (%)",
    formula_label_en: "Extract Yield Percent (%)",
    input_biomass_label: "Peso Calendula Inicial (g)",
    input_biomass_label_en: "Initial Dry Flower Weight (g)",
    input_yield_label: "Sólidos Totales Obtenidos (g)",
    input_yield_label_en: "Total Dry Recovered Solids (g)",
    default_biomass: 50,
    default_yield_val: 10.5,
    range_min: 15.0,
    range_max: 28.0,
    unidad: "%",
    residuos: [
      "Las flores secas comprimidas agotadas se tiran como basura orgánica.",
      "El alcohol remanente de desperdicio se vierte en residuos orgánicos libres de halógenos."
    ],
    residuos_en: [
      "Compressed flower cakes are discarded in normal organic bins.",
      "Unused ethanol waste goes into halogen-free organic solvent drums."
    ]
  },
  {
    id: "LAB-TLC-004",
    categoria: "Cromatografía",
    categoria_en: "Chromatography",
    titulo: "Fraccionamiento de Pigmentos por Capa Fina (TLC)",
    titulo_en: "Thin Layer Chromatography (TLC) of Leaf Pigments",
    especie: "Spinacia oleracea",
    tiempo: 60,
    dificultad: "Intermedia",
    dificultad_en: "Intermediate",
    autor: "Análisis Instrumental",
    sim_type: "chromatography",
    objetivos: [
      "Extraer los compuestos fotosintéticos (clorofilas, xantofilas y carotenos) mediante solvente polar.",
      "Realizar el sembrado microscópico capilar en placa de sílica gel.",
      "Utilizar fase móvil apolar para separar pigmentos y calcular el Rf de la Clorofila A."
    ],
    objetivos_en: [
      "Extract photosynthetic pigments (chlorophylls, xanthophylls, carotenes) using acetone.",
      "Perform capillary spot application on silica gel plate.",
      "Run the non-polar mobile phase to calculate the Retention Factor (Rf) of Chlorophyll A."
    ],
    fundamento: "La cromatografía de reparto aprovecha la afinidad de adsorción selectiva en fase estacionaria polar (placa sílica) versus fase móvil móvil hidrocarburo (hexano-acetona), separando moléculas por su polaridad intrínseca.",
    fundamento_en: "TLC exploits partitioning affinity for stationary phase adsorption (polar silica) versus mobile phase elution (hexane-acetone mix), separating molecules based on their polarity.",
    epp: [
      { id: "bata", es: "Bata de algodón", en: "Cotton lab coat" },
      { id: "gafas", es: "Gafas de seguridad", en: "Safety goggles" },
      { id: "guantes", es: "Guantes de nitrilo", en: "Nitrile gloves" }
    ],
    precauciones: [
      "No respirar los vapores de hexano ni acetona. Trabajar con extractor o en campana.",
      "Manipular con pinzas los bordes de la delicada placa de sílice para no alterar el adsorbente."
    ],
    precauciones_en: [
      "Do not breathe chemical fumes of hexane or acetone. Work in a well-ventilated chamber.",
      "Handle silica plate edges with tweezers to avoid transferring finger oils to the adsorbent."
    ],
    biomasa: ["15 g de hojas frescas de espinaca", "Acetona de grado reactivo", "Fase móvil: Mezcla Hexano/Acetona 7:3"],
    biomasa_en: ["15 g fresh spinach leaf tissue", "ACS grade Acetone", "Mobile phase: Hexane/Acetone 7:3 mix"],
    cristaleria: ["Mortero de porcelana con pistilo", "Cámara cromatográfica (frasco plano sellado)", "Tira capilar", "Placa de sílica TLC"],
    cristaleria_en: ["Porcelain mortar & pestle", "Development chamber (flat sealed jar)", "Glass microcapillary", "Silica gel TLC plate"],
    pasos: [
      { paso: 1, instruccion: "Moler la espinaca en el mortero agregando 10 mL de acetona pura.", instruccion_en: "Grind spinach in mortar adding 10 mL of pure acetone solvent.", es_critico: false },
      { paso: 2, instruccion: "Decantar el extracto verde oscuro filtrándolo en un vial ámbar seco.", instruccion_en: "Decant green liquid filtering with filter paper into dry amber vials.", es_critico: false },
      { paso: 3, instruccion: "Marcar la placa con lápiz a 1.5 cm del borde sin rayar la sílice.", instruccion_en: "Trace starting mark with pencil 1.5 cm from bottom edge carefully.", es_critico: true },
      { paso: 4, instruccion: "Sembrar un punto concentrado del extracto verde usando el capilar de vidrio.", instruccion_en: "Spot the green sample repeatedly using a glass capillary tube.", es_critico: true },
      { paso: 5, instruccion: "Verter fase móvil en la cámara (0.8 cm de altura) y saturar la atmósfera.", instruccion_en: "Add mobile phase to the chamber (up to 0.8 cm depth) and seal vapor.", es_critico: true },
      { paso: 6, instruccion: "Colocar la placa erguida y tapar. Dejar correr el solvente hasta alcanzar 1 cm del tope.", instruccion_en: "Introduce plate vertically and close lid. Run solvent up to 1 cm from the top.", es_critico: false },
      { paso: 7, instruccion: "Retirar la placa, marcar el frente de solvente y medir distancias de bandas de color.", instruccion_en: "Retract plate, seal solvent front line and compute distances of yellow/green bands.", es_critico: false }
    ],
    formula: "(Distancia_Banda_Chl_A_cm / Distancia_Frente_Solvente_cm) * 100",
    formula_label: "Frecuencia Rf Chlorophyll A (%)",
    formula_label_en: "Rf Chlorophyll A Percent (%)",
    input_biomass_label: "Frente Solvente - Largo Total (cm)",
    input_biomass_label_en: "Solvent Front Line Distance (cm)",
    input_yield_label: "Distancia de Banda Verde Chl-A (cm)",
    input_yield_label_en: "Chlorophyll A Spot Distance (cm)",
    default_biomass: 8,
    default_yield_val: 4,
    range_min: 45.0,
    range_max: 55.0,
    unidad: "%",
    residuos: [
      "El desecho de fase móvil corre en botellas de recuperado de solventes no halogenados.",
      "La placa inorgánica usada se acopia en basura de reactivos de laboratorios químicos."
    ],
    residuos_en: [
      "Waste mobile phase must travel into non-halogenated organic waste drums.",
      "Spent TLC plates must be thrown into specialized solid laboratory chemical bins."
    ]
  },
  {
    id: "LAB-EXT-005",
    categoria: "Métodos de Extracción",
    categoria_en: "Extraction Methods",
    titulo: "Decocción Controlada para Polifenoles Antioxidantes",
    titulo_en: "Controlled Decoction of Polyphenol Antioxidants",
    especie: "Camellia sinensis",
    tiempo: 75,
    dificultad: "Fácil",
    dificultad_en: "Easy",
    autor: "Bio-Academia AurorIA",
    sim_type: "extraction",
    objetivos: [
      "Estudiar el efecto de la temperatura y calor cinético sobre extracción de catequinas.",
      "Llevar un balance térmico seguro bajo presiones básicas.",
      "Obtener un extracto natural purificado rico en antioxidantes bioactivos."
    ],
    objetivos_en: [
      "Study thermal effects and kinetics on catechin yield extraction.",
      "Maintain a safe heat mass balance during standard decoction.",
      "Obtain a purified natural extract dense in bioactive antioxidants."
    ],
    fundamento: "Las moléculas antioxidantes del té verde, como la epigalocatequina, son termolábiles a altas temperaturas prolongadas. La decocción a 85°C optimiza el rendimiento sin desnaturalizar o hidrolizar el anillo polifenólico primario.",
    fundamento_en: "Green tea antioxidants, such as epigallocatechin gallate, decompose under high overboiling. Extraction at 85°C optimizes solubility while preserving polyphenol integrity.",
    epp: [
      { id: "bata", es: "Bata de algodón", en: "Cotton lab coat" },
      { id: "guantes", es: "Guantes térmicos", en: "Thermal safety gloves" }
    ],
    precauciones: [
      "No sobrecalentar por encima de los 90°C para no degradar las catequinas activas.",
      "Manipular con guantes térmicos los balones calientes para evitar quemaduras directas."
    ],
    precauciones_en: [
      "Do not boil over 90°C to prevent oxidative breakdown of catechins.",
      "Always handle superheated borosilicate glass wear using insulated safety gloves."
    ],
    biomasa: ["20 g de hojas finamente picadas de Té Verde", "Agua destilada deionizada", "Filtro de celulosa de poro medio"],
    biomasa_en: ["20 g tea leaves (Camellia sinensis)", "Deionized distilled water", "Medium porosity cellulose filters"],
    cristaleria: ["Matraz Erlenmeyer (250 mL)", "Parrilla con agitación magnética", "Termómetro digital", "Embudo Büchner"],
    cristaleria_en: ["Erlenmeyer flask (250 mL)", "Magnetic stirrer hotplate", "Digital thermocouple thermometer", "Büchner vacuum funnel"],
    pasos: [
      { paso: 1, instruccion: "Pesar exactamente 20 g de hojas desecadas de camelia.", instruccion_en: "Weigh exactly 20 g of dried green tea leaves.", es_critico: false },
      { paso: 2, instruccion: "Colocar la biomasa con 150 mL de agua deionizada en el Erlenmeyer.", instruccion_en: "Inoculate biomass and 150 mL of water inside the Erlenmeyer flask.", es_critico: false },
      { paso: 3, instruccion: "Encender la parrilla y calibrar la temperatura estrictamente a 85°C.", instruccion_en: "Turn on the heat plate and calibrate temperature strictly at 85°C.", es_critico: true },
      { paso: 4, instruccion: "Mantener agitación magnética constante durante 20 minutos de infusión.", instruccion_en: "Keep magnetic stirring active for 20 continuous infusion minutes.", es_critico: false },
      { paso: 5, instruccion: "Filtrar por gravedad usando filtro de celulosa pre-humedecido.", instruccion_en: "Filter by gravity using pre-moistened cellulose filter paper.", es_critico: true },
      { paso: 6, instruccion: "Determinar peso de polifenoles desecando el filtrado final.", instruccion_en: "Weigh the final dark brown dry extract solids after vacuum drying.", es_critico: false }
    ],
    formula: "(Peso_Antioxidantes_g / Peso_Té_Seco_g) * 100",
    formula_label: "Rendimiento Catequinas (%)",
    formula_label_en: "Catechins Yield (%)",
    input_biomass_label: "Peso Té Seco Usado (g)",
    input_biomass_label_en: "Dry Tea Biomass Weight (g)",
    input_yield_label: "Antioxidantes Libres (g)",
    input_yield_label_en: "Pure Gummy Extract Obtained (g)",
    default_biomass: 20,
    default_yield_val: 1.2,
    range_min: 4.5,
    range_max: 8.0,
    unidad: "%",
    residuos: [
      "La papilla orgánica húmeda se descarta en composta urbana.",
      "El agua hidrolizada de té restante puede desecharse en tarjas normales."
    ],
    residuos_en: [
      "Organic plant slush gets discarded directly into compost piles.",
      "The filtered residual tea fluid can safely be drained to the sink."
    ]
  },
  {
    id: "LAB-HYD-006",
    categoria: "Fitoquímica",
    categoria_en: "Phytochemistry",
    titulo: "Hidrólisis Ácida de Saponinas Esteroidales",
    titulo_en: "Acid Hydrolysis of Steroidal Saponins",
    especie: "Agave tequilana",
    tiempo: 150,
    dificultad: "Avanzada",
    dificultad_en: "Advanced",
    autor: "Genómica & Fitoquímica",
    sim_type: "distillation",
    objetivos: [
      "Hidrolizar los enlaces glicosídicos de las saponinas silvestres para separar sapogeninas.",
      "Manejar ácidos fuertes con estricto apego a guías de bioseguridad.",
      "Separar e identificar el rendimiento de sapogeninas apolares."
    ],
    objetivos_en: [
      "Hydrolyze glycosidic bonds from agave saponins to liberate free sapogenins.",
      "Handle strong corrosive mineral acids inside standard fume hoods.",
      "Separate and weigh non-polar sapogenin fractions."
    ],
    fundamento: "El agave almacena saponinas polares complejas con colas de azúcar. La ebullición ácida rompe los puentes éter del glicósido liberando agliconas insolubles de naturaleza esteroidal (como la heconina), que precipitan al enfriar.",
    fundamento_en: "Agave stores highly polar saponins complexed with sugar chains. Heating with mineral acids breaks ether glycoside bonds, launching insoluble steroidal aglycones which precipitate upon cooling.",
    epp: [
      { id: "bata", es: "Bata de algodón", en: "Cotton lab coat" },
      { id: "gafas", es: "Gafas de seguridad", en: "Safety goggles" },
      { id: "guantes", es: "Guantes de nitrilo", en: "Acid-rated Nitrile gloves" }
    ],
    precauciones: [
      "El ácido sulfúrico es altamente corrosivo. Usar obligatoriamente la campana de humos.",
      "Verter siempre el ácido sobre el agua en diluciones, nunca agua sobre el ácido directo."
    ],
    precauciones_en: [
      "Sulfuric acid is highly corrosive. Operate strictly inside active fume extraction hoods.",
      "Always add acid slowly to water when diluting, never pour water into concentrated acids directly."
    ],
    biomasa: ["30 g de bagazo seco de Agave", "Ácido Sulfúrico diluido al 10%", "Agua destilada neutra"],
    biomasa_en: ["30 g dry Agave ground bagasse", "10% Dilute Sulfuric Acid", "Neutral distilled water"],
    cristaleria: ["Matraz esmerilado balón (250 mL)", "Condensador de reflujo (dimroth / serpentín)", "Filtro Gooch", "Matraz Kitasato"],
    cristaleria_en: ["Round-bottom joint flask (250 mL)", "Reflux condenser (Dimroth or coil)", "Gooch crucible filtration kit", "Kitasato vacuum flask"],
    pasos: [
      { paso: 1, instruccion: "Pesar 30 g de bagazo deshidratado y pulverizado en el balón.", instruccion_en: "Weigh 30 g of desiccated ground agave powder into the flask.", es_critico: false },
      { paso: 2, instruccion: "Adicionar 120 mL del ácido diluido al 10% lentamente en campana.", instruccion_en: "Pour 120 mL of dilute 10% sulfuric acid slowly under a fume hood.", es_critico: true },
      { paso: 3, instruccion: "Acoplar el condensador de reflujo vertical asegurando flujo de agua.", instruccion_en: "Clamp vertical reflux condenser over joint, ensuring constant water flow.", es_critico: true },
      { paso: 4, instruccion: "Calentar a reflujo constante a 95°C durante 90 minutos para romper los enlaces.", instruccion_en: "Heat under steady reflux at 95°C for 90 minutes to hydrolyze glycoside links.", es_critico: false },
      { paso: 5, instruccion: "Dejar enfriar, filtrar por vacío y recuperar el precipitado insoluble lavado con agua.", instruccion_en: "Cool, filter under vacuum, and wash acid residues from insoluble precipitate.", es_critico: true },
      { paso: 6, instruccion: "Secar el residuo y pesarlo para cuantificar las sapogeninas formadas.", instruccion_en: "Dry residue completely under vacuum oven and weigh out active crystals.", es_critico: false }
    ],
    formula: "(Saponinas_Precipitadas_g / Biomasa_Bagazo_g) * 100",
    formula_label: "Rendimiento Sapogeninas (%)",
    formula_label_en: "Sapogenins Yield (%)",
    input_biomass_label: "Peso Bagazo Seco (g)",
    input_biomass_label_en: "Dry Agave Weight (g)",
    input_yield_label: "Sapogeninas Precipitado (g)",
    input_yield_label_en: "Dried Recovered Sapogenins (g)",
    default_biomass: 30,
    default_yield_val: 0.36,
    range_min: 0.8,
    range_max: 1.5,
    unidad: "%",
    residuos: [
      "El desecho ácido sulfúrico se neutraliza químicamente con bicarbonato de sodio antes de desechar.",
      "El bagazo lavado inorgánico se tira en recipientes neutros."
    ],
    residuos_en: [
      "Sulfuric acid filtrate must be carefully neutralized with sodium bicarbonate before sink disposal.",
      "Neutralized spent organic sludge is placed in general lab waste bins."
    ]
  },
  {
    id: "LAB-UAE-007",
    categoria: "Métodos de Extracción",
    categoria_en: "Extraction Methods",
    titulo: "Extracción Asistida por Ultrasonido (UAE) de Antocianinas",
    titulo_en: "Ultrasound-Assisted Extraction (UAE) of Anthocyanins",
    especie: "Zea mays L. (Maíz Morado)",
    tiempo: 45,
    dificultad: "Intermedia",
    dificultad_en: "Intermediate",
    autor: "Bioingeniería Alimentaria",
    sim_type: "ultrasound",
    objetivos: [
      "Operar un baño de ondas de ultrasonido para acelerar lisis celular fitoquímica.",
      "Evitar la degradación térmica de los pigmentos rojos de antociana.",
      "Calcular la eficiencia del método UAE frente a agitación mecánica ordinaria."
    ],
    objetivos_en: [
      "Operate ultrasound wave cavitation to accelerate phytochemical cell wall lysis.",
      "Prevent thermal degradation of sensitive red cyanidin dyes.",
      "Calculate UAE efficiency compared to standard static macerations."
    ],
    fundamento: "Las ondas ultrasónicas producen microburbujas de cavitación localizadas. La violenta implosión rompe membranas vegetales facilitando la penetración instantánea de agua acidulada, logrando altos rendimientos en menos de 30 minutos sin calor dañino.",
    fundamento_en: "High-frequency ultrasound creates acoustic cavitation microbubbles. Implosion forces rupture target cell walls, allowing instant acid solvent flow without degrading thermolabile pigments.",
    epp: [
      { id: "bata", es: "Bata de algodón", en: "Cotton lab coat" },
      { id: "guantes", es: "Guantes de nitrilo", en: "Protective Nitrile gloves" }
    ],
    precauciones: [
      "Utilizar protectores auditivos si el reactor trabaja a alta potencia ruidosa.",
      "Cerrar bien el vial para evitar escapes de solvente por calentamiento sónico."
    ],
    precauciones_en: [
      "Wear ear protectors if the sonication bath emits heavy acoustic resonance.",
      "Tighten vial cap to avoid volatile vapor leaks under sonic pressure."
    ],
    biomasa: ["10 g de granos pulverizados de Maíz Morado", "Solvente de extracción: Agua-Etanol con 1% Ácido Cítrico"],
    biomasa_en: ["10 g premium dried purple corn powder", "Extractor mix: Water-Ethanol with 1% Citric Acid"],
    cristaleria: ["Vaso de precipitados (100 mL)", "Baño de Ultrasonido Digital (UAE)", "Termómetro digital de sonda"],
    cristaleria_en: ["Glass beaker (100 mL)", "Sonication Ultrasonic bath container", "Probe digital thermometer"],
    pasos: [
      { paso: 1, instruccion: "Pesar 10 g de polvo de maíz morado con colorantes morados intensos.", instruccion_en: "Weigh exactly 10 g of intense violet corn flour powder into a glass flask.", es_critico: false },
      { paso: 2, instruccion: "Mezclar con 80 mL del solvente de agua-etanol acidulado con ácido cítrico.", instruccion_en: "Mix with 80 mL of water-ethanol solvent slightly acidified with citric acid.", es_critico: false },
      { paso: 3, instruccion: "Colocar el Erlenmeyer flotando en baño ultrasónico acoplado.", instruccion_en: "Submerge beaker base into ultrasonic water chamber with clamp setup.", es_critico: true },
      { paso: 4, instruccion: "Calibrar el baño sónico a 40 kHz de frecuencia por 20 minutos completos.", instruccion_en: "Configure acoustic frequency to 40 kHz for exactly 20 continuous minutes.", es_critico: true },
      { paso: 5, instruccion: "Asegurar que la temperatura sónica no supere los 45°C vigilando la sonda.", instruccion_en: "Ensure thermal sonic buildup doesn't rise past 45°C to preserve color.", es_critico: true },
      { paso: 6, instruccion: "Filtrar por papel la suspensión color púrpura oscuro brillante.", instruccion_en: "Vacuum filter the deep royal purple fluid using general paper disks.", es_critico: false },
      { paso: 7, instruccion: "Medir espectro y registrar rendimiento de antocianinas líquidas.", instruccion_en: "Determine yields and measure final pigment concentration color.", es_critico: false }
    ],
    formula: "(Antocianinas_Obtenidas_mg / Peso_Harina_g) * 0.1",
    formula_label: "Rendimiento Antocianinas (%)",
    formula_label_en: "Anthocyanins Yield (%)",
    input_biomass_label: "Harina Maíz Seco (g)",
    input_biomass_label_en: "Dry Corn Flour Weight (g)",
    input_yield_label: "Antocianinas extraídas (mg)",
    input_yield_label_en: "Extracted Anthocyanins Mass (mg)",
    default_biomass: 10,
    default_yield_val: 280,
    range_min: 2.0,
    range_max: 5.0,
    unidad: "%",
    residuos: [
      "El lodo de residuo orgánico de maíz va a depósito orgánico común.",
      "El líquido sobrante que lleva alcohol se dispone en contenedores inorgánicos."
    ],
    residuos_en: [
      "Purple corn cake remnants go safely to the organic recycling plant.",
      "The filtered hydroalcoholic residues are set in specialized storage jars."
    ]
  },
  {
    id: "LAB-PHN-008",
    categoria: "Análisis Cuantitativo",
    categoria_en: "Quantitative Analysis",
    titulo: "Cuantificación de Fenoles Totales (Folin-Ciocalteu)",
    titulo_en: "Spectrophotometric Analysis of Phenols",
    especie: "Rosmarinus officinalis L. (Romero)",
    tiempo: 100,
    dificultad: "Avanzada",
    dificultad_en: "Advanced",
    autor: "Instrumentación AurorIA",
    sim_type: "colorimetry",
    objetivos: [
      "Desarrollar una curva coloreada colorimétrica usando complejos de tungsteno-molibdeno.",
      "Calcular los miligramos de equivalentes de Ácido Gálico (GAE) por gramo crudo.",
      "Operar un espectrofotómetro a 765nm para lecturas espectrales."
    ],
    objetivos_en: [
      "Develop a stable colorimetric reaction using tungsten-molybdenum compounds.",
      "Determine milligram equivalents of Gallic Acid (GAE) per dry sample gram.",
      "Operate a digital spectrophotometer calibrated strictly at 765nm wavelength."
    ],
    fundamento: "El reactivo de Folin-Ciocalteu se reduce al oxidar los fenolatos nucleófilos del romero en condiciones alcalinas de carbonato, generando un pigmento azul de wolframio que absorbe linealmente la luz a 765 nm.",
    fundamento_en: "Folin-Ciocalteu salts reduce upon oxidizing phenolate anions from rosemary in alkaline environments, forming blue tungsten complexes with linear spectrophotometric absorption at 765 nm.",
    epp: [
      { id: "bata", es: "Bata de algodón", en: "Cotton lab coat" },
      { id: "gafas", es: "Gafas de seguridad", en: "Safety goggles" },
      { id: "guantes", es: "Guantes de nitrilo", en: "Chemical Nitrile gloves" }
    ],
    precauciones: [
      "El reactivo de Folin es tóxico por inhalación y contacto cutáneo, actuar en extractor.",
      "No contaminar las micropipetas utilizando puntas estériles para no alterar las lecturas."
    ],
    precauciones_en: [
      "Folin reagent is cytotoxic; handle exclusively with appropriate safety gloves.",
      "Do not cross-contaminate microcuvettes; always change sterile pipette tips."
    ],
    biomasa: ["5 g de polvo de hojas secas de Romero", "Reactivo Folin-Ciocalteu (dilución 1:10)", "Carbonato de sodio anhidro al 7.5% de saturación"],
    biomasa_en: ["5 g dry rosemary leaf powder", "Folin-Ciocalteu analytical reagent 1:10", "7.5% saturated Sodium Carbonate solution"],
    cristaleria: ["Espectrofotómetro V-VIS ajustable", "Celdas de cuarzo/plástico de 1 mL", "Tubos Falcon esterilizados", "Micropipetas"],
    cristaleria_en: ["UV-VIS Spectrophotometer", "1 mL plastic optical cuvettes", "Falcon centrifuge test tubes", "Digital micropipettes"],
    pasos: [
      { paso: 1, instruccion: "Preparar extracto crudo diluyendo 1g de romero molido en metanol al 80%.", instruccion_en: "Prepare herbal extract by mixing 1g crushed rosemary in 80% methanol.", es_critico: false },
      { paso: 2, instruccion: "Pipetear 100 microlitros de extracto aclarado en tubo Falcon de calibración.", instruccion_en: "Pipette 100 microliters of clear extract into target Falcon tube.", es_critico: false },
      { paso: 3, instruccion: "Adicionar 750 microlitros del sensible reactivo reactive Folin-Ciocalteu.", instruccion_en: "Carefully dispense 750 microliters of Folin-Ciocalteu complex agent.", es_critico: true },
      { paso: 4, instruccion: "Reposar la muestra durante 5 minutos en total oscuridad.", instruccion_en: "Incubate sample tube in complete darkness for exactly 5 minutes.", es_critico: false },
      { paso: 5, instruccion: "Verter 750 microlitros de carbonato de sodio alcalinizante e incubar 90 minutos.", instruccion_en: "Add 750 microliters of sodium carbonate to alcalinize, incubating 90 min.", es_critico: true },
      { paso: 6, instruccion: "Observar cambio cromático del verde oliva al azul noche profundo y denso.", instruccion_en: "Observe color transition from olive green to rich deep midnight blue.", es_critico: false },
      { paso: 7, instruccion: "Transferir muestra a celda y medir absorbancia a 765nm para interpolar curva.", instruccion_en: "Transfer product to cuvette and measure absorbance at 765nm on the sensor.", es_critico: true }
    ],
    formula: "Absorbancia_Leída * 18.5",
    formula_label: "Contenido GAE Fitoquímico (mg GAE/g)",
    formula_label_en: "GAE Phenols Content (mg/g)",
    input_biomass_label: "Factor Inclinación Curva (mg/L GAE)",
    input_biomass_label_en: "Calibration Standard Value (mg/L GAE)",
    input_yield_label: "Absorbancia Espectral Registrada (u.A)",
    input_yield_label_en: "Spectral Absorbance Registered (Au)",
    default_biomass: 1,
    default_yield_val: 0.85,
    range_min: 10.0,
    range_max: 22.0,
    unidad: " mg/g",
    residuos: [
      "El cóctel reactivo de Folin azul con metales pesados va a bidón inorgánico ácido.",
      "El romero agotado sin metanol se descarta en común sólido orgánico."
    ],
    residuos_en: [
      "Heavy chemical wastes are securely disposed of in heavy metal acidic drums.",
      "Exhausted non-hazardous biomass is filtered and put into community trash."
    ]
  },
  {
    id: "LAB-EXT-009",
    categoria: "Métodos de Extracción",
    categoria_en: "Extraction Methods",
    titulo: "Hidrodestilación de Hidrolato de Lavanda",
    titulo_en: "Lavender Hydrosol Direct Hydrodistillation",
    especie: "Lavandula angustifolia",
    tiempo: 90,
    dificultad: "Fácil",
    dificultad_en: "Easy",
    autor: "Destiladora AurorIA",
    sim_type: "distillation",
    objetivos: [
      "Utilizar un equipo de hidrodestilación directa (tipo Clevenger).",
      "Producir agua floral (hidrolato activo) purificada de Lavanda.",
      "Evaluar la turbidez natural de la emulsión por microgotas."
    ],
    objetivos_en: [
      "Operate direct Clevenger-type hydrodistillation setups.",
      "Produce lavender hydrosol (active aromatic herbal waters).",
      "Evaluate visual turbidity and microemulsion density of droplets."
    ],
    fundamento: "En la hidrodestilación directa, la lavanda se sumerge en agua hirviendo. Las células de glándulas tricomatosas se rompen térmicamente liberando Linalol orgánico emulsionado.",
    fundamento_en: "In direct hydrodistillation, plant tissue sits directly inside boiling water. Delicate trichome glands boil and burst to discharge natural linalool emulsified droplets.",
    epp: [
      { id: "bata", es: "Bata de algodón", en: "Cotton lab coat" },
      { id: "gafas", es: "Gafas de seguridad", en: "Safety goggles" }
    ],
    precauciones: [
      "No rellenar agua por encima de la capacidad de seguridad del balón.",
      "No tocar juntas calientes mientras haya fuego o vapor fluyendo."
    ],
    precauciones_en: [
      "Never overfill water past safety lines inside the lower glass chamber.",
      "Do not touch joints or handle hot glass while steam is pressurizing."
    ],
    biomasa: ["80 g de flores secas de Lavanda", "Agua destilada desmineralizada", "Frasco de vidrio ámbar"],
    biomasa_en: ["80 g dried active Lavender flowers", "Demineralized distilled water", "Amber storage bottle"],
    cristaleria: ["Balón esmerilado de fondo redondo", "Calentador de manta circular", "Clevenger o cabezal", "Termómetro 110°C"],
    cristaleria_en: ["Round-bottom joint flask", "Mantle circular heater basket", "Clevenger-style neck adapter", "Liquid thermometer up to 110°C"],
    pasos: [
      { paso: 1, instruccion: "Pesar 80 g de aromáticos botones florales de lavanda.", instruccion_en: "Weigh exactly 80 g of fragrant lavender flower buds.", es_critico: false },
      { paso: 2, instruccion: "Introducir botones con 250 mL de agua destilada en el matraz de fondo redondo.", instruccion_en: "Submerge buds with 250 mL of water inside the round-bottom flask.", es_critico: false },
      { paso: 3, instruccion: "Montar cabezal extractor Clevenger con su respectivo condensador acoplado.", instruccion_en: "Mount Clevenger extractor head and connect cool water jacket hoses.", es_critico: true },
      { paso: 4, instruccion: "Activar el flujo continuo de agua fría de enfriamiento del sistema.", instruccion_en: "Turn on cold water flow to begin condensing volatile fractions.", es_critico: true },
      { paso: 5, instruccion: "Encender manta de calor hasta forzar ebullición del caldo vegetal.", instruccion_en: "Turn on the heating mantle to activate deep boiling of the mixture.", es_critico: false },
      { paso: 6, instruccion: "Recolectar hidrolato aromático opalescente con olor a lavanda fresca.", instruccion_en: "Collect opalescent aromatic hydrosol showing refreshing lavender scents.", es_critico: false }
    ],
    formula: "(Peso_Esencia_ml / Peso_Biomasa_Inicial) * 100",
    formula_label: "Rendimiento Hidrolato (%)",
    formula_label_en: "Hydrosol Yield (%)",
    input_biomass_label: "Flores de Lavanda (g)",
    input_biomass_label_en: "Total Dry Lavender Weight (g)",
    input_yield_label: "Esencia Líquida Purificada (mL)",
    input_yield_label_en: "Liquid Active Hydrosol (mL)",
    default_biomass: 80,
    default_yield_val: 1.1,
    range_min: 0.5,
    range_max: 1.8,
    unidad: "%",
    residuos: [
      "Las flores hervidas van a composta común de laboratorio.",
      "El hidrolato sobrante es inocuo y puede verterse al desagüe."
    ],
    residuos_en: [
      "Boiled flower remnants are separated and put in compost bins.",
      "Excess water hydrosol has zero toxicity; can be drained to the sewer."
    ]
  },
  {
    id: "LAB-ALC-010",
    categoria: "Fitoquímica",
    categoria_en: "Phytochemistry",
    titulo: "Precipitación e Identificación de Alcaloides",
    titulo_en: "Precipitation and ID of Toxic Alkaloids",
    especie: "Nicotiana tabacum L.",
    tiempo: 110,
    dificultad: "Avanzada",
    dificultad_en: "Advanced",
    autor: "Seguridad Química",
    sim_type: "precipitation",
    objetivos: [
      "Aislar alcaloides nitrogenados insolubles por basificación y reflujo ácido.",
      "Precipitar sales del alcaloide usando el reactivo yodado de Dragendorff.",
      "Examinar los riesgos biosanitarios de las toxinas de Nicotiana."
    ],
    objetivos_en: [
      "Isolate nitrogenous alkaloids using acidic digestion and alkaline shifts.",
      "Precipitate alkaloid crystals using iodine-based Dragendorff salts.",
      "Analyze safety risks of neurotoxic Nicotiana metabolite residues."
    ],
    fundamento: "Los alcaloides se protonan en un caldo ácido solubilizándose en agua. Al verter bismuto y potasio (Dragendorff), el nitrógeno del alcaloide forma un complejo iónico con yodo, precipitando cristales de color naranja brillante.",
    fundamento_en: "Alkaloid bases protonate in warm acid yielding water-soluble ions. Adding bismuth and potassium salts (Dragendorff) forms coordinating coordinate complexes that instantly drop as orange solids.",
    epp: [
      { id: "bata", es: "Bata de algodón", en: "Cotton lab coat" },
      { id: "gafas", es: "Gafas de seguridad", en: "Safety goggles" },
      { id: "guantes", es: "Guantes de nitrilo", en: "Nitrile safety gloves" }
    ],
    precauciones: [
      "La nicotina aislada es un potente neurotóxico por contacto dérmico instantáneo.",
      "Usar obligatoriamente la campana de extracción de vapores y guantes dobles."
    ],
    precauciones_en: [
      "Pure nicotine and alkaloids are highly toxic contact neurotoxins.",
      "Always work inside glass hoods and double-glove to bypass dermal exposure."
    ],
    biomasa: ["12 g de hojas deshidratadas de Tabaco", "Solución Ácida Clorhídrica al 5%", "Reactivo de Dragendorff (Yodo-Bismuto)"],
    biomasa_en: ["12 g of premium dry tobacco leaf flakes", "5% Hydrochloric Acid solution", "Analytic Dragendorff reagent (Yodo-Bismuth)"],
    cristaleria: ["Tubo de ensayo con tapón", "Pipeta volumétrica de vidrio", "Filtro de fibra de vidrio ultra-fino", "Vidrio de reloj"],
    cristaleria_en: ["Glass test tube with stopper cap", "Volumetric glass capillary pipettes", "Ultra-fine fiberglass disc filters", "Watch glass plate"],
    pasos: [
      { paso: 1, instruccion: "Moler el tabaco y digerir a 60°C con ácido clorhídrico por 30 minutos.", instruccion_en: "Grind leaves and digest at 60°C with hydrochloric acid for 30 minutes.", es_critico: false },
      { paso: 2, instruccion: "Filtrar por embudo y separar el líquido ácido clarificado.", instruccion_en: "Filter acid liquid to separate solid leaf tissue fibers.", es_critico: false },
      { paso: 3, instruccion: "Verter 3 gotas del reactivo de Dragendorff directamente al tubo receptor de la muestra.", instruccion_en: "Add 3 drops of active Dragendorff complex reagent into sample tube.", es_critico: true },
      { paso: 4, instruccion: "Agitar levemente y observar la aparición de sólido precipitado naranja profundo.", instruccion_en: "Stir gently and observe the formation of deep orange flocculated solids.", es_critico: true },
      { paso: 5, instruccion: "Filtrar el sólido de cobre-naranja sobre el vidrio de reloj deshidratador.", instruccion_en: "Collect orange solid complex onto watch glass for final thermal drying.", es_critico: false },
      { paso: 6, instruccion: "Pesar los complejos cristalizados secos obtenidos.", instruccion_en: "Weigh dried orange-red powder structures on the analytics balance.", es_critico: false }
    ],
    formula: "(Peso_Cristal_Naranja_g / Peso_Muestra_Tabaco) * 100",
    formula_label: "Rendimiento Alcaloides (%)",
    formula_label_en: "Alkaloids Yield Percent (%)",
    input_biomass_label: "Peso Hoja Tabaco (g)",
    input_biomass_label_en: "Intake Dry Tobacco Leaf (g)",
    input_yield_label: "Precipitado Cristalizado (g)",
    input_yield_label_en: "Dry Precipitated Complex (g)",
    default_biomass: 12,
    default_yield_val: 0.36,
    range_min: 1.5,
    range_max: 4.0,
    unidad: "%",
    residuos: [
      "El precipitado con sales tóxicas de bismuto va como residuo químico pesado especial.",
      "El ácido restante de reacción se verterá en bidón exclusivo de inorgánicos en campana."
    ],
    residuos_en: [
      "Bismuth-laden toxics must accumulate in chemical heavy metal drums.",
      "Remaining hydrochloric extracts must pass inside acidic discard jars under hoods."
    ]
  }
];

export function ExperimentsWorkspace({ lang = "es" }: { lang?: "es" | "en" }) {
  const currentLang = lang === "es" ? "es" : "en";

  // Navigation states
  const [selectedExpId, setSelectedExpId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  // Load selected experiment data
  const activeExp = experimentsList.find(e => e.id === selectedExpId);

  // States for ACTIVE experiment
  const [ppeGear, setPpeGear] = useState<Record<string, boolean>>({});
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});
  const [biomassWeight, setBiomassWeight] = useState<number | "">("");
  const [yieldWeight, setYieldWeight] = useState<number | "">("");
  const [yieldResult, setYieldResult] = useState<number | null>(null);

  // Simulation parameters
  const [isSimulating, setIsSimulating] = useState(false);
  const [temp, setTemp] = useState(24);
  const [simValue, setSimValue] = useState(0); // general progress/evaporation value
  const [recoveredValue, setRecoveredValue] = useState(0); // accumulated yield simulation value
  const [ppeError, setPpeError] = useState(false);
  const [activeInstructionNum, setActiveInstructionNum] = useState(1);

  // Reset core status when entering an experiment
  const handleSelectExperiment = (id: string) => {
    setSelectedExpId(id);
    const exp = experimentsList.find(e => e.id === id);
    if (exp) {
      // Clear safety EPP
      const ppeSet: Record<string, boolean> = {};
      exp.epp.forEach(item => {
        ppeSet[item.id] = false;
      });
      setPpeGear(ppeSet);

      // Default variables
      setBiomassWeight(exp.default_biomass);
      setYieldWeight(exp.default_yield_val);
      setCheckedSteps({});
      setTemp(24);
      setSimValue(0);
      setRecoveredValue(0);
      setIsSimulating(false);
      setPpeError(false);
      setActiveInstructionNum(1);
    }
  };

  const handleBackToCatalog = () => {
    setIsSimulating(false);
    setSelectedExpId(null);
  };

  // Toggle single EPP
  const togglePpe = (id: string) => {
    setPpeGear(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const allPpeEquipped = activeExp ? activeExp.epp.every(item => ppeGear[item.id] === true) : false;

  // Compute calculated yield
  const handleCalculateCalculadora = () => {
    if (!activeExp || biomassWeight === "" || yieldWeight === "") {
      setYieldResult(null);
      return;
    }
    let res = 0;
    if (activeExp.id === "LAB-PHN-008") {
      res = Number(yieldWeight) * 18.5;
    } else if (activeExp.id === "LAB-UAE-007") {
      res = (Number(yieldWeight) / Number(biomassWeight)) * 0.1;
    } else {
      res = (Number(yieldWeight) / Number(biomassWeight)) * 100;
    }
    setYieldResult(parseFloat(res.toFixed(3)));
  };

  useEffect(() => {
    handleCalculateCalculadora();
  }, [biomassWeight, yieldWeight, selectedExpId]);

  // Stepping task validator
  const handleStepCheck = (paso: number) => {
    setCheckedSteps(prev => {
      const updated = { ...prev, [paso]: !prev[paso] };
      if (updated[paso] && paso === activeInstructionNum && activeExp && paso < activeExp.pasos.length) {
        setActiveInstructionNum(paso + 1);
      }
      return updated;
    });
  };

  // Clock dynamic simulator based on simulation types
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSimulating && activeExp) {
      if (!allPpeEquipped) {
        setPpeError(true);
        setIsSimulating(false);
        return;
      }
      setPpeError(false);

      interval = setInterval(() => {
        // Temperature limits and rise speeds depend on simulation types
        let targetTemp = 24;
        if (activeExp.sim_type === "distillation") targetTemp = 98.6;
        else if (activeExp.sim_type === "extraction") targetTemp = 65.0;
        else if (activeExp.sim_type === "ultrasound") targetTemp = 42.0;
        else if (activeExp.sim_type === "colorimetry") targetTemp = 25.0;
        else if (activeExp.sim_type === "chromatography") targetTemp = 24.5;
        else if (activeExp.sim_type === "precipitation") targetTemp = 35.0;

        setTemp(prev => {
          if (prev < targetTemp) {
            const added = parseFloat((12 + Math.random() * 15).toFixed(1));
            return parseFloat(Math.min(targetTemp, prev + added).toFixed(1));
          } else {
            return parseFloat((targetTemp + (Math.random() * 0.6 - 0.3)).toFixed(1));
          }
        });

        // Sim value represents flow rates, raising solvents, or coloration absorption %
        setSimValue(prev => {
          if (activeExp.sim_type === "chromatography") {
            // Eluent front moving up to 100%
            return Math.min(100, prev + 15);
          } else if (temp > targetTemp * 0.7) {
            return Math.min(100, Math.floor(75 + Math.random() * 25));
          }
          return Math.min(100, prev + 25);
        });

        // Recovered simulated substance
        setRecoveredValue(prev => {
          if (temp > targetTemp * 0.8) {
            const rate = activeExp.range_max / 3.0;
            return parseFloat(Math.min(activeExp.default_yield_val * 1.1, prev + rate).toFixed(2));
          }
          return prev;
        });

      }, 200);
    } else {
      // Cooling down routine
      interval = setInterval(() => {
        setTemp(prev => (prev > 24 ? parseFloat((prev - 15).toFixed(1)) : 24));
        setSimValue(0);
      }, 200);
    }

    return () => clearInterval(interval);
  }, [isSimulating, temp, allPpeEquipped, activeExp]);

  // Handle auto simulation boot when heating steps are ticked
  useEffect(() => {
    if (activeExp && allPpeEquipped) {
      if ((activeExp.id === "LAB-EXT-001" && checkedSteps[4]) || 
          (activeExp.id === "LAB-EXT-005" && checkedSteps[3]) ||
          (activeExp.id === "LAB-HYD-006" && checkedSteps[4]) ||
          (activeExp.id === "LAB-UAE-007" && checkedSteps[4])) {
        setIsSimulating(true);
      }
    }
  }, [checkedSteps]);

  // Clean filters and queries
  const categoriesList = [
    { es: "Todos", en: "All", key: "All" },
    { es: "Extracciones", en: "Extractions", key: "Métodos de Extracción" },
    { es: "Fitoquímica", en: "Phytochemistry", key: "Fitoquímica" },
    { es: "Cromatografía & Análisis", en: "Chromatographic & Analysis", key: "Cromatografía" }
  ];

  const filteredExperiments = experimentsList.filter(exp => {
    const titleVal = (lang === "es" ? exp.titulo : exp.titulo_en).toLowerCase();
    const speciesVal = exp.especie.toLowerCase();
    const query = searchTerm.toLowerCase();
    const matchesSearch = titleVal.includes(query) || speciesVal.includes(query) || exp.id.toLowerCase().includes(query);
    
    if (activeCategory === "All") return matchesSearch;
    return matchesSearch && (exp.categoria === activeCategory || exp.categoria_en === activeCategory || (activeCategory === "Cromatografía" && exp.categoria === "Análisis Cuantitativo"));
  });

  return (
    <div className="space-y-12">
      {/* CATALOG / SELECTION SCREEN */}
      {!selectedExpId ? (
        <div className="space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <Badge className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border-emerald-500/20 rounded-full px-4 py-1 text-xs font-mono uppercase tracking-widest leading-none select-none">
              {lang === "es" ? "Laboratorio de Docencia AurorIA v1.0" : "AurorIA Teaching Laboratory Room v1.0"}
            </Badge>
            <h2 className="text-4xl md:text-6xl font-serif font-black tracking-tighter text-white">
              {lang === "es" ? "Experimentos Básicos Fitoquímicos" : "Basic Phytochemical Experiments"}
            </h2>
            <p className="text-lg text-muted-foreground/90 leading-relaxed font-sans">
              {lang === "es" 
                ? "Elige uno de los 10 experimentos guiados de nuestra colección académica para simular, operar y calcular magnitudes críticas." 
                : "Select one of the 10 step-by-step guided experiments from our academic suite to run, simulate, and calculate performance metrics."}
            </p>
          </div>

          {/* Filters and search blocks */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-slate-900/30 backdrop-blur-md rounded-3xl border border-white/5 max-w-5xl mx-auto">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={lang === "es" ? "Buscar por especie, método, clave..." : "Search by species, method, code..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 bg-slate-950/50 border-white/5 rounded-2xl text-xs font-mono"
              />
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {categoriesList.map(cat => (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                    activeCategory === cat.key
                      ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                      : "bg-slate-950/40 text-muted-foreground hover:bg-slate-950 hover:text-white"
                  }`}
                >
                  {lang === "es" ? cat.es : cat.en}
                </button>
              ))}
            </div>
          </div>

          {/* Grid dynamic rendering of experimental catalog cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            <AnimatePresence mode="popLayout">
              {filteredExperiments.map((exp, index) => {
                const diffLabel = lang === "es" ? exp.dificultad : exp.dificultad_en;
                const catLabel = lang === "es" ? exp.categoria : exp.categoria_en;
                const titleLabel = lang === "es" ? exp.titulo : exp.titulo_en;
                
                return (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3, delay: index * 0.04 }}
                    className="group"
                  >
                    <Card className="rounded-[2rem] border border-white/5 bg-slate-900/10 backdrop-blur-sm hover:border-emerald-500/20 hover:bg-slate-900/30 transition-all duration-300 h-full flex flex-col justify-between overflow-hidden shadow-xl hover:shadow-2xl">
                      <div className="p-6 pb-2 space-y-4">
                        <div className="flex justify-between items-start gap-2">
                          <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full select-none">
                            {exp.id}
                          </span>
                          <Badge variant="outline" className={`text-[9px] font-mono uppercase bg-slate-950/20 ${
                            exp.dificultad === "Avanzada" ? "text-rose-400 border-rose-500/20" :
                            exp.dificultad === "Intermedia" ? "text-amber-400 border-amber-500/20" :
                            "text-green-400 border-green-500/20"
                          }`}>
                            {diffLabel}
                          </Badge>
                        </div>

                        <div className="text-left space-y-1">
                          <span className="text-[10px] font-mono font-bold tracking-wider text-muted-foreground block select-none uppercase">
                            {catLabel}
                          </span>
                          <h3 className="text-lg font-serif font-black text-white leading-snug group-hover:text-emerald-400 transition-colors">
                            {titleLabel}
                          </h3>
                          <p className="text-xs font-serif font-medium italic text-zinc-400">
                            {exp.especie}
                          </p>
                        </div>
                      </div>

                      <div className="p-6 pt-0 space-y-4 border-t border-white/5 mt-4">
                        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 select-none">
                          <span className="flex items-center gap-1.5 font-bold">
                            <Clock className="w-3.5 h-3.5 text-zinc-400" />
                            {exp.tiempo} min
                          </span>
                          <span>
                            {lang === "es" ? "Por" : "By"}: {exp.autor}
                          </span>
                        </div>

                        <Button
                          onClick={() => handleSelectExperiment(exp.id)}
                          className="w-full text-xs font-mono font-extrabold h-10 rounded-xl bg-white/5 text-white hover:bg-emerald-500 hover:text-slate-950 transition-all border border-white/5 cursor-pointer flex items-center justify-center gap-2"
                        >
                          {lang === "es" ? "Ingresar al Protocolo" : "Enter Protocol"}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {filteredExperiments.length === 0 && (
            <div className="p-12 text-center text-muted-foreground font-mono text-sm max-w-sm mx-auto bg-slate-950/20 rounded-3xl border border-white/5">
              ⚠️ {lang === "es" ? "No se encontraron experimentos con esos filtros." : "No experiments matched the selected filter query."}
            </div>
          )}
        </div>
      ) : (
        /* ACTIVE EXPERIMENT PROTOCOL SUITE WORKSPACE */
        <div className="space-y-12">
          {/* Top header navigation row */}
          <div className="flex items-center justify-between gap-4 flex-wrap max-w-7xl mx-auto border-b border-white/5 pb-4">
            <Button
              variant="ghost"
              onClick={handleBackToCatalog}
              className="text-xs font-mono font-bold text-muted-foreground hover:text-white flex items-center gap-2 cursor-pointer bg-slate-950/20 rounded-xl px-4"
            >
              ← {lang === "es" ? '"Experimentos Básicos" (Catálogo)' : '"Basic Experiments" (Catalog)'}
            </Button>
            <span className="text-xs font-mono font-black text-emerald-400 uppercase select-none">
              🔬 {lang === "es" ? "FÓRMULA ACADÉMICA ACTIVA" : "ACADEMIC EXPERIMENTAL SIMULATOR ACTIVE"}
            </span>
          </div>

          {/* Current experiment introductory title */}
          <div className="text-center max-w-4xl mx-auto space-y-4">
            <Badge className="bg-primary/20 hover:bg-primary/30 text-primary border-primary/20 rounded-full px-4 py-1 text-xs font-mono uppercase tracking-widest leading-none select-none">
              {activeExp.id} • {lang === "es" ? "Paso a Paso" : "Step-by-Step"}
            </Badge>
            <h2 className="text-3xl md:text-5xl font-serif font-black tracking-tight leading-tight text-white">
              {lang === "es" ? activeExp.titulo : activeExp.titulo_en}
            </h2>
            <p className="text-sm font-serif font-bold text-emerald-400 text-lg leading-relaxed italic">
              {activeExp.especie}
            </p>
          </div>

          {/* Main Grid: split 7 / 5 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-7xl mx-auto">
            
            {/* LEFT COLUMN: Objectives, Theorics, Materials, Waste */}
            <div className="lg:col-span-7 space-y-8">
              {/* Core Information Header Card */}
              <Card className="rounded-[2rem] border-white/10 bg-slate-900/40 backdrop-blur-md shadow-2xl overflow-hidden text-left">
                <div className="p-8 space-y-6">
                  {/* Metadata line */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-6 text-xs font-mono">
                    <div>
                      <span className="text-[10px] tracking-widest text-zinc-500 uppercase block select-none">
                        {lang === "es" ? "AUTOR DE PRÁCTICA" : "ACADEMIC AUTHOR"}
                      </span>
                      <span className="font-bold text-white block mt-0.5">{activeExp.autor}</span>
                    </div>
                    <div>
                      <span className="text-[10px] tracking-widest text-zinc-500 uppercase block select-none">
                        {lang === "es" ? "TIEMPO ESTIMADO" : "ESTIMATED TIME"}
                      </span>
                      <span className="font-semibold text-primary block mt-0.5 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {activeExp.tiempo} min
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] tracking-widest text-zinc-500 uppercase block select-none">
                        {lang === "es" ? "DIFICULTAD" : "DIFFICULTY"}
                      </span>
                      <span className={`inline-block mt-1 font-bold rounded-full px-2.5 py-0.5 text-[10px] ${
                        activeExp.dificultad === "Avanzada" ? "bg-rose-500/15 text-rose-400" :
                        activeExp.dificultad === "Intermedia" ? "bg-amber-500/15 text-amber-400" :
                        "bg-green-500/15 text-green-400"
                      }`}>
                        {lang === "es" ? activeExp.dificultad : activeExp.dificultad_en}
                      </span>
                    </div>
                  </div>

                  {/* Objectives */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-mono uppercase tracking-widest text-primary font-bold select-none">
                      {lang === "es" ? "Objetivos de Aprendizaje" : "Learning Objectives"}
                    </h3>
                    <ul className="space-y-2 text-sm text-foreground/85">
                      {(lang === "es" ? activeExp.objetivos : activeExp.objetivos_en).map((obj, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Theory basis */}
                  <div className="space-y-3 pt-4 border-t border-white/5">
                    <h3 className="text-xs font-mono uppercase tracking-widest text-primary font-bold flex items-center gap-2 select-none">
                      <FileText className="w-4 h-4 text-primary" />
                      {lang === "es" ? "Fundamento Teórico" : "Theoretical Foundation"}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed font-sans">
                      {lang === "es" ? activeExp.fundamento : activeExp.fundamento_en}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Secure Personal Protective Equipment Interactive module */}
              <Card className="rounded-[2.5rem] border border-white/10 bg-slate-900/40 backdrop-blur-md shadow-2xl overflow-hidden relative text-left">
                <CardHeader className="p-8 pb-4">
                  <CardTitle className="text-lg font-bold font-serif text-white flex items-center gap-2.5">
                    <ShieldAlert className="w-5.5 h-5.5 text-primary" />
                    {lang === "es" ? "Equipo de Protección Personal Requerido (EPP)" : "Required Personal Protective Equipment (PPE)"}
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground select-none">
                    {lang === "es" 
                      ? "Asegura la protección biológica de tu avatar haciendo clic para equipar los elementos obligatorios:" 
                      : "Sustain biological shielding by clicking each core item below to securely equip your avatar:"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-2 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {activeExp.epp.map(item => {
                      const equipped = ppeGear[item.id];
                      return (
                        <button
                          key={item.id}
                          onClick={() => togglePpe(item.id)}
                          className={`p-4 rounded-2xl border flex flex-col items-center justify-center text-center gap-2 transition-all duration-300 cursor-pointer ${
                            equipped 
                              ? "bg-emerald-500/20 border-emerald-500/50 text-white shadow-lg shadow-emerald-500/10" 
                              : "bg-slate-950/40 border-white/5 text-muted-foreground hover:border-white/10 hover:text-white"
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                            equipped ? "bg-emerald-500 text-slate-950" : "bg-white/5"
                          }`}>
                            {equipped ? <Check className="w-4 h-4 stroke-[3]" /> : <UserCheck className="w-4 h-4" />}
                          </div>
                          <span className="text-xs font-mono font-bold">
                            {lang === "es" ? item.es : item.en}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Safety Warnings banner */}
                  <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 space-y-2">
                    <span className="text-[10px] font-mono font-bold uppercase text-orange-400 tracking-wider flex items-center gap-1.5 select-none">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {lang === "es" ? "Precauciones Críticas de Bioseguridad" : "Critical Chemical Biosafety Warnings"}
                    </span>
                    <ul className="space-y-1.5 text-xs text-muted-foreground list-disc list-inside">
                      {(lang === "es" ? activeExp.precauciones : activeExp.precauciones_en).map((crit, idx) => (
                        <li key={idx}>{crit}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* List of elements, reactants and laboratory glassware requirements */}
              <Card className="rounded-[2.5rem] border-white/10 bg-slate-900/40 backdrop-blur-md shadow-2xl overflow-hidden text-left">
                <CardHeader className="p-8 pb-4">
                  <CardTitle className="text-lg font-bold font-serif text-white flex items-center gap-2.5">
                    <Layers className="w-5.5 h-5.5 text-primary" />
                    {lang === "es" ? "Reactivos, Solventes, Equipamiento" : "Glassware, Reagents & Equipment"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Biomass and compounds column */}
                  <div className="space-y-3 p-5 rounded-2xl bg-slate-950/20 border border-white/5">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 select-none">
                      {lang === "es" ? "Biomasa & Químicos" : "Biomass & Chemical Inputs"}
                    </h4>
                    <ul className="space-y-2 text-xs text-muted-foreground font-mono">
                      {(lang === "es" ? activeExp.biomasa : activeExp.biomasa_en).map((mat, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                          <span>{mat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Glassware complex systems column */}
                  <div className="space-y-3 p-5 rounded-2xl bg-slate-950/20 border border-white/5">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-primary select-none">
                      {lang === "es" ? "Cristalería & Maquinaria" : "Glassware Apparatus Systems"}
                    </h4>
                    <ul className="space-y-2 text-xs text-muted-foreground font-mono">
                      {(lang === "es" ? activeExp.cristaleria : activeExp.cristaleria_en).map((eq, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                          <span>{eq}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* RIGHT COLUMN: Simulator (Adaptive) and Yield Calculator */}
            <div className="lg:col-span-5 space-y-8">
              {/* ADAPTIVE LABORATORY REACTOR CORE SIMULATOR GAUGE */}
              <Card className="rounded-[2.5rem] border border-primary/20 bg-slate-950/90 backdrop-blur-xl shadow-2xl overflow-hidden relative text-left">
                <CardHeader className="p-8 pb-4 border-b border-white/5">
                  <CardTitle className="text-sm font-mono font-bold uppercase tracking-wider text-white flex items-center justify-between">
                    <span className="flex items-center gap-2 font-black">
                      <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
                      {lang === "es" ? "Reactor Sónico & Térmico" : "Sonic & Thermal Reactor Sim"}
                    </span>
                    <span className="text-[10px] bg-emerald-950 border border-emerald-500/30 px-2 py-0.5 rounded text-emerald-400 font-mono">
                      {activeExp.sim_type.toUpperCase()}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  {/* Dynamic Adaptive Simulation Area */}
                  <div className="h-48 rounded-3xl bg-slate-900 border border-white/5 relative flex flex-col items-center justify-center p-4 overflow-hidden shadow-inner">
                    {/* Visual representation depending on: distillation, chromatography, extraction, ultrasound, spectrometry/colorimetry, precipitation */}
                    
                    {/* 1. Distillation active animation */}
                    {activeExp.sim_type === "distillation" && (
                      <div className="w-full flex justify-around items-center h-full relative z-10">
                        {isSimulating && (
                          <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent pointer-none" />
                        )}
                        {/* Vapor generator */}
                        <div className="flex flex-col items-center gap-1">
                          <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center relative transition-all duration-300 ${
                            isSimulating ? "border-primary shadow-[0_0_15px_rgba(244,63,94,0.35)] bg-rose-950/20" : "border-white/10 bg-black/40"
                          }`}>
                            <FlaskConical className={`w-5 h-5 ${isSimulating ? "text-primary animate-pulse" : "text-zinc-650"}`} />
                            {isSimulating && (
                              <div className="absolute -bottom-1.5 p-0.5 bg-orange-500 rounded-full animate-bounce">
                                <Flame className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                          <span className="text-[8px] font-mono font-bold text-zinc-500 uppercase mt-1">Heater Ball</span>
                        </div>
                        {/* Liebig tube line */}
                        <div className="flex-1 h-1.5 bg-zinc-800 mx-2 relative rounded overflow-hidden">
                          {isSimulating && (
                            <motion.div 
                              className="h-full bg-emerald-400 blur-[0.5px]"
                              animate={{ x: [-40, 100] }}
                              transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                            />
                          )}
                        </div>
                        {/* Condensation beakers */}
                        <div className="flex flex-col items-center gap-1">
                          <div className={`w-12 h-12 border-2 rounded-t-lg rounded-b-2xl flex flex-col items-center justify-end relative transition-all duration-300 ${
                            recoveredValue > 0 ? "border-emerald-500/50 bg-slate-900" : "border-white/10 bg-black/40"
                          }`}>
                            {recoveredValue > 0 && (
                              <div 
                                style={{ height: `${Math.min(80, 10 + (recoveredValue / activeExp.default_yield_val) * 60)}%` }}
                                className="w-full bg-gradient-to-t from-emerald-500/40 to-emerald-400/20 border-t-2 border-emerald-400/50 rounded-b-xl flex items-center justify-center pb-1 transition-all"
                              >
                                <Droplet className="w-3 h-3 text-emerald-300 animate-pulse" />
                              </div>
                            )}
                            <span className="absolute top-1 text-[8px] text-zinc-300 font-mono font-bold">{recoveredValue} g</span>
                          </div>
                          <span className="text-[8px] font-mono font-bold text-emerald-400 uppercase mt-1">Collector</span>
                        </div>
                      </div>
                    )}

                    {/* 2. Chromatography visual development simulation */}
                    {activeExp.sim_type === "chromatography" && (
                      <div className="h-full w-48 flex justify-between bg-black/40 rounded-xl p-4 border border-white/5 relative items-center z-13">
                        <div className="w-1.5 h-full bg-zinc-800 rounded relative overflow-hidden flex flex-col justify-end">
                          <div style={{ height: `${simValue}%` }} className="w-full bg-indigo-500/30 transition-all duration-700" />
                        </div>
                        {/* TLC Plate representation */}
                        <div className="flex-1 bg-zinc-100 rounded-lg p-2 h-full mx-4 flex flex-col justify-between relative shadow-lg">
                          <span className="text-[7px] text-slate-800 font-mono absolute top-1 right-1 select-none font-bold">SILICA GEL G</span>
                          {/* TLC Start spotted point */}
                          <div className="w-full h-[1px] bg-slate-300 absolute bottom-6 inset-x-0" />
                          <div className="w-2.5 h-2.5 rounded-full bg-green-800 absolute bottom-[18px] left-[40%] text-[5px] text-white flex items-center justify-center">S</div>

                          {/* Dynamic raising spots as chromatogram develops */}
                          {isSimulating && simValue > 15 && (
                            <motion.div 
                              style={{ bottom: `${Math.min(75, 18 + simValue * 0.5)}%` }} 
                              className="w-3 h-2 rounded-full bg-yellow-500 absolute left-[38%] blur-[1.2px]"
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ repeat: Infinity, duration: 1 }}
                            />
                          )}
                          {isSimulating && simValue > 35 && (
                            <motion.div 
                              style={{ bottom: `${Math.min(50, 18 + simValue * 0.35)}%` }} 
                              className="w-3 h-2 rounded-full bg-emerald-500 absolute left-[38%] blur-[1px]"
                            />
                          )}
                          {isSimulating && simValue > 55 && (
                            <motion.div 
                              style={{ bottom: `${Math.min(35, 18 + simValue * 0.2)}%` }} 
                              className="w-3.5 h-2.5 rounded-full bg-emerald-700 absolute left-[37%] blur-[0.8px]"
                            />
                          )}

                          {/* Solvent front line */}
                          {isSimulating && (
                            <div 
                              style={{ bottom: `${Math.min(92, 18 + simValue * 0.72)}%` }} 
                              className="w-full h-0.5 bg-indigo-400 absolute inset-x-0 opacity-80"
                            />
                          )}
                        </div>
                      </div>
                    )}

                    {/* 3. Extraction / Maceration simulation area */}
                    {activeExp.sim_type === "extraction" && (
                      <div className="w-full h-full flex items-center justify-around z-10 relative">
                        {isSimulating && (
                          <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[0.5px] pointer-none flex items-center justify-center">
                            <Waves className="w-12 h-12 text-primary animate-spin opacity-40 duration-3000" />
                          </div>
                        )}
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-16 h-20 border-2 border-white/20 rounded-b-2xl rounded-t-md relative bg-black/40 overflow-hidden flex flex-col justify-end">
                            {/* Fluid volume inside vessel */}
                            <div 
                              style={{ height: `${isSimulating ? "68%" : "30%"}` }} 
                              className={`w-full transition-all duration-1000 bg-gradient-to-t border-t border-indigo-400/80 ${
                                isSimulating 
                                  ? "from-amber-800/80 to-amber-600/50" 
                                  : "from-amber-900/40 to-slate-800/40"
                              }`}
                            >
                              {/* Dissolved floating leaves/flakes */}
                              <div className="grid grid-cols-3 gap-1 p-2 opacity-50">
                                <span className="w-1 h-1 bg-green-900 rounded-full" />
                                <span className="w-1.5 h-1.5 bg-zinc-900 rounded-full" />
                                <span className="w-1 h-1 bg-amber-950 rounded-full animate-bounce" />
                              </div>
                            </div>
                            <span className="absolute top-2 w-full text-center text-[8px] font-mono text-zinc-400">DEC-POT</span>
                          </div>
                          <span className="text-[8px] font-mono font-bold text-zinc-500 uppercase mt-1">Extractor Pot</span>
                        </div>
                      </div>
                    )}

                    {/* 4. Ultrasound Cavitation dynamic reactor */}
                    {activeExp.sim_type === "ultrasound" && (
                      <div className="w-full h-full flex items-center justify-around z-10 relative">
                        <div className="flex flex-col items-center gap-1 text-center w-full max-w-xs">
                          <div className={`w-28 h-20 rounded-2xl border-2 flex flex-col justify-end relative overflow-hidden p-2 transition-all duration-300 ${
                            isSimulating 
                              ? "border-emerald-400 bg-indigo-950/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]" 
                              : "border-white/10 bg-black/40"
                          }`}>
                            {isSimulating && (
                              <div className="absolute inset-0 flex flex-col justify-center items-center">
                                <motion.div 
                                  className="w-20 h-10 border border-emerald-400/30 rounded-full flex items-center justify-center"
                                  animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.8, 0.1, 0.8] }}
                                  transition={{ repeat: Infinity, duration: 0.6 }}
                                >
                                  <Waves className="w-6 h-6 text-emerald-400 animate-pulse" />
                                </motion.div>
                                <span className="text-[7px] text-emerald-400 font-mono font-bold">CAVITATION ACTIVE (40 kHz)</span>
                              </div>
                            )}
                            <div className="w-full h-8 bg-purple-950/60 rounded-b-xl border-t border-purple-500/30" />
                          </div>
                          <span className="text-[8px] font-mono font-bold text-zinc-550 uppercase mt-1">Sonar-UAE Bath</span>
                        </div>
                      </div>
                    )}

                    {/* 5. Spectrophotometry / Colorimetry cell sensor */}
                    {activeExp.sim_type === "colorimetry" && (
                      <div className="w-full h-full flex items-center justify-around z-10 relative">
                        <div className="flex flex-col items-center gap-1 w-full max-w-sm">
                          <div className="flex items-center gap-4">
                            {/* Color reaction tube */}
                            <div className="w-8 h-20 border border-white/20 rounded-b-full bg-black/40 overflow-hidden flex flex-col justify-end p-0.5 shadow-md">
                              <div 
                                style={{ height: "70%" }} 
                                className={`w-full rounded-b-full transition-all duration-2000 bg-gradient-to-t ${
                                  isSimulating 
                                    ? "from-blue-900 to-indigo-700 animate-pulse" 
                                    : "from-yellow-600/60 to-yellow-500/30"
                                }`}
                              />
                            </div>
                            {/* Analytics dashboard display */}
                            <div className="p-3 bg-zinc-950 rounded-xl border border-white/5 font-mono text-[9px] text-left space-y-1 w-44">
                              <span className="text-emerald-400 block font-bold border-b border-white/5 pb-1 select-none">SPECTRO V-VIS v2.0</span>
                              <div className="flex justify-between">
                                <span className="text-zinc-500">LINE-ABS:</span>
                                <span className="font-extrabold text-white">765 nm</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-zinc-500">ABSORB:</span>
                                <span className="font-extrabold text-indigo-400">
                                  {isSimulating ? (0.2 + (simValue * 0.0075)).toFixed(3) : "0.000"} Au
                                </span>
                              </div>
                            </div>
                          </div>
                          <span className="text-[8px] font-mono font-bold text-zinc-500 uppercase mt-1">Photoelastic Sensor Cuvette</span>
                        </div>
                      </div>
                    )}

                    {/* 6. Ionic Precipitation test tube animation */}
                    {activeExp.sim_type === "precipitation" && (
                      <div className="w-full h-full flex items-center justify-around z-10 relative">
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-9 h-24 border border-white/20 rounded-b-full bg-black/40 overflow-hidden flex flex-col justify-between relative p-1 shadow-inner">
                            {isSimulating && (
                              <motion.div 
                                className="w-2 h-2 rounded-full bg-orange-400 absolute top-2 left-3 blur-[0.5px]"
                                animate={{ y: [0, 55], opacity: [1, 0] }}
                                transition={{ repeat: Infinity, duration: 1.2, ease: "easeIn" }}
                              />
                            )}
                            <div className="w-full flex-1" />
                            {/* Gloculated orange sediment at the bottom */}
                            {isSimulating && (
                              <motion.div 
                                style={{ height: `${Math.min(40, 5 + simValue * 0.35)}%` }} 
                                className="w-full bg-orange-500/80 rounded-b-full border-t border-orange-400 filter blur-[0.6px] transition-all"
                              />
                            )}
                          </div>
                          <span className="text-[8px] font-mono font-bold text-zinc-550 uppercase mt-1">Precipitate tube</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Safety Error prompt if PPE items missed */}
                  {ppeError && (
                    <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 font-mono flex items-start gap-2 animate-pulse">
                      <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>
                        {lang === "es" 
                          ? "⚠️ SEGURIDAD: Equípate todos los elementos de EPP en el panel izquierdo antes de reactivar la instalación." 
                          : "⚠️ SAFETY CONFLICT: Equip all required PPE items on the safety panel before activating the hot vessel."}
                      </span>
                    </div>
                  )}

                  {/* Live physical sensors board */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                      <span className="text-[9px] font-mono font-bold text-muted-foreground uppercase flex items-center gap-1 select-none">
                        <Thermometer className="w-3.5 h-3.5 text-rose-400" />
                        {lang === "es" ? "Temperatura Interna" : "Internal Temperature"}
                      </span>
                      <p className={`text-2xl font-mono font-extrabold ${temp > 75 ? "text-rose-400" : "text-white"}`}>
                        {temp} °C
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                      <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase flex items-center gap-1 select-none">
                        <Droplet className="w-3.5 h-3.5" />
                        {lang === "es" ? "Fracción Recuperada" : "Accumulated Fraction"}
                      </span>
                      <p className="text-2xl font-mono font-extrabold text-emerald-400">
                        {recoveredValue} {activeExp.unidad === " mg/g" ? "mg" : "g"}
                      </p>
                    </div>
                  </div>

                  {/* Operational Reactor Buttons */}
                  <div className="flex gap-4">
                    <Button
                      onClick={() => setIsSimulating(!isSimulating)}
                      className={`flex-1 h-16 rounded-2xl text-xs uppercase font-black tracking-widest gap-4 shadow-xl cursor-pointer text-white transition-all duration-300 relative overflow-hidden group ${
                        isSimulating 
                          ? "bg-gradient-to-r from-emerald-500 via-purple-600 to-rose-500 hover:opacity-95 shadow-rose-500/10 scale-[1.01]" 
                          : "bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-emerald-500/10 hover:scale-[1.01]"
                      }`}
                    >
                      {/* High fidelity motor action in action */}
                      <BotanicalMotor active={isSimulating} className="w-10 h-10 shrink-0" />
                      
                      <div className="flex flex-col items-start">
                        {isSimulating ? (
                          <>
                            <span className="text-[13px] font-black tracking-widest text-white uppercase animate-bounce mt-0.5">
                              {lang === "es" ? "trabajando..." : "working..."}
                            </span>
                            <span className="text-[8px] opacity-90 font-mono tracking-tight uppercase text-emerald-200">
                              {lang === "es" ? "simulando reactor..." : "simulating reactor..."}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="text-[11px] font-extrabold tracking-wider">
                              {lang === "es" ? "Prender Alimentación Reactor" : "Ignite Vessel Core"}
                            </span>
                            <span className="text-[8px] opacity-75 font-mono tracking-tight lowercase">
                              {lang === "es" ? "haz clic para iniciar análisis" : "click to initiate analysis"}
                            </span>
                          </>
                        )}
                      </div>
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsSimulating(false);
                        setTemp(24);
                        setSimValue(0);
                        setRecoveredValue(0);
                        setCheckedSteps({});
                        setActiveInstructionNum(1);
                        setPpeError(false);
                      }}
                      className="h-12 w-12 rounded-xl p-0 border-white/5 hover:bg-white/5 cursor-pointer text-zinc-400 hover:text-white"
                      title={lang === "es" ? "Reiniciar Parámetros" : "Reset Parameters"}
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* DYNAMIC METRIC ARITHMETIC PERFORMANCE CALCULATOR CARD */}
              <Card className="rounded-[2.5rem] border border-white/10 bg-slate-900/40 backdrop-blur-md shadow-2xl overflow-hidden text-left">
                <CardHeader className="p-8 pb-4">
                  <CardTitle className="text-lg font-bold font-serif text-white flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-emerald-400" />
                    {lang === "es" ? "Calculadora de Rendimiento y Absorbancia" : "Yield & Absorbance Calculator"}
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground select-none">
                    {lang === "es" 
                      ? "Evalúa de forma empírica la calidad del aislamiento obtenido multiplicando las variables." 
                      : "Evaluate empirically the quality and density of isolated products based on math standards."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-2 space-y-6">
                  <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/10 text-[11px] leading-relaxed text-zinc-400 font-mono">
                    <span className="font-extrabold text-indigo-400 block mb-1 uppercase select-none">
                      {lang === "es" ? "FÓRMULA MATEMÁTICA ASIGNADA" : "ASSIGNED SCIENTIFIC FORMULA"}
                    </span>
                    <code>y = {activeExp.formula}</code>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase block select-none">
                        {lang === "es" ? activeExp.input_biomass_label : activeExp.input_biomass_label_en}
                      </label>
                      <Input
                        type="number"
                        value={biomassWeight}
                        onChange={(e) => setBiomassWeight(e.target.value === "" ? "" : parseFloat(e.target.value))}
                        className="rounded-xl border-white/5 bg-slate-950/60 font-mono text-sm text-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase block select-none">
                        {lang === "es" ? activeExp.input_yield_label : activeExp.input_yield_label_en}
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        value={yieldWeight}
                        onChange={(e) => setYieldWeight(e.target.value === "" ? "" : parseFloat(e.target.value))}
                        className="rounded-xl border-white/5 bg-slate-950/60 font-mono text-sm text-indigo-400"
                      />
                    </div>
                  </div>

                  {/* Yield results dashboard displaying custom margins */}
                  <div className="p-5 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between gap-6">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase block select-none">
                        {lang === "es" ? activeExp.formula_label : activeExp.formula_label_en}
                      </span>
                      <span className="text-3xl font-mono font-black text-emerald-400">
                        {yieldResult !== null ? `${yieldResult}${activeExp.unidad}` : "0.00%"}
                      </span>
                    </div>
                    <div className="text-right text-xs leading-normal max-w-[200px] font-mono select-none">
                      {yieldResult !== null && yieldResult >= activeExp.range_min && yieldResult <= activeExp.range_max ? (
                        <span className="text-emerald-400 font-bold block">
                          ✓ {lang === "es" ? "Eficiencia Óptima Académica" : "Optimal Academic Yield"}
                        </span>
                      ) : (
                        <span className="text-amber-400 font-bold block">
                          ⚠ {lang === "es" ? "Desviación del Rango Teórico" : "Outside Theoretical Norms"}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-[10px] text-zinc-500 leading-snug font-sans">
                    {lang === "es" 
                      ? `Rango teórico estocástico para ${activeExp.especie}: generalmente ${activeExp.range_min}${activeExp.unidad} - ${activeExp.range_max}${activeExp.unidad}.` 
                      : `Theoretical boundaries for ${activeExp.especie}: scope is historically of ${activeExp.range_min}${activeExp.unidad} - ${activeExp.range_max}${activeExp.unidad}.`}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* DYNAMIC CHECKLIST PROTOCOL OF ACTION */}
          <Card className="rounded-[2.5rem] border border-white/10 bg-slate-900/40 backdrop-blur-md shadow-2xl overflow-hidden text-left max-w-7xl mx-auto">
            <CardHeader className="p-10 pb-6 border-b border-white/5">
              <CardTitle className="text-xl font-bold font-serif text-white flex items-center gap-3">
                <Check className="w-6 h-6 text-emerald-400" />
                {lang === "es" ? "Ejecución Guiada del Protocolo Fitoquímico" : "Experimental Method Protocol Checklist"}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                {lang === "es" 
                  ? "Sigue meticulosamente los pasos validados del método para garantizar el aislamiento seguro de metabolitos." 
                  : "Follow meticulously each steps to sustain complete safety and yield accuracy during laboratory operations."}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-10 space-y-6">
              <div className="divide-y divide-white/5">
                {activeExp.pasos.map((step) => {
                  const isChecked = checkedSteps[step.paso];
                  const isActive = step.paso === activeInstructionNum;
                  return (
                    <div
                      key={step.paso}
                      className={`py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-300 ${
                        isActive ? "bg-emerald-500/5 px-4 rounded-2xl border-l-[3px] border-emerald-500" : "px-2"
                      } ${isChecked ? "opacity-45" : "opacity-100"}`}
                    >
                      <div className="space-y-1 max-w-2xl text-left">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-emerald-400">PASO 0{step.paso}</span>
                          {step.es_critico && (
                            <Badge variant="outline" className="text-[9px] bg-rose-500/15 border-rose-500/20 text-rose-400 rounded-full font-mono font-bold py-0 flex items-center gap-1">
                              <AlertTriangle className="w-2.5 h-2.5 shrink-0" />
                              {lang === "es" ? "Paso de Alta Seguridad" : "Critical Safety Measure"}
                            </Badge>
                          )}
                        </div>
                        <p className={`text-sm text-white/95 font-sans leading-relaxed ${isChecked ? "line-through text-muted-foreground" : ""}`}>
                          {lang === "es" ? step.instruccion : step.instruccion_en}
                        </p>
                      </div>

                      <Button
                        onClick={() => handleStepCheck(step.paso)}
                        variant={isChecked ? "outline" : "secondary"}
                        className={`rounded-xl px-4 text-xs font-bold shrink-0 cursor-pointer flex items-center gap-1.5 ${
                          isChecked 
                            ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-400" 
                            : "bg-white/5 hover:bg-white/10 text-white"
                        }`}
                      >
                        <Check className={`w-3.5 h-3.5 transition-colors ${isChecked ? "text-emerald-400" : "text-stone-450"}`} />
                        {isChecked ? (lang === "es" ? "Ejecutado" : "Completed") : (lang === "es" ? "Marcar Hecho" : "Mark Done")}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* PRACTICAL LABORATORY WASTE MANAGEMENT CARD */}
          <Card className="rounded-[2.5rem] border border-white/10 bg-slate-900/40 backdrop-blur-md shadow-2xl overflow-hidden text-left max-w-7xl mx-auto">
            <CardHeader className="p-10 pb-4">
              <CardTitle className="text-xl font-bold font-serif text-white flex items-center gap-2.5">
                <Archive className="w-5.5 h-5.5 text-primary" />
                {lang === "es" ? "Protocolo de Gestión Sanitaria y Disposición de Residuos" : "Waste Disposal & Residual Bio-Management"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-10 pt-2 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {(lang === "es" ? activeExp.residuos : activeExp.residuos_en).map((disp, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-black/25 border border-white/5 space-y-2">
                    <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest block select-none">
                      {lang === "es" ? "RESIDUO CLAVE" : "RESIDUE CATEGORY"} 0{idx + 1}
                    </span>
                    <p className="text-xs text-muted-foreground leading-relaxed font-sans">{disp}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
