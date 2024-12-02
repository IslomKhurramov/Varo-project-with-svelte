<script>
  import { Swiper, SwiperSlide } from "swiper/svelte";
  import SwiperCore, { Navigation, Pagination } from "swiper";
  import "swiper/swiper-bundle.css";
  import {
    allTraceByThird,
    comparedPlanTarget1,
    comparedPlanTarget2,
    comparedVulnsTarget1,
    comparedVulnsTarget2,
    comparisonThird,
    leftTrackData,
    ModalData,
    selectedDataTarget1,
    selectedDataTarget2,
  } from "../../services/page7/trace.store";
  import { successAlert, errorAlert } from "../../shared/sweetAlert";

  import { AccordionItem, Accordion } from "flowbite-svelte";
  // import "flowbite/dist/flowbite.css";
  import { get } from "svelte/store";

  export let selectedAsset;
  export let trace_ccc_index;
  export let trace_cct_index;

  /****************************/
  function check() {
    console.log(selectedAsset);
    console.log(trace_ccc_index);
    console.log(trace_cct_index);
  }

  let showModalProjectComparison = false;
  let selectedData = [];
  let asset_name = "";
  let chklist = "";
  let target = "";
  let secondTable = false;
  let currentModalIndex = 0;

  function handleTableClick(index, data) {
    currentModalIndex = index;
    const {
      ast_uuid__ass_uuid__ast_hostname: asset_name,
      ccr_item_no__ccc_item_no: chklist,
      cct_index__cct_target: target,
    } = data;
    // console.log("modal<", asset_name, chklist, target);
    showModalProjectComparison = true;
    modalDataFunction(asset_name, chklist, target);
  }
  function handleTableClick2(index, data) {
    currentModalIndex = index;
    secondTable = true;
    const {
      ast_uuid__ass_uuid__ast_hostname: asset_name,
      ccr_item_no__ccc_item_no: chklist,
      cct_index__cct_target: target,
    } = data;
    // console.log("modal<", asset_name, chklist, target);
    showModalProjectComparison = true;
    modalDataFunction(asset_name, chklist, target);
  }
  /******************************************************************/
  function handleNext() {
    if (currentModalIndex < $comparedVulnsTarget1.length - 1) {
      currentModalIndex++;
      const {
        ast_uuid__ass_uuid__ast_hostname: asset_name,
        ccr_item_no__ccc_item_no: chklist,
        cct_index__cct_target: target,
      } = $comparedVulnsTarget1[currentModalIndex];
      modalDataFunction(asset_name, chklist, target);
    } else {
      console.log("Reached the last item.");
    }
  }

  function handleNext2() {
    if (currentModalIndex < $comparedVulnsTarget2.length - 1) {
      currentModalIndex++;
      const {
        ast_uuid__ass_uuid__ast_hostname: asset_name,
        ccr_item_no__ccc_item_no: chklist,
        cct_index__cct_target: target,
      } = $comparedVulnsTarget2[currentModalIndex];
      modalDataFunction(asset_name, chklist, target);
    } else {
      console.log("Reached the last item.");
    }
  }
  /*************************************************************/
  function handlePrev() {
    if (currentModalIndex > 0) {
      currentModalIndex--;
      const {
        ast_uuid__ass_uuid__ast_hostname: asset_name,
        ccr_item_no__ccc_item_no: chklist,
        cct_index__cct_target: target,
      } = $comparedVulnsTarget1[currentModalIndex];
      modalDataFunction(asset_name, chklist, target);
    } else {
      console.log("Reached the first item.");
    }
  }
  function handlePrev2() {
    if (currentModalIndex > 0) {
      currentModalIndex--;
      const {
        ast_uuid__ass_uuid__ast_hostname: asset_name,
        ccr_item_no__ccc_item_no: chklist,
        cct_index__cct_target: target,
      } = $comparedVulnsTarget2[currentModalIndex];
      modalDataFunction(asset_name, chklist, target);
    } else {
      console.log("Reached the first item.");
    }
  }
  function selectData1(data1) {
    selectedDataTarget1.set(data1);
  }
  function selectData2(data2) {
    selectedDataTarget2.set(data2);
  }

  let cachedModalData = {};

  async function modalDataFunction(asset_name, chklist, target) {
    const cacheKey = `${asset_name}-${chklist}-${target}`;
    if (cachedModalData[cacheKey]) {
      ModalData.set(cachedModalData[cacheKey]);
      return;
    }

    try {
      const response = await modalDataService(asset_name, chklist, target);
      if (response && response.CODE) {
        cachedModalData[cacheKey] = response.CODE;
        ModalData.set(response.CODE);
      } else {
        ModalData.set([]); // Fallback to empty array
        console.error("No valid modal data received.");
      }
    } catch (err) {
      console.error("Error fetching modal data:", err.message);
      alert(`Error getting asset details: ${err.message}`);
    }
  }

  // Automatically select the first item when comparedPlanData1 is updated
  $: if ($comparedPlanTarget1 && $comparedPlanTarget1.length > 0) {
    selectData1($comparedPlanTarget1[0]);
  }
  $: if ($comparedPlanTarget2 && $comparedPlanTarget2.length > 0) {
    selectData2($comparedPlanTarget2[0]);
  }

  async function compareTarget() {
    if (
      Object.keys(relatedItemDetails).length === 0 ||
      Object.keys(relatedItemDetails2).length === 0
    ) {
      errorAlert("두 자산을 모두 선택해주세요..");
      return;
    }

    if (relatedItemDetails === relatedItemDetails2) {
      errorAlert("비교를 위해서는 선택한 자산이 달라야 합니다..");
      return;
    }
    try {
      const response = await compareTraceByTarget(
        relatedItemDetails,
        relatedItemDetails2,
      );

      if (response) {
        comparisonThird.set(response.CODE); // Update the comparison asset store
        const comparisonData = get(comparisonThird); // Get the latest data from the store

        comparedPlanTarget1.set(comparisonData.first?.plans || []);
        comparedPlanTarget2.set(comparisonData.second?.plans || []);
        comparedVulnsTarget1.set(comparisonData.first.vulns || []);
        comparedVulnsTarget2.set(comparisonData.second.vulns || []);

        selectedDataTarget1.set(comparisonData.first || null);
        selectedDataTarget2.set(comparisonData.second || null);

        console.log("Updated comparison data3:", selectedDataTarget1);
      } else {
        console.error("No response from the comparison API.");
      }
    } catch (err) {
      alert(`Error getting asset details: ${err.message}`);
    }
  }

  SwiperCore.use([Navigation, Pagination]);
  let swiperData = [];
  for (let i = 0; i < 20; i++) {
    swiperData.push({
      number: (i + 1).toString(),
      planName: "plan",
      version: "1.0.0",
    });
  }
  function handleKeyDown(event) {
    if (event.key === "Escape") {
      showModalProjectComparison = false;
    }
  }
  function getStrokeColor(score) {
    if (score > 60)
      return "#0067ff"; // Blue
    else if (score > 30)
      return "#00ff00"; // Green
    else return "#ff0000"; // Red
  }

  import { onMount } from "svelte";
  import {
    compareTraceByTarget,
    modalDataService,
  } from "../../services/page7/service";

  onMount(() => {
    // Listen for keydown event when the modal is open
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      // Remove the event listener when the component is destroyed
      window.removeEventListener("keydown", handleKeyDown);
    };
  });
  /*****************************************************************************************/
  let selectedTarget = "";
  let selectedRelatedItem = "관련 항목 선택";
  let relatedItemDetails = {};
  let selectedTarget2 = "";
  let selectedRelatedItem2 = "관련 항목 선택";
  let relatedItemDetails2 = {};

  // $: console.log("related", relatedItemDetails);
  // Reactive variable to get `targets_data` for the selected target
  $: relatedTargetsData =
    $leftTrackData[2].find((target) => target.cct_target === selectedTarget)
      ?.targets_data || [];

  // Reactive statement to store details of the selected item
  $: relatedItemDetails =
    relatedTargetsData.find(
      (item) => item.ccc_item_no === selectedRelatedItem,
    ) || {};

  $: relatedTargetsData2 =
    $leftTrackData[2].find((target) => target.cct_target === selectedTarget2)
      ?.targets_data || [];

  // Reactive statement to store details of the selected item
  $: relatedItemDetails2 =
    relatedTargetsData2.find(
      (item) => item.ccc_item_no === selectedRelatedItem2,
    ) || {};

  // $: console.log("1:", relatedItemDetails2);
</script>

<p class="header_title2">점검항목 그룹별 점검 결과</p>
<section>
  <div class="firstContainer">
    <div class="first_select">
      <!-- First Dropdown -->
      <select
        name="operating_system"
        id="operating_system"
        class="select_input"
        bind:value={selectedTarget}
      >
        <option value="" selected>운영 체제 선택</option>
        {#each $leftTrackData[2] as target (target.cct_target)}
          <option value={target.cct_target}>{target.cct_target}</option>
        {/each}
      </select>

      <!-- Second Dropdown -->
      {#if selectedTarget}
        <select
          bind:value={selectedRelatedItem}
          name="related_data"
          id="related_data"
          class="select_input"
        >
          <option value="" selected>관련 항목 선택</option>
          {#each relatedTargetsData as item}
            <option value={item.ccc_item_no}>{item.ccc_item_no}</option>
          {/each}
        </select>
      {/if}
    </div>
    {#if $selectedDataTarget2 && $selectedDataTarget2.ccp_security_point !== undefined}
      <div class="diagram_container">
        <div class="right_diag">
          <div
            class="circle"
            style="width: 150px;"
            data-percent={$selectedDataTarget1?.ccp_security_point || 0}
            data-offset="440"
          >
            <svg viewBox="0 0 150 150">
              <!-- Background Circle -->
              <circle
                cx="75"
                cy="75"
                r="70"
                stroke="#fff"
                stroke-width="10"
                fill="none"
              />
              <!-- Progress Circle -->
              <circle
                class="progress"
                cx="75"
                cy="75"
                r="70"
                stroke={getStrokeColor(
                  $selectedDataTarget1?.ccp_security_point || 0,
                )}
                stroke-width="10"
                fill="none"
                stroke-dasharray="440"
                stroke-dashoffset={440 -
                  (440 * ($selectedDataTarget1?.ccp_security_point || 0)) / 100}
                stroke-linecap="round"
                transform="rotate(-90 75 75)"
              />
            </svg>
            <!-- Percentage Label -->
            <div class="percent">
              <span
                class="number"
                style="font-size: 32px; color: {getStrokeColor(
                  $selectedDataTarget1?.ccp_security_point || 0,
                )};"
              >
                {$selectedDataTarget1?.ccp_security_point > 0
                  ? $selectedDataTarget1?.ccp_security_point
                  : 0}%
              </span>
            </div>
          </div>
          <p>전체보안수준</p>
        </div>

        <div class="iconCard">
          <article class="graphCard hoverCard">
            <div class="contents">
              <!-- Asset Details -->
              <div class="text flex col justify-between">
                <ul>
                  <li>
                    <span>취약 : </span>{$comparisonThird.first
                      .vulnerability_summary.total_vulnerabilities ||
                      "Unknown OS"}건
                  </li>
                  <li>
                    <span>관련시스템 : </span>{$comparisonThird.first
                      .system_count || "Unknown OS"}건
                  </li>
                  <li style="margin-top: 20px;">
                    <span>[취약점 요약] </span>
                  </li>
                  <li>
                    <span>최다자산 : </span>{$comparisonThird.first
                      .vulnerability_summary.most_vulnerable_asset ||
                      "Unknown IP"}
                  </li>
                  <li>
                    <span>최다항목 : </span>{$comparisonThird.first
                      .vulnerability_summary.most_common_item || "No Target"}
                  </li>
                  <li>
                    <span>취약점수 : </span>{$comparisonThird.first
                      .vulns_count}건
                  </li>
                  <li>
                    <span>조치개수 : </span>{$comparisonThird.first
                      .vulnerability_summary.fixed_count ||
                      "Unknown Hostname"}건
                  </li>
                </ul>
                <ul class="second_column">
                  <li>
                    <span>[점검이력] </span>
                  </li>
                  {#if $comparedPlanTarget1 && $comparedPlanTarget1.length > 0}
                    {#each $comparedPlanTarget1 as dat1}
                      <li>
                        <a
                          class:selected={dat1 === $selectedDataTarget1}
                          on:click={() => selectData1(dat1)}>{dat1.ccp_title}</a
                        >
                      </li>
                    {/each}
                  {:else}
                    <p>데이터 없음e</p>
                  {/if}
                </ul>
              </div>
            </div>
          </article>
        </div>
      </div>
    {:else}
      <div class="no-assets">
        <p>자산을 찾을 수 없습니다.</p>
      </div>
    {/if}
  </div>
  <div class="firstContainer">
    <div class="first_select">
      <!-- First Dropdown -->
      <select
        name="operating_system"
        id="operating_system"
        class="select_input"
        bind:value={selectedTarget2}
      >
        <option value="" selected>운영 체제 선택</option>
        {#each $leftTrackData[2] as target (target.cct_target)}
          <option value={target.cct_target}>{target.cct_target}</option>
        {/each}
      </select>

      <!-- Second Dropdown -->
      {#if selectedTarget2}
        <select
          bind:value={selectedRelatedItem2}
          name="related_data"
          id="related_data"
          class="select_input"
        >
          <option value="" selected>관련 항목 선택</option>
          {#each relatedTargetsData2 as item}
            <option value={item.ccc_item_no}>{item.ccc_item_no}</option>
          {/each}
        </select>
      {/if}
    </div>

    {#if $selectedDataTarget2 && $selectedDataTarget2.ccp_security_point !== undefined}
      <div class="diagram_container">
        <div class="right_diag">
          <div
            class="circle"
            style="width: 150px;"
            data-percent={$selectedDataTarget2?.ccp_security_point || 0}
            data-offset="440"
          >
            <svg viewBox="0 0 150 150">
              <!-- Background Circle -->
              <circle
                cx="75"
                cy="75"
                r="70"
                stroke="#fff"
                stroke-width="10"
                fill="none"
              />
              <!-- Progress Circle -->
              <circle
                class="progress"
                cx="75"
                cy="75"
                r="70"
                stroke={getStrokeColor(
                  $selectedDataTarget2?.ccp_security_point || 0,
                )}
                stroke-width="10"
                fill="none"
                stroke-dasharray="440"
                stroke-dashoffset={440 -
                  (440 * ($selectedDataTarget2?.ccp_security_point || 0)) / 100}
                stroke-linecap="round"
                transform="rotate(-90 75 75)"
              />
            </svg>
            <!-- Percentage Label -->
            <div class="percent">
              <span
                class="number"
                style="font-size: 32px; color: {getStrokeColor(
                  $selectedDataTarget2?.ccp_security_point || 0,
                )};"
              >
                {$selectedDataTarget2?.ccp_security_point > 0
                  ? $selectedDataTarget2?.ccp_security_point
                  : 0}%
              </span>
            </div>
          </div>
          <p>전체보안수준</p>
        </div>

        <div class="iconCard">
          <article class="graphCard hoverCard">
            <div class="contents">
              <!-- Asset Details -->
              <div class="text flex col justify-between">
                <ul>
                  <li>
                    <span>취약 : </span>{$comparisonThird.second
                      .vulnerability_summary.total_vulnerabilities ||
                      "Unknown OS"}건
                  </li>
                  <li>
                    <span>관련시스템 : </span>{$comparisonThird.second
                      .system_count || "Unknown OS"}건
                  </li>
                  <li style="margin-top: 20px;">
                    <span>[취약점 요약] </span>
                  </li>
                  <li>
                    <span>최다자산 : </span>{$comparisonThird.second
                      .vulnerability_summary.most_vulnerable_asset ||
                      "Unknown IP"}
                  </li>
                  <li>
                    <span>최다항목 : </span>{$comparisonThird.second
                      .vulnerability_summary.most_common_item || "No Target"}
                  </li>
                  <li>
                    <span>취약점수 : </span>{$comparisonThird.second
                      .vulns_count}건
                  </li>
                  <li>
                    <span>조치개수 : </span>{$comparisonThird.second
                      .vulnerability_summary.fixed_count ||
                      "Unknown Hostname"}건
                  </li>
                </ul>
                <ul class="second_column">
                  <li>
                    <span>[점검이력] </span>
                  </li>
                  {#if $comparedPlanTarget2 && $comparedPlanTarget2.length > 0}
                    {#each $comparedPlanTarget2 as dat2}
                      <li>
                        <a
                          class:selected={dat2 === $selectedDataTarget2}
                          on:click={() => selectData2(dat2)}>{dat2.ccp_title}</a
                        >
                      </li>
                    {/each}
                  {:else}
                    <p>데이터 없음</p>
                  {/if}
                </ul>
              </div>
            </div>
          </article>
        </div>
      </div>
    {:else}
      <div class="no-assets">
        <p>자산을 찾을 수 없습니다.</p>
      </div>
    {/if}
  </div>
</section>
<button class="btn modify-btn" on:click={compareTarget}>비교</button>

<section class="table_section">
  <div
    class="tableListWrap table2"
    style="margin-bottom: 20px; margin-top:20px; margin height:50vh;"
  >
    <table class="tableList hdBorder font-size: 16px;">
      <colgroup>
        <col style="width:55px;" />
        <col style="width:100px;" />
        <col style="width:160px;" />
        <col style="width:79px;" />
        <col style="width:86px;" />
        <col />
      </colgroup>

      <thead>
        <tr>
          <th class="text-center">순번</th>
          <th class="text-center">자산명</th>
          <th class="text-center">점검항목 </th>
          <th class="text-center">위험도</th>
          <th class="text-center">점검결과 </th>
          <th class="text-center">조치현황 </th>
        </tr>
      </thead>

      {#if $comparedVulnsTarget1}
        {#each $comparedVulnsTarget1 as vuln, index}
          <tbody>
            <tr
              on:click={() => {
                handleTableClick(index, vuln);
              }}
              class="clickLine"
              class:active-row={index === currentModalIndex}
            >
              <td class="text-center line-height"
                >{$comparedVulnsTarget1.length - index}</td
              >
              <td class="text-center line-height"
                >{vuln.ast_uuid__ass_uuid__ast_hostname}</td
              >
              <td class="text-center line-height"
                >{vuln.ccr_item_no__ccc_item_title}</td
              >
              <td class="text-center line-height"
                >{vuln.ccr_item_no__ccc_item_level}</td
              >
              <td class="text-center line-height">{vuln.ccr_item_result}</td>
              <td>
                <div class="status-container line-height">
                  {@html vuln.ccr_item_status.replace(/\n/g, "<br/>")}
                </div>
              </td>
            </tr>
          </tbody>
        {/each}
      {:else}
        <div class="no-assets">
          <p>데이터 없음.</p>
        </div>
      {/if}
    </table>
  </div>
  <div
    class="tableListWrap table2"
    style="margin-bottom: 20px; margin-top:20px; margin height:50vh;"
  >
    <table class="tableList hdBorder font-size: 16px;">
      <colgroup>
        <col style="width:55px;" />
        <col style="width:100px;" />
        <col style="width:160px;" />
        <col style="width:79px;" />
        <col style="width:86px;" />
        <col />
      </colgroup>

      <thead>
        <tr>
          <th class="text-center">순번</th>
          <th class="text-center">자산명</th>
          <th class="text-center">점검항목 </th>
          <th class="text-center">위험도</th>
          <th class="text-center">점검결과 </th>
          <th class="text-center">조치현황 </th>
        </tr>
      </thead>

      {#if $comparedVulnsTarget2}
        {#each $comparedVulnsTarget2 as vuln, index}
          <tbody>
            <tr
              on:click={() => {
                handleTableClick2(index, vuln);
              }}
              class="clickLine"
              class:active-row={index === currentModalIndex}
            >
              <td class="text-center line-height"
                >{$comparedVulnsTarget2.length - index}</td
              >
              <td class="text-center line-height"
                >{vuln.ast_uuid__ass_uuid__ast_hostname}</td
              >
              <td class="text-center line-height"
                >{vuln.ccr_item_no__ccc_item_title}</td
              >
              <td class="text-center line-height"
                >{vuln.ccr_item_no__ccc_item_level}</td
              >
              <td class="text-center line-height">{vuln.ccr_item_result}</td>
              <td>
                <div class="status-container line-height">
                  {@html vuln.ccr_item_status.replace(/\n/g, "<br/>")}
                </div>
              </td>
            </tr>
          </tbody>
        {/each}
      {:else}
        <div class="no-assets">
          <p>데이터 없음.</p>
        </div>
      {/if}
    </table>
  </div>
</section>
{#if showModalProjectComparison}
  <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
  <div
    class="modal-open-wrap"
    on:click={() => (showModalProjectComparison = false)}
    on:keydown={handleKeyDown}
    tabindex="0"
  >
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <dialog
      open
      on:close={() => (showModalProjectComparison = false)}
      on:click|stopPropagation
    >
      <Swiper
        slidesPerView={1}
        spaceBetween={10}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        on:swiper={(swiper) => console.log(swiper)}
      >
        {#if secondTable}
          {#each $comparedVulnsTarget2 as vuln, index}
            <SwiperSlide>
              <p class="header_title">
                [{vuln.ast_uuid__ass_uuid__ast_hostname}] [{vuln.ccr_item_no__ccc_item_no}]
                점검항목 타이틀
              </p>
              <div>
                <table>
                  <colgroup>
                    <col style="width: 120px;" />
                    <col />
                  </colgroup>

                  <!-- 점검플랜 -->
                  <tr>
                    <th
                      class="text-center"
                      style="  border-top-left-radius: 10px;  
                    border-top-right-radius: 10px;  
                  ">점검플랜</th
                    >
                    {#each $ModalData as modal, index}
                      <td>
                        <div class="graphCardWrap">
                          <div class="iconCard">
                            <article class="graphCard">
                              <div class="contents2">
                                <div class="text2">
                                  <ul>
                                    <li>
                                      <span>프로젝트명 : </span>{modal.plan
                                        .ccp_index__ccp_title ||
                                        "Unknown Project"}
                                    </li>
                                    <li>
                                      <span>점검일시 : </span>{modal.plan
                                        .ccp_index__ccp_cdate
                                        ? new Date(
                                            modal.plan.ccp_index__ccp_cdate,
                                          ).toLocaleString()
                                        : "Unknown Date"}
                                    </li>
                                    <li>
                                      <span>관련시스템 : </span>{modal.plan
                                        .system_count || "No Systems"}
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </article>
                          </div>
                        </div>
                      </td>
                    {/each}
                  </tr>

                  <!-- 점검이력 -->
                  <tr>
                    <th class="text-center">점검이력</th>
                    {#each $ModalData as modal, index}
                      <td>
                        <div class="graphCardWrap">
                          {#if modal.result.length > 0}
                            {#each modal.result as res}
                              <div class="iconCard">
                                <article class="graphCard">
                                  <div class="contents2">
                                    <div class="text2">
                                      <ul>
                                        <li>
                                          <span
                                            >프로젝트명 :
                                          </span>{res.ccr_item_result ||
                                            "Unknown Result"}
                                        </li>
                                        <li>
                                          <span>점검일시 : </span>{new Date(
                                            res.ccr_cdate,
                                          ).toLocaleString() || "Unknown Date"}
                                        </li>
                                        <li>
                                          <span
                                            >결과상세 :
                                          </span>{@html res.ccr_item_status.replace(
                                            /\n/g,
                                            "<br/>",
                                          ) || "No Details"}
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </article>
                              </div>
                            {/each}
                          {:else}
                            <div class="graphCardWrap">
                              <div class="iconCard">데이터 없음</div>
                            </div>
                          {/if}
                        </div>
                      </td>
                    {/each}
                  </tr>

                  <!-- 조치이력 -->
                  <tr>
                    <th class="text-center">조치이력</th>
                    {#each $ModalData as modal, index}
                      <td>
                        <div class="graphCardWrap">
                          {#if modal.fix_plan.length > 0}
                            {#each modal.fix_plan as action}
                              <div class="iconCard">
                                <article class="graphCard">
                                  <div class="contents2">
                                    <div class="text2">
                                      <ul>
                                        <li>
                                          <span
                                            >조치명 :
                                          </span>{action.action_name ||
                                            "Unknown Action"}
                                        </li>
                                        <li>
                                          <span>조치일시 : </span>{new Date(
                                            action.action_date,
                                          ).toLocaleString() || "Unknown Date"}
                                        </li>
                                        <li>
                                          <span>결과 : </span>{action.result ||
                                            "No Result"}
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </article>
                              </div>
                            {/each}
                          {:else}
                            <div class="graphCardWrap">
                              <div class="iconCard">데이터 없음</div>
                            </div>
                          {/if}
                        </div>
                      </td>
                    {/each}
                  </tr>
                  <!-- 조치내역 -->
                  <tr>
                    <th
                      class="text-center"
                      style="
                    border-bottom-left-radius: 10px; 
                    border-bottom-right-radius: 10px;">조치내역</th
                    >
                    {#each $ModalData as modal, index}
                      <td>
                        <div class="graphCardWrap">
                          {#if modal.fix_result.length > 0}
                            {#each modal.fix_result as detail}
                              <div class="iconCard">
                                <article class="graphCard">
                                  <div class="contents2">
                                    <div class="text2">
                                      <ul>
                                        <li>
                                          <span
                                            >조치명 :
                                          </span>{detail.fix_name ||
                                            "Unknown Fix"}
                                        </li>
                                        <li>
                                          <span>조치일시 : </span>{new Date(
                                            detail.fix_date,
                                          ).toLocaleString() || "Unknown Date"}
                                        </li>
                                        <li>
                                          <span
                                            >상세내용 :
                                          </span>{detail.fix_description ||
                                            "No Description"}
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </article>
                              </div>
                            {/each}
                          {:else}
                            <div class="graphCardWrap">
                              <div class="iconCard">데이터 없음</div>
                            </div>
                          {/if}
                        </div>
                      </td>
                    {/each}
                  </tr>
                </table>
              </div>
            </SwiperSlide>
          {/each}
        {:else}
          {#each $comparedVulnsTarget1 as vuln, index}
            <SwiperSlide>
              <p class="header_title">
                [{vuln.ast_uuid__ass_uuid__ast_hostname}] [{vuln.ccr_item_no__ccc_item_no}]
                점검항목 타이틀
              </p>
              <div>
                <table>
                  <colgroup>
                    <col style="width: 120px;" />
                    <col />
                  </colgroup>

                  <!-- 점검플랜 -->
                  <tr>
                    <th
                      class="text-center"
                      style="  border-top-left-radius: 10px;  
                    border-top-right-radius: 10px;  
                  ">점검플랜</th
                    >
                    {#each $ModalData as modal, index}
                      <td>
                        <div class="graphCardWrap">
                          <div class="iconCard">
                            <article class="graphCard">
                              <div class="contents2">
                                <div class="text2">
                                  <ul>
                                    <li>
                                      <span>프로젝트명 : </span>{modal.plan
                                        .ccp_index__ccp_title ||
                                        "Unknown Project"}
                                    </li>
                                    <li>
                                      <span>점검일시 : </span>{modal.plan
                                        .ccp_index__ccp_cdate
                                        ? new Date(
                                            modal.plan.ccp_index__ccp_cdate,
                                          ).toLocaleString()
                                        : "Unknown Date"}
                                    </li>
                                    <li>
                                      <span>관련시스템 : </span>{modal.plan
                                        .system_count || "No Systems"}
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </article>
                          </div>
                        </div>
                      </td>
                    {/each}
                  </tr>

                  <!-- 점검이력 -->
                  <tr>
                    <th class="text-center">점검이력</th>
                    {#each $ModalData as modal, index}
                      <td>
                        <div class="graphCardWrap">
                          {#if modal.result.length > 0}
                            {#each modal.result as res}
                              <div class="iconCard">
                                <article class="graphCard">
                                  <div class="contents2">
                                    <div class="text2">
                                      <ul>
                                        <li>
                                          <span
                                            >프로젝트명 :
                                          </span>{res.ccr_item_result ||
                                            "Unknown Result"}
                                        </li>
                                        <li>
                                          <span>점검일시 : </span>{new Date(
                                            res.ccr_cdate,
                                          ).toLocaleString() || "Unknown Date"}
                                        </li>
                                        <li>
                                          <span
                                            >결과상세 :
                                          </span>{@html res.ccr_item_status.replace(
                                            /\n/g,
                                            "<br/>",
                                          ) || "No Details"}
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </article>
                              </div>
                            {/each}
                          {:else}
                            <div class="graphCardWrap">
                              <div class="iconCard">데이터 없음</div>
                            </div>
                          {/if}
                        </div>
                      </td>
                    {/each}
                  </tr>

                  <!-- 조치이력 -->
                  <tr>
                    <th class="text-center">조치이력</th>
                    {#each $ModalData as modal, index}
                      <td>
                        <div class="graphCardWrap">
                          {#if modal.fix_plan.length > 0}
                            {#each modal.fix_plan as action}
                              <div class="iconCard">
                                <article class="graphCard">
                                  <div class="contents2">
                                    <div class="text2">
                                      <ul>
                                        <li>
                                          <span
                                            >조치명 :
                                          </span>{action.action_name ||
                                            "Unknown Action"}
                                        </li>
                                        <li>
                                          <span>조치일시 : </span>{new Date(
                                            action.action_date,
                                          ).toLocaleString() || "Unknown Date"}
                                        </li>
                                        <li>
                                          <span>결과 : </span>{action.result ||
                                            "No Result"}
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </article>
                              </div>
                            {/each}
                          {:else}
                            <div class="graphCardWrap">
                              <div class="iconCard">데이터 없음</div>
                            </div>
                          {/if}
                        </div>
                      </td>
                    {/each}
                  </tr>
                  <!-- 조치내역 -->
                  <tr>
                    <th
                      class="text-center"
                      style="
                    border-bottom-left-radius: 10px; 
                    border-bottom-right-radius: 10px;">조치내역</th
                    >
                    {#each $ModalData as modal, index}
                      <td>
                        <div class="graphCardWrap">
                          {#if modal.fix_result.length > 0}
                            {#each modal.fix_result as detail}
                              <div class="iconCard">
                                <article class="graphCard">
                                  <div class="contents2">
                                    <div class="text2">
                                      <ul>
                                        <li>
                                          <span
                                            >조치명 :
                                          </span>{detail.fix_name ||
                                            "Unknown Fix"}
                                        </li>
                                        <li>
                                          <span>조치일시 : </span>{new Date(
                                            detail.fix_date,
                                          ).toLocaleString() || "Unknown Date"}
                                        </li>
                                        <li>
                                          <span
                                            >상세내용 :
                                          </span>{detail.fix_description ||
                                            "No Description"}
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </article>
                              </div>
                            {/each}
                          {:else}
                            <div class="graphCardWrap">
                              <div class="iconCard">데이터 없음</div>
                            </div>
                          {/if}
                        </div>
                      </td>
                    {/each}
                  </tr>
                </table>
              </div>
            </SwiperSlide>
          {/each}
        {/if}
      </Swiper>
      {#if secondTable}
        <div
          on:click={handlePrev2}
          class="swiper-button-prev"
          class:disabled={currentModalIndex === 0}
        ></div>
        <div
          on:click={handleNext2}
          class="swiper-button-next"
          class:disabled={currentModalIndex ===
            $comparedVulnsTarget2.length - 1}
        ></div>
      {:else}
        <div
          on:click={handlePrev}
          class="swiper-button-prev"
          class:disabled={currentModalIndex === 0}
        ></div>
        <div
          on:click={handleNext}
          class="swiper-button-next"
          class:disabled={currentModalIndex ===
            $comparedVulnsTarget1.length - 1}
        ></div>
      {/if}
      <div style="display: flex; width:100%; justify-content:center">
        <button
          class="btn modify-btn"
          on:click={() => (showModalProjectComparison = false)}>창닫기</button
        >
      </div>
    </dialog>
  </div>
{/if}

<style>
  .modal-open-wrap table ul {
    width: 250px;
  }
  .modal-open-wrap .iconCard {
    width: 255px;
  }
  .active-row {
    background-color: rgba(242, 242, 242, 1);
  }
  .first_select {
    display: flex;
    flex-direction: row;
    width: 100%;
    gap: 10px;
  }
  .status-container {
    max-height: 120px; /* Set the maximum height for the content */
    overflow-y: auto;
    overflow-x: hidden; /* Allow scrolling only if content exceeds the height */
    padding: 0;
    margin: 0;
  }
  .line-height {
    line-height: 23px;
  }
  .modal-open-wrap th {
    vertical-align: middle;
  }
  .no-assets {
    text-align: center; /* Center the text */
    font-style: italic; /* Italicize the text for emphasis */
    color: #777; /* Light gray color for the message */
    padding: 20px; /* Add some padding around the text */
    background-color: #f9f9f9; /* Light background color for contrast */
    border: 1px solid #ddd; /* Optional: Add a border for definition */
    border-radius: 5px; /* Slightly round the corners */
  }
  .second_column {
    height: 100%;
    overflow-y: auto;
  }
  .second_column a {
    cursor: pointer;
  }
  .second_column a.selected {
    color: #0033ff;
    font-weight: bold; /* Optional: make the selected item bold */
  }
  .second_column a:hover {
    cursor: pointer;
    color: #0033ff;
  }
  /******************MODAL*********************/
  .modify-btn {
    margin-top: 10px;
    background-color: #4caf50; /* Green background for modify button */
    color: white; /* White text */
  }
  .modal-open-wrap {
    display: block;
    z-index: 99;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(167, 167, 167, 0.6);
  }
  dialog {
    position: fixed;
    /* height: 600px; */
    /* overflow-y: auto;
    overflow-x: hidden; */
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 1600px;
    border: none;
    border-radius: 10px;
    background-color: white;

    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    animation: svelte-s7onsa-fadeIn 0.3s ease;
    z-index: 100;
  }

  /* Modal backdrop */
  dialog::backdrop {
    background: rgba(0, 0, 0, 0.5);
    animation: fadeInBackdrop 0.3s ease;
  }
  .contents2 {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .modal-open-wrap table th {
    vertical-align: middle;
  }
  .text2 {
    padding: 0px;
    font-size: 16px;
    color: #555;
    line-height: 1.6;
  }
  dialog .iconCard {
    display: flex;
    align-items: center;
    gap: 0px;
  }
  .header_title {
    font-size: 16px;
    display: block;
    border-bottom: 3px solid transparent;
    color: #626677;
    font-size: 16px;
    font-weight: 500;
    padding: 0 25px 10px;
  }
  /* General Table Settings */
  .modal-open-wrap table {
    width: 98%;
    border-collapse: collapse;
    overflow: hidden;
    margin-left: 26px;
    table-layout: fixed; /* Fix column widths */
  }

  .modal-open-wrap th,
  .modal-open-wrap td {
    padding: 5px;
    text-align: left;
    vertical-align: top;
  }

  .modal-open-wrap th {
    background-color: #007bff;
    color: white;
    font-weight: 600;
    white-space: nowrap; /* Prevent text wrapping for headers */
  }

  .modal-open-wrap td {
    color: #333;
    word-wrap: break-word; /* Ensure long text breaks */
    white-space: normal; /* Allow multiline wrapping */
    overflow: hidden; /* Prevent content overflow */
    text-overflow: ellipsis; /* Display ellipsis for truncated text */
  }

  /* Cards with Scrollable Content */
  .modal-open-wrap .graphCardWrap {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
    min-height: 150px; /* Minimum card height */
    max-height: 200px; /* Maximum card height to contain text */
  }

  .modal-open-wrap .iconCard {
    position: relative;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background-color: white;

    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    max-height: 200px; /* Limit height */
    overflow: hidden;
  }

  .modal-open-wrap .iconCard .contents2 {
    flex-grow: 1;
    overflow-y: auto; /* Allow scrolling for overflowing content */
    word-wrap: break-word; /* Break long words */
    white-space: normal; /* Allow multiline text */
  }

  /* Text Wrapping and Scrolling for Lists */
  .modal-open-wrap .text2 ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
    max-height: 120px; /* Limit list height */
    overflow-y: auto; /* Add scroll for long lists */
  }

  .modal-open-wrap .text2 li {
    margin-bottom: 8px;
    font-size: 16px; /* Adjust font size for better fit */
    line-height: 1.4; /* Adjust line height for readability */
    word-wrap: break-word; /* Break long words */
  }

  .modal-open-wrap .text2 span {
    font-weight: 600;
    color: #333;
  }

  /* Arrow Icon */
  .modal-open-wrap .arrowIcon {
    position: absolute;
    right: -10px;
    top: 50%;
    transform: translateY(-50%);
    width: 18px;
    height: 18px;
    z-index: 9999;
  }

  .modal-open-wrap .iconCard:hover .arrowIcon {
    opacity: 1;
  }

  /* For Tables: Scroll for Overflowing Content */
  .modal-open-wrap td div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-height: 200px; /* Restrict height for better layout */
  }

  /* Responsiveness */
  @media (max-width: 768px) {
    .modal-open-wrap table {
      width: 100%;
      margin: 0;
    }

    .modal-open-wrap .graphCardWrap {
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 15px;
    }

    .modal-open-wrap th,
    .modal-open-wrap td {
      padding: 10px;
      font-size: 14px;
    }
  }

  @media (max-width: 480px) {
    .modal-open-wrap .graphCardWrap {
      grid-template-columns: 1fr;
    }

    .modal-open-wrap th,
    .modal-open-wrap td {
      padding: 8px;
      font-size: 12px;
    }
  }
  .header_title2 {
    font-size: 16px;
    display: block;
    border-bottom: 3px solid transparent;
    color: #626677;
    font-size: 16px;
    font-weight: 500;
    padding: 0 0px 10px;
  }
  /*****************************************/
  .clickLine:hover {
    background-color: rgba(242, 242, 242, 1);
    cursor: pointer;
  }
  .right_diag {
    width: 290px;
    height: 280px;
    justify-content: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #fff;
    height: 100%;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
  .right_diag p {
    text-align: center;
    margin-top: 10px;
    font-size: 16px;
    display: block;

    color: #626677;
    font-weight: 500;
  }
  .diagram_container {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    height: 280px;
  }
  section {
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
  }
  .table_section {
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
  }
  .firstContainer {
    display: flex;
    flex-direction: column;

    width: 47%;
    /* background: rgba(242, 242, 242, 1); */
  }

  /* Card and Hover Styles */
  .hoverCard {
    display: flex;
    flex-direction: column;
    /* background: linear-gradient(145deg, #ffffff, #f1f3f4); */

    /* box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); */
    overflow: hidden;
    transition:
      transform 0.2s ease,
      box-shadow 0.3s ease;
    width: 320px;
  }
  .graphCard {
    display: flex;
    flex-flow: column;
    gap: 12px;
    background-color: #fff;
    border-radius: 10px;
    justify-content: center;
    width: 100%;
    height: 100%;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
  .modal-open-wrap .graphCard {
    display: flex;
    flex-flow: column;
    gap: 12px;
    background-color: #fff;
    border-radius: 10px;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
  .contents {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  /* Text and Title Styles */
  .text {
    font-size: 16px;
    color: #555;
    line-height: 1.6;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .text ul {
    height: 250px;
    width: 50%;
  }

  /* Icon Styles */
  .iconCard {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    height: 90%;
    padding: 0px;
  }
  .select_input {
    margin-bottom: 10px;
  }
  /******************************************TABLE*/
  .table2 {
    width: 47%;
    font-size: 16px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .tableListWrap .tableList {
    width: 100%;
    table-layout: fixed;
    max-height: 980px;
    overflow-y: auto;
  }
  th,
  td {
    font-size: 16px;
  }

  thead {
    position: sticky; /* Make the header sticky */
    top: 0; /* Stick the header to the top */
    z-index: 10; /* Ensure the header is above the scrolling content */
    box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.4); /* Shadow effect for separation */
  }
  .swiper-button-next,
  .swiper-button-prev {
    position: absolute;
    top: 50%;
    z-index: 10;
    width: 30px;
    height: 30px;
    color: #0033ff;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transform: translateY(-50%);
  }

  .swiper-button-prev {
    left: 10px;
  }

  .swiper-button-next {
    right: 10px;
  }
</style>
