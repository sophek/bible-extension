import Dexie from 'dexie';

const db = new Dexie('myDb');
db.version(1).stores({
    friends: `name, age`,
    tasks: '++id,date,description,done',
    favorites: '++id,book,chapter,start_verse,end_verse,text'
});

export default db;