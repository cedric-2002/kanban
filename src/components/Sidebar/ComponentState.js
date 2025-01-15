module.exports = class ComponentState {
    constructor() {
      this.boards = []; // Boards
      this.filters = []; // Filter
      this.columns = []; // Spalten
      this.isOpen = false; // Sidebar offen oder geschlossen
    }
  
    toggleSidebar() {
      this.isOpen = !this.isOpen;
    }
  
    loadData(data) {
      this.boards = data.columns || [];
      this.filters = data.filters || [];
      this.columns = this.boards.length > 0 ? Object.values(this.boards[0].columns) : [];
    }
  
    addBoard() {
      const newBoard = {
        Board: "Neues Board",
        columns: {
          Column_1: {
            name: "Neue Spalte",
            maxTickets: "unbegrenzt",
            ticketOrder: "normal",
            notifyOverflow: false,
            hideColumn: false,
          },
        },
      };
      this.boards.push(newBoard);
    }
  
    deleteBoard(index) {
      this.boards.splice(index, 1);
    }
  
    addFilter() {
      this.filters.push({
        name: "Neuer Filter",
        quickFilter: false,
      });
    }
  
    deleteFilter(index) {
      this.filters.splice(index, 1);
    }
  
    addColumn() {
      const newColumn = {
        name: "Neue Spalte",
        maxTickets: "unbegrenzt",
        ticketOrder: "normal",
        notifyOverflow: false,
        hideColumn: false,
      };
      this.columns.push(newColumn);
    }
  
    deleteColumn(index) {
      this.columns.splice(index, 1);
    }
  };
  