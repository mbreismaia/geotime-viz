import Dashboard from "@/components/dashboard";
import Sidebar from "@/components/sidebar";

export default function Home() {
  return (
      <div className="flex h-full w-full bg-gray-100">
          <Sidebar />
          <Dashboard/>
      </div> 
  );
}
