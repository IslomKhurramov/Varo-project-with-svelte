<script>
  import { onMount, tick } from "svelte";

  let commandType = "에이전트 시스템 정보수집";
  let scheduleType = "예약실행";
  let repeatStartTime;
  let repeatEndTime;
  let repeatInterval = 0;
  let systemCommand = "윈도우 PowerShell";
  let targetSystem = "리눅스 시스템";
  let searchPath = "c:/path/, /home/";
  let fileExtensions = "all, exe, dll";
  let searchLocation = "데이터베이스";
  let assetGroup = [];
  let showHistory = false; // State to control visibility of the history box
  let historyBox;

  for (let i = 1; i <= 25; i++) {
    assetGroup.push({
      assetName: `자산그룹${i}`,
    });
  }

  async function toggleHistory() {
    showHistory = !showHistory;

    // Wait for the DOM to update
    if (showHistory) {
      await tick(); // Wait for the DOM to update before scrolling
      historyBox.scrollIntoView({ behavior: "smooth" });
    }
  }

  //HISTORY DATA
  export let historyData = [];

  for (let i = 1; i <= 100; i++) {
    historyData.push({
      number: i.toString(),
      projectNO: `에이전트정보수집`,
      assetName: "Process, Network",
      cassification: "2023-02-01 11:22:22",
      logContent: "2023-02-01 11:22:22",
      performer: "반복",
      date: "1일",
      note: "수정/삭제",
    });
  }
</script>

<main>
  <div class="container">
    <div class="container_h3">
      <h3 on:click="{toggleHistory}">이력확인</h3>
    </div>
    <div class="select_container">
      <button class="select_button">명령구분</button>
      <select name="asset_group" id="asset_group" class="select_input">
        {#each assetGroup as asset}
          <option value="network_security">{asset.assetName}</option>
        {/each}
      </select>
    </div>

    <div class="second_container">
      <table>
        <tr>
          <th>명령구분</th>
          <td>
            <select bind:value="{commandType}">
              <option>에이전트 시스템 정보수집</option>
              <!-- Other options can be added here -->
            </select>
          </td>
        </tr>
        <tr>
          <th>수집대상</th>
          <td>
            <div class="checkbox-group">
              <label><input type="checkbox" /> 시스템기본정보</label>
              <label><input type="checkbox" /> 프로세스 정보</label>
              <label><input type="checkbox" /> 네트워크 연결정보</label>
              <label><input type="checkbox" /> 로딩된 DLL 정보</label>
              <label><input type="checkbox" /> 설치된 프로그램 목록 정보</label>
              <label><input type="checkbox" /> 패치 내역 정보</label>
            </div>
          </td>
        </tr>
        <tr>
          <th>시간지정</th>
          <td>
            <select bind:value="{scheduleType}">
              <option>예약실행</option>
              <!-- Other options can be added here -->
            </select>
          </td>
        </tr>
        <tr>
          <th>반복</th>
          <td>
            <div>
              <label
                >시작일시: <input
                  type="datetime-local"
                  bind:value="{repeatStartTime}"
                /></label
              >
              <label
                >종료일시: <input
                  type="datetime-local"
                  bind:value="{repeatEndTime}"
                /></label
              >
              <label
                >반복주기: <input
                  type="number"
                  bind:value="{repeatInterval}"
                  min="0"
                /> 분</label
              >
            </div>
          </td>
        </tr>
        <tr>
          <th>명령구분</th>
          <td>
            <select bind:value="{systemCommand}">
              <option>임의 명령수량</option>
              <!-- Other options can be added here -->
            </select>
          </td>
        </tr>
        <tr>
          <th>명령어</th>
          <td>
            <select bind:value="{systemCommand}">
              <option>윈도우 PowerShell</option>
              <!-- Other options can be added here -->
            </select>
            <textarea rows="4" bind:value="{systemCommand}"></textarea>
          </td>
        </tr>
        <tr>
          <th>수집대상</th>
          <td>
            <div class="checkbox-group">
              <label><input type="checkbox" /> 리눅스 시스템</label>
              <label><input type="checkbox" /> 윈도우 시스템</label>
            </div>
          </td>
        </tr>
        <tr>
          <th>검색조건</th>
          <td>
            <label
              >경로지정: <input type="text" bind:value="{searchPath}" /></label
            >
            <label
              >확장자지정: <input
                type="text"
                bind:value="{fileExtensions}"
              /></label
            >
            <div class="checkbox-group">
              <label><input type="checkbox" /> 데이터베이스</label>
              <label><input type="checkbox" /> 에이전트</label>
            </div>
          </td>
        </tr>
      </table>
    </div>
  </div>

  {#if showHistory}
    <div class="history_box" bind:this="{historyBox}">
      <!-- History content goes here -->
      <table>
        <tr class="first_line">
          <th>넘버</th>
          <th>명령구분</th>
          <th>명령내역</th>
          <th>등록일시</th>
          <th>종료일시</th>
          <th>반복여부</th>
          <th>반복주기</th>
          <th>명령관리</th>
        </tr>
        {#each historyData as asset}
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
    </div>
  {/if}
</main>

<style>
  .second_container {
    margin-top: 20px;
    border-radius: 10px;
  }
  table {
    color: #000000;
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  table,
  th,
  td {
    border: 1px solid black;
  }
  th,
  td {
    padding: 10px;
    text-align: left;
  }
  th {
    background-color: #4682b4;
    color: #fff;
    width: 120px;
    text-align: center;
  }
  td {
    font-size: 12px;
  }
  textarea,
  select,
  input[type="text"],
  input[type="number"] {
    width: 100%;
    padding: 5px;
    box-sizing: border-box;
  }
  select:hover,
  select:focus {
    background-color: #cccccc;
  }
  .checkbox-group {
    display: flex;
    flex-direction: column;
  }

  main {
    display: flex;
    width: 100%;
    justify-content: center;
    margin: 20px;
  }
  .container {
    display: flex;
    flex-direction: column;
    gap: 5px;
    width: 60%;
    padding: 20px;
    color: #cccccc;
  }
  .select_container {
    display: flex;
    align-items: center;
    border-radius: 5px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Stronger shadow for a more solid feel */
  }

  .select_button {
    background-color: #4682b4; /* A strong, trustworthy blue */
    color: #ffffff;
    padding: 12px 24px;
    border: none;
    font-size: 14px;
    font-weight: bold;
    transition: background-color 0.3s ease;
    border-right: 1px solid #3e3e3e;
    flex-shrink: 0;
    width: 140px;
  }

  .select_button:hover {
    background-color: #005a99; /* Darker blue on hover */
  }

  .select_input {
    width: 100%;
    padding: 12px;
    border: none;
    font-size: 14px;
    background-color: #fff;
    color: #000000; /* Light text for readability */
    cursor: pointer;
    outline: none;
  }

  .select_input:hover,
  .select_input:focus {
    background-color: #cccccc;
  }

  .select_input option {
    background-color: #fff;
    color: #000000;
  }
  main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center; /* Centers the content horizontally */
    width: 100%;
    margin: 20px 0; /* Optional: Adjust margin as needed */
    position: relative;
  }
  .container_h3 {
    position: absolute;
    display: flex;
    flex-direction: row;
    gap: 50px;
    padding-left: 40px;
    width: 120px;
    color: #000000;
    top: -80px;
    left: 125px;
    text-decoration: underline;
  }
  .container_h3 h3 {
    color: black;
    font-weight: bold;
    font-size: 14px;
    cursor: pointer;
  }
  .container_h3 h3 {
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

  .container_h3 h3:before {
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

  .container_h3 h3:hover {
    background-position: 0;
  }

  .container_h3 h3:hover::before {
    width: 100%;
  }
  /***************HISTORY CONTAINER*************/
  .history_box {
    width: 70%;
    height: 500px;
    overflow-y: auto;
    overflow-x: hidden;

    border: 1px solid #000;
    background-color: #f5f5f5;
    border-radius: 5px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  .history_box table {
    font-family: "Arial", sans-serif;
    border-collapse: collapse;
    width: 100%;
    background: #ffffff;
    font-size: 12px;
  }

  .history_box th,
  .history_box td {
    border: 1px solid #000000;
    padding: 12px 15px; /* Increased padding for better spacing */
    text-align: left;
    vertical-align: middle; /* Ensure content is vertically centered */
  }

  .history_box th {
    background-color: #003366; /* Header background color */
    color: #ffffff; /* Header text color */
    position: sticky;
    top: 0;
    z-index: 1;
    text-transform: uppercase; /* Uppercase text for header */
    font-size: 12px;
  }

  .history_box tr:nth-child(even) {
    background-color: #f9f9f9; /* Slightly lighter shade for even rows */
  }

  .history_box tr:hover {
    background-color: #e0f7fa; /* Soft hover effect */
  }
</style>
