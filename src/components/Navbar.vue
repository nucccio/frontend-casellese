<!-- In Navbar.vue hinzufügen -->
<template>
  <!-- Innerhalb der Nav-Links -->
  <router-link to="/favoriten" class="nav-link">
    ❤️ Favoriten
    <span v-if="favoriteCount > 0" class="badge bg-danger">
      {{ favoriteCount }}
    </span>
  </router-link>
  
  <router-link to="/einkaufsliste" class="nav-link">
    🛒 Einkaufsliste
    <span v-if="shoppingCount > 0" class="badge bg-danger">
      {{ shoppingCount }}
    </span>
  </router-link>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { useFavoritesStore } from '@/stores/favorites'
import { useShoppingListStore } from '@/stores/shoppingList'

const { isAuthenticated, getAccessTokenSilently } = useAuth0()
const favoritesStore = useFavoritesStore()
const shoppingListStore = useShoppingListStore()

const favoriteCount = computed(() => favoritesStore.favoriteCount)
const shoppingCount = computed(() => shoppingListStore.uncheckedCount)

// Bei Login die Daten laden
watch(isAuthenticated, async (newVal) => {
  if (newVal) {
    await Promise.all([
      favoritesStore.fetchFavoriteIds(getAccessTokenSilently, import.meta.env.VITE_API_BASE_URL),
      shoppingListStore.fetchItems(getAccessTokenSilently, import.meta.env.VITE_API_BASE_URL)
    ])
  } else {
    favoritesStore.clearFavorites()
    shoppingListStore.clearStore()
  }
}, { immediate: true })
</script>
