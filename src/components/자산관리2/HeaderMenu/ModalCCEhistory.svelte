<script>
  export let showModal = false; // Controls modal visibility
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
</div>

<style>
  /* Add your styles here */

  .line-height {
    line-height: 23px;
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
    width: 15px;
  }
  .preformatted-content {
    white-space: pre-wrap; /* Preserve whitespace and wrap long text */
  }
  .modal {
    background-color: #ffffff;
    padding: 20px;
    border-radius: 10px;
    /* box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); */
    max-width: 100%;
    margin: 20px auto;
    font-family: Arial, sans-serif;
  }
</style>
