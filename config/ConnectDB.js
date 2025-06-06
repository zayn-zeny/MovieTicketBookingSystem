const sql = require('mssql');

const config = {
  user: "group_12",
  password: "1234",
  server: "ZAYN",
  database: "Group12",
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
  port: 1433,
};

const connectDB = async () => {
  try {
    const pool = await sql.connect(config);
    return pool;
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    throw err;
  }
};

module.exports = { connectDB, sql };
