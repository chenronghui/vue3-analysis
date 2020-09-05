# 从生成 vue app 开始

runtime-dom/src/index.ts 

```ts
import {
  createRenderer,
} from '@vue/runtime-core'
import { nodeOps } from './nodeOps'
import { patchProp, forcePatchProp } from './patchProp'
// Importing from the compiler, will be tree-shaken in prod
import { isFunction, isString, isHTMLTag, isSVGTag, extend } from '@vue/shared'


const rendererOptions = extend({ patchProp, forcePatchProp }, nodeOps)

// lazy create the renderer - this makes core renderer logic tree-shakable
// in case the user only imports reactivity utilities from Vue.
let renderer: Renderer<Element> | HydrationRenderer


function ensureRenderer() {
  return renderer || (renderer = createRenderer<Node, Element>(rendererOptions))
}


export const createApp = ((...args) => {
  const app = ensureRenderer().createApp(...args)

  if (__DEV__) {
    injectNativeTagCheck(app)
  }

  const { mount } = app
  app.mount = (containerOrSelector: Element | string): any => {
    const container = normalizeContainer(containerOrSelector)
    if (!container) return
    const component = app._component
    if (!isFunction(component) && !component.render && !component.template) {
      component.template = container.innerHTML
    }
    // clear content before mounting
    container.innerHTML = ''
    const proxy = mount(container)
    container.removeAttribute('v-cloak')
    return proxy
  }

  return app
}) as CreateAppFunction<Element>


function injectNativeTagCheck(app: App) {
  // Inject `isNativeTag`
  // this is used for component name validation (dev only)
  Object.defineProperty(app.config, 'isNativeTag', {
    value: (tag: string) => isHTMLTag(tag) || isSVGTag(tag),
    writable: false
  })
}

function normalizeContainer(container: Element | string): Element | null {
  if (isString(container)) {
    const res = document.querySelector(container)
    if (__DEV__ && !res) {
      warn(`Failed to mount app: mount target selector returned null.`)
    }
    return res
  }
  return container
}

```

`createApp` 也就是我们使用 vue 调用的第一个函数，那让我们来看看，它到底做了什么。`createApp`第一步调用了`ensureRenderer`。ensureRenderer 传入参数 rendererOptions 创建了一个 renderer 对象。rendererOptions 是一个dom操作集合对象，暂时我们可以不用管他，这个只有在后面将vnode转换成dom并且插入到dom树中才会用到。renderer 对象的 createApp 的方法则是通过 传入根组件选项 生成了 app。最后 我们看到的就是 重写 mount 方法，添加了获取挂载dom树为根组件模版的功能。

