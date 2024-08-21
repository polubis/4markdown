import type { DocumentRatingCategory } from 'api-4markdown-contracts';
import { Button } from 'design-system/button';
import React, { lazy, Suspense } from 'react';
import { useAuthStore } from 'store/auth/auth.store';

const DocumentRatingInteractive = lazy(() =>
  import(`../components/document-rating-interactive`).then((module) => ({
    default: module.DocumentRatingInteractive,
  })),
);

interface DocumentRatingContainerProps {
  onChange(category: DocumentRatingCategory): void;
}

const Placeholer = () => (
  <div className="rounded-md bg-gray-300 dark:bg-gray-800 w-20" />
);

const DocumentRatingContainer = ({
  onChange,
}: DocumentRatingContainerProps) => {
  const authStore = useAuthStore();

  return (
    <section className="tn:justify-end justify-center flex mt-12 h-10">
      {authStore.is === `idle` && <Placeholer />}
      {authStore.is === `authorized` && (
        <Suspense fallback={<Placeholer />}>
          <DocumentRatingInteractive onChange={onChange} />
        </Suspense>
      )}
      {authStore.is === `unauthorized` && (
        <Button i={2} s={2} auto onClick={authStore.logIn}>
          Sign In To Rate
        </Button>
      )}
    </section>
  );
};

export { DocumentRatingContainer };
