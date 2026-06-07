import '../styles/UpcomingEvents.css'

export default function UpcomingEvents({ events, loading }) {
  if (loading) {
    return <p className="loading">Loading events...</p>
  }

  // Get today's date and the date 7 days from now
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const sevenDaysFromNow = new Date(today)
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)

  // Filter events for the next 7 days
  const upcomingEvents = events.filter((event) => {
    const eventDate = new Date(event.date)
    return eventDate >= today && eventDate < sevenDaysFromNow
  })

  // Group events by date
  const eventsByDate = {}
  upcomingEvents.forEach((event) => {
    if (!eventsByDate[event.date]) {
      eventsByDate[event.date] = []
    }
    eventsByDate[event.date].push(event)
  })

  // Sort dates
  const sortedDates = Object.keys(eventsByDate).sort()

  return (
    <div className="upcoming-events">
      {upcomingEvents.length === 0 ? (
        <p className="no-events">No events scheduled for the next 7 days.</p>
      ) : (
        <div className="events-container">
          {sortedDates.map((date) => {
            const dateObj = new Date(date)
            const dayName = dateObj.toLocaleDateString('en-US', {
              weekday: 'long'
            })
            const formattedDate = dateObj.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            })

            return (
              <div key={date} className="day-group">
                <h3 className="day-header">
                  {dayName}, {formattedDate}
                </h3>
                <div className="events-list">
                  {eventsByDate[date].map((event) => (
                    <div key={event.id} className="event-card">
                      <div className="event-time">{event.time}</div>
                      <div className="event-details">
                        <h4 className="event-title">{event.title}</h4>
                        <p className="event-location">{event.location}</p>
                        <p className="event-description">{event.description}</p>
                        <p className="event-organization">
                          {event.organization}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
