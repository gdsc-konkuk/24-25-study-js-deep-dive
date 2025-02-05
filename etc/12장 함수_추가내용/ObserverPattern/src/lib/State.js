export class State {
  constructor(initialData) {
    this.observers = [];
    this.state = initialData;
  }

  subscribe(observer) {
    this.observers.push(observer);
  }

  unsubscribe(observer) {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  notify(data) {
    this.observers.forEach((observer) => observer.update(data));
  }

  setState(key, value) {
    this.state[key] = value;
    this.notify(this.state);
  }
}
