import React from "react";
import { Link } from "gatsby";
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

  if (link.type === "internal") {
    return (
      <Link
        to={link.to}
        title={link.title}
        className={combined}
        activeClassName="active-button-link"
      >
        {link.label}
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
      {link.label}
    </a>
  );
}
