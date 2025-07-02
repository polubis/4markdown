import { state } from "development-kit/state";
import type { MindmapCreatorState } from "./models";
import { type Viewport } from "@xyflow/react";

const defaultMindmapData: Pick<
	MindmapCreatorState,
	"orientation" | "nodes" | "edges"
> = {
	orientation: `y`,
	nodes: [
		{
			id: `381709.19999999925:381709.19999999925`,
			type: `embedded`,
			position: {
				x: 165,
				y: 0,
			},
			data: {
				content: `# Ingredients\n\n- 200g spaghetti\n- 2 tablespoons olive oil\n- 2 cloves garlic, minced\n- 1 can (400g) crushed tomatoes\n- 1 teaspoon dried oregano\n- 1 teaspoon dried basil\n- Salt and pepper to taste\n- Fresh basil or parsley (optional)\n- Grated Parmesan cheese (optional)`,
				description: `Shopping list of ingredients to buy for spaghetti, with measurements and types of ingredients explained in the simplest way possible`,
				name: `Ingredients`,
				path: `/ingredients/`,
			},
			measured: {
				width: 280,
				height: 174,
			},
		},
		{
			id: `381709.19999999925:648478.3999999985`,
			type: `embedded`,
			position: {
				x: 0,
				y: 274,
			},
			data: {
				content: `# Instructions\n\n1. **Cook the spaghetti**: Bring a large pot of salted water to a boil. Add the spaghetti and cook according to package instructions until al dente (usually 8-10 minutes). Drain and set aside.\n   \n2. **Make the sauce**: While the pasta is cooking, heat the olive oil in a large pan over medium heat. Add the minced garlic and sauté for 1-2 minutes until fragrant, being careful not to burn it.\n\n3. **Add tomatoes and spices**: Pour in the crushed tomatoes and add the oregano and basil. Stir well and simmer for about 10-15 minutes, allowing the sauce to thicken. Season with salt and pepper to taste.\n\n4. **Combine pasta and sauce**: Once the sauce is ready, add the cooked spaghetti to the pan and toss to coat the pasta with the sauce.\n\n5. **Serve**: Garnish with fresh basil or parsley and a sprinkle of grated Parmesan if desired. Enjoy!`,
				description: `A list of instructions to prepare a spaghetti meal based on a unique recipe from my family and Italian friends from Southern Italy`,
				name: `Instructions`,
				path: `/instructions/`,
			},
			measured: {
				width: 280,
				height: 174,
			},
		},
		{
			id: `381709.19999999925:790418.2999999989`,
			type: `external`,
			position: {
				x: 330,
				y: 324,
			},
			data: {
				url: `https://en.wikipedia.org/wiki/Spaghetti`,
				description: null,
				name: `Spaghetti History`,
				path: `/spaghetti-history/`,
			},
			measured: {
				width: 280,
				height: 74,
			},
		},
		{
			id: `381709.19999999925:961282.7999999989`,
			type: `embedded`,
			position: {
				x: 0,
				y: 548,
			},
			data: {
				content: `# Tips and Tricks\n\nAll things you need to know about crafting best Spaghetti!\n\n## Salt the Pasta Water Generously  \n\nSalted pasta water is key for flavorful spaghetti. It should taste like the sea! It helps to season the pasta itself, enhancing the overall dish.\n\n## Save Some Pasta Water  \n\nBefore draining the spaghetti, save about 1/2 cup of pasta water. This starchy water can be used to thin out the sauce if it becomes too thick or to help the sauce adhere better to the pasta.\n\n## Don’t Overcook the Pasta  \n\nSpaghetti should be cooked al dente, which means it should still have a slight firmness when bitten. Overcooking makes the pasta mushy and less enjoyable.\n\n## Use Fresh Garlic for More Flavor  \n\nFor an extra punch of flavor, try using fresh garlic instead of garlic powder. It adds a savory richness to your sauce that powdered garlic just can’t replicate.\n\n## Add a Pinch of Sugar to the Sauce  \n\nIf your tomato sauce is too acidic, a small pinch of sugar can help balance the flavor. It’s a secret trick used by many chefs!\n\n## Finish Cooking the Pasta in the Sauce  \n\nFor a better flavor, add the drained pasta to the sauce and cook it together for a minute or two. This lets the pasta absorb the sauce and enhances the overall taste.\n\n## Experiment with Fresh Herbs  \n\nFresh herbs like basil, parsley, or even thyme can elevate your sauce. Add them just before serving to maintain their bright, fresh flavors.\n\n## Upgrade with Toppings  \nYou can add extra toppings like red pepper flakes for heat, olives for a salty bite, or even sautéed mushrooms for an earthy flavor.\n\n## Use a High-Quality Olive Oil  \nThe olive oil in the sauce really matters! Use a good quality extra virgin olive oil for a richer flavor. It can make a noticeable difference in the dish.\n\n## Make It a Complete Meal  \nTo turn your spaghetti into a more filling dish, serve it with a side of garlic bread or a salad with a tangy dressing.`,
				description: null,
				name: `Tips and Tricks`,
				path: `/tips-and-tricks/`,
			},
			measured: {
				width: 280,
				height: 74,
			},
		},
	],
	edges: [
		{
			id: `381709.19999999925:715466.0999999996`,
			source: `381709.19999999925:381709.19999999925`,
			target: `381709.19999999925:648478.3999999985`,
			type: `solid`,
		},
		{
			id: `381709.19999999925:1004684`,
			source: `381709.19999999925:648478.3999999985`,
			target: `381709.19999999925:961282.7999999989`,
			type: `solid`,
		},
		{
			id: `381709.19999999925:1040519.6999999993`,
			source: `381709.19999999925:381709.19999999925`,
			target: `381709.19999999925:790418.2999999989`,
			type: `solid`,
		},
	],
};

type LastViewport = Viewport & { width: number; height: number };

let lastViewport: LastViewport;

const useMindmapCreatorState = state<MindmapCreatorState>({
	...defaultMindmapData,
	changesCount: 0,
	nodeForm: { is: `closed` },
	nodesRemovalConfirmation: { is: `closed` },
	mindmapForm: { is: `closed` },
	activeMindmapId: null,
	mindmaps: { is: `idle` },
	yourMindmapsView: { is: `closed` },
	nodePreview: { is: `closed` },
	operation: { is: `idle` },
	mindmapDetails: { is: `off` },
});

const setLastViewport = (viewport: LastViewport): void => {
	lastViewport = viewport;
};

const getLastViewport = () => lastViewport;

export { useMindmapCreatorState, setLastViewport, getLastViewport };
