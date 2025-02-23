# 16장 프로퍼티 어트리뷰트

## 16.1 내부 슬롯과 내부 메서드

프로퍼티 어트리뷰트를 이해하기 위해서는 내부 슬롯과 내부 메서드를 먼저 이해해야 한다.

> [!note] **내부 슬롯과 내부 메서드**이란?
> JS 엔진의 구현 알고리즘을 설명하기 위해 ECMAScript에서 정의한 의사 프로퍼티, 의사 메서드

> **책에서의 설명을 내가 이해한 바는 다음과 같다.**
> 내부 슬롯과 내부 메서드는 js 엔진의 구현 동작을 설명하기 위해 작성한 의사 코드와 같은 것이다.
> 따라서, 개발자가 직접 접근할 수 있도록 외부로 공개된 프로퍼티는 아니다.

```js
const o = {};

//내부 슬롯은 js 엔진의 내부 로직이므로 직접 접근할 수는 없다.
o.[[Prototype]] //Uncaught SyntaxError: Unexpected token '['

// 단, [[Prototype]] 내부 슬롯의 경우, 간접적으로 접근이 가능하다.
o.__proto__ //Object.prototype
```

+) ES6부터 `__proto__`는 공식적인 표준이 아니기에 다음과 같은 방법이 권장된다.

```js
const o = {};
Object.getPrototypeOf(o); // [[Prototype]]: Object

const parent = { foo: "bar" };
Object.setPrototypeOf(o, parent);
console.log(o.foo); //"bar"
```

---

## 16.2 프로퍼티 어트리뷰트와 프로퍼티 디스크립터 객체

그렇다면 프로퍼티 어트리뷰트는 무엇인가?

> [!note] **프로퍼티 어트리뷰트**란?
> js 엔진이 관리하는 프로퍼티가 가지는 내부 상태값으로
> 해당 프로퍼티의 내부 슬롯 `[[Value]]`,`[[Writeable]]`, `[[Enumerable]]`, `[[Configurable]]`이다.

- `[[Value]]` : 프로퍼티의 값
- `[[Writeable]]` : 프로퍼티의 값의 갱신 가능 여부
- `[[Enumerable]]` : 프로퍼티의 열거 가능 여부
- `[[Configurable]]` : 프로퍼티의 재정의 가능 여부

따라서, 프로퍼티 어트리뷰트는 내부 슬롯이기에 직접 값에 접근할 수는 없지만 간접적으로는 확인이 가능하다.
`Object.getOwnPropertyDescriptor()` 메소드를 활용하여 간접적으로 확인이 가능하다.

```js
const person = {
  name: `Lee`,
};

//Object.getOwnPropertyDescriptor() : (객체의 참조, 프로퍼티 키(문자열))로 메소드의 매개변수를 전달
console.log(Object.getOwnPropertyDescriptor(person, "name"));
// {value: 'Lee', writable: true, enumerable: true, configurable: true}
```

사진의 결과와 같이 `Object.getOwnPropertyDescriptor()` 는 객체를 반환한다.
해당 객체를 **프로퍼티 디스크립터 객체**라고 말한다.

+) ES8에서 도입된 `Object.getOwnPropertyDescriptors()`는 모든 프로퍼티의 프로퍼티 어트리뷰트 정보를 제공하는 모든 프로퍼티 디스크립터 객체들을 반환한다.

```js
const person = {
  //프로퍼티 생성
  name: `Lee`,
};

//프로퍼티 동적 생성
person.age = 20;

console.log(Object.getOwnPropertyDescriptors(person));
```

---

## 16.3 데이터 프로퍼티와 접근자 프로퍼티

프로퍼티는 데이터 프로퍼티와 접근자 프로퍼티로 구분할 수 있다.

> [!note] **데이터 프로퍼티**란?
> 키와 값으로 구성된 일반적인 프로퍼티이며 지금까지 살펴본 모든 프로퍼티는 데이터 프로퍼티다.

> [!note] **접근자 프로퍼티**란?
> 자체적으로는 값을 가지지 않고, 다른 데이터 프로퍼티의 값을 읽거나 저장할 때 호출되는 접근자 함수(accessor function)로 구성된 프로퍼티다.

### 16.3.1 데이터 프로퍼티

#### 데이터 프로퍼티의 어트리뷰트

이 프로퍼티 어트리뷰트는 js 엔진이 프로퍼티를 생성할 때 기본값으로 자동 정의된다.

| 프로퍼티 어트리뷰트 | 프로퍼티 디스크립터 객체의 프로퍼티 |
| ------------------- | ----------------------------------- |
| `[[Value]]`         | value                               |
| `[[Writeable]]`     | writable                            |
| `[[Enumerable]]`    | enumerable                          |
| `[[Configurable]]`  | configurable                        |

==첫번째꺼는 값,2,3,4번째는 가능여부==

1. `[[Value]]` (value)
   - 프로퍼티 키를 통해 프로퍼티 값에 접근하면 반환되는 값
   - 프로퍼티 키를 통해 프로퍼티 값을 변경하려면 `[[Value]]` 에 값을 재할당한다.
     - 이때 프로퍼티가 없으면 프로퍼티를 동적 생성하고 생성된 프로퍼티의 `[[Value]]`에 값을 저장한다.
2. `[[Writeable]]`(writable)
   - 프로퍼티 값의 변경 가능 여부를 나타내며 ==불리언 ==값을 가짐
   - `[[Writeable]]`의 값이 false인 경우 -> `[[Value]]`의 값을 변경할 수 없는 읽기 전용 프로퍼티가 된다.
3. `[[Enumerable]]`(enumerable)
   - 프로퍼티의 열거 가능 여부를 나타내며 ==불리언 ==값을 갖는다.
   - `[[Enumerable]]`의 값이 false인 경우 해당 프로퍼티는 for ... in문이나 Object.keys 메서드 등으로 열거할 수 없다.
4. `[[Configurable]]` (configurable)
   - 프로퍼티의 재정의 가능 여부를 나타내며 ==불리언== 값을 가진다.
   - `[[Configurable]]`의 값이 false인 경우 -> 해당 프로퍼티의 삭제, 프로퍼티 어트리뷰트 값의 변경이 금지된다.
     configurable을 false로 하면 그 이후에 수정 불가하다. 코드 껐다 켜야 함 !
   - 단, `[[Writeable]]`의 값이 true인 경우 -> `[[Value]]`의 변경과 `[[Writeable]]`을 false로 변경하는 것은 허용된다.

위에서 살펴본 예제를 다시 살펴보자.

```js
const person = {
  name: "Lee",
};

console.log(Object.getOwnPropertyDescriptor(person, "name"));
// {value: 'Lee', writable: true, enumerable: true, configurable: true}
```

`Object.getOwnPropertyDescriptor`가 반환한 프로퍼티 디스크립터 객체를 살펴보자

1. value 프로퍼티의 값은 'Lee'이다. -> `[[Value]]` 데이터 프로퍼티의 값이 'Lee'인 것을 의미
2. writable, enumerable, configurable 프로퍼티의 값은 모두 true -> `[[Writeable]]`,`[[Enumerable]]`, `[[Configurable]]` 데이터 프로퍼티의 값이 모두 true인 것을 의미

프로퍼티 생성 시 `[[Value]]`의 값은 프로퍼티 값, `[[Writeable]]`,`[[Enumerable]]`, `[[Configurable]]`는 true로 초기화 된다는 것을 알 수 있다.
(동적 추가해도 마찬가지)

### 16.3.2 접근자 프로퍼티

#### 접근자 프로퍼티 어트리뷰트

| 프로퍼티 어트리뷰트 | 프로퍼티 디스크립터 객체의 프로퍼티 |
| ------------------- | ----------------------------------- |
| `[[Get]]`           | get                                 |
| `[[Set]]`           | set                                 |
| `[[Enumerable]]`    | enumerable                          |
| `[[Configurable]]`  | configurable                        |

1. `[[Get]]` (get)
   - 접근자 프로퍼티를 통해 데이터 프로퍼티의 값을 읽을 때 ==호출==되는 접근자 함수
   - 접근자 프로퍼티 키로 프로퍼티 값에 접근하면 프로퍼티 어트리뷰트 `[[Get]]` 의 값, 즉 getter함수가 호출되고 그 결과가 프로퍼티 값으로 반환된다.
2. `[[Set]]` (set)
   - 접근자 프로퍼티를 통해 데이터 프로퍼티의 값을 ==저장==할 때 호출되는 접근자 함수
   - 접근자 프로퍼티 키로 프로퍼티 값을 저장하면 프로퍼티 어트리뷰트 `[[Set]]` 의 값, 즉 setter함수가 호출되고 그 결과가 프로퍼티 값으로 저장된다.
3. `[[Enumerable]]`, `[[Configurable]]`은 데이터 프로퍼티와 동일하다

> [!tip] 바로 프로퍼티에 접근하지 않고 굳이 getter, setter 함수를 왜 쓰는 것이지?..
> 객체 내부 속성에 직접 접근하지 않아 객체의 **정보 은닉**을 가능하게 해주어 보안을 강화할 수 있고, 코드의 안전성과 유지보수성을 높일 수 있다는 장점이 있다. 또한 옳지않은 값을 넣으려고 할때 이를 미연에 방지할 수 있다고 한다....

#### 접근자 함수

getter/setter 함수라고도 부른다.
접근자 프로퍼티는 이를 모두 정의할 수도 있고 하나만 정의할 수도 있다.

다음 예제를 살펴보자.

```js
const person = {
  //데이터 프로퍼티
  firstName: "Ungmo",
  lastName: "Lee",

  //접근자 프로퍼티 -> 접근자 함수 fullName으로 정의
  get fullName() {
    //getter
    return `${this.firstName} ${this.lastName}`;
  },

  set fullName(name) {
    //setter
    [this.firstName, this.lastName] = name.split(" ");
    //배열 디스트럭처링 할당 -> 배열의 각 요소를 변수에 할당(31장에서 자세히 살펴보자)
  },
};

//1. 데이터 프로퍼티를 통한 프로퍼티 값의 참조
console.log(person.firstName + " " + person.lastName); //Ungmo Lee

//2. 접근자 프로퍼티를 통한 프로퍼티 값의 저장
person.fullName = "Heegun Lee"; //setter 접근자 함수 호출
console.log(person); //{firstName: "Heegun", lastName: "Lee"}

//3. 접근자 프로퍼티를 통한 프로퍼티 값의 참조
console.log(person.fullName); //getter 함수 호출
//Heegun Lee

//4. 데이터 프로퍼티의 프로퍼티 디스크립터 객체를 반환하여 프로퍼티 어트리뷰트 확인
let descriptor = Object.getOwnPropertyDescriptor(person, "firstName");
console.log(descriptor); // {value: "Heegun", wirtable: true, enumerable: ture, configurable: true}

//5. 접근자 프로퍼티의 프로퍼티 디스크립터 객체를 반환하여 프로퍼티 어트리뷰트 확인
descriptor = Object.getOwnPropertyDescriptor(person, "fullName");
console.log(descriptor); // {get: f, set: f, enumerable: true, configurable: true}
```

> [!note]
>
> 접근자 프로퍼티는 자체적으로 값(`[[Value]]` 프로퍼티 어트리뷰트)를 가지지 않으며 데이터 프로퍼티의 값을 읽거나 저장할 때에 관여만 함

같은 예제를 통해 해당 특징을 내부 슬롯 메서드 관점에서 살펴보자.

> 접근자 프로퍼티 `fullName`으로 프로퍼티 값에 접근하면 내부적으로 `[[Get]]` 내부 메서드가 호출되어 다음과 같이 동작함
>
> 1. 유효한 프로퍼티 키인지 확인
> 2. 프로토타입 체인에서 프로퍼티를 검색
> 3. 검색된 프로퍼티의 종류 파악(데이터 or 접근자)
> 4. 접근자 프로퍼티의 프로퍼티 어트리뷰트 `[[Get]]`의 값, 즉 getter 함수를 호출하여 결과 반환

> [!tip] 프로토타입이란?
> 프로토타입은 어떤 객체의 상위(부모) 객체의 역할을 하는 객체다.
> 프로토타입은 하위 객체에게 자신의 프로퍼티와 메서드를 상속한다
> 자세한 내용은 19장에서..살펴보도록 하자

#### 접근자 프로퍼티와 데이터 프로퍼티 구별하기

```js
//일반 객체의 __proto__ => 접근자 프로퍼티
Object.getOwnPropertyDescriptor(Object.prototype, "__proto__");
// {get: f, set:f, enumerable: false, configurable: true}

//함수 객체의 prototype => 데이터 프로퍼티
Object.getOwnPropertyDescriptor(function () {}, "prototype");
// {value: { ... }, writable: true, enumerable: false, configurable: false}
```

---

## 16.4 프로퍼티 정의

> [!note] 프로퍼티 정의란?
> 새로운 프로퍼티를 추가하면서 프로퍼티 어트리뷰트를 명시적으로 정의하거나, 기존 프로퍼티의 프로퍼티 어트리뷰트를 재정의하는 것을 말한다.
> -> 객체의 프로퍼티가 어떻게 동작해야 하는 지를 명확히 할 수 있다!

`Object.defineProperty` 메서드를 사용하면 프로퍼티의 어트리뷰트를 정의할 수 있다.
-> `Object.defineProperty(객체 참고, 데이터프로퍼티 키, 프로퍼티 디스크립터 객체)`로 사용

```js
const person = {};

//데이터 프로퍼티 정의
Object.defineProperty(person, "firstName", {
  value: "Ungmo",
  writable: true,
  enumerable: true,
  configurable: true,
});

Object.defineProperty(person, "lastName", {
  value: "Lee",
  //일부 프로퍼티 어트리뷰트만 지정할 수도 있음.
});

//1. 프로퍼티 데스크립터 객체로 데이터 프로퍼티 접근하기
let decriptor = Object.getOwnPropertyDescriptor(person, "firstName");
console.log("firstName", descriptor);
// firstName {value: 'Ungmo', writable: true, enumerable: true, configurable: true}

//2. 일부 프로퍼티 누락 시 undefined, false가 기본값이다.
descriptor = Object.getOwnPropertyDescriptor(person, "lastName");
console.log("lastName", descriptor);
// lastName {value: 'Lee', writable: false ...}

//3. [[Enumerable]]의 값이 false인 경우 -> Object.keys로 열거되지 않는다.
console.log(Object.keys(person));
// ["firstName"]

//4. [[Writable]]의 값이 false인 경우 -> [[Value]]의 값을 변경할 수 없다.
person.lastName = "Kim";
//에러는 발생하지 않고 그냥 무시된다.

//5. [[Configurable]]의 값이 false인 경우 -> 해당 프로퍼티를 삭제할 수 없다.
delete person.lastName;
//에러는 발생하지 않고 그냥 무시된다.

//5-1. [[Configurable]]의 값이 false인 경우 -> 해당 프로퍼티를 재정의할 수 없다.
Object.defineProperty(person, "lastName", { enumerable: true });
//Uncaught TypeError: Cannot redefine property: lastName
descriptor = Object.getOwnPropertyDescriptor(person, "lastName");
console.log("lastName", descriptor);
// 재정의되지 않은 모습을 볼 수 있다.
// lastName {value: 'Lee', writable: false, enumerable: false ...}

//접근자 프로퍼티 정의
Object.defineProperty(person, "firstName", {
  get() {
    return `${this.firstName} ${this.lastName}`;
  },
  set(name) {
    [this.firstName, this.lastName] = name.split(" ");
  },
  enumerable: true,
  configurable: true,
});

descriptor = Object.getOwnPropertyDescriptor(person, "fullName");
console.log("fullName", descriptor);
// fullName {get: f, set: f, enumerable: true, configurable: true}

person.fullName = "Heegun Lee";
console.log(person);
// {firstName: "Heegun", lastName: "Lee"}
```

일부 생략한 프로퍼티 어트리뷰트는 다음과 같이 기본값이 정해진다

| 프로퍼티 디스크립터 객체의 프로퍼티 | 프로퍼티 어트리뷰트 | 생략 시 기본값 |
| ----------------------------------- | ------------------- | -------------- |
| value                               | `[[Value]]`         | undefined      |
| get                                 | `[[Get]]`           | undefined      |
| set                                 | `[[Set]]`           | undefined      |
| writable                            | `[[Writable]]`      | false          |
| enumerable                          | `[[Enumerable]]`    | false          |
| configurable                        | `[[Configurable]]`  | false          |

`Object.defineProperties` 메서드를 사용하면 여러 개의 프로퍼티를 한 번에 정의할 수 있다.

```js
const person = {};

Object.defineProperties(person, {
  //데이터 프로퍼티 정의
  firstName: {
    value: "Ungmo",
    writable: true,
    enumerable: true,
    configurable: true,
  },
  lastName: {
    value: "Lee",
    writable: true,
    enumerable: true,
    configurable: true,
  },

  //접근자 프로퍼티 정의
  fullName: {
    get() {
      return `${this.firstName} ${this.lastName}`;
    },
    set(name) {
      [this.firstName, this.lastName] = name.split(" ");
    },
    enumerable: true,
    configurable: true,
  },
});

person.fullName = "Heegun Lee";
console.log(person);
// {firstName: "Heegun", lastName: "Lee"}
```

---

## 16.5 객체 변경 방지

객체는 변경 가능한 값이므로 재할당 없이 직접 변경할 수 있다.
-> 즉, 프로퍼티를 추가 / 삭제 / 갱신할 수 있으며 프로퍼티 어트리뷰트를 재정의할 수도 있다.
-> js는 객체의 변경을 방지의 강도가 다양한 메서드를 제공한다.

| 구분           | 메서드                     | 추가 | 삭제 | 값 읽기 | 값 쓰기 | 프로퍼티 어트리뷰트 재정의 |
| -------------- | -------------------------- | ---- | ---- | ------- | ------- | -------------------------- |
| 객체 확장 금지 | `Object.preventExtensions` | X    | O    | O       | O       | O                          |
| 객체 밀봉      | `Object.seal`              | X    | X    | O       | O       | X                          |
| 객체 동결      | `Object.freeze`            | X    | X    | O       | X       | X                          |

### 16.5.1 객체 확장 금지

`Object.preventExtensions` 메소드로 확장이 금지된 객체는 **프로퍼티 추가가 금지**된다.
프로퍼티 추가에는 동적추가, `Object.defineProperty` 메소드 방법이 있는데 이것 모두 금지된다.

확장 가능 객체 여부는 `Object.isExtensible` 메소드로 확인할 수 있다.

```js
const person = { name: "Lee" };

console.log(Object.isExtensible(person)); //true

Object.preventExtensions(person); //객체 확장 금지

console.log(Object.isExtensible(person)); //false

//1. 객체 확장 금지 -> 프로퍼티 추가도 금지
person.age = 20; // 그냥 무시됨. strict mode에서는 에러 발생
console.log(person); // {name: "Lee"}

//2. 프로퍼티 추가는 금지 but 삭제는 가능함!
delete person.name;
console.log(person); // {}

//3. 프로퍼티 정의에 의한 프로퍼티 추가도 금지
object.defineProperty(person, "age", { value: 20 });
//TypeError: cannot define property age, object is not extensible
```

### 16.5.2 객체 밀봉

`Object.seal` 메소드로 밀봉된 객체는 **읽기와 쓰기**만 가능하다.
즉, 프로퍼티 추가 및 삭제, 프로퍼티 어트리뷰트 재정의 금지를 의미한다.

밀봉 객체 여부는 `Object.isSealed` 메소드로 확인할 수 있다.

```js
const person = { name: "Lee" };

console.log(Object.isSealed(person)); //false

Object.seal(person); //객체 밀봉

console.log(Object.isSealed(person)); //true

//1. 밀봉된 객체는 configurable이 false다.
console.log(Object.getOwnPropertyDescriptors(person));
/*
{
	name: {value: "Lee", writable: true, enumerable: true, configurable: false},
}
*/

//2. 프로퍼티 추가 금지
person.age = 20; // 그냥 무시됨. strict mode에서는 에러 발생
console.log(person); // {name: "Lee"}

//3. 프로퍼티 삭제 금지
delete person.name; // 그냥 무시됨. strict mode에서는 에러 발생
console.log(person); // {name: "Lee"}

//4. 프로퍼티 값 갱신은 가능
person.name = "Kim";
console.log(person); // {name: "Kim"}

//5. 프로퍼티 어트리뷰트 재정의 금지
object.defineProperty(person, "name", { configurable: true });
//TypeError: cannot redefine property: name
```

### 16.5.3 객체 동결

`Object.freeze` 메소드로 동결된 객체는 **읽기**만 가능하다.
즉, 프로퍼티 추가 및 삭제, 프로퍼티 어트리뷰트 재정의, 프로퍼티 값 갱신 금지를 의미한다.

동결 객체 여부는 `Object.isFrozen` 메소드로 확인할 수 있다.

```js
const person = { name: "Lee" };

console.log(Object.isFrozen(person)); //false

Object.freeze(person); //객체 밀봉

console.log(Object.isFrozen(person)); //true

//1. 동결된 객체는 writable과 configurable이 false다.
console.log(Object.getOwnPropertyDescriptors(person));
/*
{
	name: {value: "Lee", writable: false, enumerable: true, configurable: false},
}
*/

//2. 프로퍼티 추가 금지
person.age = 20; // 그냥 무시됨. strict mode에서는 에러 발생
console.log(person); // {name: "Lee"}

//3. 프로퍼티 삭제 금지
delete person.name; // 그냥 무시됨. strict mode에서는 에러 발생
console.log(person); // {name: "Lee"}

//4. 프로퍼티 값 갱신 금지
person.name = "Kim";
console.log(person); // {name: "Lee"}

//5. 프로퍼티 어트리뷰트 재정의 금지
object.defineProperty(person, "name", { configurable: true });
//TypeError: cannot redefine property: name
```

### 16.5.4 불변 객체

지금까지의 모든 메소드 -> 얕은 변경 방지 메소드 -> 직속 프로퍼티만 변경이 방지되고 중첩 객체까지는 영향을 주지 못한다.
=> `Object.freeze` 메소드로 객체를 동결하더라도 중첩 객체까지 동결할 수는 없다.

```js
const person = {
  name: "Lee",
  address: { city: "Seoul" },
};

// 얕은 객체 동결
Object.freeze(person);

// 직속 프로퍼티만 동결됨.
console.log(Object.isFrozen(person)); //true
// 중첩 객체는 동결하지 못 한다.
console.log(Object.isFrozen(person.address)); // false

// 중첩 객체 동결 실패로 객체 값 변경이 가능함
person.address.city = "Busan";
console.log(person); // {name: "Lee", address: {city: "Busan"}}
```

불변 객체를 구현 방법
=> 객체를 값으로 가지는 모든 프로퍼티에 대해 `Object.freeze` 메소드 호출

```js
function deepFreeze(target) {
  //객체가 아니거나 이미 동결된 객체는 무시
  if (target && typeof target === "object" && !Object.isFrozen(target)) {
    Object.freeze(target); // 동결되지 않은 객체 동결

    //모든 프로퍼티 순회하면서 재귀적으로 동결
    Object.keys(target).forEach((key) => deepFreeze(target[key]));
    //keys : 객체 자신의 열거 가능한 프로퍼티 키를 배열로 반환
    //forEach : 배열을 순회하며 각 요소에 대해 콜백 함수 실행
  }
  return target;
}

const person = {
  name: "Lee",
  address: { city: "Seoul" },
};

// 깊은 객체 동결 -> 불변 객체
deepFreeze(person);

console.log(Object.isFrozen(person)); //true
// 중첩 객체도 동결
console.log(Object.isFrozen(person.address)); // true

// 읽기만 가능
person.address.city = "Busan";
console.log(person); // {name: "Lee", address: {city: "Seoul"}}
```

> [!summary] 프로퍼티 정의란?
> **확장 금지** : 추가 빼고 다 가능
> **밀봉** : 읽기 쓰기만 가능
> **동결** : 읽기만 가능
