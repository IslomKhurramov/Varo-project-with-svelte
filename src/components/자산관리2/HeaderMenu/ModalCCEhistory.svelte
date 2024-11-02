<script>
  export let showItemDetail; // Controls modal visibility
  export let selectedItem = {}; // Data for the selected item

  function closeModal() {
    showModal = false; // Close the modal
  }
</script>

<div class="modal">
  <table>
    <colgroup>
      <col style="width: 20%;" />
      <col style="width: 80%;" />
    </colgroup>
    <tbody>
      <tr style="height: 50px; position: sticky;top: -1px;">
        <th class="center-align" style="color: white;background: #0072fd;"
          >구분</th
        >
        <td class="center-align" style="color: white;background: #0072fd;"
          >설명</td
        >
      </tr>
      {#if Object.keys(selectedItem).length > 0}
        <tr>
          <th class="text-center">점검대상</th>
          <td class="line-height"
            >{selectedItem.ccp_index__ccp_title || "N/A"}</td
          >
        </tr>
        <tr>
          <th class="text-center">점검일</th>
          <td class="line-height"
            >{new Date(selectedItem.ccr_cdate).toLocaleString() || "N/A"}</td
          >
        </tr>
        <tr>
          <th class="text-center">항목번호</th>
          <td class="line-height"
            >{selectedItem.ccr_item_no__ccc_item_no || "N/A"}</td
          >
        </tr>
        <tr>
          <th class="text-center">항목그룹</th>
          <td
            ><pre
              class="preformatted-content line-height">{selectedItem.ccr_item_no__ccc_item_group ||
                "N/A"}</pre></td
          >
        </tr>
        <tr>
          <th class="text-center">항목제목</th>
          <td
            ><pre
              class="preformatted-content line-height">{selectedItem.ccr_item_no__ccc_item_title ||
                "N/A"}</pre></td
          >
        </tr>
        <tr>
          <th class="text-center">위험도</th>
          <td class="line-height"
            >{selectedItem.ccr_item_no__ccc_item_level || "N/A"}</td
          >
        </tr>
        <tr>
          <th class="text-center">점검결과</th>
          <td class="line-height">{selectedItem.ccr_item_result || "N/A"}</td>
        </tr>
        <tr>
          <th class="text-center">상태</th>
          <td class="line-height">{selectedItem.ccr_item_status || "N/A"}</td>
        </tr>
        <tr>
          <th class="text-center">평가기준</th>
          <td
            ><pre
              class="preformatted-content line-height">{selectedItem.ccr_item_no__ccc_item_criteria ||
                "N/A"}</pre></td
          >
        </tr>
      {:else}
        <tr>
          <td colspan="2">No data available</td>
        </tr>
      {/if}
    </tbody>
  </table>
  <div style="display: flex; justify-content: space-between">
    <button class="btn modify-btn" on:click={() => (showItemDetail = false)}
      >Close</button
    >
  </div>
</div>

<style>
  /* Add your styles here */

  .line-height {
    line-height: 23px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 16px;
    margin-bottom: 20px;
  }
  .modify-btn {
    background-color: #4caf50; /* Green background for modify button */
    color: white; /* White text */
  }

  .modify-btn:hover {
    background-color: #45a049; /* Darker green on hover */
    transform: translateY(-2px); /* Lift effect on hover */
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
    width: 15px;
  }
  .preformatted-content {
    white-space: pre-wrap; /* Preserve whitespace and wrap long text */
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
</style>
