"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Tv, Settings, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  viewMode: "adult" | "kids";
  toggleViewMode: () => void;
}

export default function Sidebar({ viewMode, toggleViewMode }: SidebarProps) {
  const pathname = usePathname();
  const isKidsMode = viewMode === "kids";

  return (
    <div className={cn(
      "w-16 h-[calc(100vh-64px)] sticky top-16 border-r",
      isKidsMode && "bg-primary/5 border-primary/20"
    )}>
      <div className="flex flex-col items-center gap-6 p-2 mt-4">
        <NavItem 
          href="/" 
          icon={<Home className={cn(isKidsMode && "h-6 w-6")} />} 
          label="Home" 
          active={pathname === "/"} 
          isKidsMode={isKidsMode} 
        />
        
        <NavItem 
          href="/channels" 
          icon={<Tv className={cn(isKidsMode && "h-6 w-6")} />} 
          label="Channels" 
          active={pathname === "/channels"} 
          isKidsMode={isKidsMode} 
        />
        
        <NavItem 
          href="/settings" 
          icon={<Settings className={cn(isKidsMode && "h-6 w-6")} />} 
          label="Settings" 
          active={pathname === "/settings"} 
          isKidsMode={isKidsMode} 
        />
        
        <div className="mt-auto mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleViewMode} 
            className={cn(
              "rounded-full flex flex-col items-center justify-center",
              isKidsMode && "text-primary"
            )}
          >
            {isKidsMode ? (
              <Sun className="h-6 w-6" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="text-xs mt-1">{isKidsMode ? "Adult" : "Kids"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  isKidsMode: boolean;
}

function NavItem({ href, icon, label, active, isKidsMode }: NavItemProps) {
  return (
    <Link href={href} className="w-full flex flex-col items-center">
      <Button 
        variant="ghost" 
        size="icon" 
        className={cn(
          "rounded-full",
          active && "bg-primary/10 text-primary",
          isKidsMode && "p-3"
        )}
      >
        {icon}
      </Button>
      <span className={cn(
        "text-xs mt-1",
        active && "font-medium",
        isKidsMode && "text-sm font-medium"
      )}>
        {label}
      </span>
    </Link>
  );
}