import React from "react";
import { Link } from "gatsby";
import { Markdown } from "components/markdown";
import { Loader } from "design-system/loader";
import { Communicate } from "design-system/communicate";
import { useAuthStore } from "store/auth/auth.store";
import { useMarkdownPostCreatorState } from "store/markdown-post-creator";
import { CreatePostFormContainer } from "./containers/create-post-form.container";
import { meta } from "../../../meta";

const MarkdownPostCreatorView = () => {
  const auth = useAuthStore();
  const { content } = useMarkdownPostCreatorState();

  return (
    <main className="flex h-[calc(100svh-72px)]">
      {auth.is === `idle` && <Loader className="m-auto" size="xl" />}
      {auth.is === `unauthorized` && (
        <Communicate className="m-auto">
          <Communicate.Message>
            Sign in to create markdown posts
          </Communicate.Message>
          <Communicate.Footer>
            <Communicate.Action title="Go to login page" onClick={() => void 0}>
              <Link to={meta.routes.auth.login}>Sign In</Link>
            </Communicate.Action>
          </Communicate.Footer>
        </Communicate>
      )}
      {auth.is === `authorized` && (
        <>
          <section className="flex flex-col w-full md:w-1/2 border-r border-zinc-300 dark:border-zinc-800 p-4 overflow-y-auto">
            <CreatePostFormContainer />
          </section>
          <section className="hidden md:block w-1/2 overflow-y-auto">
            {content.trim().length === 0 ? (
              <p className="p-4 text-sm text-gray-500 dark:text-gray-400 italic">
                Preview will appear here as you type...
              </p>
            ) : (
              <Markdown className="p-4">{content}</Markdown>
            )}
          </section>
        </>
      )}
    </main>
  );
};

export { MarkdownPostCreatorView };
