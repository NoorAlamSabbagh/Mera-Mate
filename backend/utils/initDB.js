const { pool } = require('../config/db');

const initDB = async () => {
  const dropTasksTable = `DROP TABLE IF EXISTS tasks;`;
  const dropUsersTable = `DROP TABLE IF EXISTS users;`;

  const createUserTable = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createTaskTable = `
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      status VARCHAR(20) DEFAULT 'todo' CHECK (status IN ('todo', 'in-progress', 'done')),
      due_date DATE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    console.log('Initializing database tables...');
    // Drop tables to ensure fresh schema
    await pool.query(dropTasksTable);
    await pool.query(dropUsersTable);
    
    await pool.query(createUserTable);
    console.log('Users table created');
    await pool.query(createTaskTable);
    console.log('Tasks table created');
    console.log('Database initialization completed.');
  } catch (err) {
    console.error('Error initializing database:', err);
  } finally {
    console.log('Database connection pool ready for use');
  }
};

module.exports = initDB;
