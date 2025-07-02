import React from "react";
import { useAuthStore } from "store/auth/auth.store";

const ImageUploaderAuthContainer = React.lazy(() =>
	import(`./image-uploader-auth.container`).then((m) => ({
		default: m.ImageUploaderAuthContainer,
	})),
);

const ImageUploaderContainer = () => {
	const authStore = useAuthStore();

	return authStore.is === `authorized` ? (
		<React.Suspense>
			<ImageUploaderAuthContainer />
		</React.Suspense>
	) : null;
};

export { ImageUploaderContainer };
