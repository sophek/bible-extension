export const randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
};

export const sortBy = (field, reverse, primer) => {
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

export const bibleStructure = (item) => {
    return {
          book: item.book,
          chapter: Number(item.chapter),
          verse: Number(item.verse),
          text: item.text,
          type:item.type
        }
}