import { BASE_COMMANDS } from "../utils/commands";
import { gherkin } from "../utils/gherkin";

describe(`Docs creator works when`, () => {
	const cheatsheetModalId = `[cheatsheet-modal]:container`;

	const given = gherkin({
		...BASE_COMMANDS,
		"I scroll to": (text: string) => {
			cy.contains(text).scrollIntoView();
		},
		"I check block": (text: string) => {
			given(`I scroll to`, text);
			BASE_COMMANDS[`System takes element picture`](
				`[data-testid="${cheatsheetModalId}"]`,
				text,
			);
		},
		"I test creator syntax": (content: string, name: string) => {
			given(`I clear creator`)
				.and(`I type in creator`, content)
				.then(`I wait`, 1000)
				.and(`System takes picture`, `${name}-before-change-theme`)
				.when(`I change theme`)
				.then(`System takes picture`, `${name}-after-change-theme`)
				.when(`I change theme`);
		},
	});

	it(`user is able to create nested lists`, () => {
		const names = [`lists`, `math`, `code`, `headings`] as const;

		const cheatsheetText = [
			`Typography`,
			`Lists`,
			`Blocks`,
			`Thanks for using our editor!`,
		];

		Cypress.Promise.all<string>(
			names.map((name) => cy.readFile(`cypress/samples/${name}.md`)),
		).then(([lists, math, code, headings]) => {
			given(`System has accepted cookies`)
				.and(`Im on page`, `home`)
				.and(`I see not disabled button`, [`Sign in`])
				.and(`I set white theme`)
				.when(`I test creator syntax`, lists, `lists`)
				.and(`I test creator syntax`, math, `math`)
				.and(`I test creator syntax`, code, `code`)
				.and(`I test creator syntax`, headings, `headings`)
				.when(`I click button`, [`Cheatsheet`])
				.then(`I see text`, cheatsheetText)
				.when(`I scroll to`, `Application logo`)
				.and(`I wait`, 2000)
				.and(`I check block`, cheatsheetText[0])
				.and(`I check block`, cheatsheetText[1])
				.and(`I check block`, cheatsheetText[2])
				.and(`I check block`, cheatsheetText[3])
				.when(`I click button`, [`Close markdown cheatsheet`])
				.then(`I not see text`, cheatsheetText);
		});
	});
});
