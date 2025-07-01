import { initializeAPI } from "api-4markdown";
import React from "react";
import { authStoreActions } from "store/auth/auth.store";
import { docStoreActions } from "store/doc/doc.store";
import { docManagementStoreActions } from "store/doc-management/doc-management.store";
import { docsStoreActions } from "store/docs/docs.store";
import { useMindmapCreatorState } from "store/mindmap-creator";
import { useYourAccountState } from "store/your-account";
import { useYourUserProfileState } from "store/your-user-profile";

const useAuth = () => {
	const [api] = React.useState(initializeAPI);

	React.useEffect(() => {
		const unsubscribe = api.onAuthChange((user) => {
			if (user) {
				authStoreActions.authorize({
					avatar: user.photoURL,
					name: user.displayName,
					uid: user.uid,
				});

				return;
			}

			docStoreActions.reset();
			docManagementStoreActions.idle();
			docsStoreActions.idle();
			useYourUserProfileState.reset();
			authStoreActions.unauthorize();
			useMindmapCreatorState.reset();
			useYourAccountState.reset();
		});

		return () => {
			unsubscribe();
		};
	}, []);
};

export { useAuth };
