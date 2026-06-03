import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ChevronDown, 
  HelpCircle, 
  Eye, 
  EyeOff, 
  Plus, 
  LogOut, 
  Check, 
  ArrowLeft,
  Building,
  User,
  Shield,
  Languages,
  Sparkles
} from "lucide-react";
import { GmailUser } from "../types";

interface GmailAuthPortalProps {
  lang: "es" | "en";
  setLang: (l: "es" | "en") => void;
  onAuthSuccess: (user: GmailUser) => void;
}

// Pre-populate with our personalized target user
const DEFAULT_USER: GmailUser = {
  id: "eupirne-default",
  email: "eupirne@gmail.com",
  firstName: "Eupirne",
  lastName: "XP",
  username: "eupirne",
  avatarColor: "#1a73e8", // Google Blue
  createdAt: new Date().toISOString()
};

const EXTRA_DEFAULT_USER: GmailUser = {
  id: "admin-xochimilco",
  email: "admin@xochimilco.bio",
  firstName: "Admin",
  lastName: "Xochimilco",
  username: "admin",
  avatarColor: "#0f9d58", // Google Green
  createdAt: new Date().toISOString()
};

export function GmailAuthPortal({ lang, setLang, onAuthSuccess }: GmailAuthPortalProps) {
  // Database of users in localStorage
  const [users, setUsers] = useState<GmailUser[]>([]);
  // Auth state
  const [activeUser, setActiveUser] = useState<GmailUser | null>(null);
  
  // Navigation step state inside portal
  // "email" | "password" | "create_name" | "create_basic" | "create_email" | "create_password"
  const [step, setStep] = useState<"email" | "password" | "create_name" | "create_basic" | "create_email" | "create_password">("email");
  
  // Inputs fields
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorText, setErrorText] = useState("");

  // Create User Temp State
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("1");
  const [birthDay, setBirthDay] = useState("");
  const [gender, setGender] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

  // Create Account Dropdown
  const [showCreateMenu, setShowCreateMenu] = useState(false);

  // Target logging in user (loaded when email exists, prior to password check)
  const [targetLoginUser, setTargetLoginUser] = useState<GmailUser | null>(null);

  // Setup initial accounts from localStorage or defaults
  useEffect(() => {
    const stored = localStorage.getItem("xochimilco_users");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as GmailUser[];
        if (parsed.length > 0) {
          setUsers(parsed);
          // Set emailInput default to first user or personalized email
          const eup = parsed.find(u => u.email === "eupirne@gmail.com");
          if (eup) {
            setEmailInput(eup.email);
          } else {
            setEmailInput(parsed[0].email);
          }
        } else {
          initializeDefaults();
        }
      } catch (e) {
        initializeDefaults();
      }
    } else {
      initializeDefaults();
    }
  }, []);

  const initializeDefaults = () => {
    const defaults = [DEFAULT_USER, EXTRA_DEFAULT_USER];
    localStorage.setItem("xochimilco_users", JSON.stringify(defaults));
    setUsers(defaults);
    setEmailInput("eupirne@gmail.com");
  };

  // Error clearing
  useEffect(() => {
    setErrorText("");
  }, [emailInput, passwordInput, newFirstName, newLastName, newUsername, newPassword, newPasswordConfirm]);

  // Handle Email Step Submission
  const handleEmailNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      setErrorText(lang === "es" ? "Introduce un correo electrónico o teléfono" : "Enter an email or phone number");
      return;
    }

    // Try finding user by email or username
    const normalizedInput = emailInput.trim().toLowerCase();
    const found = users.find(
      u => u.email.toLowerCase() === normalizedInput || u.username.toLowerCase() === normalizedInput
    );

    if (found) {
      setTargetLoginUser(found);
      setStep("password");
      setPasswordInput("");
    } else {
      setErrorText(
        lang === "es" 
          ? "No pudimos encontrar tu cuenta de Google o Xochimilco" 
          : "Couldn't find your Google or Xochimilco Account"
      );
    }
  };

  // Handle Password Step Submission
  const handlePasswordNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput) {
      setErrorText(lang === "es" ? "Introduce tu contraseña" : "Enter your password");
      return;
    }

    // Since this is a client-side simulation, we allow passwords matching our rules
    // and let users log in. If logging in as pre-seeded ones, they can enter anything (or standard 'eupirne' / 'admin').
    // Let's validate username/password length greater than 4 for safety.
    if (passwordInput.length < 4) {
      setErrorText(
        lang === "es"
          ? "La contraseña es incorrecta. Vuelve a intentarlo."
          : "Wrong password. Try again."
      );
      return;
    }

    if (targetLoginUser) {
      // Successfully authenticated!
      localStorage.setItem("xochimilco_logged_user", JSON.stringify(targetLoginUser));
      
      // Also ensure this user is stored in the list of active local accounts
      const activeSessionAccounts = JSON.parse(localStorage.getItem("xochimilco_session_accounts") || "[]") as GmailUser[];
      if (!activeSessionAccounts.some(u => u.id === targetLoginUser.id)) {
        activeSessionAccounts.push(targetLoginUser);
        localStorage.setItem("xochimilco_session_accounts", JSON.stringify(activeSessionAccounts));
      }

      onAuthSuccess(targetLoginUser);
    }
  };

  // Create User Workflow Handlers
  const handleCreateNameNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFirstName.trim()) {
      setErrorText(lang === "es" ? "Escribe tu nombre de pila" : "Enter your first name");
      return;
    }
    setStep("create_basic");
  };

  const handleCreateBasicNext = (e: React.FormEvent) => {
    e.preventDefault();
    const year = parseInt(birthYear);
    const day = parseInt(birthDay);
    
    if (isNaN(day) || day < 1 || day > 31) {
      setErrorText(lang === "es" ? "Introduce un día válido" : "Enter a valid day");
      return;
    }
    if (isNaN(year) || year < 1920 || year > 2026) {
      setErrorText(lang === "es" ? "Introduce un año válido" : "Enter a valid year");
      return;
    }
    if (!gender) {
      setErrorText(lang === "es" ? "Selecciona tu sexo de registro" : "Please select your gender");
      return;
    }
    
    // Auto-generate a suggested username based on first and last name
    const baseSug = `${newFirstName.toLowerCase()}${newLastName ? newLastName.toLowerCase().substring(0, 3) : ""}`;
    const cleanSug = baseSug.replace(/[^a-z0-9]/g, "");
    setNewUsername(cleanSug);
    setStep("create_email");
  };

  const handleCreateEmailNext = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = newUsername.trim().toLowerCase();
    if (!cleanUser || cleanUser.length < 3) {
      setErrorText(lang === "es" ? "El nombre de usuario debe tener 3 caracteres o más" : "Username must be 3 or more characters");
      return;
    }

    // Check if username/email already exists
    const fullEmailSug = `${cleanUser}@xochimilco.bio`;
    const exists = users.some(u => u.username.toLowerCase() === cleanUser || u.email.toLowerCase() === fullEmailSug);
    
    if (exists) {
      setErrorText(
        lang === "es" 
          ? "Ese nombre de usuario ya está en uso. Elige otro." 
          : "That username is taken. Try another."
      );
      return;
    }

    setStep("create_password");
  };

  const handleCreatePasswordNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setErrorText(
        lang === "es" 
          ? "Elige una contraseña más segura. Prueba con una mezcla de letras y números (mínimo 6 caracteres)." 
          : "Password is too weak. Must be at least 6 characters."
      );
      return;
    }
    if (newPassword !== newPasswordConfirm) {
      setErrorText(lang === "es" ? "Las contraseñas no coinciden" : "Passwords do not match");
      return;
    }

    // Build the final user and add to DB
    const colors = ["#1a73e8", "#ea4335", "#fbbc05", "#34a853", "#9c27b0", "#009688", "#795548"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const newUser: GmailUser = {
      id: "user-" + Date.now(),
      email: `${newUsername.trim().toLowerCase()}@xochimilco.bio`,
      firstName: newFirstName.trim(),
      lastName: newLastName.trim(),
      username: newUsername.trim().toLowerCase(),
      avatarColor: randomColor,
      createdAt: new Date().toISOString()
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem("xochimilco_users", JSON.stringify(updatedUsers));

    // Sign them in
    localStorage.setItem("xochimilco_logged_user", JSON.stringify(newUser));
    
    // Manage active accounts switching list
    const activeSessionAccounts = JSON.parse(localStorage.getItem("xochimilco_session_accounts") || "[]") as GmailUser[];
    if (!activeSessionAccounts.some(u => u.id === newUser.id)) {
      activeSessionAccounts.push(newUser);
      localStorage.setItem("xochimilco_session_accounts", JSON.stringify(activeSessionAccounts));
    }

    onAuthSuccess(newUser);
  };

  const selectPreseededUser = (user: GmailUser) => {
    setEmailInput(user.email);
    setTargetLoginUser(user);
    setStep("password");
    setPasswordInput("");
  };

  const t = {
    es: {
      signIn: "Iniciar sesión",
      subtitle: "Ir a Xochimilco Bio-Tech Studio",
      createAccount: "Crear cuenta",
      forMe: "Para mi uso personal",
      forBusiness: "Para el trabajo o mi empresa",
      emailOrPhone: "Correo electrónico o nombre de usuario",
      forgotEmail: "¿Has olvidado tu correo electrónico?",
      disclaimer: "No es tu ordenador? Utiliza el modo de navegación privada para iniciar sesión.",
      learnMore: "Más información sobre cómo usar el modo de navegación privada",
      next: "Siguiente",
      enterPass: "Introduce tu contraseña",
      verifyIdentity: "Para continuar, primero debes verificar tu identidad.",
      showPass: "Mostrar contraseña",
      forgotPass: "¿Has olvidado tu contraseña?",
      orSelectAccount: "Alternativamente, selecciona una cuenta registrada:",
      createTitle: "Crear una cuenta de Google",
      createNameSubtitle: "Escribe tu nombre",
      firstName: "Nombre de pila",
      lastName: "Apellidos (opcional)",
      basicInfoTitle: "Información básica",
      basicInfoSubtitle: "Introduce tu fecha de nacimiento y tu sexo",
      day: "Día",
      month: "Mes",
      year: "Año",
      gender: "Sexo",
      genderMale: "Hombre",
      genderFemale: "Mujer",
      genderRatherNot: "Prefiero no decirlo",
      chooseEmailTitle: "Elige tu dirección de correo electrónico",
      chooseEmailSubtitle: "Puedes usar letras, números y puntos",
      usernameOption: "Nombre de usuario",
      securePassTitle: "Crea una contraseña segura",
      securePassSubtitle: "Crea una contraseña con una mezcla de letras y números de mínimo 6 caracteres.",
      password: "Contraseña",
      confirmPassword: "Confirmar contraseña"
    },
    en: {
      signIn: "Sign in",
      subtitle: "to continue to Xochimilco Bio-Tech",
      createAccount: "Create account",
      forMe: "For my personal use",
      forBusiness: "For work or my business",
      emailOrPhone: "Email or username",
      forgotEmail: "Forgot email?",
      disclaimer: "Not your computer? Use a Private Window to sign in privately.",
      learnMore: "Learn more about using private browsing",
      next: "Next",
      enterPass: "Enter your password",
      verifyIdentity: "To continue, first verify it's you.",
      showPass: "Show password",
      forgotPass: "Forgot password?",
      orSelectAccount: "Alternatively, select an active account below:",
      createTitle: "Create a Google Account",
      createNameSubtitle: "Enter your name",
      firstName: "First name",
      lastName: "Last name (optional)",
      basicInfoTitle: "Basic information",
      basicInfoSubtitle: "Enter your birthday and gender",
      day: "Day",
      month: "Month",
      year: "Year",
      gender: "Gender",
      genderMale: "Male",
      genderFemale: "Female",
      genderRatherNot: "Rather not say",
      chooseEmailTitle: "Choose your email address",
      chooseEmailSubtitle: "You can use letters, numbers & periods",
      usernameOption: "Username",
      securePassTitle: "Create a strong password",
      securePassSubtitle: "Create a password with a mix of letters and numbers with at least 6 characters.",
      password: "Password",
      confirmPassword: "Confirm password"
    }
  };

  const curr = t[lang];

  return (
    <div className="fixed inset-0 z-[200] bg-[#f0f4f9] flex flex-col items-center justify-center font-sans select-none overflow-y-auto py-10 px-4">
      
      {/* Top indicators */}
      <div className="absolute top-4 right-6 flex items-center gap-4 text-xs font-medium text-slate-500">
        <button 
          onClick={() => setLang(lang === "es" ? "en" : "es")} 
          className="flex items-center gap-1 hover:bg-slate-200/60 px-3 py-1.5 rounded-full transition-all cursor-pointer"
        >
          <Languages className="w-3.5 h-3.5" />
          <span>{lang === "es" ? "English (US)" : "Español (España)"}</span>
        </button>
        <span className="flex items-center gap-1">
          <Shield className="w-3.5 h-3.5 text-slate-400" />
          <span>Google Secure Client v4</span>
        </span>
      </div>

      <div className="w-full max-w-[1040px] bg-white rounded-[28px] border border-slate-200 p-8 md:p-14 shadow-md flex flex-col md:flex-row gap-10 md:gap-20 min-h-[500px]">
        
        {/* Left branding panel */}
        <div className="flex-1 flex flex-col justify-between text-left">
          <div className="space-y-6">
            {/* High-fidelity Google colored text or logo */}
            <div className="flex items-center gap-2 cursor-pointer">
              <span className="text-[24px] font-sans font-semibold tracking-tight">
                <span className="text-[#4285F4]">G</span>
                <span className="text-[#EA4335]">o</span>
                <span className="text-[#FBBC05]">o</span>
                <span className="text-[#4285F4]">g</span>
                <span className="text-[#34A853]">l</span>
                <span className="text-[#EA4335]">e</span>
              </span>
              <span className="text-slate-300 font-light">|</span>
              <span className="text-slate-500 font-mono text-[11px] uppercase tracking-widest bg-slate-100 border border-slate-200 py-0.5 px-2 rounded font-bold">Xochimilco Bio-Tech</span>
            </div>

            {/* Stepper dynamic titles */}
            <AnimatePresence mode="wait">
              {step === "email" && (
                <motion.div
                  key="title-email"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-3"
                >
                  <h1 className="text-[32px] md:text-[36px] font-extralight text-slate-900 leading-tight">
                    {curr.signIn}
                  </h1>
                  <p className="text-slate-600 text-[14px] leading-relaxed">
                    {curr.subtitle}
                  </p>
                </motion.div>
              )}

              {step === "password" && (
                <motion.div
                  key="title-pass"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-3"
                >
                  <h1 className="text-[32px] md:text-[36px] font-light text-slate-900 leading-tight">
                    {lang === "es" ? "Te damos la bienvenida" : "Welcome"}
                  </h1>
                  <p className="text-slate-600 text-[14px]">
                    {curr.verifyIdentity}
                  </p>
                </motion.div>
              )}

              {step === "create_name" && (
                <motion.div
                  key="title-cname"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-3"
                >
                  <h1 className="text-[32px] md:text-[36px] font-light text-slate-800 leading-tight">
                    {curr.createTitle}
                  </h1>
                  <p className="text-slate-600 text-[14px]">
                    {curr.createNameSubtitle}
                  </p>
                </motion.div>
              )}

              {step === "create_basic" && (
                <motion.div
                  key="title-cbasic"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-3"
                >
                  <h1 className="text-[32px] md:text-[36px] font-light text-slate-800 leading-tight">
                    {curr.basicInfoTitle}
                  </h1>
                  <p className="text-slate-600 text-[14px]">
                    {curr.basicInfoSubtitle}
                  </p>
                </motion.div>
              )}

              {step === "create_email" && (
                <motion.div
                  key="title-cemail"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-3"
                >
                  <h1 className="text-[32px] md:text-[36px] font-light text-slate-800 leading-tight">
                    {curr.chooseEmailTitle}
                  </h1>
                  <p className="text-slate-600 text-[14px]">
                    {curr.chooseEmailSubtitle}
                  </p>
                </motion.div>
              )}

              {step === "create_password" && (
                <motion.div
                  key="title-cpass"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-3"
                >
                  <h1 className="text-[32px] md:text-[36px] font-light text-slate-800 leading-tight">
                    {curr.securePassTitle}
                  </h1>
                  <p className="text-slate-600 text-[14px]">
                    {curr.securePassSubtitle}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="hidden md:block pt-10 text-[12px] text-slate-500 max-w-[340px] leading-relaxed">
            <p>{curr.disclaimer}</p>
            <span className="text-[#1a73e8] font-semibold hover:underline block mt-2 cursor-pointer">
              {curr.learnMore}
            </span>
          </div>
        </div>

        {/* Right input forms panel */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="space-y-6">
            
            {/* Back Arrow button for Create sequences */}
            {step !== "email" && (
              <button
                type="button"
                onClick={() => {
                  if (step === "password") setStep("email");
                  else if (step === "create_name") setStep("email");
                  else if (step === "create_basic") setStep("create_name");
                  else if (step === "create_email") setStep("create_basic");
                  else if (step === "create_password") setStep("create_email");
                }}
                className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#1a73e8] transition-all py-1 px-3 rounded-full hover:bg-slate-100 text-left cursor-pointer mr-auto"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{lang === "es" ? "Atrás" : "Back"}</span>
              </button>
            )}

            <AnimatePresence mode="wait">
              {/* Form 1: Email Input */}
              {step === "email" && (
                <motion.form
                  key="form-email"
                  onSubmit={handleEmailNext}
                  className="space-y-6 text-left"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="relative group">
                    <input
                      type="text"
                      className={`w-full h-14 rounded-lg border px-4 pt-1 text-slate-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/25 text-base font-normal transition-all ${errorText ? "border-[#ea4335] group-focus-within:border-[#ea4335]" : "border-slate-300 focus:border-[#1a73e8]"}`}
                      placeholder={curr.emailOrPhone}
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      id="gmail-email-input"
                    />
                    <label 
                      htmlFor="gmail-email-input"
                      className="absolute left-4 top-2 text-[11px] text-[#1a73e8] font-medium pointer-events-none transition-all
                               group-placeholder-shown:text-slate-500 group-placeholder-shown:text-base group-placeholder-shown:top-4 bg-white px-1 leading-none"
                    >
                      {curr.emailOrPhone}
                    </label>
                  </div>

                  {errorText && (
                    <p className="text-[12px] text-[#ea4335] font-medium flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-[#ea4335] text-white flex items-center justify-center font-bold text-[10px]">!</span>
                      {errorText}
                    </p>
                  )}

                  <div>
                    <button type="button" className="text-[#1a73e8] font-bold text-[14px] hover:underline cursor-pointer">
                      {curr.forgotEmail}
                    </button>
                  </div>

                  {/* Preloaded accounts selector representing Gmail Switcher state */}
                  <div className="pt-4 border-t border-slate-100 space-y-2.5">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                      {curr.orSelectAccount}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {users.map((u) => (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => selectPreseededUser(u)}
                          className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 hover:border-[#1a73e8]/40 hover:bg-slate-50 transition-all text-left cursor-pointer group"
                        >
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm relative shrink-0" 
                            style={{ backgroundColor: u.avatarColor }}
                          >
                            {u.firstName[0]}
                            {u.email === "eupirne@gmail.com" && (
                              <span className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full border border-white flex items-center justify-center text-[7px] text-white shadow-sm">
                                ★
                              </span>
                            )}
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-xs font-bold text-slate-800 leading-tight truncate">
                              {u.firstName} {u.lastName}
                            </p>
                            <p className="text-[10px] text-slate-500 truncate mt-0.5">
                              {u.email}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.form>
              )}

              {/* Form 2: Password Input */}
              {step === "password" && targetLoginUser && (
                <motion.form
                  key="form-password"
                  onSubmit={handlePasswordNext}
                  className="space-y-6 text-left"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {/* Account Badge switcher chip */}
                  <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 font-medium text-slate-700 text-sm max-w-full">
                    <div 
                      className="w-5 h-5 rounded-full flex items-center justify-center text-white font-black text-[10px] shrink-0" 
                      style={{ backgroundColor: targetLoginUser.avatarColor }}
                    >
                      {targetLoginUser.firstName[0]}
                    </div>
                    <span className="truncate text-xs font-semibold">{targetLoginUser.email}</span>
                    <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  </div>

                  <div className="relative group mt-4">
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`w-full h-14 rounded-lg border px-4 pt-1 text-slate-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/25 text-base font-normal transition-all ${errorText ? "border-[#ea4335] group-focus-within:border-[#ea4335]" : "border-slate-300 focus:border-[#1a73e8]"}`}
                      placeholder={curr.enterPass}
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      id="gmail-password-input"
                    />
                    <label 
                      htmlFor="gmail-password-input"
                      className="absolute left-4 top-2 text-[11px] text-[#1a73e8] font-medium pointer-events-none transition-all
                               group-placeholder-shown:text-slate-500 group-placeholder-shown:text-base group-placeholder-shown:top-4 bg-white px-1 leading-none"
                    >
                      {curr.enterPass}
                    </label>
                  </div>

                  {errorText && (
                    <p className="text-[12px] text-[#ea4335] font-medium flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-[#ea4335] text-white flex items-center justify-center font-bold text-[10px]">!</span>
                      {errorText}
                    </p>
                  )}

                  <div className="flex items-center gap-2 select-none">
                    <input
                      type="checkbox"
                      id="show-pass-check"
                      checked={showPassword}
                      onChange={(e) => setShowPassword(e.target.checked)}
                      className="w-4 h-4 rounded text-[#1a73e8] border-slate-300 focus:ring-[#1a73e8] cursor-pointer"
                    />
                    <label htmlFor="show-pass-check" className="text-xs text-slate-700 font-medium cursor-pointer">
                      {curr.showPass}
                    </label>
                  </div>

                  {/* Password helper disclaimer for client simulation */}
                  <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-100 text-[11px] leading-relaxed text-slate-600">
                    <p className="font-bold text-blue-800 mb-0.5">
                      {lang === "es" ? "Acceso de Demostración:" : "Demo Access:"}
                    </p>
                    <p>
                      {lang === "es" 
                        ? "Este es un portal seguro local. Puedes utilizar cualquier contraseña de mínimo 4 caracteres (ej. 'eupirne' o 'admin') para verificar e iniciar sesión." 
                        : "This is a secure local portal. You may enter any password with at least 4 characters (e.g., 'eupirne' or 'admin') to verify and sign in."}
                    </p>
                  </div>

                  <div>
                    <button type="button" className="text-[#1a73e8] font-bold text-[14px] hover:underline cursor-pointer">
                      {curr.forgotPass}
                    </button>
                  </div>
                </motion.form>
              )}

              {/* Form 3: Create Account Name */}
              {step === "create_name" && (
                <motion.form
                  key="form-cname"
                  onSubmit={handleCreateNameNext}
                  className="space-y-5 text-left"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="relative group">
                    <input
                      type="text"
                      className="w-full h-14 rounded-lg border border-slate-300 px-4 pt-1 text-slate-900 placeholder-transparent focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/25 text-base"
                      placeholder={curr.firstName}
                      value={newFirstName}
                      onChange={(e) => setNewFirstName(e.target.value)}
                      id="create-firstname-input"
                    />
                    <label 
                      htmlFor="create-firstname-input"
                      className="absolute left-4 top-2 text-[11px] text-[#1a73e8] font-medium pointer-events-none transition-all
                               group-placeholder-shown:text-slate-500 group-placeholder-shown:text-base group-placeholder-shown:top-4 bg-white px-1 leading-none"
                    >
                      {curr.firstName}
                    </label>
                  </div>

                  <div className="relative group">
                    <input
                      type="text"
                      className="w-full h-14 rounded-lg border border-slate-300 px-4 pt-1 text-slate-900 placeholder-transparent focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/25 text-base"
                      placeholder={curr.lastName}
                      value={newLastName}
                      onChange={(e) => setNewLastName(e.target.value)}
                      id="create-lastname-input"
                    />
                    <label 
                      htmlFor="create-lastname-input"
                      className="absolute left-4 top-2 text-[11px] text-[#1a73e8] font-medium pointer-events-none transition-all
                               group-placeholder-shown:text-slate-500 group-placeholder-shown:text-base group-placeholder-shown:top-4 bg-white px-1 leading-none"
                    >
                      {curr.lastName}
                    </label>
                  </div>

                  {errorText && (
                    <p className="text-[12px] text-[#ea4335] font-medium flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-[#ea4335] text-white flex items-center justify-center font-bold text-[10px]">!</span>
                      {errorText}
                    </p>
                  )}
                </motion.form>
              )}

              {/* Form 4: Create Account Basic Info */}
              {step === "create_basic" && (
                <motion.form
                  key="form-cbasic"
                  onSubmit={handleCreateBasicNext}
                  className="space-y-5 text-left"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Fecha de nacimiento</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="relative group">
                      <input
                        type="text"
                        maxLength={2}
                        className="w-full h-14 rounded-lg border border-slate-300 px-3 text-center text-slate-900 focus:outline-none focus:border-[#1a73e8] text-base"
                        placeholder={curr.day}
                        value={birthDay}
                        onChange={(e) => setBirthDay(e.target.value.replace(/\D/g, ""))}
                      />
                    </div>
                    <div>
                      <select
                        className="w-full h-14 rounded-lg border border-slate-300 px-3 text-slate-900 bg-white focus:outline-none focus:border-[#1a73e8] text-sm"
                        value={birthMonth}
                        onChange={(e) => setBirthMonth(e.target.value)}
                      >
                        {[
                          "Enero/Jan", "Febrero/Feb", "Marzo/Mar", "Abril/Apr",
                          "Mayo/May", "Junio/Jun", "Julio/Jul", "Agosto/Aug",
                          "Septiembre/Sep", "Octubre/Oct", "Noviembre/Nov", "Diciembre/Dec"
                        ].map((m, idx) => (
                          <option key={idx} value={idx + 1}>{m}</option>
                        ))}
                      </select>
                    </div>
                    <div className="relative group">
                      <input
                        type="text"
                        maxLength={4}
                        className="w-full h-14 rounded-lg border border-slate-300 px-3 text-center text-slate-900 focus:outline-none focus:border-[#1a73e8] text-base"
                        placeholder={curr.year}
                        value={birthYear}
                        onChange={(e) => setBirthYear(e.target.value.replace(/\D/g, ""))}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-3">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{curr.gender}</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "female", label: curr.genderFemale },
                        { id: "male", label: curr.genderMale },
                        { id: "not_say", label: curr.genderRatherNot }
                      ].map((g) => (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => setGender(g.id)}
                          className={`py-2 rounded-lg border text-xs font-semibold text-center transition-all cursor-pointer ${gender === g.id ? "bg-[#1a73e8]/10 border-[#1a73e8] text-[#1a73e8]" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                        >
                          {g.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {errorText && (
                    <p className="text-[12px] text-[#ea4335] font-medium flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-[#ea4335] text-white flex items-center justify-center font-bold text-[10px]">!</span>
                      {errorText}
                    </p>
                  )}
                </motion.form>
              )}

              {/* Form 5: Create User Choose Email */}
              {step === "create_email" && (
                <motion.form
                  key="form-cemail"
                  onSubmit={handleCreateEmailNext}
                  className="space-y-5 text-left"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <p className="text-xs font-medium text-slate-500 leading-normal mb-1">
                    {lang === "es" 
                      ? "Crea una dirección de correo electrónico única para vincular tu laboratorio etnofarmacológico."
                      : "Create a unique email address to link with your etnofarmacological laboratory."}
                  </p>

                  <div className="flex items-center group relative">
                    <input
                      type="text"
                      className={`w-full h-14 rounded-lg border border-slate-300 pl-4 pr-32 pt-1 text-slate-900 placeholder-transparent focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/25 text-base font-normal transition-all`}
                      placeholder={curr.usernameOption}
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value.replace(/[^a-zA-Z0-9]/g, ""))}
                      id="choose-username-input"
                    />
                    <label 
                      htmlFor="choose-username-input"
                      className="absolute left-4 top-2 text-[11px] text-[#1a73e8] font-medium pointer-events-none transition-all
                               group-placeholder-shown:text-slate-500 group-placeholder-shown:text-base group-placeholder-shown:top-4 bg-white px-1 leading-none"
                    >
                      {curr.usernameOption}
                    </label>
                    <span className="absolute right-4 text-sm font-bold text-slate-400 select-none">@xochimilco.bio</span>
                  </div>

                  {errorText && (
                    <p className="text-[12px] text-[#ea4335] font-medium flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-[#ea4335] text-white flex items-center justify-center font-bold text-[10px]">!</span>
                      {errorText}
                    </p>
                  )}
                </motion.form>
              )}

              {/* Form 6: Create User Create Password */}
              {step === "create_password" && (
                <motion.form
                  key="form-cpass"
                  onSubmit={handleCreatePasswordNext}
                  className="space-y-4 text-left"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="relative group">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full h-14 rounded-lg border border-slate-300 px-4 pt-1 text-slate-900 placeholder-transparent focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/25 text-base"
                      placeholder={curr.password}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      id="create-password-input"
                    />
                    <label 
                      htmlFor="create-password-input"
                      className="absolute left-4 top-2 text-[11px] text-[#1a73e8] font-medium pointer-events-none transition-all
                               group-placeholder-shown:text-slate-500 group-placeholder-shown:text-base group-placeholder-shown:top-4 bg-white px-1 leading-none"
                    >
                      {curr.password}
                    </label>
                  </div>

                  <div className="relative group">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full h-14 rounded-lg border border-slate-300 px-4 pt-1 text-slate-900 placeholder-transparent focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/25 text-base"
                      placeholder={curr.confirmPassword}
                      value={newPasswordConfirm}
                      onChange={(e) => setNewPasswordConfirm(e.target.value)}
                      id="create-password-confirm-input"
                    />
                    <label 
                      htmlFor="create-password-confirm-input"
                      className="absolute left-4 top-2 text-[11px] text-[#1a73e8] font-medium pointer-events-none transition-all
                               group-placeholder-shown:text-slate-500 group-placeholder-shown:text-base group-placeholder-shown:top-4 bg-white px-1 leading-none"
                    >
                      {curr.confirmPassword}
                    </label>
                  </div>

                  <div className="flex items-center gap-2 select-none pt-1">
                    <input
                      type="checkbox"
                      id="create-show-pass-check"
                      checked={showPassword}
                      onChange={(e) => setShowPassword(e.target.checked)}
                      className="w-4 h-4 rounded text-[#1a73e8] border-slate-300 focus:ring-[#1a73e8] cursor-pointer"
                    />
                    <label htmlFor="create-show-pass-check" className="text-xs text-slate-700 font-medium cursor-pointer">
                      {curr.showPass}
                    </label>
                  </div>

                  {errorText && (
                    <p className="text-[12px] text-[#ea4335] font-medium flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-[#ea4335] text-white flex items-center justify-center font-bold text-[10px]">!</span>
                      {errorText}
                    </p>
                  )}
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Stepper dynamic CTAs footer inside Card */}
          <div className="flex items-center justify-between pt-8 mt-6 border-t border-slate-100 flex-wrap gap-4">
            
            {/* Create account trigger */}
            {step === "email" ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowCreateMenu(!showCreateMenu)}
                  className="text-[#1a73e8] font-bold text-[14px] hover:bg-slate-50 hover:text-[#1557b0] px-4 py-2.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 select-none"
                >
                  <span>{curr.createAccount}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {/* Google Material Dropdown */}
                {showCreateMenu && (
                  <div className="absolute left-0 bottom-12 z-[210] w-[220px] bg-white rounded-lg border border-slate-200 shadow-xl overflow-hidden py-1.5 animate-fade-in text-left">
                    <button
                      type="button"
                      onClick={() => {
                        setStep("create_name");
                        setShowCreateMenu(false);
                      }}
                      className="w-full px-4 py-3 text-slate-700 hover:bg-slate-50 hover:text-slate-950 font-medium text-xs flex items-center gap-2.5 cursor-pointer"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>{curr.forMe}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setStep("create_name");
                        setShowCreateMenu(false);
                      }}
                      className="w-full px-4 py-3 text-slate-700 hover:bg-slate-50 hover:text-slate-950 font-medium text-xs flex items-center gap-2.5 cursor-pointer border-t border-slate-100"
                    >
                      <Building className="w-4 h-4 text-slate-400" />
                      <span>{curr.forBusiness}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div />
            )}

            {/* General NEXT button */}
            <button
              onClick={(e) => {
                if (step === "email") handleEmailNext(e);
                else if (step === "password") handlePasswordNext(e);
                else if (step === "create_name") handleCreateNameNext(e);
                else if (step === "create_basic") handleCreateBasicNext(e);
                else if (step === "create_email") handleCreateEmailNext(e);
                else if (step === "create_password") handleCreatePasswordNext(e);
              }}
              className="px-6 py-2.5 bg-[#1a73e8] hover:bg-[#1557b0] active:bg-[#124b94] text-white font-bold text-xs rounded-lg transition-all shadow shadow-[#1a73e8]/20 tracking-wider font-sans uppercase flex items-center gap-2 cursor-pointer ml-auto"
            >
              <span>{curr.next}</span>
            </button>
          </div>
        </div>
      </div>

      <p className="mt-8 text-center text-[11px] text-slate-400 leading-relaxed font-sans max-w-[600px]">
        {lang === "es" 
          ? "Acceso administrado por Google Workspace. Para mayor biocontrol y cumplimiento regulatorio COFEPRIS, sus credenciales locales garantizan el aislamiento fitoquímico y de fórmulas ADME de cada laboratorio de forma independiente."
          : "Access managed by Google Workspace. For advanced plant bio-control and COFEPRIS compliance, your local credentials guarantee the phytochemical and ADME structural formulas protection for each distinct laboratory."}
      </p>
    </div>
  );
}
