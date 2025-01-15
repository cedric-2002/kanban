module.exports = class {
    onCreate() {
      this.state = {
        sidebarOpen: false, // Standardmäßig ist die Sidebar geschlossen
      };
    }
  
    toggleSidebar() {
      this.state.sidebarOpen = !this.state.sidebarOpen; // Zustand umkehren
    }
  };
  