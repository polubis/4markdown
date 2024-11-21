import type {
  API4MarkdownContractKey,
  API4MarkdownDto,
} from 'api-4markdown-contracts';

const setCache = <TKey extends API4MarkdownContractKey>(
  key: TKey,
  dto: API4MarkdownDto<TKey>,
): void => {
  try {
    localStorage.setItem(key, JSON.stringify(dto));
  } catch {}
};

const getCache = <TKey extends API4MarkdownContractKey>(
  key: TKey,
): API4MarkdownDto<TKey> | null => {
  try {
    const value = localStorage.getItem(key);

    if (typeof value !== `string`) {
      return null;
    }

    return JSON.parse(value) as API4MarkdownDto<TKey> | null;
  } catch {
    return null;
  }
};

const removeCache = (key: API4MarkdownContractKey): void => {
  localStorage.removeItem(key);
};

export { setCache, getCache, removeCache };
