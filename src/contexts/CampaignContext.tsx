import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";

interface Campaign {
  id: string;
  name: string;
  status: "active" | "closed";
  description?: string;
  userId: string;
}

interface CampaignContextType {
  campaigns: Campaign[];
  activeCampaign: Campaign | null;
  setActiveCampaign: (campaign: Campaign | null) => void;
  loading: boolean;
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

export function CampaignProvider({ children }: { children: React.ReactNode }) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [activeCampaign, setActiveCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) {
      setCampaigns([]);
      setActiveCampaign(null);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "campaigns"),
      where("userId", "==", auth.currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Campaign));
      setCampaigns(docs);
      
      // If no active campaign is selected, select the first one if available
      // or keep current choice if it still exists
      if (docs.length > 0) {
        if (!activeCampaign || !docs.find(d => d.id === activeCampaign.id)) {
           // Prefer the most recent active one
           const firstActive = docs.find(d => d.status === "active") || docs[0];
           setActiveCampaign(firstActive);
        } else {
           // Update current active campaign info (like name change)
           const updated = docs.find(d => d.id === activeCampaign.id);
           if (updated) setActiveCampaign(updated);
        }
      } else {
        setActiveCampaign(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth.currentUser?.uid]);

  return (
    <CampaignContext.Provider value={{ campaigns, activeCampaign, setActiveCampaign, loading }}>
      {children}
    </CampaignContext.Provider>
  );
}

export function useCampaign() {
  const context = useContext(CampaignContext);
  if (context === undefined) {
    throw new Error("useCampaign must be used within a CampaignProvider");
  }
  return context;
}
