import { computed, reactive } from 'vue'
import { authState } from './auth'

const STORAGE_KEYS = {
  appointments: 'healthbridge_appointments',
  savedResources: 'healthbridge_saved_resources',
  offlineQueue: 'healthbridge_offline_queue'
}

const defaultServices = [
  { id: 1, name: 'Melbourne Community GP', category: 'General practice', address: '123 Health St, Melbourne VIC 3000', lat: -37.8136, lng: 144.9631, phone: '1800 123 456', description: 'Bulk-billed GP consultations and health checks for older Australians.' },
  { id: 2, name: 'Northside Home Nursing', category: 'Home care', address: '45 Sydney Rd, Brunswick VIC 3056', lat: -37.7679, lng: 144.9587, phone: '03 9000 2211', description: 'In-home nursing visits for medication, wound care and wellbeing checks.' },
  { id: 3, name: 'Harbour Mental Wellness Centre', category: 'Mental wellness', address: '8 Darlinghurst Rd, Sydney NSW 2010', lat: -33.8793, lng: 151.2195, phone: '02 9012 8800', description: 'Counselling and social connection programs for seniors and carers.' },
  { id: 4, name: 'West End Physiotherapy', category: 'Physiotherapy', address: '17 Boundary St, West End QLD 4101', lat: -27.4807, lng: 153.0052, phone: '07 3123 4500', description: 'Low-impact movement programs, falls prevention and mobility support.' }
]

function read(key, fallback) {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

const state = reactive({
  appointments: read(STORAGE_KEYS.appointments, []),
  savedResources: read(STORAGE_KEYS.savedResources, []),
  services: defaultServices,
  online: typeof navigator === 'undefined' ? true : navigator.onLine
})

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => { state.online = true })
  window.addEventListener('offline', () => { state.online = false })
}

export const healthState = state
export const services = computed(() => state.services)
export const currentAppointments = computed(() => {
  const userId = authState.currentUser?.id
  return state.appointments.filter(item => item.userId === userId)
})

export function createAppointment({ serviceId, date, time, notes = '' }) {
  const user = authState.currentUser
  if (!user) return { success: false, message: 'Please log in before booking an appointment.' }
  if (!serviceId || !date || !time) return { success: false, message: 'Choose a service, date and time.' }
  const selected = new Date(`${date}T${time}`)
  if (Number.isNaN(selected.getTime()) || selected < new Date()) return { success: false, message: 'Appointments must be booked in the future.' }
  const duplicate = state.appointments.some(item => item.serviceId === Number(serviceId) && item.date === date && item.time === time)
  if (duplicate) return { success: false, message: 'That time is already booked. Please choose another slot.' }
  const appointment = {
    id: `APT-${Date.now()}`,
    userId: user.id,
    userName: user.fullName,
    serviceId: Number(serviceId),
    serviceName: state.services.find(service => service.id === Number(serviceId))?.name || 'Health service',
    date,
    time,
    notes: notes.trim().slice(0, 300),
    status: 'Confirmed',
    createdAt: new Date().toISOString()
  }
  state.appointments.push(appointment)
  write(STORAGE_KEYS.appointments, state.appointments)
  return { success: true, appointment }
}

export function cancelAppointment(id) {
  const index = state.appointments.findIndex(item => item.id === id && item.userId === authState.currentUser?.id)
  if (index < 0) return false
  state.appointments[index].status = 'Cancelled'
  write(STORAGE_KEYS.appointments, state.appointments)
  return true
}

export function getAllAppointments() {
  return state.appointments.map(item => ({ ...item }))
}

export function toggleSavedResource(resourceId) {
  const current = new Set(state.savedResources)
  current.has(resourceId) ? current.delete(resourceId) : current.add(resourceId)
  state.savedResources = [...current]
  write(STORAGE_KEYS.savedResources, state.savedResources)
}

export function isResourceSaved(resourceId) {
  return state.savedResources.includes(resourceId)
}

export function exportCsv(filename, rows) {
  if (!rows.length) return false
  const headers = Object.keys(rows[0])
  const escape = value => `"${String(value ?? '').replace(/"/g, '""')}"`
  const csv = [headers, ...rows.map(row => headers.map(header => escape(row[header])))]
    .map(row => row.join(','))
    .join('\r\n')
  const blob = new Blob([`\ufeff${csv}`], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
  return true
}

export function getDashboardMetrics() {
  const appointments = state.appointments
  return {
    totalAppointments: appointments.length,
    confirmed: appointments.filter(item => item.status === 'Confirmed').length,
    cancelled: appointments.filter(item => item.status === 'Cancelled').length,
    byService: state.services.map(service => ({
      label: service.name,
      value: appointments.filter(item => item.serviceId === service.id).length
    }))
  }
}
