"use client"

import Dashboard from "@/components/dashboard";
import Sidebar from "@/components/sidebar";
import { useState } from "react";

export default function Home() {
  
  const [selectedChart, setSelectedChart] = useState<string>('dashboard'); 

  return (
      <div className="flex h-full w-full bg-gray-100">
          <Sidebar setSelectedChart={setSelectedChart}/>
          <Dashboard  selectedChart={selectedChart} />
      </div> 
  );
}
