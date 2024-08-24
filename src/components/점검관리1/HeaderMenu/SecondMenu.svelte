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
      <div style="display: flex; flex-direction: row;">
        <div class="firstline">
          <p>프로젝트:</p>
          <select id="">
            <option value="수리과터스트2">수리과터스트2</option>
            <option value="수리과터스트2">수리과터스트2</option>
            <option value="수리과터스트2">수리과터스트2</option>
          </select>
        </div>
        <div class="firstline">
          <p>점검대상:</p>
          <select id="">
            <option value="수리과터스트2">수리과터스트2</option>
            <option value="수리과터스트2">수리과터스트2</option>
            <option value="수리과터스트2">수리과터스트2</option>
          </select>
        </div>
        <div class="firstline">
          <p>호스트:</p>
          <select id="">
            <option value="수리과터스트2">수리과터스트2</option>
            <option value="수리과터스트2">수리과터스트2</option>
            <option value="수리과터스트2">수리과터스트2</option>
          </select>
        </div>
        <div class="firstline">
          <p>점검결과:</p>
          <select id="">
            <option value="수리과터스트2">수리과터스트2</option>
            <option value="수리과터스트2">수리과터스트2</option>
            <option value="수리과터스트2">수리과터스트2</option>
          </select>
        </div>
        <div class="firstline">
          <p>보기옵션:</p>
          <select id="">
            <option value="수리과터스트2">수리과터스트2</option>
            <option value="수리과터스트2">수리과터스트2</option>
            <option value="수리과터스트2">수리과터스트2</option>
          </select>
        </div>
      </div>
      <div class="Button">
        <button class="fisrtlineButton">조회하기</button>
        <button class="fisrtlineButton">보안점수확점</button>
      </div>
    </div>
    <div class="secondLine">
      <div>
        <p style="font-weight: bold;">프로젝트 전체 보안수준:</p>
        <p>{projectsData[0].name}</p>
      </div>
      <div>
        <p style="font-weight: bold;">결과미확정, 점검대상:</p>
        <p>{projectsData[0].inspectionTarget}</p>
      </div>
      <div>
        <p style="font-weight: bold;">점검일시:</p>
        <p>{projectsData[0].inspectionDateAndTime}</p>
      </div>
    </div>
    <div class="thirdLine">
      <p style="font-size: bold;">
        Show <span><select id=""><option value="">100</option></select></span> entries
      </p>
    </div>
    <table>
      <tr>
        <th>남버</th>
        <th>호스트명</th>
        <th>항목</th>
        <th>점검항목</th>
        <th>시스템상태</th>
        <th>점검결과</th>
        <th>결과변경</th>
      </tr>
      {#each hostInfo as host}
        <tr>
          <td>{host.number}</td>
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <td style="cursor: pointer;" on:click="{() => (showModal = true)}"
            >{host.name}</td
          >
          <td>{host.item}</td>
          <td>
            <div style="display: flex; flex-direction:column">
              {#if host.checklist && host.checklist.vulnerability}
                <p>취약: {host.checklist.vulnerability}</p>
              {:else}
                <p>취약: 데이터 없음</p>
              {/if}
              {#if host.checklist && host.checklist.good}
                <p>양호: {host.checklist.good}</p>
              {:else}
                <p>양호: 데이터 없음</p>
              {/if}
            </div>
          </td>
          <td>{host.system}</td>
          <td>{host.instectionResult}</td>
          <td>
            <select id="">
              <option value="양호">양호</option>
              <option value="해당">해당</option>
              <option value="empty"></option>
            </select>
            <select id="">
              <option value="양호">양호</option>
              <option value="해당">해당</option>
              <option value="empty"></option>
            </select>
            <button>변경</button>
          </td>
        </tr>
      {/each}
    </table>
  </div>
  <div class="modal">
    <Modal bind:showModal>
      <ModalPage />
    </Modal>
  </div>
</body>

<style>
  body {
    display: flex;
    justify-content: center;
    width: 100%;
  }
  .container {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 5px;
    background-color: #dedede;
    height: 600px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid #000000;
    overflow-y: auto;
    font-size: 12px;
    margin-left: 20px;
    overflow-x: hidden;
    margin-top: 40px;
  }
  table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
    background-color: #fff;
    margin-right: 5px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid #000000;
  }

  td,
  th {
    border: 1px solid #929292;
    text-align: left;
    padding: 8px;
  }

  tr:nth-child(even) {
    background-color: #e4e4e4;
  }
  .firstLine {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-around;
  }
  .firstline {
    display: flex;
    flex-direction: row;
    height: 20px;
    align-items: center;
    margin-top: 10px;
    gap: 10px;
  }
  .fisrtlineButton {
    border: 1px solid black;
    height: 20px;
    font-size: 12px;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    justify-content: center; /* Center text horizontally */
    align-items: center; /* Center text vertically */
    padding: 0 10px; /* Optional: Add padding for horizontal spacing */
    margin-top: 10px;
    box-sizing: border-box;
  }
  .firstline p {
    font-weight: bold;
  }
  .firstline select {
    border: 1px solid black;
    height: 20px;
    font-size: 12px;
    padding: 0px;
  }
  .firstline select option {
    font-size: inherit;
  }
  .Button {
    width: 180px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .secondLine {
    display: flex;
    flex-direction: row;
    width: 100%;
    padding-top: 0px;
    gap: 20px;
    margin-left: 5px;
    margin-top: 0px;
    padding-top: 0px;
  }
  .secondLine div {
    display: flex;
    flex-direction: row;
    gap: 5px;
  }
  .secondLine div p {
    padding-top: 0px;
    margin-top: 0px;
    margin-bottom: 0px;
    padding-bottom: 0px;
  }
  .thirdLine {
    margin-left: 5px;
    margin-bottom: 0; /* Ensure no margin at the bottom */
    padding-bottom: 0; /* Ensure no padding at the bottom */
  }
  .thirdLine p {
    font-weight: bold;
    padding-top: 0px;
    margin-top: 0px;
    margin: 0; /* Remove all margins */
    padding: 0; /* Remove all padding */
  }
  .thirdLine select {
    border: 1px solid black;
  }
</style>
