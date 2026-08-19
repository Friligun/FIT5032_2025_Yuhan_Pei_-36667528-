<template>
  <div class="container py-3 py-md-5">
    <h1 class="mb-2">Admin Dashboard</h1>
    <p class="text-muted mb-4">Manage users and view platform statistics.</p>

    <div class="d-flex flex-wrap justify-content-end gap-2 mb-3">
      <button class="btn btn-outline-primary" type="button" @click="exportUsers">Export users CSV</button>
      <button class="btn btn-outline-primary" type="button" @click="exportAppointments">Export appointments CSV</button>
    </div>

    <!-- Stats Cards -->
    <div class="row g-3 mb-4">
      <div class="col-6 col-sm-6 col-md-3">
        <div class="card bg-primary text-white text-center p-3">
          <h3>{{ totalUsers }}</h3>
          <p class="mb-0">Total Users</p>
        </div>
      </div>
      <div class="col-6 col-sm-6 col-md-3">
        <div class="card bg-info text-white text-center p-3">
          <h3>{{ usersByRole.user }}</h3>
          <p class="mb-0">Elderly Users</p>
        </div>
      </div>
      <div class="col-6 col-sm-6 col-md-3">
        <div class="card bg-success text-white text-center p-3">
          <h3>{{ usersByRole.carer }}</h3>
          <p class="mb-0">Carers</p>
        </div>
      </div>
      <div class="col-6 col-sm-6 col-md-3">
        <div class="card bg-danger text-white text-center p-3">
          <h3>{{ usersByRole.admin }}</h3>
          <p class="mb-0">Admins</p>
        </div>
      </div>
    </div>

    <!-- User Table -->
    <div class="card shadow-sm">
      <div class="card-header">
        <h5 class="mb-0">User Management</h5>
      </div>
      <div class="card-body">
        <DataTable :value="users" tableStyle="min-width: 50rem"
                   stripedRows paginator :rows="10">
          <Column field="id" header="ID" sortable></Column>
          <Column field="fullName" header="Full Name" sortable></Column>
          <Column field="email" header="Email" sortable></Column>
          <Column field="role" header="Role" sortable>
            <template #body="slotProps">
              <span class="badge" :class="getRoleBadge(slotProps.data.role)">
                {{ slotProps.data.role }}
              </span>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>

    <div class="card shadow-sm mt-4">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h2 class="h5 mb-0">Appointment management</h2>
        <span class="badge text-bg-primary">{{ appointmentRows.length }} records</span>
      </div>
      <div class="card-body">
        <DataTable :value="appointmentRows" tableStyle="min-width: 50rem" stripedRows paginator :rows="10" removableSort>
          <Column field="id" header="Reference" sortable></Column>
          <Column field="userName" header="User" sortable></Column>
          <Column field="serviceName" header="Service" sortable></Column>
          <Column field="date" header="Date" sortable></Column>
          <Column field="time" header="Time" sortable></Column>
          <Column field="status" header="Status" sortable></Column>
        </DataTable>
      </div>
    </div>

    <div class="card shadow-sm mt-4">
      <div class="card-body">
        <h2 class="h5">Appointment activity</h2>
        <p class="small text-muted">Live counts from the local data store. The same metric source can be connected to Alibaba Cloud data storage.</p>
        <div v-for="item in appointmentMetrics.byService" :key="item.label" class="mb-3">
          <div class="d-flex justify-content-between small"><span>{{ item.label }}</span><strong>{{ item.value }}</strong></div>
          <div class="progress" role="progressbar" :aria-label="`${item.label} appointments`" :aria-valuenow="item.value" aria-valuemin="0" :aria-valuemax="maxMetric">
            <div class="progress-bar" :style="{ width: `${metricWidth(item.value)}%` }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getAllUsers } from '../stores/auth'
import { exportCsv, getAllAppointments, getDashboardMetrics } from '../stores/healthbridge'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const users = computed(() => getAllUsers())

const totalUsers = computed(() => users.value.length)

const usersByRole = computed(() => {
  const counts = { user: 0, carer: 0, admin: 0 }
  users.value.forEach(u => {
    if (counts[u.role] !== undefined) counts[u.role]++
  })
  return counts
})

const appointmentRows = computed(() => getAllAppointments())
const appointmentMetrics = computed(() => getDashboardMetrics())
const maxMetric = computed(() => Math.max(1, ...appointmentMetrics.value.byService.map(item => item.value)))
function metricWidth(value) { return Math.round((value / maxMetric.value) * 100) }

function exportUsers() {
  exportCsv('healthbridge-users.csv', users.value.map(({ id, fullName, email, role, createdAt }) => ({ id, fullName, email, role, createdAt })))
}

function exportAppointments() {
  exportCsv('healthbridge-appointments.csv', appointmentRows.value.map(({ id, userName, serviceName, date, time, status }) => ({ id, userName, serviceName, date, time, status })))
}

function getRoleBadge(role) {
  const classes = { user: 'bg-info', carer: 'bg-success', admin: 'bg-danger' }
  return classes[role] || 'bg-secondary'
}
</script>
