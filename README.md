# MeraMate - Unified Task Management Application

A modern, full-stack task management application built with Next.js and Express.js, optimized for seamless deployment on Vercel.

## 🚀 Unified Project Structure

This project has been restructured for a single-repository deployment on Vercel.

- **Frontend**: Next.js (App Router) located in the root directory.
- **Backend**: Express.js serverless functions located in the `api/` directory.
- **Database**: PostgreSQL (Neon.tech recommended).

## 📁 Project Overview

```text
MeraMate/
├── api/                # Express.js backend (Serverless Functions)
│   ├── config/         # Database configuration
│   ├── controllers/    # Route handlers
│   ├── routes/         # API endpoints
│   ├── utils/          # Database initialization
│   └── index.js        # Backend entry point
├── src/                # Next.js frontend source
│   ├── app/            # App Router pages
│   ├── services/       # API communication layer
│   └── context/        # Auth state management
├── public/             # Static assets
├── package.json        # Unified dependencies & scripts
└── vercel.json         # Vercel deployment configuration
```

## 🛠️ Local Development

### 1. Prerequisites
- Node.js (v18+)
- PostgreSQL (Local or Cloud like [Neon](https://neon.tech))

### 2. Installation
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### 4. Run the Application
```bash
npm run dev
```
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:5000/api](http://localhost:5000/api)

## 🌍 Vercel Deployment

1. Push the code to your GitHub repository.
2. Import the project into Vercel.
3. Add `DATABASE_URL`, `JWT_SECRET`, and `NODE_ENV=production` as environment variables.
4. Vercel will automatically build the frontend and deploy the `api/` folder as serverless functions.

## 📄 License
MIT
