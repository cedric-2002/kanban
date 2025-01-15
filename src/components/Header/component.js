import ComponentState from "./ComponentState";

module.exports = {
    onCreate(input) {
      this.state = {
        title: input.title || "Kanban Board"
      };
    }
  };
  