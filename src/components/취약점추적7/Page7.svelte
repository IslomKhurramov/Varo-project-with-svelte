<script>
  import Asset from "./Asset.svelte";
  import ProjectAll from "./ProjectAll.svelte";
  import Third from "./Third.svelte";
  import Project from "./Project.svelte";
  import AssetAll from "./AssetAll.svelte";
  import ThirdAll from "./ThirdAll.svelte";
  import ComparisonPage from "./ComparisonPage.svelte";
  import AssetComparison from "./AssetComparison.svelte";
  import ThirdComparison from "./ThirdComparison.svelte";
  import {
    allTraceByAsset,
    allTraceByPlan,
    allTraceByThird,
    leftTrackData,
    selectedAssetTableData,
    selectedPlan,
    traceByPlan,
    traceByThird,
  } from "../../services/page7/trace.store";
  import {
    getAllTraceByAsset,
    getAllTraceByPlan,
    getAllTraceByTarget,
    getLeftTrackData,
    getTraceByAsset,
    getTraceByPlan,
    traceByTarget,
  } from "../../services/page7/service";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  // Create a writable store for selectedPlans

  let currentPage = ProjectAll;
  let showProject = true;
  let showAsset = false;
  let showThird = false;
  let activeView = "project"; // Track which section is currently active
  let activeMenu = null;
  let selectedAsset = "";
  let plan_id = "";
  let trace_cct_index = "";
  let trace_ccc_index = "";

  function selectPage(pageComponent, menuName) {
    currentPage = pageComponent;
    activeMenu = menuName; // Set the active menu to reflect the selection
  }
  function selectAsset(asset) {
    // Set selectedAsset based on the asset's asg_index
    selectedAsset = asset.asg_index;
    console.log("selectedAsset:", selectedAsset);
    tableDataOfAsset(selectedAsset);
  }
  function selectPlan(plan) {
    plan_id = plan;
    planDataById(plan_id);
    console.log("plan id", plan_id);
  }

  function selectTarget(target_id1) {
    trace_cct_index = target_id1;
  }
  function selectTarget2(target_id2) {
    trace_ccc_index = target_id2;
    console.log("ides", trace_ccc_index, trace_cct_index);
    targetData(trace_cct_index, trace_ccc_index);
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
  /*****************LEFTDATA**************************************/
  onMount(() => {
    getLeftDatas();
    planData();
    assetData();
    thirdData();
  });

  async function getLeftDatas() {
    try {
      const response = await getLeftTrackData();
      console.log("response", response);
      if (response.RESULT === "OK") {
        leftTrackData.set(Object.values(response.CODE));
      }
    } catch (err) {
      await errorAlert(err?.message);
      loading = false;
    }
  }

  /*************************************************************************************/

  // Track the expanded state for each `third`
  let expandedItems = writable({});

  function toggleExpand(thirdId) {
    activeMenu = thirdId;
    expandedItems.update((state) => ({
      ...state,
      [thirdId]: !state[thirdId],
    }));
  }
  /**********************************************************************/
  /****************PLANDATA**********************************************/
  async function planData() {
    try {
      const response = await getAllTraceByPlan();
      console.log("response", response);
      if (response.RESULT === "OK") {
        allTraceByPlan.set(Object.values(response.CODE));
      }
    } catch (err) {
      await errorAlert(err?.message);
      loading = false;
    }
  }

  async function planDataById(plan_id) {
    try {
      const response = await getTraceByPlan(plan_id);

      if (response) {
        traceByPlan.set(response.CODE);
      } else {
      }
      console.log("traceByPlan", $traceByPlan);
    } catch (err) {
      alert(`Error getting asset details: ${err.message}`);
    }
  }

  /*************************************************************************/
  /*****************ASSETDATA**********************************************/
  async function assetData() {
    try {
      const response = await getAllTraceByAsset();
      console.log("response", response);
      if (response.RESULT === "OK") {
        allTraceByAsset.set(Object.values(response.CODE));
      }
    } catch (err) {
      await errorAlert(err?.message);
      loading = false;
    }
  }
  $: console.log("allTraceByAsset", $allTraceByAsset);
  /************************************************************************/
  // Reactive statement to filter plans based on selectedAsset
  $: {
    if (selectedAsset) {
      const asset = $allTraceByAsset.find(
        (asset) => asset.asg_index === selectedAsset,
      );
      if (asset && asset.plans && Array.isArray(asset.plans)) {
        // Correct way to update the store
        selectedPlan.set(asset.plans);
      } else {
        selectedPlan.set([]); // If no plans are found, reset the store
      }
    }
  }
  $: console.log("parent", $selectedPlan);
  /***********************************************************************/
  /****************ASSETTABLEDATA*****************************************/
  async function tableDataOfAsset(selectedAsset) {
    console.log("selectedAsset:", selectedAsset);
    try {
      const response = await getTraceByAsset(selectedAsset);

      if (response) {
        selectedAssetTableData.set(response.CODE);
      } else {
      }
    } catch (err) {
      alert(`Error getting asset details: ${err.message}`);
    }
  }
  /*****************************************************************************/
  /********************THIRDDATA*******************************************/
  async function thirdData() {
    try {
      const response = await getAllTraceByTarget();
      console.log("response", response);
      if (response.RESULT === "OK") {
        allTraceByThird.set(Object.values(response.CODE));
      }
    } catch (err) {
      await errorAlert(err?.message);
      loading = false;
    }
  }

  async function targetData(trace_cct_index, trace_ccc_index) {
    try {
      const response = await traceByTarget(trace_cct_index, trace_ccc_index);

      if (response) {
        traceByThird.set(response.CODE);
      } else {
      }
    } catch (err) {
      throw err;
    }
  }
  $: console.log("third", $traceByThird);
  /********************MODAL DATA*******************************/
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
            <!-- svelte-ignore a11y-click-events-have-key-events -->
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
          {#if $leftTrackData.length > 0}
            {#each $leftTrackData[0] as plan}
              <li
                style="cursor: pointer;"
                class={`menuItem ${activeMenu === plan ? "active" : ""}`}
              >
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div
                  on:click={() => {
                    selectPage(Project, plan); // Select page and menu
                    selectPlan(plan.ccp_index); // Set selected asset
                  }}
                  class="menu"
                  style="position: relative;"
                  title={plan.ccp_title}
                >
                  <span
                    style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
                    >{plan.ccp_title}</span
                  >
                  <span class="arrowIcon"></span>
                </div>
              </li>
            {/each}
          {/if}
        {:else if activeView === "asset"}
          <li
            style="cursor: pointer;"
            class={`menuItem ${activeMenu === "전체" ? "active" : ""} `}
          >
            <!-- svelte-ignore a11y-click-events-have-key-events -->
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
          {#if $leftTrackData.length > 0}
            {#each $leftTrackData[1] as asset}
              <li
                style="cursor: pointer;"
                class={`menuItem ${activeMenu === asset ? "active" : ""}`}
              >
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div
                  on:click={() => {
                    selectPage(Asset, asset); // Select page and menu
                    selectAsset(asset); // Set selected asset
                  }}
                  class="menu"
                  style="position: relative;"
                  title={asset.asg_title}
                >
                  <span
                    style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
                    >{asset.asg_title}({asset.asg_count})</span
                  >
                  <span class="arrowIcon"></span>
                </div>
              </li>
            {/each}
          {/if}
        {:else if activeView === "third"}
          <li
            style="cursor: pointer;"
            class={`menuItem ${activeMenu === "전체" ? "active" : ""} `}
          >
            <!-- svelte-ignore a11y-click-events-have-key-events -->
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
          {#if $leftTrackData.length > 0}
            {#each $leftTrackData[2] as third (third.cct_target)}
              <li
                style="cursor: pointer;"
                class={`menuItem  ${$expandedItems[third] ? "active" : ""}`}
              >
                <!-- Toggle visibility by clicking on the target -->
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div
                  class="menu"
                  style="position: relative; cursor: pointer;"
                  on:click={() => {
                    toggleExpand(third.cct_target); // Select page and menu
                    selectTarget(third.cct_index); // Set selected asset
                  }}
                >
                  <span
                    style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
                  >
                    {third.cct_target}
                  </span>
                  <span class="arrowIcon"></span>
                </div>

                <!-- Nested items, toggled based on expanded state -->
                {#if $expandedItems[third.cct_target]}
                  {#each third.targets_data as target}
                    <li
                      style="cursor: pointer;"
                      class={`menuItem ${activeMenu === target ? "active2" : ""}`}
                    >
                      <!-- svelte-ignore a11y-click-events-have-key-events -->
                      <div
                        on:click={() => {
                          selectPage(Third, target); // Select page and menu
                          selectTarget2(target.ccc_index); // Set selected asset
                        }}
                        class="menu2"
                        style="position: relative;"
                        title={target.ccc_item_no}
                      >
                        <span
                          style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
                        >
                          |- {target.ccc_item_no}
                        </span>
                      </div>
                    </li>
                  {/each}
                {/if}
              </li>
            {/each}
          {/if}
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

              <button type="button" class="btn btnPrimary">
                <img src="./assets/images/reset.png" alt="search" />
                초기화
              </button>

              <button type="button" class="btn btnPrimary"> 엑셀저장 </button>
              {#if activeView === "project"}
                <!-- For project comparison -->
                <button
                  on:click={() => selectPage(ComparisonPage, "비교")}
                  type="button"
                  class="btn btnPrimary"
                >
                  비교
                </button>
              {:else if activeView === "asset"}
                <!-- For asset comparison -->
                <button
                  on:click={() => selectPage(AssetComparison, "비교")}
                  type="button"
                  class="btn btnPrimary"
                >
                  비교
                </button>
              {:else if activeView === "third"}
                <!-- Optional: For third category comparison -->
                <button
                  on:click={() => selectPage(ThirdComparison, "비교")}
                  type="button"
                  class="btn btnPrimary"
                >
                  비교
                </button>
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
          <svelte:component
            this={currentPage}
            {selectedAsset}
            {trace_ccc_index}
            {trace_cct_index}
          />
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
  #wrap .container .sideMenu .prMenuListToggle li.menuItem.active2 .menu2 {
    /* background-color: #0067ff; */
    color: #0067ff;
  }
  #wrap .container .sideMenu .prMenuListToggle li.menuItem .menu2:hover,
  #wrap .container .sideMenu .prMenuListToggle li.menuItem.active2 .menu2 {
    background-color: #fff;
    color: #0067ff;
  }
  .menu2 {
    padding: 5px;
    padding-left: 25px;
    font-weight: 400;
    color: #9197b3;
  }
  .arrow-down {
    transform: rotate(-134deg);
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
