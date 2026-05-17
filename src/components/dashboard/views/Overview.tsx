import { cn } from "@/lib/utils";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye, 
  ThumbsUp, 
  Share2, 
  Zap,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "motion/react";
import { useCampaign } from "@/contexts/CampaignContext";
import { Layout } from "lucide-react";

const kpiData = [
  { id: 1, label: "Vistas Totales", value: "1.2M", trend: "+12.5%", isUp: true, icon: Eye },
  { id: 2, label: "Engagement Rate", value: "4.8%", trend: "+2.1%", isUp: true, icon: ThumbsUp },
  { id: 3, label: "Nuevos Seguidores", value: "12,450", trend: "+8.4%", isUp: true, icon: Users },
  { id: 4, label: "CTR Promedio", value: "2.4%", trend: "-0.5%", isUp: false, icon: BarChart3 },
];

const chartData = [
  { name: 'Lun', views: 4000, likes: 2400 },
  { name: 'Mar', views: 3000, likes: 1398 },
  { name: 'Mie', views: 2000, likes: 9800 },
  { name: 'Jue', views: 2780, likes: 3908 },
  { name: 'Vie', views: 1890, likes: 4800 },
  { name: 'Sab', views: 2390, likes: 3800 },
  { name: 'Dom', views: 3490, likes: 4300 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 }
};

export function Overview() {
  const { activeCampaign } = useCampaign();

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-12"
    >
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-heading font-bold tracking-tight gradient-text">Dashboard General</h1>
        <p className="text-muted-foreground">
          {activeCampaign 
            ? `Resumen de actividad para la campaña: ${activeCampaign.name}`
            : "Bienvenido de nuevo. Aquí tienes un resumen de tu actividad reciente en 6 redes."
          }
        </p>
      </div>

      {!activeCampaign && (
        <div className="p-12 border border-dashed border-white/10 rounded-3xl bg-white/5 flex flex-col items-center justify-center text-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Layout className="w-8 h-8" />
          </div>
          <div className="max-w-md space-y-2">
            <h3 className="text-2xl font-bold">Inicia una Campaña</h3>
            <p className="text-muted-foreground">Para ver métricas y gestionar tu calendario, necesitas crear o seleccionar una campaña activa desde el selector superior.</p>
          </div>
        </div>
      )}

      {activeCampaign && (
        <>
          {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi) => (
          <motion.div key={kpi.id} variants={itemVariants}>
            <Card className="bg-white/[0.03] border-white/5 overflow-hidden group hover:bg-white/[0.06] transition-colors relative">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                    <kpi.icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className={cn(
                    "flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
                    kpi.isUp ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                  )}>
                    {kpi.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {kpi.trend}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-heading font-bold tracking-tight">{kpi.value}</p>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">{kpi.label}</p>
                </div>
                
                {/* Decorative sparkline-like background */}
                <div className="absolute bottom-0 right-0 w-24 h-12 opacity-10 pointer-events-none overflow-hidden grayscale">
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <Area type="monotone" dataKey="views" stroke="#ffffff" fill="#ffffff" />
                      </AreaChart>
                   </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-white/[0.03] border-white/5">
          <CardHeader>
            <CardTitle className="text-xl font-heading">Rendimiento Semanal</CardTitle>
            <CardDescription>Visualización de interacciones combinadas a través de todas las plataformas.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#71717a" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#71717a" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `${value/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#ffffff" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorViews)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white/[0.03] border-white/5">
          <CardHeader>
            <CardTitle className="text-xl font-heading">Engagement por Red</CardTitle>
            <CardDescription>Distribución porcentual de interacciones.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] flex items-center justify-center p-6">
             <div className="w-full space-y-6">
                {[
                  { name: "Instagram", value: 85, color: "bg-white" },
                  { name: "LinkedIn", value: 65, color: "bg-white/70" },
                  { name: "X (Twitter)", value: 45, color: "bg-white/50" },
                  { name: "TikTok", value: 92, color: "bg-white/90" },
                  { name: "YouTube", value: 78, color: "bg-white/80" },
                ].map((item) => (
                  <div key={item.name} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-muted-foreground">{item.value}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.value}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={cn("h-full rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)]", item.color)} 
                      />
                    </div>
                  </div>
                ))}
             </div>
          </CardContent>
        </Card>
      </div>
        </>
      )}
    </motion.div>
  );
}
