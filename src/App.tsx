/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { DashboardLayout } from "./components/dashboard/DashboardLayout";
import { Overview } from "./components/dashboard/views/Overview";
import { EditorialCalendar } from "./components/dashboard/views/EditorialCalendar";
import { AIEngine } from "./components/dashboard/views/AIEngine";
import { AIAgents } from "./components/dashboard/views/AIAgents";
import { AdsManager } from "./components/dashboard/views/AdsManager";
import { Analytics } from "./components/dashboard/views/Analytics";
import { AuthPage } from "./components/auth/AuthPage";
import { CampaignProvider } from "./contexts/CampaignContext";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Loader2, Zap } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState("overview");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center accent-glow animate-pulse">
          <Zap className="w-8 h-8 text-white fill-current" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-white font-heading font-bold text-xl tracking-tight">VibeSocial Pro</p>
          <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Sincronizando seguridad...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <TooltipProvider>
        <AuthPage />
        <Toaster position="top-right" theme="dark" richColors />
      </TooltipProvider>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <Overview />;
      case "calendar":
        return <EditorialCalendar onNavigate={setActiveTab} />;
      case "ai-engine":
        return <AIEngine onNavigate={setActiveTab} />;
      case "ai-agents":
        return <AIAgents />;
      case "ads":
        return <AdsManager />;
      case "analytics":
        return <Analytics />;
      case "settings":
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
            <h1 className="text-3xl font-heading font-bold">Configuración</h1>
            <p className="text-muted-foreground">Opciones avanzadas de la plataforma en desarrollo.</p>
          </div>
        );
      case "profile":
         return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
            <h1 className="text-3xl font-heading font-bold">Tu Perfil</h1>
            <p className="text-muted-foreground">Gestión de cuenta y suscripción Pro.</p>
          </div>
        );
      default:
        return <Overview />;
    }
  };

  return (
    <TooltipProvider>
      <CampaignProvider>
        <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
          {renderContent()}
        </DashboardLayout>
      </CampaignProvider>
      <Toaster position="top-right" theme="dark" richColors />
    </TooltipProvider>
  );
}

