import './App.css'
import EventCalendar from './components/EventCalendar'
import useEvents from './hooks/useEvents'

function App() {
  const { events, loading } = useEvents()

  return (
    <>
      <section id="center">
        <h1>Bayonne Events</h1>
        {loading ? (
          <p>Loading events...</p>
        ) : (
          <EventCalendar events={events} />
        )}
      </section>
    </>
  )
}

export default App
