// server/src/db/database.js
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Database {
  /**
   * Get a database connection
   * @returns {Promise<import('sqlite').Database>} SQLite database connection
   */
  async getDb() {
    return open({
      filename: path.join(__dirname, '..', '..', 'database.sqlite'),
      driver: sqlite3.Database
    });
  }

  /**
   * Add an IOC to the database
   * @param {Object} ioc - The IOC to add
   * @param {string} ioc.type - The IOC type
   * @param {string} ioc.value - The IOC value
   * @param {number} ioc.severity - The IOC severity
   * @param {string} ioc.status - The IOC status
   * @param {string} ioc.source - The IOC source
   * @param {string} [ioc.notes] - Optional notes
   * @returns {Promise<Object>} The added IOC with ID
   */
  async addIOC({ type, value, severity, status, source, notes }) {
    const db = await this.getDb();
    try {
      const result = await db.run(
        `INSERT INTO iocs (type, value, severity, status, source, notes)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [type, value, severity, status, source, notes]
      );
      return {
        id: result.lastID,
        type,
        value,
        severity,
        status,
        source,
        notes,
        timestamp: new Date()
      };
    } finally {
      await db.close();
    }
  }

  /**
   * Get an IOC by ID
   * @param {number} id - The IOC ID
   * @returns {Promise<Object|null>} The IOC or null if not found
   */
  async getIOCById(id) {
    const db = await this.getDb();
    try {
      return await db.get('SELECT * FROM iocs WHERE id = ?', [id]);
    } finally {
      await db.close();
    }
  }

  /**
   * Get IOCs by type
   * @param {string} type - The IOC type
   * @returns {Promise<Array>} The IOCs of the specified type
   */
  async getIOCsByType(type) {
    const db = await this.getDb();
    try {
      return await db.all('SELECT * FROM iocs WHERE type = ?', [type]);
    } finally {
      await db.close();
    }
  }

  /**
   * Search IOCs by query
   * @param {string} query - The search query
   * @returns {Promise<Array>} The matching IOCs
   */
  async searchIOCs(query) {
    const db = await this.getDb();
    try {
      return await db.all(
        'SELECT * FROM iocs WHERE value LIKE ? OR source LIKE ? OR notes LIKE ?',
        [`%${query}%`, `%${query}%`, `%${query}%`]
      );
    } finally {
      await db.close();
    }
  }

  /**
   * Get the most recent IOCs
   * @param {number} limit - Maximum number of IOCs to return
   * @returns {Promise<Array>} The most recent IOCs
   */
  async getRecentIOCs(limit = 10) {
    const db = await this.getDb();
    try {
      return await db.all(
        'SELECT * FROM iocs ORDER BY timestamp DESC LIMIT ?',
        [limit]
      );
    } finally {
      await db.close();
    }
  }

  /**
   * Get IOC statistics
   * @returns {Promise<Object>} Statistics about IOCs
   */
  async getIOCStats() {
    const db = await this.getDb();
    try {
      const total = await db.get('SELECT COUNT(*) as count FROM iocs');
      const byType = await db.all('SELECT type, COUNT(*) as count FROM iocs GROUP BY type');
      const bySeverity = await db.all('SELECT severity, COUNT(*) as count FROM iocs GROUP BY severity');

      return {
        total: total.count,
        byType: Object.fromEntries(byType.map(r => [r.type, r.count])),
        bySeverity: Object.fromEntries(bySeverity.map(r => [r.severity, r.count]))
      };
    } finally {
      await db.close();
    }
  }
}

export const database = new Database();