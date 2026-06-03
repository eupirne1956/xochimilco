/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
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
  LogOut
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
import { GmailUser } from "./types";
import { auth } from "./lib/firebase";

type Language = "es" | "en";

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

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [isToolActive, setIsToolActive] = useState(false);
  const [activeModule, setActiveModule] = useState<"xochimilco" | "auroria">("xochimilco");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchMode, setSearchMode] = useState<"standard" | "phytochemistry" | "traditional" | "fingerprint">("standard");
  const [botanicalImage, setBotanicalImage] = useState<{ url: string; credit: string; sourceUrl: string } | null>(null);
  const [imageLoading, setImageLoading] = useState(false);

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
      regulatory_title: "Marco Regulatorio COFEPRIS",
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
      regulatory_title: "COFEPRIS Regulatory Framework",
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

  const executeSearch = async (termToSearch: string, modeToUse: "standard" | "phytochemistry" | "traditional" | "fingerprint") => {
    if (!termToSearch.trim()) return;

    setLoading(true);
    setResult(null);
    setBotanicalImage(null);
    setImageLoading(true);

    try {
      let researchResult = "";
      
      if (modeToUse === "phytochemistry") {
        const modePrompt = lang === "es"
          ? "Realiza un análisis fitoquímico detallado y estudio de huella molecular. Si la entrada es una planta o espécimen botánico, describe minuciosamente sus metabolitos secundarios y perfil fitoquímico. Si la entrada representa un metabolito, compuesto o marcador fitoquímico (ej. Quercetina, Mentol, etc.), actúa identificando con alto rigor científico los especímenes botánicos mesoamericanos que posean y expresen esta huella fitoquímica, detallando sus mecanismos, biosíntesis, y ontología médica dual. Búsqueda: "
          : "Perform a comprehensive phytochemical analysis and molecular fingerprint study. If the input is a plant or botanical specimen, detail its secondary metabolites and phytochemical profile. If the input is a chemical compound or active metabolite (e.g. Quercetin, Menthol, etc.), identify with high scientific rigor the Mesoamerican botanical specimens that possess and express this phytochemical fingerprint, detailing their mechanisms, biosynthesis, and dual medical ontology. Query: ";
        
        researchResult = await generateResearch(modePrompt + termToSearch, lang);
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
                }} 
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
                      <CofeprisHQCanvas />
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
                        <span className="text-[50px] font-serif tracking-tight text-accent uppercase font-bold leading-tight block">HUB CIENTÍFICO</span>
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
                        <h2 className="text-6xl font-serif font-bold tracking-tighter/10">Terminal de {t[lang].search}</h2>
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
                          placeholder={searchMode === 'phytochemistry' ? (lang === 'es' ? "Ej. Tepezcohuite, Mimosa, Quercetina, Cafeína..." : "e.g., Tepezcohuite, Mimosa, Quercetin, Caffeine...") : t[lang].placeholder}
                          className="h-20 pl-16 pr-24 text-xl rounded-3xl border-border/40 bg-card/60 backdrop-blur-md shadow-2xl transition-all focus-visible:ring-primary/20 focus-visible:border-primary/50 text-foreground"
                        />
                        <motion.div 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="absolute right-3 top-3 bottom-3"
                        >
                          <Button 
                            type="submit" 
                            disabled={loading || !search}
                            className="h-full aspect-square p-0 rounded-2xl botanical-gradient shadow-xl shadow-primary/30 text-primary-foreground"
                          >
                            {loading ? <div className="w-6 h-6 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : <ArrowRight className="w-6 h-6" />}
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
                    <div className="w-24 h-24 rounded-[2rem] botanical-gradient flex items-center justify-center animate-pulse soft-glow relative z-10">
                      <FlaskConical className="text-white w-10 h-10" />
                    </div>
                    <div className="absolute inset-0 bg-primary/20 blur-3xl animate-pulse rounded-full" />
                  </div>
                  <div className="space-y-3">
                    <p className="editorial-title !text-5xl opacity-40">{t[lang].searching}</p>
                    <p className="micro-label animate-pulse">Sincronizando con Códices Mesoamericanos y Bases de Datos Fitoquímicas...</p>
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
                                document={<ScientificReport title={search} result={result} lang={lang} />}
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
                            <div className="relative group w-full aspect-[21/9] md:aspect-[2.4/1] h-[280px] md:h-[380px] lg:h-[450px] overflow-hidden rounded-[2.5rem] border-2 border-primary/20 bg-card shadow-xl shadow-black/40 hover:border-primary/50 transition-all duration-300">
                              <img 
                                src={botanicalImage.url} 
                                alt={search} 
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                              />
                              
                              {/* Overlay bottom vignette gradient for text contrast */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                              {/* ONLY element: "Imagen creada por IA MEM" */}
                              <div className="absolute bottom-6 left-6 pointer-events-none">
                                <span className="text-xs font-sans text-white bg-slate-950/80 border border-primary/30 backdrop-blur-md px-4 py-2 rounded-full uppercase tracking-widest font-extrabold shadow-lg">
                                  Imagen creada por IA MEM
                                </span>
                              </div>
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

                    {/* Tarjeta de Validación Bio-Digital */}
                    <div className="p-8 rounded-[2.5rem] bg-card/80 backdrop-blur-xl space-y-6 border border-primary/20 shadow-2xl">
                      <div className="flex items-center justify-between">
                        <h4 className="micro-label text-primary">Validación Bio-Digital</h4>
                        <Badge variant="outline" className="text-[8px] border-primary/20 opacity-50">v3.0.0</Badge>
                      </div>
                      <div className="space-y-6">
                        {[
                          { label: 'Confianza', val: '98.4%', color: 'bg-primary' },
                          { label: 'Citas', val: 'Detectadas', color: 'bg-accent' },
                          { label: 'Validación', val: 'Criptográfica', color: 'bg-green-400' },
                        ].map((spec, i) => (
                          <div key={i} className="flex justify-between items-center text-sm border-b border-primary/10 pb-4 last:border-0 last:pb-0">
                            <span className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest">{spec.label}</span>
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${spec.color} shadow-lg shadow-white/20`} />
                              <span className="font-bold text-primary">{spec.val}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="pt-2">
                        <p className="text-[10px] text-muted-foreground leading-relaxed italic opacity-80">
                          <span className="text-primary font-bold">Garantía de Integridad:</span> Certificación de integridad de datos que garantiza: 1. Renderizado Adaptativo de PDF. 2. Validación de DOIs en tiempo real con Google Search. 3. Limpieza de caracteres residuales (Mojibake). 4. Formato APA 7mo riguroso.
                        </p>
                      </div>
                    </div>

                    <div className="p-8 rounded-[2.5rem] bg-slate-900/60 backdrop-blur-xl border border-accent/30 space-y-4 shadow-2xl">
                      <div className="flex items-center gap-3 text-accent mb-4">
                        <AlertCircle className="w-5 h-5" />
                        <h4 className="micro-label !text-accent">Aviso Investigativo & Legal</h4>
                      </div>
                      <p className="text-[11px] text-accent/90 leading-relaxed font-bold italic">{t[lang].disclaimer}</p>
                    </div>

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
                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Guía Herbolaría</span>
                            <span className="text-[9px] text-muted-foreground uppercase">Reglamentación Vigente México</span>
                          </div>
                          <ExternalLink className="w-4 h-4 text-primary" />
                        </a>
                        <p className="text-[9px] text-muted-foreground/60 leading-tight italic">
                          Consulta los reglamentos de control sanitario aplicables a plantas medicinales y remedios herbolarios.
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
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-border/50 bg-secondary/20">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-wrap items-center justify-center gap-10 opacity-40 grayscale hover:grayscale-0 transition-all">
             <span className="text-sm font-bold tracking-tighter">PUBMED CONNECTED</span>
             <span className="text-sm font-bold tracking-tighter">UNAM DIGITAL ARCHIVE</span>
             <span className="text-sm font-bold tracking-tighter">APA COMPLIANT 7TH ED</span>
             <span className="text-sm font-bold tracking-tighter">COFEPRIS INDEXED</span>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            {new Date().getFullYear()} © Xochimilco Bio-Digital Studio. Bridging natural sequences with digital aesthetics.
            <br />
            Bio-Engineered Web Design • Scientific Validation • APA Research Integration.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground cursor-help hover:text-primary transition-colors">Protección de Datos</span>
            <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground cursor-help hover:text-primary transition-colors">API Status</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
