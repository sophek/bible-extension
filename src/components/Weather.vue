<template>
  <div class="weather-today">
    <h1>{{ weatherCurrently.summary }}</h1>
    <h2>{{ currentTemp }}° F / {{ fahrenheitToCelsius }}° C</h2>
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
import { ref, computed, watch } from "vue";
import axios from "axios";
//import db from "./../mydatabase";

export default {
  name: "Weather",
  components: {
    WeatherDay,
  },
  setup(props, { emit }) {
    const weatherForecast = ref([]);
    const weatherCurrently = ref([]);
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon"];
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

    watch(weatherCurrently, (newValue) => {
      console.log("weatherCurrently", newValue);
      emit("ready", newValue);
    });

    const getLocationAndWeather = () => {
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

    getLocationAndWeather();

    console.log({ weatherForecast: weatherForecast });

    // const saveWeatherByDate = async (data, date) => {
    //   var id = await db.weather.put({
    //     data: data,
    //     date: date,
    //   });
    //   if (id) {
    //     console.log("save weather");
    //   }
    // };

    const currentTemp = computed(() => {
      return weatherCurrently.value.temperature
        ? weatherCurrently.value.temperature.toFixed(0)
        : 0;
    });

    const fahrenheitToCelsius = computed(() => {
      return (currentTemp.value - 32) * (5 / 9).toFixed(0);
    });

    return {
      fahrenheitToCelsius,
      currentTemp,
      weatherType,
      weatherForecast,
      weatherCurrently,
    };
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