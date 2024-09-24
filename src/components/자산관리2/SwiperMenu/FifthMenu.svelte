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
  <div class="header">
    <p>[자산상세정보]</p>
  </div>

  {#if Object.keys(assetDetails).length > 0}
    <div class="table_container table1">
      <table>
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
      </table>
    </div>
  {:else}
    <div class="empty-state-message">
      <h3>Please select an asset to see details</h3>
    </div>
  {/if}
  <div class="table_container table2">
    {#if allVulns.length > 0}
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
            {#each allVulns as vuln, vulnIndex}
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
          </tbody>
        </table>
      </div>
    {/if}
  </div>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    gap: 20px;
    background-color: #f7f9fb;
    padding: 10px;
    margin-bottom: 40px;
    font-family: "Arial", sans-serif;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  .header p {
    color: #000000;
  }
  .header {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
    color: #ffffff;
    height: 41px;
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

  .empty-state-message h3 {
    font-size: 22px; /* Increase the size */
    color: #007bff;
    font-weight: bold;
    text-align: center;
    margin: 10px 0; /* Add some spacing */
  }

  .empty-state-message p {
    font-size: 16px; /* Normal size for description */
    color: #777;
    text-align: center;
  }

  .empty-state-message i {
    font-size: 50px; /* Add a large icon */
    color: #ddd; /* Gray color for the icon */
    margin-bottom: 10px;
  }

  /* If using FontAwesome or similar icon fonts */
  @import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css");

  .table_container {
    display: flex;
    justify-content: center;
    width: 100%;
    margin: 0;
    overflow-y: auto;
    overflow-x: hidden;
    height: 300px;
    background: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 40px;
  }

  table {
    font-family: "Arial", sans-serif;
    border-collapse: collapse;
    width: 100%;
    background: #ffffff;
    font-size: 12px;
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
  th,
  td {
    border: 1px solid #ccc;
    padding: 12px 15px; /* Increased padding for better spacing */
    text-align: left;
    vertical-align: middle; /* Ensure content is vertically centered */
  }

  th {
    background-color: #005fa3; /* Header background color */
    color: #ffffff; /* Header text color */
    position: sticky;
    top: 0;
    z-index: 1;
    text-transform: uppercase; /* Uppercase text for header */
    font-size: 12px;
  }
  .table1 th {
    background-color: #f0f0f0;
    font-weight: bold;
    color: #333;
  }
  .table1 tr:hover {
    background-color: #e0f7fa; /* Soft hover effect */
  }

  /* Optional styling for better visual appeal */
  .table1 td {
    background-color: #fff;
  }
  .table1 tr:nth-child(even) td {
    background-color: #f9f9f9; /* Light gray for alternate rows */
  }
  .table1 tr:nth-child(even) {
    background-color: #f9f9f9; /* Slightly lighter shade for even rows */
  }
  .table1 tr:hover {
    background-color: #e0f7fa; /* Soft hover effect */
  }
</style>
