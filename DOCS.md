# DOCS — What I Built & How

## Folder Structure & Why

I split the project into `/client` and `/server` — two separate Node projects under one repo. This keeps things clean and makes it easy to deploy them independently.

**Server** follows MVC with a few extra layers:

```
server/src/
├── config/       Database connection — isolated so it's easy to swap later
├── controllers/  Business logic only, no inline queries or validation
├── middleware/   Auth guard, error handler, request logger — decoupled from routes
├── models/       Mongoose schemas with enum constraints baked in
├── routes/       Thin wiring — just maps HTTP methods to controller functions
└── validators/   Joi schemas in one place — easy to update without touching controllers
```

**Client** is organised by type, which made more sense at this scale:

```
client/src/
├── api/        Single Axios instance shared across the whole app
├── context/    AuthContext — global user state and auth methods
├── hooks/      useTasks — all task API calls and state in one reusable hook
├── components/ Cards are stateless, Dashboard owns the data
├── pages/      Thin page wrappers that compose components
└── styles/     Single global CSS file with CSS variables for theming
```

---

## Patterns I Used

**Custom hooks** (`useTasks`, `useAuth`) — keeps components clean and logic reusable. If the API changes, I fix it in one place.

**Centralised error handling** — Express `errorHandler` middleware catches everything on the backend. Axios interceptors handle 401s globally on the frontend so I don't repeat redirect logic in every component.

**JWT from scratch** — I skipped Passport or Auth0 on purpose. The middleware is around 20 lines and gives full control over error shapes and token payload.

**Two-layer validation** — Joi on the server and custom validation on the client before API calls. This way the backend is never the first line of defence for basic input errors, which cuts unnecessary network requests.

**CSS variables for theming** — dark and light mode is just a `data-theme` toggle on `<html>`. No extra library needed.

---

## Challenges I Ran Into

**Token expiry UX** — showing an error toast on a 401 felt jarring if the token expired mid-session. I moved the redirect into the Axios response interceptor so the user gets silently sent to `/login` instead.

**Filter and pagination sync** — when a filter changes, the page number needs to reset to 1 or results look wrong. I added a `useEffect` that watches the filters and resets `page` to 1 whenever they change.

**Overdue task highlighting** — `dueDate < new Date()` works fine but tasks marked `Done` shouldn't turn red even if they're past due. Fixed with a simple `&& task.status !== 'Done'` check.

**MongoDB Atlas + Render deployment** — the connection was getting blocked because Render's IPs weren't whitelisted in Atlas. Fixed by allowing all IPs (`0.0.0.0/0`) since Render's free plan doesn't give static IPs.

---

## What I'd Add With More Time

- **Unit tests** — Jest and Supertest for controller functions, especially auth edge cases
- **Drag-and-drop reordering** — `@dnd-kit/core` with the `order` field already in the Task schema, just needs wiring up
- **Docker Compose** — one-command local setup for the whole stack including MongoDB
- **WebSocket updates** — live task sync when multiple tabs are open
- **Refresh tokens** — current setup uses a long-lived JWT, proper rotation would be more secure for production
- **httpOnly cookie auth** — more secure than localStorage for storing tokens, needs same-domain setup to work properly
