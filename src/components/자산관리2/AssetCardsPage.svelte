<script>
  import Modal from "../../shared/Modal.svelte";
  import ModalCard from "./ModalCard.svelte";

  let showModal = false;
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
    selected = allSelected ? [] : [...assetData];
  }
</script>

<main>
  <div class="container">
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
          <span>이전(다른그룹으로)</span>
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
          <button class="modal_button" on:click="{() => (showModal = true)}"
            >등록 미승인</button
          >
          <div class="first_col">
            <div class="first_col_1">
              <p>보안점수</p>
              <div
                class="box_number {asset.secureScore < 50
                  ? 'low'
                  : asset.secureScore < 80
                    ? 'medium'
                    : 'high'}"
              >
                {asset.secureScore}%
              </div>

              <p>
                <span style="font-weight: bold;">
                  {asset.assetGroup}
                </span>
              </p>
            </div>
            <div class="first_col_2">
              <p>연결중</p>
              <div>
                <span style="font-weight: bold;">{asset.assetData}</span>
              </div>
            </div>
          </div>
          <div class="second_col">
            <p>
              운영체제: <span style="font-weight: bold;">
                {asset.operatingSystem}
              </span>
            </p>
            <p>
              자산명: <span style="font-weight: bold;">
                {asset.assetName}
              </span>
            </p>
            <p>
              아이피주소: <span style="font-weight: bold;">
                {asset.ipAdress}
              </span>
            </p>
            <p>
              점검대상: <span style="font-weight: bold;">
                {asset.inspectionTarget}
              </span>
            </p>
            <p>
              에이전트설치여부: <span style="font-weight: bold;">
                {asset.agentInstallation}
              </span>
            </p>
          </div>
        </div>
      {/each}
    </div>
  </div>
  <Modal bind:showModal>
    <ModalCard />
  </Modal>
</main>

<style>
  /* Main container for the card layout */
  .container {
    max-width: 100%;
    margin: 20px auto;
    padding: 20px;
    background-color: #f7f9fb;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }

  /* Header section for select and action buttons */
  .allselect {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  .allSelectDiv {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .selectButton {
    cursor: pointer;
    color: #333;
    font-weight: 600;
  }

  /* Action buttons section */
  .color_group {
    display: flex;
    align-items: center;
    gap: 20px;
    font-size: 12px;
  }

  .colors {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .blue_button,
  .red_button,
  .yellow_button {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 1px solid #ccc;
  }

  .blue_button {
    background-color: #6c757d;
  }

  .red_button {
    background-color: #dc3545;
  }

  .yellow_button {
    background-color: #ffc107;
  }

  /* Card container for the assets */
  .card_container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 15px;
    max-height: 600px;
    overflow-y: auto;
    padding: 10px;
    background-color: #ffffff;
    border-radius: 8px;
    border: 1px solid #ced4da;
  }

  /* Individual card styling */
  .card {
    position: relative;
    background: #f8f9fa;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    box-shadow:
      rgba(0, 0, 0, 0.4) 0px 2px 4px,
      rgba(0, 0, 0, 0.3) 0px 7px 13px -3px,
      rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
    padding: 20px;
    color: #222121; /* White text for contrast */
    font-size: 12px; /* Set font size to 12px */
    margin-bottom: 20px;
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
  }

  .card:hover {
    transform: translateY(-5px); /* Slight lift on hover */
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1); /* Stronger shadow on hover */
  }

  .first_col_1 p {
    margin: 0px;
  }
  .card:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }

  /* Checkbox in each card */
  .checkbox {
    position: absolute;
    top: 10px;
    left: 10px;
    cursor: pointer;
    transform: scale(1.2);
  }

  /* Security score box styling */
  .box_number {
    font-size: 12px;
    font-weight: bold;
    padding: 10px;
    border-radius: 8px;
    color: #fff; /* White text for contrast */
    text-align: center;
    width: 50px;
  }

  /* Low security score */
  .box_number.low {
    background-color: #dc3545; /* Red for low score */
  }

  /* Medium security score */
  .box_number.medium {
    background-color: #ffc107; /* Yellow for medium score */
  }

  /* High security score */
  .box_number.high {
    background-color: #28a745; /* Green for high score */
  }

  /* Action buttons within each card */
  .card_buttons {
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    gap: 5px;
  }

  .card_buttons button {
    width: 16px;
    font-size: 12px;
    height: 16px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
  }

  .blue {
    background-color: #6c757d;
  }

  .red {
    background-color: #dc3545;
  }

  .yellow {
    background-color: #ffc107;
  }

  /* Modal button within each card */
  .modal_button {
    bottom: 10px;
    position: absolute;
    right: 10px;
    padding: 5px 10px;
    background-color: #5bc0de;
    color: #fff;
    font-size: 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition:
      background-color 0.3s ease,
      transform 0.3s ease;
  }

  .modal_button:hover {
    background-color: #31b0d5;
    transform: translateY(-2px);
  }

  /* Styling for asset details */
  .first_col {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    margin-top: 10px;
  }

  .first_col_1,
  .first_col_2 {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .second_col {
    line-height: 1.5;
  }

  .second_col p {
    margin: 0;
  }
</style>
