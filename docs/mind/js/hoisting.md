### 变量提升

js 非严格模式 允许变量声明不加 var;
js 变量经过三个过程 声明 -> 初始化 -> 使用；而 let const 在变量提升的情况下只有声明，没有如 var 会给变量初始化为 undefined;
所以在当前作用域声明前使用，会报错 `ReferenceError: Cannot access 'a' before initialization`

1. 
```js
console.log(foo);
foo = 1//js 非严格模式 允许变量声明不加 var；但是没有变量提升
// Uncaught ReferenceError: foo is not defined
//     at <anonymous>:1:13
```
2. 
```js
foo = 1//js 非严格模式 允许变量声明不加 var；但是没有变量提升
console.log(foo);
// 1
```
3. 
```js
var a = 1;
{
  console.log(a); 
  let a = 3
}
// Uncaught ReferenceError: Cannot access 'a' before initialization
//     at <anonymous>:1:24
```

#### 参考
1. [MDN 变量提升](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Grammar_and_types#%E5%8F%98%E9%87%8F%E6%8F%90%E5%8D%87)
2. [前端面试题——var、let和const](https://zhuanlan.zhihu.com/p/92261408)

