<script>
  import { onMount } from "svelte";
  import Modal from "../../../shared/Modal.svelte";
  import ModalPage from "../ModalPage.svelte";
  import {
    getViewPlanResults,
    getViewPlanResultSearch,
    setFinalPlanSecurityPoint,
    setResultChanged,
    setSpecificItemResultsChange,
  } from "../../../services/result/resultService";
  import { errorAlert, successAlert } from "../../../shared/sweetAlert";

  let showModal = false;
  let insertData = {};

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
      searchDataHandler();
      successAlert(result);
      showModal = false;
      modalData = null;
    } catch (err) {
      console.error("Error changeItemResult:", err);
      alert(err?.message);
    }
  };

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
  let fullResultData;
  let resultData;
  let modalData;

  onMount(async () => {
    searchFilters = await getViewPlanResultSearch();
  });

  const searchDataHandler = async () => {
    fullResultData = await getViewPlanResults(search);
    changeDataCount(100);
  };

  const selectPlan = async (plan_index) => {
    search.assessment_target = "";
    search.hostname = "";
    search.checklist_item_no = "";
    search.check_result = "";
    search.show_option = "";

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

  const changeDataCount = (count) => {
    if (count == 0) {
      resultData = fullResultData;
    } else {
      resultData = fullResultData.slice(0, parseInt(count));
    }
  };

  const changeItemResult = async (data) => {
    try {
      await setResultChanged(data);
      searchDataHandler();
    } catch (err) {
      console.error("Error changeItemResult:", err);
    }
  };

  const clickSecyurityPoint = async (plan_index) => {
    try {
      if (!plan_index) return false;
      const response = await setFinalPlanSecurityPoint(plan_index);
      successAlert(response);
      searchDataHandler();
    } catch (err) {
      console.error("Error changeItemResult:", err);
      errorAlert(err?.message);
    }
  };
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
        <!-- <div class="dropdown-container">
          <label for="viewOption">보기옵션:</label>
          <select id="viewOption">
            <option value="수리과터스트2">수리과터스트2</option>
          </select>
        </div> -->
      </div>
      <div class="button-group">
        <button class="firstlineButton" on:click={searchDataHandler}>
          조회하기
        </button>
        <button
          class="firstlineButton"
          disabled={!search?.plan_index || !resultData}
          on:click={() => clickSecyurityPoint(search?.plan_index)}
        >
          보안점수확점
        </button>
      </div>
    </div>

    <!-- <div class="secondLine">
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
    </div> -->

    <div class="thirdLine">
      <p class="bold-text">
        Show <select on:change={(e) => changeDataCount(e.target.value)}>
          <option value="100"> 100 </option>
          <option value="200"> 200 </option>
          <option value="300"> 300 </option>
          <option value="400"> 400 </option>
          <option value="500"> 500 </option>
          <option value="0"> 전체 </option>
        </select> entries
      </p>
    </div>

    <div class="table_container">
      <table>
        <thead>
          <tr>
            <th style="width: 1%;">번호</th>
            <th style="width: 5%;">호스트명</th>
            <th style="width: 10%;">항목</th>
            <th style="width: 30%;">점검항목</th>
            <th style="width: 15%;">점검대상</th>
            <th style="width: 15%;">시스템상태</th>
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
                  on:click={() => {
                    modalData = { ...data };
                    showModal = true;
                  }}
                >
                  {data?.ast_uuid__ass_uuid__ast_hostname}
                </td>
                <td>
                  [{data?.ccr_item_no__ccc_item_no}] {data?.ccr_item_no__ccc_item_title}
                </td>
                <td>
                  <div class="checklist">
                    <p>{@html data?.ccr_item_no__ccc_item_criteria}</p>
                  </div>
                </td>
                <td>
                  <p>
                    {data.ccr_item_no__ccc_target_system}
                  </p>
                </td>
                <td>
                  <p>
                    {@html data.ccr_item_status}
                  </p>
                </td>
                <td>
                  <span class={data.ccr_item_result}
                    >{data.ccr_item_result}</span
                  >
                </td>
                <td>
                  <select
                    on:change={(e) =>
                      changeItemResult({
                        plan_index: search.plan_index,
                        result_index: data?.ccr_index,
                        checklist_index: data?.ccr_item_no__ccc_index,
                        change_result: e.target.value,
                        change_option: "ONE",
                      })}
                  >
                    <option
                      value=""
                      disabled
                      selected={data?.ccr_item_result === ""}
                    >
                      없음
                    </option>
                    <option
                      value="양호"
                      selected={data?.ccr_item_result === "양호"}
                    >
                      양호
                    </option>
                    <option
                      value="취약"
                      selected={data?.ccr_item_result === "취약"}
                    >
                      취약
                    </option>
                    <option
                      value="예외처리"
                      selected={data?.ccr_item_result === "예외처리"}
                    >
                      예외처리
                    </option>
                    <option
                      value="해당없음"
                      selected={data?.ccr_item_result === "해당없음"}
                    >
                      해당없음
                    </option>
                  </select>
                </td>
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
    </div>
  </div>

  <div>
    {#if showModal}
      <Modal bind:showModal bind:insertData>
        <ModalPage
          bind:modalData
          bind:insertData
          planIndex={search?.plan_index}
          {changeDataHandler}
        />
      </Modal>
    {/if}
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
    height: auto;
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

  button:disabled {
    background-color: #838383;
  }
</style>
