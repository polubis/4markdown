import React from "react";
import { DiffView, DiffModeEnum } from "@git-diff-view/react";
import { generateDiffFile, type DiffFile } from "@git-diff-view/file";
import "@git-diff-view/react/styles/diff-view.css";
import { Loader } from "design-system/loader";
import { isClient } from "development-kit/ssr-csr";
import { Modal2 } from "design-system/modal2";
import { Button } from "design-system/button";
import { BiExpand } from "react-icons/bi";
import { c } from "design-system/c";

type MarkdownDiffViewerProps = {
  previous: string;
  current: string;
  previousLabel?: string;
  currentLabel?: string;
  className?: string;
  showFullScreenButton?: boolean;
  modalTitle?: string;
};

const getTheme = (): "light" | "dark" => {
  if (!isClient()) return "light";
  return window.__theme === "dark" ? "dark" : "light";
};

const MarkdownDiffViewer = ({
  previous,
  current,
  previousLabel = "Previous",
  currentLabel = "Current",
  className = "",
  showFullScreenButton = true,
  modalTitle = "Markdown Diff Viewer",
}: MarkdownDiffViewerProps) => {
  const [isProcessing, setIsProcessing] = React.useState(true);
  const [theme, setTheme] = React.useState<"light" | "dark">(getTheme());
  const [diffFile, setDiffFile] = React.useState<DiffFile | null>(null);
  const [containerWidth, setContainerWidth] = React.useState<number>(0);
  const [isFullScreenOpen, setIsFullScreenOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const modalContainerRef = React.useRef<HTMLDivElement>(null);
  const [modalContainerWidth, setModalContainerWidth] =
    React.useState<number>(0);

  // Track container width for responsive diff mode
  React.useEffect(() => {
    if (!isClient() || !containerRef.current) return;

    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    // Initial width
    updateWidth();

    // Use ResizeObserver if available, otherwise fall back to window resize
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(updateWidth);
      resizeObserver.observe(containerRef.current);
    } else {
      window.addEventListener("resize", updateWidth);
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener("resize", updateWidth);
      }
    };
  }, []);

  // Track modal container width for responsive diff mode in full-screen
  React.useEffect(() => {
    if (!isClient() || !isFullScreenOpen || !modalContainerRef.current) return;

    const updateWidth = () => {
      if (modalContainerRef.current) {
        setModalContainerWidth(modalContainerRef.current.offsetWidth);
      }
    };

    // Initial width
    updateWidth();

    // Use ResizeObserver if available, otherwise fall back to window resize
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(updateWidth);
      resizeObserver.observe(modalContainerRef.current);
    } else {
      window.addEventListener("resize", updateWidth);
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener("resize", updateWidth);
      }
    };
  }, [isFullScreenOpen]);

  // Listen for theme changes
  React.useEffect(() => {
    if (!isClient()) return;

    const previousHandler = window.__onThemeChange;

    const handleThemeChange = (themeArg: "light" | "dark") => {
      const themeValue =
        themeArg || (window.__theme === "dark" ? "dark" : "light");
      setTheme(themeValue);

      if (previousHandler && typeof previousHandler === "function") {
        previousHandler(themeValue);
      }
    };

    window.__onThemeChange = handleThemeChange;

    return () => {
      if (previousHandler && typeof previousHandler === "function") {
        window.__onThemeChange = previousHandler;
      } else {
        window.__onThemeChange = () => {};
      }
    };
  }, []);

  // Generate diff file using the library's function
  // According to official docs: file.initTheme() -> file.init() -> file.buildSplitDiffLines()
  React.useEffect(() => {
    if (!isClient()) {
      setIsProcessing(false);
      return;
    }

    try {
      setIsProcessing(true);

      const file = generateDiffFile(
        `${previousLabel}.md`,
        previous,
        `${currentLabel}.md`,
        current,
        "markdown",
        "markdown",
      );

      // IMPORTANT: Order matters according to official docs!
      // 1. initTheme() must be called FIRST
      // 2. Then init()
      // 3. Then buildSplitDiffLines()
      file.initTheme(theme);
      file.init();
      file.buildSplitDiffLines();

      setDiffFile(file);
      setIsProcessing(false);
    } catch (error) {
      console.error("Error generating diff file:", error);
      setDiffFile(null);
      setIsProcessing(false);
    }
  }, [previous, current, previousLabel, currentLabel, theme]);

  const hasContent = previous.trim().length > 0 || current.trim().length > 0;
  const useUnifiedView = containerWidth > 0 && containerWidth < 1024;
  const useUnifiedViewInModal =
    modalContainerWidth > 0 && modalContainerWidth < 1024;

  const renderDiffContent = (
    useUnified: boolean,
    isInModal: boolean = false,
  ) => {
    if (!hasContent) {
      return (
        <div
          className="flex items-center justify-center p-4"
          aria-live="polite"
        >
          <p className="text-gray-600 dark:text-gray-400">
            No content to compare
          </p>
        </div>
      );
    }

    if (isProcessing) {
      return (
        <div
          className="flex items-center justify-center p-4"
          aria-live="polite"
        >
          <Loader size="lg" />
        </div>
      );
    }

    if (!diffFile) {
      return (
        <div
          className="flex items-center justify-center p-4"
          aria-live="polite"
        >
          <p className="text-gray-600 dark:text-gray-400">
            Unable to generate diff
          </p>
        </div>
      );
    }

    return (
      <div
        className={c(
          "w-full overflow-auto min-w-0",
          !isInModal &&
            "border border-gray-200 dark:border-zinc-800 rounded-lg",
        )}
        style={{
          overscrollBehavior: "contain",
          minHeight: isInModal ? "100%" : "400px",
          maxHeight: isInModal ? "100%" : "600px",
          height: isInModal ? "100%" : undefined,
        }}
      >
        <DiffView
          diffFile={diffFile as any}
          diffViewMode={useUnified ? DiffModeEnum.Unified : DiffModeEnum.Split}
          diffViewHighlight
          diffViewTheme={theme}
        />
      </div>
    );
  };

  return (
    <>
      <div ref={containerRef} className={c("w-full", className)}>
        {showFullScreenButton && hasContent && diffFile && (
          <div className="mb-2 flex justify-end">
            <Button
              title="Open in full screen"
              s={1}
              i={2}
              auto
              onClick={() => setIsFullScreenOpen(true)}
            >
              <BiExpand /> Full Screen
            </Button>
          </div>
        )}
        {renderDiffContent(useUnifiedView, false)}
      </div>

      {isFullScreenOpen && (
        <Modal2
          className={c(
            // Override Modal2 "bottom-sheet" layout to become true fullscreen.
            "!p-0 !items-stretch sm:!p-0 sm:!items-stretch",
            // Make the modal panel fill the viewport and remove any rounding/shadow.
            "[&>*]:!w-screen [&>*]:!h-screen [&>*]:!max-w-none [&>*]:!max-h-none",
            "[&>*]:!rounded-none [&>*]:!shadow-none",
          )}
          onClose={() => setIsFullScreenOpen(false)}
        >
          <Modal2.Header
            title={modalTitle}
            closeButtonTitle="Close diff viewer"
            className="!border-b-0"
          />
          <Modal2.Body className="h-full overflow-hidden p-0 flex flex-col">
            <div ref={modalContainerRef} className="w-full h-full">
              {renderDiffContent(useUnifiedViewInModal, true)}
            </div>
          </Modal2.Body>
        </Modal2>
      )}
    </>
  );
};

export { MarkdownDiffViewer };
