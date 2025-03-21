module.exports = {
  onCreate(input) {
    this.state = {
      title: input.title || "Kanban Board",
      sidebarOpen: false
    };
  },

  onMount() {
    console.log("Header Component wurde geladen!");

    setTimeout(() => {
      const toggleButton = document.getElementById("toggleSidebar");
      console.log("Toggle-Button gefunden:", toggleButton);

      if (toggleButton) {
        toggleButton.addEventListener("click", () => {
          console.log("Zahnrad wurde geklickt!");
          this.toggleSidebar();
        });
      } else {
        console.error("Fehler: Toggle-Button nicht gefunden!");
      }
    }, 0); // Wartet auf DOM-Rendering
  },

  toggleSidebar() {
    console.log("Sidebar wird umgeschaltet...");
    this.state.sidebarOpen = !this.state.sidebarOpen;

    setTimeout(() => {
      const sidebar = document.querySelector("#content-wrapper");
      console.log("Sidebar-Element:", sidebar);

      if (sidebar) {
        sidebar.classList.toggle("shifted", this.state.sidebarOpen);
      } else {
        console.error("Fehler: Sidebar nicht gefunden!");
      }
    }, 0);
  }
};

console.log("component.js wurde geladen!");