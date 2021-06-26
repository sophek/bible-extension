<template>
  <div>
    <div>
      <div>
        <span
          style="cursor: pointer"
          @mouseover="toggleButtons = true"
          @mouseout="toggleButtons = false"
          >{{ data.book }} {{ data.chapter }} : {{ data.verse }}
          <button
            @click="toggleFavorite(data)"
            class="button"
            :class="toggleButtons ? 'show' : 'hide'"
          >
            <unicon style="cursor: pointer" name="heart" fill="white"></unicon>
          </button>
          <button
            @click="copyVerse(data.full)"
            class="button"
            :class="toggleButtons ? 'show' : 'hide'"
          >
            <unicon
              style="cursor: pointer"
              name="clipboard"
              fill="red"
            ></unicon>
          </button> </span
        >&nbsp;&nbsp;
      </div>
    </div>

    <div v-html="verse"></div>
  </div>
</template>
<script>
import { ref, computed } from "vue";
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
  setup(props, { emit }) {
    const toggleButtons = ref(false);

    const toggleFavorite = (verseData) => {
      console.log("hello");
      emit("favorite", {
        book: verseData.book,
        chapter: verseData.chapter,
        startVerse: verseData.verse,
        endVerse: verseData.verse,
      });
    };

    const copyVerse = (verseData) => {
      emit("copy", verseData);
    };

    const verse = computed(() => {
      return props.data.text.replace(
        props.q.toLowerCase(),
        `<span style=color:yellow>${props.q}</span>`
      );
    });

    return { verse, toggleButtons, toggleFavorite, copyVerse };
  },
};
</script>
<style scoped>
.show {
    opacity: 1;
}
.hide {
    opacity: 0;
}
 .button{
    background-color: transparent;
    border: none;
  }
</style>