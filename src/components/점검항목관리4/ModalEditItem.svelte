<script>
  export let selectedItem;
  export let selectedCategory;

  $: selectedItem && console.log("DATAMODAL", selectedItem);
  let projectsData = [
    {
      checklist: "[ U -53 ] 사용자 shell 점검",
      itemGroup: "[ UNIX ] 계정 관리",
      inspectionCriteria: "하",
      riskLevel: {
        vulnerability:
          " 로그인이 필요하지 않은 계정에 /bin/false(/sbin/nologin) 쉘이 부여되어 있는 경우 ",
        good: " 로그인이 필요하지 않은 계정에 /bin/false(/sbin/nologin) 쉘이 부여되어 있는 경우 ",
      },
      modifyInspectionResults: "",
      inspectionStatus: "2020.12.15",
      evidenceImage: "사용하지 않는 계정에 쉘이 적용되어 있지 않음",
      improve:
        "로그인이 필요하지 않은 계정에 대해 /bin/false(/sbin/nologin) 쉘 부여",
      inprovement:
        "일반적으로 로그인이 불필요한 계정 daemon, bin, sys, adm, listen, nobody, nobody4, noaccess, diag, operator, games, gopher 등 일반적으로 UID 100 이하 60000 이상의 시 스템 계정 해당",
    },
  ];
</script>

<div class="modal">
  <table>
    {#if selectedItem}
      <tr>
        <th>점검대상</th>
        <td>{selectedCategory}</td>
      </tr>
      <tr>
        <th>항목그룹</th>
        <td>{selectedItem[3]}</td>
      </tr>
      <tr>
        <th>정검목적</th>
        <td>{selectedItem[9]}</td>
      </tr>
      <tr>
        <th>보안위협</th>
        <td>{selectedItem[10]}</td>
      </tr>
      <tr>
        <th>점검내용</th>
        <td>{selectedItem[11]}</td>
      </tr>
      <tr>
        <th>대상시스템</th>
        <td>{selectedItem[7]}</td>
      </tr>
      <tr>
        <th>식별코드</th>
        <td>{selectedItem[5]}</td>
      </tr>
      <tr>
        <th>점검항목</th>
        <td>{selectedItem[4]}</td>
      </tr>
      <tr>
        <th>위험도</th>
        <td>{selectedItem[6]}</td>
      </tr>
      <tr>
        <th>평가기준</th>
        <td>{selectedItem[12]}</td>
      </tr>
      <tr>
        <th>조치방안</th>
        <td>{selectedItem[13]}</td>
      </tr>
      <tr>
        <th>조치예시</th>
        <td>{selectedItem[14]}</td>
      </tr>
      <tr>
        <th>조치시영향도</th>
        <td>{selectedItem[15] || "N/A"}</td>
      </tr>
    {:else}
      <tr>
        <td colspan="2">No data available</td>
      </tr>
    {/if}
  </table>
</div>

<style>
  .modal {
    border-radius: 10px;
    background-color: #f9f9f9;
    padding: 20px;
    max-width: 700px;
    margin: 0 auto;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
    margin-bottom: 20px;
  }

  th,
  td {
    border: 1px solid #dddddd;
    padding: 12px 15px;
    text-align: left;
  }

  th {
    background-color: #f1f1f1;
    color: #333;
    font-weight: bold;
    width: 120px;
  }

  .lineCol {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .line5,
  .line7 {
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: flex-start;
  }

  .line5 select {
    height: 30px;
    padding: 5px;
    border-radius: 4px;
    border: 1px solid #ddd;
  }

  .status {
    font-size: 12px;
    color: #555;
    margin-top: 5px;
  }

  .file-input {
    border: 1px solid #ccc;
    padding: 5px;
    border-radius: 4px;
    cursor: pointer;
  }
</style>
