<script>
  import { onMount } from "svelte";
  import {
    getFixDoneLists,
    getVulnsOfAsset,
    getVulnsOfPlan,
    setFixApprove,
    setFixDoneApprove,
  } from "../../services/vulns/vulnsService";
  import { errorAlert, successAlert } from "../../shared/sweetAlert";
  import { userData } from "../../stores/user.store";

  export let tableData;
  export let vulnerabilityStatusValue;
  export let actionStatusValue;
  export let setView;
  export let wholePage;
  export let selectedSendData;
  export let showProject;
  export let targetData;
  export let wholeOption;
  export let search;
  export let selectedItems = [];

  // let isAgenUser = $userData?.userInfo?.user_roletype__role_index == 1;
  let isAgenUser = true;

  let data = [];

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

      if (showProject) {
        const plans = await getVulnsOfPlan(selectedSendData);
        tableData = plans?.vulns;
      } else {
        const assets = await getVulnsOfAsset(selectedSendData);
        tableData = assets?.vulns;
      }
    } catch (err) {
      errorAlert(err?.message);
    }
  };

  const fixDoneApproveHandler = async (data) => {
    try {
      console.log("fixDoneApproveHandler:", data);
      const result = await setFixDoneApprove(data);
      successAlert(result);

      const list = await getFixDoneLists(selectedSendData);
      tableData = Object.fromEntries(
        Object.entries(list?.vulns).filter(([key, value]) =>
          value.some(
            (item) =>
              item.result && item.result.cfi_fix_status__cvs_index === 3,
          ),
        ),
      );
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

  $: {
    if (tableData) {
      data = transformVulns(
        tableData,
        vulnerabilityStatusValue,
        actionStatusValue,
      );
    }
  }

  $: {
    console.log("search:", search);
    console.log("selectedSendData:", selectedSendData);
  }
</script>

<section class="content" style="height: 90%;">
  <div style=" overflow: auto;">
    <!-- 자산상세 -->
    <div class="section">
      <!-- 탭메뉴 -->
      <div class="flex justify-between submenuWrap">
        <section class="subTabWrap">
          <a
            href="javascript:void(0);"
            class={setView == "plan" ? "active" : ""}
            on:click={async () => {
              setView = "plan";
              selectedItems = [];

              if (showProject) {
                const data = await getVulnsOfPlan();
                tableData = data?.vulns;
              } else {
                const data = await getVulnsOfAsset();
                tableData = data?.vulns;
              }
            }}
          >
            조치계획
          </a>
          {#if isAgenUser}
            <a
              href="javascript:void(0);"
              class={setView == "result" ? "active" : ""}
              on:click={async () => {
                setView = "result";
                selectedItems = [];
                const data = await getFixDoneLists(selectedSendData);

                tableData = Object.fromEntries(
                  Object.entries(data?.vulns).filter(([key, value]) =>
                    value.some(
                      (item) =>
                        item.result &&
                        item.result.cfi_fix_status__cvs_index === 3,
                    ),
                  ),
                );
              }}
            >
              조치결과
            </a>
          {/if}
        </section>
        {#if isAgenUser && selectedSendData?.plan_index && data?.length !== 0}
          {#if setView == "plan"}
            <section class="flex btnWrap gap-4">
              {#if selectedItems?.length !== 0}
                <button
                  type="button"
                  class="btn btnBlue xs"
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
                  }}
                >
                  선택항목승인
                </button>
                <button
                  type="button"
                  class="btn btnBlue xs"
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
                  }}
                >
                  선택항목반려
                </button>
              {/if}

              {#if selectedSendData?.plan_index}
                <button
                  class="btn btnBlue xs"
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
                  class="btn btnBlue xs"
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

          {#if setView == "result"}
            <section class="flex btnWrap gap-4">
              {#if selectedItems?.length !== 0}
                <button
                  class="btn btnBlue xs"
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
                  }}
                >
                  선택항목승인
                </button>
                <button
                  class="btn btnBlue xs"
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
                  }}
                >
                  선택항목반려
                </button>
              {/if}

              {#if selectedSendData?.plan_index}
                <button
                  type="button"
                  class="btn btnBlue xs"
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
                  class="btn btnBlue xs"
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
      </div>

      <!-- 테이블리스트 -->
      <div class="flex col detail">
        <div class="tableListWrap nofirstth">
          <table class="tableList hdBorder">
            <colgroup>
              {#if isAgenUser && selectedSendData?.plan_index}
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
                <col style="width:50px;" />
              {/if}
            </colgroup>
            <thead>
              <tr>
                {#if isAgenUser && selectedSendData?.plan_index}
                  <th class="text-center">
                    <div class="checkboxWrap">
                      <label class="checkbox-label">
                        <input
                          type="checkbox"
                          name="target"
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
                <th>취약점명</th>
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
              {#if data?.length !== 0}
                {#each data as item, index}
                  <tr
                    on:click={() => {
                      wholePage = true;
                      targetData = item;
                      if (setView == "plan") {
                        wholeOption = "plan";
                      } else {
                        wholeOption = "result";
                      }
                    }}
                  >
                    {#if isAgenUser && selectedSendData?.plan_index}
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

                    <td class="text-center">{index + 1}</td>
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
                      >{item?.fix_result?.[0]?.cfr_fix_status__cvs_desc ??
                        "조치전"}</td
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
                          style="font-size: 16px;"
                          class="xs"
                          on:change={(e) => {
                            if (setView == "plan") {
                              const data = {
                                plan_index: item?.ccp_index,
                                asset_target_uuid: item?.ast_uuid,
                                approved: e.target.value == "승인" ? "1" : "0",
                                approved_targets: [item?.ccr_index],
                                approved_comment: e.target.value,
                              };

                              fixApproveHandler(data);
                              selectedItems = [];
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
                            }
                          }}
                        >
                          <option
                            value="없음"
                            selected={setView == "plan"
                              ? item?.cfi_fix_status__cvs_index != 3 ||
                                item?.cfi_fix_status__cvs_index != 4
                              : item?.cfi_fix_status__cvs_index != 3 ||
                                item?.cfr_fix_status__cvs_index != 4}
                          >
                            없음
                          </option>
                          <option
                            value="승인"
                            selected={setView == "plan"
                              ? item?.cfi_fix_status__cvs_index == 3 ||
                                item?.cfi_fix_status__cvs_index == 4
                              : item?.cfi_fix_status__cvs_index == 3 ||
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

  table td,
  th {
    font-size: 16px;
  }
</style>
