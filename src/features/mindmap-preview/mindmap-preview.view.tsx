import { Link, navigate } from "gatsby";
import React from "react";
import { meta } from "../../../meta";
import { Button } from "design-system/button";
import { BiArrowBack, BiDownload } from "react-icons/bi";
import MoreNav from "components/more-nav";
import UserPopover from "components/user-popover";
import { ScreenLoader } from "design-system/screen-loader";
import { useMindmapPreviewState } from "store/mindmap-preview";
import { getAccessibleMindmapAct } from "acts/get-accessible-mindmap.act";
import { Communicate } from "design-system/communicate";
import { downloadMindmapAction } from "store/mindmap-preview/actions";
import { BugReportContainer } from "containers/bug-report.container";
import { EducationRankLinkContainer } from "containers/education-rank-link.container";
import { EducationZoneLinkContainer } from "containers/education-zone-link.container";
import { CreationLinkContainer2 } from "containers/creation-link-2.container";
import { MindmapPreviewModule } from "modules/mindmap-preview/mindmap-preview.module";

const Loader = () => (
  <div className="flex gap-2">
    <div className="w-20 h-8 rounded-md bg-gray-300 dark:bg-gray-800" />
    <div className="w-4 h-8 rounded-md bg-gray-300 dark:bg-gray-800" />
    <div className="w-10 h-8 rounded-md bg-gray-300 dark:bg-gray-800" />
  </div>
);

const MindmapPreviewView = () => {
  const { mindmap } = useMindmapPreviewState();

  React.useEffect(() => {
    getAccessibleMindmapAct();
  }, []);

  return (
    <>
      <main className="md:mt-[122px] md:mb-0 mb-[122px] h-[calc(100svh-50px-72px)]">
        {mindmap.is === `busy` && <ScreenLoader />}
        {mindmap.is === `ok` && <MindmapPreviewModule />}
        {mindmap.is === `fail` && (
          <Communicate className="h-full">
            <Communicate.Message>
              We cannot load this mindmap. Try again or go back to mindmap
              creator
            </Communicate.Message>
            <Communicate.Footer>
              <Communicate.Action
                onClick={() => navigate(meta.routes.mindmaps.creator)}
                title="Go back to mindmapcreator"
              >
                <BiArrowBack />
                Back To Creator
              </Communicate.Action>
            </Communicate.Footer>
          </Communicate>
        )}
      </main>
      <header className="flex flex-col-reverse md:flex-col fixed bottom-0 md:top-0 md:bottom-[unset] left-0 right-0 bg-zinc-50 dark:bg-zinc-950">
        <div className="h-[72px] px-4 border-t md:border-b md:border-t-0 border-zinc-300 dark:border-zinc-800 flex justify-between gap-2">
          <nav className="flex items-center gap-2">
            <Link to={meta.routes.mindmaps.creator} className="shrink-0 mr-5">
              <img
                className="w-8 h-8"
                rel="preload"
                src="/favicon-32x32.png"
                alt="Logo"
              />
            </Link>
            <div className="items-center gap-5 mr-3 md:flex hidden">
              <CreationLinkContainer2 />
              <EducationRankLinkContainer />
              <EducationZoneLinkContainer />
            </div>
            <BugReportContainer />
          </nav>
          <div />
          <nav className="flex items-center gap-2">
            <UserPopover />
            <MoreNav />
          </nav>
        </div>
        <nav className="h-[50px] px-4 border-t md:border-b md:border-t-0 border-zinc-300 dark:border-zinc-800 flex items-center">
          {(mindmap.is === `busy` || mindmap.is === `idle`) && <Loader />}
          {mindmap.is === `ok` && (
            <>
              <h1 className="font-bold text-lg mr-4 truncate max-w-[260px] md:max-w-lg">
                {mindmap.name}
              </h1>
              <Button
                i={1}
                s={1}
                title="Download mindmap as JSON file"
                onClick={downloadMindmapAction}
              >
                <BiDownload />
              </Button>
            </>
          )}
        </nav>
      </header>
    </>
  );
};

export { MindmapPreviewView };
