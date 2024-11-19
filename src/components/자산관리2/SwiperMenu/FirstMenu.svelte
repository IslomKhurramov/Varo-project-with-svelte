<script>
  import { assetDeatilInfo } from "../../../services/page2/asset.store";
  let currentData = null;
  let activeData = null;
  let selectedDate = ""; // Used as date filter for 네트워크 정보 and 프로세스목록

  // Reactive subscription to assetDeatilInfo store
  $: assetDetails =
    $assetDeatilInfo.length > 0 ? $assetDeatilInfo[0].asset[0] : {};
  $: cceHistory = $assetDeatilInfo.length > 1 ? $assetDeatilInfo[1] : [];
  $: assetHistory = $assetDeatilInfo.length > 0 ? $assetDeatilInfo : [];
  $: fieldOptions =
    currentData && currentData.length > 0 ? Object.keys(currentData[0]) : [];
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
    </div>
  </div>
</main>

<style>
  .itemListWrap {
    display: flex;
    flex-direction: column;
    gap: 20px; /* Adds space between each item card */
    margin: 20px;
  }

  .itemCard {
    background-color: #fff;
    border: 1px solid #ddd; /* Border for clear separation */
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1); /* Soft shadow for card effect */
  }

  .itemTable {
    width: 100%;
    border-collapse: collapse;
  }

  .itemTable td {
    padding: 8px 10px;
    vertical-align: top;
  }

  .fieldName {
    font-weight: bold;
    color: #333;
    width: 150px;
  }

  .fieldValue {
    color: #555;
  }

  /* Optional alternating row color within each card */
  .itemTable tr:nth-child(even) .fieldValue {
    background-color: rgba(0, 103, 255, 0.05);
  }
  .tableListWrap th,
  td {
    font-size: 16px;
  }
  .subTabWrap a {
    cursor: pointer;
  }
  thead {
    position: sticky; /* Make the header sticky */
    top: 0; /* Stick the header to the top */
    z-index: 10; /* Ensure the header is above the scrolling content */
    box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.4); /* Shadow effect for separation */
  }
  .scrollTable {
    overflow-y: auto;
    overflow-x: hidden;
    height: 500px;
    padding-left: 20px;
    padding-right: 20px;
  }
  .contenArea {
    min-height: 1200px;
  }
  .empty_state {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    background-color: #f9f9f9;
    border: 1px solid #ccc;
    border-radius: 8px;
    margin-top: 20px;
    font-size: 14px;
    color: #555;
  }
  .empty-state-message {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px; /* Adjust the height based on your design */
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin-top: 20px;
    color: #555; /* Text color */
  }
  td:hover {
    background-color: rgba(242, 242, 242, 1);
    cursor: pointer;
  }
  .empty-state-message h3 {
    font-size: 18px;
    color: #007bff;
    font-weight: bold;
    text-align: center;
  }
  .btn:hover {
    background-color: #007bff;
    color: white;
  }
  .btn {
    font-size: 16px;
  }
</style>
