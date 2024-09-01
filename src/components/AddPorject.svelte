<script>
  let projectName = "";
  let startDate = "";
  let endDate = "";
  let selectedType = "";
  let selectedPersons = [];
  let inspectionType = "";
  let schedule = "";
  let time = "";
  let includeWeekends = false;
  let repeatCycle = "";
  let newProjectAutoCreation = false;
</script>

<div class="container">
  <div class="header">
    <button class="button blue-button">CCE점검</button>
    <button class="button green-button">보안감사점검</button>
  </div>

  <div class="section">
    <div class="row">
      <label class="label blue-label">프로젝트명</label>
      <input type="text" class="input" bind:value="{projectName}" />
    </div>

    <div class="row">
      <label class="label blue-label">점검방식</label>
      <select class="dropdown" bind:value="{selectedType}">
        <option value="신규점검">신규점검</option>
        <option value="이력점검">이력점검</option>
      </select>
    </div>

    <div class="row">
      <label class="label blue-label">점검담당</label>
      <input
        type="text"
        class="input"
        placeholder="한동훈, 김지연, 윤정훈"
        bind:value="{selectedPersons}"
      />
    </div>

    <div class="row">
      <label class="label blue-label">점검일정</label>
      <input type="date" class="input" bind:value="{startDate}" />
      <span class="date-separator">~</span>
      <input type="date" class="input" bind:value="{endDate}" />
    </div>

    <div class="row">
      <label class="label blue-label">일정 설정</label>
      <select class="dropdown" bind:value="{schedule}">
        <option value="실시일정">실시일정</option>
        <option value="반복설정">반복설정</option>
      </select>
    </div>

    <div class="row">
      <label class="label blue-label">시간</label>
      <input
        type="time"
        class="input"
        placeholder="시간지정(시간지정)"
        bind:value="{time}"
      />
    </div>

    <div class="row">
      <label class="label blue-label">반복</label>
      <select class="dropdown" bind:value="{repeatCycle}">
        <option value="아니요">아니요</option>
        <option value="반복설정">반복설정</option>
      </select>
    </div>

    <div class="row">
      <label class="label blue-label">반복 주기</label>
      <input
        type="text"
        class="input"
        placeholder="반복주기지정(반복설정)"
        bind:value="{repeatCycle}"
      />
    </div>

    <div class="row">
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

    <div class="row">
      <label class="label blue-label">조치일정</label>
      <input type="date" class="input" bind:value="{startDate}" />
      <span class="date-separator">~</span>
      <input type="date" class="input" bind:value="{endDate}" />
    </div>
  </div>
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
</style>
