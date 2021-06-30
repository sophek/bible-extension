<template>
  <div class="weather-today">
    <h1>{{ weatherCurrently.summary }}</h1>
    <h2>{{ weatherCurrently.temperature }}</h2>
  </div>
  <div style="display: flex">
    <div class="day" :key="day" v-for="day in weatherForecast">
      <WeatherDay
        :day="day.day"
        :low="day.low"
        :high="day.high"
        :icon="day.icon"
      />
    </div>
  </div>
</template>
<script>
import WeatherDay from "./WeatherDay.vue";
import { ref } from "vue";
import axios from "axios";
export default {
  name: "Weather",
  components: {
    WeatherDay,
  },
  setup() {
    const weatherForecast = ref([]);
    const weatherCurrently = ref([]);
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon"];
    const getWeather = (lat, lon) => {
      const options = {
        method: "GET",
        url: `https://dark-sky.p.rapidapi.com/${lat},${lon}`,
        params: { lang: "en", units: "auto" },
        headers: {
          "x-rapidapi-key":
            "HaYl3MylOtmshtUklhDsbZajIUwMp1JiPdJjsnYVjYnwjmO7fP",
          "x-rapidapi-host": "dark-sky.p.rapidapi.com",
        },
      };

      axios
        .request(options)
        .then(function (response) {
          console.log(response.data);
          weatherCurrently.value = response.data.currently;
          weatherForecast.value = response.data.daily.data.map((item, idx) => {
            return {
              day: days[idx],
              low: Math.floor(Number(item.temperatureLow.toFixed(0))),
              high: Math.floor(Number(item.temperatureHigh.toFixed(0))),
              icon: weatherType(item.icon),
            };
          });
        })
        .catch(function (error) {
          console.error(error);
        });
    };

    const getLocation = () => {
      const showPosition = (position) => {
        if (position) {
          console.log("position", position);
          getWeather(position.coords.latitude, position.coords.longitude);
        }
      };
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
      } else {
        console.log("Geolocation is not supported.");
      }
    };

    getLocation();

    console.log({ weatherForecast: weatherForecast });
    const weatherType = (type) => {
      const types = [
        { name: "thunderstorm", icon: "mi mi-fw mi-2x mi-thunderstorm-alt" },
        { name: "partly-cloudy-day", icon: "mi mi-fw mi-2x mi-cloud-sun" },
        { name: "sunny", icon: "mi mi-fw mi-2x mi-sun" },
        { name: "rain", icon: "mi mi-fw mi-2x mi-rain" },
        { name: "heavy-rain", icon: "mi mi-fw mi-2x mi-rain-heavy" },
        { name: "cloudy", icon: "mi mi-fw mi-2x mi-cloud" },
      ];
      return types.find((typ) => typ.name === type)
        ? types.find((typ) => typ.name === type).icon
        : "mi mi-fw mi-2x mi-cloud";
    };

    return { weatherType, weatherForecast, weatherCurrently };
  },
};
</script>
<style scoped>
@import url('https://tomlutzenberger.github.io/meteocons.css/dist/meteocons.min.css');
    .main {
  margin-top: 50px;
}

.day {
  width:14%
}
.weather-panel {
  background-image: url("https://unsplash.it/600/400?image=1043&blur");
  background-size: cover;
  border-radius: 20px;
  box-shadow: 25px 25px 40px 0px rgba(0, 0, 0, 0.33);
  color: #fff;
  overflow: hidden;
  position: relative;
}
.weather-panel small {
  color: inherit;
  font-size: 50%;
}
.weather-panel ul.forecast > li {
  border-top: 1px solid #fff;
}
.weather-panel .temperature > span {
  font-size: 2em;
}

</style>