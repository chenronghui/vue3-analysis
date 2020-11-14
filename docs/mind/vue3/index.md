### vue3 沙箱机制

### 前言

vue3 沙箱主要分两种

1. 浏览器编译版本，浏览器版本是使用`with`语法加上`proxy`代理拦截
2. 本地预编译版本，通过在模版预编译阶段转换阶段，使用转换插件`transformExpression`将非白名单标识符挂在在组件代理对象下

### 浏览器编译版本

render 函数编译结果

```html
<div>{{test}}</div>
<div>{{Math.floor(1)}}</div>
```

to

```js
const _Vue = Vue;

return function render(_ctx, _cache, $props, $setup, $data, $options) {
  with (_ctx) {
    const {
      toDisplayString: _toDisplayString,
      createVNode: _createVNode,
      Fragment: _Fragment,
      openBlock: _openBlock,
      createBlock: _createBlock,
    } = _Vue;

    return (
      _openBlock(),
      _createBlock(
        _Fragment,
        null,
        [
          _createVNode("div", null, _toDisplayString(test), 1 /* TEXT */),
          _createVNode(
            "div",
            null,
            _toDisplayString(Math.floor(1)),
            1 /* TEXT */
          ),
        ],
        64 /* STABLE_FRAGMENT */
      )
    );
  }
};
```

从上面的代码，我们能发现，变量标识符没有增加前缀，只是用`with`语法包裹了一下，延长作用域链，那么是如何做到 js 沙箱拦截的呢？例如变量`test`，
理论上说，当前作用域链没有`test`变量，变量会从上一层作用域查找，直到查找到全局作用域，但是，实际上只会在`_ctx`上查找，
原理很简单，`_ctx`是一个代理对象，那么我们如何使用`Proxy`做拦截，示例代码如下：

```js
const GLOBALS_WHITE_LISTED =
  "Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI," +
  "decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array," +
  "Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt";

const isGloballyWhitelisted = (key) => {
  return GLOBALS_WHITE_LISTED.split(",").includes(key);
};

const hasOwn = (obj, key) => {
  return Object.prototype.hasOwnProperty.call(obj, key);
};

const origin = {};
const _ctx = new Proxy(origin, {
  get(target, key, reciever) {
    if (hasOwn(target, key)) {
      Reflect.get(target, key, reciever);
    } else {
      console.warn(
        `Property ${JSON.stringify(key)} was accessed during render ` +
          `but is not defined on instance.`
      );
    }
  },
  has(target, key) {
    // 如果是 全局对象 返回false，不触发get 拦截，从上一层作用域查找变量
    // 如果不是 全局对象 返回true，触发get 拦截
    return !isGloballyWhitelisted(key);
  },
});
```

代码很简单，为什么这么简单的代码就能做到拦截？
因为 `with` 语句会触发 `has` 拦截，当 `has` 返回 `true`，就会 触发代理对象 `get` 拦截，如果返回 `false`， 则代理对象 `get` 拦截不会触发，变量不在当前代理对象查找，直接查找更上一层作用域

### 本地预编译版本

```html
<div>{{test}}</div>
<div>{{Math.floor(1)}}</div>
```

to

```js
import {
  toDisplayString as _toDisplayString,
  createVNode as _createVNode,
  Fragment as _Fragment,
  openBlock as _openBlock,
  createBlock as _createBlock,
} from "vue";

export function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (
    _openBlock(),
    _createBlock(
      _Fragment,
      null,
      [
        _createVNode("div", null, _toDisplayString(_ctx.a), 1 /* TEXT */),
        _createVNode(
          "div",
          null,
          _toDisplayString(Math.floor(1)),
          1 /* TEXT */
        ),
      ],
      64 /* STABLE_FRAGMENT */
    )
  );
}
```

从上面的代码我们可以发现，非白名单标识符都添加了`_ctx` 变量前缀，那么是如何做到的呢？当本地编译 template 时，处于转换阶段时会对 变量表达式节点`NodeTypes.SIMPLE_EXPRESSION`进行添加前缀处理，示例代码如下：

```ts
const GLOBALS_WHITE_LISTED =
  "Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI," +
  "decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array," +
  "Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt";

const isGloballyWhitelisted = (key) => {
  return GLOBALS_WHITE_LISTED.split(",").includes(key);
};
const isLiteralWhitelisted = (key)=>{
  return 'true,false,null,this'.split(',').includes(key)
}
export function processExpression(
  node
) {
  const rewriteIdentifier = (raw) => {
    return `_ctx.${raw}`
  }
  const rawExp = node.content
  if (isSimpleIdentifier(rawExp)) {
    const isAllowedGlobal = isGloballyWhitelisted(rawExp)
    const isLiteral = isLiteralWhitelisted(rawExp)
    if (!isAllowedGlobal && !isLiteral) {
      node.content = rewriteIdentifier(rawExp)
    }
    return node
  }
```

当然上面的代码只是简化版本，原版插件还做了精确到了`__props` `$setup`，减短变量查询路径，提高性能，还有通过`babel`编译复杂表达式比如：箭头函数。

### 总结

整个 vue3 js 沙箱机制就解释结束了，当初浏览器编译版本困扰了我很久，因为不知道 `has` 可以拦截 `with` 语句变量查询

#### 参考

1. [Proxy handler.has](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/has)
2. [说说 JS 中的沙箱](https://juejin.cn/post/6844903954074058760#heading-3)
3. [动手写 js 沙箱](https://zhuanlan.zhihu.com/p/58602800)
