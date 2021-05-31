const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "106.253.56.122",
  user: "blueskii",
  password: "12345",
  database: "blueskii",
  waitForConnections: true,
  connectionLimit: 2,
  queueLimit: 0,
});

exports.getConn = async () => {
  const conn = await pool.getConnection();
  return conn;
},

exports.releaseConn = (conn) => {
  conn.release();
}



