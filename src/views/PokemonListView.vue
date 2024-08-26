<template>
  <div class="pokemon-list-view flex flex-col p-6">
    <!-- Spinner de carga -->
    <div v-if="loading" class="spinner-overlay">
      <div class="spinner"></div>
    </div>

    <!-- Lista de Pokémon -->
    <div
      v-else
      class="pokemon-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      <PokemonCard
        v-for="pokemon in pokemons"
        :key="pokemon.name"
        :pokemon="pokemon"
        @select="selectPokemon"
      />
    </div>

    <!-- Detalles del Pokémon seleccionado -->
    <div v-if="selectedPokemon" class="pokemon-detail">
      <h1 class="text-3xl font-bold mb-4">{{ selectedPokemon.name }}: {{ selectedPokemon.id }}</h1>
      <div class="default flex flex-row space-x-6 mb-4">
        <img
          v-if="selectedPokemon.sprites.front_default"
          :src="selectedPokemon.sprites.front_default"
          alt="Sprite de {{ selectedPokemon.name }}"
          class="w-40 h-40 object-cover"
        />
        <img
          v-if="selectedPokemon.sprites.back_default"
          :src="selectedPokemon.sprites.back_default"
          alt="Sprite de {{ selectedPokemon.name }}"
          class="w-40 h-40 object-cover"
        />
      </div>
      <div class="shiny flex flex-row space-x-6">
        <img
          v-if="selectedPokemon.sprites.front_shiny"
          :src="selectedPokemon.sprites.front_shiny"
          alt="Sprite de {{ selectedPokemon.name }}"
          class="w-40 h-40 object-cover"
        />
        <img
          v-if="selectedPokemon.sprites.back_shiny"
          :src="selectedPokemon.sprites.back_shiny"
          alt="Sprite de {{ selectedPokemon.name }}"
          class="w-40 h-40 object-cover"
        />
      </div>
      <div class="types mt-4">
        <p><strong>Tipos:</strong></p>
        <ul>
          <li v-for="type in pokemonTypes" :key="type">{{ type }}</li>
        </ul>
      </div>
      <span>Generación {{ generation }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import PokemonCard from '@/components/PokemonCard.vue';

interface Sprites {
  front_default?: string;
  back_default?: string;
  front_shiny?: string;
  back_shiny?: string;
}

interface PokemonType {
  type: {
    name: string;
  };
}

interface Pokemon {
  id: number;
  name: string;
  sprites: Sprites;
  types: PokemonType[];
}

const pokemons = ref<Pokemon[]>([]);
const selectedPokemon = ref<Pokemon | null>(null);
const generation = ref<number | null>(null);
const pokemonTypes = ref<string[]>([]);
const loading = ref<boolean>(true);

onMounted(async () => {
  try {
    const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=9999');
    const pokemonUrls = response.data.results.map((pokemon: { url: string }) => pokemon.url);

    const pokemonDetailsPromises = pokemonUrls.map((url: string) => axios.get(url));
    const pokemonDetailsResponses = await Promise.all(pokemonDetailsPromises);

    pokemons.value = pokemonDetailsResponses.map((response: { data: any }) => {
      const { id, name, sprites, types } = response.data; // Incluye el ID
      return { id, name, sprites, types }; // Asegúrate de que `id` esté incluido
    });

    loading.value = false; // Termina la carga cuando los datos estén listos
  } catch (error) {
    console.error('Error fetching data from PokeAPI', error);
    loading.value = false; // Termina la carga incluso si ocurre un error
  }
});

async function selectPokemon(pokemon: Pokemon) {
  selectedPokemon.value = pokemon;
  pokemonTypes.value = pokemon.types.map((t) => t.type.name); // Extrae los nombres de los tipos

  // Obtén traducciones de tipos
  const typeTranslations = await fetchTypeTranslations();

  // Traduce los tipos usando el diccionario de traducciones
  pokemonTypes.value = pokemon.types.map((t) => typeTranslations[t.type.name] || t.type.name);

  try {
    // Obtén la información detallada del Pokémon desde la API
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.name}`);
    const speciesData = response.data;

    // Usa el endpoint de generación para obtener la información de la generación
    const generationUrl = speciesData.generation.url;
    const generationId = generationUrl.split('/').filter(Boolean).pop(); // Extrae el ID de la generación
    const generationResponse = await axios.get(
      `https://pokeapi.co/api/v2/generation/${generationId}`
    );
    const generationData = generationResponse.data;

    generation.value = generationData.id; // Asigna el ID de la generación
  } catch (error) {
    console.error('Error fetching Pokémon species data', error);
  }

  async function fetchTypeTranslations(): Promise<Record<string, string>> {
    try {
      const response = await axios.get('https://pokeapi.co/api/v2/type');
      const types = response.data.results;

      // Crea un diccionario para las traducciones
      const typeTranslations: Record<string, string> = {};

      for (const type of types) {
        const typeResponse = await axios.get(type.url);
        const typeData = typeResponse.data;

        // Obtener traducciones en todos los idiomas disponibles
        const names = typeData.names;
        for (const name of names) {
          if (name.language.name === 'es') {
            // Usa el idioma que desees
            typeTranslations[type.name] = name.name;
          }
        }
      }

      return typeTranslations;
    } catch (error) {
      console.error('Error fetching type translations', error);
      return {};
    }
  }
}
</script>

<style scoped>
.pokemon-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
}

.pokemon-detail {
  position: fixed;
  top: 10%;
  right: 20%;
  width: 400px; /* Ajusta el ancho según lo necesites */
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: transparent; /* Elimina el fondo blanco */
  z-index: 1000; /* Asegúrate de que esté sobre otros elementos */
  max-height: calc(100vh - 40px); /* Evita que se desborde verticalmente */
  overflow-y: auto; /* Añade scroll si el contenido es demasiado largo */
}

.pokemon-detail img {
  margin: auto;
  height: auto;
}

.spinner-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999; /* Asegúrate de que esté sobre otros elementos */
}

.spinner {
  border: 8px solid #f3f3f3;
  border-top: 8px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
