<script>
  import {
    getFixDoneLists,
    getVulnsOfAsset,
    getVulnsOfPlan,
    setFixApprove,
    setFixDoneApprove,
  } from "../../services/vulns/vulnsService";
  import { errorAlert, successAlert } from "../../shared/sweetAlert";

  export let tableData;
  export let vulnerabilityStatus;
  export let actionStatus;
  export let setView;
  export let wholePage;
  export let selectedSendData;
  export let showProject;
  export let targetData;
  export let wholeOption;

  let isAgenUser = false;

  let selectedItems = [];

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

  function transformVulns(vulns) {
    const transformed = [];

    for (const key in vulns) {
      let currentResult = null;
      let fixPlan = {};
      let fixResult = {};

      vulns[key].forEach((item) => {
        if (item.result) {
          currentResult = item?.result;
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
      const result = await setFixDoneApprove(data);
      successAlert(result);
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
      console.log("tableData:", tableData);
      data = transformVulns(tableData);
    }
  }
</script>

<main>
  <div class="second_line">
    <div>
      <button
        on:click={() => {
          setView = "plan";
          selectedItems = [];
        }}
        class={setView == "plan" ? "active" : ""}
      >
        조치계획
      </button>
      {#if isAgenUser}
        <button
          on:click={async () => {
            setView = "result";
            selectedItems = [];
            const data = await getFixDoneLists(selectedSendData);

            console.log("getFixDoneLists:", data);

            tableData = Object.fromEntries(
              Object.entries(data?.vulns).filter(([key, value]) =>
                value.some(
                  (item) =>
                    item.result && item.result.cfi_fix_status__cvs_index === 3,
                ),
              ),
            );
            console.log("tableData:", tableData);
          }}
          class={setView == "result" ? "active" : ""}
        >
          조치결과
        </button>
      {/if}
    </div>
    {#if isAgenUser && selectedSendData?.plan_index}
      {#if setView == "plan"}
        <div>
          <button
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
          <button
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
        </div>
      {/if}

      {#if setView == "result"}
        <div>
          <button
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
          <button
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
        </div>
      {/if}
    {/if}
  </div>

  <div class="main_container">
    <table>
      <tr class="first_line">
        <th></th>
        <th>순번</th>
        <th>자산명</th>
        <th>점검대상</th>
        <th>대분류</th>
        <th>취약점명</th>
        <th>위험도</th>
        <th>조치현황</th>
        <th>조치분류상태</th>
        <th>운영부서</th>
        <th>운영담당자 </th>
        {#if isAgenUser}
          <th>승인 </th>
        {/if}
      </tr>
      {#if data?.length !== 0}
        {#each data as item, index}
          {#if vulnerabilityStatus}
            {#if item.ccr_item_result == vulnerabilityStatus}
              <tr
                on:click={() => {
                  wholePage = true;
                  targetData = item;
                }}
              >
                <td>
                  <input
                    type="checkbox"
                    on:click={(e) => e.stopPropagation()}
                    on:change={() => toggleSelection(item?.ccr_index)}
                    checked={selectedItems.includes(item?.ccr_index)}
                  />
                </td>
                <td>{index + 1} </td>
                <td>{item.ast_uuid__ass_uuid__ast_hostname}</td>
                <td>{item?.cct_index__cct_target}</td>
                <td>{item.ccr_item_no__ccc_item_group}</td>
                <td>{item.ccr_item_no__ccc_item_title}</td>
                <td>{item.ccr_item_no__ccc_item_level}</td>
                <td>
                  {test[item?.cfi_fix_status__cvs_index] ?? "조치전"}
                </td>
                <td>
                  {item?.fix_result?.[0]?.cfr_fix_status__cvs_desc ?? "조치전"}
                </td>
                <td>{item.ast_uuid__ass_uuid__ast_operator_person}</td>
                <td>{item.ast_uuid__ass_uuid__ast_operator_phone}</td>
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                {#if isAgenUser}
                  <td
                    on:click={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <select
                      name=""
                      id=""
                      class="select_input"
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
            {/if}
          {:else}
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
              <td>
                <input
                  type="checkbox"
                  on:click={(e) => e.stopPropagation()}
                  on:change={() => toggleSelection(item?.ccr_index)}
                  checked={selectedItems.includes(item?.ccr_index)}
                />
              </td>
              <td>{index + 1}</td>
              <td>{item.ast_uuid__ass_uuid__ast_hostname}</td>
              <td>{item?.cct_index__cct_target}</td>
              <td>{item.ccr_item_no__ccc_item_group}</td>
              <td>{item.ccr_item_no__ccc_item_title}</td>
              <td>{item.ccr_item_no__ccc_item_level}</td>
              <td>
                {test[item?.cfi_fix_status__cvs_index] ?? "조치전"}
              </td>
              <td>
                {item?.fix_result?.[0]?.cfr_fix_status__cvs_desc ?? "조치전"}
              </td>
              <td>{item.ast_uuid__ass_uuid__ast_operator_person}</td>
              <td>{item.ast_uuid__ass_uuid__ast_operator_phone}</td>
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              {#if isAgenUser}
                <td
                  on:click={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <select
                    name=""
                    id=""
                    class="select_input"
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
          {/if}
        {/each}
      {/if}
    </table>
  </div>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    background-color: #f7f9fb;
    padding: 10px;
    margin-bottom: 40px;
    font-family: "Arial", sans-serif;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  .main_container {
    width: 100%;
    display: flex;
    flex-direction: column;
    height: 600px;
    overflow-y: auto;
    border-radius: 12px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    border: 1px solid #ddd;
    background-color: #fff;
  }

  table {
    font-family: "Arial", sans-serif;
    border-collapse: collapse;
    width: 100%;
    font-size: 14px;
    color: #333;
  }

  th,
  td {
    padding: 12px 15px;
    text-align: left;
    vertical-align: middle;
  }

  th {
    background-color: #005fa3;
    color: #ffffff;
    position: sticky;
    top: 0;
    z-index: 1;
    text-transform: uppercase;
    font-size: 13px;
  }

  td {
    border-bottom: 1px solid #ddd;
    font-size: 13px;
  }

  tr:nth-child(even) {
    background-color: #f5f5f5;
  }

  tr:hover {
    background-color: #e9f3ff;
  }

  .second_line {
    width: 100%;
    display: flex;
    justify-content: space-between;
    gap: 10px;
    margin: 20px 0;
    padding-left: 20px;
    box-sizing: border-box;
  }

  .second_line button {
    background-color: #0056b3;
    color: #ffffff;
    border-radius: 5px;
    height: 36px;
    width: 130px;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    transition:
      background-color 0.3s ease,
      transform 0.3s ease,
      box-shadow 0.3s ease;
  }

  .second_line button.active {
    background-color: rgb(225 143 45 / 62%);
  }

  .second_line button:hover {
    background-color: #005fa3;
    transform: translateY(-2px);
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }

  .select_input {
    padding: 8px 10px;
    color: #333;
    background-color: #f9f9f9;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 13px;
    cursor: pointer;
    transition:
      background-color 0.3s ease,
      border-color 0.3s ease;
  }

  .select_input:hover {
    background-color: #e0e0e0;
    border-color: #bbb;
  }

  .select_input:focus {
    outline: none;
    border-color: #0068d7;
    box-shadow: 0 0 4px rgba(0, 104, 215, 0.5);
  }
</style>
