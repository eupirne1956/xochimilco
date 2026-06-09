import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Languages, 
  Shield, 
  Sparkles,
  ArrowRight,
  Zap,
  Lock,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Binary,
  Cpu,
  BookmarkCheck,
  ChevronRight,
  Eye,
  EyeOff,
  Mail
} from "lucide-react";
import { 
  signInWithPopup, 
  GoogleAuthProvider
} from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { GmailUser } from "../types";
// @ts-ignore
import pubchemBiomedicalLabImg from "../assets/images/pubchem_biomedical_lab_1780001203546.png";

interface GmailAuthPortalProps {
  lang: "es" | "en";
  setLang: (l: "es" | "en") => void;
  onAuthSuccess: (user: GmailUser) => void;
}

const t = {
  es: {
    tag: "CONSOLA DE ACCESO INTEGRADO",
    title: "Atajos",
    subtitle: "Estudio de Diseño Bio-Digital Xochimilco",
    description: "La sabiduría etnobotánica mesoamericana decodificada mediante el rigor científico y el aprendizaje automático predictivo.",
    btnText: "Iniciar sesión con Google",
    btnGuestText: "Entrar como invitado",
    disclaimer: "Atajos utiliza validación Zero-Trust de Google Cloud. Tus datos e información personal permanecen bajo protocolos de cifrado de punto a punto.",
    footerNote: "Ecosistema Digital de Atajos de Xochimilco. Cumplimiento regulatorio e investigación botánica avanzada.",
    infoBoxTitle: "Garantía de Privacidad",
    infoBoxText: "No compartimos tus fórmulas o propiedad intelectual patentológica. Los modelos operan localmente en tu perfil.",
    googleCanceled: "El inicio de sesión con Google falló o fue cancelado. Por favor, habilita las ventanas emergentes e inténtalo de nuevo.",
    
    // Landing specific copy
    heroTag: "INTELIGENCIA FITOQUÍMICA AVANZADA",
    heroTitle: "La Ciencia de los Productos Naturales,",
    heroTitleGradient: "Potenciada por la IA",
    heroDesc: "Reducción de tiempos de recopilación científica en un 40% garantizando pleno cumplimiento con estándares regulatorios nacionales e internacionales.",
    ctaExplore: "Habilitar Acceso Digital",
    
    // Cinematic Lab Workstation
    labPreviewTitle: "Portal de acceso al Mundo de los Productos Naturales y la Medicina Tradicional",
    labPreviewSubtitle: "Análisis fitofisicoquímico interactivo en tiempo real",
    labScientistName: "Dra. Elena Ruiz Mondragón",
    labScientistRole: "Investigadora Principal, Bio-Sistemas Mesoamericanos",
    labFocusTitle: "Fitoquímica de Alta Resolución & Herbolaria de Precisión",
    labFocusDesc: "Integración de sabiduría etnobotánica tradicional (Códices Aztecas), instrumentación analítica molecular (matraces de reflujo fitoquímico y fraccionamento) y rigor cinemático de grado 8K para el desarrollo de fitofármacos innovadores.",
    labStatusLabel: "Códice Badiano:",
    labStatusDecoded: "Decodificación e indexación de manuscrita nahua (98.2%)",
    labStatusFluids: "Matraz de extracción ultrasónica activa - 94.6% pureza",
    labStatusJournals: "Búsqueda activa: Nature, Lotus DB, PubChem y NOM",
    
    // Grid features
    wisdomTitle: "Decodificando la Sabiduría Ancestral",
    wisdomSubtitle: "El conocimiento tradicional de Xochimilco y Mesoamérica articulado en software predictivo.",
    
    mod1Label: "MÓDULO CÓDICE BADIANO",
    mod1Title: "Explorador Etnobotánico",
    mod1Desc: "Digitalización fitoquímica y cronológicas de manuscritos históricos y correspondencias biológicas.",
    
    mod2Label: "MÓDULO DE PREDICCIÓN",
    mod2Title: "Modelado Biofísico & ADME",
    mod2Desc: "Evaluación automática por analogías (Read-Across) y umbrales toxicológicos TTC en segundos.",
    
    mod3Label: "MÓDULO SEGURIDAD",
    mod3Title: "Propiedad Intelectual",
    mod3Desc: "Habilitado con protección criptográfica de vectores para salvaguardar patentes de herbolaría.",

    // Authority Section
    authTitle: "Prueba de Autoridad Regulatoria & Rigor",
    authDesc: "Alineado con directrices nacionales mexicanas y consensos internacionales para el desarrollo confiable de fitofármacos y cosméticos.",
    authCheck1: "Validado bajo Norma Oficial Mexicana NOM-073-SSA1-2015",
    authCheck2: "Umbrales del Comité Científico de Seguridad del Consumidor de la UE (SCCS) 2023",
    authCheck3: "Estándares y Directrices de la Organización Mundial de la Salud (OMS) 2010",
    authCheck4: "Lógica de Diseño Fitoquímico 'Quality by Design' (QbD)",
    authStatsTitle: "Precisión Algorítmica",
    authStatsDesc: "Integración exitosa de bases de datos biomédicas globales (PubChem, LOTUS)."
  },
  en: {
    tag: "INTEGRATED ACCESS CONSOLE",
    title: "Atajos",
    subtitle: "Xochimilco Bio-Digital Design Studio",
    description: "Mesoamerican ethnobotanical wisdom decoded through scientific rigor and predictive machine learning algorithms.",
    btnText: "Sign in with Google",
    btnGuestText: "Enter as guest",
    disclaimer: "Atajos uses Google Cloud Zero-Trust validation. Your data and personal information remain protected by point-to-point encryption.",
    footerNote: "Atajos Digital Ecosystem by Xochimilco. Regulatory compliance and advanced botanical research.",
    infoBoxTitle: "Privacy Guarantee",
    infoBoxText: "We do not share your proprietary formulas or intellectual property. Models compute locally inside your workspace profile.",
    googleCanceled: "Google sign-in failed or was canceled. Please enable pop-ups and try again.",
    
    // Landing specific copy
    heroTag: "ADVANCED PHYTOCHEMICAL INTELLIGENCE",
    heroTitle: "Natural Product Science,",
    heroTitleGradient: "Elevated by AI",
    heroDesc: "Reducing scientific research formulation cycle times by 40% while ensuring strict compliance with domestic and global regulatory guidelines.",
    ctaExplore: "Enable Digital Access",
    
    // Cinematic Lab Workstation
    labPreviewTitle: "Access Portal to the World of Natural Products and Traditional Medicine",
    labPreviewSubtitle: "Real-time interactive phytochemical analysis",
    labScientistName: "Dr. Elena Ruiz Mondragon",
    labScientistRole: "Lead Researcher, Mesoamerican Bio-Systems",
    labFocusTitle: "High-Resolution Phytochemistry & Precision Herbalism",
    labFocusDesc: "Integration of traditional ethnobotanical wisdom (Aztec Codices), molecular analytical instrumentation (reflux phytochemistry flasks and fractionation), and cinematic 8K precision for pioneering plant-derived therapeutic research.",
    labStatusLabel: "Badianus Codex:",
    labStatusDecoded: "Indexing and decoding of original Nahuatl manuscript (98.2%)",
    labStatusFluids: "Ultrasonic extraction flask active - 94.6% purity",
    labStatusJournals: "Literature active watch: Nature, Lotus DB, Pubchem & NOM",
    
    // Grid features
    wisdomTitle: "Decoding Ancestral Wisdom",
    wisdomSubtitle: "Traditional Mesoamerican and Xochimilco herbal knowledge mapped into high-performance predictive software.",
    
    mod1Label: "BADIANUS CODEX MODULE",
    mod1Title: "Ethnobotanical Explorer",
    mod1Desc: "Digital computational indexing of centuries-old Aztec manuscripts and modern biological correlates.",
    
    mod2Label: "PREDICTION MODULE",
    mod2Title: "Biophysical & ADME Mapping",
    mod2Desc: "Instant evaluation using Read-Across chemical analogs and Threshold of Toxicological Concern (TTC).",
    
    mod3Label: "SECURITY ENGINE",
    mod3Title: "Intellectual Property Guard",
    mod3Desc: "Armed with cryptographic vector protection to secure local botanical patents and formulation logs.",

    // Authority Section
    authTitle: "Regulatory Proof of Authority & Rigor",
    authDesc: "Aligned with domestic Mexican guidelines and globally accepted toxicological frameworks for high-trust product development.",
    authCheck1: "Validated under Official Mexican Standard NOM-073-SSA1-2015",
    authCheck2: "EU Scientific Committee on Consumer Safety (SCCS) 2023 Safety Standards",
    authCheck3: "World Health Organization (WHO) 2010 Quality Guidelines for Herbal Materials",
    authCheck4: "Quality by Design (QbD) Phytochemical Formulation Frameworks",
    authStatsTitle: "Algorithmic Precision",
    authStatsDesc: "Successful integration with premier biological databases (PubChem, LOTUS)."
  }
};

export function GmailAuthPortal({ lang, setLang, onAuthSuccess }: GmailAuthPortalProps) {
  const [errorText, setErrorText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Guest whitelist state flow
  const [guestStage, setGuestStage] = useState<"landing" | "guest_verify" | "guest_register">("landing");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPassword, setGuestPassword] = useState("");
  const [guestConfirmPassword, setGuestConfirmPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [registeredUserPayload, setRegisteredUserPayload] = useState<GmailUser | null>(null);

  // Live Simulator States (Lead Magnet)
  const [simConcentration, setSimConcentration] = useState(2.8);
  const [simDose, setSimDose] = useState(180);
  const [simViscosity, setSimViscosity] = useState(45);

  const curr = t[lang];

  // Algorithmic safety calculation (simulating Margin of Safety)
  // Low concentration and low suggested dose yield high MoS. High parameters drive MoS below 100.
  const calculatedMoS = Math.round((14000 / (simConcentration * simDose * 0.45 + 1)) * 10) / 10;
  const isApproved = calculatedMoS >= 100;

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

  const handleGoogleSignIn = async () => {
    try {
      setErrorText("");
      setIsLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userEmail = user.email ? user.email.toLowerCase() : "";

      if (!userEmail) {
        await auth.signOut();
        setErrorText(lang === "es" ? "No se pudo obtener un correo electrónico válido." : "Failed to obtain a valid email address.");
        return;
      }

      const isAdminUser = userEmail === "eupirne@gmail.com";
      let whitelistVerified = false;
      let userRole: "admin" | "user" = "user";
      let expirationDate: Date | null = null;

      if (isAdminUser) {
        whitelistVerified = true;
        userRole = "admin";
        try {
          const adminDocRef = doc(db, "authorized_users", userEmail);
          await setDoc(adminDocRef, {
            email: userEmail,
            role: "admin",
            access_granted_at: new Date(),
            access_expires_at: new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000) // 100 years
          }, { merge: true });
        } catch (dbErr) {
          console.warn("Could not sync super-admin profile to authorized_users in background:", dbErr);
        }
      } else {
        const whitelistDocRef = doc(db, "authorized_users", userEmail);
        const whitelistDoc = await getDoc(whitelistDocRef);

        if (!whitelistDoc.exists()) {
          await auth.signOut();
          setErrorText(
            lang === "es"
              ? `Acceso Denegado: La cuenta (${userEmail}) no está registrada en la lista de accesos aprobados de Atajos.`
              : `Access Denied: The account (${userEmail}) is not on the approved Atajos whitelist.`
          );
          return;
        }

        const data = whitelistDoc.data();
        userRole = data.role === "admin" ? "admin" : "user";
        expirationDate = parseFirestoreTimestamp(data.access_expires_at);
        const now = new Date();

        if (now > expirationDate) {
          await auth.signOut();
          const dateStr = expirationDate.toLocaleString();
          setErrorText(
            lang === "es"
              ? `Acceso Expirado: Su período de autorización finalizó el ${dateStr}. Solicite una extensión al administrador.`
              : `Access Expired: Your authorization period ended on ${dateStr}. Please request an extension from the administrator.`
          );
          return;
        }

        whitelistVerified = true;
      }

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      
      let finalUser: GmailUser;
      if (userDoc.exists()) {
        finalUser = {
          ...userDoc.data() as GmailUser,
          role: userRole
        };
      } else {
        const fullName = user.displayName || "Explorer";
        const parts = fullName.split(" ");
        const firstName = parts[0] || "Explorer";
        const lastName = parts.slice(1).join(" ") || "";
        const email = user.email || "";
        const username = email ? email.split("@")[0] : `user_${user.uid.substring(0, 5)}`;
        
        const colors = ["#1a73e8", "#ea4335", "#fbbc05", "#34a853", "#9c27b0", "#009688"];
        const avatarColor = colors[Math.floor(Math.random() * colors.length)];
        
        finalUser = {
          id: user.uid,
          email,
          firstName,
          lastName,
          username,
          avatarColor,
          createdAt: new Date().toISOString(),
          role: userRole
        };
        
        const { role, ...firestorePayload } = finalUser;
        await setDoc(userDocRef, firestorePayload);
      }

      localStorage.setItem("xochimilco_logged_user", JSON.stringify(finalUser));
      const activeSessionAccounts = JSON.parse(localStorage.getItem("xochimilco_session_accounts") || "[]") as GmailUser[];
      if (!activeSessionAccounts.some(u => u.id === finalUser.id)) {
        activeSessionAccounts.push(finalUser);
        localStorage.setItem("xochimilco_session_accounts", JSON.stringify(activeSessionAccounts));
      }

      onAuthSuccess(finalUser);
    } catch (error: any) {
      console.error("Google login error:", error);
      setErrorText(curr.googleCanceled);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestSignIn = () => {
    setErrorText("");
    setGuestStage("guest_verify");
  };

  const handleVerifyAndEnter = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText("");
    setIsLoading(true);

    const emailClean = guestEmail.trim().toLowerCase();
    const nameClean = guestName.trim();

    if (!nameClean) {
      setErrorText(lang === "es" ? "El nombre completo es requerido." : "Full name is required.");
      setIsLoading(false);
      return;
    }

    if (!emailClean) {
      setErrorText(lang === "es" ? "El correo electrónico es requerido." : "Email address is required.");
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailClean)) {
      setErrorText(lang === "es" ? "El formato de correo no es válido." : "The email format is invalid.");
      setIsLoading(false);
      return;
    }

    const isSuperAdmin = emailClean === "eupirne@gmail.com";
    if (!isSuperAdmin && !guestPassword.trim()) {
      setErrorText(lang === "es" ? "La contraseña es requerida para ingresar." : "Password is required to sign in.");
      setIsLoading(false);
      return;
    }

    try {
      let whitelisted = false;
      let resolvedExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      if (isSuperAdmin) {
        whitelisted = true;
      } else {
        const docRef = doc(db, "authorized_users", emailClean);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const authData = docSnap.data();
          const expirationDate = parseFirestoreTimestamp(authData.access_expires_at);
          const now = new Date();
          
          if (now > expirationDate) {
            setErrorText(
              lang === "es"
                ? "Acceso Expirado: Tu registro de lista blanca ha caducado. Envía una nueva solicitud de registro."
                : "Access Expired: Your whitelist registration has expired. Please submit a new registration request."
            );
            setIsLoading(false);
            return;
          }

          // Check password
          if (authData.password && authData.password !== guestPassword.trim()) {
            setErrorText(
              lang === "es"
                ? "Contraseña incorrecta. Por favor intente de nuevo."
                : "Incorrect password. Please try again."
            );
            setIsLoading(false);
            return;
          }

          whitelisted = true;

          // Keep the initial registration validity (30 days from initial registration)
          resolvedExpiresAt = expirationDate;
          
          if (!authData.password) {
            const updatePayload: any = {
              password: guestPassword.trim()
            };
            try {
              await setDoc(docRef, updatePayload, { merge: true });
            } catch (dbErr) {
              console.warn("Could not save password on verify and enter:", dbErr);
            }
          }
        }
      }

      if (whitelisted) {
        const names = nameClean.split(" ");
        const firstName = names[0] || "Invitado";
        const lastName = names.slice(1).join(" ") || "";

        const guestUser: GmailUser = {
          id: "guest_" + Math.random().toString(36).substring(2, 11),
          email: emailClean,
          firstName,
          lastName,
          username: emailClean.split("@")[0] || "invitado",
          avatarColor: "#475569",
          createdAt: new Date().toISOString(),
          role: "guest",
          accessExpiresAt: resolvedExpiresAt.toISOString()
        };

        localStorage.setItem("xochimilco_logged_user", JSON.stringify(guestUser));
        const activeSessionAccounts = JSON.parse(localStorage.getItem("xochimilco_session_accounts") || "[]") as GmailUser[];
        if (!activeSessionAccounts.some(u => u.id === guestUser.id)) {
          activeSessionAccounts.push(guestUser);
          localStorage.setItem("xochimilco_session_accounts", JSON.stringify(activeSessionAccounts));
        }

        onAuthSuccess(guestUser);
      } else {
        setErrorText(
          lang === "es"
            ? `El correo (${emailClean}) no se encuentra registrado en la lista blanca de Atajos. Por favor ingresa tus datos en este formulario de solicitud para registrarte.`
            : `The email (${emailClean}) is not registered on the Atajos whitelist. Please enter your details in this request form to register.`
        );
        setGuestStage("guest_register");
      }
    } catch (err: any) {
      console.error("Firestore lookup failed:", err);
      const errInfo = {
        error: err instanceof Error ? err.message : String(err),
        operationType: 'get',
        path: `authorized_users/${emailClean}`,
        authInfo: {
          userId: auth.currentUser?.uid,
          email: auth.currentUser?.email,
          emailVerified: auth.currentUser?.emailVerified,
        }
      };
      console.error('Firestore Error:', JSON.stringify(errInfo));
      setErrorText(
        lang === "es"
          ? "Error de base de datos de lista blanca. Inténtalo de nuevo."
          : "Database error validating whitelist. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterAndEnter = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText("");
    setIsLoading(true);

    const emailClean = guestEmail.trim().toLowerCase();
    const nameClean = guestName.trim();

    if (!nameClean) {
      setErrorText(lang === "es" ? "El nombre es requerido." : "Name is required.");
      setIsLoading(false);
      return;
    }

    if (!emailClean) {
      setErrorText(lang === "es" ? "El correo es requerido." : "Email is required.");
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailClean)) {
      setErrorText(lang === "es" ? "El formato de correo no es válido." : "The email format is invalid.");
      setIsLoading(false);
      return;
    }

    const isSuperAdmin = emailClean === "eupirne@gmail.com";
    if (!isSuperAdmin) {
      if (!guestPassword.trim()) {
        setErrorText(lang === "es" ? "La contraseña es requerida para registrarse." : "Password is required to register.");
        setIsLoading(false);
        return;
      }
      if (guestPassword.trim() !== guestConfirmPassword.trim()) {
        setErrorText(lang === "es" ? "Las contraseñas no coinciden. Por favor verifique." : "Passwords do not match. Please verify.");
        setIsLoading(false);
        return;
      }
    }

    try {
      const targetDocRef = doc(db, "authorized_users", emailClean);
      const grantedAt = new Date();
      const expiresAt = new Date(grantedAt.getTime() + 30 * 24 * 60 * 60 * 1000);

      const docPayload: any = {
        email: emailClean,
        name: nameClean,
        role: "user",
        access_granted_at: Timestamp.fromDate(grantedAt),
        access_expires_at: Timestamp.fromDate(expiresAt)
      };

      if (!isSuperAdmin) {
        docPayload.password = guestPassword.trim();
      }

      await setDoc(targetDocRef, docPayload);

      const names = nameClean.split(" ");
      const firstName = names[0] || "Invitado";
      const lastName = names.slice(1).join(" ") || "";

      const guestUser: GmailUser = {
        id: "guest_" + Math.random().toString(36).substring(2, 11),
        email: emailClean,
        firstName,
        lastName,
        username: emailClean.split("@")[0] || "invitado",
        avatarColor: "#475569",
        createdAt: new Date().toISOString(),
        role: "guest",
        accessExpiresAt: expiresAt.toISOString()
      };

      localStorage.setItem("xochimilco_logged_user", JSON.stringify(guestUser));
      const activeSessionAccounts = JSON.parse(localStorage.getItem("xochimilco_session_accounts") || "[]") as GmailUser[];
      if (!activeSessionAccounts.some(u => u.id === guestUser.id)) {
        activeSessionAccounts.push(guestUser);
        localStorage.setItem("xochimilco_session_accounts", JSON.stringify(activeSessionAccounts));
      }

      // Instead of entering instantly, trigger first-time registration welcome modal!
      setRegisteredUserPayload(guestUser);
      setShowWelcomeModal(true);
    } catch (err: any) {
      console.error("Firestore register failed:", err);
      const errInfo = {
        error: err instanceof Error ? err.message : String(err),
        operationType: 'create',
        path: `authorized_users/${emailClean}`,
        authInfo: {
          userId: auth.currentUser?.uid,
          email: auth.currentUser?.email,
          emailVerified: auth.currentUser?.emailVerified,
        }
      };
      console.error('Firestore Error:', JSON.stringify(errInfo));
      setErrorText(
        lang === "es"
          ? "Error de permisos al registrar en la lista blanca."
          : "Permissions error registering you on the whitelist."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#000e1e] text-slate-100 flex flex-col font-sans select-none overflow-x-hidden relative pb-16 pt-24">
      {/* 1. FUTURISTIC BACKGROUND WITH RADIAL GRADIENTS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        
        {/* Deep Blue Base (#001F3F) simulated radial */}
        <div className="absolute top-[0%] left-[20%] w-[70vw] h-[70vw] rounded-full bg-[#001f3f]/40 blur-[130px]" />
        
        {/* Neon Green (#39FF14) highlight orb */}
        <motion.div 
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -30, 30, 0],
            scale: [1, 1.1, 0.9, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] right-[5%] w-[45vw] h-[45vw] rounded-full bg-[#39ff14]/8 blur-[150px]"
        />

        {/* Vibrant Orange (#FF8C00) highlight orb */}
        <motion.div 
          animate={{
            x: [0, -50, 30, 0],
            y: [0, 40, -40, 0],
            scale: [1, 0.9, 1.1, 1]
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-[10%] left-[5%] w-[50vw] h-[50vw] rounded-full bg-[#ff8c00]/8 blur-[160px]"
        />

        {/* Additional futuristic accents */}
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[90%] h-[1px] bg-gradient-to-r from-transparent via-[#39ff14]/20 to-transparent" />
      </div>

      <div className="noise-overlay absolute inset-0 z-0 pointer-events-none opacity-5" />

      {/* 2. THE NAVBAR / TOP ACCESS HEADER */}
      <header className="fixed top-0 inset-x-0 h-20 bg-[#000e1e]/80 backdrop-blur-md border-b border-white/5 z-50 px-6">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          
          {/* Logo Abstracción Enlace Químico */}
          <div className="flex items-center gap-3 cursor-default">
            <div className="relative w-8 h-8 flex items-center justify-center">
              {/* Outer orbit circle */}
              <div className="absolute inset-0 rounded-full border border-[#39ff14]/30 animate-[spin_10s_linear_infinite]" />
              {/* Chemical bonds abstract */}
              <div className="absolute w-3.5 h-3.5 rounded-full bg-gradient-to-br from-[#ff8c00] to-[#39ff14] ring-2 ring-black shadow-lg" />
              <div className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <div className="absolute bottom-1.5 left-0 w-1.5 h-1.5 rounded-full bg-cyan-400" />
              {/* Visual link strings representing chemical structures */}
              <div className="absolute top-1/2 left-1/2 w-[18px] h-[1.5px] bg-white/20 -translate-x-1/2 -translate-y-1/2 rotate-45" />
            </div>
            
            <span className="font-space text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
              <span>{curr.title}</span>
              <span className="text-[10px] bg-gradient-to-r from-[#ff8c00] to-[#39ff14] bg-clip-text text-transparent font-mono tracking-widest uppercase px-1.5 py-0.5 rounded border border-[#39ff14]/15 bg-[#001f3f]/50">
                PRO
              </span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Language Selector Switch flotante */}
            <button 
              onClick={() => setLang(lang === "es" ? "en" : "es")} 
              className="flex items-center gap-2 text-xs font-space font-medium text-slate-300 hover:text-white transition-all bg-[#001f3f]/60 hover:bg-[#001f3f]/90 border border-white/10 px-3.5 py-1.5 rounded-full cursor-pointer shadow-lg hover:shadow-[#39ff14]/5"
            >
              <Languages className="w-3.5 h-3.5 text-[#39ff14]" />
              <span>{lang === "es" ? "EN | Global" : "ES | Español"}</span>
            </button>

            {/* Terminal Gate badge */}
            <span className="hidden sm:inline-flex items-center gap-1.5 bg-[#001f3f]/55 border border-[#39ff14]/20 rounded-full py-1 px-3.5 font-mono text-[9px] uppercase font-bold tracking-widest text-[#39ff14]/90 shadow-sm">
              <Shield className="w-3 h-3 text-[#39ff14]" />
              <span>Atajos Gate v4.2</span>
            </span>
          </div>
        </div>
      </header>

      {/* 3. HERO & MAIN CONTENT GRID */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 w-full mt-8">
        
        {/* LEFT COMPONENT: HERO STATEMENT & DETAILED SAAS GRAPHICS */}
        <div className="lg:col-span-7 text-left space-y-8">
          
          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#001f3f]/75 border border-white/10 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#ff8c00] animate-ping" />
            <span className="w-2 h-2 rounded-full bg-[#ff8c00] absolute" />
            <span className="text-[10px] font-mono tracking-[0.16em] text-slate-200 uppercase font-extrabold ml-1.5">
              {curr.heroTag}
            </span>
          </div>

          {/* Titles in Space Grotesk */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-space font-extrabold text-white tracking-tight leading-[1.08] text-balance">
              {curr.heroTitle}{" "} 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff8c00] via-yellow-300 to-[#39ff14] drop-shadow-[0_4px_16px_rgba(57,255,20,0.25)]">
                {curr.heroTitleGradient}
              </span>
            </h1>
            <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-[580px] font-sans">
              {curr.heroDesc}
            </p>
          </div>

          {/* TRABAJO CIENTÍFICO CINEMÁTICO */}
          <div className="bg-[#001f3f]/35 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden group hover:border-[#39ff14]/30 transition-all duration-500">
            {/* Ambient neon badge */}
            <div className="absolute top-0 right-0 h-0.5 w-32 bg-gradient-to-r from-[#ff8c00] to-[#39ff14]" />
            
            {/* Header of laboratory workstation */}
            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#39ff14] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#39ff14]"></span>
                </span>
                <div>
                  <h3 className="font-space text-sm font-bold text-white tracking-tight">
                    {curr.labPreviewTitle}
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    {curr.labPreviewSubtitle}
                  </p>
                </div>
              </div>

              {/* Status capsule */}
              <span className="bg-[#39ff14]/10 border border-[#39ff14]/30 rounded-full px-2 py-0.5 font-mono text-[9px] text-[#39ff14] font-semibold uppercase tracking-wider">
                LIVE 8K
              </span>
            </div>

            {/* Cinematic Image Frame with Overlays */}
            <div className="relative rounded-xl overflow-hidden aspect-[16/10] border border-white/10 group-hover:border-[#39ff14]/20 transition-all duration-300">
              <img 
                src={imageError ? pubchemBiomedicalLabImg : "https://images.unsplash.com/photo-1551244072-5d12893278ab?auto=format&fit=crop&w=1200&q=80"} 
                alt="Latina Female Scientist in Laboratory" 
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover transition-transform duration-[8000ms] ease-out group-hover:scale-105"
              />
              
              {/* Dark subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#000e1e]/90 via-[#000e1e]/20 to-transparent pointer-events-none" />


            </div>
          </div>
          
        </div>

        {/* RIGHT COMPONENT: GMAIL AUTH COMPONENT INNER FIXED ACCESS TERMINAL */}
        <div className="lg:col-span-5 w-full flex justify-center">
          <div className="w-full max-w-[420px] bg-[#001f3f]/50 backdrop-blur-2xl border border-white/10 rounded-[28px] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.4)] relative overflow-hidden flex flex-col justify-between min-h-[480px] hover:border-white/20 transition-all duration-300">
            {/* Visual background gradient circle at the bottom corners of the card */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#39ff14]/15 rounded-full blur-2xl pointer-events-none" />
            
            <div className="space-y-6 relative z-10 w-full">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-[#39ff14] animate-pulse" />
                  <span>
                    {guestStage === "landing" 
                      ? curr.tag 
                      : guestStage === "guest_verify" 
                        ? (lang === "es" ? "VERIFICACIÓN INVITADO" : "GUEST VERIFICATION") 
                        : (lang === "es" ? "SOLICITUD LISTA BLANCA" : "WHITELIST REGISTRATION")}
                  </span>
                </div>
                
                <Lock className="w-4 h-4 text-[#ff8c00]" />
              </div>

              {guestStage === "landing" ? (
                <>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-space font-bold tracking-tight text-white">
                      {lang === "es" ? "Área de Investigación" : "Researcher Sandbox"}
                    </h2>
                    <p className="text-sm text-slate-300 leading-relaxed font-sans mt-2">
                      {curr.description}
                    </p>
                  </div>

                  {/* Safety & IP small note */}
                  <div className="bg-black/35 border border-white/5 rounded-2xl p-4 space-y-2 text-left">
                    <div className="flex items-center gap-2">
                      <Shield className="w-3.5 h-3.5 text-[#39ff14] shrink-0" />
                      <span className="text-[11px] font-bold text-white uppercase tracking-wider">
                        {curr.infoBoxTitle}
                      </span>
                    </div>
                  </div>

                  {/* Login Errors */}
                  <AnimatePresence mode="wait">
                    {errorText && (
                      <motion.div 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="p-3.5 text-[11px] leading-relaxed text-red-400 bg-red-950/45 border border-red-500/20 rounded-xl font-medium text-left flex gap-2.5 box-border w-full"
                      >
                        <span className="w-4 h-4 rounded-full bg-red-500 text-white shrink-0 flex items-center justify-center font-bold text-[10px] mt-0.5">!</span>
                        <span>{errorText}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ACTION: PRIMARY GOOGLE ACCESS TERMINAL */}
                  <div className="space-y-4 pt-2">
                    {/* Custom glowing border surrounding button */}
                    <div className="relative group rounded-xl p-[1px] bg-gradient-to-r from-[#ff8c00] to-[#39ff14] hover:scale-[1.01] active:scale-[0.99] transition-all">
                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={handleGoogleSignIn}
                        className="w-full flex items-center justify-center gap-3.5 h-14 bg-black/90 hover:bg-[#000e1e] rounded-xl text-white font-space font-bold text-[13px] uppercase tracking-wider transition-all focus:outline-none cursor-pointer disabled:opacity-60 disabled:cursor-wait select-none"
                      >
                        {isLoading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
                        ) : (
                          <svg className="w-4.5 h-4.5 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                          </svg>
                        )}
                        <span>{isLoading ? (lang === "es" ? "Conectando..." : "Connecting...") : curr.btnText}</span>
                      </button>
                    </div>

                    {/* Secondary Guest Access Button */}
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={handleGuestSignIn}
                      className="w-full flex items-center justify-center gap-2 h-14 bg-[#001f3f]/40 hover:bg-[#001f3f]/80 border border-white/10 hover:border-[#39ff14]/30 rounded-xl text-slate-300 hover:text-white font-space font-bold text-[13px] uppercase tracking-wider transition-all focus:outline-none cursor-pointer disabled:opacity-60 disabled:cursor-wait select-none"
                    >
                      <ArrowRight className="w-4 h-4 text-[#39ff14]" />
                      <span>{curr.btnGuestText}</span>
                    </button>

                    {/* Dedicated Non-Google Email Access Button */}
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={handleGuestSignIn}
                      className="w-full flex items-center justify-center gap-2.5 h-14 bg-gradient-to-r from-blue-950/40 to-slate-900/60 hover:from-blue-900/50 hover:to-slate-900/75 border border-blue-500/20 hover:border-blue-400/50 rounded-xl text-slate-200 hover:text-white font-space font-bold text-[13px] uppercase tracking-wider transition-all focus:outline-none cursor-pointer disabled:opacity-60 disabled:cursor-wait select-none"
                    >
                      <Mail className="w-4.5 h-4.5 text-blue-400 shrink-0" />
                      <span>{lang === "es" ? "Otros Correos (Hotmail, Outlook...)" : "Other Emails (Hotmail, Outlook...)"}</span>
                    </button>

                    <div className="text-[9.5px] text-slate-400 font-mono tracking-widest text-center uppercase leading-none select-none pt-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#39ff14] inline-block animate-pulse mr-1" />
                      <span>{lang === "es" ? "VERIFICACIÓN DIRECTA GOOGLE CLOUD" : "DIRECT GOOGLE CLOUD VALIDATION"}</span>
                    </div>
                  </div>
                </>
              ) : guestStage === "guest_verify" ? (
                <form onSubmit={handleVerifyAndEnter} className="space-y-4 text-left w-full">
                  <div className="space-y-1">
                    <h2 className="text-xl font-space font-bold text-white tracking-tight">
                      {lang === "es" ? "Ingreso de Invitados" : "Guest Access Input"}
                    </h2>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">
                      {lang === "es" 
                        ? "Ingresa tu información para verificar si tu correo electrónico está registrado en la lista blanca de acceso." 
                        : "Enter your information to verify if your email address is registered on our access whitelist."}
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1.5 font-bold">
                        {lang === "es" ? "Nombre Completo" : "Full Name"}
                      </label>
                      <input 
                        type="text"
                        required
                        disabled={isLoading}
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder={lang === "es" ? "Ej. Elena Ruiz" : "e.g., Elena Ruiz"}
                        className="w-full h-11 bg-black/40 border border-white/10 focus:border-[#39ff14]/40 rounded-xl px-4 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-600 font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1.5 font-bold">
                        {lang === "es" ? "Correo Electrónico" : "Email Address"}
                      </label>
                      <input 
                        type="email"
                        required
                        disabled={isLoading}
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        placeholder="tu.correo@ejemplo.com"
                        className="w-full h-11 bg-black/40 border border-white/10 focus:border-[#39ff14]/40 rounded-xl px-4 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-600 font-sans"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold">
                          {lang === "es" ? "Contraseña de Acceso" : "Access Password"}
                        </label>
                        <span className="text-[9px] text-[#39ff14]/70 font-mono">
                          {lang === "es" ? "(Bypass para eupirne@gmail.com)" : "(Bypass for eupirne@gmail.com)"}
                        </span>
                      </div>
                      <div className="relative">
                        <input 
                          type={showLoginPassword ? "text" : "password"}
                          required={guestEmail.trim().toLowerCase() !== "eupirne@gmail.com"}
                          disabled={isLoading}
                          value={guestPassword}
                          onChange={(e) => setGuestPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full h-11 bg-black/40 border border-white/10 focus:border-[#39ff14]/40 rounded-xl pl-4 pr-11 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-600 font-sans"
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-100 focus:outline-none cursor-pointer"
                        >
                          {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Warning / Informative Info */}
                  <AnimatePresence mode="wait">
                    {errorText && (
                      <motion.div 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="p-3 text-[11px] leading-relaxed text-yellow-500 bg-yellow-500/10 border border-yellow-500/20 rounded-xl font-medium text-left flex gap-2.5 box-border"
                      >
                        <span className="w-4 h-4 rounded-full bg-yellow-600 text-black font-extrabold shrink-0 flex items-center justify-center text-[10px] mt-0.5 font-mono">i</span>
                        <span>{errorText}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-3 pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 h-12 bg-gradient-to-r from-[#ff8c00] to-[#39ff14] hover:opacity-90 rounded-xl text-black font-space font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer disabled:opacity-60 disabled:cursor-wait select-none"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin shrink-0" />
                      ) : (
                        <Shield className="w-4 h-4 shrink-0 text-black" />
                      )}
                      <span>{isLoading ? (lang === "es" ? "Verificando..." : "Verifying...") : (lang === "es" ? "Verificar e Ingresar" : "Verify & Sign In")}</span>
                    </button>

                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => {
                        setGuestStage("landing");
                        setErrorText("");
                      }}
                      className="w-full flex items-center justify-center gap-1.5 h-11 bg-transparent hover:bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white font-space font-bold text-[11px] uppercase tracking-wider transition-all cursor-pointer"
                    >
                      <span>{lang === "es" ? "Volver" : "Back"}</span>
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleRegisterAndEnter} className="space-y-4 text-left w-full">
                  <div className="space-y-1">
                    <h2 className="text-xl font-space font-bold text-yellow-400 tracking-tight flex items-center gap-2">
                      <Sparkles className="w-4.5 h-4.5 text-yellow-400 shrink-0" />
                      <span>{lang === "es" ? "Solicitar Lista Blanca" : "Request Whitelist"}</span>
                    </h2>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans mt-0.5">
                      {lang === "es" 
                        ? "Registra tus datos a continuación para agregarte automáticamente a la lista blanca del sistema de Atajos y habilitar tu acceso inmediato." 
                        : "Enter your details below to automatically add your email address to the Atajos whitelist and enable immediate access."}
                    </p>
                  </div>

                  <div className="space-y-3 pt-1">
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1.5 font-bold">
                        {lang === "es" ? "Nombre Completo" : "Full Name"}
                      </label>
                      <input 
                        type="text"
                        required
                        disabled={isLoading}
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder={lang === "es" ? "Ej. Elena Ruiz" : "e.g., Elena Ruiz"}
                        className="w-full h-11 bg-black/40 border border-white/10 focus:border-[#39ff14]/40 rounded-xl px-4 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-600 font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1.5 font-bold">
                        {lang === "es" ? "Correo Electrónico" : "Email Address"}
                      </label>
                      <input 
                        type="email"
                        required
                        disabled={isLoading}
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        placeholder="tu.correo@ejemplo.com"
                        className="w-full h-11 bg-black/40 border border-white/10 focus:border-[#39ff14]/40 rounded-xl px-4 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-600 font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1.5 font-bold">
                        {lang === "es" ? "Crear Contraseña" : "Create Password"}
                      </label>
                      <div className="relative">
                        <input 
                          type={showRegisterPassword ? "text" : "password"}
                          required={guestEmail.trim().toLowerCase() !== "eupirne@gmail.com"}
                          disabled={isLoading}
                          value={guestPassword}
                          onChange={(e) => setGuestPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full h-11 bg-black/40 border border-white/10 focus:border-[#39ff14]/40 rounded-xl pl-4 pr-11 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-600 font-sans"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-100 focus:outline-none cursor-pointer"
                        >
                          {showRegisterPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1.5 font-bold">
                        {lang === "es" ? "Repetir Contraseña" : "Repeat Password"}
                      </label>
                      <div className="relative">
                        <input 
                          type={showConfirmPassword ? "text" : "password"}
                          required={guestEmail.trim().toLowerCase() !== "eupirne@gmail.com"}
                          disabled={isLoading}
                          value={guestConfirmPassword}
                          onChange={(e) => setGuestConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full h-11 bg-black/40 border border-white/10 focus:border-[#39ff14]/40 rounded-xl pl-4 pr-11 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-600 font-sans"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-100 focus:outline-none cursor-pointer"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {errorText && (
                    <div className="p-3 text-[11px] leading-relaxed text-red-400 bg-red-950/45 border border-red-500/20 rounded-xl font-medium text-left flex gap-2.5 box-border w-full">
                      <span className="w-4 h-4 rounded-full bg-red-500 text-white shrink-0 flex items-center justify-center font-bold text-[10px] mt-0.5 font-mono">!</span>
                      <span>{errorText}</span>
                    </div>
                  )}

                  <div className="space-y-3 pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 h-12 bg-gradient-to-r from-yellow-400 to-[#39ff14] hover:opacity-90 rounded-xl text-black font-space font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer disabled:opacity-60 disabled:cursor-wait select-none"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-black" />
                      )}
                      <span>{isLoading ? (lang === "es" ? "Registrando..." : "Registering...") : (lang === "es" ? "Enviar Solicitud e Ingresar" : "Submit Request & Sign In")}</span>
                    </button>

                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => {
                        setGuestStage("guest_verify");
                        setErrorText("");
                      }}
                      className="w-full flex items-center justify-center gap-1.5 h-11 bg-transparent hover:bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white font-space font-bold text-[11px] uppercase tracking-wider transition-all cursor-pointer"
                    >
                      <span>{lang === "es" ? "Atrás" : "Back"}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            <p className="text-[10px] text-slate-400 mt-6 leading-relaxed font-sans text-left border-t border-white/5 pt-4">
              {curr.disclaimer}
            </p>
          </div>
        </div>

      </div>



      {/* 6. IMMERSIVE COMPLIANCE NOTE FOOTER */}
      <footer className="max-w-7xl mx-auto px-6 mt-20 text-center relative z-10">
        <div className="w-24 h-[1px] bg-white/10 mx-auto mb-6" />
        <p className="text-[11px] text-slate-400/80 leading-relaxed font-sans max-w-[650px] mx-auto">
          {curr.footerNote}
        </p>
      </footer>

      {/* 7. HIGHLY POLISHED WELCOME MODAL FOR FIRST-TIME REGISTRATION */}
      <AnimatePresence>
        {showWelcomeModal && registeredUserPayload && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -20 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="w-full max-w-lg bg-gradient-to-b from-[#001f3f] to-[#000e1e] border border-[#39ff14]/30 rounded-3xl p-8 text-center space-y-6 shadow-[0_0_50px_rgba(57,255,20,0.15)] relative overflow-hidden"
            >
              {/* Decorative Glow Grid */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:30px_30px] opacity-10 pointer-events-none" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#39ff14]/10 blur-[60px] rounded-full pointer-events-none" />

              {/* Celebration Icon */}
              <motion.div 
                animate={{ rotate: [0, 10, -10, 10, 0], scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 4, repeatType: "reverse" }}
                className="mx-auto w-16 h-16 rounded-full bg-gradient-to-tr from-[#39ff14]/20 to-yellow-500/20 border border-[#39ff14]/40 flex items-center justify-center text-[#39ff14] shadow-[0_0_15px_rgba(57,255,20,0.2)]"
              >
                <Sparkles className="w-8 h-8 text-[#39ff14]" />
              </motion.div>

              <div className="space-y-2 relative z-10">
                <span className="text-[10px] tracking-[0.2em] text-[#39ff14] font-mono uppercase bg-[#39ff14]/10 px-3 py-1 rounded-full border border-[#39ff14]/20 inline-block">
                  {lang === "es" ? "REGISTRO COMPLETADO" : "REGISTRATION COMPLETED"}
                </span>
                <h3 className="text-2xl md:text-3xl font-extrabold font-space text-white tracking-tight pt-2">
                  {lang === "es" ? "🎉 ¡Te damos la bienvenida a Atajos!" : "🎉 Welcome to Atajos!"}
                </h3>
                <p className="text-slate-300 font-sans text-sm max-w-sm mx-auto leading-relaxed mt-2">
                  {lang === "es" ? (
                    <>
                      Hola, <span className="text-[#39ff14] font-bold">{registeredUserPayload.firstName}</span>. Tu cuenta de invitado ha sido registrada de forma segura en nuestra base de datos de la lista blanca.
                    </>
                  ) : (
                    <>
                      Hello, <span className="text-[#39ff14] font-bold">{registeredUserPayload.firstName}</span>. Your guest account has been securely whitelisted in our database.
                    </>
                  )}
                </p>
              </div>

              {/* Whitelist Details Card */}
              <div className="bg-black/50 border border-white/5 rounded-2xl p-5 text-left space-y-3 font-sans relative z-10">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-mono text-[10px] uppercase">{lang === "es" ? "USUARIO" : "USER"}:</span>
                  <span className="text-white font-semibold">{registeredUserPayload.firstName} {registeredUserPayload.lastName}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-mono text-[10px] uppercase">{lang === "es" ? "CORREO ELECTRÓNICO" : "EMAIL ADDRESS"}:</span>
                  <span className="text-white font-mono text-[11px]">{registeredUserPayload.email}</span>
                </div>
                <div className="h-[1px] bg-white/5 my-1" />
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-mono text-[10px] uppercase">{lang === "es" ? "LICENCIA DE ACCESO" : "ACCESS LICENSE"}:</span>
                  <span className="text-[#39ff14] font-extrabold font-mono text-[10px] uppercase bg-[#39ff14]/10 border border-[#39ff14]/20 px-2 py-0.5 rounded">
                    {lang === "es" ? "Activa (30 Días)" : "Active (30 Days)"}
                  </span>
                </div>
              </div>

              <div className="space-y-4 pt-2 relative z-10">
                <p className="text-[11px] text-slate-400/90 leading-relaxed font-sans max-w-md mx-auto">
                  {lang === "es" 
                    ? "Ya puedes acceder a los módulos de análisis bio-digital, simulación de dosificación botánica y descarga de informes científicos de productos naturales."
                    : "You are now ready to explore high-fidelity bio-digital analysis, botanical dosage simulations, and certified scientific Report generation for natural compounds."}
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setShowWelcomeModal(false);
                    onAuthSuccess(registeredUserPayload);
                  }}
                  className="w-full h-12 bg-gradient-to-r from-yellow-400 via-[#39ff14] to-emerald-500 hover:opacity-90 rounded-xl text-black font-space font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_20px_rgba(57,255,20,0.25)] flex items-center justify-center gap-2 select-none"
                >
                  <span>{lang === "es" ? "Comenzar Exploración" : "Begin Exploration"}</span>
                  <ArrowRight className="w-4 h-4 text-black stroke-[3px]" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
