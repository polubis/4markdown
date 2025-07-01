import Meta from "components/meta";
import { MindmapDisplayView } from "features/mindmap-display/mindmap-display.view";
import type { HeadFC } from "gatsby";
import LogoThumbnail from "images/logo-thumbnail.png";
import type { MindmapPageModel } from "models/page-models";
import React from "react";
import { useMindmapPreviewState } from "store/mindmap-preview";
import { meta } from "../../meta";

interface MindmapPageProps {
	pageContext: MindmapPageModel;
}

const useMindmapPageHydration = ({ pageContext }: MindmapPageProps) => {
	const hydrated = React.useRef(false);

	if (!hydrated.current) {
		useMindmapPreviewState.swap({
			...useMindmapPreviewState.getInitial(),
			mindmap: {
				is: `ok`,
				...pageContext.mindmap,
			},
		});

		hydrated.current = true;
	}
};

const MindmapPage = (props: MindmapPageProps) => {
	useMindmapPageHydration(props);

	return <MindmapDisplayView />;
};

export default MindmapPage;

export const Head: HeadFC<unknown, MindmapPageModel> = ({ pageContext }) => {
	return (
		<Meta
			appName={meta.appName}
			title={pageContext.mindmap.name}
			description={pageContext.mindmap.description ?? pageContext.mindmap.name}
			url={`${meta.siteUrl}${pageContext.mindmapPath}`}
			keywords={[meta.appName, ...(pageContext.mindmap.tags ?? [])].join(`, `)}
			lang={meta.lang}
			image={meta.siteUrl + LogoThumbnail}
		/>
	);
};
