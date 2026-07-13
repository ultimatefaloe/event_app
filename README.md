# EventApp — Introduction to React: Course Textbook Guide

A full-stack CRUD Event Management SPA built with React, used as the capstone project for an introductory-to-intermediate React course. Every feature in this app maps directly to a React concept students learn in class.

---

## Table of Contents

1. [About the Project](#about-the-project)
2. [Tech Stack](#tech-stack)
3. [Getting Started](#getting-started)
4. [Project Architecture — The 5 Layers](#project-architecture--the-5-layers)
5. [File Structure](#file-structure)
6. [React Concepts Covered](#react-concepts-covered)
7. [Class Schedule](#class-schedule)

---

## About the Project

EventApp lets users create, view, edit, and delete events. All data is saved to the browser's `localStorage` — no server, no database. This keeps the project focused on React while still demonstrating real persistence across page refreshes.

**What students will build:**
- A home dashboard showing event statistics
- An events list with real-time search and filters
- A create/edit form with validation
- An event detail page with delete confirmation
- A dark/light theme toggle that persists across sessions
- Client-side routing between multiple pages

---

## Tech Stack

| Tool | Version | Role |
|---|---|---|
| React | 19 | UI library |
| Vite | 8 | Development server & build tool |
| React Router | 8 | Client-side routing |
| Tailwind CSS | 4 | Utility-first CSS framework |
| Lucide React | latest | Icon library |

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)

### Installation

```bash
# Clone or download the project
cd event_app

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

Open `http://localhost:5173` in your browser. The app hot-reloads on every file save.

---

## Project Architecture — The 5 Layers

This project uses a deliberate layered architecture. Each layer has **one responsibility** and never reaches past its neighbour. Understanding this separation is one of the most important lessons in the course.

```
Browser's localStorage API  ← raw key/value store
         ↓
  Layer 1: localStorage.util.js  ← wraps the API with JSON handling
         ↓
  Layer 2: events.dal.js          ← pure JS CRUD, no React
         ↓
  Layer 3: useLocalStorage.js     ← generic React hook
           useEvents.js           ← domain React hook (wraps DAL)
         ↓
  Layer 4: ThemeContext.jsx        ← distributes theme state to all components
           EventsContext.jsx       ← distributes event CRUD to all components
         ↓
  Layer 5: Pages & Components      ← what the user sees
```

**Why layer it?** If you later swap `localStorage` for a real API, you only change the DAL. Nothing else in the app needs to know.

---

## File Structure

```
src/
├── utils/
│   └── localStorage.util.js      Task 2  — raw localStorage wrapper
├── dal/
│   └── events.dal.js             Task 3  — pure JS CRUD functions
├── hooks/
│   ├── useLocalStorage.js        Task 4  — generic persisted state hook
│   └── useEvents.js              Task 5  — domain hook (wraps DAL)
├── context/
│   ├── ThemeContext.jsx           Task 6  — dark/light theme provider
│   └── EventsContext.jsx          Task 7  — global events state provider
├── components/
│   ├── layouts/
│   │   ├── NavBar.jsx             Task 10 — navigation with theme toggle
│   │   └── RootLayout.jsx         Task 11 — page shell with Outlet
│   ├── Badge.jsx                  Task 9  — status/category chip
│   ├── EventCard.jsx              Task 12 — event summary card
│   └── EventForm.jsx              Task 13 — shared create/edit form
└── pages/
    ├── Home.jsx                   Task 14 — stats dashboard
    ├── EventList.jsx              Task 15 — search + filter list
    ├── EventDetail.jsx            Task 16 — single event view + delete
    ├── CreateEvent.jsx            Task 17 — new event form page
    ├── EditEvent.jsx              Task 18 — edit event form page
    └── NotFound.jsx               Task 19 — 404 catch-all
```

---

## React Concepts Covered

### 1. JSX — JavaScript XML

JSX is the syntax React uses to describe what the UI should look like. It looks like HTML but it is JavaScript.

```jsx
// JSX compiles to React.createElement() calls under the hood
const Card = () => (
  <div className="p-4 rounded border">
    <h2>Hello World</h2>
  </div>
);
```

**Key rules:**
- Use `className` instead of `class`
- Every element must be closed: `<img />`, `<input />`
- Return one root element (or use `<>...</>` fragments)
- JavaScript expressions go inside `{}`

**Where in the project:** Every `.jsx` file

---

### 2. Functional Components

A React component is a JavaScript function that returns JSX. It starts with a capital letter.

```jsx
// This IS a React component
const Badge = ({ label }) => {
  return <span className="px-2 py-0.5 rounded text-xs">{label}</span>;
};

// This is NOT — lowercase functions are treated as HTML tags
const badge = () => <span>{label}</span>;
```

**Where in the project:** `Badge.jsx`, `EventCard.jsx`, every page

---

### 3. Props — Passing Data Down

Props are how parent components pass data to children. They are **read-only** inside the child.

```jsx
// Parent passes props
<EventCard event={myEvent} />

// Child receives and uses them
const EventCard = ({ event }) => {
  const { title, date, location } = event;
  return <h3>{title}</h3>;
};
```

**Key idea:** Props flow **down** (parent → child). To send data back up, pass a function as a prop.

**Where in the project:** `EventCard.jsx` (receives `event`), `EventForm.jsx` (receives `initialValues`, `onSubmit`, `submitLabel`), `Badge.jsx` (receives `label`)

---

### 4. useState — Local Component State

`useState` lets a component remember a value between renders. When the value changes, React re-renders the component.

```jsx
import { useState } from "react";

const EventList = () => {
  const [search, setSearch] = useState("");        // primitive state
  const [category, setCategory] = useState("all"); // string state

  return (
    <input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
};
```

**Functional updater form** — use this when the new value depends on the old one:

```jsx
// Instead of this (can be stale):
setCount(count + 1);

// Use this (always uses the latest value):
setCount((prev) => prev + 1);
```

**Where in the project:** `EventForm.jsx` (`formData`, `errors`), `EventList.jsx` (`search`, `category`, `status`)

---

### 5. Controlled Inputs — Forms in React

In a controlled input, React **owns** the value. The input always shows what is in state.

```jsx
// Uncontrolled (DOM owns the value — avoid in React)
<input type="text" defaultValue="hello" />

// Controlled (React owns the value)
const [title, setTitle] = useState("");

<input
  value={title}
  onChange={(e) => setTitle(e.target.value)}
/>
```

**Single handleChange pattern** — one handler for all fields using the `name` attribute:

```jsx
const [formData, setFormData] = useState({ title: "", date: "", location: "" });

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value })); // computed property key
};

<input name="title" value={formData.title} onChange={handleChange} />
<input name="date"  value={formData.date}  onChange={handleChange} />
```

**Where in the project:** `EventForm.jsx`

---

### 6. useEffect — Side Effects

`useEffect` runs **after** the component renders. Use it for things that are not part of rendering: writing to the DOM, fetching data, subscriptions.

```jsx
import { useEffect } from "react";

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useLocalStorage("theme", "light");

  // Runs after every render where `theme` changed
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]); // ← dependency array

  return <ThemeContext.Provider value={{ theme }}>{children}</ThemeContext.Provider>;
};
```

**Dependency array rules:**
- `[]` — runs once on mount only
- `[theme]` — runs on mount and whenever `theme` changes
- No array — runs after every render (almost never what you want)

**Where in the project:** `ThemeContext.jsx` (sets `data-theme` attribute on `<html>`)

---

### 7. Custom Hooks — Reusing Logic

A custom hook is a JavaScript function whose name starts with `use` and can call other hooks. It lets you extract stateful logic from components.

**Generic hook (mirrors `useState` API):**

```jsx
// src/hooks/useLocalStorage.js
import { useState } from "react";
import { getItem, setItem } from "../utils/localStorage.util";

const useLocalStorage = (key, initialValue) => {
  // Lazy initializer runs once — reads from localStorage on mount
  const [storedValue, setStoredValue] = useState(() => getItem(key, initialValue));

  const setValue = (value) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    setItem(key, valueToStore);
  };

  return [storedValue, setValue]; // same API as useState
};

// Usage — drop-in replacement for useState
const [theme, setTheme] = useLocalStorage("theme", "light");
```

**Domain hook (wraps a service/DAL):**

```jsx
// src/hooks/useEvents.js
const useEvents = () => {
  const [events, setEvents] = useState(() => getEvents()); // seed from DAL

  const addEvent = (data) => {
    const newEvent = dalAdd(data);          // persist to localStorage
    setEvents((prev) => [...prev, newEvent]); // update React state
    return newEvent;                         // return so caller can navigate
  };

  return { events, addEvent, updateEvent, deleteEvent, getEventById };
};
```

**Where in the project:** `useLocalStorage.js`, `useEvents.js`

---

### 8. Context API — Sharing State Across the Tree

Context lets you share state with any component in the tree without passing props through every level.

**The three steps:**

```jsx
// Step 1 — Create the context
const ThemeContext = createContext(null);

// Step 2 — Provide the value (wrap components that need access)
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useLocalStorage("theme", "light");
  const toggleTheme = () => setTheme((prev) => prev === "light" ? "dark" : "light");

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Step 3 — Consume the value (anywhere in the tree)
export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};

// In any component:
const { theme, toggleTheme } = useTheme();
```

**Provider nesting order in `main.jsx`:**

```jsx
<ThemeProvider>       {/* outermost — handles HTML attribute */}
  <EventsProvider>    {/* inner — handles data */}
    <App />
  </EventsProvider>
</ThemeProvider>
```

**Where in the project:** `ThemeContext.jsx`, `EventsContext.jsx`, `main.jsx`

---

### 9. React Router — Client-Side Navigation

React Router lets you show different pages (components) for different URLs — without a full page reload.

**Setup (`App.jsx`):**

```jsx
import { createBrowserRouter, RouterProvider } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,      // wrapper with NavBar + Outlet
    children: [
      { index: true, element: <Home /> },             // "/"
      { path: "events", element: <EventList /> },     // "/events"
      { path: "events/new", element: <CreateEvent /> },  // "/events/new"
      { path: "events/:id", element: <EventDetail /> },  // "/events/abc123"
      { path: "events/:id/edit", element: <EditEvent /> },
      { path: "*", element: <NotFound /> },           // catch-all
    ],
  },
]);

// IMPORTANT: events/new must come BEFORE events/:id
// Otherwise "new" would be treated as an id
```

**Key components and hooks:**

```jsx
import { Link, NavLink, useParams, useNavigate, Outlet } from "react-router";

// Link — navigates without a page reload
<Link to="/events">Go to Events</Link>

// NavLink — like Link, but knows if it's the active route
<NavLink
  to="/events"
  className={({ isActive }) => isActive ? "font-bold text-indigo-600" : "text-gray-600"}
>
  Events
</NavLink>

// Outlet — renders the matched child route
const RootLayout = () => (
  <div>
    <NavBar />
    <main><Outlet /></main>  {/* EventList, Home, etc. render here */}
  </div>
);

// useParams — reads dynamic segments from the URL
const { id } = useParams(); // from route "events/:id"

// useNavigate — programmatic navigation
const navigate = useNavigate();
navigate(`/events/${newEvent.id}`); // redirect after form submit
```

**Where in the project:** `App.jsx`, `NavBar.jsx`, `RootLayout.jsx`, `EventDetail.jsx`, `CreateEvent.jsx`, `EditEvent.jsx`

---

### 10. Component Composition & Reuse

`EventForm` is rendered in two completely different pages (`CreateEvent` and `EditEvent`) with different behavior — controlled by props:

```jsx
// CreateEvent — empty form, navigates to new event
<EventForm onSubmit={handleSubmit} submitLabel="Create Event" />

// EditEvent — pre-filled form, navigates back to detail
<EventForm
  initialValues={editableFields}
  onSubmit={handleSubmit}
  submitLabel="Update Event"
/>
```

Inside `EventForm`, `initialValues` defaults to `EMPTY_FORM` so CreateEvent does not need to pass it:

```jsx
const EventForm = ({ initialValues = EMPTY_FORM, onSubmit, submitLabel = "Save Event" }) => {
  const [formData, setFormData] = useState(initialValues);
  // ...
};
```

**Where in the project:** `EventForm.jsx`, `CreateEvent.jsx`, `EditEvent.jsx`

---

### 11. ES6+ JavaScript Essentials

React code relies heavily on modern JavaScript. Here are the patterns used throughout this project:

```js
// Destructuring — unpack properties from objects and arrays
const { title, date } = event;
const [value, setValue] = useState("");

// Spread — copy and extend objects/arrays
const updated = { ...event, title: "New Title" };  // object spread
const newList = [...events, newEvent];               // array spread

// Arrow functions
const double = (n) => n * 2;
const add = (a, b) => a + b;

// Template literals
navigate(`/events/${newEvent.id}`);

// Optional chaining & nullish coalescing
const classes = variantClasses[label] ?? variantClasses.other;

// Array methods
events.filter((e) => e.status === "upcoming")  // returns a new array
events.map((e) => <EventCard key={e.id} event={e} />)
events.find((e) => e.id === id)

// Computed property names
const { name, value } = e.target;
setFormData((prev) => ({ ...prev, [name]: value })); // [name] is dynamic

// Rest/spread in destructuring
const { id: _id, createdAt: _createdAt, ...editableFields } = event;
// _id and _createdAt are excluded; editableFields has everything else
```

---

### 12. Separation of Concerns

The architectural principle that each piece of code should have **one job**.

| Layer | File | Job | What it does NOT do |
|---|---|---|---|
| Util | `localStorage.util.js` | Wrap the browser API | Know what events are |
| DAL | `events.dal.js` | Read/write event records | Import React |
| Hook | `useEvents.js` | Connect DAL to React state | Render HTML |
| Context | `EventsContext.jsx` | Share state across the tree | Fetch data directly |
| UI | Pages + Components | Render and handle user input | Touch localStorage |

---

### 13. Array Methods in JSX

```jsx
// .map() — render a list of components
{events.map((event) => (
  <EventCard key={event.id} event={event} />
))}
// key prop is required — helps React track which items changed

// .filter() — narrow a list based on a condition
const filtered = events
  .filter((e) => e.title.toLowerCase().includes(search.toLowerCase()))
  .filter((e) => category === "all" || e.category === category)
  .filter((e) => status === "all" || e.status === status);

// Derived state — values computed from state, not stored in state
const upcoming  = events.filter((e) => e.status === "upcoming").length;
const completed = events.filter((e) => e.status === "completed").length;
```

**Where in the project:** `EventList.jsx`, `Home.jsx`, `EventForm.jsx` (maps select options)

---

### 14. Conditional Rendering

```jsx
// Ternary — show A or B
{filtered.length === 0 ? (
  <p>No events found.</p>
) : (
  <div>{filtered.map(...)}</div>
)}

// Short-circuit — show A or nothing
{errors.title && <p className="text-red-500">{errors.title}</p>}

// Early return — render a fallback when data is missing
const event = getEventById(id);
if (!event) {
  return <p>Event not found.</p>;
}
// rest of component...
```

**Where in the project:** `EventDetail.jsx`, `EditEvent.jsx`, `EventList.jsx`, `EventForm.jsx`

---

### 15. Dark Mode with Tailwind CSS v4

Tailwind v4 uses a CSS `@custom-variant` to define when `dark:` classes activate. In this project, dark mode is driven by a `data-theme` attribute on the `<html>` element — not by the OS setting.

```css
/* src/index.css */
@custom-variant dark ([data-theme=dark] &);
```

```jsx
// ThemeContext writes the attribute
useEffect(() => {
  document.documentElement.setAttribute("data-theme", theme);
}, [theme]);

// Components use dark: prefix
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
```

**Where in the project:** `index.css`, `ThemeContext.jsx`, every component

---

## Class Schedule

**Format:** 3 classes per week · 2 hours per class · 4 weeks total

---

### Week 1 — JavaScript & React Foundations

#### Class 1 — What is React & How it Works (2 hrs)

**Concepts:** What React is, the virtual DOM, JSX, functional components, Vite dev server

**Topics:**
- Why React? The problem with vanilla JS DOM manipulation
- What JSX compiles to (`React.createElement`)
- Writing your first functional component
- Returning JSX — rules and common mistakes
- `className` vs `class`, self-closing tags, fragments `<></>`
- Vite: what it is, `pnpm dev`, hot module reload

**Activity:** Students clone the starter project, run `pnpm dev`, and read through the existing files (`main.jsx`, `App.jsx`, `RootLayout.jsx`)

---

#### Class 2 — ES6 & Project Architecture (2 hrs)

**Concepts:** ES6 essentials, the 5-layer architecture, Tailwind v4 dark mode config

**Topics:**
- Destructuring, spread, arrow functions, template literals, array methods
- ES modules: `import` / `export` — named vs default
- Tour of the project folder structure and what each layer does
- Tailwind CSS v4: utility classes, `dark:` variant, `@custom-variant`

**Build (Task 1):** Set up `src/index.css` with Tailwind import and dark mode custom variant

```bash
git commit -m "feat: configure Tailwind v4 dark mode via data-theme attribute"
```

---

#### Class 3 — localStorage & The Data Layer (2 hrs)

**Concepts:** Browser `localStorage` API, the DAL pattern, pure functions

**Topics:**
- `localStorage.getItem`, `setItem`, `removeItem`
- Why we wrap APIs — JSON parsing, try/catch, one place to change
- The DAL concept — a layer that speaks "events", not "browser API"
- `crypto.randomUUID()` for generating IDs
- `new Date().toISOString()` for timestamps

**Build (Task 2):** Create `src/utils/localStorage.util.js`

**Build (Task 3):** Create `src/dal/events.dal.js`

```bash
git commit -m "feat: add localStorage utility"
git commit -m "feat: add events DAL"
```

---

### Week 2 — React State & Hooks

#### Class 4 — useState & Custom Hooks (2 hrs)

**Concepts:** `useState` API, lazy initializer, functional updater, writing a generic custom hook

**Topics:**
- `useState` deep dive: primitive, object, and array state
- Why state causes re-renders — React's reconciliation
- Lazy initializer `useState(() => expensiveCall())` — runs once
- Functional updater `setValue((prev) => ...)` — always fresh value
- What makes a function a "custom hook" (the `use` prefix rule)
- Extracting logic into a hook — cleaner components

**Build (Task 4):** Create `src/hooks/useLocalStorage.js`

```bash
git commit -m "feat: add generic useLocalStorage hook"
```

---

#### Class 5 — Domain Hooks & Connecting to the DAL (2 hrs)

**Concepts:** Domain-specific hooks, bridging pure JS with React state

**Topics:**
- The difference between a generic hook and a domain hook
- Seeding React state from the DAL on mount (lazy initializer)
- Keeping two sources in sync: DAL (persist) + React state (render)
- Returning a consistent API from a hook
- Why `addEvent` must return the new event (so the caller can navigate)

**Build (Task 5):** Create `src/hooks/useEvents.js`

```bash
git commit -m "feat: add domain useEvents hook"
```

---

#### Class 6 — Context API & useEffect (2 hrs)

**Concepts:** `createContext`, `useContext`, `Provider`, `useEffect` with dependency array

**Topics:**
- The problem Context solves — "prop drilling"
- `createContext`, `Provider`, `useContext` — the three parts
- Creating a consumer hook with a guard (`if (!ctx) throw`)
- `useEffect` and the dependency array — when does it run?
- Writing to the DOM from React with `useEffect`
- Provider nesting — why order matters

**Build (Task 6):** Create `src/context/ThemeContext.jsx`

**Build (Task 7):** Create `src/context/EventsContext.jsx`

**Build (Task 8):** Modify `src/main.jsx` — wrap app with providers

```bash
git commit -m "feat: add ThemeContext"
git commit -m "feat: add EventsContext"
git commit -m "feat: wrap app with ThemeProvider and EventsProvider"
```

---

### Week 3 — Routing & Components

#### Class 7 — React Router & Layout (2 hrs)

**Concepts:** `createBrowserRouter`, `RouterProvider`, `Outlet`, `NavLink`, `Link`

**Topics:**
- How client-side routing works (no page reload)
- `createBrowserRouter` route config — nested routes
- `RootLayout` with `<Outlet>` — shell that persists across pages
- `Link` vs `NavLink` — when to use each
- `NavLink` render-prop `className`: `({ isActive }) => ...`
- The `end` prop — why the Home link needs it

**Build (Task 10):** Modify `src/components/layouts/NavBar.jsx`

**Build (Task 11):** Modify `src/components/layouts/RootLayout.jsx`

```bash
git commit -m "feat: build NavBar with NavLink active states and theme toggle"
git commit -m "feat: update RootLayout with responsive container and dark mode styles"
```

---

#### Class 8 — Component Design & Props (2 hrs)

**Concepts:** Props, object map pattern for styles, component composition

**Topics:**
- Props as a component's contract — what it needs to work
- Designing props: what goes in, what stays inside
- Using an object map instead of if/else chains (`variantClasses[label]`)
- Nullish coalescing `??` for fallback values
- Composing components: `EventCard` uses `Badge` uses Tailwind classes
- Lucide React: importing and sizing icons

**Build (Task 9):** Create `src/components/Badge.jsx`

**Build (Task 12):** Create `src/components/EventCard.jsx`

```bash
git commit -m "feat: add Badge component"
git commit -m "feat: add EventCard component"
```

---

#### Class 9 — Controlled Forms & Validation (2 hrs)

**Concepts:** Controlled inputs, single-handler pattern, client-side validation, component reuse

**Topics:**
- Controlled vs uncontrolled inputs — why React prefers controlled
- One `handleChange` using the `name` attribute and computed property keys
- Clearing individual field errors on change (good UX)
- `e.preventDefault()` — stopping the default form submit
- Client-side validation — returning an errors object
- Module-level constants (`CATEGORIES`, `STATUSES`, `EMPTY_FORM`) — why outside the component
- How `initialValues` prop makes this form reusable for both create and edit

**Build (Task 13):** Create `src/components/EventForm.jsx`

```bash
git commit -m "feat: add EventForm with controlled inputs and validation"
```

---

### Week 4 — Full CRUD Pages

#### Class 10 — Consuming Context in Pages (2 hrs)

**Concepts:** `useEventsContext`, derived state, `.filter()` chaining, conditional render

**Topics:**
- Consuming context in a page component — `useEventsContext()`
- Derived state: computing values from existing state (not stored separately)
- Chaining `.filter()` calls — each one narrows the result
- Case-insensitive search with `.toLowerCase()`
- Conditional rendering: ternary, short-circuit, early return
- Empty state UX — what to show when there is no data

**Build (Task 14):** Modify `src/pages/Home.jsx`

**Build (Task 15):** Create `src/pages/EventList.jsx`

```bash
git commit -m "feat: build Home page with event stats"
git commit -m "feat: build EventList page with search and filters"
```

---

#### Class 11 — Dynamic Routes & useNavigate (2 hrs)

**Concepts:** `useParams`, `useNavigate`, dynamic route segments, `window.confirm`

**Topics:**
- Dynamic segments in routes: `events/:id` — what the colon means
- `useParams()` — reading the id from the URL
- Passing the id to context: `getEventById(id)`
- Guarding against missing data (event not found)
- `useNavigate()` — redirect after an action (delete, create)
- `window.confirm()` — native browser confirmation dialog
- Why `addEvent` returns the new event (so we can navigate to its page)

**Build (Task 16):** Create `src/pages/EventDetail.jsx`

**Build (Task 17):** Create `src/pages/CreateEvent.jsx`

```bash
git commit -m "feat: build EventDetail page"
git commit -m "feat: build CreateEvent page"
```

---

#### Class 12 — Form Reuse, NotFound & Final Wiring (2 hrs)

**Concepts:** Pre-filling forms, rest/spread destructuring, catch-all routes, wiring all routes

**Topics:**
- Stripping immutable fields with rest destructuring: `const { id: _id, createdAt: _createdAt, ...editableFields } = event`
- Passing `initialValues` to `EventForm` — one component, two use cases
- Catch-all route `"*"` — must be last in the children array
- Wiring all routes in `App.jsx` — the complete router config
- Route ordering: `events/new` must come before `events/:id`
- End-to-end walkthrough: create → view → edit → delete → 404

**Build (Task 18):** Create `src/pages/EditEvent.jsx`

**Build (Task 19):** Create `src/pages/NotFound.jsx`

**Build (Task 20):** Modify `src/App.jsx` — wire all routes

```bash
git commit -m "feat: build EditEvent page"
git commit -m "feat: add NotFound 404 page"
git commit -m "feat: wire all routes"
```

**End-to-end test checklist:**
1. `/` — Home loads, stats show 0/0/0
2. Click "New Event" → form renders with all fields
3. Fill in all fields and submit → redirected to the new event's detail page
4. Click "Events" in nav → event card appears with badges
5. Type in search box → list filters in real time
6. Click "View details →" → detail page loads correctly
7. Click "Edit" → form pre-filled with existing values
8. Change the title, submit → redirected back to detail with updated title
9. Click "Delete" → confirm dialog → redirected to `/events`, event gone
10. Navigate to `/xyz` → 404 page renders
11. Click the moon icon → dark mode activates; refresh → dark mode persists

---

## React Concepts Coverage Map

| Concept | Class | File(s) |
|---|---|---|
| JSX + functional components | Class 1 | All `.jsx` files |
| ES6: destructuring, spread, arrow fns, modules | Class 2 | DAL, hooks, components |
| localStorage API | Class 3 | `localStorage.util.js` |
| Separation of concerns (util → DAL → hook → context → UI) | Class 3 | All layers |
| `useState` (primitive, object, functional updater) | Class 4 | `useLocalStorage.js` |
| Custom hooks — generic | Class 4 | `useLocalStorage.js` |
| Custom hooks — domain | Class 5 | `useEvents.js` |
| `useEffect` with dependency array | Class 6 | `ThemeContext.jsx` |
| Context API (`createContext`, `Provider`, `useContext`) | Class 6 | `ThemeContext.jsx`, `EventsContext.jsx` |
| Provider nesting | Class 6 | `main.jsx` |
| React Router — `createBrowserRouter`, routes, nested routes | Class 7 | `App.jsx` |
| React Router — `Link`, `NavLink` (active states, `end` prop) | Class 7 | `NavBar.jsx` |
| React Router — `Outlet` | Class 7 | `RootLayout.jsx` |
| Props — passing data, default values | Class 8 | `Badge.jsx`, `EventCard.jsx` |
| Component composition | Class 8 | `EventCard` → `Badge` |
| Controlled inputs | Class 9 | `EventForm.jsx` |
| Form validation (client-side) | Class 9 | `EventForm.jsx` |
| Component reuse (same form, two pages) | Class 9 | `EventForm.jsx` |
| `useContext` via consumer hook | Class 10 | `Home.jsx`, `EventList.jsx` |
| Derived state | Class 10 | `Home.jsx` |
| `.filter()` chaining | Class 10 | `EventList.jsx` |
| `.map()` in JSX + `key` prop | Class 10 | `EventList.jsx` |
| Conditional rendering (ternary, `&&`, early return) | Class 10–11 | `EventList.jsx`, `EventDetail.jsx` |
| `useParams` | Class 11 | `EventDetail.jsx`, `EditEvent.jsx` |
| `useNavigate` | Class 11 | `CreateEvent.jsx`, `EditEvent.jsx` |
| Rest/spread in destructuring | Class 12 | `EditEvent.jsx` |
| Catch-all route + route ordering | Class 12 | `App.jsx` |

---

*Built for the React Beginner-to-Intermediate course — Bizmarrow Technology*
