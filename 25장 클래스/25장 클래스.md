JS는 원래 클래스 없이 프로토타입을 사용해 OOP가 가능했다. 하지만 es6에서부터 `class` 문법이 도입됐다.
클래스 문법은 JS에서 객체를 생성하는 방법 중 하나이다. 

클래스와 생성자 함수의 주요 차이점은 아래와 같다.
1. 클래스는 `new` 없이 호출할 수 없다.
2. 클래스는 `extend`, `super`를 사용할 수 있다.
3. 클래스는 호이스팅이 발생하지 않는 것처럼 동작한다.
4. 클래스의 constructor, 메서드는 모두 열거 불가능하다.
# 클래스 정의
```js
const Persion = class {};

const Person = class MyClass {}; // 일급 객체기 때문에 변수에 대입할 수 있다. 
```

클래스는 표현식으로 정의 가능하며 함수와 같이 JS에서의 일급 객체이다. 

클래스는 다음과 같이 사용할 수 있다.
```js
class Person {
	constructor(name) {
		this.name = name;
	}
	// prototype method
	sayHi() {
		console.log(`Hi! My name is ${this.name}`);
	}
	// static method 
	static sayHello() {
		console.log('Hello!');
	}
}

const me = new Person('Lee');
```

생성자 함수와 비교해보면 굉장히 유사하다는 걸 알 수 있다. 
![[Pasted image 20250204144601.png]]
>[!quote]
>사실 전 생성자 함수를 사용해본 적이 없어서 크게 와닿지 않는 부분이예요.
# 클래스 호이스팅
클래스는 `let`, `const` 처럼 TDZ를 가지는 상태로 호이스팅된다. 
```js
console.log(Person); // ReferenceError

class Person {} 
```
# 인스턴스 생성
클래스는 `new` 연산자 없이 호출할 수 없다.
```js
class Person {}

const me = Person(); // TypeError
```
# 메서드
## constructor
인스턴스를 생성, 초기화하는데 사용되는 메서드이다.

클래스 내에 한 개만 존재할 수 있다. `return`이 없는 것도 특징 중 하나이다. 
```js
class Person {
	constructor(name) {
		this.name = name;
	}
}
```

## function.prototype 메서드
생성자 함수와 다르게 클래스 내부에 정의한 메서드는 자동으로 function.prototype 메서드가 된다.
```js
class Person {
	// ...
	sayHi() {
		console.log(`Hi! My name is ${this.name}`);
	}
}
```
![[Pasted image 20250204144647.png]]
## static 메서드
`static` 키워드를 사용해 클래스 메서드를 추가할 수 있다. 
```js
class Person {
	// ...
	static sayHi() {
		console.log('Hi!');
	}
}
```
이렇게 생성된 메서드는 클래스의 함수 객체 프로퍼티기 때문에 인스턴스를 생성하지 않고도 호출할 수 있다.  
![[Pasted image 20250204144703.png]]
static 메서드를 인스턴스를 통해서 호출하게 되면 프로토타입 체인에 존재하지 않기 때문에 호출이 되지 않는다. 
```js
Person.sayHi(); // Hi!

const me = new Person('Lee');
me.sayHi(); // TypeError
```

static 메서드는 인스턴스의 프로퍼티를 참조할 수 없다는 특징이 있다. 
# 클래스 인스턴스 생성 과정
`constructor`를 사용해 인스턴스를 생성하는 과정은 다음과 같다.
1. 빈 객체 생성 및 `this` 바인딩
2. `this` 객체 프로퍼티 추가 및 초기화
3. `this` 객체 암묵적 반환
# 프로퍼티
```js
class User {
	age = 25 // ㅠㅠ
	
	constructor(name) {
		this.name = name; // setter 활성화
	}
	
	get name() { // getter
		return this._name; 
	}
	
	set name(value) { // setter
		this._name = value;
	}
	
	['say' + 'Hi']() { // computed method name
		alert("Hello");
	}
}
```

`this`를 통해 `constructor`에서 필드를 초기화할 수도 있고, 클래스 필드를 사용해 초기값을 지정할 수도 있다. 생성 시 초기화가 필요한 값은 `this` 바인딩을 통해서, 그렇지 않은 값은 클래스 필드를 활용하자.
# 상속에 의한 클래스 확장
![[Pasted image 20250204144733.png]]
클래스와 인스턴스의 프로토타입 체인이 별도로 존재하는 점을 주의하자. 

`extends` 키워드는 동적으로 상속을 결정할 수도 있다. 
```js
function Base1() {}

class Base2 {}

let condition = true;

class Derived extends (condition ? Base1 : Base2) {}
```
## `super` 키워드
서브클래스에서 `constructor`를 생략할 경우 수퍼클래스의 `constructor`를 사용하는 아래와 같은 생성자가 암묵적으로 정의된다. 
```js
constructor(...args) {
	super(...args);
}
```

서브클래스에서 `super.<function>`을 사용해 수퍼클래스의 프로토타입 메서드를 사용할 수 있다. 

메서드 축약 표현으로 정의된 함수는 `[[HomeObject]]`를 가지는데 이를 통해 자기가 어디서 선언됐는지를 알 수 있다. 
## 상속 클래스의 인스턴스 생성 과정
```js
class Rectangle {
	constructor(width, height) {
		this.width = width;
		this.height = height;
	}
	
	getArea() {
		return this.width * this.height;
	}
	
	toString() {
		return `width = ${this.width}, height = ${this.height}`;
	}
}

class ColorRectangle extends Rectangle {
	constructor(color, ...args) {
		super(...args);
		this.color = color; // 반드시 super()가 먼저 호출되어야 한다.
	}
	
	toString() {
		return super.toString() + `, color = ${this.color}`;
	}
}

const redRectangle = new ColorRectangle('red', 20, 30);
```
위와 같은 코드로 생성된 클래스와 인스턴스의 프로토타입 체인은 다음과 같다. 
![[Pasted image 20250204144806.png]]

인스턴스를 생성할 때, 서브클래스는 직접 인스턴스를 생성하지 않고 수퍼클래스에게 인스턴스 생성을 위임한다. 만약 `super()`를 `constructor`에서 호출하지 않고 `this`를 사용할 경우 `ReferenceError`가 발생한다.

인스턴스 생성 순서는 다음과 같다.
 1. 서브클래스의 `super` 호출
 2. 수퍼클래스의 인스턴스 생성과 `this` 바인딩
	 - `new.target`은 서브클래스가 된다.
 3. 수퍼클래스의 인스턴스 초기화
 4. 서브클래스 `this` 바인딩
 5. 서브클래스 인스턴스 초기화
 6. 인스턴스 반환