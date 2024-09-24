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

  for (let i = 0; i < usage.length; i++) {
    performanceLog.push({
      number: (i + 1).toString(),
      usage: usage[i],
      version: "1.0.0", // Updated version number
      fileName: `file_${i + 1}.zip`,
    });
  }
</script>

<main>
  <div class="table_container">
    <table>
      <thead>
        <tr class="first_line">
          <th>순번</th>
          <th>용도</th>
          <th>버전</th>
          <th>파일명</th>
          <th>다운로드</th>
        </tr>
      </thead>
      <tbody>
        {#each performanceLog as asset}
          <tr>
            <td>{asset.number}</td>
            <td>{asset.usage}</td>
            <td>{asset.version}</td>
            <td>{asset.fileName}</td>
            <td>
              <button class="download_button">Download</button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</main>

<style>
  main {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .table_container {
    display: flex;
    justify-content: center;
    width: 100%;
    margin: 20px 0;
    background: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    border: 1px solid #ccc;
    overflow-y: auto;
    height: 600px;
    overflow-y: auto;
    overflow-x: hidden;
  }

  table {
    font-family: "Arial", sans-serif;
    border-collapse: collapse;
    width: 100%;
    font-size: 12px;
    background-color: #ffffff;
  }

  th,
  td {
    border: 1px solid #dddddd;
    padding: 12px 15px;
    text-align: left;
    vertical-align: middle;
  }

  th {
    background-color: #005fa3;
    color: #ffffff;
    font-weight: bold;
    text-transform: uppercase;
    position: sticky;
    top: 0;
    z-index: 1;
  }

  tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  tr:hover {
    background-color: #e6f7ff;
    cursor: pointer;
  }

  .download_button {
    background-color: #28a745;
    color: #ffffff;
    border: none;
    border-radius: 5px;
    padding: 5px 10px;
    font-size: 12px;
    cursor: pointer;
    transition:
      background-color 0.3s ease,
      transform 0.3s ease;
  }

  .download_button:hover {
    background-color: #218838;
    transform: translateY(-2px);
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  }
</style>
