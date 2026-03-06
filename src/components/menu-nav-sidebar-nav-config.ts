import type { IconType } from "react-icons";
import {
  BiBook,
  BiCheckCircle,
  BiFile,
  BiImageAdd,
  BiNetworkChart,
  BiStar,
  BiTrophy,
  BiUserPlus,
} from "react-icons/bi";

type NavLinkInternal = {
  type: "internal";
  to: string;
  title: string;
  label: string;
  icon?: IconType;
  iconDecoration?: "single-plus";
};

type NavLinkExternal = {
  type: "external";
  href: string;
  title: string;
  label: string;
  icon?: IconType;
  iconDecoration?: "single-plus";
  rel?: string;
};

type NavLink = NavLinkInternal | NavLinkExternal;

type MenuNavSidebarNavConfig = {
  createOrAdd: NavLink[];
  yourStuff: NavLink[];
  education: NavLink[];
  other: NavLink[];
  external: NavLink[];
};

type Meta = {
  appName: string;
  company: string;
  authorsUrl: string;
  blogUrl: string;
  discordUrl: string;
  linkedInUrl: string;
  fbGroupUrl: string;
  grammarlyUrl: string;
  mdCheatsheet: string;
  sourceCodeUrl: string;
  ytVideoTutorialUrl: string;
  ytChannelUrl: string;
  routes: {
    home: string;
    education: { rank: string; zone: string };
    accessGroups: { management: string };
    assets: { management: string };
    likedResources: { management: string };
    completed: { management: string };
    documents: { management: string };
    mindmaps: { creator: string; management: string };
    privacyPolicy: string;
  };
};

function byLabel(a: NavLink, b: NavLink): number {
  return a.label.localeCompare(b.label, undefined, { sensitivity: "base" });
}

function getMenuNavSidebarNavConfig(meta: Meta): MenuNavSidebarNavConfig {
  const createOrAdd: NavLink[] = [
    {
      type: "internal",
      to: meta.routes.home,
      title: "Navigate to document creator",
      label: "Document",
      icon: BiFile,
      iconDecoration: "single-plus",
    },
    {
      type: "internal",
      to: meta.routes.mindmaps.creator,
      title: "Go to mindmap creator",
      label: "Mindmap",
      icon: BiNetworkChart,
      iconDecoration: "single-plus",
    },
  ];

  const yourStuff: NavLink[] = [
    {
      type: "internal",
      to: meta.routes.accessGroups.management,
      title: "Manage access groups",
      label: "Access Groups",
      icon: BiUserPlus,
    },
    {
      type: "internal",
      to: meta.routes.assets.management,
      title: "Manage uploaded assets",
      label: "Assets",
      icon: BiImageAdd,
    },
    {
      type: "internal",
      to: meta.routes.completed.management,
      title: "View completed items",
      label: "Completed",
      icon: BiCheckCircle,
    },
    {
      type: "internal",
      to: meta.routes.documents.management,
      title: "View your documents",
      label: "Documents",
      icon: BiFile,
    },
    {
      type: "internal",
      to: meta.routes.mindmaps.management,
      title: "View your mindmaps",
      label: "Mindmaps",
      icon: BiNetworkChart,
    },
    {
      type: "internal",
      to: meta.routes.likedResources.management,
      title: "View starred items",
      label: "Starred",
      icon: BiStar,
    },
  ];

  const education: NavLink[] = [
    {
      type: "internal",
      to: meta.routes.education.rank,
      title: "Navigate to education rank",
      label: "Education Rank",
      icon: BiTrophy,
    },
    {
      type: "internal",
      to: meta.routes.education.zone,
      title: "Navigate to education zone",
      label: "Education Zone",
      icon: BiBook,
    },
  ];

  const other: NavLink[] = [
    {
      type: "internal",
      to: meta.routes.privacyPolicy,
      title: "Check privacy policy",
      label: "Privacy Policy",
    },
  ];

  const external: NavLink[] = [
    {
      type: "external",
      href: meta.authorsUrl,
      title: `${meta.appName} authors`,
      label: "Authors",
      rel: "noopener noreferrer",
    },
    {
      type: "external",
      href: meta.blogUrl,
      title: `${meta.company} learning platform`,
      label: "Blog",
      rel: "noopener noreferrer",
    },
    {
      type: "external",
      href: meta.discordUrl,
      title: `${meta.company} Discord`,
      label: "Discord",
      rel: "noopener noreferrer",
    },
    {
      type: "external",
      href: meta.fbGroupUrl,
      title: `${meta.company} Facebook`,
      label: "Facebook",
      rel: "noopener noreferrer",
    },
    {
      type: "external",
      href: meta.grammarlyUrl,
      title: "Grammarly",
      label: "Grammarly Extension",
      rel: "noopener noreferrer",
    },
    {
      type: "external",
      href: meta.linkedInUrl,
      title: `${meta.company} LinkedIn`,
      label: "LinkedIn",
      rel: "noopener noreferrer",
    },
    {
      type: "external",
      href: meta.mdCheatsheet,
      title: "Markdown Cheatsheet",
      label: "Markdown Cheatsheet",
      rel: "noopener noreferrer",
    },
    {
      type: "external",
      href: meta.sourceCodeUrl,
      title: `${meta.appName} Repository`,
      label: "Source Code",
      rel: "noopener noreferrer",
    },
    {
      type: "external",
      href: meta.ytVideoTutorialUrl,
      title: "YouTube tutorial video",
      label: "Tutorial",
      rel: "noopener noreferrer",
    },
    {
      type: "external",
      href: meta.ytChannelUrl,
      title: `${meta.appName} YouTube`,
      label: "YouTube",
      rel: "noopener noreferrer",
    },
  ];

  return {
    createOrAdd: createOrAdd.slice().sort(byLabel),
    yourStuff: yourStuff.slice().sort(byLabel),
    education: education.slice().sort(byLabel),
    other: other.slice().sort(byLabel),
    external: external.slice().sort(byLabel),
  };
}

export type {
  MenuNavSidebarNavConfig,
  NavLink,
  NavLinkExternal,
  NavLinkInternal,
};
export { getMenuNavSidebarNavConfig };
