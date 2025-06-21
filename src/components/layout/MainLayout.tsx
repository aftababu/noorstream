"use client";

import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { usePathname } from "next/navigation";
import BottomNav from "./BottomNav";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();
  const [viewMode, setViewMode] = useState<"adult" | "kids">("adult");
  
  // Hide navigation when scrolling down, show when scrolling up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowNav(false);
      } else {
        setShowNav(true);
      }
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);
  
  const toggleViewMode = () => {
    setViewMode(prev => prev === "adult" ? "kids" : "adult");
  };

  const isKidsMode = viewMode === "kids";
  
  return (
    <div className={`min-h-screen bg-background ${isKidsMode ? "kids-mode" : ""}`}>
      <Navbar />
      
      <div className="flex">
        {/* Sidebar for tablet/desktop */}
        <div className="hidden lg:block">
          <Sidebar viewMode={viewMode} toggleViewMode={toggleViewMode} />
        </div>
        
        {/* Main content */}
        <main className="flex-1 pb-16 lg:pb-0">
          {children}
        </main>
      </div>
      
      {/* Bottom navigation for mobile */}
      <div className={`fixed bottom-0 left-0 right-0 lg:hidden transition-transform duration-300 ${showNav ? 'translate-y-0' : 'translate-y-full'}`}>
        <BottomNav viewMode={viewMode} toggleViewMode={toggleViewMode} />
      </div>
    </div>
  );
}