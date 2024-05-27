const { defineConfig } = require("cypress");
module.exports = defineConfig({
  projectId: "o4t7ca",
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "https://jira.ivorreic.com/project/board",
    env: {
      baseUrl: "https://jira.ivorreic.com/",
    },
    defaultCommandTimeout: 500000,
    requestTimeout: 500000,
  },
});
