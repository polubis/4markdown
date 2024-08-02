import React from 'react';
import { Hint } from 'design-system/hint';
import { BiInfoCircle, BiX } from 'react-icons/bi';
import Markdown from 'components/markdown';
import { Button } from 'design-system/button';
import type { ToggleReturn } from 'development-kit/use-toggle';

const md = `**Description**

Google often utilizes the content of the \`<meta>\` tag to create snippets, especially when they believe it provides a more accurate description than the page content itself.

Similarly, Facebook uses \`<meta>\` tag content for link previews when the 'og:description' tag is absent.

However, if Google opts to use the page's meta description as a snippet, it may truncate descriptions that are too long.

To avoid truncation and ensure clarity, it is recommended to keep your page descriptions between 110 and 160 characters. While Google occasionally displays longer snippets, adhering to this range is generally best.

**Google's Recommendations for Effective Descriptions**

- Be specific and concise.
- Provide an accurate summary of the page content.
- Use keywords thoughtfully without overstuffing.
- Craft unique descriptions for each page.

Based on [Ahrefs](https://ahrefs.com/) audits and articles.
`;

const Content = ({ close }: ToggleReturn) => (
  <>
    <header className="flex items-center mb-4">
      <h6 className="text-xl mr-4">Details</h6>
      <Button
        i={2}
        s={1}
        className="ml-auto"
        title="Close document permanent status change"
        onClick={close}
      >
        <BiX />
      </Button>
    </header>
    <Markdown>{md}</Markdown>
  </>
);

const SeoFriendlyDescriptionHint = () => {
  return (
    <Hint
      className="flex justify-between"
      content={Content}
      trigger={({ open }) => (
        <>
          The best description is between 110-160 characters
          <button
            type="button"
            onClick={open}
            title="Open SEO description explanation"
          >
            <BiInfoCircle size={20} className="ml-3 shrink-0" />
          </button>
        </>
      )}
    />
  );
};

export { SeoFriendlyDescriptionHint };
