const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
console.log('Testing connection to:', connectionString ? connectionString.split('@')[1] : 'UNDEFINED');

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function test() {
  try {
    console.log('Connecting...');
    const client = await pool.connect();
    console.log('Connected!');
    const res = await client.query('SELECT NOW()');
    console.log('Result:', res.rows[0]);
    client.release();
  } catch (err) {
    console.error('Connection error:', err);
  } finally {
    await pool.end();
  }
}

test();
