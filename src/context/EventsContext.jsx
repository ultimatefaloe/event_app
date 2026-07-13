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
