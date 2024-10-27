<script>
  import { assetDeatilInfo } from "../../../services/page2/asset.store";
  import ModalCcEhistory from "../HeaderMenu/ModalCCEhistory.svelte";
  let plantoSHow = [];
  let allVulns = [];
  let selectedItem = {};
  let showItemDetail = false;

  function itemClickHandle(vuln) {
    selectedItem = vuln;
    console.log("Select item", selectedItem);
    showItemDetail = true;
  }
  // Reactive subscription to assetDeatilInfo store
  $: assetDetails =
    $assetDeatilInfo.length > 0 ? $assetDeatilInfo[0].asset[0] : {};
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
  }
</script>

<main>
  <div class="flex col detail">
    <h3 class="title">자산상세정보</h3>
    <div class="tableListWrap nohead">
      {#if Object.keys(assetDetails).length > 0}
        <table class="tableList table1">
          <colgroup>
            <col style="width:140px;" />
            <col />
            <col style="width:140px;" />
            <col />
            <col style="width:140px;" />
            <col />
            <col style="width:140px;" />
            <col />
          </colgroup>
          <tbody>
            <tr>
              <th>아이피주소</th>
              <td>{assetDetails.ast_ipaddr}</td>
              <th>IP추적처리</th>
              <td>{assetDetails.ast_ipaddrs}</td>
              <th>자산코드</th>
              <td>{assetDetails.ast_code}</td>
              <th>용도</th>
              <td>{assetDetails.ast_usage}</td>
            </tr>
            <tr>
              <th>제조사</th>
              <td>{assetDetails.ast_brand}</td>
              <th>운영체제</th>
              <td>{assetDetails.ast_os}</td>
              <th>모델</th>
              <td>{assetDetails.ast_model}</td>
              <th>점검대상</th>
              <td>NETWORK</td>
            </tr>
            <tr>
              <th>호스트명</th>
              <td>{assetDetails.ast_hostname}</td>
              <th>위치</th>
              <td>{assetDetails.ast_location}</td>
              <th>운영팀</th>
              <td>{assetDetails.ast_operator_team}</td>
              <th>관리자</th>
              <td>{assetDetails.ast_operator_person}</td>
            </tr>
            <tr>
              <th>관리전화</th>
              <td>{assetDetails.ast_operator_phone}</td>
              <th>기밀성</th>
              <td>{assetDetails.ast_confidentiality}</td>
              <th>무결성</th>
              <td>{assetDetails.ast_integrity}</td>
              <th>가용성</th>
              <td>{assetDetails.ast_availability}</td>
            </tr>
            <tr>
              <th>보안점수</th>
              <td>{assetDetails.ast_security_point}</td>
              <th>등급</th>
              <td>{assetDetails.ast_security_level}</td>
              <th>ISMS인증</th>
              <td>{assetDetails.ast_isms_target ? "True" : "False"}</td>
              <th>활성화여부</th>
              <td>{assetDetails.ast_activate ? "활성화상태" : "비활성화"}</td>
            </tr>
          </tbody>
        </table>
      {:else}
        <div class="empty-state-message">
          <h3>Please select an asset to see details</h3>
        </div>
      {/if}
      <div
        class="tableListWrap maxh"
        style="height: 80vh; overflow-y: auto; margin-top: 20px;  font-size: 16px; "
      >
        {#if allVulns.length > 0}
          <table class="tableList hdBorder tableScroll table2">
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
                <th>항목</th>
                <th>점검항목</th>
                <th>시스템상태</th>
                <th class="text-center">점검결과</th>
              </tr>
            </thead>
            <tbody>
              {#each allVulns as vuln, vulnIndex}
                <tr on:click={() => itemClickHandle(vuln)}>
                  <td class=" wordBreak text-center">{vulnIndex + 1}</td>
                  <td class="line-height"
                    >{assetDetails.ast_hostname || "No Title"}</td
                  >
                  <td class="line-height">
                    [{vuln?.ccr_item_no__ccc_item_no ||
                      "No Item No"}]{vuln?.ccr_item_no__ccc_item_title ||
                      "No Title"}
                  </td>
                  <td class=" wordBreak">
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
            </tbody>
          </table>
        {/if}
      </div>
    </div>
  </div>
  {#if showItemDetail}
    <dialog open on:close={() => (showItemDetail = false)}>
      <ModalCcEhistory {selectedItem} />

      <button
        class="btn modify-btn"
        style="margin-top:10px;"
        on:click={() => (showItemDetail = false)}>Close</button
      >
    </dialog>
  {/if}
</main>

<style>
  .line-height {
    line-height: 23px;
  }
  .modify-btn {
    background-color: #4caf50; /* Green background for modify button */
    color: white; /* White text */
  }
  dialog {
    position: fixed;
    top: 50%;
    left: 40%;
    transform: translate(-50%, -50%);
    width: 500px;
    height: 600px;
    border: none;
    border-radius: 10px;
    background-color: white;
    padding: 20px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    animation: fadeIn 0.3s ease;
    z-index: 100;
  }
  .table1 td:hover {
    background-color: rgba(242, 242, 242, 1);
    cursor: pointer;
  }
  * {
    font-size: 16px;
  }
  .tableListWrap th,
  td {
    font-size: 16px;
  }
  .table1 td:hover {
    background-color: rgba(242, 242, 242, 1);
  }
  .tableListWrap .hdBorder td {
    font-size: 16px;
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
  .empty-state-message {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 250px; /* Adjust the height for better visibility */
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin-top: 20px;
    color: #555;
    padding: 20px; /* Add some padding */
  }
  .table2 tr:hover {
    background-color: rgba(242, 242, 242, 1);
    cursor: pointer;
  }
  .empty-state-message h3 {
    font-size: 22px; /* Increase the size */
    color: #007bff;
    font-weight: bold;
    text-align: center;
    margin: 10px 0; /* Add some spacing */
  }
  .tableList thead {
    position: sticky; /* Make the header sticky */
    top: 0; /* Stick the header to the top */
    z-index: 10; /* Ensure the header is above the scrolling content */
    box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.4); /* Shadow effect for separation */
  }

  /* If using FontAwesome or similar icon fonts */
  @import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css");
</style>
