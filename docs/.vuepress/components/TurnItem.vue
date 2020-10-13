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
