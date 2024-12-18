import { SearchX } from "lucide-react";
import React from "react";

const EmptyState = () => {
  return (
    <div className="flex w-full h-svh items-center justify-center">
     <div className="flex flex-col p-4 rounded justify-center items-center text-center">
       <SearchX className="w-28 h-28 text-[#08184c]"/>
       <div className="w-1/2">
        <h1 className="text-2xl font-bold text-[#08184c]">No configuration found! </h1>
        <p className="text-gray-600 mt-2">Please choose a dimensionality reduction method and configure the required settings to enable dashboard calculations.</p>
       </div>
     </div>
    </div>
  );
};

export default EmptyState;
