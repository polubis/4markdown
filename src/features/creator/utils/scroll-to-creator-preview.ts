import debounce from 'lodash-es/debounce';

const scrollToCreatorPreview = debounce(
  (value: string, selectionStart: number): void => {
    const cursor = value.substring(0, selectionStart).split(`\n`).length;
    const lines = value.split(`\n`);
    const content = lines[cursor - 1].trim();

    const elements = Array.from(
      document.querySelectorAll(`.markdown > div > *:is(h1,h2,h3,h4,h5,h6)`),
    );

    for (const element of elements) {
      if (element.textContent && content.includes(element.textContent.trim())) {
        element.scrollIntoView({ behavior: `smooth` });
        break;
      }
    }
  },
  750,
);

export { scrollToCreatorPreview };
