<script>
  import { onMount } from "svelte";
  import {
    getVulnsOfAsset,
    setFixApprove,
    setFixDoneApprove,
  } from "../../services/vulns/vulnsService";
  import { errorAlert, successAlert } from "../../shared/sweetAlert";
  import { userData } from "../../stores/user.store";
  import { decryptData } from "../../services/login/loginService";

  export let tableData;
  export let vulnerabilityStatusValue;
  export let actionStatusValue;
  export let setView;
  export let wholePage;
  export let selectedSendData;
  export let showProject;
  export let targetData;
  export let wholeOption;
  export let selectedItems = [];
  export let loading;
  export let search;
  export let currentPageNum;

  let theadChecked = false;
  let isAgenUser = ["1", "3", "5"].includes(
    decryptData($userData?.userInfo?.user_roletype_role_index),
  );
  // let isAgenUser = true;

  export let data = [];

  let test = {
    0: "조치전",
    1: "조치예정",
    2: "조치계획등록",
    3: "조치계획승인",
    4: "조치계획반려",
    5: "조치결과등록",
    6: "조치결과승은",
    7: "조치결과반려",
  };

  function transformVulns(vulns, vulnerabilityStatusValue, actionStatusValue) {
    const transformed = [];

    for (const key in vulns) {
      let currentResult = null;
      let fixPlan = {};
      let fixResult = {};

      vulns[key].forEach((item) => {
        if (item.result) {
          const result = item?.result;
          const statusMatch =
            !vulnerabilityStatusValue ||
            result.ccr_item_result === vulnerabilityStatusValue;
          let actionMatch;
          if (
            actionStatusValue == "5" ||
            actionStatusValue == "6" ||
            actionStatusValue == "7"
          ) {
            actionMatch =
              !actionStatusValue ||
              result.cfr_fix_status__cvs_index == actionStatusValue;
          } else {
            actionMatch =
              !actionStatusValue ||
              result.cfi_fix_status__cvs_index == actionStatusValue;
          }

          // const agentMatch = !filters.agentStatus || result.agent === filters.agentStatus;

          // If all conditions match, assign the result to currentResult
          if (statusMatch && actionMatch) {
            currentResult = result;
          }

          //   if (planMatch && statusMatch && actionMatch && agentMatch) {
          //   currentResult = result;
          // }
        } else {
          if (item.fix_plan) {
            fixPlan = item.fix_plan;
          }
          if (item.fix_result) {
            fixResult = item.fix_result;
          }
        }
      });

      if (currentResult) {
        transformed.push({
          ...currentResult,
          fix_plan: Object.keys(fixPlan).length > 0 ? fixPlan : {},
          fix_result: Object.keys(fixResult).length > 0 ? fixResult : {},
        });
      }
    }

    return transformed;
  }

  const fixApproveHandler = async (data) => {
    try {
      console.log("fixApproveHandler:", data);
      const result = await setFixApprove(data);
      await successAlert(result);

      const assets = await getVulnsOfAsset(search);
      tableData = assets?.vulns;
    } catch (err) {
      errorAlert(err?.message);
    }
  };

  const fixApproveAssetHandler = async (data, approved) => {
    try {
      console.log("fixApproveAssetHandler data:", data);
      console.log("fixApproveAssetHandler approved:", approved);
      const approved_targets = data.map((ele) => ele.ccr_index);
      console.log("fixApproveAssetHandler approved_targets:", approved_targets);
      const result = await setFixApprove({
        plan_index: data[0].ccp_index,
        asset_target_uuid: selectedSendData?.asset_target_uuid,
        approved: approved,
        approved_targets: approved_targets,
        approved_comment: "",
      });
      await successAlert(result);

      const assets = await getVulnsOfAsset(search);
      tableData = assets?.vulns;
    } catch (err) {
      errorAlert(err?.message);
    }
  };

  const fixDoneApproveHandler = async (data) => {
    try {
      console.log("fixDoneApproveHandler data:", data);
      const result = await setFixDoneApprove(data);
      successAlert(result);

      const list = await getVulnsOfAsset(search);
      tableData = list?.vulns;
    } catch (err) {
      errorAlert(err?.message);
    }
  };

  const fixDoneApproveAssetHandler = async (data, approved) => {
    try {
      const approved_targets = data.map((ele) => ele.ccr_index);
      console.log("fixDoneApproveAssetHandler data:", data);
      console.log("fixDoneApproveAssetHandler approved:", approved);
      console.log(
        "fixDoneApproveAssetHandler approved_targets:",
        approved_targets,
      );
      const result = await setFixDoneApprove({
        plan_index: data[0].ccp_index,
        asset_target_uuid: selectedSendData?.asset_target_uuid,
        approved: approved,
        approved_targets: approved_targets,
        approved_comment: "",
      });
      successAlert(result);

      const list = await getVulnsOfAsset(search);
      tableData = list?.vulns;
    } catch (err) {
      errorAlert(err?.message);
    }
  };

  function toggleSelection(item) {
    const index = selectedItems.indexOf(item);
    if (index === -1) {
      selectedItems = [...selectedItems, item];
    } else {
      selectedItems = selectedItems.filter((i) => i !== item);
    }
  }

  let itemsPerPage = 15;
  let totalPages = 0;

  $: {
    if (data) {
      totalPages = Math.ceil(data.length / itemsPerPage);
    }
  }

  $: paginatedDatas = data?.slice(
    (currentPageNum - 1) * itemsPerPage,
    currentPageNum * itemsPerPage,
  );

  $: pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  function goToPage(page) {
    if (page >= 1 && page <= totalPages) {
      currentPageNum = page;
    }
  }

  $: baseIndex = data?.length - (currentPageNum - 1) * itemsPerPage;

  $: {
    console.log("+selectedSendData:", selectedSendData);
    console.log("+setView:", setView);
    console.log("+selectedItems:", selectedItems);
  }
</script>

<section class="content">
  <div style=" overflow: auto;">
    <!-- 자산상세 -->
    <div class="section">
      <!-- 탭메뉴 -->
      <div class="flex justify-between submenuWrap">
        <section class="subTabWrap" style="height: 50px;">
          <a
            href="javascript:void(0);"
            class={setView == "plan" ? "active" : ""}
            on:click={async () => {
              try {
                loading = true;
                currentPageNum = 1;
                setView = "plan";
                selectedItems = [];
                theadChecked = false;
                search.step_vuln = "1";

                const data = await getVulnsOfAsset(search);
                tableData = data?.vulns;
                loading = false;
              } catch (err) {
                errorAlert(err?.message);
                loading = false;
              }
            }}
          >
            조치계획
          </a>
          <a
            href="javascript:void(0);"
            class={setView == "plan_accept" ? "active" : ""}
            on:click={async () => {
              try {
                loading = true;
                currentPageNum = 1;
                setView = "plan_accept";
                selectedItems = [];
                theadChecked = false;

                search.step_vuln = "2";

                const data = await getVulnsOfAsset(search);
                tableData = data?.vulns;
                loading = false;
              } catch (err) {
                errorAlert(err?.message);
                loading = false;
              }
            }}
          >
            조치계획승인
          </a>
          {#if isAgenUser}
            <a
              href="javascript:void(0);"
              class={setView == "result" ? "active" : ""}
              on:click={async () => {
                try {
                  loading = true;
                  currentPageNum = 1;
                  setView = "result";
                  selectedItems = [];
                  theadChecked = false;

                  search.step_vuln = "3";

                  const data = await getVulnsOfAsset(search);
                  tableData = data?.vulns;
                  loading = false;
                } catch (err) {
                  errorAlert(err?.message);
                  loading = false;
                }
              }}
            >
              조치결과
            </a>
            <a
              href="javascript:void(0);"
              class={setView == "result_accept" ? "active" : ""}
              on:click={async () => {
                try {
                  loading = true;
                  currentPageNum = 1;
                  setView = "result_accept";
                  selectedItems = [];
                  theadChecked = false;

                  search.step_vuln = "4";

                  const data = await getVulnsOfAsset(search);
                  tableData = data?.vulns;
                  loading = false;
                } catch (err) {
                  errorAlert(err?.message);
                  loading = false;
                }
              }}
            >
              조치결과승인
            </a>
          {/if}
        </section>
        {#if isAgenUser && selectedSendData?.plan_index && data?.length !== 0}
          {#if setView == "plan_accept"}
            <section class="flex btnWrap gap-4">
              {#if selectedItems?.length !== 0}
                <button
                  type="button"
                  class="btn btnBlue"
                  on:click={() => {
                    const data = {
                      plan_index: selectedSendData?.plan_index,
                      asset_target_uuid: selectedSendData?.asset_target_uuid,
                      approved: "1",
                      approved_targets: selectedItems,
                      approved_comment: "",
                    };
                    fixApproveHandler(data);
                    selectedItems = [];
                    theadChecked = false;
                  }}
                >
                  선택항목승인
                </button>
                <button
                  type="button"
                  class="btn btnBlue"
                  on:click={() => {
                    const data = {
                      plan_index: selectedSendData?.plan_index,
                      asset_target_uuid: selectedSendData?.asset_target_uuid,
                      approved: "0",
                      approved_targets: selectedItems,
                      approved_comment: "",
                    };
                    fixApproveHandler(data);
                    selectedItems = [];
                    theadChecked = false;
                  }}
                >
                  선택항목반려
                </button>
              {/if}

              {#if selectedSendData?.plan_index}
                <button
                  class="btn btnBlue"
                  on:click={() => {
                    const data = {
                      plan_index: selectedSendData?.plan_index,
                      asset_target_uuid: selectedSendData?.asset_target_uuid,
                      approved: "1",
                      approved_targets: "ALL",
                      approved_comment: "",
                    };
                    fixApproveHandler(data);
                  }}
                >
                  일괄승인
                </button>
                <button
                  type="button"
                  class="btn btnBlue"
                  on:click={() => {
                    const data = {
                      plan_index: selectedSendData?.plan_index,
                      asset_target_uuid: selectedSendData?.asset_target_uuid,
                      approved: "0",
                      approved_targets: "ALL",
                      approved_comment: "",
                    };
                    fixApproveHandler(data);
                  }}
                >
                  일괄반려
                </button>
              {/if}
            </section>
          {/if}

          {#if setView == "result_accept"}
            <section class="flex btnWrap gap-4">
              {#if selectedItems?.length !== 0}
                <button
                  class="btn btnBlue"
                  on:click={() => {
                    const data = {
                      plan_index: selectedSendData?.plan_index,
                      asset_target_uuid: selectedSendData?.asset_target_uuid,
                      approved: "1",
                      approved_targets: selectedItems,
                      approved_comment: "",
                    };
                    fixDoneApproveHandler(data);
                    selectedItems = [];
                    theadChecked = false;
                  }}
                >
                  선택항목승인
                </button>
                <button
                  class="btn btnBlue"
                  on:click={() => {
                    const data = {
                      plan_index: selectedSendData?.plan_index,
                      asset_target_uuid: selectedSendData?.asset_target_uuid,
                      approved: "0",
                      approved_targets: selectedItems,
                      approved_comment: "",
                    };
                    fixDoneApproveHandler(data);
                    selectedItems = [];
                    theadChecked = false;
                  }}
                >
                  선택항목반려
                </button>
              {/if}

              {#if selectedSendData?.plan_index}
                <button
                  type="button"
                  class="btn btnBlue"
                  on:click={() => {
                    const data = {
                      plan_index: selectedSendData?.plan_index,
                      asset_target_uuid: selectedSendData?.asset_target_uuid,
                      approved: "1",
                      approved_targets: "ALL",
                      approved_comment: "",
                    };
                    fixDoneApproveHandler(data);
                  }}
                >
                  일괄승인
                </button>
                <button
                  type="button"
                  class="btn btnBlue"
                  on:click={() => {
                    const data = {
                      plan_index: selectedSendData?.plan_index,
                      asset_target_uuid: selectedSendData?.asset_target_uuid,
                      approved: "0",
                      approved_targets: "ALL",
                      approved_comment: "",
                    };
                    fixDoneApproveHandler(data);
                  }}
                >
                  일괄반려
                </button>
              {/if}
            </section>
          {/if}
        {/if}

        {#if isAgenUser && !selectedSendData?.plan_index && selectedSendData?.asset_target_uuid && data?.length !== 0}
          {#if setView == "plan_accept"}
            <section class="flex btnWrap gap-4">
              {#if selectedItems?.length !== 0}
                <button
                  type="button"
                  class="btn btnBlue"
                  on:click={() => {
                    fixApproveHandler({
                      plan_index: data[0].ccp_index,
                      asset_target_uuid: selectedSendData?.asset_target_uuid,
                      approved: "1",
                      approved_targets: selectedItems,
                      approved_comment: "",
                    });
                    selectedItems = [];
                    theadChecked = false;
                  }}
                >
                  선택항목승인
                </button>
                <button
                  type="button"
                  class="btn btnBlue"
                  on:click={() => {
                    fixApproveHandler({
                      plan_index: data[0].ccp_index,
                      asset_target_uuid: selectedSendData?.asset_target_uuid,
                      approved: "0",
                      approved_targets: selectedItems,
                      approved_comment: "",
                    });
                    selectedItems = [];
                    theadChecked = false;
                  }}
                >
                  선택항목반려
                </button>
              {/if}

              {#if !selectedSendData?.plan_index && selectedSendData?.asset_target_uuid}
                <button
                  class="btn btnBlue"
                  on:click={() => {
                    fixApproveAssetHandler(data, "1");
                  }}
                >
                  일괄승인
                </button>
                <button
                  type="button"
                  class="btn btnBlue"
                  on:click={() => {
                    fixApproveAssetHandler(data, "0");
                  }}
                >
                  일괄반려
                </button>
              {/if}
            </section>
          {/if}

          {#if setView == "result_accept"}
            <section class="flex btnWrap gap-4">
              {#if selectedItems?.length !== 0}
                <button
                  class="btn btnBlue"
                  on:click={() => {
                    fixDoneApproveHandler({
                      plan_index: data[0].ccp_index,
                      asset_target_uuid: selectedSendData?.asset_target_uuid,
                      approved: "1",
                      approved_targets: selectedItems,
                      approved_comment: "",
                    });
                    selectedItems = [];
                    theadChecked = false;
                  }}
                >
                  선택항목승인
                </button>
                <button
                  class="btn btnBlue"
                  on:click={() => {
                    fixDoneApproveHandler({
                      plan_index: data[0].ccp_index,
                      asset_target_uuid: selectedSendData?.asset_target_uuid,
                      approved: "0",
                      approved_targets: selectedItems,
                      approved_comment: "",
                    });
                    selectedItems = [];
                    theadChecked = false;
                  }}
                >
                  선택항목반려
                </button>
              {/if}

              {#if !selectedSendData?.plan_index && selectedSendData?.asset_target_uuid}
                <button
                  type="button"
                  class="btn btnBlue"
                  on:click={() => {
                    fixDoneApproveAssetHandler(data, "1");
                  }}
                >
                  일괄승인
                </button>
                <button
                  type="button"
                  class="btn btnBlue"
                  on:click={() => {
                    fixDoneApproveAssetHandler(data, "0");
                  }}
                >
                  일괄반려
                </button>
              {/if}
            </section>
          {/if}
        {/if}
      </div>

      <!-- 테이블리스트 -->
      <div class="flex col detail">
        <div
          class="tableListWrap nofirstth"
          style="    height: calc(-361px + 100vh);overflow: scroll;overflow-x: hidden;"
        >
          <table class="tableList hdBorder">
            <colgroup>
              {#if isAgenUser && selectedSendData?.plan_index && (setView == "plan_accept" || setView == "result_accept")}
                <col style="width:33px;" />
              {/if}
              {#if isAgenUser && !selectedSendData?.plan_index && selectedSendData?.asset_target_uuid && (setView == "plan_accept" || setView == "result_accept")}
                <col style="width:33px;" />
              {/if}
              <col style="width:90px;" />
              <col style="width:100px;" />
              <col style="width:91px;" />
              <col style="width:100px;" />
              <col style="width:160px;" />
              <col style="width:50px;" />
              <col style="width:80px;" />
              <col style="width:80px;" />
              <col style="width:70px;" />
              <col style="width:100px;" />
              {#if isAgenUser}
                <col style="width:90px;" />
              {/if}
            </colgroup>
            <thead>
              <tr>
                {#if isAgenUser && selectedSendData?.plan_index && (setView == "plan_accept" || setView == "result_accept")}
                  <th class="text-center">
                    <div class="checkboxWrap">
                      <label class="checkbox-label">
                        <input
                          type="checkbox"
                          name="target"
                          bind:checked={theadChecked}
                          on:change={(e) => {
                            if (e.target.checked)
                              selectedItems = data?.map(
                                (ele) => ele?.ccr_index,
                              );
                            else selectedItems = [];
                          }}
                        />
                        <span></span>
                      </label>
                    </div>
                  </th>
                {/if}

                {#if isAgenUser && !selectedSendData?.plan_index && selectedSendData?.asset_target_uuid && (setView == "plan_accept" || setView == "result_accept")}
                  <th class="text-center">
                    <div class="checkboxWrap">
                      <label class="checkbox-label">
                        <input
                          type="checkbox"
                          name="target"
                          bind:checked={theadChecked}
                          on:change={(e) => {
                            if (e.target.checked)
                              selectedItems = data?.map(
                                (ele) => ele?.ccr_index,
                              );
                            else selectedItems = [];
                          }}
                        />
                        <span></span>
                      </label>
                    </div>
                  </th>
                {/if}

                <th class="text-center">순번</th>
                <th class="text-center">자산명</th>
                <th class="text-center">점검대상</th>
                <th class="text-center">대분류</th>
                <th class="text-center">취약점명</th>
                <th class="text-center">위험도</th>
                <th class="text-center">조치현황</th>
                <th class="text-center">조치분류상태</th>
                <th class="text-center">운영담당자</th>
                <th class="text-center">담당자연락처</th>
                {#if isAgenUser}
                  <th class="text-center"> 승인 </th>
                {/if}
              </tr>
            </thead>
            <tbody>
              {#if paginatedDatas?.length !== 0}
                {#each paginatedDatas as item, index}
                  <tr
                    on:click={() => {
                      wholePage = true;
                      targetData = item;
                      if (setView == "plan") {
                        wholeOption = "plan";
                      } else {
                        wholeOption = "result";
                      }
                      search.plan_index = item?.ccp_index;
                    }}
                  >
                    {#if isAgenUser && selectedSendData?.plan_index && (setView == "plan_accept" || setView == "result_accept")}
                      <!-- svelte-ignore a11y-click-events-have-key-events -->
                      <td
                        class="text-center"
                        on:click={(e) => e.stopPropagation()}
                      >
                        <div class="checkboxWrap">
                          <label class="checkbox-label">
                            <input
                              type="checkbox"
                              name="target"
                              on:click={(e) => e.stopPropagation()}
                              on:change={() => toggleSelection(item?.ccr_index)}
                              checked={selectedItems.includes(item?.ccr_index)}
                            />
                            <span></span>
                          </label>
                        </div>
                      </td>
                    {/if}

                    {#if isAgenUser && !selectedSendData?.plan_index && selectedSendData?.asset_target_uuid && (setView == "plan_accept" || setView == "result_accept")}
                      <!-- svelte-ignore a11y-click-events-have-key-events -->
                      <td
                        class="text-center"
                        on:click={(e) => e.stopPropagation()}
                      >
                        <div class="checkboxWrap">
                          <label class="checkbox-label">
                            <input
                              type="checkbox"
                              name="target"
                              on:click={(e) => e.stopPropagation()}
                              on:change={() => toggleSelection(item?.ccr_index)}
                              checked={selectedItems.includes(item?.ccr_index)}
                            />
                            <span></span>
                          </label>
                        </div>
                      </td>
                    {/if}

                    <td class="text-center">{baseIndex - index}</td>
                    <td class="text-center">
                      {item.ast_uuid__ass_uuid__ast_hostname}
                    </td>
                    <td class="text-center">{item?.cct_index__cct_target}</td>
                    <td class="text-center cursor-pointer">
                      {item.ccr_item_no__ccc_item_group}
                    </td>
                    <td>{item.ccr_item_no__ccc_item_title}</td>
                    <td class="text-center"
                      >{item.ccr_item_no__ccc_item_level}</td
                    >
                    <td class="text-center"
                      >{test[item?.cfi_fix_status__cvs_index] ?? "조치전"}</td
                    >
                    <td class="text-center"
                      >{test[item?.cfr_fix_status__cvs_index] ?? "조치전"}</td
                    >
                    <td class="text-center"
                      >{item.ast_uuid__ass_uuid__ast_operator_person}</td
                    >
                    <td class="text-center">
                      {item.ast_uuid__ass_uuid__ast_operator_phone}
                    </td>
                    {#if isAgenUser}
                      <!-- svelte-ignore a11y-click-events-have-key-events -->
                      <td
                        class="text-center"
                        on:click={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <select
                          style="font-size: 16px; width:70px"
                          class="xs"
                          on:change={(e) => {
                            if (setView == "plan" || setView == "plan_accept") {
                              const data = {
                                plan_index: item?.ccp_index,
                                asset_target_uuid: item?.ast_uuid,
                                approved: e.target.value == "승인" ? "1" : "0",
                                approved_targets: [item?.ccr_index],
                                approved_comment: e.target.value,
                              };

                              fixApproveHandler(data);
                              selectedItems = [];
                              theadChecked = false;
                            } else {
                              const data = {
                                plan_index: item?.ccp_index,
                                asset_target_uuid: item?.ast_uuid,
                                approved: e.target.value == "승인" ? "1" : "0",
                                approved_targets: [item?.ccr_index],
                                approved_comment: e.target.value,
                              };

                              fixDoneApproveHandler(data);
                              selectedItems = [];
                              theadChecked = false;
                            }
                          }}
                        >
                          <option
                            value="없음"
                            selected={setView == "plan" ||
                            setView == "plan_accept"
                              ? item?.cfi_fix_status__cvs_index != 3 ||
                                item?.cfi_fix_status__cvs_index != 4
                              : item?.cfr_fix_status__cvs_index != 3 ||
                                item?.cfr_fix_status__cvs_index != 4}
                          >
                          </option>
                          <option
                            value="승인"
                            selected={setView == "plan" ||
                            setView == "plan_accept"
                              ? item?.cfi_fix_status__cvs_index == 3 ||
                                item?.cfi_fix_status__cvs_index == 4
                              : item?.cfr_fix_status__cvs_index == 3 ||
                                item?.cfr_fix_status__cvs_index == 4}
                          >
                            승인
                          </option>
                          <option
                            value="반려"
                            selected={setView == "plan"
                              ? item?.cfi_fix_status__cvs_index == 4 ||
                                item?.cfi_fix_status__cvs_index == 7
                              : item?.cfi_fix_status__cvs_index == 4 ||
                                item?.cfr_fix_status__cvs_index == 7}
                          >
                            반려
                          </option>
                        </select>
                      </td>
                    {/if}
                  </tr>
                {/each}
              {/if}
            </tbody>
          </table>
        </div>
        <div class="pagination_box">
          <nav class="pagination">
            <!-- Previous button -->
            <button
              on:click={() => goToPage(currentPageNum - 1)}
              disabled={currentPageNum === 1}
            >
              &lsaquo;
            </button>

            <!-- First page -->
            {#if totalPages > 0}
              <button
                class={1 === currentPageNum ? "selected" : ""}
                on:click={() => goToPage(1)}
              >
                1
              </button>
            {/if}

            <!-- Left ellipsis -->
            {#if currentPageNum > 4}
              <button class="dots" disabled>...</button>
            {/if}

            <!-- Pages around current page -->
            {#each pageNumbers.filter((num) => {
              const offset = 2; // Show 2 pages before and after current page
              return num !== 1 && num !== totalPages && num >= currentPageNum - offset && num <= currentPageNum + offset;
            }) as pageNum}
              <button
                class={pageNum === currentPageNum ? "selected" : ""}
                on:click={() => goToPage(pageNum)}
              >
                {pageNum}
              </button>
            {/each}

            <!-- Right ellipsis -->
            {#if currentPageNum < totalPages - 3}
              <button class="dots" disabled>...</button>
            {/if}

            <!-- Last page -->
            {#if totalPages > 1}
              <button
                class={totalPages === currentPageNum ? "selected" : ""}
                on:click={() => goToPage(totalPages)}
              >
                {totalPages}
              </button>
            {/if}

            <!-- Next button -->
            <button
              on:click={() => goToPage(currentPageNum + 1)}
              disabled={currentPageNum === totalPages}
            >
              &rsaquo;
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  * {
    font-size: 16px;
  }
  tr:hover {
    cursor: pointer;
    background-color: #f4f4f4;
    transition-duration: 0.3s;
  }
  thead {
    position: sticky; /* Make the header sticky */
    top: 0; /* Stick the header to the top */
    z-index: 10; /* Ensure the header is above the scrolling content */
    box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.4); /* Shadow effect for separation */
  }
  table td,
  th {
    font-size: 16px;
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    background-color: #fff;
  }

  .pagination button {
    border: none !important;
    padding: 8px 12px;
    margin: 0 4px;
    cursor: pointer;
    border-radius: 5px;
  }

  .pagination button.selected {
    background-color: #007bff;
    color: #fff;
  }

  .pagination button[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .pagination button:hover:not([disabled]) {
    background-color: #d4d4d4;
  }
</style>
