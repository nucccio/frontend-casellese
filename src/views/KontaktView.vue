<script setup>
import { ref } from 'vue';

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
});

const isSubmitting = ref(false);
const submitSuccess = ref(false);
const submitError = ref('');

async function handleSubmit() {
  isSubmitting.value = true;
  submitError.value = '';
  
  try {
    // Hier könnte später ein API-Call kommen
    // await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/contact`, { ... })
    
    // Simuliere erfolgreichen Submit
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    submitSuccess.value = true;
    form.value = { name: '', email: '', subject: '', message: '' };
  } catch (e) {
    submitError.value = 'Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.';
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <!-- Hero Banner -->
  <div class="contact-hero d-flex align-items-center justify-content-center">
    <div class="text-center">
      <p class="lead m-0">Wir freuen uns auf Ihre Nachricht</p>
      <h1 class="fw-bold m-0 display-3">Kontakt</h1>
    </div>
  </div>

  <!-- Kontakt Section -->
  <section class="py-5">
    <div class="container" style="max-width: 1000px;">
      
      <div class="row g-5">
        
        <!-- Kontakt-Informationen -->
        <div class="col-lg-5">
          <h2 class="fw-bold mb-4">Besuchen Sie uns</h2>
          <p class="text-secondary mb-5">
            Haben Sie Fragen zu unseren Rezepten oder möchten Sie mehr über die Tradition von Caselle in Pittari erfahren? 
            Wir freuen uns auf Ihre Nachricht!
          </p>
          
          <div class="d-flex align-items-start mb-4">
            <div class="contact-icon me-3">
              <i class="bi bi-geo-alt-fill"></i>
            </div>
            <div>
              <h5 class="fw-bold mb-1">Adresse</h5>
              <p class="text-secondary mb-0">
                Via Roma 123<br>
                84030 Caselle in Pittari (SA)<br>
                Italien
              </p>
            </div>
          </div>
          
          <div class="d-flex align-items-start mb-4">
            <div class="contact-icon me-3">
              <i class="bi bi-envelope-fill"></i>
            </div>
            <div>
              <h5 class="fw-bold mb-1">E-Mail</h5>
              <p class="text-secondary mb-0">
                <a href="mailto:info@ricetti-pittari.it" class="text-accent">info@ricetti-pittari.it</a>
              </p>
            </div>
          </div>
          
          <div class="d-flex align-items-start mb-4">
            <div class="contact-icon me-3">
              <i class="bi bi-telephone-fill"></i>
            </div>
            <div>
              <h5 class="fw-bold mb-1">Telefon</h5>
              <p class="text-secondary mb-0">
                <a href="tel:+390974123456" class="text-accent">+39 0974 123 456</a>
              </p>
            </div>
          </div>
          
          <div class="d-flex align-items-start">
            <div class="contact-icon me-3">
              <i class="bi bi-clock-fill"></i>
            </div>
            <div>
              <h5 class="fw-bold mb-1">Öffnungszeiten</h5>
              <p class="text-secondary mb-0">
                Mo - Fr: 9:00 - 18:00 Uhr<br>
                Sa: 10:00 - 14:00 Uhr
              </p>
            </div>
          </div>
          
          <!-- Social Media -->
          <div class="mt-5">
            <h5 class="fw-bold mb-3">Folgen Sie uns</h5>
            <a href="#" class="social-link me-3"><i class="bi bi-facebook fs-4"></i></a>
            <a href="#" class="social-link me-3"><i class="bi bi-instagram fs-4"></i></a>
            <a href="#" class="social-link"><i class="bi bi-youtube fs-4"></i></a>
          </div>
        </div>
        
        <!-- Kontakt-Formular -->
        <div class="col-lg-7">
          <div class="card p-4 p-lg-5 rounded-4 shadow-sm">
            <h2 class="fw-bold mb-4">Schreiben Sie uns</h2>
            
            <!-- Erfolgs-Nachricht -->
            <div v-if="submitSuccess" class="alert alert-success d-flex align-items-center" role="alert">
              <i class="bi bi-check-circle-fill me-2"></i>
              <div>
                Vielen Dank für Ihre Nachricht! Wir werden uns schnellstmöglich bei Ihnen melden.
              </div>
            </div>
            
            <!-- Fehler-Nachricht -->
            <div v-if="submitError" class="alert alert-danger d-flex align-items-center" role="alert">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>
              <div>{{ submitError }}</div>
            </div>
            
            <form @submit.prevent="handleSubmit" v-if="!submitSuccess">
              <div class="row g-3">
                <div class="col-md-6">
                  <label for="name" class="form-label fw-bold">Name *</label>
                  <input 
                    type="text" 
                    class="form-control form-control-lg rounded-3" 
                    id="name" 
                    v-model="form.name"
                    placeholder="Ihr Name"
                    required
                  >
                </div>
                
                <div class="col-md-6">
                  <label for="email" class="form-label fw-bold">E-Mail *</label>
                  <input 
                    type="email" 
                    class="form-control form-control-lg rounded-3" 
                    id="email" 
                    v-model="form.email"
                    placeholder="ihre@email.de"
                    required
                  >
                </div>
                
                <div class="col-12">
                  <label for="subject" class="form-label fw-bold">Betreff</label>
                  <select 
                    class="form-select form-select-lg rounded-3" 
                    id="subject"
                    v-model="form.subject"
                  >
                    <option value="" selected>Bitte wählen...</option>
                    <option value="rezept">Frage zu einem Rezept</option>
                    <option value="tradition">Frage zur Tradition</option>
                    <option value="besuch">Besuch planen</option>
                    <option value="kooperation">Kooperationsanfrage</option>
                    <option value="sonstiges">Sonstiges</option>
                  </select>
                </div>
                
                <div class="col-12">
                  <label for="message" class="form-label fw-bold">Nachricht *</label>
                  <textarea 
                    class="form-control form-control-lg rounded-3" 
                    id="message" 
                    rows="5"
                    v-model="form.message"
                    placeholder="Ihre Nachricht an uns..."
                    required
                  ></textarea>
                </div>
                
                <div class="col-12">
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="privacy" required>
                    <label class="form-check-label text-secondary" for="privacy">
                      Ich habe die <router-link to="/datenschutz" class="text-accent">Datenschutzerklärung</router-link> gelesen und akzeptiere diese. *
                    </label>
                  </div>
                </div>
                
                <div class="col-12 mt-4">
                  <button 
                    type="submit" 
                    class="btn btn-accent btn-lg w-100"
                    :disabled="isSubmitting"
                  >
                    <span v-if="isSubmitting">
                      <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                      Wird gesendet...
                    </span>
                    <span v-else>
                      Nachricht senden <i class="bi bi-arrow-right ms-2"></i>
                    </span>
                  </button>
                </div>
              </div>
            </form>
            
            <!-- Nach erfolgreichem Submit -->
            <div v-else class="text-center py-4">
              <router-link to="/" class="btn btn-accent btn-lg">
                Zurück zur Startseite <i class="bi bi-arrow-right ms-2"></i>
              </router-link>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  </section>

</template>

<style scoped>
.contact-hero {
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), 
                    url('https://nucccio.github.io/casellese-images/cip-kontakt-2.webp');
  background-size: cover;
  height: 40vh;
  background-position: center;
  color: white;
}

.contact-icon {
  width: 50px;
  height: 50px;
  background-color: #e54c4c;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.social-link {
  color: #e54c4c;
  transition: 0.3s;
}

.social-link:hover {
  color: #c94141;
  transform: scale(1.1);
}

.feature-section {
  border-top: 3px solid #c9c9c9;
  border-bottom: 3px solid #c9c9c9;
}

.feature-icon {
  height: 100px;
}

.logo-cta {
  max-height: 200px;
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