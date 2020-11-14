### @import和link引入样式的区别

1. 从属关系区别
@import是 CSS 提供的语法规则，只有导入样式表的作用；link是HTML提供的标签，不仅可以加载 CSS 文件，还可以定义 RSS、rel 连接属性等。

2. 加载顺序区别
加载页面时，link标签引入的 CSS 被同时加载；@import引入的 CSS 将在页面加载完毕后被加载。

3. 兼容性区别
@import是 CSS2.1 才有的语法，故只可在 IE5+ 才能识别；link标签作为 HTML 元素，不存在兼容性问题。

4. DOM可控性区别
可以通过 JS 操作 DOM ，插入link标签来改变样式；由于DOM方法是基于文档的，无法使用@import的方式插入样式。

5. @import最优写法
@import的写法一般有下列几种：

@import 'style.css' //Windows IE4/ NS4, Mac OS X IE5, Macintosh IE4/IE5/NS4不识别
@import "style.css" //Windows IE4/ NS4, Macintosh IE4/NS4不识别
@import url(style.css) //Windows NS4, Macintosh NS4不识别
@import url('style.css') //Windows NS4, Mac OS X IE5, Macintosh IE4/IE5/NS4不识别
@import url("style.css") //Windows NS4, Macintosh NS4不识别
由上分析知道，`@import url(style.css)`和`@import url("style.css")`是最优的选择，兼容的浏览器最多。从字节优化的角度来看@import url(style.css)最值得推荐。


#### 参考
1. [你真的理解@import和link引入样式的区别吗](https://juejin.cn/post/6844903581649207309)
2. [link和@import的区别](https://www.jianshu.com/p/dd108656da2b)