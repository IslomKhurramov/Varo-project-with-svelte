<script>
  import { getPlanLists } from "../../../services/page1/newInspection";

  export let performanceLog = [];

  for (let i = 1; i <= 100; i++) {
    performanceLog.push({
      number: i.toString(),
      projectNO: `프로젝트${i}`,
      assetName: "AAAAAA",
      cassification: "ERROR-099",
      logContent: "실행과정에서 에러발생 : SDFSDFSDFSDFSDFSDF",
      performer: "길동이",
      date: "2024-12-11 11:21:12",
      note: "",
    });
  }

  let projects;

  const initialData = async () => {
    projects = await getPlanLists();
  };

  $: {
    initialData();
  }
</script>

<main>
  <div class="firstLine">
    <div class="dropdown-group">
      <div class="dropdown-container">
        <label for="project">프로젝트:</label>
        <select id="project">
          <option value="" selected disabled>선택</option>
          {#if projects}
            {#each projects as plan}
              <option value={plan.ccp_index}>{plan.ccp_title}</option>
            {/each}
          {/if}
        </select>
      </div>
      <div class="dropdown-container">
        <label for="target">수행자:</label>
        <select id="target">
          <option value="" selected disabled>선택</option>
        </select>
      </div>
      <div class="dropdown-container">
        <label for="target">날짜:</label>
        <div>
          <input type="date" />
          <input type="date" />
        </div>
      </div>
      <button class="firstlineButton">검색</button>
    </div>
    <div class="button-group">
      <button class="firstlineButton">엑셀저장</button>
    </div>
  </div>
  <table>
    <thead>
      <tr class="first_line">
        <th>순번</th>
        <th>프로젝트NO</th>
        <th>자산명</th>
        <th>분류코드</th>
        <th>로그내용</th>
        <th>수행자</th>
        <th>날짜</th>
        <th>비고</th>
      </tr>
    </thead>
    <tbody>
      {#each performanceLog as asset}
        <tr>
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
    </tbody>
  </table>
</main>

<style>
  main {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    margin-bottom: 40px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border: 1px solid #ccc;
    overflow-y: auto;
    height: 600px;
    background-color: #f9f9f9;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-family: "Arial", sans-serif;
    font-size: 12px;
    background-color: #ffffff;
  }

  th,
  td {
    padding: 12px 15px;
    text-align: left;
    vertical-align: middle;
  }

  th {
    background-color: #005fa3;
    color: #ffffff;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 12px;
    position: sticky;
    top: 0;
    z-index: 1;
  }

  tr:nth-child(even) {
    background-color: #f4f4f4;
  }

  tr:hover {
    background-color: #e6f7ff;
    cursor: pointer;
  }

  tr td {
    border-bottom: 1px solid #dddddd;
  }

  thead th {
    border-bottom: 2px solid #dddddd;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  .firstLine {
    width: 100%;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    box-sizing: border-box;
  }

  .dropdown-group {
    display: flex;
    gap: 40px;
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
    font-size: 16px;
  }

  .firstlineButton {
    background-color: #0056b3;
    color: #ffffff;
    border: none;
    border-radius: 5px;
    padding: 8px 12px;
    font-size: 12px;
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
</style>
