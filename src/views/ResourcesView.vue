<template>
  <div class="container py-5">
    <h1 class="text-center mb-2">Health Resources</h1>
    <p class="text-center text-muted mb-4">
      Browse articles, videos, and fact sheets tailored for older Australians
    </p>

    <!-- Filters -->
    <div class="row g-3 mb-4">
      <div class="col-12 col-sm-6 col-md-3">
        <select class="form-select" v-model="selectedCategory" aria-label="Filter by category">
          <option value="">All Categories</option>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </div>
      <div class="col-12 col-sm-6 col-md-7">
        <input type="text" class="form-control" v-model="searchQuery"
               placeholder="Search resources..." aria-label="Search resources" />
      </div>
      <div class="col-12 col-sm-12 col-md-2">
        <button class="btn btn-outline-secondary w-100" @click="resetFilters">Reset</button>
      </div>
    </div>

    <p class="text-muted small">
      * Cards loaded dynamically from JSON (BR B.2)
    </p>

    <!-- Resource Cards -->
    <div class="row g-4">
      <div class="col-12 col-sm-6 col-lg-4 col-xxl-3" v-for="resource in paginatedResources" :key="resource.id">
        <div class="card h-100 shadow-sm">
          <img :src="resource.image" class="card-img-top" :alt="resource.title" />
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ resource.title }}</h5>
            <span class="badge bg-secondary mb-2 align-self-start">{{ resource.category }}</span>
            <p class="card-text text-muted flex-grow-1">{{ resource.description }}</p>
            <div class="d-flex gap-2 flex-wrap">
              <button v-if="resource.type === 'factsheet'" class="btn btn-outline-primary btn-sm" type="button" @click="downloadResource(resource)">Download PDF</button>
              <button v-else class="btn btn-primary btn-sm" type="button" @click="openResource(resource)">Read more</button>
              <button class="btn btn-outline-secondary btn-sm" type="button" @click="saveResource(resource.id)">{{ isResourceSaved(resource.id) ? 'Saved' : 'Save' }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredResources.length === 0" class="text-center py-5">
      <p class="text-muted">No resources found matching your criteria.</p>
    </div>

    <!-- Pagination -->
    <nav v-if="totalPages > 1" class="mt-4" aria-label="Resource pagination">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link" @click="currentPage--">&laquo;</button>
        </li>
        <li class="page-item" v-for="page in totalPages" :key="page"
            :class="{ active: currentPage === page }">
          <button class="page-link" @click="currentPage = page">{{ page }}</button>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="page-link" @click="currentPage++">&raquo;</button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import resourcesData from '../assets/json/resources.json'
import { isResourceSaved, toggleSavedResource } from '../stores/healthbridge'

const searchQuery = ref('')
const selectedCategory = ref('')
const currentPage = ref(1)
const perPage = 6

// Get unique categories
const categories = computed(() => {
  return [...new Set(resourcesData.map(r => r.category))]
})

// Filter resources by category and search
const filteredResources = computed(() => {
  let result = resourcesData

  if (selectedCategory.value) {
    result = result.filter(r => r.category === selectedCategory.value)
  }

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.trim().toLowerCase()
    result = result.filter(r =>
      r.title.toLowerCase().includes(query) ||
      r.description.toLowerCase().includes(query) ||
      r.category.toLowerCase().includes(query)
    )
  }

  return result
})

// Pagination
const totalPages = computed(() => Math.ceil(filteredResources.value.length / perPage))

const paginatedResources = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredResources.value.slice(start, start + perPage)
})

function resetFilters() {
  searchQuery.value = ''
  selectedCategory.value = ''
  currentPage.value = 1
}

function saveResource(id) { toggleSavedResource(id) }
function openResource(resource) { window.alert(`${resource.title}\n\n${resource.description}`) }
function downloadResource(resource) {
  const blob = new Blob([`${resource.title}\n\n${resource.description}`], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${resource.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.pdf`
  link.click()
  URL.revokeObjectURL(url)
}
</script>
