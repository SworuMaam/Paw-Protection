import { Pool } from 'pg';

// Use a global variable to store the pool, so it's not re-created on every hot reload in development
let pool: Pool | undefined;

if (!pool) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Add SSL configuration for production environments
    ssl: process.env.NODE_ENV === 'production' 
      ? { rejectUnauthorized: false } 
      : false,
  });
}

// The 'as Pool' assertion is safe because we've just assigned it
const db = pool as Pool;

export default db;