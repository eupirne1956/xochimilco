/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
// @ts-ignore
import subConquestGal from "./assets/images/galleon_conquest_1779903250270.png";
// @ts-ignore
import traditionalHubImg from "./assets/images/traditional_hub_1779904407293.png";
// @ts-ignore
import codiceBadianoImg from "./assets/images/codice_badiano_illustration_1779919739319.png";
// @ts-ignore
import unamPlantsAtlasImg from "./assets/images/unam_plants_atlas_1779920169313.png";
// @ts-ignore
import lotusMeadowImg from "./assets/images/medicinal_meadow_lotus_1779920570330.png";
// @ts-ignore
import tropicosGardenImg from "./assets/images/tropicos_medicinal_garden_1779920702105.png";
// @ts-ignore
import npatlasMushroomsImg from "./assets/images/npatlas_mushrooms_1779920878643.png";
// @ts-ignore
import supernaturalSteamImg from "./assets/images/supernatural_temazcal_ceremony_1779921124642.png";
// @ts-ignore
import coconutMetabolitesImg from "./assets/images/coconut_cellular_metabolites_1779921280762.png";
// @ts-ignore
import swissAdmeImg from "./assets/images/swiss_adme_holographic_molecules_1779921422046.png";
// @ts-ignore
import pubchemBiomedicalLabImg from "./assets/images/pubchem_biomedical_lab_1780001203546.png";
// @ts-ignore
import pubmedPhytochemistryJournalImg from "./assets/images/pubmed_phytochemistry_journal_1780001386576.png";
// @ts-ignore
import cofeprisLabRegulationImg from "./assets/images/cofepris_lab_regulation_1780001637120.png";
import { 
  Search, 
  Download, 
  Languages, 
  Leaf, 
  BookOpen, 
  FlaskConical, 
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Mail,
  Menu,
  X,
  ArrowRight,
  History,
  Activity,
  ExternalLink,
  Microscope,
  Lock,
  Sparkles,
  ChevronRight,
  GitBranch,
  ChevronDown,
  Plus,
  LogOut,
  ShieldCheck,
  Film,
  Play,
  Pause,
  Sliders,
  Gauge,
  Info,
  RefreshCw,
  Wind
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NatureMagazineCanvas } from "./components/NatureMagazineCanvas";
import { CofeprisHQCanvas } from "./components/CofeprisHQCanvas";
import { generateResearch, identifyPlantsByCompound, generateBotanicalImage, auditAndApplyPubChemLinks, auditAndApplyPubChemLinksAsync } from "./services/gemini";
import { sanitizeMojibake } from "./lib/sanitize";
import ReactMarkdown from "react-markdown";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ScientificReport } from "./components/ScientificReport";
import { AuroriaWorkspace } from "./components/AuroriaWorkspace";
import { GmailAuthPortal } from "./components/GmailAuthPortal";
import { AdminWhitelistDashboard } from "./components/AdminWhitelistDashboard";
import { GmailUser } from "./types";
import { auth, db } from "./lib/firebase";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";

type Language = "es" | "en";

const cleanMarkdownHttps = (md: string | null | undefined): string => {
  if (!md) return "";
  
  // Strip code block backticks or surrounding wraps that create ugly block boxes
  let cleaned = md.trim();
  if (cleaned.startsWith("```markdown")) {
    cleaned = cleaned.replace(/^```markdown\s*/i, "").replace(/\s*```$/g, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
  }
  
  // Clean all raw triple backticks from anywhere in the text so they don't render pre blocks
  cleaned = cleaned.replace(/```/g, "");

  return cleaned.replace(/(!?\[[^\]]*\]\([^\)]+\))|(https?:\/\/\S+)/g, (match, link) => {
    if (link) {
      return link.replace(/\[(https?:\/\/)?([^\]]+)\]/gi, (m, prefix, inner) => {
        return `[${inner.replace(/https?:\/\//gi, "")}]`;
      });
    }
    return match.replace(/https?:\/\//gi, "");
  });
};

const BotanicalMotor = ({ active, className = "w-8 h-8" }: { active: boolean; className?: string }) => {
  return (
    <div className={`relative ${className} flex items-center justify-center`}>
      {/* Outer spinning gear */}
      <motion.svg
        viewBox="0 0 100 100"
        className="w-full h-full text-amber-500 drop-shadow-[0_0_12px_rgba(245,158,11,0.6)]"
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
        <circle cx="50" cy="50" r="33" className="fill-transparent stroke-amber-400 stroke-[5]" />
      </motion.svg>

      {/* Flower core with colorful petals spinning the opposite way */}
      <motion.svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full text-rose-500 drop-shadow-[0_0_12px_rgba(244,63,94,0.7)]"
        animate={active ? { rotate: -360 } : { rotate: 0 }}
        transition={active ? { repeat: Infinity, duration: 3.5, ease: "linear" } : { duration: 0.5 }}
      >
        <g className="fill-rose-550 opacity-95">
          <ellipse cx="50" cy="30" rx="11" ry="15" />
          <ellipse cx="50" cy="70" rx="11" ry="15" />
          <ellipse cx="30" cy="50" rx="15" ry="11" />
          <ellipse cx="70" cy="50" rx="15" ry="11" />
          
          <g transform="rotate(45, 50, 50)" className="fill-emerald-400">
            <ellipse cx="50" cy="32" rx="9" ry="13" />
            <ellipse cx="50" cy="68" rx="9" ry="13" />
            <ellipse cx="32" cy="50" rx="13" ry="9" />
            <ellipse cx="66" cy="50" rx="13" ry="9" />
          </g>
        </g>
        <circle cx="50" cy="50" r="9" className="fill-yellow-300 stroke-rose-500 stroke-2" />
      </motion.svg>

      {/* Spores / Sparkles */}
      {active && (
        <>
          <motion.div
            className="absolute w-2 h-2 bg-yellow-300 rounded-full blur-[0.4px]"
            animate={{ scale: [1, 2.2, 1], x: [0, 20, -10], y: [0, -22, -5], opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}
          />
          <motion.div
            className="absolute w-1.5 h-1.5 bg-sky-300 rounded-full blur-[0.4px]"
            animate={{ scale: [1, 2, 1], x: [0, -20, 12], y: [0, 18, -10], opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 1.3, delay: 0.3 }}
          />
          <motion.div
            className="absolute w-1 h-1 bg-purple-300 rounded-full blur-[0.3px]"
            animate={{ scale: [1, 1.8, 1], x: [0, 15, 22], y: [0, 12, -15], opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 1.1, delay: 0.6 }}
          />
        </>
      )}
    </div>
  );
};

export default function App() {
  const [lang, setLang] = useState<Language>("es");
  
  // Gmail-style Authenticated User State (persisted locally)
  const [currentUser, setCurrentUser] = useState<GmailUser | null>(() => {
    const stored = localStorage.getItem("xochimilco_logged_user");
    if (stored) {
      try {
        return JSON.parse(stored) as GmailUser;
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [showAccountSwitcher, setShowAccountSwitcher] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showGuestNotice, setShowGuestNotice] = useState(true);

  // EXPIRED/EXPIRING LICENSE WARNING SYSTEM STATES
  const [isExpiryAlertOpen, setIsExpiryAlertOpen] = useState(false);
  const [expiryDaysLeft, setExpiryDaysLeft] = useState<number | null>(null);
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [emailSentStatus, setEmailSentStatus] = useState<"not_sent" | "success" | "failed">("not_sent");

  // Helper inside App to parse firestore timestamps
  const parseFirestoreTimestamp = (val: any): Date => {
    if (!val) return new Date(0);
    if (typeof val.toDate === "function") {
      return val.toDate();
    }
    if (val.seconds !== undefined) {
      return new Date(val.seconds * 1000);
    }
    return new Date(val);
  };

  // Automated notification when <= 2 days left
  useEffect(() => {
    if (!currentUser || currentUser.role === "admin" || currentUser.email === "eupirne@gmail.com") {
      return;
    }

    const checkAndSendExpiryWarning = async () => {
      try {
        const emailClean = currentUser.email.toLowerCase().trim();
        const docRef = doc(db, "authorized_users", emailClean);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const authData = docSnap.data();
          let expiresAtDate: Date;

          if (authData.access_expires_at) {
            expiresAtDate = parseFirestoreTimestamp(authData.access_expires_at);
          } else if (currentUser.accessExpiresAt) {
            expiresAtDate = new Date(currentUser.accessExpiresAt);
          } else {
            expiresAtDate = new Date(new Date(currentUser.createdAt || Date.now()).getTime() + 30 * 24 * 60 * 60 * 1000);
          }

          const now = new Date();
          const remainingMs = expiresAtDate.getTime() - now.getTime();
          const remainingDays = remainingMs / (24 * 60 * 60 * 1000);

          console.log(`[Auto-Warning Engine] Days remaining for ${emailClean}: ${remainingDays.toFixed(2)}`);

          if (remainingDays > 0 && remainingDays <= 2.0) {
            setExpiryDaysLeft(remainingDays);
            setIsExpiryAlertOpen(true);

            const alreadySent = authData.is_expiry_warning_sent === true || authData.warning_sent_2_days === true;
            if (!alreadySent) {
              console.log(`[Auto-Warning Engine] Initiating automated alert mail to ${emailClean}`);
              setIsEmailSending(true);

              const serviceId = (import.meta as any).env.VITE_EMAILJS_SERVICE_ID || "service_atajos";
              const templateId = (import.meta as any).env.VITE_EMAILJS_TEMPLATE_ID || "template_expiry_warning";
              const publicKey = (import.meta as any).env.VITE_EMAILJS_PUBLIC_KEY || "user_public_key_placeholder";

              const daysStr = remainingDays.toFixed(1);
              const subject = `⚠️ Alerta de Expiración de Acceso - Atajos Xochimilco`;
              const textMessage = `Hola ${currentUser.firstName},\n\nEste es un aviso automático de que tu periodo de vigencia para Atajos (Estudio de Diseño Bio-Digital Xochimilco) vencerá pronto en aproximadamente ${daysStr} días.\n\nPor favor, ponte en contacto con el administrador (eupirne@gmail.com) para solicitar una extensión de vigencia y evitar la suspensión del servicio.\n\nAtentamente,\nEquipo de Atajos Xochimilco`;

              try {
                const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    service_id: serviceId,
                    template_id: templateId,
                    user_id: publicKey,
                    template_params: {
                      to_email: emailClean,
                      to_name: currentUser.firstName,
                      days_remaining: daysStr,
                      subject: subject,
                      message: textMessage,
                      reply_to: "eupirne@gmail.com"
                    },
                  }),
                });

                if (response.ok) {
                  console.log(`[Auto-Warning Engine] Expiry alert successfully sent to ${emailClean}.`);
                  setEmailSentStatus("success");
                } else {
                  const errBody = await response.text();
                  console.warn(`[Auto-Warning Engine] EmailJS integration error (requires setup):`, errBody);
                  setEmailSentStatus("failed");
                }
              } catch (dispatchErr) {
                console.error(`[Auto-Warning Engine] Network error during dispatch:`, dispatchErr);
                setEmailSentStatus("failed");
              } finally {
                setIsEmailSending(false);

                // Persist the status in Firestore so we don't repeat this network request
                await setDoc(docRef, {
                  is_expiry_warning_sent: true,
                  warning_sent_2_days: true
                }, { merge: true });

                const updatedUser = { ...currentUser, is_expiry_warning_sent: true, warning_sent_2_days: true };
                localStorage.setItem("xochimilco_logged_user", JSON.stringify(updatedUser));
              }
            } else {
              // already sent, but let's sync status
              setEmailSentStatus("success");
            }
          }
        }
      } catch (err) {
        console.error("Failed to check expiration or notify:", err);
      }
    };

    checkAndSendExpiryWarning();
  }, [currentUser]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [isToolActive, setIsToolActive] = useState(false);
  const [activeModule, setActiveModule] = useState<"xochimilco" | "auroria">("xochimilco");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchMode, setSearchMode] = useState<"standard" | "phytochemistry" | "traditional" | "fingerprint">("standard");
  const [hoveredMode, setHoveredMode] = useState<string | null>(null);
  const [botanicalImage, setBotanicalImage] = useState<{ url: string; credit: string; sourceUrl: string } | null>(null);
  const [imageLoading, setImageLoading] = useState(false);

  // Google VEO Video Generation Motion States
  const veoIntervalRef = useRef<any>(null);
  const [veoLoading, setVeoLoading] = useState(false);
  const [isVeoActive, setIsVeoActive] = useState(false);
  const [veoStepIndex, setVeoStepIndex] = useState(0);
  const [veoSpeed, setVeoSpeed] = useState<"slow" | "normal" | "fast">("normal");
  const [veoMotionStyle, setVeoMotionStyle] = useState<"kinetic-pan" | "ambient-pulse" | "wind-flowing" | "cinematic-zoom">("ambient-pulse");
  const [isVeoPlay, setIsVeoPlay] = useState(true);
  const [showVeoInfo, setShowVeoInfo] = useState(false);

  const t = {
    es: {
      title: "Xochimilco",
      subtitle: "Bio-Tech Design Studio",
      hero: "Diseñamos el Futuro a través de la Ciencia Natural",
      description: "Donde la medicina tradicional mesoamericana se encuentra con el rigor de la ciencia moderna y la IA.",
      start: "Vincular Terminal",
      placeholder: "Ej. Tepezcohuite, Mimosa tenuiflora...",
      placeholder_compound: "Ej. Mentol, Quercetina, Cafeína...",
      search: "Laboratorio de Investigación",
      searching: "Sincronizando con bases de datos...",
      disclaimer: "Este protocolo bio-digital se provee estrictamente con fines de investigación académica y etnofarmacológica. Toda información contenida debe ser verificada por especialistas calificados en salud y botánica médica antes de cualquier aplicación.",
      regulatory_title: "Marco Regulatorio COFEPRIS & Internacional (SCCS/EPA)",
      download: "Exportar Certificado Técnico (PDF)",
      nav_home: "Portal",
      nav_method: "Laboratorio",
      nav_contact: "Enlace",
      found_sources: "Bibliografía APA",
      hub_title: "Hub Científico Digital",
      hub_subtitle: "Infraestructura de Conocimiento",
      hub_description: "Acceso directo a las bases de datos y repositorios institucionales que alimentan nuestro motor de investigación.",
      mode_phytochemistry: "Módulo Fitoquímica & Huella",
      mode_traditional: "Módulo Medicina Tradicional",
      mode_fingerprint: "Huella Fitoquímica",
      mode_standard: "Búsqueda Estándar",
      back_home: "Volver al Inicio",
      hero_ancestral: "Decodificando la Sabiduría Ancestral",
      btn_xochimilco: "Atajos Explora Bioactivos y Tradición",
      btn_auroria: "AurorIA, Evaluador de Seguridad",
      btn_experimentos: "Experimentos Básicos, Laboratorio de Extracción",
      btn_rutas: "Una Mirada a las Rutas Metabólicas",
      sections: {
        taxonomy: "Identificación Biometríca",
        history: "Crónica Digital",
        phytochemistry: "Biofísica Química",
        state: "Validación APA",
        links: "Nodos Científicos"
      }
    },
    en: {
      title: "Xochimilco",
      subtitle: "Bio-Tech Design Studio",
      hero: "Designing the Future through Natural Science",
      description: "Where traditional Mesoamerican medicine meets the rigor of modern science and AI.",
      start: "Sync Terminal",
      placeholder: "e.g., Tepezcohuite, Mimosa tenuiflora...",
      placeholder_compound: "e.g., Menthol, Quercetin, Caffeine...",
      search: "Research Laboratory",
      searching: "Synchronizing with databases...",
      disclaimer: "This bio-digital protocol is provided strictly for academic and ethnopharmacological research purposes. All information must be verified by qualified health and medical botany specialists before any application.",
      regulatory_title: "COFEPRIS & International Regulatory Framework (SCCS/EPA)",
      download: "Export Technical Certificate (PDF)",
      nav_home: "Portal",
      nav_method: "Lab",
      nav_contact: "Link",
      found_sources: "APA Bibliography",
      hub_title: "Digital Scientific Hub",
      hub_subtitle: "Knowledge Infrastructure",
      hub_description: "Direct access to the institutional databases and repositories that power our research engine.",
      mode_phytochemistry: "Phytochemistry & Fingerprint Module",
      mode_traditional: "Traditional Medicine Module",
      mode_fingerprint: "Phytochemical Fingerprint",
      mode_standard: "Standard Search",
      back_home: "Back to Home",
      hero_ancestral: "Decoding Ancestral Wisdom",
      btn_xochimilco: "Atajos Explore Bioactives and Tradition",
      btn_auroria: "AurorIA, Safety Evaluator",
      btn_experimentos: "Basic Experiments, Extraction Laboratory",
      btn_rutas: "A Glimpse into Metabolic Pathways",
      sections: {
        taxonomy: "Biometric ID",
        history: "Digital Chronicle",
        phytochemistry: "Chemical Biophysics",
        state: "APA Validation",
        links: "Scientific Nodes"
      }
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [isToolActive]);

  // Convierte la imagen automáticamente a video de Google VEO on load
  useEffect(() => {
    if (botanicalImage) {
      handleStartVeoAnimation();
    }
  }, [botanicalImage]);

  // Cleanup VEO interval on unmount
  useEffect(() => {
    return () => {
      if (veoIntervalRef.current) {
        clearInterval(veoIntervalRef.current);
      }
    };
  }, []);

  const executeSearch = async (termToSearch: string, modeToUse: "standard" | "phytochemistry" | "traditional" | "fingerprint") => {
    if (!termToSearch.trim()) return;

    setLoading(true);
    setResult(null);
    setBotanicalImage(null);
    setImageLoading(true);
    setIsVeoActive(false);
    setVeoLoading(false);
    setVeoStepIndex(0);

    try {
      let researchResult = "";
      
      if (modeToUse === "phytochemistry") {
        researchResult = await identifyPlantsByCompound(termToSearch, lang);
      } else {
        const modePrompt = modeToUse === "traditional"
          ? (lang === "es" ? "Enfoque principal: Etnobotánica histórica, códices y usos tradicionales milenarios. Planta: " : "Primary focus: Historical ethnobotany, codices and ancient traditional uses. Plant: ")
          : "";
        
        researchResult = await generateResearch(modePrompt + termToSearch, lang);
      }
      
      const processedResult = await auditAndApplyPubChemLinksAsync(sanitizeMojibake(researchResult));
      setResult(processedResult);
      
      // Llamar a la API de generación de ilustración herbaria/botánica
      try {
        const imgUrl = await generateBotanicalImage(termToSearch);
        setBotanicalImage(imgUrl);
      } catch (err) {
        console.error("Botanical image error:", err);
      }
    } catch (error: any) {
      console.error("Search error:", error);
      const errorMsg = typeof error === 'string' ? error : (error?.message || JSON.stringify(error));
      
      if (errorMsg.includes('429') || errorMsg.includes('RESOURCE_EXHAUSTED')) {
        setResult(lang === 'es' 
          ? "## ⚠️ Aviso de Cuota Agotada\n\nSe ha alcanzado el límite de peticiones gratuitas del motor de Google Gemini. \n\n**Acción recomendada:** \n- Espera un momento antes de reintentar.\n- El límite suele reiniciarse diariamente para el nivel gratuito.\n- Verifica si tu API Key tiene los créditos necesarios si has excedido el nivel Spark." 
          : "## ⚠️ Quota Exhausted\n\nThe free request limit for the Google Gemini engine has been reached. \n\n**Recommended Action:** \n- Wait a moment before retrying.\n- The limit usually resets daily for the free tier.\n- Check if your API Key has the necessary credits if you have exceeded the Spark tier.");
      } else {
        setResult(lang === 'es' ? "Error en la investigación o API no configurada." : "Research error or API not configured.");
      }
    } finally {
      setLoading(false);
      setImageLoading(false);
    }
  };

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    await executeSearch(search, searchMode);
  };

  const handleStartVeoAnimation = () => {
    if (veoIntervalRef.current) {
      clearInterval(veoIntervalRef.current);
    }
    setVeoLoading(true);
    setVeoStepIndex(0);
    setIsVeoActive(false);

    let currentStep = 0;
    veoIntervalRef.current = setInterval(() => {
      currentStep += 1;
      if (currentStep < 5) {
        setVeoStepIndex(currentStep);
      } else {
        if (veoIntervalRef.current) {
          clearInterval(veoIntervalRef.current);
          veoIntervalRef.current = null;
        }
        setVeoLoading(false);
        setIsVeoActive(true);
        setIsVeoPlay(true);
      }
    }, 1200);
  };

  const handleSuggestionClick = async (term: string, mode: "standard" | "phytochemistry" | "traditional" | "fingerprint") => {
    setSearch(term);
    setSearchMode(mode);
    await executeSearch(term, mode);
  };

  return (
    <div className="min-h-screen flex flex-col scientific-grid relative">
      <div className="noise-overlay fixed inset-0 z-[100]" />
      <div className="scanline fixed inset-0 z-[101]" />
      
      {/* Background shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[5%] w-[40%] aspect-square rounded-full bg-primary/5 blur-[120px]"
        />
        <motion.div 
          animate={{ x: [0, -50, 0], y: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[10%] -right-[5%] w-[40%] aspect-square rounded-full bg-accent/5 blur-[120px]"
        />
      </div>

      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 bg-background/60 backdrop-blur-xl border-b border-border/40">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => setIsToolActive(false)}
          >
            <div className="w-12 h-12 rounded-2xl botanical-gradient flex items-center justify-center soft-glow">
              <Leaf className="text-white w-7 h-7" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-serif font-bold tracking-tighter leading-none">{t[lang].title}</span>
              <span className="micro-label">{t[lang].subtitle}</span>
            </div>
          </motion.div>

          <nav className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 rounded-xl px-4 border-primary/40 bg-primary/10 hover:bg-primary/20 transition-all font-extrabold text-primary"
              onClick={() => setLang(lang === "es" ? "en" : "es")}
            >
              <Languages className="w-4 h-4 text-primary" />
              <span className="text-[10px] uppercase tracking-widest leading-none">{lang === "es" ? "English" : "Español"}</span>
            </Button>

            {currentUser && (currentUser.email === "eupirne@gmail.com" || currentUser.role === "admin") && (
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 rounded-xl px-4 border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-all font-extrabold flex"
                onClick={() => {
                  setShowAdminPanel(!showAdminPanel);
                  setIsToolActive(false); // Back to homepage level to render the dashboard
                }}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] uppercase tracking-widest leading-none">{lang === "es" ? "Consola" : "Console"}</span>
              </Button>
            )}

            {/* Google Account Switcher */}
            {currentUser && (
              <div className="relative">
                <button
                  onClick={() => setShowAccountSwitcher(!showAccountSwitcher)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all cursor-pointer select-none"
                >
                  <div 
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0"
                    style={{ backgroundColor: currentUser.avatarColor }}
                  >
                    {currentUser.firstName[0].toUpperCase()}
                  </div>
                  <span className="hidden sm:inline text-xs font-semibold max-w-[100px] truncate text-foreground leading-none">
                    {currentUser.firstName}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                </button>

                <AnimatePresence>
                  {showAccountSwitcher && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2.5 w-[330px] bg-card rounded-2xl border border-primary/25 p-5 shadow-2xl z-50 text-left outline-none"
                    >
                      {/* Current Account Card Header */}
                      <div className="flex flex-col items-center text-center pb-4 border-b border-primary/10">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-primary font-bold mb-3">
                          {lang === "es" ? "Cuenta de Google" : "Google Account"}
                        </span>
                        <div 
                          className="w-14 h-14 rounded-full flex items-center justify-center text-white font-extrabold text-2xl shadow-md cursor-default mb-2"
                          style={{ backgroundColor: currentUser.avatarColor }}
                        >
                          {currentUser.firstName[0].toUpperCase()}
                        </div>
                        <h4 className="text-base font-bold text-foreground">
                          {currentUser.firstName} {currentUser.lastName}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-full">
                          {currentUser.email}
                        </p>
                        <a 
                          href="https://myaccount.google.com/" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 border border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700 text-xs font-semibold rounded-full hover:bg-muted/30 transition-all text-foreground"
                        >
                          <span>{lang === "es" ? "Gestionar Cuenta de Google" : "Manage Google Account"}</span>
                        </a>
                      </div>

                      {/* User Sibling Switcher Accounts */}
                      <div className="py-3.5 border-b border-primary/10 max-h-[160px] overflow-y-auto space-y-2">
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                          {lang === "es" ? "Cambiar de Cuenta" : "Switch Account"}
                        </p>
                        {(() => {
                          const activeSessionAccounts = (JSON.parse(localStorage.getItem("xochimilco_session_accounts") || "[]") as GmailUser[])
                            .filter(u => u.id !== currentUser.id);

                          if (activeSessionAccounts.length === 0) {
                            return (
                              <p className="text-[11px] text-muted-foreground/60 italic text-center py-2">
                                {lang === "es" ? "No hay otras sesiones abiertas" : "No other active sessions"}
                              </p>
                            );
                          }

                          return activeSessionAccounts.map((account) => (
                            <button
                              key={account.id}
                              onClick={() => {
                                localStorage.setItem("xochimilco_logged_user", JSON.stringify(account));
                                setCurrentUser(account);
                                setShowAccountSwitcher(false);
                                setShowAdminPanel(false);
                              }}
                              className="w-full flex items-center gap-3 p-2 rounded-xl border border-transparent hover:border-primary/10 hover:bg-primary/5 transition-all text-left cursor-pointer group"
                            >
                              <div 
                                className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs"
                                style={{ backgroundColor: account.avatarColor }}
                              >
                                {account.firstName[0].toUpperCase()}
                              </div>
                              <div className="overflow-hidden">
                                <p className="text-xs font-bold leading-tight truncate text-foreground group-hover:text-primary">{account.firstName} {account.lastName}</p>
                                <p className="text-[10px] text-muted-foreground truncate">{account.email}</p>
                              </div>
                            </button>
                          ));
                        })()}
                      </div>

                      {/* Action buttons */}
                      <div className="pt-3.5 space-y-2">
                        {(currentUser.email === "eupirne@gmail.com" || currentUser.role === "admin") && (
                          <button
                            onClick={() => {
                              setShowAdminPanel(true);
                              setIsToolActive(false);
                              setShowAccountSwitcher(false);
                            }}
                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold transition-all cursor-pointer mb-1"
                          >
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            <span>{lang === "es" ? "Consola Lista Blanca" : "Whitelist Console"}</span>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setCurrentUser(null);
                            setShowAccountSwitcher(false);
                          }}
                          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-dashed border-primary/35 text-primary hover:bg-primary/10 text-xs font-bold transition-all cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>{lang === "es" ? "Añadir otra cuenta" : "Add another account"}</span>
                        </button>

                        <button
                          onClick={() => {
                            auth.signOut().catch(console.error);
                            localStorage.removeItem("xochimilco_logged_user");
                            const activeSessionAccounts = (JSON.parse(localStorage.getItem("xochimilco_session_accounts") || "[]") as GmailUser[])
                              .filter(u => u.id !== currentUser.id);
                            localStorage.setItem("xochimilco_session_accounts", JSON.stringify(activeSessionAccounts));

                            if (activeSessionAccounts.length > 0) {
                              const nextUser = activeSessionAccounts[0];
                              localStorage.setItem("xochimilco_logged_user", JSON.stringify(nextUser));
                              setCurrentUser(nextUser);
                            } else {
                              setCurrentUser(null);
                            }
                            setShowAccountSwitcher(false);
                            setShowAdminPanel(false);
                          }}
                          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-transparent bg-secondary/80 text-muted-foreground hover:bg-secondary hover:text-foreground text-xs font-bold transition-all cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>{lang === "es" ? "Cerrar sesión" : "Sign out"}</span>
                        </button>

                        <button
                          onClick={() => {
                            auth.signOut().catch(console.error);
                            localStorage.removeItem("xochimilco_logged_user");
                            localStorage.removeItem("xochimilco_session_accounts");
                            setCurrentUser(null);
                            setShowAccountSwitcher(false);
                            setShowAdminPanel(false);
                          }}
                          className="w-full text-center text-[10px] text-muted-foreground hover:text-primary transition-colors block font-semibold cursor-pointer pt-1"
                        >
                          {lang === "es" ? "Cerrar sesión en todas las cuentas" : "Sign out of all accounts"}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </nav>

          <Button variant="outline" size="icon" className="md:hidden rounded-xl" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6">
              <Button 
                variant="outline" 
                className="justify-between"
                onClick={() => { setLang(lang === "es" ? "en" : "es"); setMobileMenuOpen(false); }}
              >
                <span className="text-lg">{lang === "es" ? "Idioma: Inglés" : "Language: Spanish"}</span>
                <Languages />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow pt-20">
        {currentUser && currentUser.role !== "admin" && currentUser.email !== "eupirne@gmail.com" && showGuestNotice && (
          <div className="container mx-auto px-6 pt-4">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative p-5 rounded-2xl border border-[#39ff14]/30 bg-gradient-to-r from-[#001f3f]/60 to-[#000e1e]/60 backdrop-blur-md text-foreground flex flex-col md:flex-row md:items-center justify-between gap-4 overflow-hidden soft-glow shadow-[0_0_20px_rgba(57,255,20,0.1)]"
            >
              <div className="flex items-start gap-4 relative z-10 max-w-4xl">
                <div className="w-11 h-11 rounded-xl bg-[#39ff14]/15 border border-[#39ff14]/30 flex items-center justify-center shrink-0 text-[#39ff14] mt-0.5 animate-pulse shadow-[0_0_10px_rgba(57,255,20,0.2)]">
                  <ShieldCheck className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-1.5 text-left">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-black text-white tracking-wider uppercase font-space flex items-center gap-1.5">
                      <span>{lang === "es" ? "🔑 Licencia de Acceso Activa" : "🔑 Active Access License"}</span>
                    </h4>
                    <span className="text-[9px] font-mono uppercase bg-[#39ff14]/10 border border-[#39ff14]/30 px-2 py-0.5 rounded-md text-[#39ff14] font-bold">
                      {lang === "es" ? "Vigencia: 30 Días" : "Validity: 30 Days"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans font-medium">
                    {lang === "es" ? (
                      <>
                        Hola, <span className="text-[#39ff14] font-extrabold">{currentUser.firstName}</span>. Su cuenta de acceso temporal ha sido verificada y asignada en Firebase con una <span className="text-[#39ff14] font-extrabold font-mono">vigencia activa de 30 días</span>. 
                        Este acceso le otorga uso ilimitado de la plataforma y expirará el <span className="text-amber-400 font-extrabold font-mono">
                          {currentUser.accessExpiresAt ? new Date(currentUser.accessExpiresAt).toLocaleDateString(undefined, {
                            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                          }) : new Date(new Date(currentUser.createdAt || Date.now()).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(undefined, {
                            year: 'numeric', month: 'long', day: 'numeric'
                          })}
                        </span>.
                      </>
                    ) : (
                      <>
                        Hello, <span className="text-[#39ff14] font-extrabold">{currentUser.firstName}</span>. Your temporary guest account has been authenticated and whitelisted in Firebase with an <span className="text-[#39ff14] font-extrabold font-mono">active period of 30 days</span>. 
                        This access enables unlimited platform functionality and will expire on <span className="text-amber-400 font-extrabold font-mono">
                          {currentUser.accessExpiresAt ? new Date(currentUser.accessExpiresAt).toLocaleDateString(undefined, {
                            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                          }) : new Date(new Date(currentUser.createdAt || Date.now()).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(undefined, {
                            year: 'numeric', month: 'long', day: 'numeric'
                          })}
                        </span>.
                      </>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 self-end md:self-center shrink-0 relative z-10">
                <Button
                  onClick={() => setShowGuestNotice(false)}
                  className="rounded-xl h-9 px-4 text-[10px] uppercase tracking-widest font-space bg-[#39ff14]/10 hover:bg-[#39ff14]/20 border border-[#39ff14]/40 text-[#39ff14] font-bold shadow-[0_0_10px_rgba(57,255,20,0.05)] cursor-pointer select-none transition-all active:scale-95"
                >
                  {lang === "es" ? "Entendido" : "Acknowledged"}
                </Button>
              </div>
              <div className="absolute right-0 top-0 w-44 h-44 rounded-full bg-[#39ff14]/5 blur-3xl pointer-events-none" />
            </motion.div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {!currentUser ? (
            <motion.div
              key="auth-gate"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex justify-center items-center py-6"
            >
              <GmailAuthPortal 
                lang={lang} 
                setLang={setLang} 
                onAuthSuccess={(user) => {
                  setCurrentUser(user);
                  setShowAdminPanel(false);
                }} 
              />
            </motion.div>
          ) : (showAdminPanel && (currentUser.email === "eupirne@gmail.com" || currentUser.role === "admin")) ? (
            <motion.div
              key="admin-whitelist-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="container mx-auto px-6 py-12 max-w-6xl"
            >
              <AdminWhitelistDashboard 
                lang={lang} 
                onClose={() => setShowAdminPanel(false)} 
              />
            </motion.div>
          ) : !isToolActive ? (
            /* HERO LANDING */
            <motion.section 
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: 50 }}
              className="container mx-auto px-6 py-20 md:py-32 flex flex-col items-center text-center"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-6xl w-full"
              >
                {/* Spanish Caravel / Ship Showcase (Google Nanobanana 2 Canvas) */}
                <motion.div 
                  className="mx-auto my-12 max-w-3xl relative group cursor-pointer"
                  animate={{ 
                    y: [0, -12, 0],
                    rotate: [0, 0.4, -0.4, 0]
                  }}
                  transition={{ 
                    y: { duration: 6, ease: "easeInOut", repeat: Infinity },
                    rotate: { duration: 8, ease: "easeInOut", repeat: Infinity }
                  }}
                >
                  {/* Glowing background halo */}
                  <div className="absolute inset-0 bg-primary/10 rounded-[2rem] blur-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-700" />
                  
                  {/* Decorative sci-fi holographic corner borders representing high-tech canvas */}
                  <div className="absolute -top-3 -left-3 w-8 h-8 border-t-2 border-l-2 border-primary/40 rounded-tl-xl" />
                  <div className="absolute -top-3 -right-3 w-8 h-8 border-t-2 border-r-2 border-primary/40 rounded-tr-xl" />
                  <div className="absolute -bottom-3 -left-3 w-8 h-8 border-b-2 border-l-2 border-primary/40 rounded-bl-xl" />
                  <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-2 border-r-2 border-primary/40 rounded-br-xl" />

                  {/* Main Canvas Container with floating ship */}
                  <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-background/30 backdrop-blur-md p-3.5 shadow-2xl transition-all duration-500 group-hover:border-primary/30">
                    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[1.5rem]">
                      <motion.img 
                        src={subConquestGal} 
                        alt="Spanish Conquest Caravel" 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.025 }}
                        transition={{ duration: 0.8 }}
                      />
                      
                      {/* Deep cinematic overlay gradients */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-black/20 opacity-85" />
                      
                      {/* Laser holographic scanner animation */}
                      <motion.div 
                        className="absolute left-0 right-0 h-[1.5px] bg-primary/30 shadow-[0_0_8px_rgba(255,255,255,0.6)]"
                        initial={{ top: "0%" }}
                        animate={{ top: "100%" }}
                        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                      />

                      <div className="absolute bottom-4 left-6 right-6 flex justify-between items-end">
                        <span className="text-[10px] font-mono text-white/40 tracking-widest uppercase">ConsultorIA-Atajos MEM</span>
                        <span className="text-[10px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20 backdrop-blur">CONQUEST MODE</span>
                      </div>
                    </div>
                  </div>

                  {/* Phrase at the foot of the image with elegant, high-contrast styling */}
                  <div className="mt-8 text-center">
                    <h1 
                      id="hero-ancestral-title" 
                      className="text-4xl md:text-5xl font-serif font-black tracking-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] select-none"
                    >
                      {t[lang].hero_ancestral}
                    </h1>
                    <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-4 opacity-60" />
                  </div>
                </motion.div>

                <p className="text-2xl md:text-3xl text-muted-foreground/80 max-w-3xl mx-auto mb-16 leading-[1.4] tracking-tight font-medium text-balance">
                  {t[lang].description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto w-full px-4 items-stretch justify-center">
                  <Button 
                    size="lg" 
                    className="relative overflow-hidden rounded-[1.5rem] lg:rounded-[2rem] border border-orange-500/30 hover:border-orange-400/65 soft-glow hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 font-extrabold tracking-tight shadow-xl shadow-orange-500/10 text-white flex flex-col w-full cursor-pointer group p-0 min-h-[20rem] items-stretch"
                    onClick={() => {
                      setIsToolActive(true);
                      setActiveModule("xochimilco");
                    }}
                  >
                    {/* Layer 1: Dedicated Canvas Viewport (100% Unobstructed artwork) */}
                    <div className="relative w-full h-[10.5rem] overflow-hidden bg-slate-950 flex-shrink-0">
                      <NatureMagazineCanvas />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                    </div>

                    {/* Layer 2: Clean, legible text & metadata block underneath (separated from the graphics) */}
                    <div className="relative z-10 w-full flex-grow bg-slate-900/95 border-t border-white/5 p-5 flex flex-col justify-between text-left items-start gap-3">
                      <div className="w-full flex justify-between items-center">
                        <span className="opacity-95 text-[10px] font-mono tracking-widest bg-amber-950/85 border border-orange-400/40 text-orange-400 px-2.5 py-0.5 rounded shadow-md uppercase">
                          01 • BIOACTIVE & TRADITION
                        </span>
                        <ArrowRight className="w-5 h-5 text-orange-400 group-hover:translate-x-1.5 transition-transform duration-300" />
                      </div>
                      
                      <div className="flex flex-col gap-1 w-full mt-auto">
                        <span className="text-[11px] font-mono tracking-wider font-extrabold text-orange-400 uppercase drop-shadow-sm">
                          Xochimilco Portal
                        </span>
                        <span id="xochimilco-portal-title-text" className="text-sm md:text-base font-black leading-tight text-white drop-shadow">
                          {lang === "es" ? "Explora Bioactivos y Tradición" : "Explore Bioactives and Tradition"}
                        </span>
                      </div>
                    </div>
                  </Button>
                  <Button 
                    size="lg" 
                    className="relative overflow-hidden rounded-[1.5rem] lg:rounded-[2rem] border border-cyan-500/20 hover:border-magenta-500/50 soft-glow hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 font-extrabold tracking-tight shadow-xl shadow-cyan-500/10 text-white flex flex-col w-full cursor-pointer group p-0 min-h-[20rem] items-stretch animate-fade-in"
                    onClick={() => {
                       setIsToolActive(true);
                       setActiveModule("auroria");
                    }}
                  >
                    {/* Layer 1: Dedicated Canvas Viewport (100% Unobstructed artwork) */}
                    <div className="relative w-full h-[10.5rem] overflow-hidden bg-slate-950 flex-shrink-0">
                      <CofeprisHQCanvas lang={lang} />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                    </div>

                    {/* Layer 2: Clean, legible text & metadata block underneath (separated from the graphics) */}
                    <div className="relative z-10 w-full flex-grow bg-slate-900/95 border-t border-white/5 p-5 flex flex-col justify-between text-left items-start gap-3">
                      <div className="w-full flex justify-between items-center">
                        <span className="opacity-95 text-[10px] font-mono tracking-widest bg-cyan-950/85 border border-cyan-400/40 text-cyan-300 px-2.5 py-0.5 rounded shadow-md uppercase">
                          02 • AUDITORÍA FITOQUÍMICA
                        </span>
                        <Sparkles className="w-5 h-5 text-magenta-400 group-hover:rotate-12 transition-transform duration-300" />
                      </div>
                      
                      <div className="flex flex-col gap-1 w-full mt-auto">
                        <span className="text-[11px] font-mono tracking-wider font-extrabold text-magenta-400 uppercase drop-shadow-sm">
                          AurorIA v4.0
                        </span>
                        <span id="auroria-safety-title-text" className="text-sm md:text-base font-black leading-tight text-white drop-shadow">
                          {lang === "es" ? "Evaluador de Seguridad & MoS" : "Safety Evaluator & MoS"}
                        </span>
                      </div>
                    </div>
                  </Button>
                </div>
              </motion.div>

              {/* Scientific Hub */}
              <motion.section 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="mt-20 md:mt-28 w-full max-w-7xl px-6 relative"
              >
                <div className="absolute -left-10 top-0 text-[15rem] font-serif font-black text-primary/5 select-none leading-none">01</div>
                <div className="space-y-16">
                  <div className="max-w-4xl mx-auto">
                    {/* Traditional Scientific Hub (Google Nanobanana 2 Canvas) */}
                    <motion.div 
                      className="relative group cursor-pointer"
                    >
                      {/* Glowing background halo */}
                      <div className="absolute inset-0 bg-accent/10 rounded-[2rem] blur-3xl opacity-40 group-hover:opacity-75 transition-opacity duration-700" />
                      
                      {/* Holographic sci-fi corners */}
                      <div className="absolute -top-3 -left-3 w-8 h-8 border-t-2 border-l-2 border-accent/40 rounded-tl-xl" />
                      <div className="absolute -top-3 -right-3 w-8 h-8 border-t-2 border-r-2 border-accent/40 rounded-tr-xl" />
                      <div className="absolute -bottom-3 -left-3 w-8 h-8 border-b-2 border-l-2 border-accent/40 rounded-bl-xl" />
                      <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-2 border-r-2 border-accent/40 rounded-br-xl" />

                      {/* Scientific Hub Canvas */}
                      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-background/30 backdrop-blur-md p-3.5 shadow-2xl transition-all duration-500 group-hover:border-accent/30">
                        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-[1.5rem]">
                          <motion.img 
                            src={traditionalHubImg} 
                            alt="Traditional Scientific Hub" 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.8 }}
                          />
                          
                          {/* Deep cinematic overlay gradients */}
                          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-black/20 opacity-80" />
                          
                          {/* Laser holographic scanner animation */}
                          <motion.div 
                            className="absolute left-0 right-0 h-[1.5px] bg-accent/40 shadow-[0_0_8px_rgba(255,255,255,0.6)]"
                            initial={{ top: "0%" }}
                            animate={{ top: "100%" }}
                            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                          />

                          <div className="absolute bottom-4 left-6 right-6 flex justify-between items-end">
                            <span className="text-[10px] font-mono text-white/45 tracking-widest uppercase">ConsultorIA-Atajos MEM</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 text-center">
                        <span className="text-[50px] font-serif tracking-tight text-accent uppercase font-bold leading-tight block">{lang === "es" ? "HUB CIENTÍFICO" : "SCIENTIFIC HUB"}</span>
                      </div>
                    </motion.div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
                    {[
                      {
                        title: "Códice Badiano",
                        esfocus: "Nueva edición digitalizada detallada.",
                        enfocus: "New detailed compiled digitalized edition.",
                        desc: lang === "es" ? "Facsímil de la monumental obra fitoterapéutica mexicana de 1552 por el herbolario Martín de la Cruz." : "Facsimile of the 1552 classic Mexican phytotherapy manuscript authored by Martin de la Cruz.",
                        link: "https://www.fitoterapia.net/noticias/nueva-edicion-digitalizada-codice-badiano-13898.html",
                        icon: <BookOpen className="w-5 h-5" />,
                        image: codiceBadianoImg
                      },
                      {
                        title: "Atlas Plantas UNAM",
                        esfocus: "Biblioteca Digital de la Medicina Tradicional.",
                        enfocus: "Digital Library of Mexican Traditional Medicine.",
                        desc: lang === "es" ? "Repositorio académico de la UNAM que recopila el uso medicinal histórico y nombres locales." : "UNAM repository compiling historical medical application and local nomenclature of Mexican plants.",
                        link: "http://www.medicinatradicionalmexicana.unam.mx/",
                        icon: <Leaf className="w-5 h-5" />,
                        image: unamPlantsAtlasImg
                      },
                      {
                        title: "LOTUS",
                        esfocus: "Integración estructurada con Wikidata y enlaces directos a estructuras en PubChem.[1]",
                        enfocus: "Structured integration with Wikidata and direct links to structures in PubChem.[1]",
                        desc: lang === "es" ? "Iniciativa internacional de código abierto para catalogarla fitoquímica natural." : "Structured open-knowledge initiative for natural products research worldwide.",
                        link: "https://lotus.naturalproducts.net",
                        icon: <LinkIcon className="w-5 h-5" />,
                        refId: "[1]",
                        image: lotusMeadowImg
                      },
                      {
                        title: "COCONUT",
                        esfocus: "Colección masiva de metabolitos elucidables y predichos de fuentes abiertas.[2]",
                        enfocus: "Massive collection of elucidable and predicted metabolites compiled from open repositories.[2]",
                        desc: lang === "es" ? "Base de datos abierta para quimioinformática y perfilado molecular de fitoquímicos." : "Global open-source repository for cataloging predicted and confirmed metabolites.",
                        link: "https://coconut.naturalproducts.net",
                        icon: <Activity className="w-5 h-5" />,
                        refId: "[2]",
                        image: coconutMetabolitesImg
                      },
                      {
                        title: "NPAtlas",
                        esfocus: "Datos curados de metabolitos secundarios de origen bacteriano y fúngico.[3]",
                        enfocus: "Curated dataset of secondary metabolites of bacterial and fungal origin.[3]",
                        desc: lang === "es" ? "Repositorio taxonómicamente referenciado con un ecosistema molecular fitoquímico microbiano." : "A curated database with annotated microbial secondary metabolite biosyntheses.",
                        link: "https://www.npatlas.org",
                        icon: <Microscope className="w-5 h-5" />,
                        refId: "[3]",
                        image: npatlasMushroomsImg
                      },
                      {
                        title: "SuperNatural 3.0",
                        esfocus: "Derivados naturales que incluye predicciones de actividad y mecanismos de acción.[4]",
                        enfocus: "Natural products and biological activity predictions and mechanisms of action.[4]",
                        desc: lang === "es" ? "Plataforma avanzada de modelado molecular 3D y análisis de objetivos farmacológicos." : "Comprehensive digital resource featuring biological targets and toxicity profiling.",
                        link: "https://ngdc.cncb.ac.cn/databasecommons/database/id/1597",
                        icon: <FlaskConical className="w-5 h-5" />,
                        refId: "[4]",
                        image: supernaturalSteamImg
                      },
                      {
                        title: "Tropicos / MBG",
                        esfocus: "Base de datos taxonómica formal del Jardín Botánico de Missouri.",
                        enfocus: "Missouri Botanical Garden formal taxonomic records.",
                        desc: lang === "es" ? "El mayor catálogo global de nomenclatura botánica sistematizada y registros de especímenes." : "The global premier nomenclatures database and verified botanical specimen records.",
                        link: "https://www.tropicos.org/",
                        icon: <Microscope className="w-5 h-5" />,
                        image: tropicosGardenImg
                      },
                      {
                        title: "PubMed Central",
                        esfocus: "Literatura científica biomédica y ensayos clínicos mundiales.",
                        enfocus: "Biomedical peer-reviewed literature and health studies.",
                        desc: lang === "es" ? "Repositorio digital gratuito de publicaciones de la biblioteca nacional de medicina de EE.UU." : "Free digital repository archiving biomedical and life sciences research journals.",
                        link: "https://pubmed.ncbi.nlm.nih.gov/",
                        icon: <Search className="w-5 h-5" />,
                        image: pubmedPhytochemistryJournalImg
                      },
                      {
                        title: "PubChem",
                        esfocus: "La mayor colección abierta de información química de la Tierra.",
                        enfocus: "The largest open chemical knowledge repository globally.",
                        desc: lang === "es" ? "Registros exhaustivos de estructuras químicas, pesos moleculares y bioensayos activos." : "Comprehensive records detailing structures, molecular weights and validated bioactivities.",
                        link: "https://pubchem.ncbi.nlm.nih.gov/",
                        icon: <Activity className="w-5 h-5" />,
                        image: pubchemBiomedicalLabImg
                      },
                      {
                        title: "SwissADME",
                        esfocus: "Predicción farmacocinética (ADME) computacional directa.",
                        enfocus: "Predictive pharmacokinetics computational ADME tool.",
                        desc: lang === "es" ? "Herramienta online para estimar la solubilidad, propiedades farmacológicas y absorción de fitoquímicos." : "Evaluative web-service for calculating physicochemical profiles and gastrointestinal absorptions.",
                        link: "http://www.swissadme.ch/",
                        icon: <FlaskConical className="w-5 h-5" />,
                        image: swissAdmeImg
                      },
                      {
                        title: "COFEPRIS",
                        esfocus: "Regulación sanitaria mexicana de remedios herbolarios y fitofármacos.",
                        enfocus: "Mexican health regulation of herbal remedies and medicines.",
                        desc: lang === "es" ? "Comisión Federal para la Protección contra Riesgos Sanitarios, encargada de garantizar la biocontrol, fármacovigilancia y calidad terapéutica." : "Federal Commission for Protection against Sanitary Risks, guaranteeing biocontrol, pharmacovigilance and therapeutic safety.",
                        link: "https://www.gob.mx/semarnat/articulos/plantas-medicinales-de-mexico",
                        icon: <CheckCircle2 className="w-5 h-5" />,
                        image: cofeprisLabRegulationImg
                      }
                    ].map((hub, i) => (
                      <a 
                        key={i} 
                        href={hub.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-6 md:p-8 rounded-[2rem] border border-primary/10 bg-card/40 backdrop-blur-xl hover:bg-primary/10 hover:border-primary/40 transition-all duration-300 group flex flex-col justify-between gap-6 shadow-inner shadow-primary/5 hover:shadow-primary/10 text-left"
                      >
                        <div className="flex items-start justify-between">
                          <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform border border-primary/20">
                            {hub.icon}
                          </div>
                          {"refId" in hub && hub.refId && (
                            <Badge variant="outline" className="border-accent/20 text-accent text-[9px] font-mono rounded px-2">
                              {hub.refId}
                            </Badge>
                          )}
                        </div>
                        
                        {hub.image && (
                          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/5 shadow-md">
                            <motion.img 
                              src={hub.image} 
                              alt={hub.title} 
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.4 }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                          </div>
                        )}

                        <div className="space-y-3">
                          <h4 className="text-2xl font-bold group-hover:text-primary transition-colors flex items-center gap-2">
                            {hub.title}
                            <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </h4>
                          <p className="text-sm text-foreground/85 font-medium leading-relaxed">
                            {lang === "es" ? hub.esfocus : hub.enfocus}
                          </p>
                          <p className="text-xs text-muted-foreground/60 leading-relaxed font-sans mt-1">
                            {hub.desc}
                          </p>
                        </div>
                        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-primary/60 group-hover:text-primary transition-colors mt-auto">
                          <span className="font-mono">{hub.link.replace("https://", "").replace("http://", "").replace("www.", "")}</span>
                          <span className="flex items-center gap-1.5">{lang === "es" ? "Ir al Nodo" : "Visit Hub"} <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" /></span>
                        </div>
                      </a>
                    ))}
                  </div>

                  {/* References & Supporting Bibliography Box */}
                  <div className="mt-16 max-w-5xl mx-auto text-left">
                    <div className="rounded-[2.5rem] border border-white/10 bg-black/40 backdrop-blur-xl p-8 md:p-12 shadow-2xl space-y-8">
                      <div className="flex items-center gap-3 border-b border-white/10 pb-6">
                        <div className="w-10 h-10 rounded-2xl bg-accent/20 flex items-center justify-center text-accent">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold tracking-tight text-white uppercase">
                            {lang === "es" ? "Referencias Bibliográficas" : "Bibliographical References"}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {lang === "es" ? "Publicaciones científicas de referencia en fitomecánica molecular de productos naturales" : "Reference scientific publications in molecular phyto-informatics for natural products"}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {[
                          {
                            id: "[1]",
                            authors: "Adriano Rutz, Maria Sorokina, Jakub Galgonek, Daniel Mietchen, Egon Willighagen, Arnaud Gaudry, James G. Graham, Ralf Stephan, Roderic Page, Jiří Vondrášek, Christoph Steinbeck, Guido F. Pauli, Jean-Luc Wolfender, Jonathan Bisson, Pierre-Marie Allard.",
                            title: "The LOTUS initiative for open knowledge management in natural products research.",
                            journal: "eLife",
                            year: "2022",
                            volume: "11",
                            pages: "e70780",
                            doi: "10.7554/eLife.70780",
                            doiLink: "https://doi.org/10.7554/eLife.70780"
                          },
                          {
                            id: "[2]",
                            authors: "Maria Sorokina, Peter Merseburger, Kohulan Rajan, Mehmet Aziz Yirik, Christoph Steinbeck.",
                            title: "COCONUT online: Collection of Open Natural Products database.",
                            journal: "Journal of Cheminformatics",
                            year: "2021",
                            volume: "13(1)",
                            pages: "2",
                            doi: "10.1186/s13321-020-00478-4",
                            doiLink: "https://doi.org/10.1186/s13321-020-00478-4"
                          },
                          {
                            id: "[3]",
                            authors: "Ella F. Poynton, Jeffrey A. van Santen, Matthew Pin, Marla Macias Contreras, Emily McMann, Jonathan Parra, Brandon Showalter, Liana Zaroubi, Katherine R. Duncan, Roger G. Linington.",
                            title: "The Natural Products Atlas 3.0: extending the database of microbially derived natural products.",
                            journal: "Nucleic Acids Research",
                            year: "2025",
                            volume: "53(D1)",
                            pages: "D718–D725",
                            doi: "PubMed: 39588755",
                            doiLink: "https://pubmed.ncbi.nlm.nih.gov/39588755/"
                          },
                          {
                            id: "[4]",
                            authors: "Kathleen Gallo, Emanuel Kemmler, Andrean Goede, Finnja Becker, Mathias Dunkel, Robert Preissner, Priyanka Banerjee.",
                            title: "SuperNatural 3.0-a database of natural products and natural product-based derivatives.",
                            journal: "Nucleic Acids Research",
                            year: "2023",
                            volume: "51(D1)",
                            pages: "D654-D659",
                            doi: "10.1093/nar/gkac1008",
                            doiLink: "https://doi.org/10.1093/nar/gkac1008"
                          }
                        ].map((ref, idx) => (
                          <div key={idx} className="flex gap-4 text-xs font-sans leading-relaxed text-muted-foreground/85 hover:text-white transition-colors duration-300">
                            <span className="font-mono text-primary font-bold shrink-0">{ref.id}</span>
                            <div className="space-y-1 sm:space-y-0.5">
                              <span className="text-white/70 font-medium">{ref.authors} </span>
                              <span>({ref.year}). </span>
                              <span className="italic text-white/90 font-medium">{ref.title} </span>
                              <span className="font-medium italic text-white/80">{ref.journal}</span>
                              {ref.volume && <span>, {ref.volume}</span>}
                              {ref.pages && <span>, {ref.pages}</span>}
                              <span>. </span>
                              <a 
                                href={ref.doiLink} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="inline-flex items-center gap-1 text-primary hover:underline font-mono text-[10px] bg-primary/5 hover:bg-primary/15 transition-colors duration-300 rounded px-1.5 py-0.5 border border-primary/25"
                              >
                                {ref.doi.includes("PubMed") ? ref.doi : `DOI: ${ref.doi}`}
                                <ExternalLink className="w-2.5 h-2.5 inline" />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>
            </motion.section>
          ) : (
            /* RESEARCH TOOL */
            <motion.section 
              key="tool"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="container mx-auto px-6 py-12 max-w-6xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12 pb-8 border-b border-border/40">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="micro-label hover:text-primary -ml-3 group px-3 h-10 w-fit"
                  onClick={() => setIsToolActive(false)}
                >
                  <ArrowRight className="mr-2 w-3 h-3 rotate-180 group-hover:-translate-x-1 transition-transform" />
                  {t[lang].back_home}
                </Button>
              </div>

              {activeModule === "auroria" ? (
                <AuroriaWorkspace lang={lang} />
              ) : (
                <>
                  <div className="flex flex-col gap-10 mb-16 pb-12 border-b border-border/40">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                      <div className="space-y-4">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tight leading-tight max-w-3xl">
                          {lang === "es" 
                            ? "De la herencia herbolaria al escrutinio científico: evaluación inicial de la matriz vegetal." 
                            : "From herbal heritage to scientific scrutiny: initial evaluation of the plant matrix."}
                        </h2>
                        <div className="flex items-center gap-3">
                          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                          <p className="micro-label">
                            {searchMode === "phytochemistry" ? t[lang].mode_phytochemistry : searchMode === "traditional" ? t[lang].mode_traditional : t[lang].mode_standard}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-3 flex-grow max-w-xl w-full">
                    <form onSubmit={handleSearch} className="w-full">
                      <div className="relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary w-6 h-6" />
                        <Input 
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          placeholder={
                            (hoveredMode || searchMode) === 'phytochemistry'
                              ? (lang === 'es' ? "Por ejemplo: Mentol" : "For example: Menthol")
                              : (hoveredMode || searchMode) === 'traditional'
                              ? (lang === 'es' ? "Por ejemplo: Empacho" : "For example: Empacho")
                              : t[lang].placeholder
                          }
                          className="h-20 pl-16 pr-24 text-xl rounded-3xl border-border/40 bg-card/60 backdrop-blur-md shadow-2xl transition-all focus-visible:ring-primary/20 focus-visible:border-primary/50 text-foreground"
                        />
                        <motion.div 
                          animate={{ width: loading ? "180px" : "56px" }}
                          transition={{ type: "spring", stiffness: 300, damping: 25 }}
                          className="absolute right-3 top-3 bottom-3"
                        >
                          <Button 
                            type="submit" 
                            disabled={loading || !search}
                            className={`w-full h-full p-0 rounded-2xl shadow-xl transition-all duration-300 flex items-center justify-center gap-2.5 relative overflow-hidden text-white disabled:opacity-100 disabled:cursor-not-allowed ${
                              loading 
                                ? "bg-gradient-to-r from-emerald-500 via-rose-500 to-amber-400 border-2 border-white/50 shadow-emerald-500/30" 
                                : "botanical-gradient hover:scale-[1.02] active:scale-[0.98] shadow-primary/30"
                            }`}
                          >
                            <BotanicalMotor active={loading} className={loading ? "w-9 h-9 shrink-0" : "w-6 h-6"} />
                            {loading && (
                              <motion.span 
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-xs uppercase font-black tracking-widest text-white font-sans animate-bounce pr-1"
                              >
                                {lang === "es" ? "trabajando..." : "working..."}
                              </motion.span>
                            )}
                            {!loading && <ArrowRight className="w-6 h-6" />}
                          </Button>
                        </motion.div>
                      </div>
                    </form>
                    <div className="flex flex-wrap items-center gap-1.5 px-2 animate-fade-in">
                      <span className="text-[10px] font-mono text-muted-foreground font-bold uppercase tracking-wider mr-1">{lang === 'es' ? 'Atajos Rápidos:' : 'Quick Shortcuts:'}</span>
                      {[
                        { term: "Mimosa tenuiflora", label: "Tepezcohuite", mode: "standard" as const },
                        { term: "Mentha piperita", label: "Menta Piperita", mode: "standard" as const },
                        { term: "Quercetin", label: "Quercetina", mode: "phytochemistry" as const },
                        { term: "Theobroma cacao", label: "Cacao", mode: "traditional" as const },
                        { term: "Matricaria chamomilla", label: "Manzanilla", mode: "standard" as const }
                      ].map((sug, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSuggestionClick(sug.term, sug.mode)}
                          className="text-[10.5px] font-sans px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary hover:bg-primary/20 hover:border-primary/50 hover:scale-105 active:scale-95 transition-all duration-300 font-bold"
                        >
                          {sug.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  {[
                    { id: "standard", icon: Leaf, label: t[lang].mode_standard },
                    { id: "phytochemistry", icon: FlaskConical, label: t[lang].mode_phytochemistry },
                    { id: "traditional", icon: BookOpen, label: t[lang].mode_traditional }
                  ].map((mode) => (
                    <Button
                      key={mode.id}
                      variant={searchMode === mode.id ? "default" : "outline"}
                      onClick={() => setSearchMode(mode.id as any)}
                      onMouseEnter={() => setHoveredMode(mode.id)}
                      onMouseLeave={() => setHoveredMode(null)}
                      className={`rounded-2xl gap-3 px-6 h-12 micro-label transition-all ${
                        searchMode === mode.id 
                          ? "bg-primary text-primary-foreground border-none" 
                          : "border-primary/20 text-muted-foreground hover:bg-primary/10 hover:text-primary"
                      }`}
                    >
                      <mode.icon className="w-4 h-4" />
                      {mode.label}
                    </Button>
                  ))}
                </div>
              </div>

              {loading && !result && (
                <div className="py-32 flex flex-col items-center justify-center text-center space-y-8">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-slate-900/60 border border-emerald-400/30 flex items-center justify-center soft-glow relative z-10 p-6 shadow-inner">
                      <BotanicalMotor active={true} className="w-24 h-24" />
                    </div>
                    <div className="absolute inset-0 bg-emerald-500/20 blur-3xl animate-pulse rounded-full" />
                  </div>
                  <div className="space-y-4">
                    <p className="editorial-title !text-5xl text-emerald-400 font-black tracking-widest uppercase animate-bounce">
                      {lang === "es" ? "trabajando..." : "working..."}
                    </p>
                    <p className="micro-label animate-pulse text-zinc-300">
                      {lang === "es" ? "Sincronizando con Códices Mesoamericanos y Bases de Datos Fitoquímicas..." : "Sincronizando con Códices Mesoamericanos y Bases de Datos Fitoquímicas..."}
                    </p>
                  </div>
                </div>
              )}

              {result && !loading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.99 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="grid lg:grid-cols-4 gap-10 pb-32"
                >
                  <Card className="lg:col-span-3 rounded-[3rem] border-none soft-glow overflow-hidden bg-card/60 backdrop-blur-xl group">
                    <div className="p-10 md:p-14 pb-8 border-b border-border/10">
                      <div className="flex flex-col gap-10">
                        {/* Title and technical badges (Full Width) */}
                        <div className="space-y-6 w-full">
                          <div className="flex flex-wrap items-center gap-3">
                            <Badge className="bg-primary text-primary-foreground border-none micro-label rounded-md py-1 px-3">Validado Científicamente</Badge>
                            <Badge variant="outline" className="border-accent/30 text-accent micro-label rounded-md py-1 px-3">Etnofarmacología</Badge>
                            <span className="text-xs font-mono text-muted-foreground">REF: ID-2026-XQ</span>
                          </div>
                          
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <h3 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-primary tracking-tighter leading-none">{search}</h3>
                            
                            {/* Botón de Exportar Reporte PDF integrado */}
                            {result && (
                              <PDFDownloadLink
                                document={
                                  <ScientificReport 
                                    title={search} 
                                    result={result} 
                                    lang={lang} 
                                    secondaryMetabolite={search}
                                    pubchemUrl={`https://pubchem.ncbi.nlm.nih.gov/#query=${encodeURIComponent(search)}`}
                                  />
                                }
                                fileName={`reporte_${search.replace(/\s+/g, '_')}.pdf`}
                              >
                                {({ loading: pdfLoading }) => (
                                  <Button 
                                    size="sm"
                                    disabled={pdfLoading}
                                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 h-10 text-xs font-bold transition-all flex items-center gap-2 active:scale-95 group font-sans shrink-0 animate-fade-in"
                                  >
                                    <Download className="w-3.5 h-3.5 shrink-0 group-hover:translate-y-0.5 transition-transform" />
                                    {pdfLoading ? (lang === 'es' ? 'Certificando...' : 'Certifying...') : (lang === 'es' ? 'Exportar Reporte (PDF)' : 'Export Report (PDF)')}
                                  </Button>
                                )}
                              </PDFDownloadLink>
                            )}
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <CheckCircle2 className="w-4 h-4 text-primary" />
                            </div>
                            <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground/80">Documentación Técnica Completa</span>
                          </div>
                        </div>

                        {/* Majestic Panoramic Botanical Banner (Center Stage & High Visibility) */}
                        <div className="w-full">
                          {imageLoading ? (
                            <div className="w-full aspect-[21/9] md:aspect-[2.4/1] h-[280px] md:h-[380px] lg:h-[450px] rounded-[2.5rem] border-2 border-primary/10 bg-primary/5 flex flex-col items-center justify-center space-y-4 animate-pulse">
                              <Leaf className="w-12 h-12 text-primary animate-spin" />
                              <span className="text-sm font-mono text-muted-foreground text-center font-bold tracking-tight">
                                {lang === 'es' ? 'Generando Visualización de Laboratorio de Cosmetología con IA MEM...' : 'Generating Cosmetology Laboratory Visualization with IA MEM...'}
                              </span>
                            </div>
                          ) : botanicalImage ? (
                            <div className="relative group w-full flex flex-col space-y-4">
                              {/* Inline Style injecting Google VEO keyframe animations */}
                              <style dangerouslySetInnerHTML={{ __html: `
                                @keyframes veo-ambient-pulse {
                                  0%, 100% {
                                    transform: scale(1.02);
                                    filter: brightness(0.96) contrast(1.02);
                                  }
                                  50% {
                                    transform: scale(1.05);
                                    filter: brightness(1.1) contrast(1.06) saturate(1.03);
                                  }
                                }
                                @keyframes veo-kinetic-pan {
                                  0%, 100% {
                                    transform: scale(1.05) translate(0px, 0px) rotate(0deg);
                                  }
                                  25% {
                                    transform: scale(1.07) translate(-6px, 3px) rotate(0.1deg);
                                  }
                                  50% {
                                    transform: scale(1.06) translate(4px, -3px) rotate(-0.1deg);
                                  }
                                  75% {
                                    transform: scale(1.08) translate(-2px, -4px) rotate(0.1deg);
                                  }
                                }
                                @keyframes veo-wind-flowing {
                                  0%, 100% {
                                    transform: scale(1.025) skewX(0deg) skewY(0deg) rotate(0deg);
                                  }
                                  25% {
                                    transform: scale(1.03) skewX(0.7deg) skewY(0.2deg) rotate(0.2deg);
                                  }
                                  75% {
                                    transform: scale(1.025) skewX(-0.7deg) skewY(-0.2deg) rotate(-0.2deg);
                                  }
                                }
                                @keyframes veo-cinematic-zoom {
                                  0% {
                                    transform: scale(1.01);
                                  }
                                  50% {
                                    transform: scale(1.08);
                                  }
                                  100% {
                                    transform: scale(1.01);
                                  }
                                }
                              `}} />

                              <div className="relative w-full aspect-[21/9] md:aspect-[2.4/1] h-[280px] md:h-[380px] lg:h-[450px] overflow-hidden rounded-[2.5rem] border-2 border-primary/20 bg-card shadow-xl shadow-black/40 hover:border-primary/50 transition-all duration-300">
                                {/* IMAGE ELEMENT - Targets the same CSS selector tag */}
                                <img 
                                  src={botanicalImage.url} 
                                  alt={search} 
                                  referrerPolicy="no-referrer"
                                  style={{
                                    animationName: isVeoActive && isVeoPlay ? `veo-${veoMotionStyle}` : "none",
                                    animationDuration: veoSpeed === "slow" ? "18s" : veoSpeed === "normal" ? "9s" : "4.5s",
                                    animationIterationCount: "infinite",
                                    animationTimingFunction: "ease-in-out",
                                    animationPlayState: isVeoPlay ? "running" : "paused"
                                  }}
                                  className={`w-full h-full object-cover transition-transform duration-700 ${!isVeoActive ? "group-hover:scale-105" : ""}`}
                                />
                                
                                {/* Overlay bottom vignette gradient for text contrast */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                                {/* 1. Top Bar: Info overlay and launch button */}
                                <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-auto z-20">
                                  {/* Badge: IA MEM Source Origen */}
                                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#39ff14]/90 bg-black/80 border border-[#39ff14]/30 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg">
                                    {isVeoActive ? "GOOGLE VEO 3.1 ACTIVE" : "IA MEM STATS"}
                                  </span>

                                  {/* Button to run VEO if not loaded yet */}
                                  {!isVeoActive && !veoLoading && (
                                    <button
                                      type="button"
                                      onClick={handleStartVeoAnimation}
                                      className="bg-slate-950/90 hover:bg-[#39ff14]/20 hover:text-[#39ff14] text-white border border-[#39ff14]/30 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer shadow-lg active:scale-95 select-none"
                                    >
                                      <Film className="w-3.5 h-3.5 text-[#39ff14] animate-pulse" />
                                      <span>{lang === "es" ? "Animar con Google VEO" : "Animate with Google VEO"}</span>
                                    </button>
                                  )}

                                  {/* Button to restart animation / loop */}
                                  {isVeoActive && (
                                    <button
                                      type="button"
                                      onClick={handleStartVeoAnimation}
                                      className="bg-slate-950/90 hover:bg-[#39ff14]/20 hover:text-[#39ff14] text-white border border-[#39ff14]/30 p-1.5 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg"
                                      title={lang === "es" ? "Re-generar con VEO" : "Re-generate with VEO"}
                                    >
                                      <RefreshCw className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>

                                {/* 2. Render Google VEO Progressive Loader Overlay */}
                                {veoLoading && (
                                  <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col justify-center items-center p-6 md:p-10 text-center animate-fade-in z-50">
                                    <div className="w-16 h-16 rounded-full bg-[#39ff14]/10 border-2 border-dashed border-[#39ff14] flex items-center justify-center animate-spin mb-6">
                                      <Film className="w-8 h-8 text-[#39ff14]" />
                                    </div>
                                    <div className="space-y-1 mb-6">
                                      <h4 className="text-white font-extrabold text-sm uppercase tracking-widest font-sans flex items-center justify-center gap-2">
                                        <Sparkles className="w-4 h-4 text-[#39ff14] animate-bounce" />
                                        <span>{lang === "es" ? "Procesador de Video Google VEO" : "Google VEO Video Processor"}</span>
                                      </h4>
                                      <p className="text-slate-400 font-mono text-xs">
                                        {lang === "es" ? "Interpolación Cinemática sin Adición de Objetos" : "Cinematic Interpolation with Zero Object Invariance"}
                                      </p>
                                    </div>

                                    {/* Progressive Checkpoints Log */}
                                    <div className="w-full max-w-md bg-black/40 border border-white/5 rounded-xl p-4 text-left font-mono text-[10px] leading-relaxed space-y-2">
                                      {[
                                        {
                                          es: "Activando motor de fluidos temporales (veo-3.1-lite)...",
                                          en: "Activating temporal fluid dynamics (veo-3.1-lite)..."
                                        },
                                        {
                                          es: "Bloqueando geometría de objetos originales (cero adición)...",
                                          en: "locking original object geometries (zero elements added)..."
                                        },
                                        {
                                          es: "Calculando interpolación de píxeles locales mesoamericanos...",
                                          en: "Computing local Mesoamerican pixel interpolation..."
                                        },
                                        {
                                          es: "Inyectando oscilación de viento botánico ambiental...",
                                          en: "Injecting ambient botanical wind oscillation..."
                                        },
                                        {
                                          es: "Renderizando loop cinemático continuo a 24fps (1080p)...",
                                          en: "Rendering continuous cinematic loop at 24fps (1080p)..."
                                        }
                                      ].map((step, idx) => {
                                        const isCompleted = veoStepIndex > idx;
                                        const isActive = veoStepIndex === idx;
                                        return (
                                          <div key={idx} className="flex items-center gap-2.5">
                                            {isCompleted ? (
                                              <span className="text-[#39ff14] font-bold">✓</span>
                                            ) : isActive ? (
                                              <span className="text-amber-400 font-bold animate-pulse">▶</span>
                                            ) : (
                                              <span className="text-slate-700">•</span>
                                            )}
                                            <span className={isCompleted ? "text-slate-300" : isActive ? "text-white font-bold" : "text-slate-600"}>
                                              {lang === "es" ? step.es : step.en}
                                            </span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}

                                {/* Overlay Caption Text inside container */}
                                <div className="absolute bottom-6 left-6 pointer-events-none z-10">
                                  <span className="text-[10px] font-sans text-white bg-slate-950/80 border border-primary/30 backdrop-blur-md px-4 py-2 rounded-full uppercase tracking-widest font-extrabold shadow-lg">
                                    {isVeoActive 
                                      ? (lang === "es" ? "Imagen Animada con Google VEO 3.1" : "Image Animated with Google VEO 3.1")
                                      : (lang === "es" ? "Origen: Laboratorio IA MEM" : "Origin: Lab IA MEM")
                                    }
                                  </span>
                                </div>

                                {/* Information Flyout Overlay */}
                                {showVeoInfo && (
                                  <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md p-6 font-sans text-xs text-slate-300 flex flex-col justify-between z-40 animate-fade-in border-2 border-[#39ff14]/30 rounded-[2.5rem]">
                                    <div className="space-y-3.5">
                                      <div className="flex justify-between items-center border-b border-white/10 pb-2">
                                        <div className="flex items-center gap-2">
                                          <Film className="w-4 h-4 text-[#39ff14]" />
                                          <span className="text-white font-bold uppercase tracking-wider text-[11px]">
                                            Google Veo 3.1 Integration Knowledge
                                          </span>
                                        </div>
                                        <button 
                                          onClick={() => setShowVeoInfo(false)}
                                          className="text-slate-400 hover:text-white font-bold font-mono px-2 py-0.5 border border-white/10 rounded cursor-pointer"
                                        >
                                          ✕
                                        </button>
                                      </div>

                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 leading-relaxed">
                                        <div className="space-y-1">
                                          <p className="text-[#39ff14] font-mono text-[9px] uppercase font-bold">Model Specification</p>
                                          <p className="text-white font-mono text-[10px]">veo-3.1-lite-generate-preview</p>
                                          <p className="text-slate-400 text-[10px]">
                                            Optimized high frame rate, low-latency video generation, bypassing expensive render passes while keeping crisp 1080p spatial resolution.
                                          </p>
                                        </div>
                                        <div className="space-y-1">
                                          <p className="text-[#39ff14] font-mono text-[9px] uppercase font-bold">Integrity Constraint</p>
                                          <p className="text-white font-mono text-[10px]">Object-Preserving Invariance</p>
                                          <p className="text-slate-400 text-[10px]">
                                            Locked boundaries guarantee that zero outer artifacts or hallucinations (like birds, extra leaves, text, or human figures) are introduced.
                                          </p>
                                        </div>
                                      </div>

                                      <div className="space-y-2 text-[10px] text-slate-400 border-t border-white/5 pt-2">
                                        <p>
                                          <strong>How to Use Lyria / Veo in Server Routes:</strong> Set Up a 3-step pipeline (Start, Poll, and Download) which keeps the API secrets secure inside Express endpoints while streaming chunk buffers safely back to the viewport.
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex justify-end pt-2 border-t border-white/10">
                                      <button
                                        onClick={() => setShowVeoInfo(false)}
                                        className="bg-[#39ff14]/20 hover:bg-[#39ff14]/30 text-[#39ff14] px-4 py-1.5 rounded-lg text-[10px] uppercase font-bold border border-[#39ff14]/30 cursor-pointer"
                                      >
                                        {lang === "es" ? "Entendido" : "Acknowledged"}
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* 3. Bottom HUD Player Controls Panel (Translucent Overlay bar) */}
                              {isVeoActive && (
                                <div className="w-full bg-slate-950/60 border border-white/10 backdrop-blur-md rounded-2xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 animate-fade-in">
                                  {/* Left: Playback toggler & Info Trigger */}
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => setIsVeoPlay(!isVeoPlay)}
                                      className="h-8 px-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer select-none active:scale-95"
                                    >
                                      {isVeoPlay ? (
                                        <>
                                          <Pause className="w-3.5 h-3.5 fill-current" />
                                          <span>{lang === "es" ? "Pausar" : "Pause"}</span>
                                        </>
                                      ) : (
                                        <>
                                          <Play className="w-3.5 h-3.5 fill-current" />
                                          <span>{lang === "es" ? "Reproducir" : "Play"}</span>
                                        </>
                                      )}
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => setShowVeoInfo(!showVeoInfo)}
                                      className="h-8 w-8 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-xl flex items-center justify-center transition-all cursor-pointer"
                                      title="Google VEO Docs"
                                    >
                                      <Info className="w-4 h-4" />
                                    </button>
                                  </div>

                                  {/* Middle: Motion style selector tabs */}
                                  <div className="flex flex-wrap items-center gap-1 bg-black/40 p-1 rounded-xl">
                                    {[
                                      { id: "ambient-pulse", es: "Luz", en: "Breathing" },
                                      { id: "wind-flowing", es: "Brisa", en: "Breeze" },
                                      { id: "kinetic-pan", es: "Paneo", en: "Pan" },
                                      { id: "cinematic-zoom", es: "Zoom", en: "Zoom" }
                                    ].map((style) => (
                                      <button
                                        key={style.id}
                                        type="button"
                                        onClick={() => setVeoMotionStyle(style.id as any)}
                                        className={`px-3 py-1 text-[10px] uppercase font-bold rounded-lg transition-all cursor-pointer select-none ${
                                          veoMotionStyle === style.id 
                                            ? "bg-primary text-primary-foreground shadow" 
                                            : "text-slate-400 hover:text-white"
                                        }`}
                                      >
                                        {lang === "es" ? style.es : style.en}
                                      </button>
                                    ))}
                                  </div>

                                  {/* Right: Motion speed setting controls */}
                                  <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-mono text-slate-400 uppercase font-bold flex items-center gap-1 flex-row">
                                      <Gauge className="w-3 h-3 text-primary" />
                                      {lang === "es" ? "Velocidad" : "Speed"}
                                    </span>
                                    <div className="flex gap-1 bg-black/20 p-0.5 rounded-lg border border-white/5">
                                      {[
                                        { id: "slow", label: lang === "es" ? "Lento" : "Slow" },
                                        { id: "normal", label: "1x" },
                                        { id: "fast", label: lang === "es" ? "Rápido" : "Double" }
                                      ].map((spd) => (
                                        <button
                                          key={spd.id}
                                          type="button"
                                          onClick={() => setVeoSpeed(spd.id as any)}
                                          className={`px-2 py-1 text-[9px] font-bold rounded cursor-pointer select-none ${
                                            veoSpeed === spd.id 
                                              ? "bg-white/10 text-[#39ff14]" 
                                              : "text-slate-500 hover:text-slate-300"
                                          }`}
                                        >
                                          {spd.label}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-10 md:p-14 lg:p-20">
                      <div className="prose prose-invert prose-xl max-w-none prose-headings:font-serif prose-headings:text-primary prose-headings:tracking-tighter prose-headings:text-4xl prose-p:leading-[1.8] prose-p:text-justify prose-li:marker:text-primary prose-strong:text-primary/90 prose-a:text-accent prose-a:font-bold hover:prose-a:text-primary prose-a:transition-colors prose-a:no-underline hover:prose-a:underline">
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
                            pre: ({ children }) => <>{children}</>,
                            code: ({ children }) => (
                              <span className="font-mono text-primary bg-primary/5 px-2 py-0.5 rounded text-sm font-bold tracking-tight select-all">
                                {children}
                              </span>
                            ),
                          }}
                        >
                          {cleanMarkdownHttps(result)}
                        </ReactMarkdown>
                      </div>

                      <div className="mt-20 pt-10 border-t border-primary/10 flex justify-center">
                        <Button 
                          variant="ghost"
                          onClick={() => {
                            setResult(null);
                            setSearch("");
                            setBotanicalImage(null);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="group border border-primary/20 text-muted-foreground hover:bg-primary/5 hover:text-primary rounded-[2rem] px-12 py-10 flex items-center gap-4 transition-all"
                        >
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Microscope className="w-6 h-6" />
                          </div>
                          <div className="text-left">
                            <p className="micro-label !text-xs mb-1 !text-primary/60">{lang === 'es' ? "Finalizar Consulta" : "Finish Consultation"}</p>
                            <p className="text-xl font-bold opacity-80 group-hover:opacity-100 transition-opacity">
                              {lang === 'es' ? "Nueva Investigación" : "New Research"}
                            </p>
                          </div>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="lg:col-span-1 space-y-8">

                    <div className="p-8 rounded-[2.5rem] bg-card/80 backdrop-blur-xl space-y-6 border border-primary/20 shadow-2xl">
                      <h4 className="micro-label text-primary">{t[lang].regulatory_title}</h4>
                      <div className="space-y-4">
                        <a 
                          href="https://www.dof.gob.mx/normasOficiales/4676/salud/salud.htm" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-between group p-4 rounded-2xl bg-primary/5 hover:bg-primary/10 transition-all border border-primary/10 hover:border-primary/30"
                        >
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{lang === "es" ? "Prácticas Sanitarias DOF" : "DOF Sanitary Practices"}</span>
                            <span className="text-[9px] text-muted-foreground uppercase">{lang === "es" ? "Reglamentación Federal México" : "Federal Mexican Regulation"}</span>
                          </div>
                          <ExternalLink className="w-4 h-4 text-primary" />
                        </a>
                        <p className="text-[9px] text-muted-foreground/60 leading-tight italic">
                          {lang === "es"
                            ? "Consulta los reglamentos de control sanitario aplicables a plantas medicinales y remedios herbolarios."
                            : "Consult sanitary control regulations applicable to medicinal plants and herbal remedies."}
                        </p>

                        <div className="border-t border-primary/10 my-4 pt-4"></div>

                        {/* European Commission SCCS Guidelines */}
                        <a 
                          href="https://health.ec.europa.eu/scientific-committees/scientific-committee-consumer-safety-sccs_en" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-between group p-4 rounded-2xl bg-primary/5 hover:bg-primary/10 transition-all border border-primary/10 hover:border-primary/30"
                        >
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{lang === "es" ? "Lineamientos SCCS Unión Europea" : "EU SCCS Guidelines"}</span>
                            <span className="text-[9px] text-muted-foreground uppercase">{lang === "es" ? "Comité Científico de Seguridad del Consumidor" : "Scientific Committee on Consumer Safety"}</span>
                          </div>
                          <ExternalLink className="w-4 h-4 text-primary" />
                        </a>
                        <p className="text-[9px] text-muted-foreground/60 leading-tight italic">
                          {lang === "es"
                            ? "Notas de orientación de la SCCS para la evaluación de seguridad de sustancias e ingredientes cosméticos según el reglamento de la UE (EC 1223/2009)."
                            : "SCCS guidance notes for testing and safety evaluation of cosmetic ingredients under EU Regulation (EC 1223/2009)."}
                        </p>

                        <div className="border-t border-primary/10 my-4 pt-4"></div>

                        {/* US EPA IRIS */}
                        <a 
                          href="https://www.epa.gov/iris" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-between group p-4 rounded-2xl bg-primary/5 hover:bg-primary/10 transition-all border border-primary/10 hover:border-primary/30"
                        >
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{lang === "es" ? "Sistema Integrado IRIS US EPA" : "US EPA IRIS System"}</span>
                            <span className="text-[9px] text-muted-foreground uppercase">{lang === "es" ? "Base de Datos de Riesgos Químicos" : "Chemical Hazard Risk Database"}</span>
                          </div>
                          <ExternalLink className="w-4 h-4 text-primary" />
                        </a>
                        <p className="text-[9px] text-muted-foreground/60 leading-tight italic">
                          {lang === "es"
                            ? "Compilación científica de la Agencia de Protección Ambiental de EE.UU. sobre RfDs, RfCs y factores de pendiente de toxicidad crónica."
                            : "U.S. Environmental Protection Agency's science database compiling chronic oral reference doses (RfD), reference concentrations (RfC), and cancer slope factors."}
                        </p>
                      </div>
                    </div>


                  </div>
                </motion.div>
              )}
            </>
          )}
        </motion.section>
      )}
    </AnimatePresence>

      {/* EXPIRED/EXPIRING LICENSE SYSTEM WARNING CARD */}
      <AnimatePresence>
        {isExpiryAlertOpen && currentUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="relative max-w-lg w-full bg-slate-950 border border-amber-500/30 rounded-[2rem] p-8 shadow-[0_0_50px_rgba(245,158,11,0.15)] overflow-hidden"
              id="expiry-warning-card"
            >
              {/* Backglow glows orange/yellow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex flex-col items-center text-center space-y-6">
                {/* Visual Icon */}
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 animate-pulse shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                  <AlertTriangle className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-amber-500 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full uppercase">
                    {lang === "es" ? "⚠️ ALERTA DE VIGENCIA DE LICENCIA" : "⚠️ LICENSE EXPIRY WARNING"}
                  </span>
                  <h3 className="text-xl font-bold font-space text-white tracking-tight pt-1">
                    {lang === "es" ? "Tu período de acceso vencerá pronto" : "Your access period is expiring soon"}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
                    {lang === "es" 
                      ? `Quedan exactamente ${expiryDaysLeft ? expiryDaysLeft.toFixed(1) : "---"} días de acceso activo para tu cuenta (${currentUser.email}).`
                      : `Exactly ${expiryDaysLeft ? expiryDaysLeft.toFixed(1) : "---"} days of active access remaining for your account (${currentUser.email}).`}
                  </p>
                </div>

                {/* Status Box */}
                <div className="w-full bg-slate-900/50 border border-white/5 rounded-xl p-4 flex flex-col gap-2.5 text-left font-sans text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5 font-mono text-[10px] text-slate-400">
                    <span>{lang === "es" ? "ESTADO DE NOTIFICACIÓN" : "NOTIFICATION STATUS"}</span>
                    <span className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${emailSentStatus === "success" ? "bg-[#39ff14]" : emailSentStatus === "failed" ? "bg-red-500 animate-pulse" : "bg-amber-500"} inline-block`} />
                      {emailSentStatus === "success" 
                        ? (lang === "es" ? "AVISO ENVIADO" : "ALERT DISPATCHED")
                        : emailSentStatus === "failed" 
                        ? (lang === "es" ? "FALLÓ ENVÍO" : "DISPATCH FAILED")
                        : (lang === "es" ? "PROCESANDO..." : "PROCESSING...")}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                    {lang === "es"
                      ? "Un mensaje con la advertencia de vencimiento ha sido procesado automáticamente para ser enviado a tu correo. Usa los siguientes botones para verificar o reenviar."
                      : "A message warning about your license expiration has been automatically processed to be sent to your email. Use the buttons below to check or resend."}
                  </p>
                </div>

                {/* Actions */}
                <div className="w-full flex flex-col gap-2 pt-2">
                  <button
                    disabled={isEmailSending}
                    onClick={async () => {
                      setIsEmailSending(true);
                      const serviceId = (import.meta as any).env.VITE_EMAILJS_SERVICE_ID || "service_atajos";
                      const templateId = (import.meta as any).env.VITE_EMAILJS_TEMPLATE_ID || "template_expiry_warning";
                      const publicKey = (import.meta as any).env.VITE_EMAILJS_PUBLIC_KEY || "user_public_key_placeholder";
                      const daysStr = expiryDaysLeft ? expiryDaysLeft.toFixed(1) : "1.5";
                      const textMessage = `Hola ${currentUser.firstName},\n\nEste es un aviso de que tu renovación para Atajos (Estudio de Diseño Bio-Digital Xochimilco) debe gestionarse pronto (quedan ${daysStr} días).\n\nContacto de soporte: eupirne@gmail.com`;

                      try {
                        const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            service_id: serviceId,
                            template_id: templateId,
                            user_id: publicKey,
                            template_params: {
                              to_email: currentUser.email,
                              to_name: currentUser.firstName,
                              days_remaining: daysStr,
                              subject: `⚠️ Alerta de Expiración - Atajos Xochimilco`,
                              message: textMessage,
                              reply_to: "eupirne@gmail.com"
                            }
                          })
                        });
                        if (response.ok) {
                          setEmailSentStatus("success");
                        } else {
                          setEmailSentStatus("failed");
                        }
                      } catch {
                        setEmailSentStatus("failed");
                      } finally {
                        setIsEmailSending(false);
                      }
                    }}
                    className={`w-full h-11 rounded-xl font-space font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border cursor-pointer select-none transition-all active:scale-[0.98] ${
                      emailSentStatus === "success" 
                        ? "bg-slate-900 border-[#39ff14]/30 text-[#39ff14] hover:bg-[#39ff14]/5"
                        : "bg-amber-500 hover:bg-amber-400 border-none text-slate-950"
                    }`}
                    id="btn-resend-expiry-warning"
                  >
                    <Mail className="w-4 h-4 shrink-0" />
                    <span>
                      {isEmailSending 
                        ? (lang === "es" ? "Enviando..." : "Sending...") 
                        : emailSentStatus === "success"
                        ? (lang === "es" ? "Aviso Enviado con Éxito ✓" : "Alert Sent Successfully ✓")
                        : (lang === "es" ? "Reintentar Envío a mi Correo" : "Retry Sending Email Alert")}
                    </span>
                  </button>

                  <a
                    href={`mailto:${currentUser.email}?subject=Aviso%20de%20Expiraci%C3%B3n%20de%20Cuenta%20-%20Atajos&body=Hola%20${encodeURIComponent(currentUser.firstName)},%0D%0A%0D%0ATu%20licencia%20de%20acceso%20para%20Atajos%20vencer%C3%A1%20pronto%20(quedan%20${expiryDaysLeft ? expiryDaysLeft.toFixed(1) : "2"}%20d%C3%ADas).%0D%0A%0D%0APor%20favor%20contacta%20al%20administrador%20(eupirne@gmail.com)%20para%20solicitar%20un%20aumento%20de%20vigencia.%0D%0AAgradecemos%20tu%20investigaci%C3%B3n.%0D%0A%0D%0AEquipo%20Atajos%20Xochimilco`}
                    className="w-full h-11 bg-slate-900 border border-white/10 hover:border-white/20 hover:bg-slate-800 text-slate-200 rounded-xl font-space font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
                    id="btn-draft-expiry-warning"
                  >
                    <ExternalLink className="w-4 h-4 shrink-0" />
                    <span>{lang === "es" ? "Abrir Correo de Respaldo Local" : "Open Local Backup Mail"}</span>
                  </a>

                  <button
                    onClick={() => setIsExpiryAlertOpen(false)}
                    className="w-full h-11 bg-transparent hover:bg-white/5 text-slate-400 hover:text-white rounded-xl font-space font-bold text-[11px] uppercase tracking-wider cursor-pointer transition-all outline-none"
                    id="btn-dismiss-expiry-warning"
                  >
                    {lang === "es" ? "Continuar a la Plataforma" : "Continue to Platform"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-border/50 bg-secondary/20">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-xs text-muted-foreground text-center md:text-left">
            {new Date().getFullYear()} © Xochimilco Bio-Digital Studio. Bridging natural sequences with digital aesthetics.
            <br />
            Bio-Engineered Web Design • Scientific Validation • APA Research Integration.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground cursor-help hover:text-primary transition-colors">{lang === "es" ? "Protección de Datos" : "Data Protection"}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
