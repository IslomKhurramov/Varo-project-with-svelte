<script>
  import { setSpecificItemResultsChange } from "../../services/result/resultService";

  export let showModal;
  export let modalData;
  export let planIndex;
  export let insertData;
  export let changeDataHandler;

  let change_option = "ONE";
  if (modalData) {
    insertData.change_status_text = modalData.ccr_item_status || "";
  }
</script>

<div class="modal">
  <table>
    <tr>
      <th class="center-align">점검항목</th>
      <td class="line-height"
        >[{modalData?.ccr_item_no__ccc_item_no}] {modalData?.ccr_item_no__ccc_item_title}</td
      >
    </tr>
    <tr>
      <th class="center-align">점검대상</th>
      <td class="line-height">
        {modalData?.ccr_item_no__ccc_target_system}
      </td>
    </tr>
    <tr>
      <th class="center-align">항목그룹</th>
      <td class="line-height"
        >[{modalData?.ast_uuid__ast_target__cct_target}] {modalData?.ccr_item_no__ccc_item_group}</td
      >
    </tr>
    <tr>
      <th class="center-align">위험도</th>
      <td class="line-height">{modalData?.ccr_item_no__ccc_item_level}</td>
    </tr>
    <tr>
      <th class="center-align">점검기준</th>
      <td class="lineCol">
        <div class="line-height">
          <span class="line-height">
            {@html modalData?.ccr_item_no__ccc_item_criteria}
          </span>
        </div>
      </td>
    </tr>
    <tr>
      <th class="center-align">점검내용</th>
      <td class="lineCol">
        <div>
          <span class="line-height">
            {modalData?.ccr_item_no__ccc_check_content}
          </span>
        </div>
      </td>
    </tr>
    <tr>
      <th class="center-align">점검목적</th>
      <td class="lineCol">
        <div>
          <span class="line-height">
            {modalData?.ccr_item_no__ccc_check_purpose}
          </span>
        </div>
      </td>
    </tr>
    <tr>
      <th class="center-align">보안위협</th>
      <td class="lineCol">
        <div>
          <span class="line-height">
            {modalData?.ccr_item_no__ccc_security_threat}
          </span>
        </div>
      </td>
    </tr>
    <tr>
      <th class="center-align">영향도</th>
      <td class="lineCol">
        <div>
          <span class="line-height">
            {modalData?.ccr_item_no__ccc_impact}
          </span>
        </div>
      </td>
    </tr>

    <tr>
      <th class="center-align">점검결과수정</th>
      <td class="line5">
        <div class="line5">
          <p>점검결과:</p>
          <select
            style="font-size: 16px;"
            value={modalData?.ccr_item_result}
            on:change={(e) => (insertData.change_result = e.target.value)}
          >
            <option value="" disabled style="font-size: 16px;"> 없음 </option>
            <option
              style="font-size: 16px;"
              value="양호"
              selected={modalData?.ccr_item_result === "양호"}
            >
              양호
            </option>
            <option
              style="font-size: 16px;"
              value="취약"
              selected={modalData?.ccr_item_result === "취약"}
            >
              취약
            </option>
            <option
              style="font-size: 16px;"
              value="예외처리"
              selected={modalData?.ccr_item_result === "예외처리"}
            >
              예외처리
            </option>
            <option
              style="font-size: 16px;"
              value="해당없음"
              selected={modalData?.ccr_item_result === "해당없음"}
            >
              해당없음
            </option>
          </select>
        </div>
        <div class="line5">
          <p>수정범위:</p>
          <select
            style="font-size: 16px;"
            on:change={(e) => {
              change_option = e.target.value;
            }}
          >
            <option value="ONE" style="font-size: 16px;">해당항목만</option>
            <option value="ALL" style="font-size: 16px;">전체항목</option>
          </select>
        </div>
        <p>(점검현황/점검결과 적용됨)</p>
      </td>
    </tr>
    <tr>
      <th class="center-align">점검현황</th>
      <td>
        <textarea
          class="line-height"
          name=""
          id=""
          rows="5"
          cols="50"
          style="width: 100%;"
          bind:value={insertData["change_status_text"]}
        ></textarea>
      </td>
    </tr>
    {#if modalData?.evidence_file?.length !== 0 && modalData?.evidence_file[0]?.ccs_image}
      <tr>
        <th class="center-align">증적이미지</th>
        <td class="line7">
          <div
            style="    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 223px;"
          >
            [{modalData?.evidence_file?.length !== 0 &&
              modalData?.evidence_file[0]?.ccs_image}]:
          </div>
          <input
            type="file"
            on:change={(e) =>
              (insertData.change_evidence_file = e.target.files[0])}
          />
        </td>
      </tr>
    {/if}

    <tr>
      <th class="center-align">개선방법</th>
      <td class="line-height"
        >{modalData?.ccr_item_no__ccc_mitigation_method}</td
      >
    </tr>
    <tr>
      <th class="center-align">개선예시</th>
      <td
        style="display: flex; height: 100px; overflow-y: auto; flex-direction: column;"
        class="line-height"
        >{@html modalData?.ccr_item_no__ccc_mitigation_example.replace(
          /\n/g,
          "<br/>",
        )}</td
      >
    </tr>
  </table>
  <div style="display: flex; justify-content: space-between">
    <button class="btn modify-btn" on:click={() => (showModal = false)}
      >Close</button
    >
    <button
      class="modify-button"
      style="float: right;"
      disabled={Object.keys(insertData).length === 0}
      on:click={() => {
        changeDataHandler({
          plan_index: planIndex,
          result_index: modalData?.ccr_index,
          checklist_index: modalData?.ccr_item_no__ccc_index,
          change_result:
            insertData?.change_result ?? modalData?.ccr_item_result,
          change_option: change_option,
          change_status_text: insertData?.change_status_text,
          change_evidence_file: insertData?.change_evidence_file,
        });
        change_option = "ONE";
      }}
    >
      저장하기
    </button>
  </div>
</div>

<style>
  * {
    font-size: 16px;
  }
  .modify-btn {
    background-color: #4caf50; /* Green background for modify button */
    color: white; /* White text */
  }

  .modify-btn:hover {
    background-color: #45a049; /* Darker green on hover */
    transform: translateY(-2px); /* Lift effect on hover */
  }
  .modal {
    background-color: #ffffff;
    padding: 20px;
    border-radius: 10px;
    height: 93%;
    overflow: auto;
    /* box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); */
    /* max-width: 800px;
    margin: 20px auto; */
    font-family: Arial, sans-serif;
  }

  .first_header {
    display: flex;
    gap: 15px;
    font-size: 12px;
    margin-bottom: 15px;
  }

  .modify-button {
    background-color: #007bff;
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 12px;
    transition:
      background-color 0.3s ease,
      transform 0.3s ease;
  }

  .modify-button:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
    margin-bottom: 20px;
  }

  th,
  td {
    border: 1px solid #ddd;
    padding: 12px 15px;
    text-align: left;
    vertical-align: middle;
  }

  th {
    background-color: #f7fafc;
    font-weight: bold;
    color: #000000;
    width: 160px;
  }

  .lineCol {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .line5,
  .line7 {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .line5 select {
    height: 30px;
    /* padding:0 5px; */
    border-radius: 4px;
    border: 1px solid #ccc;
    font-size: 14px;
  }

  .line7 input[type="file"] {
    border: 1px solid #ccc;
    padding: 5px;
    border-radius: 5px;
  }

  button:disabled {
    background-color: #838383;
  }

  .center-align {
    text-align: center;
  }

  .line-height {
    line-height: 23px;
  }
</style>
