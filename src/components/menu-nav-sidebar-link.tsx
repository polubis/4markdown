import React from "react";
import { Link } from "gatsby";
import { BiPlus } from "react-icons/bi";
import type { NavLink } from "./menu-nav-sidebar-nav-config";

interface MenuNavSidebarLinkProps {
  link: NavLink;
  className?: string;
}

export function MenuNavSidebarLink({
  link,
  className,
}: MenuNavSidebarLinkProps) {
  const base =
    "block w-full text-left cursor-pointer rounded-md font-medium px-3 py-2.5 outline-none focus:outline focus:outline-2.5 focus:outline-offset-0 focus:outline-black dark:focus:outline-2 dark:focus:outline-white touch-action-manipulation";
  const combined = className ? `${base} ${className}` : base;
  const Icon = link.icon;
  const showSinglePlus = link.iconDecoration === "single-plus";

  const content = (
    <span className="flex items-center gap-2">
      {Icon ? (
        <span className="relative inline-flex shrink-0">
          <Icon className="shrink-0 text-xl" aria-hidden />
          {showSinglePlus ? (
            <BiPlus
              className="absolute -top-1.5 -right-1.5 text-xs"
              aria-hidden
            />
          ) : null}
        </span>
      ) : null}
      <span className="truncate">{link.label}</span>
    </span>
  );

  if (link.type === "internal") {
    return (
      <Link
        to={link.to}
        title={link.title}
        className={combined}
        activeClassName="active-button-link"
      >
        {content}
      </Link>
    );
  }
  return (
    <a
      href={link.href}
      target="_blank"
      rel={link.rel ?? "noopener noreferrer"}
      title={link.title}
      className={combined}
    >
      {content}
    </a>
  );
}
