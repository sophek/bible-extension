<template>
  <div class="wrapper">
    <div class="weather-panel">
      <Clock style="width: 20%" />
      <Weather />
    </div>
    <div style="display: flex">
      <Favorites style="width: 40%" :data="data" />
      <Bible style="width: 60%; padding: 30px" @getfavorites="listFavorites" />
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import Clock from "./components/Clock.vue";
import Bible from "./components/Bible.vue";
import Favorites from "./components/Favorites.vue";
import Weather from "./components/Weather.vue";
export default {
  name: "App",
  components: {
    Clock,
    Bible,
    Favorites,
    Weather,
  },
  setup() {
    const favoritesData = ref([]);
    const listFavorites = (e) => {
      favoritesData.value = e;
    };
    const data = computed(() => {
      return favoritesData.value;
    });
    return {
      listFavorites,
      data,
    };
  },
};
</script>

<style>


#app {
  height:100vh;
  font-family: "Share Tech Mono", monospace;
}

.weather-panel {
  padding: 50px;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-content: stretch;
    justify-content: center;
}

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  .wrapper {
    text-align: center;
    margin: auto;
    display: block;
    color: white;
    background-color: #00000096;
    width: 100%;
    height: 100%;
  }
  
  body {
    font-family: "Share Tech Mono", monospace;
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif;
    background-image: url(https://source.unsplash.com/random?nature);
    background-size: cover;
    background-color: black;
    background-repeat: no-repeat;
    
  }
</style>