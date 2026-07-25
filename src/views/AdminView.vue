<template>
  <div class="container py-3 py-md-5">
    <h1 class="mb-2">Admin Dashboard</h1>
    <p class="text-muted mb-4">Manage users and view platform statistics.</p>

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
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getAllUsers } from '../stores/auth'
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

function getRoleBadge(role) {
  const classes = { user: 'bg-info', carer: 'bg-success', admin: 'bg-danger' }
  return classes[role] || 'bg-secondary'
}
</script>
