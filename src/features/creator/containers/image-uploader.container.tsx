import React from 'react';
import { useAuthStore } from 'store/auth/auth.store';
import { UploadImageButton } from '../components/upload-image-button';
import { logIn } from 'actions/log-in.action';

const ImageUploaderAuthContainer = React.lazy(() =>
  import(`./image-uploader-auth.container`).then((m) => ({
    default: m.ImageUploaderAuthContainer,
  })),
);

const ImageUploaderContainer = () => {
  const authStore = useAuthStore();

  if (authStore.is === `authorized`)
    return (
      <React.Suspense>
        <ImageUploaderAuthContainer />
      </React.Suspense>
    );

  return (
    <UploadImageButton disabled={authStore.is === `idle`} onClick={logIn} />
  );
};

export { ImageUploaderContainer };
