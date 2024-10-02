<script>
  export let projectData = [];

  for (let i = 1; i <= 15; i++) {
    projectData.push({
      number: i.toString(),
      projectNO: `aaaaaaa`,
      assetName: "UNIX",
      cassification: "계정관리",
      logContent: "Setuid설정",
      performer: "상",
      date: "조치전",
      note: "조치계획등록",
      operationDepartment: "홍길동",
      operationoffiecer: "02-102-0922",
      acknowledge: "",
    });
  }
</script>

<main>
  <div class="second_line">
    <button>조치계획</button>
    <button>조치결과 </button>
  </div>

  <div class="main_container">
    <table>
      <tr class="first_line">
        <th>순번</th>
        <th>자산명</th>
        <th>점검대상</th>
        <th>대분류</th>
        <th>취약점명</th>
        <th>위험도</th>
        <th>조치현황</th>
        <th>조치분류상태 </th>
        <th>운영부서</th>
        <th>운영담당자 </th>
        <th>승인 </th>
      </tr>
      {#each projectData as asset}
        <tr>
          <td>{asset.number}</td>
          <td>{asset.projectNO}</td>
          <td>{asset.assetName}</td>
          <td>{asset.cassification}</td>
          <td>{asset.logContent}</td>
          <td>{asset.performer}</td>
          <td>{asset.date}</td>
          <td>{asset.note}</td>
          <td>{asset.operationDepartment}</td>
          <td>{asset.operationoffiecer}</td>
          <td
            ><select name="" id="" class="select_input">
              <option value="승인">승인</option>
              <option value="반려">반려</option>
              <option value="승인">재검토</option>
            </select></td
          >
        </tr>
      {/each}
    </table>
  </div>
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
  }
  .main_container {
    width: 100%;
    display: flex;
    flex-direction: column;
    height: 600px;
    overflow-y: auto;
    border-radius: 12px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    border: 1px solid #ddd;
    background-color: #fff;
  }

  table {
    font-family: "Arial", sans-serif;
    border-collapse: collapse;
    width: 100%;
    font-size: 14px;
    color: #333;
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
    position: sticky;
    top: 0;
    z-index: 1;
    text-transform: uppercase;
    font-size: 13px;
  }

  td {
    border-bottom: 1px solid #ddd;
    font-size: 13px;
  }

  tr:nth-child(even) {
    background-color: #f5f5f5;
  }

  tr:hover {
    background-color: #e9f3ff;
  }

  .second_line {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    gap: 10px;
    margin: 20px 0;
    padding-left: 20px;
  }

  .second_line button {
    background-color: #0056b3;
    color: #ffffff;
    border-radius: 5px;
    height: 36px;
    width: 130px;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    transition:
      background-color 0.3s ease,
      transform 0.3s ease,
      box-shadow 0.3s ease;
  }

  .second_line button:hover {
    background-color: #005fa3;
    transform: translateY(-2px);
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }

  .select_input {
    padding: 8px 10px;
    color: #333;
    background-color: #f9f9f9;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 13px;
    cursor: pointer;
    transition:
      background-color 0.3s ease,
      border-color 0.3s ease;
  }

  .select_input:hover {
    background-color: #e0e0e0;
    border-color: #bbb;
  }

  .select_input:focus {
    outline: none;
    border-color: #0068d7;
    box-shadow: 0 0 4px rgba(0, 104, 215, 0.5);
  }
</style>
