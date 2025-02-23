import { Component } from "./lib/Component.js";

export class App extends Component {
  initialState() {
    return {
      a: 30,
      b: 50,
    };
  }

  template() {
    const { a, b } = this.state.state;
    return `
      <input id="stateA" value="${a}" />
      <input id="stateB" value="${b}" />
      <p>a + b = ${a + b}</p>
    `;
  }

  setEvent() {
    const { $target, state } = this;

    $target
      .querySelector("#stateA")
      .addEventListener("change", ({ target }) => {
        state.setState("a", Number(target.value));
      });

    $target
      .querySelector("#stateB")
      .addEventListener("change", ({ target }) => {
        state.setState("b", Number(target.value));
      });
  }
}
