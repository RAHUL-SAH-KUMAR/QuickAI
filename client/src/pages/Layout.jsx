import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { Menu, X } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { useUser, SignIn } from "@clerk/clerk-react";

const Layout = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useUser();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <SignIn />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <nav className="w-full px-8 h-16 flex items-center justify-between border-b border-gray-200">
        <img
          src={assets.logo}
          alt="Logo"
          className="cursor-pointer w-32 sm:w-44"
          onClick={() => navigate("/")}
        />
        {/* Mobile menu toggle */}
        {sidebarOpen ? (
          <X
            onClick={() => setSidebarOpen(false)}
            className="w-6 h-6 text-gray-600 sm:hidden"
          />
        ) : (
          <Menu
            onClick={() => setSidebarOpen(true)}
            className="w-6 h-6 text-gray-600 sm:hidden"
          />
        )}
      </nav>

      {/* Main layout */}
      <div className="flex flex-1 h-[calc(100vh-64px)] w-full">
        <Sidebar sidebar={sidebarOpen} setSidebar={setSidebarOpen} />
        <main className="flex-1 bg-[#F4F7FB] overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
