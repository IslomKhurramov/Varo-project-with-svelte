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
    <button class="blue-button">CCE점검</button>
    <button class="green-button">보안감사점검</button>
  </div>

  <div class="section">
    <div class="row">
      <div class="label blue-label">프로젝트명</div>
      <input type="text" class="input" bind:value="{projectName}" />
    </div>

    <div class="row">
      <div class="label blue-label">점검방식</div>
      <select class="dropdown" bind:value="{selectedType}">
        <option value="신규점검">신규점검</option>
        <option value="이력점검">이력점검</option>
      </select>
    </div>

    <div class="row">
      <div class="label blue-label">점검담당</div>
      <input
        type="text"
        class="input"
        placeholder="한동훈, 김지연, 윤정훈"
        bind:value="{selectedPersons}"
      />
    </div>

    <div class="row">
      <div class="label blue-label" style="width: 115px;">점검일정</div>
      <input
        type="date"
        class="input"
        style="width: 150px;"
        bind:value="{startDate}"
      />
      ~
      <input
        type="date"
        class="input"
        style="width: 150px;"
        bind:value="{endDate}"
      />
    </div>
    <div class="row">
      <select class="dropdown" bind:value="{schedule}">
        <option value="실시일정">실시일정</option>
        <option value="반복설정">반복설정</option>
      </select>
    </div>

    <div class="row">
      <div class="label blue-label">시간</div>
      <input
        type="text"
        class="input"
        placeholder="시간지정(시간지정)"
        bind:value="{time}"
      />
    </div>

    <div class="row">
      <div class="label blue-label">반복</div>
      <select class="dropdown" bind:value="{repeatCycle}">
        <option value="아니요">아니요</option>
        <option value="반복설정">반복설정</option>
      </select>
    </div>
    <div class="row">
      <div class="label blue-label">주기</div>
      <input
        type="text"
        class="input"
        placeholder="반복주기지정(반복설정)"
        bind:value="{repeatCycle}"
      />
    </div>

    <div class="row">
      <div class="label blue-label" style="width: 115px;">프로젝트생성</div>
      <label class="checkbox-label"
        ><input
          type="checkbox"
          class="checkbox"
          bind:checked="{newProjectAutoCreation}"
        /> 반복설정시마다 신규 프로젝트 자동 생성</label
      >
    </div>

    <div class="row">
      <div class="label blue-label" style="width: 115px;">조치일정</div>
      <input
        type="text"
        class="input"
        placeholder="설정/미설정"
        style="width: 100px;"
        bind:value="{projectName}"
      />
      <input
        type="date"
        class="input"
        bind:value="{startDate}"
        style="width: 150px;"
      />
      ~
      <input
        type="date"
        class="input"
        bind:value="{endDate}"
        style="width: 150px;"
      />
    </div>
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 20px;
    width: 600px;
    margin: 0 auto;
    background-color: #f9f9f9;
    border: 1px solid #ccc;
    margin-top: 50px;
    box-shadow:
      10px 10px 20px #babecc,
      -10px -10px 20px #ffffff;
  }

  .header {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    width: 100%;
    margin-bottom: 20px;
  }

  .header button {
    width: 120px;
    height: 40px;
    border: 1px solid #000;
    cursor: pointer;
    font-weight: bold;
    margin-right: 10px;
  }

  .blue-button {
    background-color: #0048bd;
    color: #fff;
  }

  .green-button {
    background-color: #91c03e;
    color: #fff;
  }

  .section {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .row {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    width: 100%;
  }

  .label {
    width: 150px;
    padding: 5px;
    text-align: center;
    font-size: 14px;
    font-weight: bold;
    border: 1px solid #000;
    margin-right: 5px;
  }

  .blue-label {
    background-color: #0048bd;
    color: #fff;
  }

  .input,
  .dropdown {
    width: 100%;
    padding: 5px;
    border: 1px solid #000;
    font-size: 14px;
    box-sizing: border-box;
    margin-right: 5px;
  }

  .dropdown {
    appearance: none;
    background-color: #fff;
  }

  .sub-button {
    padding: 5px;
    font-size: 14px;
    cursor: pointer;
    border: 1px solid #000;
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: bold;
    margin-left: 5px;
  }

  .checkbox {
    margin-right: 5px;
  }
</style>
