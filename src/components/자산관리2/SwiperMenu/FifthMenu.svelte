<script>
  import { assetDeatilInfo } from "../../../services/page2/asset.store";
  let plantoSHow = [];
  let allVulns = [];
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
        <table class="tableList">
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
      <div class="tableListWrap maxh">
        {#if allVulns.length > 0}
          <table
            class="tableList hdBorder tableScroll"
            style="margin-top: 20px; height:500px overflow-y:auto"
          >
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
                <tr>
                  <td class=" wordBreak">{vulnIndex + 1}</td>
                  <td>{assetDetails.ast_hostname || "No Title"}</td>
                  <td>
                    [{vuln?.ccr_item_no__ccc_item_no ||
                      "No Item No"}]{vuln?.ccr_item_no__ccc_item_title ||
                      "No Title"}
                  </td>
                  <td class=" wordBreak">
                    <div class="checklist">
                      <p>
                        {vuln?.ccr_item_no__ccc_item_criteria || "No Criteria"}
                      </p>
                    </div>
                  </td>
                  <td class=" wordBreak"
                    >{vuln?.ccr_item_status || "No Status"}</td
                  >
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
</main>

<style>
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

  .empty-state-message h3 {
    font-size: 22px; /* Increase the size */
    color: #007bff;
    font-weight: bold;
    text-align: center;
    margin: 10px 0; /* Add some spacing */
  }

  /* If using FontAwesome or similar icon fonts */
  @import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css");
</style>
