import ComponentState from "./ComponentState.js";

module.exports = class {
    onCreate(input) {
      this.state = {
        activeFilters: [], // Liste der aktiven Filter
        showFilters: false // Sichtbarkeit des Filtercontainers
      };
    }
  
    toggleFilter(filterName) {
      const { activeFilters } = this.state;
      if (activeFilters.includes(filterName)) {
        this.state.activeFilters = activeFilters.filter(filter => filter !== filterName);
      } else {
        this.state.activeFilters = [...activeFilters, filterName];
      }
      this.updateTicketVisibility();
    }
  
    toggleFilterContainer() {
      this.state.showFilters = !this.state.showFilters;
    }
  
    updateTicketVisibility() {
      const tickets = document.querySelectorAll('.ticket');
      tickets.forEach(ticket => {
        const ticketFilters = ticket.getAttribute('data-filters').split(',');
        const hasActiveFilter = this.state.activeFilters.some(filter => ticketFilters.includes(filter));
  
        if (hasActiveFilter || this.state.activeFilters.length === 0) {
          ticket.style.display = 'block';
        } else {
          ticket.style.display = 'none';
        }
      });
    }
  };
  