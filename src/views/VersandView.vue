<script setup>
</script>

<template>
  <!-- Hero Banner -->
  <div class="legal-hero d-flex align-items-center justify-content-center">
    <div class="text-center">
      <p class="lead m-0">Informationen zur Lieferung</p>
      <h1 class="fw-bold m-0 display-3">Versand</h1>
    </div>
  </div>

  <!-- Versand Content Section -->
  <section class="py-5">
    <div class="container legal-container">
      
      <!-- Übersicht -->
      <div class="card p-4 p-lg-5 rounded-4 shadow-sm mb-4 border-accent">
        <div class="d-flex align-items-center mb-4">
          <div class="info-icon me-3">
            <i class="bi bi-truck"></i>
          </div>
          <h2 class="fw-bold m-0">Versandinformationen</h2>
        </div>
        <p class="text-secondary fs-5 mb-0">
          Wir liefern unsere traditionellen italienischen Produkte direkt aus Caselle in Pittari 
          zu Ihnen nach Hause – mit Sorgfalt verpackt und schnell versandt.
        </p>
      </div>

      <!-- Versandkosten -->
      <div class="card p-4 p-lg-5 rounded-4 shadow-sm mb-4">
        <h2 class="fw-bold mb-4">Versandkosten</h2>
        
        <div class="table-responsive">
          <table class="table table-hover">
            <thead class="table-dark">
              <tr>
                <th scope="col">Liefergebiet</th>
                <th scope="col">Standardversand</th>
                <th scope="col">Expressversand</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><i class="bi bi-geo-alt text-accent me-2"></i>Italien</td>
                <td>€ 5,90</td>
                <td>€ 12,90</td>
              </tr>
              <tr>
                <td><i class="bi bi-geo-alt text-accent me-2"></i>Deutschland</td>
                <td>€ 9,90</td>
                <td>€ 19,90</td>
              </tr>
              <tr>
                <td><i class="bi bi-geo-alt text-accent me-2"></i>Österreich</td>
                <td>€ 9,90</td>
                <td>€ 19,90</td>
              </tr>
              <tr>
                <td><i class="bi bi-geo-alt text-accent me-2"></i>Schweiz</td>
                <td>€ 14,90</td>
                <td>€ 24,90</td>
              </tr>
              <tr>
                <td><i class="bi bi-geo-alt text-accent me-2"></i>EU (sonstige)</td>
                <td>€ 12,90</td>
                <td>€ 22,90</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="alert alert-success d-flex align-items-center mt-4" role="alert">
          <i class="bi bi-gift-fill me-2 fs-4"></i>
          <div>
            <strong>Kostenloser Versand</strong> innerhalb Italiens ab einem Bestellwert von € 50,00 
            und innerhalb der EU ab einem Bestellwert von € 75,00!
          </div>
        </div>
      </div>

      <!-- Lieferzeiten -->
      <div class="card p-4 p-lg-5 rounded-4 shadow-sm mb-4">
        <h2 class="fw-bold mb-4">Lieferzeiten</h2>
        
        <div class="row g-4">
          <div class="col-md-6">
            <div class="delivery-card p-4 rounded-3 h-100">
              <div class="d-flex align-items-center mb-3">
                <div class="delivery-icon me-3">
                  <i class="bi bi-box-seam"></i>
                </div>
                <h5 class="fw-bold m-0">Standardversand</h5>
              </div>
              <ul class="text-secondary mb-0">
                <li>Italien: 2-4 Werktage</li>
                <li>Deutschland/Österreich: 4-7 Werktage</li>
                <li>Schweiz: 5-8 Werktage</li>
                <li>EU (sonstige): 5-10 Werktage</li>
              </ul>
            </div>
          </div>
          <div class="col-md-6">
            <div class="delivery-card express p-4 rounded-3 h-100">
              <div class="d-flex align-items-center mb-3">
                <div class="delivery-icon express me-3">
                  <i class="bi bi-lightning-charge"></i>
                </div>
                <h5 class="fw-bold m-0">Expressversand</h5>
              </div>
              <ul class="text-secondary mb-0">
                <li>Italien: 1-2 Werktage</li>
                <li>Deutschland/Österreich: 2-3 Werktage</li>
                <li>Schweiz: 2-4 Werktage</li>
                <li>EU (sonstige): 3-5 Werktage</li>
              </ul>
            </div>
          </div>
        </div>

        <p class="text-secondary mt-4 mb-0">
          <i class="bi bi-info-circle text-accent me-2"></i>
          Die angegebenen Lieferzeiten sind Richtwerte und beginnen nach Zahlungseingang. 
          Bei Vorkasse/Überweisung beginnt die Lieferzeit nach Eingang der Zahlung auf unserem Konto.
        </p>
      </div>

      <!-- Versandpartner -->
      <div class="card p-4 p-lg-5 rounded-4 shadow-sm mb-4">
        <h2 class="fw-bold mb-4">Unsere Versandpartner</h2>
        <p class="text-secondary">
          Wir arbeiten mit zuverlässigen Versanddienstleistern zusammen, um Ihre Bestellung 
          sicher und schnell zu Ihnen zu bringen:
        </p>
        <div class="row g-4 mt-2">
          <div class="col-md-4 text-center">
            <div class="partner-card p-4 rounded-3 h-100">
              <i class="bi bi-box-seam fs-1 text-accent mb-3 d-block"></i>
              <h5 class="fw-bold">DHL</h5>
              <p class="text-secondary small mb-0">Internationaler Versand</p>
            </div>
          </div>
          <div class="col-md-4 text-center">
            <div class="partner-card p-4 rounded-3 h-100">
              <i class="bi bi-truck fs-1 text-accent mb-3 d-block"></i>
              <h5 class="fw-bold">GLS</h5>
              <p class="text-secondary small mb-0">EU-weiter Versand</p>
            </div>
          </div>
          <div class="col-md-4 text-center">
            <div class="partner-card p-4 rounded-3 h-100">
              <i class="bi bi-lightning-charge fs-1 text-accent mb-3 d-block"></i>
              <h5 class="fw-bold">UPS</h5>
              <p class="text-secondary small mb-0">Expresslieferungen</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Sendungsverfolgung -->
      <div class="card p-4 p-lg-5 rounded-4 shadow-sm mb-4">
        <h2 class="fw-bold mb-4">Sendungsverfolgung</h2>
        <p class="text-secondary">
          Nach dem Versand Ihrer Bestellung erhalten Sie eine E-Mail mit der Sendungsnummer 
          und einem Link zur Sendungsverfolgung. So können Sie jederzeit den aktuellen 
          Status Ihrer Lieferung einsehen.
        </p>
        <div class="bg-light p-4 rounded-3">
          <div class="row align-items-center">
            <div class="col-md-8">
              <h5 class="fw-bold mb-2">Ihre Sendung verfolgen</h5>
              <p class="text-secondary mb-0">
                Geben Sie Ihre Sendungsnummer auf der Website des jeweiligen 
                Versanddienstleisters ein, um den aktuellen Status zu prüfen.
              </p>
            </div>
            <div class="col-md-4 text-md-end mt-3 mt-md-0">
              <i class="bi bi-search fs-1 text-accent"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Verpackung -->
      <div class="card p-4 p-lg-5 rounded-4 shadow-sm mb-4">
        <h2 class="fw-bold mb-4">Sorgfältige Verpackung</h2>
        <p class="text-secondary">
          Unsere Produkte werden mit größter Sorgfalt verpackt, um sicherzustellen, 
          dass sie in einwandfreiem Zustand bei Ihnen ankommen:
        </p>
        <div class="row g-3 mt-2">
          <div class="col-md-6">
            <div class="d-flex align-items-start">
              <div class="check-icon me-3">
                <i class="bi bi-check-lg"></i>
              </div>
              <p class="text-secondary mb-0">
                <strong>Lebensmittelechte Verpackung</strong><br>
                Für optimale Frische und Qualität
              </p>
            </div>
          </div>
          <div class="col-md-6">
            <div class="d-flex align-items-start">
              <div class="check-icon me-3">
                <i class="bi bi-check-lg"></i>
              </div>
              <p class="text-secondary mb-0">
                <strong>Stoßsichere Kartons</strong><br>
                Schutz vor Transportschäden
              </p>
            </div>
          </div>
          <div class="col-md-6">
            <div class="d-flex align-items-start">
              <div class="check-icon me-3">
                <i class="bi bi-check-lg"></i>
              </div>
              <p class="text-secondary mb-0">
                <strong>Kühlverpackung</strong><br>
                Bei temperaturempfindlichen Produkten
              </p>
            </div>
          </div>
          <div class="col-md-6">
            <div class="d-flex align-items-start">
              <div class="check-icon me-3">
                <i class="bi bi-check-lg"></i>
              </div>
              <p class="text-secondary mb-0">
                <strong>Umweltfreundlich</strong><br>
                Recycelbare Materialien
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Kontakt -->
      <div class="card p-4 p-lg-5 rounded-4 shadow-sm">
        <div class="d-flex align-items-center mb-4">
          <div class="info-icon me-3">
            <i class="bi bi-question-circle"></i>
          </div>
          <h2 class="fw-bold m-0">Fragen zum Versand?</h2>
        </div>
        <p class="text-secondary">
          Bei Fragen zu Ihrer Bestellung oder zum Versand stehen wir Ihnen gerne zur Verfügung. 
          Kontaktieren Sie uns unter 
          <a href="mailto:info@ricetti-pittari.it" class="text-accent">info@ricetti-pittari.it</a> 
          oder über unser <router-link to="/kontakt" class="text-accent">Kontaktformular</router-link>.
        </p>
      </div>

      <!-- Zurück Button -->
      <div class="text-center mt-5">
        <router-link to="/" class="btn btn-accent btn-lg">
          <i class="bi bi-arrow-left me-2"></i> Zurück zur Startseite
        </router-link>
      </div>

    </div>
  </section>
</template>

<style scoped>
.legal-hero {
  background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), 
                    url('https://nucccio.github.io/casellese-images/cip-kontakt-2.webp');
  background-size: cover;
  height: 40vh;
  background-position: center;
  color: white;
}

.legal-container {
  max-width: 900px;
}

.card {
  border: none;
}

.border-accent {
  border-left: 5px solid #e54c4c !important;
}

.text-accent {
  color: #e54c4c;
}

.text-accent:hover {
  color: #c94141;
}

.info-icon {
  width: 50px;
  height: 50px;
  background-color: #e54c4c;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  flex-shrink: 0;
}

.delivery-card {
  background-color: #f8f9fa;
  border: 2px solid #e9ecef;
}

.delivery-card.express {
  background-color: #fff5f5;
  border: 2px solid #e54c4c;
}

.delivery-icon {
  width: 40px;
  height: 40px;
  background-color: #6c757d;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
}

.delivery-icon.express {
  background-color: #e54c4c;
}

.partner-card {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  transition: 0.3s;
}

.partner-card:hover {
  border-color: #e54c4c;
  transform: translateY(-5px);
}

.check-icon {
  width: 30px;
  height: 30px;
  background-color: #28a745;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.table th {
  font-weight: 600;
}

.alert-success {
  background-color: #d4edda;
  border-color: #c3e6cb;
  color: #155724;
}
</style>