const fs = require("fs");
const path = require("path");


const isBrowser = typeof window !== "undefined";

class ColumnsComponentState {
  constructor() {
    this.columns = [];
    this.filters = [];
    if (!isBrowser) {
      this.loadDataFromFile();
    }
  }

  loadData(data) {
    if (!data || typeof data !== "object") {
      console.error("Fehler: Ungültige Datenstruktur in `loadData()`");
      data = { columns: [], filters: [] };
    }
    this.columns = Array.isArray(data.columns) ? data.columns : [];
    this.filters = Array.isArray(data.filters) ? data.filters : [];
  }

  // Nur auf dem Server JSON-Datei laden
  loadDataFromFile() {
    try {
      const jsonPath = path.join(__dirname, "../Columns/data.json");
      const rawData = fs.readFileSync(jsonPath, "utf8");
      this.loadData(JSON.parse(rawData));
    } catch (error) {
      console.error("Fehler beim Laden von data.json:", error);
    }
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
      tickets: []
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
}

// **Spalten-Logik für das Drag-and-Drop und Sortierung**
class ColumnsComponent {
  constructor(input) {
    this.state = {
      columns: Array.isArray(input?.columns) ? input.columns : [],
      filters: Array.isArray(input?.filters) ? input.filters : [],
      draggedElement: null
    };
  }

  handleDragOver(event) {
    event.preventDefault();
  }

  handleDrop(event) {
    event.preventDefault();
    const columnName = event.dataTransfer.getData("text/plain");
    const targetColumn = event.target.closest(".kanban-block-body");

    if (this.state.draggedElement && targetColumn) {
      targetColumn.appendChild(this.state.draggedElement);
      this.state.draggedElement = null;
      this.updateTicketCount();
    }
  }

  handleSortClick(index) {
    if (index < 0 || index >= this.state.columns.length) {
      console.warn(`Ungültiger Index ${index} in handleSortClick.`);
      return;
    }

    const column = this.state.columns[index];
    column.sortState = (column.sortState || 0) + 1;
    if (column.sortState > 2) {
      column.sortState = 0;
    }
    this.sortColumn(index, column.sortState);
  }

  sortColumn(index, sortOrder) {
    if (index < 0 || index >= this.state.columns.length) {
      console.warn(`Ungültiger Index ${index} in sortColumn.`);
      return;
    }

    const column = this.state.columns[index];
    const tickets = Array.isArray(column.tickets) ? column.tickets : [];

    tickets.sort((a, b) => {
      const priorityA = parseInt(a.priority || 0, 10);
      const priorityB = parseInt(b.priority || 0, 10);

      if (sortOrder === 1) {
        return priorityB - priorityA;
      } else if (sortOrder === 2) {
        return priorityA - priorityB;
      } else {
        return (a.originalOrder || 0) - (b.originalOrder || 0);
      }
    });

    column.tickets = tickets;
  }

  updateTicketCount() {
    this.state.columns.forEach((board) => {
      if (!board.columns || typeof board.columns !== "object") {
        board.columns = {};
      }

      let totalTickets = 0;

      Object.values(board.columns).forEach((column) => {
        if (!column.tickets || !Array.isArray(column.tickets)) {
          column.tickets = [];
        }

        totalTickets += column.tickets.length;

        if (column.tickets.length >= parseInt(column.maxTickets || "9999", 10)) {
          column.style = "red";
        } else {
          column.style = "";
        }
      });

      board.totalTickets = totalTickets;
    });
  }
}

// **Exportieren für Node.js**
if (typeof module !== "undefined" && module.exports) {
  module.exports = { ColumnsComponent, ColumnsComponentState };
}