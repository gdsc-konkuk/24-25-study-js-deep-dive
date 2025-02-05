import { State } from "./State.js";

export class Component {
  constructor($target, props) {
    this.$target = $target;
    this.props = props;
    this.setup();
  }

  setup() {
    this.state = new State(this.initialState());
    this.state.subscribe(this);
    this.update();
  }

  initialState() {
    return {};
  }

  template() {
    return "";
  }

  render() {
    this.$target.innerHTML = this.template();
  }

  setEvent() {}

  mount() {}

  update() {
    this.render();
    this.setEvent();
    this.mount();
  }
}
