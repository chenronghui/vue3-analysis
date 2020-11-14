# 绘本阅读总结

绘本阅读是一个高仿真实书本阅读 h5 项目，每一页都有场景动画、人物动画、人物语音、背景音乐、字幕，所以整个项目资源上会比一般交互应用更为庞大，
那么如何做到整个项目的流畅运行

## 资源预加载

为了使整个绘本阅读不必等待资源的加载，我们预加载了后端接口数据、多媒体资源，主要资源有音频、动画svga文件、图片。

### 资源预加载第一阶段--起步

提前请求接口，缓存数据到内存中，下次请求直接使用缓存
```js
const cache = {};
// 获取绘本基础信息
export async function getBaseDate(data) {
  const strkey = JSON.stringify(data);
  if (cache[strkey]) {
    return cache[strkey];
  }
  const { data } = await request.post('url');
  // eslint-disable-next-line no-return-assign
  return (cache[strkey] = data
}
```

### 资源预加载第二阶段--多媒体资源加载

预加载的实现比较简单，比如：

1. 通过创建 Image 对象来加载图片

```js
const img = document.createElement('img'); // 等价于 new Image()
img.src = '';
img.onload= ()=>{};
img.onerror = ()=>{};
```

2. 通过创建 audio 对象来加载音频

```js
const audio = document.createElement('audio'); // 等价于 new Audio()
audio.src = '';
audio.ended = ()=>{};
audio.onerror = ()=>{}
audio.muted = true;
audio.playbackRate = 4;
audio.play();
```
::: tip
这里涉及音频自动播放问题，我们采用4倍速静音播放来让音频自动播放，从而快速预加载音频，当然这里可能会有兼容问题，所以需要 native 端设置 webview 允许自动播放音频。
:::

3. 使用 svga 开源模块加载 svga 文件

```js
import SVGA from 'svgaplayerweb'
const parser = new SVGA.Parser();
parser.load('url')
```

### 资源预加载第三阶段--外置设备音频

上面的音频预加载看起来没问题，很OK。但是在真机测试时，发现 iOS 手机音频首次播放总是会慢8s左右(不同的机型会有点区别)。<br>
猜想：因为使用静音播放预加载，从而导致音频资源占用，只有等待前面音频播放完毕，资源释放，才等到现有音频播放。<br>
验证：使用 ajax 异步加载文件，避免音频资源占用

::: tip
ajax 异步加载文件需要允许跨域
:::

```js
const xhr = new XMLHttpRequest();
xhr.onload = () => {};
xhr.onerror = () => {};
xhr.open('GET', 'url', false);
xhr.send(null);
```

::: tip
同样，我们也想到了其他资源同样也可以使用 ajax 异步加载，尤其是 svga 文件的加载，其开源模块的加载还包括了文件资源的预处理，这并不是我们需要的。
:::

### 资源预加载第四阶段--内存

经过测试，发现 iOS 手机首次音频播放延迟问题确实解决。看起来很完美，但是，打开 chrome performance monitor 性能时时监听工具，发现内存占用暴增 20M。<br>
猜想：为什么 svga 开源库加载没有内存暴增问题。<br>
验证：通过阅读 svga parse.load 方法，发现，同样是使用 ajax 异步加载，但是多了这么一行代码：<br>

```js
xhr.responseType = 'arraybuffer';
```
加上这么一行之后，暴增的 20M 内存瞬间就没有了，问题解决。
::: tip
猜测 ajax 请求默认返回 text 文本，从而需要浏览器缓存到内存中，等待程序使用，而 arraybuffer 是 缓冲区内存，占用的是系统内存，返回的是内存块引用
:::

### 资源预加载第五阶段--网络

上面通过 ajax 预加载文件看起来完美。但是，忽略了一个问题--网络问题，因为浏览器限制，一个 TCP 链接最多只允许5个 http 请求同时进行，那么当前面的请求文件资源比较庞大，或者网络状态差的情况下，后面的 ajax 请求将会超时，那么如何解决。使用调度器，进行网络调度。一个简单的调度器如下：
```js
class Scheduler {
  list = [];

  finishCount = 0;

  tasks = 0

  constructor({
    num, autoProcess = false, errorCount = 3, onPerTaskFinish, onError
  } = {}) {
    this.num = num;
    this.autoProcess = autoProcess;
    this.errorCount = errorCount;
    this.onPerTaskFinish = onPerTaskFinish;
    this.onError = onError;
  }

  async add(fn) {
    this.tasks += 1;
    await new Promise((resolve) => {
      this.list.push(resolve);
    });
    let result;
    try {
      result = await fn();
    } catch (error) {
      // eslint-disable-next-line no-param-reassign
      fn.error = fn.error || 0 + 1;
      if (fn.error <= this.errorCount) {
        this.add(fn);
      } else {
        this.onError && this.onError();
      }
    }

    if (this.list.length > 0) {
      this.list.shift()();
    }
    this.finishCount += 1;
    this.onPerTaskFinish && this.onPerTaskFinish();

    return result;
  }

  process() {
    if (this.list.length > 0) {
      const tasks = this.list.slice(0, this.num);
      this.list = this.list.slice(this.num);
      tasks.forEach((task) => {
        task();
      });
    }
  }
}

export default Scheduler;

```
```js
const schedulerPreload = new Scheduler({ num: 5});

schedulerPreload.add(() => axios.get('url', { responseType: 'arraybuffer', loading: false }));

schedulerPreload.process();

```

::: tip
设置调度器每次最多同时有5个网络请求，没完成一个请求，从队列中取出一个新的任务执行。
如果资源可以配置多个域名，那么就可以绕过一个TCP链接只能同时5个http请求，但是没有如果。
:::

### 资源预加载第六阶段--本地化

web服务基本上都是一些静态资源，我们是不是可以考虑，把资源先下载到客户端，等待用户使用。所有，本地化出现了。资源本地化之后，如何利用：

1. native 通过网络拦截，检测请求路径是否命中本地文件，命中则返回本地文件，不命中则代理网络请求。
2. native 使用已下载 web 资源，本地起 web 服务，接口预先加载。

::: tip
本地化主要是 native 端实现
:::

## 资源预处理

同样为了页面流畅，我们对数据进行了预处理，主要有首页场景动画、首页人物动画、字幕数据。

### 资源预处理第一阶段--起步

1. 对首页 svga 动画文件解析。

```js
function preloadPromise(src) {
  return new Promise((resolve) => {
    parser.load(src, (videoItem) => {
      resolve(videoItem);
    }, reject);
  });
}
```

2. 对字幕数据进行解析

::: tip
这里对字幕进行解析是为了实现字幕跑马灯、重点字词标记功能，以及返回统一数据结构，防止接口变动改动业务代码
:::

```js 
const str = item.subtitle.replace(new RegExp(zhmMark.source, 'g'), '');

let subtitle = item.subtitle || '';

const importWordIndexs = item.wordsInputVOList?.map((li) => {
  const startIndex = str.indexOf(li.words);
  return {
    startIndex,
    endIndex: startIndex + li.words.length - 1
  };
}) || [];

let analyzedStrList = JSON.parse(item.analyzedStr || '[]');

const destArr = [];

analyzedStrList.forEach((wordLi, index) => {
  let temp = '';
  temp += str[index];
  let charIndex = subtitle.indexOf(temp);
  temp = subtitle.slice(0, charIndex) + temp;

  let nextChar = subtitle[++charIndex];
  while (zhmMark.test(nextChar)) {
    temp += nextChar;
    nextChar = subtitle[++charIndex];
  }
  subtitle = subtitle.slice(charIndex);

  const importantIndex = importWordIndexs.findIndex(
    (offset) => index >= offset.startIndex && index <= offset.endIndex
  );
  const { startIndex = -1, endIndex = -1 } = importWordIndexs[importantIndex] || {};
  destArr.push({
    ...wordLi,
    word: temp,
    read: false,
    importantIndex,
    startFlag: index === startIndex,
    endFlag: index === endIndex
  });
});

return destArr;
```

3. 替换正则，使用哈希表

字幕跑马灯中英文标点符号不高亮展示，上面采用正则进行匹配，m个符号，最差时间复杂度 O(m)，使用哈希表，时间复杂度 O(1)
```js
const charMap = '，。！：‘“’”？、…；～﹏￥（）【】『』『』「」﹃﹄〔〕—'.split('').reudce((obj, key)=>{
  obj[key] = true;
  return obj;
},{})
```
::: tip
这个正则替换为哈希表没有实现
:::

### 资源预处理第二阶段--cpu

上面的 svga 动画文件解析是全量解析，这样会导致一个问题：cpu密集计算，阻塞渲染线程。为了绕过这个限制，只解析首页 svga 动画文件。

1. 只预先解析首页 svga 动画

```js 
let firstPromise = null;

firstPromise = [
  preloadPromise('url'),
  preloadPromise('url')
]

export function getFirstPromise() {
  return firstPromise;
}

export function clearFirstPromise() {
  firstPromise = null;
}
```
::: tip
因为首页预解析只在首页需要，提供 clear 方法清除内存占用。
:::

::: tip
svga 动画解析，也考虑过使用webWorker 多线程解析，利用当下手机的多内核，但是实际测试发现，webWorker 全量解析时，中低端手机直接黑屏，如果加上调度算法，又会导致
后面的 svga 解析缓慢
:::

2. 利用本地化下载时 cpu 空闲时间

在本地化下载文件时，native 可以对下载的 svga 文件，进行预解析，同时保存解析结果为 json 文件，减轻后续播放 cpu 密集计算

::: tip
当前未实现，只是一个想法
:::

## 启动运行

### 启动运行第一阶段--内存

如果全量渲染所有页面，页面只有10页的情况下内存占用基本上就到到达150M，
所以采用虚拟渲染的概念，每次播放只预渲染前中后3页动画、前中后3幕字幕，减少 dom 数量，减少内存占用。

### 启动运行第二阶段--cpu

上面只渲染3个页面虽然内存占用少了，但是会出现cpu频繁计算，在每次切换页面时，都需要解析下一个页面组员，解析svga、渲染字幕，这里就会出现一个cpu峰值时期，在此刻再次切换页面，在低端机页面容易出现卡死、白屏等问题。

::: tip
如果在本地化 下载阶段就进行解析 svga 文件，也许就可以解决 cpu 频繁计算问题。
:::

::: tip
svga 开源播放库，在播放时，在每一帧会重复进行屏幕适配，本项目中的播放库经过修正，只在播放器初始化时进行屏幕适配，已发公司 npm 管理库。
:::

## 结语

当前项目是 2D 平面翻页，3D 翻页也已经实现，但是只能在电脑端模拟，手机端性能较差，也许当实现本地化资源下载时期进行解析动画文件，可以解决 3D 翻页效果差的问题。

