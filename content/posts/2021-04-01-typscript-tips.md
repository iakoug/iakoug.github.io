---
date: 2021-04-01
title: Typescript 系列（二）使用技巧
template: post
thumbnail: "../thumbnails/post.png"
slug: typescript-tips
categories:
  - Typescript
tags:
  - typescript
---

typescript@4.2.3

To be continue...

归纳 TS 使用过程中一些技巧以及注意事项

---

# const enum vs. enum

两者在使用方式没有区别，但是 TS 编译的结果会存在很大的差异

```ts
enum TestConstEnum {
  a,
  b,
  c,
}

console.log(TestConstEnum.a);
```

上面的代码在经过 TS 编译后会输出

```ts
"use strict";
var TestConstEnum;
(function(TestConstEnum) {
  TestConstEnum[(TestConstEnum["a"] = 0)] = "a";
  TestConstEnum[(TestConstEnum["b"] = 1)] = "b";
  TestConstEnum[(TestConstEnum["c"] = 2)] = "c";
})(TestConstEnum || (TestConstEnum = {}));
console.log(TestConstEnum.a);
```

可以看到是被编译出相当多的一堆内容，生成 IIFE 内部被编译出一个分别用 0 1 2 和 a b c 互相当做键值的对象

而使用 const enum 声明的对象

```ts
const enum TestEnum {
  a,
  b,
  c,
}

console.log(TestEnum.a);
```

被 TSC 编译后会得到

```ts
"use strict";
console.log(0 /* a */);
```

编译的过程直接将实际的 value 输出到使用的地方

所以一般情况下使用 const enum 会极大的减小编译的代码体积

> 需要注意的是动态的使用 key 的时候无法使用 cont enum<br />
> A const enum member can only be accessed using a string literal

# Typescript Type-Only Imports and Export

> TypeScript 在 3.8 版本中新增了对仅导入或者导出类型的语法支持

```ts
import type { SomeThing } from "./some-module.js";
export type { SomeThing };
```

这个功能的意义在于 tree shaking 的时候可以直接在编译阶段就去除你的类型而不会将当做依赖打包到你的 chunk 里

> 在使用该语法的时候需要注意 class 在运行时具有值，静态语法检查的时候具有类型，并且使用是上下文相关的。 所以使用导入类型导入 class 时，不能对这个 class 进行继承拓展之类的操作

```ts
import type { Component } from "react";

interface ButtonProps {
  // ...
}

class Button extends Component<ButtonProps> {
  //               ~~~~~~~~~
  // error! 'Component' only refers to a type, but is being used as a value here.
  // ...
}
```

# Assert

### !

由于开发场景的限制，有些时候 TS 的类型检查异常在我们确定没有问题的时候可以通过断言来解决

```ts
const methods = {
  a: function(p1: number, p2?: string) {},
  b: function(p1: number, p2: string) {},
};

function c(p1: number, p2?: string, f?: boolean) {
  const name = f ? "a" : "b"; // 一些逻辑封装

  // Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
  // Type 'undefined' is not assignable to type 'string'.
  // methods[name](p1, p2)
  methods[name](p1, p2!); // 如果我们明确逻辑封装控制的f变量可以保持p2没有值的时候返回的是false这里可以使用断言来解决类型异常
}
```

### is

is 的主要用法是可以帮助我们在类型检查阶段对类型的校验进行限制（Narrow）

```ts
function isString(data: any): boolean {
  return typeof data === "string";
}
```

上述 isString 方法用来判断一个数值是不是字符串，返回一个布尔值

```ts
function test(char) {
  if (isString(char)) {
    console.log(char.length); // Works fine
    console.log(foo.toExponential(2)); // Type check passed!!!
  }
}
```

上述代码在静态检查以及编译阶段都不会存在问题，但是在运行时会报错（字符串的原型上没有数字的 toExponential 方法）

我们可以借助 is 来进行限制类型之后（类型守卫 Type guard）规避掉此问题

```ts
function isString(data: any): data is string {
  return typeof data === "string";
}

function test(char) {
  if (isString(char)) {
    console.log(char.length); // Works fine
    // Type error: Property 'toExponential' does not exist on type 'string'.
    console.log(foo.toExponential(2));
  }
}
```

# []

```ts
enum A {
  a = "1",
  b = "11",
}

type T = {
  [key in A]: "a";
};

const a: T = {
  // Error Type of computed property's value is 'string', which is not assignable to type '"a"'.
  [A["a"]]: "a",
  [A.b]: "a",
};
```

ts 的和类型相关的中括号"[]" 取的都是类型不是值，可以类似 A.b 使用点语法也可以 as const

```ts
const a: T = {
  // Pass
  [A["a"]]: "a",
  [A.b]: "a",
} as const;
```

### as const

我们来看下官方对 as const 的介绍

> TypeScript 3.4 introduces a new construct for literal values called const assertions. Its syntax is a type assertion with const in place of the type name (e.g. 123 as const). When we construct new literal expressions with const assertions, we can signal to the language that no literal types in that expression should be widened (e.g. no going from "hello" to string)object literals get readonly properties array literals become readonly tuples

```tsx
let x = "hello" as const;

// Type 'readonly [10, 20]'
let y = [10, 20] as const;

// Type '{ readonly text: "hello" }'
let z = { text: "hello" } as const;
```

从官方的介绍中，对我们最有用的是

**no literal types in that expression should be widened (e.g. no going from `"hello"` to `string`)**

这句话的意思是，通过 as const 被声明的字面量类型，在类型推导中不会被扩展成为 "**父类型**"，比如对于字面量类型 "hello" 来讲，在类型推导中会被扩展为 string 类型，对于字面量量类型 9999 来说，在推导中会被扩展为 number 类型。

# Union to intersection

将联合类型转为交叉类型

```ts
type UnionToIntersection<T> = (T extends any
? (a: T) => any
: never) extends (a: infer R) => any
  ? R
  : never;

type Union = { age: any } | { name: any };

// {
//     age: any;
// } & {
//     name: any;
// }
type R = UnionToIntersection<Union>;
```

主要借助 conditional type 比较的特性，`T extends any ? (a: T) => any` 中的 T 由于是联合类型会转换为`(a: { age: any }) => any` 和 `(a: { name: any }) => any`

特别的是，如果泛型 T 是个具体的联合类型而不是泛型，如

```ts
type Union = { age: any } | { name: any };
// {
//     age: any;
// } | {
//     name: any;
// }
type Res = (Union extends any
? (a: Union) => any
: never) extends (a: infer R) => any
  ? R
  : never;
```

上述转换不生效

# Equal

如何判断两个类型相同

如果需要编写一个高级类型 Equal，作用就是判断两个类型是否相同

如果存在两个类型 a 和 b，如果可以保证 a extends b 的同时 b extends a，那么 a 和 b 类型可以保证相同吗

```ts
type Equal<X, Y> = X extends Y ? (Y extends X ? true : false) : false;
// type Result = boolean
type Result = Equal<any, number>;
```

推断出 Result 的类型是 boolean 而不是期望的 false

> conditional type 中左侧的表达式如果是联合类型那么被转换为每一项分别与表达式 extends 右侧的类型进行比较（如上面的 Union to intersection），而 any 属于联合类型所以这个类型推断的结果 true 或者 false 都是有可能的，最终返回了 boolean

同样的 boolean 也有类似的行为（boolean 就是 true | false）

```ts
type B<T> = T extends true ? 1 : 2;
// 2 | 1
type Res = B<boolean>;
```

可以借助泛型来推断一下入参的类型

```ts
type Equal<V1, V2> = (<T>() => T extends V1 ? 1 : 2) extends <
  T
>() => T extends V2 ? 1 : 2
  ? true
  : false;

// type Result = false
type Result = Equal<any, number>;
```

上面我们借助泛型 T 同时对 V1 和 V2 的泛型来进行推断，然后借助 1 和 2 来代替比较

# Range number

需要限制一个数字范围 [A, B)，由于 [A, B) 分别得到 [0, A) 和 [0, B)
然后从[0, B)中移除（Exclude）[0, A)

```ts
type PrependNextNum<A extends Array<unknown>> = A["length"] extends infer T
  ? ((t: T, ...a: A) => void) extends (...x: infer X) => void
    ? X
    : never
  : never;

type EnumerateInternal<
  N extends number,
  A extends Array<unknown> = []
> = N extends A["length"] ? A : EnumerateInternal<N, PrependNextNum<A>>;

type Enumerate<N extends number> = EnumerateInternal<N> extends (infer E)[]
  ? E
  : never;

type Range<FROM extends number, TO extends number> = Exclude<
  Enumerate<TO>,
  Enumerate<FROM>
>;

// 1 ~ 9
type Test = Range<1, 10>;
```

> 这个方式存在一些瑕疵，类型的递归处理目前只能支持到 43（大小以及数量） 以内

# Date limitation

对日期格式进行限制

- 1900-2099 之间的日期
- 1 3 5 7 8 10 12 月份存在 31 天
- 4 6 9 11 月份是 30 天
- 平年 2 月 28 天
  - 年份不能被 4 整除
  - 世纪不能被 4 整除（被 100 整除不能被 400 乘除）
- 闰年 2 月 29 天

```ts
type Day28 =
  | '01'
  | '02'
  | '03'
  | '04'
  | '05'
  | '06'
  | '07'
  | '08'
  | '09'
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
type Month = '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10' | '11' | '12'
type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
type Year = `${19 | 20}${Digit}${Digit}`

type IsDivide4<S extends string | number> = `${S}` extends '0' | '4' | '8'
  ? true
  : `${S}` extends `${number | ''}${`${0 | 2 | 4 | 6 | 8}` | `${1 | 3 | 5 | 7 | 9}${2 | 6}`}`
  ? true
  : false

type IsLeapYear<S extends string | number> = `${S}` extends `${infer H}00` ? IsDivide4<H> : IsDivide4<S>

type DateString =
  | `${Year}-${'01' | '03' | '05' | '07' | '08' | '10' | '12'}-${Day28 | 29 | 30 | 31}`
  | `${Year}-${'04' | '06' | '09' | 11}-${Day28 | 29 | 30}`
  | {
      [Y in Year]: `${Y}-02-${IsLeapYear<Y> extends true ? Day28 | 29 : Day28}`
    }[Year]

const dates: DateString[] = [
  '2021-02-12',
  // Error: Type '"1900-02-29"' is not assignable to type 'DateString'.
  '1900-02-29',
  // Error: Type '"2019-02-29"' is not assignable to type 'DateString'.
  '2019-02-29',
  // Type '"2020-12-32"' is not assignable to type 'DateString'
  '2020-12-32',
  '2020-02-29',
  '2000-02-29'
]

```

# Closing note

类型支持转换 === 体操

# Further reading

- [JS 相关](/pay-attention-to-these-js)

- [TS 基础进阶](/typescript)
