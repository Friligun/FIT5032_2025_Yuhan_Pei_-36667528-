<!-- JSONLab.vue -->
<template>
  <div class="json-lab">
    <h1>🗄️ JSON Data & Vue Directives Lab</h1>

    <section class="lab-section">
      <h2>📚 Working with JSON Arrays</h2>
      <p>Our <code>authors.json</code> contains an array of author objects.</p>

      <h3>Iterating through Arrays</h3>
      <!-- Activity 6: Render a list containing author names and their birth years. -->
      <p class="activity-label">Activity 6: Render a list containing author names and their birth years</p>
      <ul>
        <li v-for="author in authors" :key="author.id" :class="{ highlight: author.name === 'George Orwell' }">
          {{ author.name }} ({{ author.birthYear }})
        </li>
      </ul>

      <h3>Filtering Arrays</h3>
      <!-- Activity 7: Render a list containing authors born after 1850. -->
      <p class="activity-label">Activity 7: Render a list containing authors born after 1850</p>
      <p>Authors born after 1850:</p>
      <ul>
        <li v-for="author in modernAuthors" :key="author.id" :class="{ highlight: author.name === 'George Orwell' }">
          {{ author.name }} ({{ author.birthYear }})
        </li>
      </ul>

      <h3>Mapping Arrays</h3>
      <!-- Activity 8: Render a list of all famous works. -->
      <p class="activity-label">Activity 8: Render a list of all famous works</p>
      <p>Famous works:</p>
      <ul>
        <li v-for="work in allFamousWorks" :key="work">
          {{ work }}
        </li>
      </ul>

      <h3>Finding in Arrays</h3>
      <p class="activity-label">Activity 4 & 5: Find author by name / by ID</p>
      <p>Finding by property: {{ orwell?.name }}</p>

      <h3>Nested Arrays/Objects</h3>
      <!-- Activity 9: Render a list of Austen's works. -->
      <p class="activity-label">Activity 9: Render a list of Austen's works</p>
      <p>{{ austen?.name }}'s works:</p>
      <ul>
        <li v-for="work in austen?.famousWorks" :key="work.title">
          {{ work.title }} ({{ work.year }})
        </li>
      </ul>
    </section>

    <section class="lab-section">
      <h2>🏢 Working with JSON Objects</h2>
      <p>Our <code>bookstores.json</code> is a JSON object.</p>

      <h3>Accessing Properties</h3>
      <p class="activity-label">Activity 9 & 10: Accessing object properties</p>
      <p>
        Company: {{ bookstores.name }}
      </p>

      <p>
        Total Stores: {{ bookstores.totalStores }}
      </p>

      <h3>Iterating Object Properties</h3>
      <p class="activity-label">Activity 10: Iterate through the storeTypes object</p>
      <p>Store Types:</p>
      <ul>
        <li v-for="(count, type) in bookstores.storeTypes" :key="type">
          {{ type }}: {{ count }}
        </li>
      </ul>

      <h3>Nested Objects</h3>
      <p class="activity-label">Activity 11: Iterate through the openingHours object</p>
      <p>Opening Hours:</p>
      <ul>
        <li v-for="(hours, day) in bookstores.openingHours" :key="day">
          {{ day }}: {{ hours.open }} - {{ hours.close }}
        </li>
      </ul>

      <h3>Working with Arrays in Objects</h3>
      <p class="activity-label">Activity 12: Get top sellers and countries</p>
      <p>We operate in: {{ bookstores.countries.join(", ") }}</p>
      <p>Our #1 seller: {{ bookstores.topSellers[0] }}</p>
    </section>

    <section class="lab-section">
      <h2>v-if & v-else</h2>
      <p>Toggle visibility based on a condition.</p>
      <!-- Activity 13: Toggle the message visibility when the button is clicked. -->
      <p class="activity-label">Activity 13: Toggle the message visibility when the button is clicked</p>
      <button @click="showMessage = !showMessage">Toggle Message</button>
      <p v-if="showMessage" class="message success">✨ You're a Vue superstar! ✨</p>
      <p v-else class="message">Click the button to see a message.</p>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"

// Activity 1: Import JSON files (authors.json and bookstores.json)
import authors from "../assets/json/authors.json"
import bookstores from "../assets/json/bookstores.json"

const showMessage = ref(false)

// Activity 2: Get authors born after 1850
const modernAuthors = computed(() => {
  return authors.filter(author => author.birthYear > 1850)
})

// Activity 3: Get all famous works
const allFamousWorks = computed(() =>
  authors.flatMap((author) => author.famousWorks.map((work) => work.title))
)

// Activity 4: Find author by name
const orwell = computed(() => {
  return authors.find(author => author.name === "George Orwell")
})

// Activity 5: Find author by ID
const austen = computed(() => {
  return authors.find(author => author.id === 1)
})
</script>

<style scoped>
.json-lab {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  max-width: 80vw;
  margin: 0 auto;
  padding: 20px;
  background-color: #f4f4f4;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1,
h2 {
  color: #333;
}
h1 {
  text-align: center;
}

.lab-section {
  background-color: white;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.message {
  padding: 10px;
  border-radius: 5px;
  margin-top: 10px;
}

.success {
  background-color: #e7faf3;
  color: #42b883;
  border: 1px solid #42b883;
}

.highlight {
  background-color: #42b883;
  color: white;
  font-weight: bold;
}

.activity-label {
  font-size: 0.85rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 6px;
}

code {
  background-color: #e0e0e0;
  padding: 2px 5px;
  border-radius: 4px;
  font-family: "Courier New", Courier, monospace;
}

ul {
  list-style-type: none;
  padding: 0;
}
li {
  background-color: #f0f0f0;
  padding: 10px;
  margin: 5px 0;
  border-radius: 5px;
}
</style>
