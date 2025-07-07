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
import {
	BiArrowToLeft,
	BiArrowToRight,
	BiArrowToTop,
	BiBookContent,
	BiCheck,
	BiChevronDown,
	BiCopyAlt,
	BiDetail,
	BiListOl,
} from "react-icons/bi";

type MarkdownWidgetProps = {
	chunksActive?: boolean;
	header?: ReactNode;
	markdown: string;
	onClose(): void;
};

const MAX_CHUNK_HEADING_LEVEL = 2;

const MarkdownWidgetModule = ({
	chunksActive = true,
	header,
	markdown,
	onClose,
}: MarkdownWidgetProps) => {
	const bodyId = React.useId();
	const markdownId = React.useId();
	const chunksMode = useSimpleFeature(chunksActive);
	const [activeChunkIdx, setActiveChunkIdx] = React.useState(0);
	const asideNavigation = useSimpleFeature();
	const [activeHeading, setActiveHeading] = React.useState<string | null>(null);

	const headings = React.useMemo(
		() => (asideNavigation.isOn ? extractHeadings(markdown) : []),
		[markdown, asideNavigation.isOn],
	);

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
				rootMargin: `0% 0px 0% 0px`,
				threshold: 0,
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
		<Modal2 className="[&>*]:max-w-3xl [&>*]:h-full" onClose={onClose}>
			<Modal2.Header
				title={
					chunksMode.isOn
						? `By Chapters (${activeChunkIdx + 1}/${chunks.length})`
						: "Full Content"
				}
				closeButtonTitle="Close preview mode (Esc)"
			>
				{header}
				<Button
					title={
						chunksMode.isOn ? "Show full content" : "Show content as chapters"
					}
					i={2}
					s={1}
					onClick={toggleMode}
				>
					{chunksMode.isOn ? <BiDetail /> : <BiListOl />}
				</Button>
				<Button i={2} s={1} title="Copy markdown" onClick={copyMarkdown}>
					{copyState.is === `copied` ? (
						<BiCheck className="text-green-700" />
					) : (
						<BiCopyAlt />
					)}
				</Button>
			</Modal2.Header>
			<Modal2.Body
				id={bodyId}
				className={c("p-0", asideNavigation.isOn && "overflow-hidden")}
			>
				<Markdown id={markdownId} className="!max-w-full p-4">
					{chunksMode.isOn ? activeChunk : markdown}
				</Markdown>
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
								{(chunksMode.isOn
									? headings.filter(
											(heading) => heading.level <= MAX_CHUNK_HEADING_LEVEL,
										)
									: headings
								).map((heading, index) => {
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
												{heading.text}
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
				<Button
					i={2}
					s={1}
					title="Scroll to top preview top"
					disabled={asideNavigation.isOn}
					onClick={scrollToTop}
				>
					<BiArrowToTop />
				</Button>
				<div className="flex items-center gap-2">
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
					{chunksMode.isOn && (
						<>
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
					)}
				</div>
			</Modal2.Footer>
		</Modal2>
	);
};

export { MarkdownWidgetModule };
