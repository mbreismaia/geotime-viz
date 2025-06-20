"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { defaultParameters } from "../modal/modal";

type Parameters = typeof defaultParameters;

interface ParametersContextType {
  parameters: Parameters;
  setParameters: React.Dispatch<React.SetStateAction<Parameters>>;
}

const ParametersContext = createContext<ParametersContextType | undefined>(undefined);

export const ParametersProvider = ({ children }: { children: React.ReactNode }) => {
  const [parameters, setParameters] = useState<Parameters>(defaultParameters);

  useEffect(() => {
    const saved = localStorage.getItem("savedParameters");
    if (saved) {
      setParameters(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("savedParameters", JSON.stringify(parameters));
  }, [parameters]);

  return (
    <ParametersContext.Provider value={{ parameters, setParameters }}>
      {children}
    </ParametersContext.Provider>
  );
};

export const useParameters = (): ParametersContextType => {
  const context = useContext(ParametersContext);
  if (!context) {
    throw new Error("useParameters must be used within a ParametersProvider");
  }
  return context;
};
