# vue 翻书组件

<Turn >
  <TurnItem>
    <div slot="open" :style="`background: black; color: white; font-size: 40px; height: 100%`"
      >0</div
    >
    <div slot="back" :style="`background: red; color: white; font-size: 40px; height: 100%`"
      >1</div
    >
  </TurnItem>
  <TurnItem>
    <div slot="open" :style="`background: black; color: white; font-size: 40px; height: 100%`"
      >0</div
    >
    <div slot="back" :style="`background: red; color: white; font-size: 40px; height: 100%`"
      >1</div
    >
  </TurnItem>
  <TurnItem>
    <div slot="open" :style="`background: green; color: white; font-size: 40px; height: 100%`"
      >2</div
    >
    <div slot="back" :style="`background: blue; color: white; font-size: 40px; height: 100%`"
      >3</div
    >
  </TurnItem>
  <TurnItem>
    <div slot="open" :style="`background: red; color: white; font-size: 40px; height: 100%`"
      >4</div
    >
    <div slot="back" :style="`background: blue; color: white; font-size: 40px; height: 100%`"
      >5</div
    >
  </TurnItem>
  <TurnItem>
    <div slot="open" :style="`background: #399495; color: white; font-size: 40px; height: 100%`"
      >6</div
    >
    <div slot="back" :style="`background: #7b9322; color: white; font-size: 40px; height: 100%`"
      >7</div
    >
  </TurnItem>
</Turn>

```html
<Turn >
  <TurnItem>
    <div slot="open" :style="`background: black; color: white; font-size: 40px; height: 100%`"
      >0</div
    >
    <div slot="back" :style="`background: red; color: white; font-size: 40px; height: 100%`"
      >1</div
    >
  </TurnItem>
  <TurnItem>
    <div slot="open" :style="`background: green; color: white; font-size: 40px; height: 100%`"
      >2</div
    >
    <div slot="back" :style="`background: blue; color: white; font-size: 40px; height: 100%`"
      >3</div
    >
  </TurnItem>
  <TurnItem>
    <div slot="open" :style="`background: red; color: white; font-size: 40px; height: 100%`"
      >4</div
    >
    <div slot="back" :style="`background: blue; color: white; font-size: 40px; height: 100%`"
      >5</div
    >
  </TurnItem>
  <TurnItem>
    <div slot="open" :style="`background: #399495; color: white; font-size: 40px; height: 100%`"
      >6</div
    >
    <div slot="back" :style="`background: #7b9322; color: white; font-size: 40px; height: 100%`"
      >7</div
    >
  </TurnItem>
</Turn>
```

```vue
<template>
  <ul class="turn">
    <slot />
  </ul>
</template>
<script>
export default {
  name: 'turn',
  props: {
    options: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      currentIndex: 0
    };
  },
  computed: {
    len() {
      return this.$slots.default.length;
    }
  },
  provide() {
    return {
      zmTurn: this,
      options: this.options
    };
  }
};
</script>

<style lang='scss' scoped>
.turn {
  width: 400px;
  height: 100px;
  position: relative;
  margin: 20px auto;
  padding: 0;
}
li{
  list-style: none;
}
</style>

```
```vue
<template>
  <li
    class="paper"
    :style="{ zIndex: computedIndex() }"
    :class="{ left: index <= currentIndex }"
    @click="handlerClick"
    @transitionend='handlerTransitionEnd'
  >
    <div class="item page-back">
      <slot name="back" />
    </div>
    <div class="item page-open">
      <slot name="open" />
    </div>
  </li>
</template>

<script>
export default {
  name: 'turnItem',
  inject: ['zmTurn', 'options'],
  computed: {
    currentIndex() {
      return this.zmTurn.currentIndex;
    },
    index() {
      return this.zmTurn.$children.indexOf(this);
    }
  },
  data() {
    return {
      transitionEnd: true
    };
  },
  methods: {
    computedIndex() {
      const maxIndex = Math.ceil(this.zmTurn.len / 2);
      return maxIndex - Math.abs(this.currentIndex - this.index);
    },
    handlerClick() {
      if (!this.transitionEnd) return;
      if (this.index === this.zmTurn.len - 1 || this.index === 0) return;
      this.transitionEnd = false;
      this.zmTurn.currentIndex += this.index > this.currentIndex ? 1 : -1;
    },
    handlerTransitionEnd() {
      this.transitionEnd = true;
    }
  }
};
</script>

<style lang='scss' scoped>
.paper {
  position: absolute;
  top: 0;
  width: 50%;
  height: 100%;
  right: 0;
  transform-style: preserve-3d;
  transform-origin: left center;
  transition: all 0.5s ease-in-out;
  &.left {
    transform: perspective(500px) rotateY(-180deg);
  }
}
.item {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
}
.page-back {
  transform: rotateY(180deg);
}
.page-open {
  z-index: 1;
}
</style>

```



