<script>
  import { onMount } from "svelte";
  import Swiper, { Navigation, Pagination } from "swiper";
  import "swiper/swiper-bundle.min.css";
  import FirstMenu from "./SwiperMenu/FirstMenu.svelte";
  import SecondMenu from "./SwiperMenu/SecondMenu.svelte";
  import ThirdMenu from "./SwiperMenu/ThirdMenu.svelte";
  import FourthMenu from "./SwiperMenu/FourthMenu.svelte";
  import FifthMenu from "./SwiperMenu/FifthMenu.svelte";
  import { assetDeatilInfo } from "../../services/page2/asset.store";
  import { allAssetList } from "../../services/page2/asset.store";
  import { getDetailInformationOfAsset } from "../../services/page2/assetService";
  let currentPage = null;
  let activeMenu = null;
  let swiperInstance;
  let slides = [];
  let swiperContainer;
  let uuid_asset = ""; // Store the clicked UUID
  let assetDetail = {};

  const selectPage = (page, menu) => {
    currentPage = page;
    activeMenu = menu;
  };
  /******************************************************/
  async function assetListDetail(uuid) {
    try {
      const response = await getDetailInformationOfAsset(uuid);

      // Check if the response is successful
      if (response) {
        // Log the detailed data of the asset
        console.log("Detail of asset:", response);
        assetDetail = response; // Store the asset details
      } else {
        console.error("Failed to get asset details.");
      }
    } catch (err) {
      alert(`Error getting asset details: ${err.message}`);
      console.error(`Error fetching asset details: ${err.message}`);
    }
  }

  // Handle the UUID click and fetch the asset details
  function handleAssetClick(uid) {
    uuid_asset = uid;
    console.log("UUID", uuid_asset);
    assetListDetail(uuid_asset); // Fetch asset details when a slide is clicked
  }
  /****************************************************/
  for (let i = 1; i <= 30; i++) {
    slides.push(`자산${i}`);
  }

  onMount(() => {
    swiperInstance = new Swiper(swiperContainer, {
      modules: [Navigation, Pagination],
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
  <div class="swiper_container1">
    <img src="./images/left.png" alt="left" />
    <div bind:this="{swiperContainer}" class="swiper-container">
      <div class="swiper-wrapper">
        {#each $allAssetList as asset}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <div
            class="swiper-slide"
            on:click="{() => handleAssetClick(asset.ass_uuid)}"
          >
            {asset.ast_hostname}
          </div>
        {/each}
      </div>
      <div class="swiper-pagination"></div>
      <div class="swiper-button-prev"></div>
      <div class="swiper-button-next"></div>
    </div>
    <img
      src="./images/left.png"
      style="transform: rotate(180deg);"
      alt="right"
    />
  </div>

  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="header">
    <h3
      on:click="{() => selectPage(FirstMenu, '자산개요')}"
      class="{activeMenu === '자산개요' ? 'active' : ''}"
    >
      자산개요
    </h3>
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
  main {
    width: 100%;
  }

  /* Swiper Styles */
  .swiper-container {
    width: 100%;
    margin: 20px auto;
    padding: 10px 0;
    background-color: #f0f0f0;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    position: relative;
  }
  .swiper_container1 {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .swiper_container1 img {
    width: 50px;
    height: auto;
  }
  .swiper-wrapper {
    display: flex;
  }

  .swiper-slide {
    height: 50px;
    max-width: 300px;
    color: #333;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
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

  .swiper-pagination {
    color: #007acc;
  }

  /* Move the left and right navigation buttons outside the swiper container */
  .swiper-button-prev,
  .swiper-button-next {
    color: #007acc;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
  }

  .swiper-button-prev {
    left: -50px;
  }

  .swiper-button-next {
    right: -50px;
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
    font-size: 12px;
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
