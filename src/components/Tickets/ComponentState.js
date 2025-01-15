import filters from "../Columns/data.json";
  onMount() {
    this.state = {
      tickets: JSON.parse(localStorage.getItem('tickets'))?.Ticket || [],
      activeFilters: []
    };
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

    localStorage.setItem(
      'tickets',
      JSON.stringify({ Ticket: updatedTickets })
    );

    setTimeout(() => {
      alert("Filter erfolgreich gespeichert!");
    }, 500);
  }
