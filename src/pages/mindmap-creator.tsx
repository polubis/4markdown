import React from "react";
import type { HeadFC } from "gatsby";
import LogoThumbnail from "images/logo-thumbnail.png";
import Meta from "components/meta";
import { meta } from "../../meta";
import { ScreenLoader } from "design-system/screen-loader";

const MindmapCreatorView = React.lazy(() =>
	import(`../features/mindmap-creator/mindmap-creator.view`).then((m) => ({
		default: m.MindmapCreatorView,
	})),
);

const MindmapCreatorPage = () => {
	return (
		<React.Suspense fallback={<ScreenLoader />}>
			<MindmapCreatorView />
		</React.Suspense>
	);
};

export default MindmapCreatorPage;

export const Head: HeadFC = () => {
	return (
		<Meta
			appName={meta.appName}
			title="Create Beautiful Mindmaps and Roadmaps with a Powerful Editor"
			description={`Visualize your learning journey, track progress, and stay organized with the ${meta.appName} mindmap and roadmap builder—your ultimate knowledge tool`}
			url={meta.siteUrl + meta.routes.mindmaps.creator}
			lang={meta.lang}
			image={meta.siteUrl + LogoThumbnail}
		/>
	);
};
