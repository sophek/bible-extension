<template>
  <div>
    <carousel>
      <slide v-for="(slide, idx) in favorites" :key="idx" style="width: 300px">
        <FlashCard>
          <template v-slot:verse>
            <h1 class="hi-lite" style="margin-top: 130px; color: #daf6ff">
              {{ slide.book }} {{ slide.chapter }}:{{ slide.verse }}
            </h1>
          </template>
          <template v-slot:body>
            <h3 class="hi-lite" style="position: relative; top: 15%">
              {{ slide.text }}
            </h3>
          </template>
        </FlashCard>
      </slide>

      <template #addons>
        <navigation />
      </template>
    </carousel>
  </div>
</template>
<script>
import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide, Navigation } from "vue3-carousel";
import FlashCard from "./FlashCard.vue";
import { computed } from "vue";
export default {
  name: "Favorites",
  props: {
    data: {
      type: Array,
    },
  },
  components: {
    Carousel,
    Slide,
    Navigation,
    FlashCard,
  },
  setup(props) {
    const favorites = computed(() => {
      return props.data;
    });
    return { favorites };
  },
};
</script>
<style>

.hi-lite{
  text-shadow: 0 0 20px #0aafe6, 0 0 20px rgba(10, 175, 230, 0);
}

.carousel__viewport {
  border-radius: 20px;
  background-color: #000000ad;
    border: solid 4px #fff;
}
.carousel__item {
  min-height: 200px;
  width: 100%;
  background-color: var(--carousel-color-primary);
  color:  var(--carousel-color-white);
  font-size: 20px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.carousel {
    width:300px;
    left:30px;
    top:0px;
    background-image: url(https://source.unsplash.com/featured/?inspiration&w=640&q=60);
          background-size: cover;
          border-radius: 20px;
}

.carousel__slide {
  padding: 10px;
}

.carousel__prev,
.carousel__next {
  box-sizing: content-box;
  border: 5px solid white;
  background-color: #000;
}

.carousel__pagination{
  position: absolute;
    top: 55px;
    left: 30px;
}
</style>