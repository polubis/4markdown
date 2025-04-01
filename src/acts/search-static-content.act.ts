import { parseError } from 'api-4markdown';
import type { AsyncResult } from 'development-kit/utility-types';
import type { SearchDataItem } from 'models/pages-data';

const searchStaticContentAct = async (): AsyncResult<SearchDataItem[]> => {
  try {
    const response = await fetch(`/search-data.json`);
    const data = (await response.json()) as SearchDataItem[];

    return {
      is: `ok`,
      data,
    };
  } catch (error: unknown) {
    return { is: `fail`, error: parseError(error) };
  }
};

export { searchStaticContentAct };
