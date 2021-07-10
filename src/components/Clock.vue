<template>
  <div id="clock">
    <h1>Good morning</h1>
    <p class="date">{{ date }}</p>
    <p class="time">{{ greetAndConvertTime(time) }}</p>
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  name: "Clock",
  setup() {
    const time = ref("");
    const date = ref("");
    var week = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    setInterval(updateTime, 1000);
    function updateTime() {
      var cd = new Date();
      time.value =
        zeroPadding(cd.getHours(), 2) +
        ":" +
        zeroPadding(cd.getMinutes(), 2) +
        ":" +
        zeroPadding(cd.getSeconds(), 2);
      date.value =
        zeroPadding(cd.getFullYear(), 4) +
        "-" +
        zeroPadding(cd.getMonth() + 1, 2) +
        "-" +
        zeroPadding(cd.getDate(), 2) +
        " " +
        week[cd.getDay()];
    }

    function zeroPadding(num, digit) {
      var zero = "";
      for (var i = 0; i < digit; i++) {
        zero += "0";
      }
      return (zero + num).slice(-digit);
    }

    const greetAndConvertTime = (time) => {
      // Check correct time format and split into components
      time = time
        .toString()
        .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

      if (time.length > 1) {
        // If time format correct
        time = time.slice(1); // Remove full string match value

        time[5] = +time[0] < 12 ? " AM" : " PM"; // Set AM/PM
        time[0] = +time[0] % 12 || 12; // Adjust hours
      }

      time[0] = zeroPadding(time[0], 2);

      return time.join("");
    };

    return {
      time,
      date,
      greetAndConvertTime,
    };
  },
};
</script>
<style scoped>
  #clock {
  font-family: "Share Tech Mono", monospace;
  color: #ffffff;
  text-align: center;
  color: #daf6ff;
  margin-top: 30%;
  text-shadow: 0 0 20px #0aafe6, 0 0 20px rgba(10, 175, 230, 0);
}
#clock .time {
  letter-spacing: 0.05em;
  font-size: 30px;
  padding: 5px 0;
}
#clock .date {
  letter-spacing: 0.1em;
  font-size: 24px;
}
#clock .text {
  letter-spacing: 0.1em;
  font-size: 12px;
  padding: 20px 0 0;
}
</style>