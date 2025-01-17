module.exports = class ColumnsComponentState {
  constructor() {
    this.columns = [];
    this.filters = [];
  }

  loadData(data) {
    if (!data || typeof data !== "object") {
      console.error("Fehler: Ungültige Datenstruktur in `loadData()`");
      data = { columns: [], filters: [] };
    }

    this.columns = Array.isArray(data.columns) ? data.columns : [];
    this.filters = Array.isArray(data.filters) ? data.filters : [];
  }

  addColumn(name) {
    if (!name) {
      console.warn("Spaltenname ist erforderlich.");
      return;
    }

    const newColumn = {
      name,
      maxTickets: "unbegrenzt",
      ticketOrder: "normal",
      notifyOverflow: false,
      hideColumn: false,
      filters: [],
    };

    this.columns.push(newColumn);
    console.log(`Neue Spalte hinzugefügt: ${name}`);
  }

  deleteColumn(index) {
    if (index >= 0 && index < this.columns.length) {
      console.log(`Spalte entfernt: ${this.columns[index].name}`);
      this.columns.splice(index, 1);
    } else {
      console.warn("Ungültiger Spaltenindex.");
    }
  }

  addFilter(name) {
    if (!name) {
      console.warn("Filtername ist erforderlich.");
      return;
    }

    this.filters.push({ name, quickFilter: false });
    console.log(`Neuer Filter hinzugefügt: ${name}`);
  }


  deleteFilter(index) {
    if (index >= 0 && index < this.filters.length) {
      console.log(`Filter entfernt: ${this.filters[index].name}`);
      this.filters.splice(index, 1);
    } else {
      console.warn("Ungültiger Filterindex.");
    }
  }
};