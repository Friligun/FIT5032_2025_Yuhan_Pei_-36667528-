<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero-section bg-primary text-white py-4 py-md-5">
      <div class="container text-center px-3">
        <h1 class="display-5 display-md-4 fw-bold">Welcome to HealthBridge</h1>
        <p class="lead mt-3">
          Empowering elderly Australians with accessible health resources,
          community support, and trusted services.
        </p>
        <div class="mt-4 d-flex flex-column flex-sm-row justify-content-center gap-2">
          <router-link class="btn btn-light btn-lg" to="/resources">
            Browse Resources
          </router-link>
          <router-link class="btn btn-outline-light btn-lg" to="/login">
            Join Us
          </router-link>
        </div>
      </div>
    </section>

    <!-- Mission Section -->
    <section class="py-5">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-6">
            <h2>Our Mission</h2>
            <p class="text-muted">
              HealthBridge is a health charity dedicated to improving the well-being
              of older Australians. We provide crucial resources, support, and education
              to help seniors live healthier, more connected lives.
            </p>
            <p class="text-muted">
              Whether you are an elderly individual seeking health information, or a carer
              looking for support — HealthBridge is here for you.
            </p>
          </div>
          <div class="col-md-6 text-center">
            <div class="p-4 bg-light rounded">
              <h3>🩺</h3>
              <p class="fw-bold">Trusted by 10,000+ seniors across Australia</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Overview -->
    <section class="py-5 bg-light">
      <div class="container">
        <h2 class="text-center mb-4">What We Offer</h2>
        <div class="row g-4">
          <div class="col-12 col-sm-6 col-lg-4 col-xxl-3" v-for="service in services" :key="service.title">
            <div class="card h-100 text-center p-3">
              <div class="card-body">
                <h1>{{ service.icon }}</h1>
                <h5 class="card-title">{{ service.title }}</h5>
                <p class="card-text text-muted">{{ service.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const services = ref([
  {
    icon: '📚',
    title: 'Health Resources',
    description: 'Browse articles, guides, and fact sheets tailored for older Australians covering chronic conditions, nutrition, exercise, and mental wellness.'
  },
  {
    icon: '🏥',
    title: 'Service Directory',
    description: 'Find and connect with local health services, GPs, specialists, and community programs near you.'
  },
  {
    icon: '👥',
    title: 'Community Support',
    description: 'Join our community, attend events, and rate services to help others make informed health decisions.'
  },
  {
    icon: '📅',
    title: 'Appointment Booking',
    description: 'Book and manage your healthcare appointments in one convenient place.'
  },
  {
    icon: '🛡️',
    title: 'Carer Support',
    description: 'Resources and tools for carers to manage their loved ones health information and appointments.'
  },
  {
    icon: '📊',
    title: 'Health Tracking',
    description: 'Track your health metrics and get personalised recommendations for a healthier lifestyle.'
  }
])
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%);
}
</style>
