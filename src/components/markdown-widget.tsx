import { useSimpleFeature } from "@greenonsoftware/react-kit";
import { Markdown } from "components/markdown";
import { Button } from "design-system/button";
import { c } from "design-system/c";
import { Modal2 } from "design-system/modal2";
import {
  ExtractedHeading,
  extractHeadings,
} from "development-kit/extract-headings";
import { useCopy } from "development-kit/use-copy";
import { useKeyPress } from "development-kit/use-key-press";
import React, { ReactNode } from "react";
import { ResourceActivityContainer } from "modules/resource-activity";
import {
  BiArrowToLeft,
  BiArrowToRight,
  BiArrowToTop,
  BiBookContent,
  BiCheck,
  BiChevronDown,
  BiCollapse,
  BiCopyAlt,
  BiDetail,
  BiDotsHorizontal,
  BiExpand,
  BiHistory,
  BiListOl,
} from "react-icons/bi";
import { Atoms } from "api-4markdown-contracts";
import Popover from "design-system/popover";
import { Tabs } from "design-system/tabs";

type MarkdownWidgetProps = {
  chunksActive?: boolean;
  headerControls?: ReactNode;
  footerLeftControls?: ReactNode;
  markdown: string;
  onClose(): void;
  resourceId?: Atoms["ResourceId"];
  resourceType?: Atoms["ResourceType"];
};

const MAX_CHUNK_HEADING_LEVEL = 2;

const MarkdownWidget = ({
  chunksActive = true,
  headerControls,
  footerLeftControls,
  markdown,
  onClose,
  resourceId,
  resourceType,
}: MarkdownWidgetProps) => {
  const bodyId = React.useId();
  const markdownId = React.useId();
  const chunksMode = useSimpleFeature(chunksActive);
  const [activeChunkIdx, setActiveChunkIdx] = React.useState(0);
  const asideNavigation = useSimpleFeature();
  const [activeHeading, setActiveHeading] = React.useState<string | null>(null);

  const headings = React.useMemo(() => extractHeadings(markdown), [markdown]);

  const chunks = React.useMemo((): string[] => {
    if (chunksMode.isOff) return [];

    const parts = markdown.split(`\n`);
    const headingPositions: number[] = [];

    let introEnd = parts.length;

    for (let i = 0; i < parts.length; i++) {
      if (/^##\s.+$/.test(parts[i])) {
        headingPositions.push(i);

        if (introEnd === parts.length) {
          introEnd = i;
        }
      }
    }

    const intro = parts.slice(0, introEnd).join(`\n`).trim();

    const rest = headingPositions.map((start, index) => {
      const end = headingPositions[index + 1] ?? parts.length;
      return parts.slice(start, end).join(`\n`).trim();
    });

    return [intro, ...rest];
  }, [markdown, chunksMode.isOn]);

  const ableToPrev = activeChunkIdx > 0;
  const ableToNext = activeChunkIdx <= chunks.length - MAX_CHUNK_HEADING_LEVEL;
  const activeChunk = chunks[activeChunkIdx];

  const finalHeadings = React.useMemo(() => {
    return chunksMode.isOn
      ? headings.filter((heading) => heading.level <= MAX_CHUNK_HEADING_LEVEL)
      : headings;
  }, [headings, chunksMode.isOn]);

  const toggleMode = () => {
    chunksMode.toggle();
    asideNavigation.off();
  };

  const scrollToTop = () => {
    const body = document.getElementById(bodyId);

    if (!body) return;

    body.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToPreviousChunk = () => {
    if (!ableToPrev || chunksMode.isOff) return;

    setActiveChunkIdx((prevChunkIdx) => prevChunkIdx - 1);
    asideNavigation.off();
  };

  const goToNextChunk = () => {
    if (!ableToNext || chunksMode.isOff) return;

    setActiveChunkIdx((prevChunkIdx) => prevChunkIdx + 1);
    asideNavigation.off();
  };

  const copyMarkdown = () => {
    copy(chunksMode.isOn ? activeChunk : markdown);
  };

  const goToHeading = (heading: ExtractedHeading, index: number) => {
    asideNavigation.off();

    if (chunksMode.isOn) {
      setActiveChunkIdx(index);
      return;
    }

    const markdownContainer = document.getElementById(markdownId);

    if (!markdownContainer) return;

    const domHeadings = markdownContainer.querySelectorAll(`h${heading.level}`);
    const foundHeading = Array.from(domHeadings).find(
      (el) => el.textContent === heading.text,
    );
    foundHeading?.scrollIntoView({ block: `center` });
  };

  useKeyPress([`a`, `A`, `ArrowLeft`], goToPreviousChunk);
  useKeyPress([`d`, `D`, `ArrowRight`], goToNextChunk);

  const [copyState, copy] = useCopy();
  const historyModal = useSimpleFeature();
  const moreMenuModal = useSimpleFeature();
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [articleWidth, setArticleWidth] = React.useState<
    "narrow" | "medium" | "wide" | "full"
  >("full");
  const [isLargeScreen, setIsLargeScreen] = React.useState(false);

  // Check if screen is large enough for width controls
  // Using 768px (md breakpoint) as minimum - narrow option (max-w-2xl = 672px) needs space
  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  React.useLayoutEffect(() => {
    const timeout = setTimeout(() => {
      const body = document.getElementById(bodyId);

      if (!body) return;

      body.scrollTo({ top: 0 });
    });

    return () => {
      clearTimeout(timeout);
    };
  }, [activeChunkIdx, chunksMode.isOn]);

  React.useLayoutEffect(() => {
    if (chunksMode.isOn) return;

    const markdownContainer = document.getElementById(markdownId);

    if (!markdownContainer) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const text = entry.target.textContent;

          if (!entry.isIntersecting || !text) return;

          setActiveHeading(text);
        });
      },
      {
        rootMargin: `-45% 0px -45% 0px`,
      },
    );

    const headingTypesCount = 6;

    const headingsSelector = Array.from(
      { length: headingTypesCount },
      (_, i) => `h${i + 1}`,
    ).join(`, `);

    const domHeadings = markdownContainer.querySelectorAll(headingsSelector);

    domHeadings.forEach((heading) => observer.observe(heading));

    return () => {
      domHeadings.forEach((heading) => observer.unobserve(heading));
      observer.disconnect();
    };
  }, [markdownId, chunksMode.isOn]);

  return (
    <Modal2
      className={c(
        isFullscreen
          ? "!p-0 [&>*]:!max-w-full [&>*]:!w-full [&>*]:!h-screen [&>*]:!max-h-full [&>*]:!rounded-none"
          : "[&>*]:max-w-3xl [&>*]:h-full",
      )}
      onClose={onClose}
    >
      <Modal2.Header
        title={
          chunksMode.isOn
            ? `By Chapters (${activeChunkIdx + 1}/${chunks.length})`
            : (activeHeading ?? "Full Content")
        }
        closeButtonTitle="Close preview mode (Esc)"
      >
        {headerControls}
        <div className="relative">
          <Button title="More options" i={2} s={1} onClick={moreMenuModal.on}>
            <BiDotsHorizontal />
          </Button>
          {moreMenuModal.isOn && (
            <Popover
              className="!absolute flex flex-col gap-3 translate-y-2.5 right-0 w-fit min-w-[200px]"
              onBackdropClick={moreMenuModal.off}
            >
              <div className="flex gap-2">
                <Button
                  title="Copy markdown"
                  s={1}
                  i={2}
                  onClick={copyMarkdown}
                >
                  {copyState.is === `copied` ? (
                    <BiCheck className="text-green-700" />
                  ) : (
                    <BiCopyAlt />
                  )}
                </Button>
                {resourceId && resourceType && (
                  <Button
                    title="View change history"
                    s={1}
                    i={2}
                    onClick={() => historyModal.on()}
                  >
                    <BiHistory />
                  </Button>
                )}
                <Tabs fit className="!h-8">
                  <Tabs.Item
                    active={!chunksMode.isOn}
                    title="Show full content"
                    onClick={chunksMode.isOff ? undefined : toggleMode}
                    className="!h-8 !w-8 !p-0 !min-w-0 !flex !items-center !justify-center !flex-none"
                  >
                    <BiDetail className="text-xl" />
                  </Tabs.Item>
                  <Tabs.Item
                    active={chunksMode.isOn}
                    title="Show content as chapters"
                    onClick={chunksMode.isOn ? undefined : toggleMode}
                    className="!h-8 !w-8 !p-0 !min-w-0 !flex !items-center !justify-center !flex-none"
                  >
                    <BiListOl className="text-xl" />
                  </Tabs.Item>
                </Tabs>
                <Button
                  title={
                    isFullscreen ? "Exit fullscreen" : "Read in fullscreen"
                  }
                  s={1}
                  i={2}
                  onClick={() => {
                    setIsFullscreen(!isFullscreen);
                    if (isFullscreen) {
                      setArticleWidth("full");
                    }
                  }}
                >
                  {isFullscreen ? <BiCollapse /> : <BiExpand />}
                </Button>
              </div>
              {isFullscreen && isLargeScreen && (
                <div className="flex items-center justify-between gap-4 border-t border-zinc-300 dark:border-zinc-800 pt-3">
                  <label
                    htmlFor="article-width-controls"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap leading-none"
                  >
                    Article Width
                  </label>
                  <div
                    id="article-width-controls"
                    className="flex items-center gap-2"
                  >
                    {(["narrow", "medium", "wide", "full"] as const).map(
                      (width) => (
                        <button
                          key={width}
                          type="button"
                          aria-pressed={articleWidth === width}
                          aria-label={`Set article width to ${width}`}
                          title={`Set article width to ${width}`}
                          onClick={() => setArticleWidth(width)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setArticleWidth(width);
                            }
                          }}
                          className={c(
                            "relative w-5 h-5 rounded-full transition-colors duration-150",
                            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1",
                            "focus-visible:outline-black focus-visible:dark:outline-white",
                            "touch-action-manipulation",
                            "flex items-center justify-center",
                            articleWidth === width
                              ? "bg-green-700 dark:bg-green-400"
                              : "bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600",
                          )}
                        >
                          <span
                            className={c(
                              "w-1.5 h-1.5 rounded-full",
                              articleWidth === width
                                ? "bg-white dark:bg-zinc-900"
                                : "bg-gray-500 dark:bg-gray-400",
                            )}
                            aria-hidden="true"
                          />
                        </button>
                      ),
                    )}
                  </div>
                </div>
              )}
            </Popover>
          )}
        </div>
      </Modal2.Header>
      <Modal2.Body
        id={bodyId}
        className={c("p-0", asideNavigation.isOn && "overflow-hidden")}
      >
        <div
          className={c(
            "w-full",
            isFullscreen && "flex justify-center",
            isFullscreen && articleWidth !== "full" && "px-4",
          )}
        >
          <Markdown
            id={markdownId}
            className={c(
              "p-4",
              isFullscreen
                ? articleWidth === "narrow"
                  ? "!max-w-2xl"
                  : articleWidth === "medium"
                    ? "!max-w-3xl"
                    : articleWidth === "wide"
                      ? "!max-w-5xl"
                      : "!max-w-full"
                : "!max-w-full",
            )}
          >
            {chunksMode.isOn ? activeChunk : markdown}
          </Markdown>
        </div>
        {asideNavigation.isOn && (
          <>
            <aside className="sticky h-full left-0 right-0 bottom-0 w-full flex flex-col animate-slide-in-bottom">
              <header className="flex justify-between gap-8 px-4 py-3 border-b border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
                <h6 className="text-lg">Table of Contents</h6>
                <Button
                  title="Collapse table of contents"
                  i={2}
                  s={1}
                  onClick={asideNavigation.toggle}
                >
                  <BiChevronDown />
                </Button>
              </header>
              <ul className="flex-1 overflow-y-auto bg-white dark:bg-black">
                {finalHeadings.map((heading, index) => {
                  const isActive = chunksMode.isOn
                    ? activeChunkIdx === index
                    : activeHeading === heading.text;

                  return (
                    <li key={index}>
                      <button
                        onClick={() => goToHeading(heading, index)}
                        className={c(
                          `w-full text-left px-2 py-4 transition-colors`,
                          isActive
                            ? `text-green-700 dark:text-green-400 font-semibold`
                            : `text-gray-900 dark:text-gray-300 hover:bg-gray-100 hover:dark:bg-gray-900/40`,
                        )}
                        style={{
                          paddingLeft: `${(heading.level - 1) * 12 + 16}px`,
                        }}
                      >
                        ({index + 1}) {heading.text}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </aside>
          </>
        )}
      </Modal2.Body>
      <Modal2.Footer className="justify-between">
        <div className="flex items-center gap-2">{footerLeftControls}</div>
        <div className="flex items-center gap-2">
          {chunksMode.isOn ? (
            <>
              {finalHeadings.length > 1 && (
                <Button
                  title={
                    asideNavigation.isOn
                      ? "Hide table of contents"
                      : "Show table of contents"
                  }
                  i={2}
                  s={1}
                  onClick={asideNavigation.toggle}
                >
                  {asideNavigation.isOn ? <BiChevronDown /> : <BiBookContent />}
                </Button>
              )}
              <Button
                i={2}
                s={1}
                title="Scroll to top preview top"
                disabled={asideNavigation.isOn}
                onClick={scrollToTop}
              >
                <BiArrowToTop />
              </Button>
              <Button
                i={2}
                s={1}
                disabled={!ableToPrev}
                title="Go to previous chapter (ArrowLeft or A)"
                onClick={goToPreviousChunk}
              >
                <BiArrowToLeft />
              </Button>
              <Button
                disabled={!ableToNext}
                i={2}
                s={1}
                title="Go to next chapter (ArrowRight or D)"
                onClick={goToNextChunk}
              >
                <BiArrowToRight />
              </Button>
            </>
          ) : (
            <>
              <Button
                i={2}
                s={1}
                title="Scroll to top preview top"
                disabled={asideNavigation.isOn}
                onClick={scrollToTop}
              >
                <BiArrowToTop />
              </Button>
              {finalHeadings.length > 1 && (
                <Button
                  title={
                    asideNavigation.isOn
                      ? "Hide table of contents"
                      : "Show table of contents"
                  }
                  i={2}
                  s={1}
                  onClick={asideNavigation.toggle}
                >
                  {asideNavigation.isOn ? <BiChevronDown /> : <BiBookContent />}
                </Button>
              )}
            </>
          )}
        </div>
      </Modal2.Footer>
      {historyModal.isOn && resourceId && resourceType && (
        <React.Suspense>
          <ResourceActivityContainer
            resourceId={resourceId}
            resourceType={resourceType}
            onClose={historyModal.off}
          />
        </React.Suspense>
      )}
    </Modal2>
  );
};

export { MarkdownWidget };
