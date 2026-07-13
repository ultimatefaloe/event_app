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
