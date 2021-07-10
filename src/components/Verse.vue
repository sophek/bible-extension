<template>
  <div :style="`color:${setColorCoded(data.type)}`">
    <div>
      <div>
        <span
          style="cursor: pointer"
          @mouseover="toggleButtons = true"
          @mouseout="toggleButtons = false"
          >{{ data.book }} {{ data.chapter }} : {{ data.verse }}

          <button @click="toggleFavorite(data, 'FAVORITE')" class="button">
            <unicon style="cursor: pointer" name="heart" fill="yellow"></unicon>
          </button>

          <button
            class="button"
            @click="toggleFavorite(data, 'KINGDOM')"
            :class="toggleButtons ? 'show' : 'hide'"
          >
            <unicon style="cursor: pointer" name="bright" fill="gold"></unicon>
          </button>
          <button
            class="button"
            @click="toggleFavorite(data, 'SALVATION')"
            :class="toggleButtons ? 'show' : 'hide'"
          >
            <unicon style="cursor: pointer" name="cloud" fill="green"></unicon>
          </button>
          <button
            @click="copyVerse(data)"
            class="button"
            :class="toggleButtons ? 'show' : 'hide'"
          >
            <unicon
              style="cursor: pointer"
              name="clipboard"
              fill="white"
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

    const toggleFavorite = (verseData, type) => {
      console.log("hello");
      emit("favorite", {
        book: verseData.book,
        chapter: verseData.chapter,
        verse: verseData.verse,
        text: verseData.text,
        type: type,
      });
    };

    const copyVerse = (verseData) => {
      console.log({ copyVerse: verseData });
      const fullText = `${verseData.book} ${verseData.chapter}:${verseData.verse} - ${verseData.text}`;
      emit("copy", fullText);
    };

    const verse = computed(() => {
      let pattern = props.q.replaceAll('"', "").trim();
      const re = new RegExp(pattern, "gi");
      const string = props.data.text;
      const replaced = string.replace(re, "<span style=color:yellow>$&</span>");
      return replaced;

      // return props.data.text.replace(
      //   searchedQ,
      //   `<span style=color:yellow>${searchedQ}</span>`
      // );
    });

    const colorCoded = {
      KINGDOM: "gold",
      FAVORITE: "yellow",
      SALVATION: "green",
      NA: "white",
    };

    const setColorCoded = (type) => {
      return colorCoded[type];
    };
    return { verse, toggleButtons, toggleFavorite, copyVerse, setColorCoded };
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