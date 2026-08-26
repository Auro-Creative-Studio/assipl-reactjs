import { Outlet } from "react-router-dom";
import { useState } from "react";
import CmsHeader from "./CmsHeader";
import CmsSidebar from "./CmsSidebar";

export default function CmsLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-light_bg text-slate-950">
      <CmsSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="lg:pl-72">
        <CmsHeader onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="px-5 py-6 md:px-8 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
