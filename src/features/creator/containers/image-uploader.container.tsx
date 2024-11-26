import React from 'react';
import { useAuthState } from 'store/auth';

const ImageUploaderAuthContainer = React.lazy(
  () => import(`./image-uploader-auth.container`),
);

const ImageUploaderContainer = () => {
  const authStore = useAuthState();

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
