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
