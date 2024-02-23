import React from 'react';
import { useAuthStore } from 'store/auth/auth.store';

const ImageUploaderAuthContainer = React.lazy(
  () => import(`./image-uploader-auth.container`),
);

const ImageUploaderContainer = () => {
  const authStore = useAuthStore();

  if (authStore.is === `authorized`) {
    return (
      <React.Suspense>
        <ImageUploaderAuthContainer />
      </React.Suspense>
    );
  }

  return null;
};

export { ImageUploaderContainer };
