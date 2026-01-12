<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue';
import { useUserStore } from '@/stores/user';

const { getAccessTokenSilently } = useAuth0();
const userStore = useUserStore();
const apiUrl = import.meta.env.VITE_API_BASE_URL;

// State
const favorites = ref([]);
const stats = ref(null);
const isLoading = ref(true);
const error = ref('');
const searchQuery = ref('');

// Filter & Sortierung
const sortBy = ref('date'); // 'date', 'user', 'recipe'
const sortOrder = ref('desc'); // 'asc', 'desc'

// Gefilterte und sortierte Favoriten
const filteredFavorites = computed(() => {
  let result = [...favorites.value];
  
  // Suche
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(fav => 
      (fav.userName && fav.userName.toLowerCase().includes(query)) ||
      (fav.userEmail && fav.userEmail.toLowerCase().includes(query)) ||
      (fav.recipeTitle && fav.recipeTitle.toLowerCase().includes(query)) ||
      (fav.productTitle && fav.productTitle.toLowerCase().includes(query))
    );
  }
  
  // Sortierung
  result.sort((a, b) => {
    let comparison = 0;
    switch (sortBy.value) {
      case 'date':
        comparison = new Date(a.createdAt) - new Date(b.createdAt);
        break;
      case 'user':
        comparison = (a.userName || '').localeCompare(b.userName || '');
        break;
      case 'recipe':
        comparison = (a.recipeTitle || '').localeCompare(b.recipeTitle || '');
        break;
    }
    return sortOrder.value === 'desc' ? -comparison : comparison;
  });
  
  return result;
});

// Alle Favoriten laden (Admin)
async function fetchAllFavorites() {
  isLoading.value = true;
  error.value = '';
  
  try {
    const token = await getAccessTokenSilently();
    const response = await fetch(`${apiUrl}/api/favorites/admin/all`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      favorites.value = await response.json();
    } else if (response.status === 403) {
      error.value = 'Keine Berechtigung. Nur Admins können Transaktionsdaten einsehen.';
    } else {
      error.value = `Fehler beim Laden: ${response.status}`;
    }
  } catch (e) {
    error.value = 'Transaktionsdaten konnten nicht geladen werden.';
    console.error('Error fetching favorites:', e);
  } finally {
    isLoading.value = false;
  }
}

// Statistiken laden
async function fetchStats() {
  try {
    const token = await getAccessTokenSilently();
    const response = await fetch(`${apiUrl}/api/favorites/admin/stats`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      stats.value = await response.json();
    }
  } catch (e) {
    console.error('Error fetching stats:', e);
  }
}

// Datum formatieren
function formatDate(dateString) {
  if (!dateString) return '–';
  const date = new Date(dateString);
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Sortierung ändern
function toggleSort(field) {
  if (sortBy.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = field;
    sortOrder.value = 'desc';
  }
}

// Sort Icon
function getSortIcon(field) {
  if (sortBy.value !== field) return 'bi-arrow-down-up';
  return sortOrder.value === 'asc' ? 'bi-sort-up' : 'bi-sort-down';
}

onMounted(() => {
  fetchAllFavorites();
  fetchStats();
});
</script>

<template>
  <div class="container py-5" style="min-height: 70vh;">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold mb-0">
        <i class="bi bi-heart-fill text-accent me-2"></i>Transaktionsdaten (Favoriten)
      </h2>
      <span class="badge bg-accent fs-6">{{ filteredFavorites.length }} Einträge</span>
    </div>
    
    <!-- Statistik-Karten -->
    <div v-if="stats" class="row mb-4">
      <div class="col-md-4 mb-3">
        <div class="card border-0 shadow-sm rounded-4 h-100">
          <div class="card-body text-center">
            <i class="bi bi-heart-fill text-accent display-4 mb-2"></i>
            <h3 class="fw-bold mb-0">{{ stats.totalFavorites }}</h3>
            <p class="text-muted mb-0">Gesamt Favoriten</p>
          </div>
        </div>
      </div>
      <div class="col-md-4 mb-3">
        <div class="card border-0 shadow-sm rounded-4 h-100">
          <div class="card-body text-center">
            <i class="bi bi-people-fill text-primary display-4 mb-2"></i>
            <h3 class="fw-bold mb-0">{{ stats.totalUsers }}</h3>
            <p class="text-muted mb-0">Registrierte Nutzer</p>
          </div>
        </div>
      </div>
      <div class="col-md-4 mb-3">
        <div class="card border-0 shadow-sm rounded-4 h-100">
          <div class="card-body text-center">
            <i class="bi bi-graph-up text-success display-4 mb-2"></i>
            <h3 class="fw-bold mb-0">{{ stats.averageFavoritesPerUser?.toFixed(1) || '0' }}</h3>
            <p class="text-muted mb-0">Ø Favoriten pro Nutzer</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Such- und Filterleiste -->
    <div class="card border-0 shadow-sm rounded-4 mb-4">
      <div class="card-body">
        <div class="row align-items-center">
          <div class="col-md-6 mb-2 mb-md-0">
            <div class="input-group">
              <span class="input-group-text bg-white border-end-0">
                <i class="bi bi-search text-muted"></i>
              </span>
              <input 
                type="text" 
                class="form-control border-start-0" 
                placeholder="Suche nach Nutzer, Rezept oder Produkt..."
                v-model="searchQuery"
              />
            </div>
          </div>
          <div class="col-md-6 text-md-end">
            <span class="text-muted me-2">Sortieren nach:</span>
            <div class="btn-group">
              <button 
                class="btn btn-outline-secondary btn-sm"
                :class="{ active: sortBy === 'date' }"
                @click="toggleSort('date')"
              >
                <i :class="['bi', getSortIcon('date'), 'me-1']"></i>Datum
              </button>
              <button 
                class="btn btn-outline-secondary btn-sm"
                :class="{ active: sortBy === 'user' }"
                @click="toggleSort('user')"
              >
                <i :class="['bi', getSortIcon('user'), 'me-1']"></i>Nutzer
              </button>
              <button 
                class="btn btn-outline-secondary btn-sm"
                :class="{ active: sortBy === 'recipe' }"
                @click="toggleSort('recipe')"
              >
                <i :class="['bi', getSortIcon('recipe'), 'me-1']"></i>Rezept
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Fehlermeldung -->
    <div v-if="error" class="alert alert-danger d-flex align-items-center" role="alert">
      <i class="bi bi-exclamation-triangle-fill me-2"></i>
      {{ error }}
    </div>
    
    <!-- Loading -->
    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-accent" role="status">
        <span class="visually-hidden">Lade Transaktionsdaten...</span>
      </div>
      <p class="mt-3 text-muted">Lade Transaktionsdaten...</p>
    </div>
    
    <!-- Transaktions-Tabelle -->
    <div v-else-if="filteredFavorites.length > 0" class="card border-0 shadow-sm rounded-4">
      <div class="table-responsive">
        <table class="table table-hover mb-0">
          <thead class="table-light">
            <tr>
              <th scope="col" class="ps-4">ID</th>
              <th scope="col">Nutzer</th>
              <th scope="col">Rezept</th>
              <th scope="col">Produkt</th>
              <th scope="col" class="pe-4">Hinzugefügt am</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="fav in filteredFavorites" :key="fav.id">
              <td class="ps-4">
                <span class="text-muted">#{{ fav.id }}</span>
              </td>
              <td>
                <div class="d-flex align-items-center">
                  <div class="avatar-circle me-2">
                    {{ (fav.userName || 'U').charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <span class="fw-medium d-block">{{ fav.userName || '–' }}</span>
                    <small class="text-muted">{{ fav.userEmail || '–' }}</small>
                  </div>
                </div>
              </td>
              <td>
                <span class="fw-medium">{{ fav.recipeTitle || '–' }}</span>
              </td>
              <td>
                <router-link 
                  v-if="fav.productId"
                  :to="{ name: 'product', params: { id: fav.productId } }"
                  class="text-accent text-decoration-none"
                >
                  {{ fav.productTitle || '–' }}
                  <i class="bi bi-box-arrow-up-right ms-1 small"></i>
                </router-link>
                <span v-else class="text-muted">–</span>
              </td>
              <td class="pe-4">
                <span class="text-muted">{{ formatDate(fav.createdAt) }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Keine Daten -->
    <div v-else class="text-center py-5">
      <i class="bi bi-heart text-muted" style="font-size: 4rem;"></i>
      <h4 class="mt-3">Keine Transaktionsdaten gefunden</h4>
      <p class="text-muted">
        {{ searchQuery ? 'Versuche einen anderen Suchbegriff.' : 'Es wurden noch keine Favoriten angelegt.' }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.text-accent {
  color: #e54c4c !important;
}

.bg-accent {
  background-color: #e54c4c !important;
}

.avatar-circle {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #e54c4c 0%, #c94141 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
  flex-shrink: 0;
}

/* Card Styles */
.card {
  transition: all 0.2s ease;
}

/* Table Styles */
.table th {
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #6c757d;
  border-bottom: 2px solid #e9ecef;
}

.table td {
  vertical-align: middle;
  padding: 1rem 0.75rem;
}

/* Button Styles */
.btn-outline-secondary.active {
  background-color: #e54c4c;
  border-color: #e54c4c;
  color: white;
}

.btn-outline-secondary:hover {
  background-color: #f8f9fa;
  border-color: #6c757d;
}

.btn-outline-secondary.active:hover {
  background-color: #d43c3c;
  border-color: #d43c3c;
}

/* Input Styles */
.form-control:focus {
  border-color: #e54c4c;
  box-shadow: 0 0 0 0.2rem rgba(229, 76, 76, 0.15);
}

/* Spinner */
.spinner-border.text-accent {
  color: #e54c4c !important;
}

/* Responsive */
@media (max-width: 768px) {
  .table-responsive {
    font-size: 0.9rem;
  }
  
  .avatar-circle {
    width: 32px;
    height: 32px;
    font-size: 0.8rem;
  }
  
  .btn-group {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
  }
  
  .btn-group .btn {
    flex: 1 1 auto;
  }
}
</style>