import React from 'react';
import {
  BiLogoFacebook,
  BiLogoLinkedin,
  BiLogoReddit,
  BiLogoTwitter,
  BiShare,
  BiText,
} from 'react-icons/bi';
import { Button } from 'design-system/button';
import { useCopy } from 'development-kit/use-copy';
import Popover from 'design-system/popover';
import { Status } from 'design-system/status';
import { useSimpleFeature } from '@greenonsoftware/react-kit';

const getLinkedInUrl = (): string =>
  `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;

const getTwitterUrl = (): string =>
  `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=Check%20this%20out!`;

const getFacebookUrl = (): string =>
  `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;

const getRedditUrl = (): string =>
  `https://www.reddit.com/submit?url=${encodeURIComponent(window.location.href)}&title=Check%20this%20out!`;

const SocialShare = () => {
  const panel = useSimpleFeature();
  const [copyState, copy] = useCopy();
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const removeTimeoutRef = (): void => {
    timeoutRef.current && clearTimeout(timeoutRef.current);
  };

  const share = (url: () => string): void => {
    removeTimeoutRef();

    copy(
      `I’ve found a great article! Here’s the link: ${window.location.href}`,
    );

    timeoutRef.current = setTimeout(() => {
      window.open(url(), `_blank`);
      panel.off();
    }, 1000);
  };

  const copyTemplate = (): void => {
    copy(
      `I’ve found a great article! Here’s the link: ${window.location.href}`,
    );
    panel.off();
  };

  React.useEffect(() => {
    return () => {
      removeTimeoutRef();
    };
  }, []);

  return (
    <div className="relative">
      <Button
        title="Share this document on social media platforms"
        i={2}
        s={2}
        onClick={panel.on}
      >
        <BiShare />
      </Button>
      {panel.isOn && (
        <Popover
          className="absolute! flex gap-2 translate-y-2.5 -right-12 sm:right-auto"
          onBackdropClick={panel.off}
        >
          <Button
            s={1}
            i={2}
            onClick={copyTemplate}
            title="Simply copy the invitation template"
          >
            <BiText />
          </Button>
          <Button
            s={1}
            i={2}
            onClick={() => share(getLinkedInUrl)}
            title="Share on LinkedIn"
          >
            <BiLogoLinkedin />
          </Button>
          <Button
            s={1}
            i={2}
            onClick={() => share(getFacebookUrl)}
            title="Share on Facebook"
          >
            <BiLogoFacebook />
          </Button>
          <Button
            s={1}
            i={2}
            onClick={() => share(getTwitterUrl)}
            title="Share on Twitter"
          >
            <BiLogoTwitter />
          </Button>
          <Button
            s={1}
            i={2}
            onClick={() => share(getRedditUrl)}
            title="Share on Reddit"
          >
            <BiLogoReddit />
          </Button>
        </Popover>
      )}
      {copyState.is === `copied` && (
        <Status>Invitation template has been copied</Status>
      )}
    </div>
  );
};

export { SocialShare };
