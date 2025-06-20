const Database = require('better-sqlite3');
const db = new Database('hqcolecao.db', { verbose: console.log });


db.prepare(`
  CREATE TABLE IF NOT EXISTS colecao (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    hq_id TEXT,
    titulo TEXT,
    status TEXT,
    avaliacao INTEGER,
    comentario TEXT,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

module.exports = db;