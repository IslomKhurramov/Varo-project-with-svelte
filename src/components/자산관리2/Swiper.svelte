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
    color: #000000;
    display: flex;
    border-radius: 10px;
    border: 1px solid black;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    background: lightgray;
    text-align: center;
    box-shadow:
      0 2px 1px rgba(0, 0, 0, 0.09),
      0 4px 2px rgba(0, 0, 0, 0.09),
      0 8px 4px rgba(0, 0, 0, 0.09),
      0 16px 8px rgba(0, 0, 0, 0.09),
      0 32px 16px rgba(0, 0, 0, 0.09);
    transition: transform 0.3s ease;
    cursor: pointer;
  }
  .swiper-wrapper {
    height: 89px;
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
    color: #000000;
  }
  .header h3 {
    color: black;
    font-weight: bold;
    font-size: 12px;
    cursor: pointer;
  }
  .header h3 {
    background-image: linear-gradient(to right, #5486d6, #54b3d6 50%, #000 50%);
    background-size: 200% 100%;
    background-position: -100%;
    display: inline-block;
    padding: 5px 0;
    position: relative;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    transition: all 0.3s ease-in-out;
  }

  .header h3:before {
    content: "";
    background: #54b3d6;
    display: block;
    position: absolute;
    bottom: -3px;
    left: 0;
    width: 0;
    height: 3px;
    transition: all 0.3s ease-in-out;
  }

  .header h3:hover {
    background-position: 0;
  }
  .header h3.active {
    color: #3183a0; /* Ensures active text color is visible */
    -webkit-text-fill-color: #3183a0; /* Override webkit text fill */
    background-image: none; /* Remove the gradient on active */
    text-decoration: underline;
  }
  .header h3:hover::before {
    width: 100%;
  }
</style>
