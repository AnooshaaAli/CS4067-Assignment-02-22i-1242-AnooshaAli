const { Pool } = require("pg");

const pool = new Pool({
    user: process.env.DB_USER || "postgres",
    host: process.env.DB_HOST || "post_gres_db",
    database: process.env.DB_NAME || "booking_db",
    password: process.env.DB_PASSWORD || "123456",
    port: process.env.DB_PORT || 5432,
});

module.exports = pool;
