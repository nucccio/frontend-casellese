<script setup>
import { ref, computed } from 'vue';

const form = ref({
  email: '',
  firstName: '',
  lastName: '',
  interests: []
});

const interestOptions = [
  { id: 'rezepte', label: 'Neue Rezepte', icon: 'bi-book' },
  { id: 'tradition', label: 'Tradition & Geschichte', icon: 'bi-clock-history' },
  { id: 'events', label: 'Events & Veranstaltungen', icon: 'bi-calendar-event' },
  { id: 'tipps', label: 'Koch-Tipps & Tricks', icon: 'bi-lightbulb' }
];

function toggleInterest(interestId) {
  const index = form.value.interests.indexOf(interestId);
  if (index > -1) {
    form.value.interests.splice(index, 1);
  } else {
    form.value.interests.push(interestId);
  }
}

// Mailto-Link generieren
const mailtoLink = computed(() => {
  const to = 'newsletter@caselleinpittari.it';
  const subject = encodeURIComponent('Newsletter-Anmeldung');
  
  // Interessen als lesbare Liste
  const interestLabels = form.value.interests
    .map(id => interestOptions.find(opt => opt.id === id)?.label)
    .filter(Boolean)
    .join(', ');
  
  const bodyParts = [
    'Ich möchte mich für den Newsletter anmelden.',
    '',
    `Vorname: ${form.value.firstName || '-'}`,
    `Nachname: ${form.value.lastName || '-'}`,
    `E-Mail: ${form.value.email || '-'}`,
    '',
    `Interessen: ${interestLabels || 'Keine angegeben'}`,
    '',
    'Bitte nehmen Sie mich in den Verteiler auf.',
    '',
    'Mit freundlichen Grüßen'
  ];
  
  const body = encodeURIComponent(bodyParts.join('\n'));
  
  return `mailto:${to}?subject=${subject}&body=${body}`;
});
</script>

<template>
  <!-- Hero Banner -->
  <div class="newsletter-hero d-flex align-items-center justify-content-center">
    <div class="text-center">
      <p class="lead m-0">Bleiben Sie auf dem Laufenden</p>
      <h1 class="fw-bold m-0 display-3">Newsletter</h1>
    </div>
  </div>

  <!-- Vorteile Section -->
  <section class="py-5 bg-light feature-section">
    <div class="container">
      <div class="row text-center g-4">
        
        <div class="col-lg-4 col-md-6 d-flex align-items-stretch">
          <div class="card p-4 rounded-4 shadow-sm w-100">
            <div class="mb-3">
              <div class="feature-icon-circle mx-auto">
                <i class="bi bi-envelope-heart fs-2"></i>
              </div>
            </div>
            <h4 class="fw-bold">Exklusive Rezepte</h4>
            <p>Erhalten Sie neue Rezepte direkt in Ihr Postfach, bevor sie veröffentlicht werden</p>
          </div>
        </div>

        <div class="col-lg-4 col-md-6 d-flex align-items-stretch">
          <div class="card p-4 rounded-4 shadow-sm w-100">
            <div class="mb-3">
              <div class="feature-icon-circle mx-auto">
                <i class="bi bi-calendar-check fs-2"></i>
              </div>
            </div>
            <h4 class="fw-bold">Veranstaltungen</h4>
            <p>Erfahren Sie als Erste von Koch-Events und Traditionsfesten in Caselle in Pittari</p>
          </div>
        </div>

        <div class="col-lg-4 col-md-12 d-flex align-items-stretch">
          <div class="card p-4 rounded-4 shadow-sm w-100">
            <div class="mb-3">
              <div class="feature-icon-circle mx-auto">
                <i class="bi bi-gift fs-2"></i>
              </div>
            </div>
            <h4 class="fw-bold">Spezielle Angebote</h4>
            <p>Genießen Sie exklusive Vorteile und besondere Aktionen nur für Newsletter-Abonnenten</p>
          </div>
        </div>

      </div>
    </div>
  </section>

  <!-- Newsletter Anmeldung Section -->
  <section class="py-5">
    <div class="container" style="max-width: 800px;">
      
      <div class="text-center mb-5">
        <h2 class="fw-bold display-5">Jetzt anmelden</h2>
        <p class="lead text-secondary">Tradition, Rezepte und mehr – direkt in Ihr Postfach</p>
      </div>

      <div class="card p-4 p-lg-5 rounded-4 shadow-sm">
        
        <!-- Anmelde-Formular -->
        <form @submit.prevent>
          
          <!-- Info-Hinweis -->
          <div class="alert alert-info d-flex align-items-start mb-4" role="alert">
            <i class="bi bi-info-circle-fill me-2 mt-1"></i>
            <div>
              <strong>So funktioniert's:</strong> Füllen Sie das Formular aus und klicken Sie auf "Newsletter abonnieren". 
              Es öffnet sich Ihr E-Mail-Programm mit einer vorbereiteten Nachricht.
            </div>
          </div>
          
          <div class="row g-3">
            
            <!-- Vorname -->
            <div class="col-md-6">
              <label for="firstName" class="form-label fw-bold">Vorname</label>
              <input 
                type="text" 
                class="form-control form-control-lg rounded-3" 
                id="firstName" 
                v-model="form.firstName"
                placeholder="Ihr Vorname"
              >
            </div>
            
            <!-- Nachname -->
            <div class="col-md-6">
              <label for="lastName" class="form-label fw-bold">Nachname</label>
              <input 
                type="text" 
                class="form-control form-control-lg rounded-3" 
                id="lastName" 
                v-model="form.lastName"
                placeholder="Ihr Nachname"
              >
            </div>
            
            <!-- E-Mail -->
            <div class="col-12">
              <label for="email" class="form-label fw-bold">E-Mail-Adresse *</label>
              <input 
                type="email" 
                class="form-control form-control-lg rounded-3" 
                id="email" 
                v-model="form.email"
                placeholder="ihre@email.de"
                required
              >
            </div>
            
            <!-- Interessen -->
            <div class="col-12 mt-4">
              <label class="form-label fw-bold mb-3">Wofür interessieren Sie sich?</label>
              <div class="row g-3">
                <div 
                  v-for="interest in interestOptions" 
                  :key="interest.id" 
                  class="col-md-6"
                >
                  <div 
                    class="interest-card p-3 rounded-3 d-flex align-items-center"
                    :class="{ 'selected': form.interests.includes(interest.id) }"
                    @click="toggleInterest(interest.id)"
                  >
                    <div class="interest-icon me-3">
                      <i :class="['bi', interest.icon]"></i>
                    </div>
                    <span class="fw-medium">{{ interest.label }}</span>
                    <div class="ms-auto">
                      <i 
                        class="bi" 
                        :class="form.interests.includes(interest.id) ? 'bi-check-circle-fill text-accent' : 'bi-circle'"
                      ></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Datenschutz -->
            <div class="col-12 mt-4">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="privacy" required>
                <label class="form-check-label text-secondary" for="privacy">
                  Ich habe die <router-link to="/datenschutz" class="text-accent">Datenschutzerklärung</router-link> gelesen und stimme dem Erhalt des Newsletters zu. *
                </label>
              </div>
            </div>
            
            <!-- Submit Button als mailto: Link -->
            <div class="col-12 mt-4">
              <a 
                :href="mailtoLink" 
                class="btn btn-accent btn-lg w-100"
              >
                Newsletter abonnieren <i class="bi bi-envelope ms-2"></i>
              </a>
            </div>
            
          </div>
        </form>
        
      </div>
      
      <!-- Hinweis -->
      <p class="text-center text-secondary mt-4 small">
        <i class="bi bi-shield-check me-1"></i>
        Ihre Daten sind bei uns sicher. Sie können sich jederzeit abmelden.
      </p>
      
    </div>
  </section>

  <!-- Logo CTA Section -->
  <section class="py-5 text-center bg-light">
    <div class="container">
      <div class="mb-4">
        <img src="https://nucccio.github.io/casellese-images/logo_ricetti.webp" 
             alt="Ricetti in Pittari Logo"
             class="img-fluid logo-cta">
      </div>
      <p class="lead text-secondary mb-4">Haben Sie Fragen?</p>
      <router-link to="/kontakt" class="btn btn-accent btn-lg shadow">
        Kontaktieren Sie uns
        <i class="bi bi-arrow-right ms-2"></i>
      </router-link>
    </div>
  </section>
</template>

<style scoped>
.newsletter-hero {
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), 
                    url('https://nucccio.github.io/casellese-images/newsletter.webp');
  background-size: cover;
  height: 40vh;
  background-position: center;
  color: white;
}

.feature-section {
  border-top: 3px solid #c9c9c9;
  border-bottom: 3px solid #c9c9c9;
  margin-top: -5px;
  margin-bottom: -5px;
}

.feature-icon-circle {
  width: 80px;
  height: 80px;
  background-color: #e54c4c;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.interest-card {
  background-color: #f8f9fa;
  border: 2px solid #e9ecef;
  cursor: pointer;
  transition: all 0.3s ease;
}

.interest-card:hover {
  border-color: #e54c4c;
  background-color: #fff;
}

.interest-card.selected {
  border-color: #e54c4c;
  background-color: #fef7f7;
}

.interest-icon {
  width: 40px;
  height: 40px;
  background-color: #e54c4c;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
}

.logo-cta {
  max-height: 150px;
}

.form-control:focus,
.form-select:focus {
  border-color: #e54c4c;
  box-shadow: 0 0 0 0.25rem rgba(229, 76, 76, 0.25);
}

.form-check-input:checked {
  background-color: #e54c4c;
  border-color: #e54c4c;
}
</style>