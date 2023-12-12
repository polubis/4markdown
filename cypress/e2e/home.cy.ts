describe(`Home page works when`, () => {
  beforeEach(() => {
    cy.visit(`/`);
  });

  it(`displays theme content`, () => {
    cy.get(`*[title="Clear Content"]`);
  });
});
