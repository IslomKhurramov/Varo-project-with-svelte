<script>
  import { setFixApprove } from "../../services/vulns/vulnsService";
  import { errorAlert, successAlert } from "../../shared/sweetAlert";

  export let tableData;
  export let vulnerabilityStatus;
  export let actionStatus;
  export let setView;
  export let wholePage;
  export let selectedSendData;

  let data = [];

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
      console.log("fixApproveHandler:", data);

      const result = await setFixApprove(data);
      successAlert(result);
    } catch (err) {
      errorAlert(err?.message);
    }
  };

  $: {
    if (tableData) {
      data = transformVulns(tableData);
    }
  }
</script>

<main>
  <div class="second_line">
    <div>
      <button
        on:click={() => (setView = "plan")}
        class={setView == "plan" ? "active" : ""}
      >
        조치계획
      </button>
      <button
        on:click={() => (setView = "result")}
        class={setView == "result" ? "active" : ""}
      >
        조치결과
      </button>
    </div>
    <div>
      <button> 선택항목승인 </button>
      <button> 선택항목반려 </button>
      <button
        on:click={() => {
          const data = {
            plan_index: selectedSendData?.plan_index,
            asset_target_uuid: selectedSendData?.asset_target_uuid,
            approved: 1,
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
            approved: 0,
            approved_targets: "ALL",
            approved_comment: "",
          };
          fixApproveHandler(data);
        }}
      >
        일괄반려
      </button>
    </div>
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
        <th>조치분류상태 </th>
        <th>운영부서</th>
        <th>운영담당자 </th>
        <th>승인 </th>
      </tr>
      {#if data?.length !== 0}
        {#each data as item, index}
          {#if vulnerabilityStatus}
            {#if item.ccr_item_result == vulnerabilityStatus}
              <tr>
                <td>
                  <input type="checkbox" />
                </td>
                <td>{index + 1} </td>
                <td>{item.ast_uuid__ass_uuid__ast_hostname}</td>
                <td>{item?.cct_index__cct_target}</td>
                <td>{item.ccr_item_no__ccc_item_group}</td>
                <td>{item.ccr_item_no__ccc_item_title}</td>
                <td>{item.ccr_item_no__ccc_item_level}</td>
                <td>
                  {setView == "plan"
                    ? (item?.fix_plan?.[0]?.cfi_fix_method__cvf_desc ?? "-")
                    : (item?.fix_result?.[0]?.cfi_fix_method__cvf_desc ?? "-")}
                </td>
                <td>
                  {setView == "result"
                    ? (item?.fix_plan?.[0]?.cfi_fix_status__cvs_desc ?? "-")
                    : (item?.fix_result?.[0]?.cfr_fix_status__cvs_desc ?? "-")}
                </td>
                <td>{item.ast_uuid__ass_uuid__ast_operator_person}</td>
                <td>{item.ast_uuid__ass_uuid__ast_operator_phone}</td>
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <td
                  on:click={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <select name="" id="" class="select_input">
                    <option value="승인">승인</option>
                    <option value="반려">반려</option>
                  </select>
                </td>
              </tr>
            {/if}
          {:else}
            <tr on:click={() => (wholePage = true)}>
              <td>
                <input type="checkbox" />
              </td>
              <td>{index + 1}</td>
              <td>{item.ast_uuid__ass_uuid__ast_hostname}</td>
              <td>{item?.cct_index__cct_target}</td>
              <td>{item.ccr_item_no__ccc_item_group}</td>
              <td>{item.ccr_item_no__ccc_item_title}</td>
              <td>{item.ccr_item_no__ccc_item_level}</td>
              <td>
                {setView == "plan"
                  ? (item?.fix_plan?.[0]?.cfi_fix_method__cvf_desc ?? "-")
                  : (item?.fix_result?.[0]?.cfi_fix_method__cvf_desc ?? "-")}
              </td>
              <td>
                {setView == "result"
                  ? (item?.fix_plan?.[0]?.cfi_fix_status__cvs_desc ?? "-")
                  : (item?.fix_result?.[0]?.cfr_fix_status__cvs_desc ?? "-")}
              </td>
              <td>{item.ast_uuid__ass_uuid__ast_operator_person}</td>
              <td>{item.ast_uuid__ass_uuid__ast_operator_phone}</td>
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <td
                on:click={(e) => {
                  e.stopPropagation();
                }}
              >
                <select name="" id="" class="select_input">
                  <option value="승인">승인</option>
                  <option value="반려">반려</option>
                </select>
              </td>
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
