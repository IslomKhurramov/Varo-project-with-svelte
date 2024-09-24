<script>
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
</script>

<main>
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
    justify-content: center;

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
</style>
