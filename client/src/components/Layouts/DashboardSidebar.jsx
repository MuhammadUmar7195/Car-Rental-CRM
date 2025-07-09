import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaCar,
  FaUsers,
  FaClipboardList,
  FaToolbox,
  FaBell,
  FaSignOutAlt,
  FaTimes,
  FaMoneyCheckAlt,
  FaUserTie,
  FaFileInvoiceDollar,
  FaCogs,
  FaCalculator
} from "react-icons/fa";
import { Button } from "../ui/button"; 
import { FaCheckCircle } from "react-icons/fa";

const DashboardSidebar = ({ toggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Optional: Clear auth here
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "bg-gray-100 text-purple-700 font-semibold py-2 px-4 rounded flex items-center gap-2"
      : "text-purple-700 hover:bg-gray-200 py-2 px-4 rounded flex items-center gap-2 transition-colors";

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-white flex flex-col p-6 z-40 border-r border-[#e5e7eb]">
      {/* Close button for mobile */}
      <div className="flex md:hidden justify-end mb-2">
        <button
          onClick={toggleSidebar}
          aria-label="Close sidebar"
          className="rounded-full bg-white/10 hover:bg-white/30 transition p-2 shadow-md border border-white/20 cursor-pointer"
          style={{ outline: "none" }}
        >
          <FaTimes size={16} className="text-white" />
        </button>
      </div>

      {/* Logo */}
      <div className="mb-6 flex items-center justify-center gap-2">
        <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-tr from-purple-500 to-purple-300 shadow-lg p-2 mr-1">
          <FaCheckCircle size={18} className="text-white drop-shadow" />
        </span>
        <span className="text-2xl font-bold tracking-wide text-purple-700">
          KonceptNext
        </span>
      </div>

      {/* Subheading */}
      <h2 className="text-base font-medium mb-6 text-center text-purple-500 opacity-80">
        Admin Dashboard
      </h2>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-2 flex-1">
        <NavLink
          to="/dashboard"
          className={navLinkClass}
          onClick={toggleSidebar}
        >
          <FaHome />
          <span>Home</span>
        </NavLink>
        <NavLink
          to="/dashboard/rental"
          className={navLinkClass}
          onClick={toggleSidebar}
        >
          <FaClipboardList />
          <span>Rental</span>
        </NavLink>
        <NavLink
          to="/dashboard/fleet"
          className={navLinkClass}
          onClick={toggleSidebar}
        >
          <FaCar />
          <span>Fleet</span>
        </NavLink>
        <NavLink
          to="/dashboard/customer"
          className={navLinkClass}
          onClick={toggleSidebar}
        >
          <FaUsers />
          <span>Customer</span>
        </NavLink>
        <NavLink
          to="/dashboard/inventory"
          className={navLinkClass}
          onClick={toggleSidebar}
        >
          <FaToolbox />
          <span>Inventory</span>
        </NavLink>
        <NavLink
          to="/dashboard/inventory"
          className={navLinkClass}
          onClick={toggleSidebar}
        >
          <FaCalculator />
          <span>Accounting</span>
        </NavLink>
        <NavLink
          to="/dashboard/inventory"
          className={navLinkClass}
          onClick={toggleSidebar}
        >
          <FaUserTie />
          <span>Fleet Owner</span>
        </NavLink>
        <NavLink
          to="/dashboard/inventory"
          className={navLinkClass}
          onClick={toggleSidebar}
        >
          <FaFileInvoiceDollar />
          <span>Payment Dues</span>
        </NavLink>
        <NavLink
          to="/dashboard/service"
          className={navLinkClass}
          onClick={toggleSidebar}
        >
          <FaBell />
          <span>Service</span>
        </NavLink>
        <NavLink
          to="/dashboard/service"
          className={navLinkClass}
          onClick={toggleSidebar}
        >
          <FaCogs />
          <span>Setting</span>
        </NavLink>
      </nav>

      {/* Logout */}
      <div className="mt-auto pt-8 sticky bottom-0 bg-white">
        <Button
          variant="outline"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 border-purple-700 text-purple-700 font-medium py-2 rounded hover:bg-gray-200 hover:text-purple-900 transition-colors cursor-pointer"
        >
          <FaSignOutAlt />
          Logout
        </Button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
