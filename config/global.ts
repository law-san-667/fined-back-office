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
import { type Icon } from "@tabler/icons-react";

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
    {
      title: "Notifications",
      url: "/dashboard/notifications",
      icon: IconBell,
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
      title: "Mon Organisation",
      url: "/dashboard/orgs/me",
      icon: IconUsersGroup,
    },
    {
      title: "Membres",
      url: "/orgs/members",
      icon: IconUsers,
    },
    {
      title: "Packs",
      url: "/dashboard/packs",
      icon: IconFolder,
    },
  ],
  documents: [],
};

export const NAV_SECONDARY = [
  {
    title: "Réglages",
    url: "#",
    icon: IconSettings,
  },
  {
    title: "Support",
    url: "#",
    icon: IconHelp,
  },
  //   {
  //     title: "Search",
  //     url: "#",
  //     icon: IconSearch,
  //   },
];
