/// <reference types="Cypress" />

import { baseUrl } from "../constants";

function checkBackdrop() {
  cy.visit(baseUrl);
  cy.get("button").click();
  cy.get(".backdrop").should("exist"); // .backdrop class is added
}

it("by default no Tasks heading is shown", () => {
  cy.visit(baseUrl);
  cy.get(".no-tasks").contains("No tasks found!");
});

it("should contain the expected options", () => {
  const expectedOptions = [
    "All",
    "🚨 Urgent",
    "🔴 Important",
    "🔵 Moderate",
    "🟢 Low",
  ];

  cy.visit(baseUrl);

  cy.get("#filter")
    .should("exist")
    .within(() => {
      expectedOptions.forEach((optionText) => {
        cy.get("option").should("contain.text", optionText);
      });
    });
});

describe("task modal tests", () => {
  it("task modal is opened by clicking on Add Task button", () => {
    checkBackdrop(); // Fucntions can also be used to abstact common logic and then reuse it in tests
    cy.get(".modal").should("exist"); // .backdrop class is added
  });

  it("task modal is closed by clicking on Cancel button", () => {
    cy.visit(baseUrl);
    cy.get("button").click(); // Click on Add Task
    cy.get(".backdrop").should("exist"); // .backdrop class is added
    cy.contains("Cancel").click(); // Click on Cancel Button
    cy.get(".backdrop").should("not.exist"); // .backdrop class is removed
    cy.get(".modal").should("not.exist"); // .backdrop class is removed
  });

  it("task can be added successfully", () => {
    cy.visit(baseUrl);
    cy.get("button").click(); // Click on Add Task
    cy.get(".backdrop").should("exist"); // .backdrop class is added
    cy.get("#title").type("My first task");
    cy.get("#summary").type("My first task summary");
    cy.get(".actions").contains("Add Task").click();
    cy.get("li.task").should("have.length", 1);
    cy.get("li.task h2").contains("My first task");
    cy.get("li.task p").contains("My first task summary");
  });

  it("tasks are added in correct order", () => {
    cy.visit(baseUrl);
    cy.get("button").click(); // Click on Add Task
    cy.get(".backdrop").should("exist"); // .backdrop class is added
    // Add First task
    cy.get("#title").type("My first task");
    cy.get("#summary").type("My first task summary");
    cy.get(".actions").contains("Add Task").click();
    cy.get("li.task").should("have.length", 1);
    cy.get("li.task h2").contains("My first task");
    cy.get("li.task p").contains("My first task summary");

    cy.get("button").click(); // Click on Add Task
    cy.get(".backdrop").should("exist"); // .backdrop class is added

    // Add Second task
    cy.get("#title").type("My second task");
    cy.get("#summary").type("My second task summary");
    cy.get(".actions").contains("Add Task").click();
    cy.get("li.task").should("have.length", 2); // Now length of task list should be 2
    cy.get("li.task h2").contains("My second task");
    cy.get("li.task p").contains("My second task summary");

    // First Task
    cy.get("li.task h2").eq(0).contains("My first task");
    cy.get("li.task p").eq(0).contains("My first task summary");

    // Second Task
    cy.get("li.task h2").eq(1).contains("My second task");
    cy.get("li.task p").eq(1).contains("My second task summary");
  });

  it("task cannot be added without title or summary", () => {
    cy.visit(baseUrl);
    cy.get("button").click(); // Click on Add Task
    cy.get(".backdrop").should("exist"); // .backdrop class is added
    /* Avoid entering the title and summary and click on add task
    cy.get("#title").type("My first task");
    cy.get("#summary").type("My first task summary");
    */
    cy.get(".actions").contains("Add Task").click();
    cy.get(".error-message").contains(
      "Please provide values for task title, summary and category!"
    );
  });
});
