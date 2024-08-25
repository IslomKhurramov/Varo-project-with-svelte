<script>
  let performanceLog = [];
  let usage = [
    "윈도우에이전트",
    "리눅스에이전트",
    "수동점검프로그램",
    "수동점검 스크립트",
    "네트워크장비정보수집 프로그램",
    "매뉴얼",
    "가이드라인",
  ];

  for (let i = 0; i <= usage.length; i++) {
    performanceLog.push({
      number: (i + 1).toString(),
      usage: usage[i],
      version: "AAAAAA",
      fileName: "ERROR-099",
    });
  }
</script>

<main>
  <div class="table_container">
    <table>
      <tr class="first_line">
        <th>순번</th>
        <th>용도</th>
        <th>버전</th>
        <th>파일명</th>
        <th>다운로드</th>
      </tr>
      {#each performanceLog as asset}
        <tr>
          <td>{asset.number}</td>
          <td>{asset.usage}</td>
          <td>{asset.version}</td>
          <td>{asset.fileName}</td>
          <td></td>
        </tr>
      {/each}
    </table>
  </div>
</main>

<style>
  main {
    width: 100%;
    display: flex;
    justify-content: center;
    height: 600px;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .table_container {
    display: flex;
    justify-content: center;
    width: 94%;
    margin: 0;
    overflow-y: auto;
    overflow-x: hidden;
    height: 400px;

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
