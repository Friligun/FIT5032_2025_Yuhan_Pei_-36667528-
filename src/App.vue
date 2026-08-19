<script setup>
import { computed } from 'vue'
import NavBar from './components/NavBar.vue'
import FooterBar from './components/FooterBar.vue'
import { healthState } from './stores/healthbridge'
const online = computed(() => healthState.online)
</script>

<template>
  <div id="app-wrapper">
    <NavBar />
    <div v-if="!online" class="offline-banner" role="status">Offline mode: cached HealthBridge features remain available.</div>
    <main class="flex-grow-1">
      <router-view />
    </main>
    <FooterBar />
  </div>
</template>

<style>
#app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.flex-grow-1 {
  flex-grow: 1;
}
.offline-banner { background: #fff3cd; color: #664d03; text-align: center; padding: .5rem 1rem; font-size: .9rem; }
:focus-visible { outline: 3px solid #ffbf47; outline-offset: 2px; }
</style>
