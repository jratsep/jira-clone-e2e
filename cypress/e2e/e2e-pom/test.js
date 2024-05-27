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
      .should("include", "project/board")
      .wait(10000)
      .then((url) => {
        cy.visit(`${url}?modal-issue-create=true`).wait(8000);
      });
  })


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
      cy.get(issueIconBug).should("be.visible");
      cy.get(priority).click();
      cy.get(priorityHighest).click();
      cy.get(priorityIconHighest)
        .should("be.visible")
        .and("have.css", "color", priorityColorHighest);
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
        .within(() => {
          cy.contains(issueIconBug)
            .siblings()
            .within(() => {
              cy.get(avatarLordGaben).should("be.visible");
              cy.get(issueIconBug).should("be.visible");
              cy.get(priorityIconHighest)
                .should("be.visible")
                .and("have.css", "color", priorityColorHighest);
              
            })
        })
    })
