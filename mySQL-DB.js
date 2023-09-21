const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

const pool = mysql.createPool({
  host: process.env.HOST_NAME,
  user: process.env.USER_NAME,
  password: process.env.PASSWORD_SQL,
  database: process.env.DATABASE_SQL,
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10, // Adjust the connection pool size according to your requirements
  queueLimit: 0, // Set to 0 for unlimited queue size
});

module.exports = pool;
