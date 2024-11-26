<!-- PAGE 3 FILE -->
<script>
  import { navigate } from "svelte-routing";
  import {
    getExcelSave,
    getFixDoneLists,
    getVulnsOfAsset,
    getVulnsOfPlan,
  } from "./../../services/vulns/vulnsService.js";
  import MainPageProject from "./MainPageProject.svelte";
  import MainPageAsset from "./MainPageAsset.svelte";
  import WholePage from "./WholePage.svelte";
  import { onMount } from "svelte";
  import { each } from "svelte/internal";
  import { get } from "svelte/store";
  import { toggleMenu } from "../../../public/assets/js/common.js";
  import { errorAlert } from "../../shared/sweetAlert.js";

  let currentView = "default";
  let setView = "plan";
  let currentPage = null;
  let activeMenu = null;
  let showProject = true;
  let tableData;
  let vulnerabilityStatusValue = "취약";
  let actionStatusValue;
  let activePlan = null;
  let wholePage = false;
  let selectedSendData;
  let wholeOption = null;
  let selectedItems = [];
  let sortAscending = true;
  let sorted = false;
  let loading = true;
  let assetsMenuData = [];
  let data = [];
  let totalRecords = 0;

  let search = {
    plan_index: "",
    asset_target_uuid: "",
    step_vuln: "1",
    page_cnt: "1",
    list_cnt: "15",
    search_opt: "취약",
  };

  // DATA
  let plans = [];
  let assets = [];
  let targetData = null;

  let currentPageNum = search["page_cnt"] ?? 1;

  const selectPage = async (page, menu) => {
    currentPage = page;
    activeMenu = menu;
    currentView = "default";
    wholePage = false;
    selectedItems = [];
  };

  async function toggleList(view) {
    showProject = view === "project";
  }

  function toggleAccordion(plan) {
    activePlan = activePlan == plan ? null : plan;
  }

  onMount(async () => {
    try {
      loading = true;

      plans = await getVulnsOfAsset(search);

      tableData = plans?.vulns;
      totalRecords = plans?.total_rec_cnt;
      loading = false;

      assets = await getVulnsOfAsset(search);
      tableData = assets?.vulns;
      totalRecords = assets?.total_rec_cnt;
    } catch (err) {
      await errorAlert(err?.message);
      loading = false;
    }
  });

  const getPlanDataSearch = async () => {
    try {
      loading = true;
      currentPageNum = 1;
      search = { ...search, page_cnt: currentPageNum };
      plans = await getVulnsOfAsset(search);
      tableData = plans?.vulns;
      totalRecords = plans?.total_rec_cnt;

      loading = false;
      activePlan = search["plan_index"];
    } catch (error) {
      errorAlert(error?.message);
      loading = false;
    }
  };

  async function downloadCSV(data) {
    try {
      await getExcelSave({
        asset_target_uuid: "ALL",
        vlun_step: search["step_vuln"] ?? 1,
      });
    } catch (err) {
      errorAlert(err?.message);
    }
  }

  let firstClick = true;

  function sortAssets() {
    loading = true;
    const isAscending = sortAscending ? 1 : -1;

    if (assetsMenuData && assetsMenuData.length > 0) {
      sorted = assetsMenuData.sort((hostA, hostB) => {
        return (
          hostA.ast_uuid__ass_uuid__ast_hostname.localeCompare(
            hostB.ast_uuid__ass_uuid__ast_hostname,
          ) * isAscending
        );
      });
    }

    assetsMenuData = [...sorted];

    sortAscending = !sortAscending;
    loading = false;
  }

  const resetFilters = async () => {
    activeMenu = null;
    selectedSendData = null;
    vulnerabilityStatusValue = "";
    actionStatusValue = "";
    search = {
      plan_index: "",
      asset_target_uuid: "",
      step_vuln: search?.step_vuln ?? "1",
      search_opt: "취약",
      page_cnt: "1",
      list_cnt: "15",
    };
    await getPlanDataSearch();
  };

  function transformVulns(vulns, vulnerabilityStatusValue, actionStatusValue) {
    const transformed = [];

    for (const key in vulns) {
      let currentResult = null;
      let fixPlan = {};
      let fixResult = {};

      vulns[key].forEach((item) => {
        if (item.result) {
          const result = item?.result;

          let actionMatch;
          if (
            actionStatusValue == "5" ||
            actionStatusValue == "6" ||
            actionStatusValue == "7"
          ) {
            actionMatch =
              !actionStatusValue ||
              result.cfr_fix_status__cvs_index == actionStatusValue;
          } else {
            actionMatch =
              !actionStatusValue ||
              result.cfi_fix_status__cvs_index == actionStatusValue;
          }

          if (actionMatch) {
            currentResult = result;
          }
        } else {
          if (item.fix_plan) {
            fixPlan = item.fix_plan;
          }
          if (item.fix_result) {
            fixResult = item.fix_result;
          }
        }
      });

      if (currentResult) {
        transformed.push({
          ...currentResult,
          fix_plan: Object.keys(fixPlan).length > 0 ? fixPlan : {},
          fix_result: Object.keys(fixResult).length > 0 ? fixResult : {},
        });
      }
    }

    return transformed;
  }

  $: {
    if (tableData) {
      data = transformVulns(
        tableData,
        vulnerabilityStatusValue,
        actionStatusValue,
      );
    }
  }
</script>

{#if loading}
  <div class="loading-overlay">
    <div class="loading-spinner"></div>
  </div>
{/if}

<div class="container">
  <section>
    <!--SUB MENU-->
    <article class="sideMenu" style=" height: calc(100vh - 141px);">
      <div class="btnWrap">
        <a
          href="javascript:void(0);"
          class={`btn ${showProject ? "btnBlue" : "btnPrimary"} `}
          on:click={async () => {
            try {
              loading = true;
              currentPageNum = 1;
              search = { ...search, page_cnt: currentPageNum };
              activePlan = null;
              toggleList("project");

              search = {
                plan_index: "",
                asset_target_uuid: "",
                step_vuln: "1",
                page_cnt: "1",
                list_cnt: "15",
                search_opt: "취약",
              };
              plans = await getVulnsOfAsset(search);
              tableData = plans?.vulns;
              totalRecords = plans?.total_rec_cnt;
              setView = "plan";
              selectedSendData = {
                plan_index: "",
                asset_target_uuid: "",
              };
              selectedItems = [];
              sortAscending = true;
              firstClick = true;
              currentView === "default";
              wholePage = false;
              loading = false;
            } catch (err) {
              errorAlert(err?.message);
              loading = false;
            }
          }}
        >
          프로젝트별
        </a>
        <button
          type="button"
          class={`btn ${!showProject ? "btnBlue" : "btnPrimary"} `}
          on:click={async () => {
            try {
              loading = true;
              currentPageNum = 1;
              search = { ...search, page_cnt: currentPageNum };
              toggleList("asset");
              // activeMenu = null;
              search = {
                plan_index: "",
                asset_target_uuid: "",
                step_vuln: "1",
                page_cnt: "1",
                list_cnt: "15",
                search_opt: "취약",
              };

              selectedSendData = {
                plan_index: "",
                asset_target_uuid: "",
              };
              selectedItems = [];
              activePlan = null;

              if (firstClick) {
                activeMenu = null;
                sortAscending = false;
                firstClick = false;
                assets = await getVulnsOfAsset(search);
                assetsMenuData = assets?.asset_asc;
                tableData = assets?.vulns;
                totalRecords = assets?.total_rec_cnt;
                setView = "plan";
              } else {
                sortAssets();
              }
              currentView === "default";
              wholePage = false;
              loading = false;
            } catch (err) {
              errorAlert(err?.message);
              loading = false;
            }
          }}
        >
          자산별
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 576 512"
            style="transform: rotate({firstClick
              ? '0deg'
              : sortAscending
                ? '180deg'
                : '0deg'}); transition: transform 0.2s;"
          >
            <path
              d="M151.6 42.4C145.5 35.8 137 32 128 32s-17.5 3.8-23.6 10.4l-88 96c-11.9 13-11.1 33.3 2 45.2s33.3 11.1 45.2-2L96 146.3 96 448c0 17.7 14.3 32 32 32s32-14.3 32-32l0-301.7 32.4 35.4c11.9 13 32.2 13.9 45.2 2s13.9-32.2 2-45.2l-88-96zM320 480l32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-32 0c-17.7 0-32 14.3-32 32s14.3 32 32 32zm0-128l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0c-17.7 0-32 14.3-32 32s14.3 32 32 32zm0-128l160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-160 0c-17.7 0-32 14.3-32 32s14.3 32 32 32zm0-128l224 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L320 32c-17.7 0-32 14.3-32 32s14.3 32 32 32z"
              fill={!showProject ? "#fff" : "#0067ff"}
            />
          </svg>
        </button>
      </div>
      <ul
        class="prMenuListToggle"
        style="overflow-y: scroll; height: 92%; overflow-x:hidden;"
      >
        {#if showProject}
          {#if plans && plans?.plans && plans?.plans?.length !== 0}
            {#each plans?.plans as plan, index}
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <li
                style="cursor: pointer;"
                class={`menuItem ${
                  activePlan === plan.plan_index ? "active" : ""
                } `}
                on:click={(e) => {
                  // toggleMenu(e);
                  selectedItems = [];
                }}
              >
                <div
                  class="menu"
                  style="position: relative;"
                  on:click={async () => {
                    setView = "plan";
                    search.step_vuln = "1";
                    currentPageNum = 1;
                    search = { ...search, page_cnt: currentPageNum };
                    if (search.plan_index != plan.plan_index) {
                      search.plan_index = plan.plan_index;
                    } else {
                      search.plan_index = "";
                    }
                    search.asset_target_uuid = "";
                    getPlanDataSearch();
                    toggleAccordion(plan.plan_index);
                    selectPage(MainPageProject, plan);
                    selectedSendData = {
                      plan_index: plan?.plan_index,
                      asset_target_uuid: "",
                    };
                  }}
                >
                  <span
                    style="white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;">{plan?.plan_title}</span
                  >
                  <span class="arrowIcon"></span>
                  <span class="tooltip">{plan?.plan_title}</span>
                </div>
                {#if activePlan === plan.plan_index}
                  {#each plan?.plan_target as target}
                    {#each Object.entries(target) as [osType, hosts]}
                      <div class="submenuWrap">
                        <ul>
                          <li class="subItem active">
                            <div class="submenuTitle">{osType}</div>
                            <ul class="submenu">
                              {#each hosts as host}
                                <li
                                  class={selectedSendData?.asset_target_uuid ==
                                  host?.ast_uuid
                                    ? "active"
                                    : ""}
                                  on:click={async () => {
                                    loading = true;
                                    switch (search?.step_vuln) {
                                      case "1":
                                        setView = "plan";
                                        break;
                                      case "2":
                                        setView = "plan_accept";
                                        break;
                                      case "3":
                                        setView = "result";
                                        break;
                                      case "4":
                                        setView = "result_accept";
                                        break;
                                      default:
                                        setView = "plan";
                                    }
                                    search = {
                                      ...search,
                                      plan_index: plan?.plan_index,
                                      asset_target_uuid: host?.ast_uuid,
                                      page_cnt: 1,
                                    };
                                    assets = await getVulnsOfAsset(search);
                                    tableData = assets?.vulns;
                                    totalRecords = assets?.total_rec_cnt;
                                    selectedSendData = {
                                      plan_index: plan?.plan_index,
                                      asset_target_uuid: host?.ast_uuid,
                                    };
                                    currentPageNum = 1;
                                    search = {
                                      ...search,
                                      page_cnt: currentPageNum,
                                    };
                                    loading = false;
                                  }}
                                >
                                  <a
                                    href="javascript:void(0);"
                                    class={selectedSendData?.asset_target_uuid ==
                                    host?.ast_uuid
                                      ? "listActive"
                                      : ""}
                                  >
                                    {host.ast_uuid__ass_uuid__ast_hostname}
                                  </a>
                                </li>
                              {/each}
                            </ul>
                          </li>
                        </ul>
                      </div>
                    {/each}
                  {/each}
                {/if}
              </li>
            {/each}
          {/if}
        {:else}
          <div>
            {#if assetsMenuData && assetsMenuData?.length !== 0}
              {#each assetsMenuData as asset, index}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <li
                  style="cursor: pointer;"
                  class={`menuItem ${
                    activeMenu === asset.ast_uuid ? "active" : ""
                  } `}
                >
                  <div
                    class="menu"
                    style="position: relative;"
                    on:click={async () => {
                      loading = true;
                      switch (search?.step_vuln) {
                        case "1":
                          setView = "plan";
                          break;
                        case "2":
                          setView = "plan_accept";
                          break;
                        case "3":
                          setView = "result";
                          break;
                        case "4":
                          setView = "result_accept";
                          break;
                        default:
                          setView = "plan";
                      }
                      currentPageNum = 1;
                      selectPage(MainPageProject, asset.ast_uuid);
                      search = {
                        ...search,
                        plan_index: "",
                        asset_target_uuid: asset.ast_uuid,
                      };
                      assets = await getVulnsOfAsset(search);
                      tableData = assets?.vulns;
                      totalRecords = assets?.total_rec_cnt;
                      selectedSendData = {
                        asset_target_uuid: asset.ast_uuid,
                      };
                      loading = false;
                    }}
                  >
                    <span
                      style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;"
                    >
                      {asset?.ast_uuid__ass_uuid__ast_hostname} ({asset?.ast_uuid__ast_target__cct_target})</span
                    >
                    <span class="tooltip">
                      {asset?.ast_uuid__ass_uuid__ast_hostname} ({asset?.ast_uuid__ast_target__cct_target})</span
                    >
                  </div>
                </li>
              {/each}
            {/if}
          </div>
        {/if}
      </ul>
    </article>
    <!--//SUBMENU-->

    <div
      class={`contentsWrap assetview  ${currentView === "default" && !wholePage ? "vulnerability" : "vulnerability_create"}`}
      style={wholePage ? "width: calc(100% - 280px);" : "padding-bottom: 40px;"}
    >
      <article
        class="contentArea flex col"
        style="height: calc(100vh - 153px);"
      >
        <section class="topCon">
          <section class="filterWrap">
            <div>
              {#if showProject}
                <select
                  bind:value={search["plan_index"]}
                  on:change={async () => {
                    search = { ...search, asset_target_uuid: "" };
                    selectedSendData = null;
                    await getPlanDataSearch();
                  }}
                >
                  <option value="" selected>프로젝트</option>
                  {#if plans && plans?.plans && plans?.plans?.length !== 0}
                    {#each plans?.plans as plan, index}
                      <option value={plan?.plan_index}>
                        {plan?.plan_title}</option
                      >
                    {/each}
                  {/if}
                </select>
              {:else}
                <select
                  bind:value={search["asset_target_uuid"]}
                  on:change={async (e) => {
                    // search = { ...search, asset_target_uuid: "" };
                    activeMenu = e?.target?.value;
                    selectedSendData = null;
                    await getPlanDataSearch();
                  }}
                >
                  <option value="" selected>자산</option>
                  {#if assetsMenuData && assetsMenuData?.length !== 0}
                    {#each assetsMenuData as asset, index}
                      <option value={asset.ast_uuid}>
                        {asset?.ast_uuid__ass_uuid__ast_hostname} ({asset?.ast_uuid__ast_target__cct_target})
                      </option>
                    {/each}
                  {/if}
                </select>
              {/if}
              <select
                name="asset_group"
                id="asset_group"
                class="select_input"
                bind:value={search["search_opt"]}
                on:change={() => {
                  // search = { ...search, asset_target_uuid: "" };
                  // selectedSendData = null;
                  getPlanDataSearch();
                }}
              >
                <option value="양호">양호</option>
                <option value="취약">취약</option>
                <option value="수동점검">수동점검</option>
                <option value="인터뷰">인터뷰</option>
              </select>
              <select
                name="operating_system"
                id="operating_system"
                class="select_input"
                bind:value={actionStatusValue}
              >
                <option value="" selected>조치상태별</option>
                <option value="0">조치전</option>
                <option value="1">조치예정</option>
                <option value="2">조치계획등록</option>
                <option value="3">조치계획승인</option>
                <option value="4">조치계획반려</option>
                <option value="5">조치결과등록</option>
                <option value="6">조치결과승인</option>
                <option value="7">조치결과반려</option>
              </select>
              <button
                type="button"
                class="btn btnPrimary"
                on:click={resetFilters}
              >
                <img src="./assets/images/reset.png" alt="search" />
                초기화
              </button>
              {#if !wholePage}
                <button
                  type="button"
                  class="btn btnPrimary"
                  on:click={downloadCSV}
                >
                  <!-- svelte-ignore a11y-missing-attribute -->
                  <img
                    src="./assets/images/icon/download.svg"
                    class="excel-img"
                  /> 엑셀 다운로드
                </button>
              {/if}

              {#if wholePage}
                <button
                  type="button"
                  class="btn btnPrimary"
                  on:click={() => {
                    currentView === "default";
                    wholePage = false;
                    if (!activePlan) {
                      search = { ...search, plan_index: "" };
                    }
                  }}
                >
                  돌아가기
                </button>
              {/if}
            </div>
          </section>
        </section>

        {#if currentView === "default" && !wholePage}
          <MainPageProject
            bind:loading
            bind:tableData
            bind:vulnerabilityStatusValue
            bind:actionStatusValue
            bind:setView
            bind:wholePage
            bind:selectedSendData
            bind:showProject
            bind:targetData
            bind:wholeOption
            bind:selectedItems
            bind:search
            bind:data
            bind:currentPageNum
            bind:totalRecords
          />
        {/if}

        {#if wholePage}
          <WholePage
            bind:plans
            bind:targetData
            bind:setView
            bind:vulnerabilityStatusValue
            bind:actionStatusValue
            bind:data
            bind:wholePage
            bind:currentView
            bind:search
            bind:tableData
            bind:selectedSendData
            bind:showProject
          />
        {/if}
      </article>
    </div>
  </section>
</div>

<style>
  * {
    font-size: 16px;
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

  /* Spinner animation */
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .backImage {
    cursor: pointer;
    width: 24px;
  }
  .btn:hover svg path {
    fill: white; /* Change SVG fill color to white on hover */
  }
  .btn:disabled {
    background-color: #0067ff7d;
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

  .rotate {
    transform: rotate(180deg);
  }

  .excel-img {
    filter: invert(45%) sepia(100%) saturate(550%) hue-rotate(195deg)
      brightness(100%) contrast(98%);
  }

  .listActive {
    font-weight: 800;
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
</style>
