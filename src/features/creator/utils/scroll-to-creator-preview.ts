import debounce from 'lodash.debounce';

const replaceRegex = /\*|#|`|_/g;

const removeMdFromLine = (value: string): string =>
  value.replace(replaceRegex, ``).trim();

const scrollToCreatorPreview = debounce((input: HTMLTextAreaElement): void => {
  const cursor = input.value
    .substring(0, input.selectionStart)
    .split(`\n`).length;
  const lines = input.value.split(`\n`);
  const content = removeMdFromLine(lines[cursor - 1]);

  const elements = Array.from(
    document.querySelectorAll(`.prose > div > *:is(h1,h2,h3,h4,h5,h6)`),
  );

  for (const element of elements) {
    const textContent = element.textContent
      ? removeMdFromLine(element.textContent)
      : ``;

    if (content === textContent) {
      element.scrollIntoView({ behavior: `smooth` });
      break;
    }
  }
}, 750);

export { scrollToCreatorPreview };
