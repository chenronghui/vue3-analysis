<template>
  <ul class="turn">
    <slot />
  </ul>
</template>
<script>
export default {
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
