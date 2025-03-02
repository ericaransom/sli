// server/src/db/init.js
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Initialize the database schema
 * @returns {Promise<void>}
 */
async function initializeDatabase() {
  try {
    const db = await open({
      filename: path.join(__dirname, '..', '..', 'database.sqlite'),
      driver: sqlite3.Database
    });

    // Create IOCs table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS iocs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type VARCHAR(50) NOT NULL,
        value TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        severity INTEGER CHECK (severity BETWEEN 1 AND 5),
        status VARCHAR(50),
        source VARCHAR(100),
        notes TEXT
      )
    `);

    // Create analysis_results table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS analysis_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ioc_id INTEGER,
        tool_name VARCHAR(100),
        result_data TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (ioc_id) REFERENCES iocs(id)
      )
    `);

    // Create indexes
    await db.exec(`
      CREATE INDEX IF NOT EXISTS idx_iocs_type ON iocs(type);
      CREATE INDEX IF NOT EXISTS idx_iocs_value ON iocs(value);
      CREATE INDEX IF NOT EXISTS idx_iocs_timestamp ON iocs(timestamp);
      CREATE INDEX IF NOT EXISTS idx_analysis_results_ioc_id ON analysis_results(ioc_id);
    `);

    console.log('Database initialized successfully');
    await db.close();
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

// Run initialization if this is the main module
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  initializeDatabase();
}

export { initializeDatabase };