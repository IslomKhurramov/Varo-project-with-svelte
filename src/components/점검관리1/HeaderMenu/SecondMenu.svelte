<script>
  import { onMount } from "svelte";
  import {
    getOptionsForNewPlan,
    getPlanLists,
  } from "../../../services/page1/newInspection";
  import Modal from "../../../shared/Modal.svelte";
  import ModalPage from "../ModalPage.svelte";
  import {
    getViewPlanResults,
    getViewPlanResultSearch,
  } from "../../../services/result/resultService";

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

  let search = {
    plan_index: "",
    assessment_target: "",
    hostname: "",
    checklist_item_no: "",
    check_result: "",
    show_option: "",
  };

  // search
  let searchFilters;
  let targets;
  let assets;
  let checklist;
  let results;

  // data
  let resultData;

  onMount(async () => {
    searchFilters = await getViewPlanResultSearch();
  });

  const searchDataHandler = async () => {
    resultData = await getViewPlanResults(search);
  };

  const selectPlan = async (plan_index) => {
    if (plan_index) {
      targets = searchFilters?.targets?.find((target) => target[plan_index])[
        plan_index
      ];
      results = searchFilters?.results?.find((result) => result[plan_index])[
        plan_index
      ];
    }
  };

  const selectTarget = async (target) => {
    if (target) {
      assets = searchFilters?.assets
        .find((asset) => asset[search?.plan_index])
        [search?.plan_index][target].split(",")
        .map((host) => host.trim());

      checklist = searchFilters?.checklist
        .find((list) => list[search?.plan_index])
        [search?.plan_index][target].split(",")
        .map((data) => data.trim());
    } else {
      assets = null;
      checklist = null;
      search.hostname = "";
      search.checklist_item_no = "";
    }
  };

  $: {
    console.log("search:", search);
    console.log("resultData:", resultData);
  }
</script>

<body>
  <div class="container">
    <div class="firstLine">
      <div class="dropdown-group">
        <div class="dropdown-container">
          <label for="project">프로젝트:</label>
          <select
            id="project"
            bind:value={search["plan_index"]}
            on:change={(e) => selectPlan(e.target.value)}
          >
            <option value="" selected disabled>선택</option>
            {#if searchFilters?.plans && searchFilters?.plans?.length !== 0}
              {#each searchFilters?.plans as plan}
                <option value={plan.ccp_index}>{plan.ccp_title}</option>
              {/each}
            {/if}
          </select>
        </div>
        <div class="dropdown-container">
          <label for="target">점검대상:</label>
          <select
            id="target"
            bind:value={search["assessment_target"]}
            on:change={(e) => selectTarget(e.target.value)}
          >
            <option value="" selected>선택</option>
            {#if targets && targets.length !== 0}
              {#each targets as target}
                <option value={target}>{target}</option>
              {/each}
            {/if}
          </select>
        </div>
        <div class="dropdown-container">
          <label for="host">호스트:</label>
          <select id="host" bind:value={search["hostname"]}>
            <option value="" selected>선택</option>
            {#if assets && assets.length !== 0}
              {#each assets as asset}
                <option value={asset}>{asset}</option>
              {/each}
            {/if}
          </select>
        </div>
        <div class="dropdown-container">
          <label for="result">점검항목:</label>
          <select id="result" bind:value={search["checklist_item_no"]}>
            <option value="" selected>선택</option>
            {#if checklist && checklist.length !== 0}
              {#each checklist as check}
                <option value={check}>{check}</option>
              {/each}
            {/if}
          </select>
        </div>
        <div class="dropdown-container">
          <label for="result">점검결과:</label>
          <select id="result" bind:value={search["check_result"]}>
            <option value="" selected>선택</option>
            {#if results && results.length !== 0}
              {#each results as result}
                <option value={result?.ccr_item_result}
                  >{result?.ccr_item_result}</option
                >
              {/each}
            {/if}
          </select>
        </div>
        <div class="dropdown-container">
          <label for="viewOption">보기옵션:</label>
          <select id="viewOption">
            <option value="수리과터스트2">수리과터스트2</option>
          </select>
        </div>
      </div>
      <div class="button-group">
        <button class="firstlineButton" on:click={searchDataHandler}
          >조회하기</button
        >
        <button class="firstlineButton">보안점수확점</button>
      </div>
    </div>

    <div class="secondLine">
      <div>
        <p class="bold-text">프로젝트 전체 보안수준:</p>
        <p>{projectsData[0].name}</p>
      </div>
      <div>
        <p class="bold-text">결과미확정, 점검대상:</p>
        <p>{projectsData[0].inspectionTarget}</p>
      </div>
      <div>
        <p class="bold-text">점검일시:</p>
        <p>{projectsData[0].inspectionDateAndTime}</p>
      </div>
    </div>

    <div class="thirdLine">
      <p class="bold-text">
        Show <select><option value="">100</option></select> entries
      </p>
    </div>

    <div class="table_container">
      <table>
        <thead>
          <tr>
            <th style="width: 5%;">번호</th>
            <th style="width: 5%;">호스트명</th>
            <th style="width: 10%;">항목</th>
            <th style="width: 30%;">점검항목</th>
            <th style="width: 30%;">시스템상태</th>
            <th style="width: 5%;">점검결과</th>
            <th style="width: 10%;">결과변경</th>
          </tr>
        </thead>
        <tbody>
          {#if resultData && resultData?.length !== 0}
            {#each resultData as data, index}
              <tr>
                <td>{index + 1}</td>
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <td
                  style="cursor: pointer;"
                  on:click={() => (showModal = true)}
                >
                  {data?.ast_uuid__ass_uuid__ast_hostname}
                </td>
                <td>
                  [{data?.ccr_item_no__ccc_item_no}] {data?.ccr_item_no__ccc_item_title}
                </td>
                <td>
                  <div class="checklist">
                    <p>{data?.ccr_item_no__ccc_item_criteria}</p>
                  </div>
                </td>
                <td>
                  <p>
                    {data.ccr_item_status}
                  </p>
                </td>
                <td>
                  <span class={data.ccr_item_result}
                    >{data.ccr_item_result}</span
                  >
                </td>
                <td>
                  <select>
                    <option value="양호">양호</option>
                    <option value="해당">해당</option>
                  </select>
                  <button class="save_button">변경</button>
                </td>
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
    </div>
  </div>

  <div>
    <Modal bind:showModal>
      <ModalPage />
    </Modal>
  </div>
</body>

<style>
  body {
    display: flex;
    justify-content: center;
    background-color: #f4f4f4;
  }
  .table_container {
    overflow-y: auto;
    overflow-x: hidden;
    height: 500px;
    width: 100%;
  }
  .container {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 15px;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
  }

  .firstLine {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  .dropdown-group {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    align-items: center;
  }

  .dropdown-container {
    display: flex;
    flex-direction: row;
    gap: 5px;
    align-items: center;
    white-space: nowrap;
  }

  .dropdown-container label {
    font-weight: bold;
    margin: 0;
    font-size: 12px;
  }

  .firstlineButton {
    background-color: #0056b3;
    color: #ffffff;
    border: none;
    border-radius: 5px;
    padding: 8px 12px;
    font-size: 10px;
    font-weight: bold;
    cursor: pointer;
    transition:
      background-color 0.3s ease,
      transform 0.3s ease;
  }

  .firstlineButton:hover {
    background-color: #003366;
    transform: translateY(-2px);
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  }

  .secondLine {
    display: flex;
    align-items: center;
    padding: 10px;
    gap: 10px;
    background-color: #f4f4f4;
    border-radius: 5px;
  }

  .secondLine div {
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 12px;
    justify-content: center;
  }

  .bold-text {
    font-weight: bold;
    margin: 0;
  }
  .button-group {
    display: flex;
    flex-direction: row;
    gap: 5px;
  }

  .thirdLine {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-bottom: 10px;
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

  td {
    word-wrap: break-word;
    max-width: 150px;
    text-align: center;
  }

  tbody tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  tbody tr:hover {
    background-color: #e0f7fa;
  }

  .checklist p {
    margin: 0;
  }

  .save_button {
    background-color: #28a745;
    color: #ffffff;
    border: none;
    border-radius: 5px;
    padding: 5px 10px;
    font-size: 12px;
    cursor: pointer;
    transition:
      background-color 0.3s ease,
      transform 0.3s ease;
  }

  .save_button:hover {
    background-color: #247e39;
    transform: translateY(-2px);
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  }

  span.수동점검 {
    color: blue;
  }
  span.취약 {
    color: red;
  }
</style>
