import db from "./../mydatabase";
import { bibleStructure } from "./../helper";
import { ref } from "vue"
export default function useFavorite() {

    const favorites = ref([]);
    const updateFavorite = (e) => {
        addFavorite(e.book, e.chapter, e.verse, e.text, e.type);
    };

    const getMyFavorites = async (favorites) => {
        let favs = await db.favorites.toArray();
        favorites.value = favs.map((item) => {
            return bibleStructure(item);
        });
    };

    const addFavorite = async (
        book,
        chapter,
        verse,
        text,
        type = "FAVORITE"
    ) => {
        var id = await db.favorites.put({
            book: book,
            chapter: chapter,
            verse: verse,
            text: text,
            type: type,
        });
        if (id) {
            getMyFavorites(favorites);
        }
    };

    const displayFavorites = (result1, result2) => {
        let localType;
        return result1.map((o1) => {
            const isFavorite = result2.some(function (o2) {
                const isFav =
                    Number(o1.verse) === Number(o2.verse) &&
                    o1.book === o2.book &&
                    o1.chapter === o2.chapter;
                localType = result2.filter(
                    (item) =>
                        Number(item.verse) === Number(o1.verse) &&
                        item.book === o1.book &&
                        item.chapter === o1.chapter
                );
                return isFav;
            });
            return {
                ...o1,
                fav: isFavorite,
                type: localType.length > 0 ? localType[0].type : "NA",
            };
        });
    };

    return { favorites, updateFavorite, getMyFavorites, addFavorite, displayFavorites }

}