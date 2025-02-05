# 22장 this

## 22.1 this 키워드

- 객체는 상태를 나타내는 property와 동작을 나타내는 method를 하나의 논리적인 단위로 묶은 것이다.
- method는 자신이 속한 객체의 상태, property를 참조하고 변경할 수 있어야 한다.
- 이때 메서드가 자신이 속한 객체의 프로퍼티를 참조하려면 먼저 자신이 속한 객체(의 식별자)를 참조할 수 있어야 한다.

- 객체 리터럴 방식으로 생성한 객체의 경우 이미 고유 식별자 이름이 만들어졌으므로 메서드 내부에서 자신이 속한 객체를 가리키는 식별자를 재귀적으로 참조 가능하다.

```js
const circle = {
  radius: 5,
  getDiameter() {
    return 2 * circle.radius;
  },
};

console.log(circle.getDiameter());
```

- 참조 표현식이 평가되는 시점은 getDIameter 메서드가 호출되어 함수 몸체가 실행되는 시점이다.

  - 위 객체 리터럴은 circle 변수에 할당되기 직전에 평가된다. 따라서 아래에서 getDiameter 메서드가 호출되는 시점에 이미 객체가 생성되어 변수에 할당되었으므로 메서드 내부에서 circle 식별자 참조 가능

- 그러나 생성자 함수 방식으로 객체 인스턴스를 생성하는 경우, 인스턴스가 생성되기 전에 해당 인스턴스를 가리킬 식별자가 필요하다. 이것이 바로 `this` 식별자이다.
- **this는 자신이 속한 객체 또는 자신이 생성할 인스턴스를 가리키는 자기 참조 변수다.**
  - this를 통해 객체 자신이 생성할 인스턴스의 프로퍼티와 메서드 참조 가능
  - this는 JS 엔진에 의해 암묵적 생성
  - 함수 호출 시 `arguments` 객체와 `this`가 암묵적으로 함수 내부에 전달되고, 지역 변수처럼 사용 가능
  - **단, this 바인딩(this가 가리키는 값)은 함수 호출 방식에 의해 동적으로 결정**

> [!note] 바인딩
> 바인딩이란 식별자와 값을 연결하는 과정
> 변수 선언 : 변수 이름과 확보된 메모리 공간의 주소(값)을 바인딩하는 것

- 자바나 C++ 같은 클래스 기반 언어에서 this는 항상 클래스가 생성하는 인스턴스를 가리킨다.

  - JS의 this는 함수가 호출되는 방식에 따라 실제 객체나 생성될 인스턴스 등 동적으로 결정된다. strict mode도 this 바인딩에 영향을 준다(20.6.1 절)

- this는 전역, 함수 내부 코드 어디에서나 참조 가능하다.
  - 하지만 this는 객체의 메서드 내부, 생성자 함수 내부에서만 의미가 있다.
  - 따라서 strict mode가 적용된 일반 함수의 `this`에는 `undefined`가 바인딩된다. 일반 함수에서 `this`를 사용할 필요가 없기 때문이다.

## 22.2 함수 호출 방식과 this 바인딩

- this 바인딩은 함수 호출 방식에 따라 동적으로 결정된다.

- 그런데 동일 함수도 다양한 방식으로 호출 가능하다.
  <함수 호출 방식>

1. 일반 함수 호출
2. 메서드 호출
3. 생성자 함수 호출
4. Function.prototype.apply/call/bind 메서드에 의한 간접 호출

```js
const foo = function () {
  console.dir(this);
};

// 1. 일반 함수 호출 : this는 전역 객체 window를 가진다.
foo(); // window

// 2. 메서드 호출 : this는 메서드 호출한 객체 obj를 가리킨다.
const obj = { foo };
obj.foo(); // obj

// 3. 생성자 함수 호출 : this는 생성자 함수가 생성한 인스턴스를 가리킨다.
new foo(); // foo {}

// 4. Function.prototype.apply/call/bind 매서드에 의한 간접 호출 : this는 주어진 인수에 의해 결정된다.
const bar = { name: "bar" };

foo.call(bar); // bar
foo.apply(bar); // bar
foo.bind(bar)(); // bar
```

### 22.2.1 일반 함수 호출

- 기본적으로 this에서는 전역 객체가 바인딩된다.
- 전역 함수 혹은 중첩 함수를 일반 함수로 호출하면 this에 전역 객체가 바인딩된다.
- 단, strict mode가 적용된 일반 함수 내부 this에는 undefined가 바인딩된다.
  - 객체를 생성하지 않는 일반 함수에서 this는 의미가 없기 때문이다.
- 콜백 함수 등 어떤 함수라도 일반 함수로 호출되면 this에 전역 객체가 바인딩된다.

- 외부 함수와 내부 중첩 함수, 콜백 함수의 this가 일치하지 않는다는 것은 중첩 함수 또는 콜백 함수를 헬퍼 함수로 동작하기 어렵게 만든다.
  - 따라서 내부 this 바인딩을 외부 this 바인딩과 일치시켜야 할 필요성이 있다.
  - 새로운 변수에 this를 미리 넣어놓고 가져다 쓰거나, apply / call / bind 메서드를 사용하는 방법이 있다.
  - 화살표 함수 내부의 this는 상위 스코프의 this를 가리키므로, **콜백 함수를 화살표 함수로 쓰면 자연스럽게 this 바인딩이 일치하게 된다.**

### 22.2.2 메서드 호출

- 메서드를 호출할 때는 메서드를 호출한 객체, 호출할 때 마침표 연산자 앞에 기술된 객체가 바인딩된다.
- 단, 주의점은 메서드를 소유한 객체가 아닌 메서드를 호출한 객체에 바인딩된다는 것이다.

```js
const person = {
  name: "Lee",
  getName() {
    return this.name;
  },
};
```

이 예제에서 getName() 메서드는 person 객체 안에서 정의되었다. 그런데 메서드는 프로퍼티에 바인딩된 함수이다.

- 즉, person 객체의 getName 프로퍼티가 가리키는 함수 객체는 다른 프로퍼티나 변수에 바인딩하기만 하면 독립적으로 존재 가능하다.

```js
const anotherPerson = {
  name: "Kim",
};

anotherPerson.getName = person.getName;

const getName = person.getName;
```

- 따라서 메서드 내부의 this는 호출 시점에 결정되어 호출한 객체에 바인딩된다.
  - 프로토타입 메서드 내부에서 사용된 this도 호출한 객체에 바인딩된다.

### 22.2.3 생성자 함수 호출

- 생성자 함수 내부의 this에는 생성자 함수가 미래에 생성할 인스턴스가 바인딩된다.
  - Class 기반 언어와 동일하게 작동하며, 만약 new 연산자와 함께 생성자 함수를 호출하지 않으면 일반 함수로 동작하고, this도 일반 함수와 동일하게 바인딩된다.

### 22.2.4 Function.prototype.apply/call/bind 메서드에 의한 간접 호출

- apply, call, bind는 Function.prototype의 메서드이므로 모든 함수가 상속받아 사용할 수 있다.
- apply와 call 메서드는 함수를 호출하면서 첫 번째 인수로 전달한 특정 객체를 호출한 함수의 this에 바인딩한다.
  - apply와 call 메서드는 인수 전달 방식만 다를 뿐 동일하게 동작한다.

```js
function getThisBinding() {
  console.log(arguments);
  return this;
}

const thisArg = { a: 1 };

console.log(getThisBinding.apply(thisArg, [1, 2, 3]));

console.log(getThisBinding.call(thisArg, 1, 2, 3));
```

- apply 메서드는 인수를 배열로 묶어 전달하고, call 메서드는 인수를 쉼표로 구분한 리스트로 전달한다.

- apply, call 메서드의 대표적 용도는 arguments 객체와 같은 유사 배열 객체에 배열 메서드를 사용하는 경우이다.

```js
function convertArgsToArray() {
  console.log(arguments);

  const arr = Array.prototype.slice.call(arguments);
  console.log(arr);

  return arr;
}

convertArgsToArray(1, 2, 3); // [1, 2, 3]
```

- bind 메서드는 함수를 호출하지 않고, 첫 번째 인수로 전달한 값으로 this 바인딩이 교체된 함수를 새롭게 생성해 반환한다.

```js
function getThisBinding() {
  return this;
}

const thisArg = { a: 1 };

// bind 메서드는 전달한 인수로 this가 교체된 getThisBinding을 새롭게 생성해 반환한다.
console.log(getThisBinding.bind(thisArg)); // getThisBinding

//bind 메서드는 함수를 호출해주지 않으므로 반환된 함수를 호출하려면 명시적으로 다시 호출해야 한다.
console.log(getThisBinding.bind(thisArg)()); // {a: 1}
```

- bind 메서드는 내부 중첩 함수, 콜백 함수의 this 불일치 문제를 해결할 수 있다.

```js
const person = {
	name: 'Lee',
	foo(callback) {
		setTimeout(callback.bind(this), 100);
	}
};

person.foo(function() {
	console.log('Hi! my name is ${this.name}.`);
})
```
