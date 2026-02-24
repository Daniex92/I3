import { pool } from './config/externalServices.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.join(__dirname, 'schema.sql');

async function initializeDatabase() {
  try {
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    const connection = await pool.getConnection();

    // Split by semicolon and execute each statement
    const statements = schema.split(';').filter(stmt => stmt.trim());

    for (const statement of statements) {
      if (statement.trim()) {
        await connection.query(statement);
      }
    }

    console.log('✅ Database initialized successfully');
    connection.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    process.exit(1);
  }
}

initializeDatabase();
