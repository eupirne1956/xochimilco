import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Languages, 
  Shield, 
  Sparkles,
  ArrowRight
} from "lucide-react";
import { 
  signInWithPopup, 
  GoogleAuthProvider
} from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { GmailUser } from "../types";

interface GmailAuthPortalProps {
  lang: "es" | "en";
  setLang: (l: "es" | "en") => void;
  onAuthSuccess: (user: GmailUser) => void;
}

const t = {
  es: {
    tag: "CONSOLA DE ACCESO",
    title: "Atajos",
    subtitle: "Estudio de Diseño Bio-Digital",
    description: "La sabiduría etnobotánica mesoamericana decodificada para la ciencia moderna. Conéctate con tu cuenta institucional o personal de Google para acceder a tus fórmulas guardadas, simuladores fitoquímicos e informes avanzados de COFEPRIS.",
    btnText: "Iniciar sesión con Google",
    disclaimer: "Atajos utiliza validación Zero-Trust de Google Cloud. Tus datos fitoquímicos e información personal permanecen bajo protocolos de cifrado de grado militar.",
    footerNote: "Terminal de Atajos de Xochimilco. Cumplimiento regulatorio e investigación científica de vanguardia.",
    infoBoxTitle: "Acceso Seguro",
    infoBoxText: "No compartimos tus datos de investigación ni fórmulas ADME externas. Todo permanece en tu espacio de trabajo personal.",
    googleCanceled: "El inicio de sesión con Google falló o fue cancelado. Por favor, habilita las ventanas emergentes e inténtalo de nuevo."
  },
  en: {
    tag: "ACCESS CONSOLE",
    title: "Atajos",
    subtitle: "Bio-Digital Design Studio",
    description: "Mesoamerican ethnobotanical wisdom decoded for modern science. Connect with your personal or institutional Google account to access saved formulas, phytochemical simulators, and advanced COFEPRIS regulatory reports.",
    btnText: "Sign in with Google",
    disclaimer: "Atajos uses Google Cloud Zero-Trust validation. Your phytochemical data and personal profile remain protected by military-grade encryption protocols.",
    footerNote: "Atajos Terminal by Xochimilco. Regulatory compliance and cutting-edge scientific research.",
    infoBoxTitle: "Secure Session",
    infoBoxText: "We do not share your research data or external ADME formulas. Everything remains safely within your personal workspace.",
    googleCanceled: "Google sign-in failed or was canceled. Please enable pop-ups and try again."
  }
};

export function GmailAuthPortal({ lang, setLang, onAuthSuccess }: GmailAuthPortalProps) {
  const [errorText, setErrorText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const curr = t[lang];

  const handleGoogleSignIn = async () => {
    try {
      setErrorText("");
      setIsLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      
      let finalUser: GmailUser;
      if (userDoc.exists()) {
        finalUser = userDoc.data() as GmailUser;
      } else {
        // Create a new Firestore user profile on first Google Login
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
          createdAt: new Date().toISOString()
        };
        
        await setDoc(userDocRef, finalUser);
      }

      // Add to local switcher state for smooth session recovery inside App
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

  return (
    <div className="fixed inset-0 z-[200] bg-[#f8fafc] flex flex-col items-center justify-center font-sans select-none overflow-y-auto py-10 px-4">
      
      {/* Top Header Indicators */}
      <div className="absolute top-4 right-6 flex items-center gap-4 text-xs font-medium text-slate-500">
        <button 
          onClick={() => setLang(lang === "es" ? "en" : "es")} 
          className="flex items-center gap-1.5 hover:bg-slate-200/60 transition-all font-semibold tracking-wide bg-slate-100 hover:text-slate-900 border border-slate-200/80 px-3 py-1.5 rounded-full cursor-pointer"
        >
          <Languages className="w-3.5 h-3.5" />
          <span>{lang === "es" ? "English" : "Español"}</span>
        </button>
        <span className="flex items-center gap-1 bg-slate-100 font-mono text-[10px] uppercase font-bold tracking-wider border border-slate-200/80 px-2.5 py-1 rounded-full text-slate-500">
          <Shield className="w-3 h-3 text-slate-400 mr-0.5 inline-block" />
          <span>Atajos Gate v2.0</span>
        </span>
      </div>

      <div className="w-full max-w-[980px] bg-white rounded-[28px] border border-slate-200/80 p-8 md:p-14 shadow-2xl shadow-slate-200/50 flex flex-col md:flex-row gap-8 md:gap-16 min-h-[520px] transition-all">
        
        {/* Left branding panel */}
        <div className="flex-1 flex flex-col justify-between text-left">
          <div className="space-y-6">
            <div className="flex items-center gap-2.5 cursor-default">
              <div className="h-8 w-8 rounded-lg bg-[#4285F4] flex items-center justify-center text-white font-extrabold text-sm shadow shadow-blue-500/20">
                A
              </div>
              <span className="text-slate-300 font-light">|</span>
              <span className="text-[10px] font-mono font-extrabold text-[#4285F4] uppercase tracking-widest bg-blue-50 border border-blue-100 py-0.5 px-2 rounded">
                {curr.tag}
              </span>
            </div>

            <div className="space-y-3">
              <h1 className="text-[36px] md:text-[44px] font-bold text-slate-900 tracking-tight leading-none bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 bg-clip-text text-transparent">
                {curr.title}
              </h1>
              <p className="text-[#4285F4] font-mono text-xs font-semibold tracking-widest uppercase leading-none">
                {curr.subtitle}
              </p>
              <p className="text-slate-600 text-[14px] leading-relaxed pt-2 max-w-[380px]">
                {curr.description}
              </p>
            </div>
          </div>

          <div className="pt-10 space-y-4 max-w-[360px]">
            {/* Visual feature bullet */}
            <div className="flex gap-3 items-start p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-[12px] font-extrabold text-slate-800 leading-tight">
                  {curr.infoBoxTitle}
                </p>
                <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                  {curr.infoBoxText}
                </p>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              {curr.disclaimer}
            </p>
          </div>
        </div>

        {/* Right input forms panel */}
        <div className="flex-1 flex flex-col justify-center items-center">
          <div className="w-full max-w-[360px] space-y-6 text-center">
            
            {/* Interactive login container */}
            <div className="bg-slate-50/50 border border-slate-100 p-6 rounded-2xl space-y-4 shadow-inner">
              <div className="w-12 h-12 bg-white border border-slate-200/80 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <Shield className="w-5 h-5 text-[#4285F4]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-800">
                  {lang === "es" ? "Identificación Requerida" : "Identification Required"}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {lang === "es" ? "Accede de forma rápida y segura en un solo clic." : "Access rapidly and securely in a single click."}
                </p>
              </div>

              {/* Error display */}
              <AnimatePresence mode="wait">
                {errorText && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="p-3 text-[11px] leading-relaxed text-red-600 bg-red-50 border border-red-100 rounded-xl font-medium text-left flex gap-2"
                  >
                    <span className="w-3.5 h-3.5 rounded-full bg-red-500 text-white shrink-0 flex items-center justify-center font-bold text-[9px] mt-0.5">!</span>
                    <span>{errorText}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* The Single Primary Button: Google Sign-In with popup */}
              <button
                type="button"
                disabled={isLoading}
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3.5 h-14 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl text-slate-700 hover:text-slate-900 font-bold text-[13px] uppercase tracking-wide transition-all focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/20 shadow shadow-slate-100/80 hover:shadow-md cursor-pointer disabled:opacity-60 disabled:cursor-wait shrink-0 select-none group"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-[#4285F4] border-t-transparent rounded-full animate-spin shrink-0" />
                ) : (
                  <svg className="w-4.5 h-4.5 shrink-0 transition-transform group-hover:scale-105" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                )}
                <span>{isLoading ? (lang === "es" ? "Conectando..." : "Signing in...") : curr.btnText}</span>
              </button>
            </div>

            <div className="text-[10px] text-slate-400 font-mono tracking-wider flex items-center justify-center gap-1 bg-slate-100/50 py-1 rounded-full border border-slate-150/40 select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34A853] inline-block animate-pulse" />
              <span>{lang === "es" ? "MÉTODO DE AUTENTICACIÓN GOOGLE" : "GOOGLE AUTH USE METHOD"}</span>
            </div>

          </div>
        </div>
      </div>

      <p className="mt-8 text-center text-[11px] text-slate-400/80 leading-relaxed font-sans max-w-[600px] select-none">
        {curr.footerNote}
      </p>
    </div>
  );
}
