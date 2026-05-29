# Task Manager

A full-stack task management app I built for the Keplix Fullstack Internship Assignment.

🔗 **Live Demo:** [https://taskmanager-yjc1.onrender.com](https://taskmanager-yjc1.onrender.com)

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, React Router v6, Axios, Vite |
| Backend | Node.js, Express, MongoDB (Mongoose) |
| Auth | JWT (jsonwebtoken), bcrypt |
| Validation | Joi (server), custom (client) |
| Extras | Rate limiting, dark/light mode, search, pagination |

---

## Features

- User registration and login with JWT authentication
- Create, edit, and delete tasks
- Filter tasks by status and priority
- Search tasks by title
- Pagination support
- Dark / light mode toggle
- Fully deployed — frontend on Render, backend on Render, database on MongoDB Atlas

---

## Local Setup

### Prerequisites

- Node.js 18+
- MongoDB running locally OR a MongoDB Atlas connection string

### 1. Clone the repo

```bash
git clone https://github.com/mohit-sharma2/Task-Manager.git
cd Task-Manager
```

### 2. Backend setup

```bash
cd server
npm install
cp .env.example .env
# Fill in your MONGO_URI and JWT_SECRET in .env
npm run dev
```

Server starts at `http://localhost:5000`

### 3. Frontend setup

```bash
cd client
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api in .env
npm run dev
```

App runs at `http://localhost:5173`

---

## Environment Variables

### `server/.env`

| Variable | Description | Example |
|---|---|---|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/task_manager` |
| `JWT_SECRET` | Secret for signing JWTs | `any_long_random_string` |
| `JWT_EXPIRES_IN` | Token lifetime | `7d` |
| `NODE_ENV` | Environment | `development` |
| `CLIENT_URL` | Frontend origin for CORS | `http://localhost:5173` |

### `client/.env`

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |

---

## API Reference

### Auth

| Method | Endpoint | Body | Response |
|---|---|---|---|
| POST | `/api/auth/register` | `{ name, email, password }` | `{ token, user }` |
| POST | `/api/auth/login` | `{ email, password }` | `{ token, user }` |

### Tasks *(all routes require `Authorization: Bearer <token>`)*

| Method | Endpoint | Query Params | Body | Response |
|---|---|---|---|---|
| GET | `/api/tasks` | `status`, `priority`, `sortBy`, `order`, `search`, `page`, `limit` | — | `{ tasks, pagination }` |
| POST | `/api/tasks` | — | `{ title, description, dueDate, priority, status }` | `{ task }` |
| GET | `/api/tasks/:id` | — | — | `{ task }` |
| PUT | `/api/tasks/:id` | — | any task field | `{ task }` |
| DELETE | `/api/tasks/:id` | — | — | `{ message }` |

---

## Deployment

- **Frontend:** Deployed on [Render](https://render.com) — `VITE_API_URL` set in environment variables
- **Backend:** Deployed on [Render](https://render.com) — all `.env` variables added in dashboard
- **Database:** MongoDB Atlas (free tier) with network access open for Render
