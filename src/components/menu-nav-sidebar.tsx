import React, { type ReactNode } from "react";
import { Button } from "design-system/button";
import { BiMoon, BiSun, BiX } from "react-icons/bi";
import { Link } from "gatsby";
import Backdrop from "design-system/backdrop";
import { useScrollHide } from "development-kit/use-scroll-hide";
import { usePortal } from "development-kit/use-portal";
import { meta } from "../../meta";
import { ThemeProvider } from "design-system/theme-provider";
import { GreenOnLogo } from "./green-on-logo";
import { useAuthStore } from "store/auth/auth.store";
import { getMenuNavSidebarNavConfig } from "./menu-nav-sidebar-nav-config";
import { MenuNavSidebarLink } from "./menu-nav-sidebar-link";
import {
  requestOpenPreviousWorkAction,
  usePreviousWorkState,
} from "modules/previous-work";

interface MenuNavSidebarProps {
  onClose(): void;
  opened?: boolean;
}

const ScrollHide = ({ children }: { children: ReactNode }) => {
  useScrollHide();
  return <>{children}</>;
};

const MenuNavSidebar = ({ opened, onClose }: MenuNavSidebarProps) => {
  const { render } = usePortal();
  const isAuthorized = useAuthStore((s) => s.is === `authorized`);
  const previousWorkEntries = usePreviousWorkState((s) => s.entries);
  const nav = getMenuNavSidebarNavConfig(meta);

  if (!opened) return null;

  return render(
    <>
      <ScrollHide>
        <Backdrop
          onClick={onClose}
          className="!bg-black/55 dark:!bg-black/75"
        />
      </ScrollHide>
      <aside
        data-testid="[menu-nav-sidebar]:container"
        className="animate-slide-in-right bg-zinc-100 dark:bg-zinc-900 border-l border-zinc-300 dark:border-zinc-800 z-20 fixed top-0 right-0 h-full w-[300px] overflow-y-auto overscroll-contain flex flex-col"
        aria-label="Main navigation"
      >
        <header className="shrink-0 p-5 flex gap-3 items-center h-[72px] border-b border-zinc-200 dark:border-zinc-800">
          <Link
            to={meta.routes.home}
            className="flex items-center hover:opacity-90 mr-auto outline-none focus:outline focus:outline-2.5 focus:outline-offset-0 focus:outline-black dark:focus:outline-2 dark:focus:outline-white rounded"
          >
            <img
              rel="preload"
              className="w-8 h-8 shrink-0"
              src="/favicon-32x32.png"
              alt=""
              width={32}
              height={32}
              aria-hidden
            />
            <p className="text-lg ml-3 font-bold text-zinc-900 dark:text-zinc-100 min-w-0 truncate">
              {meta.appName}
            </p>
          </Link>
          <ThemeProvider>
            {({ theme, set }) => (
              <Button
                i={2}
                s={1}
                title="Change theme"
                aria-label="Change theme"
                disabled={theme === null}
                onClick={() => set(theme === "light" ? "dark" : "light")}
              >
                {theme === "dark" ? (
                  <BiSun aria-hidden />
                ) : (
                  <BiMoon aria-hidden />
                )}
              </Button>
            )}
          </ThemeProvider>
          <Button
            i={2}
            s={1}
            title="Close navigation"
            aria-label="Close navigation"
            onClick={onClose}
          >
            <BiX aria-hidden />
          </Button>
        </header>

        <nav
          className="flex-1 overflow-y-auto p-5 flex flex-col gap-8"
          aria-label="Create, your stuff, education, other, and external links"
        >
          <section aria-labelledby="nav-create-or-add-heading">
            <h2
              id="nav-create-or-add-heading"
              className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3 px-1"
            >
              Create
            </h2>
            <ul className="flex flex-col gap-2 list-none p-0 m-0">
              {nav.createOrAdd.map((link) => (
                <li key={link.type === "internal" ? link.to : link.href}>
                  <MenuNavSidebarLink
                    link={link}
                    className="bg-zinc-200/80 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-300/80 dark:hover:bg-zinc-700/80"
                  />
                </li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="nav-your-stuff-heading">
            <h2
              id="nav-your-stuff-heading"
              className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3 px-1"
            >
              Your stuff
            </h2>
            <ul className="flex flex-col gap-2 list-none p-0 m-0">
              {nav.yourStuff.map((link) => (
                <li key={link.type === "internal" ? link.to : link.href}>
                  <MenuNavSidebarLink
                    link={link}
                    className="bg-zinc-200/80 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-300/80 dark:hover:bg-zinc-700/80"
                  />
                </li>
              ))}
              {isAuthorized && previousWorkEntries.length > 0 && (
                <li>
                  <button
                    type="button"
                    title="Open previous work"
                    aria-label="Open previous work"
                    className="block w-full text-left cursor-pointer rounded-md font-medium px-3 py-2.5 outline-none focus:outline focus:outline-2.5 focus:outline-offset-0 focus:outline-black dark:focus:outline-2 dark:focus:outline-white touch-action-manipulation bg-zinc-200/80 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-300/80 dark:hover:bg-zinc-700/80"
                    onClick={() => {
                      requestOpenPreviousWorkAction();
                      onClose();
                    }}
                  >
                    Previous work
                  </button>
                </li>
              )}
            </ul>
          </section>
          <section aria-labelledby="nav-education-heading">
            <h2
              id="nav-education-heading"
              className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3 px-1"
            >
              Education
            </h2>
            <ul className="flex flex-col gap-2 list-none p-0 m-0">
              {nav.education.map((link) => (
                <li key={link.type === "internal" ? link.to : link.href}>
                  <MenuNavSidebarLink
                    link={link}
                    className="bg-zinc-200/80 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-300/80 dark:hover:bg-zinc-700/80"
                  />
                </li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="nav-other-heading">
            <h2
              id="nav-other-heading"
              className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3 px-1"
            >
              Other
            </h2>
            <ul className="flex flex-col gap-2 list-none p-0 m-0">
              {nav.other.map((link) => (
                <li key={link.type === "internal" ? link.to : link.href}>
                  <MenuNavSidebarLink
                    link={link}
                    className="bg-zinc-200/80 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-300/80 dark:hover:bg-zinc-700/80"
                  />
                </li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="nav-external-heading">
            <h2
              id="nav-external-heading"
              className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3 px-1"
            >
              External
            </h2>
            <ul className="flex flex-col gap-2 list-none p-0 m-0">
              {nav.external.map((link) => (
                <li key={link.type === "external" ? link.href : link.to}>
                  <MenuNavSidebarLink
                    link={link}
                    className="bg-zinc-200/80 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-300/80 dark:hover:bg-zinc-700/80"
                  />
                </li>
              ))}
            </ul>
          </section>
          <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
            <a
              href={meta.companyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="outline-none focus:outline focus:outline-2.5 focus:outline-offset-0 focus:outline-black dark:focus:outline-2 dark:focus:outline-white rounded text-zinc-900 dark:text-zinc-100"
            >
              <GreenOnLogo height={72} className="shrink-0" />
            </a>
          </div>
        </nav>
      </aside>
    </>,
  );
};

export default MenuNavSidebar;
