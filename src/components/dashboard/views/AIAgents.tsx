import { useState, useEffect } from "react";
import { 
  UserRound, 
  MessageSquareText, 
  Video, 
  Megaphone, 
  Lightbulb, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  BrainCircuit,
  Bot,
  History,
  Trash2,
  Calendar
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { auth, db } from "@/lib/firebase";
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  deleteDoc, 
  doc,
  serverTimestamp 
} from "firebase/firestore";
import { generateAgentResponse } from "@/services/geminiService";
import { toast } from "sonner";
import Markdown from "react-markdown";

const agents = [
  {
    id: "copywriter",
    name: "Senior Copywriter",
    role: "Experto en Escritura Persuasiva",
    description: "Especializado en hilos de X (Twitter), artículos de LinkedIn y storytelling emocional que convierte.",
    icon: MessageSquareText,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    tags: ["Threads", "LinkedIn Pro", "Storytelling"]
  },
  {
    id: "viral",
    name: "Viral Scriptwriter",
    role: "Director de Video Vertical",
    description: "Crea guiones para TikTok, Reels y Shorts con hooks cinéticos y estructuras de retención máxima.",
    icon: Video,
    color: "text-pink-500",
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
    tags: ["TikTok", "Reels", "Retention"]
  },
  {
    id: "ads",
    name: "Performance Ad Specialist",
    role: "Experto en Conversión",
    description: "Diseño de copies para Meta y Google Ads optimizados para bajar el CPL y maximizar el ROAS.",
    icon: Megaphone,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    tags: ["Meta Ads", "Google Ads", "Direct Response"]
  },
  {
    id: "strategy",
    name: "Brand Strategist",
    role: "Arquitecto de Marca",
    description: "Define el tono de voz, pilares de contenido y estrategias de posicionamiento a largo plazo.",
    icon: Lightbulb,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    tags: ["Positioning", "Brand Identity", "Roadmap"]
  }
];

export function AIAgents() {
  const [selectedAgent, setSelectedAgent] = useState<typeof agents[0] | null>(null);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [viewingResult, setViewingResult] = useState<any | null>(null);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "agentSessions"),
      where("userId", "==", auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort client-side to avoid index requirement
      docs.sort((a: any, b: any) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
        return dateB.getTime() - dateA.getTime();
      });
      setHistory(docs);
    }, (error) => {
      console.error("Firestore error:", error);
      toast.error("Error al cargar el historial");
    });

    return () => unsubscribe();
  }, []);

  const handleGenerate = async () => {
    if (!selectedAgent || !input.trim() || !auth.currentUser) {
      toast.error("Faltan datos para procesar");
      return;
    }

    setIsProcessing(true);
    try {
      console.log("Generating response for agent:", selectedAgent.id);
      const response = await generateAgentResponse(selectedAgent.id, input);
      
      console.log("Saving session to Firestore...");
      const docRef = await addDoc(collection(db, "agentSessions"), {
        userId: auth.currentUser.uid,
        agentId: selectedAgent.id,
        agentName: selectedAgent.name,
        prompt: input,
        response: response,
        createdAt: serverTimestamp()
      });

      setViewingResult({
        id: docRef.id,
        agentName: selectedAgent.name,
        prompt: input,
        response: response
      });
      
      setSelectedAgent(null);
      setInput("");
      toast.success(`${selectedAgent.name} ha completado la tarea`);
    } catch (error: any) {
      console.error("AI Generation Error details:", error);
      toast.error(`Error Crítico: ${error.message || "Fallo inesperado del motor IA"}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const deleteSession = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteDoc(doc(db, "agentSessions", id));
      if (viewingResult?.id === id) setViewingResult(null);
      toast.success("Sesión eliminada");
    } catch (error) {
      toast.error("No se pudo eliminar la sesión");
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-heading font-bold tracking-tight gradient-text">Agentes IA Especializados <span className="text-[10px] opacity-20">v1.1</span></h1>
          <p className="text-slate-500">Selecciona un agente experto para tareas específicas de alta fidelidad.</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!selectedAgent && !viewingResult ? (
          <div className="space-y-12">
            <motion.div 
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {agents.map((agent) => (
                <Card 
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent)}
                  className={cn(
                    "bg-[#0c0c0e] border-white/5 cursor-pointer group hover:border-indigo-500/30 transition-all overflow-hidden relative",
                    "hover:shadow-[0_0_30px_rgba(99,102,241,0.05)]"
                  )}
                >
                  <CardContent className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className={cn("p-4 rounded-2xl", agent.bg, agent.border)}>
                        <agent.icon className={cn("w-8 h-8", agent.color)} />
                      </div>
                      <div className="flex gap-2">
                        {agent.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-[9px] uppercase font-black bg-white/5 border-none">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-heading font-bold text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight italic">
                        {agent.name}
                      </h3>
                      <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{agent.role}</p>
                      <p className="text-sm text-slate-400 leading-relaxed pt-2">
                        {agent.description}
                      </p>
                    </div>
                    <div className="mt-6 pt-6 border-t border-white/5 flex items-center text-xs font-bold text-indigo-400 uppercase tracking-widest gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      Iniciar Sesión de Trabajo <ArrowRight className="w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>

            {history.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <History className="w-5 h-5 text-slate-500" />
                  <h2 className="text-xs uppercase font-black tracking-widest text-slate-500">Historial de Sesiones</h2>
                  <div className="h-px flex-1 bg-white/5" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {history.map((session) => (
                    <Card 
                      key={session.id}
                      onClick={() => setViewingResult(session)}
                      className="bg-white/[0.02] border-white/5 hover:bg-white/[0.05] transition-colors cursor-pointer group"
                    >
                      <CardContent className="p-5">
                        <div className="flex justify-between items-start mb-3">
                          <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-none text-[8px] font-black uppercase">
                            {session.agentName}
                          </Badge>
                          <button 
                            onClick={(e) => deleteSession(session.id, e)}
                            className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-xs text-white font-medium line-clamp-2 mb-2">{session.prompt}</p>
                        <div className="flex items-center gap-2 text-[10px] text-slate-600 font-bold uppercase tracking-tighter">
                          <Calendar className="w-3 h-3" />
                          {session.createdAt?.toDate ? session.createdAt.toDate().toLocaleDateString() : "Reciente"}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : viewingResult ? (
          <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                onClick={() => setViewingResult(null)}
                className="text-slate-500 hover:text-white"
              >
                ← Volver
              </Button>
              <div className="flex items-center gap-3">
                <Badge className="bg-indigo-500 text-white font-bold">{viewingResult.agentName}</Badge>
              </div>
            </div>

            <Card className="bg-[#0c0c0e] border-white/5 overflow-hidden rounded-[32px] shadow-2xl">
              <div className="p-8 border-b border-white/5 bg-white/[0.01]">
                <p className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-500 mb-2">Petición Original</p>
                <p className="text-white font-medium italic">&quot;{viewingResult.prompt}&quot;</p>
              </div>
              <CardContent className="p-10">
                <div className="prose prose-invert max-w-none prose-p:text-slate-300 prose-headings:text-white prose-strong:text-indigo-400 prose-code:text-pink-400">
                  <Markdown>{viewingResult.response}</Markdown>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div 
            key="chat"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-between mb-8">
              <Button 
                variant="ghost" 
                onClick={() => setSelectedAgent(null)}
                className="text-slate-500 hover:text-white"
              >
                ← Volver a la Galería
              </Button>
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-lg", selectedAgent.bg)}>
                  <selectedAgent.icon className={cn("w-4 h-4", selectedAgent.color)} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white leading-none">{selectedAgent.name}</p>
                  <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-tighter">Agente Activo</p>
                </div>
              </div>
            </div>

            <Card className="bg-[#0c0c0e] border-white/5 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <selectedAgent.icon className="w-40 h-40" />
              </div>
              
              <div className="space-y-6 relative z-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-indigo-400" />
                    <span className="text-xs font-black uppercase tracking-widest text-slate-500">Instrucciones del Proyecto</span>
                  </div>
                  <Textarea 
                    placeholder={`Describe el objetivo para el ${selectedAgent.name}...`}
                    className="min-h-[200px] bg-white/[0.02] border-white/10 rounded-2xl p-6 text-lg focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-700 resize-none font-medium"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0c0c0e] bg-zinc-800 flex items-center justify-center">
                        <ShieldCheck className="w-4 h-4 text-indigo-400" />
                      </div>
                    ))}
                    <div className="ml-4 pl-4 flex items-center text-[10px] font-bold text-slate-500 uppercase">Seguridad Cifrada VSocial</div>
                  </div>
                  
                  <Button 
                    onClick={handleGenerate}
                    disabled={!input.trim() || isProcessing}
                    className="h-14 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-lg shadow-indigo-600/20 gap-3"
                  >
                    {isProcessing ? (
                      <>
                        <BrainCircuit className="w-5 h-5 animate-spin" />
                        Ejecutando Red Neuronal...
                      </>
                    ) : (
                      <>
                        Enviar a {selectedAgent.name}
                        <Sparkles className="w-5 h-5 fill-current" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>

            <AnimatePresence>
              {isProcessing && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-8 flex flex-col items-center gap-4 text-center"
                >
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                        className="w-1.5 h-6 bg-indigo-500 rounded-full"
                      />
                    ))}
                  </div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Arquitectando contenido estratégico de alta fidelidad...</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
