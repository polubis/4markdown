import React from "react";
import { useUserProfileContext } from "../providers/user-profile.provider";
import { Avatar } from "design-system/avatar";
import { UserSocials } from "components/user-socials";
import { formatDistance } from "date-fns";
import { Button } from "design-system/button";
import { BiPlus, BiPlusCircle } from "react-icons/bi";

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

	const hasSocials =
		profile.githubUrl ||
		profile.fbUrl ||
		profile.linkedInUrl ||
		profile.twitterUrl ||
		profile.blogUrl;

	return (
		<>
			<section className="max-w-3xl mx-auto w-full">
				<h1 className="text-4xl font-bold mb-6">User Profile</h1>
				<div className="p-4 rounded-lg border border-zinc-300 dark:border-zinc-800">
					<Avatar
						size="lg"
						alt="Your avatar"
						className="bg-gray-300 dark:bg-slate-800 mx-auto"
						char={
							profile.displayName ? profile.displayName.charAt(0) : undefined
						}
						src={profile.avatar?.lg.src}
					/>
					<h2 className="text-2xl font-bold text-center my-3">
						{profile.displayName ?? "Anonymous"}
					</h2>
					<p className="text-center">{profile.bio ?? "No bio yet"}</p>
					{hasSocials && (
						<div className="mt-4 flex justify-center gap-2">
							<UserSocials
								githubUrl={profile.githubUrl}
								fbUrl={profile.fbUrl}
								linkedInUrl={profile.linkedInUrl}
								twitterUrl={profile.twitterUrl}
								blogUrl={profile.blogUrl}
								createTitle={(title) => `Your ${title}`}
							/>
						</div>
					)}
				</div>
			</section>
			{comments.length > 0 && (
				<section className="mt-10 max-w-7xl w-full">
					<h2 className="text-2xl font-bold mb-5">
						What People Say ({comments.length})
					</h2>
					<ul className="columns-1 md:columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
						{[...comments].map((comment) => (
							<li
								key={comment.id}
								className="break-inside-avoid mb-4 p-4 flex flex-col rounded-lg border border-zinc-300 dark:border-zinc-800"
							>
								<div className="flex items-center gap-4">
									<Avatar
										size="md"
										src={comment.ownerProfile.avatar?.md?.src}
										alt={comment.ownerProfile.displayName ?? `Comment author`}
										char={comment.ownerProfile.displayName?.charAt(0)}
										className="shrink-0 bg-gray-300 dark:bg-slate-800"
									/>
									<div className="flex flex-col">
										<h3 className="text-lg font-bold">
											{comment.ownerProfile.displayName ?? `Anonymous`}
										</h3>
										<p className="text-sm">
											{formatDistance(new Date(), comment.mdate, {
												addSuffix: true,
											})}
										</p>
									</div>
								</div>
								<p className="italic mt-4">{comment.content}</p>
							</li>
						))}
					</ul>
					<Button
						i={2}
						s={2}
						auto
						title="Add a comment"
						className="mt-2 ml-auto"
					>
						Add Comment
						<BiPlusCircle size={24} />
					</Button>
				</section>
			)}
		</>
	);
};

export { UserProfileStatsContainer };
