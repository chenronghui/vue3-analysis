(window.webpackJsonp=window.webpackJsonp||[]).push([[25],{372:function(t,s,a){"use strict";a.r(s);var r=a(42),e=Object(r.a)({},(function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h1",{attrs:{id:"浏览器渲染"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#浏览器渲染"}},[t._v("#")]),t._v(" 浏览器渲染")]),t._v(" "),a("ol",[a("li",[t._v("合适的刷新率为 60FPS")]),t._v(" "),a("li",[t._v("如果频繁触发回流和重绘会导致大于 60FPS 的刷新率，但这毫无意义，因为当前显示屏的刷新率就是 60FPS。当大于 60FPS 时，就是性能浪费")]),t._v(" "),a("li",[t._v("频发触发渲染是因为需要交替设置样式和获取元素布局")]),t._v(" "),a("li",[t._v("为什么使用 cssText 设置样式比单独使用 style 好\n现代浏览器为了提高渲染性能，使用了渲染任务队列，多次渲染任务聚合称一次，但是老的浏览器没有，但是都支持 cssText。为了提高老浏览器的性能")])]),t._v(" "),a("h1",{attrs:{id:"浏览器回流重绘调试工具"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#浏览器回流重绘调试工具"}},[t._v("#")]),t._v(" 浏览器回流重绘调试工具")]),t._v(" "),a("p",[t._v("chrome devtools --\x3e more tools --\x3e rendering --\x3e Paint flashing\nPaint flashing: 高亮(绿色)显示重绘的页面区域")]),t._v(" "),a("h1",{attrs:{id:"css3-硬件加速"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#css3-硬件加速"}},[t._v("#")]),t._v(" css3 硬件加速")]),t._v(" "),a("p",[t._v("css3 硬件加速原理是利用 GPU 硬件计算模块快速 计算图形图像，相当于搞了一个外置计算机去计算图形图像，才有性能提升一说，耗电量提升也可以理解了")]),t._v(" "),a("h1",{attrs:{id:"dom-创建"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#dom-创建"}},[t._v("#")]),t._v(" dom 创建")]),t._v(" "),a("p",[t._v("cloneNode() 的方式会比 createElement() 的方式快")]),t._v(" "),a("h1",{attrs:{id:"函数执行为什么是栈的结构"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#函数执行为什么是栈的结构"}},[t._v("#")]),t._v(" 函数执行为什么是栈的结构？")]),t._v(" "),a("h1",{attrs:{id:"异步渲染首屏时间计算方法"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#异步渲染首屏时间计算方法"}},[t._v("#")]),t._v(" 异步渲染首屏时间计算方法？")]),t._v(" "),a("h1",{attrs:{id:"json-stringfy-性能优化"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#json-stringfy-性能优化"}},[t._v("#")]),t._v(" JSON.stringfy 性能优化")])])}),[],!1,null,null,null);s.default=e.exports}}]);