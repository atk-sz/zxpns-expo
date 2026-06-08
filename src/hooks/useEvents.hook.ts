import { eventRepo } from "@/be/database/sqlite/eventRepo";
import {
  addEvent,
  removeEvent,
  setEvents,
  updateEvent,
} from "@/redux/slices/events";
import { IExpenseEvent } from "@/utils/interfaces";
import { useSQLiteContext } from "expo-sqlite";
import { useDispatch } from "react-redux";

const useEventsHandler = () => {
  const dispatch = useDispatch();
  const db = useSQLiteContext();

  const createEvent = async (newEvent: IExpenseEvent) => {
    await eventRepo.create(newEvent, db);
    dispatch(addEvent(newEvent));
  };

  const getAllEvents = async (): Promise<IExpenseEvent[]> => {
    const events = await eventRepo.getAll(db);
    dispatch(setEvents(events));
    return events;
  };

  const updateEventById = async (id: string, updatedEvent: IExpenseEvent) => {
    await eventRepo.update(id, updatedEvent, db);
    dispatch(updateEvent({ id, updates: updatedEvent }));
  };

  const removeEventById = async (id: string) => {
    await eventRepo.remove(id, db);
    dispatch(removeEvent(id));
  };

  return {
    createEvent,
    getAllEvents,
    removeEventById,
    updateEventById,
  };
};

export default useEventsHandler;
