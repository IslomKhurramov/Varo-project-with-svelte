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
    margin-top: 40px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid #000000;
    margin-left: 20px;
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
