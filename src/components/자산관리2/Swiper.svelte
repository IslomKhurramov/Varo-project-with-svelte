<script>
  import { onMount } from "svelte";
  import Swiper from "swiper";
  import "swiper/swiper-bundle.min.css";
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
    slides.push(`자산${i}`);
  }

  let swiperContainer;

  onMount(() => {
    swiperInstance = new Swiper(swiperContainer, {
      loop: false,
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

  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
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
    <h3
      on:click="{() => selectPage(ThirdMenu, '보안감사')}"
      class="{activeMenu === '보안감사' ? 'active' : ''}"
    >
      보안감사
    </h3>
    <h3
      on:click="{() => selectPage(FourthMenu, 'CCE점검이력')}"
      class="{activeMenu === 'CCE점검이력' ? 'active' : ''}"
    >
      CCE점검이력
    </h3>
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
  /* Swiper Styles */
  .swiper-container {
    max-width: 1000px;
    margin: 20px auto;
    padding: 10px 0;
    background-color: #f0f0f0;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .swiper-slide {
    height: 50px;
    max-width: 300px;
    color: #333;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    background: #fff;
    border-radius: 10px;
    box-shadow:
      0 2px 4px rgba(0, 0, 0, 0.1),
      0 4px 8px rgba(0, 0, 0, 0.1);
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
    cursor: pointer;
  }

  .swiper-slide:hover {
    transform: scale(1.1);
    box-shadow:
      0 4px 8px rgba(0, 0, 0, 0.2),
      0 8px 16px rgba(0, 0, 0, 0.2);
  }

  .swiper-pagination,
  .swiper-button-prev,
  .swiper-button-next {
    color: #007acc;
  }

  /* Header Styles */
  .header {
    display: flex;
    flex-direction: row;
    gap: 20px;
    padding: 20px 0;
    justify-content: center;
    background-color: #007acc;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .header h3 {
    color: #fff;
    font-weight: bold;
    font-size: 14px;
    cursor: pointer;
    position: relative;
    padding-bottom: 5px;
    transition: color 0.3s ease;
  }

  .header h3.active {
    color: #ffeb3b;
    text-decoration: underline;
  }

  .header h3:hover::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: #ffeb3b;
  }

  /* Right Menu Styles */
  .right_menu {
    margin-top: 20px;
  }
</style>
