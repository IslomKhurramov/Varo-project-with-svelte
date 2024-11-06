<script>
  import Asset from "./Asset.svelte";
  import Project from "./Project.svelte";
  import Third from "./Third.svelte";

  let currentPage = null;
  let showProject = true;
  let showAsset = false;
  let showThird = false;
  let activeView = "project"; // Track which section is currently active
  let activeMenu = "전체";

  function selectPage(pageComponent, menuName) {
    currentPage = pageComponent;
    activeMenu = menuName; // Set the active menu to reflect the selection
  }

  function toggleView(view) {
    showProject = view === "project";
    showAsset = view === "asset";
    showThird = view === "third";
    activeView = view;
    activeMenu = "전체";
    currentPage = null; // Clear the current page on view change
  }

  let plan = [];
  for (let i = 0; i < 20; i++) {
    plan.push({
      number: (i + 1).toString(),
      planName: "plan",
      version: "1.0.0",
    });
  }
  let asset = [];
  for (let i = 0; i < 20; i++) {
    asset.push({
      number: (i + 1).toString(),
      assetName: "asset",
      version: "1.0.0",
    });
  }
  let third = [];
  for (let i = 0; i < 20; i++) {
    third.push({
      number: (i + 1).toString(),
      thirdName: "third",
      version: "1.0.0",
    });
  }
</script>

<!-- {#if loading}
  <div class="loading-overlay">
    <div class="loading-spinner"></div>
  </div>
{/if} -->

<div class="container">
  <section>
    <!--SUB MENU-->
    <article class="sideMenu" style=" height: calc(100vh - 141px);">
      <div class="btnWrap">
        <a
          href="javascript:void(0);"
          class={`btn btn1 ${activeView === "project" ? "btnBlue" : "btnPrimary"}`}
          on:click={() => toggleView("project")}
        >
          프로젝트별
        </a>
        <button
          type="button"
          class={`btn btn1 ${activeView === "asset" ? "btnBlue" : "btnPrimary"}`}
          on:click={() => toggleView("asset")}
        >
          자산별
        </button>
        <button
          type="button"
          class={`btn btn1 ${activeView === "third" ? "btnBlue" : "btnPrimary"}`}
          on:click={() => toggleView("third")}
        >
          점검항목별
        </button>
      </div>

      <ul
        class="prMenuListToggle"
        style="overflow-y: scroll; height: 92%; overflow-x:hidden;"
      >
        {#if activeView === "project"}
          <li
            style="cursor: pointer;"
            class={`menuItem ${activeMenu === "전체" ? "active" : ""} `}
          >
            <div class="menu" style="position: relative;">
              <span
                style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
                >전체</span
              > <span class="arrowIcon"></span>
            </div>
          </li>
          <li
            style="cursor: pointer;"
            class={`menuItem ${activeMenu === "plan" ? "active" : ""} `}
          >
            <div
              on:click={() => selectPage(Project, "plan")}
              class="menu"
              style="position: relative;"
              title="plan"
            >
              <span
                style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
                >plan</span
              > <span class="arrowIcon"></span>
            </div>
          </li>
        {:else if activeView === "asset"}
          <li
            style="cursor: pointer;"
            class={`menuItem ${activeMenu === "전체" ? "active" : ""} `}
          >
            <div class="menu" style="position: relative;">
              <span
                style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
                >전체</span
              > <span class="arrowIcon"></span>
            </div>
          </li>
          <li
            style="cursor: pointer;"
            class={`menuItem ${activeMenu === "asset" ? "active" : ""} `}
          >
            <div
              on:click={() => selectPage(Asset, "asset")}
              class="menu"
              style="position: relative;"
              title="asset"
            >
              <span
                style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
                >asset</span
              > <span class="arrowIcon"></span>
            </div>
          </li>
        {:else if activeView === "third"}
          <li
            style="cursor: pointer;"
            class={`menuItem ${activeMenu === "전체" ? "active" : ""} `}
          >
            <div class="menu" style="position: relative;">
              <span
                style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
                >전체</span
              > <span class="arrowIcon"></span>
            </div>
          </li>
          <li
            style="cursor: pointer;"
            class={`menuItem ${activeMenu === "third" ? "active" : ""} `}
          >
            <div
              on:click={() => selectPage(Third, "third")}
              class="menu"
              style="position: relative;"
              title="third"
            >
              <span
                style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
                >third</span
              > <span class="arrowIcon"></span>
            </div>
          </li>
        {/if}
      </ul>
    </article>
    <!--//SUBMENU-->

    <div class={`contentsWrap assetview `} style={"width: calc(100% - 280px);"}>
      <article
        class="contentArea flex col"
        style="height: calc(100vh - 153px);"
      >
        <section class="topCon">
          <section class="filterWrap">
            <div>
              <select>
                <option value="" selected>프로젝트</option>

                <option value="프로젝트"> 프로젝트</option>
              </select>
              <select name="asset_group" id="asset_group" class="select_input">
                <option value="" selected>날짜범위지정</option>
                <option value="날짜범위지정">날짜범위지정</option>
                <option value="날짜범위지정">날짜범위지정</option>
              </select>
              <select
                name="operating_system"
                id="operating_system"
                class="select_input"
              >
                <option value="" selected>조치상태별</option>
                <option value="조치상태별">조치상태별</option>
              </select>
              <select
                name="operating_system"
                id="operating_system"
                class="select_input"
              >
                <option value="" selected>담당자별</option>
                <option value="담당자별">담당자별</option>
              </select>
              <button type="button" class="btn btnPrimary">
                <img src="./assets/images/reset.png" alt="search" />
                초기화
              </button>
              <button type="button" class="btn btnPrimary">
                <img
                  src="./assets/images/icon/download.svg"
                  class="excel-img"
                /> 엑셀 다운로드
              </button>

              <button type="button" class="btn btnPrimary"> 엑셀저장 </button>
            </div>
          </section>
        </section>

        {#if currentPage}
          <svelte:component this={currentPage} />
        {/if}
      </article>
    </div>
  </section>
</div>

<style>
  * {
    font-size: 16px;
  }
  .arrowIcon {
    display: inline-block;
    transition: transform 0.3s ease;
  }
  #wrap .container .sideMenu .prMenuListToggle li.menuItem .arrowIcon {
    transform: rotate(-45deg);
    position: relative;
    margin-left: auto;
    transition: none; /* Removes any rotation transition */
    margin-top: 0px;
  }

  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(167, 167, 167, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000; /* Ensure it sits above other content */
  }

  .loading-spinner {
    border: 8px solid #f3f3f3; /* Light grey */
    border-top: 8px solid #3498db; /* Blue */
    border-radius: 50%;
    width: 60px;
    height: 60px;
    animation: spin 1s linear infinite;
  }

  .backImage {
    cursor: pointer;
    width: 24px;
  }
  .btn:hover {
    color: #fff;
    background-color: #0067ff;
  }
  .btn:hover svg path {
    fill: white; /* Change SVG fill color to white on hover */
  }
  /* Tooltip styling */
  .tooltip {
    visibility: hidden; /* Hidden by default */
    width: 87%; /* Width of the tooltip */
    background-color: rgba(0, 0, 0, 0.7); /* Background color of the tooltip */
    color: #fff; /* Text color */
    text-align: center; /* Center text */
    border-radius: 4px; /* Rounded corners */
    padding: 5px; /* Padding inside tooltip */
    position: absolute; /* Absolute positioning */
    z-index: 1; /* On top of other elements */
    bottom: 125%; /* Position above the button */
    opacity: 0; /* Initial opacity */
    transition: opacity 0.2s ease; /* Transition effect */
    z-index: 9999 !important;
  }

  .menu:hover .tooltip {
    visibility: visible; /* Show tooltip */
    opacity: 1; /* Fade in the tooltip */
  }

  svg {
    width: 20px;
    height: 20px;
    margin-left: 5px;
    /* transform: rotate(180deg); */
  }

  .listActive {
    font-weight: 800;
  }
  .btn1 {
    display: flex;
    height: 40px;
    justify-content: space-around;
    align-items: center;
    outline: none;
    font-size: 14px;
    font-weight: 500;
    border-radius: 6px;
    border: 1px solid transparent;
    box-sizing: border-box;
    cursor: pointer;
    padding: 0;
    transition-duration: 0.3s;
  }
  /* Tooltip styling */
  .tooltip {
    visibility: hidden; /* Hidden by default */
    width: 87%; /* Width of the tooltip */
    background-color: rgba(0, 0, 0, 0.7); /* Background color of the tooltip */
    color: #fff; /* Text color */
    text-align: center; /* Center text */
    border-radius: 4px; /* Rounded corners */
    padding: 5px; /* Padding inside tooltip */
    position: absolute; /* Absolute positioning */
    z-index: 1; /* On top of other elements */
    bottom: 125%; /* Position above the button */
    opacity: 0; /* Initial opacity */
    transition: opacity 0.2s ease; /* Transition effect */
    z-index: 9999 !important;
  }
  /* Tooltip styling */
  .prMenuListToggle div[title] {
    position: relative;
    cursor: pointer;
  }

  /* Tooltip on hover */
  .prMenuListToggle div[title]:hover::after {
    content: attr(title); /* The full text from the title attribute */
    position: absolute;
    bottom: 100%; /* Position the tooltip above the text */
    left: 50%;
    transform: translateX(-50%);
    background-color: #333;
    color: #fff;
    padding: 5px;
    font-size: 12px;
    white-space: nowrap;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }

  /* Tooltip arrow */
  .prMenuListToggle div[title]:hover::before {
    content: "";
    position: absolute;
    bottom: 100%;
    z-index: 1000;
    left: 50%;
    transform: translateX(-50%);
    border-width: 5px;
    border-style: solid;
    border-color: transparent transparent #333 transparent;
  }
</style>
