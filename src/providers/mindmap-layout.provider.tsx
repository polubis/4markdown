import type { FullMindmapDto } from "api-4markdown-contracts";
import React, {
	type Dispatch,
	type ReactNode,
	type SetStateAction,
} from "react";

type MindmapLayoutState = {
	mindmap: FullMindmapDto;
};

type MindmapLayoutContextValue = [
	MindmapLayoutState,
	Dispatch<
		SetStateAction<{
			mindmap: FullMindmapDto;
		}>
	>,
];

type MindmapLayoutProviderProps = {
	children: ReactNode;
	mindmap: FullMindmapDto;
};

const MindmapLayoutContext =
	React.createContext<MindmapLayoutContextValue | null>(null);

const MindmapLayoutProvider = ({
	mindmap,
	children,
}: MindmapLayoutProviderProps) => {
	const value = React.useState<MindmapLayoutState>(() => ({
		mindmap,
	}));

	return (
		<MindmapLayoutContext.Provider value={value}>
			{children}
		</MindmapLayoutContext.Provider>
	);
};

const useMindmapLayoutContext = (): MindmapLayoutContextValue => {
	const ctx = React.useContext(MindmapLayoutContext);

	if (!ctx) throw Error(`Lack of provider for mindmap layout`);

	return ctx;
};

export { MindmapLayoutProvider, useMindmapLayoutContext };
