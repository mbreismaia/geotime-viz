"use client";

import Dashboard from "@/components/dashboard";
import Sidebar from "@/components/sidebar";
import EmptyState from "@/components/emptyState";
import { useEffect, useState } from "react";

export default function Home() {
  const [selectedChart, setSelectedChart] = useState<string>("dashboard");
  const [hasSavedParameters, setHasSavedParameters] = useState<boolean | null>(null);

  useEffect(() => {
    const savedParameters = localStorage.getItem("savedParameters");
    setHasSavedParameters(!!savedParameters);
  }, []);

  if (hasSavedParameters === null) {
    return null;
  }

  return (
    <div className="flex h-full w-full bg-gray-100">
      <Sidebar setSelectedChart={setSelectedChart} />
      {hasSavedParameters ? (
        <Dashboard selectedChart={selectedChart} />
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
