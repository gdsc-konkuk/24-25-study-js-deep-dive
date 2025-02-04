# 26.1 함수의 구분
```js
var foo = function () {
  return 1;
}

// 일반적인 함수로서 호출
foo(); // -> 1

// 생성자 함수로서 호출
new foo(); // -> foo {}

// 메서드로서 호출
var obj = { foo: foo };
obj.foo(); // -> 1
```

ES6 이전의 모든 함수는 일반 함수로서 호출할 수 있는 것은 물론 생성자 함수로서 호출할 수 있다.
*즉, ES6 이전의 모든 함수는 `callable` 이면서 `constructor`다.* (내부 메서드 `[[Call]]`과 `[[Construct]]`를 가진다.)

```js
// 프로퍼티 f에 바인딩된 함수는 callable이며 constructor다.
var obj = {
  x: 10,
  f: function () { return this.x; }
}

// 프로퍼티 f에 바인딩된 함수를 메서드로서 호출
console.log(obj.f()); // 10

// 프로퍼티 f에 바인딩된 함수를 일반 함수로서 호출
var bar = obj.f;
console.log(bar()); // undefined

// 프로퍼티 f에 바인딩된 함수를 생성자 함수로서 호출
console.log(new obj.f()); // f {}
```

객체에 바인딩된 함수도 `constructor`이므로 `prototype` 프로퍼티를 가지며, 프로토타입 객체도 가진다.

```js
[1, 2, 3].map(function (item) {
  return item * 2;
}); // -> [2, 4, 6]
```

콜백 함수도 `constructor` 이기 때문에 불필요한 프로토타입 객체를 생성한다.

이처럼 ES6 이전의 모든 함수는 명확한 구분이 없어 생성자 함수로 호출되지 않는 경우에도 불필요하게 프로토타입 객체를 생성하고 이는 혼란과 실수를 유발한다.

따라서 ES6에서는 사용 목적에 따라 함수를 명확하게 구분한다.

**ES6에서 일반 함수와 달리 메서드와 화살표 함수는 `non-constructor`다.**

# 26.2 메서드
일반적으로 메서드는 객체에 바인딩된 함수를 의미하지만, **ES6 사양에서 메서드는 메서드 축약 표현으로 정의된 함수만을 의미한다.**

```js
const obj = {
  x: 1,
  foo() { return this.x; }, // foo는 메서드 축약 표현으로 작성되었으므로 ES6 메서드
  bar: function() { return this.x; } // bar는 메서드 축약 표현이 아니므로 일반 함수다.
};

console.log(obj.foo()); // 1
console.log(obj.bar()); // 1
```

ES6 메서드는 인스턴스를 생성할 수 없는 `non-constructor` 이다. 따라서 생성자 함수로 호출할 수 없고, `prototype` 프로퍼티도 없으며 프로토타입도 생성하지 않는다.

```js
new obj.foo(); // -> TypeError: obj.foo is not a constructor
new obj.bar(); // -> bar {}
```

표준 빌트인 객체가 제공하는 프로토타입 메서드와 정적 메서드는 모두 `non constructor`다.

```js
String.prototype.toUpperCase.prototype; // -> undefined
String.fromCharCode.prototype // -> undefined

Number.prototype.toFixed.prototype; // -> undefined
Number.isFinite.prototype; // -> undefined

Array.prototype.map.prototype; // -> undefined
Array.from.prototype; // -> undefined
```

ES6 메서드는 자신을 바인딩한 객체를 가리키는 내부 슬롯 `[[HomeObject]]`를 갖고, `super` 키워드를 사용할 수 있다.

```js
const base = {
  name: 'Lee',
  sayHi() {
    return `Hi! ${this.name}`;
  }
}

const derived = {
  __proto__: base,
  // sayHi는 ES6 메서드 이므로 [[HomeObject]]를 갖는다.
  // sayHi의 [[HomeObject]]는 derived.prototype을 가리킨다.
  // super는 sayHi의 [[Homeobject]]의 프로토타입인 base.prototype을 가리킨다.
  sayHi() {
    return `${super.sayHi()}. how are you doing?`;
  }
}

console.log(derived.sayHi()); // Hi! Lee. how are you doing?
```

이에 반해 ES6 메서드가 아닌 함수는 내부 슬롯 `[[HomeObject]]`가 존재하지 않기 때문에 `super` 키워드를 사용할 수 없다.

이처럼 ES6 메서드는 일반적으로 생각되어지는 메서드에 맞게 본연의 기능인 `super` 를 추가하고 의미적으로 맞지 않는 `constructor` 는 제거했다. **따라서 메서드를 정의할 때 프로퍼티 값으로 익명 함수 표현식을 할당하는 ES6 이전의 방식은 사용하지 않는 것이 좋다.**

# 26.3 화살표 함수
화살표 함수를 통해 기존의 함수 정의 방식보다 간략하게 함수를 정의할 수 있다. 화살표 함수는 표현만 간략한 것이 아니라 내부 동작도 기존의 함수보다 간략하다.

**특히 화살표 함수는 콜백 함수 내부에서 `this`가 전역 객체를 가리키는 문제를 해결하기 위한 대안으로 유용하다.**

## 26.3.1 화살표 함수 정의
문법
### 함수 정의
```js
const multiply = (x, y) => x * y;
multiply(2, 3); // -> 6
```

함수 선언문이 아닌 함수 표현식으로만 정의, 호출방식은 기존 함수와 동일하다.

### 매개변수 선언
```js
const arrow = (x, y) => { ... };
// 매개변수가 여러 개인 경우 소괄호 () 안에 매개 변수 선언

const arrow = x => { ... };
// 매개변수가 하나인 경우 소괄호 () 생략 가능

const arrow = () => { ... };
// 매개변수가 없어도 소괄호 ()는 생략 불가능
```

### 함수 몸체 정의
```js
// concise body
const power = x => x ** 2;
power(2); // -> 4
// 함수 몸체가 하나의 문으로 구성된다면 중괄호 {} 생략 가능
// 이때 내부의 문이 값으로 평가될 수 있는 표현식인 문이라면 암묵적으로 반환

// 위 표현은 다음과 동일
// block body
const power = x => { return x ** 2; };

---

const arrow = () => const x = 1; // SyntaxError: Unexpected token 'const'

// 위 표현은 다음과 같이 해석된다.
const arrow = () => { return const x = 1; };
// 함수 몸체 내부의 문이 표현식이 아닌 문이라면 반환할 수 없으므로 에러 발생
// 따라서 함수 몸체가 하나의 문이라도 표현식이 아닌 문이라면 중괄호 생략 불가능

const arrow = () => { const x = 1; }; // GOOD
```

```js
const create = (id, content) => ({ id, content });
create(1, 'JavaScript'); // -> {id: 1, content: "JavaScript"}

// 위 표현은 다음과 동일하다.
const create = (id, content) => { return {id, content }; };
```

객체 리터럴을 반환하는 경우 객체 리터럴의 중괄호 {}를 함수 몸체를 감싸는 중괄호 {}로 잘못 해석하므로 반드시 소괄호 ()로 감싸 주어야한다.

```js
const sum = (a, b) => {
  const result = a + b;
  return result;
};
```

함수 몸체가 여러 개의 문으로 구성된다면 함수 몸체를 감싸는 중괄호 {}를 생략할 수 없으며, 반환값이 있다면 명시적으로 반환해야 한다.

```js
// ES5
[1, 2, 3].map(function (v) {
  return v * 2;
});

// ES6
[1, 2, 3].map(v => v * 2); // -> [2, 4, 6]
```

화살표 함수도 일급 객체이므로 고차함수에 인수로 전달가능, 일반적 함수 표현식보다 표현 간결하고 가독성이 좋다.

## 26.3.2 화살표 함수와 일반 함수의 차이
### 01. 화살표 함수는 인스턴스를 생성할 수 없는 `non-constructor` 다.
```js
const Foo = () => {};

// 화살표 함수는 생성자 함수로서 호출할 수 없다.
new Foo(); // TypeError: Foo is not a constructor

// 화살표 함수는 prototype 프로퍼티가 없다.
Foo.hasOwnProperty('prototype'); // -> false
```

화살표 함수는 인스턴스를 생성할 수 없으므로 `prototype` 프로퍼티가 없고 프로토타입도 생성하지 않는다. 따라서 생성자 함수로 호출할 수 없다.

### 02. 중복된 매개변수 이름을 선언할 수 없다.
```js
const arrow = (a, a) => a + a;
// SyntaxError: Duplicate parameter name not allowed in this context
```

일반 함수는 `strict mode`에서만 중복된 매개변수 이름을 선언했을 때 에러가 발생하지만 화살표 함수에서는 중복된 매개변수 이름을 선언하면 에러가 발생한다.

### 03. 화살표 함수는 함수 자체의 `this`, `arguments`, `super`, `new.target` 바인딩을 갖지 않는다.
화살표 함수에서는 위 값들이 존재하지 않아 참조 시 스코프 체인을 통해 상위 스코프의 `this`, `arguments`, `super`, `new.target` 을 참조한다.

## 26.3.3 this
화살표 함수의 `this`는 콜백 함수 내부의 `this` 문제를 해결하기 위해 일반 함수의 `this`와 다르게 동작하도록 의도적으로 설계되었다.

**일반 함수의 `this` 는 함수를 정의할 때 정적으로 결정되는 것이 아닌 함수가 어떻게 호출되었는지에 따라 동적으로 결정된다.**

```js
class Prefixer {
  constructor(prefix) {
    this.prefix = prefix;
  }

  add(arr) {
    // add 메서드는 인수로 전달된 배열 arr을 순회하며 배열의 모든 요소에 prefix를 추가한다.
    // ①
    return arr.map(function (item) {
      return this.prefix + item; // ②
      // -> TypeError: Cannot read property 'prefix' of undefined
    });
  }
}

const prefixer = new Prefixer("-webkit-");
console.log(prefixer.add(["transition", "user-select"]));
```

`prefixer.add`처럼 호출했을 때 `add` 메서드는 `prefixer`에 의해 발화(호출)되었으므로 `add` 내부에서 `this`는 `prefixer` 인스턴스이다. 또한 클래스 내부의 모든 코드는 `strict mode`가 암묵적으로 적용됨을 주의하자.

하지만 `add` 메서드 내부의 `Array.prototype.map` 메서드의 콜백 함수에는 명시적인 발화 주체가 없으므로 `this`는 `undefined`이다. (원래는 전역 객체이나 `strict mode`임에 유의)

이처럼 콜백 함수의 `this`와 외부 함수의 `this`가 서로 다른 값을 가리키는 문제를 "콜백 함수 내부의 `this` 문제"라고 한다.

이를 해결하기 위해 ES6 이전에는 다음과 같은 방법들을 사용했다.

### 01. add 메서드를  호출한 prefixer 객체를 가리키는 this를 일단 회피시킨 후에 콜백 함수 내부에서 사용
```js
...
add(arr) {
  // this를 일단 회피시킨다.
  const that = this;
  return arr.map(function (item) {
    // this 대신 that을 참조한다.
    return that.prefix + ' ' + item;
  });
}
...
```

### 02. Array.prototype.map의 두 번째 인수로 add 메서드를 호출한 prefixer 객체를 가리키는 this를 전달
```js
add(arr) {
  return arr.map(function (item) {
    return this.prefix + item;
  }, this); // this에 바인딩된 값이 콜백 함수 내부의 this에 바인딩된다.
}
```

ES5에서 도입된 `Array.prototype.map` 은 콜백 함수 내부의 `this` 문제를 해결하기 위해 직접 `this` 로 사용할 객체를 전달할 수 있다.

### 03. Function.prototype.bind 메서드를 사용하여 add 메서드를 호출한 prefixer 객체를 가리키는 this를 바인딩한다.
```js
add(arr) {
  return arr.map(
    function (item) {
      return this.prefix + item;
    }.bind(this)
  ); // this에 바인딩된 값이 콜백 함수 내부의 this에 바인딩된다.
}
```

위 방법들은 여전히 유효하지만, ES6의 화살표 함수를 사용하면 간단하게 "콜백 함수 내부의 `this`문제"를 해결할 수 있다.

```js
class Prefixer {
  constructor(prefix) {
    this.prefix = prefix;
  }

  add(arr) {
    return arr.map((item) => this.prefix + item);
  }
}

const prefixer = new Prefixer("-webkit-");
console.log(prefixer.add(["transition", "user-select"]));
// ['-webkit-transition', '-webkit-user-select']
```

**화살표 함수는 함수 자체 this 바인딩이 존재하지 않으므로 내부에서 this 참조 시 상위 스코프의 this를 그대로 참조한다.**

이를 lexical this라 한다. 마치 렉시컬 스코프와 같이 화살표 함수의 this가 **정의된 위치에 의해 결정**된다는 것을 의미한다.

```js
const foo = () => console.log(this);
foo(); // window
```

전역 함수 `foo`의 상위 스코프는 전역이므로 화살표 함수 `foo`의 `this`는 전역 객체를 가리킨다.

```js
const counter = {
  num: 1,
  increase: () => ++this.num
};

console.log(counter.increase()); // NaN
```

`increase` 프로퍼티에 할당한 화살표 함수의 상위 스코프는 전역이므로 화살표 함수의 `this`는 전역 객체를 가리킨다.

화살표 함수도 `call`, `apply`, `bind` 메서드를 호출 할 수는 있지만 `this`를 교체할 수는 없다.

```js
// Bad
const person = {
  name: "Lee",
  sayHi: () => console.log(`Hi ${this.name}`),
};

// sayHi 프로퍼티에 할당된 화살표 함수 내부의 this는 자신이 정의된 person의 상위 스코프인 전역의 this를 가리킨다.
// 전역 객체를 가리키므로 브라우저에서 실행하면 this.name = window.name으로 빈 문자열을 가진다.
// 전역 객체 window에는 빌트인 프로퍼티 name이 존재한다.

person.sayHi(); // Hi

---

// Good
const person = {
  name: "Lee",
  sayHi() {
    console.log(`Hi ${this.name}`);
  },
};

person.sayHi(); // Hi Lee
```

화살표 함수 내부의 `this`는 메서드를 호출한 객체인 `person`을 가리키지 않고 상위 스코프인 전역의 `this`가 가리키는 전역 객체를 가리킨다. 

따라서 화살표 함수로 메서드를 정의하는 것은 바람직 하지 않고, 메서드를 정의할 때는 ES6 메서드 축약 표현으로 정의한 ES6 메서드를 사용하는 것이 좋다.

```js
// Bad
function Person(name) {
  this.name = name;
}

Person.prototype.sayHi = () => console.log(`Hi ${this.name}`);

const person = new Person("Lee");
person.sayHi(); // Hi

---

// Good
function Person(name) {
  this.name = name;
}

Person.prototype.sayHi = function () {
  console.log(`Hi ${this.name}`);
};

const person = new Person("Lee");
person.sayHi(); // Hi Lee
```

프로토타입 객체의 프로퍼티에 화살표 함수를 할당하는 경우에도 동일한 문제가 발생한다.

프로퍼티를 동적 추가할 때는 ES6 메서드 축약 표현이 불가능하므로 일반 함수를 할당하자.

```js
function Person(name) {
  this.name = name;
}

Person.prototype = {
  // constructor 프로퍼티와 생성자 함수 간의 연결을 재설정
  constructor: Person,
  sayHi() {
    console.log(`Hi ${this.name}`);
  },
};

const person = new Person("Lee");
person.sayHi(); // Hi Lee
```

일반 함수가 아닌 ES6 메서드를 동적 추가하고 싶다면 위처럼 객체 바인딩을 통해 연결을 재설정하자.

```js
// Bad
class Person {
  // 클래스 필드 정의
  name = 'Lee';
  sayHi = () => console.log(`Hi ${this.name}`);
}

const person = new Person();
person.sayHi(); // Hi Lee
```

클래스 필드 정의를 사용해 클래스 필드에 화살표 함수를 할당할 수도 있다.

이때 sayHi 클래스 필드에 할당한 화살표 함수의 상위 스코프는 인스턴스 프로퍼티이므로 다음과 같은 의미이다.

```js
class Person {
  constructor() {
    this.name = 'Lee';
    // 클래스가 생성한 인스턴스(this)의 sayHi 프로퍼티에 화살표 함수를 할당한다.
    // 따라서 sayHi 프로퍼티는 인스턴스 프로퍼티다.
    this.sayHi = () => console.log(`Hi ${this.name}`);
  }
}
```

`sayHi` 클래스 필드에 할당한 화살표 함수의 상위 스코프는 `constructor`이고, `constructor` 내부의 `this` 바인딩은 클래스가 생성한 인스턴스를 가리키므로 `sayHi` 클래스 필드에 할당한 화살표 함수 내부의 `this` 또한 클래스가 생성한 인스턴스를 가리킨다.

```js
// Good
class Person {
  // 클래스 필드 정의
  name = 'Lee';

  sayHi() { console.log(`Hi ${this.name}`)};
}

const person = new Person();
person.sayHi(); // Hi Lee
```

하지만 클래스 필드에 할당한 화살표 함수는 프로토타입 메서드가 아닌 인스턴스 메서드가 된다. 따라서 효율을 위해 ES6 메서드를 사용하는 것이 좋다.

## 26.3.4 super
화살표 함수는 `super` 바인딩을 갖지 않으므로 `this`와 마찬가지로 상위 스코프의 `super`를 참조한다.

```js
class Base {
  constructor(name) {
    this.name = name;
  }

  sayHi() {
    return `Hi! ${this.name}`;
  }
}

class Derived extends Base {
  // 화살표 함수의 super는 상위 스코프인 constructor의 super를 가리킨다.
  sayHi = () => `${super.sayHi()} how are you doing?`;
}

const derived = new Derived("Lee");
console.log(derived.sayHi()); // Hi! Lee how are you doing?
```

super는 내부 슬롯 `[[HomeObject]]` 를 갖는 ES6 메서드에서만 사용할 수 있다.

화살표 함수는 ES6 메서드는 아니지만 함수 자체의 `super` 바인딩을 갖지 않으므로 에러가 발생하지 않고 상위 스코프인 `constructor` 의 `super` 바인딩을 참조한다.

## 26.3.5 arguments
```js
(function () {
  // 화살표 함수 foo의 arguments는 상위 스코프인 즉시 실행 함수의 arguments를 가리킨다.
  const foo = () => console.log(arguments); // [Arguments] { '0': 1, '1': 2 }
  foo(3, 4);
})(1, 2);

// 화살표 함수 foo의 arguments는 상위 스코프인 전역의 arguments를 가리킨다.
// 하지만 전역에는 arguments 객체가 존재하지 않는다. arguments 객체는 함수 내부에서만 유효하다.
const foo = () => console.log(arguments);
foo(1, 2); // ReferenceError: arguments is not defined
```

마찬가지로 `arguments` 바인딩도 갖지 않고 따라서 상위 스코프의 `arguments`를 참조한다.

이는 화살표 함수 자신에게 전달된 인수 목록을 확인할 수 없고 상위 함수의 인수 목록만 참조할 수 있다는 뜻이므로 좋지 않다.

따라서 화살표 함수로 가변 인자 함수를 구현할 때는 반드시 `Rest 파라미터`를 사용해야 한다.

# 26.4 Rest 파라미터
## 26.4.1 기본 문법
Rest 파라미터(나머지 매개변수)는 매개변수 이름앞에 새개의 점 ... 을 붙여서 정의한다.

Rest 파라미터는 함수에 전달된 인수들의 목록을 배열로 전달받는다.

```js
function foo(...rest) {
  // 매개변수 rest는 인수들의 목록을 배열로 전달받는 Rest 파라미터다.
  console.log(rest); // [ 1, 2, 3, 4, 5 ]
}

foo(1, 2, 3, 4, 5);
```

일반 매개변수와 `Rest` 파라미터는 함께 사용가능하며, 함수에 전달된 인수들은 매개변수와 `Rest`파라미터에 순차적으로 할당된다.

```js
function foo(param, ...rest) {
  console.log(param); // 1
  console.log(rest); // [ 2, 3, 4, 5 ]
}
foo(1, 2, 3, 4, 5);
```

`Rest` 파라미터는 이름 그대로 먼저 선언된 매개변수에 할당된 인수를 제외한 나머지 인수들로 구성된 배열이 할당된다.

따라서 **`Rest` 파라미터는 반드시 마지막 파라미터이어야 한다.**

```js
function foo(...rest, param1, param1) { }

foo(1, 2, 3, 4, 5);
// SyntaxError: Rest parameter must be last formal parameter
```

`Rest` 파라미터는 단 하나만 선언할 수 있다.

```js
function foo(...rest) {}
console.log(foo.length); // 0

function bar(x, ...rest) {}
console.log(bar.length); // 1

function baz(x, y, ...rest) {}
console.log(baz.length); // 2
```


`Rest` 파라미터는 함수 정의 시 선언한 매개변수 개수를 나타내는 함수 객체의 `length` 프로퍼티에 영향을 주지 않는다.

## 26.4.2 Rest 파라미터와 arguments 객체
`arguments` 객체는 유사 배열 객체이므로 배열 메서드를 사용하려면 `Function.prototype.call`이나 `Function.prototype.apply` 메서드를 사용해 배열로 변환해야하는 번거로움이 존재했다.

```js
function sum(...args) {
  // Rest 파라미터 args에는 배열 [1, 2, 3, 4, 5]가 할당된다.
  return args.reduce((pre, cur) => pre + cur, 0);
}
console.log(sum(1, 2, 3, 4, 5)); // 15
```

하지만 ES6에서는 Rest 파라미터를 통해 배열로 직접 전달받을 수 있으므로 바로 배열 메서드를 사용할 수 있다.

함수와 ES6 메서드는 Rest 파라미터와 `arguements` 객체를 모두 사용할 수 있지만, 화살표 함수는 `arguments` 객체를 갖지 않으므로 반드시 Rest 파라미터를 사용해야한다.

# 26.5 매개변수 기본값
자바스크립트 엔진은 매개변수의 개수와 인수 개수를 체크하지 않으므로 의도치 않은 결과가 나올 수 있다.

```js
function sum(x, y) {
  // 인수가 전달되지 않아 매개변수의 값이 undefined인 경우 기본값을 할당한다.
  x = x || 0;
  y = y || 0;

  return x + y;
}

console.log(sum(1, 2)); // 3
console.log(sum(1)); // 1
```

따라서 이런 방어 코드가 필요하다.

```js
function sum(x = 0, y = 0) {
  return x + y;
}

console.log(sum(1, 2)); // 3
console.log(sum(1)); // 1
```

ES6의 매개변수 기본값을 사용하면 인수 체크 및 초기화를 간소화 할 수 있다.

```js
function logName(name = "Lee") {
  console.log(name);
}

logName(); // Lee
logName(undefined); // Lee
logName(null); // null
```

매개변수 기본값은 매개변수에 인수를 전달하지 않은 경우와 undefined를 전달한 경우에만 유효하다.

```js
function foo(...rest = []) {
  console.log(rest);
}
// SyntaxError: Rest parameter may not have a default initializer
```

**Rest 파라미터에는 기본값을 저장할 수 없다.**

```js
function sum(x, y = 0) {
  console.log(arguments);
}

console.log(sum.length); // 1

sum(1); //Arguments { '0': 1 }
sum(1, 2); //Arguments { '0': 1, '1':2 }
```

매개변수 기본값은 함수 정의 시 선언한 매개변수 개수를 나타내는 함수 객체의 `length` 프로퍼티와 `arguments` 객체에 아무런 영향을 주지 않는다.