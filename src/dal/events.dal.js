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
