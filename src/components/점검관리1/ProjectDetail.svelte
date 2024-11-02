<script>
  import { getPlanDetailInformation } from "../../services/page1/projectDetail";
  import {
    getCCEResultUploadStatus,
    setSpecificItemResultsChange,
  } from "../../services/result/resultService";
  import { errorAlert } from "../../shared/sweetAlert";
  import { navigate } from "svelte-routing";
  import moment from "moment";
  import ModalDynamic from "../../shared/ModalDynamic.svelte";
  import ResultPopUp from "./ResultPopup.svelte";
  import {
    getOptionsForNewPlan,
    getPlanLists,
    setPlanChange,
  } from "../../services/page1/newInspection";
  import { getAssetGroup } from "../../services/page2/assetService";
  import { onMount } from "svelte";
  import Modal from "../../shared/Modal.svelte";
  import ModalPage from "./ModalPage.svelte";
  import ModalPageForDetail from "./ModalPageForDetail.svelte";

  export let projectIndex;

  let projectDetails = {};
  let assetsInfo = null;
  let modalData = null;
  let securityPointData = [];
  let securityMenu = "";

  let planOptions = [];
  let planList = [];
  let assetGroup = [];

  let totalPercentage = 0;
  let showModal = false;
  let lastModal = false;
  let insertData = {};
  let inputFile;
  let alertConfirm = false;

  let updateInfo = {
    ccp_index: "",
    ccp_title: "",
    recheck: "",
    recheck_pno: "",
    ccp_ruleset: "",
    asg_index: "",
    plan_planer_info: "",
    plan_start_date: "",
    plan_end_date: "",
    plan_execution_type: "",
    plan_execute_interval_value: "",
    plan_execute_interval_term: "",
    plan_name_repeat_rule_type: "",
    plan_name_repeat_rule: "",
    fix_date_setup: "",
    fix_start_date: "",
    fix_end_date: "",
    fix_conductor_info: "",
    // assessment_command: ""
  };

  onMount(async () => {
    try {
      planOptions = await getOptionsForNewPlan();

      planList = await getPlanLists();

      assetGroup = await getAssetGroup();
    } catch (err) {}
  });

  $: if (projectIndex) {
    updateProjectDetails();
  }

  async function updateProjectDetails() {
    try {
      projectDetails = await getPlanDetailInformation(projectIndex);

      updateInfo = {
        ...updateInfo,
        ccp_index: projectDetails?.ccp_index,
        ccp_title: projectDetails?.ccp_title,
        recheck: projectDetails?.recheck,
        recheck_pno: projectDetails?.recheck_pno,
        ccp_ruleset: projectDetails?.ccp_ruleset,
        asg_index: projectDetails?.asg_index,
        plan_planer_info: projectDetails?.plan_creator_user_index_id,
        plan_start_date: moment(projectDetails?.plan_start_date).format(
          "YYYY-MM-DD HH:mm:ss",
        ),
        plan_end_date: moment(projectDetails?.plan_end_date).format(
          "YYYY-MM-DD HH:mm:ss",
        ),
        plan_execution_type: projectDetails?.plan_execution_type ? 1 : 0,
        plan_execute_interval_value:
          projectDetails?.plan_execute_interval_value,
        plan_execute_interval_term: projectDetails?.plan_execute_interval_term,
        plan_name_repeat_rule_type: projectDetails?.plan_name_repeat_rule_type,
        plan_name_repeat_rule: projectDetails?.plan_name_repeat_rule,
        fix_date_setup: projectDetails?.fix_date_setup ? 1 : 0,
        fix_start_date: projectDetails?.fix_start_date,
        fix_end_date: projectDetails?.fix_end_date,
        fix_conductor_info: projectDetails?.fix_conductor_info_id,
      };

      const totalY = projectDetails?.target_securitypoint.reduce(
        (sum, item) => sum + item.y,
        0,
      );
      const maxY = projectDetails.target_securitypoint?.length * 100;
      totalPercentage = (totalY / maxY) * 100;

      // assets info data fetch
      assetsInfo = await getCCEResultUploadStatus(projectIndex);
    } catch (err) {
      await errorAlert(err?.message);
      navigate(window.location?.pathname == "/" ? "/page1" : "/");
    }
  }

  const updateInfoHandler = async (sendData) => {
    try {
      sendData.plan_start_date = moment(sendData?.plan_start_date).format(
        "YYYY-MM-DD HH:mm:ss",
      );
      sendData.plan_end_date = moment(sendData?.plan_end_date).format(
        "YYYY-MM-DD HH:mm:ss",
      );
      sendData.fix_start_date = moment(sendData?.fix_start_date).format(
        "YYYY-MM-DD",
      );
      sendData.fix_end_date = moment(sendData?.fix_end_date).format(
        "YYYY-MM-DD",
      );

      const formData = new FormData();

      for (const key in sendData) {
        formData.append(key, sendData[key]);
      }

      await setPlanChange(formData);
      alertConfirm = false;
    } catch (error) {
      errorAlert(error?.message);
    }
  };

  const calculateSecurityLevelByGroup = (target_group_securitypoint) => {
    const totalY = target_group_securitypoint?.reduce(
      (sum, item) => sum + item.y,
      0,
    );
    const data = (totalY / target_group_securitypoint?.length).toFixed(2);
    return isNaN(data) ? 0 : parseInt(data);
  };

  export const changeDataHandler = async (data) => {
    try {
      const formData = new FormData();

      formData.append("plan_index", data?.plan_index);
      formData.append("result_index", data?.result_index);
      formData.append("checklist_index", data?.checklist_index);
      if (data?.change_result)
        formData.append("change_result", data?.change_result);
      formData.append("change_option", data?.change_option);
      if (data?.change_status_text)
        formData.append("change_status_text", data?.change_status_text);
      if (data?.change_evidence_file)
        formData.append("change_evidence_file", data?.change_evidence_file);

      const result = await setSpecificItemResultsChange(formData);
      await updateProjectDetails();
      successAlert(result);
      showModal = false;
      modalData = null;
    } catch (err) {
      alert(err?.message);
    }
  };
</script>

<div class="scroll-div">
  <section class="rowContents">
    <div class="graphWrap">
      <article class="contentArea securityWrap">
        <h4 class="title border">보안점수</h4>
        <div class="circle" data-percent="80" data-offset="345">
          <svg viewBox="0 0 139 139">
            <circle
              cx="75"
              cy="75"
              r="55"
              stroke="#F2F2F2"
              stroke-width="18"
              fill="none"
            />
            <circle
              class="progress"
              cx="75"
              cy="75"
              r="55"
              stroke={projectDetails?.ccp_security_point > 0
                ? projectDetails?.ccp_security_point <= 33
                  ? "#FF1500"
                  : projectDetails?.ccp_security_point <= 66
                    ? "#4AC93F"
                    : "#0067FF"
                : "#0067FF"}
              stroke-width="18"
              fill="none"
              stroke-dasharray="345"
              stroke-linecap="round"
              transform="rotate(-90 75 75)"
              style={`stroke: ${
                projectDetails?.ccp_security_point > 0
                  ? projectDetails?.ccp_security_point <= 33
                    ? "#FF1500"
                    : projectDetails?.ccp_security_point <= 66
                      ? "#4AC93F"
                      : "#0067FF"
                  : "#0067FF"
              }; stroke-dashoffset: ${
                345 -
                (345 *
                  parseInt(
                    projectDetails?.ccp_security_point > 0
                      ? projectDetails?.ccp_security_point
                      : 0,
                  )) /
                  100
              };`}
            />
          </svg>
          <div class="percent">
            <span>
              {projectDetails?.ccp_security_point > 0
                ? projectDetails?.ccp_security_point
                : 0}%
            </span>
          </div>
        </div>
      </article>
      <article class="contentArea">
        <h4 class="title border">결과 등록 현황</h4>
        <div
          class="circle"
          data-percent="75"
          data-offset="345"
          data-color="primary"
        >
          <svg viewBox="0 0 139 139">
            <circle
              cx="75"
              cy="75"
              r="55"
              stroke="#F2F2F2"
              stroke-width="18"
              fill="none"
            />
            <circle
              class="progress"
              cx="75"
              cy="75"
              r="55"
              stroke={projectDetails?.ccp_security_point > 0
                ? projectDetails?.ccp_security_point <= 33
                  ? "#FF1500"
                  : projectDetails?.ccp_security_point <= 66
                    ? "#4AC93F"
                    : "#0067FF"
                : "#0067FF"}
              stroke-width="18"
              fill="none"
              stroke-dasharray="345"
              stroke-linecap="round"
              transform="rotate(-90 75 75)"
              style={`stroke: ${
                projectDetails?.ccp_security_point > 0
                  ? projectDetails?.ccp_security_point <= 33
                    ? "#FF1500"
                    : projectDetails?.ccp_security_point <= 66
                      ? "#4AC93F"
                      : "#0067FF"
                  : "#0067FF"
              }; stroke-dashoffset: ${
                345 -
                (345 *
                  parseInt(
                    projectDetails?.ccp_security_point > 0
                      ? projectDetails?.ccp_security_point
                      : 0,
                  )) /
                  100
              };`}
            />
          </svg>
          <div class="percent">
            <span>
              {projectDetails?.ccp_security_point > 0
                ? projectDetails?.ccp_security_point
                : 0}%</span
            >
          </div>
        </div>
        <div>
          <ul class="progressbarWrap result">
            {#if projectDetails && projectDetails?.target_securitypoint?.filter((ele) => ele.label === "UNIX")[0]?.["y"]}
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <li
                on:click={() => {
                  showModal = true;
                  modalData = assetsInfo["assets_info"].filter(
                    (asset) =>
                      asset.ast_uuid__ast_target__cct_target === "UNIX",
                  );
                }}
              >
                <div class="progress-info">
                  <h4 style="font-size: 16px;">UNIX</h4>
                  <span
                    >{projectDetails.target_securitypoint.filter(
                      (ele) => ele.label === "UNIX",
                    )[0]?.["y"]}%</span
                  >
                </div>
                <div class="progress light">
                  <div
                    class="progress-bar orange"
                    style={`width: ${
                      projectDetails.target_securitypoint.filter(
                        (ele) => ele.label === "UNIX",
                      )[0]?.["y"]
                    }%; font-size: 16px;`}
                  ></div>
                </div>
              </li>
            {/if}

            {#if projectDetails && projectDetails?.target_securitypoint?.filter((ele) => ele.label === "NETWORK")[0]?.["y"]}
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <li
                on:click={() => {
                  showModal = true;
                  modalData = assetsInfo["assets_info"].filter(
                    (asset) =>
                      asset.ast_uuid__ast_target__cct_target === "NETWORK",
                  );
                }}
              >
                <div class="progress-info">
                  <h4 style="font-size: 16px;">NETWORK</h4>
                  <span
                    >{projectDetails.target_securitypoint.filter(
                      (ele) => ele.label === "NETWORK",
                    )[0]?.["y"]}%</span
                  >
                </div>
                <div class="progress light">
                  <div
                    class="progress-bar orange"
                    style={`width: ${
                      projectDetails.target_securitypoint.filter(
                        (ele) => ele.label === "NETWORK",
                      )[0]?.["y"]
                    }%;`}
                  ></div>
                </div>
              </li>
            {/if}

            {#if projectDetails && projectDetails?.target_securitypoint?.filter((ele) => ele.label === "DBMS")[0]?.["y"]}
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <li
                on:click={() => {
                  showModal = true;
                  modalData = assetsInfo["assets_info"].filter(
                    (asset) =>
                      asset.ast_uuid__ast_target__cct_target === "DBMS",
                  );
                }}
              >
                <div class="progress-info">
                  <h4 style="font-size: 16px;">DBMS</h4>
                  <span
                    >{projectDetails.target_securitypoint.filter(
                      (ele) => ele.label === "DBMS",
                    )[0]?.["y"]}%</span
                  >
                </div>
                <div class="progress light">
                  <div
                    class="progress-bar orange"
                    style={`width: ${
                      projectDetails.target_securitypoint.filter(
                        (ele) => ele.label === "DBMS",
                      )[0]?.["y"]
                    }%;`}
                  ></div>
                </div>
              </li>
            {/if}

            {#if projectDetails && projectDetails?.target_securitypoint?.filter((ele) => ele.label === "SECURITY")[0]?.["y"]}
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <li
                on:click={() => {
                  showModal = true;
                  modalData = assetsInfo["assets_info"].filter(
                    (asset) =>
                      asset.ast_uuid__ast_target__cct_target === "SECURITY",
                  );
                }}
              >
                <div class="progress-info">
                  <h4 style="font-size: 16px;">SECURITY</h4>
                  <span
                    >{projectDetails.target_securitypoint.filter(
                      (ele) => ele.label === "SECURITY",
                    )[0]?.["y"]}%</span
                  >
                </div>
                <div class="progress light">
                  <div
                    class="progress-bar orange"
                    style={`width: ${
                      projectDetails.target_securitypoint.filter(
                        (ele) => ele.label === "SECURITY",
                      )[0]?.["y"]
                    }%;`}
                  ></div>
                </div>
              </li>
            {/if}
          </ul>
          <!-- <div class="slidePager">
            <a href="#" class="active"></a>
            <a href="#"></a>
            <a href="#"></a>
          </div> -->
        </div>
      </article>
    </div>
    <article class="contentArea" style="position: relative;">
      <h4 class="title border">개요</h4>

      <table class="tableForm">
        <colgroup>
          <col style="width:130px;" />
          <col style="width:380px;" />
          <col style="width:70px;" />
          <col />
        </colgroup>
        <tbody>
          <tr>
            <th>제목</th>
            <td colspan="3">
              <input
                style="width: 740px;"
                type="text"
                placeholder="점검플랜명"
                bind:value={updateInfo["ccp_title"]}
              />
            </td>
          </tr>
          <tr>
            <th>점검대상</th>
            <td>
              <select
                bind:value={updateInfo["asg_index"]}
                style="width: 740px;"
              >
                <option value="" selected disabled>자산 그룹목록</option>

                {#if planOptions.asset_group}
                  {#each planOptions.asset_group as asset}
                    <option value={asset.asg_index}>
                      {asset.asg_title}
                    </option>
                  {/each}
                {/if}
              </select>
            </td>
          </tr>
          <tr>
            <th>점검항목</th>
            <td colspan="3">
              <select
                bind:value={updateInfo["ccp_ruleset"]}
                style="width: 740px;"
              >
                <option value="" selected disabled>점검항목 목록</option>
                {#if planOptions.checklist_group}
                  {#each planOptions.checklist_group as item}
                    <option value={item.ccg_index}>
                      {item.ccg_group}
                    </option>
                  {/each}
                {/if}
              </select>
            </td>
          </tr>
          <!-- <tr>
            <th>생성자</th>
            <td colspan="3">
              <input type="text" placeholder="생성자" value="홍길동" />
            </td>
          </tr> -->
          <tr>
            <th>진행상태</th>
            <td colspan="3">
              <input
                type="text"
                placeholder="진행상태"
                disabled
                value={projectDetails?.ccp_b_finalized ? "완료" : "진행 중"}
                style="width: 740px;"
              />
            </td>
          </tr>
          <tr>
            <th>점검방법</th>
            <td>
              <div class="dateWrap">
                <div class="date">
                  <select
                    bind:value={updateInfo["recheck"]}
                    style={`width: ${updateInfo?.recheck === 1 ? "340" : "740"}px;`}
                  >
                    <option value={0}> 신규점겅검 </option>
                    <option value={1}> 이행점검 </option>
                  </select>
                </div>
                {#if updateInfo?.recheck === 1}
                  <!-- svelte-ignore a11y-missing-attribute -->
                  <img src="./assets/images/icon/dash.svg" />
                  <div class="date">
                    <select bind:value={updateInfo["recheck_pno"]}>
                      <option value={0} disabled>이전 점검플랜명</option>

                      {#if planList}
                        {#each planList as plan}
                          <option value={plan.ccp_index}>
                            {plan.ccp_title}
                          </option>
                        {/each}
                      {/if}
                    </select>
                  </div>
                {/if}
              </div>
            </td>
          </tr>
          <tr>
            <th>점검담당자</th>
            <td>
              <select
                bind:value={updateInfo["plan_planer_info"]}
                style="width: 740px;"
              >
                <option value="" selected disabled>선택</option>
                {#if planOptions.member_group}
                  {#each planOptions.member_group as member}
                    <option value={member.user_index}>
                      {member.user_name}
                    </option>
                  {/each}
                {/if}
              </select>
            </td>
          </tr>
          <tr>
            <th>점검일시</th>
            <td colspan="3">
              <div class="dateWrap">
                <div class="date">
                  <input
                    type="datetime-local"
                    class="datepicker"
                    placeholder="시작일시"
                    bind:value={updateInfo["plan_start_date"]}
                  />
                </div>
                <!-- svelte-ignore a11y-missing-attribute -->
                <img src="./assets/images/icon/dash.svg" />
                <div class="date">
                  <input
                    type="datetime-local"
                    class="datepicker"
                    placeholder="종료일시"
                    bind:value={updateInfo["plan_end_date"]}
                  />
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <th>점검스케쥴</th>
            <td colspan="3">
              <select style="width: 740px;">
                <option
                  value="0"
                  selected={updateInfo?.plan_execution_type === true}
                >
                  즉시실행
                </option>
                <option
                  value="1"
                  selected={updateInfo?.plan_execution_type === false}
                >
                  반복실행
                </option>
              </select>
            </td>
          </tr>
          <tr>
            <th>조치일정</th>
            <td colspan="3">
              <div class="dateWrap">
                <div class="date">
                  <input
                    type="date"
                    class="datepicker"
                    placeholder="시작일시"
                    bind:value={updateInfo["fix_start_date"]}
                  />
                </div>
                <!-- svelte-ignore a11y-missing-attribute -->
                <img src="./assets/images/icon/dash.svg" />
                <div class="date">
                  <input
                    type="date"
                    class="datepicker"
                    placeholder="종료일시"
                    bind:value={updateInfo["fix_end_date"]}
                  />
                </div>
              </div>
            </td>
          </tr>

          <tr>
            <th>조치담당자</th>
            <td colspan="3">
              <select
                bind:value={updateInfo["fix_conductor_info"]}
                style="width: 740px;"
              >
                <option value="" selected disabled>선택</option>
                {#if planOptions.member_group}
                  {#each planOptions.member_group as member}
                    <option value={member.user_index}>
                      {member.user_name}
                    </option>
                  {/each}
                {/if}
              </select>
            </td>
          </tr>
          <tr>
            <th>점검정보파일</th>
            <td colspan="2">
              <div class="upload-section">
                <label
                  for="file-upload"
                  class="file-label"
                  style="width: 576px; font-size: 16px; padding: 0 10px;"
                  >{updateInfo?.assessment_command
                    ? "파일 업로드됨"
                    : "엑셀파일업로드"}</label
                >
                <input
                  style="font-size: 16px;"
                  type="file"
                  id="file-upload"
                  accept=".xls,.xlsx"
                  class="file-input"
                  bind:this={inputFile}
                  on:change={(e) => {
                    updateInfo = {
                      ...updateInfo,
                      assessment_command: e.target.files[0],
                    };
                  }}
                />
                <button
                  id="upload-btn"
                  class="upload-btn btn btnPrimary"
                  on:click={() => {
                    inputFile.click();
                  }}
                  style="width: 155px;"
                >
                  Upload
                </button>
              </div>
            </td>
          </tr>
          <tr>
            <th style="visibility: hidden;">점검정보파일</th>
            <td colspan="2">
              <div class="upload-section">
                <label
                  for="file-upload"
                  class="file-label"
                  style="width: 509px; visibility: hidden;"
                  >{updateInfo?.assessment_command
                    ? "파일 업로드됨"
                    : "엑셀파일업로드"}</label
                >
                <input
                  style="visibility: hidden;"
                  type="file"
                  id="file-upload"
                  accept=".xls,.xlsx"
                  class="file-input"
                />
                <button
                  type="button"
                  class="btn btnBlue btnSave"
                  onclick="modalOpen('alert')"
                  on:click={() => (alertConfirm = true)}
                >
                  변경저장
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </article>
  </section>

  {#if projectDetails?.ccp_index}
    <section class="rowContents">
      <article
        class="contentArea securityLevel"
        style="box-sizing: border-box;"
      >
        <h4 class="title border">보안수준</h4>
        <div class="flex">
          <div class="circleGraph">
            <div class="summary">
              <h6>
                {projectDetails?.ccp_security_point > 0
                  ? projectDetails?.ccp_security_point
                  : 0}%
              </h6>
              <span style="font-size: 16px;">전체보안수준</span>
            </div>

            <div class="circle" data-percent="80" data-offset="345">
              <svg viewBox="0 0 139 139">
                <circle
                  cx="75"
                  cy="75"
                  r="55"
                  stroke="#F2F2F2"
                  stroke-width="18"
                  fill="none"
                />
                <circle
                  class="progress"
                  cx="75"
                  cy="75"
                  r="55"
                  stroke={projectDetails?.ccp_security_point > 0
                    ? projectDetails?.ccp_security_point <= 33
                      ? "#FF1500"
                      : projectDetails?.ccp_security_point <= 66
                        ? "#4AC93F"
                        : "#0067FF"
                    : "#0067FF"}
                  stroke-width="18"
                  fill="none"
                  stroke-dasharray="345"
                  stroke-linecap="round"
                  transform="rotate(-90 75 75)"
                  style={`stroke: ${
                    projectDetails?.ccp_security_point > 0
                      ? projectDetails?.ccp_security_point <= 33
                        ? "#FF1500"
                        : projectDetails?.ccp_security_point <= 66
                          ? "#4AC93F"
                          : "#0067FF"
                      : "#0067FF"
                  }; stroke-dashoffset: ${
                    345 -
                    (345 *
                      parseInt(
                        projectDetails?.ccp_security_point > 0
                          ? projectDetails?.ccp_security_point
                          : 0,
                      )) /
                      100
                  };`}
                />
              </svg>
              <div class="percent">
                <!-- svelte-ignore a11y-missing-attribute -->
                <span><img src="./assets/images/icon/guard.svg" /></span>
              </div>
            </div>
          </div>

          <div class="progressSection">
            <ul class="progressbarWrap">
              {#each Object.entries(projectDetails?.target_group_securitypoint) as [key, security]}
                {#if projectDetails?.asset[key]}
                  <!-- svelte-ignore a11y-click-events-have-key-events -->
                  <li
                    on:click={() => {
                      securityPointData = security;
                      securityMenu = key;
                    }}
                  >
                    <div class="progress-info">
                      <h4
                        class={securityMenu == key ? "active" : ""}
                        style="font-size: 16px;"
                      >
                        {key}
                      </h4>
                      <span style="font-size: 16px;">
                        {calculateSecurityLevelByGroup(security)}%
                      </span>
                    </div>
                    <div class="progress">
                      <div
                        class="progress-bar blue"
                        style={`width: ${calculateSecurityLevelByGroup(security)}%;`}
                      ></div>
                    </div>
                  </li>
                {/if}
              {/each}
            </ul>
          </div>

          <div class="progressSection">
            <ul class="progressbarWrap">
              {#if securityPointData?.length !== 0}
                {#each securityPointData as data}
                  <li>
                    <div class="progress-info">
                      <h4 style="font-size: 16px;">{data?.label}</h4>
                      <span style="font-size: 16px;">
                        {data?.y}%
                      </span>
                    </div>
                    <div class="progress">
                      <div
                        class="progress-bar blue"
                        style={`width: ${data?.y}%;`}
                      ></div>
                    </div>
                  </li>
                {/each}
              {:else}
                <li>
                  <div class="progress-info">
                    <h4 style="font-size: 16px;">계정관리</h4>
                    <span style="font-size: 16px;"> 0% </span>
                  </div>
                  <div class="progress">
                    <div class="progress-bar blue" style={`width: 0%;`}></div>
                  </div>
                </li>
                <li>
                  <div class="progress-info">
                    <h4 style="font-size: 16px;">접근관리</h4>
                    <span style="font-size: 16px;"> 0% </span>
                  </div>
                  <div class="progress">
                    <div class="progress-bar blue" style={`width: 0%;`}></div>
                  </div>
                </li>
                <li>
                  <div class="progress-info">
                    <h4 style="font-size: 16px;">패치관리</h4>
                    <span style="font-size: 16px;"> 0% </span>
                  </div>
                  <div class="progress">
                    <div class="progress-bar blue" style={`width: 0%;`}></div>
                  </div>
                </li>
                <li>
                  <div class="progress-info">
                    <h4 style="font-size: 16px;">로그관리</h4>
                    <span style="font-size: 16px;"> 0% </span>
                  </div>
                  <div class="progress">
                    <div class="progress-bar blue" style={`width: 0%;`}></div>
                  </div>
                </li>
                <li>
                  <div class="progress-info">
                    <h4 style="font-size: 16px;">기능관리</h4>
                    <span style="font-size: 16px;"> 0% </span>
                  </div>
                  <div class="progress">
                    <div class="progress-bar blue" style={`width: 0%;`}></div>
                  </div>
                </li>
              {/if}
            </ul>
            <!-- <div class="slidePager">
              <a href="#" class="active"></a>
              <a href="#"></a>
              <a href="#"></a>
            </div> -->
          </div>
        </div>
      </article>
    </section>

    <section class="rowContents last" style="padding-bottom: 20px">
      <article class="contentArea securityVulnerability">
        <h4 class="title border">주요 취약점</h4>
        <div class="tableListWrap" style="max-height: 256px;">
          <table class="tableList hdBorder">
            <colgroup>
              <col style="width:90px;" />
              <col />
              <col />
              <col />
              <col />
              <!-- <col style="width:100px;" /> -->
            </colgroup>
            <thead>
              <tr>
                <th class="text-center">번호</th>
                <th class="text-center">대상</th>
                <th class="text-center">점검그룹</th>
                <th class="text-center">점검항목</th>
                <th class="text-center">위험도</th>
                <!-- <th class="text-center">점검결과</th> -->
              </tr>
            </thead>
            <tbody>
              {#each projectDetails?.vuln_list as vuln, index}
                <tr
                  on:click={() => {
                    modalData = { ...vuln };
                    lastModal = true;
                  }}
                >
                  <td class="text-center" style="font-size: 16px;"
                    >{index + 1}</td
                  >
                  <td class="text-center" style="font-size: 16px;"
                    >{vuln?.cct_index__cct_target}</td
                  >
                  <td class="text-center" style="font-size: 16px;"
                    >{vuln?.ccr_item_no__ccc_item_group}</td
                  >
                  <td style="font-size: 16px;">
                    {vuln?.ccr_item_no__ccc_item_title}
                  </td>
                  <td class="text-center" style="font-size: 16px;"
                    >{vuln?.ccr_item_no__ccc_item_level}</td
                  >
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  {/if}
</div>

<!--Modal:초기화-->
<div class={`modalWrap alert ${alertConfirm ? "active" : ""}`}>
  <div class="modalContents small">
    <div class="contents">
      <div class="closeWrap">
        <button
          type="button"
          class="btnImg"
          on:click={() => {
            alertConfirm = false;
            updateProjectDetails();
          }}
        >
          <!-- svelte-ignore a11y-missing-attribute -->
          <img src="./assets/images/icon/close.svg" />
        </button>
      </div>
      <div class="msg">변경저장할 경우 이전 정보가 모두 초기화됩니다.</div>
      <div class="flex bottom-buttons normal">
        <button
          type="button"
          class="btn btnDefault"
          on:click={() => {
            alertConfirm = false;
            updateProjectDetails();
          }}
        >
          취소
        </button>
        <button
          type="button"
          class="btn btnBlue"
          on:click={() => updateInfoHandler(updateInfo)}
        >
          확인
        </button>
      </div>
    </div>
  </div>
</div>
<!--//Modal:초기화-->

<!--Modal:자산 상세-->
<div class={`modalWrap detail table ${showModal ? "active" : ""}`}>
  {#if showModal}
    <div class="modalContents big">
      <div class="contents" style="max-height: 600px;">
        <div class="closeWrap">
          <button
            type="button"
            class="btnImg"
            on:click={() => {
              showModal = false;
            }}
          >
            <!-- svelte-ignore a11y-missing-attribute -->
            <img src="./assets/images/icon/close.svg" />
          </button>
        </div>
        <div class="content">
          <div class="flex head">
            <h3 class="title">점검결과 등록 내역</h3>
          </div>
          <div
            class="tableListWrap"
            style="max-height: 550px; overflow: scroll; overflow-x: hidden;"
          >
            <table class="tableList hdBorder">
              <colgroup>
                <col style="width:90px;" />
                <col />
                <col />
                <col />
                <!-- <col /> -->
                <col />
              </colgroup>
              <thead style="position: sticky;top: 0;">
                <tr>
                  <th class="text-center">번호</th>
                  <th class="text-center">호스트명</th>
                  <th class="text-center">아이피주소</th>
                  <th class="text-center">점검대상</th>
                  <!-- <th class="text-center">에이전트</th> -->
                  <th class="text-center">보안점수</th>
                </tr>
              </thead>
              <tbody>
                {#if modalData && modalData?.length !== 0}
                  {#each modalData as data, index}
                    <tr>
                      <td class="text-center" style="font-size: 16px;"
                        >{index + 1}</td
                      >
                      <td class="text-center" style="font-size: 16px;"
                        >{data?.ast_uuid__ass_uuid__ast_hostname}</td
                      >
                      <td class="text-center" style="font-size: 16px;"
                        >{data?.ast_uuid__ass_uuid__ast_ipaddr}</td
                      >
                      <td class="text-center" style="font-size: 16px;"
                        >{data?.ast_uuid__ast_target__cct_target}</td
                      >
                      <!-- <td class="text-center">Y</td> -->
                      <td class="text-center" style="font-size: 16px;"
                        >{data?.ast_security_point > 0
                          ? `${data?.ast_security_point}%`
                          : "결과미등록"}</td
                      >
                    </tr>
                  {/each}
                {/if}
              </tbody>
            </table>
          </div>
          <!-- <div class="paginationWrap">
        <div class="pagination">
          <a href="" class="active">1</a>
          <a href="">2</a>
          <a href="">...</a>
          <a href="">4</a>
          <a href="">&gt;</a>
        </div>
      </div> -->
        </div>
      </div>
    </div>
  {/if}
</div>

<!--//Modal:자산 상세-->

{#if lastModal}
  <div class="modal-open-wrap">
    <dialog open on:close={() => (lastModal = false)}>
      <ModalPageForDetail bind:showModal={lastModal} bind:modalData />
    </dialog>
  </div>
{/if}

<style>
  * {
    font-size: 16px;
  }
  .modal-open-wrap {
    display: block;
    z-index: 99;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(167, 167, 167, 0.6);
  }
  dialog {
    position: fixed;
    top: 50%;
    left: 56%;
    transform: translate(-50%, -50%);
    width: 1103px;
    border: none;
    border-radius: 10px;
    background-color: white;
    padding: 20px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    animation: svelte-s7onsa-fadeIn 0.3s ease;
    z-index: 100;
  }

  /* Modal backdrop */
  dialog::backdrop {
    background: rgba(0, 0, 0, 0.5);
    animation: fadeInBackdrop 0.3s ease;
  }

  .tableForm input,
  .tableForm select {
    width: 348px;
  }

  .scroll-div {
    overflow: auto;
    height: calc(-175px + 100vh);
    padding-bottom: 60px;
  }

  .btnSave {
    width: 224px;
    height: 50px;
    justify-content: center;
  }

  .btnWrap {
    margin-top: 20px;
    width: 947px;
    justify-content: flex-end;
  }

  .progressbarWrap li {
    cursor: pointer;
  }

  .progress-info,
  .progress-info h4:hover {
    cursor: pointer;
    color: blue;
  }

  .progress-info h4.active {
    color: blue;
  }
  .last tr:hover {
    cursor: pointer;
    background-color: #f4f4f4;
    transition-duration: 0.3s;
  }

  .last thead {
    position: sticky; /* Make the header sticky */
    top: 0; /* Stick the header to the top */
    z-index: 10; /* Ensure the header is above the scrolling content */
    box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.4); /* Shadow effect for separation */
  }
  .modalWrap tr:hover {
    background-color: rgba(242, 242, 242, 1);
    cursor: pointer;
  }
</style>
