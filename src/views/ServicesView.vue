<template>
  <div class="container py-4 py-md-5">
    <div class="mb-4">
      <p class="text-uppercase text-primary small fw-bold mb-1">Find local support</p>
      <h1 class="mb-2">Service directory</h1>
      <p class="text-muted">Search services, use your location, and open directions for a provider.</p>
    </div>
    <div class="row g-4">
      <div class="col-12 col-lg-5">
        <div class="input-group mb-3">
          <label class="visually-hidden" for="service-search">Search services</label>
          <input id="service-search" v-model="query" class="form-control" type="search" placeholder="Search by service or suburb" />
          <button class="btn btn-outline-primary" type="button" @click="locateMe">Use my location</button>
        </div>
        <div v-if="locationMessage" class="alert alert-info py-2" role="status">{{ locationMessage }}</div>
        <div class="list-group service-list" aria-label="Health services">
          <button v-for="service in filteredServices" :key="service.id" class="list-group-item list-group-item-action text-start" :class="{ active: selected?.id === service.id }" type="button" @click="selectService(service)">
            <div class="d-flex justify-content-between gap-2"><strong>{{ service.name }}</strong><span class="badge rounded-pill" :class="selected?.id === service.id ? 'text-bg-light' : 'text-bg-primary'">{{ service.category }}</span></div>
            <span class="small d-block mt-1">{{ service.address }}</span>
            <span class="small d-block mt-1 opacity-75">{{ service.description }}</span>
          </button>
          <p v-if="!filteredServices.length" class="text-muted p-3">No matching services.</p>
        </div>
      </div>
      <div class="col-12 col-lg-7">
        <div class="map-panel border rounded overflow-hidden" aria-label="Interactive service map">
          <div id="service-map" class="service-map"></div>
          <div class="p-3 bg-white border-top" v-if="selected">
            <strong>{{ selected.name }}</strong>
            <span class="d-block small text-muted">{{ selected.address }} · {{ selected.phone }}</span>
            <a class="btn btn-sm btn-primary mt-2" :href="directionsUrl(selected)" target="_blank" rel="noopener">Open directions</a>
          </div>
        </div>
        <p class="small text-muted mt-2 mb-0">Map data © OpenStreetMap contributors. Location is used only to centre this map.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from 'vue'
import { services } from '../stores/healthbridge'

const query = ref('')
const selected = ref(services.value[0])
const locationMessage = ref('')
let map
let markers = []
const filteredServices = computed(() => {
  const term = query.value.trim().toLowerCase()
  if (!term) return services.value
  return services.value.filter(service => `${service.name} ${service.category} ${service.address}`.toLowerCase().includes(term))
})

function directionsUrl(service) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${service.lat},${service.lng}`)}`
}

function drawMarkers() {
  if (!map || !window.L) return
  markers.forEach(marker => marker.remove())
  markers = filteredServices.value.map(service => window.L.marker([service.lat, service.lng]).addTo(map).bindPopup(`<strong>${service.name}</strong><br>${service.address}`))
}

function selectService(service) {
  selected.value = service
  if (map) map.setView([service.lat, service.lng], 13)
}

function locateMe() {
  if (!navigator.geolocation) {
    locationMessage.value = 'Location is not available in this browser.'
    return
  }
  locationMessage.value = 'Requesting your location…'
  navigator.geolocation.getCurrentPosition(position => {
    if (map) map.setView([position.coords.latitude, position.coords.longitude], 12)
    locationMessage.value = 'Map centred on your current location.'
  }, () => { locationMessage.value = 'Location permission was declined. You can still browse services.' })
}

onMounted(async () => {
  await nextTick()
  if (!window.L) return
  map = window.L.map('service-map').setView([selected.value.lat, selected.value.lng], 5)
  window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors' }).addTo(map)
  drawMarkers()
})
</script>

<style scoped>
.service-map { min-height: 420px; background: #e8f1f5; }
.service-list { max-height: 560px; overflow-y: auto; }
</style>
