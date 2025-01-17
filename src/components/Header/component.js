const ComponentState = require("./ComponentState");

module.exports = {
    onCreate(input) {
      this.state = {
        title: input.title || "Kanban Board"
      };
    }
  };
  