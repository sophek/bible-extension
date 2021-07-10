<template>
  <div class="wrapper">
    <div style="display: flex; justify-content: space-around" v-show="!isClear">
      <Favorites :data="data" />
      <div class="carousel-clock" style="border: solid 4px #fff"><Clock /></div>
      <div
        class="weather-card"
        :style="`background-image: url(${weatherBackgroundImage})`"
      >
        <Weather @ready="setCurrentWeather" />
      </div>
    </div>
    <div style="display: flex; justify-content: space-around">
      <div class="friends-card">
        <Friend
          name="Sophek Tounn"
          :number="4179898029"
          email="sophek@gmail.com"
        />
        <Friend />
        <Friend />
        <Friend />
        <Friend />
        <Friend />
        <Friend />
        <Friend />
      </div>
      <Bible
        class="bible-panel"
        @getfavorites="listFavorites"
        @clear="setClear"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import Clock from "./components/Clock.vue";
import Bible from "./components/Bible.vue";
import Favorites from "./components/Favorites.vue";
import Weather from "./components/Weather.vue";
import Friend from "./components/Friend.vue";
export default {
  name: "App",
  emits: ["ready"],
  components: {
    Clock,
    Bible,
    Favorites,
    Weather,
    Friend,
  },
  setup() {
    const favoritesData = ref([]);
    const isClear = ref(false);
    const weatherBackgroundImage = ref(
      "https://source.unsplash.com/featured/?"
    );
    const listFavorites = (e) => {
      favoritesData.value = e;
    };
    const data = computed(() => {
      return favoritesData.value;
    });

    const setCurrentWeather = (e) => {
      console.log(e);
      weatherBackgroundImage.value = `${weatherBackgroundImage.value}${e.summary}`;
    };

    const setClear = (e) => {
      isClear.value = e;
    };

    return {
      listFavorites,
      data,
      setCurrentWeather,
      weatherBackgroundImage,
      setClear,
      isClear,
    };
  },
};
</script>

<style>


#app {
  min-height:100vh;
  font-family: "Share Tech Mono", monospace;
}

.bible-panel {
  width: 100%;
    padding: 0px 30px 0px 30px;
}

.weather-card {
  padding: 0px;
  border: 4px solid rgb(255, 255, 255);
  width: 40%;
  border-radius: 20px;
  background-image: url("https://source.unsplash.com/random?weather");
  background-size: cover;
}
.friends-card {
  display:flex;
  flex-direction:column;
  padding:10px;
  width: 400px;
    top: 20px;
    left: 57px;
    position: relative;
    border: 4px solid rgb(255, 255, 255);
    border-radius: 20px;
    background-image: linear-gradient(black, #ffffff7a);
}

.carousel-clock {
    width:300px;
    left:30px;
    top:0px;
    background-image: url(https://source.unsplash.com/random?nature);
          background-size: cover;
          border-radius: 20px;
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
    padding:50px;
    margin: auto;
    display: block;
    color: white;
    background-color: #00000096;
    width: 100%;
    min-height: 100vh;
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