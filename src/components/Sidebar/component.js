import ComponentState from "./ComponentState";

module.exports = {
  onCreate(input) {
    this.state = new ComponentState();
    this.loadInitialData();
  },

  loadInitialData() {
    fetch("/src/components/Columns/data.json")
      .then((response) => response.json())
      .then((data) => {
        this.state.loadData(data);
      })
      .catch((error) => console.error("Fehler beim Laden der JSON-Datei:", error));
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
    const dataToSave = {
      columns: this.state.boards,
      filters: this.state.filters,
    };

    fetch("/save-columns", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSave),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          console.log("Daten erfolgreich gespeichert.");
        } else {
          console.error("Fehler beim Speichern der Daten.");
        }
      })
      .catch((error) => console.error("Fehler beim Speichern:", error));
  },
};
import ComponentState from "./ComponentState";

module.exports = {
  onCreate(input) {
    this.state = new ComponentState();
    this.loadInitialData();
  },

  loadInitialData() {
    fetch("/src/components/Columns/data.json")
      .then((response) => response.json())
      .then((data) => {
        this.state.loadData(data);
      })
      .catch((error) => console.error("Fehler beim Laden der JSON-Datei:", error));
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
    const dataToSave = {
      columns: this.state.boards,
      filters: this.state.filters,
    };

    fetch("/save-columns", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSave),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          console.log("Daten erfolgreich gespeichert.");
        } else {
          console.error("Fehler beim Speichern der Daten.");
        }
      })
      .catch((error) => console.error("Fehler beim Speichern:", error));
  },
};
