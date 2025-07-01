import { useSimpleFeature } from "@greenonsoftware/react-kit";
import { Button } from "design-system/button";
import { getCookie, setCookie } from "development-kit/cookies";
import { isClient } from "development-kit/ssr-csr";
import React, { type ReactNode } from "react";
import { meta } from "../../meta";

const confirmAIPolicy = (): void => {
	setCookie(`rewrite-assistant-policy`, `true`, 30);
};

const isAIPolicyConfirmed = (): boolean =>
	getCookie(`rewrite-assistant-policy`) === `true`;

const AIPolicyDisclaimer = ({
	children,
	onCancel,
}: {
	children: ReactNode;
	onCancel(): void;
}) => {
	const policy = useSimpleFeature(() => isClient() && isAIPolicyConfirmed());

	const confirmPolicy = (): void => {
		confirmAIPolicy();
		policy.on();
	};

	if (policy.isOn) return children;

	return (
		<section>
			<h6 className="text-lg mb-2">We&apos;re Sharing Provided Data</h6>
			<p>
				To reduce costs and improve experience, we&apos;re sharing data you
				provide to the AI inside
				{` `}
				<strong>{meta.appName}</strong>
				{` `}
				with third-party providers like{` `}
				<a
					className="underline underline-offset-2"
					href="https://openrouter.ai/"
					target="_blank"
					rel="noreferrer"
				>
					Open Router
				</a>
				{` `}
				and possibly others in the future. You can read more about our policy on
				our
				{` `}
				<a
					target="__blank"
					rel="noreferrer"
					className="underline underline-offset-2"
					href={meta.routes.privacyPolicy}
				>
					Privacy Policy
				</a>
				{` `}
				page.
			</p>
			<p className="mt-1 mb-4">
				To use the AI assistant, you need to accept our policy. By confirming,
				you agree to share your data with third-party providers when using any
				AI features at <strong>{meta.appName}</strong>.
			</p>
			<div className="flex gap-2 justify-end">
				<Button
					i={1}
					s={2}
					auto
					title="Cancel AI policy disclaimer"
					onClick={onCancel}
				>
					Cancel
				</Button>
				<Button
					i={1}
					s={2}
					auto
					title="Accept AI policy disclaimer"
					onClick={confirmPolicy}
				>
					Accept
				</Button>
			</div>
		</section>
	);
};

export { AIPolicyDisclaimer };
