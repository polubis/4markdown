import React from "react";
import { useAuthStore } from "store/auth/auth.store";
import { Loader } from "design-system/loader";
import { YourMindmapsGridContainer } from "modules/your-mindmaps";

const MindmapsView = () => {
  const auth = useAuthStore();

  return (
    <main className="flex flex-col min-h-[calc(100svh-72px)] py-10 px-4">
      {auth.is === `idle` && (
        <Loader data-testid="[mindmaps]:loader" className="m-auto" size="xl" />
      )}
      {auth.is === `unauthorized` && (
        <h1 className="text-2xl m-auto text-center">
          Resource Not Found at the Specified URL
        </h1>
      )}
      {auth.is === `authorized` && <YourMindmapsGridContainer />}
    </main>
  );
};

export { MindmapsView };
