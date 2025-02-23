클로저는 스스로가 생성된 외부 환경(문맥)을 기억하는 함수이다. 

정의를 백날 읽는 것보다 예시를 보는게 직관적으로 이해하기 쉽다. 
```js
const x = 1;

function outer() {
	const x = 10;
	
	function inner() {
		console.log(x);
	}
	
	return inner;
}

const func = outer();

func(); // 10
```
JS에서 모든 함수는 자신이 생성될 때의 외부 환경(문맥)을 기억하기에 모든 함수는 클로저가 된다. 
# 모든 함수를 **일반적으로** 클로저라고 하지는 않는다?
상위 스코프의 식별자를 참조하지 않을 경우, 최적화를 통해 `[[Environment]]` 의 값을 비우기 때문에 상위스코프를 기억하지 않는다.
>[!quote] '모든 함수가 클로저인데 추가적인 최적화가 일어났다.'라고 이해하는 게 좋아 보인다. '일반적으로'와 같은 말은 공부하는 우리를 힘들게 만든다 :(

엔진 최적화를 통해 하위 함수가 참조하는 식별자만 기억한다. 자세한 내용은 패스 ^^
# 클로저의 활용
```js
const increase = (function () {
	let num = 0;

	return function () {
		return ++num;
	};
}());

console.log(increase()); // 1
console.log(increase()); // 2
console.log(increase()); // 3
```
OOP에서 `private` 과 같은 접근 제어자를 사용하는 것과 비슷하게 사용할 수 있다. 
>[!tip] 
>private 문법이 [es2025](https://tc39.es/ecma262/#sec-names-and-keywords)부터 추가됐다. protected는 스펙에 존재하지는 않는다. 

이런 방식은 변수의 의도치 않은 변경을 막고, 필요 없는 곳에 노출되지 않도록 코드를 작성할 수 있다. 이는 코드 또는 객체 사이의 의존도를 낮추는 데 큰 도움을 준다. 

>[!quote] 리엑트에서 `useState` 대신 `useReducer`를 사용하는 이유와 유사하다.

위의 코드를 더 발전시켜서 아래와 같이 객체를 만들 수도 있다.

```js
const counter = (function() {
	let num = 0;
	return {
		increase() {
			return ++num;
		},
		decrease() {
			return num > 0 ? --num : 0;
		}
	};
}());

console.log(counter.increase()); // 1
console.log(counter.increase()); // 2

console.log(counter.decrease()); // 1
console.log(counter.decrease()); // 0 
```

>[!quote] 굉장히 Java의 클래스와 비슷해 보인다.

함수형 프로그래밍에서도 side effect를 발생시키지 않기 위해 클로저를 적극적으로 사용한다. 

```js
function makeCounter(predicate) {
	let counter = 0;
	
	return function () {
		counter = predicate(counter);
		return counter;
	};
}

function increase(n) {
	return ++n;
}

const increaser1 = makeCounter(increase);
const increaser2 = makeCounter(increase);

console.log(increaser1()); // 1
console.log(increaser1()); // 2
console.log(increaser2()); // 1
```
위의 예시에서는 `increaser1`, `increaser2`가 각각 별도의 렉시컬 환경을 가지고 있어 변수를 공유하지 않고 `counter`를 증가시킬 수 있다. 
![[Pasted image 20250204144500.png]]