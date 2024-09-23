<script>
  import { getPlanDetailInformation } from "../../services/page1/projectDetail";
  import { getCCEResultUploadStatus } from "../../services/result/resultService";
  import { errorAlert } from "../../shared/sweetAlert";
  import { navigate } from "svelte-routing";
  import moment from "moment";
  import ModalDynamic from "../../shared/ModalDynamic.svelte";
  import ResultPopUp from "./ResultPopup.svelte";
  import Modal from "../../shared/Modal.svelte";

  export let projectIndex;

  let projectDetails = {};
  let assetsInfo = null;
  let modalData = null;

  let totalPercentage = 0;
  let showModal = false; 


  $: if (projectIndex) {
    updateProjectDetails();
  }

  async function updateProjectDetails() {
    try {
      console.log("projectIndex:", projectIndex);
      projectDetails = await getPlanDetailInformation(projectIndex);

      const totalY = projectDetails?.target_securitypoint.reduce((sum, item) => sum + item.y, 0);
      const maxY = projectDetails.target_securitypoint?.length * 100;
      totalPercentage = (totalY / maxY) * 100;


      // assets info data fetch
      assetsInfo = await getCCEResultUploadStatus(projectIndex);
      console.log("assetsInfo:", assetsInfo)

    } catch (err) {
      await errorAlert(err?.message);
      navigate(window.location?.pathname == '/' ? '/page1' : '/');
    }
  }

  // Mock Data for demonstration purposes
  let inspectionDetails = "유닉스: 11대, 윈도우 20대, 맥: 10대";
  let progress = "점검진행률: 진행완료 (28/28대, 100% 결과 수집)";
  let overallSecurityLevel = 80;

  // Data for charts
  let unixRegistration = 45;
  let networkRegistration = 65;
  let dbmsRegistration = 85;

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
    console.log("target_group_securitypoint:", target_group_securitypoint)
    const accountManagementYs = Object.values(target_group_securitypoint).flat()
        .filter(item => item.label === group)
        .map(item => item.y);

    const totalY = accountManagementYs.reduce((sum, value) => sum + value, 0);
    const data = (totalY / accountManagementYs.length).toFixed(2)
    
    const returndata = isNaN(data) ? 0 : parseInt(data);
    console.log("returndata:", returndata);
    return returndata
  };

  const calculateAllSecurityLevel = (target_group_securitypoint) => {
    const allItems = Object.values(target_group_securitypoint).flat();
    const totalY = allItems.reduce((sum, item) => sum + item.y, 0);

    const data = (totalY / allItems.length).toFixed(2)
    
    return isNaN(data) ? 0 : parseInt(data);
  }

  const calculateSecurityLevelByGroup = (target_group_securitypoint, group) => {
        const filteredItems = Object.entries(target_group_securitypoint)
            .filter(([key]) => group.includes(key))
            .flatMap(([, items]) => items);
        
        const totalY = filteredItems.reduce((sum, item) => sum + item.y, 0);
        const data = (totalY / filteredItems.length).toFixed(2)
        return isNaN(data) ? 0 : parseInt(data);
    };

</script>

<main>
  <div class="main-container">
    <div>
      <!-- {#if loading}
        <p>Loading...</p>
      {:else if errorMessage}
        <p>Error: {errorMessage}</p>
      {:else}
        <p>Project Details: {JSON.stringify(projectDetails)}</p>
      {/if} -->
    </div>
    {#if projectDetails?.ccp_title}
    <div class="container">
      <!-- Overview Section -->
      <h2>[개요]</h2>
      <div class="overview">
        <div class="first_cont">
          <div class="percentage1">
            <p><strong>보안수준</strong></p>
            <div class="security-level">
              <div class="score">{calculateAllSecurityLevel(projectDetails?.target_group_securitypoint)}%</div>
            </div>
          </div>
        </div>
        <div class="first_cont2">
          <div class="project-details">
            <p>제목: {projectDetails?.ccp_title}</p>
            <p>점검방법: {projectDetails?.recheck  == 0 ? '신규점겅검' : '이행점검'}</p>
            <p>점검대상: {projectDetails?.asg_index__asg_title}</p>
            <!-- <p>{inspectionDetails}</p> -->
            <p>점검항목: {projectDetails?.ccp_ruleset__ccg_group}</p>
            <p>생성자: {projectDetails?.plan_planer_info__user_name}</p>
            <p>진행상태: {projectDetails?.ccp_b_finalized ? '완료' : '진행 중'}</p>
            <p>점검일시: {moment(projectDetails?.plan_start_date).format('YYYY MM DD')} ~ { moment(projectDetails?.plan_end_date).format('YYYY MM DD')}</p>
            <p>점검실행: {projectDetails?.plan_execution_type ? '반복실행' : '즉시실행'}</p>
            <p>주기: {projectDetails?.plan_execute_interval_term}</p>
            <p>생성 규칙: {projectDetails?.plan_name_repeat_rule_type == 0 ? '현 점검 하위로 점검 자동 생성' : '반복실행시 마다 신규점검 자동 생성'}</p>
            {#if projectDetails?.fix_date_setup }
            <p>조치일정: {moment(projectDetails?.fix_start_date).format('YYYY MM DD')} ~ { moment(projectDetails?.fix_end_date).format('YYYY MM DD')}</p>
            {/if}
            <p>조치담당자: {projectDetails?.fix_conductor_info_id} </p>
            <p>{progress}</p>
           
            
            
            
          </div>
          <div class="actions">
            <button>결과등록</button>
            <button>결과조회</button>
            <button>변경</button>
            <button>삭제</button>
          </div>
        </div>
      </div>

      <!-- Registration Status Section -->
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
                d={calculatePieSlice(100 - totalPercentage, 100, 60, (totalPercentage / 100) * 2 * Math.PI)}
                fill="lightgrey" 
              ></path>
              <text x="0" y="0" text-anchor="middle" dominant-baseline="middle" font-size="20" fill="black">
                {totalPercentage}%
              </text>
            </svg>
          </div>

          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <div class="bar-charts" >
            {#if projectDetails.target_securitypoint.filter(ele => ele.label === 'UNIX')[0]?.['y']}
              <div class="bar" on:click="{() => {
                showModal = true;
                modalData = assetsInfo['assets_info'].filter(asset => asset.ast_uuid__ast_target__cct_target === 'UNIX')
              }}">
                <div class="label">UNIX</div>
                <div class="bar-fill" style="width: {unixRegistration}%;">
                  {projectDetails.target_securitypoint.filter(ele => ele.label === 'UNIX')[0]?.['y']}% 등록
                </div>
              </div>
            {/if}

            {#if projectDetails.target_securitypoint.filter(ele => ele.label === 'NETWORK')[0]?.['y']}
              <div class="bar" on:click="{() => {
                showModal = true;
                modalData = assetsInfo['assets_info'].filter(asset => asset.ast_uuid__ast_target__cct_target === 'NETWORK')
              }}">
                <div class="label">NETWORK</div>
                <div class="bar-fill" style="width: {networkRegistration}%;">
                  {projectDetails.target_securitypoint.filter(ele => ele.label === 'NETWORK')[0]?.['y']}% 등록
                </div>
              </div>
            {/if}

            {#if projectDetails.target_securitypoint.filter(ele => ele.label === 'DBMS')[0]?.['y']}
              <div class="bar" on:click="{() => {
                showModal = true;
                modalData = assetsInfo['assets_info'].filter(asset => asset.ast_uuid__ast_target__cct_target === 'DBMS')
              }}">
                <div class="label">DBMS</div>
                <div class="bar-fill" style="width: {dbmsRegistration}%;">
                  {projectDetails.target_securitypoint.filter(ele => ele.label === 'DBMS')[0]?.['y']}% 등록
                </div>
              </div>
           {/if}

           {#if projectDetails.target_securitypoint.filter(ele => ele.label === 'SECURITY')[0]?.['y']}
              <div class="bar" on:click="{() => {
                showModal = true;
                modalData = assetsInfo['assets_info'].filter(asset => asset.ast_uuid__ast_target__cct_target === 'SECURITY')
              }}">
                <div class="label">SECURITY</div>
                <div class="bar-fill" style="width: {dbmsRegistration}%;">
                  {projectDetails.target_securitypoint.filter(ele => ele.label === 'SECURITY')[0]?.['y']}% 등록
                </div>
              </div>
           {/if}

           {#if projectDetails.target_securitypoint.filter(ele => ele.label === 'WINDOWS')[0]?.['y']}
              <div class="bar" on:click="{() => {
                showModal = true;
                modalData = assetsInfo['assets_info'].filter(asset => asset.ast_uuid__ast_target__cct_target === 'SECURITY')
              }}">
                <div class="label">WINDOWS</div>
                <div class="bar-fill" style="width: {dbmsRegistration}%;">
                  {projectDetails.target_securitypoint.filter(ele => ele.label === 'WINDOWS')[0]?.['y']}% 등록
                </div>
              </div>
           {/if}
            
            
            
          </div>
        </div>
        {:else}
          <h1>결과 미등록</h1>
        {/if}
      </div>

      <!-- Security Level Section -->
      <h2>[보안수준]</h2>
      <div class="security-level-section">
        <div class="third_cont">
          <div>
            <h2>전체보안수준: {calculateAllSecurityLevel(projectDetails?.target_group_securitypoint)}%</h2>
            <h4>Network: {calculateSecurityLevelByGroup(projectDetails?.target_group_securitypoint, 'NETWORK')}%</h4>
            <h4>Security: {calculateSecurityLevelByGroup(projectDetails?.target_group_securitypoint, 'SECURITY')}%</h4>
            <h4>Unix: {calculateSecurityLevelByGroup(projectDetails?.target_group_securitypoint, 'UNIX')}%</h4>
            <h4>Windows: {calculateSecurityLevelByGroup(projectDetails?.target_group_securitypoint, 'WINDOWS')}%</h4>
          </div>
        </div>
        <div class="bar-charts2">
            <div class="bar bar-second">
              <div class="bar-fill2" style="height: {calculateSecurityStatistic(projectDetails?.target_group_securitypoint, "계정 관리") == 0 ? 1 : calculateSecurityStatistic(projectDetails?.target_group_securitypoint, "계정 관리") - 10  }%;">
                {calculateSecurityStatistic(projectDetails?.target_group_securitypoint, "계정 관리") == 0 ? '' : `${calculateSecurityStatistic(projectDetails?.target_group_securitypoint, "계정 관리")}%`}
              </div>
              <div class="label">계정 관리</div>
            </div>
            <div class="bar bar-second">
              <div class="bar-fill2" style="height: {calculateSecurityStatistic(projectDetails?.target_group_securitypoint, "접근 관리") == 0 ? 1 : calculateSecurityStatistic(projectDetails?.target_group_securitypoint, "접근 관리") - 10  }%;">
                {calculateSecurityStatistic(projectDetails?.target_group_securitypoint, "접근 관리") == 0 ? '' : `${calculateSecurityStatistic(projectDetails?.target_group_securitypoint, "접근 관리")}%`}
              </div>
              <div class="label">접근 관리</div>
            </div>
            <div class="bar bar-second">
              <div class="bar-fill2" style="height: {calculateSecurityStatistic(projectDetails?.target_group_securitypoint, "패치 관리") == 0 ? 1 : calculateSecurityStatistic(projectDetails?.target_group_securitypoint, "패치 관리") - 10  }%;">
                {calculateSecurityStatistic(projectDetails?.target_group_securitypoint, "패치 관리") == 0 ? '' : `${calculateSecurityStatistic(projectDetails?.target_group_securitypoint, "패치 관리")}%`}
              </div>
              <div class="label">패치 관리</div>
            </div>
            <div class="bar bar-second">
              <div class="bar-fill2" style="height: {calculateSecurityStatistic(projectDetails?.target_group_securitypoint, "로그 관리") == 0 ? 1 : calculateSecurityStatistic(projectDetails?.target_group_securitypoint, "로그 관리") - 10  }%;">
                {calculateSecurityStatistic(projectDetails?.target_group_securitypoint, "로그 관리") == 0 ? '' : `${calculateSecurityStatistic(projectDetails?.target_group_securitypoint, "로그 관리")}%`}
              </div>
              <div class="label">로그 관리</div>
            </div>

            <div class="bar bar-second">
              <div class="bar-fill2" style="height: {calculateSecurityStatistic(projectDetails?.target_group_securitypoint, "기능 관리") == 0 ? 1 : calculateSecurityStatistic(projectDetails?.target_group_securitypoint, "기능 관리") - 10 }%;">
                {calculateSecurityStatistic(projectDetails?.target_group_securitypoint, "기능 관리") == 0 ? '' : `${calculateSecurityStatistic(projectDetails?.target_group_securitypoint, "기능 관리")}%`}
              </div>
              <div class="label">기능 관리</div>
            </div>
        </div>
      </div>

      <!-- Critical Weaknesses Section -->
     
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
  <ModalDynamic bind:showModal modalWidth={60} >
    <ResultPopUp bind:modalData />
  </ModalDynamic>
  {/if}
</main>

<style>
  /* Main container centered and adjusted width */
  .main-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
  .third_cont {
    align-items: center;
    width: 30%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .first_cont {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30%;
  }
  .first_cont2 {
    display: flex;
    width: 70%;
    justify-content: space-between;
    align-items: center;
  }
  .container {
    width: 100%; /* Optional max-width for larger screens */
    padding: 10px; /* Reduced padding from 20px to 10px */
    background-color: #f7f9fb;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    font-family: Arial, sans-serif;
    font-size: 12px; /* Set base font size to 12px */
    /* Reduced height */
    height: auto; /* Let the height adjust based on content */
  }

  .overview,
  .registration-status,
  .security-level-section,
  .critical-weaknesses {
    margin-bottom: 15px; /* Reduced margin */
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    background-color: #fafafa;
    padding: 10px; /* Added padding for content */
  }

  h2 {
    margin-bottom: 10px; /* Reduced margin */
    font-size: 16px; /* Adjusted font size */
    color: #333;
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 5px; /* Reduced padding */
  }

  .overview {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .percentage1 {
    width: 60px; /* Reduced size */
    height: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-right: 10px; /* Reduced margin */
  }

  .security-level {
    background-color: #4caf50;
    color: white;
    width: 60px; /* Reduced size */
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 14px; /* Adjusted font size */
    border-radius: 50%;
    box-shadow:
      inset 0 0 25px 3px rgba(0, 0, 0, 0.1),
      inset 0 1px 0.5px 0.5px rgba(255, 255, 255, 0.5),
      inset 0 -1px 0.5px rgba(0, 0, 0, 0.1);
  }

  .project-details p {
    margin: 3px 0; /* Reduced margin */
    font-size: 12px;
    color: #555;
  }

  .actions {
    display: flex;
    flex-direction: column;
    gap: 5px; /* Reduced gap */
  }

  .actions button {
    padding: 6px 10px; /* Reduced padding */
    background-color: #4682b4;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 12px; /* Adjusted font size */
    transition:
      background-color 0.3s ease,
      transform 0.3s ease;
  }

  .actions button:hover {
    background-color: #1565c0;
    transform: translateY(-2px);
  }

  .status {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .pie-chart {
    width: 30%; /* Reduced size */
    height: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .chart-label {
    margin-bottom: 5px; /* Reduced margin */
    font-weight: bold;
    font-size: 12px; /* Adjusted font size */
    color: #555;
  }

  .bar-charts,
  .bar-charts2 {
    flex-grow: 1;
    padding-left: 10px;
    width: 70%; 
   
  }

  .bar-charts2 {
    height: 300px;
    display: flex;
    flex-direction: row;
  }

  .bar {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 5px; /* Reduced margin */
    cursor: pointer;
  }

  .bar-second {
    margin-right: 50px;
    flex-direction: column;
    justify-content: flex-end;
  }

  .bar .label {
    width: 60px; /* Reduced width */
    font-weight: bold;
    font-size: 12px; /* Adjusted font size */
    color: #555;
    text-align: center;
  }

  .bar .bar-fill {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 30px; /* Reduced height */
    background-color: #4caf50;
    color: white;
    text-align: right;
    padding-right: 10px; /* Reduced padding */
    line-height: 15px;
    border-radius: 5px;
    font-size: 12px; /* Adjusted font size */
  }

  .bar .bar-fill2 {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 15px; 
    width: 70px;
    background-color: #2196f3;
    color: white;
    text-align: right;
    padding-right: 3px; 
    line-height: 15px;
    border-radius: 5px;
    font-size: 12px; 
  }

  .security-level-section p {
    margin: 3px 0; /* Reduced margin */
    font-size: 12px; /* Adjusted font size */
    color: #555;
  }
  .security-level-section {
    display: flex;
    flex-direction: row;
    justify-content: center;
    max-width: 100%;
    align-items: center;
  }
  .critical-weaknesses .bar-chart {
    padding: 5px; /* Reduced padding */
    color: #555;
    font-size: 12px; /* Adjusted font size */
  }

  .critical-weaknesses .table_container {
    overflow-y: auto;
    overflow-x: hidden;
    height: 500px;
    width: 100%;
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
    background-color: #005fa3;
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
</style>
