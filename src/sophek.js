const fs = require('fs')
const BibleBook = {
    bible: [
        {
            BookID: 1,
            OsisID: "Gen",
            BookName: "Genesis",
            TotalChapters: 50,
            Volume: "OT",
        },
        {
            BookID: 2,
            OsisID: "Exod",
            BookName: "Exodus",
            TotalChapters: 40,
            Volume: "OT",
        },
        {
            BookID: 3,
            OsisID: "Lev",
            BookName: "Leviticus",
            TotalChapters: 27,
            Volume: "OT",
        },
        {
            BookID: 4,
            OsisID: "Num",
            BookName: "Numbers",
            TotalChapters: 36,
            Volume: "OT",
        },
        {
            BookID: 5,
            OsisID: "Deut",
            BookName: "Deuteronomy",
            TotalChapters: 34,
            Volume: "OT",
        },
        {
            BookID: 6,
            OsisID: "Josh",
            BookName: "Joshua",
            TotalChapters: 24,
            Volume: "OT",
        },
        {
            BookID: 7,
            OsisID: "Judg",
            BookName: "Judges",
            TotalChapters: 21,
            Volume: "OT",
        },
        {
            BookID: 8,
            OsisID: "Ruth",
            BookName: "Ruth",
            TotalChapters: 4,
            Volume: "OT",
        },
        {
            BookID: 9,
            OsisID: "1Sam",
            BookName: "1 Samuel",
            TotalChapters: 31,
            Volume: "OT",
        },
        {
            BookID: 10,
            OsisID: "2Sam",
            BookName: "2 Samuel",
            TotalChapters: 24,
            Volume: "OT",
        },
        {
            BookID: 11,
            OsisID: "1Kgs",
            BookName: "1 Kings",
            TotalChapters: 22,
            Volume: "OT",
        },
        {
            BookID: 12,
            OsisID: "2Kgs",
            BookName: "2 Kings",
            TotalChapters: 25,
            Volume: "OT",
        },
        {
            BookID: 13,
            OsisID: "1Chr",
            BookName: "1 Chronicles",
            TotalChapters: 29,
            Volume: "OT",
        },
        {
            BookID: 14,
            OsisID: "2Chr",
            BookName: "2 Chronicles",
            TotalChapters: 36,
            Volume: "OT",
        },
        {
            BookID: 15,
            OsisID: "Ezra",
            BookName: "Ezra",
            TotalChapters: 10,
            Volume: "OT",
        },
        {
            BookID: 16,
            OsisID: "Neh",
            BookName: "Nehemiah",
            TotalChapters: 13,
            Volume: "OT",
        },
        {
            BookID: 17,
            OsisID: "Esth",
            BookName: "Esther",
            TotalChapters: 10,
            Volume: "OT",
        },
        {
            BookID: 18,
            OsisID: "Job",
            BookName: "Job",
            TotalChapters: 42,
            Volume: "OT",
        },
        {
            BookID: 19,
            OsisID: "Ps",
            BookName: "Psalms",
            TotalChapters: 150,
            Volume: "OT",
        },
        {
            BookID: 20,
            OsisID: "Prov",
            BookName: "Proverbs",
            TotalChapters: 31,
            Volume: "OT",
        },
        {
            BookID: 21,
            OsisID: "Eccl",
            BookName: "Ecclesiastes",
            TotalChapters: 12,
            Volume: "OT",
        },
        {
            BookID: 22,
            OsisID: "Song",
            BookName: "Song of Solomon",
            TotalChapters: 8,
            Volume: "OT",
        },
        {
            BookID: 23,
            OsisID: "Isa",
            BookName: "Isaiah",
            TotalChapters: 66,
            Volume: "OT",
        },
        {
            BookID: 24,
            OsisID: "Jer",
            BookName: "Jeremiah",
            TotalChapters: 52,
            Volume: "OT",
        },
        {
            BookID: 25,
            OsisID: "Lam",
            BookName: "Lamentations",
            TotalChapters: 5,
            Volume: "OT",
        },
        {
            BookID: 26,
            OsisID: "Ezek",
            BookName: "Ezekiel",
            TotalChapters: 48,
            Volume: "OT",
        },
        {
            BookID: 27,
            OsisID: "Dan",
            BookName: "Daniel",
            TotalChapters: 12,
            Volume: "OT",
        },
        {
            BookID: 28,
            OsisID: "Hos",
            BookName: "Hosea",
            TotalChapters: 14,
            Volume: "OT",
        },
        {
            BookID: 29,
            OsisID: "Joel",
            BookName: "Joel",
            TotalChapters: 3,
            Volume: "OT",
        },
        {
            BookID: 30,
            OsisID: "Amos",
            BookName: "Amos",
            TotalChapters: 9,
            Volume: "OT",
        },
        {
            BookID: 31,
            OsisID: "Obad",
            BookName: "Obadiah",
            TotalChapters: 1,
            Volume: "OT",
        },
        {
            BookID: 32,
            OsisID: "Jonah",
            BookName: "Jonah",
            TotalChapters: 4,
            Volume: "OT",
        },
        {
            BookID: 33,
            OsisID: "Mic",
            BookName: "Micah",
            TotalChapters: 7,
            Volume: "OT",
        },
        {
            BookID: 34,
            OsisID: "Nah",
            BookName: "Nahum",
            TotalChapters: 3,
            Volume: "OT",
        },
        {
            BookID: 35,
            OsisID: "Hab",
            BookName: "Habakkuk",
            TotalChapters: 3,
            Volume: "OT",
        },
        {
            BookID: 36,
            OsisID: "Zeph",
            BookName: "Zephaniah",
            TotalChapters: 3,
            Volume: "OT",
        },
        {
            BookID: 37,
            OsisID: "Hag",
            BookName: "Haggai",
            TotalChapters: 2,
            Volume: "OT",
        },
        {
            BookID: 38,
            OsisID: "Zech",
            BookName: "Zechariah",
            TotalChapters: 14,
            Volume: "OT",
        },
        {
            BookID: 39,
            OsisID: "Mal",
            BookName: "Malachi",
            TotalChapters: 4,
            Volume: "OT",
        },
        {
            BookID: 40,
            OsisID: "Matt",
            BookName: "Matthew",
            TotalChapters: 28,
            Volume: "NT",
        },
        {
            BookID: 41,
            OsisID: "Mark",
            BookName: "Mark",
            TotalChapters: 16,
            Volume: "NT",
        },
        {
            BookID: 42,
            OsisID: "Luke",
            BookName: "Luke",
            TotalChapters: 24,
            Volume: "NT",
        },
        {
            BookID: 43,
            OsisID: "John",
            BookName: "John",
            TotalChapters: 21,
            Volume: "NT",
        },
        {
            BookID: 44,
            OsisID: "Acts",
            BookName: "Acts",
            TotalChapters: 28,
            Volume: "NT",
        },
        {
            BookID: 45,
            OsisID: "Rom",
            BookName: "Romans",
            TotalChapters: 16,
            Volume: "NT",
        },
        {
            BookID: 46,
            OsisID: "1Cor",
            BookName: "1 Corinthians",
            TotalChapters: 16,
            Volume: "NT",
        },
        {
            BookID: 47,
            OsisID: "2Cor",
            BookName: "2 Corinthians",
            TotalChapters: 13,
            Volume: "NT",
        },
        {
            BookID: 48,
            OsisID: "Gal",
            BookName: "Galatians",
            TotalChapters: 6,
            Volume: "NT",
        },
        {
            BookID: 49,
            OsisID: "Eph",
            BookName: "Ephesians",
            TotalChapters: 6,
            Volume: "NT",
        },
        {
            BookID: 50,
            OsisID: "Phil",
            BookName: "Philippians",
            TotalChapters: 4,
            Volume: "NT",
        },
        {
            BookID: 51,
            OsisID: "Col",
            BookName: "Colossians",
            TotalChapters: 4,
            Volume: "NT",
        },
        {
            BookID: 52,
            OsisID: "1Thess",
            BookName: "1 Thessalonians",
            TotalChapters: 5,
            Volume: "NT",
        },
        {
            BookID: 53,
            OsisID: "2Thess",
            BookName: "2 Thessalonians",
            TotalChapters: 3,
            Volume: "NT",
        },
        {
            BookID: 54,
            OsisID: "1Tim",
            BookName: "1 Timothy",
            TotalChapters: 6,
            Volume: "NT",
        },
        {
            BookID: 55,
            OsisID: "2Tim",
            BookName: "2 Timothy",
            TotalChapters: 4,
            Volume: "NT",
        },
        {
            BookID: 56,
            OsisID: "Titus",
            BookName: "Titus",
            TotalChapters: 3,
            Volume: "NT",
        },
        {
            BookID: 57,
            OsisID: "Phim",
            BookName: "Philemon",
            TotalChapters: 1,
            Volume: "NT",
        },
        {
            BookID: 58,
            OsisID: "Heb",
            BookName: "Hebrews",
            TotalChapters: 13,
            Volume: "NT",
        },
        {
            BookID: 59,
            OsisID: "Jas",
            BookName: "James",
            TotalChapters: 5,
            Volume: "NT",
        },
        {
            BookID: 60,
            OsisID: "1Pet",
            BookName: "1 Peter",
            TotalChapters: 5,
            Volume: "NT",
        },
        {
            BookID: 61,
            OsisID: "2Pet",
            BookName: "2 Peter",
            TotalChapters: 3,
            Volume: "NT",
        },
        {
            BookID: 62,
            OsisID: "1John",
            BookName: "1 John",
            TotalChapters: 5,
            Volume: "NT",
        },
        {
            BookID: 63,
            OsisID: "2John",
            BookName: "2 John",
            TotalChapters: 1,
            Volume: "NT",
        },
        {
            BookID: 64,
            OsisID: "3John",
            BookName: "3 John",
            TotalChapters: 1,
            Volume: "NT",
        },
        {
            BookID: 65,
            OsisID: "Jude",
            BookName: "Jude",
            TotalChapters: 1,
            Volume: "NT",
        },
        {
            BookID: 66,
            OsisID: "Rev",
            BookName: "Revelation",
            TotalChapters: 22,
            Volume: "NT",
        },
    ]
}

const sortBy = (field, reverse, primer) => {
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

var lunr = require('lunr'),
    stdin = process.stdin,
    stdout = process.stdout,
    buffer = []

stdin.resume()
stdin.setEncoding('utf8')

stdin.on('data', function (data) {
    buffer.push(data)
})

stdin.on('end', function () {

    const storeData = (data, path = "/Users/sophektounn/hello-world-extension/src/lunrBible.json") => {
        try {
            fs.writeFileSync(path, JSON.stringify(data))
        } catch (err) {
            console.error(err)
        }
    }
    const readFile = (path = "/Users/sophektounn/hello-world-extension/src/verses-1769.json") => {
        try {
            let rawdata = fs.readFileSync(path);
            let data = JSON.parse(rawdata);
            let documents = Object.entries(data).map(item => {
                return { reference: item[0], verse: item[1] }
            })



            var idx = lunr(function () {
                this.ref('reference')
                this.field('verse')
                this.field('reference')
                documents.forEach(function (doc) {
                    this.add(doc)
                }, this)
            })

            storeData(idx)
        } catch (err) {
            console.error(err)
        }
    }

    readFile();


    //storeData(idx)
})