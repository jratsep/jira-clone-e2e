class IssueTimeTracking {
  timeTrackingModal = '[data-testid="modal:tracking"]';
  timeTrackingButton = '[data-testid="icon:stopwatch"]';
  noTimeLogged = "No time logged";
  inputFieldTime = 'input[placeholder="Number"]';
  remainingTimeExpected = "h remaining";
  estimatedTimeExpected = "h estimated";
  loggedTimeExpectedText = "h logged";

  openTimeTrackingAndClearLoggedTime() {
    cy.get(this.timeTrackingButton).click();
    cy.get(this.timeTrackingModal)
      .should("be.visible")
      .within(() => {
        cy.get(this.inputFieldTime).eq(0).clear();
        cy.get(this.inputFieldTime).eq(1).clear();
        cy.contains("button", "Done").click();
      });
  }
  openTimeTrackingAndChangeLoggedTime(loggedTime, remainingTime) {
    cy.get(this.timeTrackingButton).click();
    cy.get(this.timeTrackingModal)
      .should("be.visible")
      .within(() => {
        cy.get(this.inputFieldTime).eq(0).clear().type(loggedTime);
        cy.get(this.inputFieldTime).eq(1).clear().type(remainingTime);
        cy.contains("button", "Done").click();
      });
  }
  // Add time with validation'
  addTimeAndValidate(timeValue) {
    cy.get(this.inputFieldTime)
      .clear()
      .type(timeValue)
      .should("have.value", timeValue);
  }
  //
  clearTimeField() {
    cy.get(this.inputFieldTime).clear();
  }
  // Time validation
  validateEstimatedTimeShouldBeVisible(timeValue) {
    cy.contains(`${timeValue}${this.estimatedTimeExpected}`).should(
      "be.visible"
    );
  }
  validateEstimatedTimeShouldNotExist(timeValue) {
    cy.contains(`${timeValue}${this.estimatedTimeExpected}`).should(
      "not.exist"
    );
  }

  validateLoggedTimeShouldBeVisible(timeValue) {
    cy.contains(`${timeValue}${this.loggedTimeExpected}`).should("be.visible");
  }
  validateLoggedTimeShouldNotExist(timeValue) {
    cy.contains(`${timeValue}${this.loggedTimeExpected}`).should("not.exist");
  }
  validateRemainingTimeShouldBeVisible(timeValue) {
    cy.contains(`${timeValue}${this.remainingTimeExpected}`).should(
      "be.visible"
    );
  }
  validateRemainingTimeShouldNotExist(timeValue) {
    cy.contains(`${timeValue}${this.remainingTimeExpected}`).should(
      "not.exist"
    );
  }
  // No time logged Validation
  validateNoTimeLoggedShouldBeVisible() {
    cy.contains(this.noTimeLogged).should("be.visible");
  }

  validateNoTimeLoggedShouldNotExist() {
    cy.contains(this.noTimeLogged).should("not.exist");
  }
}

export default IssueTimeTracking;
