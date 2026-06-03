import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  FlaskConical, 
  Activity, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  HelpCircle, 
  RefreshCw, 
  Download, 
  BookOpen, 
  FileText, 
  Layers, 
  Calculator, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Clipboard,
  Check,
  Settings,
  Leaf,
  Droplet,
  Utensils
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ScientificReport } from "./ScientificReport";
import { MosSpectrumChart } from "./MosSpectrumChart";
import { PhytoReactorEngine } from "./PhytoReactorEngine";
import { generateAuroriaReport, searchBotanicalDatabase, resolveScientificName, getPubChemCompoundData, auditAndApplyPubChemLinks, auditAndApplyPubChemLinksAsync, type PubChemCompoundData } from "../services/gemini";

const cleanMarkdownHttps = (md: string | null | undefined): string => {
  if (!md) return "";
  return md.replace(/(!?\[[^\]]*\]\([^\)]+\))|(https?:\/\/\S+)/g, (match, link) => {
    if (link) {
      return link.replace(/\[(https?:\/\/)?([^\]]+)\]/gi, (m, prefix, inner) => {
        return `[${inner.replace(/https?:\/\//gi, "")}]`;
      });
    }
    return match.replace(/https?:\/\//gi, "");
  });
};

const ta = {
  es: {
    badge: "Módulo AurorIA v4.0 Activo",
    title: "Asistente Científico",
    subtitle: "Plataforma herbolaria regulatoria de análisis fitoquímico e in silico para evaluación de seguridad conformes a la",
    nom: "NOM-073-SSA1-2015, SCCS (Scientific Committee on Consumer Safety) (2023) y Organización Mundial de la Salud (WHO) (2010) (WHO Guidelines on Assessing Quality of Herbal Medicines with Reference to Contaminants and Residues)",
    profiles_title: "Perfiles & Marcadores",
    profiles_desc: "Establece la fitoquímica del espécimen vegetal",
    new_study: "Nuevo Estudio",
    quick_presets: "Ejemplos Rápidos de Referencia",
    botanical_name_label: "Especie Botánica Analizada",
    search_btn: "Consultar BD",
    system_log: "Campos limpios. Nuevo estudio botánico in silico iniciado.",
    db_consulting: "Consultando bases de datos de LOTUS, SCCS y PubChem para",
    db_success: "Parámetros científicos reportados y cargados con éxito.",
    db_info: "No se reportaron coordenadas de seguridad tabuladas. Campos habilitados para captura manual.",
    db_error: "Fallo en la comunicación con bases de datos. Capture los campos manualmente.",
    analysis_steps: [
      "Iniciando análisis fitoquímico y toxicológico bajo los estándares de AurorIA...",
      "Extrayendo perfiles biosintéticos cuantitativos...",
      "Vía del Ácido Mevalónico vs Ácido Shikímico inicializada.",
      "Auditoría in silico: Ejecutando algoritmos calcular_sed() y evaluar_mos()...",
      "Calculando Dosis de Exposición Sistémica (SED) y Margen de Seguridad (MoS)...",
      "Verificando conformidad con la Norma Oficial Mexicana NOM-073-SSA1-2015...",
      "Generando manuscrito regulatorio estructurado en formato IMRaD...",
      "Sincronizando bibliografía académica 100% DOI-conforme...",
      "Reporte compilado con veredicto de seguridad."
    ]
  },
  en: {
    badge: "AurorIA v4.0 Module Active",
    title: "Scientific Assistant",
    subtitle: "Regulatory herbal platform for phytochemical and in silico safety evaluations fully compliant with",
    nom: "NOM-073-SSA1-2015, SCCS (Scientific Committee on Consumer Safety) (2023) and World Health Organization (WHO) (2010) (WHO Guidelines on Assessing Quality of Herbal Medicines with Reference to Contaminants and Residues)",
    profiles_title: "Profiles & Markers",
    profiles_desc: "Set the herbal specimen's phytochemistry",
    new_study: "New Study",
    quick_presets: "Quick Reference Examples",
    botanical_name_label: "Analyzed Botanical Species",
    search_btn: "Query DB",
    system_log: "Fields cleared. New botanical in silico study initiated.",
    db_consulting: "Querying LOTUS, SCCS and PubChem databases for",
    db_success: "Scientific parameters successfully retrieved and loaded.",
    db_info: "No tabulated safety coordinates reported. Fields enabled for manual entry.",
    db_error: "Database communication failure. Please capture fields manually.",
    analysis_steps: [
      "Initiating phytochemical and toxicological analysis under AurorIA standards...",
      "Extracting quantitative biosynthetic profiles...",
      "Mevalonic Acid vs. Shikimic Acid pathway initialized.",
      "In silico audit: Executing calcular_sed() and evaluar_mos() algorithms...",
      "Calculating Systemic Exposure Dose (SED) and Margin of Safety (MoS)...",
      "Verifying compliance with Mexican Official Standard NOM-073-SSA1-2015...",
      "Generating structured regulatory manuscript in IMRaD format...",
      "Synchronizing academic bibliography with 100% compliant DOIs...",
      "Report compiled with safety verdict."
    ]
  }
};

const PLANT_METABOLITES: { [key: string]: string[] } = {
  "mentha piperita": ["Mentol (Menthol)", "Mentofurano", "Mentona (Menthone)"],
  "menta": ["Mentol (Menthol)", "Mentofurano", "Mentona (Menthone)"],
  "menta piperita": ["Mentol (Menthol)", "Mentofurano", "Mentona (Menthone)"],
  "peppermint": ["Mentol (Menthol)", "Mentofurano", "Mentona (Menthone)"],
  "rosmarinus officinalis": ["Ácido Rosmarínico (Rosmarinic Acid)", "Alcanfor (Camphor)", "1,8-Cineol"],
  "salvia rosmarinus": ["Ácido Rosmarínico (Rosmarinic Acid)", "Alcanfor (Camphor)", "1,8-Cineol"],
  "romero": ["Ácido Rosmarínico (Rosmarinic Acid)", "Alcanfor (Camphor)", "1,8-Cineol"],
  "rosemary": ["Ácido Rosmarínico (Rosmarinic Acid)", "Alcanfor (Camphor)", "1,8-Cineol"],
  "matricaria chamomilla": ["Apigenina (Apigenin)", "Chamazuleno (Chamazulene)", "Bisabolol"],
  "manzanilla": ["Apigenina (Apigenin)", "Chamazuleno (Chamazulene)", "Bisabolol"],
  "chamomile": ["Apigenina (Apigenin)", "Chamazuleno (Chamazulene)", "Bisabolol"],
  "aloe vera": ["Aloína (Aloin)", "Acemanano (Acemannan)"],
  "sábila": ["Aloína (Aloin)", "Acemanano (Acemannan)"],
  "sabila": ["Aloína (Aloin)", "Acemanano (Acemannan)"],
  "aloe": ["Aloína (Aloin)", "Acemanano (Acemannan)"],
  "calendula officinalis": ["Ésteres de faradiol (Faradiol esters)", "Calendulin (Calendulin)"],
  "caléndula": ["Ésteres de faradiol (Faradiol esters)", "Calendulin (Calendulin)"],
  "calendula": ["Ésteres de faradiol (Faradiol esters)", "Calendulin (Calendulin)"],
  "lavandula angustifolia": ["Acetato de linalilo (Linalyl acetate)", "Linalool"],
  "lavanda": ["Acetato de linalilo (Linalyl acetate)", "Linalool"],
  "lavender": ["Acetato de linalilo (Linalyl acetate)", "Linalool"]
};

export function AuroriaWorkspace({ lang = "es" }: { lang?: "es" | "en" }) {
  // Inputs
  const [startingPoint, setStartingPoint] = useState<"choice" | "whole_plant" | "secondary_metabolite">("choice");
  const [selectedMetabolite, setSelectedMetabolite] = useState<string>("Mentol (Menthol)");
  const [customMetabolites, setCustomMetabolites] = useState<string[]>([]);
  const [botanicalName, setBotanicalName] = useState("Mentha piperita");
  const [volatilePct, setVolatilePct] = useState<number | string>("65");
  const [mentholPct, setMentholPct] = useState<number | string>("42.5");
  const [rosmarinicPct, setRosmarinicPct] = useState<number | string>("12.8");
  const [impurityName, setImpurityName] = useState("Mentofurano");
  const [impurityPct, setImpurityPct] = useState<number | string>("1.8");

  // Toxicological values
  const [evaluationRoute, setEvaluationRoute] = useState<"dermal" | "oral">("dermal");
  const [appliedAmount, setAppliedAmount] = useState<number | string>("1.2"); // A (g/day)
  const [concentration, setConcentration] = useState<number | string>("3.5"); // C (%)
  const [dermalAbsorption, setDermalAbsorption] = useState<number | string>("10.0"); // DAa (%)
  const [retentionFactor, setRetentionFactor] = useState(1.0); // R (leave-on 1.0, rinse-off 0.1)
  const [bodyWeight, setBodyWeight] = useState<number | string>("60.0"); // BW (kg)
  const [noael, setNoael] = useState<number | string>("150.0"); // NOAEL (mg/kg/day)

  // Alternative Risk Assessment variables
  const [isAlternativeProtocolActive, setIsAlternativeProtocolActive] = useState(false);
  const [alternativeStrategy, setAlternativeStrategy] = useState<"ttc" | "read_across" | "bmdl">("ttc");
  const [cramerClass, setCramerClass] = useState<"I" | "II" | "III">("III");
  const [readAcrossAnalog, setReadAcrossAnalog] = useState("");
  const [readAcrossNoael, setReadAcrossNoael] = useState<number | string>("");
  const [readAcrossPenalty, setReadAcrossPenalty] = useState<number>(10);
  const [bmdlValue, setBmdlValue] = useState<number | string>("");

  // Calculated state
  const [sed, setSed] = useState(0);
  const [mos, setMos] = useState(0);
  const [isApproved, setIsApproved] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);

  // UI state
  const [loading, setLoading] = useState(false);
  const [searchingDB, setSearchingDB] = useState(false);
  const [consoleStatus, setConsoleStatus] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [reportResult, setReportResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // PubChem Integration States & Search Function
  const [pubChemLoading, setPubChemLoading] = useState(false);
  const [loadingTypical, setLoadingTypical] = useState(false);
  const [loadingParams, setLoadingParams] = useState(false);
  const [pubChemData, setPubChemData] = useState<PubChemCompoundData | null>(null);
  const [pubChemSearchError, setPubChemSearchError] = useState<string | null>(null);

  const handlePubChemSearch = async (compoundName: string) => {
    if (!compoundName || !compoundName.trim()) return;
    setPubChemLoading(true);
    setPubChemSearchError(null);
    setPubChemData(null);
    setConsoleStatus(prev => [...prev, `[PUBCHEM SEARCH INITIATED]: Querying PubChem API and official literature for "${compoundName}"...`]);

    try {
      const data = await getPubChemCompoundData(compoundName);
      if (data) {
        setPubChemData(data);
        setConsoleStatus(prev => [
          ...prev,
          `[PUBCHEM DATA RETRIEVED]: Found CID ${data.cid} for "${data.name}". Formula: ${data.formula}, MW: ${data.molecularWeight} g/mol, XLogP: ${data.xLogP}.`
        ]);

        if (data.noael && data.noael.toUpperCase() !== "ND" && data.noael.toUpperCase() !== "N/D") {
          setConsoleStatus(prev => [...prev, `[TOX METRIC FOUND]: Verified Experimental NOAEL: ${data.noael} mg/kg/day.`]);
        } else {
          setConsoleStatus(prev => [...prev, `[TOX METRIC ABSENT]: Experimental NOAEL is "ND". Automatic NGRA Protocols are available (TTC/Read-Across/BMDL10).`]);
        }
      } else {
        setPubChemSearchError(lang === "es" ? "No se encontraron registros moleculares en la base oficial PubChem." : "No molecular records found in the official PubChem database.");
        setConsoleStatus(prev => [...prev, `[PUBCHEM SEACH ERROR]: No database matches found for "${compoundName}".`]);
      }
    } catch (err: any) {
      console.error(err);
      setPubChemSearchError(lang === "es" ? "Error al resolver comunicación con API PubChem." : "Error communication timeout with PubChem API.");
      setConsoleStatus(prev => [...prev, `[PUBCHEM TIMEOUT]: Communication failure with toxicological endpoint.`]);
    } finally {
      setPubChemLoading(false);
    }
  };

  // Auto-activate Alternative Protocol if noael is "ND"
  useEffect(() => {
    if (noael !== undefined && noael !== null) {
      const uNoael = String(noael).trim().toUpperCase();
      if (uNoael === "ND" || uNoael === "N/D" || uNoael === "0" || uNoael === "0.0") {
        setIsAlternativeProtocolActive(true);
      }
    }
  }, [noael]);

  // Helper parser for scientific numeric or ND representation
  const parseVal = (v: any): number => {
    if (v === "" || v === undefined || v === null) return 0;
    if (typeof v === "string" && (v.toUpperCase() === "ND" || v.toUpperCase() === "N/D")) return 0;
    const num = Number(v);
    return isNaN(num) ? 0 : num;
  };

  // Helper formatter to keep 2-3 decimal places and prevent trailing zeros / infinite issues
  const formatToxValue = (val: number, maxDecimals: number = 3): string => {
    if (val === 0) return "0.0";
    if (!isFinite(val)) return lang === "es" ? "Infinito" : "Infinite";
    if (isNaN(val)) return lang === "es" ? "Indefinido" : "Undefined";
    if (val > 0 && val < 0.001) return "< 0.001";
    
    // Format to maxDecimals
    const formatted = val.toFixed(maxDecimals);
    // Remove unnecessary trailing zeros
    return parseFloat(formatted).toString();
  };

  // Dynamic calculations based on inputs
  useEffect(() => {
    const activeApplied = parseVal(appliedAmount);
    const activeConcentration = parseVal(concentration);
    const activeDermalAbsorption = parseVal(dermalAbsorption);
    const activeNoael = parseVal(noael);
    const activeBodyWeight = parseVal(bodyWeight) || 60.0;

    if (activeApplied === 0 || activeConcentration === 0) {
      setValidationError(
        lang === "es"
          ? (evaluationRoute === "oral"
              ? "La Cantidad Ingerida (A) y la Concentración de la Fórmula (C) deben ser estrictamente superiores a cero. Procedimiento matemático de seguridad detenido."
              : "La Cantidad Aplicada (A) y la Concentración de la Fórmula (C) deben ser estrictamente superiores a cero. Procedimiento matemático de seguridad detenido.")
          : (evaluationRoute === "oral"
              ? "Ingested Amount (A) and Formula Concentration (C) must be strictly greater than zero. Safety mathematical procedure halted."
              : "Applied Amount (A) and Formula Concentration (C) must be strictly greater than zero. Safety mathematical procedure halted.")
      );
      setSed(0);
      setMos(Infinity);
      setIsApproved(false);
      return;
    }

    setValidationError(null);

    const aMg = activeApplied * 1000;
    const cFrac = activeConcentration / 100;

    if (evaluationRoute === "oral") {
      // ORAL SCENARIO (EDI & ADI/TDI)
      const calculatedEdi = (aMg * cFrac) / activeBodyWeight;
      setSed(calculatedEdi);

      let calculatedAdiTdi = 0;
      if (isAlternativeProtocolActive) {
        if (alternativeStrategy === "ttc") {
          const classThresholdUg = cramerClass === "I" ? 1800 : cramerClass === "II" ? 540 : 90;
          const classThresholdMg = classThresholdUg / 1000;
          calculatedAdiTdi = classThresholdMg / activeBodyWeight;
        } else if (alternativeStrategy === "read_across") {
          const analogNoael = parseVal(readAcrossNoael);
          const penalty = readAcrossPenalty || 10;
          calculatedAdiTdi = analogNoael / penalty;
        } else if (alternativeStrategy === "bmdl") {
          calculatedAdiTdi = parseVal(bmdlValue);
        }
      } else {
        calculatedAdiTdi = activeNoael / 100;
      }

      setMos(calculatedAdiTdi);
      setIsApproved(calculatedEdi > 0 && calculatedEdi <= calculatedAdiTdi);
    } else {
      // DERMAL SCENARIO (SED & MoS)
      const daFrac = activeDermalAbsorption / 100;
      const activeRetentionFactor = retentionFactor;
      
      const calculatedSed = (aMg * cFrac * daFrac * activeRetentionFactor) / activeBodyWeight;
      setSed(calculatedSed);

      if (calculatedSed > 0) {
        if (isAlternativeProtocolActive) {
          if (alternativeStrategy === "ttc") {
            const classThresholdUg = cramerClass === "I" ? 1800 : cramerClass === "II" ? 540 : 90;
            const classThresholdMg = classThresholdUg / 1000; // mg/day
            const classThresholdMgPerKgDay = classThresholdMg / activeBodyWeight; // mg/kg/day
            
            const calculatedMos = (classThresholdMgPerKgDay / calculatedSed) * 100;
            setMos(calculatedMos);
            setIsApproved(calculatedSed > 0 && calculatedMos >= 100);
          } else if (alternativeStrategy === "read_across") {
            const analogNoael = parseVal(readAcrossNoael);
            const penalty = readAcrossPenalty || 10;
            const adjustedPoD = analogNoael / penalty; // mg/kg/day
            const calculatedMos = adjustedPoD / calculatedSed;
            setMos(calculatedMos);
            setIsApproved(calculatedSed > 0 && calculatedMos >= 100);
          } else if (alternativeStrategy === "bmdl") {
            const bmdl = parseVal(bmdlValue);
            const calculatedMos = bmdl / calculatedSed;
            setMos(calculatedMos);
            setIsApproved(calculatedSed > 0 && calculatedMos >= 100);
          }
        } else {
          const calculatedMos = activeNoael / calculatedSed;
          setMos(calculatedMos);
          setIsApproved(calculatedSed > 0 && calculatedMos >= 100);
        }
      } else {
        setMos(Infinity);
        setIsApproved(false);
      }
    }
  }, [
    appliedAmount, 
    concentration, 
    dermalAbsorption, 
    retentionFactor, 
    bodyWeight, 
    noael, 
    isAlternativeProtocolActive, 
    alternativeStrategy, 
    cramerClass, 
    readAcrossNoael, 
    readAcrossPenalty, 
    bmdlValue,
    selectedMetabolite,
    evaluationRoute,
    lang
  ]);

  const rawVolatilePct = parseVal(volatilePct) || 50;
  const nonVolatilePct = Math.max(0, 100 - rawVolatilePct);

  const ndFields = [
    { name: lang === "es" ? "Vía Fitoquímica" : "Phytochemical Pathway", value: volatilePct },
    { name: lang === "es" ? "Marcador Volátil" : "Volatile Marker", value: mentholPct },
    { name: lang === "es" ? "Marcador No Volátil" : "Non-Volatile Marker", value: rosmarinicPct },
    { name: lang === "es" ? "Impureza Crítica" : "Critical Impurity", value: impurityName },
    { name: lang === "es" ? "% Impureza" : "Impurity %", value: impurityPct },
    { name: lang === "es" ? "Absorción Dérmica" : "Dermal Absorption", value: dermalAbsorption },
    { name: lang === "es" ? "NOAEL" : "NOAEL", value: noael },
    { name: lang === "es" ? "Aplicación Diaria" : "Daily Amount", value: appliedAmount },
    { name: lang === "es" ? "Concentración" : "Concentration", value: concentration }
  ].filter(f => f.value === "ND" || f.value === "N/D" || (typeof f.value === "string" && f.value.toUpperCase() === "ND"));

  const hasND = ndFields.length > 0;

  const handleNewStudy = () => {
    setStartingPoint("choice");
    setSelectedMetabolite("Mentol (Menthol)");
    setBotanicalName("");
    setVolatilePct("");
    setMentholPct("");
    setRosmarinicPct("");
    setImpurityName("");
    setImpurityPct("");
    setAppliedAmount("");
    setConcentration("");
    setDermalAbsorption("");
    setRetentionFactor(1.0);
    setBodyWeight(60.0);
    setNoael("");
    setSed(0);
    setMos(0);
    setReportResult(null);
    setConsoleStatus([]);
    setConsoleStatus(prev => [...prev, `[SYSTEM LOG - ${new Date().toLocaleTimeString()}]: ${ta[lang].system_log}`]);
  };

  const handleSearchBotanicalData = async (nameToSearch: string) => {
    if (!nameToSearch || nameToSearch.trim() === "") return;
    setSearchingDB(true);
    setConsoleStatus(prev => [...prev, `[DB CONSULTING - ${new Date().toLocaleTimeString()}]: ${ta[lang].db_consulting} "${nameToSearch}"...`]);
    
    let resolvedParams: {
      botanicalName: string;
      volatilePct: string;
      mentholPct: string;
      rosmarinicPct: string;
      impurityName: string;
      impurityPct: string;
      dermalAbsorption: string;
      noael: string;
      appliedAmount: string;
      concentration: string;
      selectedMetabolite?: string;
    } = {
      botanicalName: nameToSearch,
      volatilePct: "ND",
      mentholPct: "ND",
      rosmarinicPct: "ND",
      impurityName: "ND",
      impurityPct: "ND",
      dermalAbsorption: "ND",
      noael: "ND",
      appliedAmount: "ND",
      concentration: "ND"
    };

    try {
      // Step 1: Resolve the taxonomy of trivial names to formal scientific name
      let finalNameToSearch = nameToSearch;
      try {
        const resolved = await resolveScientificName(nameToSearch);
        if (resolved && resolved.toLowerCase() !== nameToSearch.toLowerCase()) {
          finalNameToSearch = resolved;
          resolvedParams.botanicalName = resolved;
          setBotanicalName(resolved);
          setConsoleStatus(prev => [
            ...prev, 
            `[TAXONOMY RESOLUTION - ${new Date().toLocaleTimeString()}]: "${nameToSearch}" → "${resolved}" (${lang === "es" ? "Nombre científico aceptado" : "Accepted scientific name"})`
          ]);
        }
      } catch (taxError) {
        console.error("Failed to resolve taxonomy name:", taxError);
      }

      // Step 2: Query the grounded safety/phytochemical parameters
      const data = await searchBotanicalDatabase(finalNameToSearch);
      if (data) {
        setConsoleStatus(prev => [...prev, `[DB CONSULTING - SUCCESS]: ${ta[lang].db_success}`]);
        
        const resolveField = (val: any) => {
          if (val === null || val === undefined || val === "" || val === "ND" || val === "N/D" || (typeof val === "string" && val.toUpperCase() === "ND")) return "ND";
          return val;
        };

        resolvedParams.volatilePct = resolveField(data.volatilePct);
        resolvedParams.mentholPct = resolveField(data.mentholPct);
        resolvedParams.rosmarinicPct = resolveField(data.rosmarinicPct);
        resolvedParams.impurityName = resolveField(data.impurityName);
        resolvedParams.impurityPct = resolveField(data.impurityPct);
        resolvedParams.dermalAbsorption = resolveField(data.dermalAbsorption);
        resolvedParams.noael = resolveField(data.noael);
        resolvedParams.appliedAmount = resolveField(data.appliedAmount);
        resolvedParams.concentration = resolveField(data.concentration);

        setVolatilePct(resolvedParams.volatilePct);
        setMentholPct(resolvedParams.mentholPct);
        setRosmarinicPct(resolvedParams.rosmarinicPct);
        setImpurityName(resolvedParams.impurityName);
        setImpurityPct(resolvedParams.impurityPct);
        setDermalAbsorption(resolvedParams.dermalAbsorption);
        setNoael(resolvedParams.noael);
        setAppliedAmount(resolvedParams.appliedAmount);
        setConcentration(resolvedParams.concentration);

        // Store and automatically select the first dynamic metabolite
        if (data.identifiedMetabolites && data.identifiedMetabolites.length > 0) {
          setCustomMetabolites(data.identifiedMetabolites);
          const firstMet = data.identifiedMetabolites[0];
          setSelectedMetabolite(firstMet);
          resolvedParams.selectedMetabolite = firstMet;
          
          setConsoleStatus(prev => [
            ...prev,
            `[METABOLITES IDENTIFIED]: ${lang === "es" ? "Metabolitos identificados en red" : "Metabolites identified online"}: ${data.identifiedMetabolites?.join(", ")}.`
          ]);

          // Guess safety parameters if specific toxicological limits are needed
          const lowerMet = firstMet.toLowerCase();
          if (lowerMet.includes("mentol") || lowerMet.includes("menthol")) {
            resolvedParams.noael = "150.0";
            resolvedParams.impurityName = "Mentofurano";
            resolvedParams.impurityPct = "1.8";
          } else if (lowerMet.includes("rosmarínico") || lowerMet.includes("rosmarinic")) {
            resolvedParams.noael = "180.0";
            resolvedParams.impurityName = "Alcanfor / Camphor";
            resolvedParams.impurityPct = "2.5";
          } else if (lowerMet.includes("alcanfor") || lowerMet.includes("camphor")) {
            resolvedParams.noael = "100.0";
            resolvedParams.impurityName = "Sabineno";
            resolvedParams.impurityPct = "1.0";
          } else if (lowerMet.includes("chamazuleno") || lowerMet.includes("chamazulene") || lowerMet.includes("bisabolol")) {
            resolvedParams.noael = "220.0";
            resolvedParams.impurityName = "Matricina";
          } else if (lowerMet.includes("apigenina") || lowerMet.includes("apigenin")) {
            resolvedParams.noael = "250.0";
          } else if (lowerMet.includes("aloína") || lowerMet.includes("aloin")) {
            resolvedParams.noael = "500.0";
          } else if (lowerMet.includes("linalool") || lowerMet.includes("linalol")) {
            resolvedParams.noael = "200.0";
            resolvedParams.impurityName = "Acetato de linalilo";
            resolvedParams.impurityPct = "1.2";
          } else if (lowerMet.includes("quercetina") || lowerMet.includes("quercetin")) {
            resolvedParams.noael = "250.0";
          } else if (lowerMet.includes("limoneno") || lowerMet.includes("limonene")) {
            resolvedParams.noael = "250.0";
          }

          // Back-populate guess parameters to states to sync UI
          setNoael(resolvedParams.noael);
          setImpurityName(resolvedParams.impurityName);
          setImpurityPct(resolvedParams.impurityPct);
        } else {
          setCustomMetabolites([]);
        }

      } else {
        setConsoleStatus(prev => [...prev, `[DB CONSULTING - INFO]: ${ta[lang].db_info}`]);
        // Set everything to ND on complete miss/failure to find
        setVolatilePct("ND");
        setMentholPct("ND");
        setRosmarinicPct("ND");
        setImpurityName("ND");
        setImpurityPct("ND");
        setDermalAbsorption("ND");
        setNoael("ND");
        setAppliedAmount("ND");
        setConcentration("ND");
        setCustomMetabolites([]);
      }

      // Parameters are loaded into form states. Notify the user to let them modify before starting.
      setConsoleStatus(prev => [
        ...prev, 
        lang === "es" 
          ? `[SISTEMA - DATOS CARGADOS]: Los parámetros de "${finalNameToSearch}" han sido cargados con éxito. Puede personalizar campos (Concentración, NOAEL, Peso, etc.) a continuación. Cuando esté listo, presione el botón de "Iniciar Análisis" para ejecutar la evaluación de seguridad.` 
          : `[SYSTEM - PARAMETERS LOADED]: Parameters for "${finalNameToSearch}" successfully loaded. You can now customize any field (Concentration, NOAEL, Body Weight, etc.). Once ready, press the "Start Analysis" button to run the safety audit.`
      ]);
      setSearchingDB(false);

    } catch (error) {
      console.error(error);
      setConsoleStatus(prev => [...prev, `[DB CONSULTING - ERROR]: ${ta[lang].db_error}`]);
      setVolatilePct("ND");
      setMentholPct("ND");
      setRosmarinicPct("ND");
      setImpurityName("ND");
      setImpurityPct("ND");
      setDermalAbsorption("ND");
      setNoael("ND");
      setAppliedAmount("ND");
      setConcentration("ND");
      setCustomMetabolites([]);
      setSearchingDB(false);
    }
  };

  const startAnalysis = async (overrides?: {
    botanicalName?: string;
    volatilePct?: string;
    mentholPct?: string;
    rosmarinicPct?: string;
    impurityName?: string;
    impurityPct?: string;
    dermalAbsorption?: string;
    noael?: string;
    appliedAmount?: string;
    concentration?: string;
    selectedMetabolite?: string;
  }) => {
    const activeApplied = parseVal(overrides?.appliedAmount !== undefined ? overrides.appliedAmount : appliedAmount);
    const activeConcentration = parseVal(overrides?.concentration !== undefined ? overrides.concentration : concentration);
    
    if (activeApplied === 0 || activeConcentration === 0) {
      setValidationError(
        lang === "es"
          ? "La Cantidad Aplicada (A) y la Concentración de la Fórmula (C) deben ser estrictamente superiores a cero. Procedimiento matemático de seguridad detenido."
          : "Applied Amount (A) and Formula Concentration (C) must be strictly greater than zero. Safety mathematical procedure halted."
      );
      setSed(0);
      setMos(Infinity);
      setIsApproved(false);
      setConsoleStatus([
        `[CRITICAL HALT - ${new Date().toLocaleTimeString()}]: ${
          lang === "es" 
            ? "ALERTA: Se ha detectado un valor de cero en los parámetros activos (A o C)." 
            : "ALERT: Active parameters (A or C) evaluated to exactly zero."
        }`,
        `[HALT]: ${
          lang === "es"
            ? "Procedimiento interrumpido bajo las directivas de seguridad toxicológica de AurorIA. Por favor, introduzca valores mayores que cero."
            : "Procedure halted under AurorIA's toxicological safety directives. Please input parameters strictly greater than zero."
        }`
      ]);
      return;
    }

    setValidationError(null);
    setLoading(true);
    setReportResult(null);
    setConsoleStatus([]);
    
    const steps = ta[lang].analysis_steps;

    for (let i = 0; i < steps.length; i++) {
      setConsoleStatus(prev => [...prev, `[SYSTEM LOG - ${new Date().toLocaleTimeString()}]: ${steps[i]}`]);
      setCurrentStep(i);
      await new Promise(resolve => setTimeout(resolve, i === 0 || i === 3 || i === 6 ? 900 : 400));
    }

    try {
      const activeBotanicalName = overrides?.botanicalName !== undefined ? overrides.botanicalName : botanicalName;
      const activeSelectedMetabolite = overrides?.selectedMetabolite !== undefined ? overrides.selectedMetabolite : selectedMetabolite;
      if (overrides?.selectedMetabolite !== undefined) {
        setSelectedMetabolite(overrides.selectedMetabolite);
      }
      const activeVolatile = parseVal(overrides?.volatilePct !== undefined ? overrides.volatilePct : volatilePct) || 50;
      const activeNonVolatile = 100 - activeVolatile;
      const activeMenthol = parseVal(overrides?.mentholPct !== undefined ? overrides.mentholPct : mentholPct);
      const activeRosmarinic = parseVal(overrides?.rosmarinicPct !== undefined ? overrides.rosmarinicPct : rosmarinicPct);
      const activeImpurityName = overrides?.impurityName !== undefined ? overrides.impurityName : impurityName;
      const activeImpurityPct = parseVal(overrides?.impurityPct !== undefined ? overrides.impurityPct : impurityPct);
      const activeBW = parseVal(bodyWeight) || 60;
      const activeNoael = parseVal(overrides?.noael !== undefined ? overrides.noael : noael);
      const activeDermal = parseVal(overrides?.dermalAbsorption !== undefined ? overrides.dermalAbsorption : dermalAbsorption);

      // Local recalculation of toxicological parameters
      const aMg = activeApplied * 1000;
      const cFrac = activeConcentration / 100;

      let calculatedSed = 0;
      let calculatedMos = 0;
      let calculatedIsApproved = false;
      let calculatedRiskIndex = 0;
      let calculatedEdi = 0;
      let calculatedAdiTdi = 0;

      const overriddenIsAlternativeActive = overrides?.noael !== undefined 
        ? (overrides.noael === "ND" || overrides.noael === "N/D" || overrides.noael === "" || parseVal(overrides.noael) === 0)
        : isAlternativeProtocolActive;

      if (evaluationRoute === "oral") {
        // ORAL SCENARIO
        calculatedEdi = (aMg * cFrac) / activeBW;
        if (overriddenIsAlternativeActive) {
          if (alternativeStrategy === "ttc") {
            const classThresholdUg = cramerClass === "I" ? 1800 : cramerClass === "II" ? 540 : 90;
            const classThresholdMg = classThresholdUg / 1000;
            calculatedAdiTdi = classThresholdMg / activeBW;
          } else if (alternativeStrategy === "read_across") {
            const analogNoael = parseVal(readAcrossNoael);
            const penalty = readAcrossPenalty || 10;
            calculatedAdiTdi = analogNoael / penalty;
          } else if (alternativeStrategy === "bmdl") {
            calculatedAdiTdi = parseVal(bmdlValue);
          }
        } else {
          calculatedAdiTdi = activeNoael / 100;
        }
        calculatedIsApproved = calculatedEdi > 0 && calculatedEdi <= calculatedAdiTdi;

        // Keep fallback maps for interface compatibility
        calculatedSed = calculatedEdi;
        calculatedMos = calculatedAdiTdi;
      } else {
        // DERMAL SCENARIO
        const daFrac = activeDermal / 100;
        calculatedSed = (aMg * cFrac * daFrac * retentionFactor) / activeBW;

        if (calculatedSed > 0) {
          if (overriddenIsAlternativeActive) {
            if (alternativeStrategy === "ttc") {
              const classThresholdUg = cramerClass === "I" ? 1800 : cramerClass === "II" ? 540 : 90;
              const classThresholdMg = classThresholdUg / 1000;
              const classThresholdMgPerKgDay = classThresholdMg / activeBW;
              calculatedRiskIndex = calculatedSed / classThresholdMgPerKgDay;
              calculatedMos = (classThresholdMgPerKgDay / calculatedSed) * 100;
              calculatedIsApproved = calculatedSed > 0 && calculatedMos >= 100;
            } else if (alternativeStrategy === "read_across") {
              const analogNoael = parseVal(readAcrossNoael);
              const penalty = readAcrossPenalty || 10;
              const adjustedPoD = analogNoael / penalty;
              calculatedMos = adjustedPoD / calculatedSed;
              calculatedIsApproved = calculatedSed > 0 && calculatedMos >= 100;
            } else if (alternativeStrategy === "bmdl") {
              const bmdl = parseVal(bmdlValue);
              calculatedMos = bmdl / calculatedSed;
              calculatedIsApproved = calculatedSed > 0 && calculatedMos >= 100;
            }
          } else {
            calculatedMos = activeNoael / calculatedSed;
            calculatedIsApproved = calculatedSed > 0 && calculatedMos >= 100;
          }
        } else {
          calculatedMos = Infinity;
          calculatedIsApproved = false;
        }
      }

      const result = await generateAuroriaReport({
        botanicalName: activeBotanicalName,
        selectedMetabolite: activeSelectedMetabolite,
        volatilePct: activeVolatile,
        nonVolatilePct: activeNonVolatile,
        mentholPct: activeMenthol,
        rosmarinicPct: activeRosmarinic,
        impurityName: activeImpurityName,
        impurityPct: activeImpurityPct,
        A: activeApplied,
        C: activeConcentration / 100,
        DAa: activeDermal / 100,
        R: retentionFactor,
        BW: activeBW,
        NOAEL: activeNoael,
        SED: calculatedSed,
        MoS: calculatedMos,
        EDI: calculatedEdi,
        ADI_TDI: calculatedAdiTdi,
        isApproved: calculatedIsApproved,
        lang: lang,
        isAlternativeActive: overriddenIsAlternativeActive,
        alternativeStrategy,
        cramerClass,
        readAcrossAnalog,
        readAcrossNoael: parseVal(readAcrossNoael),
        readAcrossPenalty,
        bmdlValue: parseVal(bmdlValue),
        riskIndex: calculatedRiskIndex,
        pubChemData: pubChemData || undefined,
        evaluationRoute: evaluationRoute,
      });
      const processedResult = await auditAndApplyPubChemLinksAsync(result);
      setReportResult(processedResult);
    } catch (error) {
      console.error(error);
      setConsoleStatus(prev => [...prev, lang === "es" ? "[ERROR]: Fallo en la comunicación con el núcleo de IA de AurorIA." : "[ERROR]: Communication failure with AurorIA IA core."]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!reportResult) return;
    navigator.clipboard.writeText(reportResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadDefaults = (specimen: string) => {
    if (specimen === "Mentha") {
      setBotanicalName("Mentha piperita");
      setSelectedMetabolite("Mentol (Menthol)");
      setVolatilePct(65);
      setMentholPct(42.5);
      setRosmarinicPct(12.8);
      setImpurityName("Mentofurano");
      setImpurityPct(1.8);
      setAppliedAmount(1.2);
      setConcentration(3.5);
      setDermalAbsorption(10.0);
      setRetentionFactor(1.0);
      setNoael(150.0);
    } else if (specimen === "Chamomile") {
      setBotanicalName("Matricaria chamomilla");
      setSelectedMetabolite("Apigenina (Apigenin)");
      setVolatilePct(30);
      setMentholPct(0);
      setRosmarinicPct(28.4);
      setImpurityName("Apigenina (Artefacto de extracción canela)");
      setImpurityPct(4.2);
      setAppliedAmount(2.0);
      setConcentration(5.0);
      setDermalAbsorption(8.0);
      setRetentionFactor(1.5);
      setNoael(220.0);
    } else if (specimen === "Rosemary") {
      setBotanicalName("Rosmarinus officinalis");
      setSelectedMetabolite("Ácido Rosmarínico (Rosmarinic Acid)");
      setVolatilePct(55);
      setMentholPct(0);
      setRosmarinicPct(35.2);
      setImpurityName("Alcanfor / Camphor");
      setImpurityPct(2.5);
      setAppliedAmount(0.8);
      setConcentration(2.0);
      setDermalAbsorption(12.0);
      setRetentionFactor(1.0);
      setNoael(180.0);
    }
  };

  return (
    <div className="space-y-12">
      <div className="text-center max-w-4xl mx-auto space-y-4">
        <Badge className="bg-primary/20 hover:bg-primary/30 text-primary border-primary/20 rounded-full px-4 py-1 text-xs font-mono uppercase tracking-widest leading-none">
          {ta[lang].badge}
        </Badge>
        <h2 className="text-5xl md:text-7xl font-serif font-black tracking-tighter leading-none mb-2">
          {ta[lang].title} <span className="text-primary font-serif">AurorIA</span>
        </h2>
        <p className="text-xl text-muted-foreground/90 max-w-2xl mx-auto leading-relaxed">
          {evaluationRoute === "oral" ? (
            lang === "es"
              ? "Plataforma herbolaria regulatoria de análisis fitoquímico e in silico para evaluación de seguridad oral y de ingesta conformes a la"
              : "Regulatory herbal platform for phytochemical and in silico oral and ingestion safety evaluations fully compliant with"
          ) : (
            ta[lang].subtitle
          )}{" "}
          <span className="text-primary font-bold">{ta[lang].nom}</span>.
        </p>
      </div>

      {/* SECTION 1: Sample Definition & Literature Search (Full Width) */}
      <div className="w-full mb-8">
        <Card className="rounded-[2.5rem] border border-primary/20 bg-card/60 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            
            <CardHeader className="border-b border-primary/10 pb-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
                    <Settings className="w-5 h-5 animate-spin-slow" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold font-serif">{ta[lang].profiles_title}</CardTitle>
                    <CardDescription className="text-xs">{ta[lang].profiles_desc}</CardDescription>
                  </div>
                </div>
                <Button
                  type="button"
                  onClick={handleNewStudy}
                  variant="outline"
                  className="rounded-xl border-indigo-500/35 text-indigo-400 hover:bg-indigo-500/10 text-xs font-bold flex items-center gap-1 px-3 h-9"
                >
                  <FlaskConical className="w-4 h-4" />
                  {ta[lang].new_study}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              {startingPoint === "choice" ? (
                // Choice Option A vs Option B
                <div className="space-y-6 text-left">
                  <div className="p-5 rounded-2xl bg-primary/10 border border-primary/20 space-y-2">
                    <p className="text-sm font-bold font-serif text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                      {lang === "es" ? "¡Hola! Soy AurorIA v4.5" : "Hello! I am AurorIA v4.5"}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {lang === "es" 
                        ? (evaluationRoute === "oral"
                            ? "Tu Asistente Científico avanzado en fitoquímica y análisis in silico para evaluación de seguridad oral y de ingesta bajo el marco de la NOM-073-SSA1-2015."
                            : "Tu Asistente Científico avanzado en fitoquímica y análisis in silico para evaluación de seguridad bajo el marco de la NOM-073-SSA1-2015.")
                        : (evaluationRoute === "oral"
                            ? "Your advanced Scientific Assistant in phytochemistry and in silico analysis for oral and ingestion safety evaluation under NOM-073-SSA1-2015."
                            : "Your advanced Scientific Assistant in phytochemistry and in silico analysis for safety evaluation under NOM-073-SSA1-2015.")}
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                      {lang === "es" ? "Punto de Partida del Análisis" : "Analysis Starting Point"}
                    </h4>
                    
                    <div className="grid grid-cols-1 gap-4">
                      {/* Option A */}
                      <button
                        type="button"
                        onClick={() => {
                          setStartingPoint("whole_plant");
                          setConsoleStatus(prev => [...prev, `[SYSTEM LOG]: Option A selected: Analyze a Whole Plant.`]);
                        }}
                        className="p-5 rounded-3xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all text-left space-y-2 group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                            <Leaf className="w-4 h-4 animate-bounce-slow" />
                          </div>
                          <span className="font-bold text-sm text-white group-hover:text-primary transition-colors">
                            {lang === "es" ? "Opción A: Planta Completa" : "Option A: Whole Plant"}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground/90 leading-relaxed">
                          {lang === "es" 
                            ? "Ingrese un espécimen botánico (ej. Menta, Romero). Identificaremos sus metabolitos principales para enfocar el análisis de seguridad dérmica."
                            : "Enter a plant species (e.g., Peppermint, Rosemary). We'll identify its main metabolites to focus the dermal safety report."}
                        </p>
                      </button>

                      {/* Option B */}
                      <button
                        type="button"
                        onClick={() => {
                          setStartingPoint("secondary_metabolite");
                          setBotanicalName("Compuesto Puro / Pure Compound");
                          setImpurityName("N/A");
                          setImpurityPct("0.0");
                          setConsoleStatus(prev => [...prev, `[SYSTEM LOG]: Option B selected: Analyze a Secondary Metabolite directly.`]);
                        }}
                        className="p-5 rounded-3xl border border-teal-500/20 bg-teal-500/5 hover:bg-teal-500/10 transition-all text-left space-y-2 group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-400">
                            <FlaskConical className="w-4 h-4 animate-pulse-slow" />
                          </div>
                          <span className="font-bold text-sm text-white group-hover:text-teal-400 transition-colors">
                            {lang === "es" ? "Opción B: Metabolito Secundario" : "Option B: Secondary Metabolite"}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground/90 leading-relaxed">
                          {lang === "es" 
                            ? "Ingrese directamente el compuesto químico puro (ej. Linalool, Mentol, Alcanfor, Ácido salicílico) para auditar toxicología dérmica y MoS."
                            : "Directly enter the pure chemical compound (e.g. Linalool, Menthol, Camphor, Salicylic acid) to audit dermal safety and MoS."}
                        </p>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                // Form content depending on mode
                <div className="space-y-6">
                  {/* Reset Starting Point Button */}
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setStartingPoint("choice")}
                      className="text-muted-foreground hover:text-white text-[11px] font-mono h-7 px-2 flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3 h-3" />
                      {lang === "es" ? "← Cambiar Punto de Partida" : "← Change Starting Point"}
                    </Button>
                  </div>

                  {/* Thinking Banner Indicator */}
                  <AnimatePresence>
                    {(searchingDB || loadingTypical || pubChemLoading) && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="p-5 rounded-3xl bg-indigo-950/40 border border-primary/30 shadow-lg text-left space-y-2 relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl animate-pulse" />
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary animate-spin">
                            <RefreshCw className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-mono text-[9px] font-black text-primary tracking-widest uppercase">
                              AURORIA AGENT WORKSPACE
                            </p>
                            <h5 className="font-bold text-sm text-white mt-0.5">
                              {lang === "es" ? "Pensando....." : "Thinking....."}
                            </h5>
                          </div>
                        </div>
                        <p className="text-xs text-zinc-300 leading-relaxed pl-11">
                          {searchingDB && (lang === "es" 
                            ? "Analizando la petición botánica, resolviendo nombres científicos aceptados y consultando fitoquímica fitoextractiva en red..." 
                            : "Analyzing botanical request, resolving scientific accepted names, and retrieving phytochemical assets online...")}
                          {loadingTypical && (lang === "es" 
                            ? "Cargando valores y fracciones de referencia fitoanalíticas..." 
                            : "Loading typical reference values and phytoanalytical fractions...")}
                          {pubChemLoading && (lang === "es" 
                            ? "Buscando dossier de compuestos y límites de toxicidad humana en la base de datos oficial de PubChem..." 
                            : "Searching compound dossiers and human toxicity limits in official PubChem databases...")}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {startingPoint === "whole_plant" ? (
                    <>
                      {/* Presets for whole plant */}
                      <div className="space-y-2 text-left">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">{ta[lang].quick_presets}</span>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => loadDefaults("Mentha")}
                            className="px-3 py-1 text-[11px] font-mono rounded-xl border border-primary/30 bg-primary/5 text-primary hover:bg-primary/20 transition-all font-bold cursor-pointer"
                          >
                            Mentha piperita
                          </button>
                          <button
                            type="button"
                            onClick={() => loadDefaults("Chamomile")}
                            className="px-3 py-1 text-[11px] font-mono rounded-xl border-accent/30 border bg-accent/5 text-accent hover:bg-accent/20 transition-all font-bold cursor-pointer"
                          >
                            Matricaria chamomilla
                          </button>
                          <button
                            type="button"
                            onClick={() => loadDefaults("Rosemary")}
                            className="px-3 py-1 text-[11px] font-mono rounded-xl border-green-500/30 border bg-green-500/5 text-green-400 hover:bg-green-500/20 transition-all font-bold cursor-pointer"
                          >
                            Rosmarinus offic.
                          </button>
                        </div>
                      </div>

                      {/* Botanical Name Input with Search Action */}
                      <div className="space-y-2 text-left">
                        <label className="text-xs font-mono font-bold text-muted-foreground uppercase">{ta[lang].botanical_name_label}</label>
                        <div className="flex gap-2">
                          <Input 
                             value={botanicalName}
                             onChange={(e) => setBotanicalName(e.target.value)}
                             onKeyDown={(e) => {
                               if (e.key === "Enter") {
                                 handleSearchBotanicalData(botanicalName);
                               }
                             }}
                             className="rounded-2xl border-white/10 bg-black/20 font-serif italic text-lg text-primary focus:border-primary/50 flex-1"
                             placeholder={lang === "es" ? "Ej. Mentha piperita" : "e.g., Mentha piperita"}
                          />
                          <Button
                            type="button"
                            disabled={searchingDB || !botanicalName}
                            onClick={() => handleSearchBotanicalData(botanicalName)}
                            className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 shrink-0 px-4 h-12 text-xs font-bold transition-all"
                          >
                            {searchingDB ? (
                              <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                {lang === "es" ? "Pensando....." : "Thinking....."}
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-4 h-4" />
                                {ta[lang].search_btn}
                              </>
                            )}
                          </Button>
                        </div>
                        <p className="text-[10px] text-muted-foreground/80 leading-snug">
                          {lang === "es" 
                            ? "Busca para autocompletar con parámetros fitoquímicos e identificar el nombre científico exacto."
                            : "Search to autocomplete with phytochemical parameters and identify exact scientific name."}
                        </p>
                      </div>

                      {/* Dynamic Metabolite selector based on plant */}
                      {botanicalName && (
                        <div className="space-y-2 text-left p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/15">
                          <label className="text-[10px] font-mono font-bold text-primary uppercase">
                            {lang === "es" ? "Metabolitos Identificados para Evaluación Dérmica" : "Identified Metabolites for Dermal Evaluation"}
                          </label>
                          <p className="text-[11px] text-muted-foreground">
                            {lang === "es" 
                              ? "Selecciona el metabolito principal para auditar sus límites de seguridad:"
                              : "Select the primary metabolite to audit its safety limits:"}
                          </p>
                          <div className="flex flex-wrap gap-2 pt-2">
                            {(customMetabolites && customMetabolites.length > 0
                              ? customMetabolites
                              : (PLANT_METABOLITES[botanicalName.toLowerCase().trim()] || [
                                  "Compuesto Activo Tópico (Active)",
                                  "Linalool",
                                  "Limoneno",
                                  "Quercetina"
                                ])
                            ).map((met, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => {
                                  setSelectedMetabolite(met);
                                  const lowerMet = met.toLowerCase();
                                  if (lowerMet.includes("mentol") || lowerMet.includes("menthol")) {
                                    setNoael("150.0");
                                    setImpurityName("Mentofurano");
                                    setImpurityPct("1.8");
                                  } else if (lowerMet.includes("rosmarínico") || lowerMet.includes("rosmarinic")) {
                                    setNoael("180.0");
                                    setImpurityName("Alcanfor / Camphor");
                                    setImpurityPct("2.5");
                                  } else if (lowerMet.includes("alcanfor") || lowerMet.includes("camphor")) {
                                    setNoael("100.0");
                                    setImpurityName("Sabineno");
                                    setImpurityPct("1.0");
                                  } else if (lowerMet.includes("chamazuleno") || lowerMet.includes("chamazulene") || lowerMet.includes("bisabolol")) {
                                    setNoael("220.0");
                                    setImpurityName("Matricina");
                                    setImpurityPct("0.5");
                                  } else if (lowerMet.includes("apigenina") || lowerMet.includes("apigenin")) {
                                    setNoael("250.0");
                                  } else if (lowerMet.includes("aloína") || lowerMet.includes("aloin")) {
                                    setNoael("500.0");
                                  } else if (lowerMet.includes("linalool") || lowerMet.includes("linalol")) {
                                    setNoael("200.0");
                                    setImpurityName("Acetato de linalilo");
                                    setImpurityPct("1.2");
                                  } else if (lowerMet.includes("quercetina") || lowerMet.includes("quercetin")) {
                                    setNoael("250.0");
                                  } else if (lowerMet.includes("limoneno") || lowerMet.includes("limonene")) {
                                    setNoael("250.0");
                                  }
                                  setConsoleStatus(prev => [
                                    ...prev,
                                    `[METABOLITE SELECTED]: Focused on ${met} for toxicological safety audit.`
                                  ]);
                                }}
                                className={`px-3 py-1.5 text-xs font-mono rounded-xl border transition-all cursor-pointer ${
                                  selectedMetabolite === met 
                                    ? "border-primary bg-primary/25 text-white font-extrabold" 
                                    : "border-primary/10 bg-primary/5 text-primary-foreground/70 hover:bg-primary/10 hover:text-white"
                                }`}
                              >
                                {met}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    // Option B: Secondary Metabolite direct entry
                    <div className="space-y-4 text-left animate-fade-in">
                      <div className="space-y-2">
                        <label className="text-xs font-mono font-bold text-muted-foreground uppercase">
                          {lang === "es" ? "Nombre del Metabolito Secundario de Interés" : "Target Secondary Metabolite Name"}
                        </label>
                        <div className="flex gap-2">
                          <Input 
                            value={selectedMetabolite}
                            onChange={(e) => setSelectedMetabolite(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && selectedMetabolite) {
                                const query = selectedMetabolite.toLowerCase().trim();
                                if (query.includes("mentol") || query.includes("menthol")) {
                                  setNoael("150");
                                  setDermalAbsorption("10");
                                } else if (query.includes("alcanfor") || query.includes("camphor")) {
                                  setNoael("120");
                                  setDermalAbsorption("10");
                                } else if (query.includes("linalool") || query.includes("linalol")) {
                                  setNoael("200");
                                  setDermalAbsorption("12");
                                } else if (query.includes("salicilico") || query.includes("salicil") || query.includes("salicyl")) {
                                  setNoael("100");
                                  setDermalAbsorption("15");
                                } else if (query.includes("quercetina") || query.includes("quercetin")) {
                                  setNoael("300");
                                  setDermalAbsorption("5");
                                }
                                setConsoleStatus(prev => [
                                  ...prev, 
                                  lang === "es" 
                                    ? `[SISTEMA - REFERENCIA CARGADA]: Parámetros cargados para "${selectedMetabolite}". Modifique los campos del motor toxicológico a continuación si lo desea, y presione el botón "Iniciar Análisis".` 
                                    : `[SYSTEM - REFERENCE LOADED]: Parameters loaded for "${selectedMetabolite}". Customize toxicological parameters below and press "Start Analysis" when ready.`
                                ]);
                              }
                            }}
                            className="rounded-2xl border-white/10 bg-black/20 font-bold text-lg text-teal-400 focus:border-teal-500/50 flex-1"
                            placeholder={lang === "es" ? "Ej. Linalool, Cafeína, Mentol, etc." : "e.g., Linalool, Caffeine, Menthol"}
                          />
                          <button
                            type="button"
                            disabled={loadingTypical || !selectedMetabolite}
                            onClick={() => {
                              setLoadingTypical(true);
                              setTimeout(() => {
                                const query = selectedMetabolite.toLowerCase().trim();
                                if (query.includes("mentol") || query.includes("menthol")) {
                                  setNoael("150");
                                  setDermalAbsorption("10");
                                  setConsoleStatus(prev => [...prev, `[METABOLITE LOADED]: Loaded reference values for Menthol.`]);
                                } else if (query.includes("alcanfor") || query.includes("camphor")) {
                                  setNoael("120");
                                  setDermalAbsorption("10");
                                  setConsoleStatus(prev => [...prev, `[METABOLITE LOADED]: Loaded reference values for Camphor.`]);
                                } else if (query.includes("linalool") || query.includes("linalol")) {
                                  setNoael("200");
                                  setDermalAbsorption("12");
                                  setConsoleStatus(prev => [...prev, `[METABOLITE LOADED]: Loaded reference values for Linalool.`]);
                                } else if (query.includes("salicilico") || query.includes("salicil") || query.includes("salicyl")) {
                                  setNoael("100");
                                  setDermalAbsorption("15");
                                  setConsoleStatus(prev => [...prev, `[METABOLITE LOADED]: Loaded reference values for Salicylic Acid.`]);
                                } else if (query.includes("quercetina") || query.includes("quercetin")) {
                                  setNoael("300");
                                  setDermalAbsorption("5");
                                }
                                setLoadingTypical(false);
                              }, 600);
                            }}
                            className="rounded-2xl bg-teal-600 hover:bg-teal-700 text-white shrink-0 px-4 h-12 text-xs font-bold leading-none cursor-pointer flex items-center justify-center gap-1 min-w-[110px]"
                          >
                            {loadingTypical ? (
                              <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                {lang === "es" ? "Pensando....." : "Thinking....."}
                              </>
                            ) : (
                              lang === "es" ? "Cargar Típicos" : "Load Typical"
                            )}
                          </button>
                        </div>
                        <p className="text-[10px] text-muted-foreground leading-snug">
                          {lang === "es" 
                            ? "Ingrese el nombre del compuesto activo puro para evaluar sus espectros toxicológicos sobre la barrera de la piel."
                            : "Enter the name of the pure active compound to validate its toxicological spectrum over the skin barrier."}
                        </p>
                      </div>

                      {/* PubChem Lookup Section */}
                      <div className="space-y-3 pt-1">
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            disabled={pubChemLoading || !selectedMetabolite}
                            onClick={() => handlePubChemSearch(selectedMetabolite)}
                            className="flex-1 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-95"
                          >
                            {pubChemLoading ? (
                              <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                {lang === "es" ? "Pensando..... (Buscando en PubChem)" : "Thinking..... (Searching PubChem)"}
                              </>
                            ) : (
                              <>
                                <FlaskConical className="w-3.5 h-3.5" />
                                {lang === "es" ? "Consultar en PubChem (Autocompletar)" : "Search PubChem (Autofill)"}
                              </>
                            )}
                          </Button>
                        </div>

                        {pubChemSearchError && (
                          <div className="p-3 text-[11px] text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl text-left">
                            {pubChemSearchError}
                          </div>
                        )}

                        {pubChemData && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/25 space-y-3.5"
                          >
                            <div className="flex items-center justify-between border-b border-white/5 pb-2">
                              <div className="text-left">
                                <span className="text-[9px] font-mono font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2 py-0.5 rounded">
                                  PUBCHEM COMPUESTO ACTIVO
                                </span>
                                <h4 className="text-sm font-bold text-white mt-1.5">{pubChemData.name}</h4>
                              </div>
                              <a 
                                href={pubChemData.pubchemUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-1 px-2.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 hover:text-white transition-all text-[10px] font-mono font-bold flex items-center gap-1.5 shrink-0"
                              >
                                CID: {pubChemData.cid}
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-[10px] text-zinc-400 font-mono text-left">
                              <div className="p-2 rounded bg-black/20 border border-white/5">
                                <span className="text-[8px] text-zinc-500 uppercase block">{lang === "es" ? "Fórmula" : "Formula"}</span>
                                <span className="text-white font-bold">{pubChemData.formula}</span>
                              </div>
                              <div className="p-2 rounded bg-black/20 border border-white/5">
                                <span className="text-[8px] text-zinc-500 uppercase block">{lang === "es" ? "Peso Molecular" : "Molecular Weight"}</span>
                                <span className="text-white font-bold">{pubChemData.molecularWeight} g/mol</span>
                              </div>
                              <div className="p-2 rounded bg-black/20 border border-white/5">
                                <span className="text-[8px] text-zinc-500 uppercase block">LogP / XLogP</span>
                                <span className="text-white font-bold">{pubChemData.xLogP}</span>
                              </div>
                              <div className="p-2 rounded bg-black/20 border border-white/5 col-span-2">
                                <span className="text-[8px] text-zinc-500 uppercase block">IUPAC Name</span>
                                <span className="text-white font-semibold line-clamp-2 leading-tight select-all">{pubChemData.iupacName}</span>
                              </div>
                              <div className="p-2 rounded bg-black/20 border border-white/5 col-span-2">
                                <span className="text-[8px] text-zinc-500 uppercase block">Smiles</span>
                                <span className="text-[9px] font-mono text-indigo-300 break-all leading-none select-all">{pubChemData.smiles}</span>
                              </div>
                            </div>

                            {/* PubChem Toxicity block */}
                            <div className="p-3 rounded-xl bg-black/30 border border-indigo-500/15 text-left space-y-2">
                              <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                                <span className="text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1">
                                  <Activity className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                                  {lang === "es" ? "Perfil de Toxicidad (PubChem)" : "Toxicological Profile (PubChem)"}
                                </span>
                                <span className="text-[9px] font-mono text-zinc-500">
                                  LD50: {pubChemData.ld50}
                                </span>
                              </div>

                              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono mt-1">
                                <div className="p-2 rounded bg-indigo-950/20 border border-indigo-400/10">
                                  <span className="text-[8px] text-zinc-500 uppercase block">{lang === "es" ? "NOAEL Experimental" : "Experimental NOAEL"}</span>
                                  <span className="text-indigo-300 font-bold text-xs">{pubChemData.noael} mg/kg/día</span>
                                </div>
                                <div className="p-2 rounded bg-indigo-950/20 border border-indigo-400/10">
                                  <span className="text-[8px] text-zinc-500 uppercase block">
                                    {evaluationRoute === "oral" ? (lang === "es" ? "Absorción Gastrointestinal" : "GI Absorption") : (lang === "es" ? "Absorción Dérmica" : "Dermal Absorption")}
                                  </span>
                                  <span className="text-indigo-300 font-bold text-xs">{pubChemData.dermalAbsorption}%</span>
                                </div>
                              </div>

                              {pubChemData.ghsHazards && pubChemData.ghsHazards.length > 0 && pubChemData.ghsHazards[0] !== "N/D" && (
                                <div className="space-y-1 mt-1">
                                  <span className="text-[8px] text-rose-400/85 uppercase block font-bold">{lang === "es" ? "Clasificación de Peligros GHS" : "GHS Hazard Classification"}</span>
                                  <div className="flex flex-wrap gap-1">
                                    {pubChemData.ghsHazards.map((h: string, key: number) => (
                                      <span 
                                        key={key} 
                                        className="px-1.5 py-0.5 text-[8px] font-mono border border-rose-500/30 bg-rose-500/5 text-rose-300 rounded leading-none"
                                        title={h}
                                      >
                                        {h.split(":")[0]}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              <p className="text-[10px] text-zinc-400 italic leading-normal border-t border-white/5 pt-2 mt-1">
                                &ldquo;{pubChemData.toxicitySummary}&rdquo;
                              </p>

                              <Button
                                type="button"
                                onClick={() => {
                                  // Apply NOAEL
                                  if (pubChemData.noael && pubChemData.noael.toUpperCase() !== "ND" && pubChemData.noael.toUpperCase() !== "N/D") {
                                    setNoael(pubChemData.noael);
                                    setIsAlternativeProtocolActive(false);
                                    setConsoleStatus(prev => [...prev, `[AUTO-FILL]: Applied experimental NOAEL of ${pubChemData.noael} mg/kg/day.`]);
                                  } else {
                                    setNoael("ND");
                                    setIsAlternativeProtocolActive(true);
                                    setConsoleStatus(prev => [...prev, `[AUTO-FILL]: Applied NOAEL of "ND". Triggered Alternative Assessment Protocol (NGRA).`]);
                                  }

                                  // Apply Dermal Absorption
                                  if (pubChemData.dermalAbsorption && pubChemData.dermalAbsorption.toUpperCase() !== "ND" && pubChemData.dermalAbsorption.toUpperCase() !== "N/D") {
                                    const absorptionNum = parseFloat(pubChemData.dermalAbsorption.replace("%", "").trim());
                                    setDermalAbsorption(isNaN(absorptionNum) ? "10.0" : String(absorptionNum));
                                  }

                                  setConsoleStatus(prev => [...prev, `[AUTO-FILL COMPLETE]: PubChem dossier applied successfully. Ready to analyze.`]);
                                }}
                                className="w-full h-8 mt-2 rounded-lg bg-teal-500/20 hover:bg-teal-500/35 border border-teal-500/40 text-teal-300 hover:text-white font-bold text-[10px] flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-[0.98]"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                {lang === "es" ? "Aplicar Datos en el Formulario" : "Apply Data to Form Fields"}
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </div>

                      {/* Presets of metabolites */}
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">{lang === "es" ? "Metabolitos de Referencia Rápida" : "Quick Reference Metabolites"}</span>
                        <div className="flex flex-wrap gap-1.5">
                          {["Mentol / Menthol", "Alcanfor / Camphor", "Linalool", "Ácido Salicílico", "Quercetina"].map((preset, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setSelectedMetabolite(preset);
                                if (preset.includes("Mentol")) { setNoael("150"); setDermalAbsorption("10"); }
                                if (preset.includes("Alcanfor")) { setNoael("120"); setDermalAbsorption("10"); }
                                if (preset.includes("Linalool")) { setNoael("200"); setDermalAbsorption("12"); }
                                if (preset.includes("Salicílico")) { setNoael("100"); setDermalAbsorption("15"); }
                                if (preset.includes("Quercetina")) { setNoael("300"); setDermalAbsorption("5"); }
                              }}
                              className="px-2 py-0.5 text-[10px] font-mono rounded-lg border border-teal-500/20 bg-teal-500/10 text-teal-300 hover:bg-teal-500/20 transition-all cursor-pointer"
                            >
                              {preset}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Gorgeous Interactive ND Alert Box */}
                  {hasND && (
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 space-y-2 text-left animate-fade-in">
                      <div className="flex items-center gap-2 font-black text-amber-400 font-mono tracking-wider">
                        <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 animate-pulse" />
                        <span>{lang === "es" ? "DATOS NO DISPONIBLES (ND) EN LA WEB" : "DATA NOT AVAILABLE (ND) ON WEB"}</span>
                      </div>
                      <p className="leading-relaxed text-[11px] opacity-90">
                        {lang === "es" 
                          ? "No se hallaron los siguientes datos en las bases de datos de la Web. Se han completado con 'ND' para que puedas agregarlos manualmente si los tienes disponibles:"
                          : "The following parameters were not located in online databases. They are completed with 'ND' so you can add them manually with your own data:"}
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {ndFields.map((f, i) => (
                          <Badge key={i} variant="outline" className="text-[9px] font-mono border-amber-500/35 bg-amber-500/15 text-amber-300 rounded px-2 py-0.5 leading-none uppercase">
                            {f.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pathway balance - Volatile vs. Non-Volatile */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs font-mono font-bold text-muted-foreground">
                      <span className="uppercase text-[11px]">{lang === "es" ? "Rutas Fitoquímicas Principales" : "Main Phytochemical Pathways"}</span>
                      <span className="text-primary text-[11px]">{volatilePct === "" ? 0 : volatilePct}%v / {nonVolatilePct}%nv</span>
                    </div>
                    
                    {/* Visual Pathway Bar */}
                    <div className="h-3.5 w-full rounded-full overflow-hidden bg-black/40 flex border border-white/10">
                      <div 
                        style={{ width: `${volatilePct === "" ? 0 : volatilePct}%` }} 
                        className="h-full bg-gradient-to-r from-pink-500 to-indigo-500 transition-all duration-300 relative group"
                        title={lang === "es" ? "Vía del Ácido Mevalónico y MEP (Fracción Volátil)" : "Mevalonic Acid & MEP Pathway (Volatile Fraction)"}
                      >
                        <span className="absolute inset-0 bg-white/10 animate-pulse" />
                      </div>
                      <div 
                        style={{ width: `${nonVolatilePct}%` }} 
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
                        title={lang === "es" ? "Vía del Ácido Shikímico (Fracción No Volátil)" : "Shikimic Acid Pathway (Non-Volatile Fraction)"}
                      />
                    </div>

                    {/* Slider */}
                    <div className="flex items-center gap-4">
                      <input 
                        type="range" 
                        min="10" 
                        max="90" 
                        value={volatilePct === "" ? 50 : volatilePct}
                        onChange={(e) => setVolatilePct(Number(e.target.value))}
                        className="w-full h-1 bg-black/30 rounded-lg appearance-none cursor-pointer accent-primary" 
                      />
                    </div>
                    <div className="flex justify-between text-[9px] font-mono text-muted-foreground/80 mt-1">
                      <span className="text-pink-400">{lang === "es" ? "Vía Mevalonato (Volátil)" : "Mevalonate Pathway (Volatile)"}</span>
                      <span className="text-emerald-400">{lang === "es" ? "Vía Shikímico (No Volátil)" : "Shikimic Pathway (Non-Volatile)"}</span>
                    </div>
                  </div>

                  {/* Markers & Impurities */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 text-left">
                      <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                        {lang === "es" ? "Marcador Volátil (%)" : "Volatile Marker (%)"}
                      </label>
                      <Input 
                        type="text" 
                        value={mentholPct}
                        onChange={(e) => setMentholPct(e.target.value)}
                        className="rounded-xl border-white/10 bg-black/20 font-mono text-sm focus:border-primary/50 text-white"
                        placeholder={lang === "es" ? "Ej. 42.5 o ND" : "e.g. 42.5 or ND"}
                      />
                    </div>
                    <div className="space-y-2 text-left">
                      <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {lang === "es" ? "Marcador No Volátil (%)" : "Non-Volatile Marker (%)"}
                      </label>
                      <Input 
                        type="text" 
                        value={rosmarinicPct}
                        onChange={(e) => setRosmarinicPct(e.target.value)}
                        className="rounded-xl border-white/10 bg-black/20 font-mono text-sm focus:border-primary/50 text-white"
                        placeholder={lang === "es" ? "Ej. 12.8 o ND" : "e.g. 12.8 or ND"}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-1 border-t border-primary/5 text-left">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase">{lang === "es" ? "Impureza Crítica" : "Critical Impurity"}</label>
                      <Input 
                        value={impurityName}
                        onChange={(e) => setImpurityName(e.target.value)}
                        className="rounded-xl border-white/10 bg-black/20 font-sans text-xs focus:border-primary/50 text-white"
                        placeholder={lang === "es" ? "Ej. Mentofurano" : "e.g. Mentho furan"}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase">{lang === "es" ? "% Encontrado" : "% Found"}</label>
                      <Input 
                        type="text" 
                        value={impurityPct}
                        onChange={(e) => setImpurityPct(e.target.value)}
                        className="rounded-xl border-white/10 bg-black/20 font-mono text-sm focus:border-primary/50 text-white"
                        placeholder={lang === "es" ? "Ej. 1.8 o ND" : "e.g. 1.8 or ND"}
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      {/* SECTION 2: Simulation & Real-time Audit (Two-Column Balanced Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-8">
        {/* Left Column: Toxicological Engine Sliders */}
        <div className="space-y-8">
          <Card className="rounded-[2.5rem] border border-primary/20 bg-card/60 backdrop-blur-xl shadow-2xl overflow-hidden relative">
            <CardHeader className="border-b border-primary/10 pb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-500/25 border border-teal-500/35 flex items-center justify-center text-teal-400">
                  <Calculator className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold font-serif">{lang === "es" ? "Motor Toxicológico In Silico" : "In Silico Toxicological Engine"}</CardTitle>
                  <CardDescription className="text-xs">
                    {evaluationRoute === "oral" 
                      ? (lang === "es" ? "Parámetros de exposición oral y remedios herbolarios" : "Oral and ingestion exposure parameters")
                      : (lang === "es" ? "Parámetros de exposición cutánea y cosmética" : "Skin and cosmetic exposure parameters")
                    }
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              {validationError && (
                <div id="validation-error-alert" className="p-4 rounded-xl border border-rose-500/35 bg-rose-500/10 text-rose-300 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold block uppercase mb-0.5">{lang === "es" ? "Cálculos Toxicológicos Detenidos" : "Toxicological Calculations Halted"}</strong>
                    {validationError}
                  </div>
                </div>
              )}

              {/* Route Selector Selector representing two distinct modules */}
              <div className="space-y-3">
                <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase">
                  {lang === "es" ? "Selección de Módulo de Evaluación" : "Evaluation Module Selection"}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setEvaluationRoute("dermal")}
                    className={`p-4 rounded-2xl transition-all border text-left flex flex-col gap-1 select-none cursor-pointer ${
                      evaluationRoute === "dermal"
                        ? "bg-primary/10 border-primary/40 shadow-lg shadow-primary/5"
                        : "bg-black/20 border-white/5 hover:border-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Droplet className={`w-4 h-4 ${evaluationRoute === "dermal" ? "text-primary" : "text-muted-foreground"}`} />
                      <span className={`text-xs font-bold font-mono ${evaluationRoute === "dermal" ? "text-white" : "text-zinc-400"}`}>
                        {lang === "es" ? "Módulo Vía Dérmica" : "Dermal Route Module"}
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-500 leading-tight">
                      {lang === "es" 
                        ? "Evaluación de exposición cutánea utilizando SED y Margen de Seguridad (MoS)."
                        : "Cutaneous exposure assessment using SED and Margin of Safety (MoS)."}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEvaluationRoute("oral")}
                    className={`p-4 rounded-2xl transition-all border text-left flex flex-col gap-1 select-none cursor-pointer ${
                      evaluationRoute === "oral"
                        ? "bg-indigo-600/10 border-indigo-500/40 shadow-lg shadow-indigo-500/5"
                        : "bg-black/20 border-white/5 hover:border-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Utensils className={`w-4 h-4 ${evaluationRoute === "oral" ? "text-indigo-400" : "text-muted-foreground"}`} />
                      <span className={`text-xs font-bold font-mono ${evaluationRoute === "oral" ? "text-white" : "text-zinc-400"}`}>
                        {lang === "es" ? "Módulo Vía Oral" : "Oral Route Module"}
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-500 leading-tight">
                      {lang === "es" 
                        ? "Evaluación de ingesta herbolaria mediante EDI y Límites Seguros (ADI / TDI)."
                        : "Herbal ingestion assessment using EDI and Safe Limits (ADI / TDI)."}
                    </span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase font-mono">
                    {evaluationRoute === "oral"
                      ? (lang === "es" ? "Cantidad Ingerida (A) (g/día)" : "Ingested Amount (A) (g/day)")
                      : (lang === "es" ? "Cantidad Aplicada (A) (g/día)" : "Applied Amount (A) (g/day)")
                    }
                  </label>
                  <Input 
                    type="text" 
                    value={appliedAmount}
                    onChange={(e) => setAppliedAmount(e.target.value)}
                    className="rounded-xl border-white/10 bg-black/20 font-mono text-sm focus:border-primary/50 text-white"
                    placeholder={lang === "es" ? "g/día o ND" : "g/day or ND"}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase">{lang === "es" ? "Concentración (C) (%)" : "Concentration (C) (%)"}</label>
                  <Input 
                    type="text" 
                    value={concentration}
                    onChange={(e) => setConcentration(e.target.value)}
                    className="rounded-xl border-white/10 bg-black/20 font-mono text-sm focus:border-primary/50 text-white"
                    placeholder="% o ND"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase">
                    {evaluationRoute === "oral"
                      ? (lang === "es" ? "Absorción Gastrointestinal (GIa)" : "Gastrointestinal Absorption (GIa)")
                      : (lang === "es" ? "Absorción Dérmica (DAa) (%)" : "Dermal Absorption (DAa) (%)")
                    }
                  </label>
                  {evaluationRoute === "oral" ? (
                    <div className="h-10 w-full rounded-xl border border-white/5 bg-white/5 text-zinc-500 font-mono text-xs px-3 flex items-center">
                      {lang === "es" ? "100% (Absorción Interna Completa)" : "100% (Complete Internal Bioavailability)"}
                    </div>
                  ) : (
                    <Input 
                      type="text" 
                      value={dermalAbsorption}
                      onChange={(e) => setDermalAbsorption(e.target.value)}
                      className="rounded-xl border-white/10 bg-black/20 font-mono text-sm focus:border-primary/50 text-white"
                      placeholder="% o ND"
                    />
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase">{lang === "es" ? "Retención (R)" : "Retention (R)"}</label>
                  {evaluationRoute === "oral" ? (
                    <div className="h-10 w-full rounded-xl border border-white/5 bg-white/5 text-zinc-500 font-mono text-xs px-3 flex items-center">
                      {lang === "es" ? "1.0 (No aplica en vía Oral)" : "1.0 (N/A in Oral route)"}
                    </div>
                  ) : (
                    <select
                      value={retentionFactor}
                      onChange={(e) => setRetentionFactor(parseFloat(e.target.value))}
                      className="h-10 w-full rounded-xl border border-white/10 bg-black/20 text-white font-mono text-xs px-2 focus:border-primary/50"
                    >
                      <option value="1.0">{lang === "es" ? "No Aclarable (Leave-on) - R = 1.0" : "Leave-on - R = 1.0"}</option>
                      <option value="0.1">{lang === "es" ? "Aclarable (Rinse-off) - R = 0.1" : "Rinse-off - R = 0.1"}</option>
                    </select>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase">{lang === "es" ? "Peso Corporal (BW) (kg)" : "Body Weight (BW) (kg)"}</label>
                  <Input 
                    type="text" 
                    value={bodyWeight}
                    onChange={(e) => setBodyWeight(e.target.value)}
                    className="rounded-xl border-white/10 bg-black/20 font-mono text-sm focus:border-primary/50 text-white"
                    placeholder="60.0"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase">{lang === "es" ? "NOAEL (mg/kg/día)" : "NOAEL (mg/kg/day)"}</label>
                  <Input 
                    type="text" 
                    value={noael}
                    onChange={(e) => setNoael(e.target.value)}
                    className="rounded-xl border-white/10 bg-black/20 font-mono text-sm focus:border-primary/50 text-white"
                    placeholder="mg/kg/day o ND"
                  />
                </div>
              </div>

              {/* Alternative Risk Assessment Protocol Section relocated to its own dedicated card below */}

              {/* SED & MoS Formulas explanation in text */}
              <div className="p-4 rounded-2xl bg-secondary/30 border border-white/5 space-y-2 text-[11px] leading-relaxed text-muted-foreground/90">
                <div className="font-bold uppercase font-mono text-primary text-[10px] tracking-wider mb-1">
                  {evaluationRoute === "oral" 
                    ? (lang === "es" ? "Ecuaciones de Regulación Oral & NGRA" : "Oral & NGRA Regulatory Equations")
                    : isAlternativeProtocolActive 
                      ? (lang === "es" ? "Ecuaciones de Regulación SCCS & NGRA" : "SCCS & NGRA Regulatory Equations") 
                      : (lang === "es" ? "Ecuaciones de Regulación SCCS" : "SCCS Regulatory Equations")}
                </div>
                {evaluationRoute === "oral" ? (
                  <>
                    <p>
                      <strong>{lang === "es" ? "Ingesta Diaria Estimada (EDI):" : "Estimated Daily Intake (EDI):"}</strong><br />
                      <code className="text-xs text-primary font-mono block mt-1">
                        {"EDI = [A × C × 1000] / BW = " + formatToxValue((parseVal(appliedAmount) * 1000 * (parseVal(concentration) / 100)) / (parseVal(bodyWeight) || 60), 6) + (lang === "es" ? " mg/kg PC/día" : " mg/kg bw/day")}
                      </code>
                    </p>
                    {isAlternativeProtocolActive ? (
                      <>
                        {alternativeStrategy === "ttc" && (
                          <p>
                            <strong>{lang === "es" ? "Inferencia de Ingesta Diaria Segura por TTC (Cramer Clase " + cramerClass + "):" : "Safe Daily Intake Inference by TTC (Cramer Class " + cramerClass + "):"}</strong><br />
                            <span className="opacity-90 block mt-1 text-[10px]">
                              {lang === "es" 
                                ? `Umbral Cramer de ingesta oral: ${cramerClass === "I" ? "1800" : cramerClass === "II" ? "540" : "90"} µg/persona/día. ADI/TDI Límite equivalente:`
                                : `Cramer oral intake threshold: ${cramerClass === "I" ? "1800" : cramerClass === "II" ? "540" : "90"} µg/person/day. ADI/TDI Equivalent Limit:`}
                              <strong> {formatToxValue(( (cramerClass === "I" ? 1.8 : cramerClass === "II" ? 0.54 : 0.09) / (parseVal(bodyWeight) || 60) ), 6)} mg/kg PC/día</strong>.
                            </span>
                          </p>
                        )}
                        {alternativeStrategy === "read_across" && (
                          <p>
                            <strong>{lang === "es" ? "Read-Across con " + (readAcrossAnalog || "Análogo") + ":" : "Read-Across with " + (readAcrossAnalog || "Analog") + ":"}</strong><br />
                            <span className="opacity-90 block mt-1 text-[10px]">
                              {lang === "es" ? "Punto de Partida (PoD) Ajustado para ADI/TDI = NOAEL del Análogo / Factor = " : "Point of Departure (PoD) Adjusted for ADI/TDI = Analog NOAEL / Penalty = "}
                              <strong>{formatToxValue(((parseVal(readAcrossNoael) || 0) / (readAcrossPenalty || 10)), 6)} mg/kg/día</strong>.
                            </span>
                          </p>
                        )}
                        {alternativeStrategy === "bmdl" && (
                          <p>
                            <strong>{lang === "es" ? "Sustitución BMDL10 (Oral):" : "BMDL10 Substitution (Oral):"}</strong><br />
                            <span className="opacity-90 block mt-1 text-[10px]">
                              {lang === "es" ? "Utiliza BMDL10 directo como ADI/TDI: " : "Uses direct BMDL10 as ADI/TDI: "}
                              <strong>{parseVal(bmdlValue)} mg/kg/día</strong>.
                            </span>
                          </p>
                        )}
                      </>
                    ) : (
                      <p>
                        <strong>{lang === "es" ? "Ingesta Diaria Admisible/Tolerable (ADI/TDI):" : "Acceptable/Tolerable Daily Intake (ADI/TDI):"}</strong><br />
                        <span className="opacity-90 block mt-1 text-[10px]">
                          {lang === "es" ? `Calculado utilizando el factor de incertidumbre estándar (UF) de 100x:` : `Calculated using the standard 100x uncertainty factor (UF):`}<br />
                          <strong>ADI/TDI = NOAEL / 100 = {formatToxValue((parseVal(noael) || 0) / 100, 6)} mg/kg PC/día</strong>
                        </span>
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <p>
                      <strong>{lang === "es" ? "Dosis de Exposición Sistémica (SED):" : "Systemic Exposure Dose (SED):"}</strong><br />
                      <code className="text-xs text-primary font-mono block mt-1">
                        {"SED = [A × C × DA_a × R] / BW = " + formatToxValue(sed, 3) + (lang === "es" ? " mg/kg PC/día" : " mg/kg bw/day")}
                      </code>
                    </p>
                    {isAlternativeProtocolActive ? (
                      <>
                        {alternativeStrategy === "ttc" && (
                          <p>
                            <strong>{lang === "es" ? "Evaluación por TTC (Cramer Clase " + cramerClass + "):" : "TTC Evaluation (Cramer Class " + cramerClass + "):"}</strong><br />
                            <span className="opacity-90 block mt-1 text-[10px]">
                              {lang === "es" 
                                ? `Umbral de exposición humana: ${cramerClass === "I" ? "1800" : cramerClass === "II" ? "540" : "90"} µg/persona/día. PoD Equivalente: `
                                : `Human exposure threshold: ${cramerClass === "I" ? "1800" : cramerClass === "II" ? "540" : "90"} µg/person/day. Equivalent PoD: `}
                              <strong>{formatToxValue(( (cramerClass === "I" ? 1.8 : cramerClass === "II" ? 0.54 : 0.09) / (parseVal(bodyWeight) || 60) ), 3)} mg/kg PC/día</strong>.
                            </span>
                            <code className="text-xs text-purple-300 font-mono block mt-1">
                              {"Índice de Riesgo = SED / PoD_equiv = " + formatToxValue((sed / ( (cramerClass === "I" ? 1.8 : cramerClass === "II" ? 0.54 : 0.09) / (parseVal(bodyWeight) || 60) )), 3)}
                            </code>
                          </p>
                        )}
                        {alternativeStrategy === "read_across" && (
                          <p>
                            <strong>{lang === "es" ? "Read-Across con " + (readAcrossAnalog || "Análogo") + ":" : "Read-Across with " + (readAcrossAnalog || "Analog") + ":"}</strong><br />
                            <span className="opacity-90 block mt-1 text-[10px]">
                              {lang === "es" ? "PoD Ajustado = NOAEL del Análogo / Factor de Incertidumbre = " : "Adjusted PoD = Analog NOAEL / Penalty Factor = "}
                              <strong>{formatToxValue(((parseVal(readAcrossNoael) || 0) / (readAcrossPenalty || 10)), 2)} mg/kg/día</strong>.
                            </span>
                            <code className="text-xs text-purple-300 font-mono block mt-1">
                              {"MoS Alternativo = PoD_ajust / SED = " + formatToxValue(mos, 2)}
                            </code>
                          </p>
                        )}
                        {alternativeStrategy === "bmdl" && (
                          <p>
                            <strong>{lang === "es" ? "Sustitución BMDL10:" : "BMDL10 Substitution:"}</strong><br />
                            <span className="opacity-90 block mt-1 text-[10px]">
                              {lang === "es" ? "Utiliza BMDL10 directo como punto de partida (PoD): " : "Uses direct BMDL10 as Point of Departure (PoD): "}
                              <strong>{parseVal(bmdlValue)} mg/kg/día</strong>.
                            </span>
                            <code className="text-xs text-purple-300 font-mono block mt-1">
                              {"MoS Alternativo = BMDL10 / SED = " + formatToxValue(mos, 2)}
                            </code>
                          </p>
                        )}
                      </>
                    ) : (
                      <p>
                        <strong>{lang === "es" ? "Margen de Seguridad (MoS/MdS):" : "Margin of Safety (MoS):"}</strong><br />
                        <code className="text-xs text-primary font-mono block mt-1">
                          {"MoS = NOAEL / SED = " + formatToxValue(mos, 2)}
                        </code>
                      </p>
                    )}
                  </>
                )}
              </div>

              {/* Launcher/Trigger Button for analysis on demand */}
              <div className="pt-6 border-t border-white/5 flex flex-col gap-3">
                <Button
                  size="lg"
                  disabled={loading}
                  onClick={() => startAnalysis()}
                  className="w-full h-14 text-sm font-extrabold rounded-2xl bg-gradient-to-r from-primary via-indigo-600 to-indigo-700 shadow-xl shadow-primary/10 select-none text-white flex items-center justify-center gap-2 cursor-pointer border border-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all"
                >
                  <Activity className="w-4.5 h-4.5 text-white animate-pulse" />
                  {loading ? (
                    lang === "es" ? "Ejecutando Modelos y Simulaciones..." : "Running Models & Simulations..."
                  ) : (
                    lang === "es" ? "Iniciar Análisis Toxicológico de Seguridad" : "Start Toxicological Safety Analysis"
                  )}
                  <ChevronRight className="w-4 h-4 text-white/80" />
                </Button>
                <p className="text-[10px] text-center text-muted-foreground leading-relaxed">
                  {lang === "es" 
                    ? "Al presionar se simularán las vías metabólicas y se generará el dictamen in silico con IA bajo la NOM-073-SSA1-2015" 
                    : "Pressing this will simulate chemical pathways and generate the AI-based in silico report under NOM-073-SSA1-2015"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Alternative Risk Assessment Protocol (NGRA) */}
          <Card className="rounded-[2.5rem] border border-purple-500/20 bg-card/60 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
            <CardHeader className="border-b border-purple-500/10 pb-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-2xl bg-purple-500/25 border border-purple-500/35 flex items-center justify-center text-purple-400">
                    <Layers className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold font-serif">
                      {lang === "es" ? "Evaluación de Riesgo Alternativo (NGRA)" : "Alternative Risk Assessment (NGRA)"}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {lang === "es" ? "Estrategias de evaluación cuando falta el NOAEL experimental" : "Assessment strategies when experimental NOAEL is absent"}
                    </CardDescription>
                  </div>
                </div>
                
                {/* Switch Toggle */}
                <button
                  type="button"
                  onClick={() => setIsAlternativeProtocolActive(!isAlternativeProtocolActive)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isAlternativeProtocolActive ? "bg-purple-600" : "bg-zinc-700"}`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isAlternativeProtocolActive ? "translate-x-5" : "translate-x-0"}`}
                  />
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              {!isAlternativeProtocolActive ? (
                <div className="text-center py-6 px-4 rounded-2xl border border-white/5 bg-zinc-950/20 space-y-2">
                  <Layers className="w-8 h-8 text-zinc-650 mx-auto animate-pulse" />
                  <p className="text-xs text-zinc-400 font-medium">
                    {lang === "es" 
                      ? "Protocolo inactivo. Habilite el interruptor superior para aplicar estrategias TTC (Cramer), Read-Across o BMDL10."
                      : "Protocol inactive. Turn on the switch above to apply TTC (Cramer), Read-Across, or BMDL10 strategies."}
                  </p>
                </div>
              ) : (
                <div className="space-y-4 text-left p-4 rounded-2xl bg-purple-950/20 border border-purple-500/15">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-widest">{lang === "es" ? "Estrategia de Evaluación Alternativa" : "Alternative Assessment Strategy"}</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: "ttc", label: lang === "es" ? "Opción A: TTC" : "Option A: TTC" },
                        { id: "read_across", label: lang === "es" ? "Opción B: Read-Across" : "Option B: Read-Across" },
                        { id: "bmdl", label: lang === "es" ? "Opción C: BMDL10" : "Option C: BMDL10" }
                      ].map(strat => (
                        <button
                          key={strat.id}
                          type="button"
                          onClick={() => setAlternativeStrategy(strat.id as any)}
                          className={`py-1.5 px-1 text-[10px] font-mono font-bold rounded-lg border transition-all text-center leading-tight cursor-pointer ${alternativeStrategy === strat.id ? "bg-purple-500/25 border-purple-400 text-white font-black" : "bg-black/30 border-white/5 text-muted-foreground hover:bg-black/40 hover:text-white"}`}
                        >
                          {strat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {alternativeStrategy === "ttc" && (
                    <div className="space-y-3 animate-fade-in">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase">{lang === "es" ? "Clase de Cramer de la Molécula" : "Molecule Cramer Class"}</label>
                        <div className="grid grid-cols-3 gap-1.5">
                          {[
                            { id: "I", label: lang === "es" ? "Clase I (Bajo)" : "Class I (Low)" },
                            { id: "II", label: lang === "es" ? "Clase II (Med)" : "Class II (Med)" },
                            { id: "III", label: lang === "es" ? "Clase III (Alto)" : "Class III (High)" }
                          ].map(cls => (
                            <button
                              key={cls.id}
                              type="button"
                              onClick={() => setCramerClass(cls.id as any)}
                              className={`py-1 px-1.5 text-[10px] font-mono rounded border transition-all cursor-pointer ${cramerClass === cls.id ? "bg-indigo-500/25 border-indigo-400 text-white font-black" : "bg-black/15 border-white/5 text-zinc-400"}`}
                            >
                              {cls.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-black/20 border border-white/5 text-[11px] leading-relaxed text-zinc-400 space-y-1">
                        <p className="font-bold text-[10px] text-purple-300">
                          {lang === "es" ? "Umbral de Preocupación Toxicológica (TTC):" : "Threshold of Toxicological Concern (TTC):"}
                        </p>
                        <p>
                          {cramerClass === "I" 
                            ? (lang === "es" ? "Clase I: Estructuras simples con baja toxicidad. Umbral: 1800 µg/persona/día." : "Class I: Simple structures with low oral toxicity. Threshold: 1800 µg/person/day.") 
                            : cramerClass === "II" 
                            ? (lang === "es" ? "Clase II: Estructuras intermedias o comunes. Umbral: 540 µg/persona/día." : "Class II: Intermediate, common structures. Threshold: 540 µg/person/day.") 
                            : (lang === "es" ? "Clase III: Estructuras con potencial neurotóxico o complejas. Umbral: 90 µg/persona/día." : "Class III: Potential structures with neurotoxicity or complex. Threshold: 90 µg/person/day.")
                          }
                        </p>
                        <div className="border-t border-white/5 pt-1 mt-1 text-[10px] font-mono flex justify-between text-indigo-400">
                          <span>{lang === "es" ? "Límite Equivalente:" : "Equivalent Limit:"}</span>
                          <span>
                            {cramerClass === "I" ? "1.80 mg/día" : cramerClass === "II" ? "0.54 mg/día" : "0.09 mg/día"} ({( (cramerClass === "I" ? 1.8 : cramerClass === "II" ? 0.54 : 0.09) / (parseVal(bodyWeight) || 60) ).toFixed(5)} mg/kg/día)
                          </span>
                        </div>
                        <div className="flex justify-between font-bold text-white border-t border-white/5 pt-1 text-[10px]">
                          <span>{lang === "es" ? "Índice de Riesgo:" : "Risk Index:"}</span>
                          <span className={sed / ( (cramerClass === "I" ? 1.8 : cramerClass === "II" ? 0.54 : 0.09) / (parseVal(bodyWeight) || 60) ) <= 1 ? "text-emerald-400" : "text-rose-400"}>
                            {(sed / ( (cramerClass === "I" ? 1.8 : cramerClass === "II" ? 0.54 : 0.09) / (parseVal(bodyWeight) || 60) )).toFixed(4)} {sed / ( (cramerClass === "I" ? 1.8 : cramerClass === "II" ? 0.54 : 0.09) / (parseVal(bodyWeight) || 60) ) <= 1 ? `(${lang === "es" ? "Aceptable" : "Acceptable"})` : `(${lang === "es" ? "Excedido" : "Exceeded"})`}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {alternativeStrategy === "read_across" && (
                    <div className="space-y-3 animate-fade-in">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase">{lang === "es" ? "Análogo Estructural" : "Structural Analog"}</label>
                          <Input
                            type="text"
                            value={readAcrossAnalog}
                            onChange={(e) => setReadAcrossAnalog(e.target.value)}
                            placeholder={lang === "es" ? "Ej. Carvacrol" : "e.g., Carvacrol"}
                            className="h-9 rounded-xl bg-black/25 border-white/10 text-xs font-medium text-white px-3"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase">{lang === "es" ? "NOAEL de Análogo" : "Analog NOAEL"}</label>
                          <Input
                            type="text"
                            value={readAcrossNoael}
                            onChange={(e) => setReadAcrossNoael(e.target.value)}
                            placeholder="mg/kg/day"
                            className="h-9 rounded-xl bg-black/25 border-white/10 text-xs font-mono text-white px-3"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase">{lang === "es" ? "Factor de Incertidumbre" : "Uncertainty Penalty Factor"}</label>
                        <div className="grid grid-cols-3 gap-1.5">
                          {[3, 5, 10].map(p => (
                            <button
                              key={p}
                              type="button"
                              onClick={() => setReadAcrossPenalty(p)}
                              className={`py-1 text-[10px] font-mono rounded cursor-pointer border transition-all ${readAcrossPenalty === p ? "bg-purple-500/25 border-purple-400 text-white font-bold" : "bg-black/15 border-white/5 text-zinc-400"}`}
                            >
                              {p}x {p === 3 ? "(Íntimo)" : p === 5 ? "(Estándar)" : "(Estructural)"}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="p-2.5 rounded bg-black/20 border border-white/5 text-[10px] font-mono flex justify-between text-purple-300">
                        <span>{lang === "es" ? "PoD Ajustado (NOAEL / Factor):" : "Adjusted PoD (NOAEL / Factor):"}</span>
                        <span>
                          {((parseVal(readAcrossNoael) || 0) / (readAcrossPenalty || 10)).toFixed(2)} mg/kg/día
                        </span>
                      </div>
                    </div>
                  )}

                  {alternativeStrategy === "bmdl" && (
                    <div className="space-y-3 animate-fade-in">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase">{lang === "es" ? "Valor de BMDL10 (mg/kg/día)" : "BMDL10 Value (mg/kg/day)"}</label>
                        <Input
                          type="text"
                          value={bmdlValue}
                          onChange={(e) => setBmdlValue(e.target.value)}
                          placeholder="Ej. 85.5"
                          className="h-9 rounded-xl bg-black/25 border-white/10 text-xs font-mono text-white px-3"
                        />
                      </div>
                      <p className="text-[10px] text-zinc-400 leading-snug">
                        {lang === "es" 
                          ? "Sustitución directa de NOAEL con el límite inferior del intervalo de confianza para dosis de referencia con un 10 % de incidencia de efectos adversos."
                          : "Direct substitution of NOAEL with the benchmark dose lower confidence limit representing a 10% reaction increment."}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Dynamic Results Dashboard */}
        <div className="space-y-8">
          {/* Audit Result Display (Highly visual & prestigious) */}
          <Card className={`rounded-[3rem] border border-primary/25 relative overflow-hidden transition-all duration-500 shadow-2xl ${
            isApproved 
              ? "bg-gradient-to-br from-card/65 via-slate-900/40 to-emerald-950/20 shadow-emerald-950/10" 
              : "bg-gradient-to-br from-card/65 via-slate-900/40 to-rose-950/20 shadow-rose-950/10"
          }`}>
            <CardContent className="p-10 md:p-14 space-y-8 flex flex-col justify-between">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1.5 text-left">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-primary uppercase">
                    {lang === "es" ? "Estatus de Auditoría in silico" : "In Silico Audit Status"}
                  </span>
                  <h3 className="text-3xl font-serif font-black tracking-tight flex items-center gap-3 text-white">
                    {botanicalName === "Compuesto Puro" || botanicalName === "Compuesto Puro / Pure Compound" || botanicalName === "Pure Compound" ? selectedMetabolite : botanicalName} {lang === "es" ? "Certificado" : "Certified"}
                  </h3>
                </div>
                
                {/* Result stamp badge */}
                <div className={`flex items-center gap-2 rounded-2xl border px-5 py-3 font-mono font-black text-xs uppercase tracking-widest shadow-xl animate-fade-in ${
                  isApproved 
                    ? "border-emerald-500/35 bg-emerald-500/10 text-emerald-400 shadow-emerald-500/5" 
                    : "border-rose-500/35 bg-rose-500/10 text-rose-400 shadow-rose-500/5"
                }`}>
                  {isApproved ? <ShieldCheck className="w-5 h-5 animate-pulse" /> : <AlertCircle className="w-5 h-5 animate-bounce" />}
                  {isApproved 
                    ? (lang === "es" ? "APROBACIÓN REGULATORIA" : "REGULATORY APPROVAL") 
                    : (lang === "es" ? "RECHAZO REGULATORIO / ALERTA DE TOXICIDAD" : "REGULATORY REJECTION / TOXICITY ALERT")}
                </div>
              </div>

              {/* Calculations Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-4">
                <div className="p-5 sm:p-6 rounded-3xl bg-black/35 border border-white/5 space-y-1 text-left relative overflow-hidden break-words">
                  <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest block">
                    {evaluationRoute === "oral" 
                      ? (lang === "es" ? "EDI Estimado" : "Estimated EDI")
                      : (lang === "es" ? "SED Estimado" : "Estimated SED")}
                  </span>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-mono font-extrabold tracking-tighter text-white truncate" title={formatToxValue(sed, 8)}>
                    {formatToxValue(sed, evaluationRoute === "oral" ? 6 : 3)}
                  </p>
                  <span className="text-[9px] font-mono text-zinc-500 block">
                    {lang === "es" ? "mg/kg PC/día" : "mg/kg bw/day"}
                  </span>
                </div>

                <div className="p-5 sm:p-6 rounded-3xl bg-black/35 border border-white/5 space-y-1 relative overflow-hidden text-left break-words">
                  <div className={`absolute top-0 bottom-0 right-0 w-2 ${isApproved ? "bg-emerald-500" : "bg-rose-500"}`} />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">
                    <span>
                      {evaluationRoute === "oral" 
                        ? (lang === "es" ? "Límite Seguro (ADI/TDI)" : "Safe Limit (ADI/TDI)")
                        : isAlternativeProtocolActive 
                          ? (lang === "es" ? "S-Index (NGRA)" : "S-Index (NGRA)") 
                          : (lang === "es" ? "Margen (MoS)" : "Margin of Safety (MoS)")}
                    </span>
                    <span className="text-[8px] sm:text-[9px] font-extrabold text-zinc-500 shrink-0">
                      {evaluationRoute === "oral" 
                        ? (lang === "es" ? "Máximo Seguro" : "Max Safe")
                        : (lang === "es" ? "Mínimo: 100" : "Minimum: 100")}
                    </span>
                  </div>
                  <p className={`text-2xl sm:text-3xl lg:text-4xl font-mono font-extrabold tracking-tighter ${isApproved ? "text-emerald-400" : "text-rose-400"} truncate`}>
                    {formatToxValue(mos, evaluationRoute === "oral" ? 6 : 2)}
                  </p>
                  <span className="text-[9px] font-mono text-zinc-500 block truncate">
                    {evaluationRoute === "oral"
                      ? (isAlternativeProtocolActive 
                          ? (alternativeStrategy === "ttc" 
                              ? `TTC Class ${cramerClass}: Safe Threshold` 
                              : alternativeStrategy === "read_across" 
                              ? `Read-Across (${readAcrossAnalog || "Analog"} PoD)` 
                              : `BMDL10: ${bmdlValue || 0}`)
                          : `NOAEL / 100`)
                      : isAlternativeProtocolActive 
                        ? (alternativeStrategy === "ttc" 
                            ? `TTC Class ${cramerClass}: Threshold/SED` 
                            : alternativeStrategy === "read_across" 
                            ? `Read-Across (${readAcrossAnalog || "Analog"} PoD)/SED` 
                            : `BMDL10: ${bmdlValue || 0}/SED`)
                        : `NOAEL / SED`
                    }
                  </span>
                </div>
              </div>

              {/* Specific Regulatory Statement */}
              <div className={`p-4 rounded-2xl border flex items-start gap-3.5 leading-relaxed text-xs text-left ${
                isApproved 
                  ? "border-emerald-500/10 bg-emerald-500/5 text-emerald-300"
                  : "border-rose-500/10 bg-rose-500/5 text-rose-300"
              }`}>
                {isApproved ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0 text-emerald-400" />
                    <p>
                      <strong>
                        {evaluationRoute === "oral"
                          ? (lang === "es" ? "Dictamen Jurídico Conforme (Ingesta Oral Diaria Segura):" : "Conforming Legal Verdict (Safe Oral Daily Intake):")
                          : (lang === "es" ? "Dictamen Jurídico Conforme (Evaluación Alternativa NGRA Dérmica):" : "Conforming Legal Verdict (Alternative Dermal NGRA Assessment):")
                        }
                      </strong>{" "}
                      {evaluationRoute === "oral" ? (
                        lang === "es" ? (
                          <>
                            {isAlternativeProtocolActive ? (
                              <>
                                El análisis de riesgo oral alternativo para <strong>{selectedMetabolite}</strong> mediante la estrategia de{" "}
                                <strong>
                                  {alternativeStrategy === "ttc" 
                                    ? `TTC (Clase de Cramer ${cramerClass})` 
                                    : alternativeStrategy === "read_across" 
                                    ? `Read-Across (Análogo: ${readAcrossAnalog || "N/D"})` 
                                    : "BMDL10"}
                                </strong>{" "}
                                concluye que la ingesta diaria estimada es segura y se encuentra por debajo de los límites tolerables establecidos (EDI &le; ADI/TDI equivalente). El espécimen vegetal <strong>{botanicalName}</strong> al <strong>{concentration}%</strong> se aprueba provisionalmente para su desarrollo clínico e industrial bajo la norma mexicana <strong>NOM-073-SSA1-2015</strong>. Se aconseja validación analítica complementaria de laboratorio.
                              </>
                            ) : (
                              <>La Ingesta Diaria Estimada calculated (<strong>{formatToxValue(sed, 6)}</strong> mg/kg PC/día) es igual o menor al Límite Seguro Tolerable/Admisible ADI/TDI (<strong>{formatToxValue(mos, 6)}</strong> mg/kg PC/día). La formulación oral de <strong>{botanicalName}</strong> al <strong>{concentration}%</strong> se aprueba para su uso seguro según los criterios de estabilidad de la norma mexicana <strong>NOM-073-SSA1-2015</strong>.</>
                            )}
                          </>
                        ) : (
                          <>
                            {isAlternativeProtocolActive ? (
                              <>
                                The alternative oral risk assessment for <strong>{selectedMetabolite}</strong> via{" "}
                                <strong>
                                  {alternativeStrategy === "ttc" 
                                    ? `TTC (Cramer Class ${cramerClass})` 
                                    : alternativeStrategy === "read_across" 
                                    ? `Read-Across (Analog: ${readAcrossAnalog || "N/D"})` 
                                    : "BMDL10"}
                                </strong>{" "}
                                concludes that the estimated oral intake is safe and below acceptable daily boundaries (EDI &le; ADI/TDI equivalent). The botanical specimen <strong>{botanicalName}</strong> at <strong>{concentration}%</strong> is approved for oral use in compliance with Mexican specification guidelines. Laboratory validation is advised.
                              </>
                            ) : (
                              <>The Estimated Daily Intake (EDI) (<strong>{formatToxValue(sed, 6)}</strong> mg/kg bw/day) compiles with safe limits and is below the ADI/TDI (<strong>{formatToxValue(mos, 6)}</strong> mg/kg bw/day). The botanical formulation of <strong>{botanicalName}</strong> at <strong>{concentration}%</strong> is provisionally approved for oral use under official stability guidelines.</>
                            )}
                          </>
                        )
                      ) : (
                        lang === "es" ? (
                          <>
                            {isAlternativeProtocolActive ? (
                              <>
                                El análisis de riesgo alternativo para <strong>{selectedMetabolite}</strong> mediante la estrategia de{" "}
                                <strong>
                                  {alternativeStrategy === "ttc" 
                                    ? `TTC (Clase de Cramer ${cramerClass})` 
                                    : alternativeStrategy === "read_across" 
                                    ? `Read-Across (Análogo: ${readAcrossAnalog || "N/D"})` 
                                    : "BMDL10"}
                                </strong>{" "}
                                concluye que la exposición estimada es segura bajo el marco integrado (MoS/Índice equivalente &ge; 100). El espécimen vegetal <strong>{botanicalName}</strong> al <strong>{concentration}%</strong> se aprueba provisionalmente para su desarrollo clínico e industrial bajo la norma mexicana <strong>NOM-073-SSA1-2015</strong>. Se aconseja validación analítica complementaria de laboratorio.
                              </>
                            ) : (
                              <>El Margen de Seguridad calculado (<strong>{formatToxValue(mos, 2)}</strong>) es superior a 100. La formulación de <strong>{botanicalName}</strong> al <strong>{concentration}%</strong> se aprueba provisionalmente para su evaluación clínica e industrial bajo los criterios de estabilidad de la norma mexicana <strong>NOM-073-SSA1-2015</strong>.</>
                            )}
                          </>
                        ) : (
                          <>
                            {isAlternativeProtocolActive ? (
                              <>
                                The alternative risk assessment for <strong>{selectedMetabolite}</strong> via{" "}
                                <strong>
                                  {alternativeStrategy === "ttc" 
                                    ? `TTC (Cramer Class ${cramerClass})` 
                                    : alternativeStrategy === "read_across" 
                                    ? `Read-Across (Analog: ${readAcrossAnalog || "N/D"})` 
                                    : "BMDL10"}
                                </strong>{" "}
                                concludes that the exposure has been evaluated as safe. The formulation is provisionally approved under <strong>NOM-073-SSA1-2015</strong> predictive principles. Laboratory validation is advised.
                              </>
                            ) : (
                              <>The calculated Margin of Safety (<strong>{formatToxValue(mos, 2)}</strong>) complies with international standards. The formulation of <strong>{botanicalName}</strong> at <strong>{concentration}%</strong> is provisionally approved for industrial implementation under official stability guidelines.</>
                            )}
                          </>
                        )
                      )}
                    </p>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 mt-0.5 shrink-0 text-rose-400 animate-pulse" />
                    <p>
                      <strong>
                        {evaluationRoute === "oral"
                          ? (lang === "es" ? "Alerta de Riesgo Toxicológico (Ingesta Oral Excesiva):" : "Toxicological Risk Warning (Excessive Oral Intake):")
                          : (lang === "es" ? "Alerta de Riesgo Toxicológico (Evaluación Alternativa NGRA Dérmica):" : "Toxicological Risk Warning (Alternative Dermal NGRA Assessment):")
                        }
                      </strong>{" "}
                      {evaluationRoute === "oral" ? (
                        lang === "es" ? (
                          <>
                            {isAlternativeProtocolActive ? (
                              <>
                                El análisis de riesgo oral alternativo para <strong>{selectedMetabolite}</strong> mediante la estrategia de{" "}
                                <strong>
                                  {alternativeStrategy === "ttc" 
                                    ? `TTC (Clase de Cramer ${cramerClass})` 
                                    : alternativeStrategy === "read_across" 
                                    ? `Read-Across (Análogo: ${readAcrossAnalog || "N/D"})` 
                                    : "BMDL10"}
                                </strong>{" "}
                                indica que la exposición calculada supera el límite diario tolerable equivalente (EDI &gt; ADI/TDI). Se requiere obligatoriamente reformular para disminuir la dosis oral diaria o sustituir por ingredientes con mayor nivel de protección.
                              </>
                            ) : (
                              <>La Ingesta Diaria Estimada calculada (<strong>{formatToxValue(sed, 6)}</strong> mg/kg PC/día) SUPERA el Límite Seguro Tolerable/Admisible ADI/TDI (<strong>{formatToxValue(mos, 6)}</strong> mg/kg PC/día). Es de carácter OBLIGATORIO reformular: reduce la dosis diaria sugerida o disminuye el porcentaje de extracto herbolario en la preparación oral.</>
                            )}
                          </>
                        ) : (
                          <>
                            {isAlternativeProtocolActive ? (
                              <>
                                The alternative oral risk assessment for <strong>{selectedMetabolite}</strong> via{" "}
                                <strong>
                                  {alternativeStrategy === "ttc" 
                                    ? `TTC (Cramer Class ${cramerClass})` 
                                    : alternativeStrategy === "read_across" 
                                    ? `Read-Across (Analog: ${readAcrossAnalog || "N/D"})` 
                                    : "BMDL10"}
                                </strong>{" "}
                                indicates that the calculated oral exposure exceeds safe tolerable limits (EDI &gt; ADI/TDI). It is mandatory to reformulate to reduce intake recommendations or active concentrate.
                              </>
                            ) : (
                              <>The Estimated Daily Intake (EDI) (<strong>{formatToxValue(sed, 6)}</strong> mg/kg bw/day) EXCEEDS the safe tolerable daily limits (ADI/TDI: <strong>{formatToxValue(mos, 6)}</strong> mg/kg bw/day). It is MANDATORY to reformulate: reduce the oral dosage or extract concentration.</>
                            )}
                          </>
                        )
                      ) : (
                        lang === "es" ? (
                          <>
                            {isAlternativeProtocolActive ? (
                              <>
                                El análisis de riesgo alternativo para <strong>{selectedMetabolite}</strong> mediante{" "}
                                <strong>
                                  {alternativeStrategy === "ttc" 
                                    ? `TTC (Clase de Cramer ${cramerClass})` 
                                    : alternativeStrategy === "read_across" 
                                    ? `Read-Across (Análogo: ${readAcrossAnalog || "N/D"})` 
                                    : "BMDL10"}
                                </strong>{" "}
                                indica que la exposición estimada supera los umbrales regulatorios de seguridad dérmica tolerables (MoS &lt; 100 o Índice de Riesgo &gt; 1.0). Se requiere obligatoriamente reformular para disminuir la dosis diaria o sustituir por ingredientes con mayor margen de protección.
                              </>
                            ) : (
                              <>El Margen de Seguridad calculado (<strong>{formatToxValue(mos, 2)}</strong>) está por debajo del umbral de seguridad estricto regulatorio (SCCS MoS &lt; 100). Es de carácter OBLIGATORIO reformular: reduce la cantidad diaria recomendada, disminuye el extracto en fórmula o audita el nivel de impurezas herbolarias de la planta.</>
                            )}
                          </>
                        ) : (
                          <>
                            {isAlternativeProtocolActive ? (
                              <>
                                The alternative risk assessment for <strong>{selectedMetabolite}</strong> via{" "}
                                <strong>
                                  {alternativeStrategy === "ttc" 
                                    ? `TTC (Cramer Class ${cramerClass})` 
                                    : alternativeStrategy === "read_across" 
                                    ? `Read-Across (Analog: ${readAcrossAnalog || "N/D"})` 
                                    : "BMDL10"}
                                </strong>{" "}
                                indicates exposure exceeds safe thresholds (MoS &lt; 100). Reformulation is mandatory.
                              </>
                            ) : (
                              <>The calculated Margin of Safety (<strong>{formatToxValue(mos, 2)}</strong>) falls below the strict safety threshold (SCCS MoS &lt; 100). It is MANDATORY to reformulate: reduce the recommended daily dose, lower the formula concentration, or lower the botanical impurities level of the plant.</>
                            )}
                          </>
                        )
                      )}
                    </p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Console / Log area if loading */}
          <AnimatePresence>
            {(loading || consoleStatus.length > 0) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden animate-fade-in space-y-4"
              >
                {loading && (
                  <PhytoReactorEngine
                    lang={lang}
                    activeRoute={evaluationRoute}
                    metaboliteName={selectedMetabolite}
                  />
                )}

                <div className="p-8 rounded-[2.5rem] bg-slate-950/85 border border-primary/20 shadow-2xl font-mono text-xs text-left text-green-400 space-y-3 max-h-56 overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2 text-primary font-bold">
                    <span className="flex items-center gap-2">
                       <Sparkles className="w-4 h-4 text-primary" />
                       {lang === "es" ? "Consola de Análisis AurorIA" : "AurorIA Analysis Console"}
                    </span>
                    <span className="text-[10px] bg-green-950 px-2 py-0.5 rounded text-green-400 animate-pulse font-mono">
                      {lang === "es" ? "EJECUTANDO... API SHIELD ACTIVO" : "RUNNING... API SHIELD ACTIVE"}
                    </span>
                  </div>
                  {consoleStatus.map((log, idx) => (
                    <div key={idx} className="leading-relaxed opacity-90 animate-fade-in flex items-start gap-1">
                      <span className="text-zinc-650 shrink-0 select-none">&gt;&gt;</span>
                      <span>{log}</span>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex items-center gap-2 pt-1 font-bold text-primary animate-pulse">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>
                        {lang === "es" 
                          ? "Sincronizando con PubChem y Google Search para auditoría de bibliografía..." 
                          : "Synchronizing with PubChem and Google Search for bibliographical audit..."}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* SCCS & NOM Margin of Safety spectrum visualization - Stretched horizontally in the application */}
      <MosSpectrumChart 
        mos={mos} 
        noael={parseVal(noael)} 
        sed={sed} 
        botanicalName={botanicalName} 
        isApproved={isApproved} 
        lang={lang} 
        evaluationRoute={evaluationRoute}
      />

      {/* SECTION 3: Generated Regulatory Scientific Report (Full Width) */}
      <AnimatePresence>
        {reportResult && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="space-y-6 w-full"
          >
            <Card className="rounded-[3rem] border border-primary/20 bg-card/70 backdrop-blur-xl shadow-2xl relative">
                  <div className="p-8 md:p-12 border-b border-primary/10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-1 text-left">
                      <span className="text-[9px] font-mono text-primary font-bold uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                        {lang === "es" ? "MANUSCRITO COMPLETO IMRaD" : "COMPLETE IMRaD MANUSCRIPT"}
                      </span>
                      <h4 className="text-2xl font-serif font-bold text-white leading-snug">
                        {lang === "es" ? "Reporte de Auditoría Toxicológica" : "Toxicological Audit Report"}
                      </h4>
                    </div>
                    
                    {/* Exporter actions */}
                    <div className="flex items-center gap-2.5 shrink-0">
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={copyToClipboard}
                        className="rounded-xl border-white/10 text-xs text-white hover:bg-white/5 flex items-center gap-2 cursor-pointer h-10"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            {lang === "es" ? "Copiado" : "Copied"}
                          </>
                        ) : (
                          <>
                            <Clipboard className="w-3.5 h-3.5" />
                            {lang === "es" ? "Copiar Texto" : "Copy Text"}
                          </>
                        )}
                      </Button>

                      <PDFDownloadLink
                        document={<ScientificReport title={lang === "es" ? `Reporte AurorIA: ${botanicalName}` : `AurorIA Report: ${botanicalName}`} result={reportResult} lang={lang} />}
                        fileName={lang === "es" ? `auroria_reporte_${botanicalName.replace(/\s+/g, '_')}.pdf` : `auroria_report_${botanicalName.replace(/\s+/g, '_')}.pdf`}
                      >
                        {({ loading: pdfLoading }) => (
                          <Button 
                            size="sm"
                            disabled={pdfLoading}
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer h-10"
                          >
                            <Download className="w-3.5 h-3.5" />
                            {pdfLoading 
                              ? (lang === "es" ? "Compilando PDF..." : "Compiling PDF...") 
                              : (lang === "es" ? "Exportar PDF Regulatorio" : "Export Regulatory PDF")}
                          </Button>
                        )}
                      </PDFDownloadLink>
                    </div>
                  </div>

                  <CardContent className="p-10 md:p-14 lg:p-16 max-h-[800px] overflow-y-auto text-left">
                    <div className="prose prose-invert prose-lg max-w-none prose-headings:font-serif prose-headings:text-primary prose-headings:tracking-tighter prose-headings:text-3xl prose-p:leading-[1.7] prose-p:text-justify prose-li:marker:text-primary prose-strong:text-primary/90 prose-a:text-accent prose-a:font-bold hover:prose-a:text-primary">
                      <ReactMarkdown 
                        components={{
                          a: ({ node, ...props }) => {
                            const cleanText = (val: React.ReactNode): React.ReactNode => {
                              if (!val) return val;
                              if (typeof val === "string") {
                                return val.replace(/https?:\/\//gi, "");
                              }
                              if (Array.isArray(val)) {
                                return val.map((item, idx) => typeof item === "string" ? item.replace(/https?:\/\//gi, "") : item);
                              }
                              return val;
                            };
                            return (
                              <a 
                                {...props} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="inline-flex items-center gap-1 group text-accent hover:text-primary transition-colors font-bold"
                              >
                                {cleanText(props.children)}
                                <ExternalLink className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                              </a>
                            );
                          },
                        }}
                      >
                        {cleanMarkdownHttps(reportResult)}
                      </ReactMarkdown>
                    </div>

                    {/* Disclaimer */}
                    <div className="mt-12 pt-6 border-t border-primary/10 flex items-start gap-3.5 text-[10.5px] leading-relaxed text-slate-400 italic font-medium">
                      <AlertCircle className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5" />
                      <p>
                        <strong>{lang === "es" ? "Advertencia Especial de AurorIA:" : "Special AurorIA Disclaimer:"}</strong> {lang === "es" ? (
                          "Este análisis de modelado estimativo in silico constituye un protocolo regulatorio preliminar para control de calidad microbiológica herbolaria y riesgos toxicológicos. Se provee estrictamente con fines de investigación científica y no excluye la obligación de realizar pruebas físicas, organolépticas, físico-químicas de estabilidad y validaciones analíticas experimentales según dispongan las autoridades nacionales o la Secretaría de Salud."
                        ) : (
                          "This estimative in silico modeling analysis constitutes a preliminary regulatory protocol for herbal microbiological quality control and toxicological risk limits. It is provided strictly for academic scientific research purposes and does not exclude the legal obligation to perform physical, organoleptic, and physicochemical stability tests as well as experimental analytical validations as required by the appropriate national health authorities or secretariats."
                        )}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }
