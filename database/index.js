import { Pool } from 'pg';

const config = {
  host: process.env.DB_URL || 'localhost',
  user: 'postgres',
  password: process.env.DB_PASS,
  port: 5432,
  database: 'typetwo',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};
const pool = new Pool(config);

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export default pool;
