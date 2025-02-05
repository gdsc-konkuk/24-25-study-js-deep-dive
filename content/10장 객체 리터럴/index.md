# 10장 객체 리터럴

## 10.1 객체란?

- JS에서 **원시 값을 제외한 모든 나머지 값(함수, 배열, 정규 표현식 등)이 객체**이다.
- 원시 값은 변경 불가능한 값이지만 객체 타입의 값은 변경 가능한 값이다. (11장 참고)
- 객체는 0개 이상의 property로 구성된 집합이며, property는 key와 value로 구성된다.
- JS에서 사용 가능한 모든 값은 property 값이 될 수 있다.
  - JS의 함수는 "일급 객체 (18.1 절)" 이므로 값으로 취급할 수 있다. 따라서 함수도 property 값으로 사용 가능하다.
  - property 값이 함수일 경우, 일반 함수와의 구분을 위해 method라 부른다.

> [!note]
>
> 프로퍼티와 메서드
>
> - property : 객체의 상태를 나타내는 값 (data)
> - method : property를 참조하고 조작할 수 있는 동작 (behavior)

> [!tip]
>
> 객체와 함수
>
> - JS의 객체는 함수와 밀접한 연관성을 가진다. 함수로 객체 생성하기도 하고, 함수 자체도 객체이다.
> - 객체의 집합으로 프로그램을 표현하려는 패러다임을 객체지향 프로그래밍이라 한다.(19.1절)

## 10.2 객체 리터럴에 의한 객체 생성

> [!tip]
>
> 클래스 기반 객체지향 언어, 인스턴스
>
> - C++나 JAVA 같은 클래스 기반 객체지향 언어는 클래스를 사전에 정의하고 필요한 시점에 new 연산자와 함께 생성자를 호출하여 인스턴스를 생성하는 방식으로 객체 생성한다.
>   - 인스턴스는 객체가 메모리에 저장되어 실제로 존재하는 상태에 초첨을 맞춘 용어이다.
> - 참고 : [Javascript는 왜 함수형 Prototype을 선택했는가? 에 대한 철학적 논의](https://medium.com/@limsungmook/%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8%EB%8A%94-%EC%99%9C-%ED%94%84%EB%A1%9C%ED%86%A0%ED%83%80%EC%9E%85%EC%9D%84-%EC%84%A0%ED%83%9D%ED%96%88%EC%9D%84%EA%B9%8C-997f985adb42)

- JS는 프로토타입 기반 객체지향 언어로, 다양한 객체 생성 방법을 지원한다.

  - 객체 리터럴
  - Object 생성자 함수
  - 생성자 함수
  - Object.create 메서드
  - 클래스(ES6)

- 가장 일반적인 방식은 객체 리터럴 사용
  - JS는 new로 생성자를 호출할 필요 없이 객체 생성 가능하다.
- 식별자 네이밍 규칙을 따르지 않는 이름에는 반드시 따옴표를 사용해야 한다.

```js
let person = {
  name: "Lee",
  sayHello: function () {
    console.log(`hello ${this.name}$`);
  },
};

let empty = {}; // 빈 객체
console.log(typeof empty); // object
```

- 객체 리터럴의 중괄호는 코드 블록이 아니다.
  - 값으로 평가되는 표현식이므로 닫는 중괄호 뒤에 세미콜론을 붙인다.
  - 코드 블록의 닫는 중괄호에는 세미콜론을 붙이지 않는다.

## 10.3 프로퍼티

> 객체는 프로퍼티의 집합이며, 프로퍼티는 키와 값으로 구성된다.

- 프로퍼티 키 : 빈 문자열을 포함하는 모든 문자열 또는 심벌 값
- 프로퍼티 값 : JS에서 사용 가능한 모든 값

- 식별자 네이밍 규칙을 따르지 않는 이름에는 반드시 따옴표 사용

```js
let person = {
  firstName: "Jihwan", // 식별자 네이밍 준수
  "last-name": "Kim", // 식별자 네이밍 미준수
};
```

- 프로퍼티 키에 문자열이나 심벌 값 외의 숫자 값 등을 사용하면 암묵적 타입 변환으로 문자열이 된다.
- 이미 존재하는 프로퍼티 키를 중복 선언하면 나중에 선언된 프로퍼티가 먼저 선언된 프로퍼티를 덮어쓴다. error 발생하지 않음에 주의.
  - 스프레드 연산자와 함께 특정 프로퍼티 값만 변경하고 싶을 때 사용한 것 같다.

```js
let person = {
  name: "kim",
  age: "24",
};
person = { ...person, age: "25" }; // {name: 'kim', age: '25'}
```

## 10.4 메서드

- JS의 함수는 일급 객체로, 값으로 취급 가능하므로 프로퍼티 값으로도 사용 가능하다.
- 프로퍼티 값이 함수일 경우 일반 함수와 구분하여 method라 부른다.
- 메서드 내부에서 사용한 this 키워드는 객체 자신을 가리키는 참조변수가 된다.
  - 단, ES6의 화살표 함수에선 this 변수가 없기 때문에 선언 시점의 상위 스코프 this를 참조한다.
  - 참고 : [[JavaScript] 화살표 함수와 this 바인딩 (velog.io)](https://velog.io/@padoling/JavaScript-%ED%99%94%EC%82%B4%ED%91%9C-%ED%95%A8%EC%88%98%EC%99%80-this-%EB%B0%94%EC%9D%B8%EB%94%A9#:~:text=%ED%99%94%EC%82%B4%ED%91%9C%20%ED%95%A8%EC%88%98%EB%8A%94)

## 10.5 프로퍼티 접근

- 마침표 프로퍼티 접근 연산자(`.`)를 사용하는 마침표 표기법
- 대괄호 프로퍼티 접근 연사자(`[ ... ]`)를 사용하는 대괄호 표기법
  - 대괄호 표기법을 사용하는 경우 **대괄호 프로퍼티 접근 연산자 내부에 지정하는 키는 반드시 따옴표로 감싼 문자열**이어야 한다.
    - 대괄호로 감싸지 않으면 식별자로 해석한다.
    - 프로퍼티 키가 숫자로 이뤄진 경우 따옴표 생략 가능

```js
let person = {
  name: "Lee",
};

console.log(person.name);
console.log(person["name"]);
```

- 객체에 존재하지 않는 프로퍼티에 접근하면 Reference Error가 아니라 undefined를 반환한다.

> [!note]
>
> Node 환경과 브라우저 환경에서의 다른 프로퍼티 접근 결과
>
> ```js
> let person = {
>   'last-name': 'Lee',
>   1: 10
> }
> person.last-name; // 브라우저 환경 -> NaN
> 				// Node.js 환경 : ReferenceError: name is not defined
> person.'last-name'; // SyntaxEror: Unexpected string
> person['last-name']; // Lee
>
> person.1; // SyntaxError: Unexpected number
> person.'1'; // SyntaxError: Unexpected string
> person[1]; //10
> person['1']; // 10
> ```
>
> - person.last-name을 실행하면 JS 엔진은 먼저 person.last를 평가하고, 프로퍼티가 없어 undefined로 평가된다.
> - 따라서 `person.last - name == undefined - name` 이 된다.
> - 다음으로 JS 엔진은 name이라는 식별자를 찾는다. Node.js에서는 name이라는 식별자 선언이 없어서 ReferenceError가 뜬다.
> - 그러나 브라우저에는 window 전역 객체의 프로퍼티로 name 전역 변수가 존재하고, 기본값은 빈 문자열이라 undefined - '' 이 되어 NaN 이 된다.

## 10.6 프로퍼티 값 갱신

- 이미 존재하는 프로퍼티에 값을 할당하면 갱신된다.

## 10.7 프로퍼티 동적 생성

- 존재하지 않는 프로퍼티에 값을 할당하면 프로퍼티가 선언 이후 동적으로 생성되어 추가된다.

## 10.8 프로퍼티 삭제

- `delete` 연산자는 객체 프로퍼티를 삭제한다. 존재하지 않는 프로퍼티를 삭제하면 에러 없이 무시된다.

## 10.9 ES6에서 추가된 객체 리터럴 확장 기능

### 10.9.1 프로퍼티 축약 표현

- ES6에서 프로퍼티 값으로 변수 사용하는 경우, 변수 이름과 프로퍼티 키가 동일 값으로 생성하고 싶다면 생략 가능하다.
  - 프로퍼티 키가 변수 이름으로 자동 생성된다.

```js
let x = 1,
  y = 2;
const obj = { x, y };
console.log(obj); // {x: 1, y: 2}
```

### 10.9.2 계산된 프로퍼티 이름

- 문자열 또는 문자열 타입 변환 가능한 값으로 평가되는 표현식을 써서 프로퍼티 키를 동적 생성 가능하다.
  - 단, 프로퍼티 키로 사용할 표현식을 대괄호로 묶어야 하고, 이를 계산된 프로퍼티 이름(computed property name)이라 한다.
- ES5에선 객체 리터럴 외부에서 대괄호를 써야 했으나 ES6부터 객체 리터럴 내부에서도 대괄호로 프로퍼티 키 동적 생성 가능하다.

```js
//ES6
const prefix = "prop";
let i = 0;

const obj = {
  //객체 리터럴 내부에서 생성
  [`${prefix} - ${++i}`]: i,
  [`${prefix} - ${++i}`]: i,
  [`${prefix} - ${++i}`]: i,
};

console.log(obj); // {prop-1: 1, prop-2: 2, prop-3: 3}
```

### 10.9.3 메서드 축약 표현

- ES5에서 메서드 정의하려면 프로퍼티 값으로 함수 할당한다.
- ES6에선 메서드 정의 시 function 키워드 생략한 축약 표현 가능하다.
  - 메서드 축약 표현으로 정의한 메서드는 프로퍼티 할당한 함수와 다르게 동작한다. 26.2절 메서드에서 자세히 살펴봄

```js
// ES5
var obj = {
  name: "Lee",
  sayHi: function () {
    console.log("sayHi");
  },
};

// ES6
const obj = {
  name: "Lee",
  sayHi() {
    console.log("sayHi");
  },
};
```
