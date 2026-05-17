import { useState, useEffect } from "react";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Sparkles,
  Twitter,
  Linkedin,
  Youtube,
  Instagram,
  Facebook,
  MoreVertical,
  Edit2,
  CheckCircle2,
  Clock,
  RefreshCw,
  Video,
  Loader2,
  Trash2,
  CalendarDays,
  XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { useCampaign } from "@/contexts/CampaignContext";
import { auth, db } from "@/lib/firebase";
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot, 
  deleteDoc, 
  doc,
  updateDoc,
  serverTimestamp,
  Timestamp 
} from "firebase/firestore";

const networks = [
  { id: 'X', icon: Twitter, color: 'text-sky-400', bg: 'bg-sky-400/10' },
  { id: 'LinkedIn', icon: Linkedin, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { id: 'YouTube', icon: Youtube, color: 'text-red-500', bg: 'bg-red-500/10' },
  { id: 'TikTok', icon: Video, color: 'text-teal-400', bg: 'bg-teal-400/10' },
  { id: 'Instagram', icon: Instagram, color: 'text-pink-500', bg: 'bg-pink-500/10' },
  { id: 'Facebook', icon: Facebook, color: 'text-blue-600', bg: 'bg-blue-600/10' },
];

export function EditorialCalendar({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const { activeCampaign } = useCampaign();
  const [events, setEvents] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [viewingDate, setViewingDate] = useState(new Date(2026, 4, 1)); // Default to Mayo 2026
  
  // Form state
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newNetwork, setNewNetwork] = useState("X");
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  useEffect(() => {
    if (!auth.currentUser || !activeCampaign) {
      setEvents([]);
      return;
    }

    const q = query(
      collection(db, "calendarEvents"),
      where("userId", "==", auth.currentUser.uid),
      where("campaignId", "==", activeCampaign.id)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(docs);
    });

    return () => unsubscribe();
  }, [activeCampaign?.id]);

  const handleCreateEvent = async () => {
    if (!auth.currentUser || !selectedDate || !newTitle || !activeCampaign) return;

    const date = new Date(viewingDate.getFullYear(), viewingDate.getMonth(), selectedDate);

    try {
      await addDoc(collection(db, "calendarEvents"), {
        userId: auth.currentUser.uid,
        campaignId: activeCampaign.id,
        title: newTitle,
        content: newContent,
        networkId: newNetwork,
        date: Timestamp.fromDate(date),
        status: "draft",
        createdAt: serverTimestamp()
      });
      toast.success("Evento creado");
      setIsAdding(false);
      resetForm();
    } catch (error) {
      toast.error("Error al crear evento");
    }
  };

  const handlePrevMonth = () => {
    setViewingDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewingDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const monthName = viewingDate.toLocaleString('es-ES', { month: 'long' });
  const year = viewingDate.getFullYear();
  const daysInMonth = new Date(viewingDate.getFullYear(), viewingDate.getMonth() + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const resetForm = () => {
    setNewTitle("");
    setNewContent("");
    setNewNetwork("X");
  };

  const deleteEvent = async (id: string) => {
    try {
      await deleteDoc(doc(db, "calendarEvents", id));
      toast.success("Evento eliminado");
    } catch (error) {
      toast.error("Error al eliminar");
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, "calendarEvents", id), { status });
      toast.success(`Estado actualizado a ${status}`);
    } catch (error) {
      toast.error("Error al actualizar");
    }
  };

  const handleGenerateIA = async () => {
    if (!auth.currentUser || !activeCampaign) return;
    setIsGenerating(true);
    
    try {
      // Simulate AI thinking
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const simulatedEvents = Array.from({ length: 10 }, (_, i) => ({
        title: `Plan IA Optimizado #${i + 1}`,
        content: "Contenido estratégico generado para maximizar engagement y autoridad.",
        networkId: networks[Math.floor(Math.random() * networks.length)].id,
        day: Math.floor(Math.random() * daysInMonth) + 1
      }));

      const batch = simulatedEvents.map(event => {
        const date = new Date(viewingDate.getFullYear(), viewingDate.getMonth(), event.day);
        return addDoc(collection(db, "calendarEvents"), {
          userId: auth.currentUser?.uid,
          campaignId: activeCampaign.id,
          title: event.title,
          content: event.content,
          networkId: event.networkId,
          date: Timestamp.fromDate(date),
          status: "scheduled",
          createdAt: serverTimestamp()
        });
      });

      await Promise.all(batch);
      toast.success("Calendario optimizado con IA exitosamente");
    } catch (error) {
      toast.error("Error al sincronizar con la IA");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-heading font-bold tracking-tight gradient-text">Calendario Editorial</h1>
          <p className="text-muted-foreground">Estrategia de 30 días optimizada por el Brain Engine.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="bg-white/5 border-white/10 hover:bg-white/10"
            onClick={handlePrevMonth}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>
          <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg font-semibold capitalize min-w-[140px] text-center">
            {monthName} {year}
          </div>
          <Button 
            variant="outline" 
            className="bg-white/5 border-white/10 hover:bg-white/10"
            onClick={handleNextMonth}
          >
            Siguiente
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
          <Button 
            className="bg-white text-black hover:bg-white/90"
            onClick={handleGenerateIA}
            disabled={isGenerating || !activeCampaign || activeCampaign.status === 'closed'}
          >
            {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2 fill-current" />}
            Generar con IA
          </Button>
        </div>
      </div>

      {!activeCampaign && (
        <div className="p-8 border border-dashed border-white/10 rounded-3xl bg-white/5 flex flex-col items-center justify-center text-center gap-4">
          <CalendarDays className="w-12 h-12 text-slate-500" />
          <div>
            <h3 className="text-xl font-bold">No hay campaña seleccionada</h3>
            <p className="text-muted-foreground max-w-md mx-auto">Selecciona una campaña activa en la parte superior para ver y gestionar su calendario editorial.</p>
          </div>
        </div>
      )}

      {activeCampaign && activeCampaign.status === 'closed' && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-3 text-amber-400 mb-4">
           <XCircle className="w-5 h-5" />
           <span className="text-sm font-semibold italic uppercase tracking-widest">Campaña cerrada. El calendario está en modo solo lectura.</span>
        </div>
      )}

      {activeCampaign && (
        <>
          <div className="flex flex-wrap gap-4 p-4 border border-white/5 bg-white/[0.02] rounded-2xl">
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mr-2 self-center">Canales:</span>
        {networks.map(net => (
          <div key={net.id} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <net.icon className={cn("w-3.5 h-3.5", net.color)} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">{net.id}</span>
          </div>
        ))}
      </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-px bg-white/5 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
            {days.map((day) => {
          const dayEvents = events.filter(e => {
            const date = e.date?.toDate ? e.date.toDate() : new Date(e.date);
            return (
              date.getDate() === day && 
              date.getMonth() === viewingDate.getMonth() && 
              date.getFullYear() === viewingDate.getFullYear()
            );
          });

          return (
            <motion.div 
              key={day}
              whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
              className={cn(
                "min-h-[160px] p-4 flex flex-col gap-3 group relative transition-colors bg-white/[0.01]"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl font-heading font-black italic text-white/40 group-hover:text-white transition-colors">
                  {day < 10 ? `0${day}` : day}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-auto">
                {dayEvents.map((event, idx) => {
                  const network = networks.find(n => n.id === event.networkId) || networks[0];
                  return (
                    <Dialog key={event.id}>
                      <DialogTrigger render={
                        <button className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer border border-white/5",
                          network.bg
                        )} />
                      }>
                        <network.icon className={cn("w-4 h-4", network.color)} />
                      </DialogTrigger>
                      <DialogContent className="bg-[#09090b] border-white/10 text-white max-w-2xl">
                        <DialogHeader>
                          <div className="flex items-center gap-3 mb-2">
                             <div className={cn("p-2 rounded-xl", network.bg)}>
                               <network.icon className={cn("w-6 h-6", network.color)} />
                             </div>
                             <div className="flex-1">
                               <DialogTitle className="text-2xl font-heading font-bold">{event.title}</DialogTitle>
                               <DialogDescription className="text-muted-foreground">
                                 {network.id} Post - {event.status.toUpperCase()}
                               </DialogDescription>
                             </div>
                             <Button 
                              variant="ghost" 
                              size="icon" 
                              disabled={activeCampaign.status === 'closed'}
                              onClick={() => deleteEvent(event.id)}
                              className="text-slate-500 hover:text-red-400"
                             >
                                <Trash2 className="w-5 h-5" />
                             </Button>
                          </div>
                        </DialogHeader>
                        
                        <div className="mt-6 space-y-6">
                          <div className="p-6 rounded-2xl bg-white/5 border border-white/5 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                            {event.content || "Sin contenido generado."}
                          </div>

                          {activeCampaign.status === 'active' && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-white/5">
                              <Button 
                                variant="outline" 
                                onClick={() => updateStatus(event.id, "published")}
                                className="bg-white/5 border-white/10 h-16 flex flex-col gap-1 items-center justify-center rounded-2xl group text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/10"
                              >
                                <CheckCircle2 className="w-5 h-5" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Publicar</span>
                              </Button>
                              <Button 
                                variant="outline" 
                                onClick={() => updateStatus(event.id, "scheduled")}
                                className="bg-white/5 border-white/10 h-16 flex flex-col gap-1 items-center justify-center rounded-2xl group text-amber-400">
                                <Clock className="w-5 h-5" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Programar</span>
                              </Button>
                              <Button 
                                variant="outline" 
                                className="bg-white/5 border-white/10 h-16 flex flex-col gap-1 items-center justify-center rounded-2xl group text-purple-400">
                                <RefreshCw className="w-5 h-5" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Regenerar</span>
                              </Button>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  );
                })}
              </div>

              <Dialog open={isAdding && selectedDate === day} onOpenChange={(val) => {
                setIsAdding(val);
                if (val) setSelectedDate(day);
              }}>
                <DialogTrigger render={
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    disabled={activeCampaign.status === 'closed'}
                    className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white/5 hover:bg-white/10 rounded-full w-8 h-8"
                  />
                }>
                  <Plus className="w-4 h-4" />
                </DialogTrigger>
                <DialogContent className="bg-[#09090b] border-white/10 text-white">
                  <DialogHeader>
                    <DialogTitle>Añadir Evento - Día {day}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-slate-500">Título</label>
                      <Input 
                        placeholder="Ej: Lanzamiento Producto" 
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="bg-white/5 border-white/10"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-slate-500">Canal</label>
                      <Select value={newNetwork} onValueChange={setNewNetwork}>
                        <SelectTrigger className="bg-white/5 border-white/10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-white/10 text-white">
                          {networks.map(n => (
                            <SelectItem key={n.id} value={n.id}>{n.id}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-slate-500">Contenido</label>
                      <Textarea 
                        placeholder="Escribe el contenido o deja vacío para generar con IA después"
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        className="bg-white/5 border-white/10 min-h-[100px]"
                      />
                    </div>
                    <Button 
                      onClick={handleCreateEvent}
                      className="w-full bg-indigo-600 hover:bg-indigo-500"
                    >
                      Guardar Evento
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </motion.div>
          );
        })}
          </div>
        </>
      )}
    </div>
  );
}
