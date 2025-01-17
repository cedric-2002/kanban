module.exports = class {
  onCreate() {
    this.state = {
      sidebarOpen: false, 
    };
  }

  toggleSidebar() {
    this.state.sidebarOpen = !this.state.sidebarOpen;
  }
};