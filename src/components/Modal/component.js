import ComponentState from "./ComponentState";

export default class {
  onCreate(input) {
    this.state = new ComponentState(input.isOpen, input.content);
  }

  closeModal() {
    this.state.isOpen = false;
    this.emit("close");
  }
}
