<template>
  <div class="container py-3 py-md-5">
    <div class="row g-4">
      <!-- Login Panel -->
      <div class="col-12 col-lg-6">
        <div class="card shadow-sm">
          <div class="card-body p-4">
            <ul class="nav nav-tabs mb-4">
              <li class="nav-item">
                <button class="nav-link active" disabled>Login</button>
              </li>
            </ul>
            <h3 class="mb-3">Login</h3>
            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label for="loginEmail" class="form-label">Email Address *</label>
                <input type="email" class="form-control" id="loginEmail"
                       v-model="loginForm.email"
                       @blur="validateLoginEmail(true)"
                       @input="validateLoginEmail(false)"
                       maxlength="100" autocomplete="email"
                       placeholder="e.g. margaret@email.com" />
                <div v-if="loginErrors.email" class="text-danger small mt-1">
                  {{ loginErrors.email }}
                </div>
              </div>
              <div class="mb-3">
                <label for="loginPassword" class="form-label">Password *</label>
                <div class="input-group">
                  <input :type="showLoginPwd ? 'text' : 'password'" class="form-control"
                         id="loginPassword" v-model="loginForm.password"
                         @blur="validateLoginPassword(true)"
                         @input="validateLoginPassword(false)"
                         maxlength="128" autocomplete="current-password" />
                  <button class="btn btn-outline-secondary" type="button"
                          @click="showLoginPwd = !showLoginPwd">
                    {{ showLoginPwd ? 'Hide' : 'Show' }}
                  </button>
                </div>
                <div v-if="loginErrors.password" class="text-danger small mt-1">
                  {{ loginErrors.password }}
                </div>
                <div class="form-text">Password must be at least 8 characters (BR B.1)</div>
              </div>
              <div class="mb-3 form-check">
                <input type="checkbox" class="form-check-input" id="rememberMe"
                       v-model="loginForm.remember" />
                <label class="form-check-label" for="rememberMe">Remember me</label>
              </div>
              <button type="submit" class="btn btn-dark w-100 py-2">Login</button>
              <div v-if="loginMessage" class="mt-3 alert"
                   :class="loginSuccess ? 'alert-success' : 'alert-danger'">
                {{ loginMessage }}
              </div>
            </form>
            <p class="text-center mt-3 text-muted small">
              Role-based access (BR C.2): User / Carer / Admin — different views after login
            </p>
          </div>
        </div>
      </div>

      <!-- Register Panel -->
      <div class="col-12 col-lg-6">
        <div class="card shadow-sm">
          <div class="card-body p-4">
            <ul class="nav nav-tabs mb-4">
              <li class="nav-item">
                <button class="nav-link active" disabled>Register</button>
              </li>
            </ul>
            <h3 class="mb-3">Create Account</h3>
            <form @submit.prevent="handleRegister">
              <div class="mb-3">
                <label for="regName" class="form-label">Full Name *</label>
                <input type="text" class="form-control" id="regName"
                       v-model="regForm.fullName"
                       @blur="validateRegName(true)"
                       @input="validateRegName(false)"
                       maxlength="50" autocomplete="name"
                       placeholder="e.g. Margaret Thompson" />
                <div v-if="regErrors.fullName" class="text-danger small mt-1">
                  {{ regErrors.fullName }}
                </div>
              </div>
              <div class="mb-3">
                <label for="regEmail" class="form-label">Email Address *</label>
                <input type="email" class="form-control" id="regEmail"
                       v-model="regForm.email"
                       @blur="validateRegEmail(true)"
                       @input="validateRegEmail(false)"
                       maxlength="100" autocomplete="email"
                       placeholder="e.g. margaret@email.com" />
                <div v-if="regErrors.email" class="text-danger small mt-1">
                  {{ regErrors.email }}
                </div>
              </div>
              <div class="mb-3">
                <label for="regPassword" class="form-label">Password *</label>
                <input type="password" class="form-control" id="regPassword"
                       v-model="regForm.password"
                       @blur="validateRegPassword(true)"
                       @input="validateRegPassword(false)"
                       maxlength="128" autocomplete="new-password"
                       placeholder="Min. 8 characters" />
                <div v-if="regErrors.password" class="text-danger small mt-1">
                  {{ regErrors.password }}
                </div>
                <div v-if="regForm.password && !regErrors.password" class="small mt-1"
                     :class="passwordStrengthClass">
                  {{ passwordStrengthText }}
                </div>
              </div>
              <div class="mb-3">
                <label for="regConfirm" class="form-label">Confirm Password *</label>
                <input type="password" class="form-control" id="regConfirm"
                       v-model="regForm.confirmPassword"
                       @blur="validateRegConfirm(true)"
                       @input="validateRegConfirm(false)"
                       maxlength="128" autocomplete="new-password"
                       placeholder="Re-enter password" />
                <div v-if="regErrors.confirmPassword" class="text-danger small mt-1">
                  {{ regErrors.confirmPassword }}
                </div>
              </div>
              <div class="mb-3">
                <label for="regRole" class="form-label">I am registering as: * (BR C.2)</label>
                <select class="form-select" id="regRole" v-model="regForm.role"
                        @blur="validateRegRole(true)">
                  <option value="">Select role</option>
                  <option value="user">User (Elderly individual)</option>
                  <option value="carer">Carer — manage a linked elderly person's profile</option>
                </select>
                <div v-if="regErrors.role" class="text-danger small mt-1">
                  {{ regErrors.role }}
                </div>
              </div>
              <div class="mb-3 form-check">
                <input type="checkbox" class="form-check-input" id="terms"
                       v-model="regForm.terms" />
                <label class="form-check-label" for="terms">
                  I agree to the Terms of Use and Privacy Policy
                </label>
                <div v-if="regErrors.terms" class="text-danger small mt-1">
                  {{ regErrors.terms }}
                </div>
              </div>
              <button type="submit" class="btn btn-dark w-100 py-2">Create Account</button>
              <div v-if="regMessage" class="mt-3 alert"
                   :class="regSuccess ? 'alert-success' : 'alert-danger'">
                {{ regMessage }}
              </div>
            </form>
            <p class="text-center mt-3 text-muted small">
              Already have an account?
              <a href="#" @click.prevent="scrollToLogin">Login here</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { login, register } from '../stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()

// --- Login ---
const loginForm = ref({ email: '', password: '', remember: false })
const loginErrors = ref({ email: null, password: null })
const loginMessage = ref('')
const loginSuccess = ref(false)
const showLoginPwd = ref(false)

function validateLoginEmail(blur) {
  const email = loginForm.value.email.trim()
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email) {
    if (blur) loginErrors.value.email = 'Email is required.'
  } else if (!emailRegex.test(email)) {
    if (blur) loginErrors.value.email = 'Please enter a valid email address.'
  } else {
    loginErrors.value.email = null
  }
}

function validateLoginPassword(blur) {
  if (!loginForm.value.password) {
    if (blur) loginErrors.value.password = 'Password is required.'
  } else if (loginForm.value.password.length < 8) {
    if (blur) loginErrors.value.password = 'Password must be at least 8 characters.'
  } else {
    loginErrors.value.password = null
  }
}

async function handleLogin() {
  validateLoginEmail(true)
  validateLoginPassword(true)
  if (loginErrors.value.email || loginErrors.value.password) return

  const result = await login(loginForm.value.email, loginForm.value.password)
  loginMessage.value = result.message
  loginSuccess.value = result.success
  if (result.success) {
    setTimeout(() => router.push('/'), 500)
  }
}

// --- Register ---
const regForm = ref({
  fullName: '', email: '', password: '', confirmPassword: '', role: '', terms: false
})
const regErrors = ref({
  fullName: null, email: null, password: null, confirmPassword: null, role: null, terms: null
})
const regMessage = ref('')
const regSuccess = ref(false)

function validateRegName(blur) {
  const name = regForm.value.fullName.trim()
  if (!name) {
    if (blur) regErrors.value.fullName = 'Full name is required.'
  } else if (name.length < 2) {
    if (blur) regErrors.value.fullName = 'Name must be at least 2 characters.'
  } else if (!/^[a-zA-Z\s'\-]+$/.test(name)) {
    regErrors.value.fullName = 'Name contains invalid characters (letters, spaces, hyphens only).'
  } else {
    regErrors.value.fullName = null
  }
}

function validateRegEmail(blur) {
  const email = regForm.value.email.trim()
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email) {
    if (blur) regErrors.value.email = 'Email is required.'
  } else if (!emailRegex.test(email)) {
    if (blur) regErrors.value.email = 'Please enter a valid email address.'
  } else {
    regErrors.value.email = null
  }
}

function validateRegPassword(blur) {
  const pwd = regForm.value.password
  if (!pwd) {
    if (blur) regErrors.value.password = 'Password is required.'
  } else if (pwd.length < 8) {
    if (blur) regErrors.value.password = 'Password must be at least 8 characters.'
  } else {
    regErrors.value.password = null
  }
  // Also re-validate confirm if it has value
  if (regForm.value.confirmPassword) validateRegConfirm(false)
}

function validateRegConfirm(blur) {
  if (!regForm.value.confirmPassword) {
    if (blur) regErrors.value.confirmPassword = 'Please confirm your password.'
  } else if (regForm.value.confirmPassword !== regForm.value.password) {
    if (blur) regErrors.value.confirmPassword = 'Passwords do not match.'
  } else {
    regErrors.value.confirmPassword = null
  }
}

function validateRegRole(blur) {
  if (!regForm.value.role) {
    if (blur) regErrors.value.role = 'Please select a role.'
  } else {
    regErrors.value.role = null
  }
}

const passwordStrengthText = computed(() => {
  const pwd = regForm.value.password
  if (pwd.length < 8) return ''
  const hasUpper = /[A-Z]/.test(pwd)
  const hasLower = /[a-z]/.test(pwd)
  const hasNum = /\d/.test(pwd)
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
  const score = [hasUpper, hasLower, hasNum, hasSpecial].filter(Boolean).length
  if (score <= 1) return 'Weak strength'
  if (score <= 2) return 'Medium strength'
  if (score <= 3) return 'Strong strength'
  return 'Very strong'
})

const passwordStrengthClass = computed(() => {
  const text = passwordStrengthText.value
  if (text.includes('Weak')) return 'text-danger'
  if (text.includes('Medium')) return 'text-warning'
  return 'text-success'
})

async function handleRegister() {
  validateRegName(true)
  validateRegEmail(true)
  validateRegPassword(true)
  validateRegConfirm(true)
  validateRegRole(true)

  if (!regForm.value.terms) {
    regErrors.value.terms = 'You must agree to the Terms of Use.'
  } else {
    regErrors.value.terms = null
  }

  const hasErrors = Object.values(regErrors.value).some(e => e !== null)
  if (hasErrors) return

  const result = await register({
    fullName: regForm.value.fullName,
    email: regForm.value.email,
    password: regForm.value.password,
    role: regForm.value.role
  })

  regMessage.value = result.message
  regSuccess.value = result.success
  if (result.success) {
    regForm.value = { fullName: '', email: '', password: '', confirmPassword: '', role: '', terms: false }
  }
}

function scrollToLogin() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>
