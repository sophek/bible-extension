<template>
  <span class="hi-lite">{{ day }}</span> <br />
  <i :class="`${icon} hi-lite`" style="margin-top: 10px"></i>
  <br />
  <span style="font-size: 12px">{{ low }}°/{{ high }}°</span>
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
<style scoped>
  .hi-lite {
    text-shadow: 0 0 20px #0aafe6, 0 0 20px rgba(10, 175, 230, 0);
  }
</style>