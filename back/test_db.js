import pg from 'pg';
const { Pool } = pg;

let connectionUrl = "postgres://postgres.sidujtemnxjbfffduvbx:15oSuNgc0OKtDaYo@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x";
connectionUrl = connectionUrl.split('?')[0]; // strip query params

const pool = new Pool({
  connectionString: connectionUrl,
  ssl: { rejectUnauthorized: false }
});

async function test() {
  try {
    const res = await pool.query('SELECT 1 as result');
    console.log("DB SUCCESS:", res.rows);
  } catch(e) {
    console.log("DB ERROR:", e.message);
  } finally {
    pool.end();
  }
}
test();
