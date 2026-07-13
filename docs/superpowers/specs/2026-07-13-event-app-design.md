---
name: event-app-design
description: Full CRUD Event Management app — capstone demo for React course covering hooks, context, DAL, and localStorage separation of concerns
metadata:
  type: project
---

# Event App — Design Spec

**Purpose:** Capstone demonstration project for a React beginner-to-intermediate course. Every React concept from the textbook (Modules 1–11) is visible in the codebase with clear separation of concerns across four layers.

---

## 1. Pages & Routes

| Route | Page | Teaching Focus |
|---|---|---|
| `/` | Home | Stats (total, upcoming, past), useEventsContext |
| `/events` | EventList | Search by title (text), filter by category + status (selects), `.filter()`, `.map()` |
| `/events/new` | CreateEvent | Controlled form, validation, addEvent |
| `/events/:id` | EventDetail | useParams, getEventById, delete |
| `/events/:id/edit` | EditEvent | useParams, pre-fill form, updateEvent |
| `*` | NotFound | Catch-all route |

React Router `createBrowserRouter` is already wired in `App.jsx`. `RootLayout` wraps all pages with Navbar + `<Outlet>`.

---

## 2. Event Data Model

```js
{
  id: string,          // crypto.randomUUID()
  title: string,
  date: string,        // "YYYY-MM-DD"
  location: string,
  description: string,
  category: string,    // "conference" | "workshop" | "meetup" | "webinar" | "other"
  status: string,      // "upcoming" | "completed"
  createdAt: string,   // ISO timestamp, set on creation only
}
```

---

## 3. Layer Architecture (Bottom → Top)

### Layer 0 — Browser API
`localStorage` — raw browser key/value store.

### Layer 1 — `src/utils/localStorage.util.js`
Pure utility functions. No React. Wraps `localStorage` with JSON handling and error safety.

```js
getItem(key, fallback)  → parsed value or fallback
setItem(key, value)     → void
removeItem(key)         → void
```

Teaching point: *"We wrap the browser API so no file repeats try/catch and JSON parsing."*

### Layer 2 — `src/dal/events.dal.js`
Pure JavaScript CRUD functions. No React imports. Calls the localStorage util.

```js
getEvents()              → Event[]
getEventById(id)         → Event | undefined
addEvent(data)           → Event     // generates id + createdAt
updateEvent(id, updates) → Event     // merges fields
deleteEvent(id)          → void
```

Teaching point: *"This layer only knows about events and localStorage. It does not know React exists."*

### Layer 3 — `src/hooks/useLocalStorage.js`
Generic reusable React hook. Mirrors the `useState` API but persists to localStorage.

```js
useLocalStorage(key, initialValue) → [storedValue, setValue]
```

Teaching point: *"Swap useState for useLocalStorage and your value survives a page refresh."*

### Layer 3 — `src/hooks/useEvents.js`
Domain-specific React hook. Calls DAL functions; manages local React state.

```js
useEvents() → {
  events,
  addEvent(data),
  updateEvent(id, updates),
  deleteEvent(id),
  getEventById(id),
}
```

Teaching point: *"The bridge between the DAL and React. Components never touch the DAL directly."*

### Layer 4 — `src/context/ThemeContext.jsx`
Provides `{ theme, toggleTheme }` to the whole tree. Uses `useLocalStorage("theme", "light")` internally. Exports `useTheme()` consumer hook with provider guard.

### Layer 4 — `src/context/EventsContext.jsx`
Provides `{ events, addEvent, updateEvent, deleteEvent, getEventById }`. Uses `useEvents()` internally. Exports `useEventsContext()` consumer hook with provider guard.

### Layer 5 — Pages & Components
Consume context via consumer hooks. No direct localStorage or DAL imports.

---

## 4. Component Structure

```
src/
├── utils/
│   └── localStorage.util.js
├── dal/
│   └── events.dal.js
├── hooks/
│   ├── useLocalStorage.js
│   └── useEvents.js
├── context/
│   ├── ThemeContext.jsx
│   └── EventsContext.jsx
├── components/
│   ├── layouts/
│   │   └── RootLayout.jsx          (existing — Navbar + Outlet)
│   ├── Navbar.jsx                  (uses useTheme, NavLink active states)
│   ├── EventCard.jsx               (props: event — used in EventList via .map())
│   ├── EventForm.jsx               (shared by CreateEvent + EditEvent — controlled inputs)
│   └── Badge.jsx                   (props: label, variant — status/category display)
└── pages/
    ├── Home.jsx                    (stats from useEventsContext)
    ├── EventList.jsx               (search + filter state, maps EventCard)
    ├── EventDetail.jsx             (useParams, getEventById, delete confirm → navigates to /events)
    ├── CreateEvent.jsx             (renders EventForm, calls addEvent, navigates to /events/:newId)
    ├── EditEvent.jsx               (useParams, pre-fills EventForm, calls updateEvent, navigates to /events/:id)
    └── NotFound.jsx
```

---

## 5. Provider Nesting (`main.jsx`)

```jsx
<ThemeProvider>
  <EventsProvider>
    <RouterProvider router={router} />
  </EventsProvider>
</ThemeProvider>
```

---

## 6. React Concepts Coverage Map

| Concept | Where demonstrated |
|---|---|
| ES6 (arrow fns, destructuring, spread, array methods) | DAL, hooks, components |
| JSX + dynamic values | All components |
| Functional components | Everything |
| Props | EventCard, EventForm, Badge |
| useState | EventForm (form fields), EventList (search/filter) |
| useEffect | useEvents (seed state on mount) |
| useContext | useTheme(), useEventsContext() |
| Custom hooks (generic) | useLocalStorage |
| Custom hooks (domain) | useEvents |
| Context API | ThemeContext, EventsContext |
| React Router (routes, Link, NavLink) | App.jsx, Navbar |
| useParams | EventDetail, EditEvent |
| useNavigate | CreateEvent, EditEvent (redirect after save) |
| .map() | EventList → EventCard |
| .filter() | EventList search + filter |
| Form validation | EventForm |
| Controlled inputs | EventForm |
| Separation of concerns | util → DAL → hooks → context → UI |
| localStorage persistence | useLocalStorage, ThemeContext |
| Component reuse | EventForm shared across Create + Edit |

---

## 7. Styling

- Tailwind CSS v4 (already installed)
- Light/dark theme via `data-theme` attribute on `<html>` toggled by ThemeContext
- Lucide React for icons (already installed)

---

## 8. Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| React | 19 | UI |
| Vite | 8 | Build tool |
| React Router | 8 | Client-side routing |
| Tailwind CSS | 4 | Styling |
| Lucide React | latest | Icons |
