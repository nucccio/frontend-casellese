<script setup>
import Footer from './components/Footer.vue';
import Navbar from './components/Navbar.vue';
import SpecialBanner from './components/SpecialBanner.vue';
</script>

<template>
  <!-- Special Banner -->
  <SpecialBanner text="Sehen Sie unsere neuen Rezepte an ->" />

  <!-- Navbar -->
  <Navbar />

  <!-- Main Content -->
  <router-view></router-view>

  <!-- Footer -->
  <Footer />
</template>

<style scoped>

</style>

<!-- Iteration 7 - Pinia State Management -->
