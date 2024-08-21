<script>
  let assetData = [];

  let selected = [];
  $: allSelected = assetData.length === selected.length;

  for (let i = 0; i <= 15; i++) {
    assetData.push({
      secureScore: "90",
      assetGroup: "(자산그룹1)",
      assetData: "2024/07/22 13:11:22",
      operatingSystem: "윈도우 서버 2022",
      assetName: "ABCDEFSDFSDFEWFSDF",
      ipAdress: "192.168.0.01",
      inspectionTarget: "UNIX, DBMS, WEB",
      agentInstallation: "설치됨",
    });
  }

  function toggleAll() {
    if (allSelected) {
      selected = [];
    } else {
      selected = [...assetData];
    }
    // selected = allSelected ? [] : [...assetData]; // short version
  }
</script>

<main>
  <header class="header">
    <div class="header_option">
      <button>down</button>
      <form action="/action_page.php" class="form_select">
        <select name="cars" id="cars">
          <option value="등록승인여부"> 등록승인여부 </option>
        </select>
        <select name="cars" id="자산그룹명">
          <option value="volvo">자산그룹명</option>
        </select>
        <select name="cars" id="운영체제">
          <option value="volvo">운영체제</option>
        </select>
        <select name="cars" id="에이전트여부">
          <option value="volvo">에이전트여부</option>
        </select>
      </form>
    </div>
    <div class="header_button">
      <p>자산명</p>
      <p>엑셀다운로드</p>
    </div>
  </header>
  <div class="second_line">
    <button>자산상세검색</button>
    <button>정보수집</button>
  </div>
  <div class="second_line">
    <button>자산그룹별등록추세</button>
    <button>요약보고서출력</button>
    <button>상세보고서출력</button>
    <button>목록엑셀저장</button>
  </div>

  <div>
    <div class="allselect">
      <input type="checkbox" on:click="{toggleAll}" checked="{allSelected}" />
      <strong class="selectButton">전체선택</strong>
    </div>
    <div class="card_container">
      {#each assetData as asset}
        <div class="card">
          <input
            type="checkbox"
            class="checkbox"
            bind:group="{selected}"
            name="{asset}"
            value="{asset}"
          />

          <div class="card_buttons">
            <button class="blue"></button>
            <button class="red"></button>
            <button class="yellow"></button>
          </div>
          <button class="modal_button">등록 미승인 </button>
          <div class="first_col">
            <div class="first_col_1">
              <p>보안점수</p>
              <div class="box_number">{asset.secureScore}%</div>
              <p>
                <span style="font-weight: bold;">
                  {asset.assetGroup}
                </span>
              </p>
            </div>
            <div class="first_col_2">
              <p>연결중</p>
              <div>
                <span style="font-weight: bold;"> {asset.assetData}</span>
              </div>
            </div>
          </div>
          <div class="second_col">
            <p>
              운영체제 :<span style="font-weight: bold;">
                {asset.operatingSystem}
              </span>
            </p>
            <p>
              자산명 :<span style="font-weight: bold;">
                {asset.assetName}
              </span>
            </p>
            <p>
              아이피주소 :<span style="font-weight: bold;">
                {asset.ipAdress}
              </span>
            </p>
            <p>
              점검대상 :<span style="font-weight: bold;">
                {asset.inspectionTarget}
              </span>
            </p>
            <p>
              에이전트설치여부 :<span style="font-weight: bold;">
                {asset.agentInstallation}
              </span>
            </p>
          </div>
        </div>
      {/each}
    </div>
  </div>
</main>

<style>
  main {
    width: 100%;
  }
  .header {
    display: flex;
    width: 100%;
    flex-direction: row;
    margin-left: 5px;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;
    font-weight: bold;
  }
  .form_select {
    max-width: 900px;
    display: flex;
    flex-direction: row;
    gap: 20px;
    margin-left: 40px;
  }
  .form_select option {
    font-weight: bold;
    cursor: pointer;
  }
  .header_option {
    display: flex;
    flex-direction: row;
  }
  .header_option button {
    cursor: pointer;
    background-color: #003366; /* Darker Blue */
    color: #ffffff;
    border: 1px solid #003366;
  }
  .header_option button:hover {
    box-shadow: 0.5px 1px 0.5px 1px #161515;
  }
  .header_button {
    display: flex;
    flex-direction: row;
    width: 30%;
    gap: 40px;
  }
  .header_button p {
    font-size: 14px;
    cursor: pointer;
  }
  .header_button p:hover {
    text-decoration: underline;
    color: #003366;
  }
  .second_line {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    gap: 20px;
    margin-top: 5px;
  }
  .second_line button {
    background-color: #003366; /* Darker Blue */
    color: #ffffff;
    border: 1px solid #003366;
    border-radius: 5px;
    height: 40px;

    width: 150px;
    cursor: pointer;
  }
  .second_line button:hover {
    box-shadow: 0.5px 1px 0.5px 1px #161515;
  }
  .first_col {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .first_col_1,
  .first_col_2 {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .first_col_1 p {
    padding-top: 0;
    margin-top: 0;
    padding-bottom: 0px;
    margin-bottom: 0px;
  }
  .first_col_2 p {
    margin-bottom: 0;
    padding-bottom: 0;
  }
  .card_container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 10px;
    row-gap: 30px;
    margin-top: 10px;
    border: 1px solid #161515;
    margin-left: 20px;
    padding: 20px;
    overflow-y: auto;
    height: 500px;
  }
  .card {
    background-color: #e4e4e4;
    max-width: 400px;
    height: 190px;
    font-size: 12px;
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 10px;

    box-shadow: inset rgb(0, 0, 0) 0px 0px 20px -8px;
    border: 1px solid black;
  }
  .checkbox {
    position: absolute;
    top: 0;
    left: 0;
    cursor: pointer;
  }
  .box_number {
    background-color: #ffc267;
    width: 70px;
    height: 50px;
    align-content: center;
    text-align: center;
    font-weight: 400;
    font-size: 18px;
    border: 1px solid black;
  }
  .card_buttons {
    position: absolute;
    top: -12px;
    right: 0;
  }
  .card_buttons button {
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }
  .blue {
    background-color: blue;
    border: 1px solid black;
    cursor: pointer;
  }
  .red {
    background-color: red;
    border: 1px solid black;
    cursor: pointer;
  }
  .yellow {
    background-color: yellow;
    border: 1px solid black;
    cursor: pointer;
  }
  .selectButton {
    color: #000000;
    margin-top: 13.5px;
    cursor: pointer;
  }

  .modal_button {
    position: absolute;
    bottom: -6px;
    right: 0px;
    border: 1px solid black;
    width: 50px;
    background-color: #f49f20;
    color: #fff;
  }
  .allselect {
    margin-left: 20px;
  }
  .allselect input {
    cursor: pointer;
  }
</style>
