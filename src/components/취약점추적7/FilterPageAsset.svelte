<script>
  import {
    allTraceByAsset,
    filterDataAsset,
    filteredTableDataForAsset,
    ModalData,
  } from "../../services/page7/trace.store";
  import { Swiper, SwiperSlide } from "swiper/svelte";
  import SwiperCore, { Navigation, Pagination } from "swiper";
  import "swiper/swiper-bundle.css";
  import { selectedPlan } from "../../services/page7/trace.store";
  import { selectedAssetTableData } from "../../services/page7/trace.store";

  let showModalProject = false;
  let selectedData = [];
  let asset_name = "";
  let chklist = "";
  let target = "";
  let currentModalIndex = 0;

  function handleTableClick(index, data) {
    currentModalIndex = index;
    const {
      ast_uuid__ass_uuid__ast_hostname: asset_name,
      ccr_item_no__ccc_item_no: chklist,
      cct_index__cct_target: target,
    } = data;
    console.log("modal<", asset_name, chklist, target);
    showModalProject = true;
    modalDataFunction(asset_name, chklist, target);
  }

  function handleNext() {
    if (currentModalIndex < $filteredTableDataForAsset.length - 1) {
      currentModalIndex++;
      const {
        ast_uuid__ass_uuid__ast_hostname: asset_name,
        ccr_item_no__ccc_item_no: chklist,
        cct_index__cct_target: target,
      } = $filteredTableDataForAsset[currentModalIndex];
      modalDataFunction(asset_name, chklist, target);
    } else {
      console.log("Reached the last item.");
    }
  }

  function handlePrev() {
    if (currentModalIndex > 0) {
      currentModalIndex--;
      const {
        ast_uuid__ass_uuid__ast_hostname: asset_name,
        ccr_item_no__ccc_item_no: chklist,
        cct_index__cct_target: target,
      } = $filteredTableDataForAsset[currentModalIndex];
      modalDataFunction(asset_name, chklist, target);
    } else {
      console.log("Reached the first item.");
    }
  }
  /********************************************************************/
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
  let test = {
    0: "조치전",
    1: "조치예정",
    2: "조치계획등록",
    3: "조치계획승인",
    4: "조치계획반려",
    5: "조치결과등록",
    6: "조치결과승은",
    7: "조치결과반려",
  };

  SwiperCore.use([Navigation, Pagination]);
  let swiperData = [];
  for (let i = 0; i < 20; i++) {
    swiperData.push({
      number: (i + 1).toString(),
      planName: "plan",
      version: "1.0.0",
    });
  }
  function getStrokeColor(score) {
    if (score > 60)
      return "#ff0000"; // Blue
    else if (score > 30)
      return "#00ff00"; // Green
    else return "#0067ff"; // Red
  }
  function handleKeyDown(event) {
    if (event.key === "Escape") {
      showModalProject = false;
    }
  }

  import { onMount } from "svelte";
  import { modalDataService } from "../../services/page7/service";

  onMount(() => {
    // Listen for keydown event when the modal is open
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      // Remove the event listener when the component is destroyed
      window.removeEventListener("keydown", handleKeyDown);
    };
  });
</script>

<div>
  <p class="header_title">자산 : 자산3와 관련된 취약점 추적</p>
  <div class="graphCardWrap col3" style="width:100%;">
    {#if $filterDataAsset[0].plans && $filterDataAsset[0].plans.length > 0}
      {#each $filterDataAsset[0].plans as plan, index}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="iconCard">
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <article class="graphCard hoverCard" style="min-height: 288px;">
            <div class="contents">
              <div class="graph">
                <div>
                  <div
                    class="circle"
                    data-percent={plan.vuln_count || 0}
                    data-offset="440"
                  >
                    <svg viewBox="0 0 150 150">
                      <circle
                        cx="75"
                        cy="75"
                        r="70"
                        stroke="#fff"
                        stroke-width="10"
                        fill="none"
                      />
                      <circle
                        class="progress"
                        cx="75"
                        cy="75"
                        r="70"
                        stroke={getStrokeColor(plan.vuln_count || 0)}
                        stroke-width="10"
                        fill="none"
                        stroke-dasharray="440"
                        stroke-dashoffset={440 -
                          (440 * (plan.vuln_count || 0)) / 100}
                        stroke-linecap="round"
                        transform="rotate(-90 75 75)"
                      />
                    </svg>
                    <div class="percent">
                      <span
                        class="number"
                        style="font-size:32px; color: {getStrokeColor(
                          plan.vuln_count || 0,
                        )};"
                      >
                        {plan.vuln_count > 0 ? plan.vuln_count : 0}건
                      </span>
                    </div>
                  </div>
                  <h4 class="name">
                    <div class="title1">취약</div>
                  </h4>
                </div>
              </div>
              <div class="text flex col justify-between">
                <ul>
                  <li>
                    <span>프로젝트명 : </span>{plan.ccp_title || "데이터 없음"}
                  </li>
                  <li>
                    <span>점검일시 : </span>
                    {plan.ccp_cdate
                      ? new Date(plan.ccp_cdate).toLocaleString("ko-KR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "데이터 없음"}
                  </li>
                  <li>
                    <span>관련시스템 : </span>{plan.system_count ||
                      "데이터 없음"}대
                  </li>
                </ul>
              </div>
            </div>
          </article>

          <!-- Only show the icon if index is less than 5 -->
          {#if index < 4}
            <!-- svelte-ignore a11y-missing-attribute -->
            <img src="images/icons/arrowhead.png" class="icon" />
          {/if}
        </div>
      {/each}
    {/if}
  </div>

  <div
    class="tableListWrap table2"
    style="margin-bottom: 20px; padding-bottom:10px; margin-top:20px; height:43vh; overflow-y:auto;"
  >
    {#if $filteredTableDataForAsset && $filteredTableDataForAsset.length > 0}
      <table class="tableList hdBorder font-size: 16px;">
        <colgroup>
          <col style="width:60px;" />
          <col style="width: 150px;" />
          <col style="width: 130px;" />
          <col style="width: 90px;" />
          <col style="width: 20%;" />
          <col style="width: 95px;" />
          <col style="width: 30%;" />
          <col style="width: 120px;" />
          <col style="width: 120px;" />
          <col style="width: 120px;" />
        </colgroup>

        <thead>
          <tr>
            <th class="text-center">순번</th>
            <th class="text-center">자산명</th>
            <th class="text-center">점검대상</th>
            <th class="text-center">대분류</th>
            <th class="text-center">취약점명</th>
            <th class="text-center">위험도</th>
            <th class="text-center">조치현황</th>
            <th class="text-center">조치분류상태 </th>
            <th class="text-center">운영담당자</th>
            <th class="text-center">담당자연락처 </th>
          </tr>
        </thead>

        {#each $filteredTableDataForAsset as vuln, index}
          <tbody>
            <tr
              on:click={() => {
                handleTableClick(index, vuln);
              }}
              class="clickLine"
              class:active-row={index === currentModalIndex}
            >
              <td class="text-center">{index + 1}</td>
              <td class="text-center line-height"
                >{vuln.ast_uuid__ass_uuid__ast_hostname}</td
              >
              <td class="text-center line-height"
                >{vuln.cct_index__cct_target}</td
              >
              <td class="text-center line-height"
                >{vuln.ccr_item_no__ccc_item_group}</td
              >
              <td class="text-center line-height"
                >{vuln.ccr_item_no__ccc_item_title}</td
              >
              <td class="text-center line-height"
                >{vuln.ccr_item_no__ccc_item_level}</td
              >
              <td class="text-center line-height">
                <div class="status-container line-height">
                  {test[vuln?.cfi_fix_status__cvs_index] ?? "조치전"}
                </div>
              </td>
              <td class="text-center line-height"
                >{vuln[vuln?.cfr_fix_status__cvs_index] ?? "조치전"}</td
              >
              <td class="text-center line-height"
                >{vuln.ast_uuid__ass_uuid__ast_operator_person}</td
              >
              <td class="text-center line-height"
                >{vuln.ast_uuid__ass_uuid__ast_operator_phone}</td
              >
            </tr>
          </tbody>
        {/each}
      </table>
    {:else}
      <div class="no-data-message">
        <p>사용 가능한 데이터가 없습니다</p>
      </div>
    {/if}
  </div>

  {#if showModalProject}
    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    <div
      class="modal-open-wrap"
      on:click={() => (showModalProject = false)}
      on:keydown={handleKeyDown}
      tabindex="0"
    >
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <dialog
        open
        on:close={() => (showModalProject = false)}
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
          {#each $filteredTableDataForAsset as vuln, index}
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
        </Swiper>
        <div
          on:click={handlePrev}
          class="swiper-button-prev"
          class:disabled={currentModalIndex === 0}
        ></div>
        <div
          on:click={handleNext}
          class="swiper-button-next"
          class:disabled={currentModalIndex ===
            $filteredTableDataForAsset.length - 1}
        ></div>

        <div style="display: flex; width:100%; justify-content:center">
          <button
            class="btn modify-btn"
            on:click={() => (showModalProject = false)}>창닫기</button
          >
        </div>
      </dialog>
    </div>
  {/if}
</div>

<style>
  .active-row {
    background-color: rgba(242, 242, 242, 1);
  }
  .modal-open-wrap table th {
    vertical-align: middle;
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
  /* General Layout Styles */
  .graphCardWrap.col3 {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));

    padding: 20px;
    height: 100%;
    align-items: center;
  }

  /* Card and Hover Styles */
  .hoverCard {
    display: flex;
    flex-direction: column;
    background: linear-gradient(145deg, #ffffff, #f1f3f4);
    border-radius: 15px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition:
      transform 0.2s ease,
      box-shadow 0.3s ease;
    width: 320px;
  }
  .hoverCard:hover {
    cursor: pointer;
    transform: scale(1.02);
    box-shadow: 0 8px 20px rgba(0, 123, 255, 0.2);
  }
  .clickLine:hover {
    background-color: rgba(242, 242, 242, 1);
    cursor: pointer;
  }
  .contents {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .contents2 {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  /* Text and Title Styles */
  .text {
    padding: 20px;
    font-size: 16px;
    color: #555;
    line-height: 1.6;
  }
  .text2 {
    padding: 0px;
    font-size: 16px;
    color: #555;
    line-height: 1.6;
  }
  .name {
    text-align: center;
    margin-top: 10px;
  }
  .title1 {
    font-size: 16px;
    font-weight: 700;
    color: #333;
    margin-bottom: 5px;
  }

  /* Icon Styles */
  .iconCard {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  dialog .iconCard {
    display: flex;
    align-items: center;
    gap: 0px;
  }
  .icon {
    width: 45px;
    height: 45px;
    opacity: 0.7;
    transition: opacity 0.2s;
  }
  .iconCard:hover .icon {
    opacity: 1;
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
  /* Responsive Styles */
  @media (max-width: 1200px) {
    .graphCardWrap.col3 {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  @media (max-width: 992px) {
    .graphCardWrap.col3 {
      grid-template-columns: repeat(2, 1fr);
    }
    .text {
      font-size: 15px;
    }
    .icon {
      width: 40px;
      height: 40px;
    }
  }

  @media (max-width: 768px) {
    .graphCardWrap.col3 {
      grid-template-columns: 1fr;
    }
    .hoverCard {
      max-width: 100%;
    }
    .text {
      font-size: 14px;
      padding: 15px;
    }
    .icon {
      width: 35px;
      height: 35px;
    }
  }

  @media (max-width: 576px) {
    .text {
      font-size: 13px;
      padding: 10px;
    }
    .hoverCard {
      width: 100%;
    }
    .icon {
      width: 30px;
      height: 30px;
    }
  }

  .table2 {
    width: 100%;
    font-size: 16px;
    overflow-y: auto;
    overflow-x: hidden;
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
  /**************************************************************/
  /* Apply styles to table inside the modal */
  .modal-open-wrap table {
    width: 98%;
    border-collapse: collapse;
    overflow: hidden;
    margin-left: 26px;
    table-layout: fixed; /* Fix column widths */
  }
  .modal-open-wrap table ul {
    width: 250px;
  }
  .modal-open-wrap .iconCard {
    width: 255px;
  }
  .modal-open-wrap th,
  .modal-open-wrap td {
    padding: 5px;
    text-align: left;
    vertical-align: top;
  }
  .modal-open-wrap .graphCard {
    padding: 0px;
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
    overflow-y: auto; /* Enable vertical scrolling */
  }

  .modal-open-wrap .iconCard {
    position: relative;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background-color: white;
    padding: 10px;
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
    overflow-y: auto; /* Allow scrolling for long text */
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
