<template>
  <div class="container py-5">
    <h1 class="text-center mb-2">Rate a Service</h1>
    <p class="text-center text-muted mb-4">
      Help other seniors by sharing your experience with health services
    </p>

    <!-- Service List with Ratings -->
    <div class="row g-4">
      <div class="col-12 col-sm-6 col-xl-4" v-for="service in services" :key="service.id">
        <div class="card shadow-sm h-100">
          <div class="card-body">
            <h5 class="card-title">{{ service.name }}</h5>
            <p class="text-muted small">{{ service.description }}</p>

            <!-- Average Rating Display -->
            <div class="mb-2">
              <span class="fw-bold">Average Rating: </span>
              <span class="text-warning">
                <span v-for="star in 5" :key="star">
                  {{ star <= Math.round(getAverageRating(service.id)) ? '★' : '☆' }}
                </span>
              </span>
              <span class="text-muted small ms-1">
                ({{ getAverageRating(service.id).toFixed(1) }} / 5
                — {{ getRatingCount(service.id) }} reviews)
              </span>
            </div>

            <!-- User Rating Input -->
            <div v-if="isLoggedIn" class="mt-3">
              <label class="form-label small fw-bold">Your Rating:</label>
              <div class="star-rating">
                <button v-for="star in 5" :key="star" type="button"
                        class="btn btn-sm p-0 me-1 star-btn"
                        :class="{ 'text-warning': star <= (hoverRating[service.id] || userRatings[service.id] || 0) }"
                        @click="submitRating(service.id, star)"
                        @mouseenter="hoverRating[service.id] = star"
                        @mouseleave="hoverRating[service.id] = 0"
                        :aria-label="'Rate ' + star + ' stars'">
                  <span class="fs-4">★</span>
                </button>
              </div>
              <div v-if="ratingMessage[service.id]" class="text-success small mt-1">
                {{ ratingMessage[service.id] }}
              </div>
            </div>
            <div v-else class="mt-3">
              <p class="text-muted small">
                <router-link to="/login">Login</router-link> to rate this service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { authState } from '../stores/auth'

const isLoggedIn = computed(() => authState.currentUser !== null)

const services = ref([
  { id: 1, name: 'General Practitioner Visit', description: 'Bulk-billed GP consultations for seniors with Medicare cards.' },
  { id: 2, name: 'Home Care Nursing', description: 'In-home nursing visits for medication, wound care and health checks.' },
  { id: 3, name: 'Physiotherapy Program', description: 'Group and individual physiotherapy sessions for mobility and strength.' },
  { id: 4, name: 'Mental Health Counselling', description: 'Free counselling sessions for seniors experiencing anxiety or depression.' },
  { id: 5, name: 'Nutrition Advice Service', description: 'Dietitian consultations tailored for age-related dietary needs.' },
  { id: 6, name: 'Community Transport', description: 'Door-to-door transport service for medical appointments.' }
])

// Load ratings from LocalStorage
function loadRatings() {
  const stored = localStorage.getItem('healthbridge_ratings')
  return stored ? JSON.parse(stored) : {}
}

function saveRatings(ratings) {
  localStorage.setItem('healthbridge_ratings', JSON.stringify(ratings))
}

// ratings structure: { serviceId: [ { userId, score } ] }
const allRatings = ref(loadRatings())
const hoverRating = reactive({})
const ratingMessage = reactive({})

// Current user's ratings
const userRatings = computed(() => {
  const result = {}
  if (!authState.currentUser) return result
  const userId = authState.currentUser.id
  for (const serviceId in allRatings.value) {
    const found = allRatings.value[serviceId].find(r => r.userId === userId)
    if (found) result[serviceId] = found.score
  }
  return result
})

function getAverageRating(serviceId) {
  const ratings = allRatings.value[serviceId]
  if (!ratings || ratings.length === 0) return 0
  const sum = ratings.reduce((acc, r) => acc + r.score, 0)
  return sum / ratings.length
}

function getRatingCount(serviceId) {
  const ratings = allRatings.value[serviceId]
  return ratings ? ratings.length : 0
}

function submitRating(serviceId, score) {
  if (!authState.currentUser) return

  const userId = authState.currentUser.id
  if (!allRatings.value[serviceId]) {
    allRatings.value[serviceId] = []
  }

  // Update or add rating
  const existing = allRatings.value[serviceId].findIndex(r => r.userId === userId)
  if (existing >= 0) {
    allRatings.value[serviceId][existing].score = score
  } else {
    allRatings.value[serviceId].push({ userId, score })
  }

  saveRatings(allRatings.value)
  ratingMessage[serviceId] = `Rated ${score}/5 — Thank you!`
  setTimeout(() => { ratingMessage[serviceId] = '' }, 2000)
}
</script>

<style scoped>
.star-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #ddd;
  transition: color 0.15s;
}
.star-btn.text-warning {
  color: #ffc107 !important;
}
</style>
