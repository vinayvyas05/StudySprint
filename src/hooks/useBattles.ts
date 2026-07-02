import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/config/firebase";
import { Battle } from "@/types/battle.types";

export const useBattles = (userId: string | undefined) => {
  const [battles, setBattles] = useState<Battle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setBattles([]);
      setLoading(false);
      return;
    }

    const battlesRef = collection(db, "battles");

    const qChallenger = query(battlesRef, where("challengerId", "==", userId));
    const qOpponent = query(battlesRef, where("opponentId", "==", userId));

    let challengerBattles: Battle[] = [];
    let opponentBattles: Battle[] = [];

    const updateCombined = () => {
      const combined = [...challengerBattles, ...opponentBattles];
      // Sort by createdAt descending
      combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      // Deduplicate (Firestore documents have unique IDs)
      const unique = Array.from(new Map(combined.map((b) => [b.id, b])).values());
      
      setBattles(unique);
      setLoading(false);
    };

    const unsubChallenger = onSnapshot(qChallenger, (snapshot) => {
      challengerBattles = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Battle));
      updateCombined();
    });

    const unsubOpponent = onSnapshot(qOpponent, (snapshot) => {
      opponentBattles = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Battle));
      updateCombined();
    });

    return () => {
      unsubChallenger();
      unsubOpponent();
    };
  }, [userId]);

  const activeBattles = battles.filter(b => b.status === "active");
  const pendingBattles = battles.filter(b => b.status === "pending");
  const completedBattles = battles.filter(b => b.status === "completed" || b.status === "declined");

  return { battles, activeBattles, pendingBattles, completedBattles, loading };
};
