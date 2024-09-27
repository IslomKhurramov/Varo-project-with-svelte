<script>
  import { getAllPlanLists } from "../../../services/page1/planInfoService";
  import { assetDeatilInfo } from "../../../services/page2/asset.store";
  import { onMount } from "svelte";

  let plantoSHow = [];
  let allVulns = [];
  let filteredVulns = [];
  let detailofAsset = [];
  let projectData = [];
  let assetData = [];
  let vulnerabilityData = [];

  $: cceHistory = $assetDeatilInfo.length > 1 ? $assetDeatilInfo[1] : [];
  $: DetailOfAsset = $assetDeatilInfo.length > 0 ? $assetDeatilInfo[0] : [];
  /************************/
  // Extract project data and vulns from cceHistory
  $: if (cceHistory.length > 0) {
    plantoSHow = cceHistory.map((item) => Object.values(item)[0]); // Extract plans from each item

    // Gather all vulns from plantoSHow and set as default
    allVulns = [];
    plantoSHow.forEach((historyItem) => {
      if (historyItem.vulns && historyItem.vulns.length > 0) {
        allVulns.push(...historyItem.vulns);
      }
    });

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
  // detailOfAsset (asset) ******************************************************************
  $: if (
    DetailOfAsset.asset &&
    Array.isArray(DetailOfAsset.asset) &&
    DetailOfAsset.asset.length > 0
  ) {
    detailofAsset = DetailOfAsset.asset;
    console.log("detail of asset", detailofAsset);
  }
  /**************************************************************************/

  /********************************************************/

  let selectedProject = "";
  let selectedTarget = "";
  let selectedHost = "";
  let selectedResult = "";
  let selectedCheckList = "";
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
        selectedHost === "" || detailofAsset[0]?.ast_hostname === selectedHost; // Use hostname from detailofAsset
      const checkListMatch =
        selectedCheckList === "" ||
        vuln?.ccr_item_no__ccc_item_title === selectedCheckList;
      const viewOptionMatch =
        selectedViewOption === "" || // Handle the logic for detailed vs. summary view
        (selectedViewOption === "상세보기" && vuln?.isDetailed) ||
        (selectedViewOption === "간략보기" && !vuln?.isDetailed);

      // Ensure all conditions must match
      return (
        projectMatch &&
        targetMatch &&
        resultMatch &&
        hostMatch &&
        checkListMatch &&
        viewOptionMatch
      );
    });
  }
  /**********************************************************/

  /*****************************/
  // Count occurrences of each target
  let targetCounts = {};

  // Create a reactive block to count targets when plantoSHow changes
  $: {
    targetCounts = {};

    if (plantoSHow.length > 0) {
      plantoSHow.forEach((targets) => {
        const target = targets.plans.ast_uuid__ast_target__cct_target;
        if (target) {
          targetCounts[target] = (targetCounts[target] || 0) + 1;
        }
      });
    }
  }
  // Function to convert targetCounts into an array for easier rendering (if needed)
  const getTargetEntries = () => {
    return Object.entries(targetCounts);
  };
  function check() {
    console.log("cceHistory", cceHistory);
    console.log("detail of asset2", DetailOfAsset);
    console.log("projectData", projectData);
    console.log("countedTargets", countedTargets);
  }
</script>

<main class="container1">
  <div class="table_container">
    <table>
      <thead>
        <tr>
          <th on:click={check}>넘버</th>
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
                <td
                  >{new Date(detailofAsset[0]?.ast_createdate).toLocaleString(
                    "ko-KR",
                  )}</td
                >

                {#if detailofAsset[0]?.ast_security_point === -1}
                  <td>0</td>
                {:else}
                  <td>{detailofAsset[0]?.ast_security_point}</td>
                {/if}
                {#if historyItem.plans.ast_security_point === -1}
                  <td
                    >{historyItem.plans.ast_uuid__ast_target__cct_target}(0)</td
                  >
                {:else}
                  <td
                    >{historyItem.plans
                      .ast_uuid__ast_target__cct_target}({historyItem.plans
                      .ast_security_point})</td
                  >
                {/if}
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
            {#each projectData as project}
              <option value={project.projectName}>
                {project.projectName}
              </option>
            {/each}
          </select>
        </div>

        <!-- 점검대상 (Inspection Target) -->
        <div class="dropdown-container">
          <label for="target">점검대상:</label>
          <select id="target" bind:value={selectedTarget}>
            <option value="">전체</option>
            {#each projectData as project}
              <option value={project.inspectionTarget}>
                {project.inspectionTarget}
              </option>
            {/each}
          </select>
        </div>

        <!-- 호스트 (Host) Dropdown -->
        <div class="dropdown-container">
          <label for="item">호스트:</label>
          <select id="item" bind:value={selectedHost}>
            <option value="">전체</option>
            {#each vulnerabilityData as vuln}
              <option value={vuln.hostName}>
                {vuln.hostName}
              </option>
            {/each}
          </select>
        </div>

        <!-- 점검결과 (Inspection Result) -->
        <div class="dropdown-container">
          <label for="result">점검결과:</label>
          <select id="result" bind:value={selectedResult}>
            <option value="">전체</option>
            <option value="양호">양호</option>
            <!-- Good -->
            <option value="취약">취약</option>
            <!-- Vulnerable -->
            <option value="수동점검">수동점검</option>
          </select>
        </div>

        <!-- 점검항목 (Check List) -->
        <div class="dropdown-container">
          <label for="viewOption">점검항목:</label>
          <select id="viewOption" bind:value={selectedCheckList}>
            <option value="">전체</option>
            {#each vulnerabilityData as vuln}
              <option value={vuln.item}>
                {vuln.item}
              </option>
            {/each}
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
        {#if detailofAsset[0]?.ast_security_point === -1}
          <p>0</p>
        {:else}
          <p>{detailofAsset[0]?.ast_security_point}</p>
        {/if}
      </div>
      <div>
        <p class="bold-text">점검대상:</p>
        {#if Object.keys(targetCounts).length > 0}
          {#each getTargetEntries() as [target, count]}
            <p>{target} {count}개</p>
            <!-- Display the target and its count -->
          {/each}
        {:else}
          <p>No targets available</p>
          <!-- Message when there are no counted targets -->
        {/if}
      </div>
      <div>
        <p class="bold-text">점검일시:</p>
        <p>
          {new Date(detailofAsset[0]?.ast_createdate).toLocaleString("ko-KR")}
        </p>
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
                <td>{detailofAsset[0]?.ast_hostname || "No Title"}</td>
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
</style>
