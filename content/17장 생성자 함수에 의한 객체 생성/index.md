# 17장 생성자 함수에 의한 객체 생성

10장에서 ‘객체 리터럴’에 의한 객체 생성 방식을 살펴보았는데, 이 외에도 다양한 방법으로 객체를 생성할 수 있다. 17장에서는 **생성자 함수**를 사용하여 객체를 생성하는 방식을 알아보자!

## Object 생성자 함수

new 연산자와 함께 Object 생성자 함수를 호출하면 빈객체를 생성하여 반환.

생성자 함수에 의해 생성된 객체를 **인스턴스**라고 한다.

```jsx
// 빈 객체의 생성
const person = new Object();

// 프로퍼티 추가
person.name = "Lee";
person.sayHello = function () {
  console.log("Hi! My name is " + this.name);
};
```

Object 생성자 함수 외에도 String, Number, Boolean, Function, Array, Date, RegExp.
promise 등의 빌트인 생성자 함수를 제공한다.<br/><br/>

> 직관적이고 간편한 객체 리터럴 생성 방식이 있는데 왜 생성자 함수로 객체를 생성해야 할까?

- 동일한 프로퍼티를 갖는 객체를 여러개 생성해야 하는 경우

```jsx
const circle1 = {
  radius: 5,
  getDiameter() {
    return 2 * this.radius;
  },
};

const circle2 = {
  radius: 10,
  getDiameter() {
    return 2 * this.radius;
  },
};
```

<br/>
→ 생성자 함수로 객체를 생성하면 템플릿(클래스) 처럼 구조가 동일한 객체 여러개를 간편하게 생성할 수 있다.

```jsx
// 생성자 함수
function Circle(radius) {
  // 생성자 함수 내부의 this는 생성자 함수가 생성할 인스턴스를 가리킨다.
  this.radius = radius;
  this.getDiameter = function () {
    return 2 * this.radius;
  };
}

// 인스턴스의 생성
const Circle1 = new Circle(5);
const Circle2 = new Circle(10);
```

> **생성자 함수 안의 this:** 생성자 함수가 (미래에) 생성할 인스턴스

<br/>

- 만약 `new` 연산자 없이 호출한다면?

```jsx
// 일반 함수로서 호출
const Circle3 = Circle(15);

console.log(circle3); //undefined
```

→ 반환문이 없으므로 암묵적으로 undefined 반환

<br/>

## 생성자 함수의 인스턴스 생성 과정

**생성자 함수의 역할**

- 템플릿(클래스)으로서 동작하여 인스턴스를 생성하는 것 **(필수)**
- 생성된 인스턴스를 초기화(인스턴스 프로퍼티 추가 및 초기값 할당)하는 것 **(옵션)**

<aside>

> **바인딩:** 식별자와 값을 연결하는 과정

</aside>

```jsx
function Circle(radius) {
  // 1. 암묵적으로 인스턴스가 생성되고 this에 바인딩된다.
  console.log(this); // Circle{}

  // 2. this에 바인딩 되어있는 인스턴스를 초기화한다.
  this.radius = radius;
  this.getDiameter = function () {
    return 2 * this.radius;
  };

  // 3. 완성된 인스턴스가 바인딩된 this가 암묵적으로 반환
}

const Circle1 = new Circle(5);
```

인스턴스를 **반환**하는 코드는 보이지 않는다 ?

→ new와 함께 생성자함수를 호출하면 자바스크립트 엔진은 암묵적인 처리를 통해 인스턴스를 생성하고 반환.

1. 인스턴스 생성과 this 바인딩
2. 인스턴스 초기화
3. 생성자 함수 내부의 모든 처리가 끝나면 완성된 인스턴스가 바인딩된 this가 암묵적으로 반환

만약 다른 객체를 명시적으로 반환하면 this가 반환되지 못하고 return문에 명시한 객체가 반환된다. 원시값을 반환하면 this가 반환된다. 생성자 함수 내부에서는 return 문을 반드시 생략할 것.

<br/>

## 내부 메서드 [[Call]] 과 [[Construct]]]]

함수는 객체이므로 생성자 함수도 일반 객체와 동일하게 작동할 수 있다.

차이점은 **일반 객체는 호출할 수 없지만 함수는 호출할 수 있다.**

따라서 함수 객체는 일반 객체가 가지고 있는 내부 슬롯과 내부 메서드는 물론, 함수로서 동작하기 위해 함수 객체만 을 위한 [[Environment]], [[FormalParameters]] 등의 내부 슬롯과 [[call]], [[Construct]] 같은 내부 메서드를 **추가로** 가지고 있다

```jsx
function foo() {}

// 일반적인 함수로서 호출: [[Call]]이 호출된다.
foo();

// 생성자 함수로서 호출: [[Construct]]가 호출된다.
new foo();
```

일반 함수로서 호출 → 내부 메서드 [[Call]] 이 호출됨

생성자함수로 호출 → 내부 메서드 [[Construct]] 이 호출됨
<br/><br/>

[[Call]] 을 갖는 함수 객체: callable

[[Construct]]를 갖는 함수 객체: constructor

[[Construct]]을 갖지않는 함수 객체: non-constructor

![image.png](./17-1.png)

> 즉, 모든 함수 객체는 호출할 수 있지만 모든 함수 객체를 생성자 함수로서 호출할 수 있는 것은 아니다.

<br/>

## 자바스크립트 엔진은 어떻게 constructor와 non-constructor를 구분할까?

(생성자로 동작하는 함수와 생성자로 동작하지 않는 함수를 구분한다는 뜻)

**constructor**: 함수선언문, 함수 표현식, 클래스(클래스도 함수다)

**non-constructor**: 메서드(ES6 메서드 축약 표현), 화살표 함수

> **ES6 메서드 축약 표현?**

```jsx
const obj = {
  myMethod() {
    console.log("This is a method.");
  },
};
obj.myMethod(); // "This is a method."
```

</aside>

→ 함수가 어디에 할당되어있는지에 따라 메서드를 판단하는 것이 아니라, 함수 정의 방식에 따라 constructor와 non-constructor를 구분한다.

→ non-constructor인 함수 객체를 new 연산자와 함께 생성자 함수로 호출하면 에러가 발생한다.

일반함수와 생성자 함수는 특별한 형식적 차이는 없다.

그래서 생성자 함수는 일반적으로 **첫 문자를 대문자로** 기수하는 파스칼케이스로 이름을 지어 일반 함수와 구별할 수 있도록 한다.

`function Circle(radius) {}`

<br/>

## new.target

생성자 함수가 new 연산자 없이 호출되는 것을 방지하기 위해! ES6에서는 `new.target`을 지원한다.

`new.target` 은 this 와 유사하게 constructor인 모든 함수 내부에서 암묵적인 지역 변수와 같이 사용되며 메타 프로퍼티라고 부른다.

new 연산자와 함께 생성자 함수로서 호출되면 함수 내부의 new. target은 함수 자신을 가리킨다. new 연산자 없이 일반 함수로서 호출된 함수 내부의 new.target은 undefined다.

```jsx
// 생성자 함수
function Circle(radius) {
  // 이 함수가 new 연산자와 함께 호출되지 않았다면 new.target은 undefined다.
  if (!new.target) {
    // new 연산자와 함께 생성자 함수를 재귀 호출하여 생성된 인스턴스를 반환한다.
    return new Circle(radius);
  }
  this.radius = radius;
}

const circle = Circle(5);
```

대부분의 빌트인 생성자 함수(Object,String, Function 등…)도 적용되어 있어서 new 연산자 없이 호출해도 오류없이 동작한다.

```jsx
obj = Object();

console.log(obj); // {}
```

String, Number, Boolean 생성자 함수는 new 연산자 없이 호출하면 문자열, 숫자, 불리언 값을 반환한다. 이를 이용해 데이터의 타입을 변환하기도 한다.

```jsx
const str = String(123);
console.log(str, typeof str); // 123 string

const num = Number("123");
console.log(num, typeof num); // 123 number

const bool = Boolean(" true");
console.log(bool, typeof bool); // true boolean
```

→ IE에서는 new.target을 지원하지 않는다. 사용할 수 없는 상황이라면 스코프 세이프 생성자 패턴을 대신 사용할 수 있다고 합니다. IE 환경을 구현하실 분은.. 참고 하시길..^^
