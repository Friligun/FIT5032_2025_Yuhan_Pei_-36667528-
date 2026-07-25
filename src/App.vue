<script setup>
import NavBar from './components/NavBar.vue'
import FooterBar from './components/FooterBar.vue'
</script>

<template>
  <div id="app-wrapper">
    <NavBar />
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
</style>
