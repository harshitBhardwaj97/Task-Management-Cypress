/// <reference types="Cypress" />

import { baseUrl } from "../constants";

describe("main page tests", () => {
  it("main page is loaded and logo is displayed", () => {
    cy.visit(baseUrl);
    cy.get("#logoImg");
  });

  it("main page is loaded and title is displayed", () => {
    cy.visit(baseUrl);
    cy.get("h1").contains("React Tasks");
  });
});
