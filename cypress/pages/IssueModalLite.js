class IssueModalLite {
  constructor(title, description, assignee) {
    this.title = title;
    this.description = description;
    this.assignee = assignee;
  }

  setIssueTitle() {
    cy.get('input[name="title"]').type(this.title);
  }

  setIssueDescription() {
    cy.get(".ql-editor").type(this.description);
  }

  selectAssignee() {
    cy.get('[data-testid="select:userIds"]').click();
    cy.get(`[data-testid="select-option:${this.assignee}"]`).click();
  }

  createIssue() {
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="select-option:Bug"]').click();
      this.setIssueDescription(this.description);
      this.setIssueTitle(this.title);
      this.selectAssignee(this.assignee);
      cy.get('button[type="submit"]').click();
    });
  }
}

export default IssueModalLite;
