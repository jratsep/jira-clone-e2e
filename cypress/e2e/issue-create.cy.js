import { faker } from "@faker-js/faker";

const createIssueModal = '[data-testid="modal:issue-create"]';
const titleInput = 'input[name="title"]';
const descriptionInput = ".ql-editor";
const priority = '[data-testid="select:priority"]';
const submitButton = 'button[type="submit"]';
const issueType = '[data-testid="select:type"]';
const issueTypeBug = '[data-testid="select-option:Bug"]';
const issueIconBug = '[data-testid="icon:bug"]';
const issueIconTask = '[data-testid="icon:task"]';
const assignee = '[data-testid="form-field:userIds"]';
const selectAssignee = '[data-testid="select:userIds"]';
const assigneeNameLordGaben = '[data-testid="select-option:Lord Gaben"]';
const reporter = '[data-testid="select:reporterId"]';
const reporterNamePickleRick = '[data-testid="select-option:Pickle Rick"]';
const backlog = '[data-testid="board-list:backlog"]';
const listIssue = '[data-testid="list-issue"]';
const avatarLordGaben = '[data-testid="avatar:Lord Gaben"]';
const reporterNameBabyYoda = '[data-testid="select-option:Baby Yoda"]';
const priorityLow = '[data-testid="select-option:Low"]';
const priorityIconLow = '[data-testid="icon:arrow-down"]';
const priorityColorLow = "rgb(45, 135, 56)";
const priorityHighest = '[data-testid="select-option:Highest"]';
const priorityIconHighest = '[data-testid="icon:arrow-up"]';
const priorityColorHighest = "rgb(205, 19, 23)";

describe("Issue create", () => {
  Cypress.on("uncaught:exception", (err) => {
    return false;
  });

  beforeEach(() => {
    cy.visit("/project/board");
    cy.url()
      .wait(5000)
      .should("include", "project/board")
      .then((url) => {
        cy.visit(`${url}?modal-issue-create=true`).wait(5000);
      });
  });

  it("Should create an issue and validate it successfully", () => {
    cy.get(createIssueModal)
      .should("exist")
      .within(() => {
        cy.get(descriptionInput).wait(2000).type("TEST_DESCRIPTION");
        cy.get(descriptionInput).should("contain.text", "TEST_DESCRIPTION");
        cy.get(titleInput)
          .wait(2000)
          .type("TEST_TITLE")
          .should("have.value", "TEST_TITLE");
        cy.get(issueType).click();
        cy.get('[data-testid="select-option:Story"]').click();
        cy.get(reporter).click();
        cy.get(reporterNameBabyYoda).click();
        cy.get(assignee).click();
        cy.get(reporterNamePickleRick).click();
        cy.get(submitButton).click().wait(10000);
      });

    cy.get(createIssueModal).should("not.exist");
    cy.contains("Issue has been successfully created.").should("be.visible");
    cy.reload();
    cy.contains("Issue has been successfully created.").should("not.exist");

    cy.get(backlog)
      .should("be.visible")
      .within(() => {
        cy.get(listIssue)
          .should("have.length", 5)
          .first()
          .within(() => {
            cy.contains("p", "TEST_TITLE")
              .siblings()
              .within(() => {
                cy.get('[data-testid="avatar:Pickle Rick"]').should(
                  "be.visible"
                );
              });
          });
      });
  });

  it.only("Should validate title is required field if missing", () => {
    cy.get(createIssueModal).within(() => {
      cy.get(submitButton).click();
      cy.get('[data-testid="form-field:title"]').should(
        "contain.text",
        "This field is required"
      );
    });
  });

  // Test Case 1: Custom Issue Creation
  it.only("Should create a bug report and validate it successfully", () => {
    cy.get(createIssueModal)
      .should("exist")
      .within(() => {
        cy.get(descriptionInput)
          .type("My bug description")
          .wait(3000)
          .should("contain.text", "My bug description");
        cy.get(titleInput).type("Bug").wait(3000).should("have.value", "Bug");
        cy.get(issueType).click();
        cy.get(issueTypeBug).click();
        cy.get(priority).click();
        cy.get(priorityHighest).click();
        cy.get(priorityIconHighest);
        cy.get(reporter).click();
        cy.get(reporterNamePickleRick).click();
        cy.get(assignee).click();
        cy.get(assigneeNameLordGaben).click();
        cy.get(submitButton).click();
      });

    cy.get(createIssueModal).should("not.exist");
    cy.contains("Issue has been successfully created.").should("be.visible");
    cy.reload();
    cy.contains("Issue has been successfully created.").should("not.exist");

    cy.get(backlog)
      .should("be.visible")
      .within(() => {
        cy.get(listIssue)
          .should("have.length", 5)
          .first()
          .click()
          .within(() => {
            cy.get(avatarLordGaben).should("be.visible");
            cy.get(issueIconBug).should("be.visible");
            cy.get(priorityIconHighest)
              .should("be.visible")
              .and("have.css", "color", priorityColorHighest);
          });
      });
  });
});

// Test Case 2: Random Data Plugin Issue Creation

it("Should create an issue with random data and verify data retention", () => {
  const randomTitle = faker.lorem.words(2);
  const randomDescription = faker.lorem.words(5);

  cy.log("Random Title:", randomTitle);
  cy.log("Random Description:", randomDescription);

  cy.get(createIssueModal)
    .should("exist")
    .within(() => {
      cy.get(descriptionInput).type(randomDescription);
      cy.get(titleInput).type(randomTitle);

      cy.wrap(randomTitle).as("randomTitle");
      cy.wrap(randomDescription).as("randomDescription");

      cy.get(reporter).click();
      cy.get(reporterNameBabyYoda).click().should("contain.text", "Baby Yoda");

      cy.get(priorityLow).click();
      cy.get(priorityIconLow)
        .should("be.visible")
        .and("have.css", "color", priorityColorLow);

      cy.get(submitButton).click();
    });

  cy.get(createIssueModal).should("not.exist");
  cy.contains("Issue has been successfully created.").should("be.visible");
  cy.reload();
  cy.contains("Issue has been successfully created.").should("not.exist");

  cy.get(backlog)
    .should("be.visible")
    .within(() => {
      cy.get(listIssue)
        .should("have.length", 5)
        .first()
        .find("p")
        .click()
        .within(() => {
          cy.get(createIssueModal)
            .should("be.visible")
            .within(() => {
              cy.get(titleInput).should("have.value", randomTitle);
              cy.get(descriptionInput).should(
                "contain.text",
                randomDescription
              );
              cy.get(priorityLow).should("contain.text", "Low");
              cy.get(reporterNameBabyYoda).should("contain.text", "Baby Yoda");
            });
        });
    });
});
