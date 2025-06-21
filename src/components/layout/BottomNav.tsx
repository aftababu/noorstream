"use client";

import Link from "next/link";
import { Home, Tv, Settings, Sun, Moon } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  viewMode: "adult" | "kids";
  toggleViewMode: () => void;
}

export default function BottomNav({ viewMode, toggleViewMode }: BottomNavProps) {
  const pathname = usePathname();
  const isKidsMode = viewMode === "kids";
  
  return (
    <div className={cn(
      "flex justify-around items-center h-16 bg-background border-t px-2",
      isKidsMode && "bg-primary/10 border-primary"
    )}>
      <Link href="/" className="flex flex-col items-center">
        <Button 
          variant="ghost" 
          size="icon"
          className={cn(
            "rounded-full",
            pathname === "/" && "bg-primary/10 text-primary",
            isKidsMode && "text-2xl"
          )}
        >
          <Home className={cn(isKidsMode && "h-7 w-7")} />
        </Button>
        <span className="text-xs mt-1">Home</span>
      </Link>
      
      <Link href="/channels" className="flex flex-col items-center">
        <Button 
          variant="ghost" 
          size="icon"
          className={cn(
            "rounded-full",
            pathname === "/channels" && "bg-primary/10 text-primary",
            isKidsMode && "text-2xl"
          )}
        >
          <Tv className={cn(isKidsMode && "h-7 w-7")} />
        </Button>
        <span className="text-xs mt-1">Channels</span>
      </Link>
      
      <div className="flex flex-col items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleViewMode}
          className={cn("rounded-full", isKidsMode && "text-2xl")}
        >
          {isKidsMode ? (
            <Sun className={cn(isKidsMode && "h-7 w-7")} />
          ) : (
            <Moon />
          )}
        </Button>
        <span className="text-xs mt-1">{isKidsMode ? "Adult" : "Kids"}</span>
      </div>
    </div>
  );
}