<!-- src/views/ShoppingListView.vue -->
<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { useShoppingListStore } from '@/stores/shoppingList'

const { isAuthenticated, getAccessTokenSilently, loginWithRedirect } = useAuth0()
const shoppingListStore = useShoppingListStore()

const newIngredient = ref('')
const showClearConfirm = ref(false)

const items = computed(() => shoppingListStore.items)
const uncheckedItems = computed(() => shoppingListStore.uncheckedItems)
const checkedItems = computed(() => shoppingListStore.checkedItems)
const isLoading = computed(() => shoppingListStore.isLoading)
const error = computed(() => shoppingListStore.error)

onMounted(async () => {
  if (isAuthenticated.value) {
    await shoppingListStore.fetchItems(
      getAccessTokenSilently,
      import.meta.env.VITE_API_BASE_URL
    )
  }
})

async function addItem() {
  if (!newIngredient.value.trim()) return
  
  const success = await shoppingListStore.addItem(
    newIngredient.value,
    null,
    getAccessTokenSilently,
    import.meta.env.VITE_API_BASE_URL
  )
  
  if (success) {
    newIngredient.value = ''
  }
}

async function toggleItem(itemId) {
  await shoppingListStore.toggleItem(
    itemId,
    getAccessTokenSilently,
    import.meta.env.VITE_API_BASE_URL
  )
}

async function deleteItem(itemId) {
  await shoppingListStore.deleteItem(
    itemId,
    getAccessTokenSilently,
    import.meta.env.VITE_API_BASE_URL
  )
}

async function deleteChecked() {
  await shoppingListStore.deleteChecked(
    getAccessTokenSilently,
    import.meta.env.VITE_API_BASE_URL
  )
}

async function clearAll() {
  await shoppingListStore.clearAll(
    getAccessTokenSilently,
    import.meta.env.VITE_API_BASE_URL
  )
  showClearConfirm.value = false
}

function handleLogin() {
  loginWithRedirect({ appState: { targetUrl: '/einkaufsliste' } })
}

function copyToClipboard() {
  const text = uncheckedItems.value
    .map(item => `☐ ${item.ingredient}`)
    .join('\n')
  
  navigator.clipboard.writeText(text)
    .then(() => alert('Liste kopiert!'))
    .catch(err => console.error('Kopieren fehlgeschlagen:', err))
}

function shareList() {
  const text = uncheckedItems.value
    .map(item => `• ${item.ingredient}`)
    .join('\n')
  
  if (navigator.share) {
    navigator.share({
      title: 'Meine Einkaufsliste',
      text: text
    })
  } else {
    copyToClipboard()
  }
}
</script>

<template>
  <div class="container py-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="display-5 fw-bold mb-0">🛒 Einkaufsliste</h1>
      <div v-if="isAuthenticated && items.length > 0" class="d-flex gap-2">
        <button @click="copyToClipboard" class="btn btn-outline-secondary" title="Liste kopieren">
          📋
        </button>
        <button @click="shareList" class="btn btn-outline-secondary" title="Liste teilen">
          📤
        </button>
      </div>
    </div>

    <!-- Nicht eingeloggt -->
    <div v-if="!isAuthenticated" class="text-center py-5">
      <div class="empty-state">
        <span class="empty-icon">🔐</span>
        <h3>Anmeldung erforderlich</h3>
        <p class="text-secondary">Melde dich an, um deine Einkaufsliste zu verwalten.</p>
        <button @click="handleLogin" class="btn btn-accent btn-lg mt-3">
          Jetzt anmelden
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-else-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-danger" role="status">
        <span class="visually-hidden">Lade Einkaufsliste...</span>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <template v-else>
      <!-- Eingabefeld -->
      <div class="input-group mb-4 shadow-sm">
        <input
          v-model="newIngredient"
          type="text"
          class="form-control form-control-lg"
          placeholder="Zutat hinzufügen..."
          @keyup.enter="addItem"
        >
        <button @click="addItem" class="btn btn-accent btn-lg">
          + Hinzufügen
        </button>
      </div>

      <!-- Offene Items -->
      <div v-if="uncheckedItems.length > 0" class="mb-4">
        <h5 class="text-secondary mb-3">Noch zu kaufen ({{ uncheckedItems.length }})</h5>
        <ul class="list-group shadow-sm">
          <li 
            v-for="item in uncheckedItems" 
            :key="item.id"
            class="list-group-item d-flex align-items-center"
          >
            <input
              type="checkbox"
              :checked="item.checked"
              @change="toggleItem(item.id)"
              class="form-check-input me-3"
              style="width: 1.5rem; height: 1.5rem;"
            >
            <div class="flex-grow-1">
              <span class="ingredient-text">{{ item.ingredient }}</span>
              <small v-if="item.sourceProductTitle" class="text-secondary d-block">
                aus: {{ item.sourceProductTitle }}
              </small>
            </div>
            <button 
              @click="deleteItem(item.id)" 
              class="btn btn-sm btn-outline-danger"
              title="Löschen"
            >
              🗑️
            </button>
          </li>
        </ul>
      </div>

      <!-- Abgehakte Items -->
      <div v-if="checkedItems.length > 0" class="mb-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="text-secondary mb-0">Erledigt ({{ checkedItems.length }})</h5>
          <button @click="deleteChecked" class="btn btn-sm btn-outline-secondary">
            Erledigte löschen
          </button>
        </div>
        <ul class="list-group shadow-sm">
          <li 
            v-for="item in checkedItems" 
            :key="item.id"
            class="list-group-item d-flex align-items-center list-group-item-checked"
          >
            <input
              type="checkbox"
              :checked="item.checked"
              @change="toggleItem(item.id)"
              class="form-check-input me-3"
              style="width: 1.5rem; height: 1.5rem;"
            >
            <div class="flex-grow-1">
              <span class="ingredient-text text-decoration-line-through text-secondary">
                {{ item.ingredient }}
              </span>
            </div>
            <button 
              @click="deleteItem(item.id)" 
              class="btn btn-sm btn-outline-secondary"
              title="Löschen"
            >
              🗑️
            </button>
          </li>
        </ul>
      </div>

      <!-- Leere Liste -->
      <div v-if="items.length === 0" class="text-center py-5">
        <div class="empty-state">
          <span class="empty-icon">📝</span>
          <h3>Deine Einkaufsliste ist leer</h3>
          <p class="text-secondary">
            Füge Zutaten hinzu oder übernimm sie direkt aus einem Rezept!
          </p>
          <router-link to="/rezepte" class="btn btn-accent mt-3">
            Rezepte durchstöbern →
          </router-link>
        </div>
      </div>

      <!-- Liste leeren Button -->
      <div v-if="items.length > 0" class="text-center mt-4">
        <button 
          v-if="!showClearConfirm"
          @click="showClearConfirm = true" 
          class="btn btn-outline-danger"
        >
          🗑️ Gesamte Liste leeren
        </button>
        <div v-else class="d-inline-flex gap-2">
          <span class="align-self-center text-danger">Wirklich löschen?</span>
          <button @click="clearAll" class="btn btn-danger">Ja, löschen</button>
          <button @click="showClearConfirm = false" class="btn btn-secondary">Abbrechen</button>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.empty-state {
  padding: 3rem;
}

.empty-icon {
  font-size: 4rem;
  display: block;
  margin-bottom: 1rem;
}

.btn-accent {
  background-color: #e54c4c;
  border-color: #e54c4c;
  color: white;
}

.btn-accent:hover {
  background-color: #d43c3c;
  border-color: #d43c3c;
  color: white;
}

.list-group-item {
  border-radius: 8px !important;
  margin-bottom: 0.5rem;
  transition: all 0.2s ease;
}

.list-group-item:hover {
  background-color: #f8f9fa;
}

.list-group-item-checked {
  background-color: #f0f0f0;
  opacity: 0.7;
}

.ingredient-text {
  font-size: 1.1rem;
}

.form-check-input:checked {
  background-color: #e54c4c;
  border-color: #e54c4c;
}
</style>