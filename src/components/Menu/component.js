module.exports = {
    onCreate() {
      const currentYear = new Date().getFullYear();
      this.state = {
        year: currentYear,
      };
    },
  };
  