import { Button } from "design-system/button";
import { usePortal } from "development-kit/use-portal";
import React from "react";
import { BiArrowToTop } from "react-icons/bi";

const ScrollToTop = () => {
  const { render } = usePortal();
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    let prevY = window.scrollY;

    const handleScroll = (): void => {
      const y = window.scrollY;

      setVisible(prevY > y && y > 100);

      prevY = y;
    };

    window.addEventListener(`scroll`, handleScroll);

    return () => {
      window.removeEventListener(`scroll`, handleScroll);
    };
  }, []);

  if (!visible) return null;

  return render(
    <aside className="fixed flex flex-col space-y-2 left-0 bottom-0 p-4">
      <Button
        i={2}
        s={2}
        title="Scroll to top"
        onClick={() => window.scrollTo({ top: 0, behavior: `smooth` })}
      >
        <BiArrowToTop />
      </Button>
    </aside>,
  );
};

export { ScrollToTop };
