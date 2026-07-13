# Event App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full CRUD Event Management SPA using React + localStorage, structured in clear layers (util → DAL → hooks → context → UI) to demonstrate every concept in the React beginner-to-intermediate textbook.

**Architecture:** Five layers: a raw localStorage utility, a pure-JS events DAL, two custom React hooks (generic + domain), two React contexts (theme + events), and a page/component UI layer. Each layer has one responsibility and can be understood in isolation.

**Tech Stack:** React 19, Vite 8, React Router 8, Tailwind CSS 4 (with `@tailwindcss/vite`), Lucide React icons.

---

## File Map

### New files to create
```
src/utils/localStorage.util.js
src/dal/events.dal.js
src/hooks/useLocalStorage.js
src/hooks/useEvents.js
src/context/ThemeContext.jsx
src/context/EventsContext.jsx
src/components/Badge.jsx
src/components/EventCard.jsx
src/components/EventForm.jsx
src/pages/EventList.jsx
src/pages/EventDetail.jsx
src/pages/CreateEvent.jsx
src/pages/EditEvent.jsx
src/pages/NotFound.jsx
```

### Files to modify
```
src/index.css                          — add dark mode custom variant
src/main.jsx                           — wrap app in ThemeProvider + EventsProvider
src/App.jsx                            — add all routes
src/components/layouts/NavBar.jsx      — full replacement with themed nav + theme toggle
src/components/layouts/RootLayout.jsx  — add layout wrapper classes
src/pages/Home.jsx                     — replace placeholder with stats page
```

---

## Task 1: Dark Mode CSS Setup

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Add dark mode custom variant after the Tailwind import**

Replace the entire `src/index.css` with:

```css
@import "tailwindcss";

@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));

* {
  box-sizing: border-box;
}

body {
  margin: 0;
}
```

> **Why:** Tailwind v4 uses `@custom-variant` to define the `dark:` selector. Setting it to `[data-theme=dark]` means dark classes activate when ThemeContext writes `data-theme="dark"` to `<html>`. This replaces the old `prefers-color-scheme` approach so we control the toggle manually.

- [ ] **Step 2: Verify by running the dev server**

```bash
pnpm dev
```

Expected: App loads at `http://localhost:5173` with no console errors.

- [ ] **Step 3: Commit**

```bash
git add src/index.css
git commit -m "feat: configure Tailwind v4 dark mode via data-theme attribute"
```

---

## Task 2: localStorage Utility

**Files:**
- Create: `src/utils/localStorage.util.js`

- [ ] **Step 1: Create the utility file**

```js
// src/utils/localStorage.util.js

const getItem = (key, fallback = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error("localStorage setItem failed:", err);
  }
};

const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.error("localStorage removeItem failed:", err);
  }
};

export { getItem, setItem, removeItem };
```

- [ ] **Step 2: Verify in browser console**

Open DevTools → Console and paste:
```js
// After importing via the running app, test manually:
localStorage.setItem("test", JSON.stringify({ name: "React" }));
JSON.parse(localStorage.getItem("test")); // → { name: "React" }
localStorage.removeItem("test");
localStorage.getItem("test"); // → null
```
Expected: Each line returns the documented value.

- [ ] **Step 3: Commit**

```bash
git add src/utils/localStorage.util.js
git commit -m "feat: add localStorage utility (getItem, setItem, removeItem)"
```

---

## Task 3: Events DAL

**Files:**
- Create: `src/dal/events.dal.js`

- [ ] **Step 1: Create the DAL file**

```js
// src/dal/events.dal.js
import { getItem, setItem } from "../utils/localStorage.util";

const EVENTS_KEY = "events";

const getEvents = () => getItem(EVENTS_KEY, []);

const getEventById = (id) => getEvents().find((e) => e.id === id);

const addEvent = (data) => {
  const newEvent = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  setItem(EVENTS_KEY, [...getEvents(), newEvent]);
  return newEvent;
};

const updateEvent = (id, updates) => {
  const events = getEvents().map((e) =>
    e.id === id ? { ...e, ...updates } : e
  );
  setItem(EVENTS_KEY, events);
  return events.find((e) => e.id === id);
};

const deleteEvent = (id) => {
  setItem(EVENTS_KEY, getEvents().filter((e) => e.id !== id));
};

export { getEvents, getEventById, addEvent, updateEvent, deleteEvent };
```

- [ ] **Step 2: Verify in browser console**

With the dev server running, open DevTools → Console:
```js
// Paste and run these one at a time to confirm each function works:
// (import resolution happens at module level; test via window or copy-paste the logic)
const ev = { title: "Test", date: "2026-08-01", location: "Lagos", description: "Test event", category: "meetup", status: "upcoming" };
localStorage.setItem("events", JSON.stringify([]));
// Add:
const stored = [{ ...ev, id: "abc123", createdAt: new Date().toISOString() }];
localStorage.setItem("events", JSON.stringify(stored));
JSON.parse(localStorage.getItem("events")); // → [{ id: "abc123", ... }]
```
Expected: Array with one event returned.

- [ ] **Step 3: Commit**

```bash
git add src/dal/events.dal.js
git commit -m "feat: add events DAL (getEvents, getEventById, addEvent, updateEvent, deleteEvent)"
```

---

## Task 4: useLocalStorage Hook

**Files:**
- Create: `src/hooks/useLocalStorage.js`

- [ ] **Step 1: Create the hook**

```js
// src/hooks/useLocalStorage.js
import { useState } from "react";
import { getItem, setItem } from "../utils/localStorage.util";

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() =>
    getItem(key, initialValue)
  );

  const setValue = (value) => {
    const valueToStore =
      value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    setItem(key, valueToStore);
  };

  return [storedValue, setValue];
};

export default useLocalStorage;
```

> **Teaching note:** The lazy initialiser `() => getItem(key, initialValue)` runs only once on mount — same pattern as `useState(() => expensiveComputation())`. The `value instanceof Function` check lets callers pass an updater `(prev) => newValue`, just like the real `useState` setter.

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useLocalStorage.js
git commit -m "feat: add generic useLocalStorage hook"
```

---

## Task 5: useEvents Hook

**Files:**
- Create: `src/hooks/useEvents.js`

- [ ] **Step 1: Create the hook**

```js
// src/hooks/useEvents.js
import { useState } from "react";
import {
  getEvents,
  addEvent as dalAdd,
  updateEvent as dalUpdate,
  deleteEvent as dalDelete,
} from "../dal/events.dal";

const useEvents = () => {
  const [events, setEvents] = useState(() => getEvents());

  const addEvent = (data) => {
    const newEvent = dalAdd(data);
    setEvents((prev) => [...prev, newEvent]);
    return newEvent;
  };

  const updateEvent = (id, updates) => {
    const updated = dalUpdate(id, updates);
    setEvents((prev) => prev.map((e) => (e.id === id ? updated : e)));
  };

  const deleteEvent = (id) => {
    dalDelete(id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const getEventById = (id) => events.find((e) => e.id === id);

  return { events, addEvent, updateEvent, deleteEvent, getEventById };
};

export default useEvents;
```

> **Teaching note:** `addEvent` calls the DAL to persist first, then updates React state — two separate operations. The DAL is the source of truth; React state is a reactive mirror. `addEvent` returns `newEvent` so callers can navigate to the new item's detail page.

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useEvents.js
git commit -m "feat: add domain useEvents hook (wraps DAL, manages React state)"
```

---

## Task 6: ThemeContext

**Files:**
- Create: `src/context/ThemeContext.jsx`

- [ ] **Step 1: Create the context**

```jsx
// src/context/ThemeContext.jsx
import { createContext, useContext, useEffect } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useLocalStorage("theme", "light");

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
```

> **Teaching note:** `useEffect` with `[theme]` dependency runs whenever `theme` changes, writing the attribute to `<html>`. Tailwind's `dark:` classes then activate on all children. The theme persists across reloads because `useLocalStorage` seeds from localStorage on mount.

- [ ] **Step 2: Commit**

```bash
git add src/context/ThemeContext.jsx
git commit -m "feat: add ThemeContext with dark/light toggle persisted to localStorage"
```

---

## Task 7: EventsContext

**Files:**
- Create: `src/context/EventsContext.jsx`

- [ ] **Step 1: Create the context**

```jsx
// src/context/EventsContext.jsx
import { createContext, useContext } from "react";
import useEvents from "../hooks/useEvents";

const EventsContext = createContext(null);

export const EventsProvider = ({ children }) => {
  const eventsState = useEvents();

  return (
    <EventsContext.Provider value={eventsState}>
      {children}
    </EventsContext.Provider>
  );
};

export const useEventsContext = () => {
  const ctx = useContext(EventsContext);
  if (!ctx)
    throw new Error("useEventsContext must be used within EventsProvider");
  return ctx;
};
```

> **Teaching note:** `EventsContext` is a thin wrapper — it delegates all logic to `useEvents`. This is the key pattern: context shares state, hooks manage it. If you ever swap localStorage for an API, you only touch `useEvents`, not the context or any component.

- [ ] **Step 2: Commit**

```bash
git add src/context/EventsContext.jsx
git commit -m "feat: add EventsContext (wraps useEvents, provides CRUD to component tree)"
```

---

## Task 8: Wire Providers in main.jsx

**Files:**
- Modify: `src/main.jsx`

- [ ] **Step 1: Wrap the app with both providers**

```jsx
// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { EventsProvider } from "./context/EventsContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <EventsProvider>
        <App />
      </EventsProvider>
    </ThemeProvider>
  </StrictMode>
);
```

- [ ] **Step 2: Verify in browser**

```bash
pnpm dev
```
Open `http://localhost:5173`. Expected: Page loads with no console errors. React DevTools Components tab should show `ThemeProvider > EventsProvider > App` in the tree.

- [ ] **Step 3: Commit**

```bash
git add src/main.jsx
git commit -m "feat: wrap app with ThemeProvider and EventsProvider"
```

---

## Task 9: Badge Component

**Files:**
- Create: `src/components/Badge.jsx`

- [ ] **Step 1: Create the component**

```jsx
// src/components/Badge.jsx
const variantClasses = {
  upcoming:
    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  completed:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  conference:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  workshop:
    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  meetup:
    "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
  webinar:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  other:
    "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
};

const Badge = ({ label }) => {
  const classes = variantClasses[label] ?? variantClasses.other;
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-medium capitalize ${classes}`}
    >
      {label}
    </span>
  );
};

export default Badge;
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Badge.jsx
git commit -m "feat: add reusable Badge component for event status and category"
```

---

## Task 10: NavBar Component

**Files:**
- Modify: `src/components/layouts/NavBar.jsx`

- [ ] **Step 1: Replace the placeholder with a full themed navbar**

```jsx
// src/components/layouts/NavBar.jsx
import { NavLink, Link } from "react-router";
import { Moon, Sun, Plus } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const NavBar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-3 flex items-center justify-between">
      <Link
        to="/"
        className="font-bold text-xl text-indigo-600 dark:text-indigo-400"
      >
        EventApp
      </Link>

      <div className="flex items-center gap-6">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive
              ? "text-indigo-600 dark:text-indigo-400 font-medium"
              : "text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/events"
          className={({ isActive }) =>
            isActive
              ? "text-indigo-600 dark:text-indigo-400 font-medium"
              : "text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
          }
        >
          Events
        </NavLink>

        <Link
          to="/events/new"
          className="flex items-center gap-1 bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700 text-sm font-medium"
        >
          <Plus size={16} />
          New Event
        </Link>

        <button
          onClick={toggleTheme}
          className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
          aria-label="Toggle theme"
        >
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
```

- [ ] **Step 2: Verify in browser**

Open `http://localhost:5173`. Expected: Navbar renders with "EventApp" brand, Home + Events links, New Event button, and Moon icon. Clicking the Moon icon should toggle to Sun and switch the page background to dark.

- [ ] **Step 3: Commit**

```bash
git add src/components/layouts/NavBar.jsx
git commit -m "feat: build NavBar with NavLink active states and theme toggle"
```

---

## Task 11: RootLayout Update

**Files:**
- Modify: `src/components/layouts/RootLayout.jsx`

- [ ] **Step 1: Add layout wrapper with dark-mode-aware background**

```jsx
// src/components/layouts/RootLayout.jsx
import { Outlet } from "react-router";
import NavBar from "./NavBar";

const RootLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <NavBar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
```

- [ ] **Step 2: Verify in browser**

Expected: Page has a light gray background in light mode, near-black in dark mode. Content is centered with padding.

- [ ] **Step 3: Commit**

```bash
git add src/components/layouts/RootLayout.jsx
git commit -m "feat: update RootLayout with responsive container and dark mode styles"
```

---

## Task 12: EventCard Component

**Files:**
- Create: `src/components/EventCard.jsx`

- [ ] **Step 1: Create the component**

```jsx
// src/components/EventCard.jsx
import { Link } from "react-router";
import { Calendar, MapPin } from "lucide-react";
import Badge from "./Badge";

const EventCard = ({ event }) => {
  const { id, title, date, location, category, status } = event;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg">{title}</h3>
        <div className="flex gap-1.5">
          <Badge label={status} />
          <Badge label={category} />
        </div>
      </div>

      <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1 mb-3">
        <p className="flex items-center gap-1.5">
          <Calendar size={14} />
          {date}
        </p>
        <p className="flex items-center gap-1.5">
          <MapPin size={14} />
          {location}
        </p>
      </div>

      <Link
        to={`/events/${id}`}
        className="text-indigo-600 dark:text-indigo-400 text-sm hover:underline"
      >
        View details →
      </Link>
    </div>
  );
};

export default EventCard;
```

- [ ] **Step 2: Commit**

```bash
git add src/components/EventCard.jsx
git commit -m "feat: add EventCard component (receives event prop, shows badges and detail link)"
```

---

## Task 13: EventForm Component

**Files:**
- Create: `src/components/EventForm.jsx`

- [ ] **Step 1: Create the shared form component**

```jsx
// src/components/EventForm.jsx
import { useState } from "react";

const CATEGORIES = ["conference", "workshop", "meetup", "webinar", "other"];
const STATUSES = ["upcoming", "completed"];

const EMPTY_FORM = {
  title: "",
  date: "",
  location: "",
  description: "",
  category: "conference",
  status: "upcoming",
};

const validate = (data) => {
  const errors = {};
  if (!data.title.trim()) errors.title = "Title is required";
  if (!data.date) errors.date = "Date is required";
  if (!data.location.trim()) errors.location = "Location is required";
  if (!data.description.trim()) errors.description = "Description is required";
  return errors;
};

const inputClass =
  "w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500";

const EventForm = ({
  initialValues = EMPTY_FORM,
  onSubmit,
  submitLabel = "Save Event",
}) => {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={inputClass}
          placeholder="Event title"
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Date</label>
        <input
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          className={inputClass}
        />
        {errors.date && (
          <p className="text-red-500 text-xs mt-1">{errors.date}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Location</label>
        <input
          name="location"
          value={formData.location}
          onChange={handleChange}
          className={inputClass}
          placeholder="City or venue"
        />
        {errors.location && (
          <p className="text-red-500 text-xs mt-1">{errors.location}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className={inputClass}
          placeholder="Describe the event"
        />
        {errors.description && (
          <p className="text-red-500 text-xs mt-1">{errors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={inputClass}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={inputClass}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 font-medium transition-colors"
      >
        {submitLabel}
      </button>
    </form>
  );
};

export default EventForm;
```

- [ ] **Step 2: Commit**

```bash
git add src/components/EventForm.jsx
git commit -m "feat: add EventForm with controlled inputs, validation, and configurable submit label"
```

---

## Task 14: Home Page

**Files:**
- Modify: `src/pages/Home.jsx`

- [ ] **Step 1: Replace placeholder with stats dashboard**

```jsx
// src/pages/Home.jsx
import { Link } from "react-router";
import { useEventsContext } from "../context/EventsContext";

const StatCard = ({ label, value, color }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
    <p className={`text-4xl font-bold ${color}`}>{value}</p>
    <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">{label}</p>
  </div>
);

const Home = () => {
  const { events } = useEventsContext();

  const upcoming = events.filter((e) => e.status === "upcoming").length;
  const completed = events.filter((e) => e.status === "completed").length;

  return (
    <div>
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-3">Welcome to EventApp</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Create, manage, and track your events — all stored locally.
        </p>
        <Link
          to="/events/new"
          className="inline-block bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 font-medium transition-colors"
        >
          + Create New Event
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <StatCard
          label="Total Events"
          value={events.length}
          color="text-indigo-600 dark:text-indigo-400"
        />
        <StatCard
          label="Upcoming"
          value={upcoming}
          color="text-blue-600 dark:text-blue-400"
        />
        <StatCard
          label="Completed"
          value={completed}
          color="text-green-600 dark:text-green-400"
        />
      </div>

      <div className="text-center">
        <Link
          to="/events"
          className="text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Browse all events →
        </Link>
      </div>
    </div>
  );
};

export default Home;
```

- [ ] **Step 2: Verify in browser**

Open `http://localhost:5173`. Expected: Hero section + 3 stat cards showing 0/0/0 (empty state). "Browse all events →" link navigates to `/events` (404 for now — fixed in Task 15).

- [ ] **Step 3: Commit**

```bash
git add src/pages/Home.jsx
git commit -m "feat: build Home page with event stats from EventsContext"
```

---

## Task 15: EventList Page

**Files:**
- Create: `src/pages/EventList.jsx`

- [ ] **Step 1: Create the page**

```jsx
// src/pages/EventList.jsx
import { useState } from "react";
import { Link } from "react-router";
import { useEventsContext } from "../context/EventsContext";
import EventCard from "../components/EventCard";

const CATEGORIES = ["all", "conference", "workshop", "meetup", "webinar", "other"];
const STATUSES = ["all", "upcoming", "completed"];

const selectClass =
  "border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100";

const EventList = () => {
  const { events } = useEventsContext();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");

  const filtered = events
    .filter((e) =>
      e.title.toLowerCase().includes(search.toLowerCase())
    )
    .filter((e) => category === "all" || e.category === category)
    .filter((e) => status === "all" || e.status === status);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Events</h1>
        <Link
          to="/events/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm font-medium transition-colors"
        >
          + New Event
        </Link>
      </div>

      <div className="flex gap-3 mb-6 flex-wrap">
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 flex-1 min-w-48"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={selectClass}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c === "all" ? "All Categories" : c}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className={selectClass}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s === "all" ? "All Statuses" : s}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500">
          <p className="text-lg mb-2">No events found.</p>
          <Link
            to="/events/new"
            className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm"
          >
            Create your first event →
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/EventList.jsx
git commit -m "feat: build EventList page with search and category/status filters"
```

---

## Task 16: EventDetail Page

**Files:**
- Create: `src/pages/EventDetail.jsx`

- [ ] **Step 1: Create the page**

```jsx
// src/pages/EventDetail.jsx
import { useParams, useNavigate, Link } from "react-router";
import { Calendar, MapPin, Edit, Trash2 } from "lucide-react";
import { useEventsContext } from "../context/EventsContext";
import Badge from "../components/Badge";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEventById, deleteEvent } = useEventsContext();

  const event = getEventById(id);

  if (!event) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 dark:text-gray-400 mb-4">Event not found.</p>
        <Link to="/events" className="text-indigo-600 dark:text-indigo-400 hover:underline">
          Back to Events
        </Link>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm("Delete this event? This cannot be undone.")) {
      deleteEvent(id);
      navigate("/events");
    }
  };

  const { title, date, location, description, category, status } = event;

  return (
    <div className="max-w-2xl">
      <Link
        to="/events"
        className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline mb-4 inline-block"
      >
        ← Back to Events
      </Link>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold">{title}</h1>
          <div className="flex gap-2">
            <Link
              to={`/events/${id}/edit`}
              className="flex items-center gap-1 text-sm border border-gray-300 dark:border-gray-600 px-3 py-1.5 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Edit size={14} />
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="flex items-center gap-1 text-sm border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 px-3 py-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <Badge label={status} />
          <Badge label={category} />
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1.5 mb-4">
          <p className="flex items-center gap-1.5">
            <Calendar size={14} />
            {date}
          </p>
          <p className="flex items-center gap-1.5">
            <MapPin size={14} />
            {location}
          </p>
        </div>

        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

export default EventDetail;
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/EventDetail.jsx
git commit -m "feat: build EventDetail page with useParams, delete confirm, and edit link"
```

---

## Task 17: CreateEvent Page

**Files:**
- Create: `src/pages/CreateEvent.jsx`

- [ ] **Step 1: Create the page**

```jsx
// src/pages/CreateEvent.jsx
import { useNavigate } from "react-router";
import { useEventsContext } from "../context/EventsContext";
import EventForm from "../components/EventForm";

const CreateEvent = () => {
  const navigate = useNavigate();
  const { addEvent } = useEventsContext();

  const handleSubmit = (formData) => {
    const newEvent = addEvent(formData);
    navigate(`/events/${newEvent.id}`);
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Create New Event</h1>
      <EventForm onSubmit={handleSubmit} submitLabel="Create Event" />
    </div>
  );
};

export default CreateEvent;
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/CreateEvent.jsx
git commit -m "feat: build CreateEvent page (renders EventForm, navigates to new event on save)"
```

---

## Task 18: EditEvent Page

**Files:**
- Create: `src/pages/EditEvent.jsx`

- [ ] **Step 1: Create the page**

```jsx
// src/pages/EditEvent.jsx
import { useParams, useNavigate, Link } from "react-router";
import { useEventsContext } from "../context/EventsContext";
import EventForm from "../components/EventForm";

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEventById, updateEvent } = useEventsContext();

  const event = getEventById(id);

  if (!event) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 dark:text-gray-400 mb-4">Event not found.</p>
        <Link to="/events" className="text-indigo-600 dark:text-indigo-400 hover:underline">
          Back to Events
        </Link>
      </div>
    );
  }

  const { id: _id, createdAt: _createdAt, ...editableFields } = event;

  const handleSubmit = (formData) => {
    updateEvent(id, formData);
    navigate(`/events/${id}`);
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Edit Event</h1>
      <EventForm
        initialValues={editableFields}
        onSubmit={handleSubmit}
        submitLabel="Update Event"
      />
    </div>
  );
};

export default EditEvent;
```

> **Teaching note:** `const { id: _id, createdAt: _createdAt, ...editableFields } = event` strips `id` and `createdAt` from the object passed to `EventForm`. The form only edits the 6 user-facing fields; `id` and `createdAt` are immutable and stay in the DAL.

- [ ] **Step 2: Commit**

```bash
git add src/pages/EditEvent.jsx
git commit -m "feat: build EditEvent page (pre-fills EventForm via useParams, calls updateEvent)"
```

---

## Task 19: NotFound Page

**Files:**
- Create: `src/pages/NotFound.jsx`

- [ ] **Step 1: Create the page**

```jsx
// src/pages/NotFound.jsx
import { Link } from "react-router";

const NotFound = () => (
  <div className="text-center py-20">
    <h1 className="text-8xl font-bold text-gray-200 dark:text-gray-800 mb-4">
      404
    </h1>
    <p className="text-xl text-gray-500 dark:text-gray-400 mb-6">
      Page not found
    </p>
    <Link
      to="/"
      className="text-indigo-600 dark:text-indigo-400 hover:underline"
    >
      Go Home
    </Link>
  </div>
);

export default NotFound;
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/NotFound.jsx
git commit -m "feat: add NotFound 404 page"
```

---

## Task 20: Wire All Routes in App.jsx

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Replace the router with all routes**

```jsx
// src/App.jsx
import { createBrowserRouter, RouterProvider } from "react-router";
import RootLayout from "./components/layouts/RootLayout.jsx";
import Home from "./pages/Home.jsx";
import EventList from "./pages/EventList.jsx";
import EventDetail from "./pages/EventDetail.jsx";
import CreateEvent from "./pages/CreateEvent.jsx";
import EditEvent from "./pages/EditEvent.jsx";
import NotFound from "./pages/NotFound.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "events", element: <EventList /> },
      { path: "events/new", element: <CreateEvent /> },
      { path: "events/:id", element: <EventDetail /> },
      { path: "events/:id/edit", element: <EditEvent /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
```

- [ ] **Step 2: Full end-to-end verification in browser**

```bash
pnpm dev
```

Test the golden path:
1. `http://localhost:5173` — Home loads, stats show 0/0/0
2. Click "New Event" → `/events/new` — form renders with all fields
3. Fill in all fields and submit → redirected to `/events/:id` detail page
4. Click "Events" in nav → `/events` — event card appears with badges
5. Type in search box → list filters in real time
6. Click "View details →" → detail page loads correctly
7. Click "Edit" → `/events/:id/edit` — form pre-filled with existing values
8. Change title, submit → redirected back to detail with updated title
9. Click "Delete" → confirm dialog → redirected to `/events`, event gone
10. Navigate to `/xyz` → 404 page renders
11. Click moon icon → dark mode activates, refresh page → dark mode persists

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat: wire all routes (Home, EventList, CreateEvent, EventDetail, EditEvent, NotFound)"
```

---

## Concepts Coverage Checklist

| Concept | Task |
|---|---|
| ES6: arrow functions, destructuring, spread | Tasks 2–5 |
| ES6: `.map()`, `.filter()`, `.find()` | Tasks 3, 5, 15 |
| JSX + dynamic values + ternary | Tasks 9–19 |
| Functional components | All |
| Props (read-only in child) | Tasks 9, 12, 13 |
| useState (primitive + object) | Task 13, 15 |
| useEffect (with dependency array) | Task 6 |
| useContext | Tasks 6, 7 |
| Custom hook — generic (mirrors useState) | Task 4 |
| Custom hook — domain (wraps DAL) | Task 5 |
| Context API (createContext, Provider) | Tasks 6, 7 |
| React Router: routes, Link, NavLink | Tasks 10, 20 |
| React Router: useParams | Tasks 16, 18 |
| React Router: useNavigate | Tasks 17, 18 |
| Controlled inputs + form validation | Task 13 |
| Component reuse (same form, 2 pages) | Tasks 17, 18 |
| Separation of concerns (util → DAL → hook → context → UI) | Tasks 2–8 |
| localStorage persistence | Tasks 2–6 |
| Dark/light theme with context | Tasks 1, 6, 10 |
