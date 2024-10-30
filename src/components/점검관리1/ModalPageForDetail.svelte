<script>
  export let showModal;
  export let modalData;
</script>

<div class="modal">
  <div style="height: 930px;overflow: scroll;overflow-x: hidden;">
    <table>
      <tr style="height: 50px; position: sticky;top: -1px;">
        <th class="center-align" style="color: white;background: #0072fd;"
          >구분</th
        >
        <td class="center-align" style="color: white;background: #0072fd;"
          >설명</td
        >
      </tr>
      <tr>
        <th class="center-align">점검항목</th>
        <td class="line-height"
          >[{modalData?.ccr_item_no__ccc_item_no}] {modalData?.ccr_item_no__ccc_item_title}</td
        >
      </tr>
      <!-- <tr>
        <th class="center-align">점검대상</th>
        <td class="line-height">
          {modalData?.ccr_item_no__ccc_target_system}
        </td>
      </tr> -->
      <tr>
        <th class="center-align">항목그룹</th>
        <td class="line-height">{modalData?.ccr_item_no__ccc_item_group}</td>
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
        <th class="center-align">점검결과</th>
        <td class="lineCol">
          <div>
            <span class="line-height">
              {modalData?.ccr_item_result}
            </span>
          </div>
        </td>
      </tr>
      <tr>
        <th class="center-align">점검현황</th>
        <td
          style="display: flex; height: 100px; overflow-y: auto; flex-direction: column;"
          class="line-height"
          >{@html modalData?.ccr_item_status.replace(/\n/g, "<br/>")}</td
        >
      </tr>

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
    <div style="display: flex; justify-content: flex-end;">
      <button class="btn modify-btn" on:click={() => (showModal = false)}
        >Close</button
      >
    </div>
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
    /* height: 93%;
    overflow: auto; */
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
