"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type HeaderCompactContextValue = {
  isHeaderCompact: boolean;
  setIsHeaderCompact: (value: boolean) => void;
};

const HeaderCompactContext = createContext<HeaderCompactContextValue | null>(null);

export function HeaderCompactProvider({ children }: { children: ReactNode }) {
  const [isHeaderCompact, setIsHeaderCompact] = useState(false);

  return (
    <HeaderCompactContext.Provider value={{ isHeaderCompact, setIsHeaderCompact }}>
      {children}
    </HeaderCompactContext.Provider>
  );
}

export function useHeaderCompact() {
  const ctx = useContext(HeaderCompactContext);
  if (!ctx) {
    throw new Error("useHeaderCompact must be used within a HeaderCompactProvider");
  }
  return ctx;
}