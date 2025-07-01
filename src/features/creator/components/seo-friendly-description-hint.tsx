import { Markdown } from "components/markdown";
import { Hint } from "design-system/hint";
import { Modal } from "design-system/modal";
import React from "react";
import { BiInfoCircle } from "react-icons/bi";

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

const Content = () => (
	<>
		<Modal.Header
			title="Details"
			closeButtonTitle="Close document permanent status change"
		/>
		<Markdown>{md}</Markdown>
	</>
);

const SeoFriendlyDescriptionHint = () => {
	return (
		<Hint
			className="flex justify-between"
			content={Content}
			trigger={({ on }) => (
				<>
					110-160 characters
					<button
						type="button"
						onClick={on}
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
