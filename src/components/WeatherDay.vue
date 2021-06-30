<template>
  {{ day }} <br />
  <i :class="`${icon}`" style="margin-top: 10px"></i>
  <br />
  <span>{{ low }}°/{{ high }}°</span>
  <slot></slot>
</template>
<script>
export default {
  props: {
    day: {
      type: String,
      default: "Mon",
    },
    low: {
      type: Number,
      default: 50,
    },
    high: {
      type: Number,
      default: 100,
    },
    icon: {
      type: String,
      default: "mi mi-fw mi-2x mi-sun",
    },
  },
  name: "WeatherDay",
  setup() {},
};
</script>