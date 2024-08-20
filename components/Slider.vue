<template>
  <div class="slider-container">
    <div class="slider">
      <button class="prev-btn" @click="prevSlide">&#10094;</button>
      <div class="slides">
        <div
          v-for="(image, index) in images"
          :key="index"
          class="slide"
          :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
        >
          <img :src="image.URL" alt="Variant Image" class="slide-image" />
        </div>
      </div>
      <button class="next-btn" @click="nextSlide">&#10095;</button>
    </div>
    <div class="indicators">
      <span
        v-for="(image, index) in images"
        :key="index"
        :class="{ active: index === currentIndex }"
        @click="goToSlide(index)"
        class="indicator"
      ></span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  images: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const currentIndex = ref(0);

const nextSlide = () => {
  if (currentIndex.value < props.images.length - 1) {
    currentIndex.value += 1;
  } else {
    currentIndex.value = 0;
  }
};

const prevSlide = () => {
  if (currentIndex.value > 0) {
    currentIndex.value -= 1;
  } else {
    currentIndex.value = props.images.length - 1;
  }
};

const goToSlide = (index) => {
  currentIndex.value = index;
};
</script>

<style scoped>
.slider-container {
  position: relative;
  width: 100%;
  max-width: 500px;
  margin: auto;
  overflow: hidden;
}

.slider {
  position: relative;
  width: 100%;
}

.slides {
  display: flex;
  transition: transform 0.5s ease-in-out;
}

.slide {
  flex: 0 0 160px;
  box-sizing: border-box;
  padding: 0 5px;
}

.slide-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.prev-btn,
.next-btn {
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  z-index: 10;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 50%;
}

.prev-btn {
  left: 10px;
}

.next-btn {
  right: 10px;
}

.indicators {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ddd;
  margin: 0 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.indicator.active {
  background: #333;
}
</style>
