import React, { type ReactNode } from 'react';
import { Button } from 'design-system/button';
import { BiMoon, BiSun, BiX } from 'react-icons/bi';
import Backdrop from 'design-system/backdrop';
import { Link } from 'gatsby';
import { ButtonLink } from 'design-system/button-link';
import c from 'classnames';
import { CompanyLogo } from './company-logo';
import { meta } from '../../meta';
import { ThemeProvider } from 'design-system/theme-provider';
import { useScrollHide } from 'development-kit/use-scroll-hide';

interface MenuNavSidebarProps {
  onClose(): void;
  opened?: boolean;
}

const ScrollHide = ({ children }: { children: ReactNode }) => {
  useScrollHide();

  return <>{children}</>;
};

const MenuNavSidebar = ({ opened, onClose }: MenuNavSidebarProps) => {
  return (
    <>
      {opened && (
        <ScrollHide>
          <Backdrop onClick={onClose} />
        </ScrollHide>
      )}

      <aside
        data-testid="[menu-nav-sidebar]:container"
        className={c(
          `bg-zinc-200 z-20 dark:bg-gray-950 fixed top-0 right-0 h-full w-[280px] overflow-y-auto transition-transform duration-300`,
          opened ? `-translate-x-0` : `translate-x-full`,
        )}
      >
        <div className="p-4 flex gap-2 items-center h-[72px]">
          <Link
            to={meta.routes.home}
            className="flex items-center hover:underline underline-offset-2 mr-auto"
          >
            <img
              rel="preload"
              className="w-8 h-8"
              src="/favicon-32x32.png"
              alt={meta.appName}
              title={meta.title}
            />
            <p className="text-lg ml-3 font-bold">{meta.appName}</p>
          </Link>
          <ThemeProvider>
            {({ theme, set }) => (
              <Button
                i={2}
                s={1}
                title="Change theme"
                disabled={theme === null}
                onClick={() => set(theme === `light` ? `dark` : `light`)}
              >
                {theme === `dark` ? <BiSun /> : <BiMoon />}
              </Button>
            )}
          </ThemeProvider>
          <Button i={2} s={1} title="Close navigation" onClick={onClose}>
            <BiX />
          </Button>
        </div>
        <div className="p-4 pb-0 flex flex-col gap-2 h-[calc(100svh-72px)]">
          <ButtonLink
            to={meta.authorsUrl}
            target="_blank"
            title={`${meta.appName} authors`}
            rel="noopener noreferrer"
          >
            Authors
          </ButtonLink>
          <ButtonLink
            to={meta.blogUrl}
            target="_blank"
            title={`${meta.company} learning platform`}
            rel="noopener noreferrer"
          >
            Blog
          </ButtonLink>
          <ButtonLink
            to={meta.routes.home}
            title="Navigate to document creator"
            component={(props) => (
              <Link activeClassName="active-button-link" {...props} />
            )}
          >
            Document Creator
          </ButtonLink>
          <ButtonLink
            to={meta.discordUrl}
            target="_blank"
            title={`${meta.company} Discord`}
            rel="noopener noreferrer"
          >
            Discord
          </ButtonLink>
          <ButtonLink
            to={meta.routes.education.rank}
            title="Navigate to education rank"
            component={(props) => (
              <Link activeClassName="active-button-link" {...props} />
            )}
          >
            Education Rank
          </ButtonLink>
          <ButtonLink
            to={meta.routes.education.zone}
            title="Navigate to education zone"
            component={(props) => (
              <Link
                partiallyActive
                activeClassName="active-button-link"
                {...props}
              />
            )}
          >
            Education Zone
          </ButtonLink>
          <ButtonLink
            to={meta.linkedInUrl}
            target="_blank"
            title={`${meta.company} LinkedIn`}
            rel="noopener noreferrer"
          >
            LinkedIn
          </ButtonLink>
          <ButtonLink
            to={meta.fbGroupUrl}
            target="_blank"
            title={`${meta.company} Facebook`}
            rel="noopener noreferrer"
          >
            Facebook
          </ButtonLink>
          <ButtonLink
            to={meta.grammarlyUrl}
            target="_blank"
            title="Grammarly"
            rel="noopener noreferrer"
          >
            Grammarly Extension
          </ButtonLink>
          <ButtonLink
            to={meta.mdCheatsheet}
            target="_blank"
            title="Markdown Cheatsheet"
            rel="noopener noreferrer"
          >
            Markdown Cheatsheet
          </ButtonLink>
          <ButtonLink
            to={meta.routes.mindmaps.creator}
            title="Go to mindmap creator"
            component={(props) => (
              <Link activeClassName="active-button-link" {...props} />
            )}
          >
            Mindmap Creator
          </ButtonLink>
          <ButtonLink
            to={meta.routes.privacyPolicy}
            title="Check privacy policy"
            component={(props) => (
              <Link activeClassName="active-button-link" {...props} />
            )}
          >
            Privacy Policy
          </ButtonLink>
          <ButtonLink
            to={meta.sourceCodeUrl}
            target="_blank"
            title={`${meta.appName} Repository`}
            rel="noopener noreferrer"
          >
            Source Code
          </ButtonLink>
          <ButtonLink
            to={meta.ytVideoTutorialUrl}
            target="_blank"
            title="YouTube tutorial video"
            rel="noopener noreferrer"
          >
            Tutorial
          </ButtonLink>
          <ButtonLink
            to={meta.ytChannelUrl}
            target="_blank"
            className="mb-6"
            title={`${meta.appName} YouTube`}
            rel="noopener noreferrer"
          >
            YouTube
          </ButtonLink>
          <a
            href={meta.companyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center mt-auto cursor-pointer justify-end pb-4"
          >
            <p className="font-medium font-mono">
              By <strong>{meta.company}</strong>
            </p>
            <CompanyLogo size={32} className="ml-3" />
          </a>
        </div>
      </aside>
    </>
  );
};

export default MenuNavSidebar;
