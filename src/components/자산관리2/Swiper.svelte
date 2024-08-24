<script>
  import { onMount } from "svelte";
  import Swiper from "swiper";
  import "swiper/swiper-bundle.min.css"; // Ensure CSS is loaded
  import FirstMenu from "./SwiperMenu/FirstMenu.svelte";
  import SecondMenu from "./SwiperMenu/SecondMenu.svelte";
  import ThirdMenu from "./SwiperMenu/ThirdMenu.svelte";
  import FourthMenu from "./SwiperMenu/FourthMenu.svelte";
  import FifthMenu from "./SwiperMenu/FifthMenu.svelte";

  let currentPage = null;
  let activeMenu = null;
  let swiperInstance;
  let slides = [];

  const selectPage = (page, menu) => {
    currentPage = page;
    activeMenu = menu;
  };

  for (let i = 1; i <= 30; i++) {
    // Start at 1 for better readability
    slides.push(`자산${i}`);
  }

  let swiperContainer;

  onMount(() => {
    swiperInstance = new Swiper(swiperContainer, {
      loop: false, // Ensure no looping
      slidesPerView: 8,
      spaceBetween: 15,
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

  <div class="header">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <h3
      on:click="{() => selectPage(FirstMenu, '자산개요')}"
      class="{activeMenu === '자산개요' ? 'active' : ''}"
    >
      자산개요
    </h3>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <h3
      on:click="{() => selectPage(SecondMenu, 'CVE/CPE')}"
      class="{activeMenu === 'CVE/CPE' ? 'active' : ''}"
    >
      CVE/CPE
    </h3>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <h3
      on:click="{() => selectPage(ThirdMenu, '보안감사')}"
      class="{activeMenu === '보안감사' ? 'active' : ''}"
    >
      보안감사
    </h3>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <h3
      on:click="{() => selectPage(FourthMenu, 'CCE점검이력')}"
      class="{activeMenu === 'CCE점검이력' ? 'active' : ''}"
    >
      CCE점검이력
    </h3>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <h3
      on:click="{() => selectPage(FifthMenu, '자산현황보고서')}"
      class="{activeMenu === '자산현황보고서' ? 'active' : ''}"
    >
      자산현황보고서
    </h3>
  </div>

  {#if currentPage}
    <div class="right_menu">
      <svelte:component this="{currentPage}" />
    </div>
  {/if}
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
    background: #f9f9f9;
    text-align: center;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
    cursor: pointer;
  }
  .swiper-slide:hover {
    transform: scale(1.2);
  }

  .header {
    display: flex;
    flex-direction: row;
    gap: 50px;
    padding-left: 40px;
    width: 100%;
    color: #fff;
  }
  .header h3 {
    color: #ffffff; /* Primary Header Color */
    font-weight: 600;
    font-size: 16px;
    transition: color 0.3s ease;
  }
  .header h3:hover {
    color: #002244; /* Hover state for primary header */
    text-decoration: underline;
    cursor: pointer;
  }
  .header h3:hover,
  .header h3.active {
    color: #001a33;
    text-decoration: underline;
  }
</style>
