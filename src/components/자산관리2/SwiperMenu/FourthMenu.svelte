<script>
  import { getAllPlanLists } from "../../../services/page1/planInfoService";
  import { assetDeatilInfo } from "../../../services/page2/asset.store";
  import { onMount } from "svelte";
  let plantoSHow = [];
  let planInfo = [];
  let allVulns = [];
  let filteredVulns = [];

  $: cceHistory = $assetDeatilInfo.length > 1 ? $assetDeatilInfo[1] : [];

  // Automatically update plantoSHow and gather all vulns when cceHistory changes
  $: if (cceHistory.length > 0) {
    plantoSHow = cceHistory.map((item) => Object.values(item)[0]); // Extract plans from each item

    // Gather all vulns from plantoSHow and set as default
    allVulns = [];
    plantoSHow.forEach((historyItem) => {
      if (historyItem.vulns && historyItem.vulns.length > 0) {
        allVulns.push(...historyItem.vulns);
      }
    });

    filteredVulns = [...allVulns];
  }

  let selectedProject = "";
  let selectedTarget = "";
  let selectedHost = "";
  let selectedItem = "";
  let selectedResult = "";
  let selectedViewOption = "상세보기";

  function searchResults() {
    filteredVulns = allVulns.filter((vuln) => {
      const projectMatch =
        selectedProject === "" ||
        vuln?.ccp_index__ccp_title === selectedProject;
      const targetMatch =
        selectedTarget === "" || vuln?.cct_index__cct_target === selectedTarget;
      const resultMatch =
        selectedResult === "" || vuln?.ccr_item_result === selectedResult;
      const hostMatch =
        selectedItem === "" || vuln?.ast_hostname === selectedItem;
      return projectMatch && targetMatch && resultMatch && hostMatch;
    });
  }
  /**********************************************************/

  /*****************************/

  let dataTable1 = [];
  for (let i = 1; i <= 100; i++) {
    dataTable1.push({
      number: i.toString(),
      projectNO: `Final Test Project`,
      assetName: "21년 기반시설 점검 가이드라인",
      cassification: "2024-07-07 12:07:07",
      logContent: "결과미확점",
      performer: "SECURITY(90.78)",
    });
  }

  let projectsData = [
    {
      name: "수리과터스트2",
      inspectionTarget: "NETWORK",
      inspectionDateAndTime: "2020.12.15",
    },
  ];

  let hostInfo = [];
  for (let i = 1; i <= 10; i++) {
    hostInfo.push({
      number: i.toString(),
      name: `User_L2_51${i}`,
      item: "[N-01] 패스워드 설정",
      checklist: {
        vulnerability:
          "기본 패스워드를 변경하지 않거나 패스워드를 설정하지 않은 경우",
        good: "기본 패스워드를 변경한 경우",
      },
      system: "계정목록(동일패스워드 없음)",
      instectionResult: "양호",
    });
  }
</script>

<main class="container1">
  <div class="table_container">
    <table>
      <thead>
        <tr>
          <th>넘버</th>
          <th>프로젝트명</th>
          <th>점검항목</th>
          <th>생성일</th>
          <th>프로젝트보안수준</th>
          <th>점검대상 / 자산보안수준</th>
        </tr>
      </thead>
      <tbody>
        <!-- Check if cceHistory contains any data -->
        {#if plantoSHow.length > 0}
          {#each plantoSHow as historyItem, index}
            {#if historyItem.plans}
              <tr>
                <td>{index + 1}</td>
                <td>{historyItem.plans.ccp_index__ccp_title}</td>
                <td>{historyItem.plans.asg_index__asg_title}</td>
                <td>{historyItem.plans.ast_uuid__ast_target__cct_target}</td>
                <td>{historyItem.plans.ast_uuid}</td>
                <td
                  >{historyItem.plans
                    .ast_uuid__ast_target__cct_target}({historyItem.plans
                    .ast_security_point})</td
                >
              </tr>
            {/if}
          {/each}
        {:else}
          <tr>
            <td colspan="6">No data available</td>
          </tr>
        {/if}
      </tbody>
    </table>
  </div>
  <div class="container">
    <div class="firstLine">
      <div class="dropdown-group">
        <!-- 프로젝트 (Project) -->
        <div class="dropdown-container">
          <label for="project">프로젝트:</label>
          <select id="project" bind:value={selectedProject}>
            <option value="">전체</option>
            <!-- 전체 means "All" -->
            {#each plantoSHow as historyItem}
              {#if historyItem.vulns && historyItem.vulns[0]}
                <option value={historyItem.vulns[0]?.ccp_index__ccp_title}>
                  {historyItem.vulns[0]?.ccp_index__ccp_title}
                </option>
              {/if}
            {/each}
          </select>
        </div>

        <!-- 점검대상 (Inspection Target) -->
        <div class="dropdown-container">
          <label for="target">점검대상:</label>
          <select id="target" bind:value={selectedTarget}>
            <option value="">전체</option>
            {#each plantoSHow as historyItem}
              {#if historyItem.vulns && historyItem.vulns[0]}
                <option value={historyItem.vulns[0]?.cct_index__cct_target}>
                  {historyItem.vulns[0]?.cct_index__cct_target}
                </option>
              {/if}
            {/each}
          </select>
        </div>

        <!-- 점검항목 (Inspection Item) -->
        <div class="dropdown-container">
          <label for="item">호스트:</label>
          <select id="item" bind:value={selectedItem}>
            <option value="">전체</option>
            {#each plantoSHow as historyItem}
              {#if historyItem.vulns}
                {#each historyItem.vulns as vuln}
                  <option value={vuln?.ast_hostname}>
                    {vuln?.ast_hostname}
                  </option>
                {/each}
              {/if}
            {/each}
          </select>
        </div>

        <!-- 점검결과 (Inspection Result) -->
        <div class="dropdown-container">
          <label for="result">점검결과:</label>
          <select id="result" bind:value={selectedResult}>
            <option value="">전체</option>
            <option value="양호">양호</option>
            <option value="취약">취약</option>
          </select>
        </div>

        <!-- 보기옵션 (View Options) -->
        <div class="dropdown-container">
          <label for="viewOption">보기옵션:</label>
          <select id="viewOption" bind:value={selectedViewOption}>
            <option value="상세보기">상세보기</option>
            <!-- Detailed view -->
            <option value="간략보기">간략보기</option>
            <!-- Summary view -->
          </select>
        </div>
      </div>

      <!-- Button Group -->
      <div class="button-group">
        <button class="firstlineButton" on:click={searchResults}>
          조회하기
        </button>
        <button class="firstlineButton"> 보안점수확정 </button>
      </div>
    </div>

    <div class="secondLine">
      <div>
        <p class="bold-text">프로젝트 전체 보안수준:</p>
        <p>{projectsData[0].name}</p>
      </div>
      <div>
        <p class="bold-text">결과미확정, 점검대상:</p>
        <p>{projectsData[0].inspectionTarget}</p>
      </div>
      <div>
        <p class="bold-text">점검일시:</p>
        <p>{projectsData[0].inspectionDateAndTime}</p>
      </div>
    </div>

    <div class="thirdLine">
      <p class="bold-text">
        Show <select><option value="">100</option></select> entries
      </p>
    </div>

    <div class="table_container table2">
      <table>
        <thead>
          <tr>
            <th style="width: 5%;">번호</th>
            <th style="width: 20%;">호스트명</th>
            <th style="width: 15%;">항목</th>
            <th style="width: 30%;">점검항목</th>
            <th style="width: 15%;">시스템상태</th>
            <th style="width: 10%;">점검결과</th>
          </tr>
        </thead>
        <tbody>
          {#if filteredVulns.length > 0}
            {#each filteredVulns as vuln, vulnIndex}
              <tr>
                <td>{vulnIndex + 1}</td>
                <td>{vuln?.ccp_index__ccp_title || "No Title"}</td>
                <td>
                  [{vuln?.ccr_item_no__ccc_item_no ||
                    "No Item No"}]{vuln?.ccr_item_no__ccc_item_title ||
                    "No Title"}
                </td>
                <td>
                  <div class="checklist">
                    <p>
                      {vuln?.ccr_item_no__ccc_item_criteria || "No Criteria"}
                    </p>
                  </div>
                </td>
                <td>{vuln?.ccr_item_status || "No Status"}</td>
                <td>{vuln?.ccr_item_result || "No Result"}</td>
              </tr>
            {/each}
          {:else}
            <tr>
              <td colspan="6">No data available</td>
            </tr>
          {/if}
        </tbody>
      </table>
    </div>
  </div>
</main>

<style>
  .container1 {
    display: flex;
    flex-direction: column;
    background-color: #f7f9fb;
    padding: 10px;
    font-family: "Arial", sans-serif;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .table_container {
    overflow-y: auto;
    overflow-x: hidden;
    height: auto;
    width: 100%;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  .container {
    width: 97%;
    display: flex;
    flex-direction: column;
    gap: 15px;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin-top: 40px;
    padding: 20px;
  }

  .firstLine {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .dropdown-group {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    align-items: center;
  }

  .dropdown-container {
    display: flex;
    flex-direction: row;
    gap: 5px;
    align-items: center;
    white-space: nowrap;
  }

  .dropdown-container label {
    font-weight: bold;
    margin: 0;
    font-size: 12px;
  }

  .firstlineButton {
    background-color: #0056b3;
    color: #ffffff;
    border: none;
    border-radius: 5px;
    padding: 8px 12px;
    font-size: 10px;
    font-weight: bold;
    cursor: pointer;
    transition:
      background-color 0.3s ease,
      transform 0.3s ease;
  }

  .firstlineButton:hover {
    background-color: #003366;
    transform: translateY(-2px);
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  }

  .secondLine {
    display: flex;
    align-items: center;
    gap: 10px;
    background-color: #f4f4f4;
    border-radius: 5px;
  }

  .secondLine div {
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 12px;
    justify-content: center;
  }

  .bold-text {
    font-weight: bold;
    margin: 0;
  }
  .button-group {
    display: flex;
    flex-direction: row;
    gap: 5px;
  }

  .thirdLine {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-bottom: 10px;
  }

  .table2 {
    height: 500px;
    width: 100%; /* Full width of the container */
    overflow-y: auto; /* Enable vertical scrolling */
    overflow-x: auto; /* Enable horizontal scrolling */
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin: 0 auto; /* Center the table */
  }

  table {
    width: 100%;
    table-layout: fixed; /* Make sure columns don't stretch unexpectedly */
    border-collapse: collapse;
    font-size: 12px;
  }

  th,
  td {
    border: 1px solid #dddddd;
    padding: 10px;
    text-align: left;
    white-space: pre-wrap; /* Ensures the text wraps within the cells */
    word-wrap: break-word; /* Forces text to break if it's too long */
  }

  th {
    background-color: #005fa3;
    color: #ffffff;
    font-weight: bold;
    text-transform: uppercase;
    position: sticky;
    top: 0;
    z-index: 1;
  }

  tbody tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  tbody tr:hover {
    background-color: #e0f7fa;
  }
  .checklist p {
    white-space: pre-wrap;
  }

  .save_button {
    background-color: #28a745;
    color: #ffffff;
    border: none;
    border-radius: 5px;
    padding: 5px 10px;
    font-size: 12px;
    cursor: pointer;
    transition:
      background-color 0.3s ease,
      transform 0.3s ease;
  }

  .save_button:hover {
    background-color: #247e39;
    transform: translateY(-2px);
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  }
</style>
