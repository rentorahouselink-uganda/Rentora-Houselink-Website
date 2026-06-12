"use client";

import { createContext, useContext, useTransition, ReactNode } from "react";

type ExplorePendingContextValue = {
  isPending: boolean;
  startUpdate: (callback: () => void) => void;
};

const ExplorePendingContext = createContext<ExplorePendingContextValue | null>(null);

export function ExplorePendingProvider({ children }: { children: ReactNode }) {
  const [isPending, startTransition] = useTransition();

  const startUpdate = (callback: () => void) => {
    startTransition(callback);
  };

  return (
    <ExplorePendingContext.Provider value={{ isPending, startUpdate }}>
      {children}
    </ExplorePendingContext.Provider>
  );
}

export function useExplorePending() {
  const ctx = useContext(ExplorePendingContext);
  if (!ctx) {
    throw new Error("useExplorePending must be used within an ExplorePendingProvider");
  }
  return ctx;
}