import { useState, useEffect } from "react";
import { 
  Megaphone, 
  Target, 
  DollarSign, 
  Activity, 
  TrendingUp, 
  ArrowUpRight, 
  Plus, 
  Search,
  Filter,
  MoreHorizontal,
  Facebook,
  PlayCircle,
  Search as GoogleIcon,
  Loader2,
  AlertTriangle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useCampaign } from "@/contexts/CampaignContext";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc } from "firebase/firestore";
import { toast } from "sonner";

export function AdsManager() {
  const { activeCampaign } = useCampaign();
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingAd, setIsAddingAd] = useState(false);
  
  // New Ad Form
  const [newName, setNewName] = useState("");
  const [newPlatform, setNewPlatform] = useState("Meta Ads");
  const [newBudget, setNewBudget] = useState("1000");

  useEffect(() => {
    if (!auth.currentUser || !activeCampaign) {
      setAds([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, "adCampaigns"),
      where("userId", "==", auth.currentUser.uid),
      where("campaignId", "==", activeCampaign.id)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAds(docs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [activeCampaign?.id]);

  const handleCreateAd = async () => {
    if (!newName || !auth.currentUser || !activeCampaign) return;

    try {
      await addDoc(collection(db, "adCampaigns"), {
        userId: auth.currentUser.uid,
        campaignId: activeCampaign.id,
        name: newName,
        platform: newPlatform,
        budget: Number(newBudget),
        spent: 0,
        status: "Active",
        reach: "0",
        leads: 0,
        roas: 0,
        createdAt: serverTimestamp()
      });
      setIsAddingAd(false);
      setNewName("");
      toast.success("Campaña de Ads creada");
    } catch (error) {
      toast.error("Error al crear campaña de Ads");
    }
  };

  const deleteAd = async (id: string) => {
    try {
      await deleteDoc(doc(db, "adCampaigns", id));
      toast.success("Anuncio eliminado");
    } catch (error) {
      toast.error("Error al eliminar");
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "Meta Ads": return { icon: Facebook, color: "text-blue-500" };
      case "TikTok Ads": return { icon: PlayCircle, color: "text-teal-400" };
      case "Google Ads": return { icon: GoogleIcon, color: "text-orange-500" };
      default: return { icon: Megaphone, color: "text-slate-400" };
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-heading font-bold tracking-tight gradient-text">Gestión de Ads</h1>
          <p className="text-muted-foreground">
            {activeCampaign 
              ? `Campañas publicitarias para: ${activeCampaign.name}`
              : "Administra tus campañas multicanal de alto rendimiento."
            }
          </p>
        </div>
        <Button 
          onClick={() => setIsAddingAd(true)} 
          disabled={!activeCampaign || activeCampaign.status === 'closed'}
          className="bg-white text-black hover:bg-white/90 rounded-full py-6 px-8 font-bold"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nueva Campaña de Ads
        </Button>
      </div>

      {!activeCampaign && (
        <div className="p-12 border border-dashed border-white/10 rounded-3xl bg-white/5 flex flex-col items-center justify-center text-center gap-6">
          <Megaphone className="w-12 h-12 text-slate-500" />
          <div>
            <h3 className="text-2xl font-bold">No hay campaña activa</h3>
            <p className="text-muted-foreground max-w-md mx-auto">Selecciona una campaña principal para gestionar su inversión publicitaria.</p>
          </div>
        </div>
      )}

      {activeCampaign && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Presupuesto Total", value: `$${ads.reduce((acc, curr) => acc + curr.budget, 0).toLocaleString()}`, detail: "Inversión Planeada", icon: DollarSign },
              { label: "Gasto Actual", value: `$${ads.reduce((acc, curr) => acc + curr.spent, 0).toLocaleString()}`, detail: "Presupuesto Consumido", icon: Activity },
              { label: "ROAS Promedio", value: `${(ads.reduce((acc, curr) => acc + curr.roas, 0) / (ads.length || 1)).toFixed(1)}x`, detail: "Retorno de Inversión", icon: TrendingUp },
            ].map((stat, i) => (
              <Card key={i} className="bg-white/[0.03] border-white/5 group hover:bg-white/[0.06] transition-colors overflow-hidden relative">
                <CardContent className="p-6 flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <stat.icon className="w-7 h-7 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-heading font-black">{stat.value}</p>
                    <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">{stat.detail}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-white/[0.03] border-white/5 overflow-hidden rounded-3xl">
            <CardHeader className="p-8 border-b border-white/5 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-heading">Líneas de Anuncios</CardTitle>
                <CardDescription>Monitoreo de tus anuncios vinculados a esta campaña.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-12 flex justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                </div>
              ) : ads.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground">
                  No hay anuncios creados para esta campaña.
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-white/[0.02]">
                    <TableRow className="hover:bg-transparent border-white/5">
                      <TableHead className="py-6 px-8 text-muted-foreground">Nombre</TableHead>
                      <TableHead className="text-muted-foreground">Plataforma</TableHead>
                      <TableHead className="text-muted-foreground">Presupuesto</TableHead>
                      <TableHead className="text-muted-foreground text-center">Estado</TableHead>
                      <TableHead className="text-muted-foreground text-right">ROAS</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ads.map((camp) => {
                      const platform = getPlatformIcon(camp.platform);
                      return (
                        <TableRow key={camp.id} className="hover:bg-white/[0.02] border-white/5 group">
                          <TableCell className="py-6 px-8">
                            <div>
                              <p className="font-bold text-lg tracking-tight group-hover:text-white transition-colors capitalize">{camp.name}</p>
                              <p className="text-xs text-muted-foreground">AI Target: Optimized</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                               <platform.icon className={cn("w-4 h-4", platform.color)} />
                               <span className="font-medium">{camp.platform}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1.5 min-w-[120px]">
                              <div className="flex justify-between text-xs font-bold">
                                <span>${camp.spent}</span>
                                <span className="text-muted-foreground">${camp.budget}</span>
                              </div>
                              <Progress value={Math.min((camp.spent / camp.budget) * 100, 100)} className="h-1 bg-white/5" />
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge className={cn(
                              "rounded-full px-3 py-1 font-bold uppercase text-[10px] tracking-widest",
                              camp.status === "Active" ? "bg-emerald-500/10 text-emerald-400" :
                              camp.status === "Reviewing" ? "bg-yellow-500/10 text-yellow-500" :
                              "bg-white/5 text-muted-foreground"
                            )}>
                              {camp.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="font-heading font-bold text-xl">{camp.roas}x</span>
                          </TableCell>
                          <TableCell className="pr-8">
                             <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-slate-500 hover:text-red-400"
                              onClick={() => deleteAd(camp.id)}
                             >
                                <Plus className="w-4 h-4 rotate-45" />
                             </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </>
      )}

      <Dialog open={isAddingAd} onOpenChange={setIsAddingAd}>
        <DialogContent className="bg-[#09090b] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Nueva Campaña de Anuncios</DialogTitle>
            <DialogDescription>Configura los parámetros básicos de tu publicidad.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Nombre del Ad</label>
              <Input 
                placeholder="Ej: Video Retargeting Hook" 
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Plataforma</label>
              <Select value={newPlatform} onValueChange={setNewPlatform}>
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#09090b] border-white/10 text-white">
                  <SelectItem value="Meta Ads">Meta Ads (FB/IG)</SelectItem>
                  <SelectItem value="TikTok Ads">TikTok Ads</SelectItem>
                  <SelectItem value="Google Ads">Google Ads</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Presupuesto ($)</label>
              <Input 
                type="number"
                value={newBudget}
                onChange={(e) => setNewBudget(e.target.value)}
                className="bg-white/5 border-white/10"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingAd(false)} className="bg-white/5 border-white/10">
              Cancelar
            </Button>
            <Button onClick={handleCreateAd} className="bg-indigo-600 hover:bg-indigo-500">
              Crear Anuncio
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
