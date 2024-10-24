<script>
  export let showModal = false; // Controls modal visibility
  export let selectedItem = {}; // Data for the selected item

  function closeModal() {
    showModal = false; // Close the modal
  }
</script>

<div class="scrollModal" style="margin-top: 00px;">
  <table class="tableForm">
    <colgroup>
      <col style="width: 20%;" />
      <col style="width: 80%;" />
    </colgroup>
    <tbody>
      {#if Object.keys(selectedItem).length > 0}
        <tr>
          <th class="text-center">점검대상</th>
          <td>{selectedItem.ccp_index__ccp_title || "N/A"}</td>
        </tr>
        <tr>
          <th class="text-center">점검일</th>
          <td>{new Date(selectedItem.ccr_cdate).toLocaleString() || "N/A"}</td>
        </tr>
        <tr>
          <th class="text-center">항목번호</th>
          <td>{selectedItem.ccr_item_no__ccc_item_no || "N/A"}</td>
        </tr>
        <tr>
          <th class="text-center">항목그룹</th>
          <td
            ><pre
              class="preformatted-content">{selectedItem.ccr_item_no__ccc_item_group ||
                "N/A"}</pre></td
          >
        </tr>
        <tr>
          <th class="text-center">항목제목</th>
          <td
            ><pre
              class="preformatted-content">{selectedItem.ccr_item_no__ccc_item_title ||
                "N/A"}</pre></td
          >
        </tr>
        <tr>
          <th class="text-center">위험도</th>
          <td>{selectedItem.ccr_item_no__ccc_item_level || "N/A"}</td>
        </tr>
        <tr>
          <th class="text-center">점검결과</th>
          <td>{selectedItem.ccr_item_result || "N/A"}</td>
        </tr>
        <tr>
          <th class="text-center">상태</th>
          <td>{selectedItem.ccr_item_status || "N/A"}</td>
        </tr>
        <tr>
          <th class="text-center">평가기준</th>
          <td
            ><pre
              class="preformatted-content">{selectedItem.ccr_item_no__ccc_item_criteria ||
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

  .scrollModal {
    margin-top: 20px;
    width: 100%;
    height: 92%;
  }
  .tableForm {
    width: 100%;
    height: 100%;
    border-collapse: collapse;
  }
  .tableForm th,
  .tableForm td {
    padding: 10px;
    text-align: left;
    align-content: center;
  }

  th {
    background-color: #f7fafc;
  }
  .preformatted-content {
    white-space: pre-wrap; /* Preserve whitespace and wrap long text */
  }
</style>
