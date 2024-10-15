<script>
  import { getPlanDetailInformation } from "../../services/page1/projectDetail";
  import { getCCEResultUploadStatus } from "../../services/result/resultService";
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

  export let projectIndex;

  let projectDetails = {};
  let assetsInfo = null;
  let modalData = null;

  let planOptions = [];
  let planList = [];
  let assetGroup = [];

  let totalPercentage = 0;
  let showModal = false;

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
      console.log("planOptions:", planOptions);

      planList = await getPlanLists();

      assetGroup = await getAssetGroup();
      console.log("assetGroup:", assetGroup);
    } catch (err) {
      console.error("Error loading asset groups:", err);
    }
  });

  $: if (projectIndex) {
    updateProjectDetails();
  }

  async function updateProjectDetails() {
    try {
      console.log("projectIndex:", projectIndex);
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
      console.log("sendData:", sendData);

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
    } catch (error) {
      console.error("Error updateInfoHandler:", error);
      errorAlert(error?.message);
    }
  };

  function calculatePieSlice(value, total, radius, startAngle) {
    const angle = (value / total) * 2 * Math.PI;
    const x1 = radius * Math.cos(startAngle);
    const y1 = radius * Math.sin(startAngle);
    const x2 = radius * Math.cos(startAngle + angle);
    const y2 = radius * Math.sin(startAngle + angle);
    const largeArcFlag = angle > Math.PI ? 1 : 0;

    return `
      M 0 0 
      L ${x1} ${y1} 
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} 
      Z
    `;
  }

  const calculateSecurityStatistic = (target_group_securitypoint, group) => {
    const accountManagementYs = Object.values(target_group_securitypoint)
      .flat()
      .filter((item) => item.label === group)
      .map((item) => item.y);

    const totalY = accountManagementYs.reduce((sum, value) => sum + value, 0);
    const data = (totalY / accountManagementYs.length).toFixed(2);

    const returndata = isNaN(data) ? 0 : parseInt(data);
    return returndata;
  };

  const calculateAllSecurityLevel = (target_group_securitypoint) => {
    const allItems = Object.values(target_group_securitypoint).flat();
    const totalY = allItems.reduce((sum, item) => sum + item.y, 0);

    const data = (totalY / allItems.length).toFixed(2);

    return isNaN(data) ? 0 : parseInt(data);
  };

  const calculateSecurityLevelByGroup = (target_group_securitypoint, group) => {
    const filteredItems = Object.entries(target_group_securitypoint)
      .filter(([key]) => group.includes(key))
      .flatMap(([, items]) => items);

    const totalY = filteredItems.reduce((sum, item) => sum + item.y, 0);
    const data = (totalY / filteredItems.length).toFixed(2);
    return isNaN(data) ? 0 : parseInt(data);
  };

  $: {
    console.log("updateInfo:", updateInfo);
  }
</script>

<!-- <main>
  <div class="main-container">
    {#if projectDetails?.ccp_title}
      <div class="container">
        <h2>[개요]</h2>
        <div class="overview">
          <div class="first_cont">
            <div class="percentage1">
              <p><strong>보안수준</strong></p>
              <div class="security-level">
                <div class="score">
                  {projectDetails?.ccp_security_point > 0
                    ? projectDetails?.ccp_security_point
                    : 0}%
                </div>
              </div>
            </div>
          </div>
          <div class="first_cont2">
            <div class="project-details">
              <p>
                제목: <input type="text" bind:value={updateInfo["ccp_title"]} />
              </p>

              <p>
                점검대상:
                <select bind:value={updateInfo["asg_index"]}>
                  <option value="" selected disabled>자산 그룹목록</option>

                  {#if planOptions.asset_group}
                    {#each planOptions.asset_group as asset}
                      <option value={asset.asg_index}>
                        {asset.asg_title}
                      </option>
                    {/each}
                  {/if}
                </select>
              </p>
              <p>
                점검항목:

                <select bind:value={updateInfo["ccp_ruleset"]}>
                  <option value="" selected disabled>점검항목 목록</option>
                  {#if planOptions.checklist_group}
                    {#each planOptions.checklist_group as item}
                      <option value={item.ccg_index}>
                        {item.ccg_group}
                      </option>
                    {/each}
                  {/if}
                </select>
              </p>
              <p>
                점검담당자:

                <select bind:value={updateInfo["plan_planer_info"]}>
                  <option value="" selected disabled>선택</option>
                  {#if planOptions.member_group}
                    {#each planOptions.member_group as member}
                      <option value={member.user_index}>
                        {member.user_name}
                      </option>
                    {/each}
                  {/if}
                </select>
              </p>
              <p>
                진행상태: {projectDetails?.ccp_b_finalized ? "완료" : "진행 중"}
              </p>
              <p>
                점검방법:
                <select bind:value={updateInfo["recheck"]}>
                  <option value={0}> 신규점겅검 </option>
                  <option value={1}> 이행점검 </option>
                </select>
              </p>
              {#if updateInfo?.recheck === 1}
                <p>
                  이전점검:
                  <select bind:value={updateInfo["recheck_pno"]}>
                    <option value="" selected disabled>이전 점검플랜명</option>

                    {#if planList}
                      {#each planList as plan}
                        <option value={plan.ccp_index}>
                          {plan.ccp_title}
                        </option>
                      {/each}
                    {/if}
                  </select>
                </p>
              {/if}
              <p>
                점검일시:
                <input
                  type="datetime-local"
                  bind:value={updateInfo["plan_start_date"]}
                />
                ~
                <input
                  type="datetime-local"
                  bind:value={updateInfo["plan_end_date"]}
                />
              </p>
              <p>
                점검스케쥴:

                <select>
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
              </p>
              {#if updateInfo?.fix_date_setup}
                <p>
                  조치일정:

                  <input
                    type="date"
                    bind:value={updateInfo["fix_start_date"]}
                  />
                  ~
                  <input type="date" bind:value={updateInfo["fix_end_date"]} />
                </p>
              {/if}
              <p>
                조치담당자:

                <select bind:value={updateInfo["fix_conductor_info"]}>
                  <option value="" selected disabled>선택</option>
                  {#if planOptions.member_group}
                    {#each planOptions.member_group as member}
                      <option value={member.user_index}>
                        {member.user_name}
                      </option>
                    {/each}
                  {/if}
                </select>
              </p>
              <p>
                점검정보파일 재업로드: <input
                  type="file"
                  on:change={(e) => {
                    updateInfo = {
                      ...updateInfo,
                      assessment_command: e.target.files[0],
                    };
                  }}
                />
              </p>
            </div>
          </div>
        </div>
        <div class="actions">
          <button on:click={() => updateInfoHandler(updateInfo)}>
            변경저장
          </button>
        </div>

        <h2>[결과 등록 현황]</h2>
        <div class="registration-status">
          {#if projectDetails.target_securitypoint.length !== 0}
            <div class="status">
              <div class="pie-chart">
                <div class="chart-label">전체등록현황</div>
                <svg width="120" height="120" viewBox="-60 -60 120 120">
                  <path
                    d={calculatePieSlice(totalPercentage, 100, 60, 0)}
                    fill={"#4caf50"}
                  ></path>
                  <path
                    d={calculatePieSlice(
                      100 - totalPercentage,
                      100,
                      60,
                      (totalPercentage / 100) * 2 * Math.PI,
                    )}
                    fill="lightgrey"
                  ></path>
                  <text
                    x="0"
                    y="0"
                    text-anchor="middle"
                    dominant-baseline="middle"
                    font-size="20"
                    fill="black"
                  >
                    {totalPercentage}%
                  </text>
                </svg>
              </div>

              <div class="bar-charts">
                {#if projectDetails.target_securitypoint.filter((ele) => ele.label === "UNIX")[0]?.["y"]}
                  <div
                    class="bar"
                    on:click={() => {
                      showModal = true;
                      modalData = assetsInfo["assets_info"].filter(
                        (asset) =>
                          asset.ast_uuid__ast_target__cct_target === "UNIX",
                      );
                    }}
                  >
                    <div class="label">UNIX</div>
                    <div
                      class="bar-fill"
                      style="width: {projectDetails.target_securitypoint.filter(
                        (ele) => ele.label === 'UNIX',
                      )[0]?.['y']}%;"
                    >
                      {projectDetails.target_securitypoint.filter(
                        (ele) => ele.label === "UNIX",
                      )[0]?.["y"]}% 등록
                    </div>
                  </div>
                {/if}

                {#if projectDetails.target_securitypoint.filter((ele) => ele.label === "NETWORK")[0]?.["y"]}
                  <div
                    class="bar"
                    on:click={() => {
                      showModal = true;
                      modalData = assetsInfo["assets_info"].filter(
                        (asset) =>
                          asset.ast_uuid__ast_target__cct_target === "NETWORK",
                      );
                    }}
                  >
                    <div class="label">NETWORK</div>
                    <div
                      class="bar-fill"
                      style="width: {projectDetails.target_securitypoint.filter(
                        (ele) => ele.label === 'NETWORK',
                      )[0]?.['y']}%;"
                    >
                      {projectDetails.target_securitypoint.filter(
                        (ele) => ele.label === "NETWORK",
                      )[0]?.["y"]}% 등록
                    </div>
                  </div>
                {/if}

                {#if projectDetails.target_securitypoint.filter((ele) => ele.label === "DBMS")[0]?.["y"]}
                  <div
                    class="bar"
                    on:click={() => {
                      showModal = true;
                      modalData = assetsInfo["assets_info"].filter(
                        (asset) =>
                          asset.ast_uuid__ast_target__cct_target === "DBMS",
                      );
                    }}
                  >
                    <div class="label">DBMS</div>
                    <div
                      class="bar-fill"
                      style="width: {projectDetails.target_securitypoint.filter(
                        (ele) => ele.label === 'DBMS',
                      )[0]?.['y']}%;"
                    >
                      {projectDetails.target_securitypoint.filter(
                        (ele) => ele.label === "DBMS",
                      )[0]?.["y"]}% 등록
                    </div>
                  </div>
                {/if}

                {#if projectDetails.target_securitypoint.filter((ele) => ele.label === "SECURITY")[0]?.["y"]}
                  <div
                    class="bar"
                    on:click={() => {
                      showModal = true;
                      modalData = assetsInfo["assets_info"].filter(
                        (asset) =>
                          asset.ast_uuid__ast_target__cct_target === "SECURITY",
                      );
                    }}
                  >
                    <div class="label">SECURITY</div>
                    <div
                      class="bar-fill"
                      style="width: {projectDetails.target_securitypoint.filter(
                        (ele) => ele.label === 'SECURITY',
                      )[0]?.['y']}%;"
                    >
                      {projectDetails.target_securitypoint.filter(
                        (ele) => ele.label === "SECURITY",
                      )[0]?.["y"]}% 등록
                    </div>
                  </div>
                {/if}

                {#if projectDetails.target_securitypoint.filter((ele) => ele.label === "WINDOWS")[0]?.["y"]}
                  <div
                    class="bar"
                    on:click={() => {
                      showModal = true;
                      modalData = assetsInfo["assets_info"].filter(
                        (asset) =>
                          asset.ast_uuid__ast_target__cct_target === "SECURITY",
                      );
                    }}
                  >
                    <div class="label">WINDOWS</div>
                    <div
                      class="bar-fill"
                      style="width: {projectDetails.target_securitypoint.filter(
                        (ele) => ele.label === 'WINDOWS',
                      )[0]?.['y']}%;"
                    >
                      {projectDetails.target_securitypoint.filter(
                        (ele) => ele.label === "WINDOWS",
                      )[0]?.["y"]}% 등록
                    </div>
                  </div>
                {/if}
              </div>
            </div>
          {:else}
            <h1>결과 미등록</h1>
          {/if}
        </div>

        <h2>[보안수준]</h2>
        <div class="security-level-section">
          <div class="third_cont">
            <div>
              <h2>
                전체보안수준: {calculateAllSecurityLevel(
                  projectDetails?.target_group_securitypoint,
                )}%
              </h2>
              <h4>
                Network: {calculateSecurityLevelByGroup(
                  projectDetails?.target_group_securitypoint,
                  "NETWORK",
                )}%
              </h4>
              <h4>
                Security: {calculateSecurityLevelByGroup(
                  projectDetails?.target_group_securitypoint,
                  "SECURITY",
                )}%
              </h4>
              <h4>
                Unix: {calculateSecurityLevelByGroup(
                  projectDetails?.target_group_securitypoint,
                  "UNIX",
                )}%
              </h4>
              <h4>
                Windows: {calculateSecurityLevelByGroup(
                  projectDetails?.target_group_securitypoint,
                  "WINDOWS",
                )}%
              </h4>
            </div>
          </div>
          <div class="bar-charts2">
            <div class="bar bar-second">
              <div
                class="bar-fill2"
                style="height: {calculateSecurityStatistic(
                  projectDetails?.target_group_securitypoint,
                  '계정 관리',
                ) == 0
                  ? 1
                  : calculateSecurityStatistic(
                      projectDetails?.target_group_securitypoint,
                      '계정 관리',
                    ) - 10}%;"
              >
                {calculateSecurityStatistic(
                  projectDetails?.target_group_securitypoint,
                  "계정 관리",
                ) == 0
                  ? ""
                  : `${calculateSecurityStatistic(projectDetails?.target_group_securitypoint, "계정 관리")}%`}
              </div>
              <div class="label">계정 관리</div>
            </div>
            <div class="bar bar-second">
              <div
                class="bar-fill2"
                style="height: {calculateSecurityStatistic(
                  projectDetails?.target_group_securitypoint,
                  '접근 관리',
                ) == 0
                  ? 1
                  : calculateSecurityStatistic(
                      projectDetails?.target_group_securitypoint,
                      '접근 관리',
                    ) - 10}%;"
              >
                {calculateSecurityStatistic(
                  projectDetails?.target_group_securitypoint,
                  "접근 관리",
                ) == 0
                  ? ""
                  : `${calculateSecurityStatistic(projectDetails?.target_group_securitypoint, "접근 관리")}%`}
              </div>
              <div class="label">접근 관리</div>
            </div>
            <div class="bar bar-second">
              <div
                class="bar-fill2"
                style="height: {calculateSecurityStatistic(
                  projectDetails?.target_group_securitypoint,
                  '패치 관리',
                ) == 0
                  ? 1
                  : calculateSecurityStatistic(
                      projectDetails?.target_group_securitypoint,
                      '패치 관리',
                    ) - 10}%;"
              >
                {calculateSecurityStatistic(
                  projectDetails?.target_group_securitypoint,
                  "패치 관리",
                ) == 0
                  ? ""
                  : `${calculateSecurityStatistic(projectDetails?.target_group_securitypoint, "패치 관리")}%`}
              </div>
              <div class="label">패치 관리</div>
            </div>
            <div class="bar bar-second">
              <div
                class="bar-fill2"
                style="height: {calculateSecurityStatistic(
                  projectDetails?.target_group_securitypoint,
                  '로그 관리',
                ) == 0
                  ? 1
                  : calculateSecurityStatistic(
                      projectDetails?.target_group_securitypoint,
                      '로그 관리',
                    ) - 10}%;"
              >
                {calculateSecurityStatistic(
                  projectDetails?.target_group_securitypoint,
                  "로그 관리",
                ) == 0
                  ? ""
                  : `${calculateSecurityStatistic(projectDetails?.target_group_securitypoint, "로그 관리")}%`}
              </div>
              <div class="label">로그 관리</div>
            </div>

            <div class="bar bar-second">
              <div
                class="bar-fill2"
                style="height: {calculateSecurityStatistic(
                  projectDetails?.target_group_securitypoint,
                  '기능 관리',
                ) == 0
                  ? 1
                  : calculateSecurityStatistic(
                      projectDetails?.target_group_securitypoint,
                      '기능 관리',
                    ) - 10}%;"
              >
                {calculateSecurityStatistic(
                  projectDetails?.target_group_securitypoint,
                  "기능 관리",
                ) == 0
                  ? ""
                  : `${calculateSecurityStatistic(projectDetails?.target_group_securitypoint, "기능 관리")}%`}
              </div>
              <div class="label">기능 관리</div>
            </div>
          </div>
        </div>

        <h2>[주요 취약점]</h2>
        <div class="critical-weaknesses">
          {#if projectDetails?.vuln_list?.length !== 0}
            <div class="table_container">
              <table>
                <thead>
                  <tr>
                    <th style="width: 5%;">번호</th>
                    <th style="width: 20%;">대상</th>
                    <th style="width: 15%;">점검그룹</th>
                    <th style="width: 30%;">점검항목</th>
                    <th style="width: 15%;">위험도</th>
                  </tr>
                </thead>
                <tbody>
                  {#each projectDetails?.vuln_list as vuln, index}
                    <tr>
                      <td>{index + 1}</td>
                      <td>{vuln?.cct_index__cct_target}</td>
                      <td>{vuln?.ccr_item_no__ccc_item_group}</td>
                      <td>{vuln?.ccr_item_no__ccc_item_title}</td>
                      <td>{vuln?.ccr_item_no__ccc_item_level}</td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          {:else}
            <h1>주요 취약점 미등록</h1>
          {/if}
        </div>
      </div>
    {/if}
  </div>

  {#if modalData}
    <ModalDynamic
      bind:showModal
      modalWidth={60}
      modalHeight={modalData?.length > 10 ? 70 : null}
    >
      <ResultPopUp bind:modalData />
    </ModalDynamic>
  {/if}
</main> -->

<section class="rowContents">
  <div class="graphWrap">
    <article class="contentArea securityWrap">
      <h4 class="title border">보안점수</h4>
      <div class="circle" data-percent="80" data-offset="345">
        <svg width="" height="" viewBox="0 0 139 139">
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
            stroke="#0067ff"
            stroke-width="18"
            fill="none"
            stroke-dasharray="345"
            stroke-linecap="round"
            transform="rotate(-90 75 75)"
          />
        </svg>
        <div class="percent">
          <span>80%</span>
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
        <svg width="" height="" viewBox="0 0 139 139">
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
            stroke="#0067ff"
            stroke-width="18"
            fill="none"
            stroke-dasharray="345"
            stroke-linecap="round"
            transform="rotate(-90 75 75)"
          />
        </svg>
        <div class="percent">
          <span>75%</span>
        </div>
      </div>
      <div>
        <ul class="progressbarWrap result">
          <li onclick="modalOpen('detail')">
            <div class="progress-info">
              <h4>UNIX</h4>
              <span>70%</span>
            </div>
            <div class="progress light">
              <div class="progress-bar orange" style="width: 70%;"></div>
            </div>
          </li>
          <li onclick="modalOpen('detail')">
            <div class="progress-info">
              <h4>UNIX</h4>
              <span>70%</span>
            </div>
            <div class="progress light">
              <div class="progress-bar orange" style="width: 70%;"></div>
            </div>
          </li>
          <li onclick="modalOpen('detail')">
            <div class="progress-info">
              <h4>UNIX</h4>
              <span>70%</span>
            </div>
            <div class="progress light">
              <div class="progress-bar orange" style="width: 70%;"></div>
            </div>
          </li>
        </ul>
        <div class="slidePager">
          <a href="#" class="active"></a>
          <a href="#"></a>
          <a href="#"></a>
        </div>
      </div>
    </article>
  </div>
  <article class="contentArea">
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
              type="text"
              placeholder="점검플랜명"
              value="프로젝트1 어쩌구..저쩌구…"
            />
          </td>
        </tr>
        <tr>
          <th>점검대상</th>
          <td colspan="3">
            <input
              type="text"
              placeholder="생성자"
              value="자산그룹1 (총 28대) (유닉스:11대, 윈도우 20대, PC : 100대"
            />
          </td>
        </tr>
        <tr>
          <th>점검항목</th>
          <td colspan="3">
            <input type="text" placeholder="생성자" value="체크리스트 11번째" />
          </td>
        </tr>
        <tr>
          <th>생성자</th>
          <td colspan="3">
            <input type="text" placeholder="생성자" value="홍길동" />
          </td>
        </tr>
        <tr>
          <th>진행상태</th>
          <td colspan="3">
            <input
              type="text"
              placeholder="생성자"
              disabled
              value="점검진행 진행완료 ( 28/28대, 100% 결과 수집 )"
            />
          </td>
        </tr>
        <tr>
          <th>점검방법</th>
          <td>
            <select>
              <option>신규점검</option>
              <option selected>이행점검</option>
            </select>
          </td>
          <th>이전점검</th>
          <td>
            <input type="text" placeholder="생성자" value="프로젝트명" />
          </td>
        </tr>
        <tr>
          <th>점검담당자</th>
          <td colspan="3">
            <input type="text" placeholder="생성자" value="홍길동" />
          </td>
        </tr>
        <tr>
          <th>점검일시</th>
          <td colspan="3">
            <div class="dateWrap">
              <div class="date">
                <input type="text" class="datepicker" placeholder="시작일시" />
                <img src="./assets/images/icon/date.svg" />
              </div>
              <img src="./assets/images/icon/dash.svg" />
              <div class="date">
                <input type="text" class="datepicker" placeholder="종료일시" />
                <img src="./assets/images/icon/date.svg" />
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <th>점검스케쥴</th>
          <td colspan="3">
            <input
              type="text"
              placeholder="생성자"
              value="반복수행 / 어쩌구..저저구…"
            />
          </td>
        </tr>
        <tr>
          <th>조치일정</th>
          <td colspan="3">
            <div class="dateWrap">
              <div class="date">
                <input type="text" class="datepicker" placeholder="조치일정" />
                <img src="./assets/images/icon/date.svg" />
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <th>조치담당자</th>
          <td colspan="3">
            <input type="text" placeholder="생성자" value="홍길동" />
          </td>
        </tr>
        <tr>
          <th>점검정보파일<br />재업로드</th>
          <td colspan="2">
            <div class="upload-section">
              <label for="file-upload" class="file-label">엑셀파일업로드</label>
              <input
                type="file"
                id="file-upload"
                accept=".xls,.xlsx"
                class="file-input"
              />
              <button id="upload-btn" class="upload-btn btn btnPrimary"
                >Upload</button
              >
            </div>
          </td>
          <td class="flex btnWrap">
            <button
              type="button"
              class="btn btnBlue btnSave"
              onclick="modalOpen('alert')">변경저장</button
            >
          </td>
        </tr>
      </tbody>
    </table>
  </article>
</section>
<section class="rowContents">
  <article class="contentArea securityLevel">
    <h4 class="title border">보안수준</h4>
    <div class="flex">
      <div class="circleGraph">
        <div class="summary">
          <h6>80%</h6>
          <span>전체보안수준</span>
        </div>

        <div class="circle" data-percent="80" data-offset="345">
          <svg width="" height="" viewBox="0 0 139 139">
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
              stroke="#0067ff"
              stroke-width="18"
              fill="none"
              stroke-dasharray="345"
              stroke-linecap="round"
              transform="rotate(-90 75 75)"
            />
          </svg>
          <div class="percent">
            <span><img src="./assets/images/icon/guard.svg" /></span>
          </div>
        </div>
      </div>

      <div class="progressSection">
        <ul class="progressbarWrap">
          <li>
            <div class="progress-info">
              <h4>UNIX</h4>
              <span>30%</span>
            </div>
            <div class="progress">
              <div class="progress-bar blue" style="width: 30%;"></div>
            </div>
          </li>
          <li>
            <div class="progress-info">
              <h4>WINDOWS</h4>
              <span>50%</span>
            </div>
            <div class="progress">
              <div class="progress-bar blue" style="width: 50%;"></div>
            </div>
          </li>
          <li>
            <div class="progress-info">
              <h4>예시항목</h4>
              <span>50%</span>
            </div>
            <div class="progress">
              <div class="progress-bar blue" style="width: 50%;"></div>
            </div>
          </li>
        </ul>
        <div class="slidePager">
          <a href="#" class="active"></a>
          <a href="#"></a>
          <a href="#"></a>
        </div>
      </div>

      <div class="progressSection">
        <ul class="progressbarWrap">
          <li>
            <div class="progress-info">
              <h4>계정관리</h4>
              <span>10%</span>
            </div>
            <div class="progress">
              <div class="progress-bar blue" style="width: 10%;"></div>
            </div>
          </li>
          <li>
            <div class="progress-info">
              <h4>서비스관리</h4>
              <span>40%</span>
            </div>
            <div class="progress">
              <div class="progress-bar blue" style="width: 40%;"></div>
            </div>
          </li>
          <li>
            <div class="progress-info">
              <h4>항목</h4>
              <span>70%</span>
            </div>
            <div class="progress">
              <div class="progress-bar blue" style="width: 70%;"></div>
            </div>
          </li>
        </ul>
        <div class="slidePager">
          <a href="#" class="active"></a>
          <a href="#"></a>
          <a href="#"></a>
        </div>
      </div>
    </div>
  </article>
</section>

<section class="rowContents">
  <article class="contentArea securityVulnerability">
    <h4 class="title border">주요 취약점</h4>
    <div class="tableListWrap">
      <table class="tableList hdBorder">
        <colgroup>
          <col style="width:60px;" />
          <col style="width:122px;" />
          <col style="width:220px;" />
          <col />
          <col />
          <col style="width:100px;" />
        </colgroup>
        <thead>
          <tr>
            <th>번호</th>
            <th>호스트명</th>
            <th>항목</th>
            <th>점검항목</th>
            <th>시스템상태</th>
            <th class="text-center">점검결과</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="text-center">2</td>
            <td>User_L2_51</td>
            <td>[N-01] 패스워드 설정</td>
            <td>
              <div>양호: 기본 패스워드를 변경한 경우</div>
              <div>
                취약: 기본 패스워드를 변경하지 않거나 패스워드를 설정하지 않은
                경우
              </div>
            </td>
            <td>계정목록(동일패스워드 없음)</td>
            <td class="text-center"
              ><span class="badge badgePrimary">양호</span></td
            >
          </tr>
          <tr>
            <td class="text-center">1</td>
            <td>User_L2_51</td>
            <td>[N-01] 패스워드 설정</td>
            <td>
              <div>양호: 기본 패스워드를 변경한 경우</div>
              <div>
                취약: 기본 패스워드를 변경하지 않거나 패스워드를 설정하지 않은
                경우
              </div>
            </td>
            <td>계정목록(동일패스워드 없음)</td>
            <td class="text-center">
              <span class="badge badgeGreen">수동점검</span>
              <!--취약일 경우 badgeRed 로 표시-->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="paginationWrap">
      <div class="pagination">
        <!-- <a href="">&lt;</a> -->
        <a href="" class="active">1</a>
        <a href="">2</a>
        <a href="">...</a>
        <a href="">4</a>
        <a href="">&gt;</a>
      </div>
    </div>
  </article>
</section>

<!--Modal:초기화-->
<div class="modalWrap alert">
  <div class="modalContents small">
    <div class="contents">
      <div class="closeWrap">
        <button type="button" class="btnImg" onclick="modalOpen('alert')"
          ><img src="./assets/images/icon/close.svg" /></button
        >
      </div>
      <div class="msg">변경저장할 경우 이전 정보가 모두 초기화됩니다.</div>
      <div class="flex bottom-buttons normal">
        <button
          type="button"
          class="btn btnDefault"
          onclick="modalOpen('alert')">취소</button
        >
        <button type="button" class="btn btnBlue" onclick="modalOpen('alert')"
          >확인</button
        >
      </div>
    </div>
  </div>
</div>

<!--//Modal:초기화-->
