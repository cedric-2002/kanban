const ComponentState = require("./ComponentState");
const path = require("path");
const fs = require("fs");

module.exports = {
  onCreate(input) {
    this.state = new ComponentState();
    this.loadInitialData();
  },

  loadInitialData() {
    const jsonPath = path.join(__dirname, "../Columns/data.json");

    let data;
    try {
      const rawData = fs.readFileSync(jsonPath, "utf8");
      data = JSON.parse(rawData);

      
      if (!data || typeof data !== "object" || !Array.isArray(data.columns)) {
        console.error("Warnung: `data.columns` nicht gefunden, Initialisiere mit Standardwert.");
        data = { columns: [], filters: [] };
      }

     
      const flattenedColumns = data.columns.flatMap(board => {
        if (!board.columns || typeof board.columns !== "object") {
          console.warn(`Warnung: Board "${board.Board || "Unbekannt"}" hat keine gültigen columns.`);
          return []; 
        }
        return Object.values(board.columns);
      });

      this.state.loadData({ columns: flattenedColumns, filters: data.filters || [] });

    } catch (error) {
      console.error("Fehler beim Laden der JSON-Datei:", error);
      this.state.loadData({ columns: [], filters: [] });
    }
  },

  addBoard() {
    this.state.addBoard();
    this.saveDataToServer();
  },

  deleteBoard(index) {
    this.state.deleteBoard(index);
    this.saveDataToServer();
  },

  addFilter() {
    this.state.addFilter();
    this.saveDataToServer();
  },

  deleteFilter(index) {
    this.state.deleteFilter(index);
    this.saveDataToServer();
  },

  addColumn() {
    this.state.addColumn();
    this.saveDataToServer();
  },

  deleteColumn(index) {
    this.state.deleteColumn(index);
    this.saveDataToServer();
  },

  saveDataToServer() {
    const jsonPath = path.join(__dirname, "../Columns/data.json");

    const dataToSave = {
      columns: this.state.boards || [],  
      filters: this.state.filters || []
    };

    try {
      fs.writeFileSync(jsonPath, JSON.stringify(dataToSave, null, 2));
      console.log("Daten erfolgreich gespeichert.");
    } catch (error) {
      console.error("Fehler beim Speichern der Daten:", error);
    }
  },
};