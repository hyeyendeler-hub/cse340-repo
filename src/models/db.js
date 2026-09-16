const { Pool } = require('pg');

const connectionString = process.env.DB_URL || process.env.DATABASE_URL ||
  'postgresql://postgres@localhost:5432/community_hub';

const databaseHost = new URL(connectionString).hostname;
const isLocalDatabase = databaseHost === 'localhost' || databaseHost === '127.0.0.1';
const useSsl = process.env.DB_SSL === 'true' ||
  (process.env.DB_SSL !== 'false' && !isLocalDatabase);

const pool = new Pool({
  connectionString,
  ssl: useSsl ? { rejectUnauthorized: false } : false
});

const db = {
  query: (text, params) => pool.query(text, params),
  close: () => pool.end()
};

const testConnection = async () => {
  const result = await db.query('SELECT NOW() AS current_time');
  console.log('Database connection successful:', result.rows[0].current_time);
  return true;
};

module.exports = db;
module.exports.testConnection = testConnection;