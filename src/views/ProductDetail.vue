<!-- src/components/AddToShoppingListButton.vue -->
<script setup>
import { ref, computed } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { useShoppingListStore } from '@/stores/shoppingList'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const { isAuthenticated, getAccessTokenSilently, loginWithRedirect } = useAuth0()
const shoppingListStore = useShoppingListStore()

const showModal = ref(false)
const selectedIngredients = ref([])
const isAdding = ref(false)
const successMessage = ref('')

// Zutaten aus dem Product.ingredients String parsen
const ingredientsList = computed(() => {
  if (!props.product?.ingredients) return []
  
  // Versuche verschiedene Trennzeichen
  let ingredients = props.product.ingredients
    .split(/[,;\n]+/)
    .map(i => i.trim())
    .filter(i => i.length > 0)
  
  return ingredients
})

function openModal() {
  if (!isAuthenticated.value) {
    loginWithRedirect({
      appState: { targetUrl: window.location.pathname }
    })
    return
  }
  
  // Alle Zutaten vorauswählen
  selectedIngredients.value = [...ingredientsList.value]
  successMessage.value = ''
  showModal.value = true
}

function toggleIngredient(ingredient) {
  const index = selectedIngredients.value.indexOf(ingredient)
  if (index === -1) {
    selectedIngredients.value.push(ingredient)
  } else {
    selectedIngredients.value.splice(index, 1)
  }
}

function selectAll() {
  selectedIngredients.value = [...ingredientsList.value]
}

function selectNone() {
  selectedIngredients.value = []
}

async function addToList() {
  if (selectedIngredients.value.length === 0) return
  
  isAdding.value = true
  
  const result = await shoppingListStore.addFromProduct(
    props.product.id,
    selectedIngredients.value,
    getAccessTokenSilently,
    import.meta.env.VITE_API_BASE_URL
  )
  
  isAdding.value = false
  
  if (result) {
    successMessage.value = `${result.items.length} Zutaten zur Einkaufsliste hinzugefügt!`
    setTimeout(() => {
      showModal.value = false
    }, 1500)
  }
}
</script>

<template>
  <!-- Button -->
  <button 
    @click="openModal" 
    class="btn btn-outline-accent"
    :disabled="!ingredientsList.length"
  >
    🛒 Zur Einkaufsliste
  </button>

  <!-- Modal -->
  <Teleport to="body">
    <div v-if="showModal" class="modal-backdrop" @click.self="showModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title fw-bold">🛒 Zutaten zur Einkaufsliste</h5>
          <button @click="showModal = false" class="btn-close"></button>
        </div>
        
        <div class="modal-body">
          <!-- Erfolgs-Nachricht -->
          <div v-if="successMessage" class="alert alert-success">
            ✅ {{ successMessage }}
          </div>

          <template v-else>
            <p class="text-secondary mb-3">
              Wähle die Zutaten aus, die du zur Einkaufsliste hinzufügen möchtest:
            </p>

            <!-- Alle/Keine Buttons -->
            <div class="mb-3 d-flex gap-2">
              <button @click="selectAll" class="btn btn-sm btn-outline-secondary">
                Alle auswählen
              </button>
              <button @click="selectNone" class="btn btn-sm btn-outline-secondary">
                Keine auswählen
              </button>
            </div>

            <!-- Zutaten-Liste -->
            <div class="ingredients-list">
              <div 
                v-for="ingredient in ingredientsList" 
                :key="ingredient"
                class="form-check ingredient-item"
              >
                <input
                  type="checkbox"
                  :id="'ing-' + ingredient"
                  :checked="selectedIngredients.includes(ingredient)"
                  @change="toggleIngredient(ingredient)"
                  class="form-check-input"
                >
                <label :for="'ing-' + ingredient" class="form-check-label">
                  {{ ingredient }}
                </label>
              </div>
            </div>
          </template>
        </div>

        <div v-if="!successMessage" class="modal-footer">
          <button @click="showModal = false" class="btn btn-secondary">
            Abbrechen
          </button>
          <button 
            @click="addToList" 
            class="btn btn-accent"
            :disabled="selectedIngredients.length === 0 || isAdding"
          >
            <span v-if="isAdding">
              <span class="spinner-border spinner-border-sm me-2"></span>
              Hinzufügen...
            </span>
            <span v-else>
              {{ selectedIngredients.length }} Zutaten hinzufügen
            </span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.btn-outline-accent {
  background-color: transparent;
  border: 2px solid #e54c4c;
  color: #e54c4c;
  border-radius: 8px;
}

.btn-outline-accent:hover:not(:disabled) {
  background-color: #e54c4c;
  color: white;
}

.btn-outline-accent:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-accent {
  background-color: #e54c4c;
  border-color: #e54c4c;
  color: white;
}

.btn-accent:hover:not(:disabled) {
  background-color: #d43c3c;
  border-color: #d43c3c;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.ingredients-list {
  max-height: 300px;
  overflow-y: auto;
}

.ingredient-item {
  padding: 0.75rem;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.ingredient-item:hover {
  background-color: #f8f9fa;
}

.form-check-input:checked {
  background-color: #e54c4c;
  border-color: #e54c4c;
}
</style>