import React from 'react';
import { useAuthStore } from 'store/auth/auth.store';
import { UploadImageButton } from '../components/upload-image-button';

const ImageUploaderAuthContainer = React.lazy(
  () => import(`./image-uploader-auth.container`),
);

const ImageUploaderContainer = () => {
  const authStore = useAuthStore();

  if (authStore.is === `idle`) {
    return <UploadImageButton disabled />;
  }

  if (authStore.is === `authorized`) {
    return (
      <React.Suspense fallback={<UploadImageButton disabled />}>
        <ImageUploaderAuthContainer />
      </React.Suspense>
    );
  }

  return null;
};

export { ImageUploaderContainer };
