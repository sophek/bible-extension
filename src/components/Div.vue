<template>
  <div class="my-panel" :style="makeStyle">
    <header>Title</header>
    <slot></slot>
  </div>
</template>
<script>
import { computed } from "vue";
export default {
  name: "Div",
  props: {
    background: {
      type: String,
      default: "",
    },
    padding: {
      type: Number,
      default: 0,
    },
    h: {
      type: Number,
      default: 250,
    },
  },
  setup(props) {
    const makeStyle = computed(() => {
      return props.background === ""
        ? `padding:${props.padding}px;background-color:#000;height:${props.h}px`
        : `padding:${props.padding}px;;height:${props.h}px;background-size:cover;background-image:url(${props.background})`;
    });
    return { makeStyle };
  },
};
</script>
<style scoped>
    .my-panel{
        border: solid 4px #fff;
        height:330px;
        padding:20px;
        border-radius: 20px;
        background-color:rgb(253, 239, 239);
        margin-right: 20px;
        width:100%;
        overflow: auto;
    }
    header {
      position: relative;
    text-align: center;
    background-color: black;
    width: 100%;
    height: 40px;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    border-bottom: solid 4px #fff;
    }
</style>