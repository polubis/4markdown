import React from "react";
import { useUserProfileContext } from "../providers/user-profile.provider";
import { Avatar } from "design-system/avatar";
import { UserSocials } from "components/user-socials";

// Todo
// 1. Align UI
// 2. Author profiles may be null so protect that
// 3. Add comment zone area
// 4. Comment may be added only be user who has profile
// 5. If not prpfile aunonymous badge is displayed
// 6. Rating may be done by anyone
// 7. User should be able to also add a rate from 1-10

const UserProfileStatsContainer = () => {
	const [state] = useUserProfileContext();

	if (state.is !== `ok`)
		throw Error(
			`User profile is not loaded yet but you are trying to render the stats`,
		);

	const {
		data: { profile, comments },
	} = state;

	return (
		<div className="max-w-3xl w-full">
			<h1 className="text-4xl font-bold mb-6">User Profile</h1>
			<section className="p-4 rounded-lg border border-zinc-300 dark:border-zinc-800">
				<Avatar
					size="lg"
					alt="Your avatar"
					className="bg-gray-300 dark:bg-slate-800 mx-auto"
					char={profile.displayName ? profile.displayName.charAt(0) : undefined}
					src={profile.avatar?.lg.src}
				/>
				<h2 className="text-2xl font-bold text-center my-3">
					{profile.displayName ?? "Anonymous"}
				</h2>
				<p className="text-center">{profile.bio ?? "No bio yet"}</p>
				<div className="mt-4 flex justify-center gap-3">
					<UserSocials
						githubUrl={profile.githubUrl}
						fbUrl={profile.fbUrl}
						linkedInUrl={profile.linkedInUrl}
						twitterUrl={profile.twitterUrl}
						blogUrl={profile.blogUrl}
						createTitle={(title) => `Your ${title}`}
					/>
				</div>
			</section>
		</div>
	);
};

export { UserProfileStatsContainer };
