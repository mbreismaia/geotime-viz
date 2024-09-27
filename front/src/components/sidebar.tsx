"use client";
import { useState } from 'react';
import { ChevronDown, ChevronUp, Map, BarChart, Sliders, Settings } from 'lucide-react';
import Config from './config';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleConfig = () => {
    setIsConfigOpen(!isConfigOpen);
  };

  return (
    <div className={`flex flex-col h-screen bg-gray-800 text-white ${isOpen ? 'w-64' : 'w-20'} transition-width duration-300`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <span className={`text-xl font-semibold ${isOpen ? 'block' : 'hidden'}`}>Menu</span>
        <button onClick={toggleSidebar} className="p-2">
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>
      <nav className="flex flex-col flex-grow">
        <a href="#panel" className="flex items-center p-4 hover:bg-gray-700">
          <Map size={24} />
          <span className={`ml-4 ${isOpen ? 'block' : 'hidden'}`}>Dashboard</span>
        </a>
        <a href="#map" className="flex items-center p-4 hover:bg-gray-700">
          <Map size={24} />
          <span className={`ml-4 ${isOpen ? 'block' : 'hidden'}`}>Map</span>
        </a>
        <a href="#scatter" className="flex items-center p-4 hover:bg-gray-700">
          <BarChart size={24} />
          <span className={`ml-4 ${isOpen ? 'block' : 'hidden'}`}>Graph 1</span>
        </a>
        <a href="#parallel" className="flex items-center p-4 hover:bg-gray-700">
          <Sliders size={24} />
          <span className={`ml-4 ${isOpen ? 'block' : 'hidden'}`}>Graph 2</span>
        </a>
        <a href="#dots" className="flex items-center p-4 hover:bg-gray-700">
          <BarChart size={24} />
          <span className={`ml-4 ${isOpen ? 'block' : 'hidden'}`}>Graph 3</span>
        </a>

        {/* Config Section */}
        <div className="flex items-center p-4 hover:bg-gray-700 cursor-pointer" onClick={toggleConfig}>
          <Settings size={24} />
          <span className={`ml-4 ${isOpen ? 'block' : 'hidden'}`}>Configurations</span>
        </div>
        {isConfigOpen && (
         <Config />
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
