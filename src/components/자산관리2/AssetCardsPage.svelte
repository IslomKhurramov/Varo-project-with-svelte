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
  <div>
    <div class="allselect">
      <div class="allSelectDiv">
        <input type="checkbox" on:click="{toggleAll}" checked="{allSelected}" />
        <strong class="selectButton">전체선택</strong>
      </div>
      <div class="color_group">
        <div class="colors">
          <div class="blue_button"></div>
          <span>편집</span>
        </div>
        <div class="colors">
          <div class="red_button"></div>
          <span>삭제</span>
        </div>
        <div class="colors">
          <div class="yellow_button"></div>
          <span>이전(다른그룹으로) </span>
        </div>
      </div>
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
  .color_group {
    display: flex;
    flex-direction: column;
    font-size: 12px;
    font-weight: 700;
    width: 140px;
    gap: 5px;
    background-color: #fff;
    border-radius: 10px;
    padding: 5px;
  }
  .colors {
    display: flex;
    flex-direction: row;
  }
  .blue_button {
    background-color: blue;
    width: 10px;
    height: 10px;
    border: 1px solid black;
  }
  .red_button {
    background-color: red;
    width: 10px;
    height: 10px;
    border: 1px solid black;
  }
  .yellow_button {
    background-color: yellow;
    width: 10px;
    height: 10px;
    border: 1px solid black;
  }
  main {
    width: 100%;
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
    border: 1px solid #000000;
    box-shadow: 0 4px 8px rgb(255, 255, 255);
    margin-left: 20px;
    padding: 20px;
    overflow-y: auto;
    height: 500px;
    background: #fff;
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
    display: flex;
    justify-content: space-between;
  }
  .allselect input {
    cursor: pointer;
  }
  .allselect div input {
    margin-bottom: 0px;
    padding-bottom: 0px;
  }
</style>
