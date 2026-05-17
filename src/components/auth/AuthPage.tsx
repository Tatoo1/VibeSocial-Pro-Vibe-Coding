import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Zap, 
  Mail, 
  Lock, 
  ArrowRight, 
  Github, 
  Chrome, 
  KeyRound,
  Loader2,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile 
} from "firebase/auth";
import { auth, loginWithGoogle, loginWithMicrosoft, resetPassword } from "@/lib/firebase";
import { toast } from "sonner";

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Bienvenido de nuevo a VibeSocial Pro");
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        toast.success("Cuenta creada exitosamente");
      }
    } catch (error: any) {
      toast.error(error.message || "Error en la autenticación");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword(email);
      toast.success("Correo de recuperación enviado");
      setIsForgotPassword(false);
    } catch (error: any) {
      toast.error("Error al enviar el correo de recuperación");
    } finally {
      setLoading(false);
    }
  };

  const socialLogin = async (provider: 'google' | 'microsoft') => {
    try {
      if (provider === 'google') await loginWithGoogle();
      else await loginWithMicrosoft();
      toast.success("Acceso concedido");
    } catch (error: any) {
      toast.error("Error al conectar con el proveedor");
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] relative z-10"
      >
        <div className="text-center mb-10 space-y-4">
          <div className="inline-flex p-3 rounded-2xl bg-white/5 border border-white/10 mb-2 accent-glow">
            <Zap className="w-8 h-8 text-white fill-current" />
          </div>
          <h1 className="text-4xl font-heading font-black tracking-tight text-white italic">VibeSocial Pro</h1>
          <p className="text-slate-500 font-medium">Arquitectura inteligente para el futuro del marketing.</p>
        </div>

        <Card className="bg-black/40 backdrop-blur-2xl border-white/5 overflow-hidden rounded-[32px] shadow-2xl">
          <CardContent className="p-10">
            <AnimatePresence mode="wait">
              {isForgotPassword ? (
                <motion.div
                  key="forgot"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <h2 className="text-2xl font-heading font-bold text-white">Recuperar Acceso</h2>
                    <p className="text-sm text-slate-500">Ingresa tu email y te enviaremos un enlace de recuperación.</p>
                  </div>
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div className="space-y-2 text-left">
                      <Label className="text-[10px] uppercase font-black tracking-widest text-slate-500 ml-1">Email Corporativo</Label>
                      <Input 
                        type="email" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-white/5 border-white/5 h-12 rounded-xl focus:ring-1 focus:ring-indigo-500/50 transition-all font-medium" 
                        placeholder="nombre@empresa.com"
                      />
                    </div>
                    <Button className="w-full h-14 rounded-2xl bg-white text-black font-bold hover:bg-slate-200 transition-all">
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Enviar Enlace"}
                    </Button>
                    <button 
                      type="button"
                      onClick={() => setIsForgotPassword(false)}
                      className="w-full text-xs font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-widest"
                    >
                      Volver al Login
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="auth"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-8"
                >
                  <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5">
                    <button 
                      onClick={() => setIsLogin(true)}
                      className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${isLogin ? 'bg-white text-black shadow-lg' : 'text-slate-500 hover:text-white'}`}
                    >
                      Entrar
                    </button>
                    <button 
                      onClick={() => setIsLogin(false)}
                      className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${!isLogin ? 'bg-white text-black shadow-lg' : 'text-slate-500 hover:text-white'}`}
                    >
                      Registro
                    </button>
                  </div>

                  <form onSubmit={handleAuth} className="space-y-5">
                    {!isLogin && (
                      <div className="space-y-2 text-left">
                        <Label className="text-[10px] uppercase font-black tracking-widest text-slate-500 ml-1">Nombre Completo</Label>
                        <Input 
                          required 
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="bg-white/5 border-white/5 h-12 rounded-xl focus:ring-1 focus:ring-indigo-500/50 transition-all font-medium" 
                          placeholder="Alex Rivera"
                        />
                      </div>
                    )}
                    <div className="space-y-2 text-left">
                      <Label className="text-[10px] uppercase font-black tracking-widest text-slate-500 ml-1">Email</Label>
                      <Input 
                        type="email" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-white/5 border-white/5 h-12 rounded-xl focus:ring-1 focus:ring-indigo-500/50 transition-all font-medium" 
                        placeholder="alex@tuempresa.com"
                      />
                    </div>
                    <div className="space-y-2 text-left">
                      <div className="flex justify-between items-center mr-1">
                        <Label className="text-[10px] uppercase font-black tracking-widest text-slate-500">Contraseña</Label>
                        {isLogin && (
                          <button 
                            type="button"
                            onClick={() => setIsForgotPassword(true)}
                            className="text-[10px] font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-widest transition-colors"
                          >
                            ¿Olvidaste?
                          </button>
                        )}
                      </div>
                      <Input 
                        type="password" 
                        required 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-white/5 border-white/5 h-12 rounded-xl focus:ring-1 focus:ring-indigo-500/50 transition-all font-medium" 
                        placeholder="••••••••"
                      />
                    </div>

                    <Button disabled={loading} className="w-full h-14 rounded-2xl bg-white text-black font-bold hover:bg-slate-200 transition-all group overflow-hidden">
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <span className="flex items-center gap-2">
                          {isLogin ? "Acceder al Panel" : "Crear Cuenta Pro"}
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      )}
                    </Button>
                  </form>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                    <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] font-black text-slate-700">
                      <span className="bg-[#0c0c0e] px-4">O conecta con</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      type="button" 
                      onClick={() => socialLogin('google')}
                      variant="outline" 
                      className="h-12 rounded-xl bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10 gap-2 font-bold transition-all"
                    >
                      <Chrome className="w-4 h-4 text-white" />
                      Google
                    </Button>
                    <Button 
                      type="button" 
                      onClick={() => socialLogin('microsoft')}
                      variant="outline" 
                      className="h-12 rounded-xl bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10 gap-2 font-bold transition-all"
                    >
                      <div className="w-4 h-4 text-white rounded-sm bg-gradient-to-tr from-blue-500 via-emerald-500 to-yellow-500 opacity-80" />
                      Microsoft
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Footer info */}
        <p className="mt-8 text-center text-xs text-slate-500 font-medium">
          Al continuar, aceptas nuestros <span className="text-slate-300 underline cursor-pointer">Términos de Servicio</span> y <span className="text-slate-300 underline cursor-pointer">Política de Privacidad</span>.
        </p>
      </motion.div>
    </div>
  );
}
