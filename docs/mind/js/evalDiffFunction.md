### eval() 和 Function 的区别
1. eval 直接调用 作用域链在当前创建函数 间接调用在全局作用域
2. Function 创建的函数作用域为全局作用域
3. Function 性能稍好与 eval 就在于 作用域链查找端(直接查找全局作用域)

#### 参考
1. [mdn eval](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/eval)
1. [mdn Function](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function)