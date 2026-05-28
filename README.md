# Task Manager

A full-stack task management application built for the Keplix Fullstack Internship Assignment.

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, React Router v6, Axios, Vite |
| Backend | Node.js, Express, MongoDB (Mongoose) |
| Auth | JWT (jsonwebtoken), bcrypt |
| Validation | Joi (server), custom (client) |
| Extras | Rate limiting, dark/light mode, search, pagination |

---

## Local Setup

### Prerequisites
- Node.js 18+
- MongoDB running locally OR a MongoDB Atlas connection string

### 1. Clone & install

```bash
git clone <https://github.com/mohit-sharma2/Task-Manager.git>
cd keplixassetment
```

### 2. Backend

```bash
cd server
npm install
cp .env.example .env
# Fill in your MONGO_URI and JWT_SECRET in .env
npm run dev
```

Server starts at `http://localhost:5000`

### 3. Frontend

```bash
cd client
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api
npm run dev
```

App runs at `http://localhost:5173`

---

## Environment Variables

### `server/.env`

| Variable | Description | Example |
|---|---|---|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/keplix_tasks` |
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

**Example register response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": "664abc...", "name": "Mohit Sharma", "email": "mohit@example.com" }
}
```

### Tasks *(all routes require `Authorization: Bearer <token>`)*

| Method | Endpoint | Query Params | Body | Response |
|---|---|---|---|---|
| GET | `/api/tasks` | `status`, `priority`, `sortBy`, `order`, `search`, `page`, `limit` | — | `{ tasks, pagination }` |
| POST | `/api/tasks` | — | `{ title, description, dueDate, priority, status }` | `{ task }` |
| GET | `/api/tasks/:id` | — | — | `{ task }` |
| PUT | `/api/tasks/:id` | — | any task field | `{ task }` |
| DELETE | `/api/tasks/:id` | — | — | `{ message }` |

**Example task object:**
```json
{
  "_id": "664def...",
  "title": "Set up CI pipeline",
  "description": "Configure GitHub Actions for automated testing",
  "dueDate": "2024-07-15T00:00:00.000Z",
  "priority": "High",
  "status": "In Progress",
  "createdAt": "2024-06-20T10:30:00.000Z"
}
```

---

## Deployment

- **Frontend:** Deploy `/client` to [Vercel](https://vercel.com) — set `VITE_API_URL` in project env settings
- **Backend:** Deploy `/server` to [Render](https://render.com) or [Railway](https://railway.app) — add all `.env` variables in the dashboard
