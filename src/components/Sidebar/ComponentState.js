module.exports = class ComponentState {
  constructor() {
    this.boards = []; // Boards
    this.filters = []; // Filter
    this.isOpen = false; // Sidebar offen oder geschlossen
  }

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }

  loadData(data) {
    if (!data || typeof data !== "object") {
      console.error("Fehler: Ungültige Datenstruktur in `loadData()`");
      data = { columns: [], filters: [] };
    }

    this.boards = Array.isArray(data.columns) ? data.columns : [];
    this.filters = Array.isArray(data.filters) ? data.filters : [];

    
    if (this.boards.length > 0 && this.boards[0].columns) {
      this.boards.forEach(board => {
        if (!board.columns || typeof board.columns !== "object") {
          board.columns = {}; 
        }
      });
    }
  }

  addBoard() {
    const newBoard = {
      Board: "Neues Board",
      maxTickets: "unbegrenzt",
      showBoardName: true,
      filters: [],
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
    if (index >= 0 && index < this.boards.length) {
      this.boards.splice(index, 1);
    } else {
      console.warn(`Warnung: Board-Index ${index} ist ungültig.`);
    }
  }

  addFilter() {
    this.filters.push({
      name: "Neuer Filter",
      quickFilter: false,
    });
  }

  deleteFilter(index) {
    if (index >= 0 && index < this.filters.length) {
      this.filters.splice(index, 1);
    } else {
      console.warn(`Warnung: Filter-Index ${index} ist ungültig.`);
    }
  }

  addColumn(boardIndex) {
    if (boardIndex >= 0 && boardIndex < this.boards.length) {
      const newColumn = {
        name: "Neue Spalte",
        maxTickets: "unbegrenzt",
        ticketOrder: "normal",
        notifyOverflow: false,
        hideColumn: false,
      };
      const board = this.boards[boardIndex];
      const columnKey = `Column_${Object.keys(board.columns).length + 1}`;
      board.columns[columnKey] = newColumn;
    } else {
      console.warn(`Warnung: Board-Index ${boardIndex} ist ungültig.`);
    }
  }

  deleteColumn(boardIndex, columnKey) {
    if (boardIndex >= 0 && boardIndex < this.boards.length) {
      const board = this.boards[boardIndex];
      if (board.columns && board.columns[columnKey]) {
        delete board.columns[columnKey];
      } else {
        console.warn(`Warnung: Spalte ${columnKey} existiert nicht.`);
      }
    } else {
      console.warn(`Warnung: Board-Index ${boardIndex} ist ungültig.`);
    }
  }
};