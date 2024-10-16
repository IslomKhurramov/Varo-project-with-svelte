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

  export let projectIndex;

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

  let change_option = "ONE";

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

    selectPlan(projectIndex);
  };

  const refetchDataHandler = async () => {
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

    search.hostname = "";
    search.checklist_item_no = "";
    refetchDataHandler();
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
      change_option = "ONE";
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

  $: {
    if (projectIndex && !fullResultData) {
      search = { ...search, plan_index: projectIndex };
      searchDataHandler();
    }
  }
</script>

<!-- <body>
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
          <select
            id="host"
            bind:value={search["hostname"]}
            on:change={refetchDataHandler}
          >
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
          <select
            id="result"
            bind:value={search["checklist_item_no"]}
            on:change={refetchDataHandler}
          >
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
          <select
            id="result"
            bind:value={search["check_result"]}
            on:change={refetchDataHandler}
          >
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
      </div>
      <div class="button-group">
        <button
          class="firstlineButton"
          disabled={!search?.plan_index || !resultData}
          on:click={() => clickSecyurityPoint(search?.plan_index)}
        >
          보안점수확점
        </button>
      </div>
    </div>

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
                <td style="text-align: center;">
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
                        change_option: change_option,
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
                  <select
                    on:change={(e) => {
                      change_option = e.target.value;
                    }}
                  >
                    <option value="ONE"> 해당 </option>
                    <option value="ALL"> 전체 </option>
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
</body> -->

<article class="contentArea">
  <section class="filterWrap">
    <div>
      <select
        bind:value={search["plan_index"]}
        on:change={(e) => selectPlan(e.target.value)}
      >
        <option value="" selected disabled>프로젝트</option>
        {#if searchFilters?.plans && searchFilters?.plans?.length !== 0}
          {#each searchFilters?.plans as plan}
            <option value={plan.ccp_index}>{plan.ccp_title}</option>
          {/each}
        {/if}
      </select>
      <select
        bind:value={search["assessment_target"]}
        on:change={(e) => selectTarget(e.target.value)}
      >
        <option value="" selected>점검대상</option>
        {#if targets && targets.length !== 0}
          {#each targets as target}
            <option value={target}>{target}</option>
          {/each}
        {/if}
      </select>

      <select bind:value={search["hostname"]} on:change={refetchDataHandler}>
        <option value="" selected>호스트</option>
        {#if assets && assets.length !== 0}
          {#each assets as asset}
            <option value={asset}>{asset}</option>
          {/each}
        {/if}
      </select>
      <select
        id="result"
        bind:value={search["checklist_item_no"]}
        on:change={refetchDataHandler}
      >
        <option value="" selected>점검항목</option>
        {#if checklist && checklist.length !== 0}
          {#each checklist as check}
            <option value={check}>{check}</option>
          {/each}
        {/if}
      </select>
      <select
        bind:value={search["check_result"]}
        on:change={refetchDataHandler}
      >
        <option value="" selected>점검결과</option>
        {#if results && results.length !== 0}
          {#each results as result}
            <option value={result?.ccr_item_result}
              >{result?.ccr_item_result}</option
            >
          {/each}
        {/if}
      </select>
      <!-- <button type="button" class="btn btnPrimary">
        <img src="./assets/images/icon/search.svg" />
        조회
      </button> -->
      <button
        type="button"
        class={`btn ${!search?.plan_index || !resultData ? "btnPrimary" : "btnBlue"}`}
        disabled={!search?.plan_index || !resultData}
        on:click={() => clickSecyurityPoint(search?.plan_index)}
      >
        보안점수확정
      </button>
    </div>
  </section>
  <section class="flex totalSecurityLevel">
    <h4>프로젝트 전체 보안수준</h4>
    <ul class="flex">
      <li class="flex">
        <h6 class="name">보안수준</h6>
        <b>75%</b>
        <div class="badge badgeRedW">결과 미확정</div>
      </li>
      <li class="flex">
        <h6 class="name">점검대상</h6>
        <b>( NETWORKS: 1대 WINDOWS: 1대 )</b>
      </li>
      <li class="flex">
        <h6 class="name">점검시작일시</h6>
        <b>2024년 7월 10일 6:38 오전</b>
      </li>
    </ul>
  </section>
  <section class="tableWrap">
    <div class="tableListWrap">
      <table class="tableList hdBorder">
        <colgroup>
          <col style="width:90px;" />
          <col style="width:110px;" />
          <col style="width:200px;" />
          <col />
          <col style="width:90px;" />
          <col style="width:200px;" />
        </colgroup>
        <thead>
          <tr>
            <th class="text-center">번호</th>
            <th class="text-center">호스트명</th>
            <th>항목</th>
            <th>점검항목</th>
            <th>시스템상태</th>
            <th class="text-center">점검결과</th>
            <th>결과변경</th>
          </tr>
        </thead>
        <tbody>
          {#if resultData && resultData?.length !== 0}
            {#each resultData as data, index}
              <tr>
                <td class="text-center">{index + 1}</td>
                <td
                  on:click={() => {
                    modalData = { ...data };
                    showModal = true;
                  }}
                  class="cursor-pointer"
                >
                  {data?.ast_uuid__ass_uuid__ast_hostname}
                </td>
                <td>
                  [{data?.ccr_item_no__ccc_item_no}] {data?.ccr_item_no__ccc_item_title}
                </td>
                <td onclick="modalOpen('detail')" class="cursor-pointer">
                  <div>{@html data?.ccr_item_no__ccc_item_criteria}</div>
                </td>
                <td> {@html data.ccr_item_status}</td>
                <td class="text-center">
                  <span class="badge badgePrimary">
                    {data.ccr_item_result}
                  </span>
                </td>
                <td>
                  <div class="flex gap-4">
                    <select
                      class="xs"
                      on:change={(e) =>
                        changeItemResult({
                          plan_index: search.plan_index,
                          result_index: data?.ccr_index,
                          checklist_index: data?.ccr_item_no__ccc_index,
                          change_result: e.target.value,
                          change_option: change_option,
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
                    <select
                      class="xs"
                      on:change={(e) => {
                        change_option = e.target.value;
                      }}
                    >
                      <option value="ONE"> 해당 </option>
                      <option value="ALL"> 전체 </option>
                    </select>
                    <!-- <button type="button" class="btn btnBlue xs">변경</button> -->
                  </div>
                </td>
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
    </div>
    <div class="paginationWrap end">
      <div class="pagination">
        <!-- <a href="">&lt;</a> -->
        <a href="" class="active">1</a>
        <a href="">2</a>
        <a href="">...</a>
        <a href="">4</a>
        <a href="">&gt;</a>
      </div>
    </div>
  </section>
</article>

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
