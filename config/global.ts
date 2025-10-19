import {
  IconBell,
  IconDatabase,
  IconFileAi,
  IconFolder,
  IconHash,
  IconHelp,
  IconNews,
  IconReport,
  IconSettings,
  IconUsers,
  IconUsersGroup,
} from "@tabler/icons-react";

export const shouldLog = process.env.NEXT_PUBLIC_SHOULD_LOG === "true";

export const ADMIN_MENU = {
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
    // System admins will find the invite flow inside Organisations (Members) page
    {
      title: "Utilisateurs",
      url: "/dashboard/users",
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

export const ORG_MENU = {
  navMain: [
    {
      title: "Packs",
      url: "/dashboard/packs",
      icon: IconFolder,
    },
    {
      title: "News",
      url: "/dashboard/news",
      icon: IconNews,
    },
    // Les admins d'organisation ont accès aux notifications
    {
      title: "Notifications",
      url: "/dashboard/notifications",
      icon: IconBell,
    },
    // Add notifications link if needed for org admins
  ],
  documents: [],
};

export const NAV_SECONDARY = [] as const;
