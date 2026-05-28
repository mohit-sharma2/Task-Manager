# DOCS — What I Did

## Folder Structure & Why

I split the project into `/client` and `/server` — two independent Node projects under one repo. This keeps concerns fully separated and makes it easy to deploy them to different platforms.

**Server** follows MVC with a few extra layers:

```
server/src/
├── config/       Database connection — isolated so it's easy to swap drivers later
├── controllers/  Business logic only, no inline DB queries or validation
├── middleware/   Auth guard, error handler, request logger — all decoupled from routes
├── models/       Mongoose schemas with enum constraints baked in
├── routes/       Thin wiring — just maps HTTP methods to controller functions
└── validators/   Joi schemas in one place — easy to update without touching controllers
```

**Client** is organised by type, not by feature, which made more sense at this scale:

```
client/src/
├── api/        Single Axios instance shared across the whole app
├── context/    AuthContext — global user state and auth methods
├── hooks/      useTasks — all task API calls + state in one reusable hook
├── components/ Presentational + smart split; cards are stateless, Dashboard owns data
├── pages/      Thin page wrappers that compose components
└── styles/     Single global CSS file with CSS variables for theming
```

## Patterns Applied

**Custom hooks** (`useTasks`, `useAuth`) — keeps components clean and logic reusable. If the API ever changes, I fix it in one hook.

**Centralised error handling** — the Express `errorHandler` middleware catches anything that reaches it; Axios interceptors handle 401s globally on the frontend instead of repeating redirect logic in every component.

**JWT built from scratch** — I deliberately avoided Passport or Auth0. The middleware is about 20 lines and gives full control over how errors are shaped and what goes into the token payload.

**Server-side validation with Joi + client-side validation before API calls** — two layers means the backend is never the first line of defence for basic input errors, which reduces unnecessary network round trips.

**CSS variables for theming** — dark and light mode is a single `data-theme` attribute toggle on `<html>`. No extra library needed.

## Challenges & How I Resolved Them

**Token expiry UX** — I initially showed an error toast when a 401 came back, but it felt jarring if the token expired mid-session. I moved the redirect logic into the Axios response interceptor so the user is silently sent to `/login` instead.

**Filter + pagination state sync** — when a user changes a filter, the page number needs to reset to 1 or the results look wrong. I added a `useEffect` that watches the filters object and resets `page` to 1 whenever it changes.

**Overdue task highlighting** — comparing `dueDate < new Date()` works, but I had to make sure tasks with status `Done` are excluded from the red highlight even if they're technically past due. Added a simple `&& task.status !== 'Done'` check.

## What I'd Add With More Time

- **Unit tests** — Jest + Supertest for controller functions, especially auth edge cases
- **Drag-and-drop reordering** — `@dnd-kit/core` with an `order` field on tasks (already in the schema, just needs wiring up)
- **Docker Compose** — one-command local setup for the whole stack including MongoDB
- **WebSocket updates** — live task sync when multiple tabs are open
- **Refresh tokens** — current setup uses a long-lived JWT; proper rotation would be more secure for production
