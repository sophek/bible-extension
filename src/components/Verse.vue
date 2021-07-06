<template>
  <div :style="data.fav ? 'color:red' : ''">
    <div>
      <div>
        <span
          style="cursor: pointer"
          @mouseover="toggleButtons = true"
          @mouseout="toggleButtons = false"
          >{{ data.book }} {{ data.chapter }} : {{ data.verse }}
      
          <button @click="toggleFavorite(data,'FAVORITE')" class="button">
            <unicon
              style="cursor: pointer"
              name="heart"
              :fill="data.fav ? 'red' : 'white'"
            ></unicon>
          </button>

          <button class="button" @click="toggleFavorite(data,'KINGDOM')" :class="toggleButtons ? 'show' : 'hide'">
            <unicon style="cursor: pointer" name="bright" fill="white"></unicon>
          </button>
          <button class="button" @click="toggleFavorite(data,'SALVATION')" :class="toggleButtons ? 'show' : 'hide'">
            <unicon style="cursor: pointer" name="cloud" fill="white"></unicon>
          </button>
          <button
            @click="copyVerse(data.full)"
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

    const toggleFavorite = (verseData,type) => {
      console.log("hello");
      emit("favorite", {
        book: verseData.book,
        chapter: verseData.chapter,
        verse: verseData.verse,
        text: verseData.text,
        type:type
      });
    };

    const copyVerse = (verseData) => {
      emit("copy", verseData);
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