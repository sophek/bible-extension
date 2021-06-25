<template>
  <div>
    <button class="button">
      <unicon style="cursor: pointer" name="heart" fill="white"></unicon>
    </button>
    <unicon style="cursor: pointer" name="clipboard" fill="red"></unicon>
    <span style="cursor: copy"
      >{{ data.book }} {{ data.chapter }} : {{ data.verse }}</span
    >
    <div v-html="verse"></div>
  </div>
</template>
<script>
import { computed } from "vue";
export default {
  name: "Verse",
  props: {
    data: {
      type: Object,
    },
    q: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const verse = computed(() => {
      return props.data.text.replace(
        props.q.toLowerCase(),
        `<span style=color:yellow>${props.q}</span>`
      );
    });

    return { verse };
  },
};
</script>
<style scoped>
 .button{
    background-color: transparent;
    border: none;
  }
</style>