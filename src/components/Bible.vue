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
    </div>

    <div
      v-if="type === 'book'"
      style="display: flex; flex-wrap: wrap; margin-top: 20px"
    >
      <span
        class="book-tag"
        @click="q = book.BookName"
        :key="book.OsisID"
        v-for="book of BibleBook.bible"
        >{{ book.BookName }}</span
      >
      <span class="book-tag" @click="q = ''">Clear</span>
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
      <button @click="reloadRandomVerse" class="result-btn">Random Verse</button
      >&nbsp;&nbsp;
      <button @click="copyRange" class="result-btn">
        Copy {{ result.length }} Results
      </button>
      <h3 class="greet hi-lite" v-if="result.length === 0">
        {{ book }} {{ chapter }} : {{ verse.verse }} - {{ verse.text }}
      </h3>
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
import useClipboard from "./../../node_modules/vue-clipboard3";
import db from "./../mydatabase";
import Verse from "./Verse.vue";
import { randomNumber, sortBy } from "./../helper";
export default {
  name: "Bible",
  components: {
    Verse,
  },
  setup(props, { emit }) {
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
    const loadRandomBibleVerse = async () => {
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

    const reloadRandomVerse = () => {
      console.log("reloadRandomVerse");
      loadRandomBibleVerse();
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
      let validBook =
        data[0] === "1" || data[0] === "2" || data[0] === "3"
          ? `${data[0]} ${data[1]}`
          : data[0];

      let booksWithMoreThanOne = BibleBook.bible
        .map((item) => {
          return { ...item, BookName: item.BookName.toLowerCase() };
        })
        .filter((item) => item.BookName.split(" ").length > 1);

      let isMultiple = false;

      if (booksWithMoreThanOne.find((item) => item.BookName === validBook)) {
        isMultiple = true;
      }

      const rangeMaker = (isMultiple, data) => {
        let rangeIndex = isMultiple ? 3 : 2;
        let fromVerse = 0;
        let toVerse = 0;

        if (!isMultiple && data.length === 3) {
          if (data[2].indexOf("-") > -1) {
            fromVerse = data[rangeIndex].split("-")[0];
            toVerse = data[rangeIndex].split("-")[1];
          }
        }

        if (isMultiple && data.length === 4) {
          if (data[3].indexOf("-") > -1) {
            fromVerse = data[rangeIndex].split("-")[0];
            toVerse = data[rangeIndex].split("-")[1];
          }
        }
        return [fromVerse, toVerse];
      };

      switch (data.length) {
        case 1:
          rs = {
            range: [0, 0],
            q: data[0],
            book: validBook,
            chapter: 0,
          };
          break;
        case 2:
          rs = {
            range: [0, 0],
            q: `${data[0]} ${data[1]}`,
            book: validBook,
            chapter: isMultiple ? 0 : Number(data[1]),
          };
          break;
        case 3:
          rs = {
            range: rangeMaker(isMultiple, data),
            q: `${data[0]} ${data[1]}`,
            book: validBook,
            chapter: isMultiple ? Number(data[2]) : Number(data[1]),
          };
          break;
        case 4:
          rs = {
            range: rangeMaker(isMultiple, data),
            q: `${data[0]} ${data[1]}`,
            book: validBook,
            chapter: isMultiple ? Number(data[2]) : Number(data[1]),
          };
          break;
        default:
          break;
      }
      return rs;
    };

    const getVerseRangeResult = (range) => {
      console.log({ range: range });
      let result = [];
      let book = range.book;
      let chapterNum = range.chapter;
      let fromVerse = range.range[0];
      let toVerse = range.range[1];

      if (fromVerse === 0 && toVerse === 0 && Number(chapterNum) === 0) {
        result = bibleRef.value.filter((item) => {
          return item.book.toLowerCase() === book.toLowerCase();
        });
      } else {
        if (toVerse === 0) {
          console.log(book, chapter, fromVerse);
          result = bibleRef.value
            .filter((item) => {
              return item.book.toLowerCase() === book.toLowerCase();
            })
            .filter(
              (chapter) => Number(chapter.chapter) === Number(chapterNum)
            );
        } else {
          console.log(book, chapter, fromVerse, toVerse);
          result = bibleRef.value
            .filter((item) => {
              return item.book.toLowerCase() === book.toLowerCase();
            })
            .filter((chapter) => Number(chapter.chapter) === Number(chapterNum))
            .filter(
              (verse) =>
                Number(verse.verse) >= Number(fromVerse) &&
                Number(verse.verse) <= Number(toVerse)
            );
        }
      }

      return result;
    };

    const getMyFavorites = async () => {
      let favs = await db.favorites.toArray();
      favorites.value = favs.map((item) => {
        return {
          book: item.book,
          chapter: Number(item.chapter),
          verse: Number(item.start_verse),
          text: item.text,
        };
      });
    };

    watch(favorites, (newValue) => {
      let uniqueArray = Array.from(new Set(newValue.map(JSON.stringify))).map(
        JSON.parse
      );
      emit("getfavorites", uniqueArray);
    });

    // The order of these function are import because searchBible loads all the books first
    searchBible();
    loadRandomBibleVerse();
    getMyFavorites();

    // Logic to add favorite, copy etc

    const updateFavorite = (e) => {
      addFavorite(e.book, e.chapter, e.startVerse, e.endVerse, e.text);
    };

    const addFavorite = async (book, chapter, start_verse, end_verse, text) => {
      var id = await db.favorites.put({
        book: book,
        chapter: chapter,
        start_verse: start_verse,
        end_verse: end_verse,
        text: text,
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

      let quotedSearch = q.value.match(/".*?"/g);

      if (quotedSearch && quotedSearch.toString().includes('""')) {
        return [];
      }

      //checking if the length is greater than 0
      //if so, filter through the whole record set and split by each word and match against the search term
      let byVerseResult =
        bibleRef.value.length > 0
          ? bibleRef.value.filter((item) => {
              let searchByWord = item.text
                .toLowerCase()
                .split(" ")
                .map((i) => i.replace(/\W/g, ""))
                .includes(q.value.toLowerCase());
              let searchByPhrase = item.text
                .toLowerCase()
                .includes(q.value.toLowerCase().replaceAll('"', "").trim());
              return quotedSearch ? searchByPhrase : searchByWord;
            })
          : [];

      // let byBookResult =
      //   bibleRef.value.length > 0
      //     ? bibleRef.value.filter((item) =>
      //         item.full.toLowerCase().includes(q.value.toLowerCase())
      //       )
      //     : [];

      let range = getVerseRange(q.value.toLowerCase());

      let byBookResult = getVerseRangeResult(range);

      let rs = type.value === "verse" ? byVerseResult : byBookResult;

      let cleanFavorites = favorites.value.map((item) => {
        return {
          book: item.book,
          chapter: Number(item.chapter),
          verse: item.verse,
          text: item.text,
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
      rangeText,
      copyRange,
      addFavorite,
      updateFavorite,
      favorites,
      reloadRandomVerse,
      BibleBook,
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