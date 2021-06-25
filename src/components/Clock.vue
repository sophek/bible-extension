<template>
  <div>
    <h1 class="time">{{ dateTimeStr }}</h1>
    <h3 class="greet">{{ greeting }}</h3>
  </div>
</template>

<script>
import { ref, onBeforeMount, onBeforeUnmount } from "vue";
const date = new Date();
export default {
  name: "Clock",
  setup() {
    const dateTimeStr = ref("00:00:00");
    const greeting = ref("Good");
    const dateTime = ref({
      hours: date.getHours(),
      minutes: date.getMinutes(),
      seconds: date.getSeconds(),
    });

    const timer = ref(undefined);

    const setDateTime = () => {
      const date = new Date();
      dateTime.value = {
        hours: date.getHours(),
        minutes: date.getMinutes(),
        seconds: date.getSeconds(),
      };

      let minutesStr = date.getMinutes().toString();
      let hourStr = date.getHours().toString();

      let minutes = minutesStr.length === 1 ? "0" + minutesStr : minutesStr;

      let hour = hourStr.length === 1 ? "0" + hourStr : hourStr;

      let finalTime = `${hour}:${minutes}`;
      greetAndConvertTime(finalTime);
    };

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

        if (time[5] === " AM") {
          greeting.value = " Good morning";
        } else if (time[5] === " PM" && time[5] <= 6) {
          greeting.value = " Good afternoon";
        } else if (time[0] >= 6 && time[5] === " PM") {
          greeting.value = " Good evening";
        }
      }

      dateTimeStr.value = time.join("");
    };

    onBeforeMount(() => {
      timer.value = setInterval(setDateTime, 1000);
    });

    onBeforeUnmount(() => {
      clearInterval(timer.value);
    });

    return { greetAndConvertTime, dateTimeStr, greeting };
  },
};
</script>
<style scoped>
  .time {
    font-size: 8rem;
    font-weight: 600;
    margin-bottom: 4px;
  }
  .greet {
    font-size: 2.5rem;
    font-weight: 400;
    text-shadow: #CCC 1px 0 10px; 
  }
</style>