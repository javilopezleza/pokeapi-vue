import { createRouter, createWebHistory } from 'vue-router';
import PokemonListView from '@/views/PokemonListView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'pokemonCard',

      component: PokemonListView
    }
  ]
});

export default router;
