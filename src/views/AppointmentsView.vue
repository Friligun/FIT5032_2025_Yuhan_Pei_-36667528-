<template>
  <div class="container py-4 py-md-5">
    <div class="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
      <div>
        <p class="text-uppercase text-primary small fw-bold mb-1">HealthBridge care plan</p>
        <h1 class="mb-2">Appointments</h1>
        <p class="text-muted mb-0">Book a service and keep upcoming visits in one accessible place.</p>
      </div>
      <span class="badge rounded-pill" :class="healthState.online ? 'text-bg-success' : 'text-bg-warning'">
        {{ healthState.online ? 'Online' : 'Offline mode' }}
      </span>
    </div>

    <div v-if="!user" class="alert alert-info" role="status">
      <router-link to="/login">Log in</router-link> to book and manage appointments.
    </div>

    <div class="row g-4">
      <div class="col-12 col-lg-5">
        <section class="card shadow-sm h-100" aria-labelledby="booking-heading">
          <div class="card-body p-4">
            <h2 id="booking-heading" class="h4">Book a visit</h2>
            <form @submit.prevent="bookAppointment" novalidate>
              <div class="mb-3">
                <label for="appointment-service" class="form-label">Service</label>
                <select id="appointment-service" v-model="form.serviceId" class="form-select" required>
                  <option value="">Choose a service</option>
                  <option v-for="service in services" :key="service.id" :value="service.id">{{ service.name }}</option>
                </select>
              </div>
              <div class="row g-3">
                <div class="col-7">
                  <label for="appointment-date" class="form-label">Date</label>
                  <input id="appointment-date" v-model="form.date" class="form-control" type="date" :min="minDate" required />
                </div>
                <div class="col-5">
                  <label for="appointment-time" class="form-label">Time</label>
                  <select id="appointment-time" v-model="form.time" class="form-select" required>
                    <option value="">Select</option>
                    <option v-for="time in timeSlots" :key="time" :value="time">{{ time }}</option>
                  </select>
                </div>
              </div>
              <div class="mb-3 mt-3">
                <label for="appointment-notes" class="form-label">Notes <span class="text-muted">(optional)</span></label>
                <textarea id="appointment-notes" v-model="form.notes" class="form-control" rows="3" maxlength="300" placeholder="Accessibility or support needs"></textarea>
              </div>
              <button class="btn btn-primary w-100" type="submit" :disabled="!user">Confirm appointment</button>
            </form>
            <div v-if="message" class="alert mt-3 mb-0" :class="success ? 'alert-success' : 'alert-danger'" role="alert">{{ message }}</div>
          </div>
        </section>
      </div>

      <div class="col-12 col-lg-7">
        <section class="card shadow-sm" aria-labelledby="upcoming-heading">
          <div class="card-body p-4">
            <div class="d-flex justify-content-between align-items-center gap-2 mb-3">
              <h2 id="upcoming-heading" class="h4 mb-0">My appointments</h2>
              <button class="btn btn-outline-secondary btn-sm" type="button" @click="exportMine">Export CSV</button>
            </div>
            <div v-if="!currentAppointments.length" class="text-muted py-4 text-center">No appointments yet.</div>
            <div v-else class="appointment-list">
              <article v-for="appointment in sortedAppointments" :key="appointment.id" class="appointment-item border rounded p-3 mb-3">
                <div class="d-flex flex-wrap justify-content-between gap-2">
                  <div>
                    <h3 class="h6 mb-1">{{ appointment.serviceName }}</h3>
                    <p class="mb-1">{{ formatDate(appointment.date) }} at {{ appointment.time }}</p>
                    <p v-if="appointment.notes" class="text-muted small mb-0">{{ appointment.notes }}</p>
                  </div>
                  <div class="text-end">
                    <span class="badge" :class="appointment.status === 'Confirmed' ? 'text-bg-success' : 'text-bg-secondary'">{{ appointment.status }}</span>
                    <button v-if="appointment.status === 'Confirmed'" class="btn btn-link btn-sm d-block ms-auto px-0" type="button" @click="cancel(appointment.id)">Cancel</button>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { authState } from '../stores/auth'
import { cancelAppointment, createAppointment, currentAppointments, exportCsv, healthState, services } from '../stores/healthbridge'
import { sendAppointmentEmail } from '../services/cloud'

const router = useRouter()
const user = computed(() => authState.currentUser)
const form = reactive({ serviceId: '', date: '', time: '', notes: '' })
const message = ref('')
const success = ref(false)
const minDate = new Date().toISOString().slice(0, 10)
const timeSlots = ['09:00', '10:30', '12:00', '13:30', '15:00', '16:30']
const sortedAppointments = computed(() => [...currentAppointments.value].sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`)))

function formatDate(value) {
  return new Intl.DateTimeFormat('en-AU', { dateStyle: 'full' }).format(new Date(`${value}T00:00:00`))
}

async function bookAppointment() {
  message.value = ''
  const result = createAppointment(form)
  success.value = result.success
  message.value = result.success ? 'Appointment confirmed.' : result.message
  if (result.success) {
    await sendAppointmentEmail(result.appointment).catch(() => null)
    Object.assign(form, { serviceId: '', date: '', time: '', notes: '' })
  }
}

function cancel(id) {
  if (cancelAppointment(id)) {
    success.value = true
    message.value = 'Appointment cancelled.'
  }
}

function exportMine() {
  exportCsv('healthbridge-my-appointments.csv', currentAppointments.value.map(({ id, serviceName, date, time, status }) => ({ id, service: serviceName, date, time, status })))
}

if (!user.value && router.currentRoute.value.name === 'Appointments') router.push('/login')
</script>
