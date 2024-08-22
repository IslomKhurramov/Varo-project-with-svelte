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
  table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
    margin-left: 20px;
    margin-top: 40px;
  }
  .first_line {
    background-color: #0d47a1;
    color: #fff;
  }
  td,
  th {
    border: 1px solid #94b8ff;
    text-align: left;
    padding: 8px;
  }
  td {
    font-size: 12px;
  }
  tr {
    background-color: #fff;
  }
  tr:nth-child(even) {
    background-color: #dddddd;
  }
</style>
