import Sidebar from "@/components/sidebar";
import PlotComponent from "@/components/teste";

export default function Home() {
  return (
      <div className="flex h-full w-full bg-gray-100">
          <Sidebar />
          <PlotComponent/>
      </div> 
  );
}
