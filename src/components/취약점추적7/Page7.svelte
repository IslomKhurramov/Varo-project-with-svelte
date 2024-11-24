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
    filterData,
    filterDataAsset,
    filteredDataTarget,
    filteredTableDataForAsset,
    filteredTableDataForPlan,
    filteredTableDataForTarget,
    leftTrackData,
    selectedAssetTableData,
    selectedPlan,
    selectedPlanAsset,
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
  import { derived } from "svelte/store";
  import FilterPage from "./FilterPage.svelte";
  import FilterPageAsset from "./FilterPageAsset.svelte";
  import FilterTarget from "./FilterTarget.svelte";
  import { errorAlert } from "../../shared/sweetAlert";
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
  /********************************/
  // Create writable stores for the search filters
  let actionStatusValue = "";
  let selectedDate = "";
  let selectedProject = "";
  let selectedOperator = "";
  let selectedAssetForfilter = "";
  let filterPage = false;
  let filterAssetPage = false;
  let filterTargetPage = false;

  function selectPage(pageComponent, menuName) {
    currentPage = pageComponent;
    activeMenu = menuName; // Set the active menu to reflect the selection
  }
  $: if (filterPage) {
    currentPage = FilterPage;
    activeMenu = null;
  } else if (activeView === "project") {
    currentPage = ProjectAll;
    actionStatusValue = "";
    selectedDate = "";
    selectedProject = "";
    selectedOperator = "";
    selectedAssetForfilter = "";
    activeMenu = "전체";
  }

  $: if (filterAssetPage) {
    currentPage = FilterPageAsset;
    activeMenu = null;
  } else if (activeView === "asset") {
    currentPage = AssetAll;
    actionStatusValue = "";
    selectedDate = "";
    selectedProject = "";
    selectedOperator = "";
    selectedAssetForfilter = "";
    activeMenu = "전체";
  }
  $: if (filterTargetPage) {
    currentPage = FilterTarget;
    activeMenu = null;
  } else if (activeView === "third") {
    currentPage = ThirdAll;
    actionStatusValue = "";
    selectedDate = "";
    selectedProject = "";
    selectedOperator = "";
    selectedAssetForfilter = "";
    activeMenu = "전체";
  }
  // $: {
  //   if (!filterPage && !filterAssetPage && !filterTargetPage) {
  //     // If no filter flags are active, set default to ProjectAll
  //     currentPage = ProjectAll;
  //     activeMenu = "전체";
  //   }
  // }

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
    filterPage = false;
    filterAssetPage = false;
    filterTargetPage = false;
    if (view === "project") {
      currentPage = ProjectAll;
      filterPage = false;
      filterAssetPage = false;
      filterTargetPage = false;
    } else if (view === "asset") {
      currentPage = AssetAll;
      filterPage = false;
      filterAssetPage = false;
      filterTargetPage = false;
    } else if (view === "third") {
      currentPage = ThirdAll; // Assuming this represents Third's 전체 view filterPage=false;
      filterAssetPage = false;
      filterTargetPage = false;
    }
  }
  /*****************LEFTDATA**************************************/
  onMount(async () => {
    try {
      await getLeftDatas();
      await planData();
      await assetData();
      await thirdData();
    } catch (err) {
      await errorAlert(err?.message);
    }
  });

  async function getLeftDatas() {
    try {
      const response = await getLeftTrackData();
      console.log("response", response);
      if (response.RESULT === "OK") {
        leftTrackData.set(Object.values(response.CODE));
      } else {
        errorAlert(response.CODE);
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

  async function planDataByCategory(selectedProject) {
    try {
      console.log("Fetching data for selected project:", selectedProject);
      const response = await getTraceByPlan(selectedProject);

      if (response && response.CODE) {
        filterData.set(response.CODE); // Store the full data
        filterPage = true;
      } else {
        console.error("No data found for selected project:", selectedProject);
        filterData.set({ plans: [], vulns: [] }); // Reset if no data
      }
    } catch (err) {
      console.error("Error fetching filtered data:", err.message);
      alert(`Error: ${err.message}`);
    }
  }

  const uniqueOperators = derived(filterData, ($filterData) => {
    if ($filterData?.vulns) {
      // Use a Set to keep unique names
      const uniqueNames = new Set(
        $filterData.vulns.map(
          (plan) => plan.ast_uuid__ass_uuid__ast_operator_person,
        ),
      );
      return [...uniqueNames];
    }
    return [];
  });

  $: console.log("filterData", $filterData);
  $: if (selectedProject) {
    planDataByCategory(selectedProject);
  }
  $: {
    // Watch for changes in filterData and the selected filters (actionStatusValue, selectedDate, selectedOperator)
    filterData.subscribe((data) => {
      if (!data || !data.vulns || data.vulns.length === 0) {
        filteredTableDataForPlan.set([]); // If no data, reset filtered data
        return;
      }

      const filtered = data.vulns.filter((item) => {
        const matchesStatus = actionStatusValue
          ? item.cfr_fix_status__cvs_index === actionStatusValue // Filter based on status
          : true;
        const matchesDate = selectedDate
          ? item.ccr_cdate.startsWith(selectedDate) // Assuming `ccr_cdate` format is "YYYY-MM-DD HH:MM:SS"
          : true;
        const matchesOperator = selectedOperator
          ? item.ast_uuid__ass_uuid__ast_operator_person === selectedOperator // Filter based on operator
          : true;

        return matchesStatus && matchesDate && matchesOperator;
      });

      // Set filtered data
      filteredTableDataForPlan.set(filtered);
    });
  }
  $: console.log("filteredTableDataForPlan", $filteredTableDataForPlan);
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

  /*********************************************************/
  async function tableDataOfAsset2(selectedAssetForfilter) {
    console.log("selectedAsset:", selectedAssetForfilter);
    try {
      const response = await getTraceByAsset(selectedAssetForfilter);

      if (response) {
        filterDataAsset.set(response.CODE);
        filterAssetPage = true;
      } else {
        filterDataAsset.set({ plans: [], vulns: [] });
      }
    } catch (err) {
      alert(`Error getting asset details: ${err.message}`);
    }
  }
  const uniqueOperatorsAsset = derived(filterDataAsset, ($filterDataAsset) => {
    if ($filterDataAsset[0]?.vulns) {
      // Use a Set to keep unique names
      const uniqueNames = new Set(
        $filterDataAsset[0].vulns.map(
          (plan) => plan.ast_uuid__ass_uuid__ast_operator_person,
        ),
      );
      return [...uniqueNames];
    }
    return [];
  });
  $: console.log("allTraceByThird", $allTraceByThird);

  $: if (selectedAssetForfilter) {
    tableDataOfAsset2(selectedAssetForfilter); // Pass the correct argument
  }
  $: {
    filterDataAsset.subscribe((data) => {
      if (!data || !data[0]?.vulns || data[0].vulns.length === 0) {
        filteredTableDataForAsset.set([]); // If no data, reset filtered data
        return;
      }

      // Filter the vulnerabilities based on selected values
      const filtered = data[0].vulns.filter((item) => {
        const matchesStatus = actionStatusValue
          ? item.cfr_fix_status__cvs_index === actionStatusValue // Filter based on status
          : true;

        const matchesDate = selectedDate
          ? item.ccr_cdate.startsWith(selectedDate) // Assuming `ccr_cdate` format is "YYYY-MM-DD HH:MM:SS"
          : true;

        const matchesOperator = selectedOperator
          ? item.ast_uuid__ass_uuid__ast_operator_person === selectedOperator // Filter based on operator
          : true;

        // Return true if all conditions match
        return matchesStatus && matchesDate && matchesOperator;
      });

      // Set the filtered results in the store
      filteredTableDataForAsset.set(filtered);
    });
  }
  $: console.log("filteredTableDataForAsset", $filteredTableDataForAsset);
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
  $: console.log("allTraceByPlan", $allTraceByPlan);
  /********************MODAL DATA*******************************/

  let selectedTarget = "";
  let selectedRelatedItem = "";
  let relatedItemDetails = {};
  let cct_index = ""; // Variable to store cct_index

  // Reactive updates for related targets and their details
  $: relatedTargetsData =
    $leftTrackData?.[2]?.find(
      (target) => target.cct_target === selectedTarget?.split("|")[0],
    )?.targets_data || [];

  $: relatedItemDetails =
    relatedTargetsData.find(
      (item) => item.ccc_item_no === selectedRelatedItem,
    ) || {};

  // Clear selections when selectedTarget changes
  $: if (selectedTarget) {
    const [cct_target, extractedCctIndex] = selectedTarget.split("|");
    cct_index = extractedCctIndex || ""; // Assign cct_index
    selectedRelatedItem = "";
    relatedItemDetails = {};
  }

  $: ccc_index = relatedItemDetails.ccc_index || "";
  async function targetDataFilter(cct_index, ccc_index) {
    console.log("function", cct_index, ccc_index);
    try {
      const response = await traceByTarget(cct_index, ccc_index);

      if (response) {
        filteredDataTarget.set(response.CODE);
        filterTargetPage = true;
      } else {
      }
    } catch (err) {
      throw err;
    }
  }
  $: if (cct_index && ccc_index) {
    targetDataFilter(cct_index, ccc_index); // Call only when valid indices are provided
  }
  $: {
    filteredDataTarget.subscribe((data) => {
      if (!data || !data?.vulns || data.vulns.length === 0) {
        filteredTableDataForTarget.set([]); // If no data, reset filtered data
        return;
      }

      // Filter the vulnerabilities based on selected values
      const filtered = data.vulns.filter((item) => {
        const matchesStatus = actionStatusValue
          ? item.cfr_fix_status__cvs_index === actionStatusValue // Filter based on status
          : true;

        const matchesDate = selectedDate
          ? item.ccr_cdate.startsWith(selectedDate) // Assuming `ccr_cdate` format is "YYYY-MM-DD HH:MM:SS"
          : true;

        const matchesOperator = selectedOperator
          ? item.ast_uuid__ass_uuid__ast_operator_person === selectedOperator // Filter based on operator
          : true;

        // Return true if all conditions match
        return matchesStatus && matchesDate && matchesOperator;
      });

      // Set the filtered results in the store
      filteredTableDataForTarget.set(filtered);
    });
  }

  const uniqueOperatorsTarget = derived(
    filteredDataTarget,
    ($filteredDataTarget) => {
      if ($filteredDataTarget?.vulns) {
        // Use a Set to keep unique names
        const uniqueNames = new Set(
          $filteredDataTarget.vulns.map(
            (plan) => plan.ast_uuid__ass_uuid__ast_operator_person,
          ),
        );
        return [...uniqueNames];
      }
      return [];
    },
  );

  $: console.log("uniqueOperatorsTarget", $filteredDataTarget);
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
              {#if activeView === "project"}
                <select bind:value={selectedProject}>
                  <option value="" selected>프로젝트</option>
                  {#if $leftTrackData.length > 0}
                    {#each $leftTrackData[0] as plan}
                      <option value={plan.ccp_index}> {plan.ccp_title}</option>
                    {/each}
                  {/if}
                </select>
              {:else if activeView === "asset"}
                <select bind:value={selectedAssetForfilter}>
                  <option value="" selected>프로젝트</option>
                  {#if $leftTrackData.length > 0}
                    {#each $leftTrackData[1] as asset}
                      <option value={asset.asg_index}>
                        {asset.asg_title}</option
                      >
                    {/each}
                  {/if}
                </select>
              {:else if activeView === "third"}
                {#if $leftTrackData[2]?.length}
                  <select
                    name="operating_system"
                    id="operating_system"
                    class="select_input"
                    bind:value={selectedTarget}
                  >
                    <option value="" selected>운영 체제 선택</option>
                    {#if $leftTrackData[2].length > 0}
                      {#each $leftTrackData[2] as target (target.cct_target)}
                        <option
                          value={`${target.cct_target}|${target.cct_index}`}
                          >{target.cct_target}</option
                        >
                      {/each}
                    {/if}
                  </select>

                  {#if selectedTarget}
                    <select
                      bind:value={selectedRelatedItem}
                      name="related_data"
                      id="related_data"
                      class="select_input"
                    >
                      <option value="" selected disabled>관련 항목 선택</option>
                      {#each relatedTargetsData as item}
                        <option value={item.ccc_item_no}
                          >{item.ccc_item_no}</option
                        >
                      {/each}
                    </select>
                  {/if}
                {:else}
                  <p>운영 체제 데이터가 없습니다.</p>
                {/if}
              {/if}

              <input
                bind:value={selectedDate}
                class="select_input"
                type="date"
              />

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
              {#if selectedProject !== "" || selectedAssetForfilter !== "" || ccc_index !== ""}
                <select
                  name="operating_system"
                  id="operating_system"
                  class="select_input"
                  bind:value={selectedOperator}
                >
                  <option value="" selected>담당자별</option>
                  {#if activeView === "project"}
                    {#if $filterData?.vulns?.length > 0}
                      {#each $uniqueOperators as operator}
                        <option value={operator}>{operator}</option>
                      {/each}
                    {:else}
                      <option disabled>담당자가 없습니다</option>
                    {/if}
                  {:else if activeView === "asset"}
                    {#if $filterDataAsset[0]?.vulns?.length > 0}
                      {#each $uniqueOperatorsAsset as operator}
                        <option value={operator}>{operator}</option>
                      {/each}
                    {:else}
                      <option disabled>담당자가 없습니다</option>
                    {/if}
                  {:else if activeView === "third"}
                    {#if $filteredDataTarget?.vulns && $filteredDataTarget.vulns.length > 0}
                      {#each $uniqueOperatorsTarget as operator}
                        <option value={operator}>{operator}</option>
                      {/each}
                    {:else}
                      <option disabled>담당자가 없습니다</option>
                    {/if}
                  {/if}
                </select>
              {/if}
              <button type="button" class="btn btnPrimary">
                <img src="./assets/images/reset.png" alt="search" />
                초기화
              </button>

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
              <!-- <button type="button" class="btn btnPrimary"> 엑셀저장 </button> -->

              {#if filterPage || filterAssetPage || filterTargetPage}
                <button
                  on:click={() => {
                    // Reset filter flags
                    filterPage = false;
                    filterAssetPage = false;
                    filterTargetPage = false;

                    // Reset the currentPage based on the filter flag that was active
                    if (filterPage) {
                      currentPage = ProjectAll; // Go back to ProjectAll
                    } else if (filterAssetPage) {
                      currentPage = AssetAll; // Go back to AssetAll
                    } else if (filterTargetPage) {
                      currentPage = ThirdAll; // Go back to ThirdAll
                    }

                    // Optionally, reset other filters
                    actionStatusValue = "";
                    selectedDate = "";
                    selectedProject = "";
                    selectedOperator = "";
                    selectedAssetForfilter = "";

                    // Reset activeMenu to default
                    activeMenu = "전체";
                  }}
                  type="button"
                  class="btn btnPrimary"
                >
                  돌아가기
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
  .btn {
    width: 111px;
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
