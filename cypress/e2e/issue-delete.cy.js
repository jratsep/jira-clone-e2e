import { faker } from "@faker-js/faker";

const createIssueModal = '[data-testid="modal:issue-create"]';
const issueDetails = '[data-testid="modal:issue-details"]'; // Corrected selector
const confirmModal = '[data-testid="modal:confirm"]'; // Corrected selector
const titleInput = 'input[name="title"]';
const textarea = '[placeholder="Short summary"]';
const descriptionInput = ".ql-editor";
const submitButton = 'button[type="submit"]';
const issueType = '[data-testid="select:type"]';
const assignee = '[data-testid="form-field:userIds"]';
const title = '[data-testid="form-field:title"]';
const backlog = '[data-testid="board-list:backlog"]';
const listIssue = '[data-testid="list-issue"]';
const iconTrash = '[data-testid="icon:trash"]';
const iconClose = '[class="sc-bdVaJa fuyACr"]';
const buttonDelete = '[data-testid="button:delete-issue"]';

describe("Deleting issues", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.").click();
      });
  });

  /// Test Case 1: Issue Deletion ///

  it("Should open first issue on the board, delete it, and confirm deletion", () => {
    // Step 1: Count the initial number of entries in the backlog
    cy.get(listIssue)
      .its("length")
      .then((initialLength) => {
        cy.log(
          `Number of entries in the backlog before deletion: ${initialLength}`
        );

        // Step 2: Open the first issue and perform deletion
        cy.get(listIssue).first();
        cy.get(issueDetails)
          .should("be.visible")
          .within(() => {
            cy.get(iconTrash).click();
          });

        // Step 3: Confirm the deletion in the modal
        cy.get(confirmModal)
          .should("be.visible")
          .within(() => {
            cy.get("button")
              .contains("Delete issue")
              .should("be.visible")
              .click();
          });

        // Step 4: Verify the deletion and the updated count of entries
        cy.get(confirmModal).should("not.exist");
        cy.get(issueDetails).should("not.exist");
        cy.get(backlog).should("be.exist");
        cy.reload();

        // Step 5: Count the number of entries in the backlog after deletion
        cy.get(listIssue)
          .its("length")
          .should("equal", initialLength - 1)
          .then((finalLength) => {
            cy.log(
              `Number of entries in the backlog after deletion: ${finalLength}`
            );
          });
      });
  });

  /// Test Case 2: Issue Deletion Cancellation///

  it("Should cancel issue deletion from confirmation window", () => {
    cy.get(listIssue)
      .its("length")
      .then((initialLength) => {
        cy.log(`Initial issue count: ${initialLength}`);

        // Step 1: Open the first issue
        cy.get(listIssue).first(); // Ensure clicking the first issue to open the details modal

        cy.get(issueDetails)
          .should("be.visible")
          .within(() => {
            cy.get(iconTrash).click();
          });

        // Step 2: Open the confirmation modal, verify Delete button exists but click Cancel button
        cy.get(confirmModal)
          .should("be.visible")
          .within(() => {
            cy.get("button").contains("Delete issue").should("be.visible");
            cy.get("button").contains("Cancel").click();
          });

        // Step 4: Verify issue details and confirmation modals are closed
        cy.get(confirmModal).should("not.exist");
        cy.get(issueDetails).within(() => {
          cy.get(iconClose).click().wait(2000);
        });

        cy.get(backlog).should("exist");
        cy.get(issueDetails).should("not.exist");
        cy.reload();

        // Step 5: Count the number of entries in the backlog after canceling deletion, should equal initial count
        cy.get(listIssue)
          .its("length")
          .should("equal", initialLength)
          .then((finalLength) => {
            cy.log(`Issue count after cancelled deletion: ${finalLength}`);
          });
      });
  });
});
