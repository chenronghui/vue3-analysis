# vue 手势指令


``` js
let start;
let end;

function touchstart(ev) {
  [start] = ev.targetTouches;
}

function getTriggerFns(binding) {
  const triggerFns = [];
  if (typeof binding.value === 'function') {
    triggerFns.push({
      direction: binding.arg,
      fn: binding.value
    });
  } else if (typeof binding.value === 'object') {
    Object.keys(binding.value).forEach((direction) => {
      triggerFns.push({
        direction,
        fn: binding.value[direction]
      });
    });
  }
  return triggerFns;
}

function touchmove(ev) {
  [end] = ev.targetTouches;
  const {
    binding
  } = touchmove;
  const triggerFns = getTriggerFns(binding);
  triggerFns.forEach(({
    direction,
    fn
  }) => {
    switch (direction) {
      case 'left':
        if (start.clientX - end.clientX > 50 && !fn.triggered) {
          fn.triggered = true;
          fn(ev);
        }
        break;
      case 'right':
        if (end.clientX - start.clientX > 50 && !fn.triggered) {
          fn.triggered = true;
          fn(ev);
        }
        break;
      case 'up':
        if (start.clientY - end.clientY > 50 && !fn.triggered) {
          fn.triggered = true;
          fn(ev);
        }
        break;
      case 'down':
        if (end.clientY - start.clientY > 50 && !fn.triggered) {
          fn.triggered = true;
          fn(ev);
        }
        break;
      default:
        break;
    }
  });
}

function touchend() {
  const {
    binding
  } = touchmove;
  const triggerFns = getTriggerFns(binding);
  triggerFns.forEach(({ fn }) => {
    fn.triggered = false;
  });
}

export default {
  inserted(el, binding) {
    touchmove.binding = binding;
    el.addEventListener('touchstart', touchstart);
    el.addEventListener('touchmove', touchmove);
    el.addEventListener('touchend', touchend);
  },
  update(el, binding) {
    touchmove.binding = binding;
  },
  unbind(el) {
    touchmove.binding = null;
    el.removeEventListener('touchstart', touchstart);
    el.removeEventListener('touchmove', touchmove);
    el.removeEventListener('touchend', touchend);
  }
};

```

``` html
  <div v-swiper:left="handler"></div>
  <div v-swiper="{
    left:handlerLeft,
    right:handlerRight,
    up:handlerUp,
    down:handlerDown
  }"></div>
```


