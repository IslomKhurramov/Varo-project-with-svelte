<script>
  import Modal from "../../shared/Modal.svelte";
  import ModalEditItem from "./ModalEditItem.svelte";

  let showModal = false;
  let dataTable1 = [];
  for (let i = 1; i <= 10; i++) {
    dataTable1.push({
      number: i.toString(),
      projectNO: `Final Test Project`,
      assetName: "21년 기반시설 점검 가이드라인",
      cassification: "2024-07-07 12:07:07",
      logContent: "결과미확점",
      performer: "SECURITY(90.78)",
    });
  }

  let tableData = [];
  for (let i = 1; i <= 15; i++) {
    tableData.push({
      number: i.toString(),
      name: "UNIX",
      second: "계정관리",
      third: "U-01",
      fourth: "root 계정 원격접속 제한",
      fifth: "상",
      checklist: {
        vulnerability:
          "기본 패스워드를 변경하지 않거나 패스워드를 설정하지 않은 경우",
        good: "기본 패스워드를 변경한 경우",
      },
    });
  }
</script>

<main>
  <div class="header_buttons">
    <button>UNIX</button>
    <button>PC</button>
    <button>NETWORK</button>
    <button>CLOUD</button>
  </div>
  <div class="table1">
    <table>
      <tr>
        <th>넘버</th>
        <th>점검항목이름</th>
        <th>분류</th>
        <th>지원대상</th>
        <th>등록일</th>
        <th>삭제</th>
      </tr>
      {#each dataTable1 as data}
        <tr>
          <td>{data.number}</td>
          <td>{data.projectNO}</td>
          <td>{data.assetName}</td>
          <td>{data.cassification}</td>
          <td>{data.logContent}</td>
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <td on:click|stopPropagation
            ><button class="delete_button">삭제</button></td
          >
        </tr>
      {/each}
    </table>
  </div>

  <div class="table2">
    <table class="table">
      <thead>
        <tr>
          <th>남버</th>
          <th>점검대상</th>
          <th>항목그룹</th>
          <th>식별코드</th>
          <th>점검항목</th>
          <th>위험도</th>
          <th>평가기준</th>
        </tr>
      </thead>
      <tbody>
        {#each tableData as row}
          <tr on:click="{() => (showModal = true)}">
            <td>{row.number}</td>
            <td>{row.name}</td>
            <td>{row.second}</td>
            <td>{row.third}</td>
            <td>{row.fourth}</td>
            <td>{row.fifth}</td>
            <td>
              <div class="checklist">
                {#if row.checklist && row.checklist.vulnerability}
                  <p>취약: {row.checklist.vulnerability}</p>
                {:else}
                  <p>취약: 데이터 없음</p>
                {/if}
                {#if row.checklist && row.checklist.good}
                  <p>양호: {row.checklist.good}</p>
                {:else}
                  <p>양호: 데이터 없음</p>
                {/if}
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <Modal bind:showModal>
    <ModalEditItem />
  </Modal>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    background-color: #f7f9fb;
    padding: 10px;
    margin-bottom: 40px;
    font-family: "Arial", sans-serif;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin-top: 10px;
  }
  .header_buttons {
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    margin: 20px 0;
  }

  .header_buttons button {
    background-color: #007acc;
    color: #ffffff;
    border-radius: 5px;
    height: 36px;
    width: 130px;
    font-weight: bold;
    font-size: 14px;
    cursor: pointer;
    border: none;
    transition:
      background-color 0.3s ease,
      transform 0.3s ease;
  }

  .header_buttons button:hover {
    background-color: #2980b9;
    transform: translateY(-2px);
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }
  .table1,
  .table2 {
    font-family: "Arial", sans-serif;
    border-collapse: collapse;
    width: 100%;
    font-size: 12px;
    color: #333;
    overflow-y: auto;
    overflow-x: hidden;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: #f7f9fb;
  }

  .table1 {
    height: 300px;
  }

  .table2 {
    height: 450px;
    margin-top: 40px;
    margin-bottom: 20px;
  }

  table {
    font-family: "Arial", sans-serif;
    border-collapse: collapse;
    width: 100%;
    font-size: 12px;
  }

  th,
  td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: left;
    vertical-align: middle;
  }

  th {
    background-color: #005fa3;
    color: #ffffff;
    position: sticky;
    top: 0;
    z-index: 1;
    font-size: 14px;
  }

  tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  tr:hover {
    background-color: #e0f7fa;
  }

  tr {
    cursor: pointer;
  }

  .checklist p {
    margin: 5px 0;
  }

  .delete_button {
    background-color: #e74c3c;
    color: #ffffff;
    padding: 8px 12px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition:
      background-color 0.3s ease,
      transform 0.3s ease;
  }

  .delete_button:hover {
    background-color: #c0392b;
    transform: translateY(-2px);
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }
</style>
