import React from "react";
import { Loader } from "design-system/loader";
import { useUserProfileContext } from "../providers/user-profile.provider";
import { ErrorScreen } from "../components/error-screen";

const UserProfileContentContainer = () => {
	const [state] = useUserProfileContext();

	return (
		<main className="min-h-[calc(100svh-72px)] px-4 py-10 flex flex-col justify-center items-center">
			{(state.is === `idle` || state.is === `busy`) && (
				<Loader data-testid="[user-profile]:loader" size="xl" />
			)}
			{state.is === `ok` && <div>hi</div>}
			{state.is === `fail` && (
				<ErrorScreen
					title={
						state.error.symbol === "unknown"
							? "Cannot find user with specified id. Try again later or refresh the page"
							: state.error.message
					}
				/>
			)}
		</main>
	);
};

export { UserProfileContentContainer };
