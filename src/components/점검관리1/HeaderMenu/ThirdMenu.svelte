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

  let selectedPlan = "";
  let planList = [];
  let planReports = null;

  onMount(async () => {
    try {
      planList = await getPlanLists();
    } catch (err) {}
  });

  const getReportData = async () => {
    if (!selectedPlan) return;
    try {
      planReports = await getPlanReportLists(selectedPlan);
    } catch (err) {}
  };

  const setMakeFullReport = async (data) => {
    try {
      const response = await setMakeExcelWordFullReport(data);

      await successAlert(response.CODE);
    } catch (error) {
      errorAlert(error?.message);
    }
  };

  const planSummaryReportHandler = async () => {
    try {
      const response = await setPlanSummaryReportCreate(selectedPlan);
    } catch (error) {
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
  <!-- svelte-ignore a11y-click-events-have-key-events -->
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
          <th class="text-center" style="font-size: 16px;">보고서유형</th>
          <th class="pl-20 text-center" style="font-size: 16px;">보고서목록</th>
          <th class="text-center" style="font-size: 16px;">생성하기</th>
          <th class="text-center" style="font-size: 16px;">보고서삭제</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="text-center" style="font-size: 16px;"
            >취약점분석평가보고서(엑셀)</td
          >
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
              <button type="button" class="btn btnGray w140">보고서삭제</button>
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
          <th class="text-center" style="font-size: 16px;">보고서유형</th>
          <th class="pl-20 text-center" style="font-size: 16px;">보고서목록</th>
          <th class="text-center" style="font-size: 16px;">생성하기</th>
          <th class="text-center" style="font-size: 16px;">보고서삭제</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="text-center" style="font-size: 16px;"
            >취약점분석평가보고서(엑셀)</td
          >
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
              <button type="button" class="btn btnGray w140">
                보고서삭제
              </button>
            </div>
          </td>
        </tr>
        <tr>
          <td class="text-center" style="font-size: 16px;"
            >취약점분석평가보고서(워드)</td
          >
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
              <button type="button" class="btn btnGray w140">
                보고서삭제
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</article>

<style>
  * {
    font-size: 16px;
  }
</style>
