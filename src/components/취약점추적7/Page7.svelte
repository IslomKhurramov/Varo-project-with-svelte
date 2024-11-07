<script>
  import Asset from "./Asset.svelte";
  import ProjectAll from "./ProjectAll.svelte";
  import Third from "./Third.svelte";
  import Project from "./Project.svelte";
  import AssetAll from "./AssetAll.svelte";
  import ThirdAll from "./ThirdAll.svelte";

  let currentPage = ProjectAll;
  let showProject = true;
  let showAsset = false;
  let showThird = false;
  let activeView = "project"; // Track which section is currently active
  let activeMenu = null;

  function selectPage(pageComponent, menuName) {
    currentPage = pageComponent;
    activeMenu = menuName; // Set the active menu to reflect the selection
  }

  function toggleView(view) {
    showProject = view;
    showAsset = view;
    showThird = view;
    activeView = view;
    activeMenu = "전체";

    if (view === "project") {
      currentPage = ProjectAll;
    } else if (view === "asset") {
      currentPage = AssetAll;
    } else if (view === "third") {
      currentPage = ThirdAll; // Assuming this represents Third's 전체 view
    }
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
      WINDOWS: [
        {
          ccc_index: 2471,
          ccc_item_no: "W-01",
          ccc_item_title: "Administrator 계정 이름 변경 또는 보안성 강화",
        },
      ],
      UNIX: [
        {
          ccc_index: 2471,
          ccc_item_no: "W-01",
          ccc_item_title: "Administrator 계정 이름 변경 또는 보안성 강화",
        },
      ],
      LINUX: [
        {
          ccc_index: 2471,
          ccc_item_no: "L-01",
          ccc_item_title: "Administrator 계정 이름 변경 또는 보안성 강화",
        },
      ],
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
            <div
              on:click={() => selectPage(ProjectAll, "전체")}
              class="menu"
              style="position: relative;"
            >
              <span
                style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
                >전체</span
              > <span class="arrowIcon"></span>
            </div>
          </li>
          {#each plan as plan}
            <li
              style="cursor: pointer;"
              class={`menuItem ${activeMenu === plan ? "active" : ""}`}
            >
              <div
                on:click={() => selectPage(Project, plan)}
                class="menu"
                style="position: relative;"
                title="plan"
              >
                <span
                  style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
                  >{plan.planName}({plan.number})</span
                > <span class="arrowIcon"></span>
              </div>
            </li>
          {/each}
        {:else if activeView === "asset"}
          <li
            style="cursor: pointer;"
            class={`menuItem ${activeMenu === "전체" ? "active" : ""} `}
          >
            <div
              on:click={() => selectPage(AssetAll, "전체")}
              class="menu"
              style="position: relative;"
            >
              <span
                style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
                >전체</span
              > <span class="arrowIcon"></span>
            </div>
          </li>
          {#each asset as asset}
            <li
              style="cursor: pointer;"
              class={`menuItem ${activeMenu === asset ? "active" : ""} `}
            >
              <div
                on:click={() => selectPage(Asset, asset)}
                class="menu"
                style="position: relative;"
                title="asset"
              >
                <span
                  style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
                  >{asset.assetName}({asset.number})</span
                > <span class="arrowIcon"></span>
              </div>
            </li>
          {/each}
        {:else if activeView === "third"}
          <li
            style="cursor: pointer;"
            class={`menuItem ${activeMenu === "전체" ? "active" : ""} `}
          >
            <div
              on:click={() => selectPage(ThirdAll, "전체")}
              class="menu"
              style="position: relative;"
            >
              <span
                style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
                >전체</span
              > <span class="arrowIcon"></span>
            </div>
          </li>
          {#each third as third}
            <li
              style="cursor: pointer;"
              class={`menuItem ${activeMenu === third ? "active" : ""} `}
            >
              <div
                on:click={() => selectPage(Third, third)}
                class="menu"
                style="position: relative;"
                title="third"
              >
                <span
                  style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
                  >{third.thirdName}
                </span> <span class="arrowIcon"></span>
              </div>
            </li>
          {/each}
        {/if}
      </ul>
    </article>
    <!--//SUBMENU-->

    <div class={`contentsWrap assetview `} style={"width: calc(100% - 280px);"}>
      <article class="contentArea mt-0">
        <section class="topCon" style="margin-bottom: 0px;">
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
              {#if showProject}
                <select
                  name="operating_system"
                  id="operating_system"
                  class="select_input"
                >
                  <option value="" selected>플랜명</option>
                  <option value="플랜명">플랜명</option>
                </select>
              {/if}
              <button type="button" class="btn btnPrimary">
                <img src="./assets/images/reset.png" alt="search" />
                초기화
              </button>

              <button type="button" class="btn btnPrimary"> 엑셀저장 </button>
              {#if showProject}
                <button type="button" class="btn btnPrimary"> 비교 </button>
              {/if}
            </div>
          </section>
        </section>
      </article>

      <article
        class="contentArea body"
        style={"margin-top: 10px; height: calc(100vh - 141px);"}
      >
        {#if currentPage}
          <svelte:component this={currentPage} {asset} {third} />
        {/if}
      </article>
    </div>
  </section>
</div>

<style>
  .body {
    margin-top: 10px;
  }
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
