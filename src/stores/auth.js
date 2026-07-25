import { reactive } from 'vue'

// ===== SECURITY: XSS Sanitization =====
export function sanitize(str) {
  if (typeof str !== 'string') return str
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

// ===== SECURITY: Validation Constants =====
const VALIDATION = {
  NAME_MIN: 2,
  NAME_MAX: 50,
  EMAIL_MAX: 100,
  PASSWORD_MIN: 8,
  PASSWORD_MAX: 128,
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000
}

// ===== SECURITY: Password Hashing (SHA-256) =====
async function hashPassword(password) {
  const encoder = new TextEncoder()
  const salt = 'healthbridge_salt_2024_'
  const data = encoder.encode(salt + password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// ===== SECURITY: Input Validation =====
export function validateInput(field, value) {
  if (typeof value !== 'string') return { valid: false, message: 'Invalid input type.' }
  switch (field) {
    case 'fullName': {
      const t = value.trim()
      if (t.length < VALIDATION.NAME_MIN) return { valid: false, message: 'Name must be at least 2 characters.' }
      if (t.length > VALIDATION.NAME_MAX) return { valid: false, message: 'Name cannot exceed 50 characters.' }
      if (!/^[a-zA-Z\s'\-]+$/.test(t)) return { valid: false, message: 'Name contains invalid characters.' }
      return { valid: true }
    }
    case 'email': {
      const t = value.trim()
      if (t.length > VALIDATION.EMAIL_MAX) return { valid: false, message: 'Email cannot exceed 100 characters.' }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)) return { valid: false, message: 'Invalid email address.' }
      return { valid: true }
    }
    case 'password': {
      if (value.length < VALIDATION.PASSWORD_MIN) return { valid: false, message: 'Password must be at least 8 characters.' }
      if (value.length > VALIDATION.PASSWORD_MAX) return { valid: false, message: 'Password cannot exceed 128 characters.' }
      return { valid: true }
    }
    case 'role': {
      if (!['user', 'carer'].includes(value)) return { valid: false, message: 'Invalid role.' }
      return { valid: true }
    }
    default:
      return { valid: true }
  }
}

// ===== SECURITY: Rate Limiting =====
function getLoginAttempts() {
  const stored = localStorage.getItem('healthbridge_login_attempts')
  return stored ? JSON.parse(stored) : { count: 0, lockedUntil: 0 }
}

function saveLoginAttempts(attempts) {
  localStorage.setItem('healthbridge_login_attempts', JSON.stringify(attempts))
}

function recordFailedLogin() {
  const attempts = getLoginAttempts()
  attempts.count++
  if (attempts.count >= VALIDATION.MAX_LOGIN_ATTEMPTS) {
    attempts.lockedUntil = Date.now() + VALIDATION.LOCKOUT_DURATION
  }
  saveLoginAttempts(attempts)
  return attempts
}

function resetLoginAttempts() {
  localStorage.removeItem('healthbridge_login_attempts')
}

function isAccountLocked() {
  const attempts = getLoginAttempts()
  if (attempts.lockedUntil && Date.now() < attempts.lockedUntil) {
    const remaining = Math.ceil((attempts.lockedUntil - Date.now()) / 60000)
    return { locked: true, minutes: remaining }
  }
  if (attempts.lockedUntil && Date.now() >= attempts.lockedUntil) {
    resetLoginAttempts()
  }
  return { locked: false }
}

// ===== SECURITY: Session Token =====
function generateSessionToken() {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('')
}

// ===== Data Layer =====
function loadUsers() {
  const stored = localStorage.getItem('healthbridge_users')
  if (stored) return JSON.parse(stored)
  return null
}

function loadCurrentUser() {
  const stored = localStorage.getItem('healthbridge_current_user')
  if (!stored) return null
  const session = JSON.parse(stored)
  if (!session.sessionToken) return null
  return session
}

const state = reactive({
  users: loadUsers() || [],
  currentUser: loadCurrentUser()
})

// Initialize default admin async
async function initializeDefaults() {
  if (state.users.length === 0) {
    const h = await hashPassword('Admin123!')
    state.users = [{
      id: 1, fullName: 'Admin', email: 'admin@healthbridge.org',
      passwordHash: h, role: 'admin', createdAt: new Date().toISOString()
    }]
    saveUsers()
  }
}
initializeDefaults()

function saveUsers() {
  localStorage.setItem('healthbridge_users', JSON.stringify(state.users))
}

function saveCurrentUser() {
  if (state.currentUser) {
    localStorage.setItem('healthbridge_current_user', JSON.stringify(state.currentUser))
  } else {
    localStorage.removeItem('healthbridge_current_user')
  }
}

// ===== Public API =====
export async function register({ fullName, email, password, role }) {
  const nameCheck = validateInput('fullName', fullName)
  if (!nameCheck.valid) return { success: false, message: nameCheck.message }
  const emailCheck = validateInput('email', email)
  if (!emailCheck.valid) return { success: false, message: emailCheck.message }
  const pwdCheck = validateInput('password', password)
  if (!pwdCheck.valid) return { success: false, message: pwdCheck.message }
  const roleCheck = validateInput('role', role)
  if (!roleCheck.valid) return { success: false, message: roleCheck.message }

  const sanitizedName = sanitize(fullName.trim())
  const sanitizedEmail = sanitize(email.trim().toLowerCase())

  if (state.users.find(u => u.email === sanitizedEmail)) {
    return { success: false, message: 'Email already registered.' }
  }

  const passwordHash = await hashPassword(password)
  state.users.push({
    id: Date.now(),
    fullName: sanitizedName,
    email: sanitizedEmail,
    passwordHash,
    role: role || 'user',
    createdAt: new Date().toISOString()
  })
  saveUsers()
  return { success: true, message: 'Registration successful!' }
}

export async function login(email, password) {
  const lockStatus = isAccountLocked()
  if (lockStatus.locked) {
    return { success: false, message: `Account locked. Try again in ${lockStatus.minutes} minute(s).` }
  }

  const emailCheck = validateInput('email', email)
  if (!emailCheck.valid) return { success: false, message: emailCheck.message }

  const sanitizedEmail = sanitize(email.trim().toLowerCase())
  const hashedPwd = await hashPassword(password)

  let matchedUser = state.users.find(u => u.email === sanitizedEmail && u.passwordHash === hashedPwd)

  // Legacy plain-text migration support
  if (!matchedUser) {
    const legacy = state.users.find(u => u.email === sanitizedEmail && u.password === password)
    if (legacy) {
      legacy.passwordHash = hashedPwd
      delete legacy.password
      saveUsers()
      matchedUser = legacy
    }
  }

  if (!matchedUser) {
    const attempts = recordFailedLogin()
    const remaining = VALIDATION.MAX_LOGIN_ATTEMPTS - attempts.count
    if (remaining > 0) {
      return { success: false, message: `Invalid credentials. ${remaining} attempt(s) remaining.` }
    }
    return { success: false, message: 'Account locked due to too many failed attempts.' }
  }

  resetLoginAttempts()
  state.currentUser = {
    id: matchedUser.id,
    fullName: matchedUser.fullName,
    email: matchedUser.email,
    role: matchedUser.role,
    sessionToken: generateSessionToken(),
    loginAt: new Date().toISOString()
  }
  saveCurrentUser()
  return { success: true, message: 'Login successful!', user: state.currentUser }
}

export function logout() {
  state.currentUser = null
  saveCurrentUser()
}

export function getCurrentUser() { return state.currentUser }
export function isAuthenticated() { return state.currentUser !== null }
export function hasRole(role) { return state.currentUser && state.currentUser.role === role }

export function getAllUsers() {
  return state.users.map(u => ({
    id: u.id, fullName: u.fullName, email: u.email, role: u.role, createdAt: u.createdAt
  }))
}

export { VALIDATION }
export const authState = state
