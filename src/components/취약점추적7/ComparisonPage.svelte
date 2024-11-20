<script>
  import { Swiper, SwiperSlide } from "swiper/svelte";
  import SwiperCore, { Navigation, Pagination } from "swiper";
  import "swiper/swiper-bundle.css";
  import {
    allTraceByPlan,
    comparisonPlan,
    leftTrackData,
    ModalData,
  } from "../../services/page7/trace.store";
  let currentModalIndex = 0;
  let firstProjectId = "";
  let secondProjectId = "";
  let showModalProjectComparison = false;
  let secondTable = false;
  async function comparePlan() {
    try {
      const response = await compareByPlan(firstProjectId, secondProjectId);

      if (response) {
        comparisonPlan.set(response.CODE);
      } else {
      }
      console.log("data clicked", $comparisonPlan.first_plan);
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
  function handleTableClick(index, data) {
    currentModalIndex = index;
    const {
      ast_uuid__ass_uuid__ast_hostname: asset_name,
      ccr_item_no__ccc_item_no: chklist,
      cct_index__cct_target: target,
    } = data;
    console.log("modal<", asset_name, chklist, target);
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
    console.log("modal<", asset_name, chklist, target);
    showModalProjectComparison = true;
    modalDataFunction(asset_name, chklist, target);
  }
  /******************************************************************/
  function handleNext() {
    if (currentModalIndex < $comparisonPlan.first_plan.vulns.length - 1) {
      currentModalIndex++;
      const {
        ast_uuid__ass_uuid__ast_hostname: asset_name,
        ccr_item_no__ccc_item_no: chklist,
        cct_index__cct_target: target,
      } = $comparisonPlan.first_plan.vulns[currentModalIndex];
      modalDataFunction(asset_name, chklist, target);
    } else {
      console.log("Reached the last item.");
    }
  }

  function handleNext2() {
    if (currentModalIndex < $comparisonPlan.second_plan.vulns.length - 1) {
      currentModalIndex++;
      const {
        ast_uuid__ass_uuid__ast_hostname: asset_name,
        ccr_item_no__ccc_item_no: chklist,
        cct_index__cct_target: target,
      } = $comparisonPlan.second_plan.vulns[currentModalIndex];
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
      } = $comparisonPlan.first_plan.vulns[currentModalIndex];
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
      } = $comparisonPlan.second_plan.vulns[currentModalIndex];
      modalDataFunction(asset_name, chklist, target);
    } else {
      console.log("Reached the first item.");
    }
  }
  /****************************************************************/

  function handleKeyDown(event) {
    if (event.key === "Escape") {
      showModalProjectComparison = false;
    }
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
  function getStrokeColor(score) {
    if (score > 60)
      return "#0067ff"; // Blue
    else if (score > 30)
      return "#00ff00"; // Green
    else return "#ff0000"; // Red
  }

  import { onMount } from "svelte";
  import {
    compareByPlan,
    modalDataService,
  } from "../../services/page7/service";
  import { P } from "flowbite-svelte";

  onMount(() => {
    // Listen for keydown event when the modal is open
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      // Remove the event listener when the component is destroyed
      window.removeEventListener("keydown", handleKeyDown);
    };
  });
</script>

<p class="header_title2">점검플랜별 취약점 결과</p>
<section>
  <div class="firstContainer">
    <select
      bind:value={firstProjectId}
      name="operating_system"
      id="operating_system"
      class="select_input"
    >
      <option value="" selected>플랜명</option>
      {#each $leftTrackData[0] as plan}
        <option value={plan.ccp_index}>{plan.ccp_title}</option>
      {/each}
    </select>
    {#if $comparisonPlan.first_plan}
      <div class="diagram_container">
        <div class="right_diag">
          <div
            class="circle"
            style="width: 150px;"
            data-percent={$comparisonPlan.first_plan.ccp_security_point || 0}
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
                  $comparisonPlan.first_plan.ccp_security_point || 0,
                )}
                stroke-width="10"
                fill="none"
                stroke-dasharray="440"
                stroke-dashoffset={440 -
                  (440 * ($comparisonPlan.first_plan.ccp_security_point || 0)) /
                    100}
                stroke-linecap="round"
                transform="rotate(-90 75 75)"
              />
            </svg>
            <!-- Percentage Label -->
            <div class="percent">
              <span
                class="number"
                style="font-size: 32px; color: {getStrokeColor(
                  $comparisonPlan.first_plan.ccp_security_point || 0,
                )};"
              >
                {$comparisonPlan.first_plan.ccp_security_point > 0
                  ? $comparisonPlan.first_plan.ccp_security_point
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
                    <span>취약 : </span>{$comparisonPlan.first_plan
                      .vulnerability_summary.vulnerability_count ||
                      "Unknown OS"}건
                  </li>
                  <li>
                    <span>프로젝트명 : </span>{$comparisonPlan.first_plan
                      .ccp_title || "Unknown OS"}
                  </li>
                  <li>
                    <span>점검일시 : </span>
                    {$comparisonPlan.first_plan.ccp_cdate
                      ? new Date(
                          $comparisonPlan.first_plan.ccp_cdate,
                        ).toLocaleString("ko-KR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Unknown"}
                  </li>
                  <li>
                    <span>관련시스템 : </span>{$comparisonPlan.first_plan
                      .system_count || "Unknown IP"}대
                  </li>
                  <li style="margin-top: 15px;">
                    <span>[취약점 요약]</span>
                  </li>
                  <li>
                    <span>최다자산 : </span>{$comparisonPlan.first_plan
                      .vulnerability_summary.most_vulnerable_asset ||
                      "No Target"}
                  </li>
                  {#if $comparisonPlan.first_plan.vulnerability_summary.most_common_item !== null}
                    <li>
                      <span>최다항목 : </span>{$comparisonPlan.first_plan
                        .vulnerability_summary.most_common_item
                        .item_code}({$comparisonPlan.first_plan
                        .vulnerability_summary.most_common_item.target_type})
                    </li>
                  {:else}
                    <li>
                      <span>최다항목 : </span>
                      데이터 없음
                    </li>
                  {/if}
                  <li>
                    <span>취약점수 : </span>{$comparisonPlan.first_plan
                      .vulnerability_summary.vulnerability_count ||
                      "Unknown Hostname"}
                  </li>
                  <li>
                    <span>조치개수 : </span>{$comparisonPlan.second_plan
                      .vulnerability_summary.fixed_count || "Unknown IP"}
                  </li>
                </ul>
                <ul>
                  <li>
                    <span>[그외 출력가능 정보]</span>
                  </li>
                </ul>
              </div>
            </div>
          </article>
        </div>
      </div>
    {:else}
      <div class="no-data-message">
        <p>비교할 첫 번째 프로젝트를 선택하세요</p>
      </div>
    {/if}
  </div>
  <div class="firstContainer">
    <select
      bind:value={secondProjectId}
      name="operating_system"
      id="operating_system"
      class="select_input"
    >
      <option value="" selected>플랜명</option>
      {#each $leftTrackData[0] as plan}
        <option value={plan.ccp_index}>{plan.ccp_title}</option>
      {/each}
    </select>
    {#if $comparisonPlan.second_plan}
      <div class="diagram_container">
        <div class="right_diag">
          <div
            class="circle"
            style="width: 150px;"
            data-percent={$comparisonPlan.second_plan.ccp_security_point || 0}
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
                  $comparisonPlan.second_plan.ccp_security_point || 0,
                )}
                stroke-width="10"
                fill="none"
                stroke-dasharray="440"
                stroke-dashoffset={440 -
                  (440 *
                    ($comparisonPlan.second_plan.ccp_security_point || 0)) /
                    100}
                stroke-linecap="round"
                transform="rotate(-90 75 75)"
              />
            </svg>
            <!-- Percentage Label -->
            <div class="percent">
              <span
                class="number"
                style="font-size: 32px; color: {getStrokeColor(
                  $comparisonPlan.second_plan.ccp_security_point || 0,
                )};"
              >
                {$comparisonPlan.second_plan.ccp_security_point > 0
                  ? $comparisonPlan.second_plan.ccp_security_point
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
                    <span>취약 : </span>{$comparisonPlan.second_plan
                      .vulnerability_summary.vulnerability_count ||
                      "Unknown OS"}건
                  </li>
                  <li>
                    <span>프로젝트명 : </span>{$comparisonPlan.second_plan
                      .ccp_title || "Unknown OS"}
                  </li>
                  <li>
                    <span>점검일시 : </span>
                    {$comparisonPlan.second_plan.ccp_cdate
                      ? new Date(
                          $comparisonPlan.second_plan.ccp_cdate,
                        ).toLocaleString("ko-KR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Unknown"}
                  </li>
                  <li>
                    <span>관련시스템 : </span>{$comparisonPlan.second_plan
                      .system_count || "Unknown IP"}건
                  </li>
                  <li style="margin-top: 15px;">
                    <span>[취약점 요약]</span>
                  </li>
                  <li>
                    <span>최다자산 : </span>{$comparisonPlan.second_plan
                      .vulnerability_summary.most_vulnerable_asset ||
                      "No Target"}
                  </li>
                  {#if $comparisonPlan.first_plan.vulnerability_summary.most_common_item !== null}
                    <li>
                      <span>최다항목 : </span>{$comparisonPlan.first_plan
                        .vulnerability_summary.most_common_item
                        .item_code}({$comparisonPlan.first_plan
                        .vulnerability_summary.most_common_item.target_type})
                    </li>
                  {:else}
                    <li>
                      <span>최다항목 : </span>
                      데이터 없음
                    </li>
                  {/if}
                  <li>
                    <span>취약점수 : </span>{$comparisonPlan.second_plan
                      .vulnerability_summary.vulnerability_count ||
                      "Unknown Hostname"}
                  </li>
                  <li>
                    <span>조치개수 : </span>{$comparisonPlan.second_plan
                      .vulnerability_summary.fixed_count || "Unknown IP"}
                  </li>
                </ul>
                <ul>
                  <li>
                    <span>[그외 출력가능 정보]</span>
                  </li>
                </ul>
              </div>
            </div>
          </article>
        </div>
      </div>
    {:else}
      <div class="no-data-message">
        <p>비교할 두 번째 프로젝트를 선택하세요</p>
      </div>
    {/if}
  </div>
</section>

<button class="btn modify-btn" on:click={comparePlan}>비교</button>

<section class="table_section">
  <div
    class="tableListWrap table2"
    style="margin-bottom: 20px; margin-top:20px; margin; height:45vh; overflow-y:auto;"
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

      {#if $comparisonPlan.first_plan}
        {#each $comparisonPlan.first_plan.vulns as vuln, index}
          <tbody>
            <tr
              on:click={() => {
                handleTableClick(index, vuln);
              }}
              class="clickLine"
              class:active-row={index === currentModalIndex}
            >
              <td class="text-center line-height">{index + 1}</td>
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
                </div></td
              >
            </tr>
          </tbody>
        {/each}
      {/if}
    </table>
  </div>
  <div
    class="tableListWrap table2"
    style="margin-bottom: 20px; margin-top:20px; margin; height:43vh; overflow-y:auto;"
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

      {#if $comparisonPlan.second_plan}
        {#each $comparisonPlan.second_plan.vulns as vuln, index}
          <tbody>
            <tr
              on:click={() => {
                handleTableClick2(index, vuln);
              }}
              class="clickLine"
              class:active-row={index === currentModalIndex}
            >
              <td class="text-center line-height">{index + 1}</td>
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
          {#each $comparisonPlan.second_plan.vulns as vuln, index}
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
                      style="
                    border-bottom-left-radius: 10px; 
                    border-bottom-right-radius: 10px;">점검플랜</th
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
                      style="  border-top-left-radius: 10px;  
                      border-top-right-radius: 10px;  
                    ">조치내역</th
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
          {#each $comparisonPlan.first_plan.vulns as vuln, index}
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
            $comparisonPlan.second_plan.vulns.length - 1}
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
            $comparisonPlan.first_plan.vulns.length - 1}
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
    width: 270px;
  }
  .modal-open-wrap table th {
    vertical-align: middle;
  }
  .modal-open-wrap .iconCard {
    width: 255px;
  }
  .active-row {
    background-color: rgba(242, 242, 242, 1);
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
  .max-height {
    max-height: 70px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .modify-btn {
    margin-top: 10px;
    background-color: #4caf50; /* Green background for modify button */
    color: white; /* White text */
  }

  .modify-btn:hover {
    background-color: #45a049; /* Darker green on hover */
    transform: translateY(-2px); /* Lift effect on hover */
  }
  .no-data-message {
    text-align: center; /* Center the text */
    font-style: italic; /* Italicize the text for emphasis */
    color: #777; /* Light gray color for the message */
    padding: 20px; /* Add some padding around the text */
    background-color: #f9f9f9; /* Light background color for contrast */
    border: 1px solid #ddd; /* Optional: Add a border for definition */
    border-radius: 5px; /* Slightly round the corners */
  }
  /******************MODAL*********************/
  .modify-btn {
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
  .header_title2 {
    font-size: 16px;
    display: block;
    border-bottom: 3px solid transparent;
    color: #626677;
    font-size: 16px;
    font-weight: 500;
    padding: 0 0px 10px;
  }
  /**************************************************************/
  /* Apply styles to table inside the modal */
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
  /*****************************************/
  .clickLine:hover {
    background-color: rgba(242, 242, 242, 1);
    cursor: pointer;
  }
  .right_diag {
    width: 290px;
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

    width: 49%;
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
  .diagram_container .graphCard {
    display: flex;
    flex-flow: column;
    gap: 12px;
    background-color: #fff;
    justify-content: center;
    border-radius: 10px;
    width: 100%;
    height: 100%;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
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
  .table_section .text ul {
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
  .table_section .table2 {
    width: 49%;
    font-size: 16px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .table_section .tableListWrap .tableList {
    width: 100%;
    table-layout: fixed;
    max-height: 980px;
    overflow-y: auto;
  }
  .table_section th,
  .table_section td {
    font-size: 16px;
  }

  .table_section thead {
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
