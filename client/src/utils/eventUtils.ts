/**
 * Checks whether an event's due date / time has arrived or passed.
 * When the due date of an event is reached, registration is closed.
 */
export const isEventRegistrationClosed = (eventDateInput?: string | Date | null): boolean => {
  if (!eventDateInput) return false;
  const eventDate = new Date(eventDateInput);
  if (isNaN(eventDate.getTime())) return false;
  return Date.now() >= eventDate.getTime();
};

export default isEventRegistrationClosed;

