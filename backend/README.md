# Task Management System - Backend

This is the backend for the Task Management System, built with Node.js, Express, and PostgreSQL.

## Features
- User Authentication (Signup, Login) with JWT
- Password Hashing with bcryptjs
- Task CRUD operations
- Task filtering by status, searching by title, and sorting by due date
- Protected routes using JWT middleware
- MVC architecture

## Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Update the `.env` file with your Neon PostgreSQL connection string:
   ```env
   PORT=5000
   DATABASE_URL=your_neon_postgresql_connection_string
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/signup`: Register a new user
- `POST /api/auth/login`: Login and get a JWT token

### Tasks (Protected)
- `GET /api/tasks`: Get all tasks for the logged-in user
  - Query Params: `status`, `search`, `sort`, `order`
- `POST /api/tasks`: Create a new task
- `PUT /api/tasks/:id`: Update an existing task
- `DELETE /api/tasks/:id`: Delete a task

## Database Schema
The server automatically initializes the following tables if they don't exist:
- `users`: id, name, email, password, created_at
- `tasks`: id, user_id, title, description, status, due_date, created_at
