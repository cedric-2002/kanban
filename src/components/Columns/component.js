import ComponentState from "./ComponentState";

module.exports = class {
    onCreate(input) {
      this.state = {
        columns: input.data.columns || [],
        filters: input.data.filters || [],
        draggedElement: null,
      };
    }
  
    handleDragOver(event) {
      event.preventDefault();
    }
  
    handleDrop(event) {
      event.preventDefault();
      const columnName = event.dataTransfer.getData('text/plain');
      const targetColumn = event.target.closest('.kanban-block-body');
  
      if (this.state.draggedElement && targetColumn) {
        targetColumn.appendChild(this.state.draggedElement);
        this.state.draggedElement = null;
        this.updateTicketCount();
      }
    }
  
    handleSortClick(index) {
      const column = this.state.columns[index];
      column.sortState = (column.sortState || 0) + 1;
      if (column.sortState > 2) {
        column.sortState = 0;
      }
      this.sortColumn(index, column.sortState);
    }
  
    sortColumn(index, sortOrder) {
      const column = this.state.columns[index];
      const tickets = Array.from(column.tickets);
  
      tickets.sort((a, b) => {
        const priorityA = parseInt(a.priority, 10);
        const priorityB = parseInt(b.priority, 10);
  
        if (sortOrder === 1) {
          return priorityB - priorityA;
        } else if (sortOrder === 2) {
          return priorityA - priorityB;
        } else {
          return a.originalOrder - b.originalOrder;
        }
      });
  
      column.tickets = tickets;
    }
  
    updateTicketCount() {
      this.state.columns.forEach(board => {
        let totalTickets = 0;
        board.columns.forEach(column => {
          totalTickets += column.tickets.length;
  
          if (column.tickets.length >= column.maxTickets) {
            column.style = 'red';
          } else {
            column.style = '';
          }
        });
        board.totalTickets = totalTickets;
      });
    }
  };
  