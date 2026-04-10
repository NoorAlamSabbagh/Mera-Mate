# Task Management System (Full Stack Assessment)

A full-stack task management application built with Node.js, Express, Next.js, and PostgreSQL (Neon).

## Features
- **Authentication**: JWT-based login and signup with password hashing (bcrypt).
- **Task Management**: Create, Read, Update, and Delete tasks.
- **Search & Filter**: Search tasks by title, filter by status (todo, in-progress, done).
- **Sorting**: Sort tasks by due date, creation date, or title.
- **Modern UI**: Clean interface built with Bootstrap 5 and Lucide Icons.
- **Responsive**: Fully responsive design for mobile and desktop.

## Project Structure
```
/backend
  /config      - Database configuration (Neon PostgreSQL)
  /controllers - Business logic for Auth and Tasks
  /middleware  - JWT authentication middleware
  /models      - Database schema and table definitions
  /routes      - API endpoints
  /utils       - Initialization and helper scripts
/frontend
  /src/app     - Next.js Pages (Login, Signup, Dashboard)
  /src/context - Authentication state management
  /src/services- API communication layer (Axios)
```

## Database Schema (PostgreSQL)

### `users` Table
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | SERIAL | Primary Key |
| `name` | VARCHAR(100) | User's full name |
| `email` | VARCHAR(100) | Unique email address |
| `password` | VARCHAR(255) | Hashed password |
| `created_at`| TIMESTAMP | Account creation date |

### `tasks` Table
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | SERIAL | Primary Key |
| `user_id` | INTEGER | Foreign Key (references `users.id`) |
| `title` | VARCHAR(255) | Task title |
| `description`| TEXT | Detailed description |
| `status` | VARCHAR(20) | todo, in-progress, done |
| `due_date` | DATE | Task deadline |
| `created_at`| TIMESTAMP | Task creation date |

## Setup Instructions

### Backend Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file (one is already provided, update if necessary):
   ```env
   PORT=5000
   DATABASE_URL=your_neon_postgresql_url
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server (using Webpack for compatibility):
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

### Authentication
- `POST /api/auth/signup`: User registration
- `POST /api/auth/login`: User login

### Tasks (Protected)
- `GET /api/tasks`: Get all tasks for the logged-in user
  - Query Params: `status` (filter), `search` (by title), `sort` (due_date, created_at, title), `order` (ASC/DESC)
- `POST /api/tasks`: Create a new task
- `PUT /api/tasks/:id`: Update an existing task
- `DELETE /api/tasks/:id`: Delete a task
