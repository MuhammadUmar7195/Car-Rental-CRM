import { useState } from "react";
import { Outlet } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import DashboardSidebar from "./DashboardSidebar";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="relative min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* Top Mobile Bar */}
      <div className="flex md:hidden items-center p-4 bg-white shadow z-40 sticky top-0 left-0 w-full">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md text-gray-700 hover:bg-gray-100 transition cursor-pointer"
        >
          <FaBars size={20} />
        </button>
        <h1 className="ml-4 text-xl font-bold text-purple-700 tracking-wide">
          Astro Motors
        </h1>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 backdrop-blur-sm md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          bg-white h-screen w-64 text-gray-800
          fixed top-0 left-0 z-40 transition-transform duration-300
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:fixed md:top-0 md:left-0 md:z-30
          shadow-md flex flex-col
          overflow-y-auto
        `}
        style={{ maxWidth: "80vw" }}
      >
        {/* Close button on mobile */}
        <div className="flex md:hidden justify-end p-4">
          <button onClick={toggleSidebar}>
            <FaTimes size={20} className="text-gray-700" />
          </button>
        </div>
        {/* Make sidebar content sticky */}
        <div className="sticky top-0">
          <DashboardSidebar toggleSidebar={toggleSidebar} />
        </div>
      </div>
      
      {/* Main Content */}
      <main className="flex-grow p-4 md:p-8 overflow-auto bg-gray-100 min-h-screen md:ml-64">
        <div className="max-w-[98vw] md:max-w-[90vw] lg:max-w-[1400px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
