import EventCalendar from '../components/EventCalendar'

export default function CalendarPage({ events, loading }) {
  return (
    <section id="calendar-page">
      <h1>Event Calendar</h1>
      {loading ? (
        <p>Loading events...</p>
      ) : (
        <EventCalendar events={events} />
      )}
    </section>
  )
}
