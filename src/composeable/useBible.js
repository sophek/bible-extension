import BibleBook from "./../assets/BibleBook";
import elasticlunr from "elasticlunr";
import { ref, computed } from 'vue'
import { randomNumber, sortBy } from './../helper'
export default function useBible() {
    const verse = ref("");
    const book = ref("");
    const chapter = ref(1);
    const bibleRef = ref([]);
    const q = ref("");
    const type = ref("verse");
    const importBooksOfBible = async (bookName) => {
        let book = await import(`./../assets/${bookName}`);
        return book.default();
    };

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
        chapter.value = Number(randomChapter + 1);
        verse.value = bible.chapters[randomChapter].verses[randomVerse];
    };

    const reloadRandomVerse = (fn) => {
        q.value = "";
        fn();
    };

    // Show whole chapter
    const showWholeChapter = (book, chapter) => {
        type.value = "book";
        setTimeout(() => {
            q.value = book + " " + chapter;
        }, 500);
    };

    const listOfBooks = computed(() => {
        return BibleBook.bible;
    });

    const searchIndex = elasticlunr((lunr) => {
        lunr.addField("book");
        lunr.addField("verse");
        lunr.addField("text");
        lunr.setRef("id");
    });

    const searchBible = async () => {
        let wholeBible = [];
        await Promise.all(
            BibleBook.bible.map(async (book) => {
                let bookId = book.BookID;
                book = await importBooksOfBible(book.OsisID);
                wholeBible.push({ ...book, id: bookId });
            })
        );

        let AllBooks = wholeBible
            .sort(sortBy("id", false, (a) => a))
            .map((book) => {
                return book.chapters.flatMap((chap) => {
                    return chap.verses.map((item, idx) => {
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

        AllBooks.filter((item, idx) => {
            let doc = {
                id: idx,
                book: item.book,
                chapter: item.chapter,
                verse: item.verse,
                text: item.text,
            };
            searchIndex.addDoc(doc);
        });
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
                result = bibleRef.value
                    .filter((item) => {
                        return item.book.toLowerCase() === book.toLowerCase();
                    })
                    .filter(
                        (chapter) => Number(chapter.chapter) === Number(chapterNum)
                    );
            } else {
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

    return { q, bibleRef, book, chapter, importBooksOfBible, listOfBooks, getVerseRangeResult, getVerseRange, loadRandomBibleVerse, showWholeChapter, searchIndex, type, verse, reloadRandomVerse, searchBible }
}