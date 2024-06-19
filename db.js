// backend/db.js
const { Pool } = require('pg');
require("dotenv").config();

const devConfig = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
}

const proConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
};

const pool = new Pool(
    process.env.NODE_ENV === "production" ? proConfig : devConfig
);

module.exports = {
    query: (text, params) => pool.query(text, params),
};
