const paginate = ({
  pagesCount,
  limit,
  currentPage,
}: {
  pagesCount: number;
  limit: number;
  currentPage: number;
}): number[] => {
  const halfLimit = Math.floor(limit / 2);
  let startPage = Math.max(1, currentPage - halfLimit);
  let endPage = Math.min(pagesCount, currentPage + halfLimit);

  if (endPage - startPage + 1 < limit) {
    if (currentPage - halfLimit <= 1) {
      endPage = Math.min(startPage + limit - 1, pagesCount);
    } else {
      startPage = Math.max(endPage - limit + 1, 1);
    }
  }

  const pages: number[] = [];

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return pages;
};

export { paginate };
