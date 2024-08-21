import React, { lazy, Suspense } from 'react';
import { useAuthStore } from 'store/auth/auth.store';

const ImageUploaderAuthContainer = lazy(
  () => import(`./image-uploader-auth.container`),
);

const ImageUploaderContainer = () => {
  const authStore = useAuthStore();

  if (authStore.is === `authorized`) {
    return (
      <Suspense>
        <ImageUploaderAuthContainer />
      </Suspense>
    );
  }

  return null;
};

export { ImageUploaderContainer };
