"use client";

import {
  IconCamera,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFolder,
  IconHash,
  IconHelp,
  IconNews,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
  IconUsersGroup,
} from "@tabler/icons-react";
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
import { NavDocuments } from "./nav-documents";

const data = {
  user: {
    name: "Ikbal",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    // {
    //   title: "Dashboard",
    //   url: "#",
    //   icon: IconDashboard,
    // },
    {
      title: "Organisations",
      url: "/dashboard/orgs",
      icon: IconUsersGroup,
    },
    {
      title: "Utilisateurs",
      url: "#",
      icon: IconUsers,
    },
    {
      title: "Packs",
      url: "/dashboard/packs",
      icon: IconFolder,
    },
    {
      title: "Forum (Groupes)",
      url: "/dashboard/forum/channels",
      icon: IconHash,
    },
    {
      title: "Forum (Questions)",
      url: "/dashboard/forum/posts",
      icon: IconHelp,
    },
    {
      title: "News",
      url: "/dashboard/news",
      icon: IconNews,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Tags (Packs)",
      url: "/dashboard/pack-tags",
      icon: IconDatabase,
    },
    {
      name: "Tags (Questions)",
      url: "/dashboard/post-tags",
      icon: IconReport,
    },
    {
      name: "Tags (News)",
      url: "/dashboard/news-tags",
      icon: IconFileAi,
    },
    // {
    //   name: "Word Assistant",
    //   url: "#",
    //   icon: IconFileWord,
    // },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
