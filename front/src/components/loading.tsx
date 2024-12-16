import React from "react";

const Loading = () => {
  return (
    <div className="w-full bg-gray-100 flex items-center justify-center">
      <div className="flex flex-col text-center items-center gap-y-4">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        <p className="text-lg text-gray-700">Loading data and visualizations...</p>
      </div>
    </div>
  );
};

export default Loading;
