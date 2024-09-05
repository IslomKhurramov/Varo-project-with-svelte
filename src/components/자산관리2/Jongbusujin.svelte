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
  let showHistory = false;
  let historyBox;

  for (let i = 1; i <= 25; i++) {
    assetGroup.push({
      assetName: `자산그룹${i}`,
    });
  }

  async function toggleHistory() {
    showHistory = !showHistory;

    if (showHistory) {
      await tick();
      historyBox.scrollIntoView({ behavior: "smooth" });
    }
  }

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
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <h3 on:click="{toggleHistory}">이력확인</h3>
    </div>

    <div class="second_container">
      <table>
        <tr>
          <th>명령구분</th>
          <td>
            <select name="asset_group" id="asset_group" class="select_input">
              {#each assetGroup as asset}
                <option value="network_security">{asset.assetName}</option>
              {/each}
            </select></td
          >
        </tr>
        <tr>
          <th>명령구분</th>
          <td>
            <select bind:value="{commandType}">
              <option>에이전트 시스템 정보수집</option>
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
              <option>윈도우 PowerShell</option>
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
  /* General Layout */
  main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;

    background-color: #f7f9fb;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .container {
    width: 94%;
    margin-top: 20px;
    padding: 20px;
    background-color: #f7f9fb;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .second_container {
    margin-top: 20px;
    border-radius: 10px;
  }

  /* Table Styling */
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
    background-color: #f7f7f7; /* Subdued background color */
    border-radius: 20px;
  }

  th,
  td {
    font-size: 14px;
    padding: 10px;
    border: 1px solid #cccccc; /* Light gray border */
    text-align: left;
  }

  th {
    background-color: #0068d7; /* Dark gray for a more muted header */
    color: white;
    text-align: center;
    width: 120px;
  }

  tr:nth-child(even) {
    background-color: #eeeeee; /* Light gray for even rows */
  }

  tr:hover {
    background-color: #dddddd; /* Slightly darker gray for hover */
  }

  /* Inputs and Selects */
  input[type="text"],
  input[type="number"],
  input[type="datetime-local"],
  select,
  textarea {
    width: calc(100% - 10px);
    padding: 8px;
    margin: 5px 0;
    box-sizing: border-box;
    border: 1px solid #cccccc;
    border-radius: 5px;
    transition: background-color 0.3s ease;
  }

  input:focus,
  select:focus,
  textarea:focus {
    background-color: #e6f0f3;
    outline: none;
  }

  /* Checkbox group */
  .checkbox-group {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 10px;
  }

  .checkbox-group label {
    font-size: 12px;
    color: #333333;
  }

  .select_input {
    flex-grow: 1;
    padding: 12px;
    border: none;
    margin-right: 20px;
    font-size: 12px;
    background-color: #ffffff;
    color: #333333;
    outline: none;
    border: 1px solid #cccccc;
  }

  .select_input:hover,
  .select_input:focus {
    background-color: #bebebe;
  }

  /* History Box */
  .history_box {
    width: 94%;
    height: 400px;
    overflow-y: auto;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin-top: 40px;
    padding: 20px;
  }

  .history_box table {
    background-color: #f9f9f9;
    font-size: 12px;
  }

  .history_box th {
    background-color: #0068d7;
    color: #ffffff;
  }

  .history_box td {
    background-color: #f9f9f9;
    color: #333333;
  }

  /* Header Styling */
  .container_h3 {
    text-decoration: underline;
    font-size: 14px;
    color: #151313;
    cursor: pointer;
    border: none;
    border-radius: 5px;
    transition:
      background-color 0.3s ease,
      transform 0.3s ease;
  }

  .container_h3:hover {
    transform: translateY(-2px);
  }
</style>
