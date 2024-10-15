<script>
  import {
    getPlanReportLists,
    setMakeExcelWordFullReport,
    setPlanSummaryReportCreate,
  } from "./../../../services/report/reportService.js";
  import { getPlanLists } from "../../../services/page1/newInspection";
  import { onMount } from "svelte";
  import { errorAlert, successAlert } from "../../../shared/sweetAlert.js";

  export let projectIndex;

  let selectedPlan = null;
  let planList = [];
  let planReports = null;

  onMount(async () => {
    try {
      planList = await getPlanLists();
    } catch (err) {
      console.error("Error loading plan list:", err);
    }
  });

  const getReportData = async () => {
    if (!selectedPlan) return;
    try {
      planReports = await getPlanReportLists(selectedPlan);
    } catch (err) {
      console.error("Error loading report data:", err);
    }
  };

  const setMakeFullReport = async (data) => {
    try {
      const response = await setMakeExcelWordFullReport(data);

      await successAlert(response.CODE);
    } catch (error) {
      console.error("Error setMakeExcelWordFullReport :", error);
      errorAlert(error?.message);
    }
  };

  const planSummaryReportHandler = async () => {
    try {
      const response = await setPlanSummaryReportCreate(selectedPlan);
    } catch (error) {
      console.error("Error planSummaryReportHandler :", error);
      errorAlert(error?.message);
    }
  };

  $: {
    if (selectedPlan) {
      getReportData();
    }
  }

  $: {
    if (projectIndex) selectedPlan = projectIndex;
  }
</script>

<!-- <main>
  <div class="table_center">
    <div class="table_container">
      <div class="secondLine">
        <div class="thirdCol">
          <div class="first_line">
            <p class="button2 width">프로젝트명</p>
            <div class="row">
              <select class="dropdown" bind:value={selectedPlan}>
                <option value="" selected disabled>선택</option>
                {#if planList}
                  {#each planList as plan}
                    <option value={plan.ccp_index}>{plan.ccp_title}</option>
                  {/each}
                {/if}
              </select>
            </div>
          </div>
          <div class="first_line">
            <p
              class="button2 width"
              style="cursor: pointer;"
              on:click={() => {
                if (
                  planReports?.v_excel &&
                  planReports?.v_excel?.length !== 0
                ) {
                  planSummaryReportHandler();
                }
              }}
            >
              요약 보고서생성 (양식 향후 지정)
            </p>
            <div class="report-box">
              <div class="top">
                <h5 class="txt1">보고서유형</h5>
                <h5 class="txt2">보고서목록</h5>
                <div>
                  <h5>생성하기</h5>
                  <h5>보고서삭제</h5>
                </div>
              </div>
              <div class="bottom">
                <div>
                  <h5>취약점분석퍙기보고서 (엑셀)</h5>
                </div>
                <div>
                  {#if planReports?.v_excel && planReports?.v_excel?.length !== 0}
                    {#each planReports?.v_excel as report}
                      <h5>{report}</h5>
                    {/each}
                  {/if}
                </div>
                <div>
                  {#if planReports?.v_excel && planReports?.v_excel?.length !== 0}
                    <button
                      class="save_button"
                      disabled={!planReports?.v_excel?.length}
                      on:click={() =>
                        setMakeFullReport({
                          plan_index: selectedPlan,
                          report_type: "v_excel",
                          report_target: "ALL",
                        })}
                    >
                      보고서생성
                    </button>
                    <button
                      class="save_button"
                      disabled={!planReports?.v_excel?.length}
                    >
                      보고서삭제
                    </button>
                  {/if}
                </div>
              </div>
            </div>
          </div>
          <div class="first_line">
            <p class="button2 width">상세 보고서생성</p>
            <div class="report-box">
              <div class="top">
                <h5 class="txt1">보고서유형</h5>
                <h5 class="txt2">보고서목록</h5>
                <div>
                  <h5>생성하기</h5>
                  <h5>보고서삭제</h5>
                </div>
              </div>
              <div class="bottom">
                <div>
                  <h5>취약점분석퍙기보고서 (엑셀)</h5>
                </div>
                <div>
                  {#if planReports?.v_excel && planReports?.v_excel?.length !== 0}
                    {#each planReports?.v_excel as report}
                      <h5>{report}</h5>
                    {/each}
                  {/if}
                </div>
                <div>
                  {#if planReports?.v_excel && planReports?.v_excel?.length !== 0}
                    <button
                      class="save_button"
                      disabled={!planReports?.v_excel?.length}
                      on:click={() =>
                        setMakeFullReport({
                          plan_index: selectedPlan,
                          report_type: "v_excel",
                          report_target: "ALL",
                        })}
                    >
                      보고서생성
                    </button>
                    <button
                      class="save_button"
                      disabled={!planReports?.v_excel?.length}
                    >
                      보고서삭제
                    </button>
                  {/if}
                </div>
              </div>
              <div class="bottom word">
                <div>
                  <h5>파취약점분석퍙기보고서 (워드)</h5>
                </div>
                <div>
                  {#if planReports?.v_word && planReports?.v_word?.length !== 0}
                    {#each planReports?.v_word as report}
                      <h5>{report}</h5>
                    {/each}
                  {/if}
                </div>
                <div>
                  {#if planReports?.v_word && planReports?.v_word?.length !== 0}
                    <button
                      class="save_button"
                      disabled={!planReports?.v_word?.length}
                      on:click={() =>
                        setMakeFullReport({
                          plan_index: selectedPlan,
                          report_type: "v_word",
                          report_target: "ALL",
                        })}
                    >
                      보고서생성
                    </button>
                    <button
                      class="save_button"
                      disabled={!planReports?.v_word?.length}
                    >
                      보고서삭제
                    </button>
                  {/if}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</main> -->

<article class="flex contentArea projectTitle">
  <div class="flex">
    <div class="formControlWrap">
      <div class="formControl">
        <label>프로젝트명</label>
        <select bind:value={selectedPlan}>
          <option value="" selected disabled>선택</option>
          {#if planList}
            {#each planList as plan}
              <option value={plan.ccp_index}>{plan.ccp_title}</option>
            {/each}
          {/if}
        </select>
      </div>
    </div>
  </div>
</article>

<article class="contentArea mt-40">
  <h4
    class="title border"
    on:click={() => {
      if (planReports?.v_excel && planReports?.v_excel?.length !== 0) {
        planSummaryReportHandler();
      }
    }}
  >
    요약 보고서생성
  </h4>
  <div class="tableListWrap">
    <table class="tableList hdBorder">
      <colgroup>
        <col style="width:240px;" />
        <col />
        <col style="width:210px;" />
        <col style="width:210px;" />
      </colgroup>
      <thead>
        <tr>
          <th class="text-center">보고서유형</th>
          <th class="pl-20">보고서목록</th>
          <th class="text-center">생성하기</th>
          <th class="text-center">보고서삭제</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="text-center">취약점분석평가보고서(엑셀)</td>
          <td class="pl-20">
            <div class="flex excel">
              {#if planReports?.v_excel && planReports?.v_excel?.length !== 0}
                {#each planReports?.v_excel as report}
                  <a href="javascript:void(0);">
                    {report}
                  </a>
                {/each}
              {/if}
            </div>
          </td>
          <td class="text-center">
            <div class="flex justify-center">
              <button
                type="button"
                class="btn btnPrimary w140"
                disabled={!planReports?.v_excel?.length}
                on:click={() =>
                  setMakeFullReport({
                    plan_index: selectedPlan,
                    report_type: "v_excel",
                    report_target: "ALL",
                  })}
              >
                보고서생성
              </button>
            </div>
          </td>
          <td class="text-center">
            <div class="flex justify-center">
              <button
                type="button"
                class="btn btnGray w140"
                disabled={!planReports?.v_excel?.length}>보고서삭제</button
              >
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</article>

<article class="contentArea mt-40">
  <h4 class="title border">상세 보고서생성</h4>
  <div class="tableListWrap">
    <table class="tableList hdBorder">
      <colgroup>
        <col style="width:240px;" />
        <col />
        <col style="width:210px;" />
        <col style="width:210px;" />
      </colgroup>
      <thead>
        <tr>
          <th class="text-center">보고서유형</th>
          <th class="pl-20">보고서목록</th>
          <th class="text-center">생성하기</th>
          <th class="text-center">보고서삭제</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="text-center">취약점분석평가보고서(엑셀)</td>
          <td class="pl-20">
            <div class="flex excel">
              {#if planReports?.v_excel && planReports?.v_excel?.length !== 0}
                {#each planReports?.v_excel as report}
                  <a>
                    {report}
                  </a>
                {/each}
              {/if}
            </div>
          </td>
          <td class="text-center">
            <div class="flex justify-center">
              <button
                type="button"
                class="btn btnPrimary w140"
                on:click={() =>
                  setMakeFullReport({
                    plan_index: selectedPlan,
                    report_type: "v_excel",
                    report_target: "ALL",
                  })}
              >
                보고서생성
              </button>
            </div>
          </td>
          <td class="text-center">
            <div class="flex justify-center">
              <button
                type="button"
                class="btn btnGray w140"
                disabled={!planReports?.v_excel?.length}
              >
                보고서삭제
              </button>
            </div>
          </td>
        </tr>
        <tr>
          <td class="text-center">취약점분석평가보고서(워드)</td>
          <td class="pl-20">
            <div class="flex excel">
              {#if planReports?.v_word && planReports?.v_word?.length !== 0}
                {#each planReports?.v_word as report}
                  <a>{report}</a>
                {/each}
              {/if}
            </div>
          </td>
          <td class="text-center">
            <div class="flex justify-center">
              <button
                type="button"
                class="btn btnPrimary w140"
                on:click={() =>
                  setMakeFullReport({
                    plan_index: selectedPlan,
                    report_type: "v_word",
                    report_target: "ALL",
                  })}
              >
                보고서생성
              </button>
            </div>
          </td>
          <td class="text-center">
            <div class="flex justify-center">
              <button
                type="button"
                class="btn btnGray w140"
                disabled={!planReports?.v_word?.length}
              >
                보고서삭제
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</article>
