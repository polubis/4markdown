const commands = {
  'I click button': (title: string) => {
    cy.get(`*[title=${title}]`).click();
  },
} as const;

export { commands };
