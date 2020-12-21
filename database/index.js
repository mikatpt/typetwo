import { Pool } from 'pg';

// const config = {
//   host: process.env.DBSERVER || 'localhost',
//   user: 'student',
//   password: 'student',
//   port: 5432,
//   database: 'amazonreviews',
//   max: 20,
//   idleTimeoutMillis: 30000,
//   connectionTimeoutMillis: 2000,
// };
const pool = new Pool(process.env.DATABASE_URL);

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export default pool;
