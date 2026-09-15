const { Pool } = require('pg');

const connectionString = process.env.DB_URL || process.env.DATABASE_URL;

const pool = new Pool({
	connectionString,
	ssl: { rejectUnauthorized: false }
});

const db = {
	async query(text, params) {
		try {
			const start = Date.now();
			const result = await pool.query(text, params);

			if (process.env.ENABLE_SQL_LOGGING === 'true') {
				console.log('Executed query:', {
					text: text.replace(/\s+/g, ' ').trim(),
					duration: `${Date.now() - start}ms`,
					rows: result.rowCount
				});
			}

			return result;
		} catch (error) {
			if (process.env.ENABLE_SQL_LOGGING === 'true') {
				console.error('Error in query:', {
					text: text.replace(/\s+/g, ' ').trim(),
					error: error.message
				});
			}
			throw error;
		}
	},

	close() {
		return pool.end();
	}
};

async function testConnection() {
	const result = await db.query('SELECT NOW() AS current_time');
	console.log('Database connection successful:', result.rows[0].current_time);
	return true;
}

module.exports = db;
module.exports.testConnection = testConnection;
  