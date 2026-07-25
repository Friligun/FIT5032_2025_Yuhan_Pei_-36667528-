<template>
  <footer class="bg-dark text-light py-4 mt-5">
    <div class="container">
      <div class="row">
        <div class="col-md-4 mb-3">
          <h5>🏥 HealthBridge</h5>
          <p class="text-muted">Supporting Elderly Australians with accessible health resources and community services.</p>
        </div>
        <div class="col-md-4 mb-3">
          <h6>Quick Links</h6>
          <ul class="list-unstyled">
            <li><router-link class="text-muted text-decoration-none" to="/">Home</router-link></li>
            <li><router-link class="text-muted text-decoration-none" to="/resources">Health Resources</router-link></li>
            <li><router-link class="text-muted text-decoration-none" to="/about">About Us</router-link></li>
            <li><router-link class="text-muted text-decoration-none" to="/login">Login</router-link></li>
          </ul>
        </div>
        <div class="col-md-4 mb-3">
          <h6>Contact</h6>
          <p class="text-muted mb-1">📧 info@healthbridge.org.au</p>
          <p class="text-muted mb-1">📞 1800 123 456</p>
          <p class="text-muted">📍 Melbourne, Victoria, Australia</p>
        </div>
      </div>
      <hr class="border-secondary" />
      <div class="row">
        <div class="col-md-6">
          <p class="text-muted mb-0">&copy; 2026 HealthBridge. All rights reserved.</p>
        </div>
        <div class="col-md-6 text-md-end">
          <a href="#" class="text-muted text-decoration-none me-3">Privacy Policy</a>
          <a href="#" class="text-muted text-decoration-none me-3">Terms of Use</a>
          <a href="#" class="text-muted text-decoration-none">Accessibility</a>
        </div>
      </div>
    </div>
  </footer>
</template>
