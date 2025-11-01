//This is a script only used for droping all of the tables run [node dropDb.js]

import Database from 'better-sqlite3';

const db = new Database('game.db');


db.exec('PRAGMA foreign_keys = OFF;');


const tables = db.prepare(`
  SELECT name FROM sqlite_master
  WHERE type='table' AND name NOT LIKE 'sqlite_%';
`).all();


tables.forEach(table => {
  console.log(`Dropping table: ${table.name}`);
  db.prepare(`DROP TABLE IF EXISTS ${table.name}`).run();
});


db.exec('PRAGMA foreign_keys = ON;');

console.log('All tables dropped.');
db.close();
