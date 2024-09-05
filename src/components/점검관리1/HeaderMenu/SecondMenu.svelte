<script>
  import Modal from "../../../shared/Modal.svelte";
  import ModalPage from "../ModalPage.svelte";

  let showModal = false;
  let projectsData = [
    {
      name: "수리과터스트2",
      inspectionTarget: "NETWORK",
      inspectionDateAndTime: "2020.12.15",
    },
  ];
  export let hostInfo = [];

  for (let i = 1; i <= 10; i++) {
    hostInfo.push({
      number: i.toString(),
      name: `User_L2_51${i}`,
      item: "[N-01] 패스워드 설정",
      checklist: {
        vulnerability:
          "기본 패스워드를 변경하지 않거나 패스워드를 설정하지 않은 경우",
        good: "기본 패스워드를 변경한 경우",
      },
      system: "계정목록(동일패스워드 없음)",
      instectionResult: "양호",
    });
  }
</script>

<body>
  <div class="container">
    <div class="firstLine">
      <div class="dropdown-group">
        <div class="dropdown-container">
          <label for="project">프로젝트:</label>
          <select id="project">
            <option value="수리과터스트2">수리과터스트2</option>
          </select>
        </div>
        <div class="dropdown-container">
          <label for="target">점검대상:</label>
          <select id="target">
            <option value="수리과터스트2">수리과터스트2</option>
          </select>
        </div>
        <div class="dropdown-container">
          <label for="host">호스트:</label>
          <select id="host">
            <option value="수리과터스트2">수리과터스트2</option>
          </select>
        </div>
        <div class="dropdown-container">
          <label for="result">점검결과:</label>
          <select id="result">
            <option value="수리과터스트2">수리과터스트2</option>
          </select>
        </div>
        <div class="dropdown-container">
          <label for="viewOption">보기옵션:</label>
          <select id="viewOption">
            <option value="수리과터스트2">수리과터스트2</option>
          </select>
        </div>
      </div>
      <div class="button-group">
        <button class="firstlineButton">조회하기</button>
        <button class="firstlineButton">보안점수확점</button>
      </div>
    </div>

    <div class="secondLine">
      <div>
        <p class="bold-text">프로젝트 전체 보안수준:</p>
        <p>{projectsData[0].name}</p>
      </div>
      <div>
        <p class="bold-text">결과미확정, 점검대상:</p>
        <p>{projectsData[0].inspectionTarget}</p>
      </div>
      <div>
        <p class="bold-text">점검일시:</p>
        <p>{projectsData[0].inspectionDateAndTime}</p>
      </div>
    </div>

    <div class="thirdLine">
      <p class="bold-text">
        Show <select><option value="">100</option></select> entries
      </p>
    </div>

    <div class="table_container">
      <table>
        <thead>
          <tr>
            <th style="width: 5%;">번호</th>
            <th style="width: 20%;">호스트명</th>
            <th style="width: 15%;">항목</th>
            <th style="width: 30%;">점검항목</th>
            <th style="width: 15%;">시스템상태</th>
            <th style="width: 10%;">점검결과</th>
            <th style="width: 5%;">결과변경</th>
          </tr>
        </thead>
        <tbody>
          {#each hostInfo as host}
            <tr>
              <td>{host.number}</td>
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <td style="cursor: pointer;" on:click="{() => (showModal = true)}"
                >{host.name}</td
              >
              <td>{host.item}</td>
              <td>
                <div class="checklist">
                  <p>취약: {host.checklist.vulnerability || "데이터 없음"}</p>
                  <p>양호: {host.checklist.good || "데이터 없음"}</p>
                </div>
              </td>
              <td>{host.system}</td>
              <td>{host.instectionResult}</td>
              <td>
                <select>
                  <option value="양호">양호</option>
                  <option value="해당">해당</option>
                </select>
                <button class="save_button">변경</button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>

  <div>
    <Modal bind:showModal>
      <ModalPage />
    </Modal>
  </div>
</body>

<style>
  body {
    display: flex;
    justify-content: center;
    background-color: #f4f4f4;
  }
  .table_container {
    overflow-y: auto;
    overflow-x: hidden;
    height: 500px;
    width: 100%;
  }
  .container {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 15px;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
  }

  .firstLine {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  .dropdown-group {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    align-items: center;
  }

  .dropdown-container {
    display: flex;
    flex-direction: row;
    gap: 5px;
    align-items: center;
    white-space: nowrap;
  }

  .dropdown-container label {
    font-weight: bold;
    margin: 0;
    font-size: 12px;
  }

  .firstlineButton {
    background-color: #0056b3;
    color: #ffffff;
    border: none;
    border-radius: 5px;
    padding: 8px 12px;
    font-size: 10px;
    font-weight: bold;
    cursor: pointer;
    transition:
      background-color 0.3s ease,
      transform 0.3s ease;
  }

  .firstlineButton:hover {
    background-color: #003366;
    transform: translateY(-2px);
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  }

  .secondLine {
    display: flex;
    align-items: center;
    padding: 10px;
    gap: 10px;
    background-color: #f4f4f4;
    border-radius: 5px;
  }

  .secondLine div {
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 12px;
    justify-content: center;
  }

  .bold-text {
    font-weight: bold;
    margin: 0;
  }
  .button-group {
    display: flex;
    flex-direction: row;
    gap: 5px;
  }

  .thirdLine {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-bottom: 10px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
  }

  th,
  td {
    border: 1px solid #dddddd;
    padding: 10px;
    text-align: left;
    white-space: nowrap;
  }

  th {
    background-color: #0068d7;
    color: #ffffff;
    font-weight: bold;
    text-transform: uppercase;
    position: sticky;
    top: 0;
    z-index: 1;
  }

  tbody tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  tbody tr:hover {
    background-color: #e0f7fa;
  }

  .checklist p {
    margin: 0;
  }

  .save_button {
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

  .save_button:hover {
    background-color: #247e39;
    transform: translateY(-2px);
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  }
</style>
