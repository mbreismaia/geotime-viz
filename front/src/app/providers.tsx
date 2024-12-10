"use client"

import { NextUIProvider } from "@nextui-org/react";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; // Importe os estilos do Toastify

export default function Providers({ children }: { children: React.ReactNode }) {
    return(
        <NextUIProvider>
            {children}
            <ToastContainer />
        </NextUIProvider>
    );
}