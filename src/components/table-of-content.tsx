import c from "classnames";
import {
	type ExtractedHeading,
	extractHeadings,
} from "development-kit/extract-headings";
import React from "react";

type TableOfContentProps = {
	markdownContainerId: string;
	markdown: string;
};

const TableOfContent = React.memo(
	({ markdownContainerId, markdown }: TableOfContentProps) => {
		const [activeHeading, setActiveHeading] = React.useState<string | null>(
			null,
		);

		const scrollToHeading = (heading: ExtractedHeading) => {
			const url = new URL(window.location.href);
			url.hash = encodeURIComponent(heading.text);
			window.history.replaceState(null, ``, url.toString());

			const headings = document.querySelectorAll(
				`#${markdownContainerId} h${heading.level}`,
			);
			const foundHeading = Array.from(headings).find(
				(el) => el.textContent === heading.text,
			);
			foundHeading?.scrollIntoView({ block: `center` });
		};

		React.useLayoutEffect(() => {
			const headingTypesCount = 6;
			const headingsSelector = Array.from(
				{ length: headingTypesCount },
				(_, i) => `#${markdownContainerId} h${i + 1}`,
			).join(`, `);

			const scrollToHash = () => {
				const hash = window.location.hash.slice(1);

				if (!hash) return;

				const decodedHash = decodeURIComponent(hash);

				const headings = window.document.querySelectorAll(headingsSelector);
				const foundHeading = Array.from(headings).find(
					(heading) => heading.textContent === decodedHash,
				);
				foundHeading?.scrollIntoView({ block: `center` });
			};

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
					threshold: 0,
				},
			);

			const headings = window.document.querySelectorAll(headingsSelector);

			headings.forEach((heading) => observer.observe(heading));

			scrollToHash();

			window.addEventListener(`hashchange`, scrollToHash);

			return () => {
				window.removeEventListener(`hashchange`, scrollToHash);
				headings.forEach((heading) => observer.unobserve(heading));
				observer.disconnect();
			};
		}, [markdownContainerId]);

		const headings = React.useMemo(() => extractHeadings(markdown), [markdown]);

		return (
			<aside className="static max-w-prose mx-auto lg:mx-0 lg:sticky lg:max-h-[100vh] lg:pr-4 lg:overflow-y-auto lg:max-w-[280px] lg:top-0 lg:right-4 lg:py-4 lg:-mt-6">
				{headings.length === 0 ? (
					<>
						<h2 className="text-lg mb-2">No Headings</h2>
						<p>This document does not contain any headings yet</p>
					</>
				) : (
					<>
						<h2 className="text-lg mb-2">On This Page</h2>
						<ul className="space-y-1.5">
							{headings.map((heading, index) => (
								<li
									key={index}
									className={c(
										activeHeading === heading.text
											? `lg:text-green-700 lg:dark:text-green-400`
											: `text-gray-900 dark:text-gray-300 hover:text-blue-800 hover:dark:text-blue-500`,
									)}
									style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
								>
									<button
										className="underline underline-offset-2 text-left"
										title={`Scroll to ${heading.text}`}
										onClick={() => scrollToHeading(heading)}
									>
										{heading.text}
									</button>
								</li>
							))}
						</ul>
					</>
				)}
			</aside>
		);
	},
);

TableOfContent.displayName = `TableOfContent`;

export { TableOfContent };
