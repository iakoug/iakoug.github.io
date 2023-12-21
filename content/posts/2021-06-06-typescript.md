---
date: 2021-06-06
title: Typescript (二)
template: post
thumbnail: "../thumbnails/post.png"
slug: /typescript-02
category: Typescript
tags:
  - typescript
---

Typescript

---

# 类型

typescript 的子类型是基于 结构子类型 的，只要结构可以兼容，就是子类型（Duck Type）

```ts
class Test {
  x: number;
}

function get(test: Test) {
  return test.x;
}

class Test2 {
  x: number;
}

const test2 = new Test2();

// Passed
get(test2);
```

> java、c++ 等传统静态类型语言是基于 名义子类型 的，必须显示声明子类型关系（继承），才可以兼容

### 对象子类型

子类型中必须包含源类型所有的属性和方法

```ts
function get(test: { x: number }) {
  return test.x;
}

const test = {
  x: 1,
  y: "2",
};

// Passed
get(test);
```

注意: 如果直接传入一个对象字面量是会报错

```ts
function get(test: { x: number }) {
  return test.x;
}

// Error!
// Argument of type '{ x: number; y: string; }' is not assignable to parameter of type '{ x: number; }'.
// Object literal may only specify known properties, and 'y' does not exist in type '{ x: number; }'.
get({ x: 1, y: "2" });
```

这是 ts 中的另一个特性，叫做: excess property check，当传入的参数是一个对象字面量时，会进行额外属性检查

### 函数子类型（逆变与协变）

逆变与协变并不是 TS 中独有的概念，在其他静态语言（java 中数组即是逆变又是协变）中也有相关理念

若

- A ≼ B 表示 A 是 B 的子类型，A 包含 B 的所有属性和方法。
- A => B 表示以 A 为参数，B 为返回值的方法。 (param: A) => B

如果我们现在有三个类型 Animal、 Human、 Man，那么肯定存在下面的关系：

Man ≼ Human ≼ Animal

对于函数类型来说，函数参数的类型兼容是反向的，我们称之为 逆变
返回值的类型兼容是正向的，称之为 协变

所以存在 Animal => Man 是 Human => Human 的子类型，可以简单理解为对于参数的类型由于逆变可以接收参数类型的父类型，对于函数的返回值由于协变可以接收返回值类型的子类型

函数的参数为多个时可以转化为 Tuple 的类型兼容性，长度大的是长度小的子类型，再由于函数参数的逆变特性，所以函数参数少的可以赋值给参数多的（参数从前往后需一一对应）

具体 demo 和示例可以参考链接

> [What are covariance and contravariance?](https://www.stephanboyer.com/post/132/what-are-covariance-and-contravariance)

> 逆变协变本质上还是为了满足里式替换

# TS 模块

1. global——不使用 import 或 export 的声明文件将被视为 global。顶级声明是全局导出的

2. module——具有至少一个 export 声明的声明文件将被视为模块。只有 export 声明会被导出，不会定义任何 global

3. 隐式 export——没有 export 声明，但使用 import 的声明文件将触发已定义但尚未说明的行为。也就是将顶级声明视为命名的 export 声明，并且不会定义 global

TS 的模块分为全局模块和文件模块，默认情况下，我们所写的代码是位于全局模块下的

```ts
// a.ts
const age = 18;
```

如果在另一个文件中使用 age，ts 的检查是正常的（全局）

```ts
// b.ts
console.log(age);
```

将当前模块变为局部的文件模块只需要当前文件存在任意的 export 或者 import 语句即可

> TypeScript 团队似乎并不喜欢第三种模式，因此请尽可能避免使用第三种模式

# TS 模块解析

共有两种可用的模块解析策略：Node 和 Classic。 你可以使用 --moduleResolution 标记来指定使用哪种模块解析策略。若未指定，那么在使用了 --module AMD | System | ES2015 时的默认值为 Classic，其它情况时则为 Node。

有一个对 module 的非相对导入 `import { b } from "module"`，它是在/root/src/folder/A.ts 文件里，会以如下的方式来定位"module"：

Node 的模块解析通过分别查找/root/src、/root、/三种路径下的 node_modules

```text
[/root/src/|/root/|/]node_modules/module.ts
[/root/src/|/root/|/]node_modules/module.tsx
[/root/src/|/root/|/]node_modules/module.d.ts
[/root/src/|/root/|/]node_modules/module/package.json (如果指定了"types"属性)
[/root/src/|/root/|/]node_modules/module/index.ts
[/root/src/|/root/|/]node_modules/module/index.tsx
[/root/src/|/root/|/]node_modules/module/index.d.ts
```

Classic 的寻址方式
这种策略在以前是 TypeScript 默认的解析策略。 现在，它存在的理由主要是为了向后兼容。

```text
/root/src/folder/module.ts
/root/src/folder/module.d.ts
/root/src/module.ts
/root/src/module.d.ts
/root/module.ts
/root/module.d.ts
/module.ts
/module.d.ts
```

link:

- [Node](https://www.tslang.cn/docs/handbook/module-resolution.html#node)
- [Classic](https://www.tslang.cn/docs/handbook/module-resolution.html#classic)

# 声明文件

以 .d.ts 结尾的文件用来给 ts 提供类型定义的文件
如果一个文件有扩展名 .d.ts，这意味着每个根级别的声明都必须以 declare 关键字作为前缀。这有利于让开发者清楚的知道，在这里 TypeScript 将不会把它编译成任何代码，同时开发者需要确保这些在编译时存在。

### 如何使用？

- 首先会寻找 package json 中 types 或 typings 指定的文件
- 然后寻找包的根目录下的 index.d.ts
- TS 官方维护的@types[DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped/)

### 扩展原生对象

默认的一些原生对象上是不存在一些自定义挂载的属性，所以不可以直接赋值，可以输用方括号赋值语句，但是 get 操作时也必须用 [] ，并且没有类型提示。

可以通过类型合并

```ts
declare interface Window {}

// or
declare global {
  interface Window {}
}
```

### 扩展第三方库

```ts
import Vue from "vue";

declare module "vue/types/vue" {
  interface Vue {}
}
```

### 处理其他扩展名文件

```ts
declare module "*.css" {
  const content: any;
  export default content;
}
```

---

# tsconfig

tsconfig.json 是 ts 的编译器（tsc）将 ts 编译为 js 的配置文件，在开发和编译阶段提供支持（语法检查，代码依赖等）

# 使用 tsconfig.json

如果一个目录下存在一个 tsconfig.json 文件，那么它意味着这个目录是 TypeScript 项目的根目录。 tsconfig.json 文件中指定了用来编译这个项目的根文件和编译选项。 一个项目可以通过以下方式之一来编译：

- 不带任何输入文件的情况下调用 tsc，编译器会从当前目录开始去查找 tsconfig.json 文件，逐级向上搜索父目录
- 不带任何输入文件的情况下调用 tsc，且使用命令行参数--project（或-p）指定一个包含 tsconfig.json 文件的目录

当命令行上指定了输入文件时，tsconfig.json 文件会被忽略

# compilerOptions

"compilerOptions"可以被忽略，这时编译器会使用默认值。[在这里查看完整的编译器选项列表](https://www.tslang.cn/docs/handbook/compiler-options.html)

### target: "es5",

指定 ECMAScript 目标版本: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', or 'ESNEXT'（"ESNext"表示最新的 ES 语法，包括还处在 stage X 阶段）

```ts
// index.ts
export function test() {
  return new Promise((resolve) => {
    resolve(1);
  });
}
```

```ts
// --target es3
"use strict";
var __assign =
  (this && this.__assign) ||
  Object.assign ||
  function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s)
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
exports.__esModule = true;
function test() {
  return new Promise(function(resolve) {
    var a = {
      a: 1,
      b: 2,
    };
    resolve(__assign({ c: 3 }, a));
  });
}
exports.test = test;
```

```ts
// --target es5
"use strict";
var __assign =
  (this && this.__assign) ||
  Object.assign ||
  function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s)
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
Object.defineProperty(exports, "__esModule", { value: true });
function test() {
  return new Promise(function(resolve) {
    var a = {
      a: 1,
      b: 2,
    };
    resolve(__assign({ c: 3 }, a));
  });
}
exports.test = test;
```

```ts
// --target es6
export function test() {
  return new Promise((resolve) => {
    let a = {
      a: 1,
      b: 2,
    };
    resolve(Object.assign({ c: 3 }, a));
  });
}
```

```ts
// --target esnext
export function test() {
  return new Promise((resolve) => {
    let a = {
      a: 1,
      b: 2,
    };
    resolve({
      c: 3,
      ...a,
    });
  });
}
```

### module: "commonjs",

指定使用模块: 'commonjs', 'amd', 'system', 'umd' or 'es2015'
取决于编译产物想要被用在什么环境

```ts
// index.ts
export function test() {
  return "hello";
}
```

```ts
// --module CommonJs

exports.__esModule = true;
function test() {
  return "hello";
}
exports.test = test;
```

```ts
// --module AMD

define(["require", "exports"], function(require, exports) {
  "use strict";
  exports.__esModule = true;
  function test() {
    return "hello";
  }
  exports.test = test;
});
```

```ts
// -module system
System.register([], function(exports_1, context_1) {
  "use strict";
  var __moduleName = context_1 && context_1.id;
  function test() {
    return "hello";
  }
  exports_1("test", test);
  return {
    setters: [],
    execute: function() {},
  };
});
```

```ts
// -module UMD
(function(factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
    var v = factory(require, exports);
    if (v !== undefined) module.exports = v;
  } else if (typeof define === "function" && define.amd) {
    define(["require", "exports"], factory);
  }
})(function(require, exports) {
  "use strict";
  exports.__esModule = true;
  function test() {
    return "hello";
  }
  exports.test = test;
});
```

```ts
// -module es6 or es2015 or esnext

export function test() {
  return "hello";
}
```

### lib: [],

指定要包含在编译中的库文件 'es6','dom'

### allowJs: true,

allowJs 设置为 true 的时候，生成的文件里会包含 leon.js 编译之后的版本，默认 false

### checkJs: true,

检查 javascript 文件中的错误 默认 false

### jsx: "preserve",

指定 jsx 代码用于的开发环境 'preserve', 'react-native', or 'react'

### declaration: true, declarationDir: ''

编译生成相应的 '.d.ts' 文件 如果设为 true,编译每个 ts 文件之后会生成一个 js 文件和一个声明文件，但是 declaration 和 allowJs 不能同时设为 true

declarationDir 指定生成的.d.ts 文件的目录(默认跟随源文件)

### sourceMap: true,

编译生成相应的 '.map' 文件

### declarationMap: true,

编译生成相应的 '.map' 文件

### outFile: "./",

指定输出文件合并为一个文件，只有设置 module 的值为 amd 和 system 模块时才支持这个配置

### outDir: "./",

指定输出文件夹，值为一个文件夹路径字符串，输出的文件都将放置在这个文件夹

### rootDir: "./",

指定编译文件的根目录，编译器会在根目录查找入口文件 默认为 tsconfig.json 所在目录

### composite: true,

是否编译构建引用项目

引用的工程必须启用新的 composite 设置。 这个选项用于帮助 TypeScript 快速确定引用工程的输出文件位置。 若启用 composite 标记则会发生如下变动：

- 对于 rootDir 设置，如果没有被显式指定，默认为包含 tsconfig 文件的目录
- 所有的实现文件必须匹配到某个 include 模式或在 files 数组里列出。如果违反了这个限制，tsc 会提示你哪些文件未指定
- 必须开启 declaration 选项

### removeComments: true,

指定是否将编译后的文件注释删掉，设为 true 的话即删除注释，默认为 false

### newLine: "LF"

生成的代码里使用什么样的换行符

### noEmit: true,

不生成编译文件

### downlevelIteration: true,

当 target 为"ES5"或"ES3"时，为"for-of" "spread"和"destructuring"中的迭代器提供完全支持
相当于提供 polyfill

```ts
let a = [1, 2, 3];
let b = [4, ...a];

// downlevelIteration: false
var a = [1, 2, 3];
var b = [4].concat(a);

// downlevelIteration: true
var __read =
  (this && this.__read) ||
  function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o),
      r,
      ar = [],
      e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
        ar.push(r.value);
    } catch (error) {
      e = { error: error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
var __spread =
  (this && this.__spread) ||
  function() {
    for (var ar = [], i = 0; i < arguments.length; i++)
      ar = ar.concat(__read(arguments[i]));
    return ar;
  };
var a = [1, 2, 3];
var b = __spread([4], a);
```

### importHelpers: true,

定是否引入 tslib 里的复制工具函数（比如 `__extends`， `__rest` 等）默认为 false

> 这个选项似乎已经没有什么用

### isolatedModules: true,

指定是否将每个文件作为单独的模块，默认为 true

```ts
// index.ts
function a() {}

// error TS1208: Cannot compile namespaces when the '--isolatedModules' flag is provided.
```

他不可以和 declaration 同时设定（与 'ts.transpileModule' 类似）

> error TS5053: Option 'declaration' cannot be specified with option 'isolatedModules'.

---

检查

### strict: true,

指定是否启动所有类型检查，如果设为 true 这回同时开启下面这几个严格检查，默认为 false

- --noImplicitAny
- --noImplicitThis
- --alwaysStrict
- --strictNullChecks
- --strictFunctionTypes
- --strictPropertyInitialization

### noImplicitAny: true,

如果我们没有一些值设置明确类型，编译器会默认认为这个值为 any 类型，如果将 noImplicitAny 设为 true,则如果没有设置明确的类型会报错，默认值为 false

### strictNullChecks: true,

设为 true 时，null 和 undefined 值不能赋值给非这两种类型的值，别的类型的值也不能赋给他们，除了 any 类型，还有个例外就是 undefined 可以赋值给 void 类型

### noImplicitThis: true,

不允许 this 为 any

### strictFunctionTypes: false,

指定是否使用函数参数双向协变检查

### alwaysStrict: true,

以严格模式检查每个模块，并在每个文件里加入 'use strict' 用来告诉浏览器该 JS 为严格模式

### noUnusedLocals: true,

不允许声明未使用的变量

### noUnusedParameters: true,

不允许声明未使用的函数入参

### noImplicitReturns: true,

不允许函数没有明确返回值

### noFallthroughCasesInSwitch: true,

检查 switch 中是否有 case 没有使用 break 跳出 switch,默认为 false

---

模块解析选项

### moduleResolution: "node",

选择模块解析策略： 'node' (Node.js) or 'classic' (TypeScript pre-1.6)。默认是 classic

### baseUrl: "./",

用于设置解析非相对模块名称的基本目录，相对模块不会受到 baseUrl 的影响

### paths

模块名到基于 baseUrl 的路径映射的列表

```ts
paths: {
  "*": ["./node_modules/@types", "./typings/*"],
},
```

### rootDirs: [],

> [https://www.typescriptlang.org/docs/handbook/module-resolution.html#virtual-directories-with-rootdirs](https://www.typescriptlang.org/docs/handbook/module-resolution.html#virtual-directories-with-rootdirs)

允许将不同的目录，通过这个选项都指定为根目录，从而使导入文件的时候比较方便

### typeRoots: [],

指定声明文件或文件夹的路径列表，如果指定了此项，则只有在这里列出的声明文件才会被加载

默认所有可见的"@types"包会在编译过程中被包含进来。 node_modules/@types 文件夹下以及它们子文件夹下的所有包都是可见的； 也就是说， ./node_modules/@types/，../node_modules/@types/和../../node_modules/@types/等等

如果指定了 typeRoots，只有 typeRoots 下面的包才会被包含进来，下面 types 同理

### types: [],

指定需要包含的模块，只有在这里列出的模块的声明文件才会被加载

### allowSyntheticDefaultImports: true,

是否允许从没有 default 导出的模块中导入 default。不影响代码的编译结果，只影响 typechecking

### sourceRoot: "./",

指定调试器应该找到 TypeScript 文件而不是源文件的位置，这个值会被写进.map 文件里

### mapRoot: "./",

指定调试器找到映射文件而非生成文件的位置，指定 map 文件的根路径，该选项会影响.map 文件中的 sources 属性

### inlineSourceMap: true,

定是否将 map 文件内容和 js 文件编译在一个同一个 js 文件中，如果设为 true,则 map 的内容会以#soureMappingURL=开头，然后接 base64 字符串的形式插入在 js 文件底部

### inlineSources: true,

指定是否进一步将 ts 文件的内容也包含到输出文件中 将代码与 sourcemaps 生成到一个文件中，要求同时设置了 --inlineSourceMap 或 --sourceMap 属性

### preserveSymlinks: true,

不把符号链接解析为真实路径

### esModuleInterop: true,

通过导入内容创建命名空间，实现 CommonJS 和 ES 模块之间的互操作性
生成的文件会为兼容 babel 而添加 `__importStar`和`__importDefault`的 helper, 这个选项会把 allowSyntheticDefaultImports 设置成 true

> 类似 allowSyntheticDefaultImports 选项，实测这个选项为 true 和 false 并不影响生成的代码。具体什么情况会影响不太清楚

### experimentalDecorators: true,

指定是否启用实验性的装饰器特性

### emitDecoratorMetadata: true,

指定是否为装上去提供元数据支持，关于元数据，也是 ES6 的新标准，可以通过 Reflect 提供的静态方法获取元数据，如果需要使用 Reflect 的一些方法，需要引用 ES2015.Reflect 这个库

### suppressExcessPropertyErrors: true,

不对对象自变量的额外属性进行类型检测，默认 false

```ts
export class A {
  name: string
  age = 10

  constructor(age: number) {
    this.age = age
  }
}

let a: A = {
  name: 'leon',
  age: 30,
  gender: 'male'
}

// --suppressExcessPropertyErrors false
error TS2322: Type '{ name: string; age: number; gender: string; }' is not assignable to type 'A'.
Object literal may only specify known properties, and 'gender' does not exist in type 'A'.

//  --suppressExcessPropertyErrors true
pass
```

# files: ["core.ts", "sys.ts"],

指定要编译的文件列表

"files"指定一个包含相对或绝对文件路径的列表。 "include"和"exclude"属性指定一个文件 glob 匹配模式列表。 支持的 glob 通配符有：

- 匹配 0 或多个字符（不包括目录分隔符）
- ? 匹配一个任意字符（不包括目录分隔符）
- \*\*/ 递归匹配任意子目录

如果一个 glob 模式里的某部分只包含\*或.\*，那么仅有支持的文件扩展名类型被包含在内（比如默认.ts，.tsx，和.d.ts， 如果 allowJs 设置能 true 还包含.js 和.jsx）。

如果"files"和"include"都没有被指定，编译器默认包含当前目录和子目录下所有的 TypeScript 文件（.ts, .d.ts 和 .tsx），排除在"exclude"里指定的文件。JS 文件（.js 和.jsx）也被包含进来如果 allowJs 被设置成 true

如果指定了 "files"或"include"，编译器会将它们结合一并包含进来。 使用 "outDir"指定的目录下的文件永远会被编译器排除，除非你明确地使用"files"将其包含进来（这时就算用 exclude 指定也没用）

# include: ["src/**/*"],

指定要编译的路径列表

使用"include"引入的文件可以使用"exclude"属性过滤。 然而，通过 "files"属性明确指定的文件却总是会被包含在内，不管"exclude"如何设置。 如果没有特殊指定， "exclude"默认情况下会排除 node_modules，bower_components，jspm_packages 和<outDir>目录。

# exclude: ["node_modules", "**/*.spec.ts"],

表示要排除的，不编译的文件，它也可以指定一个列表，规则和 include 一样，可以是文件可以是文件夹，可以是相对路径或绝对路径，可以使用通配符

# extends: "./config/base",

指定一个其他的 tsconfig.json 文件路径，来继承这个配置文件里的配置，继承来的文件的配置会覆盖当前文件定义的配置

# compileOnSave: true,

让 IDE 在保存文件的时候根据 tsconfig.json 重新生成文件

支持这个特性需要 Visual Studio 2015， TypeScript1.8.4 以上并且安装 atom-typescript 插件

# references

工程引用

一个对象数组，指定要引用的外部工程（文件）

每个引用的 path 属性都可以指向到包含 tsconfig.json 文件的目录，或者直接指向到配置文件本身（名字是任意的）。

当你引用一个工程时，会发生下面的事：

- 导入引用工程中的模块实际加载的是它输出的声明文件（.d.ts）
- 如果引用的工程生成一个 outFile，那么这个输出文件的.d.ts 文件里的声明对于当前工程是可见的
- 构建模式（后文）会根据需要自动地构建引用的工程
- 当你拆分成多个工程后，会显著地加速类型检查和编译，减少编辑器的内存占用，还会改善程序在逻辑上进行分组

引用的工程必须启用新的 composite 设置。 这个选项用于帮助 TypeScript 快速确定引用工程的输出文件位置

```ts
references: [
  {
    path: "../test",
  },
],
```

带 prepend 的 outFile

你可以在引用中使用 prepend 选项来启用前置某个依赖的输出：

```json
"references": [
  {
    "path": "../utils",
    "prepend": true,
  }
]
```

前置工程会将工程的输出添加到当前工程的输出之前。 它对.js 文件和.d.ts 文件都有效，source map 文件也同样会正确地生成。

tsc 永远只会使用磁盘上已经存在的文件来进行这个操作，因此你可能会创建出一个无法生成正确输出文件的工程，因为有些工程的输出可能会在结果文件中重覆了多次。 例如：

```text
   A
  ^ ^
 /   \
B     C
 ^   ^
  \ /
   D

```

这种情况下，不能前置引用，因为在 D 的最终输出里会有两份 A 存在 - 这可能会发生未知错误。

# 完整的 tsconfig.json

```json
{
  // 基本编译选项
  compilerOptions: {
    // 指定 ECMAScript 目标版本: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', or 'ESNEXT'（"ESNext"表示最新的 ES 语法，包括还处在 stage X 阶段）
    target: "es5",
    // 指定使用模块: 'commonjs', 'amd', 'system', 'umd' or 'es2015'
    module: "commonjs",
    // 指定要包含在编译中的库文件 'es6','dom'
    lib: [],
    // 生成的代码里使用什么样的换行符
    newLine: "LF",
    // 允许 tsc 编译 javascript 文件 默认 false
    allowJs: true,
    // 检查 javascript 文件中的错误 默认 false
    checkJs: true,
    // 指定jsx代码用于的开发环境 'preserve', 'react-native', or 'react'
    jsx: "preserve",
    // 编译生成相应的 '.d.ts' 文件 如果设为true,编译每个ts文件之后会生成一个js文件和一个声明文件，但是declaration和allowJs不能同时设为true
    declaration: true,
    declarationDir: "",
    // 编译生成相应的 '.map' 文件
    sourceMap: true,
    // 编译生成相应的 '.map' 文件
    declarationMap: true,
    // 指定输出文件合并为一个文件，只有设置module的值为amd和system模块时才支持这个配置
    outFile: "./",
    // 指定输出文件夹，值为一个文件夹路径字符串，输出的文件都将放置在这个文件夹
    outDir: "./",
    // 指定编译文件的根目录，编译器会在根目录查找入口文件 默认为tsconfig.json所在目录
    rootDir: "./",
    // 是否编译构建引用项目
    composite: true,
    // 指定是否将编译后的文件注释删掉，设为true的话即删除注释，默认为false
    removeComments: true,
    // 不生成编译文件
    noEmit: true,
    // 当target为"ES5"或"ES3"时，为"for-of" "spread"和"destructuring"中的迭代器提供完全支持
    downlevelIteration: true,
    // 定是否引入tslib里的复制工具函数，默认为false
    importHelpers: true,
    // 指定是否将每个文件作为单独的模块，默认为true，他不可以和declaration同时设定（与 'ts.transpileModule' 类似）.
    isolatedModules: true,
    // 检查
    // 指定是否启动所有类型检查，如果设为true这回同时开启下面这几个严格检查，默认为false
    strict: true,
    // 如果我们没有一些值设置明确类型，编译器会默认认为这个值为any类型，如果将noImplicitAny设为true,则如果没有设置明确的类型会报错，默认值为false
    noImplicitAny: true,
    // 设为true时，null和undefined值不能赋值给非这两种类型的值，别的类型的值也不能赋给他们，除了any类型，还有个例外就是undefined可以赋值给void类型
    strictNullChecks: true,
    // 不允许 this 为 any
    noImplicitThis: true,
    // 指定是否使用函数参数双向协变检查
    strictFunctionTypes: false,
    // 以严格模式检查每个模块，并在每个文件里加入 'use strict' 用来告诉浏览器该JS为严格模式
    alwaysStrict: true,
    // 不允许声明未使用的变量
    noUnusedLocals: true,
    // 不允许声明未使用的函数入参
    noUnusedParameters: true,
    // 不允许函数没有明确返回值
    noImplicitReturns: true,
    // 检查switch中是否有case没有使用break跳出switch,默认为false
    noFallthroughCasesInSwitch: true,
    /* 模块解析选项 */
    // 选择模块解析策略： 'node' (Node.js) or 'classic' (TypeScript pre-1.6)。默认是classic
    moduleResolution: "node",
    // 用于设置解析非相对模块名称的基本目录，相对模块不会受到baseUrl的影响
    baseUrl: "./",
    // 模块名到基于 baseUrl 的路径映射的列表
    paths: {
      "*": ["./node_modules/@types", "./typings/*"],
    },
    // 指定一个路径列表，在构建时编译器会将这个路径中的内容都放到一个文件夹中
    rootDirs: [],
    // 指定声明文件或文件夹的路径列表，如果指定了此项，则只有在这里列出的声明文件才会被加载
    typeRoots: [],
    // 指定需要包含的模块，只有在这里列出的模块的声明文件才会被加载
    types: [],
    // 指定允许从没有默认导出的模块中默认导入
    allowSyntheticDefaultImports: true,
    // 指定调试器应该找到TypeScript文件而不是源文件的位置，这个值会被写进.map文件里
    sourceRoot: "./",
    // 指定调试器找到映射文件而非生成文件的位置，指定map文件的根路径，该选项会影响.map文件中的sources属性
    mapRoot: "./",
    // 定是否将map文件内容和js文件编译在一个同一个js文件中，如果设为true,则map的内容会以//#soureMappingURL=开头，然后接base64字符串的形式插入在js文件底部
    inlineSourceMap: true,
    // 指定是否进一步将ts文件的内容也包含到输出文件中 将代码与 sourcemaps 生成到一个文件中，要求同时设置了 --inlineSourceMap 或 --sourceMap 属性
    inlineSources: true,
    // 不对对象自变量的额外属性进行类型检测
    suppressExcessPropertyErrors: true,
    // 不把符号链接解析为真实路径
    preserveSymlinks: true,
    // 通过导入内容创建命名空间，实现CommonJS和ES模块之间的互操作性
    esModuleInterop: true,
    // 指定是否启用实验性的装饰器特性
    experimentalDecorators: true,
    // 指定是否为装上去提供元数据支持，关于元数据，也是ES6的新标准，可以通过Reflect提供的静态方法获取元数据，如果需要使用Reflect的一些方法，需要引用ES2015.Reflect这个库
    emitDecoratorMetadata: true,
  },
  // 指定要编译的路径列表
  include: ["src/**/*"],
  // 表示要排除的，不编译的文件，它也可以指定一个列表，规则和include一样，可以是文件可以是文件夹，可以是相对路径或绝对路径，可以使用通配符
  exclude: ["node_modules", "**/*.spec.ts"],
  // 指定要编译的文件列表
  files: ["core.ts", "sys.ts"],
  // 指定一个其他的tsconfig.json文件路径，来继承这个配置文件里的配置，继承来的文件的配置会覆盖当前文件定义的配置
  extends: "./config/base",
  // 让 IDE 在保存文件的时候根据 tsconfig.json 重新生成文件，支持这个特性需要 Visual Studio 2015， TypeScript1.8.4 以上并且安装
  compileOnSave: true,atom-typescript 插件
  // 一个对象数组，指定要引用的项目
  references: [
    {
      path: "../test",
    },
  ],
};


```

# DOCS

- [https://www.tslang.cn/docs/handbook/tsconfig-json.html](https://www.tslang.cn/docs/handbook/tsconfig-json.html)
- [https://www.tslang.cn/docs/handbook/compiler-options.html](https://www.tslang.cn/docs/handbook/compiler-options.html)

---

以下归纳 TS 使用过程中一些技巧以及注意事项(typescript@4.2.3)

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
