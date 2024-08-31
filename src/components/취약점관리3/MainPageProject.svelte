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

<div class="second_line">
  <!-- svelte-ignore missing-declaration -->
  <button>CCE</button>
  <!-- svelte-ignore missing-declaration -->
  <button>CVE/CPE </button>
  <button>보안감사 </button>
</div>

<div class="main_container">
  <main>
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
  </main>
</div>

<style>
  .main_container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  main {
    width: 80%;
    display: flex;

    flex-direction: column;
    height: 600px;
    overflow-y: auto;
    overflow-x: hidden;
    margin-top: 40px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid #000000;
    margin-left: 20px;
    margin-bottom: 40px;
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

  /* Second Line Styles */
  .second_line {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    gap: 10px;
    margin-top: 10px;
    margin-right: 10px;
    margin-bottom: 10px;
    margin-left: 20px;
  }

  .second_line button {
    background-color: #003366;
    color: #ffffff;
    border-radius: 5px;
    height: 30px;
    width: 120px;
    cursor: pointer;
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
  }

  .second_line button:hover {
    background-color: #005fa3;
    transform: translateY(-2px);
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }
  .select_input {
    color: #000000;
    border: none;
    border-radius: 5px;
    font-size: 12px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    border: 1px solid black;
  }

  .select_input:hover {
    background-color: #b0b0b0;
  }

  .select_input:focus {
    outline: none;
    box-shadow: 0 0 0 2px #007acc;
  }
</style>
