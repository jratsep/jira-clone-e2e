import { faker } from "@faker-js/faker";

const createIssueModal = '[data-testid="modal:issue-create"]';
const issueDetails = '[data-testid="modal:issue-details]';
const confirmModal = '[data-testid="modal:confirm]';
const titleInput = 'input[name="title"]';
const textarea = '[placeholder="Short summary"]';
const descriptionInput = ".ql-editor";
const submitButton = 'button[type="submit"]';
const issueType = '[data-testid="select:type"]';
const issueTypeTask = '[data-testid="select:Task"]';
const issueTypeBug = '[data-testid="select-option:Bug"]';
const issueTypeStory = '[data-testid="select-option:Story"]';
const issueIconBug = '[data-testid="icon:bug"]';
const issueIconTask = '[data-testid="icon:task"]';
const assignee = '[data-testid="form-field:userIds"]';
const title = '[data-testid="form-field:title"]';
const selectAssignee = '[data-testid="select:userIds"]';
const assigneeNameLordGaben = '[data-testid="select-option:Lord Gaben"]';
const assigneeNamePickleRick = '[data-testid="select-option:Pickle Rick"]';
const reporter = '[data-testid="select:reporterId"]';
const reporterNamePickleRick = '[data-testid="select-option:Pickle Rick"]';
const backlog = '[data-testid="board-list:backlog"]';
const listIssue = '[data-testid="list-issue"]';
const avatarLordGaben = '[data-testid="avatar:Lord Gaben"]';
const avatarBabyYoda = '[data-testid="avatar:Baby Yoda"]';
const avatarPickleRick = '[data-testid="avatar:Pickle Rick"]';
const reporterNameBabyYoda = '[data-testid="select-option:Baby Yoda"]';
const priority = '[data-testid="select:priority"]';
const priorityLow = '[data-testid="select-option:Low"]';
const priorityIconLow = '[data-testid="icon:arrow-down"]';
const priorityColorLow = "rgb(45, 135, 56)";
const priorityHighest = '[data-testid="select-option:Highest"]';
const priorityIconHighest = '[data-testid="icon:arrow-up"]';
const priorityColorHighest = "rgb(205, 19, 23)";

describe("Issue create", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        // System will already open issue creating modal in beforeEach block
        cy.visit(url + "/board?modal-issue-create=true");
      });
  });

  it("Should create an issue and validate it successfully", () => {
    cy.get(createIssueModal) // Open issue creation modal
      .within(() => {
        cy.get(descriptionInput).wait(2000).type("TEST_DESCRIPTION").wait(2000); // Enter description
        cy.get(descriptionInput).should("contain.text", "TEST_DESCRIPTION"); // Validate description
        cy.get(titleInput).wait(2000).type("TEST_TITLE").wait(2000); // Enter title
        cy.get(titleInput).should("have.value", "TEST_TITLE"); // Validate title
        cy.get(issueType).click(); // Select issue type and choose "Story"
        cy.get(issueTypeStory);
        cy.get(reporter).click(); // Select reporter Yoda
        cy.get(reporterNameBabyYoda).click();
        cy.get(assignee).click(); // Select assignee Pickle Rick
        cy.get(assigneeNamePickleRick).click();
        cy.get(submitButton).click().wait(5000);
      });

    cy.get(createIssueModal).should("not.exist"); // Validate, that issue creation modal is no longer displayed
    cy.contains("Issue has been successfully created.").should("be.visible"); // Validate, that success message is displayed
    cy.reload();
    cy.contains("Issue has been successfully created.").should("not.exist"); // Validate, that message is not displayed after page reload

    cy.get(backlog) // Open backlog selector
      .should("be.visible") // Validate, that it is displayed
      .within(() => {
        cy.get(listIssue) // Open the issues list slector
          .should("have.length", 5) // Validate, it has 5 items listed
          .first() // Select first of 5 items
          .within(() => {
            cy.contains("p", "TEST_TITLE") // Validate, that the title is "TEST_TITLE"
              .siblings() // Selects all sibling elements of the found <p> element. Sibling elements are those that share the same parent.
              .within(() => {
                cy.get(avatarPickleRick).should("be.visible"); // Check that Pickle Rick avatar is displayed
              });
          });
      });
  });

  it("Should validate title is required field if missing", () => {
    cy.get(createIssueModal).within(() => {
      //Open issue creation modal
      cy.get(submitButton).click(); // Try to submit issue without data
      cy.get(title).should("contain.text", "This field is required"); // Validate, that error message is displayed
    });
  });

  // Test Case 1: Custom Issue Creation
  it("Should create a bug report and validate it successfully", () => {
    cy.get(createIssueModal) //Open issue creation modal
      .should("exist")
      .within(() => {
        cy.get(descriptionInput) // Open description selector
          .type("My bug description") // Enter description
          .wait(3000)
          .should("contain.text", "My bug description"); // Validate that the descritption field contains entered data
        cy.get(titleInput).type("Bug").wait(3000).should("have.value", "Bug"); // Open title selector and type "Bug" and validate, that data was retained in field
        cy.get(issueType).click(); // Open issue type selector
        cy.get(issueTypeBug).click(); // Select Bug as type
        cy.get(priority).click(); // Open priority selector
        cy.get(priorityHighest).click(); // Choose highest priority and validate with the icon change
        cy.get(reporter).click();
        cy.get(reporterNamePickleRick).click(); // Select reporter
        cy.get(assignee).click();
        cy.get(assigneeNameLordGaben).click(); // Select assignee
        cy.get(submitButton).click();
      });

    cy.get(createIssueModal).should("not.exist"); // Validate, that create issue modal is no longer displayed
    cy.contains("Issue has been successfully created.").should("be.visible"); // Validate, that success message is displayed
    cy.reload();
    cy.contains("Issue has been successfully created.").should("not.exist"); // Validate, that success message is no longer displayed

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

  // Test Case 2: Random Data Plugin Issue Creation
  it("Should create an issue with random data and verify data retention", () => {
    const randomTitle = faker.lorem.words(2);
    const randomDescription = faker.lorem.words(5);

    cy.get(createIssueModal)
      .should("exist")
      .within(() => {
        cy.get(issueType).contains("Task");
        cy.get(descriptionInput).type(randomDescription);
        cy.get(titleInput).type(randomTitle);
        cy.log("Random Title:", randomTitle);
        cy.log("Random Description:", randomDescription);
        cy.wrap(randomTitle).as("randomTitle");
        cy.wrap(randomDescription).as("randomDescription");
        cy.get(reporter).click();
        cy.get(reporterNameBabyYoda).click();
        cy.get(priority).click();
        cy.get(priorityLow).click();
        cy.get(submitButton).click();
      });

    cy.get(createIssueModal).should("not.exist");
    cy.contains("Issue has been successfully created.").should("be.visible");
    cy.reload();
    cy.contains("Issue has been successfully created.").should("not.exist");

    cy.get(backlog)
      .should("be.visible")
      .and("have.length", 1)
      .within(() => {
        cy.get(listIssue)
          .should("have.length", 5)
          .first()
          .within(() => {
            cy.get("p")
              .contains(randomTitle)
              .siblings() // Ensure we scope the following searches to siblings of the <p> containing randomTitle
              .within(() => {
                cy.get(issueIconTask).should("be.visible");
                cy.get(priorityIconLow).should("be.visible").click();
              });
          });
      });
  });
});
