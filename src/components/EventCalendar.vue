<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  events: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['select'])

const selectedDay = ref(null)

function selectDay(day) {
  selectedDay.value = selectedDay.value === day ? null : day
  emit('select', selectedDay.value)
}

function toDateParts(value) {
  if (typeof value !== 'string') {
    return null
  }

  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) {
    return null
  }

  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  }
}

const today = new Date()
const monthYearLabel = computed(() =>
  today.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  }),
)

const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
const firstWeekday = firstOfMonth.getDay()
const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()

const eventsByDay = computed(() => {
  const map = new Map()

  for (const event of props.events) {
    const parts = toDateParts(event?.date)
    if (!parts) {
      continue
    }

    if (parts.year !== today.getFullYear() || parts.month !== today.getMonth() + 1) {
      continue
    }

    const existing = map.get(parts.day) || []
    existing.push(event)
    map.set(parts.day, existing)
  }

  return map
})

const dayCells = computed(() => {
  const cells = []

  for (let i = 0; i < firstWeekday; i += 1) {
    cells.push({ key: `empty-${i}`, empty: true })
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({
      key: `day-${day}`,
      day,
      empty: false,
      events: eventsByDay.value.get(day) || [],
    })
  }

  return cells
})
</script>

<template>
  <section class="calendar" aria-label="Event calendar">
    <h2>{{ monthYearLabel }}</h2>
    <div class="weekdays" aria-hidden="true">
      <span>Sun</span>
      <span>Mon</span>
      <span>Tue</span>
      <span>Wed</span>
      <span>Thu</span>
      <span>Fri</span>
      <span>Sat</span>
    </div>

    <div class="grid">
      <button
        v-for="cell in dayCells"
        :key="cell.key"
        type="button"
        class="day-cell"
        :class="{
          empty: cell.empty,
          'has-events': !cell.empty && cell.events.length > 0,
          selected: !cell.empty && selectedDay === cell.day,
        }"
        :disabled="cell.empty"
        @click="!cell.empty && selectDay(cell.day)"
      >
        <template v-if="!cell.empty">
          <span class="day-number">{{ cell.day }}</span>
          <span v-if="cell.events.length > 0" class="badge">{{ cell.events.length }}</span>
        </template>
      </button>
    </div>
  </section>
</template>

<style scoped>
.calendar {
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 1rem;
  background: var(--color-background-soft);
}

.calendar h2 {
  margin: 0 0 0.9rem;
  font-size: 1.1rem;
}

.weekdays,
.grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 0.4rem;
}

.weekdays span {
  text-align: center;
  font-size: 0.8rem;
  opacity: 0.75;
}

.day-cell {
  min-height: 2.8rem;
  border-radius: 8px;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  padding: 0.3rem;
  position: relative;
  cursor: pointer;
  transition: all 0.15s ease-out;
}

.day-cell:disabled {
  cursor: not-allowed;
}

.day-cell.empty {
  opacity: 0.25;
}

.day-cell.has-events {
  border-color: #2e7d32;
  box-shadow: inset 0 0 0 1px #2e7d32;
}

.day-cell.selected {
  background: #2e7d32;
  color: #ffffff;
  border-color: #1b5e20;
  box-shadow: 0 2px 8px rgba(46, 125, 50, 0.3);
}

.day-cell.selected .badge {
  background: #ffffff;
  color: #2e7d32;
}

.day-number {
  font-size: 0.85rem;
}

.badge {
  position: absolute;
  right: 0.3rem;
  top: 0.3rem;
  font-size: 0.7rem;
  line-height: 1;
  border-radius: 999px;
  padding: 0.2rem 0.35rem;
  background: #2e7d32;
  color: #ffffff;
}
</style>
