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
