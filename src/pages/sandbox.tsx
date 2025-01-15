import React from 'react';
import type { HeadFC } from 'gatsby';
import LogoThumbnail from 'images/logo-thumbnail.png';
import Meta from 'components/meta';
import { meta } from '../../meta';
import { usePortal } from 'development-kit/use-portal';
import { useDocumentCreatorState } from 'store/document-creator';
import { Markdown } from 'components/markdown';
import { useCreatorLocalStorageSync } from 'core/use-creator-local-storage-sync';
import c from 'classnames';
import { isMd } from 'design-system/viewports';
import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';

const headerSectionClasses = `px-4 border-t md:border-b md:border-t-0 border-zinc-300 dark:border-zinc-800 flex items-center`;

const useMobileSection = () => {
  const [opened, setOpened] = React.useState(true);

  React.useEffect(() => {
    let isMdViewport = isMd();

    const getScrollY = (): number =>
      window.scrollY || document.documentElement.scrollTop;

    let prevY = getScrollY();

    const manageMobileSection = throttle((): void => {
      if (isMdViewport) return;

      const y = getScrollY();

      const totalHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

      const progress = Number.parseFloat(((y / totalHeight) * 100).toFixed(2));

      const isGoingTop = prevY > y;
      const isNearBottom = progress > 90;

      setOpened(isGoingTop || isNearBottom);

      prevY = y;
    }, 150);

    const determineViewport = debounce((): void => {
      isMdViewport = isMd();
      setOpened(true);
    }, 500);

    window.addEventListener(`scroll`, manageMobileSection);
    window.addEventListener(`resize`, determineViewport);

    return () => {
      window.removeEventListener(`scroll`, manageMobileSection);
      window.addEventListener(`resize`, determineViewport);
      manageMobileSection.cancel();
      determineViewport.cancel();
    };
  }, []);

  return [opened, setOpened] as const;
};

const SandboxPage = () => {
  useCreatorLocalStorageSync();
  const { render } = usePortal();
  const { code } = useDocumentCreatorState();

  const [mobileSectionVisible] = useMobileSection();

  return (
    <>
      {render(
        <div
          className={c(
            `flex bg-white fixed bottom-[122px] md:top-[122px] md:bottom-0 left-0 right-0 md:right-[50%] h-[260px] md:h-full border-t border-zinc-300 dark:border-zinc-800 md:border-t-0 transition-all`,
            { 'translate-y-0': mobileSectionVisible },
            { 'translate-y-full': !mobileSectionVisible },
          )}
        >
          <header className="w-[50px] h-full flex justify-center border-zinc-300 dark:border-zinc-800 border-r py-4">
            xd
          </header>
          <textarea
            className="resize-none w-full h-full bg-transparent focus:outline-none p-4 md:text-base text-sm"
            value={code}
          ></textarea>
        </div>,
      )}
      {render(
        <header
          className={c(
            `flex flex-col-reverse md:flex-col fixed bg-zinc-100 dark:bg-gray-950 bottom-0 md:top-0 md:bottom-[unset] left-0 right-0 transition-all`,
          )}
        >
          <div className={c(`h-[72px]`, headerSectionClasses)}>top</div>
          <div className={c(`h-[50px]`, headerSectionClasses)}>bottom</div>
        </header>,
      )}
      <main className="md:mt-[122px] mb-[388px] md:mb-0">
        <Markdown className="mr-auto ml-auto md:!max-w-[50%] md:mr-0 p-4">
          {code}
        </Markdown>
      </main>
    </>
  );
};

export default SandboxPage;

export const Head: HeadFC = () => {
  return (
    <Meta
      appName={meta.appName}
      title="Sandbox page"
      description="Test here any component or feature to verify MVP or POC"
      url={meta.siteUrl + meta.routes.sandbox}
      lang={meta.lang}
      image={meta.siteUrl + LogoThumbnail}
      robots="noindex, nofollow"
    />
  );
};
