"use client"

import { NextUIProvider } from "@nextui-org/react";
import { ToastContainer } from "react-toastify";
import { ParametersProvider } from "../components/context/ParametersContext";

import 'react-toastify/dist/ReactToastify.css';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <ParametersProvider>
        {children}
        <ToastContainer />
      </ParametersProvider>
    </NextUIProvider>
  );
}
