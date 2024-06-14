import { faker } from "@faker-js/faker";

// Constants for selectors and data attributes
const createIssueModal = '[data-testid="modal:issue-create"]';
const issueDetails = '[data-testid="modal:issue-details"]';
const confirmModal = '[data-testid="modal:confirm"]';
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

class IssueModal {
  constructor() {
    this.submitButton = 'button[type="submit"]';
    this.title = 'input[name="title"]';
    this.issueType = '[data-testid="select:type"]';
    this.descriptionField = ".ql-editor";
    this.assignee = '[data-testid="select:userIds"]';
    this.backlogList = '[data-testid="board-list:backlog"]';
    this.issuesList = '[data-testid="list-issue"]';
    this.deleteButton = '[data-testid="icon:trash"]';
    this.deleteButtonName = "Delete issue";
    this.cancelDeletionButtonName = "Cancel";
    this.confirmationPopup = '[data-testid="modal:confirm"]';
    this.closeDetailModalButton = '[data-testid="icon:close"]';

    this.issueModal = '[data-testid="modal:issue-create"]';
    this.issueDetailModal = '[data-testid="modal:issue-details"]';

    this.issueCommentsList = '[data-testid="issue-comment"]';
    this.commentEntryField = 'textarea[placeholder="Add a comment..."]';
    this.addCommentField = "Add a comment...";
    this.editCommentButton = "Edit";
    this.saveCommentButtonName = "Save";
    this.commentDelete = "Delete";
    this.commentDeleteConfirmationPopup = '[data-testid="modal:confirm"]';
    this.commentDeleteConfirm = "Delete comment";
    this.estimateField = 'input[placeholder="Number"]';
    this.timeTrackerStopwatch = '[data-testid="icon:stopwatch"]';
  }

  createIssue(issueDetails) {
    this.getIssueModal().within(() => {
      this.selectIssueType(issueDetails.type);
      this.editDescription(issueDetails.description);
      this.editTitle(issueDetails.title);
      this.selectAssignee(issueDetails.assignee);
      cy.get(this.submitButton).click();
    });
  }

  getFirstListIssue() {
    return cy
      .get(this.issuesList)
      .first()
      .scrollIntoView()
      .click({ force: true });
  }

  getIssueModal() {
    return cy.get(this.issueModal);
  }

  getIssueDetailModal() {
    return cy.get(this.issueDetailModal);
  }

  addEstimation(issueDetails) {
    this.getFirstListIssue();
    this.getIssueDetailModal().within(() => {
      cy.get(this.timeTrackerStopwatch).next().contains("No time logged");
      cy.get(this.estimateField)
        .type(issueDetails.estimatedTime)
        .should("have.attr", "value", issueDetails.estimatedTime);
    });
    cy.log("Estimation added");
  }

  ensureIssueIsCreated(expectedAmountIssues, issueDetails) {
    cy.get(this.issueModal).should("not.exist");
    cy.reload();
    cy.contains("Issue has been successfully created.").should("not.exist");

    cy.get(this.backlogList)
      .should("be.visible")
      .and("have.length", 1)
      .within(() => {
        cy.get(this.issuesList)
          .should("have.length", expectedAmountIssues)
          .first()
          .find("p")
          .contains(issueDetails.title);
        cy.get(`[data-testid="avatar:${issueDetails.assignee}"]`).should(
          "be.visible"
        );
      });
  }

  ensureIssueIsVisibleOnBoard(issueTitle) {
    cy.get(this.issueDetailModal).should("not.exist");
    cy.reload();
    cy.contains(issueTitle).should("be.visible");
  }

  ensureIssueIsNotVisibleOnBoard(issueTitle) {
    cy.get(this.issueDetailModal).should("not.exist");
    cy.reload();
    cy.contains(issueTitle).should("not.exist");
  }

  validateAmountOfIssuesInBacklog(amountOfIssues) {
    cy.get(this.backlogList).within(() => {
      cy.get(this.issuesList).should("have.length", amountOfIssues);
    });
  }

  ensureCommentWasCreatedForIssue(issueTitle) {
    cy.get(this.issueCommentsList).should("contain.text", issueTitle);
  }

  addComment(comment) {
    this.getIssueDetailModal()
      .should("be.visible")
      .within(() => {
        cy.contains(this.addCommentField).click();
        cy.get(this.commentEntryField).type(comment);
        cy.contains(this.saveCommentButtonName).click().should("not.exist");
        cy.contains(this.addCommentField).should("exist");
        cy.get(this.issueCommentsList).should("contain", comment);
      });
  }

  editComment(comment, editedComment) {
    this.getIssueDetailModal().within(() => {
      cy.get(this.issueCommentsList)
        .first()
        .contains(this.editCommentButton)
        .click()
        .should("not.exist");
      cy.get(this.commentEntryField)
        .should("contain", comment)
        .clear()
        .type(editedComment);
      cy.contains(this.saveCommentButtonName).click().should("not.exist");

      cy.get(this.issueCommentsList)
        .should("contain", this.editCommentButton)
        .and("contain", editedComment);
    });
  }

  deleteComment(editedComment) {
    this.getIssueDetailModal().within(() => {
      cy.get(this.issueCommentsList).contains(this.commentDelete).click();
    });
    cy.get(this.commentDeleteConfirmationPopup)
      .should("be.visible")
      .within(() => {
        cy.contains("button", this.commentDeleteConfirm)
          .click()
          .should("not.exist");
      });
    this.getIssueDetailModal().within(() => {
      cy.contains(editedComment).should("not.exist");
    });
  }

  selectIssueType(issueType) {
    cy.get(this.issueType).click("bottomRight");
    cy.get(`[data-testid="select-option:${issueType}"]`)
      .trigger("mouseover")
      .trigger("click");
  }

  selectAssignee(assigneeName) {
    cy.get(this.assignee).click("bottomRight");
    cy.get(`[data-testid="select-option:${assigneeName}"]`).click();
  }

  editTitle(title) {
    cy.get(this.title).clear().type(title);
  }

  editDescription(description) {
    cy.get(this.descriptionField).type(description);
  }

  clickDeleteButton() {
    cy.get(this.deleteButton).click();
    cy.get(this.confirmationPopup).should("be.visible");
  }

  clickCommentSaveButton() {
    cy.contains(this.saveCommentButtonName).click();
  }

  confirmDeletion() {
    cy.get(this.confirmationPopup).within(() => {
      cy.contains("Are you sure you want to delete this issue?").should(
        "be.visible"
      );
      cy.contains("Once you delete, it's gone for good").should("be.visible");
      cy.contains(this.deleteButtonName).click();
    });
    cy.get(this.confirmationPopup).should("not.exist");
    cy.get(this.backlogList).should("be.visible");
  }

  cancelDeletion() {
    cy.get(this.confirmationPopup).within(() => {
      cy.contains("Are you sure you want to delete this issue?").should(
        "be.visible"
      );
      cy.contains("Once you delete, it's gone for good").should("be.visible");
      cy.contains(this.cancelDeletionButtonName).click();
    });
    cy.get(this.confirmationPopup).should("not.exist");
    cy.get(this.issueDetailModal).should("be.visible");
  }

  closeDetailModal() {
    cy.get(this.issueDetailModal)
      .get(this.closeDetailModalButton)
      .first()
      .click();
    cy.get(this.issueDetailModal).should("not.exist");
  }
}

export default new IssueModal();
