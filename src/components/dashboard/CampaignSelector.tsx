import { useState } from "react";
import { 
  ChevronDown, 
  Plus, 
  Settings2, 
  XCircle, 
  CheckCircle2,
  Calendar,
  Layout
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCampaign } from "@/contexts/CampaignContext";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function CampaignSelector() {
  const { campaigns, activeCampaign, setActiveCampaign, loading } = useCampaign();
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const handleCreate = async () => {
    if (!newName || !auth.currentUser) return;
    
    try {
      const docRef = await addDoc(collection(db, "campaigns"), {
        userId: auth.currentUser.uid,
        name: newName,
        description: newDesc,
        status: "active",
        createdAt: serverTimestamp()
      });
      setIsCreating(false);
      setNewName("");
      setNewDesc("");
      toast.success("Campaña creada");
    } catch (error) {
      toast.error("Error al crear campaña");
    }
  };

  const toggleStatus = async (campaign: any) => {
    const newStatus = campaign.status === "active" ? "closed" : "active";
    try {
      await updateDoc(doc(db, "campaigns", campaign.id), {
        status: newStatus
      });
      toast.success(`Campaña ${newStatus === "active" ? "abierta" : "cerrada"}`);
    } catch (error) {
      toast.error("Error al actualizar estado");
    }
  };

  if (loading) return (
    <div className="h-10 w-48 bg-white/5 animate-pulse rounded-xl" />
  );

  return (
    <div className="flex items-center gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger render={
          <button className="flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-white/5 transition-all text-left group">
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center border border-white/10",
              activeCampaign?.status === 'active' ? "bg-indigo-500/10 text-indigo-400" : "bg-slate-500/10 text-slate-500"
            )}>
              <Layout className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black line-clamp-1">
                {activeCampaign ? "Campaña Seleccionada" : "Sin Campaña"}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white tracking-tight line-clamp-1">
                  {activeCampaign?.name || "Selecciona una..."}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
              </div>
            </div>
          </button>
        } />
        <DropdownMenuContent className="w-64 bg-[#0c0c0e] border-white/10 text-white p-2">
          <div className="px-2 py-1.5 text-[10px] uppercase font-black tracking-widest text-slate-500">
            Campañas Activas
          </div>
          {campaigns.filter(c => c.status === 'active').map(c => (
            <DropdownMenuItem 
              key={c.id}
              onClick={() => setActiveCampaign(c)}
              className={cn(
                "rounded-lg focus:bg-white/5 focus:text-white cursor-pointer py-2",
                activeCampaign?.id === c.id && "bg-white/5 border border-white/10"
              )}
            >
              <div className="flex flex-col gap-0.5">
                <span className="font-semibold text-sm">{c.name}</span>
                {c.description && <span className="text-[10px] text-slate-500 line-clamp-1">{c.description}</span>}
              </div>
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator className="bg-white/5" />
          
          <div className="px-2 py-1.5 text-[10px] uppercase font-black tracking-widest text-slate-500">
            Campañas Cerradas
          </div>
          {campaigns.filter(c => c.status === 'closed').map(c => (
            <DropdownMenuItem 
              key={c.id}
              onClick={() => setActiveCampaign(c)}
              className={cn(
                "rounded-lg focus:bg-white/5 focus:text-white cursor-pointer py-2 opacity-60 grayscale hover:grayscale-0 hover:opacity-100",
                activeCampaign?.id === c.id && "bg-white/5 border border-white/10"
              )}
            >
              <div className="flex flex-col gap-0.5">
                <span className="font-semibold text-sm">{c.name}</span>
              </div>
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator className="bg-white/5" />
          <DropdownMenuItem 
            onClick={() => setIsCreating(true)}
            className="rounded-lg focus:bg-indigo-600 focus:text-white cursor-pointer py-2 text-indigo-400 font-bold text-xs"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Campaña
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {activeCampaign && (
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-white">
              <Settings2 className="w-4 h-4" />
            </Button>
          } />
          <DropdownMenuContent className="bg-[#0c0c0e] border-white/10 text-white">
             <DropdownMenuItem onClick={() => toggleStatus(activeCampaign)}>
                {activeCampaign.status === 'active' ? (
                  <>
                    <XCircle className="w-4 h-4 mr-2 text-red-400" />
                    Cerrar Campaña
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-400" />
                    Reabrir Campaña
                  </>
                )}
             </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="bg-[#09090b] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Nueva Campaña</DialogTitle>
            <DialogDescription>Define el nombre y objetivo de tu nueva estrategia.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Nombre</label>
              <Input 
                placeholder="Ej: Lanzamiento Verano 2026" 
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Descripción</label>
              <Textarea 
                placeholder="¿De qué trata esta campaña?" 
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="bg-white/5 border-white/10 min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreating(false)} className="bg-white/5 border-white/10">
              Cancelar
            </Button>
            <Button onClick={handleCreate} className="bg-indigo-600 hover:bg-indigo-500">
              Crear Campaña
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
