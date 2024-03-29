---
date: 2021-04-01
title: Typescript gymnastics
template: post
thumbnail: "../thumbnails/post.png"
slug: typescript-tips
categories:
  - Typescript
tags:
  - typescript
---

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

# Union to intersection

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

# any、unknown、void、never

- any: 任意类型
- unknown: 未知的类型

任何类型都能分配给 unknown，但 unknown 不能分配给其他基本类型，而 any 啥都能分配和被分配。

- never: 表示哪些用户无法达到的类型（异常）

```ts
function throwErr(): never {
  throw new Error("an error");
}

const age = 18;

throwErr();

// Unreachable code detected.
age.toFixed(2);
```

never 还可以用于联合类型的幺元：

```ts
// string | number
type T = string | number | never;
```

通过在联合类型中 never 类型幺元的特性可以做到很多过滤的操作
如过滤 Human 中 age 和 name 之外的成员

```ts
type Human = {
  age: number;
  name: string;
  lover: string;
  gender: 1 | 0;
};

type Filter<T> = {
  [P in {
    [K in keyof T]: K extends "age" | "name" ? K : never;
  }[keyof T]]: T[P];
};

// type T = {
//     age: number;
//     name: string;
// }
type T = Filter<Human>;

// 上面只是为了试验 never 的幺元特性 Filter可以更简单的写法
// type Filter<T, P> = {
//   [K in Extract<keyof T, P] : T[K]
// };
// Filter<Human, 'name' | 'age'>
```

# Closing note

类型支持转换 === 体操

# Further reading

- [JS 相关](/pay-attention-to-these-js)

- [TS 基础进阶](/typescript)
