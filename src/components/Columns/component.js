const ComponentState = require("./ComponentState");

module.exports = class {
  onCreate(input) {
    this.state = {
      columns: Array.isArray(input.data?.columns) ? input.data.columns : [],
      filters: Array.isArray(input.data?.filters) ? input.data.filters : [],
      draggedElement: null,
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
};