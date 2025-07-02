import React from "react";
import { Button } from "design-system/button";
import {
	BiLogoFacebook,
	BiLogoGithub,
	BiLogoLinkedin,
	BiLogoTwitter,
	BiWorld,
} from "react-icons/bi";

type SocialLink = string | null;
type SocialLinkTitle =
	| "Github link"
	| "Facebook link"
	| "LinkedIn link"
	| "Twitter link"
	| "Blog link";

interface UserSocialsProps {
	githubUrl?: SocialLink;
	fbUrl?: SocialLink;
	linkedInUrl?: SocialLink;
	twitterUrl?: SocialLink;
	blogUrl?: SocialLink;
	createTitle(title: SocialLinkTitle): string;
}

const UserSocials = ({
	githubUrl,
	fbUrl,
	twitterUrl,
	blogUrl,
	linkedInUrl,
	createTitle,
}: UserSocialsProps) => {
	return (
		<>
			{githubUrl && (
				<a
					href={githubUrl}
					rel="noopener noreferrer"
					target="_blank"
					title={createTitle(`Github link`)}
				>
					<Button aria-label="Github link" i={2} s={1}>
						<BiLogoGithub />
					</Button>
				</a>
			)}
			{fbUrl && (
				<a
					href={fbUrl}
					rel="noopener noreferrer"
					title={createTitle(`Facebook link`)}
					target="_blank"
				>
					<Button aria-label="Facebook link" i={2} s={1}>
						<BiLogoFacebook />
					</Button>
				</a>
			)}
			{linkedInUrl && (
				<a
					href={linkedInUrl}
					rel="noopener noreferrer"
					title={createTitle(`LinkedIn link`)}
					target="_blank"
				>
					<Button aria-label="LinkedIn link" i={2} s={1}>
						<BiLogoLinkedin />
					</Button>
				</a>
			)}
			{twitterUrl && (
				<a
					href={twitterUrl}
					rel="noopener noreferrer"
					title={createTitle(`Twitter link`)}
					target="_blank"
				>
					<Button aria-label="Twitter link" i={2} s={1}>
						<BiLogoTwitter />
					</Button>
				</a>
			)}
			{blogUrl && (
				<a
					href={blogUrl}
					rel="noopener noreferrer"
					title={createTitle(`Blog link`)}
					target="_blank"
				>
					<Button aria-label="Blog link" i={2} s={1}>
						<BiWorld />
					</Button>
				</a>
			)}
		</>
	);
};

export { UserSocials };
