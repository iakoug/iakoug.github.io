---
date: 2020-11-08
title: Typescript基础到进阶
template: post
thumbnail: "../thumbnails/post.png"
slug: typescript
categories:
  - typescript
tags:
  - typescript
---

Technology sharing — Typescript 进阶

Ts version 4.0.5

---

# Pre introduction

---

TS 的核心能力在于给 JS 提供静态类型检查，是有类型定义的 JS 的超集，包括 ES5、ES5+ 和其他一些诸如泛型、类型定义、命名空间等特征的集合。

本次分享仅会针对类型声明部分配合示例（以及部分网上 DEMO）进行着重介绍，更详细的内容以及特性可以查看 Typescript handbook。

# Base abilities

---

1. 类型推断

   - 没有明确的指定类型的时候推测出一个类型

   - 如果定义的时候没有赋值，不管之后有没有赋值，都会被推断成 any 类型而完全不被类型检查

1. declare/class/interface/type/enum

1. any

1. union |

   - 当 TypeScript 不确定一个联合类型的变量到底是哪个类型的时候，我们只能访问此联合类型的所有类型里共有的属性或方法：

   - 联合类型的变量在被赋值的时候，会根据类型推论的规则推断出一个类型

1. Array

1. function

1. tuple []

1. as or <>

1. intersection &

# Class & interface

---

接口（Interfaces）可以用于对「对象的形状（Shape）」进行描述

实现（implements）是面向对象中的一个重要概念。一般来讲，一个类只能继承自另一个类，有时候不同类之间可以有一些共有的特性，这时候就可以把特性提取成接口（interfaces），用 implements 关键字来实现

- 类实现接口

- 接口继承接口

- 接口继承类（继承类型）

# 声明

---

- .d.ts

- [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)

- declare

  - var/let/const

  - function/namespace/interface/type/class/enum/module

  - global

### 声明合并

如果定义了两个相同名字的函数、接口或类，那么它们会合并成一个类型

- function

- class/interface/namespace

- function/class(ts version lt 3.6)

### 模块化

- commonjs

  对象

```TypeScript
const $ = require('jquery')

declare module '$' {
  export function forEach(callback: () => any): void
}
```

    单一导出函数或者常量本身

```TypeScript
declare module 'koa' {
  function random_name(): any
  export=random_name
}
```

- es

```TypeScript
export declare var age: number
//or
declare var name: string
export { name }
// or
export default name
```

# 泛型

---

泛指的类型，关键目的是在成员之间（类以及类成员或者函数的入参、返回值等）提供有意义的约束

```TypeScript
interface Animal<T> {
  type: T
}

const Jessica: Animal<'people'> = {
  type: 'people'
}

const Wangcai: Animal<'dog'> = {
  type: 'dog'
}
```

具体泛型的使用配合下面大量的示例

# Conditional Types

TypeScript 2.8 introduces conditional types which add the ability to express non-uniform type mappings. A conditional type selects one of two possible types based on a condition expressed as a type relationship test:

```TypeScript
T extends U ? X : Y
```

The type above means when T is assignable to U the type is X, otherwise the type is Y.

# Let's move by a simple case

---

```TypeScript
interface Human {
  name: string
  age: number
  secondLanguage: string
  lover?: Human
}

const Jessica: Human = {
  name: 'jessica',
  age: 21,
  secondLanguage: 'Frence'
}
```

但不是每个人都有第二语言

```TypeScript
const Lucia: Human = { // Type error secondLanguage is required
  name: 'jessica',
  age: 21,
}
```

但是如果要重新写一个又显的冗余重复

两种方案

1. 写一个函数支持将指定属性去除（支持批量）返回去除后的新类型声明

2. 写一个函数支持将指定的属性变为可选（支持批量）

#### 去除指定属性

思路是获取去除的这个属性的 key，首先有

```TypeScript
type TEST<T, K> = {
  [P in K]: T[P]
}
```

这个泛型 K 其实就是泛型 T 的键值，即 `P extends keyof T`

```TypeScript
type TEST<T, K extends keyof T> = {
  [P in K]: T[P]
}
```

接下来需要定义一个函数来移除泛型 K 中指定的那个属性 key

```TypeScript
type EXCLUDE<T, U> = T extends U ? never : T;
```

最后定义支持去除指定 key 的函数 OMIT

```TypeScript
type OMIT<T, K extends keyof T> = {
  [P in EXCLUDE<keyof T, K>]: T[P]
}
```

再利用这个函数来声明新的 Human 类型

```TypeScript
type Human_exclude = OMIT<Human, 'language'>

const Lucia: Human = { // pass
  name: 'jessica',
  age: 21,
}
```

#### 将指定属性定义为可选

但是死板的去除指定属性某些场景可能不满足需求（后面可能会动态的想 TS 对象添加某个 k）

如果我们将指定的属性（language）定义为可选，那么同样满足需求

方法通用上面的移除：

    1. 定义去除key所对应的可选类型

    2. 定义去除指定的属性后的类型

    3. 选取1和2的交叉类型

```TypeScript
type type OPTIONAL_K<T, K extends keyof T> = {
  [P in K]?: T[P];
} &
  OMIT<T, K>;

const Lucia: Human = { // pass
  name: 'jessica',
  age: 21,
}

Lucia.luanguage = 'en' // pass
```

# 关于 `infer`

---

表示在 extends 条件语句中待推断的类型变量

> [infer](https://github.com/Microsoft/TypeScript/pull/21496)

```TypeScript
type ParamType<T> = T extends (param: infer P) => any ? P : T;
```

infer P 表示待推断的函数参数

如果 T 能赋值给 `(param: infer P) => any`，则结果是 `(param: infer P) => any` 类型中的参数的类型 P，否则返回为 T

# Do more practices

---

#### PICK

```TypeScript
type PICK<T, K extends keyof T> = {
  [P in K]: T[P];
};

type A = PICK<Human, "age">;
```

#### PARTIAL

```TypeScript
type PARTIAL<T> = {
  [P in keyof T]?: T[P];
};

type F = PARTIAL<Human>;
```

#### REQUIRED

```TypeScript
type REQUIRED<T> = {
  [P in keyof T]-?: T[P];
};

type G = REQUIRED<Human>;
```

#### REQUIRED_K

```TypeScript
type REQUIRED_K<T, K extends keyof T> = {
  [P in K]-?: T[P];
} &
  OMIT<T, K>;

type E = REQUIRED_K<Human, "lover">;
```

#### READONLY_RECURSIVE

```TypeScript
type SIG = {
  key: {
    key: {
      key: any
    }
  }
}

type READONLY_RECURSIVE<T> = {
  readonly [P in keyof T]: T[P] extends {[index: string]: any} ? READONLY_RECURSIVE<T[P]> : T[P];
};


const test: READONLY_RECURSIVE<SIG> = {
  key: {
    key: {
      key: 123
    }
  }
}

test.key.key = 123 // err: Cannot assign to 'key' because it is a read-only property.ts(2540)

```

#### RETURN & CONSTRUCTOR_P

```TypeScript
type RETURN<T extends () => any> = T extends () => infer R ? R : never;

type CONSTRUCTOR_P<T extends new (...args: any[]) => any> = T extends new (
  ...args: infer P
) => any
  ? P
  : any[];

function bark() {
  return "string";
}

type Eat = () => number;

type BarkReturn = RETURN<typeof bark>; // string
type EatReturn = RETURN<Eat>; // number

class HumanBeing {
  constructor(name: string, age: number) {}
}

type HB = CONSTRUCTOR_P<typeof HumanBeing>; // [string, number]

```

#### PROMISE_LIKE

```TypeScript
type PROMISE_LIKE<T = any> = {
  then<T1 = T, T2 = never>(
    resolve?: (value?: T) => T1 | PROMISE_LIKE<T1> | undefined | null,
    reject?: (value?: any) => T2 | PROMISE_LIKE<T2> | undefined | null
  ): PROMISE_LIKE<T1 | T2>;
};
```

#### PROMISE

```TypeScript
type PROMISE<T = any> = {
  then<T1 = T, T2 = never>(
    resolve?: (value?: T) => T1 | PROMISE_LIKE<T1> | undefined | null,
    reject?: (value?: any) => T2 | PROMISE_LIKE<T2> | undefined | null
  ): PROMISE_LIKE<T1 | T2>;

  catch<T1 = never>(value?: any): T1 | PROMISE_LIKE<T1> | undefined | null;
};
```

# 内置类型

---

#### source code

- 上面所有示例中除却 REQUIRED_K、OPTIONAL_K 和 READONLY_RECURSIVE 之外都是属于 typescript lib.es5.d.ts 官方库帮我们内置声明好的类型，便于平时一些快捷的使用

```TypeScript

interface PromiseLike<T> {
/**
 * Attaches callbacks for the resolution and/or rejection of the Promise.
 * @param onfulfilled The callback to execute when the Promise is resolved.
 * @param onrejected The callback to execute when the Promise is rejected.
 * @returns A Promise for the completion of which ever callback is executed.
 */
  then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): PromiseLike<TResult1 | TResult2>;
}

/**
 * Represents the completion of an asynchronous operation
 */
interface Promise<T> {
/**
 * Attaches callbacks for the resolution and/or rejection of the Promise.
 * @param onfulfilled The callback to execute when the Promise is resolved.
 * @param onrejected The callback to execute when the Promise is rejected.
 * @returns A Promise for the completion of which ever callback is executed.
 */
  then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;

/**
 * Attaches a callback for only the rejection of the Promise.
 * @param onrejected The callback to execute when the Promise is rejected.
 * @returns A Promise for the completion of the callback.
 */
catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
}

type Partial<T> = {
    [P in keyof T]?: T[P];
};

/**
 * Make all properties in T required
 */
type Required<T> = {
    [P in keyof T]-?: T[P];
};

/**
 * Make all properties in T readonly
 */
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};

/**
 * From T, pick a set of properties whose keys are in the union K
 */
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};

/**
 * Construct a type with a set of properties K of type T
 */
type Record<K extends keyof any, T> = {
    [P in K]: T;
};

/**
 * Exclude from T those types that are assignable to U
 */
type Exclude<T, U> = T extends U ? never : T;

/**
 * Extract from T those types that are assignable to U
 */
type Extract<T, U> = T extends U ? T : never;

/**
 * Construct a type with the properties of T except for those in type K.
 */
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

/**
 * Exclude null and undefined from T
 */
type NonNullable<T> = T extends null | undefined ? never : T;

/**
 * Obtain the parameters of a function type in a tuple
 */
type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;

/**
 * Obtain the parameters of a constructor function type in a tuple
 */
type ConstructorParameters<T extends new (...args: any) => any> = T extends new (...args: infer P) => any ? P : never;

/**
 * Obtain the return type of a function type
 */
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;

/**
 * Obtain the return type of a constructor function type
 */
type InstanceType<T extends new (...args: any) => any> = T extends new (...args: any) => infer R ? R : any;

```

#### others

此外还内置 es5 其他函数和方法以及数据类型等的声明如果 mac vsc 有安装 typescript 拓展可以借助 vsc 打开，具体路径在** \*\***/Applications/Visual Studio Code.app/Contents/Resources/app/extensions/node_modules/typescript/lib/lib.es5.d.ts\*\*

# 你可能需要了解的协变和逆变

---

> [what-are-covariance-and-contravariance](https://www.stephanboyer.com/post/132/what-are-covariance-and-contravariance)

我们允许一个函数类型中，返回值类型是协变的，而参数类型是逆变的。返回值类型是协变的，意思是 A ≼ B 就意味着 (T → A) ≼ (T → B) 。参数类型是逆变的，意思是 A ≼ B 就意味着 (B → T) ≼ (A → T) （ A 和 B 的位置颠倒过来了）

允许不变的列表（immutable）在它的参数类型上是协变的，但是对于可变的列表（mutable），其参数类型则必须是不变的（invariant），既不是协变也不是逆变

**在 TypeScript 中， 参数类型是双向协变的 ，也就是说既是协变又是逆变的，而这并不安全。但是现在你可以在 TypeScript 2.6 版本中通过 --strictFunctionTypes 或 --strict 标记来修复这个问题。(\***在 Java 中，数组既是可变的，又是协变的\*。Unsafe)

# 如何利用 infer 配合协变实现高级类型声明

---

### LeetCode 的一道 TS 面试题

> [https://github.com/LeetCode-OpenSource/hire/blob/master/typescript_zh.md](https://github.com/LeetCode-OpenSource/hire/blob/master/typescript_zh.md)

假设有类型

```TypeScript
interface Action<T> {
  payload?: T;
  type: string;
}

class EffectModule {
  count = 1;
  message = "hello!";

  delay(input: Promise<number>) {
    return input.then(i => ({
      payload: `hello ${i}!`,
      type: 'delay'
    }));
  }

  setMessage(action: Action<Date>) {
    return {
      payload: action.payload!.getMilliseconds(),
      type: "set-message"
    };
  }
}
```

经过 Connect 函数之后，返回值类型为

```TypeScript
type Result {
  delay<T, U>(input: T): Action<U>;
  setMessage<T, U>(action: T): Action<U>;
}
```

从表面来看我们要做的有三点：

1. delay<T, U>(input: Promise<T>): Promise<Action> 变成了 asyncMethod<T, U>(input: T): Action<U>
2. setMessage<T, U>(action: Action<T>): Action 变成了 syncMethod<T, U>(action: T): Action<U>
3. 去除了其他非函数的成员属性

**step1：构造转换 1 和 2 的函数也是最关键的一步**

```TypeScript
type Transform<T> = {
  [K in keyof T]: T[K] extends ((input: Promise<infer P>) => Promise<{
    payload: infer U;type:string
  }>)
    ? ((input: P) => Action<U>)
    : T[K] extends ((action: Action<infer P>) => {
        payload: infer U;
        type:string
      })
    ?((action: P) => Action<U>)
    : never;
}

type Temp = Transform<EffectModule>
// type Temp = {
//   count: never;
//   message: never;
//   delay: (input: number) => Action<string>;
//   setMessage: (action: Date) => Action<number>;
// }
```

**step2：构造工具函数将 step1 中得到的 never 类型的无关类型去除**

1. 获取所有的 key

2. 通过元语法批量的联合类型的 key 索引出值联合类型 value

```TypeScript
type OmitNever<T> = {
  [K in keyof T]: T[K] extends Function? never: K
}[keyof T];

type temp = OmitNever<EffectModule>
// type temp = "count" | "message"
```

**step3: 借助 Omit 移除 step1 中 step2 的 key**

```TypeScript
type Connect<T> = Omit<Transform<T>, OmitNever<T>>;

type Result = Connect<EffectModule>
// type Result = {
//   delay: (input: number) => Action<string>;
//   setMessage: (action: Date) => Action<number>;
// }
```

### 联合类型转交叉类型：A | B => A & B

```TypeScript
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((
  k: infer I,
) => void)
  ? I
  : never
```

1. 如果 extends 左边是联合类型，那么 TS 会把 extends 操作符左边的联合类型拆开做判断，这样就得到了很多个函数的联合。如果第一部分的输入是 A | B 那么输出是 `((k: A) => void) | ((k: B) => void)` 而不是 `(k: A|B) => void`

2. 如果左边是一个函数，那就把它第一个参数的类型拿出来返回

为什么 `((k: A) => void) | ((k: B) => void)` 的参数是 A & B？

**因为函数参数是逆变的，我们假设有一个变量能同时传给 \*\***`(k: A) => void 和 (k: B) => void`\***\*，那么这个变量的类型应该是 A & B 而不是 A | B**

P extends K 意味着所有 K 都可以无条件被 P 替换

一个函数能被 `(k: A) => void 和 (k: B) => void` 无条件替换，那么那个函数接受的参数必然既是 A 又是 B

**Q: 根据 conditional type \*\***`((k: A) => void) | ((k: B) => void)`\***\*不是应该被分开处理吗？如果分开处理那得到的结果依然会是 A | B**，那么又是为什么能够得出 A & B 呢？

> [conditional-type](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#conditional-types)

extends 左边联合类型被拆开判断的情况只会出现在左边是一个类型参数的情况：大概就是 type F<T> = T extends any 的这个左边是会被拆开，而 type F = A | B extends any 的左边就不会被拆开。

```TypeScript
type Union = {age} | {number}

type Union2 = number | string

type Intersection = UnionToIntersection<Union> // {age} & {number}

type Intersection2 = UnionToIntersection<Union2> // never
```

### 联合类型转 TUPLE：A | B => [A, B]

主体的思路是递归的将联合类型的每一项取出来放入元组同时移除这一项，最后将递归结束后的元组返回；同时也要写一些基本的辅助函数：

- 借助协变，联合类型转交叉类型

- 每次递归将放入元组的那个类型从原集合获取

- 每次递归获取放入元组的单个类型的 prepend 函数

- 移除每次递归推入元组的那个类型

- 借助函数入参 reset 通过 infer 推断出元祖

**step1: 将 Union 类型转为由函数类型组成的交叉类型**

```TypeScript
// union to intersection of functions
// 42 =====> (42) => void =====> ((a: U, ...r: T) infer R
type UnionToIoF<U> =
  (U extends any ? (k: (x: U) => void) => void : never) extends
  ((k: infer I) => void) ? I : never

```

**step2: 借助特性每次获取最后一个元素**

```TypeScript
type UnionPop<U> = UnionToIoF<U> extends (a: infer A) => void ? A : never;
```

**step3: 将获取的类型推入元组**

```TypeScript
type Prepend<U, T extends any[]> =
    ((a: U, ...r: T) => void) extends (...r: infer R) => void ? R : never;

```

**step4: 移除推入的类型**

```TypeScript
// 借助内置类型 Exclude
type Exclude<T, U> = T extends U ? never : T;
```

**step5: 最后一步借助上面的工具函数写转换的递归**

```TypeScript
type UnionToTupleRecursively<Union, Result extends any[]> = {
    0: Result;
    1: UnionToTupleRecursively<Exclude<Union, UnionPop<Union>>, Prepend<UnionPop<Union>, Result>>
}[[Union] extends [never] ? 0 : 1];
```

Q: 此处为何要借助 {}[] 的形式来作为递归的终止条件而不是直接使用三目呢？

type aliases are not like interfaces. interfaces are named types, where as type aliases are just aliases. internally as well they are treated differently, the compiler aggressively flatten types aliases to their declarations.

type alias 不允许调用自身 这里使用索引方式 {}[]

> Ts 4.1.3 版本后取消此限制

```TypeScript
// wrong
type UnionToTupleRecursively<Union, Result extends any[]> = [Union] extends [never] ? Result : UnionToTupleRecursively<Exclude<Union, UnionPop<Union>>, Prepend<UnionPop<Union>, Result>>
```

Below is the complete code.

```TypeScript
type UnionToIoF<U> =
    (U extends any ? (k: (x: U) => void) => void : never) extends
    ((k: infer I) => void) ? I : never

// return last element from Union
type UnionPop<U> = UnionToIoF<U> extends (a: infer A) => void ? A : never;

// prepend an element to a tuple.
type Prepend<U, T extends any[]> =
    ((a: U, ...r: T) => void) extends (...r: infer R) => void ? R : never;

type UnionToTupleRecursively<Union, Result extends any[]> = {
    0: Result;
    1: UnionToTupleRecursively<Exclude<Union, UnionPop<Union>>, Prepend<UnionPop<Union>, Result>>
}[[Union] extends [never] ? 0 : 1];

type UnionToTuple<U> = UnionToTupleRecursively<U, []>;

// support union size of 43 at most
type Union43 = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
    10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 |
    20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 |
    30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 |
    40 | 41 | 42 | 43;

type A_ = UnionPop<Union43>
// type A_ = 43
type B_ = UnionToIoF<Union43>
// type B_ = ((x: 1) => void) & ((x: 2) => void) & ((x: 3) => void) & ((x: 4) => void) & ((x: 5) => void) & ((x: 6) => void) & ((x: 7) => void) & ((x: 8) => void) & ((x: 9) => void) & ((x: 10) => void) & ((x: 11) => void) & ((x: 12) => void) & ((x: 13) => void) & ((x: 14) => void) & ((x: 15) => void) & ((x: 16) => void) & ... 26 more ... & ((x: 43) => void)

type UnionTest = string | number | 'sss' | {age:123}
type TupleTest = UnionToTuple<UnionTest>;
// type TupleTest = [a: string, a: number, a: {
//   age: 123;
// }]

type Tuple = UnionToTuple<Union43>;
// type Tuple = [a: 1, a: 2, a: 3, a: 4, a: 5, a: 6, a: 7, a: 8, a: 9, a: 10, a: 11, a: 12, a: 13, a: 14, a: 15, a: 16, a: 17, a: 18, a: 19, a: 20, a: 21, a: 22, a: 23, a: 24, a: 25, a: 26, a: 27, a: 28, a: 29, a: 30, a: 31, a: 32, a: 33, a: 34, a: 35, a: 36, a: 37, a: 38, a: 39, a: 40, a: 41, a: 42, a: 43]

```

一个有意思的是批量处理联合类型时支持的最大长度为 43（没确定是否和版本有关）,否则会抛出 Type instantiation is excessively deep and possibly infinite.ts(2589) 的异常

> Ts 4.1.3 版本后取消此限制

# Extends

---

除却本次分享之外 TS 还有很多其他相关的很多特性包括

- 类型保护 typeof/instanceof/in

- Flow type 自动更新

- Freshness [严格的字面量类型检查](https://github.com/Microsoft/TypeScript/pull/3823)

- 异常处理 Error/RangeError/RangeError...

- 兼容

- ...

以及更多高阶运用

以下为一些 ts 相关知识，有兴趣可以深入研究

### 编译原理

- AST

- Scanner（`scanner.ts`）

- Parser（`parser.ts`）

- Binder（`binder.ts`）

- Checker（`checker.ts`）

- Emitter（`emitter.ts`）
