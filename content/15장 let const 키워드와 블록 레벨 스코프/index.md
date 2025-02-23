# 15장 let, const 키워드와 블록 레벨 스코프

# 15.1 var 키워드로 선언된 변수의 문제점

## 15.1.1 변수 중복 선언 허용

```js
var x = 1;
console.log(x); // 1
var x = 100;
console.log(x); // 100
```

변수의 중복 선언이 가능해 값이 예기치 못하게 변경될 수 있다.

## 15.1.2 함수 레벨 스코프

```js
var x = 1;

if (true) {
  var x = 10;
}

console.log(x); // 10
```

`var`로 할당된 변수는 함수 스코프만을 지역 스코프로 인정한다. 따라서 전역 스코프에 `x`를 선언하고 조건문 내부에서 `var` 키워드를 이용해 새로 변수 할당을 했다고 해도 전역 변수 `x`의 값이 변경된다.

## 15.1.3 변수 호이스팅

```js
console.log(foo); // undefined

foo = 123;

console.log(foo); // 123

var foo;
```

js의 호이스팅으로 인해 개발자가 예상치 않은 동작을 할 수 있다.

# 15. 2 let 키워드

현재는 ES6에서 도입된 `let`과 `const`를 사용해 변 선언하는 게 권장된다.

## 15.2.1 변수 중복 선언 금지

```js
let bar = 123;

let bar = 456; // SyntaxError
```

## 15.2.2 블록 레벨 스코프

```js
let foo = 1;

{
  let foo = 2;
  console.log(foo); // 2
}

console.log(foo); // 1
```

블록 레벨의 스코프를 지역 스코프로 받아들이기 때문에 `{...}` 내부에 선언된 `foo`와 전역에 선언된 `foo`는 다른 변수로 인식된다.

> [!warning]
> 다른 변수로 인식하더라도 중복되는 변수 명명은 좋지 않은 습관인 것 같다.

## 15.2.3 변수 호이스팅

`let`으로 변수를 선언할 경우 변수 선언 이전에 변수에 접근하면 `RefferenceError`가 발생한다. 이렇게 접근 시 에러가 발생하는 영역을 **TDZ**(Temporal Dead Zone)이라고 부른다.

```js
let foo = 1;
{
  console.log(foo); // ReferenceError
  let foo = 2;
}
```

만약 let에 호이스팅이 발생하지 않는다면 `1`이 출력되어야 하지만 호이스팅이 발생해 오류가 발생하는 모습이다.

## 15.2.4 전역 객체와 let

`let`으로 선언된 전역 변수는 전역 객체의 프로퍼티로 접근이 불가능하며 **Global Execution Context**의 **Global Environment Record**에 등록된다.

# const 키워드

## 15.3.1 선언과 초기화

`const`로 선언된 변수는 반드시 선언과 동시에 초기화해야 한다.

```js
const foo; // SyntaxError
```

## 15.3.2 재할당 금지

`const`로 선언된 변수는 값을 재할당할 수 없다.

```js
const foo = 1;
foo = 2; // TypeError
```

## 15.3.3 상수

`const`로 선언된 변수에 원시값을 할당해 상수로 사용해 코드의 가독성을 높일 수 있다. 상수로서 사용할 때는 대문자와 [snake case](https://developer.mozilla.org/en-US/docs/Glossary/Snake_case)를 이용하자.

```js
const TAX_RATE = 0.1;
```

## 15.3.4 const 키워드와 객체

원시값과 다르게 `const` 키워드로 선언한 변수에 객체를 할당하면 객체 내부의 값을 변경할 수 있다.

```js
const person = {
	name: 'Lee';
};

person.name = 'Kim';

console.log(person.name); // 'Kim'
```

# 15.4 var vs. let vs. const

`var`를 쓰지 말고 `let`과`const`를 애용하도록 하자. 지역 스코프 관리, 재할당 문제 등에서 ES6에서부터 도입된 `let`, `const`를 사용하는게 좋다.
