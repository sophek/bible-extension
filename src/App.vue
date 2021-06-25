<template>
  <div class="wrapper">
    <div>
      <Clock />
      <Bible />
      <FlashCard />
    </div>
  </div>
</template>

<script>
import Clock from "./components/Clock.vue";
import Bible from "./components/Bible.vue";
import FlashCard from "./components/FlashCard.vue";
export default {
  name: "App",
  components: {
    Clock,
    Bible,
    FlashCard,
  },
  setup() {
    return {};
  },
};
</script>

<style>
#app {
  height:100vh;
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
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif;
    background-image: url(https://source.unsplash.com/random?nature);
    background-size: cover;
    background-color: black;
    background-repeat: no-repeat;
    
  }
</style>