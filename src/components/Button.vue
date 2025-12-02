<script setup>
const props = defineProps({
  type: { type: String, default: 'button' },
  variant: { type: String, default: 'accent' },
  onClick: { type: Function, default: null }
});

const buttonClass = `btn btn-${props.variant}`;
</script>

<template>
  <button :type="type" :class="buttonClass" @click="onClick">
    <slot />
  </button>
</template>

<style scoped>
/* Button styled to the requested color */
.btn-accent {
  background-color: #e54c4c;
  border-color: #e54c4c;
  color: #ffffff;
  text-decoration: none;
}

/* Slightly darker on hover/focus for affordance */
.btn-accent:hover,
.btn-accent:focus {
  background-color: #d44444;
  border-color: #d44444;
  color: #ffffff;
  text-decoration: none;
}

/* Active state */
.btn-accent:active {
  background-color: #c43b3b;
  border-color: #c43b3b;
  color: #ffffff;
}

/* Light variant for banner close button */
.btn-light {
  background-color: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  color: #ffffff;
  text-decoration: none;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.btn-light:hover,
.btn-light:focus {
  background-color: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.4);
  color: #ffffff;
  text-decoration: none;
}

.btn-light:active {
  background-color: rgba(255, 255, 255, 0.4);
  border-color: rgba(255, 255, 255, 0.5);
  color: #ffffff;
}

/* Ensure anchor acting as button has the expected cursor */
.btn-accent,
.btn-light {
  cursor: pointer;
}
</style>
