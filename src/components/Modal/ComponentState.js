export default class ComponentState {
    constructor(isOpen, content) {
      this.isOpen = isOpen || false;
      this.content = content || "";
    }
  }
  