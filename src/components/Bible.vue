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
              <button @click="addFavorite(v.book, v.chapter, v.verse, v.verse)">
                <unicon
                  :key="idx"
                  style="cursor: pointer"
                  name="heart"
                  fill="red"
                ></unicon>
              </button>
              <unicon
                style="cursor: pointer"
                name="clipboard"
                fill="red"
                @click="
                  copy(v.book + ' ' + v.chapter + ':' + v.verse + ' ' + v.text)
                "
              ></unicon>
              <span style="cursor: copy">
                {{ v.book }} {{ v.chapter }} : {{ v.verse }}</span
              >

              <div
                v-html="
                  v.text.replace(
                    q.toLowerCase(),
                    `<span style=color:yellow>${q}</span>`
                  )
                "
              ></div>
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
export default {
  name: "Bible",
  setup() {
    const verse = ref("");
    const book = ref("");
    const chapter = ref("");
    const bibleRef = ref([]);
    const q = ref("");
    const type = ref("verse");
    const rangeText = ref("");
    const { toClipboard } = useClipboard();

    // Helpers
    const randomNumber = (min, max) => {
      return Math.floor(Math.random() * (max - min) + min);
    };

    const sort_by = (field, reverse, primer) => {
      const key = primer
        ? function (x) {
            return primer(x[field]);
          }
        : function (x) {
            return x[field];
          };

      reverse = !reverse ? 1 : -1;

      return function (a, b) {
        return (a = key(a)), (b = key(b)), reverse * ((a > b) - (b > a));
      };
    };

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
        .sort(sort_by("id", false, (a) => a))
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

    // The order of these function are import because searchBible loads all the books first
    searchBible();
    loadBibleVerse();

    // Logic to add favorite, copy etc
    const addFavorite = async (book, chapter, start_verse, end_verse) => {
      var id = await db.favorites.put({
        book: book,
        chapter: chapter,
        start_verse: start_verse,
        end_verse: end_verse,
      });
      console.log("Got id ", id);
      console.log("Done.", book, chapter, start_verse, end_verse);
    };
    const copy = async (text) => {
      try {
        console.log("Copied to clipboard");
        await toClipboard(text);
      } catch (e) {
        console.error(e);
      }
    };
    const copyRange = async () => {
      try {
        let rangeTextData = "";
        console.log("copy range");
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

      return type.value === "verse" ? byVerseResult : byBookResult;
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
      rangeText,
      copyRange,
      addFavorite,
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