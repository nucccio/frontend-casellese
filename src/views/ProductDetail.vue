<!-- Ergänzungen für ProductDetail.vue -->
<script setup>
// Neue Imports hinzufügen
import FavoriteButton from '@/components/FavoriteButton.vue'
import ShareButtons from '@/components/ShareButtons.vue'
import AddToShoppingListButton from '@/components/AddToShoppingListButton.vue'

// Computed für Share-URL
const shareUrl = computed(() => {
  return `${window.location.origin}/product/${productId}`
})
</script>

<template>
  <!-- Nach dem Preis-Bereich einfügen: -->
  
  <!-- Action Buttons Row -->
  <div class="action-buttons mt-4 d-flex flex-wrap gap-3">
    <!-- Favoriten Button -->
    <FavoriteButton 
      v-if="product" 
      :product-id="product.id" 
      show-text 
    />
    
    <!-- Einkaufsliste Button -->
    <AddToShoppingListButton 
      v-if="product?.ingredients" 
      :product="product" 
    />
  </div>

  <!-- Share Buttons -->
  <div class="mt-4">
    <ShareButtons
      v-if="product"
      :title="product.title"
      :description="product.description"
      :url="shareUrl"
      :image-url="product.imageUrl"
    />
  </div>
</template>