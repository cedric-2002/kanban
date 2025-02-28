module.exports = {
  onCreate(input) {
    this.state = {
      title: input.title || "Kanban Board",
      sidebarOpen: false
    };
  },

  onMount() {
    // DOM-Manipulation nur im Browser ausführen!
    if (typeof window !== "undefined") {
      console.log("Header Component geladen!");

      const toggleButton = document.getElementById("toggleSidebar");
      if (toggleButton) {
        toggleButton.addEventListener("click", () => {
          this.toggleSidebar();
        });
      }
    }
  },

  toggleSidebar() {
    console.log("Sidebar wird umgeschaltet.");
    this.state.sidebarOpen = !this.state.sidebarOpen;
  }
};