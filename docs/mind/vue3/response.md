### vue3 响应式原理

### 前言

在深入 vue3 响应原理，我们需要先明确一个概念，`响应式的核心就是组件监听数据变动，数据变动触发组件更新`，也就是说组件需要监听数据变动，并且当数据变动时，数据应当通知组件更新。

### 监听数据的情况

1. 监听单个数据

```js
// 数组
arr[0];
// 对象
obj[key];
```

2. 监听数据长度

```js
// 数组
arr.length;
// 对象
Object.keys(obj).length;
```

3. 监听数据块和数据长度

```js
// 数组
arr.includes(1);
arr.indexOf(1);
arr.lastIndexOf(1);
// 对象
Object.keys(obj).map((key) => {
  return obj[key];
});
```

### 分析可能的数据的变动

1. 单个数据变动

```js
// 数组
arr[0] = 1; // set
// 对象
obj["a"] = 1; // set
```

2. 数据长度变动

```js
// 数组
arr.length = arr.length + 1; // add, add length
arr[arr.length] = 1; //add
// 对象
obj = { a: 1 };
obj.b = 1; //add, add length
```

3. 数据元素变动并且数据长度变动

```js
// 数组
arr.push(1); // add，add length
arr.pop(1); // delete, delete length
arr.shift(1); // delete, delete length
arr.unshift(1); // add,add length
arr.splice(1); // (add, add length) or (delete, delete length) or (set)
// 对象
obj = { a: 1 };
obj.b = 1; //add, add length
```

当然一般数据长度的变化都伴随者 数据元素的变化，上面 3 中情况可以简单的合并成为2种
既然我们已经分析清楚数据变动，那么我们来尝试监听数据变动，并且当数据变动时，通知我们更新

### 模拟数据监听

1. 监听单个数据变动，并且触发目标函数更新

```js
const jobs = new Map();

function track(target, key) {
  const job = new Set();
  job.add(update);
  jobs.set(key, job);
}

function trigger(target, key) {
  const jobSet = jobs.get(key) || new Set();
  jobSet.forEach((job) => {
    job();
  });
}

function reactive(obj) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      track(target, key);
      return Reflect.get(target, key, receiver);
    },
    set(target, key, value, receiver) {
      const oldValue = target[key];
      const flag = Reflect.set(target, key, value, receiver);
      if (oldValue !== value) {
        trigger(target, key);
      }
      return flag;
    },
  });
}
// 初始化需要监听的数据
const data = [1];
// 设置数据代理
const dataProxy = reactive(data);
// 但数据变动时 需要重新执行的函数
let update = () => {
  console.log(dataProxy[0]);
};

update(); // 1,3
dataProxy[0] = 3;
dataProxy[0] = 3;

// 初始化需要监听的数据
const obj = { a: 1 };
// 设置数据代理
const objProxy = reactive(obj);
// 但数据变动时 需要重新执行的函数
update = () => {
  console.log(objProxy.a);
};

update(); // 1,3
objProxy.a = 3;
objProxy.a = 3;
```

2. 监听数据块变动并且数据长度变动

::: tip
我们单一数组数据类型来讨论， 对象类型比较简单。我们知道，一般情况下，我们都是使用数组方法来对数组进行操作，
而数组操作方法我们可以简单的分成两类：

1. 数据查询操作： includes、indexOf、lastIndexOf
   这几个查询操作都对数据每个元素变动敏感、并且对数据长度敏感
2. 数据修改、增加、删除操作：push、pop、shift、unshift、splice
   这几个操作间接的对数据发生了变动

:::

```js
const hasOwn = (obj, key) => {
  return Object.prototype.hasOwnProperty.call(obj, key);
};
const arrayInstrumentations = {};
let shouldTrack = true;
["includes", "indexOf", "lastIndexOf"].forEach((key) => {
  const method = Array.prototype[key];
  arrayInstrumentations[key] = function(...args) {
    const arr = this._raw; // this 指向 proxy
    for (let i = 0, l = this.length; i < l; i++) { // this.length 触发长度变动收集
      track(arr, i + ""); //触发元素变动收集
    }
    return method.apply(arr, args);
  };
});
["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
  const method = Array.prototype[key];
  arrayInstrumentations[key] = function(...args) {
    shouldTrack = false;
    const res = method.apply(this, args); // 触发元素变动， 触发长度变动 length 修改
    shouldTrack = true;
    return res;
  };
});

const targetMap = new WeakMap();

function track(target, key) {
  if (shouldTrack) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, (depsMap = new Map()));
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, (dep = new Set()));
    }
    if (!dep.has(update)) {
      dep.add(update);
    }
  }
}

function trigger(target, key, newValue) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  const effects = new Set();
  const add = (effectsToAdd) => {
    if (effectsToAdd) {
      effectsToAdd.forEach((effect) => {
        effects.add(effect);
      });
    }
  };

  depsMap.forEach((dep, key) => {
    if (key === "length" || key >= newValue) {
      add(dep);
    }
  });

  effects.forEach((effect) => {
    effect();
  });
}

function reactive(obj) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      if (key === "_raw") {
        return target;
      }
      const targetIsArray = Array.isArray(target);
      if (targetIsArray && hasOwn(arrayInstrumentations, key)) {
        return Reflect.get(arrayInstrumentations, key, receiver);
      }
      track(target, key);
      return Reflect.get(target, key, receiver);
    },
    set(target, key, value, receiver) {
      const oldValue = target[key];
      const flag = Reflect.set(target, key, value, receiver);
      if (oldValue !== value) {
        trigger(target, key, value);
      }
      return flag;
    },
  });
}

// 初始化需要监听的数据
const data = [1];
// 设置数据代理
const dataProxy = reactive(data);
// 但数据变动时 需要重新执行的函数
let update = () => {
  console.log(dataProxy.includes(3));
};

update(); // false, true, true
dataProxy.push(3);
dataProxy.push(5);
```

### 总结
响应式原理不复杂，我们只要明确响应式是为了监听数据变动，数据变动通知更新，那我们就要仔细分析各种数据可能的数据操作，使其和监听、触发更新结合起来就可以了，
像 Map、Set、weakMap、weakSet 这些数据结构，我们仔细分析一下那些操作是查询操作，查询操作监听，那些操作是数据变动操作，数据变动响应那就很容易理解
