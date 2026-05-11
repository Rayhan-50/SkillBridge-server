const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL, 
  ssl: { rejectUnauthorized: false } 
});

async function check() {
  try {
    const res = await pool.query(`
      SELECT u.name, tp.bio, tp.headline, tp."hourlyRate" 
      FROM "user" u 
      JOIN "tutor_profile" tp ON u.id = tp."userId"
      WHERE u.role = 'TUTOR'
      LIMIT 5
    `);
    console.log('Tutors in DB:');
    console.table(res.rows);
  } catch (err) {
    console.error('Error checking DB:', err);
  } finally {
    await pool.end();
  }
}

check();
