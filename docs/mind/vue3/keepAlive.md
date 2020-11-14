### vue3 keepAlive 原理

### 前言

1. 一切都是 `vnode`，组件是 `vnode` ，组件产出是 `vnode`
2. 组件 `vnode` 引用了 组件实例 `instance`
3. 缓存 `vnode` 就是缓存组件

### 设计 vnode 渲染器

```js

```
### 初步设计 vnode 缓存

```js
const keepAlive = {
  name: `KeepAlive`,
  data() {
    return {
      cache: new Map(),
      // keys: Keys = new Set()
      pendingCacheKey: null,
      // current:null
    };
  },
  method: {
    setCache() {},
  },
  mounted() {},
  updated() {},
  render() {
    const children = this.slots.default();
    const vnode = children[0];
    const comp = vnode.type; // 缓存组件选择对象
    const cachedVNode = this.cache.get(comp);
    if (cachedVNode) {
      vnode.el = cachedVNode.el;
      vnode.component = cachedVNode.component;
      vnode.shapeFlag |= ShapeFlags.COMPONENT_KEPT_ALIVE;
    } else {
      this.cache.set(comp, vnode);
    }
    vnode.shapeFlag |= ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE;
    return vnode;
  },
};
```

#### 参考
