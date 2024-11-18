import Sidebar from "@/components/sidebar";
import LinePlot from "@/components/test3";


export default function Home() {
  return (
      <div className="flex h-full w-full bg-gray-100">
          <Sidebar />
          <LinePlot />
      </div> 
  );
}
