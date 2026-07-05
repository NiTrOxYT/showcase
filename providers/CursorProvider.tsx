"use client";

import React, { createContext, useContext, useState } from "react";

export type CursorType = "default" | "hover" | "view" | "open" | "next" | "prev" | "drag";

interface CursorContextType {
  cursorType: CursorType;
  cursorLabel: string;
  setCursorType: (type: CursorType) => void;
  setCursorLabel: (label: string) => void;
}

const CursorContext = createContext<CursorContextType>({
  cursorType: "default",
  cursorLabel: "",
  setCursorType: () => {},
  setCursorLabel: () => {},
});

export const CursorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cursorType, setCursorType] = useState<CursorType>("default");
  const [cursorLabel, setCursorLabel] = useState<string>("");

  const handleSetType = (type: CursorType) => {
    setCursorType(type);
    // Reset label when returning to default
    if (type === "default") setCursorLabel("");
  };

  return (
    <CursorContext.Provider
      value={{ cursorType, cursorLabel, setCursorType: handleSetType, setCursorLabel }}
    >
      {children}
    </CursorContext.Provider>
  );
};

export const useCursor = () => useContext(CursorContext);
