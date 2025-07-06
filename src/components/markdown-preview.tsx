import { useSimpleFeature } from "@greenonsoftware/react-kit";
import { Markdown } from "components/markdown";
import { Button } from "design-system/button";
import { Modal2 } from "design-system/modal2";
import { falsy } from "development-kit/guards";
import { useCopy } from "development-kit/use-copy";
import { useKeyPress } from "development-kit/use-key-press";
import React, { ReactNode } from "react";
import {
	BiArrowToLeft,
	BiArrowToRight,
	BiArrowToTop,
	BiCheck,
	BiCopyAlt,
	BiDetail,
	BiListOl,
} from "react-icons/bi";

type MarkdownPreviewProps = {
	chunksActive?: boolean;
	header?: ReactNode;
	markdown: string;
	onClose(): void;
};

const MarkdownPreview = ({
	chunksActive = true,
	header,
	markdown,
	onClose,
}: MarkdownPreviewProps) => {
	const bodyId = React.useId();
	const chunksMode = useSimpleFeature(chunksActive);
	const [activeChunkIdx, setActiveChunkIdx] = React.useState(0);

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
	const ableToNext = activeChunkIdx <= chunks.length - 2;
	const activeChunk = chunks[activeChunkIdx];

	const scrollToTop = () => {
		const body = document.getElementById(bodyId);

		falsy(body, `Cannot find ${bodyId}`);

		body.scrollTo({ top: 0, behavior: `smooth` });
	};

	const goToPreviousChunk = () => {
		if (!ableToPrev || chunksMode.isOff) return;

		setActiveChunkIdx((prevChunkIdx) => prevChunkIdx - 1);
	};

	const goToNextChunk = () => {
		if (!ableToNext || chunksMode.isOff) return;

		setActiveChunkIdx((prevChunkIdx) => prevChunkIdx + 1);
	};

	const copyMarkdown = () => {
		copy(chunksMode.isOn ? activeChunk : markdown);
	};

	useKeyPress([`a`, `A`, `ArrowLeft`], goToPreviousChunk);
	useKeyPress([`d`, `D`, `ArrowRight`], goToNextChunk);
	useKeyPress([`t`, `T`, `ArrowUp`], scrollToTop);

	const [copyState, copy] = useCopy();

	return (
		<Modal2 className="[&>*]:max-w-3xl [&>*]:h-full" onClose={onClose}>
			<Modal2.Header
				title={
					chunksMode.isOn
						? `Chapter (${activeChunkIdx + 1}/${chunks.length})`
						: `Full Content`
				}
				closeButtonTitle="Close preview mode (Esc)"
			>
				<Button
					title={
						chunksMode.isOn ? "Show full content" : "Show content as chapters"
					}
					i={2}
					s={1}
					onClick={chunksMode.toggle}
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
				{header}
			</Modal2.Header>
			<Modal2.Body id={bodyId}>
				<Markdown className="!max-w-full">
					{chunksMode.isOn ? activeChunk : markdown}
				</Markdown>
			</Modal2.Body>
			<Modal2.Footer className="justify-between">
				<Button
					i={2}
					s={1}
					title="Scroll to top preview top (T or ArrowUp)"
					onClick={scrollToTop}
				>
					<BiArrowToTop />
				</Button>
				{chunksMode.isOn && (
					<div className="flex items-center gap-2">
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
					</div>
				)}
			</Modal2.Footer>
		</Modal2>
	);
};

export { MarkdownPreview };
