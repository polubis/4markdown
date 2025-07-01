import { isServer } from "development-kit/ssr-csr";

import debounce from "lodash.debounce";
import React from "react";

const removeMdFromLine = (value: string): string =>
	value.replace(/\*|#|`|_/g, ``).trim();

const scrollToPreview = debounce((input: HTMLTextAreaElement): void => {
	const hasScroll = input.scrollHeight > input.clientHeight;

	if (!hasScroll) return;

	const cursor = input.value
		.substring(0, input.selectionStart)
		.split(`\n`).length;
	const lines = input.value.split(`\n`);
	const content = removeMdFromLine(lines[cursor - 1]);

	const isScrollableContent = content.length >= 3;

	if (!isScrollableContent) return;

	const elements = Array.from(
		document.querySelectorAll(`.markdown > *:is(h1,h2,h3,h4,h5,h6,p)`),
	);

	for (const element of elements) {
		if (!element.textContent) continue;

		const textContent = removeMdFromLine(element.textContent);

		if (content === textContent) {
			element.scrollIntoView({ behavior: `smooth`, block: `center` });
			break;
		}
	}
}, 750);

const AUTO_SCROLL_KEY = `auto-scrolling`;

const readBrowserSavedSettings = (): boolean => {
	if (isServer()) return false;
	return Boolean(Number.parseInt(localStorage.getItem(AUTO_SCROLL_KEY) ?? `0`));
};

const useScrollToPreview = () => {
	const [isOn, setIsOn] = React.useState(false);

	React.useEffect(() => {
		setIsOn(readBrowserSavedSettings);
		return () => {
			scrollToPreview.cancel();
		};
	}, []);

	return React.useMemo(
		() => ({
			isOn,
			scroll: (input: HTMLTextAreaElement): void => {
				if (!isOn) return;
				scrollToPreview(input);
			},
			toggle: (): void => {
				const newIsOn = !isOn;

				setIsOn(newIsOn);

				localStorage.setItem(AUTO_SCROLL_KEY, newIsOn ? `1` : `0`);
			},
		}),
		[isOn],
	);
};

export { useScrollToPreview };
