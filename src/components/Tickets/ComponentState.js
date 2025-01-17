const fs = require("fs");
const path = require("path");

// JSON richtig laden
let filters = [];
try {
  const jsonPath = path.join(__dirname, "../Columns/data.json");
  filters = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
} catch (error) {
  console.error("Fehler beim Laden von data.json:", error);
}

class ComponentState {
  constructor() {
    this.state = {
      tickets: [],
      activeFilters: []
    };
  }

  onMount() {
    const storedTickets = JSON.parse(localStorage.getItem("tickets"))?.Ticket || [];
    this.state.tickets = storedTickets;
  }

  openFilterModal(ticketID) {
    this.state.tickets = this.state.tickets.map(ticket => ({
      ...ticket,
      showModal: ticket.TicketID === ticketID
    }));
  }

  closeFilterModal(ticketID) {
    this.state.tickets = this.state.tickets.map(ticket => ({
      ...ticket,
      showModal: false
    }));
  }

  saveFilter(ticketID, selectedFilters) {
    const updatedTickets = this.state.tickets.map(ticket => {
      if (ticket.TicketID === ticketID) {
        return { ...ticket, Filters: selectedFilters };
      }
      return ticket;
    });

    this.state.tickets = updatedTickets;

    localStorage.setItem("tickets", JSON.stringify({ Ticket: updatedTickets }));

    setTimeout(() => {
      alert("Filter erfolgreich gespeichert!");
    }, 500);
  }
}

module.exports = new ComponentState();