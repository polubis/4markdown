import React, { type MouseEventHandler } from "react";
import { Link } from "gatsby";
import { useLocation } from "@reach/router";
import { BiDownload, BiPlus, BiUpload } from "react-icons/bi";
import { Button } from "design-system/button";
import UserPopover from "components/user-popover";
import MoreNav from "components/more-nav";
import { MindmapCreatorContainer } from "./containers/mindmap-creator.container";
import { useAuthStore } from "store/auth/auth.store";
import { logInAct } from "acts/log-in.act";
import { meta } from "../../../meta";
import { useMindmapCreatorState } from "store/mindmap-creator";
import {
  clearMindmapAction,
  downloadMindmapAction,
  openMindmapFormAction,
  replaceMindmapStructureAction,
  resetMindmapAction,
  selectMindmapAction,
} from "store/mindmap-creator/actions";
import type {
  MindmapCreatorEdge,
  MindmapCreatorNode,
} from "store/mindmap-creator/models";
import { type SUID, suid } from "development-kit/suid";
import type { Atoms } from "api-4markdown-contracts";
import { MindmapFormModalContainer } from "./containers/mindmap-form-modal.container";
import { SubNavContainer } from "./containers/sub-nav.container";
import { useConfirm } from "development-kit/use-confirm";
import { getYourMindmapsAct } from "acts/get-your-mindmaps.act";
import { BugReportContainer } from "containers/bug-report.container";

const ADD_MINDMAP_KEY = `add-mindmap`;

const isMindmapCreationActive = (): boolean =>
  sessionStorage.getItem(ADD_MINDMAP_KEY) === `1`;

const triggerMindmapCreation = (): void => {
  sessionStorage.setItem(ADD_MINDMAP_KEY, `1`);
};

const resetMindmapCreation = (): void => {
  sessionStorage.removeItem(ADD_MINDMAP_KEY);
};

const AddNewMindmapContainer = () => {
  const authStore = useAuthStore();
  const { mindmapForm } = useMindmapCreatorState();

  const startMindmapCreation: MouseEventHandler<HTMLButtonElement> = () => {
    if (authStore.is === `authorized`) {
      openMindmapFormAction();
      return;
    }

    triggerMindmapCreation();
    logInAct();
  };

  React.useEffect(() => {
    if (
      authStore.is === `authorized` &&
      mindmapForm.is === `closed` &&
      isMindmapCreationActive()
    ) {
      resetMindmapCreation();
      openMindmapFormAction();
    }
  }, [authStore.is, mindmapForm.is]);

  return (
    <>
      <Button
        i={1}
        disabled={authStore.is === `idle`}
        s={2}
        title="Create new mindmap"
        onClick={startMindmapCreation}
      >
        <BiPlus />
      </Button>
      {(mindmapForm.is === `active` || mindmapForm.is === `edition`) && (
        <MindmapFormModalContainer />
      )}
    </>
  );
};

const MindmapCreatorView = () => {
  const location = useLocation();
  const authStore = useAuthStore();
  const clearConfirm = useConfirm(clearMindmapAction);
  const resetConfirm = useConfirm(resetMindmapAction);
  const { mindmaps, headerVisible } = useMindmapCreatorState();
  const uploadInputRef = React.useRef<HTMLInputElement | null>(null);
  const openedMindmapIdRef = React.useRef<string | null>(null);
  const directoryProps = {
    webkitdirectory: "true",
    directory: "true",
  } as React.InputHTMLAttributes<HTMLInputElement> & {
    webkitdirectory?: string;
    directory?: string;
  };

  const handleUploadClick = () => {
    if (uploadInputRef.current) {
      uploadInputRef.current.value = ``;
      uploadInputRef.current.click();
    }
  };

  const handleMindmapUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    const structureFile =
      files.find((file) => file.name === `structure.json`) ??
      files.find((file) => file.webkitRelativePath.endsWith(`/structure.json`));

    if (!structureFile) {
      window.alert(`Missing structure.json in selected folder.`);
      return;
    }

    try {
      const raw = await structureFile.text();
      const structure = JSON.parse(raw) as {
        orientation?: "x" | "y";
        nodes?: Array<{
          /** Original node id from export; preserves ratings/comments associations. */
          id?: string;
          title?: string;
          type?: "embedded" | "external";
          description?: string | null;
          path?: string | null;
          url?: string;
          position?: { x: number; y: number };
          contentFile?: string | null;
        }>;
        edges?: Array<{
          id?: string;
          type?: "solid";
          source?: string;
          target?: string;
        }>;
      };

      const stripFrontmatter = (content: string) => {
        if (!content.startsWith(`---`)) return content;
        const end = content.indexOf(`\n---`, 3);
        if (end === -1) return content;
        return content.slice(end + `\n---`.length).replace(/^\n/, ``);
      };

      const fileByName = new Map<string, File>();
      files.forEach((file) => {
        fileByName.set(file.name, file);
        if (file.webkitRelativePath) {
          const parts = file.webkitRelativePath.split(`/`);
          fileByName.set(parts[parts.length - 1], file);
        }
      });

      const normalizePath = (path: string | null | undefined, name: string) => {
        const base = (path ?? name).trim();
        if (base.length === 0) return `/node/`;
        const trimmed = base.replace(/^\/+|\/+$/g, ``);
        return `/${trimmed || `node`}/`;
      };

      const importedNodes: MindmapCreatorNode[] = await Promise.all(
        (structure.nodes ?? []).map(async (node, index) => {
          const name = node.title ?? `Node ${index + 1}`;
          const path = normalizePath(node.path, name);
          const description = node.description ?? null;
          const isExternal = node.type === `external` && Boolean(node.url);
          /**
           * Preserve original node id when present so that any ratings,
           * scores or comments linked to this node id in the backend
           * remain associated after shape update.
           */
          const id = (node.id as SUID | undefined) ?? suid();
          const baseNode = {
            id,
            position: node.position ?? {
              x: (index % 4) * 320,
              y: Math.floor(index / 4) * 220,
            },
            selected: false,
          };

          if (isExternal) {
            return {
              ...baseNode,
              type: `external`,
              data: {
                name,
                path: path as `/${string}/`,
                description,
                url: node.url as Atoms["Url"],
              },
            };
          }

          let content: string | null = null;
          if (node.contentFile) {
            const file = fileByName.get(node.contentFile);
            if (file) {
              const rawContent = await file.text();
              content = stripFrontmatter(rawContent).trimEnd();
            }
          }

          return {
            ...baseNode,
            type: `embedded`,
            data: {
              name,
              path: path as `/${string}/`,
              description,
              content,
            },
          };
        }),
      );

      const importedEdges: MindmapCreatorEdge[] = (structure.edges ?? [])
        .map((edge) => {
          const source = edge.source as SUID | undefined;
          const target = edge.target as SUID | undefined;
          if (!source || !target) return null;
          return {
            /**
             * Keep original edge id when available; it is UI-only and
             * does not affect ratings/comments, but helps with stability.
             */
            id: (edge.id as SUID | undefined) ?? suid(),
            type: `solid`,
            source,
            target,
          };
        })
        .filter((edge): edge is MindmapCreatorEdge => Boolean(edge));

      replaceMindmapStructureAction({
        nodes: importedNodes,
        edges: importedEdges,
        orientation: structure.orientation ?? `y`,
      });
    } catch (error) {
      window.alert(`Failed to import structure.json.`);
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  React.useEffect(() => {
    authStore.is === `authorized` && getYourMindmapsAct();
  }, [authStore]);

  React.useEffect(() => {
    if (authStore.is !== `authorized`) return;
    if (mindmaps.is !== `ok`) return;
    const params = new URLSearchParams(location.search);
    const mindmapId = params.get(`mindmapId`);
    if (!mindmapId) return;
    if (openedMindmapIdRef.current === mindmapId) return;
    openedMindmapIdRef.current = mindmapId;
    selectMindmapAction(mindmapId as Atoms["MindmapId"]);
  }, [authStore.is, mindmaps.is, location.search]);

  return (
    <>
      <main
        className={
          headerVisible
            ? "md:mt-[122px] md:mb-0 mb-[122px] h-[calc(100svh-50px-72px)]"
            : "h-[100svh]"
        }
      >
        <MindmapCreatorContainer />
      </main>
      {headerVisible && (
        <header className="flex flex-col-reverse md:flex-col fixed bottom-0 md:top-0 md:bottom-[unset] left-0 right-0 bg-zinc-50 dark:bg-zinc-950">
          <div className="h-[72px] px-4 border-t md:border-b md:border-t-0 border-zinc-300 dark:border-zinc-800 flex justify-between gap-2">
            <nav className="flex items-center gap-2">
              <Link
                to={meta.routes.home}
                className="shrink-0 sm:flex hidden mr-2"
              >
                <img
                  className="w-8 h-8"
                  rel="preload"
                  src="/favicon-32x32.png"
                  alt="Logo"
                />
              </Link>
              <AddNewMindmapContainer />
              <Button
                i={1}
                s={2}
                className="hidden md:flex"
                title="Download mindmap as folder"
                onClick={downloadMindmapAction}
              >
                <BiDownload />
              </Button>
              <Button
                i={1}
                s={2}
                className="hidden md:flex"
                title="Upload mindmap folder"
                onClick={handleUploadClick}
              >
                <BiUpload />
              </Button>
              <input
                ref={uploadInputRef}
                type="file"
                onChange={handleMindmapUpload}
                className="hidden"
                multiple
                {...directoryProps}
              />
              <Button
                i={1}
                s={2}
                auto
                className="md:flex hidden"
                title="Clear mindmap"
                onClick={clearConfirm.confirm}
              >
                {clearConfirm.isOn ? `Sure?` : `Clear`}
              </Button>
              <Button
                i={1}
                s={2}
                auto
                className="md:flex hidden"
                title="Reset mindmap"
                onClick={resetConfirm.confirm}
              >
                {resetConfirm.isOn ? `Sure?` : `Reset`}
              </Button>
              <BugReportContainer />
            </nav>
            <div />
            <nav className="flex items-center gap-2">
              <UserPopover />
              <MoreNav />
            </nav>
          </div>
          <nav className="h-[50px] px-4 border-t md:border-b md:border-t-0 border-zinc-300 dark:border-zinc-800 flex items-center">
            <SubNavContainer />
          </nav>
        </header>
      )}
    </>
  );
};

export { MindmapCreatorView };
