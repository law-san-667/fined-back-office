"use client";

import { type Icon } from "@tabler/icons-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { AnimatedBellIcon } from "@/components/animated-bell-icon";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
            const isActive = pathname === item.url || pathname.startsWith(item.url + "/");
            
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  tooltip={item.title} 
                  asChild
                  className={isActive ? "bg-accent text-accent-foreground" : ""}
                >
                  <Link href={item.url} className="relative group">
                    {item.title === "Notifications" ? (
                      <AnimatedBellIcon className="transition-all duration-300" />
                    ) : (
                      item.icon && (
                        <item.icon 
                          className={`transition-all duration-300 ${
                            isActive 
                              ? "animate-pulse scale-110 text-primary" 
                              : "group-hover:scale-105"
                          }`} 
                        />
                      )
                    )}
                    <span className={`transition-all duration-300 ${
                      isActive ? "font-semibold" : ""
                    }`}>
                      {item.title}
                    </span>
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full animate-pulse" />
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
