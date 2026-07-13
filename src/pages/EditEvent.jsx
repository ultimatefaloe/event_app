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
