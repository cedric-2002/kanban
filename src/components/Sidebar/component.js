const fs = require('fs');
const path = require('path');

module.exports = {
  onCreate(input) {
    const allData = this.loadData();
    const boardId = input.boardId || 1; // Standardmäßig Board 1 laden
    const boardData = allData.boards.find(board => board.id === boardId);

    this.state = {
      boards: allData.boards,
      selectedBoard: boardData || null,
      columns: boardData ? boardData.columns : [],
      filters: boardData ? boardData.filters : [],
      isOpen: false
    };
  },

  loadData() {
    const filePath = path.join(__dirname, "../../data/kanban.json");
    if (!fs.existsSync(filePath)) {
      console.warn("⚠️ WARNUNG: Kanban-Daten nicht gefunden! Erstelle eine leere Datei.");
      fs.writeFileSync(filePath, JSON.stringify({ boards: [] }, null, 2));
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  },

  saveData(data) {
    const filePath = path.join(__dirname, "../../data/kanban.json");
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  },

  changeBoard(event, boardId) {
    const allData = this.loadData();
    const newBoard = allData.boards.find(b => b.id === boardId);
    if (newBoard) {
      this.state.selectedBoard = newBoard;
      this.state.columns = newBoard.columns;
      this.state.filters = newBoard.filters;
    }
  },

  addBoard() {
    const newBoardName = prompt("Name des neuen Boards:");
    if (newBoardName) {
      const allData = this.loadData();
      const newBoard = {
        id: Date.now(),
        name: newBoardName,
        columns: [],
        filters: []
      };
      allData.boards.push(newBoard);
      this.saveData(allData);
      this.state.boards = allData.boards;
    }
  },

  addColumn() {
    const newColumnName = prompt("Name der neuen Spalte:");
    if (newColumnName) {
      this.state.selectedBoard.columns.push({ id: Date.now(), name: newColumnName });
      this.saveData(this.loadData());
    }
  },

  addFilter() {
    const newFilterName = prompt("Name des neuen Filters:");
    if (newFilterName) {
      this.state.selectedBoard.filters.push({ id: Date.now(), name: newFilterName });
      this.saveData(this.loadData());
    }
  }
};