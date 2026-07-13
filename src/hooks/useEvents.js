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
