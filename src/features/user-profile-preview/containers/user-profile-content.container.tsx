import React from "react";
import { Loader } from "design-system/loader";
import { ErrorScreen } from "../components/error-screen";
import { UserProfileStatsContainer } from "./user-profile-stats.container";
import { useUserProfileState } from "../store";

const UserProfileContentContainer = () => {
	const { stats } = useUserProfileState();

	return (
		<main className="min-h-[calc(100svh-72px)] px-4 py-10 flex flex-col justify-center items-center">
			{(stats.is === `idle` || stats.is === `busy`) && (
				<Loader data-testid="[user-profile]:loader" size="xl" />
			)}
			{stats.is === `ok` && <UserProfileStatsContainer />}
			{stats.is === `fail` && (
				<ErrorScreen
					title={
						stats.error.symbol === "unknown"
							? "Cannot find user with specified id. Try again later or refresh the page"
							: stats.error.message
					}
				/>
			)}
		</main>
	);
};

export { UserProfileContentContainer };
