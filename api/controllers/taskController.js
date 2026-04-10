const { pool } = require('../config/db');

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  const { title, description, status, due_date } = req.body;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      'INSERT INTO tasks (user_id, title, description, status, due_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, title, description, status || 'todo', due_date]
    );

    res.status(201).json({ success: true, task: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error during task creation' });
  }
};

// @desc    Get all tasks for a user with filtering, searching, and sorting
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  const userId = req.user.id;
  const { status, search, sort = 'due_date', order = 'ASC' } = req.query;

  let query = 'SELECT * FROM tasks WHERE user_id = $1';
  const params = [userId];
  let paramCount = 1;

  if (status) {
    paramCount++;
    query += ` AND status = $${paramCount}`;
    params.push(status);
  }

  if (search) {
    paramCount++;
    query += ` AND title ILIKE $${paramCount}`;
    params.push(`%${search}%`);
  }

  // Handle sorting
  const allowedSortFields = ['due_date', 'created_at', 'title'];
  const sortField = allowedSortFields.includes(sort) ? sort : 'due_date';
  const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

  query += ` ORDER BY ${sortField} ${sortOrder}`;

  try {
    const result = await pool.query(query, params);
    res.json({ success: true, count: result.rows.length, tasks: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error during fetching tasks' });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, status, due_date } = req.body;
  const userId = req.user.id;

  try {
    const taskResult = await pool.query('SELECT * FROM tasks WHERE id = $1 AND user_id = $2', [id, userId]);

    if (taskResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Task not found or not authorized' });
    }

    const currentTask = taskResult.rows[0];

    const result = await pool.query(
      'UPDATE tasks SET title = $1, description = $2, status = $3, due_date = $4 WHERE id = $5 AND user_id = $6 RETURNING *',
      [
        title || currentTask.title,
        description !== undefined ? description : currentTask.description,
        status || currentTask.status,
        due_date !== undefined ? due_date : currentTask.due_date,
        id,
        userId
      ]
    );

    res.json({ success: true, task: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error during task update' });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *', [id, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Task not found or not authorized' });
    }

    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error during task deletion' });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
};
