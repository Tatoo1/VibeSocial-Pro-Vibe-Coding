import { 
  LayoutDashboard, 
  CalendarDays, 
  Zap, 
  BarChart3, 
  Settings, 
  LogOut, 
  ChevronRight,
  PlusCircle,
  Megaphone,
  Bot
} from "lucide-react";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { 
  Sidebar as SidebarUI, 
  SidebarContent, 
  SidebarHeader, 
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth } from "@/lib/firebase";
import { User } from "firebase/auth";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", id: "overview" },
  { icon: Zap, label: "IA Brain Engine", id: "ai-engine" },
  { icon: Bot, label: "Agentes IA", id: "ai-agents" },
  { icon: CalendarDays, label: "Calendario Editorial", id: "calendar" },
  { icon: Megaphone, label: "Gestión de Ads", id: "ads" },
  { icon: BarChart3, label: "Analytics", id: "analytics" },
];

export function AppSidebar({ activeTab, onTabChange }: { activeTab: string, onTabChange: (id: string) => void }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(u => setUser(u));
    return () => unsub();
  }, []);
  return (
    <SidebarUI variant="inset" className="border-r border-white/5 bg-sidebar shrink-0">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Zap className="w-5 h-5 text-white fill-current" />
          </div>
          <span className="font-heading font-bold text-white tracking-tight text-lg">VibeSocial Pro</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-4 mb-2">
            Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    onClick={() => onTabChange(item.id)}
                    isActive={activeTab === item.id}
                    className={cn(
                      "transition-all duration-200 py-6 px-4 rounded-xl",
                      activeTab === item.id 
                        ? "bg-white/5 text-white shadow-none" 
                        : "text-slate-500 hover:text-white hover:bg-white/2"
                    )}
                  >
                    <item.icon className={cn("w-4 h-4", activeTab === item.id ? "text-indigo-400" : "text-slate-500")} />
                    <span className="text-sm font-medium ml-3">{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="px-4 py-4 mt-4">
          <div className="p-4 rounded-xl bg-gradient-to-b from-indigo-500/10 to-transparent border border-indigo-500/20">
            <p className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold mb-1">AI Tokens</p>
            <div className="flex justify-between items-end">
              <span className="text-xl font-semibold text-white">84%</span>
              <span className="text-[10px] text-slate-500">2.4k / 3k</span>
            </div>
            <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "84%" }}
                className="h-full bg-indigo-500"
              />
            </div>
          </div>
        </div>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-white/5 mt-auto">
        <div className="flex items-center gap-3 px-2 py-2">
          <Avatar className="w-8 h-8 border border-white/10">
            <AvatarImage src={user?.photoURL || ""} />
            <AvatarFallback className="bg-indigo-500 text-white font-bold">
              {user?.displayName?.charAt(0) || user?.email?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium text-white truncate">{user?.displayName || (user?.email?.split('@')[0]) || "Usuario Pro"}</span>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Plan Enterprise</span>
          </div>
        </div>
      </SidebarFooter>
    </SidebarUI>
  );
}
