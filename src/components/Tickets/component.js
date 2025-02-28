const fs = require("fs");
const path = require("path");

// Prüfen, ob wir im Browser oder auf dem Server sind
const isBrowser = typeof window !== "undefined";

class ComponentState {
  constructor() {
    this.state = {
      tickets: [],
      activeFilters: [],
      filters: []
    };

    if (!isBrowser) {
      // Nur im Server-Kontext JSON-Dateien laden
      this.loadFilters();
    } else {
      this.onMount();
    }
  }

  // JSON aus Datei laden (nur für Node.js)
  loadFilters() {
    try {
      const jsonPath = path.join(__dirname, "../Columns/data.json");
      this.state.filters = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    } catch (error) {
      console.error("Fehler beim Laden von data.json:", error);
    }
  }

  // Daten aus LocalStorage abrufen (nur im Browser)
  onMount() {
    if (isBrowser) {
      const storedTickets = JSON.parse(localStorage.getItem("tickets"))?.Ticket || [];
      this.state.tickets = storedTickets;
    }
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
    this.state.tickets = this.state.tickets.map(ticket => {
      if (ticket.TicketID === ticketID) {
        return { ...ticket, Filters: selectedFilters };
      }
      return ticket;
    });

    if (isBrowser) {
      localStorage.setItem("tickets", JSON.stringify({ Ticket: this.state.tickets }));

      setTimeout(() => {
        alert("Filter erfolgreich gespeichert!");
      }, 500);
    }
  }
}

class Component {
  constructor() {
    this.state = {
      sidebarOpen: false
    };
  }

  toggleSidebar() {
    this.state.sidebarOpen = !this.state.sidebarOpen;

    if (isBrowser) {
      document.getElementById("content-wrapper").classList.toggle("shifted");
    }
  }
}

// Browser: Event-Listener für Sidebar-Button
if (isBrowser) {
  document.addEventListener("DOMContentLoaded", function () {
    const sidebarToggle = document.getElementById("toggleSidebar");
    if (sidebarToggle) {
      sidebarToggle.addEventListener("click", () => {
        document.getElementById("content-wrapper").classList.toggle("shifted");
      });
    }
  });
}

// Für Node.js & Browser kompatibel machen
if (typeof module !== "undefined" && module.exports) {
  module.exports = { Component, ComponentState };
}