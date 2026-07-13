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
