<script>
  import {
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

  let currentView = "default";
  let setView = "plan";
  let currentPage = null;
  let activeMenu = null;
  let showProject = true;
  let tableData;
  let vulnerabilityStatusValue;
  let actionStatusValue;
  let actionStatus;
  let activePlan = null;
  let wholePage = false;
  let selectedSendData;
  let wholeOption = null;

  let search = {
    plan_index: "",
    asset_target_uuid: "",
  };

  // DATA
  let plans = [];
  let assets = [];
  let targetData = null;

  const selectPage = async (page, menu) => {
    currentPage = page;
    activeMenu = menu;
    currentView = "default";
    wholePage = false;
  };

  function toggleView() {
    currentView = currentView === "default" ? "newView" : "default";
    currentPage = null;
  }

  async function toggleList(view) {
    showProject = view === "project";
  }

  function toggleAccordion(plan) {
    activePlan = activePlan === plan ? null : plan;
  }

  onMount(async () => {
    plans = await getVulnsOfPlan();
    tableData = plans?.vulns;

    assets = await getVulnsOfAsset(search);
  });

  const getPlanDataSearch = async () => {
    plans = await getVulnsOfPlan(search);
    tableData = plans?.vulns;
  };
</script>

<!-- <main class="container">
  <div class="container_aside">
    <aside>
      <div class="add_delete_container">
        <p
          class="menu_button"
          on:click={async () => {
            toggleList("project");
            plans = await getVulnsOfPlan();
            tableData = plans?.vulns;
            search = {
              plan_index: "",
              asset_target_uuid: "",
            };
            setView = "plan";
          }}
        >
          프로젝트별
        </p>
        <p
          class="menu_button"
          on:click={async () => {
            toggleList("asset");
            assets = await getVulnsOfAsset(search);
            tableData = assets?.vulns;
            search = {
              plan_index: "",
              asset_target_uuid: "",
            };
            setView = "plan";
          }}
        >
          자산별
        </p>
      </div>

      {#if showProject}
        <div class="project_container">
          {#if plans && plans?.plans && plans?.plans?.length !== 0}
            {#each plans?.plans as plan, index}
              <div class="project_button">
                <div
                  class="accordion_header"
                  on:click={() => {
                    search.plan_index = plan.plan_index;
                    getPlanDataSearch();
                    toggleAccordion(plan.plan_index);
                    selectPage(MainPageProject, plan);
                  }}
                >
                  <img src="./images/projectGray.png" alt="project" />
                  <a
                    href="javascript:void(0)"
                    class={activeMenu === plan.plan_index ? "active" : ""}
                  >
                    <i class="fa fa-folder-open" aria-hidden="true"></i>
                    {plan?.plan_title}
                  </a>
                  <span class="arrow"
                    >{activePlan === plan.plan_index ? "▲" : "▼"}</span
                  >
                </div>

                {#if activePlan === plan.plan_index}
                  {#each plan?.plan_target as target}
                    <div class="accordion_content">
                      {#each Object.entries(target) as [osType, hosts]}
                        <div class="main_accordion">- {osType}</div>
                        {#each hosts as host}
                          <div
                            class="second_accordion"
                            on:click={async () => {
                              assets = await getVulnsOfPlan({
                                plan_index: plan?.plan_index,
                                asset_target_uuid: host?.ast_uuid,
                              });
                              tableData = assets?.vulns;
                              selectedSendData = {
                                plan_index: plan?.plan_index,
                                asset_target_uuid: host?.ast_uuid,
                              };
                            }}
                          >
                            - {host.ast_uuid__ass_uuid__ast_hostname}
                          </div>
                        {/each}
                      {/each}
                    </div>
                  {/each}
                {/if}
              </div>
            {/each}
          {/if}
        </div>
      {:else}
        <div class="project_container">
          {#if assets && assets?.plans && assets?.plans?.length !== 0}
            {#each assets?.plans as asset, index}
              {#each asset?.plan_target as target}
                {#each Object.entries(target) as [osType, hosts]}
                  {#each hosts as host}
                    <div class="project_button asset">
                      <img src="./images/projectGray.png" alt="project" />
                      <a
                        href="javascript:void(0)"
                        on:click={async () => {
                          selectPage(MainPageProject, asset);
                          assets = await getVulnsOfAsset({
                            plan_index: asset?.plan_index,
                            asset_target_uuid: host?.ast_uuid,
                          });
                          tableData = assets?.vulns;
                          selectedSendData = {
                            plan_index: asset?.plan_index,
                            asset_target_uuid: host?.ast_uuid,
                          };
                        }}
                        class={activeMenu === asset ? "active" : ""}
                      >
                        <i class="fa fa-database" aria-hidden="true"></i>
                        {host?.ast_uuid__ass_uuid__ast_hostname}
                      </a>
                    </div>
                  {/each}
                {/each}
              {/each}
            {/each}
          {/if}
        </div>
      {/if}
    </aside>
  </div>

  <div class="right_menu">
    <header class="header">
      <div class="header_option">
        <button on:click={toggleView} class="toggle_button">
          <span class="arrow">&#9662;</span>
        </button>
        <form action="/action_page.php" class="form_select">
          <div class="select_container">
            <select
              name="approval_status"
              id="approval_status"
              class="select_input"
              bind:value={search["plan_index"]}
              on:change={getPlanDataSearch}
              on:change={(e) => {
                if (wholePage) {
                  wholePage = false;
                }
              }}
            >
              <option value="" selected>프로젝트</option>
              {#if plans && plans?.plans && plans?.plans?.length !== 0}
                {#each plans?.plans as plan, index}
                  <option value={plan?.plan_index}> {plan?.plan_title}</option>
                {/each}
              {/if}
            </select>
          </div>
          <div class="select_container">
            <select
              name="asset_group"
              id="asset_group"
              class="select_input"
              bind:value={vulnerabilityStatusValue}
              on:change={(e) => {
                if (wholePage) {
                  wholePage = false;
                }
              }}
            >
              <option value="" selected>취약점현황</option>
              <option value="양호">양호</option>
              <option value="취약">취약</option>
              <option value="수동점검">수동점검</option>
              <option value="인터뷰">인터뷰</option>
            </select>
          </div>
          <div class="select_container">
            <select
              name="operating_system"
              id="operating_system"
              class="select_input"
              bind:value={actionStatusValue}
              on:change={(e) => {
                if (wholePage) {
                  wholePage = false;
                }
              }}
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
          </div>
        </form>
      </div>
      <div class="header_button">
        <p>엑셀다운로드</p>
      </div>
    </header>

    <div class="swiper_container">
      {#if currentView === "default" && !wholePage}
        <MainPageProject
          bind:tableData
          bind:vulnerabilityStatusValue
          bind:actionStatusValue
          bind:setView
          bind:wholePage
          bind:selectedSendData
          bind:showProject
          bind:targetData
          bind:wholeOption
        />
      {/if}

      {#if wholePage}
        <WholePage bind:plans bind:targetData bind:setView />
      {/if}
    </div>
  </div>
</main> -->

<div class="container">
  <section>
    <!--SUB MENU-->
    <article
      class="sideMenu"
      style="overflow: auto; height: calc(100vh - 134px);"
    >
      <div class="btnWrap">
        <a
          href="javascript:void(0);"
          class="btn btnPrimary"
          on:click={async () => {
            toggleList("project");
            plans = await getVulnsOfPlan();
            tableData = plans?.vulns;
            search = {
              plan_index: "",
              asset_target_uuid: "",
            };
            setView = "plan";
          }}
        >
          프로젝트별
        </a>
        <button
          type="button"
          class="btn btnPrimary"
          on:click={async () => {
            toggleList("asset");
            assets = await getVulnsOfAsset(search);
            tableData = assets?.vulns;
            search = {
              plan_index: "",
              asset_target_uuid: "",
            };
            setView = "plan";
          }}
        >
          자산별
        </button>
      </div>
      <ul class="prMenuListToggle">
        {#if showProject}
          {#if plans && plans?.plans && plans?.plans?.length !== 0}
            {#each plans?.plans as plan, index}
              <li
                class={`menuItem ${
                  activeMenu === plan.plan_index ? "active" : ""
                } `}
                on:click={(e) => toggleMenu(e)}
              >
                <div
                  class="menu"
                  on:click={() => {
                    search.plan_index = plan.plan_index;
                    getPlanDataSearch();
                    toggleAccordion(plan.plan_index);
                    selectPage(MainPageProject, plan);
                  }}
                >
                  {plan?.plan_title} <span class="arrowIcon"></span>
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
                                  class="active"
                                  on:click={async () => {
                                    assets = await getVulnsOfPlan({
                                      plan_index: plan?.plan_index,
                                      asset_target_uuid: host?.ast_uuid,
                                    });
                                    tableData = assets?.vulns;
                                    selectedSendData = {
                                      plan_index: plan?.plan_index,
                                      asset_target_uuid: host?.ast_uuid,
                                    };
                                  }}
                                >
                                  <a href="javascriptLvoid(0);">
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
            {#if assets && assets?.plans && assets?.plans?.length !== 0}
              {#each assets?.plans as asset, index}
                {#each asset?.plan_target as target}
                  {#each Object.entries(target) as [osType, hosts]}
                    {#each hosts as host}
                      <li
                        class={`menuItem ${
                          activeMenu === asset ? "active" : ""
                        } `}
                        on:click={(e) => toggleMenu(e)}
                      >
                        <div
                          class="menu"
                          on:click={async () => {
                            selectPage(MainPageProject, asset);
                            assets = await getVulnsOfAsset({
                              plan_index: asset?.plan_index,
                              asset_target_uuid: host?.ast_uuid,
                            });
                            tableData = assets?.vulns;
                            selectedSendData = {
                              plan_index: asset?.plan_index,
                              asset_target_uuid: host?.ast_uuid,
                            };
                          }}
                        >
                          {host?.ast_uuid__ass_uuid__ast_hostname}
                        </div>
                      </li>
                    {/each}
                  {/each}
                {/each}
              {/each}
            {/if}
          </div>
        {/if}
      </ul>
    </article>
    <!--//SUBMENU-->

    <div class="contentsWrap assetview vulnerability">
      <article class="contentArea flex col">
        <section class="topCon">
          <section class="filterWrap">
            <div>
              <select
                bind:value={search["plan_index"]}
                on:change={getPlanDataSearch}
                on:change={(e) => {
                  if (wholePage) {
                    wholePage = false;
                  }
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
              <select
                name="asset_group"
                id="asset_group"
                class="select_input"
                bind:value={vulnerabilityStatusValue}
                on:change={(e) => {
                  if (wholePage) {
                    wholePage = false;
                  }
                }}
              >
                <option value="" selected>취약점현황</option>
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
                on:change={(e) => {
                  if (wholePage) {
                    wholePage = false;
                  }
                }}
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
              <!-- <select>
                <option>담당자별</option>
                <option>홍길동</option>
                <option>가나다</option>
              </select> -->
              <button type="button" class="btn btnPrimary">
                <img src="./assets/images/icon/download.svg" /> 엑셀 다운로드
              </button>
            </div>
          </section>
        </section>

        {#if currentView === "default" && !wholePage}
          <MainPageProject
            bind:tableData
            bind:vulnerabilityStatusValue
            bind:actionStatusValue
            bind:setView
            bind:wholePage
            bind:selectedSendData
            bind:showProject
            bind:targetData
            bind:wholeOption
          />
        {/if}

        {#if wholePage}
          <WholePage bind:plans bind:targetData bind:setView />
        {/if}
      </article>
    </div>
  </section>
</div>
