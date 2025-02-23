# 20장 strict mode

# strict mode란?

Strict Mode(엄격 모드)는 JavaScript에서 **더 엄격한 문법과 실행 규칙을 적용**하는 기능이다. 실수나 버그를 방지하고, 안전하고 효율적인 코드를 작성하도록 도와준다.

- **실수 방지**: 변수 선언 없이 사용하거나 잘못된 코드를 작성하면 에러를 발생시킴.
- **보안 강화**: this 값이 의도치 않게 전역 객체를 참조하지 않도록 방지.
- **with 문 사용 금지**: 가독성과 디버깅을 어렵게 만드는 with 문을 금지.

사용 예시)

**전역의 선두 또는 함수 몸체의 선두에 `'usestrict';` 를 추가**

```jsx
"use strict";

function foo() {
  x = 10; // ReferenceError: x is not defined
}
foo();
```

```jsx
function foo() {
  "use strict";
  x = 10; // ReferenceError: x is not defined
}
foo();
```

- ES6 모듈은 Strict Mode 기본으로 적용 되어있음

- 코드에디터에 ESLint를 설치해도 같은 효과를 볼 수 있음

## **전역에 Strict Mode 적용은 피하자**

**1. 외부 라이브러리와의 충돌 가능성**

전역에 Strict Mode를 적용하면, **라이브러리나 플러그인** 코드에도 강제로 Strict Mode가 적용된다. 일부 외부 라이브러리나 오래된 코드는 Strict Mode를 고려하지 않고 작성되었기 때문에, 갑작스럽게 동작하지 않거나 오류를 발생시킬 수 있다.

**2. 전역 Strict Mode 적용이 코드 분리와 독립성을 해침**

Strict Mode를 전역에 적용하면, 프로젝트의 모든 코드가 같은 컨텍스트에서 실행된다.
이는 모듈화와 코드의 독립성을 해치고, 특정 파일에서 의도하지 않은 에러가 발생할 가능성을 높인다.

## 함수 단위로 strict mode를 적용하는 것도 피하자 (?)

위에서 실컷 전역에 쓰지말라 해놓고 함수단위로도 쓰지말래서 읭?했는데 일관되게 적용하고 싶은 경우엔 즉시실행함수를 이용할 수 있다고 합니다

```jsx
function strictFunction() {
  "use strict";
  let x = 10; // Strict Mode 적용
}

function nonStrictFunction() {
  y = 20; // Strict Mode 미적용
}
```

파일 전체에서 Strict Mode를 일관되게 적용하지 못해, **코드 가독성과 유지보수성이 떨어질 수 있음.**

그때에는! **즉시 실행 함수로 전체 스크립트에 적용 가능**

```jsx
(function () {
  "use strict";

  function strictFunction() {
    let x = 10; // Strict Mode 적용
  }

  function nonStrictFunction() {
    y = 20; // ReferenceError: y is not defined
  }
})();
```

파일 내 모든 코드가 동일한 규칙(Strict Mode) 아래에서 실행되므로, **일관성과 안정성이 보장**됨.

# strict mode가 발생시키는 에러

1. **암묵적 전역**

   ```jsx
   (function () {
     "use strict";

     x = 10;
     console.log(x); // ReferenceError: x is not defined
   })();
   ```

2. **delete 연산자로 변수,함수, 매개변수를 삭제**

   ```jsx
   (function () {
     "use strict";

     var x = 1;
     delete x; // SyntaxError: Delete of an unqualified identifier in strict mode.

     function foo(a) {
       delete a; // SyntaxError: Delete of an unqualified identifier in strict mode.
     }
     delete foo; // SyntaxError: Delete of an unqualified identifier in strict mode.
   })();
   ```

3. **매개변수 이름의 중복**

   ```jsx
   (function () {
     "use strict";

     //SyntaxError: Duplicate parameter name not allowed in this context
     function foo(x, x) {
       return x + x;
     }

     console.log(foo(1, 2));
   })();
   ```

4. **with 문의 사용**

   with 문은 전달된 객체를 스코프 체인에 추가한다. with 문은 동일한 객체의 프로퍼티를 반복해서 사용할 때 객체 이름을 생략할 수 있어서 코드가 간단해지는 효과가 있지만 성능과 가독성이 나빠지는 문제가 있다.

   ```jsx
   (function (){
       'use strict';

       // SyntaxError: Strict mode code may not include a with statement
       with { x: 1 }) {
           console.log(x);
       ｝
   }());
   ```

## strict mode 적용에 의한 변화

1. **일반함수의 this**
   strict mode에서 함수를 일반 함수로서 호출하면 `this`에 `undefined`가 바인딩 된다. 생성자함수가 아닌 일반 함수 내부에서는 this를 사용할 필요가 없기 때문.

1. **arguments 객체**

   strict mode에서는 매개변수에 전달된 인수를 재할당하여 변경해도 arguments 객체에 반영되지 않는다.

   ```jsx
   (function (a) {
     "use strict";
     // 매개변수에 전달된 인수를 재할당하여 변경
     a = 2;
     // 변경된 인수가 arguments 객체에 반영되지 않는다.
     console.log(arguments); // { 0: 1, length: 1 }
   })(1);
   ```
