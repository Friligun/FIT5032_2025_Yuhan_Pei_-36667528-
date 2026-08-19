<template>
  <div class="container py-3 py-md-5">
    <h1 class="mb-4">My Account</h1>

    <div class="row g-4">
      <!-- Profile Card -->
      <div class="col-12 col-md-4">
        <div class="card shadow-sm">
          <div class="card-body text-center">
            <div class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3"
                 style="width: 80px; height: 80px; font-size: 2rem;">
              {{ user?.fullName?.charAt(0).toUpperCase() }}
            </div>
            <h5>{{ user?.fullName }}</h5>
            <p class="text-muted">{{ user?.email }}</p>
            <span class="badge" :class="roleBadgeClass">{{ roleLabel }}</span>
          </div>
        </div>
      </div>

      <!-- Content based on role -->
      <div class="col-12 col-md-8">
        <!-- User (Elderly) View -->
        <div v-if="user?.role === 'user'" class="card shadow-sm">
          <div class="card-body">
            <h4>My Health Profile</h4>
            <p class="text-muted">Track your health information and saved resources.</p>
            <hr />
            <h6>Saved Resources</h6>
            <p class="text-muted small" v-if="!savedResources.length">You haven't saved any resources yet. Browse our <router-link to="/resources">Health Resources</router-link> to get started.</p>
            <ul v-else class="small ps-3"><li v-for="resource in savedResources" :key="resource.id">{{ resource.title }}</li></ul>
            <hr />
            <h6>My Appointments</h6>
            <p class="text-muted small" v-if="!currentAppointments.length">No upcoming appointments.</p>
            <ul v-else class="small ps-3"><li v-for="appointment in currentAppointments" :key="appointment.id">{{ appointment.serviceName }} - {{ appointment.date }} {{ appointment.time }}</li></ul>
          </div>
        </div>

        <!-- Carer View -->
        <div v-if="user?.role === 'carer'" class="card shadow-sm">
          <div class="card-body">
            <h4>Carer Dashboard</h4>
            <p class="text-muted">Manage your linked elderly person's profile and appointments.</p>
            <hr />
            <h6>Linked Person</h6>
            <p class="text-muted small">No linked person yet. You can add the elderly person you care for here.</p>
            <hr />
            <h6>Upcoming Appointments</h6>
            <p class="text-muted small">No upcoming appointments for your linked person.</p>
          </div>
        </div>

        <!-- Admin View (redirect note) -->
        <div v-if="user?.role === 'admin'" class="card shadow-sm">
          <div class="card-body">
            <h4>Administrator Account</h4>
            <p class="text-muted">You have full administrative access.</p>
            <router-link class="btn btn-primary" to="/admin">Go to Admin Dashboard</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { authState } from '../stores/auth'
import { currentAppointments, healthState } from '../stores/healthbridge'
import resourcesData from '../assets/json/resources.json'

const user = computed(() => authState.currentUser)

const roleLabel = computed(() => {
  const roles = { user: 'Elderly User', carer: 'Carer', admin: 'Administrator' }
  return roles[user.value?.role] || 'User'
})

const roleBadgeClass = computed(() => {
  const classes = { user: 'bg-info', carer: 'bg-success', admin: 'bg-danger' }
  return classes[user.value?.role] || 'bg-secondary'
})
const savedResources = computed(() => resourcesData.filter(resource => healthState.savedResources.includes(resource.id)))
</script>
