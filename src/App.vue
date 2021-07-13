<template>
  <div class="wrapper">
    <div
      class="p-d-flex p-flex-column p-flex-md-row p-jc-between"
      style="width: 100%"
    >
      <Div :padding="0">
        <Favorites :data="data" />
      </Div>
      <Div :padding="0" background="https://source.unsplash.com/random?weather"
        ><Clock
      /></Div>

      <Div :padding="0" :background="weatherBackgroundImage">
        <Weather @ready="setCurrentWeather" />
      </Div>
    </div>

    <div
      class="p-d-flex p-flex-column p-flex-md-row p-jc-between"
      style="width: 100%; margin-top: 20px"
    >
      <Div>
        <Friends />
      </Div>

      <Div :padding="0" :h="600">
        <Bible
          class="bible-panel"
          @getfavorites="listFavorites"
          @clear="setClear"
        />
      </Div>
      <Div>
        <Friends />
      </Div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import Clock from "./components/Clock.vue";
import Bible from "./components/Bible.vue";
import Favorites from "./components/Favorites.vue";
import Weather from "./components/Weather.vue";
import Friends from "./components/Friends.vue";
import Div from "./components/Div.vue";
export default {
  name: "App",
  emits: ["ready"],
  components: {
    Clock,
    Bible,
    Favorites,
    Weather,
    Friends,
    Div,
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
      weatherBackgroundImage.value = `${
        weatherBackgroundImage.value
      }${encodeURIComponent(e.summary)}`;
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
  padding: 20px;
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