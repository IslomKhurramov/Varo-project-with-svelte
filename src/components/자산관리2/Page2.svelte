<script>
  import AssetCardsPage from "./AssetCardsPage.svelte";
  import Modal from "../../shared/Modal.svelte";
  import ModalChasanGroup from "./ModalChasanGroup.svelte";
  import Swiper from "./Swiper.svelte";

  let currentView = "default";
  let currentPage = null;
  let activeMenu = null;
  let assets = ["자산그룹 1"];
  let showModal = false;

  const selectPage = (page, menu) => {
    currentPage = page;
    activeMenu = menu;
  };

  function toggleView() {
    currentView = currentView === "default" ? "newView" : "default";
  }
</script>

<main class="container">
  <div class="container_aside">
    <aside>
      <div class="add_delete_container">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <button class="menu_button">신규점검</button>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <button class="menu_button">이력삭제</button>
      </div>

      {#each assets as asset, index}
        <div class="chasanGroup_button">
          <!-- svelte-ignore a11y-invalid-attribute -->
          <!-- svelte-ignore missing-declaration -->
          <a
            href="javascript:void(0)"
            on:click="{() => selectPage(AssetPage, asset)}"
            class="{activeMenu === asset ? 'active' : ''}"
          >
            <i class="fa fa-user-o" aria-hidden="true"></i>
            {asset}
          </a>
          <button class="asset_button">자산관리</button>
        </div>
      {/each}

      <div class="social">
        <a
          href="https://www.linkedin.com/in/florin-cornea-b5118057/"
          target="_blank"
        >
          <i class="fa fa-linkedin"></i>
        </a>
      </div>
    </aside>
  </div>
  <div class="right_menu">
    <header class="header">
      <div class="header_option">
        <button on:click="{toggleView}" style="width:30px">
          <span class="arrow">&#9662;</span></button
        >
        <form action="/action_page.php" class="form_select">
          <select name="cars" id="cars">
            <option value="등록승인여부"> 등록승인여부 </option>
          </select>
          <span class="arrow">&#9662;</span>
          <select name="cars" id="자산그룹명">
            <option value="volvo">자산그룹명</option>
          </select>
          <span class="arrow">&#9662;</span>
          <select name="cars" id="운영체제">
            <option value="volvo">운영체제</option>
          </select>
          <span class="arrow">&#9662;</span>
          <select name="cars" id="에이전트여부">
            <option value="volvo">에이전트여부</option>
          </select>
          <span class="arrow">&#9662;</span>
        </form>
      </div>
      <div class="header_button">
        <p>자산명</p>
        <p>엑셀다운로드</p>
      </div>
    </header>
    <div class="second_line">
      <button>자산상세검색</button>
      <button>정보수집</button>
    </div>
    <div class="second_line">
      <button on:click="{() => (showModal = true)}">자산그룹별등록추세</button>
      <button>요약보고서출력</button>
      <button>상세보고서출력</button>
      <button>목록엑셀저장</button>
    </div>
    {#if currentView === "default"}
      <AssetCardsPage />
    {:else}
      <div class="swiper-container">
        <Swiper />
        <!-- Render the new component based on state -->
      </div>
    {/if}
  </div>

  <Modal bind:showModal>
    <ModalChasanGroup />
  </Modal>
</main>

<style>
  .container_aside {
    min-height: 100vh;
    background-image: linear-gradient(30deg, #0048bd, #2c3e50);
    padding: 10px;
  }

  aside {
    color: #fff;
    width: 170px;
    font-size: 16px;
  }

  .add_delete_container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
  }

  .menu_button {
    background-color: #2c3e50;
    color: #fff;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    text-align: center;
    transition: background-color 0.3s ease;
  }

  .menu_button:hover {
    background-color: #003366;
    box-shadow: 0.5px 1px 0.5px 1px #161515;
  }

  .chasanGroup_button {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }

  .chasanGroup_button a {
    flex-grow: 1;
    font-size: 14px;
    color: #fff;
    text-decoration: none;
    font-weight: 600;
    -webkit-tap-highlight-color: transparent;
  }

  .chasanGroup_button .asset_button {
    background-color: #d9534f;
    color: #fff;
    border: none;
    padding: 5px 10px;
    font-size: 12px;
    cursor: pointer;
    border-radius: 3px;
    margin-left: 10px;
    transition: background-color 0.3s ease;
  }

  .chasanGroup_button .asset_button:hover {
    background-color: #003366;
    box-shadow: 0.5px 1px 0.5px 1px #161515;
  }

  .social {
    margin-top: 20px;
  }

  .social a {
    display: inline-block;
    color: #fff;
    font-size: 18px;
    margin-right: 10px;
    transition: color 0.3s ease;
  }

  .social a:hover {
    color: #0077b5;
  }
  aside a {
    font-size: 16px;
    color: #fff;
    display: block;
    padding: 12px 10px;
    font-weight: 600;
    -webkit-tap-highlight-color: transparent;
  }

  aside a:hover {
    margin-top: 3px;
    text-decoration: underline;
  }
  aside a:hover,
  aside a.active {
    text-decoration: underline;
    margin-top: 3px;
  }

  aside a i {
    margin-right: 5px;
  }

  aside a:hover::after {
    content: "";
    position: absolute;
    background-color: transparent;
    bottom: 100%;
    right: 0;
    height: 35px;
    width: 35px;
    /* border-bottom-right-radius: 18px; */
    box-shadow: 0 20px 0 0 #fff;
  }

  aside a:hover::before {
    content: "";
    position: absolute;
    background-color: transparent;
    top: 38px;
    right: 0;
    height: 35px;
    width: 35px;
    /* border-top-right-radius: 18px; */
    box-shadow: 0 -20px 0 0 #fff;
  }

  .container {
    display: flex;
    flex-direction: row;
    width: 100%;
    margin-left: 20px;
  }

  .right_menu {
    width: 100%;
  }

  .add_delete_container {
    display: flex;
    flex-direction: row;
    z-index: 1000;
    justify-content: space-around;
    width: 100%;
  }
  .add_delete_container button {
    width: auto;
    font-size: 12px;
    width: 70px;

    cursor: pointer;
    background-color: #2c3e50;
    color: #fff;
    border: none;
  }
  .add_delete_container button:hover {
    box-shadow: 0.5px 1px 0.5px 1px #161515;
  }
  .right_menu {
    width: 100%;
    margin-left: 20px;
    min-height: 500px; /* Set a min-height for the right menu */
    display: flex;
    flex-direction: column;
    justify-content: flex-start; /* Make sure content starts from the top */
    box-sizing: border-box;
  }
  .swiper-container {
    flex-grow: 1; /* Make the Swiper take up the remaining space */
    min-height: inherit; /* Inherit the min-height from the parent */
    box-sizing: border-box; /* Include padding/border in height/width calculations */
  }
  .header {
    display: flex;
    width: 100%;
    flex-direction: row;
    margin-left: 5px;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;
    font-weight: bold;
  }
  .form_select select {
    appearance: none; /* Removes default dropdown styling in modern browsers */
    -webkit-appearance: none; /* Safari */
    -moz-appearance: none; /* Firefox */
    background: none;
    border: none;
    padding: 0;
    font-size: 16px;
    margin-left: 10px;
    color: inherit; /* Inherits the color of the surrounding text */
    cursor: pointer;
    color: #fff;
  }
  .arrow {
    color: #fff;
  }

  .form_select select::-ms-expand {
    display: none; /* Removes the dropdown arrow in Internet Explorer */
  }

  .form_select {
    display: flex;
    gap: 10px; /* Adds spacing between select elements */
  }

  .form_select select option {
    padding: 5px 0;
  }
  .header_option {
    display: flex;
    flex-direction: row;
  }
  .header_option button {
    cursor: pointer;
    background-color: #003366; /* Darker Blue */
    color: #ffffff;
    border: 1px solid #003366;
  }
  .header_option button:hover {
    box-shadow: 0.5px 1px 0.5px 1px #161515;
  }
  .header_button {
    display: flex;
    flex-direction: row;
    width: 30%;
    gap: 40px;
  }
  .header_button p {
    cursor: pointer;
    color: #ffffff; /* Primary Header Color */
    font-weight: 600;
    font-size: 16px;
    transition: color 0.3s ease;

    font-weight: normal;
    border: none;
  }
  .header_button p:hover {
    color: #002244; /* Hover state for primary header */
    text-decoration: underline;
    cursor: pointer;
  }
  .second_line {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    gap: 20px;
    margin-top: 5px;
  }
  .second_line button {
    background-color: #003366; /* Darker Blue */
    color: #ffffff;

    border-radius: 5px;
    height: 40px;

    width: 150px;
    cursor: pointer;
  }
  .second_line button:hover {
    background-color: #002244;
    transform: translateY(-2px);
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }
  .second_line button:hover {
    box-shadow: 0.5px 1px 0.5px 1px #161515;
  }
</style>
