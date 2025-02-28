module.exports = {
  onCreate() {
    this.state = {
      isOpen: false,  // Sidebar beginnt geschlossen
      boards: [
        { Board: "Projekt A" },
        { Board: "Projekt B" },
        { Board: "Projekt C" }
      ],
      columns: [
        { name: "To Do" },
        { name: "In Progress" },
        { name: "Done" }
      ],
      filters: [
        { name: "Wichtig" },
        { name: "Bug" }
      ]
    };
  },

  toggleSidebar() {
    this.state.isOpen = !this.state.isOpen;
  },

  addBoard() {
    const newBoardName = prompt("Name des neuen Boards:");
    if (newBoardName) {
      this.state.boards.push({ Board: newBoardName });
    }
  },

  editBoard(event, index) {
    const newBoardName = prompt("Neuer Name für das Board:", this.state.boards[index].Board);
    if (newBoardName) {
      this.state.boards[index].Board = newBoardName;
    }
  },

  deleteBoard(event, index) {
    if (confirm("Dieses Board wirklich löschen?")) {
      this.state.boards.splice(index, 1);
    }
  },

  addFilter() {
    const newFilter = prompt("Neuer Filtername:");
    if (newFilter) {
      this.state.filters.push({ name: newFilter });
    }
  },

  editFilter(event, index) {
    const newFilter = prompt("Neuer Name für den Filter:", this.state.filters[index].name);
    if (newFilter) {
      this.state.filters[index].name = newFilter;
    }
  },

  deleteFilter(event, index) {
    if (confirm("Diesen Filter wirklich löschen?")) {
      this.state.filters.splice(index, 1);
    }
  }
};