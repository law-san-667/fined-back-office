"use client";

import { IconBell } from "@tabler/icons-react";
import { usePathname } from "next/navigation";

interface AnimatedBellIconProps {
  className?: string;
}

export function AnimatedBellIcon({ className = "" }: AnimatedBellIconProps) {
  const pathname = usePathname();
  const isNotificationsPage = pathname === "/dashboard/notifications" || pathname.startsWith("/dashboard/notifications/");

  return (
    <div className="relative">
      <IconBell 
        className={`${className} transition-all duration-300 ${
          isNotificationsPage 
            ? "animate-soft-pulse text-primary scale-110" 
            : "group-hover:scale-105"
        }`} 
      />
      {isNotificationsPage && (
        <>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-ping" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary/50 rounded-full animate-pulse" />
        </>
      )}
    </div>
  );
}
