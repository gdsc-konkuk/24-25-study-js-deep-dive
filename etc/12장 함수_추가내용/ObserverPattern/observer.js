class Subject {
  constructor() {
    this.observers = [];
    this.state = null;
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

  setState(value) {
    this.state = value;
    this.notify(this.state);
  }
}

class Observer {
  constructor(state) {
    this.state = state;
    this.state.subscribe(this);
  }

  update(data) {
    console.log(data);
  }
}

const subject = new Subject();
const observer1 = new Observer(subject);
const observer2 = new Observer(subject);

subject.setState(1);
subject.setState(2);
