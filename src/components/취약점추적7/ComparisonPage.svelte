<script>
  import { Swiper, SwiperSlide } from "swiper/svelte";
  import SwiperCore, { Navigation, Pagination } from "swiper";
  import "swiper/swiper-bundle.css";
  let showModalProjectComparison = false;
  let selectedData = [];
  SwiperCore.use([Navigation, Pagination]);
  let swiperData = [];
  for (let i = 0; i < 20; i++) {
    swiperData.push({
      number: (i + 1).toString(),
      planName: "plan",
      version: "1.0.0",
    });
  }
  function modalDataOpen(data) {
    showModalProjectComparison = true;
    selectedData = data;
    console.log("clicked");
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

  let filteredAssets = [
    {
      ast_security_point: 85,
      ast_uuid__ast_target__cct_target: "Web Server",
      asg_index__asg_title: "Finance Servers",
      ast_os: "Windows Server 2019",
      ast_hostname: "2024.04.04",
      ast_ipaddr: "2000대",
      ast_agent_installed: true,
    },
    {
      ast_security_point: 12,
      ast_uuid__ast_target__cct_target: "Web Server",
      asg_index__asg_title: "Finance Servers",
      ast_os: "Windows Server 2019",
      ast_hostname: "2024.04.04",
      ast_ipaddr: "2000대",
      ast_agent_installed: true,
    },
    {
      ast_security_point: 1500,
      ast_uuid__ast_target__cct_target: "Web Server",
      asg_index__asg_title: "Finance Servers",
      ast_os: "Windows Server 2019",
      ast_hostname: "2024.04.04",
      ast_ipaddr: "2000대",
      ast_agent_installed: true,
    },
    {
      ast_security_point: 85,
      ast_uuid__ast_target__cct_target: "Web Server",
      asg_index__asg_title: "Finance Servers",
      ast_os: "Windows Server 2019",
      ast_hostname: "2024.04.04",
      ast_ipaddr: "2000대",
      ast_agent_installed: true,
    },
    {
      ast_security_point: 900,
      ast_uuid__ast_target__cct_target: "Web Server",
      asg_index__asg_title: "Finance Servers",
      ast_os: "Windows Server 2019",
      ast_hostname: "2024.04.04",
      ast_ipaddr: "2000대",
      ast_agent_installed: true,
    },
  ];
  let selectedAsset = filteredAssets[0];
  let recentAssets = filteredAssets.slice(-5);
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

<p class="header_title2">점검플랜별 취약점 결과</p>
<section>
  <div class="firstContainer">
    <select name="operating_system" id="operating_system" class="select_input">
      <option value="" selected>플랜명</option>
      <option value="플랜명">플랜명</option>
    </select>
    <div class="diagram_container">
      <div class="right_diag">
        <div
          class="circle"
          style="width: 150px;"
          data-percent={filteredAssets[0].asset_point_history?.[0]
            ?.ast_security_point || 0}
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
              stroke={getStrokeColor(filteredAssets[0].ast_security_point || 0)}
              stroke-width="10"
              fill="none"
              stroke-dasharray="440"
              stroke-dashoffset={440 -
                (440 * (filteredAssets[0].ast_security_point || 0)) / 100}
              stroke-linecap="round"
              transform="rotate(-90 75 75)"
            />
          </svg>
          <!-- Percentage Label -->
          <div class="percent">
            <span
              class="number"
              style="font-size: 32px; color: {getStrokeColor(
                filteredAssets[0].ast_security_point || 0,
              )};"
            >
              {filteredAssets[0].ast_security_point > 0
                ? filteredAssets[0].ast_security_point
                : 0}%
            </span>
          </div>
        </div>
        <p>전체보안수준</p>
      </div>
      {#if filteredAssets && filteredAssets.length > 0}
        <div class="iconCard">
          <article class="graphCard hoverCard">
            <div class="contents">
              <!-- Asset Details -->
              <div class="text flex col justify-between">
                <ul>
                  <li>
                    <span>취약 : </span>{filteredAssets[0].ast_security_point ||
                      "Unknown OS"}건
                  </li>
                  <li>
                    <span>프로젝트명 : </span>{filteredAssets[0].ast_os ||
                      "Unknown OS"}
                  </li>
                  <li>
                    <span>점검일시 : </span>{filteredAssets[0].ast_hostname ||
                      "Unknown Hostname"}
                  </li>
                  <li>
                    <span>관련시스템 : </span>{filteredAssets[0].ast_ipaddr ||
                      "Unknown IP"}
                  </li>
                  <li style="margin-top: 15px;">
                    <span>[취약점 요약]</span>
                  </li>
                  <li>
                    <span>최다자산 : </span>{filteredAssets[0]
                      .ast_uuid__ast_target__cct_target || "No Target"}
                  </li>
                  <li>
                    <span>최다항목 : </span>{filteredAssets[0]
                      .ast_agent_installed
                      ? "설치됨"
                      : "설치 안됨"}
                  </li>
                  <li>
                    <span>취약점수 : </span>{filteredAssets[0].ast_hostname ||
                      "Unknown Hostname"}
                  </li>
                  <li>
                    <span>조치개수 : </span>{filteredAssets[0].ast_ipaddr ||
                      "Unknown IP"}
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
      {:else}
        <div class="no-assets">
          <p>자산을 찾을 수 없습니다.</p>
        </div>
      {/if}
    </div>
  </div>
  <div class="firstContainer">
    <select name="operating_system" id="operating_system" class="select_input">
      <option value="" selected>플랜명</option>
      <option value="플랜명">플랜명</option>
    </select>
    <div class="diagram_container">
      <div class="right_diag">
        <div
          class="circle"
          style="width: 150px;"
          data-percent={filteredAssets[0].asset_point_history?.[0]
            ?.ast_security_point || 0}
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
              stroke={getStrokeColor(filteredAssets[0].ast_security_point || 0)}
              stroke-width="10"
              fill="none"
              stroke-dasharray="440"
              stroke-dashoffset={440 -
                (440 * (filteredAssets[0].ast_security_point || 0)) / 100}
              stroke-linecap="round"
              transform="rotate(-90 75 75)"
            />
          </svg>
          <!-- Percentage Label -->
          <div class="percent">
            <span
              class="number"
              style="font-size: 32px; color: {getStrokeColor(
                filteredAssets[0].ast_security_point || 0,
              )};"
            >
              {filteredAssets[0].ast_security_point > 0
                ? filteredAssets[0].ast_security_point
                : 0}%
            </span>
          </div>
        </div>
        <p>전체보안수준</p>
      </div>
      {#if filteredAssets && filteredAssets.length > 0}
        <div class="iconCard">
          <article class="graphCard hoverCard">
            <div class="contents">
              <!-- Asset Details -->
              <div class="text flex col justify-between">
                <ul>
                  <li>
                    <span>취약 : </span>{filteredAssets[0].ast_security_point ||
                      "Unknown OS"}건
                  </li>
                  <li>
                    <span>프로젝트명 : </span>{filteredAssets[0].ast_os ||
                      "Unknown OS"}
                  </li>
                  <li>
                    <span>점검일시 : </span>{filteredAssets[0].ast_hostname ||
                      "Unknown Hostname"}
                  </li>
                  <li>
                    <span>관련시스템 : </span>{filteredAssets[0].ast_ipaddr ||
                      "Unknown IP"}
                  </li>
                  <li style="margin-top: 15px;">
                    <span>[취약점 요약]</span>
                  </li>
                  <li>
                    <span>최다자산 : </span>{filteredAssets[0]
                      .ast_uuid__ast_target__cct_target || "No Target"}
                  </li>
                  <li>
                    <span>최다항목 : </span>{filteredAssets[0]
                      .ast_agent_installed
                      ? "설치됨"
                      : "설치 안됨"}
                  </li>
                  <li>
                    <span>취약점수 : </span>{filteredAssets[0].ast_hostname ||
                      "Unknown Hostname"}
                  </li>
                  <li>
                    <span>조치개수 : </span>{filteredAssets[0].ast_ipaddr ||
                      "Unknown IP"}
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
      {:else}
        <div class="no-assets">
          <p>자산을 찾을 수 없습니다.</p>
        </div>
      {/if}
    </div>
  </div>
</section>
<section class="table_section">
  <div
    class="tableListWrap table2"
    style="margin-bottom: 20px; margin-top:20px; margin height:50vh;"
  >
    <table class="tableList hdBorder font-size: 16px;">
      <colgroup>
        <col style="width:90px;" />
        <col />
        <col />
        <col />
        <col />
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

      <tbody>
        <tr on:click={modalDataOpen} class="clickLine">
          <td class="text-center line-height">1</td>
          <td class="text-center line-height"
            >{selectedAsset.asg_index__asg_title}</td
          >
          <td class="text-center line-height"
            >{selectedAsset.ast_uuid__ast_target__cct_target}</td
          >
          <td class="text-center line-height"
            >{selectedAsset.asg_index__asg_title}</td
          >
          <td class="text-center line-height">{selectedAsset.ast_os}</td>
          <td class="text-center line-height">{selectedAsset.ast_ipaddr}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div
    class="tableListWrap table2"
    style="margin-bottom: 20px; margin-top:20px; margin height:50vh;"
  >
    <table class="tableList hdBorder font-size: 16px;">
      <colgroup>
        <col style="width:90px;" />
        <col />
        <col />
        <col />
        <col />
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

      <tbody>
        <tr on:click={modalDataOpen} class="clickLine">
          <td class="text-center line-height">1</td>
          <td class="text-center line-height"
            >{selectedAsset.asg_index__asg_title}</td
          >
          <td class="text-center line-height"
            >{selectedAsset.ast_uuid__ast_target__cct_target}</td
          >
          <td class="text-center line-height"
            >{selectedAsset.asg_index__asg_title}</td
          >
          <td class="text-center line-height">{selectedAsset.ast_os}</td>
          <td class="text-center line-height">{selectedAsset.ast_ipaddr}</td>
        </tr>
      </tbody>
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
          on:click={() => (showModalProjectComparison = false)}>창닫기</button
        >
      </div>
    </dialog>
  </div>
{/if}

<style>
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
    padding: 0 15px 10px;
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
    width: 280px;
  }
  .graphCard {
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
  .text ul {
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
