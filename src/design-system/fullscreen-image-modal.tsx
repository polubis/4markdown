import React from "react";
import { usePortal } from "development-kit/use-portal";
import { useScrollHide } from "development-kit/use-scroll-hide";
import { useKeyPress } from "development-kit/use-key-press";
import { Button } from "./button";
import { BiX } from "react-icons/bi";
import { c } from "./c";

type FullscreenImageModalProps = {
  src: string;
  alt?: string;
  onClose(): void;
};

const FullscreenImageModal = ({
  src,
  alt,
  onClose,
}: FullscreenImageModalProps) => {
  const { render } = usePortal();
  const ref = React.useRef<HTMLDivElement | null>(null);

  useScrollHide();
  useKeyPress([`Escape`], onClose);

  React.useEffect(() => {
    ref.current?.focus();
  }, []);

  return render(
    <div
      ref={ref}
      tabIndex={-1}
      aria-modal
      role="dialog"
      className={c(
        "fixed inset-0 z-20 bg-black/80 dark:bg-black/80",
        // Facebook-like lightbox: horizontally centered,
        // but align to top so tall images aren't visually cropped
        "flex items-start justify-center",
        "overflow-auto",
      )}
      onClick={onClose}
    >
      <Button
        i={2}
        s={1}
        title="Close full image view"
        className="fixed top-4 right-4 z-30"
        onClick={(event) => {
          event.stopPropagation();
          onClose();
        }}
      >
        <BiX />
      </Button>
      <div
        className="w-full min-h-full flex items-start justify-center"
        onClick={(event) => event.stopPropagation()}
      >
        <img
          src={src}
          alt={alt}
          className="block"
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            height: "auto",
          }}
        />
      </div>
    </div>,
  );
};

export { FullscreenImageModal };
