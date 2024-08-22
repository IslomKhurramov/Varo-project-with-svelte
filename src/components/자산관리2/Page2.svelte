<script>
  import AssetCardsPage from "./AssetCardsPage.svelte";
  import Modal from "../Modal.svelte";
  import ModalChasanGroup from "./ModalChasanGroup.svelte";
  import Swiper from "./Swiper.svelte";

  let currentPage = null;
  let activeMenu = null;
  let assets = ["자산그룹 1"];
  let showModal = false;
  let showModalSecond = false;

  const selectPage = (page, menu) => {
    currentPage = page;
    activeMenu = menu;
  };
</script>

<main class="container">
  <div class="MainPage">
    <div class="container_aside">
      <aside>
        <div class="add_delete_container">
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <button>신규점검</button>
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <button>이력삭제</button>
        </div>

        {#each assets as asset, index}
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
        {/each}
      </aside>

      <div class="social">
        <a
          href="https://www.linkedin.com/in/florin-cornea-b5118057/"
          target="_blank"
        >
          <i class="fa fa-linkedin"></i>
        </a>
      </div>
    </div>
  </div>
  <div class="right_menu">
    <header class="header">
      <div class="header_option">
        <button on:click="{() => (showModalSecond = true)}">down</button>
        <form action="/action_page.php" class="form_select">
          <select name="cars" id="cars">
            <option value="등록승인여부"> 등록승인여부 </option>
          </select>
          <select name="cars" id="자산그룹명">
            <option value="volvo">자산그룹명</option>
          </select>
          <select name="cars" id="운영체제">
            <option value="volvo">운영체제</option>
          </select>
          <select name="cars" id="에이전트여부">
            <option value="volvo">에이전트여부</option>
          </select>
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

    <AssetCardsPage />
  </div>

  <Modal bind:showModal>
    <ModalChasanGroup />
  </Modal>
  <Modal bind:showModalSecond>
    <Swiper />
  </Modal>
</main>

<style>
  .container_aside {
    padding-left: 10px;
  }

  aside {
    color: #fff;
    width: 120px;
    height: 130vh;
    background-image: linear-gradient(30deg, #0048bd, #44a7fd);
    border: 1px solid black;
  }
  .add_delete_container {
    padding-bottom: 10px;
  }
  aside a {
    font-size: 12px;
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
  }
  .add_delete_container {
    display: flex;
    flex-direction: row;

    justify-content: space-around;
    width: 100%;
  }
  .add_delete_container button {
    width: auto;
    font-size: 12px;
    width: 70px;

    cursor: pointer;
    background-color: #44a7fd;
    color: #fff;
    border: none;
  }
  .add_delete_container button:hover {
    box-shadow: 0.5px 1px 0.5px 1px #161515;
  }
  .right_menu {
    width: 100%;
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
  .form_select {
    max-width: 900px;
    display: flex;
    flex-direction: row;
    gap: 20px;
    margin-left: 40px;
  }
  .form_select option {
    font-weight: bold;
    cursor: pointer;
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
    font-size: 14px;
    cursor: pointer;
  }
  .header_button p:hover {
    text-decoration: underline;
    color: #003366;
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
    border: 1px solid #003366;
    border-radius: 5px;
    height: 40px;

    width: 150px;
    cursor: pointer;
  }
  .second_line button:hover {
    box-shadow: 0.5px 1px 0.5px 1px #161515;
  }
</style>
