'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { taskService } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';
import { Plus, Search, LogOut, Filter, SortAsc, Edit, Trash2, Calendar, CheckCircle2, Clock, ListTodo } from 'lucide-react';
import { Modal, Button, Form } from 'react-bootstrap';

export default function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // Filter and Search States
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('due_date');
  const [order, setOrder] = useState('ASC');

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    due_date: '',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      fetchTasks();
    }
  }, [user, authLoading, status, search, sort, order]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await taskService.getTasks({
        status,
        search,
        sort,
        order,
      });
      setTasks(response.data.tasks);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (task = null) => {
    if (task) {
      setCurrentTask(task);
      setFormData({
        title: task.title,
        description: task.description || '',
        status: task.status,
        due_date: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '',
      });
    } else {
      setCurrentTask(null);
      setFormData({
        title: '',
        description: '',
        status: 'todo',
        due_date: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentTask(null);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentTask) {
        await taskService.updateTask(currentTask.id, formData);
        toast.success('Task updated successfully');
      } else {
        await taskService.createTask(formData);
        toast.success('Task created successfully');
      }
      handleCloseModal();
      fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(id);
        toast.success('Task deleted successfully');
        fetchTasks();
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'done':
        return <span className="status-badge bg-success-subtle text-success"><CheckCircle2 size={12} className="me-1" /> Done</span>;
      case 'in-progress':
        return <span className="status-badge bg-warning-subtle text-warning-emphasis"><Clock size={12} className="me-1" /> In Progress</span>;
      default:
        return <span className="status-badge bg-secondary-subtle text-secondary-emphasis"><ListTodo size={12} className="me-1" /> Todo</span>;
    }
  };

  if (authLoading || !user) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-primary"></div>
    </div>
  );

  return (
    <div className="min-vh-100 bg-light">
      {/* Navbar */}
      <nav className="dashboard-nav sticky-top">
        <div className="container d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <div className="bg-primary p-2 rounded-3 me-3 text-white">
              <CheckCircle2 size={24} />
            </div>
            <h4 className="mb-0 fw-bold text-dark">MeraMate</h4>
          </div>
          <div className="d-flex align-items-center gap-3">
            <span className="text-muted d-none d-md-inline small">
              Logged in as <strong className="text-dark">{user.name}</strong> 
              <span className={`ms-2 badge ${user.role === 'admin' ? 'bg-danger' : 'bg-info'} text-white`}>
                {user.role}
              </span>
            </span>
            <button className="btn btn-outline-danger btn-sm d-flex align-items-center px-3" onClick={logout}>
              <LogOut size={16} className="me-2" /> Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container pb-5">
        {/* Search and Filters */}
        <div className="card shadow-sm border-0 mb-4 rounded-4">
          <div className="card-body p-4">
            <div className="row g-3">
              <div className="col-lg-4">
                <div className="input-group">
                  <span className="input-group-text bg-light border-0"><Search size={18} className="text-muted" /></span>
                  <input
                    type="text"
                    className="form-control bg-light border-0"
                    placeholder="Search tasks..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <select
                  className="form-select bg-light border-0"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="todo">Todo</option>
                  <option value="in-progress">In-Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <div className="col-md-6 col-lg-3">
                <div className="input-group">
                  <select
                    className="form-select bg-light border-0"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                  >
                    <option value="due_date">Due Date</option>
                    <option value="created_at">Date Created</option>
                    <option value="title">Title</option>
                  </select>
                  <button
                    className="btn btn-light border-0"
                    onClick={() => setOrder(order === 'ASC' ? 'DESC' : 'ASC')}
                  >
                    {order === 'ASC' ? '↑' : '↓'}
                  </button>
                </div>
              </div>
              <div className="col-lg-2">
                <button className="btn btn-primary w-100 d-flex align-items-center justify-content-center shadow-sm" onClick={() => handleOpenModal()}>
                  <Plus size={18} className="me-2" /> New Task
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Task Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary"></div>
          </div>
        ) : (
          <div className="row g-4">
            {tasks.length === 0 ? (
              <div className="col-12 text-center py-5">
                <div className="text-muted mb-3"><ListTodo size={48} opacity={0.2} /></div>
                <h5 className="text-muted">No tasks found</h5>
                <p className="text-muted small">Create a new task to get started!</p>
              </div>
            ) : (
              tasks.map((task) => (
                <div key={task.id} className="col-md-6 col-lg-4">
                  <div className="card task-card shadow-sm h-100">
                    <div className="card-body p-4 d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <h5 className="card-title fw-bold text-dark mb-0">{task.title}</h5>
                        {getStatusBadge(task.status)}
                      </div>
                      <p className="card-text text-muted small mb-4 flex-grow-1">
                        {task.description || <span className="fst-italic opacity-50">No description provided</span>}
                      </p>
                      <div className="d-flex justify-content-between align-items-center mt-auto pt-3 border-top">
                        <div className="d-flex align-items-center text-muted small">
                          <Calendar size={14} className="me-1" />
                          {task.due_date ? new Date(task.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'No date'}
                        </div>
                        <div className="d-flex gap-2">
                          <button className="btn btn-light btn-sm rounded-3 p-2 text-primary border-0" onClick={() => handleOpenModal(task)}>
                            <Edit size={16} />
                          </button>
                          <button className="btn btn-light btn-sm rounded-3 p-2 text-danger border-0" onClick={() => handleDelete(task.id)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered contentClassName="rounded-4 border-0 shadow">
        <Modal.Header closeButton className="border-0 px-4 pt-4">
          <Modal.Title className="fw-bold">{currentTask ? 'Edit Task' : 'Create New Task'}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 pb-4">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold text-muted">Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                placeholder="What needs to be done?"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold text-muted">Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                placeholder="Add more details..."
                value={formData.description}
                onChange={handleInputChange}
              />
            </Form.Group>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold text-muted">Status</Form.Label>
                  <Form.Select name="status" value={formData.status} onChange={handleInputChange}>
                    <option value="todo">Todo</option>
                    <option value="in-progress">In-Progress</option>
                    <option value="done">Done</option>
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold text-muted">Due Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="due_date"
                    value={formData.due_date}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </div>
            </div>
            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button variant="light" onClick={handleCloseModal} className="px-4 rounded-3 fw-semibold">Cancel</Button>
              <Button variant="primary" type="submit" className="px-4 rounded-3 fw-semibold">{currentTask ? 'Save Changes' : 'Create Task'}</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
