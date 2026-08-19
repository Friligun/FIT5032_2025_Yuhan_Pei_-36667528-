<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary sticky-top">
    <div class="container">
      <router-link class="navbar-brand fw-bold" to="/">
        🏥 HealthBridge
      </router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
              data-bs-target="#navbarMain" aria-controls="navbarMain"
              aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarMain">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/resources">Health Resources</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/services">Find Services</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/appointments">Appointments</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/community/rate">Rate a Service</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/about">About Us</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/assistant">Resource Assistant</router-link>
          </li>
          <li class="nav-item" v-if="user && user.role === 'admin'">
            <router-link class="nav-link" to="/admin">Admin Dashboard</router-link>
          </li>
        </ul>
        <div class="d-flex align-items-center">
          <template v-if="user">
            <router-link class="btn btn-outline-light btn-sm me-2" to="/account">
              {{ user.fullName }}
            </router-link>
            <button class="btn btn-light btn-sm" @click="handleLogout">Logout</button>
          </template>
          <template v-else>
            <router-link class="btn btn-light btn-sm" to="/login">Login / Register</router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { authState, logout } from '../stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = computed(() => authState.currentUser)

function handleLogout() {
  logout()
  router.push('/')
}
</script>
