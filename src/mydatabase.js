import Dexie from 'dexie';

const db = new Dexie('myDb');
db.version(2).stores({
    friends: `name, age`,
    tasks: '++id,date,description,done',
    favorites: '++id,book,chapter,verse,text,type',
    weather: '++id,data,date',
    bible: '++id,book,chapter,verse,text'
});

export default db;