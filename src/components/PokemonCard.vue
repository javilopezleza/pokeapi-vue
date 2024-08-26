<template>
  <div
    class="pokemon-card flex flex-col items-center border border-gray-300 p-4 m-2 rounded-lg shadow-lg cursor-pointer hover:bg-gray-600"
    @click="handleClick"
  >
    <h2 class="text-xl font-bold mb-4">{{ pokemon.name }}</h2>
    <div class="default flex flex-row space-x-4 mb-4">
      <img
        v-if="pokemon.sprites.front_default"
        :src="pokemon.sprites.front_default"
        alt="Sprite de {{ pokemon.name }}"
        class="w-24 h-24 object-cover"
      />
      <img
        v-if="pokemon.sprites.back_default"
        :src="pokemon.sprites.back_default"
        alt="Sprite de {{ pokemon.name }}"
        class="w-24 h-24 object-cover"
      />
    </div>
    <div class="shiny flex flex-row space-x-4">
      <img
        v-if="pokemon.sprites.front_shiny"
        :src="pokemon.sprites.front_shiny"
        alt="Sprite de {{ pokemon.name }}"
        class="w-24 h-24 object-cover"
      />
      <img
        v-if="pokemon.sprites.back_shiny"
        :src="pokemon.sprites.back_shiny"
        alt="Sprite de {{ pokemon.name }}"
        class="w-24 h-24 object-cover"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

interface PokemonType {
  type: {
    name: string;
  };
}

interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default?: string;
    back_default?: string;
    front_shiny?: string;
    back_shiny?: string;
  };
  types: PokemonType[];
}

const props = defineProps<{
  pokemon: Pokemon;
}>();

const emit = defineEmits<{
  (e: 'select', pokemon: Pokemon): void;
}>();

function handleClick() {
  emit('select', props.pokemon);
}
</script>

<style scoped>
.pokemon-card {
  transition: 0.3s ease;
}
</style>
