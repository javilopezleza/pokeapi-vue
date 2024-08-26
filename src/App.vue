<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/pokemonCard">PokeApi</RouterLink>
      </nav>
    </div>
  </header>

  <main>
    <RouterView />
  </main>
</template>

<style scoped>
/* CSS Scoped for header and nav */

header {
  width: 100%;
  background-color: var(--color-background);
  border-bottom: 1px solid var(--color-border);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed; /* Fix the header at the top */
  top: 0;
  left: 0;
  z-index: 1000; /* Ensure the header is above other content */
}

nav {
  display: flex;
  justify-content: center; /* Center horizontally */
  align-items: center;
  padding: 1rem;
}

nav a {
  padding: 0 1rem;
  color: var(--color-text);
  text-decoration: none;
  font-size: 1rem;
}

nav a.router-link-exact-active {
  color: var(--color-heading);
  border-bottom: 2px solid var(--color-heading);
}

nav a:hover {
  background-color: var(--color-background-soft);
  border-radius: 4px;
}

/* Ensure there's space for the fixed header */
main {
  padding-top: 4rem; /* Adjust according to the header height */
}
</style>
