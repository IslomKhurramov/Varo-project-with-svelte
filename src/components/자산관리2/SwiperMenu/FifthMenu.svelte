<script>
  let data = [];
  for (let i = 1; i <= 100; i++) {
    data.push({
      number: "길동이",
      projectNO: `프로젝트${i}`,
      assetName: "AAAAAA",
      cassification: "ERROR-099",
      logContent: "실행과정",
      performer: "길동이",
      date: "2024-12-11 ",
      note: "길동이",
      logContent: "실행과정에서 ",
      performer: "길동이",
      date: "2024-12-11 ",
      note: "길동이",
    });
  }

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

<main>
  <div class="header">
    <p>[자산상세정보]</p>
    <button class="download"> Excel다운로드 </button>
  </div>
  <div class="table_container" style="margin-top: 0px;">
    <table>
      <tr>
        <th>분류그룹</th>
        <th>INFRA</th>
        <th>자산코드</th>
        <th>SW-001</th>
        <th>용도</th>
        <th>L2스위치</th>
        <th>자산모델</th>
        <th>C9200CX-12P-2X2G</th>
        <th>점검대상</th>
        <th>NETWORK</th>
        <th>호스트명</th>
        <th>User_L2_51</th>
      </tr>
      {#each data as asset}
        <tr>
          <td>{asset.number}</td>
          <td>{asset.projectNO}</td>
          <td>{asset.assetName}</td>
          <td>{asset.cassification}</td>
          <td>{asset.number}</td>
          <td>{asset.projectNO}</td>
          <td>{asset.assetName}</td>
          <td>{asset.cassification}</td>
          <td>{asset.logContent}</td>
          <td>{asset.performer}</td>
          <td>{asset.date}</td>
          <td>{asset.note}</td>
        </tr>
      {/each}
    </table>
  </div>
  <div class="table_container">
    <table>
      <tr>
        <th>넘버</th>
        <th>프로젝트명</th>
        <th>점검항목</th>
        <th>생성일</th>
        <th>프로젝트보안수준</th>
        <th>점검대상 / 자산보안수준</th>
      </tr>
      {#each dataTable1 as data}
        <tr>
          <td>{data.number}</td>
          <td>{data.projectNO}</td>
          <td>{data.assetName}</td>
          <td>{data.cassification}</td>
          <td>{data.logContent}</td>
          <td>{data.performer}</td>
        </tr>
      {/each}
    </table>
  </div>
  <div class="table_container">
    <table>
      <tr>
        <th>남버</th>
        <th>호스트명</th>
        <th>항목</th>
        <th>점검항목</th>
        <th>시스템상태</th>
        <th>점검결과</th>
      </tr>
      {#each hostInfo as host}
        <tr>
          <td>{host.number}</td>
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <td style="cursor: pointer;" on:click="{() => (showModal = true)}"
            >{host.name}</td
          >
          <td>{host.item}</td>
          <td>
            <div style="display: flex; flex-direction:column">
              {#if host.checklist && host.checklist.vulnerability}
                <p>취약: {host.checklist.vulnerability}</p>
              {:else}
                <p>취약: 데이터 없음</p>
              {/if}
              {#if host.checklist && host.checklist.good}
                <p>양호: {host.checklist.good}</p>
              {:else}
                <p>양호: 데이터 없음</p>
              {/if}
            </div>
          </td>
          <td>{host.system}</td>
          <td>{host.instectionResult}</td>
        </tr>
      {/each}
    </table>
  </div>
</main>

<style>
  main {
    margin-left: 10px;
    margin-right: -25px;
  }
  .header {
    display: flex;
    flex-direction: row;
    width: 94%;
    justify-content: space-between;
    color: #ffffff;
    margin-left: 20px;
    height: 41px;
  }

  .download {
    background-color: #007bff; /* Primary button color */
    color: #ffffff;
    width: 100px;
    height: 35px;
    cursor: pointer;
    border: none;
    border-radius: 5px;
    transition:
      background-color 0.3s ease,
      transform 0.3s ease;
  }
  .download:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }
  .table_container {
    display: flex;
    justify-content: center;
    width: 94%;
    margin: 0;
    overflow-y: auto;
    overflow-x: hidden;
    height: 300px;

    margin: 20px;
    background: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid #000000;
  }

  table {
    font-family: "Arial", sans-serif;
    border-collapse: collapse;
    width: 100%;
    background: #ffffff;
    font-size: 12px;
  }

  th,
  td {
    border: 1px solid #000000;
    padding: 12px 15px; /* Increased padding for better spacing */
    text-align: left;
    vertical-align: middle; /* Ensure content is vertically centered */
  }

  th {
    background-color: #003366; /* Header background color */
    color: #ffffff; /* Header text color */
    position: sticky;
    top: 0;
    z-index: 1;
    text-transform: uppercase; /* Uppercase text for header */
    font-size: 12px;
  }

  tr:nth-child(even) {
    background-color: #f9f9f9; /* Slightly lighter shade for even rows */
  }

  tr:hover {
    background-color: #e0f7fa; /* Soft hover effect */
  }
</style>
