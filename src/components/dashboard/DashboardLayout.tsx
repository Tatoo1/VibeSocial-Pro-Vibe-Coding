import { useState, ReactNode, useEffect } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./Sidebar";
import { CampaignSelector } from "./CampaignSelector";
import { motion, AnimatePresence } from "motion/react";
import { Zap, Bell, Globe, Search, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth, logout } from "@/lib/firebase";
import { User } from "firebase/auth";

interface DashboardLayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (id: string) => void;
}

export function DashboardLayout({ children, activeTab, onTabChange }: DashboardLayoutProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(auth.currentUser);
  }, []);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-[#09090b] text-white selection:bg-white/20">
        <AppSidebar activeTab={activeTab} onTabChange={onTabChange} />
        
        <SidebarInset className="flex flex-col flex-1 overflow-hidden">
          {/* Main Top Header */}
          <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#09090b]/40 backdrop-blur-xl z-20">
            <div className="flex items-center gap-6">
              <CampaignSelector />
            </div>

            <div className="flex items-center gap-6">
              <div className="relative group hidden lg:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 group-focus-within:text-white transition-colors" />
                <input 
                  type="text" 
                  placeholder="Comando + K para buscar..." 
                  className="bg-white/5 border border-white/5 rounded-lg py-1.5 pl-10 pr-4 text-xs w-[240px] outline-none focus:ring-1 focus:ring-white/10 transition-all placeholder:text-slate-600"
                />
              </div>

              <div className="flex items-center gap-4">
                <button className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold shadow-lg shadow-indigo-600/20 transition-all active:scale-95">
                  + Estrategia Global
                </button>
                
                <button 
                  onClick={() => logout()}
                  className="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-red-400 transition-all relative"
                  title="Cerrar Sesión"
                >
                  <LogOut className="w-4 h-4" />
                </button>

                <button className="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-all relative">
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                </button>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-8 relative scroll-smooth">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="w-full h-full max-w-7xl mx-auto"
              >
                {children}
              </motion.div>
            </AnimatePresence>
            
            {/* Ambient Background Decorative elements */}
            <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
