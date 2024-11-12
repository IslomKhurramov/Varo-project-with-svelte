<script>
  import { allTraceByAsset } from "../../services/page7/trace.store";
  import { Swiper, SwiperSlide } from "swiper/svelte";
  import SwiperCore, { Navigation, Pagination } from "swiper";
  import "swiper/swiper-bundle.css";
  import { selectedPlan } from "../../services/page7/trace.store";
  import { selectedAssetTableData } from "../../services/page7/trace.store";

  $: console.log("Vulns data:", $selectedAssetTableData[0]?.vulns);
  let showModalProject = false;
  let selectedData = [];

  function modalData(data) {
    showModalProject = true;
    selectedData = data;
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
  function getStrokeColor(score) {
    if (score > 60)
      return "#0067ff"; // Blue
    else if (score > 30)
      return "#00ff00"; // Green
    else return "#ff0000"; // Red
  }
  function handleKeyDown(event) {
    if (event.key === "Escape") {
      showModalProject = false;
    }
  }
  let filteredAssets = [
    {
      ast_security_point: 85,
      ast_uuid__ast_target__cct_target: "Web Server",
      asg_index__asg_title: "Finance Servers",
      ast_os: "Windows Server 2019",
      ast_hostname: "2024.04.04",
      ast_ipaddr: "2000대",
      ast_agent_installed: true,
      ccc_item_group: "Security Checks",
      ccc_item_no: "Vuln-001",
      ccc_item_title: "SQL Injection",
      ccc_item_level: "High",
      ccc_item_result: "Passed",
      ccc_item_action: "N/A",
      ccc_item_status: "Resolved",
      ccc_item_department: "IT",
      ccc_item_owner: "John Doe",
    },
    {
      ast_security_point: 12,
      ast_uuid__ast_target__cct_target: "Web Server",
      asg_index__asg_title: "Finance Servers",
      ast_os: "Windows Server 2019",
      ast_hostname: "2024.04.04",
      ast_ipaddr: "2000대",
      ast_agent_installed: true,
      ccc_item_group: "Security Checks",
      ccc_item_no: "Vuln-002",
      ccc_item_title: "Cross-Site Scripting (XSS)",
      ccc_item_level: "Critical",
      ccc_item_result: "Failed",
      ccc_item_action: "Fix ASAP",
      ccc_item_status: "Pending",
      ccc_item_department: "Security",
      ccc_item_owner: "Jane Smith",
    },
    {
      ast_security_point: 85,
      ast_uuid__ast_target__cct_target: "Web Server",
      asg_index__asg_title: "Finance Servers",
      ast_os: "Windows Server 2019",
      ast_hostname: "2024.04.04",
      ast_ipaddr: "2000대",
      ast_agent_installed: true,
      ccc_item_group: "Security Checks",
      ccc_item_no: "Vuln-001",
      ccc_item_title: "SQL Injection",
      ccc_item_level: "High",
      ccc_item_result: "Passed",
      ccc_item_action: "N/A",
      ccc_item_status: "Resolved",
      ccc_item_department: "IT",
      ccc_item_owner: "John Doe",
    },
    {
      ast_security_point: 12,
      ast_uuid__ast_target__cct_target: "Web Server",
      asg_index__asg_title: "Finance Servers",
      ast_os: "Windows Server 2019",
      ast_hostname: "2024.04.04",
      ast_ipaddr: "2000대",
      ast_agent_installed: true,
      ccc_item_group: "Security Checks",
      ccc_item_no: "Vuln-002",
      ccc_item_title: "Cross-Site Scripting (XSS)",
      ccc_item_level: "Critical",
      ccc_item_result: "Failed",
      ccc_item_action: "Fix ASAP",
      ccc_item_status: "Pending",
      ccc_item_department: "Security",
      ccc_item_owner: "Jane Smith",
    },
    {
      ast_security_point: 85,
      ast_uuid__ast_target__cct_target: "Web Server",
      asg_index__asg_title: "Finance Servers",
      ast_os: "Windows Server 2019",
      ast_hostname: "2024.04.04",
      ast_ipaddr: "2000대",
      ast_agent_installed: true,
      ccc_item_group: "Security Checks",
      ccc_item_no: "Vuln-001",
      ccc_item_title: "SQL Injection",
      ccc_item_level: "High",
      ccc_item_result: "Passed",
      ccc_item_action: "N/A",
      ccc_item_status: "Resolved",
      ccc_item_department: "IT",
      ccc_item_owner: "John Doe",
    },
  ];
  $: recentAssets = filteredAssets.slice(-5);

  // Function to handle clicking on a card
  function selectCard(asset) {
    selectedAsset = asset;
  }

  import { onMount } from "svelte";

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
    {#if $selectedPlan.length > 0}
      {#each $selectedPlan as plan, index}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="iconCard" on:click={() => selectCard(plan)}>
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <article class="graphCard hoverCard" style="min-height: 338px;">
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
                    <span>프로젝트명 : </span>{plan.ccp_title || "Unknown OS"}
                  </li>
                  <li>
                    <span>점검일시 : </span>{plan.ccp_cdate ||
                      "Unknown Hostname"}
                  </li>
                  <li>
                    <span>관련시스템 : </span>{plan.most_common_item
                      ?.cct_index__cct_target || "Unknown IP"}
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
    {#if $selectedAssetTableData[0]?.vulns.length > 0}
      <table class="tableList hdBorder font-size: 16px;">
        <colgroup>
          <col style="width:60px;" />
          <col style="width: 150px;" />
          <col style="width: 180px;" />
          <col style="width: 20%;" />
          <col style="width: 90px;" />
          <col style="width: 145px;" />
          <col style="width: 30%;" />
          <col />
          <col />
          <col />
        </colgroup>

        <thead>
          <tr>
            <th class="text-center">순번</th>
            <th class="text-center">자산명</th>
            <th class="text-center">점검항목</th>
            <th class="text-center">취약점명</th>
            <th class="text-center">위험도</th>
            <th class="text-center">점검결과</th>
            <th class="text-center">조치현황</th>
            <th class="text-center">조치분류상태 </th>
            <th class="text-center">운영부서 </th>
            <th class="text-center">운영담당자</th>
          </tr>
        </thead>

        {#each $selectedAssetTableData[0]?.vulns as vuln, index}
          <tbody>
            <tr class="clickLine">
              <td class="text-center">{index + 1}</td>
              <td class="text-center line-height"
                >{vuln.ast_uuid__ass_uuid__ast_hostname}</td
              >
              <td class="text-center line-height"
                >{vuln.ccr_item_no__ccc_item_title}</td
              >
              <td class="text-center line-height"
                >{@html vuln.ccr_item_no__ccc_check_content.replace(
                  /\n/g,
                  "<br/>",
                )}</td
              >
              <td class="text-center line-height"
                >{vuln.ccr_item_no__ccc_item_level}</td
              >
              <td class="text-center line-height">{vuln.ccr_item_result}</td>
              <td class="text-center line-height">
                <div class="status-container line-height">
                  {@html vuln.ccr_item_status.replace(/\n/g, "<br/>")}
                </div>
              </td>
              <td class="text-center line-height"
                >/* Derived classification state *</td
              >
              <td class="text-center line-height">Missing Data</td>
              <td class="text-center line-height">Missing Data</td>
            </tr>
          </tbody>
        {/each}
      </table>
    {:else}
      <div class="no-data-message">
        <p>비교할 두 번째 프로젝트를 선택하세요</p>
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
        <p class="header_title">[자산명] [U-01] 점검항목 타이틀</p>
        <Swiper
          slidesPerView={1}
          spaceBetween={10}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          on:swiper={(swiper) => console.log(swiper)}
        >
          {#each swiperData as swiper}
            <SwiperSlide>
              <div>
                {swiper.number}
                <table>
                  <colgroup>
                    <col style="width: 120px;" />
                    <col />
                  </colgroup>
                  <tr>
                    <th class="text-center">점검플랜</th>
                    <td>
                      <div class="graphCardWrap">
                        {#each recentAssets as asset, index}
                          <div class="iconCard">
                            <article class="graphCard">
                              <div class="contents2">
                                <div class="text2">
                                  <ul>
                                    <li>
                                      <span>프로젝트명 : </span>{asset.ast_os ||
                                        "Unknown OS"}
                                    </li>
                                    <li>
                                      <span
                                        >점검일시 :
                                      </span>{asset.ast_hostname ||
                                        "Unknown Hostname"}
                                    </li>
                                    <li>
                                      <span
                                        >관련시스템 :
                                      </span>{asset.ast_ipaddr || "Unknown IP"}
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </article>
                            {#if index < 4}
                              <img
                                src="images/icons/arrowhead.png"
                                class="arrowIcon"
                              />
                            {/if}
                          </div>
                        {/each}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th class="text-center">점검이력</th>
                    <td>
                      <div class="graphCardWrap">
                        {#each recentAssets as asset}
                          <div class="iconCard">
                            <article class="graphCard">
                              <div class="contents2">
                                <div class="text2">
                                  <ul>
                                    <li>
                                      <span>프로젝트명 : </span>{asset.ast_os ||
                                        "Unknown OS"}
                                    </li>
                                    <li>
                                      <span
                                        >점검일시 :
                                      </span>{asset.ast_hostname ||
                                        "Unknown Hostname"}
                                    </li>
                                    <li>
                                      <span
                                        >관련시스템 :
                                      </span>{asset.ast_ipaddr || "Unknown IP"}
                                    </li>
                                    <li><span>점검현황 : </span></li>
                                  </ul>
                                </div>
                              </div>
                            </article>
                          </div>
                        {/each}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th class="text-center">조치이력</th>
                    <td>
                      <div class="graphCardWrap">
                        {#each recentAssets as asset}
                          <div class="iconCard">
                            <article class="graphCard">
                              <div class="contents2">
                                <div class="text2">
                                  <ul>
                                    <li>
                                      <span>프로젝트명 : </span>{asset.ast_os ||
                                        "Unknown OS"}
                                    </li>
                                    <li>
                                      <span
                                        >점검일시 :
                                      </span>{asset.ast_hostname ||
                                        "Unknown Hostname"}
                                    </li>
                                    <li>
                                      <span
                                        >관련시스템 :
                                      </span>{asset.ast_ipaddr || "Unknown IP"}
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </article>
                          </div>
                        {/each}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th class="text-center">조치내역</th>
                    <td>
                      <div class="graphCardWrap">
                        {#each recentAssets as asset}
                          <div class="iconCard">
                            <article class="graphCard">
                              <div class="contents2">
                                <div class="text2">
                                  <ul>
                                    <li>
                                      <span>프로젝트명 : </span>{asset.ast_os ||
                                        "Unknown OS"}
                                    </li>
                                    <li>
                                      <span
                                        >점검일시 :
                                      </span>{asset.ast_hostname ||
                                        "Unknown Hostname"}
                                    </li>
                                    <li>
                                      <span
                                        >관련시스템 :
                                      </span>{asset.ast_ipaddr || "Unknown IP"}
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </article>
                          </div>
                        {/each}
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
            </SwiperSlide>
          {/each}
        </Swiper>
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
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
    grid-template-columns: repeat(5, 1fr);

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
    padding: 0 15px 10px;
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
  }
  .modal-open-wrap .header_title {
    font-size: 16px;
    display: block;
    border-bottom: 3px solid transparent;
    color: #626677;
    font-size: 16px;
    font-weight: 500;
    padding: 0 25px 10px;
  }
  .modal-open-wrap th,
  .modal-open-wrap td {
    padding: 15px;
    text-align: left;
  }

  .modal-open-wrap th {
    background-color: #007bff;
    color: white;
    font-weight: 600;
  }

  .modal-open-wrap td {
    color: #333;
  }

  .modal-open-wrap td div {
    display: flex;
    justify-content: center;
  }

  .modal-open-wrap .graphCardWrap {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
  }

  .modal-open-wrap .iconCard {
    position: relative;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background-color: white;
    overflow: hidden;
    transition: transform 0.3s ease-in-out;
    cursor: pointer;
    overflow: visible;
  }

  .modal-open-wrap .iconCard:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  }

  .modal-open-wrap .graphCard {
    padding: 15px;
    display: flex;
    flex-direction: column;
  }

  .modal-open-wrap .text2 ul {
    list-style-type: none;
    padding: 0;
  }

  .modal-open-wrap .text2 li {
    margin-bottom: 8px;
    font-size: 16px;
    color: #555;
  }

  .modal-open-wrap .text2 span {
    font-weight: 600;
    color: #333;
  }

  .modal-open-wrap .arrowIcon {
    position: absolute;
    right: -20px; /* Adjust the right position to move the arrow outside */
    top: 50%; /* Center the arrow vertically */

    width: 18px;
    height: 18px;

    transition: opacity 0.3s ease;
    z-index: 9999;
  }

  .modal-open-wrap .iconCard:hover .arrowIcon {
    opacity: 1;
  }

  .modal-open-wrap .arrowIcon img {
    width: 100%;
    height: auto;
  }

  /* Responsiveness */
  @media (max-width: 768px) {
    .modal-open-wrap table {
      width: 100%;
      margin: 0;
    }

    .modal-open-wrap .graphCardWrap {
      grid-template-columns: 1fr 1fr;
    }
  }

  @media (max-width: 480px) {
    .modal-open-wrap .graphCardWrap {
      grid-template-columns: 1fr;
    }

    .modal-open-wrap th,
    .modal-open-wrap td {
      padding: 10px;
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
