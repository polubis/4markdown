import c from "classnames";
import { GreenOnLogo } from "components/green-on-logo";
import { Link } from "gatsby";
import React, { type ReactNode } from "react";
import { meta } from "../../meta";

const Column = ({
  className,
  title,
  children,
}: {
  className?: string;
  title: string;
  children: ReactNode;
}) => {
  return (
    <div className={c(`flex flex-col`, className)}>
      <p className="font-bold text-sm uppercase mb-2">{title}</p>
      <div className="flex flex-wrap gap-x-3 gap-y-2 md:flex-col md:space-y-1 md:gap-x-0 md:gap-y-0">
        {children}
      </div>
    </div>
  );
};

const AppFooterContainer = () => {
  return (
    <footer className="bg-zinc-200 dark:bg-gray-950">
      <div className="border-t border-zinc-300 dark:border-zinc-800">
        <div className="flex flex-col px-4 py-8 md:flex-row md:space-x-10 space-y-6 md:space-y-0 mx-auto justify-center">
          <div className="flex flex-col space-y-2">
            <Link
              to={meta.routes.home}
              className="cursor-pointer flex items-center space-x-3 mb-2 hover:underline underline-offset-2"
            >
              <img
                className="w-8 h-8"
                loading="lazy"
                src="/favicon-32x32.png"
                alt={meta.appName}
                title={meta.title}
              />

              <p className="font-bold mb-1">{meta.appName}</p>
            </Link>

            <p className="text-sm flex flex-col">
              <span>© 2024 All rights reserved</span>
              <span>{meta.contactEmail}</span>
            </p>
          </div>
          <Column title="About">
            <a
              className="hover:underline underline-offset-2"
              href={meta.authorsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Authors
            </a>
            <a
              className="hover:underline underline-offset-2"
              href={meta.sourceCodeUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Source Code
            </a>
          </Column>
          <Column title="Help">
            <a
              className="hover:underline underline-offset-2"
              href={meta.blogUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Blog
            </a>
            <a
              className="hover:underline underline-offset-2"
              href={meta.grammarlyUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Grammarly Extension
            </a>
            <a
              className="hover:underline underline-offset-2"
              href={meta.mdCheatsheet}
              target="_blank"
              rel="noopener noreferrer"
            >
              Markdown Cheatsheet
            </a>
            <a
              className="hover:underline underline-offset-2"
              href={meta.ytVideoTutorialUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Tutorial
            </a>
          </Column>
          <Column title="Navigation">
            <Link
              activeClassName="active-link"
              className="hover:underline underline-offset-2"
              to={meta.routes.home}
            >
              Document Creator
            </Link>
            <Link
              activeClassName="active-link"
              className="hover:underline underline-offset-2"
              to={meta.routes.education.rank}
            >
              Education Rank
            </Link>
            <Link
              activeClassName="active-link"
              className="hover:underline underline-offset-2"
              to={meta.routes.education.zone}
              partiallyActive
            >
              Education Zone
            </Link>
            <Link
              activeClassName="active-link"
              className="hover:underline underline-offset-2"
              to={meta.routes.mindmaps.creator}
            >
              Mindmap Creator
            </Link>
            <Link
              activeClassName="active-link"
              className="hover:underline underline-offset-2"
              to={meta.routes.privacyPolicy}
            >
              Privacy Policy
            </Link>
          </Column>
          <Column title="Socials">
            <a
              className="hover:underline underline-offset-2"
              href={meta.discordUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Discord
            </a>
            <a
              className="hover:underline underline-offset-2"
              href={meta.linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <a
              className="hover:underline underline-offset-2"
              href={meta.fbGroupUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook
            </a>
            <a
              className="hover:underline underline-offset-2"
              href={meta.ytChannelUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              YouTube
            </a>
          </Column>
        </div>
        <div className="mt-4 pt-4 border-t border-zinc-300 dark:border-zinc-800 flex justify-end px-4 pb-5">
          <a
            href={meta.companyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="outline-none focus:outline focus:outline-2.5 focus:outline-offset-0 focus:outline-black dark:focus:outline-2 dark:focus:outline-white rounded text-zinc-900 dark:text-zinc-100"
          >
            <GreenOnLogo height={72} className="shrink-0" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export { AppFooterContainer };
