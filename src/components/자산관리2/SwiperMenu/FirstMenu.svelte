<script>
  let currentData = null;
  let activeData = null;

  const selectData = (page, menu) => {
    currentData = page;
    activeData = menu;
  };

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

  const pageData = [
    {
      data1: "This is data for Second Menu",
      data2: "This is data for Third Menu",
      data3: "This is data for Fourth Menu",
      data4: "This is data for Second Menu",
      data5: "This is data for Third Menu",
      data6: "This is data for Fourth Menu",
      data7: "This is data for Second Menu",
    },
  ];
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
  <div>
    <div class="header">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <h3
        on:click="{() => selectData(pageData[0].data1, '운영체제정보')}"
        class="{activeData === '운영체제정보' ? 'active' : ''}"
      >
        운영체제정보
      </h3>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <h3
        on:click="{() => selectData(pageData[0].data2, '  설치된')}"
        class="{activeData === '  설치된' ? 'active' : ''}"
      >
        설치된 프로그램 목록
      </h3>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <h3
        on:click="{() => selectData(pageData[0].data3, '프로세스목록')}"
        class="{activeData === '프로세스목록' ? 'active' : ''}"
      >
        프로세스목록
      </h3>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <h3
        on:click="{() => selectData(pageData[0].data4, '네트워크')}"
        class="{activeData === '네트워크' ? 'active' : ''}"
      >
        네트워크 정보
      </h3>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <h3
        on:click="{() => selectData(pageData[0].data5, 'DLL')}"
        class="{activeData === 'DLL' ? 'active' : ''}"
      >
        DLL 정보
      </h3>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <h3
        on:click="{() => selectData(pageData[0].data6, '파일해시')}"
        class="{activeData === '파일해시' ? 'active' : ''}"
      >
        파일해시
      </h3>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <h3
        on:click="{() => selectData(pageData[0].data7, '패치내역')}"
        class="{activeData === '패치내역' ? 'active' : ''}"
      >
        패치내역/대상
      </h3>
    </div>
    {#if currentData}
      <div class="last_container">
        <p>{currentData}</p>
      </div>
    {/if}
  </div>
</main>

<style>
  main {
    margin-left: 10px;
    margin-right: -25px;
  }
  .button_container {
    width: 96%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    gap: 10px;
    margin-bottom: 15px;
    margin-right: 25px;
  }

  .button_container button {
    background-color: #003366; /* Darker Blue */
    color: #ffffff;

    width: 130px;
    height: 30px;
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
    width: 94%;
    margin: 0;
    overflow-y: auto;
    overflow-x: hidden;
    height: 300px;

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
    background-color: #0068d7; /* Header background color */
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
    width: 90%;
    margin: 20px;
    padding: 25px;
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
    height: 30px;
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

  .header {
    display: flex;
    flex-direction: row;
    gap: 50px;
    padding-left: 40px;
    width: 100%;
    color: #000000;
  }

  .header h3 {
    color: black;
    font-weight: bold;
    font-size: 12px;
    cursor: pointer;
  }
  .header h3 {
    background-image: linear-gradient(to right, #5486d6, #54b3d6 50%, #000 50%);
    background-size: 200% 100%;
    background-position: -100%;
    display: inline-block;
    padding: 5px 0;
    position: relative;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    transition: all 0.3s ease-in-out;
  }

  .header h3:before {
    content: "";
    background: #54b3d6;
    display: block;
    position: absolute;
    bottom: -3px;
    left: 0;
    width: 0;
    height: 3px;
    transition: all 0.3s ease-in-out;
  }

  .header h3:hover {
    background-position: 0;
  }

  .header h3:hover::before {
    width: 100%;
  }
  .header h3.active {
    color: #3183a0; /* Ensures active text color is visible */
    -webkit-text-fill-color: #3183a0; /* Override webkit text fill */
    background-image: none; /* Remove the gradient on active */
    text-decoration: underline;
  }
  .last_container {
    width: 100%;
    height: auto;
    background: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid #000000;
    margin-bottom: 40px;
    width: 90%;
    margin: 20px;
    padding: 25px;
  }
</style>
