import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { weddingsApi, ApiWedding } from '../api/client';
import { WeddingDetails } from '../types';

interface WeddingContextValue {
  wedding: ApiWedding | null;
  weddingDetails: WeddingDetails | null;
  setWedding: (w: ApiWedding | null) => void;
  setWeddingDetails: (d: WeddingDetails | null) => void;
  loadWeddings: () => Promise<void>;
  createWedding: (details: WeddingDetails) => Promise<ApiWedding>;
  refreshWedding: () => Promise<void>;
}

const WeddingContext = createContext<WeddingContextValue | null>(null);

export function WeddingProvider({ children }: { children: React.ReactNode }) {
  const { user, useApi } = useAuth();
  const [wedding, setWeddingState] = useState<ApiWedding | null>(null);
  const [weddingDetails, setWeddingDetails] = useState<WeddingDetails | null>(null);

  const setWedding = useCallback((w: ApiWedding | null) => {
    setWeddingState(w);
  }, []);

  const loadWeddings = useCallback(async () => {
    if (!useApi || !user) return;
    try {
      const list = await weddingsApi.list();
      const first = Array.isArray(list) && list.length ? list[0] : null;
      setWeddingState(first);
      if (first) {
        setWeddingDetails({
          date: first.date || '',
          location: first.location || '',
          guestCount: first.guestCount || 0,
          budget: first.budget || 0,
          priorities: first.priorities || [],
          styles: first.styles || [],
          culture: first.culture || '',
          partnerEmail: first.partnerEmail,
        });
      }
    } catch (_) {
      setWeddingState(null);
    }
  }, [useApi, user]);

  useEffect(() => {
    if (user?.weddingId && useApi) {
      weddingsApi.get(user.weddingId).then(setWeddingState).catch(() => setWeddingState(null));
    } else {
      loadWeddings();
    }
  }, [user?.weddingId, useApi]);

  const createWedding = useCallback(async (details: WeddingDetails): Promise<ApiWedding> => {
    if (!useApi) throw new Error('API not configured');
    const w = await weddingsApi.create({
      date: details.date,
      location: details.location,
      guestCount: details.guestCount,
      budget: details.budget,
      priorities: details.priorities,
      styles: details.styles,
      culture: details.culture,
      partnerEmail: details.partnerEmail,
    });
    setWeddingState(w);
    setWeddingDetails(details);
    return w;
  }, [useApi]);

  const refreshWedding = useCallback(async () => {
    if (wedding?.id && useApi) {
      const w = await weddingsApi.get(wedding.id);
      setWeddingState(w);
    }
  }, [wedding?.id, useApi]);

  const value: WeddingContextValue = {
    wedding,
    weddingDetails,
    setWedding,
    setWeddingDetails,
    loadWeddings,
    createWedding,
    refreshWedding,
  };

  return <WeddingContext.Provider value={value}>{children}</WeddingContext.Provider>;
}

export function useWedding(): WeddingContextValue {
  const ctx = useContext(WeddingContext);
  if (!ctx) throw new Error('useWedding must be used within WeddingProvider');
  return ctx;
}
