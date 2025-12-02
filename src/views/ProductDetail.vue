<script setup>
import { useRoute } from 'vue-router';
import { products } from '@/data.js';

const route = useRoute();

// Holen Sie die ID aus den Routen-Parametern
const productId = route.params.id;

// Finden Sie das Produkt anhand der ID
const product = products.find(p => p.id == productId); 

</script>

<template>
  <div class="container py-5">
    <div v-if="product" class="row">
      <div class="col-md-6">
        <img :src="product.imageUrl_Details || product.imageUrl" :alt="product.title" class="img-fluid d-block mx-auto rounded-5" />
      </div>

      <div class="col-md-6">
        <h1 class="display-6 fw-bold">{{ product.title }}</h1>
        <p class="lead text-secondary">{{ product.description }}</p>

        <div class="mb-4">
            <span class="fs-5 fw-bold text-accent">{{ product.price }} €</span>
        </div>
        
        <p v-if="product.ingredients">
            <span class="fw-bold">Zutaten:</span> {{ product.ingredients }}
        </p>

        <router-link to="/" class="btn btn-outline-dark mt-3">
          Zurück zum Katalog
        </router-link>
      </div>
    </div>

    <div v-else class="text-center py-5">
      <h1 class="display-5">Produkt nicht gefunden</h1>
      <p class="lead">Das gesuchte Rezept existiert leider nicht.</p>
      <router-link to="/" class="btn btn-accent mt-3">
        Zurück zum Katalog
      </router-link>
    </div>
  </div>
</template>

<style scoped>

</style>
