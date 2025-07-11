import { Button } from "design-system/button";
import React from "react";
import { BiLogInCircle } from "react-icons/bi";
import { useAuthStore } from "store/auth/auth.store";
import { useDocsStore } from "store/docs/docs.store";
import { YourAvatarContainer } from "../containers/your-avatar.container";
import { logIn } from "actions/log-in.action";
import { useSimpleFeature } from "@greenonsoftware/react-kit";
import { useYourUserProfileState } from "store/your-user-profile";
import { useYourAccountState } from "store/your-account";
import { subscribe } from "core/app-events";

const UserPopoverContent = React.lazy(() => import(`./user-popover-content`));

const TokensBadge = ({ tokens }: { tokens: number }) => {
	return (
		<p className="animate-fade-in text-[10px] bg-gray-300 dark:bg-slate-800 shadow-lg flex items-center justify-center size-5 rounded-full absolute -top-2 -right-2">
			<span>{tokens >= 100 ? `99+` : tokens}</span>
		</p>
	);
};

const UserPopover = () => {
	const menu = useSimpleFeature();
	const authStore = useAuthStore();
	const docsStore = useDocsStore();
	const yourUserProfile = useYourUserProfileState();
	const yourAccount = useYourAccountState();

	const handleClick = () => {
		if (authStore.is === `idle`) return;

		if (authStore.is === `authorized`) {
			menu.on();
			return;
		}

		logIn();
	};

	React.useEffect(() => {
		const subscription = subscribe((event) => {
			if (event.type === "SHOW_USER_PROFILE_FORM") {
				menu.on();
			}
		});

		return () => {
			subscription.unsubscribe();
		};
	}, []);

	return (
		<>
			<Button
				i={1}
				s={2}
				className="relative"
				disabled={
					authStore.is === `idle` ||
					docsStore.is === `busy` ||
					yourUserProfile.is === `busy` ||
					yourAccount.is === `busy`
				}
				title={
					authStore.is === `authorized` ? `User details and options` : `Sign in`
				}
				onClick={handleClick}
			>
				{authStore.is === `authorized` && <YourAvatarContainer size="tn" />}
				{(authStore.is === `idle` || authStore.is === `unauthorized`) && (
					<BiLogInCircle />
				)}
				{yourAccount.is === `ok` && (
					<TokensBadge
						key={yourAccount.balance.tokens}
						tokens={yourAccount.balance.tokens}
					/>
				)}
			</Button>
			{menu.isOn && (
				<React.Suspense>
					<UserPopoverContent onClose={menu.off} />
				</React.Suspense>
			)}
		</>
	);
};

export default UserPopover;
