<script>
  import { getAllPlanLists } from "../../../services/page1/planInfoService";
  import { assetDeatilInfo } from "../../../services/page2/asset.store";
  import { onMount } from "svelte";
  import ModalCcEhistory from "../HeaderMenu/ModalCCEhistory.svelte";

  let plantoSHow = [];
  let allVulns = [];
  let filteredVulns = [];
  let detailofAsset = [];
  let projectData = [];
  let assetData = [];
  let vulnerabilityData = [];
  let targetCounts = {};
  let selectedItem = {};
  let showItemDetail = false;

  function itemClickHandle(vuln) {
    selectedItem = vuln;
    showItemDetail = true;
  }
  // Reactive block to set cceHistory and DetailOfAsset
  $: cceHistory = $assetDeatilInfo.length > 1 ? $assetDeatilInfo[1] : [];
  $: DetailOfAsset = $assetDeatilInfo.length > 0 ? $assetDeatilInfo[0] : [];
  // Extract project data and vulns from cceHistory
  $: {
    if (cceHistory.length > 0) {
      plantoSHow = cceHistory.map((item) => Object.values(item)[0]); // Extract plans

      // Gather all vulnerabilities from plantoSHow
      allVulns = plantoSHow.flatMap((historyItem) => historyItem.vulns || []);

      // Set filteredVulns to allVulns initially
      filteredVulns = [...allVulns];

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
  }

  // Set detail of asset
  $: if (DetailOfAsset.asset && Array.isArray(DetailOfAsset.asset)) {
    detailofAsset = DetailOfAsset.asset;
  }
  // Variables for filtering
  let selectedProject = "점검대상"; // Default value
  let selectedTarget = "점검대상"; // Default value
  let selectedResult = "점검결과"; // Default value

  // Function to filter vulnerabilities
  function searchResults() {
    filteredVulns = allVulns.filter((vuln) => {
      const projectMatch =
        selectedProject === "점검대상" ||
        vuln.ccp_index__ccp_title === selectedProject;
      const targetMatch =
        selectedTarget === "점검대상" ||
        vuln.cct_index__cct_target === selectedTarget;
      const resultMatch =
        selectedResult === "점검결과" ||
        vuln.ccr_item_result === selectedResult;

      return projectMatch && targetMatch && resultMatch;
    });
  }

  // Trigger filter when dropdown changes
  function handleFilter() {
    searchResults();
  }

  // Reset filters to default values
  function resetFilters() {
    selectedProject = "점검대상"; // Reset to default
    selectedTarget = "점검대상"; // Reset to default
    selectedResult = "점검결과"; // Reset to default
    searchResults(); // Apply the reset filter
  }
  // Count occurrences of each target
  let getTargetEntries;
  // Function to convert targetCounts into an array for rendering
  $: getTargetEntries = () => {
    return Object.entries(targetCounts);
  };

  // Check function for debugging
  function check() {}
</script>

<main>
  <div class="flex col detail">
    <h3 class="title">관련프로젝트</h3>
    <div class="tableListWrap nofirstth">
      <table class="tableList hdBorder font-size: 16px;">
        <colgroup>
          <col style="width:80px;" />
          <col />
          <col />
          <col />
          <col />
          <col />
        </colgroup>
        <thead>
          <tr>
            <th on:click={check} class="text-center">넘버</th>
            <th class="text-center">프로젝트명</th>
            <th class="text-center">점검항목</th>
            <th class="text-center">생성일</th>
            <th class="text-center">프로젝트보안수준</th>
            <th class="text-center">점검대상 / 자산보안수준</th>
          </tr>
        </thead>
        <tbody>
          <!-- Check if cceHistory contains any data -->
          {#if plantoSHow.length > 0}
            {#each plantoSHow as historyItem, index}
              {#if historyItem.plans}
                <tr>
                  <td class="text-center">{index + 1}</td>
                  <td class="text-center line-height"
                    >{historyItem.plans.ccp_index__ccp_title}</td
                  >
                  <td class="text-center line-height"
                    >{historyItem.plans.asg_index__asg_title}</td
                  >
                  <td class="text-center line-height"
                    >{new Intl.DateTimeFormat("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    }).format(new Date(detailofAsset[0]?.ast_createdate))}</td
                  >

                  {#if detailofAsset[0]?.ast_security_point === -1}
                    <td class="text-center">0</td>
                  {:else}
                    <td class="text-center line-height"
                      >{detailofAsset[0]?.ast_security_point}</td
                    >
                  {/if}
                  {#if historyItem.plans.ast_security_point === -1}
                    <td class="text-center line-height"
                      >{historyItem.plans
                        .ast_uuid__ast_target__cct_target}(0)</td
                    >
                  {:else}
                    <td class="text-center line-height"
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
              <td class="text-center" colspan="6">No data available</td>
            </tr>
          {/if}
        </tbody>
      </table>
    </div>
  </div>
  <div class="section">
    <section class="filterWrap" style="margin-top: 20px;">
      <!-- 프로젝트 (Project) -->
      <div>
        <select
          id="project"
          bind:value={selectedProject}
          on:change={handleFilter}
        >
          <option value="점검대상">점검대상</option>
          <!-- 전체 means "All" -->
          {#each plantoSHow as project}
            <option value={project.plans.ccp_index__ccp_title}>
              {project.plans.ccp_index__ccp_title}
            </option>
          {/each}
        </select>

        <select
          id="target"
          bind:value={selectedTarget}
          on:change={handleFilter}
        >
          <option value="점검대상">점검대상</option>
          <option value="WINDOWS">WINDOWS</option>
          <option value="PC">PC</option>
          <option value="NETWORK">NETWORK</option>
          <option value="DBMS">DBMS</option>
          <option value="WEB">WEB</option>
          <option value="WAS">WAS</option>
          <option value="CLOUD">CLOUD</option>
          <option value="SECURITY">SECURITY</option>
        </select>

        <select
          id="result"
          bind:value={selectedResult}
          on:change={handleFilter}
        >
          <option value="점검결과">점검결과</option>
          <option value="양호">양호</option>
          <!-- Good -->
          <option value="취약">취약</option>
          <!-- Vulnerable -->
          <option value="수동점검">수동점검</option>
        </select>

        <button on:click={resetFilters} class="btn btnPrimary">
          <img src="./assets/images/reset.png" alt="search" /> 초기화
        </button>
        <button class="btn btnPrimary"> 보안점수확정 </button>
      </div>
    </section>

    <section class="flex totalSecurityLevel" style="margin-top: 20px;">
      <h4>프로젝트 전체 보안수준</h4>

      <p class="bold-text">프로젝트 전체 보안수준:</p>
      <ul class="flex">
        <li class="flex">
          <h6 class="name">보안수준</h6>
          {#if detailofAsset[0]?.ast_security_point === -1}
            <b>0</b>
          {:else}
            <b>{detailofAsset[0]?.ast_security_point}</b>
          {/if}
          <div class="badge badgeRedW">결과 미확정</div>
        </li>
        <li class="flex">
          <h6 class="name">점검대상</h6>
          {#if Object.keys(targetCounts).length > 0}
            {#each getTargetEntries() as [target, count]}
              <b>{target} {count}개</b>
            {/each}
          {:else}
            <b>No targets available</b>
          {/if}
        </li>
        <li class="flex">
          <h6 class="name">점검시작일시</h6>
          <b>
            {new Intl.DateTimeFormat("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            }).format(new Date(detailofAsset[0]?.ast_createdate))}
          </b>
        </li>
      </ul>
    </section>

    <div
      class="tableListWrap maxh"
      style="height: 80vh; overflow-y: auto; margin-top: 20px;  font-size: 16px; "
    >
      <table class="tableList hdBorder tableScroll">
        <colgroup>
          <col style="width:90px;" />
          <col style="width:110px;" />
          <col style="width:200px;" />
          <col />
          <col />
          <col style="width:160px;" />
        </colgroup>
        <thead>
          <tr>
            <th class="text-center">번호</th>
            <th class="text-center">호스트명</th>
            <th class="text-center">항목</th>
            <th class="text-center">점검항목</th>
            <th class="text-center">시스템상태</th>
            <th class="text-center">점검결과</th>
          </tr>
        </thead>
        <tbody>
          {#if filteredVulns.length > 0}
            {#each filteredVulns as vuln, vulnIndex}
              <tr on:click={() => itemClickHandle(vuln)}>
                <td class="wordBreak text-center">{vulnIndex + 1}</td>
                <td class="line-height"
                  >{detailofAsset[0]?.ast_hostname || "No Title"}</td
                >
                <td class="line-height">
                  [{vuln?.ccr_item_no__ccc_item_no ||
                    "No Item No"}]{vuln?.ccr_item_no__ccc_item_title ||
                    "No Title"}
                </td>
                <td class="wordBreak">
                  <div class="checklist">
                    <p class="line-height">
                      {vuln?.ccr_item_no__ccc_item_criteria || "No Criteria"}
                    </p>
                  </div>
                </td>
                <td class="wordBreak">
                  <div class="status-container line-height">
                    {vuln?.ccr_item_status
                      ? vuln.ccr_item_status.trim()
                      : "No Status"}
                  </div>
                </td>
                {#if vuln?.ccr_item_result === "양호"}
                  <td class="text-center">
                    <span class="badge badgePrimary">
                      {vuln?.ccr_item_result || "No Result"}
                    </span>
                  </td>
                {:else if vuln?.ccr_item_result === "취약"}
                  <td class="text-center">
                    <span class="badge badgeRed">
                      {vuln?.ccr_item_result || "No Result"}
                    </span>
                  </td>
                {:else}
                  <td class="text-center">
                    <span class="badge badgeGreen">
                      {vuln?.ccr_item_result || "No Result"}
                    </span>
                  </td>
                {/if}
              </tr>
            {/each}
          {:else}
            <tr>
              <td class="text-center" colspan="6">No data available</td>
            </tr>
          {/if}
        </tbody>
      </table>
    </div>
  </div>
  {#if showItemDetail}
    <div class="modal-open-wrap">
      <dialog open on:close={() => (showItemDetail = false)}>
        <ModalCcEhistory {selectedItem} bind:showItemDetail />
      </dialog>
    </div>
  {/if}
</main>

<style>
  .line-height {
    line-height: 23px;
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
    width: 1103px;
    border: none;
    border-radius: 10px;
    background-color: white;
    padding: 20px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    animation: svelte-s7onsa-fadeIn 0.3s ease;
    z-index: 100;
  }

  /* Modal backdrop */
  dialog::backdrop {
    background: rgba(0, 0, 0, 0.5);
    animation: fadeInBackdrop 0.3s ease;
  }
  .wordBreak {
    white-space: pre-wrap; /* Ensures the text wraps within the cells */
    word-wrap: break-word;
    text-align: left;
    padding: 10px;
    overflow-y: auto;
  }
  .status-container {
    max-height: 100px; /* Set the maximum height for the content */
    overflow-y: auto;
    overflow-x: hidden; /* Allow scrolling only if content exceeds the height */
    padding: 0;
    margin: 0;
  }

  .tableScroll {
    margin-bottom: 20px;
    height: 75vh;
    overflow-y: auto; /* Enable vertical scrolling */
    overflow-x: auto;
  }
  tr:hover {
    background-color: rgba(242, 242, 242, 1);
    cursor: pointer;
  }
  * {
    font-size: 16px;
  }
  .tableListWrap .hdBorder td {
    font-size: 16px;
  }
  .tableList thead {
    position: sticky; /* Make the header sticky */
    top: 0; /* Stick the header to the top */
    z-index: 10; /* Ensure the header is above the scrolling content */
    box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.4); /* Shadow effect for separation */
  }
</style>
