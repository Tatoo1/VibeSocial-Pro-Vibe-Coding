import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Target, 
  MousePointer2, 
  Users, 
  ArrowUpRight,
  Download,
  Calendar,
  Layout
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useCampaign } from "@/contexts/CampaignContext";

const performanceData = [
  { name: 'X', value: 400, color: '#38bdf8' },
  { name: 'LinkedIn', value: 300, color: '#3b82f6' },
  { name: 'YouTube', value: 300, color: '#ef4444' },
  { name: 'TikTok', value: 200, color: '#2dd4bf' },
  { name: 'Instagram', value: 278, color: '#ec4899' },
  { name: 'Facebook', value: 189, color: '#2563eb' },
];

const growthData = [
  { month: 'Ene', followers: 4000, conversion: 2400 },
  { month: 'Feb', followers: 4500, conversion: 2100 },
  { month: 'Mar', followers: 5800, conversion: 2900 },
  { month: 'Abr', followers: 6900, conversion: 3500 },
  { month: 'May', followers: 8200, conversion: 4100 },
];

export function Analytics() {
  const { activeCampaign } = useCampaign();

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-heading font-bold tracking-tight gradient-text">Analytics Avanzados</h1>
          <p className="text-muted-foreground">Deep dive en el rendimiento de tu ecosistema social.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-white/5 border-white/10 rounded-full">
            <Calendar className="w-4 h-4 mr-2" />
            Últimos 30 días
          </Button>
          <Button variant="outline" className="bg-white/5 border-white/10 rounded-full">
            <Download className="w-4 h-4 mr-2" />
            Exportar reporte
          </Button>
        </div>
      </div>

      {!activeCampaign && (
        <div className="p-12 border border-dashed border-white/10 rounded-3xl bg-white/5 flex flex-col items-center justify-center text-center gap-6">
          <Layout className="w-12 h-12 text-slate-500" />
          <div>
            <h3 className="text-2xl font-bold">No hay campaña seleccionada</h3>
            <p className="text-muted-foreground max-w-md mx-auto">Selecciona una campaña para ver su rendimiento específico y métricas clave.</p>
          </div>
        </div>
      )}

      {activeCampaign && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Reach Total", value: "2.5M", change: "+45%", icon: Target },
              { label: "Clics Totales", value: "84.2k", change: "+12%", icon: MousePointer2 },
              { label: "Nuevos Leads", value: "1,240", change: "+24%", icon: Users },
              { label: "Conversion Rate", value: "4.2%", change: "+5%", icon: TrendingUp },
            ].map((stat, i) => (
              <Card key={i} className="bg-white/[0.03] border-white/5 relative overflow-hidden group">
                <CardContent className="p-6">
                  <stat.icon className="w-5 h-5 text-muted-foreground mb-4" />
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-heading font-black">{stat.value}</p>
                      <span className="text-emerald-400 text-xs font-bold">{stat.change}</span>
                    </div>
                  </div>
                </CardContent>
                <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-20 transition-opacity">
                   <stat.icon className="w-20 h-20" />
                </div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/[0.03] border-white/5">
              <CardHeader>
                <CardTitle className="font-heading">Crecimiento de Audiencia</CardTitle>
                <CardDescription>Seguidores vs Conversiones (Campaña: {activeCampaign.name}).</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={growthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis dataKey="month" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Line type="monotone" dataKey="followers" stroke="#ffffff" strokeWidth={3} dot={{ fill: '#ffffff', strokeWidth: 2 }} />
                    <Line type="monotone" dataKey="conversion" stroke="#71717a" strokeWidth={2} strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-white/[0.03] border-white/5">
              <CardHeader>
                 <CardTitle className="font-heading">Distribución Multicanal</CardTitle>
                 <CardDescription>Rendimiento relativo por plataforma social.</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={performanceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {performanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-4 ml-6">
                  {performanceData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-xs font-medium">{item.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
