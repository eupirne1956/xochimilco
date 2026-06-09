import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldCheck, 
  Trash2, 
  UserPlus, 
  Clock, 
  Search, 
  AlertCircle, 
  Calendar, 
  RefreshCw, 
  User, 
  X,
  Plus,
  Compass,
  ArrowRight
} from "lucide-react";
import { db, auth } from "../lib/firebase";
import { collection, doc, getDocs, setDoc, deleteDoc, Timestamp } from "firebase/firestore";
import { AuthorizedUser } from "../types";

interface AdminWhitelistProps {
  lang: "es" | "en";
  onClose?: () => void;
}

// Low-level helper to safely extract Date object from Firestore dynamic output representation
const getJsDate = (val: any): Date => {
  if (!val) return new Date();
  if (typeof val.toDate === "function") {
    return val.toDate();
  }
  if (val.seconds !== undefined) {
    return new Date(val.seconds * 1000);
  }
  return new Date(val);
};

/**
 * Core utility function to create/grant time-bound authorization access in Firestore.
 * Handles date operations and converts standard elements to Firestore native Timestamps.
 */
export async function grantAccessToUser(email: string, role: "admin" | "user", durationDays: number): Promise<void> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail) throw new Error("Email cannot be empty.");
  
  const grantedAt = new Date();
  const expiresAt = new Date(grantedAt.getTime() + durationDays * 24 * 60 * 60 * 1000);
  
  const targetDocRef = doc(db, "authorized_users", cleanEmail);
  await setDoc(targetDocRef, {
    email: cleanEmail,
    role,
    access_granted_at: Timestamp.fromDate(grantedAt),
    access_expires_at: Timestamp.fromDate(expiresAt)
  });
}

export function AdminWhitelistDashboard({ lang, onClose }: AdminWhitelistProps) {
  const [whitelist, setWhitelist] = useState<AuthorizedUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [successText, setSuccessText] = useState("");

  // Form states
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<"admin" | "user">("user");
  const [newDuration, setNewDuration] = useState("30"); // 1, 7, 30, 90, 365, or "custom"
  const [customDays, setCustomDays] = useState("30");

  // Custom in-app confirmation overlays for restricted sandbox environments
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [emailToRevoke, setEmailToRevoke] = useState("");
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const fetchWhitelist = async () => {
    try {
      setIsLoading(true);
      setErrorText("");
      const colRef = collection(db, "authorized_users");
      const snap = await getDocs(colRef);
      
      const loaded: AuthorizedUser[] = [];
      snap.forEach((snapshot) => {
        const raw = snapshot.data();
        
        // Formulate consistent typed entities from storage
        const granted = getJsDate(raw.access_granted_at).toISOString();
        const expires = getJsDate(raw.access_expires_at).toISOString();

        loaded.push({
          email: raw.email || snapshot.id,
          role: raw.role === "admin" ? "admin" : "user",
          access_granted_at: granted,
          access_expires_at: expires
        });
      });
      
      // Sort: admins first, then by email
      loaded.sort((a, b) => {
        if (a.role === "admin" && b.role !== "admin") return -1;
        if (a.role !== "admin" && b.role === "admin") return 1;
        return a.email.localeCompare(b.email);
      });

      setWhitelist(loaded);
    } catch (err: any) {
      console.error("Fetch whitelist failed:", err);
      setErrorText(lang === "es" 
        ? "Error de permisos: Solo cuentas administradoras y autorizadas de Atajos pueden listar la base de datos."
        : "Permissions error: Only Atajos verified administrator accounts can list the access whitelist database."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWhitelist();
  }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText("");
    setSuccessText("");

    const targetEmail = newEmail.trim().toLowerCase();
    if (!targetEmail) {
      setErrorText(lang === "es" ? "Por favor, ingresa un correo electrónico." : "Please enter an email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(targetEmail)) {
      setErrorText(lang === "es" ? "El formato de correo no es válido." : "The email format is invalid.");
      return;
    }

    const durationDaysVal = newDuration === "custom" ? parseInt(customDays, 10) : parseInt(newDuration, 10);
    if (isNaN(durationDaysVal) || durationDaysVal <= 0) {
      setErrorText(lang === "es" ? "El lapso de tiempo debe ser de al menos 1 día." : "The timeframe must be at least 1 day.");
      return;
    }

    try {
      setIsLoading(true);
      await grantAccessToUser(targetEmail, newRole, durationDaysVal);
      
      setSuccessText(lang === "es" 
        ? `¡Autorización Registrada! Se otorgó acceso por ${durationDaysVal} días a ${targetEmail}.`
        : `Authorization Recorded! Granted ${durationDaysVal} days of access to ${targetEmail}.`
      );
      
      // Reset form fields
      setNewEmail("");
      setNewRole("user");
      setNewDuration("30");
      
      // Refresh matching records
      await fetchWhitelist();
    } catch (err: any) {
      console.error("Fails to whitelist:", err);
      setErrorText(lang === "es" 
        ? "Error de transacción: No tiene permisos suficientes o expiró la comunicación."
        : "Transaction failed: You do not have permission or connection timed out."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = (emailToDelete: string) => {
    if (emailToDelete.toLowerCase() === "eupirne@gmail.com") {
      setAlertMessage(lang === "es" 
        ? "No se puede revocar el acceso del administrador principal." 
        : "Cannot revoke access of the main super administrator."
      );
      setShowAlertModal(true);
      return;
    }

    setEmailToRevoke(emailToDelete);
    setShowConfirmModal(true);
  };

  const confirmDeleteUser = async () => {
    if (!emailToRevoke) return;
    setShowConfirmModal(false);

    try {
      setIsLoading(true);
      setErrorText("");
      setSuccessText("");
      
      const docRef = doc(db, "authorized_users", emailToRevoke.toLowerCase());
      await deleteDoc(docRef);

      setSuccessText(lang === "es" 
        ? `Se ha eliminado correctamente el acceso de ${emailToRevoke}.`
        : `Successfully removed access credentials for ${emailToRevoke}.`
      );

      setEmailToRevoke("");
      await fetchWhitelist();
    } catch (err: any) {
      console.error("Delete whitelist failed:", err);
      setErrorText(lang === "es" 
        ? "No se pudo eliminar el registro seleccionado."
        : "Failed to delete the selected record."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const filteredWhitelist = whitelist.filter(u => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6 md:p-10 text-white max-w-5xl mx-auto space-y-10 shadow-2xl relative/10 overflow-hidden">
      
      {/* Decorative Matrix Lines */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header section with inline close buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-white/5 pb-8">
        <div className="space-y-2 text-left">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] tracking-widest font-mono text-emerald-400 font-extrabold uppercase bg-emerald-950/80 border border-emerald-500/30 px-2 rounded">
              {lang === "es" ? "CONSOLA ADMINISTRATIVA" : "ADMINISTRATIVE CONSOLE"}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-black tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
            <span>{lang === "es" ? "Control de Accesos Atajos" : "Atajos Access Control"}</span>
          </h2>
          <p className="text-xs text-muted-foreground max-w-xl">
            {lang === "es" 
              ? "Gestiona autorizaciones temporales, aprueba correos institucionales de Google y define roles de diseño etnobotánico."
              : "Manage temporary authorizations, approve corporate/institutional Google accounts, and adjust research roles."}
          </p>
        </div>

        {onClose && (
          <button 
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-xs border border-white/10 hover:border-white/20 px-4 py-2.5 rounded-full transition-all cursor-pointer font-bold font-mono tracking-wider"
          >
            <X className="w-4 h-4 text-slate-400" />
            <span>{lang === "es" ? "SALIR" : "EXIT PANEL"}</span>
          </button>
        )}
      </div>

      {/* Grid: Left - Add to Whitelist Form, Right - Active Whitelists List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 items-start">
        
        {/* Left Side: Addition formulation */}
        <div className="lg:col-span-5 bg-black/30 border border-white/5 rounded-2xl p-6 space-y-6 text-left">
          <h3 className="text-lg font-bold tracking-tight text-white flex items-center gap-2 pb-3 border-b border-white/5">
            <UserPlus className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{lang === "es" ? "Autorizar Nuevo Usuario" : "Authorize New User"}</span>
          </h3>

          <form onSubmit={handleAddUser} className="space-y-5">
            {/* Input Email */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono tracking-wider font-extrabold text-slate-400 uppercase">
                {lang === "es" ? "Correo Electrónico" : "Email Account"}
              </label>
              <input 
                type="email" 
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="ej: nombre@correo.com"
                className="w-full h-12 bg-slate-950 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                required
              />
            </div>

            {/* Role Radio Select */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono tracking-wider font-extrabold text-slate-400 uppercase block">
                {lang === "es" ? "Rol Asignado" : "Assigned Role"}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setNewRole("user")}
                  className={`h-11 px-4 rounded-xl border flex items-center justify-center gap-2 cursor-pointer font-bold text-xs uppercase tracking-wide transition-all ${
                    newRole === "user" 
                      ? "bg-slate-800 border-primary text-white shadow shadow-primary/20" 
                      : "bg-slate-950/40 border-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  <User className="w-3.5 h-3.5 shrink-0" />
                  <span>User</span>
                </button>
                <button
                  type="button"
                  onClick={() => setNewRole("admin")}
                  className={`h-11 px-4 rounded-xl border flex items-center justify-center gap-2 cursor-pointer font-bold text-xs uppercase tracking-wide transition-all ${
                    newRole === "admin" 
                      ? "bg-slate-800 border-emerald-500 text-white shadow shadow-emerald-500/20" 
                      : "bg-slate-950/40 border-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>Admin</span>
                </button>
              </div>
            </div>

            {/* Duration Dropdown Select */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono tracking-wider font-extrabold text-slate-400 uppercase">
                {lang === "es" ? "Período de Autorización" : "Authorization Horizon"}
              </label>
              <select
                value={newDuration}
                onChange={(e) => setNewDuration(e.target.value)}
                className="w-full h-12 bg-slate-950 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
              >
                <option value="1">{lang === "es" ? "1 Día (Acceso Corto)" : "1 Day (Short Trial)"}</option>
                <option value="7">{lang === "es" ? "7 Días (1 Semana)" : "7 Days (1 Week)"}</option>
                <option value="30">{lang === "es" ? "30 Días (1 Mes Estándar)" : "30 Days (1 Standard Month)"}</option>
                <option value="90">{lang === "es" ? "90 Días (3 Meses)" : "90 Days (3 Months)"}</option>
                <option value="365">{lang === "es" ? "365 Días (1 Año)" : "365 Days (1 Year)"}</option>
                <option value="custom">{lang === "es" ? "Límite Personalizado" : "Custom Limit Days"}</option>
              </select>
            </div>

            {/* Custom Input for Days if selected */}
            <AnimatePresence>
              {newDuration === "custom" && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-1.5 overflow-hidden"
                >
                  <label className="text-[11px] font-mono tracking-wider font-extrabold text-slate-400 uppercase">
                    {lang === "es" ? "Cantidad en Días" : "Duration in Days"}
                  </label>
                  <input 
                    type="number" 
                    value={customDays}
                    onChange={(e) => setCustomDays(e.target.value)}
                    min="1"
                    placeholder="ej: 15"
                    className="w-full h-12 bg-slate-950 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error or Success Info */}
            <AnimatePresence mode="wait">
              {errorText && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="p-3 text-[11px] leading-relaxed text-red-400 bg-red-950/30 border border-red-500/20 rounded-xl flex items-start gap-2.5"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                  <span>{errorText}</span>
                </motion.div>
              )}

              {successText && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="p-3 text-[11px] leading-relaxed text-emerald-400 bg-emerald-950/30 border border-emerald-500/20 rounded-xl flex items-start gap-2.5"
                >
                  <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                  <span>{successText}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 cursor-pointer text-white font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>{lang === "es" ? "Registrar Autorización" : "Add Grant Authorization"}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Side: Active authorized accounts */}
        <div className="lg:col-span-7 bg-black/20 border border-white/5 rounded-2xl p-6 space-y-6 text-left flex flex-col justify-between min-h-[480px]">
          
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{lang === "es" ? "Cuentas Autorizadas" : "Authorized Accounts"}</span>
              </h3>

              <button
                type="button"
                onClick={fetchWhitelist}
                disabled={isLoading}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-mono flex items-center gap-1.5 bg-emerald-950/40 hover:bg-emerald-950 border border-emerald-500/20 py-1.5 px-3 rounded-full cursor-pointer transition-colors"
                title={lang === "es" ? "Refrescar" : "Reload"}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
                <span>{lang === "es" ? "Refrescar" : "Refresh"}</span>
              </button>
            </div>

            {/* Search filter input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={lang === "es" ? "Filtrar por correo o rol..." : "Search email or role..."}
                className="w-full h-11 bg-slate-950 border border-white/5 pl-10 pr-4 text-xs text-white rounded-xl focus:outline-none"
              />
            </div>
          </div>

          {/* Table list */}
          <div className="flex-grow overflow-y-auto space-y-3 pr-1 max-h-[300px] mt-4">
            {isLoading && whitelist.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-500 text-xs font-mono gap-2">
                <RefreshCw className="w-6 h-6 animate-spin text-emerald-500" />
                <span>{lang === "es" ? "Cargando registros..." : "Loading records..."}</span>
              </div>
            ) : filteredWhitelist.length === 0 ? (
              <div className="text-center py-16 text-slate-500 text-xs font-mono">
                {lang === "es" ? "Ningún correo verificado coincide." : "No verified email matches filter."}
              </div>
            ) : (
              filteredWhitelist.map((user) => {
                const now = new Date();
                const expiry = new Date(user.access_expires_at);
                const isUserExpired = now > expiry;

                return (
                  <div 
                    key={user.email} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-950/40 border border-white/5 rounded-xl hover:border-white/10 transition-colors gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold truncate max-w-[200px] sm:max-w-xs">{user.email}</span>
                        {user.role === "admin" ? (
                          <span className="text-[9px] font-mono font-extrabold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded uppercase">
                            Admin
                          </span>
                        ) : (
                          <span className="text-[9px] font-mono font-extrabold text-white/50 bg-slate-800 border border-white/10 px-1.5 py-0.5 rounded uppercase">
                            User
                          </span>
                        )}
                        {isUserExpired && (
                          <span className="text-[9px] font-mono font-extrabold text-red-400 bg-red-950/60 border border-red-500/35 px-1.5 py-0.5 rounded uppercase">
                            {lang === "es" ? "Expirado" : "Expired"}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                        <Calendar className="w-3 nav_class text-slate-600 shrink-0" />
                        <span>{lang === "es" ? "Límite: " : "Limit: "}</span>
                        <span className={isUserExpired ? "text-red-400 font-bold" : "text-slate-400 font-medium"}>
                          {expiry.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <button 
                      type="button"
                      onClick={() => handleDeleteUser(user.email)}
                      className="text-xs text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1 bg-red-950/10 hover:bg-rose-950/30 border border-transparent hover:border-rose-500/10 py-1.5 px-3 rounded-xl transition-all cursor-pointer self-start sm:self-auto"
                      title={lang === "es" ? "Revocar Acceso" : "Revoke Access"}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{lang === "es" ? "Revocar" : "Revoke"}</span>
                    </button>
                  </div>
                );
              })
            )}
          </div>

          <div className="pt-4 border-t border-white/5 text-[10px] text-slate-500 font-mono text-center flex items-center justify-center gap-2">
            <span>Terminal: {whitelist.length} {lang === "es" ? "cuentas registradas" : "accounts registered"}</span>
            <span>•</span>
            <span>Admin: eupirne@gmail.com</span>
          </div>
        </div>

      </div>

      {/* Custom Confirmation Dialog for Revoking Accounts */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-slate-900 border border-red-500/30 rounded-3xl p-6 md:p-8 text-center space-y-6 shadow-2xl relative"
            >
              <div className="mx-auto w-12 h-12 rounded-full bg-red-500/10 border border-red-500/25 flex items-center justify-center text-red-400">
                <Trash2 className="w-6 h-6" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-bold font-serif text-white">
                  {lang === "es" ? "⚠️ ¿Confirmar Revocación?" : "⚠️ Confirm Revocation?"}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed font-sans">
                  {lang === "es" ? (
                    <>
                      ¿Estás seguro de que deseas revocar el acceso y eliminar a <span className="text-[#39ff14] font-bold font-mono">{emailToRevoke}</span> de la lista autorizada? Esta acción es instantánea.
                    </>
                  ) : (
                    <>
                      Are you sure you want to revoke access and delete <span className="text-[#39ff14] font-bold font-mono">{emailToRevoke}</span> from the authorized list? This action is instant.
                    </>
                  )}
                </p>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowConfirmModal(false);
                    setEmailToRevoke("");
                  }}
                  className="flex-1 h-12 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-xs uppercase tracking-wider text-slate-300 cursor-pointer transition-colors"
                >
                  {lang === "es" ? "Cancelar" : "Cancel"}
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteUser}
                  className="flex-1 h-12 rounded-xl bg-rose-600 hover:bg-rose-500 font-bold text-xs uppercase tracking-wider text-white cursor-pointer transition-colors"
                >
                  {lang === "es" ? "Sí, Revocar" : "Yes, Revoke"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Alert Modal (e.g. for eupirne@gmail.com restriction) */}
      <AnimatePresence>
        {showAlertModal && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-slate-900 border border-yellow-500/30 rounded-3xl p-6 md:p-8 text-center space-y-6 shadow-2xl relative"
            >
              <div className="mx-auto w-12 h-12 rounded-full bg-yellow-500/10 border border-yellow-500/25 flex items-center justify-center text-yellow-400">
                <AlertCircle className="w-6 h-6" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-bold font-serif text-white">
                  {lang === "es" ? "Acción Restringida" : "Action Restricted"}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed font-sans">
                  {alertMessage}
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAlertModal(false);
                    setAlertMessage("");
                  }}
                  className="w-full h-12 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-xs uppercase tracking-wider text-slate-300 cursor-pointer transition-colors"
                >
                  {lang === "es" ? "Entendido" : "Understood"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
