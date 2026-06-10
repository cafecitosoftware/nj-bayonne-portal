<script setup>
import EventList from '../components/EventList.vue'
</script>

<template>
  <div class="events">
    <EventList />
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .events {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
