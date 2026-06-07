import { useEffect, useState } from "react";

export default function useEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      try {
        // Load source list
        const indexResponse = await fetch(
          "/data/events/index.json"
        );

        const index = await indexResponse.json();

        // Load all event files
        const files = await Promise.all(
          index.sources.map((file) =>
            fetch(`/data/events/${file}`)
          )
        );

        const organizations = await Promise.all(
          files.map((response) => response.json())
        );

        const mergedEvents = organizations.flatMap(
          (organization) =>
            organization.events.map((event) => ({
              ...event,
              organization: organization.organization,
              category: organization.category
            }))
        );

        mergedEvents.sort(
          (a, b) =>
            new Date(`${a.date}T${a.time}`) -
            new Date(`${b.date}T${b.time}`)
        );

        setEvents(mergedEvents);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  return { events, loading };
}