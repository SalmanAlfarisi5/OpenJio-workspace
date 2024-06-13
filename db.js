// backend/db.js
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'OpenJio Main',
    password: '0penj10',
    port: 5432,
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};
