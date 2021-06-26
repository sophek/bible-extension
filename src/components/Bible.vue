<template>
  <div>
    <div style="position: relative">
      <input
        v-model.lazy="q"
        v-debounce="400"
        class="search-input"
        placeholder="Search the whole KJV Bible..."
        style="margin-top: 50px; width: 90%"
      />
      <h1 class="badge">{{ result.length }}</h1>
    </div>

    <div style="margin-top: 10px; padding: 20px">
      <input type="radio" name="type" value="book" v-model="type" /><span
        >&nbsp;By Books</span
      >
      &nbsp;&nbsp;
      <input type="radio" name="type" value="verse" v-model="type" /><span
        >&nbsp;By Words</span
      >
      &nbsp;&nbsp;

      <button @click="copyRange" class="result-btn">Copy Results</button>
      <h3 class="greet" v-if="result.length === 0">
        {{ book }} {{ chapter }} : {{ verse.verse }} - {{ verse.text }}
      </h3>
      <div
        style="height: 400px; display: block; overflow-y: scroll; padding: 20px"
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
import { ref, computed } from "vue";
import useClipboard from "./../../node_modules/vue-clipboard3";
import db from "./../mydatabase";
import Verse from "./Verse.vue";
import { randomNumber, sortBy } from "./../helper";
export default {
  name: "Bible",
  components: {
    Verse,
  },
  setup() {
    const { toClipboard } = useClipboard();
    const verse = ref("");
    const book = ref("");
    const chapter = ref("");
    const bibleRef = ref([]);
    const q = ref("");
    const type = ref("verse");
    const rangeText = ref("");
    const favorites = ref([]);

    const importBookOfBible = async (bookName) => {
      let book = await import(`./../assets/${bookName}`);
      return book.default();
    };

    // Main logic to load the books of the bible from all the json files
    const loadBibleVerse = async () => {
      const randomBookOfTheDay = randomNumber(1, 66);
      let bookMeta = BibleBook.bible.find(
        (book) => book.BookID === randomBookOfTheDay
      );

      let firstChapter = 1;
      let bibleData = await import(`./../assets/${bookMeta.OsisID}`);
      let bible = bibleData.default();

      let lastChapter = bible.chapters.length;
      let randomChapter = randomNumber(firstChapter, lastChapter) - 1;
      let randomVerse =
        randomNumber(1, bible.chapters[randomChapter].verses.length) - 1;

      book.value = bookMeta.BookName;
      chapter.value = randomChapter + 1;
      verse.value = bible.chapters[randomChapter].verses[randomVerse];
    };

    const searchBible = async () => {
      let wholeBible = [];
      await Promise.all(
        BibleBook.bible.map(async (book) => {
          let bookId = book.BookID;
          book = await importBookOfBible(book.OsisID);
          wholeBible.push({ ...book, id: bookId });
        })
      );

      let AllBooks = wholeBible
        .sort(sortBy("id", false, (a) => a))
        .map((book) => {
          return book.chapters.flatMap((chap) => {
            return chap.verses.map((item) => {
              return {
                ...item,
                book: book.book,
                chapter: chap.chapter,
                full: `${book.book} ${chap.chapter}:${item.verse} ${item.text}`,
              };
            });
          });
        })
        .flat();
      bibleRef.value = AllBooks;
    };

    const getVerseRange = (q) => {
      let rs = "";
      let data = q.split(" ");
      switch (data.length) {
        case 1:
          rs = { range: [0, 0], q: data[0] };
          break;
        case 2:
          rs = { range: [0, 0], q: `${data[0]} ${data[1]}` };
          break;
        case 3:
          rs = {
            range: [
              Number(data[2].split("-")[0]),
              isNaN(Number(data[2].split("-")[1]))
                ? Number(data[2].split("-")[0])
                : Number(data[2].split("-")[1]),
            ],
            q: [data[0], data[1]],
          };
          break;

        default:
          break;
      }
      return rs;
    };

    const getVerseRangeResult = (book, chapterNum, range) => {
      return bibleRef.value
        .filter((item) => {
          return item.book.toLowerCase() === book.toLowerCase();
        })
        .filter((chapter) => chapter.chapter === chapterNum)
        .filter((verse) => verse.verse >= range[0] && verse.verse <= range[1]);
    };

    const getMyFavorites = async () => {
      let favs = await db.favorites.toArray();
      favorites.value = favs.map((item) => {
        return {
          book: item.book,
          chapter: Number(item.chapter),
          verse: Number(item.start_verse),
        };
      });
    };

    // The order of these function are import because searchBible loads all the books first
    searchBible();
    loadBibleVerse();
    getMyFavorites();

    // Logic to add favorite, copy etc

    const updateFavorite = (e) => {
      addFavorite(e.book, e.chapter, e.startVerse, e.endVerse);
    };

    const addFavorite = async (book, chapter, start_verse, end_verse) => {
      var id = await db.favorites.put({
        book: book,
        chapter: chapter,
        start_verse: start_verse,
        end_verse: end_verse,
      });
      if (id) {
        getMyFavorites();
      }
    };

    const displayFavorites = (result1, result2) => {
      return result1.map((o1) => {
        const isFavorite = result2.some(function (o2) {
          const isFav =
            o1.verse === o2.verse &&
            o1.book === o2.book &&
            o1.chapter === o2.chapter;
          return isFav;
        });
        return { ...o1, fav: isFavorite };
      });
    };

    const copyFrom = (e) => {
      copy(e);
    };

    const copy = async (text) => {
      try {
        await toClipboard(text);
      } catch (e) {
        console.error(e);
      }
    };

    const copyRange = async () => {
      try {
        let rangeTextData = "";
        result.value.map((item) => {
          rangeTextData += item.full + "\n";
        });

        await toClipboard(rangeTextData);
        console.log(rangeTextData);
      } catch (e) {
        console.error(e);
      }
    };
    // End logic

    // computed Search result

    const result = computed(() => {
      if (q.value === "") {
        return [];
      }

      //checking if the length is greater than 0
      //if so, filter through the whole record set and split by each word and match against the search term
      let byVerseResult =
        bibleRef.value.length > 0
          ? bibleRef.value.filter((item) =>
              item.text
                .toLowerCase()
                .split(" ")
                .map((i) => i.replace(/\W/g, ""))
                .includes(q.value.toLowerCase())
            )
          : [];

      let byBookResult =
        bibleRef.value.length > 0
          ? bibleRef.value.filter((item) =>
              item.full.toLowerCase().includes(q.value.toLowerCase())
            )
          : [];

      let range = getVerseRange(q.value.toLowerCase());

      if (
        range.range.length === 2 &&
        range.range[0] > 0 &&
        range.range[1] > 0
      ) {
        byBookResult = getVerseRangeResult(range.q[0], range.q[1], range.range);
        //rangeText.value = byBookResult;
      }

      let rs = type.value === "verse" ? byVerseResult : byBookResult;

      let cleanFavorites = favorites.value.map((item) => {
        return {
          book: item.book,
          chapter: Number(item.chapter),
          verse: item.verse,
        };
      });
      let cleanResult = rs.map((item) => {
        return {
          book: item.book,
          chapter: Number(item.chapter),
          verse: Number(item.verse),
          text: item.text,
          full: item.full,
        };
      });

      return displayFavorites(cleanResult, cleanFavorites);
    });

    //console.log(displayFavorites(result,favorites.value,[]))

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
      rangeText,
      copyRange,
      addFavorite,
      updateFavorite,
      favorites,
    };
  },
};
</script>
<style scoped>

 
  .greet {
    font-size: 2.5rem;
    font-weight: 400;
    text-shadow: #CCC 1px 0 10px; 
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
    border: solid thin #fff;
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
  }
</style>