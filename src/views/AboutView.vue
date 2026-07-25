<template>
  <div class="about-page">
    <!-- Hero -->
    <section class="bg-primary text-white py-5">
      <div class="container text-center">
        <h1 class="display-5 fw-bold">About HealthBridge</h1>
        <p class="lead">Supporting elderly Australians since 2020</p>
      </div>
    </section>

    <!-- Our Mission -->
    <section class="py-5">
      <div class="container">
        <div class="row">
          <div class="col-md-8 mx-auto">
            <h2>Our Mission</h2>
            <p>
              HealthBridge is a health charity dedicated to significantly impacting the community
              by supporting elderly Australians through innovative technology solutions. We believe
              every senior deserves access to quality health information, community connection,
              and supportive services — regardless of their technical ability or background.
            </p>
            <p>
              Our platform bridges the gap between older Australians and the health resources
              they need, providing a user-friendly, accessible, and culturally sensitive digital
              experience.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Our Team -->
    <section class="py-5 bg-light">
      <div class="container">
        <h2 class="text-center mb-4">Our Team</h2>
        <div class="row g-4">
          <div class="col-12 col-sm-6 col-lg-4" v-for="member in team" :key="member.name">
            <div class="card text-center h-100 shadow-sm">
              <div class="card-body">
                <div class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3"
                     style="width: 60px; height: 60px; font-size: 1.5rem;">
                  {{ member.name.charAt(0) }}
                </div>
                <h5 class="card-title">{{ member.name }}</h5>
                <p class="text-muted small">{{ member.role }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Us -->
    <section class="py-5">
      <div class="container">
        <div class="row">
          <div class="col-md-8 mx-auto">
            <h2>Contact Us</h2>
            <div class="row mt-3">
              <div class="col-md-6">
                <p><strong>📧 Email:</strong> info@healthbridge.org.au</p>
                <p><strong>📞 Phone:</strong> 1800 123 456</p>
                <p><strong>📍 Address:</strong> 123 Health St, Melbourne VIC 3000</p>
              </div>
              <div class="col-md-6">
                <p><strong>🕐 Hours:</strong></p>
                <p>Monday – Friday: 9:00 AM – 5:00 PM</p>
                <p>Saturday: 10:00 AM – 2:00 PM</p>
                <p>Sunday: Closed</p>
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

const team = ref([
  { name: 'Dr Sarah Mitchell', role: 'Medical Director' },
  { name: 'James Wong', role: 'Community Outreach Manager' },
  { name: 'Linda Patel', role: 'Senior Care Coordinator' },
  { name: 'Robert Thompson', role: 'Technology Lead' },
  { name: 'Emily Chen', role: 'Health Education Specialist' },
  { name: 'Mark Sullivan', role: 'Volunteer Coordinator' }
])
</script>
