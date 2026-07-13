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