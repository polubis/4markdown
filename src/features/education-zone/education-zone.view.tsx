import React from "react";
import { EducationZoneLinkContainer } from "containers/education-zone-link.container";
import { AppNavigation } from "components/app-navigation";
import { formatDistance } from "date-fns";
import { AppFooterContainer } from "containers/app-footer.container";
import { Avatar } from "design-system/avatar";
import { CreationLinkContainer } from "containers/creation-link.container";
import { Link } from "gatsby";
import { RATING_ICONS } from "core/rating-config";
import { meta } from "../../../meta";
import { BiArrowToLeft, BiArrowToRight } from "react-icons/bi";
import { paginate } from "development-kit/paginate";
import { EducationLayout } from "components/education-layout";
import { EducationDocumentsList } from "components/education-documents-list";
import { EducationTopTags } from "components/education-top-tags";
import type { EducationPageModel } from "models/page-models";
import { EducationRankLinkContainer } from "containers/education-rank-link.container";

type EducationZoneViewProps = EducationPageModel;

const now = new Date();
// @TODO[PRIO=3]: [Think about moving dates calculation on the server side].
const Pagination = ({
	page,
	pagesCount,
}: Pick<EducationZoneViewProps, "page" | "pagesCount">) => {
	const firstPage = 1;
	const lastPage = pagesCount;
	const filteredPages = React.useMemo(
		() =>
			paginate({
				pagesCount,
				limit: 5,
				currentPage: page,
			}),
		[page, pagesCount],
	);

	if (filteredPages.length <= 1) return null;

	return (
		<div className="flex space-x-2 mt-auto pt-6 justify-end">
			{page !== firstPage && (
				<Link
					key="first"
					className="flex font-bold items-center justify-center w-8 h-8 rounded-md text-[18px] focus:outline dark:outline-2 outline-2.5 outline-black dark:outline-white"
					title="Go to first page"
					to={meta.routes.education.zone}
				>
					<BiArrowToLeft size={20} />
				</Link>
			)}
			{filteredPages.map((page) => (
				<Link
					activeClassName="bg-gray-400/20 dark:bg-slate-800/50"
					className="flex font-bold items-center justify-center w-8 h-8 rounded-md text-[18px] focus:outline dark:outline-2 outline-2.5 outline-black dark:outline-white"
					title={`Go to ${page} page`}
					to={`${meta.routes.education.zone}${page === firstPage ? `` : page}`}
					key={page}
				>
					{page}
				</Link>
			))}
			{page !== lastPage && (
				<Link
					className="flex font-bold items-center justify-center w-8 h-8 rounded-md text-[18px] focus:outline dark:outline-2 outline-2.5 outline-black dark:outline-white"
					title="Go to last page"
					to={`${meta.routes.education.zone}${lastPage}`}
					key="last"
				>
					<BiArrowToRight size={20} />
				</Link>
			)}
		</div>
	);
};

const ContentRank = ({
	documents,
}: Pick<EducationZoneViewProps, "documents">) => {
	return (
		<>
			<h2 className="text-xl">Content Rank</h2>
			<ol className="flex flex-col mb-4 mt-3 space-y-4 w-[280px]">
				{documents.partialTop.map((document) => (
					<li className="flex flex-col" key={document.id}>
						<div className="flex items-center space-x-1 mb-0.5">
							{document.author ? (
								<>
									<Avatar
										size="tn"
										alt="Author avatar"
										className="bg-gray-300 dark:bg-slate-800 mr-1.5"
										char={document.author.displayName.charAt(0)}
										src={document.author?.avatar?.src}
									/>

									<Link
										className="text-black dark:text-white italic hover:underline underline-offset-4 w-fit"
										to={
											meta.routes.userProfile.preview +
											`?profileId=${document.author.id}`
										}
									>
										{document.author.displayName}
										{` `}
										{formatDistance(document.cdate, now, {
											addSuffix: true,
										})}
									</Link>
								</>
							) : (
								<i>
									Anonymous
									{` `}
									{formatDistance(document.cdate, now, {
										addSuffix: true,
									})}
								</i>
							)}
						</div>
						<h3 className="text-lg hover:underline underline-offset-2 mb-2 w-fit">
							<Link to={document.path} className="line-clamp-2">
								{document.name}
							</Link>
						</h3>
						<div className="flex items-center space-x-2">
							{RATING_ICONS.map(([Icon, category]) => (
								<div className="flex items-center" key={category}>
									<Icon className="mr-1" size={20} />
									<strong>{document.rating[category]}</strong>
								</div>
							))}
						</div>
					</li>
				))}
			</ol>
			<Link
				to={meta.routes.education.rank}
				className="hover:underline underline-offset-2"
			>
				See Full Rank
			</Link>
		</>
	);
};

const EducationZoneView = ({
	page,
	pagesCount,
	documents,
	topTags,
	tag,
}: EducationZoneViewProps) => {
	return (
		<>
			<AppNavigation>
				<CreationLinkContainer />
				<EducationRankLinkContainer />
				<EducationZoneLinkContainer />
			</AppNavigation>
			<EducationLayout
				title={
					tag ? (
						<span className="flex items-center space-x-1.5">
							<Link
								className="translate-y-0.5"
								to={meta.routes.education.zone}
								title="Back to education zone"
							>
								<BiArrowToLeft />
							</Link>
							<span className="uppercase">{tag}</span>
						</span>
					) : (
						`Education Zone`
					)
				}
				subTitle={
					tag
						? `By Tag (${documents.wall.length})`
						: `Page ${page} from ${pagesCount}`
				}
			>
				<>
					<EducationDocumentsList documents={documents.wall} />
					<Pagination page={page} pagesCount={pagesCount} />
				</>
				<>
					<EducationTopTags className="mb-6" tags={topTags} />
					<ContentRank documents={documents} />
				</>
			</EducationLayout>
			<AppFooterContainer />
		</>
	);
};

export { EducationZoneView };
