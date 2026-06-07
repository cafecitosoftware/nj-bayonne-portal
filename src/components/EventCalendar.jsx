import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function EventCalendar({ events }) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const selectedDateString = selectedDate.toISOString().split("T")[0];

  const dayEvents = events.filter(
    (event) => event.date === selectedDateString
  );

  return (
    <div>
      <Calendar
        value={selectedDate}
        onChange={setSelectedDate}
        tileContent={({ date }) => {
          const dateString = date.toISOString().split("T")[0];

          const hasEvent = events.some(
            (event) => event.date === dateString
          );

          return hasEvent ? (
            <div
              style={{
                width: "8px",
                height: "8px",
                background: "red",
                borderRadius: "50%",
                margin: "0 auto"
              }}
            />
          ) : null;
        }}
      />

      <h2>Events on {selectedDateString}</h2>

      {dayEvents.length === 0 ? (
        <p>No events.</p>
      ) : (
        dayEvents.map((event) => (
          <div key={event.id}>
            <h3>{event.title}</h3>
            <p>{event.location}</p>
            <p>{event.description}</p>
          </div>
        ))
      )}
    </div>
  );
}