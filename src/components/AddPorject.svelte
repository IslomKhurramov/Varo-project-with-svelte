<script>
  import { onMount } from "svelte";
  import { setNewPlan, getAssetGroups, getOptionsForNewPlan } from "../services/page1/newInspection"; // Only one service is needed
  let loading = true;
  let error = null;

  let showTable = false;
  // Data for the form
  let projectName = "";
  let selectedType = "";
  let selectedCheckList = "";
  let selectedAssetList = "";
  let selectedPersons = "";
  let startDate = "";
  let endDate = "";
  let schedule = "";
  let repetition = "";
  let repeatCycle = "";
  let newProjectAutoCreation = false;
  let inspectionInformation = "";

  //Data2
  let commandType = "에이전트 시스템 정보수집";
  let scheduleType = "예약실행";
  let repeatStartTime;
  let repeatEndTime;
  let repeatInterval = 0;
  let systemCommand = "윈도우 PowerShell";
  let searchPath = "c:/path/, /home/";
  let fileExtensions = "all, exe, dll";

  let assetGroup = [];

  // Action schedule data
  let actionSchedule = "";
  let actionStartDate = "";
  let actionEndDate = "";


  // 
  let planOptions = [];

  function toggleList(view) {
    showTable = view === "table";
  }

  // Submit the entire form (POST all form data)
  const submitNewPlan = async () => {
    try {
      const sendData = {
        projectName,
        selectedType,
        selectedCheckList,
        selectedAssetList,
        selectedPersons,
        startDate,
        endDate,
        schedule,
        repetition,
        repeatCycle,
        newProjectAutoCreation,
        inspectionInformation,
        actionSchedule,
        actionStartDate,
        actionEndDate,
      }
      console.log("submitNewPlan: sendData:", sendData)

      // const response = await setNewPlan(sendData);

      // Log the entire response object to see what is being returned
      // console.log("API Response:", response);

      // if (response.success) {
      //   console.log("New plan submitted successfully!");
      // } else {
      //   console.error(
      //     "Failed to submit new plan:",
      //     response.message || "Unknown error"
      //   );
      // }
    } catch (error) {
      console.error("Error submitting new plan:", error);
    }
  };

  /******ASSET GROUPS DATA*/
  onMount(async () => {
    loading = true; // Set loading to true when starting the fetch process
    try {
      // const projectData = await getAssetGroups();
      // assetGroup = projectData;
      // console.log("Asset Groups:", assetGroup);

      planOptions = await getOptionsForNewPlan();
      console.log("planOptions:", planOptions)
    } catch (err) {
      error = err.message;
      console.error("Error loading asset groups:", error);
    } finally {
      loading = false; // Ensure loading is set to false once complete
    }
  });


  console.log("schedule:", schedule)

</script>

<div class="container">
  <div class="header">
    <button class="button blue-button" on:click="{() => toggleList('form')}"
      >CCE점검</button
    >
    <button class="button green-button" on:click="{() => toggleList('table')}"
      >보안감사점검</button
    >
  </div>

  {#if !showTable}
    <div class="section">
      <!-- Project Name -->
      <div class="row">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label class="label blue-label">프로젝트명</label>
        <input type="text" class="input" bind:value="{projectName}" />
      </div>

      <!-- Inspection Method -->
      <div class="row">
        <!-- svelte-ignore a11y-label-has-associated-control -->

        <label class="label blue-label">점검방법</label>
        <select class="dropdown" bind:value="{selectedType}">
          <option value="신규점검">신규점검</option>
          <option value="이행점검">이행점검</option>
        </select>
      </div>

      <!-- Inspection Target -->
      <div class="row">
        <!-- svelte-ignore a11y-label-has-associated-control -->

        <label class="label blue-label">점검대상</label>
        <select class="dropdown" bind:value="{selectedCheckList}">
          {#if planOptions.checklist_group}
            {#each planOptions.checklist_group as item}
              <option value={item.ccg_index}>{item.ccg_group}</option>
            {/each}
          {/if}
        </select>
      </div>

      <!-- Checklist -->
      <div class="row">
        <!-- svelte-ignore a11y-label-has-associated-control -->

        <label class="label blue-label1">점검항목</label>
        <select class="dropdown" bind:value="{selectedAssetList}">
          {#if planOptions.asset_group}
            {#each planOptions.asset_group as asset}
              <option value={asset.asg_index}>{asset.asg_title}</option>
            {/each}
          {/if}
        </select>
      </div>

      <!-- Assignee -->
      <div class="row">
        <!-- svelte-ignore a11y-label-has-associated-control -->

        <label class="label blue-label2">점검자지정</label>
        <select class="dropdown" bind:value="{selectedPersons}">
          {#if planOptions.member_group}
            {#each planOptions.member_group as member}
              <option value={member.user_index}>{member.user_name}</option>
            {/each}
          {/if}
        </select>
      </div>

      <!-- Inspection Schedule -->
      <div class="row">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label class="label blue-label">점검일정</label>
        <input type="date" class="input" bind:value="{startDate}" />
        <span class="date-separator">~</span>
        <input type="date" class="input" bind:value="{endDate}" />
      </div>

      <!-- Schedule Execution -->
      <div class="row">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label class="label blue-label">점검 실행</label>
        <select class="dropdown" bind:value="{schedule}">
          <option value="즉시실행">즉시실행</option>
          <option value="반복실행">반복실행</option>
        </select>
      </div>

      {#if schedule == '반복실행'}
        <!-- Repeat -->
      <div class="row">
        <!-- svelte-ignore a11y-label-has-associated-control -->

        <label class="label blue-label">반복</label>
        <select class="dropdown" bind:value="{repetition}">
          <option value="아니요">아니요</option>
          <option value="반복설정">반복설정</option>
        </select>
      </div>
      <!-- Cycle -->
      <div class="row">
        <!-- svelte-ignore a11y-label-has-associated-control -->

        <label class="label blue-label">주기</label>
        <input
          type="text"
          class="input"
          placeholder="반복주기지정(반복설정)"
          bind:value="{repeatCycle}"
        />
        <select class="dropdown" bind:value="{repeatCycle}">
          <option value="시">시</option>
          <option value="일">일</option>
          <option value="주">주</option>
          <option value="월">월</option>
        </select>
      </div>
      {/if}
      

      <!-- Repeat-Based Project Creation -->
      <div class="row">
        <!-- svelte-ignore a11y-label-has-associated-control -->

        <label class="label blue-label">프로젝트 생성</label>
        <label class="checkbox-label">
          <input
            type="checkbox"
            class="checkbox"
            bind:checked="{newProjectAutoCreation}"
          />
          반복설정시마다 신규 프로젝트 자동 생성
        </label>
      </div>

      <!-- Action Schedule -->
      <div class="row">
        <!-- svelte-ignore a11y-label-has-associated-control -->

        <label class="label blue-label">조치일정</label>
        <select class="dropdown" bind:value="{actionSchedule}">
          <option value="설정">설정</option>
          <option value="미설정">미설정</option>
        </select>
        <input type="date" class="input" bind:value="{actionStartDate}" />
        <span class="date-separator">~</span>
        <input type="date" class="input" bind:value="{actionEndDate}" />
      </div>

      <!-- Inspection Information Upload -->
      <div class="row">
        <!-- svelte-ignore a11y-label-has-associated-control -->

        <label class="label blue-label">점검정보</label>
        <input type="file" class="input" bind:value="{inspectionInformation}" />
        <p>샘플다운로드</p>
      </div>
      <!-- Single Button to Submit the Plan -->
      <button class="button blue-button" on:click="{submitNewPlan}"
        >저장하기</button
      >
    </div>
  {:else}
    <div class="second_container">
      <table>
        <tr>
          <th>명령구분</th>
          <td>
            {#if loading}
              <p>Loading...</p>
            {:else if error}
              <p>Error: {error}</p>
            {:else if assetGroup}
              <select name="asset_group" id="asset_group" class="select_input">
                {#each assetGroup as asset}
                  <option value="network_security">{asset.assetName}</option>
                {/each}
              </select>
            {/if}</td
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
      <!-- Single Button to Submit the Plan -->
      <button class="button blue-button">저장하기</button>
    </div>
  {/if}
</div>

<style>
  /* Container Styling */
  .container {
    display: flex;
    flex-direction: column;
    padding: 20px;
    max-width: 600px;
    margin: 50px auto;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  /* Header Styling */
  .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .button {
    flex: 1;
    height: 40px;
    border: none;
    cursor: pointer;
    font-weight: bold;
    border-radius: 5px;
    transition: background-color 0.3s ease;
    margin-right: 10px;
    font-size: 14px;
  }

  .blue-button {
    background-color: #2980b9;
    color: #fff;
  }

  .blue-button:hover {
    background-color: #21618c;
  }

  .green-button {
    background-color: #27ae60;
    color: #fff;
  }

  .green-button:hover {
    background-color: #1e8449;
  }

  /* Section Styling */
  .section {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .row {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .label {
    flex-shrink: 0;
    width: 150px;
    padding: 5px 0;
    text-align: left;
    font-size: 14px;
    font-weight: bold;
  }

  .blue-label {
    color: #2c3e50;
  }

  /* Input and Select Styling */
  .input,
  .dropdown {
    flex: 1;
    padding: 8px 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 14px;
    transition: border-color 0.3s ease;
  }

  .input:focus,
  .dropdown:focus {
    border-color: #2980b9;
    outline: none;
  }

  .dropdown {
    appearance: none;
    background-color: #fff;
  }

  .date-separator {
    margin: 0 10px;
    font-size: 14px;
    color: #555;
  }

  /* Checkbox Styling */
  .checkbox-label {
    display: flex;
    align-items: center;
    font-size: 14px;
  }

  .checkbox {
    margin-right: 10px;
    width: 16px;
    height: 16px;
  }

  /************************/
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
    background-color: #005fa3; /* Dark gray for a more muted header */
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
</style>
