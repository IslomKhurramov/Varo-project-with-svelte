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
</script>

<main>
  <div class="button_container">
    <button>자산그룹이동 </button>
    <button>정보수정</button>
    <button>등록승인 / 등록해제 </button>
    <button>자산삭제</button>
  </div>
  <div class="table_container">
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
  <div class="input_container">
    <div class="input"><input type="text" /></div>
    <div class="input_buttons">
      <button style="background: #007bff;">수정하기</button>
      <button style="background: #dc3545;">비활성하기</button>
      <button style="background: #28a745;">활성하기</button>
    </div>
  </div>
</main>

<style>
  main {
    margin-left: 10px;
    margin-right: -25px;
  }
  .button_container {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    gap: 10px;
    margin-bottom: 15px;
  }

  .button_container button {
    background-color: #003366; /* Darker Blue */
    color: #ffffff;
    width: 130px;
    height: 35px;
    cursor: pointer;
    border: none;
    border-radius: 5px;
    transition:
      background-color 0.3s ease,
      transform 0.3s ease;
  }

  .button_container button:hover {
    background-color: #002244;
    transform: translateY(-2px);
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }

  .table_container {
    display: flex;
    justify-content: center;
    width: 100%;
    margin: 0 auto;
    overflow-y: auto;
    overflow-x: hidden;
    height: 300px;
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

  .input_container {
    display: flex;
    flex-direction: column;
    width: 96%;
    margin: 20px auto;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid #dddddd;
  }

  .input_buttons {
    display: flex;
    flex-direction: row;
    gap: 10px;
    margin-top: 10px;
  }

  .input_buttons button {
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

  .input_buttons button:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }

  .input {
    margin-bottom: 10px;
  }

  .input input {
    width: 100%;
    height: 45px;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #cccccc;
    font-size: 14px;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: border-color 0.3s ease;
  }

  .input input:focus {
    border-color: #007bff;
    outline: none;
  }
</style>
