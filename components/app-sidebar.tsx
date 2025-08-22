"use client";

import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ADMIN_MENU, NAV_SECONDARY, ORG_MENU } from "@/config/global";
import { trpc } from "@/server/trpc/client";
import { NavDocuments } from "./nav-documents";
import { NavSecondary } from "./nav-secondary";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: authed, isLoading } = trpc.auth.me.useQuery();

  const navigation = authed?.adminAccount.org_id ? ORG_MENU : ADMIN_MENU;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <div className="w-full h-fit">
                <img
                  src="/fined-logo.png"
                  alt="logo"
                  className="w-8 h-full object-cover"
                />
                <span className="text-base font-semibold">
                  Fined - Dashboard
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigation.navMain} />
        {authed?.adminAccount.org_id === null && (
          <NavDocuments items={navigation.documents} />
        )}
        {authed?.adminAccount.org_id && (
          <NavSecondary items={NAV_SECONDARY} className="mt-auto" />
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
