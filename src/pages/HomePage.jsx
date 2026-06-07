import UpcomingEvents from '../components/UpcomingEvents'

export default function HomePage({ events, loading }) {
  return (
    <section id="home-page">
      <h1>Upcoming Events</h1>
      <p className="page-subtitle">Next 7 Days</p>
      <UpcomingEvents events={events} loading={loading} />
    </section>
  )
}
