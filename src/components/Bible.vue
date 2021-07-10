<template>
  <div>
    <div style="position: relative">
      <input
        v-model.lazy="q"
        v-debounce="400"
        class="search-input"
        placeholder="Search the whole KJV Bible..."
        style="margin-top: 50px; width: 50%"
      />
      <span
        class="book-tag"
        style="position: absolute; right: 15%; top: 51px"
        @click="q = ''"
        >Clear</span
      >
    </div>

    <div
      v-show="type === 'book' && q.length === 0"
      style="display: flex; flex-wrap: wrap; margin-top: 20px; padding: 50px"
    >
      <span
        class="book-tag"
        @click="q = book.BookName"
        :key="book.OsisID"
        v-for="book of listOfBooks"
        >{{ book.BookName }}</span
      >
      <span class="book-tag" @click="q = ''">Clear</span>
    </div>
    <div style="margin-top: 10px; padding: 50px">
      <input type="radio" name="type" value="book" v-model="type" /><span
        >&nbsp;By Books</span
      >
      &nbsp;&nbsp;
      <input type="radio" name="type" value="verse" v-model="type" /><span
        >&nbsp;By Words</span
      >
      &nbsp;&nbsp;
      <button
        @click="reloadRandomVerse(loadRandomBibleVerse)"
        class="result-btn"
      >
        Random Verse</button
      >&nbsp;&nbsp;
      <button @click="copyRange(result)" class="result-btn">
        Copy {{ result.length }} Results
      </button>
      <br /><br />
      <p class="greet hi-lite" v-if="result.length === 0">
        <button
          class="button-transparent-large"
          @click="showWholeChapter(book, chapter)"
        >
          {{ book }} {{ chapter }}:{{ verse.verse }}
        </button>
        {{ verse.text }}
      </p>

      <br />
      <button class="button-transparent">
        <unicon style="cursor: pointer" name="heart" fill="white"></unicon>
      </button>
      <button class="button-transparent">
        <unicon style="cursor: pointer" name="bright" fill="white"></unicon>
      </button>
      <button class="button-transparent">
        <unicon style="cursor: pointer" name="cloud" fill="white"></unicon>
      </button>

      <div
        style="height: 500px; display: block; overflow-y: scroll; padding: 20px"
      >
        <ul class="verse">
          <li :key="idx" v-for="(v, idx) in result">
            <div>
              <Verse
                :data="v"
                :q="q"
                @favorite="updateFavorite"
                @copy="copyFrom"
              />
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import BibleBook from "./../assets/BibleBook";
import { ref, computed, watch } from "vue";
//import useClipboard from "./../../node_modules/vue-clipboard3";
import useCopy from "./../composeable/useCopy";
import useFavorite from "./../composeable/useFavorite";
import useBible from "./../composeable/useBible";
import Verse from "./Verse.vue";
import { sortBy, bibleStructure } from "./../helper";
import elasticlunr from "elasticlunr";
export default {
  name: "Bible",
  components: {
    Verse,
  },
  setup(props, { emit }) {
    // Clipboard logic
    const { copy, copyFrom, copyRange } = useCopy();

    //Favorites logic
    const {
      addFavorite,
      favorites,
      updateFavorite,
      getMyFavorites,
      displayFavorites,
    } = useFavorite();

    // Bible logic
    const {
      bibleRef,
      book,
      chapter,
      verse,
      reloadRandomVerse,
      listOfBooks,
      loadRandomBibleVerse,
      q,
      type,
      searchIndex,
      showWholeChapter,
      searchBible,
      getVerseRange,
      getVerseRangeResult,
    } = useBible();

    // Watch favorites to filter out the uniques, and get new favorites whenever a favorite is added
    watch(favorites, (newValue) => {
      let uniqueArray = Array.from(new Set(newValue.map(JSON.stringify))).map(
        JSON.parse
      );
      emit("getfavorites", uniqueArray);
    });

    // Emit a clear boolean when q.value is empty
    watch(q, (newValue) => {
      emit("clear", newValue.length > 0);
    });

    // The order of these function are import because searchBible loads all the books first
    searchBible();
    loadRandomBibleVerse();
    getMyFavorites(favorites);

    // When ever a type is selected we want to clear the q value
    watch(type, (newValue) => {
      q.value = "";
    });

    // computed Search result
    const result = computed(() => {
      if (q.value === "") {
        return [];
      }
      // Find of the "" is in the query string
      let quotedSearch = q.value.match(/".*?"/g);
      if (quotedSearch && quotedSearch.toString().includes('""')) {
        return [];
      }

      const cleanFavorites = favorites.value.map((item) => {
        return bibleStructure(item);
      });

      // Favorites

      let query = q.value.toLowerCase();

      if (type.value === "book" && query) {
        let range = getVerseRange(query);
        let byBookResult = getVerseRangeResult(range);
        let cleanResult = byBookResult.map((item) => {
          return bibleStructure(item);
        });

        let resultData = displayFavorites(cleanResult, cleanFavorites);
        return resultData;
      }

      let resultSet = { index: searchIndex.search(query) };

      const documents = searchIndex.documentStore.docs;
      let docs = resultSet.index.map((i) => {
        return documents[i.ref];
      });

      let cleanResult = docs.map((item) => {
        return bibleStructure(item);
      });

      let resultData = displayFavorites(cleanResult, cleanFavorites);

      return resultData;
    });

    return {
      verse,
      book,
      chapter,
      q,
      result,
      bibleRef,
      type,
      copy,
      copyFrom,
      copyRange,
      addFavorite,
      updateFavorite,
      favorites,
      reloadRandomVerse,
      BibleBook,
      showWholeChapter,
      listOfBooks,
      loadRandomBibleVerse,
    };
  },
};
</script>
<style scoped>

 
  .greet {
    font-size: 2.0rem;
    font-weight: 400;
    text-shadow: 0 0 20px #0aafe6, 0 0 20px rgba(10, 175, 230, 0);
  }
ul.verse {
    text-align: left;
    list-style: none;
  }
  ul.verse li {
    padding:10px;
        background-color: #8080807d;
        margin:10px;
        font-size: 1.5rem;
  }

  .badge {
    position: absolute;
    top: 56px;
    width: 100px;
    right: 78px;
    height: 39px;
    background-color: #ffffff42;
    border-radius: 50px;
  }

  .search-input {
    height: 50px;
    width: 100%;
    border-radius: 50px;
    background-color: black;
    border: solid 4px #fff;
    color: #fff;
    padding: 20px;
    font-size: 2.0rem;
  }

  .result-btn{
    padding: 11px;
    border-radius: 20px;
    background-color: black;
    color: #fff;
    border: none;
    cursor:pointer
  }

  .button-transparent{
    padding: 11px;
    border-radius: 20px;
    background-color: transparent;
    color: #fff;
    border: none;
    cursor:pointer
  }

  .button-transparent-large{
    padding: 11px;
    border-radius: 20px;
    background-color: transparent;
    color: #fff;
    border: none;
    cursor:pointer;
    font-size: 32px;
  }

  .book-tag{
    padding: 10px;
    border-radius: 20px;
    background-color: black;
    color: #fff;
    border: none;
    cursor:pointer;
    margin:5px;
  }
</style>