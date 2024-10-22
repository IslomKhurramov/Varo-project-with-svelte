<script>
  import { onMount } from "svelte";
  import {
    setNewPlan,
    getAssetGroups,
    getOptionsForNewPlan,
    getPlanCommandExcel,
    getPlanLists,
    setNewSystemCommand,
  } from "../services/page1/newInspection"; // Only one service is needed
  import moment from "moment";
  import { navigate, useLocation } from "svelte-routing";
  import { errorAlert, successAlert } from "../shared/sweetAlert";
  import { getAssetGroup } from "../services/page2/assetService";

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
  let schedule = "0";
  let repetition = "";
  let repeatCycle = "";
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
  let actionSchedule = "0";
  let actionStartDate = "";
  let actionEndDate = "";
  let ruleType = "";
  let repealRule = "";
  let conductorInfo = "";
  let recheckplanIndex = null;

  // SECOND DATA
  let assetInsertData = {
    target_group: "",
    command_type: "1",
    target: "",
    command_str: "",
    search_path: "",
    search_extension: "",
    search_target: "",
    reserved: "",
    start_date: "",
    end_date: "",
    repeat_interval: "",
    repeat_term: "",
  };

  $: if (ruleType === "1") {
    repealRule = `${projectName} {}`;
  } else {
    repealRule = projectName;
  }

  //
  let planOptions = [];
  let planList = [];

  function toggleList(view) {
    showTable = view === "table";
  }

  const submitNewPlan = async () => {
    try {
      const sendData = {
        plan_name: projectName,
        plan_recheck: parseInt(selectedType),
        plan_recheck_plan_index: parseInt(recheckplanIndex ?? 0),
        // asset_group_index: parseInt(selectedCheckList),
        checklist_index: parseInt(selectedAssetList),
        plan_planer_info: parseInt(selectedPersons),
        plan_start_date: moment(startDate).format("YYYY-MM-DD h:mm:ss"),
        plan_end_date: moment(endDate).format("YYYY-MM-DD h:mm:ss"),
        plan_execution_type: parseInt(schedule),
        plan_execute_interval_value: schedule == 1 ? 1 : 0,
        plan_execute_interval_term: schedule == 0 ? "hours" : repeatCycle,
        plan_name_repeat_rule_type: parseInt(ruleType),
        plan_name_repeat_rule: repealRule,
        fix_date_setup: parseInt(actionSchedule),
        fix_start_date: actionStartDate,
        fix_end_date: actionEndDate,
        fix_conductor_info: parseInt(conductorInfo),
        assessment_command: inspectionInformation,
      };

      if (parseInt(selectedType) === 0)
        sendData.asset_group_index = parseInt(selectedCheckList);
      console.log("submitNewPlan: sendData:", sendData);

      const formData = new FormData();

      for (const key in sendData) {
        formData.append(key, sendData[key]);
      }

      const response = await setNewPlan(formData);

      navigate(window.location?.pathname == "/" ? "/page1" : "/");
    } catch (error) {
      console.error("Error submitting new plan:", error);
      errorAlert(error?.message);
    }
  };

  onMount(async () => {
    loading = true;
    try {
      planOptions = await getOptionsForNewPlan();

      planList = await getPlanLists();

      assetGroup = await getAssetGroup();
    } catch (err) {
      error = err.message;
      console.error("Error loading asset groups:", error);
    } finally {
      loading = false;
    }
  });

  const sampleClick = async () => {
    try {
      await getPlanCommandExcel(selectedCheckList);
    } catch (error) {
      console.log("Error sampleClick: ", error);
    }
  };

  const handleFileUpload = (event) => {
    inspectionInformation = event.target.files[0];
    console.log(inspectionInformation);
  };

  const changeTarget = (target, isChecked, type) => {
    console.log("type:", type);
    if (type === "checkbox") {
      let splitData = assetInsertData.target.split(",");

      if (isChecked) {
        if (!splitData.includes(target)) {
          splitData.push(target);
        }
      } else {
        splitData = splitData.filter((char) => char !== target);
      }

      assetInsertData.target = splitData.join(",").replace(/^,/, "");
    } else {
      let splitData = assetInsertData.target.split(",");

      splitData = splitData.filter(
        (char) => char !== "powershell" && char !== "batchscript",
      );
      splitData.push(target);

      assetInsertData.target = splitData.join(",").replace(/^,/, "");
    }
  };

  const changeSearchTarget = (target, isChecked) => {
    let splitData = assetInsertData.search_target.split(",");

    if (isChecked) {
      if (!splitData.includes(target)) {
        splitData.push(target);
      }
    } else {
      splitData = splitData.filter((char) => char !== target);
    }

    assetInsertData.search_target = splitData.join(",").replace(/^,/, "");
  };

  const submitNewSystemCommand = async () => {
    try {
      if (assetInsertData.start_date)
        assetInsertData.start_date = moment(assetInsertData.start_date).format(
          "YYYY-MM-DD h:mm:ss",
        );
      if (assetInsertData.end_date)
        assetInsertData.end_date = moment(assetInsertData.end_date).format(
          "YYYY-MM-DD h:mm:ss",
        );

      console.log("assetInsertData:", assetInsertData);

      const response = await setNewSystemCommand(assetInsertData);

      await successAlert(response.CODE);

      navigate(window.location?.pathname == "/" ? "/page1" : "/");
    } catch (error) {
      console.error("Error submitNewSystemCommand new plan:", error);
      errorAlert(error?.message);
    }
  };

  $: {
    console.log("assetInsertData:", assetInsertData);
  }
</script>

<div class="contentsWrap">
  <div class="contentArea">
    <section class="subTabWrap">
      <a
        href="javascript:void(0);"
        class={!showTable ? "active" : ""}
        on:click={() => toggleList("form")}
      >
        CCE점검
      </a>
      <a
        href="javascript:void(0);"
        class={showTable ? "active" : ""}
        on:click={() => toggleList("table")}
      >
        자산정보수집
      </a>
    </section>

    {#if !showTable}
      <!-- <div class="section">
        <div class="row">
          <label class="label blue-label">점검플랜명</label>
          <input
            type="text"
            class="input"
            bind:value={projectName}
            placeholder="점검플랜명"
          />
        </div>
  
        <div class="row">
          <label class="label blue-label">점검방법</label>
          <select class="dropdown" bind:value={selectedType} placeholder="test">
            <option value="" selected disabled>신규점검/이행점검</option>
            <option value="0">신규점검</option>
            <option value="1">이행점검</option>
          </select>
        </div>
  
        {#if selectedType === "1"}
          <div class="row">
            <label class="label blue-label">이전플랜</label>
            <select class="dropdown" bind:value={recheckplanIndex}>
              <option value="" selected disabled>이전 점검플랜명</option>
  
              {#if planList}
                {#each planList as plan}
                  <option value={plan.ccp_index}>{plan.ccp_title}</option>
                {/each}
              {/if}
            </select>
          </div>
        {/if}
  
        {#if selectedType === "0"}
          <div class="row">
            <label class="label blue-label">점검대상</label>
            <select class="dropdown" bind:value={selectedCheckList}>
              <option value="" selected disabled>자산 그룹목록</option>
  
              {#if planOptions.asset_group}
                {#each planOptions.asset_group as asset}
                  <option value={asset.asg_index}>{asset.asg_title}</option>
                {/each}
              {/if}
            </select>
          </div>
        {/if}
  
        <div class="row">
          <label class="label blue-label1">점검항목</label>
          <select class="dropdown" bind:value={selectedAssetList}>
            <option value="" selected disabled>점검항목 목록</option>
            {#if planOptions.checklist_group}
              {#each planOptions.checklist_group as item}
                <option value={item.ccg_index}>{item.ccg_group}</option>
              {/each}
            {/if}
          </select>
        </div>
  
        <div class="row">
          <label class="label blue-label2">점검자지정</label>
          <select class="dropdown" bind:value={selectedPersons}>
            <option value="" selected disabled>선택</option>
            {#if planOptions.member_group}
              {#each planOptions.member_group as member}
                <option value={member.user_index}>{member.user_name}</option>
              {/each}
            {/if}
          </select>
        </div>
  
        <div class="row">
          <label class="label blue-label">점검일정</label>
          <input
            type="datetime-local"
            class="input"
            bind:value={startDate}
            placeholder="test"
          />
          <span class="date-separator">~</span>
          <input type="datetime-local" class="input" bind:value={endDate} />
        </div>
  
        <div class="row">
          <label class="label blue-label">점검 실행</label>
          <select class="dropdown" bind:value={schedule}>
            <option value="" selected disabled>즉시실행/반복실행</option>
            <option value="0">즉시실행</option>
            <option value="1">반복실행</option>
          </select>
        </div>
  
        {#if schedule == "1"}
          <div class="row">
            <label class="label blue-label">주기</label>
            <input
              disabled
              type="text"
              class="input"
              placeholder="반복주기지정(반복설정)"
            />
            <select class="dropdown" bind:value={repeatCycle}>
              <option value="" selected disabled>시/일/주/월/년</option>
              <option value="hours">시</option>
              <option value="days">일</option>
              <option value="weeks">주</option>
              <option value="months">월</option>
              <option value="years">년</option>
            </select>
          </div>
        {/if}
  
        <div class="row">
          <label class="label blue-label">생성 규칙</label>
          <select class="dropdown" bind:value={ruleType}>
            <option value="" selected disabled
              >반복실행시 마다 신규점검 자동 생성/현 점검 하위로 점검 자동 생성</option
            >
            <option value="1">반복실행시 마다 신규점검 자동 생성</option>
            <option value="0">현 점검 하위로 점검 자동 생성</option>
          </select>
        </div>
  
        {#if ruleType === "1"}
          <div class="row">
            <label class="label blue-label">점검 플랜</label>
            <input type="text" class="input" bind:value={repealRule} disabled />
          </div>
        {/if}
  
        <div class="row">
          <label class="label blue-label">조치일정</label>
          <select class="dropdown" bind:value={actionSchedule}>
            <option value="" selected disabled>설정/미설정</option>
            <option value="1">설정</option>
            <option value="0">미설정</option>
          </select>
          <input type="date" class="input" bind:value={actionStartDate} />
          <span class="date-separator">~</span>
          <input type="date" class="input" bind:value={actionEndDate} />
        </div>
  
        <div class="row">
          <label class="label blue-label">점검정보</label>
          <input
            type="file"
            class="input"
            on:change={(event) => handleFileUpload(event)}
          />
          <p on:click={sampleClick} style="cursor: pointer;">샘플다운로드</p>
        </div>
  
        <div class="row">
          <label class="label blue-label2">조치담당자 지정 </label>
          <select class="dropdown" bind:value={conductorInfo}>
            <option value="" selected disabled>선택</option>
            {#if planOptions.member_group}
              {#each planOptions.member_group as member}
                <option value={member.user_index}>{member.user_name}</option>
              {/each}
            {/if}
          </select>
        </div>
  
        <button class="button blue-button" on:click={submitNewPlan}
          >저장하기</button
        >
      </div> -->

      <article class="formWrap">
        <div class="formControlWrap">
          <div class="formControl">
            <label>점검플랜명</label>
            <input
              type="text"
              placeholder="점검플랜명"
              bind:value={projectName}
            />
          </div>
        </div>
        <div class="formControlWrap">
          <div class="formControl">
            <label>점검방법</label>
            <select bind:value={selectedType} placeholder="test">
              <option value="" selected disabled>신규점검/이행점검</option>
              <option value="0">신규점검</option>
              <option value="1">이행점검</option>
            </select>
          </div>
          {#if selectedType === "1"}
            <div class="formControl">
              <label>이전플랜</label>
              <select bind:value={recheckplanIndex}>
                <option value="" selected disabled>이전 점검플랜명</option>

                {#if planList}
                  {#each planList as plan}
                    <option value={plan.ccp_index}>{plan.ccp_title}</option>
                  {/each}
                {/if}
              </select>
            </div>
          {/if}
        </div>

        <div class="formControlWrap">
          {#if selectedType === "0"}
            <div class="formControl">
              <label>점검대상</label>
              <select bind:value={selectedCheckList}>
                <option value="" selected disabled>자산 그룹목록</option>

                {#if planOptions.asset_group}
                  {#each planOptions.asset_group as asset}
                    <option value={asset.asg_index}>{asset.asg_title}</option>
                  {/each}
                {/if}
              </select>
            </div>
          {/if}

          <div class="formControl">
            <label>점검항목</label>
            <select bind:value={selectedAssetList}>
              <option value="" selected disabled>점검항목 목록</option>
              {#if planOptions.checklist_group}
                {#each planOptions.checklist_group as item}
                  <option value={item.ccg_index}>{item.ccg_group}</option>
                {/each}
              {/if}
            </select>
          </div>
        </div>
        <div class="formControlWrap">
          <div class="formControl">
            <label>점검자 지정</label>
            <select bind:value={selectedPersons}>
              <option value="" selected disabled>선택</option>
              {#if planOptions.member_group}
                {#each planOptions.member_group as member}
                  <option value={member.user_index}>{member.user_name}</option>
                {/each}
              {/if}
            </select>
          </div>
          <div class="formControl">
            <label>조치담당자 지정</label>
            <select bind:value={conductorInfo}>
              <option value="" selected disabled>선택</option>
              {#if planOptions.member_group}
                {#each planOptions.member_group as member}
                  <option value={member.user_index}>{member.user_name}</option>
                {/each}
              {/if}
            </select>
          </div>
        </div>
        <div class="formControlWrap col">
          <div class="formControl">
            <label>점검일정</label>
            <div class="dateWrap">
              <div class="date">
                <input
                  type="datetime-local"
                  class="datepicker"
                  placeholder="시작일시"
                  bind:value={startDate}
                />
              </div>
              <img src="./assets/images/icon/dash.svg" />
              <div class="date">
                <input
                  type="datetime-local"
                  class="datepicker"
                  placeholder="종료일시"
                  bind:value={endDate}
                />
              </div>
            </div>
          </div>
          <div class="detailForm">
            <div class="formControl">
              <label>점검 실행</label>
              <div class="radioWrap">
                <label class="radio-label">
                  <input
                    type="radio"
                    name="repeat"
                    checked={schedule == "0"}
                    on:change={(e) => {
                      if (e.target.checked) {
                        schedule = "0";
                      }
                    }}
                  />
                  <span>즉시실행</span>
                </label>
                <label class="radio-label">
                  <input
                    type="radio"
                    name="repeat"
                    checked={schedule == "1"}
                    on:change={(e) => {
                      if (e.target.checked) {
                        schedule = "1";
                      }
                    }}
                  />
                  <span>반복실행</span>
                </label>
              </div>
            </div>
            {#if schedule == "1"}
              <div class="formControl">
                <label>주기</label>
                <div class="controlWrap">
                  <input
                    type="text"
                    placeholder="반복주기지정(반복설정"
                    class="w90"
                    disabled
                  />
                  <select class="w120" bind:value={repeatCycle}>
                    <option value="" selected disabled>시/일/주/월/년</option>
                    <option value="hours">시</option>
                    <option value="days">일</option>
                    <option value="weeks">주</option>
                    <option value="months">월</option>
                    <option value="years">년</option>
                  </select>
                </div>
              </div>
            {/if}

            <div class="formControl">
              <label>점검 플랜 생성 규칙</label>
              <div class="controlWrap">
                <select bind:value={ruleType}>
                  <option value="" selected disabled>
                    반복실행시 마다 신규점검 자동 생성/현 점검 하위로 점검 자동
                    생성
                  </option>
                  <option value="1">반복실행시 마다 신규점검 자동 생성</option>
                  <option value="0">현 점검 하위로 점검 자동 생성</option>
                </select>
                {#if ruleType === "1"}
                  <input
                    class="w472"
                    type="text"
                    placeholder={"점검플랜명 '{}' ({}는 순차이며 프로젝트명에서 위치를 지정해 주세요.)"}
                    bind:value={repealRule}
                    disabled
                  />
                {/if}
              </div>
            </div>
          </div>
        </div>
        <div class="formControlWrap">
          <div class="formControl">
            <label>조치일정</label>
            <div class="toggle-wrapper">
              <h5>설정</h5>
              <input
                type="checkbox"
                id="toggle"
                class="toggle-checkbox"
                on:change={(e) => {
                  actionSchedule = e.target.checked ? "1" : "0";
                }}
              />
              <label for="toggle" class="toggle-label"></label>
            </div>
            <div class="dateWrap">
              <div class="date">
                <input
                  type="date"
                  class="datepicker"
                  placeholder="시작일시"
                  bind:value={actionStartDate}
                />
              </div>
              <img src="./assets/images/icon/dash.svg" />
              <div class="date">
                <input
                  type="date"
                  class="datepicker"
                  placeholder="종료일시"
                  bind:value={actionEndDate}
                />
              </div>
            </div>
          </div>
        </div>

        <div class="formControlWrap">
          <div class="formControl">
            <label>
              점검정보
              <a class="downloadBtn" on:click={sampleClick}>
                샘플다운로드 <img src="./assets/images/icon/download.svg" />
              </a>
            </label>
            <div class="upload-section">
              <label for="file-upload" class="file-label">엑셀파일업로드</label>
              <input
                type="file"
                id="file-upload"
                accept=".xls,.xlsx"
                class="file-input"
                on:change={(event) => handleFileUpload(event)}
              />
              <button id="upload-btn" class="upload-btn btn btnPrimary">
                Upload
              </button>
            </div>
          </div>
        </div>
      </article>
      <button
        type="button"
        class="btn btnBlue btnSave"
        on:click={submitNewPlan}
      >
        저장하기
      </button>
      <!--//FORM-->
    {:else}
      <!-- <div class="second_container">
        <table>
          <tr>
            <th>대상</th>
            <td>
              {#if assetGroup?.CODE?.length !== 0}
                <select
                  name="asset_group"
                  id="asset_group"
                  class="select_input"
                  required
                  bind:value={assetInsertData.target_group}
                >
                  <option selected disabled value=""
                    >전체에이전트 / 자산그룹</option
                  >
                  <option value="ALL">전체에이전트</option>
  
                  {#each assetGroup?.CODE as asset}
                    <option value={asset.asg_index}>{asset.asg_title}</option>
                  {/each}
                </select>
              {/if}
            </td>
          </tr>
          <tr>
            <th>명령구분</th>
            <td>
              <select
                bind:value={assetInsertData.command_type}
                required
                on:change={() => {
                  assetInsertData = {
                    ...assetInsertData,
                    target: "",
                    command_str: "",
                    search_path: "",
                    search_extension: "",
                    search_target: "",
                    reserved: "",
                    start_date: "",
                    end_date: "",
                    repeat_interval: "",
                    repeat_term: "",
                  };
                }}
              >
                <option value="">선택</option>
                <option value="1">시스템 정보수집</option>
                <option value="2">임의 명령수행</option>
                <option value="3">파일 정보 검색</option>
              </select>
            </td>
          </tr>
          {#if assetInsertData?.command_type == 1}
            <tr>
              <th>수집대상</th>
              <td>
                <div class="checkbox-group">
                  <label
                    ><input
                      type="checkbox"
                      on:change={(e) => {
                        changeTarget("basic", e.target.checked, "checkbox");
                      }}
                    /> 시스템기본정보</label
                  >
                  <label
                    ><input
                      type="checkbox"
                      on:change={(e) => {
                        changeTarget("process", e.target.checked, "checkbox");
                      }}
                    /> 프로세스 정보</label
                  >
                  <label
                    ><input
                      type="checkbox"
                      on:change={(e) => {
                        changeTarget("network", e.target.checked, "checkbox");
                      }}
                    /> 네트워크 연결정보</label
                  >
                  <label
                    ><input
                      type="checkbox"
                      on:change={(e) => {
                        changeTarget("dll", e.target.checked, "checkbox");
                      }}
                    /> 로딩된 DLL 정보</label
                  >
                  <label
                    ><input
                      type="checkbox"
                      on:change={(e) => {
                        changeTarget("program", e.target.checked, "checkbox");
                      }}
                    /> 설치된 프로그램 목록 정보</label
                  >
                  <label
                    ><input
                      type="checkbox"
                      on:change={(e) => {
                        changeTarget("patch", e.target.checked, "checkbox");
                      }}
                    /> 패치 내역 정보</label
                  >
                </div>
              </td>
            </tr>
            <tr>
              <th>시간지정</th>
              <td>
                <select bind:value={assetInsertData.reserved} required>
                  <option value="">선택</option>
                  <option value="1">예약실행</option>
                  <option value="0">즉시실행</option>
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
                      required
                      bind:value={assetInsertData.start_date}
                    /></label
                  >
                  <label
                    >종료일시: <input
                      type="datetime-local"
                      bind:value={assetInsertData.end_date}
                    /></label
                  >
                  <label
                    >반복주기:
                    <input
                      type="number"
                      bind:value={assetInsertData.repeat_interval}
                      min="0"
                      placeholder="0"
                      required
                    />
                  </label>
                  <label>반복주기:</label>
                  <select bind:value={assetInsertData.repeat_term} required>
                    <option value="" selected disabled>시/일/주/월/년</option>
                    <option value="hours">시</option>
                    <option value="days">일</option>
                    <option value="weeks">주</option>
                    <option value="months">월</option>
                    <option value="years">년</option>
                  </select>
                </div>
              </td>
            </tr>
          {/if}
  
          {#if assetInsertData?.command_type == 2}
            <tr style="margin-top: 15px;">
              <th>명령구분</th>
              <td>
                <select>
                  <option selected value="">임의 명령수행</option>
                </select>
              </td>
            </tr>
            <tr>
              <th>명령어</th>
              <td>
                <select
                  on:change={(e) => {
                    changeTarget(e.target.value, null, "select");
                  }}
                >
                  <option selected disabled value="">선택</option>
                  <option value="powershell">PowerShell</option>
                  <option value="batchscript">Batchscript</option>
                </select>
                <textarea rows="4" bind:value={assetInsertData.command_str}
                ></textarea>
              </td>
            </tr>
          {/if}
  
          {#if assetInsertData?.command_type == 3}
            <tr style="margin-top: 15px;">
              <th>명령구분</th>
              <td>
                <select>
                  <option selected value="">파일 정보 검색</option>
                </select>
              </td>
            </tr>
            <tr>
              <th>수집대상</th>
              <td>
                <div class="checkbox-group">
                  <label
                    ><input
                      type="checkbox"
                      on:change={(e) => {
                        changeTarget("linux", e.target.checked, "checkbox");
                      }}
                    />리눅스 시스템</label
                  >
                  <label
                    ><input
                      type="checkbox"
                      on:change={(e) => {
                        changeTarget("windows", e.target.checked, "checkbox");
                      }}
                    />윈도우 시스템</label
                  >
                </div>
              </td>
            </tr>
            <tr>
              <th>검색조건</th>
              <td>
                <label
                  >경로지정: <input
                    type="text"
                    bind:value={assetInsertData.search_path}
                  /></label
                >
                <label
                  >확장자지정: <input
                    type="text"
                    bind:value={assetInsertData.search_extension}
                  /></label
                >
                <div class="checkbox-group">
                  <label
                    ><input
                      type="checkbox"
                      on:change={(e) => {
                        changeSearchTarget("database", e.target.checked);
                      }}
                    /> 데이터베이스</label
                  >
                  <label
                    ><input
                      type="checkbox"
                      on:change={(e) => {
                        changeSearchTarget("agent", e.target.checked);
                      }}
                    /> 에이전트</label
                  >
                </div>
              </td>
            </tr>
          {/if}
        </table>
        <button class="button blue-button" on:click={submitNewSystemCommand}
          >저장하기</button
        >
      </div> -->

      <article class="formWrap">
        <div class="formControlWrap">
          <div class="formControl">
            <label>대상</label>
            {#if assetGroup?.CODE?.length !== 0}
              <select bind:value={assetInsertData.target_group}>
                <option selected disabled value="">
                  전체에이전트 / 자산그룹
                </option>
                <option value="ALL"> 전체에이전트 </option>

                {#each assetGroup?.CODE as asset}
                  <option value={asset.asg_index}>{asset.asg_title}</option>
                {/each}
              </select>
            {/if}
          </div>
        </div>
        <div class="formControlWrap">
          <div class="formControl">
            <label>명령구분</label>
            <select
              id="commandSelect"
              bind:value={assetInsertData.command_type}
              required
              on:change={() => {
                assetInsertData = {
                  ...assetInsertData,
                  target: "",
                  command_str: "",
                  search_path: "",
                  search_extension: "",
                  search_target: "",
                  reserved: "",
                  start_date: "",
                  end_date: "",
                  repeat_interval: "",
                  repeat_term: "",
                };
              }}
            >
              <option value="1">시스템 정보수집</option>
              <option value="2">임의 명령수행</option>
              <option value="3">파일 정보 검색</option>
            </select>
          </div>
        </div>
        {#if assetInsertData?.command_type == 1}
          <div class="formControlWrap type" type="1">
            <div class="formControl">
              <label>점검대상</label>
              <div class="checkboxWrap">
                <label class="checkbox-label">
                  <input
                    type="checkbox"
                    name="target"
                    on:change={(e) => {
                      changeTarget("basic", e.target.checked, "checkbox");
                    }}
                  />
                  <span>시스템 기본정보</span>
                </label>
                <label class="checkbox-label">
                  <input
                    type="checkbox"
                    name="target"
                    on:change={(e) => {
                      changeTarget("process", e.target.checked, "checkbox");
                    }}
                  />
                  <span>프로세스 정보</span>
                </label>
                <label class="checkbox-label">
                  <input
                    type="checkbox"
                    name="target"
                    on:change={(e) => {
                      changeTarget("network", e.target.checked, "checkbox");
                    }}
                  />
                  <span>네트워크 연결정보</span>
                </label>
                <label class="checkbox-label">
                  <input
                    type="checkbox"
                    name="target"
                    on:change={(e) => {
                      changeTarget("dll", e.target.checked, "checkbox");
                    }}
                  />
                  <span>로딩된 DLL 정보</span>
                </label>
                <label class="checkbox-label">
                  <input
                    type="checkbox"
                    name="target"
                    on:change={(e) => {
                      changeTarget("program", e.target.checked, "checkbox");
                    }}
                  />
                  <span>설치된 프로그램 목록 정보</span>
                </label>
                <label class="checkbox-label">
                  <input
                    type="checkbox"
                    name="target"
                    on:change={(e) => {
                      changeTarget("patch", e.target.checked, "checkbox");
                    }}
                  />
                  <span>패치 내역 정보(윈도우만 해당)</span>
                </label>
              </div>
            </div>
          </div>
        {/if}

        {#if assetInsertData?.command_type == 2}
          <div class="formControlWrap type col" type="2">
            <div class="formControl noLabel">
              <label class="middle">명령어</label>
              <select
                on:change={(e) => {
                  changeTarget(e.target.value, null, "select");
                }}
              >
                <option selected disabled value="">선택</option>
                <option value="powershell">PowerShell</option>
                <option value="batchscript">Batchscript</option>
              </select>
            </div>
            <div class="formControl noLabel">
              <textarea rows="5" bind:value={assetInsertData.command_str}
              ></textarea>
            </div>
          </div>
        {/if}

        {#if assetInsertData?.command_type == 3}
          <div class="formControlWrap type" type="3">
            <div class="formControl">
              <label>검색조건</label>
              <div class="checkboxWrap">
                <label class="checkbox-label">
                  <input
                    type="checkbox"
                    name="target"
                    bind:value={assetInsertData.search_path}
                    on:change={(e) => {
                      changeTarget("linux", e.target.checked, "checkbox");
                    }}
                  />
                  <span>리눅스 시스템</span>
                </label>
                <label class="checkbox-label">
                  <input
                    type="checkbox"
                    name="target"
                    bind:value={assetInsertData.search_extension}
                    on:change={(e) => {
                      changeTarget("windows", e.target.checked, "checkbox");
                    }}
                  />
                  <span>윈도우 시스템</span>
                </label>
              </div>
            </div>
          </div>

          <div class="formControlWrap type" type="3">
            <div class="formControl">
              <label>수집대상</label>
              <div class="badgeWrap w390">
                <h6>경로지정</h6>
                <input
                  type="text"
                  placeholder="c:/path/ or /home/"
                  bind:value={assetInsertData.search_path}
                />
              </div>
              <div class={"badgeWrap w390"}>
                <h6>확장자 지정</h6>
                <input
                  type="text"
                  placeholder={"all.exe.dll"}
                  bind:value={assetInsertData.search_extension}
                />
              </div>
              <div class={"badgeWrap w390"}>
                <h6>검색위치</h6>
                <div class="checkboxWrap">
                  <label class="checkbox-label">
                    <input
                      type="checkbox"
                      name="target"
                      on:change={(e) => {
                        changeSearchTarget("database", e.target.checked);
                      }}
                    />
                    <span>데이터베이스</span>
                  </label>

                  <label class="checkbox-label">
                    <input
                      type="checkbox"
                      name="target"
                      on:change={(e) => {
                        changeSearchTarget("agent", e.target.checked);
                      }}
                    />
                    <span>에이전트</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        {/if}

        <div class="formControlWrap">
          <div class="formControl">
            <label>시간지정</label>
            <div class="radioWrap">
              <label class="radio-label">
                <input
                  type="radio"
                  name="repeat"
                  checked={assetInsertData.reserved == "1"}
                  on:change={(e) => {
                    if (e.target.checked) assetInsertData.reserved = "1";
                  }}
                />
                <span>예약실행</span>
              </label>
              <label class="radio-label">
                <input
                  type="radio"
                  name="repeat"
                  checked={assetInsertData.reserved == "0"}
                  on:change={(e) => {
                    if (e.target.checked) assetInsertData.reserved = "0";
                  }}
                />
                <span>즉시실행</span>
              </label>
            </div>
          </div>
        </div>
        <div class="formControlWrap col">
          <div class="formControl">
            <label>반복</label>
            <div class="dateWrap">
              <div class="date">
                <input
                  type="datetime-local"
                  class="datepicker"
                  placeholder="시작일시"
                  bind:value={assetInsertData.start_date}
                />
              </div>
              <img src="./assets/images/icon/dash.svg" />
              <div class="date">
                <input
                  type="datetime-local"
                  class="datepicker"
                  placeholder="종료일시"
                  bind:value={assetInsertData.end_date}
                />
              </div>
            </div>
          </div>
          <div class="formControl noLabel">
            <div class="controlWrap">
              <input
                type="text"
                placeholder="0"
                class="w90"
                bind:value={assetInsertData.repeat_interval}
              />
              <select class="w120" bind:value={assetInsertData.repeat_term}>
                <option value="" selected disabled>시/일/주/월/년</option>
                <option value="hours">시</option>
                <option value="days">일</option>
                <option value="weeks">주</option>
                <option value="months">월</option>
                <option value="years">년</option>
              </select>
            </div>
          </div>
        </div>
      </article>
      <button
        type="button"
        class="btn btnBlue btnSave"
        on:click={submitNewSystemCommand}
      >
        저장하기
      </button>
    {/if}
  </div>
</div>

<style>
  * {
    font-size: 16px;
  }
</style>
