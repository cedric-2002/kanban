class ComponentState {
  constructor() {
    this.columns = [];
    this.boards = [];
    this.filters = [];
  }

  addBoard(board) {
    this.boards.push(board);
  }

  addFilter(filter) {
    this.filters.push(filter);
  }

  setColumns(columns) {
    this.columns = columns;
  }

  getColumns() {
    return this.columns;
  }
}

module.exports = {
  onCreate(input) {
    this.state = {
      title: input.title || "Kanban Board"
    };
  },

  toggleSidebar() {
    this.emit("toggleSidebar"); 
  }
};