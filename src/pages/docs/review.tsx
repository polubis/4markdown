import React, { useState, useEffect } from 'react';
import ArticleList from 'components/article-list';
import Pagination from 'components/pagination';
import ArticleForm from 'components/article-form';

import Loader from 'components/loader';
import ErrorModal from 'components/error-modal';
import { authStoreSelectors, useAuthStore } from 'store/auth/auth.store';
import { GetDocsToReviewPayload } from 'models/doc';
import { useReviewStore, reviewStoreActions } from 'store/review/review.store';

const initPayload = (): GetDocsToReviewPayload => ({
  query: ``,
  status: `public`,
  limit: 10,
  page: 1,
});

const DocsReviewPage = () => {
  const [payload, setPayload] = useState(initPayload);
  const { query, status, limit, page } = payload;
  const reviewStore = useReviewStore();

  useEffect(() => {
    authStoreSelectors.authorized().getDocsToReview(payload);
  }, [payload]);

  useEffect(() => {
    setPayload((payload) => ({ ...payload, page: 1 }));
  }, [query, status, limit]);

  function reset() {
    setPayload(initPayload());
    reviewStoreActions.idle();
  }

  const changeFilters = (
    newPayload: Partial<GetDocsToReviewPayload> = {},
  ): void => {
    setPayload((payload) => ({ ...payload, page: 1, ...newPayload }));
  };

  return (
    <div className="grid items-start min-h-screen bg-gray-100">
      <main className="mt-16 mx-8">
        <ArticleForm
          query={query}
          onQueryChange={changeFilters}
          status={status}
          limit={+limit}
        />
        {(reviewStore.is === `idle` || reviewStore.is === `busy`) && <Loader />}
        {reviewStore.is === `ok` && (
          <>
            <ArticleList articlesData={reviewStore.data} />
            <Pagination
              page={page}
              onPageChange={changeFilters}
              limit={+limit}
              responseCount={reviewStore.data.length}
            />
          </>
        )}
        {reviewStore.is === `fail` && (
          <ErrorModal
            heading={reviewStore.error}
            message="Try to search for the articles once again"
            onClose={reset}
          />
        )}
      </main>
    </div>
  );
};

const ProtectedDocsReviewPage = () => {
  const authStore = useAuthStore();

  return authStore.is === `authorized` ? <DocsReviewPage /> : null;
};

export default ProtectedDocsReviewPage;
