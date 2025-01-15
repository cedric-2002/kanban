module.exports = class {
    onCreate() {
      this.state = {
        columns: [] // Initial leer
      };
    }
  
    allowDrop(event) {
      event.preventDefault();
    }
  
    handleDrop(event) {
      event.preventDefault();
      const columnName = event.dataTransfer.getData('text/plain');
      
      // Füge eine neue Spalte hinzu
      this.state.columns.push({ name: columnName });
      this.update();
    }
  };
  