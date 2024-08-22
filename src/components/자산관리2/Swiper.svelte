<script>
  import { onMount } from "svelte";
  import Swiper from "swiper";
  import "swiper/swiper-bundle.min.css"; // Ensure CSS is loaded

  let swiperInstance;
  let slides = [];

  for (let i = 1; i <= 30; i++) {
    // Start at 1 for better readability
    slides.push(`chasanGroup${i}`);
  }

  let swiperContainer;

  onMount(() => {
    swiperInstance = new Swiper(swiperContainer, {
      loop: false, // Ensure no looping
      slidesPerView: 8,
      spaceBetween: 10,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });

    return () => {
      if (swiperInstance) {
        swiperInstance.destroy(true, true);
      }
    };
  });
</script>

<main>
  <div bind:this="{swiperContainer}" class="swiper-container">
    <div class="swiper-wrapper">
      {#each slides as slide}
        <div class="swiper-slide">{slide}</div>
      {/each}
    </div>
    <div class="swiper-pagination"></div>
    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>
  </div>
</main>

<style>
  .swiper-container {
    max-width: 1000px;
    height: 100px;
    justify-content: center;
    margin-top: 10px;
  }
  .swiper-slide {
    max-width: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    background: #ccc;
    text-align: center;
  }
</style>
