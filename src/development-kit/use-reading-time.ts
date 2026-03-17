import React from "react";

const DEFAULT_WORDS_PER_MINUTE = 200;

const normalizeMarkdown = (markdown: string): string => {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1 ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1 ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_\-~]/g, " ");
};

const countWords = (value: string): number => {
  const words = value
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);

  return words.length;
};

type UseReadingTimeResult = {
  wordsCount: number;
  minutesCount: number;
};

const useReadingTime = (markdown: string): UseReadingTimeResult => {
  return React.useMemo(() => {
    const normalizedMarkdown = normalizeMarkdown(markdown);
    const wordsCount = countWords(normalizedMarkdown);
    const minutesCount =
      wordsCount === 0
        ? 0
        : Math.max(1, Math.ceil(wordsCount / DEFAULT_WORDS_PER_MINUTE));

    return {
      wordsCount,
      minutesCount,
    };
  }, [markdown]);
};

export { useReadingTime };
