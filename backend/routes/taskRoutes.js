const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

// All users can CRUD their own tasks
router.route('/')
  .post(createTask)
  .get(getTasks);

router.route('/:id')
  .put(updateTask)
  .delete(deleteTask);

// Example of an admin-only route
router.get('/admin/all-stats', authorize('admin'), (req, res) => {
  res.json({ success: true, message: 'Welcome Admin, here are some stats...' });
});

module.exports = router;
