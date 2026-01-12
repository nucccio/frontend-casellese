<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth0 } from '@auth0/auth0-vue';
import Button from '@/components/Button.vue';
import NavButton from '@/components/NavButton.vue';

const route = useRoute();
const router = useRouter();
const { getAccessTokenSilently } = useAuth0();
const apiUrl = import.meta.env.VITE_API_BASE_URL;

const product = ref({});
const categories = ref([]);
const recipes = ref([]);
const isLoading = ref(true);
const isSubmitting = ref(false);
const errorMessage = ref('');

// Rezept-Formular State
const showRecipeForm = ref(false);
const editingRecipe = ref(null);
const recipeForm = ref({
  title: '',
  text: '',
  pdfUrl: '',
  youtubeUrl: ''
});

// Kategorien laden
async function fetchCategories() {
  try {
    const response = await fetch(`${apiUrl}/api/category`);
    if (response.ok) {
      categories.value = await response.json();
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
}

// Produkt laden
async function fetchProduct() {
  const productId = route.params.id;
  try {
    const response = await fetch(`${apiUrl}/api/product/${productId}`);
    if (!response.ok) {
      throw new Error(`Produkt nicht gefunden: ${response.status}`);
    }
    product.value = await response.json();
  } catch (error) {
    console.error('Fehler beim Laden des Produkts:', error);
    errorMessage.value = 'Produkt konnte nicht geladen werden.';
  }
}

// Rezepte für das Produkt laden
async function fetchRecipes() {
  const productId = route.params.id;
  try {
    const response = await fetch(`${apiUrl}/api/products/${productId}/recipes`);
    if (response.ok) {
      recipes.value = await response.json();
    } else {
      recipes.value = [];
    }
  } catch (error) {
    console.error('Error fetching recipes:', error);
    recipes.value = [];
  }
}

// Produkt aktualisieren
async function updateProduct() {
  if (!product.value.title || !product.value.category) {
    errorMessage.value = 'Bitte fülle mindestens Titel und Kategorie aus.';
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = '';

  try {
    const token = await getAccessTokenSilently();
    const response = await fetch(`${apiUrl}/api/product/${product.value.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(product.value),
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('Keine Berechtigung. Nur Admins können Produkte bearbeiten.');
      }
      throw new Error(`Fehler beim Aktualisieren: ${response.status}`);
    }

    alert('Produkt erfolgreich aktualisiert!');
    router.push('/');
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Produkts:', error);
    errorMessage.value = error.message || 'Produkt konnte nicht aktualisiert werden.';
  } finally {
    isSubmitting.value = false;
  }
}

// Produkt löschen
async function deleteProduct() {
  if (!confirm('Möchtest du dieses Produkt wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.')) {
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = '';

  try {
    const token = await getAccessTokenSilently();
    const response = await fetch(`${apiUrl}/api/product/${product.value.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('Keine Berechtigung. Nur Admins können Produkte löschen.');
      }
      throw new Error(`Fehler beim Löschen: ${response.status}`);
    }

    alert('Produkt erfolgreich gelöscht!');
    router.push('/');
  } catch (error) {
    console.error('Fehler beim Löschen des Produkts:', error);
    errorMessage.value = error.message || 'Produkt konnte nicht gelöscht werden.';
  } finally {
    isSubmitting.value = false;
  }
}

// ========================================
// REZEPT-VERWALTUNG (1:n Beziehung)
// ========================================

// Neues Rezept Formular öffnen
function openNewRecipeForm() {
  editingRecipe.value = null;
  recipeForm.value = { title: '', text: '', pdfUrl: '', youtubeUrl: '' };
  showRecipeForm.value = true;
}

// Rezept bearbeiten
function openEditRecipeForm(recipe) {
  editingRecipe.value = recipe;
  recipeForm.value = {
    title: recipe.title,
    text: recipe.text || '',
    pdfUrl: recipe.pdfUrl || '',
    youtubeUrl: recipe.youtubeUrl || ''
  };
  showRecipeForm.value = true;
}

// Rezept-Formular schließen
function closeRecipeForm() {
  showRecipeForm.value = false;
  editingRecipe.value = null;
  recipeForm.value = { title: '', text: '', pdfUrl: '', youtubeUrl: '' };
}

// Rezept speichern (Create oder Update)
async function saveRecipe() {
  if (!recipeForm.value.title.trim()) {
    alert('Bitte gib einen Titel für das Rezept ein.');
    return;
  }

  isSubmitting.value = true;

  try {
    const token = await getAccessTokenSilently();
    
    if (editingRecipe.value) {
      // UPDATE: Bestehendes Rezept aktualisieren
      const response = await fetch(`${apiUrl}/api/recipes/${editingRecipe.value.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(recipeForm.value)
      });

      if (!response.ok) {
        throw new Error(`Fehler beim Aktualisieren: ${response.status}`);
      }

      alert('Rezept erfolgreich aktualisiert!');
    } else {
      // CREATE: Neues Rezept erstellen
      const response = await fetch(`${apiUrl}/api/products/${product.value.id}/recipes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(recipeForm.value)
      });

      if (!response.ok) {
        throw new Error(`Fehler beim Erstellen: ${response.status}`);
      }

      alert('Rezept erfolgreich erstellt!');
    }

    // Rezepte neu laden und Formular schließen
    await fetchRecipes();
    closeRecipeForm();
  } catch (error) {
    console.error('Fehler beim Speichern des Rezepts:', error);
    alert(error.message || 'Rezept konnte nicht gespeichert werden.');
  } finally {
    isSubmitting.value = false;
  }
}

// Rezept löschen
async function deleteRecipe(recipe) {
  if (!confirm(`Möchtest du das Rezept "${recipe.title}" wirklich löschen?`)) {
    return;
  }

  isSubmitting.value = true;

  try {
    const token = await getAccessTokenSilently();
    const response = await fetch(`${apiUrl}/api/recipes/${recipe.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Fehler beim Löschen: ${response.status}`);
    }

    alert('Rezept erfolgreich gelöscht!');
    await fetchRecipes();
  } catch (error) {
    console.error('Fehler beim Löschen des Rezepts:', error);
    alert(error.message || 'Rezept konnte nicht gelöscht werden.');
  } finally {
    isSubmitting.value = false;
  }
}

onMounted(async () => {
  isLoading.value = true;
  await Promise.all([fetchCategories(), fetchProduct(), fetchRecipes()]);
  isLoading.value = false;
});
</script>

<template>
  <div class="container py-5" style="min-height: 70vh;">
    <!-- Loading -->
    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Lade Produkt...</span>
      </div>
    </div>

    <!-- Content -->
    <div v-else class="row justify-content-center">
      <div class="col-12 col-lg-10">
        <h2 class="fw-bold mb-4"><i class="bi bi-pencil-square me-2"></i>Produkt bearbeiten</h2>

        <!-- Error Message -->
        <div v-if="errorMessage" class="alert alert-danger" role="alert">
          {{ errorMessage }}
        </div>

        <div class="row">
          <!-- LINKE SPALTE: Produkt-Formular -->
          <div class="col-12 col-md-6 mb-4">
            <div class="card border-0 shadow-sm rounded-4">
              <div class="card-body p-4">
                <h4 class="fw-bold mb-3"><i class="bi bi-box-seam me-2"></i>Produktdaten</h4>

                <!-- Bildvorschau -->
                <div v-if="product.imageUrl" class="text-center mb-4">
                  <img 
                    :src="product.imageUrlDetails || product.imageUrl" 
                    :alt="product.title" 
                    class="img-fluid rounded" 
                    style="max-height: 200px;" 
                  />
                </div>

                <form @submit.prevent="updateProduct">
                  <!-- ID (readonly) -->
                  <div class="mb-3">
                    <label for="productId" class="form-label">Produkt ID</label>
                    <input 
                      type="text" 
                      id="productId" 
                      class="form-control" 
                      :value="product.id" 
                      readonly 
                      disabled
                    />
                  </div>

                  <!-- Titel -->
                  <div class="mb-3">
                    <label for="productTitle" class="form-label">Titel *</label>
                    <input 
                      type="text" 
                      id="productTitle" 
                      class="form-control" 
                      v-model="product.title" 
                      required 
                    />
                  </div>

                  <!-- Kategorie -->
                  <div class="mb-3">
                    <label for="productCategory" class="form-label">Kategorie *</label>
                    <select id="productCategory" class="form-select" v-model="product.category" required>
                      <option value="">Bitte wählen</option>
                      <option v-for="cat in categories" :key="cat.name" :value="cat.name">
                        {{ cat.germanName }}
                      </option>
                    </select>
                  </div>

                  <!-- Bild-URL -->
                  <div class="mb-3">
                    <label for="productImageUrl" class="form-label">Bild-URL (Vorschau)</label>
                    <input 
                      type="url" 
                      id="productImageUrl" 
                      class="form-control" 
                      v-model="product.imageUrl" 
                    />
                  </div>

                  <!-- Beschreibung -->
                  <div class="mb-3">
                    <label for="productDescription" class="form-label">Beschreibung</label>
                    <textarea 
                      id="productDescription" 
                      class="form-control" 
                      v-model="product.description"
                      rows="3"
                    ></textarea>
                  </div>

                  <!-- Zutaten -->
                  <div class="mb-3">
                    <label for="productIngredients" class="form-label">Zutaten</label>
                    <textarea 
                      id="productIngredients" 
                      class="form-control" 
                      v-model="product.ingredients"
                      rows="2"
                    ></textarea>
                  </div>

                  <!-- Buttons -->
                  <div class="d-flex flex-wrap gap-2">
                    <NavButton variant="secondary" to="/">Abbrechen</NavButton>
                    <Button type="submit" variant="accent" :disabled="isSubmitting">
                      {{ isSubmitting ? 'Speichere...' : 'Speichern' }}
                    </Button>
                    <Button 
                      type="button" 
                      variant="danger" 
                      :disabled="isSubmitting"
                      :onClick="deleteProduct"
                    >
                      <i class="bi bi-trash me-1"></i>Löschen
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <!-- RECHTE SPALTE: Rezept-Verwaltung (1:n Beziehung) -->
          <div class="col-12 col-md-6 mb-4">
            <div class="card border-0 shadow-sm rounded-4">
              <div class="card-body p-4">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <h4 class="fw-bold mb-0"><i class="bi bi-journal-text me-2"></i>Rezepte</h4>
                  <button 
                    class="btn btn-accent btn-sm"
                    @click="openNewRecipeForm"
                    :disabled="isSubmitting"
                  >
                    + Neues Rezept
                  </button>
                </div>

                <!-- Rezept-Liste -->
                <div v-if="recipes.length === 0 && !showRecipeForm" class="text-center py-4 text-muted">
                  <p class="mb-0">Noch keine Rezepte vorhanden.</p>
                  <small>Klicke auf "Neues Rezept" um ein Rezept hinzuzufügen.</small>
                </div>

                <div v-else class="recipe-list">
                  <div 
                    v-for="recipe in recipes" 
                    :key="recipe.id"
                    class="recipe-item p-3 mb-2 rounded-3 bg-light"
                  >
                    <div class="d-flex justify-content-between align-items-start">
                      <div class="flex-grow-1">
                        <h6 class="fw-bold mb-1">{{ recipe.title }}</h6>
                        <p v-if="recipe.text" class="text-muted small mb-0 recipe-preview">
                          {{ recipe.text.substring(0, 100) }}{{ recipe.text.length > 100 ? '...' : '' }}
                        </p>
                        <div class="d-flex flex-wrap gap-2 mt-1">
                          <a v-if="recipe.pdfUrl" :href="recipe.pdfUrl" target="_blank" class="small text-accent">
                            <i class="bi bi-file-earmark-pdf me-1"></i>PDF ansehen
                          </a>
                          <a v-if="recipe.youtubeUrl" :href="recipe.youtubeUrl" target="_blank" class="small text-danger">
                            <i class="bi bi-youtube me-1"></i>YouTube Video
                          </a>
                        </div>
                      </div>
                      <div class="d-flex gap-1 ms-2">
                        <button 
                          class="btn btn-outline-secondary btn-sm"
                          @click="openEditRecipeForm(recipe)"
                          title="Bearbeiten"
                        >
                          <i class="bi bi-pencil"></i>
                        </button>
                        <button 
                          class="btn btn-outline-danger btn-sm"
                          @click="deleteRecipe(recipe)"
                          title="Löschen"
                        >
                          <i class="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Rezept-Formular (Create/Edit) -->
                <div v-if="showRecipeForm" class="recipe-form mt-4 p-3 border rounded-3 bg-white">
                  <h5 class="fw-bold mb-3">
                    <i :class="editingRecipe ? 'bi bi-pencil' : 'bi bi-plus-circle'" class="me-2"></i>
                    {{ editingRecipe ? 'Rezept bearbeiten' : 'Neues Rezept' }}
                  </h5>

                  <div class="mb-3">
                    <label for="recipeTitle" class="form-label">Titel *</label>
                    <input 
                      type="text" 
                      id="recipeTitle" 
                      class="form-control" 
                      v-model="recipeForm.title"
                      placeholder="z.B. Klassische Zubereitung"
                      required
                    />
                  </div>

                  <div class="mb-3">
                    <label for="recipeText" class="form-label">Rezepttext</label>
                    <textarea 
                      id="recipeText" 
                      class="form-control" 
                      v-model="recipeForm.text"
                      rows="6"
                      placeholder="## Zutaten&#10;- 200g Mehl&#10;- 100ml Wasser&#10;&#10;## Zubereitung&#10;1. Mehl sieben..."
                    ></textarea>
                    <small class="text-muted">Tipp: Markdown wird unterstützt (## für Überschriften, - für Listen)</small>
                  </div>

                  <div class="mb-3">
                    <label for="recipePdfUrl" class="form-label">PDF-URL (optional)</label>
                    <input 
                      type="url" 
                      id="recipePdfUrl" 
                      class="form-control" 
                      v-model="recipeForm.pdfUrl"
                      placeholder="https://example.com/rezept.pdf"
                    />
                  </div>

                  <div class="mb-3">
                    <label for="recipeYoutubeUrl" class="form-label">
                      <i class="bi bi-youtube text-danger me-1"></i>YouTube-URL (optional)
                    </label>
                    <input 
                      type="url" 
                      id="recipeYoutubeUrl" 
                      class="form-control" 
                      v-model="recipeForm.youtubeUrl"
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                    <small class="text-muted">
                      Füge einen YouTube-Link hinzu, um ein Video zum Rezept anzuzeigen
                    </small>
                  </div>

                  <div class="d-flex gap-2">
                    <button 
                      type="button"
                      class="btn btn-secondary btn-sm"
                      @click="closeRecipeForm"
                    >
                      Abbrechen
                    </button>
                    <button 
                      type="button"
                      class="btn btn-accent btn-sm"
                      @click="saveRecipe"
                      :disabled="isSubmitting"
                    >
                      {{ isSubmitting ? 'Speichere...' : (editingRecipe ? 'Aktualisieren' : 'Erstellen') }}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* Form-Styles im StyleTile-Design */
.form-control:focus,
.form-select:focus {
  border-color: #e54c4c;
  box-shadow: 0 0 0 0.2rem rgba(229, 76, 76, 0.15);
}

.form-label {
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  color: #333;
}

/* Card Styling */
.card {
  background: #ffffff;
}

/* Rezept-Liste Styles */
.recipe-item {
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.recipe-item:hover {
  border-color: #e54c4c;
  background-color: #fff !important;
}

.recipe-preview {
  line-height: 1.4;
}

/* Accent Color für Links */
.text-accent {
  color: #e54c4c;
}

.text-accent:hover {
  color: #d43c3c;
}

/* Button Styles */
.btn-accent {
  background-color: #e54c4c;
  border-color: #e54c4c;
  color: white;
  border-radius: 8px;
}

.btn-accent:hover {
  background-color: #d43c3c;
  border-color: #d43c3c;
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  border-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
  border-color: #545b62;
  color: white;
}

.btn-outline-secondary {
  border-color: #c9c9c9;
  color: #333;
}

.btn-outline-secondary:hover {
  background-color: #f0f0f0;
  border-color: #c9c9c9;
  color: #333;
}

.btn-outline-danger {
  border-color: #e54c4c;
  color: #e54c4c;
}

.btn-outline-danger:hover {
  background-color: #e54c4c;
  border-color: #e54c4c;
  color: white;
}

/* Rezept-Formular */
.recipe-form {
  border-color: #e54c4c !important;
}

/* Responsive Anpassungen */
@media (max-width: 768px) {
  .recipe-item .d-flex {
    flex-direction: column;
    align-items: flex-start !important;
  }
  
  .recipe-item .d-flex .ms-2 {
    margin-left: 0 !important;
    margin-top: 0.5rem;
  }
}
</style>