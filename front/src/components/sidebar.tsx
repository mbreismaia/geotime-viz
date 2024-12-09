"use client";

import { useState } from 'react';
import { Map, Settings, ChevronLeft, ChevronRight, LineChart, ChartGantt, ScatterChart, LayoutGrid, CandlestickChart } from 'lucide-react';
import ModalCf from './modal/modalCF';
import Dashboard from './dashboard'; 

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [selectedChart, setSelectedChart] = useState<string>("dashboard"); // Estado para controlar qual gráfico será exibido
  const [plotData, setPlotData] = useState(null); // Estado para armazenar os dados do gráfico

  const toggleSidebar = () => setIsOpen(!isOpen);
  const openModal = () => setIsModalOpen(true); 
  const closeModal = () => setIsModalOpen(false); 

  const menuItems = [
    { href: "#panel", icon: <LayoutGrid size={24} />, label: "Dashboard", chart: "dashboard" },
    { href: "#map", icon: <Map size={24} />, label: "Map", chart: "map" },
    { href: "#scatter", icon: <LineChart size={24} />, label: "Line Chart", chart: "lineChart" },
    { href: "#parallel", icon: <ChartGantt size={24} />, label: "Parallel Coordinates", chart: "parallel" },
    { href: "#dots", icon: <ScatterChart size={24} />, label: "Scatter Chart", chart: "scatter" },
    { href: "#viollin", icon: <CandlestickChart size={24} />, label: "Viollin Chart", chart: "viollin" },
  ];

  // Função para lidar com a mudança de seleção
  const handleMenuItemClick = (chart: string) => {
    setSelectedChart(chart);
  };

  return (
    <>
      <div className={`flex flex-col h-screen bg-gray-800 text-white ${isOpen ? 'w-64' : 'w-20'} transition-width duration-300`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <span className={`text-xl font-semibold ${isOpen ? 'block' : 'hidden'}`}>Menu</span>
          <button onClick={toggleSidebar} className="p-2">
            {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>
        <nav className="flex flex-col flex-grow">
          {menuItems.map(({ href, icon, label, chart }) => (
            <a
              key={label}
              href={href}
              className="flex items-center p-4 hover:bg-gray-700"
              onClick={(e) => {
                e.preventDefault(); 
                handleMenuItemClick(chart);
              }}
            >
              {icon}
              <span className={`ml-4 ${isOpen ? 'block' : 'hidden'}`}>{label}</span>
            </a>
          ))}
          <button onClick={openModal} className="flex items-center p-4 hover:bg-gray-700">
            <Settings size={24} />
            <span className={`ml-4 ${isOpen ? 'block' : 'hidden'}`}>Settings</span>
          </button>
        </nav>
      </div>

      {/* Passa plotData e setPlotData para o Modal */}
      <ModalCf isOpen={isModalOpen} onClose={closeModal} setPlotData={setPlotData} />

      {/* Passa selectedChart e plotData para o Dashboard */}
      <Dashboard selectedChart={selectedChart} plotData={plotData} />
    </>
  );
};

export default Sidebar;
