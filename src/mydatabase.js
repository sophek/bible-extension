import Dexie from 'dexie';

const db = new Dexie('myDb');
db.version(2).stores({
    friends: `name, age`,
    tasks: '++id,date,description,done',
    favorites: '++id,book,chapter,start_verse,end_verse,text',
    weather: '++id,data,date'
});

export default db;