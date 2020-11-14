### 代码片段

#### 乱序数组
```js
function randomArr(arr) {
  const result = [];
  while (arr.length) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    result.push(arr[randomIndex]);
    arr.splice(randomIndex, 1);
  }
  return result;
}
```

#### 数组扁平化
```js
function flatArr(arr) {
  return arr.reduce((result, item) => result.concat(Array.isArray(item) ? flatArr(item) : item), []);
}
```

#### 函数重载
```js
function addMethod(obj, key, fn) {
  const old = obj[key];
  obj[key] = function (...arg) {
    if (fn.length === arg.length) {
      return fn.apply(obj, arg);
    } if (typeof old === 'function') {
      return old.apply(obj, arg);
    }
  };
}
```

#### 懒加载加载js
```ts
const cache = {};

export function loadScript(src: string) {
  if (cache[src]) return cache[src];
  return cache[src] = new Promise((resolve, reject) => {
    const script: HTMLScriptElement = document.createElement('script');
    script.src = src;
    document.body.appendChild(script);
    script.onload = resolve;
    script.onerror = reject;
  });
}
```
::: tip
懒加载 js 不同于 离屏canvas、input 文件上传、a 链接下载文件，必须插入 dom 树，js 代码才会生效
:::

#### 深拷贝简单版
```ts

function cloneDeep(data) {
  if (!isObject(data)) return data;
  const loopArr = [];
  const result = {};
  function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
  }
  function shallowCopy(result, target, loopArr) {
    if (!isObject(target)) return target;
    for (const k in target) {
      if (target.hasOwnProperty(k)) {
        if (isObject(target[k])) {
          loopArr.push({
            parent: result,
            key: k,
            data: target[k],
          });
        } else {
          result[k] = target[k];
        }
      }
    }
  }
  shallowCopy(result, data, loopArr);
  while (loopArr.length) {
    const node = loopArr.shift();
    const { parent } = node;
    const { key } = node;
    const { data } = node;
    const res = parent[key] = {};
    shallowCopy(res, data, loopArr);
  }

  return result;
}

```