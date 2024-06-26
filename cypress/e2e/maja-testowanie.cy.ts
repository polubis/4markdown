
// import { BASE_COMMANDS } from '../utils/commands';
// import { Gherkin } from '../utils/gherkin';

// describe(`Document creation works when` , () => {
// const { Given } = Gherkin(BASE_COMMANDS);

// it ('feature is off for not authorized users' , () => {
// Given(`Im on page` , `home`).When(`I click button`, [`Sign in`])
// .Then("I click button", ["Your documents"]);
// }
// )
// }
// )

// import { BASE_COMMANDS } from '../utils/commands';
// import { Gherkin } from '../utils/gherkin';

// describe(`Privacy policy works when`, () => {
//   const { Given } = Gherkin({
//     ...BASE_COMMANDS,
//     'Im on privacy policy page': () => {
//       Given(`I see text`, [`Privacy Policy`]);
//       cy.url().should(`include`, `/privacy-policy/`);
//     },
//     'I scroll to': (text: string) => {
//       cy.contains(text).scrollIntoView();
//     },
//     'I see policy headings': () => {
//       cy.get(`h2`).each(($h2) => {
//         cy.contains($h2.text()).scrollIntoView();
//         Given(`System takes picture`);
//       });
//     },
//     'I see well aligned UI on mobile': () => {
//       cy.viewport(320, 800);
//       Given(`System takes picture`);
//     },
//   });
//   it("privicy policy",() => {
//     Given ("Im on page", "home")

//   })
// });


import { BASE_COMMANDS } from '../utils/commands';
import { Gherkin } from '../utils/gherkin';

describe(`Create new document`, () => {
const { Given } = Gherkin(BASE_COMMANDS);

it ('feature is off for not authorized users' , () => {
  const [testing1] = [
`siema`
  ]
  Given(`Im on page` , `home`).When(`I click button`, [`Sign in`])
  Given(`Im on page`, `home`)
  .When('I see button', [`Create new document`])
  .Then(`I click button`, [`Create new document`])
  .And(`I type in input`, `Type document name`, testing1)

})
})

